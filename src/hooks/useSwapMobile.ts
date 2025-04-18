import {
  VITE_APP_URL,
  VITE_CHAIN_CLUSTER,
  VITE_TARGET_MINT,
  VITE_WALLET_WEBHOOK,
} from '@/env/env';
import { useEffect, useMemo, useState } from 'react';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { useDebounce } from 'use-debounce';

import useBoundStore from '@/store/store';
import { decryptPayload, encryptPayload } from '@/utils/crypto';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { useGetBuyAmount, useGetTokenName } from '@/api/pumpfun';
import errorHandler from '@/utils/error';
import { PumpfunMobileCaller } from '@/utils/PumpfunMobile';
import { SLIPPAGE_BASIS_POINTS } from '@/utils/pumpfun';
import { ISwap } from '@/interface/swap';

const useSwapMobile = (): ISwap => {
  const nonce = useBoundStore.use.nonce();
  const data = useBoundStore.use.data();
  // const sharedSecret = useBoundStore.use.sharedSecret();
  const encryptPubKey = useBoundStore.use.encryptPubKey();
  const walletStatus = useBoundStore.use.walletStatus();
  const setSession = useBoundStore.use.setSession();
  const setSharedSecret = useBoundStore.use.setSharedSecret();
  const setPublicKey = useBoundStore.use.setPublicKey();
  const setKeypair = useBoundStore.use.setKeypair();
  const setWalletStatus = useBoundStore.use.setWalletStatus();
  const walletPublicKey = useBoundStore.use.walletPublicKey();
  const keypair = useBoundStore.use.keypair();
  const session = useBoundStore.use.session();
  const sharedSecret = useBoundStore.use.sharedSecret();
  const setErrorToast = useBoundStore.use.setErrorToast();
  const resetErrorToast = useBoundStore.use.resetErrorToast();

  const [pumpfunCaller, setPumpfunCaller] = useState<PumpfunMobileCaller>();
  const [inputVal, setInputVal] = useDebounce<number>(0, 800);

  const [targetMint] = useState(new PublicKey(VITE_TARGET_MINT));

  useEffect(() => {
    const connection = new Connection(
      'https://mainnet.helius-rpc.com/?api-key=5eafd528-fef7-4ec4-a952-1a5bf3fa460e',
    );
    const dummyWallet = {
      publicKey: walletPublicKey!,
      signTransaction: async transaction => {
        // Dummy signTransaction function
        return transaction;
      },
      signAllTransactions: async transactions => {
        // Dummy signAllTransactions function
        return transactions;
      },
    } as Wallet;
    const provider = new AnchorProvider(connection, dummyWallet, {
      commitment: 'finalized',
    });
    const caller = new PumpfunMobileCaller(provider);
    setPumpfunCaller(caller);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data: tokenName,
    error: tokenNameError,
    isSuccess: tokenNameIsSuccess,
    isError: tokenNameIsError,
  } = useGetTokenName(targetMint.toString(), pumpfunCaller, {
    enabled: pumpfunCaller && inputVal > 0,
  });

  const {
    data: buyAmount,
    error: buyAmountError,
    isSuccess: buyAmountIsSuccess,
    isError: buyAmountIsError,
  } = useGetBuyAmount(targetMint, inputVal, pumpfunCaller, {
    enabled: pumpfunCaller && inputVal > 0,
  });

  const appPublicKey = useMemo(
    () => new Uint8Array(Object.values(keypair?.publicKey || {})),
    [keypair],
  );
  const appSecretKey = useMemo(
    () => new Uint8Array(Object.values(keypair?.secretKey || {})),
    [keypair],
  );
  const roundedBuyAmount = useMemo(() => {
    if (buyAmount) {
      return Math.round(Number(buyAmount) / 1_000_000);
    }

    return;
  }, [buyAmount]);

  useEffect(() => {
    setKeypair(nacl.box.keyPair());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (buyAmountIsSuccess) {
      resetErrorToast();
    }
    if (buyAmountIsError) {
      errorHandler({
        error: buyAmountError,
        axiosErrorHandlerFn: errMsg => {
          setErrorToast({ isOpen: true, message: errMsg || '' });
        },
        generalErrorHandlerFn: err => {
          setErrorToast({ isOpen: true, message: err.message || '' });
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pumpfunCaller, buyAmountError, buyAmountIsError, buyAmountIsSuccess]);

  useEffect(() => {
    if (tokenNameIsSuccess) {
      resetErrorToast();
    }
    if (tokenNameIsError) {
      errorHandler({
        error: tokenNameError,
        axiosErrorHandlerFn: errMsg => {
          setErrorToast({ isOpen: true, message: errMsg || '' });
        },
        generalErrorHandlerFn: err => {
          setErrorToast({ isOpen: true, message: err.message || '' });
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pumpfunCaller, tokenNameError, tokenNameIsError, tokenNameIsSuccess]);

  useEffect(() => {
    if (walletStatus == 'connected') {
      const appSharedSecret = nacl.box.before(
        bs58.decode(encryptPubKey),
        appSecretKey,
      );

      const connectedData = decryptPayload(data, nonce, appSharedSecret);
      setSession(connectedData.session);
      setSharedSecret(appSharedSecret);
      setPublicKey(new PublicKey(connectedData.public_key));
    }

    if (walletStatus == 'disconnected') {
      setWalletStatus('pending');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce, data, encryptPubKey, walletStatus]);

  const connect = async () => {
    const params = new URLSearchParams({
      cluster: VITE_CHAIN_CLUSTER,
      app_url: VITE_APP_URL,
      dapp_encryption_public_key: bs58.encode(appPublicKey),
      redirect_link: `${VITE_WALLET_WEBHOOK}/wallets/onConnect`,
    });

    const url = `https://phantom.app/ul/v1/connect?${params.toString()}`;
    window.Telegram.WebApp.openLink(url);
  };

  const disconnect = async () => {
    const payload = {
      session,
    };

    const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret!);
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(appPublicKey),
      nonce: bs58.encode(nonce),
      redirect_link: `${VITE_WALLET_WEBHOOK}/wallets/onDisconnect`,
      payload: bs58.encode(encryptedPayload),
    });
    const url = `https://phantom.app/ul/v1/disconnect?${params.toString()}`;
    window.Telegram.WebApp.openLink(url);
  };

  const signAndSendTransaction = async () => {
    if (!walletPublicKey) return;

    const tx = await pumpfunCaller?.buy(
      walletPublicKey,
      targetMint,
      BigInt(inputVal * LAMPORTS_PER_SOL),
      SLIPPAGE_BASIS_POINTS,
      {
        unitLimit: 250000,
        unitPrice: 250000,
      },
    );

    if (tx) {
      tx.recentBlockhash = await pumpfunCaller?.getRecentBlockhash();
      tx.feePayer = walletPublicKey;
    }

    const serializedTransaction = tx?.serialize({
      requireAllSignatures: false,
    });

    const payload = {
      session,
      transaction: bs58.encode(serializedTransaction || []),
    };

    const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret!);
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(appPublicKey),
      nonce: bs58.encode(nonce),
      redirect_link: `${VITE_WALLET_WEBHOOK}/wallets/signTransaction`,
      payload: bs58.encode(encryptedPayload),
    });
    const url = `https://phantom.app/ul/v1/signAndSendTransaction?${params.toString()}`;

    window.Telegram.WebApp.openLink(url);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setInputVal(value * LAMPORTS_PER_SOL);
  };

  return {
    tokenName,
    roundedBuyAmount,
    walletStatus,
    walletPublicKey,
    connect,
    disconnect,
    signAndSendTransaction,
    onChange,
  };
};

export default useSwapMobile;

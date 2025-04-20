import { useGetBuyAmount, useGetTokenName } from '@/api/pumpfun';
import { VITE_TARGET_MINT } from '@/env/env';
import { ISwap } from '@/interface/swap';
import useBoundStore from '@/store/store';
import errorHandler from '@/utils/error';
import { SLIPPAGE_BASIS_POINTS } from '@/utils/pumpfun';
import { PumpfunDesktopCaller } from '@/utils/PumpfunDesktop';
import { AnchorProvider } from '@coral-xyz/anchor';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { PhantomWalletName } from '@solana/wallet-adapter-wallets';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

const useSwapDesktop = (): ISwap => {
  const { connect, disconnect, connected, signTransaction, select } =
    useWallet();
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();

  const [targetMint] = useState(new PublicKey(VITE_TARGET_MINT));
  const [pumpfunCaller, setPumpfunCaller] = useState<PumpfunDesktopCaller>();
  const [inputVal, setInputVal] = useDebounce<number>(0, 800);

  const setErrorToast = useBoundStore.use.setErrorToast();
  const resetErrorToast = useBoundStore.use.resetErrorToast();

  useEffect(() => {
    select(PhantomWalletName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!anchorWallet) return;
    const provider = new AnchorProvider(connection, anchorWallet, {
      commitment: 'finalized',
    });

    const caller = new PumpfunDesktopCaller(provider);
    setPumpfunCaller(caller);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorWallet]);

  const {
    data: buyAmount,
    error: buyAmountError,
    isSuccess: buyAmountIsSuccess,
    isError: buyAmountIsError,
  } = useGetBuyAmount(targetMint, inputVal, pumpfunCaller, {
    enabled: pumpfunCaller && inputVal > 0,
  });

  const {
    data: tokenName,
    error: tokenNameError,
    isSuccess: tokenNameIsSuccess,
    isError: tokenNameIsError,
  } = useGetTokenName(targetMint.toString(), pumpfunCaller, {
    enabled: pumpfunCaller && inputVal > 0,
  });

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

  const roundedBuyAmount = useMemo(() => {
    if (buyAmount) {
      return Math.round(Number(buyAmount) / 1_000_000);
    }

    return;
  }, [buyAmount]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setInputVal(value * LAMPORTS_PER_SOL);
  };

  const signAndSendTransaction = async () => {
    if (!anchorWallet?.publicKey || !signTransaction) return;

    const txResults = await pumpfunCaller?.buy(
      anchorWallet.publicKey,
      targetMint,
      BigInt(inputVal * LAMPORTS_PER_SOL),
      SLIPPAGE_BASIS_POINTS,
      signTransaction,
      {
        unitLimit: 250000,
        unitPrice: 250000,
      },
    );

    if (txResults?.success) {
      //   setwalletConnectToastIsOpen(true);
      //   setwalletConnectToastMessage('Transaction Succeed');
    } else {
      console.log('Buy failed');
    }
  };

  return {
    tokenName,
    walletStatus: connected ? 'connected' : 'disconnected',
    roundedBuyAmount,
    walletPublicKey: anchorWallet?.publicKey,
    connect,
    disconnect,
    onChange,
    signAndSendTransaction,
  };
};

export default useSwapDesktop;

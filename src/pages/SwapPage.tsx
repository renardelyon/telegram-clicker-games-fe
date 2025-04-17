import ButtonTransparent from '@/components/ButtonTransparent';
import {
  VITE_APP_URL,
  VITE_CHAIN_CLUSTER,
  VITE_WALLET_WEBHOOK,
} from '@/env/env';
import { useEffect, useMemo, useState } from 'react';
import bs58 from 'bs58';
import nacl from 'tweetnacl';

import useBoundStore from '@/store/store';
import { decryptPayload, encryptPayload } from '@/utils/crypto';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { PumpFunCaller } from '@/utils/pumpfun';

const targetMint = new PublicKey(
  'FVpyaVqtrHCL9RHQ7nt29ib3Q9dR4mHut4mWHqRCpump',
);
const SLIPPAGE_BASIS_POINTS = 100n;

const SwapPage = () => {
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

  const [pumpfunCaller, setPumpfunCaller] = useState<PumpFunCaller>();

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
    const caller = new PumpFunCaller(provider);
    setPumpfunCaller(caller);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const appPublicKey = useMemo(
    () => new Uint8Array(Object.values(keypair?.publicKey || {})),
    [keypair],
  );
  const appSecretKey = useMemo(
    () => new Uint8Array(Object.values(keypair?.secretKey || {})),
    [keypair],
  );

  useEffect(() => {
    setKeypair(nacl.box.keyPair());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      BigInt(0.0001 * LAMPORTS_PER_SOL),
      SLIPPAGE_BASIS_POINTS,
      {
        unitLimit: 250000,
        unitPrice: 250000,
      },
    );

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

  return (
    <div className="relative container h-screen w-screen bg-no-repeat bg-cover bg-center p-6 pt-12">
      <div className="h-screen flex flex-col items-center justify-start">
        {/* Connect Wallet Button */}
        <div className="flex justify-end w-full mb-4">
          {walletStatus == 'connected' ? (
            <ButtonTransparent onClick={disconnect} className="rounded-3xl">
              <span
                role="img"
                aria-label="rocket"
                className="mr-1 text-2xl justify-self-start -mt-2">
                🚀
              </span>
              DISCONNECT WALLET
            </ButtonTransparent>
          ) : (
            <ButtonTransparent onClick={connect} className="rounded-3xl">
              <span
                role="img"
                aria-label="rocket"
                className="mr-1 text-2xl justify-self-start -mt-2">
                💵
              </span>
              CONNECT WALLET
            </ButtonTransparent>
          )}
          {/* <WalletMultiButton /> */}
        </div>

        {/* Swap Title */}
        <h1 className="text-2xl max-w-xs text-white font-bold text-center mt-6 mb-6 font-pixel">
          Swap Your Coins Here!!
        </h1>

        {/* Swap Box */}
        <div className="bg-black rounded-lg p-6 w-full max-w-md">
          {/* Buy/Sell Buttons */}
          <div className="flex justify-between mb-4">
            <button
              onClick={signAndSendTransaction}
              className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg w-1/2 mr-2">
              BUY
            </button>
            <button className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg w-1/2">
              SELL
            </button>
          </div>

          {/* Token and Set Max Buttons */}
          <div className="flex justify-between text-white text-sm mb-4">
            <button className="bg-gray-700 rounded-lg py-2 px-4 w-1/2 mr-2">
              Switch to TOKEN
            </button>
            <button className="bg-gray-700 rounded-lg py-2 px-4 w-1/2">
              Set max
            </button>
          </div>

          {/* Input Section */}
          <div className="flex items-center justify-between bg-gray-800 text-white p-4 rounded-lg mb-4">
            <input
              type="text"
              placeholder="0.0"
              className="bg-transparent outline-none text-2xl w-full"
            />
            <span className="text-2xl">SOL</span>
          </div>

          {/* Reset & SOL Options */}
          <div className="flex justify-between text-white text-sm mb-4">
            <button className="bg-gray-700 rounded-lg py-2 px-4">Reset</button>
            <div className="flex space-x-2">
              <button className="bg-gray-700 rounded-lg py-2 px-4">
                1 SOL
              </button>
              <button className="bg-gray-700 rounded-lg py-2 px-4">
                5 SOL
              </button>
              <button className="bg-gray-700 rounded-lg py-2 px-4">
                10 SOL
              </button>
            </div>
          </div>

          {/* Disabled Button */}
          <button
            disabled
            className="bg-gray-500 text-white font-bold py-4 w-full rounded-lg opacity-50">
            DISABLED FOR NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapPage;

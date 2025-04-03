import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';

type TWalletData = {
  walletStatus: 'connected' | 'disconnected' | 'pending';
  sharedSecret: Uint8Array | null;
  publicKey: PublicKey | null;
  encryptPubKey: string;
  data: string;
  nonce: string;
  session: string;
  keypair: nacl.BoxKeyPair | null;
};

type TWalletError = {
  errorCode?: string;
  errorMessage?: string;
};

type WalletDataAction = {
  setWalletData: (val: TWalletData) => void;
  setSession: (session: string) => void;
  setSharedSecret: (secret: TWalletData['sharedSecret']) => void;
  setWalletStatus: (status: TWalletData['walletStatus']) => void;
  setKeypair: (status: TWalletData['keypair']) => void;
  resetWalletData: () => void;
  setPublicKey: (publicKey: TWalletData['publicKey']) => void;
};

type WalletDataSlice = TWalletData & WalletDataAction;

export type { TWalletData, TWalletError, WalletDataSlice, WalletDataAction };

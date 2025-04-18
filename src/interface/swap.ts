import { TWalletData } from '@/type/TWalletData';
import { PublicKey } from '@solana/web3.js';

export interface ISwap {
  walletStatus: TWalletData['walletStatus'];
  walletPublicKey?: PublicKey | null;
  tokenName?: string;
  roundedBuyAmount?: number;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: () => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

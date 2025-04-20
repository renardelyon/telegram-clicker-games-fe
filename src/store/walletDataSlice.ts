import { TWalletData, WalletDataSlice } from '@/type/TWalletData';
import { StateCreator } from 'zustand';

const initialValue: TWalletData = {
  walletStatus: 'disconnected',
  sharedSecret: null,
  session: '',
  walletPublicKey: null,
  encryptPubKey: '',
  nonce: '',
  data: '',
  keypair: null,
};

const createWalletDataSlice: StateCreator<
  WalletDataSlice,
  [],
  [],
  WalletDataSlice
> = set => {
  return {
    ...initialValue,
    setWalletData: (val: TWalletData) => set(state => ({ ...state, ...val })),
    setSession: (session: string) => set({ session }),
    setSharedSecret: (sharedSecret: TWalletData['sharedSecret']) =>
      set({ sharedSecret }),
    setPublicKey: (walletPublicKey: TWalletData['walletPublicKey']) =>
      set({ walletPublicKey }),
    setWalletStatus: (status: TWalletData['walletStatus']) =>
      set({ walletStatus: status }),
    setKeypair: (keypair: TWalletData['keypair']) =>
      set(state => {
        if (state.keypair) {
          return { keypair: state.keypair };
        }
        return { keypair };
      }),
    resetWalletData: () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { walletStatus, ...filteredInitialValue } = initialValue;
      set({ ...filteredInitialValue });
    },
  };
};

export default createWalletDataSlice;

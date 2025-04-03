import { DEV } from '@/env/env';
import { UserDataSlice } from '@/type/TUserDataSlice';
import { getKeys, WithSelectors } from '@/utils/type';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { UseBoundStore, StoreApi, create } from 'zustand';
import createUserSlice from './userSlice';
import createErrorToastSlice from './errorToastSlice';
import createInitDataSlice from './initDataSlice';
import { ErrorToastSlice } from '@/type/TErrorToastSlice';
import { InitData, InitDataSlice } from '@/type/TInitData';
import { createJSONStorage, persist } from 'zustand/middleware';
import createWalletDataSlice from './walletDataSlice';
import { TWalletData, WalletDataSlice } from '@/type/TWalletData';

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (store.use as any)[k] = () => store(s => s[k as keyof typeof s]);
  }

  return store;
};

type GroupedSlice = UserDataSlice &
  ErrorToastSlice &
  InitDataSlice &
  WalletDataSlice;

const useBoundStoreBase = create<GroupedSlice>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createErrorToastSlice(...a),
      ...createInitDataSlice(...a),
      ...createWalletDataSlice(...a),
    }),
    {
      name: 'user-init-data',
      storage: createJSONStorage(() => localStorage),
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) =>
              getKeys<InitData>()(['initdata']).includes(
                key as keyof InitData,
              ) ||
              getKeys<TWalletData>()([
                'session',
                'walletStatus',
                'publicKey',
                'encryptPubKey',
                'data',
                'nonce',
                'sharedSecret',
                'keypair',
              ]).includes(key as keyof TWalletData),
          ),
        ),
    },
  ),
);

if (DEV) {
  mountStoreDevtool('Store', useBoundStoreBase);
}

const useBoundStore = createSelectors(useBoundStoreBase);

export default useBoundStore;

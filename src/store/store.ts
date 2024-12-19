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

type GroupedSlice = UserDataSlice & ErrorToastSlice & InitDataSlice;

const useBoundStoreBase = create<GroupedSlice>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createErrorToastSlice(...a),
      ...createInitDataSlice(...a),
    }),
    {
      name: 'user-init-data',
      storage: createJSONStorage(() => sessionStorage),
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            getKeys<InitData>()(['initdata']).includes(key as keyof InitData),
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

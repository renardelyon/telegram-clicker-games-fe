import { DEV } from '@/env/env';
import { UserDataSlice } from '@/type/TUserDataSlice';
import { WithSelectors } from '@/utils/type';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { UseBoundStore, StoreApi, create } from 'zustand';
import createUserSlice from './userSlice';
import createErrorToastSlice from './errorToastSlice';
import { ErrorToastSlice } from '@/type/TErrorToastSlice';

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

type GroupedSlice = UserDataSlice & ErrorToastSlice;

const useBoundStoreBase = create<GroupedSlice>()((...a) => ({
  ...createUserSlice(...a),
  ...createErrorToastSlice(...a),
}));

if (DEV) {
  mountStoreDevtool('Store', useBoundStoreBase);
}

const useBoundStore = createSelectors(useBoundStoreBase);

export default useBoundStore;

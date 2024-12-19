import useBoundStore from '@/store/store';
import axios from 'axios';

export default function setupGlobalAxiosInterceptor() {
  const initData = useBoundStore.use.initdata();
  axios.interceptors.request.use(
    config => {
      if (initData) {
        config.headers['X-init-telegram-data'] = initData;
      }

      return config;
    },
    err => {
      return Promise.reject(err);
    },
  );
}

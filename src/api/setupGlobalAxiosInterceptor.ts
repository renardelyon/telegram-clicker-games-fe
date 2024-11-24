import axios from 'axios';

export default function setupGlobalAxiosInterceptor() {
  axios.interceptors.request.use(config => {
    // TODO add telegram webapp initdata

    config.headers['X-init-telegram-data'] =
      'query_id=AAGjwyFlAgAAAKPDIWWW5oKC&user=%7B%22id%22%3A5991678883%2C%22first_name%22%3A%22Putu%22%2C%22last_name%22%3A%22Naga%22%2C%22username%22%3A%22Singarajal%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1730550364&hash=b0b0d7d579413c32b75d56dc4c384bfe7117f0464052bf9c981338c27c816fd0';
    return config;
  });
}

import axios from 'axios';

export default function setupGlobalAxiosInterceptor() {
  axios.interceptors.request.use(config => {
    // TODO add telegram webapp initdata

    config.headers['X-init-telegram-data'] =
      'query_id=AAGjwyFlAgAAAKPDIWX_x90j&user=%7B%22id%22%3A5991678883%2C%22first_name%22%3A%22Putu%22%2C%22last_name%22%3A%22Naga%22%2C%22username%22%3A%22Singarajal%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FsFYYj9MP7SihZka_byylxcJVYVnHbouoOrHQr00EPx0p1hEUBXphZs8yRKalgkYW.svg%22%7D&auth_date=1733393813&signature=hLXG7IfBdRwdbUmjiyilIvoOvZkVGSm_nAIpi8dgH78J8KPenW6RtdMUjLCVw2VAwZEBmsg9GQoRzkQbpS6UAA&hash=918e70c53a1ee6955e15099f4a975ba1cae6f5f7093cdc9786b2a0c8e4fadaa9';
    return config;
  });
}

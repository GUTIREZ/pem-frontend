import axios from 'axios';
import JWTDecode from 'jwt-decode';

// import { AuthApi } from './auth.api';
// import { config } from '../config';

const API_URL = 'http://localhost:9090'
export const http = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  //用来处理刷新token后重新请求的自定义变量
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

http.interceptors.request.use(
  reqConfig => {
    // reqConfig.headers.authorization = localStorage.getItem('access_token');

    // if (reqConfig.url.includes('/auth/logout'))
    //   reqConfig.headers['X-REFRESH-TOKEN'] = localStorage.getItem(
    //     'refresh_token',
    //   );

    return reqConfig;
  },
  err => Promise.reject(err),
);

let isFetchingToken = false;
let tokenSubscribers = [];

function subscribeTokenRefresh(cb) {
  tokenSubscribers.push(cb);
}
function onTokenRefreshed(errRefreshing, token) {
  tokenSubscribers.map(cb => cb(errRefreshing, token));
}
function forceLogout() {
  isFetchingToken = false;
  localStorage.clear();

  window.location = '/login';
}

// function refreshAccessToken() {
//   console.info(" ==>>> refresh access token")
//   const tokens = JSON.parse(localStorage.getItem('tokens'))
//   const refreshToken = tokens.refreshToken
//   if (!refreshToken) return forceLogout()

//   // http.headers.authorization = 'Bearer ' + refreshToken

//   http.defaults.headers.common['Authorization'] = 'Bearer ' + refreshToken
//   let res = http.get('auth/refresh')
//   return res.data
// }

var refreshAccessToken = new Promise(function(resolve, reject) {
  console.info(" ==>>> refresh access token")
  const tokens = JSON.parse(localStorage.getItem('tokens'))
  const refreshToken = tokens.refreshToken
  if (!refreshToken) return forceLogout()

  // http.headers.authorization = 'Bearer ' + refreshToken

  http.defaults.headers.common['Authorization'] = 'Bearer ' + refreshToken
  let res = http.get('auth/refresh')
  // return res.data
  Promise.resolve(res.data);
});


http.interceptors.response.use(undefined, err => {
  if (err.response.config.url.includes('/auth/signin'))
    return Promise.reject(err);

  if (err.response.status === 403) return forceLogout();
  if (err.response.status !== 401) return Promise.reject(err);

  if (!isFetchingToken) {
    isFetchingToken = true;

    const tokens = JSON.parse(localStorage.getItem('tokens'))
    const refreshToken = tokens.refreshToken
    if (!refreshToken) return forceLogout();

    try {
      const isRefreshTokenExpired =
        JWTDecode(refreshToken).exp < Date.now() / 1000;

      if (isRefreshTokenExpired) 
        return forceLogout();
      else
        http.defaults.headers.common['Authorization'] = 'Bearer ' + refreshToken
        let res = http.get('auth/refresh')
        console.info(res.data.token)
    } catch (e) {
      return forceLogout();
    }

    refreshAccessToken.then(resp => {
        console.info("==>>> refresh access token resp" + resp.data.token)
        isFetchingToken = false;

        onTokenRefreshed(null, newAccessToken);
        tokenSubscribers = [];

        localStorage.setItem('access_token', newAccessToken);
      })
      .catch(() => {
        onTokenRefreshed(new Error('Unable to refresh access token'), null);
        tokenSubscribers = [];

        forceLogout();
      });
  }

  const initTokenSubscriber = new Promise((resolve, reject) => {
    subscribeTokenRefresh((errRefreshing, newToken) => {
      if (errRefreshing) return reject(errRefreshing);

      err.config.headers.authorization = newToken;
      return resolve(axios(err.config));
    });
  });
  return initTokenSubscriber;
})

export default http;

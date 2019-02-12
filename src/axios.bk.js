import axios from 'axios'
import { store } from './store'
// import { settings } from '../settings';
// import { authAPI } from '.';
// // import JWTDecode from 'jwt-decode';
// // import { dispatch } from 'rxjs/internal/observable/pairs';

// const API_URL = 'http://47.98.140.122:9090'
const API_URL = 'http://localhost:9090'

let isRefreshing = false;
let subscribers = [];

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
  config => {
    config.store = store
    return config
  },
  error => {
    this.$store.commit('setError', {
      message: '请求异常'
    })
    return Promise.reject(error)
  }
)

http.interceptors.response.use(undefined, err => {
  const { config, response: { status } } = err;
  const originalRequest = config;

  if (status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshAccessToken().then(respaonse => {
        console.info('401 -- resfuresh token: '+ JSON.stringify(respaonse))
        const { data } = respaonse.data;
        isRefreshing = false;
        onRrefreshed(data.token);
        this.$store.dispatch("setToken",data)
        // authAPI.setAccessToken(data.access_token);
        // authAPI.setRefreshToken(data.refresh_token);
        subscribers = [];
      });
    }
    const requestSubscribers = new Promise(resolve => {
      subscribeTokenRefresh(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        resolve(axios(originalRequest));
      });
    });
    return requestSubscribers;
  }
  return Promise.reject(err);
});

function subscribeTokenRefresh(cb) {
  subscribers.push(cb);
}

function onRrefreshed(token) {
  subscribers.map(cb => cb(token));
}

function refreshAccessToken() {
  let refreshToken = JSON.parse(localStorage.getItem('tokens')).refreshToken
  if (refreshToken) {
    http.defaults.headers.common['Authorization'] = 'Bearer ' + refreshToken
    // http.config.headers.Authorization = `Bearer ` + refreshToken
    let res = http.get('/auth/refresh')
    return res
  }
}

export default http;


// import axios from 'axios'
// import { store } from './store'
// // import JWTDecode from 'jwt-decode';
// // import { dispatch } from 'rxjs/internal/observable/pairs';

// // const API_URL = process.env.VUE_APP_API_URL
// // const API_URL = 'http://47.98.140.122:9090'
// const API_URL = 'http://localhost:9090'

// let isRefreshing = false;
// let refreshSubscribers = [];

// export const http = axios.create({
//   baseURL: API_URL,
//   timeout: 5000,
//   //用来处理刷新token后重新请求的自定义变量
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json'
//   }
// })

// http.interceptors.request.use(
//   config => {
//     config.store = store

//     // config.headers.Authorization = "xxxxx"
//     return config
//   },
//   error => {
//     this.$store.commit('setError', {
//       message: '请求异常'
//     })
//     return Promise.reject(error)
//   }
// )


// function subscribeTokenRefresh(cb) {
//   refreshSubscribers.push(cb);
// }

// function onRrefreshed(token) {
//   refreshSubscribers.map(cb => cb(token));
// }

// http.interceptors.response.use(response => {
//   return response;
// }, error => {
//   const { config, response: { status } } = error;
//   const originalRequest = config;

//   if (status === 401) {
//     if (!isRefreshing) {
//       isRefreshing = true;
//       refreshAccessToken()
//         .then(newToken => {
//           isRefreshing = false;
//           onRrefreshed(newToken);
//         });
//     }

//     const retryOrigReq = new Promise((resolve) => {
//       subscribeTokenRefresh(token => {
//         // replace the expired token and retry
//         originalRequest.headers['Authorization'] = 'Bearer ' + token;
//         resolve(axios(originalRequest));
//       });
//     });
//     return retryOrigReq;
//   } else {
//     return Promise.reject(error);
//   }
// })

// ###################################################################################

// let isFetchingToken = false;
// let tokenSubscribers = [];

// function subscribeTokenRefresh(cb) {
//   tokenSubscribers.push(cb);
// }
// function onTokenRefreshed(errRefreshing, token) {
//   tokenSubscribers.map(cb => cb(errRefreshing, token));
// }
// function forceLogout() {
//   isFetchingToken = false;
//   localStorage.clear();

//   window.location = '/login';
// }

//刷新token的请求方法
// function getRefreshToken() {
//   const tokens = JSON.parse(localStorage.getItem('tokens'))
//   const refreshToken = tokens.refreshToken
//   if (!refreshToken) return forceLogout()

//   http.headers.authorization = 'Bearer ' + refreshToken
//   let res = http.get('auth/refresh')
//   return res.data
// }

// axios.interceptors.response.use(undefined, err => {
//   if (err.response.config.url.includes('/auth'))
//     return Promise.reject(err);

//   if (err.response.status === 403) return forceLogout();
//   if (err.response.status !== 401) return Promise.reject(err);

//   if (!isFetchingToken) {
//     isFetchingToken = true;

//     const tokens = JSON.parse(localStorage.getItem('tokens'))
//     const refreshToken = tokens.refreshToken
//     if (!refreshToken) return forceLogout();

//     try {
//       const isRefreshTokenExpired =
//         JWTDecode(refreshToken).exp < Date.now() / 1000;

//       if (isRefreshTokenExpired) return forceLogout();
//     } catch (e) {
//       return forceLogout();
//     }

//     getRefreshToken()
//       .then(tokens => {
//         isFetchingToken = false;

//         onTokenRefreshed(null, tokens);
//         tokenSubscribers = [];

//         // localStorage.setItem('tokens', tokens);
//         this.$store.dispatch("setToken",tokens)
//       })
//       .catch(() => {
//         onTokenRefreshed(new Error('Unable to refresh access token'), null);
//         tokenSubscribers = [];

//         forceLogout();
//       });
//   }

//   const initTokenSubscriber = new Promise((resolve, reject) => {
//     subscribeTokenRefresh((errRefreshing, newToken) => {
//       if (errRefreshing) return reject(errRefreshing);

//       err.config.headers.authorization = newToken;
//       return resolve(axios(err.config));
//     });
//   });
//   return initTokenSubscriber;
// })

import axios from 'axios'
import { store } from './store'

// const API_URL = process.env.VUE_APP_API_URL
// const API_URL = 'http://47.98.140.122:9090'
const API_URL = 'http://localhost:9090'

export const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})

http.interceptors.request.use((config) => {
  // Do something before request is sent
  console.info('Do something before request is sent')
  config.store = store
  return config
}, (error) => {
  // Do something with request error
  console.info('Do something with request error')
  return Promise.reject(error)
})

// Add a response interceptor
http.interceptors.response.use((response) => {
  // Do something with response data
  console.info('Do something with response data')
  return response
}, (error) => {
  // Do something with response error
  // console.log('intercept', JSON.stringify(error))
  console.info('Do something with response error')
  if (error.response && error.response.status === 401) { // auth failed
    console.info('auth failed')
    // const myURL = new URL(error.config.url)
    // if (myURL.pathname !== '/logout' && myURL.pathname !== '/auth/otp') {
    //   error.config.store.dispatch('logout', { forced: true })
    // }
  }
  return Promise.reject(error)
})

let tokenLock = null
let tokenTime = null
function checkToken (resolve, reject) {
  var p = new Promise(function(resolve, reject){
          if(resolve == void(0)) return;
              let m_access_token = getCookie('m_access_token');
      let refresh_token = getCookie('m_refresh_token');
      if(m_access_token){
          resolve();
      }else{
          //正在请求更新token时，其他接口等待
          if(tokenLock&&tokenTime<30){
              setTimeout(function(){
                  tokenTime++;
                  checkToken().then(resolve)
              },500);
          }else if(tokenTime>30){ //500*30是15S，15s没有响应就直接跳登录页
              // Message.error('登录信息过期请重登录');
              delCookie('m_access_token');
              delCookie('m_refresh_token');
              window.location.reload();
          }else{
              var refreshToken = this.$store.getters.refreshToken
              tokenLock = true;
              axios({
                  method: 'post',
                  url:paths.loginpath+ '/v1/login/refreshToken',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization':refreshToken
                  }
                  // data: Qs.stringify({refresh_token:refresh_token})
              }).then(function(res) {
                  tokenLock = false;
                  tokenTime = 0;
                  addCookie('m_access_token', res.data.access_token,1);
                  addCookie('m_refresh_token', res.data.refresh_token,2);
                  resolve();
              }).catch(function(error) {
                  reject();
              });
         }
      }
  });
  return p;
};

// export const addCookie = function(name, value,time) {
//   var exp = new Date();
//   if(time&&time!=0&&!isNaN(parseInt(time))){
//       exp.setTime(exp.getTime() + expires*time);
//   }else{
//       exp.setTime(exp.getTime() + expires);
//   }
//   document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
// };

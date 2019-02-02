import axios from 'axios'
import { store } from './store'
// import { dispatch } from 'rxjs/internal/observable/pairs';

// const API_URL = process.env.VUE_APP_API_URL
// const API_URL = 'http://47.98.140.122:9090'
const API_URL = 'http://localhost:9090'


function getRefreshToken() {
  let res = null
  try{
    let refreshToken = JSON.parse(localStorage.getItem('tokens')).refreshToken
    if (refreshToken) {
      http.defaults.headers.common['Authorization'] = 'Bearer ' + refreshToken
      // http.config.headers.Authorization = `Bearer ` + refreshToken
      let res = http.get('/auth/refresh')
      return res
    }
  }catch {
    res.status = 200
    return res
    // throw '无可用的刷新凭证，请重新登陆'
  }
}

export const http = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  //用来处理刷新token后重新请求的自定义变量
  isRetryRequest: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

http.interceptors.request.use(
  config => {
    config.store = store

    // config.headers.Authorization = "xxxxx"
    return config
  },
  error => {
    this.$store.commit('setError', {
      message: '请求异常'
    })
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  response => {
    return response
  },
  err => {
    if (err.response) {
      let errResp = err.response.data
      switch (err.response.status) {
        case 401: // 刷新token
          // TOKEN_EXPIRED 、 BAD_CREDENTIALS
          if(errResp.code === 'AUTH.0001') {
            let config = err.config
            if (!config.isRetryRequest) {
              
              // Promise.resolve(
              //   config.isRetryRequest = true,
              //   new Promise((resolve,reject) => {
              //     try{
              //       let refreshToken = JSON.parse(localStorage.getItem('tokens')).refreshToken
              //       if (refreshToken) {
              //         http.defaults.headers.common['Authorization'] = 'Bearer ' + refreshToken
              //         let res = http.get('/auth/refresh')
              //         console.log(JSON.stringify(' ====>>>> res:' + res))
              //         return Promise.resolve(res);
              //       }
              //     }catch {
              //       config.store.dispatch('logout', { forced: true })
              //       reject
              //     }
              //   })
              // ).then(data => {
              //   console.log(JSON.stringify(' ====>>>> data:' + data))
              //   if(data.status === 200){
              //     let tokens = data.data
              //     config.store.dispatch('setToken', tokens)
              //     // 这边不需要baseURL是因为会重新请求url中已经包含baseURL的部分
              //     config.baseURL = '';
              //     //重新请求
              //     return axios(config);
              //       // return Promise.resolve('Randy'+data);
              //   }else {
              //     config.store.dispatch('logout', { forced: true })
              //     // reject(res.data.message)
              //   }
              // })

              return getRefreshToken()
                .then(function(res) {
                  config.isRetryRequest = true
                  let tokens = res.data
                  config.store.dispatch('setToken', tokens)
                  // 这边不需要baseURL是因为会重新请求url中已经包含baseURL的部分
                  config.baseURL = '';
                  //重新请求
                  return axios(config);
                }).catch(function() {
                  config.store.dispatch('logout', { forced: true })

                  this.$store.commit('setError', {
                    message: '自动获取凭证失败，请重新登陆.'
                  })
                })
            }
          }else {
            this.$store.commit('setError', {
              message: errResp.code + ': ' + errResp.message
            })
          }
          break
        case 500:
          this.$store.commit('setError', {
            message: errResp.code + ': ' + errResp.message
          })
          break
      }
    }else {
      this.$store.commit('setError', {
        message: '加载超时'
      })
    }
    return Promise.reject(err)
  }
)




// let tokenLock = null
// let tokenTime = null
// function checkToken (resolve, reject) {
//   var p = new Promise(function(resolve, reject){
//           if(resolve == void(0)) return;W
//               let m_access_token = getCookie('m_access_token');
//       let refresh_token = getCookie('m_refresh_token');
//       if(m_access_token){
//           resolve();
//       }else{
//           //正在请求更新token时，其他接口等待
//           if(tokenLock&&tokenTime<30){
//               setTimeout(function(){
//                   tokenTime++;
//                   checkToken().then(resolve)
//               },500);
//           }else if(tokenTime>30){ //500*30是15S，15s没有响应就直接跳登录页
//               // Message.error('登录信息过期请重登录');
//               delCookie('m_access_token');
//               delCookie('m_refresh_token');
//               window.location.reload();
//           }else{
//               var refreshToken = this.$store.getters.refreshToken
//               tokenLock = true;
//               rv = http.get('/auth/refresh')
//               axios({
//                   method: 'post',
//                   url:paths.loginpath+ '/v1/login/refreshToken',
//                   headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                     'Authorization':refreshToken
//                   }
//                   // data: Qs.stringify({refresh_token:refresh_token})
//               }).then(function(res) {
//                   tokenLock = false;
//                   tokenTime = 0;
//                   dispatch('setToken',res)
//                   resolve();
//               }).catch(function(error) {
//                   console.error(error)
//                   reject();
//               });
//          }
//       }
//   });
//   return p;
// }

// export const addCookie = function(name, value,time) {
//   var exp = new Date();
//   if(time&&time!=0&&!isNaN(parseInt(time))){
//       exp.setTime(exp.getTime() + expires*time);
//   }else{
//       exp.setTime(exp.getTime() + expires);
//   }
//   document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
// }

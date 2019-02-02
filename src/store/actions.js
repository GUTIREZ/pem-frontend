import { http } from '@/axios'
import router from '../router'

const TOKENS = 'tokens'
export default {
  async signIn({ dispatch, commit }, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let res = null
    try {
      res = await http.post('/auth', payload)
      dispatch('setToken', res.data)
    } catch (e) {
      commit('setError', {
        message: '登陆失败:' + e.message
      })
    }
    commit('setLoading', false)
  },

  async autoSignIn({ dispatch }) {
    // localStorage 取出数据为string，需要先转为对象
    let tokens = JSON.parse(localStorage.getItem(TOKENS))
    if (tokens) {
      dispatch('setToken', tokens)
    } else {
      router.push('/login')
    }
  },

  async refreshToken({ dispatch, commit }) {
    commit('setError', null)
    let tokens = JSON.parse(localStorage.getItem(TOKENS))
    let res
    if (tokens) {
      try {
        http.defaults.headers.common['Authorization'] =
          'Bearer ' + tokens.refreshToken
        res = await http.get('/auth/refresh')
        dispatch('setToken', res.data)
      } catch (e) {
        commit('setError', {
          message: '登陆凭证已过期，请重新登陆'
        }),
          router.push('/login')
      }
    } else {
      router.push('/login')
    }
  },

  async setToken({ commit }, tokens) {
    try{
      http.defaults.headers.common['Authorization'] = 'Bearer ' + tokens.token

      let user = await http.get('/users/me')
      let menu = await http.get('/menus/me')
      commit('setUser', user.data)
      commit('setMenu', menu.data)
  
      localStorage.removeItem(TOKENS)
      // localStorage存储对象，需要先转换为json字符串
      localStorage.setItem(TOKENS, JSON.stringify(tokens))
      commit('setToken', tokens.token)
  
      router.push('/dashboard')
    }catch(e){
      localStorage.removeItem(TOKENS)
      router.push('/login')
    }
  },

  async logout ({ commit }, payload) {
    commit('setLoading', true)
    console.log('action logout', payload)
    if (payload.forced) { // auth failure detected
      router.replace({
        path: 'login',
        query: {redirect: router.currentRoute.fullPath}
    });
    } else { // logout button clicked
      try {
        await http.post('/signout')
      } catch (e) {
        console.error(e)
        // if (!e.response || e.response.status === 401) { // server or authorization error
        //   ok please continue
        // } else {
        //   return
        // }
      }
    }
    delete http.defaults.headers.common['Authorization']
    
    localStorage.removeItem(TOKENS)
    commit('setUser', null)
    commit('setMenu', null)
    commit('setToken', null)
    router.push('/')
    if (payload.forced) commit('setError', { message: '凭证过期，请重新登陆' })
    commit('setLoading', false)
  },
  
  clearError ({ commit }) { commit('setError', null) }
}

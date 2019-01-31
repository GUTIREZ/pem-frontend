import { http } from '@/axios'
import router from '../router'

// const USE_OTP = process.env.VUE_APP_USE_OTP || '' // set to true in production

// const USE_OTP = process.env.VUE_APP_USE_OTP || '' // set to true in production
const TOKEN = 'token'
const REFRESH_TOKEN = 'refreshToken'
export default {

  async signIn({ dispatch,commit }, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let rv = null
    const {
      username,
      password
    } = payload
    try {
      rv = await http.post('/auth', { username, password })
      localStorage.removeItem(REFRESH_TOKEN)
      localStorage.setItem(REFRESH_TOKEN, rv.data.refreshToken)
      dispatch('setToken', rv.data.token)
    } catch (e) {
      commit('setError', {
        message: 'Sign In Error:' + e.message
      })
    }
    commit('setLoading', false)
  },

  async checkToken( {dispatch, commit} ) {
    commit('setLoading', true)

    var token = localStorage.getItem(TOKEN)
    let refreshToken = null
    if(token) {
      // dispatch('setToken', token)
      try{
        commit('setToken', token)
        http.defaults.headers.common['Authorization'] = 'Bearer ' + token
        let user = await http.get('/users/me')
        let menu = await http.get('/menus/me')
        commit('setUser', user.data)
        commit('setMenu', menu.data)
      }catch{
        refreshToken = localStorage.getItem(REFRESH_TOKEN)
        if(refreshToken){
          dispatch('refreshToken')
        }else{
          router.push('/login')
        }
      }
      
    }else {
      refreshToken = localStorage.getItem(REFRESH_TOKEN)
      if(refreshToken){
        dispatch('refreshToken')
      }else{
        router.push('/login')
      }
    }

    commit('setLoading', false)
  },

  async refreshToken({commit}) {
    let rv = null
    try {
      rv = await http.get('/auth/refresh')
      localStorage.removeItem(REFRESH_TOKEN)
      localStorage.setItem(REFRESH_TOKEN, rv.refreshToken)

      localStorage.removeItem(TOKEN)
      localStorage.setItem(TOKEN, rv.token)
      commit('setToken', rv.token)
      http.defaults.headers.common['Authorization'] = 'Bearer ' + rv.token
      let user = await http.get('/users/me')
      let menu = await http.get('/menus/me')
      commit('setUser', user.data)
      commit('setMenu', menu.data)

      // dispatch('setToken', rv.data.token)
    } catch (e) {
      localStorage.removeItem(TOKEN)
      localStorage.removeItem(REFRESH_TOKEN)
      router.push('/login')
    }
  },
  
  async setToken( { commit },token ) {
    try{
      localStorage.removeItem(TOKEN)
      localStorage.setItem(TOKEN, token)
      commit('setToken', token)

      http.defaults.headers.common['Authorization'] = 'Bearer ' + token

      let user = await http.get('/users/me')
      let menu = await http.get('/menus/me')
      commit('setUser', user.data)
      commit('setMenu', menu.data)

      router.push('/dashboard')
    }catch (e){
      console.error('setToken Error: ' + e.message)
      router.push('/login')
    }
  },

  async signOut({
    dispatch,
    commit
  }, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let rv = null
    const {
      username,
      password
    } = payload
    try {
      rv = await http.post('/auth', {
        username,
        password
      })
      dispatch('autoSignIn', rv.data) // token
    } catch (e) {
      commit('setError', {
        message: 'Sign In Error:' + e.message
      })
    }
    commit('setLoading', false)
  },

  async signUserIn ({ dispatch, commit }, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let rv = null
    const { username, password } = payload
    try {
      rv = await http.post('/auth', { username, password })
      dispatch('autoSignIn', rv.data) // token
    } catch (e) { console.error(e.message)}
    if (!rv) {
      commit('setError', { message: 'Sign In Error' })
    }
    commit('setLoading', false)
  },
}

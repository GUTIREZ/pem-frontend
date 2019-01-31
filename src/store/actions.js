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
    let tokens = localStorage.getItem(TOKENS)
    if (tokens) {
      dispatch('setToken', tokens)
    } else {
      router.push('/login')
    }
  },

  async refreshToken({ dispatch, commit }) {
    commit('setError', null)
    let tokens = localStorage.getItem(TOKENS)
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
    http.defaults.headers.common['Authorization'] = 'Bearer ' + tokens.token

    let user = await http.get('/users/me')
    let menu = await http.get('/menus/me')
    commit('setUser', user.data)
    commit('setMenu', menu.data)

    localStorage.removeItem(TOKENS)
    localStorage.setItem(TOKENS, tokens)
    commit('setToken', tokens.token)

    router.push('/dashboard')
  }
  // async signOut({
  //   dispatch,
  //   commit
  // }, payload) {
  //   commit('setLoading', true)
  //   commit('setError', null)
  //   let rv = null
  //   const {
  //     username,
  //     password
  //   } = payload
  //   try {
  //     rv = await http.post('/auth', {
  //       username,
  //       password
  //     })
  //     dispatch('autoSignIn', rv.data) // token
  //   } catch (e) {
  //     commit('setError', {
  //       message: 'Sign In Error:' + e.message
  //     })
  //   }
  //   commit('setLoading', false)
  // },
}

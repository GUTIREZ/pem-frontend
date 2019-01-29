import { http } from '@/axios'
import router from '../router'

// const USE_OTP = process.env.VUE_APP_USE_OTP || '' // set to true in production

const USE_OTP = process.env.VUE_APP_USE_OTP || '' // set to true in production
const TOKEN = 'token'
const REFRESH_TOKEN = 'refreshToken'
export default {

  async signIn({ commit }, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let rv = null
    const {
      username,
      password
    } = payload
    try {
      rv = await http.post('/auth', { username, password })
      console.info('====>>>> TOKEN: ' + rv.data.token)
      http.defaults.headers.common['Authorization'] = 'Bearer ' + rv.data.token

      console.info('====>>>> REFRESH_TOKEN: ' + rv.data.refreshToken)

      localStorage.removeItem(TOKEN)
      localStorage.setItem(TOKEN, rv.data.token)
      commit('setToken', rv.data.token)

      localStorage.removeItem(REFRESH_TOKEN)
      localStorage.setItem(REFRESH_TOKEN, rv.data.refreshToken)

      commit('setLayout', 'layout-admin')
      router.push('/dashboard')
    } catch (e) {
      commit('setError', {
        message: 'Sign In Error:' + err.message
      })
    }
    commit('setLoading', false)
  },

  async setUser( {commit} ) {
    commit('setLoading', true)
    commit('setError', null)
    let user = null
    try {
      user = await http.get('/users/me').data
      console.log('User: ' + JSON.stringify(user.data))

      commit('setUser', user)
    } catch (e) {
      commit('setError', {
        message: 'Get User Error:' + err.message
      })
    }
    commit('setLoading', false)
  },

  async refreshToken({
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
    } catch (e) {}
    if (!rv) {
      commit('setError', {
        message: 'Sign In Error'
      })
    }
    commit('setLoading', false)
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
        message: 'Sign In Error:' + err.message
      })
    }
    commit('setLoading', false)
  },

  async signUserUp ({ commit }, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let rv = null
    const { email, password } = payload
    try {
      rv = await http.post('/signup', { email, password })
    } catch (e) { 
      console.info(e)
    }
    commit('setLoading', false)
    if (rv) {
      // const newUser = {id: user.uid, email: payload.email}
      // commit('setUser', newUser)
      commit('setError', { message: 'User Registered' })
    } else {
      commit('setError', { message: 'Error Signup' })
    }
  },
  async signUserIn ({ dispatch, commit }, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let rv = null
    const { username, password } = payload
    try {
      rv = await http.post('/auth', { username, password })
      dispatch('autoSignIn', rv.data) // token
    } catch (e) { }
    if (!rv) {
      commit('setError', { message: 'Sign In Error' })
    }
    commit('setLoading', false)
  },
  async verifyOtp ({ dispatch, commit }, payload) {
    commit('setLoading', true)
    commit('setError', null)
    let rv = null
    const { pin } = payload
    try {
      rv = await http.post('/auth/otp', { pin })
      console.log('rv', rv)
      // localStorage.setItem('user-token', token) // store the token in localstorage
      dispatch('autoVerify', rv.data) // token
    } catch (e) { }
    if (!rv) {
      // localStorage.removeItem('user-token') // if the request fails, remove any possible user token if possibl
      commit('setError', { message: 'Verify Error' })
    }
    commit('setLoading', false)
  },

  async logout ({ commit }, payload) {
    commit('setLoading', true)
    // console.log('action logout', payload)
    if (payload.forced) { // auth failure detected
    } else { // logout button clicked
      try {
        await http.get('/logout')
      } catch (e) {
        if (!e.response || e.response.status === 401) { // server or authorization error
          // ok please continue
        } else {
          return
        }
      }
    }
    delete http.defaults.headers.common['Authorization']
    // localStorage.removeItem('user-token') // if the request fails, remove any possible user token if possibl
    commit('setUser', null)
    commit('setLayout', 'layout-default')
    router.push('/')
    if (payload.forced) commit('setError', { message: 'Session Expired' })
    commit('setLoading', false)
  },

  autoSignIn ({ commit }, payload) { // payload.token
    payload.verified = !USE_OTP
    console.log('autoSignIn', payload)
    commit('setUser', payload)
    http.defaults.headers.common['Authorization'] = 'Bearer ' + payload.token
    if (!USE_OTP) {
      commit('setLayout', 'layout-admin')
      router.push('/dashboard')
    }
  },

  autoVerify ({ commit }, payload) { // payload.token
    payload.verified = true
    commit('setUser', payload)
    http.defaults.headers.common['Authorization'] = 'Bearer ' + payload.token
    commit('setLayout', 'layout-admin')
    router.push('/reports')
  },
  clearError ({ commit }) { commit('setError', null) },

  setNetworkError ({ commit }, payload) { commit('mutateNetworkError', payload) }
}

/*
function doSomething() {
  console.log("10 seconds");
  setTimeout(doSomething, 10000)
}
setTimeout(doSomething, 10000)
*/

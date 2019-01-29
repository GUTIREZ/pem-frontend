import Vue from 'vue'
import Vuex from 'vuex'
import jwtDecode from 'jwt-decode'
import actions from './actions'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
  },
  state: {
    layout: 'layout-default',
    token: null,
    user: null, // token, verified, (id - maybe to remove) // localStorage.getItem('user-token') || null
    loading: false,
    error: null,
    networkError: false
  },
  mutations: {
    // signUserUp (state, payload) { }, // DISABLED
    setToken (state, payload) { state.token = payload },
    setUser (state, payload) {
      if (payload && payload.token) {
        const decoded = jwtDecode(payload.token)
        if (decoded) {
          payload.id = decoded.id
          payload.clientId = decoded.clientId
        }
      }
      state.user = payload
    },
    setLayout(state, payload) {
      state.layout = payload
    },
    setLoading (state, payload) { state.loading = payload },
    setError (state, payload) { state.error = payload },
    mutateNetworkError (state, payload) { state.networkError = payload }
  },
  getters: {
    token (state) { return state.token },
    user (state) { return state.user },
    layout (state) { return state.layout },
    loading (state) { return state.loading },
    error (state) { return state.error },
    networkError (state) { return state.networkError }
  },
  actions: { ...actions }
})

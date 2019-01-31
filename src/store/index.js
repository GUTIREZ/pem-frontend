import Vue from "vue"
import Vuex from "vuex"
// import jwtDecode from 'jwt-decode'
import actions from "./actions"

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {},
  state: {
    layout: "layout-default",
    token: null,
    user: null,
    menu: null,
    loading: false,
    error: null,
    networkError: false
  },
  mutations: {
    // signUserUp (state, payload) { }, // DISABLED
    setToken(state, payload) {
      state.token = payload;
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setMenu(state, payload) {
      state.menu = payload;
    },
    // setLayout(state, payload) {
    //   state.layout = payload;
    // },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    mutateNetworkError(state, payload) {
      state.networkError = payload;
    }
  },
  getters: {
    token(state) {
      return state.token;
    },
    user(state) {
      return state.user;
    },
    menu(state) {
      return state.menu;
    },
    layout(state) {
      if (state.token) return "layout-admin";
      else return "layout-default";
    },
    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    },
    networkError(state) {
      return state.networkError;
    },
    isAuth(state) {
      if (state.token) return true;
      else return false;
    }
  },
  actions: { ...actions }
});

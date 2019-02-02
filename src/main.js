import Vue from "vue";
import './plugins/vuetify'
import App from "./App.vue";
import router from "./router/";
import { store } from './store'
import "./registerServiceWorker";
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false;

// axios
import axios from 'axios'
// import { post, fetch, patch, put } from '@/http'
// Vue.prototype.$post = post
// Vue.prototype.$fetch = fetch
// Vue.prototype.$patch = patch
// Vue.prototype.$put = put

new Vue({
  router,
  store,
  axios,
  render: h => h(App)
}).$mount("#app");

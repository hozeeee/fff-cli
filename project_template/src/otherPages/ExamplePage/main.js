import Vue from 'vue';
import App from './App.vue';
import router from '@/router';
import '@/assets/css/global.css';
import axios from "axios";
import "@/axios.config.js";

Vue.config.productionTip = false

Vue.prototype.$axios = axios;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')





// TODO: 将外层的 main.js 直接引入到这里






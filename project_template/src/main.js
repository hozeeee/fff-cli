import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import dayjs from "dayjs";
import axios from "axios";
import "@/axios.config.js";
// import Antd from "ant-design-vue";
// import "ant-design-vue/dist/antd.css";
// Vue.use(Antd);
import "@/assets/css/global.css";
Vue.config.productionTip = false;

// 按需加载 ant-design-vue
import {
  Menu,
  Icon
} from "ant-design-vue";
Vue.use(Menu);
Vue.use(Icon);



Vue.prototype.$axios = axios;
Vue.prototype.$PerfectScrollbar = PerfectScrollbar;
Vue.prototype.$dayjs = dayjs;

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount("#app")
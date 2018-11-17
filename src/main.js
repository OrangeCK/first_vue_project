import Vue from 'vue';
import App from './App';
import router from './router';
import 'iview/dist/styles/iview.css';
import 'iview/dist/iview.min.js';
import iView from 'iview';
import $ from 'jquery';

Vue.use(iView);

/*axios*/
import axios from 'axios'
axios.defaults.withcredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.withcredentials = true;
axios.defaults.timeout = 150000;
Vue.prototype.$axios = axios;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // template: '<App/>',
  // components: { App },
  render: h => h(App)
})

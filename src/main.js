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
import {setCookie,getCookie,delCookie} from './js/cookieUtil.js'
axios.defaults.withcredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.withcredentials = true;
axios.defaults.timeout = 150000;
Vue.prototype.$axios = axios;

Vue.config.productionTip = false

// http request 拦截器
axios.interceptors.request.use(
  config => {
      let token = getCookie("token");
      if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
          console.log("token是多少：",token);
          config.headers.Authorization = token;
      }
      return config;
  },
  error => {
      return Promise.reject(error);
  });

// http响应拦截器
axios.interceptors.response.use(data => {// 响应成功关闭loading
  return data
 }, 
 error => {
    console.log(error.response);
    if(error.response){
      switch(error.response.status){
        case 401:
          router.replace({
            path:'/Login',
            query: {redirect: router.currentRoute.fullPath}
          });
          // location.reload;
      }
    }
  return Promise.reject(error)
 })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // template: '<App/>',
  // components: { App },
  render: h => h(App)
})

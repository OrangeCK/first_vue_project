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
      console.log("正在请求", config);
      let token = getCookie("token");
      let refreshToken = getCookie("refreshToken");
      if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
          // console.log("token是多少：",token);
          config.headers.Authorization = token;
          config.headers.Refresh_Token = refreshToken;
      }
      return config;
  },
  error => {
      return Promise.reject(error);
  });

// http response拦截器
axios.interceptors.response.use(data => {// 响应成功关闭loading
  console.log("成功响应",data);
  let token = data.headers.authorization;
  if(token){
    setCookie('token', token);
  }
  return data
 }, 
 error => {
    console.log("失败响应",error.response);
    if(error.response){
      switch(error.response.status){
        case 401:
          router.replace({
            path:'/Login',
            query: {redirect: router.currentRoute.fullPath}
          });
          break;
        case 403:
          router.replace({
            path:'/Login',
            query: {redirect: router.currentRoute.fullPath}
          });
          break;
        case 500:
          return error.response;
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

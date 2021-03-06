import Vue from 'vue';
import App from './App';
import router from './router';
import 'iview/dist/styles/iview.css';
import 'iview/dist/iview.min.js';
import iView from 'iview';
import $ from 'jquery';
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import './assets/iconfont/iconfont.css'
import global from '@/js/global'
import store from './js/store'

Vue.use(iView);
Vue.use(mavonEditor);

/*axios*/
import axios from 'axios'
import {setCookie,getCookie,delCookie} from './js/cookieUtil.js'
import ivueCommon from './js/ivueCommon'
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.timeout = 150000;
if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'http://47.103.17.3:8080'
 }
Vue.prototype.$axios = axios;
Vue.prototype.$global = global;
Vue.config.productionTip = false

Vue.use(ivueCommon);

const service = axios.create({
  withCredentials: true,
})

// http request 拦截器
service.interceptors.request.use(
  config => {
    // console.log("正在请求", config);
    let token = getCookie("token");
    let refreshToken = getCookie("refreshToken");
    if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.Authorization = token;
        config.headers.Refresh_Token = refreshToken;
    }
    return config;
  },
  error => {
      return Promise.reject(error);
  });

// http response拦截器
service.interceptors.response.use(data => {// 响应成功关闭loading
  // console.log("成功响应",data);
  let token = data.headers.authorization;
  if(token){
    setCookie('token', token);
  }
  return data
 }, 
 error => {
    // console.log("失败响应",error.response);
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

Vue.prototype.service = service;

 router.beforeEach((to, from, next) => {
  iView.LoadingBar.config({
    color: '#5cb85c',
    failedColor: '#f0ad4e',
  });
  iView.LoadingBar.start();
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    let loginFlag = false;
    let token = getCookie("token");
    // 通过vuex state获取当前的token是否存在
    if (token) {
      service({
        url: "http://127.0.0.1:8888/login/judgeLogin",
        method: "get"
      }).then(res =>{
        let data = res.data;
        if(data.success){
          next();
        }else {
          next({
            path: '/Login',
            query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
          });
        }
      }).catch(function (error) {
          next({
            path: '/Login'
          });
      });
    }else {
      next({
        path: '/Login',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  }
  else {
      next();
  }
})

router.afterEach(route => {
  iView.LoadingBar.finish();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: store,
  // template: '<App/>',
  // components: { App }
  render: h => h(App)
})

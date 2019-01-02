import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import TestVue from '@/components/TestVue'
import Default from '@/components/Default'
import Login from '@/components/Login'
import Employee from '@/components/Employee'
import UploadFile from '@/components/UploadFile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path:'/',
      name:'Default',
      component: Default,
      children:[
        {
          path: 'TestVue',
          name: 'TestVue',
          component: TestVue
        },
        {
          path: 'Employee',
          name: 'Employee',
          component: Employee
        },
        {
          path: 'UploadFile',
          name: 'UploadFile',
          component: UploadFile
        }
      ]
    }
  ]
})

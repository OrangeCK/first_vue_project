import Vue from 'vue'
import Router from 'vue-router'
import TestVue from '@/components/TestVue'
import Default from '@/components/Default'
import Login from '@/components/Login'
import Employee from '@/components/Employee'
import UploadFile from '@/components/UploadFile'
import QueryImage from '@/components/QueryImage'
import MarkdownEdit from '@/components/MarkdownEdit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path:'/',
      name:'Default',
      component: Default,
      meta:{
        requireAuth: true
      },
      children:[
        {
          path: 'Employee',
          name: 'Employee',
          component: Employee
        },
        {
          path: 'UploadFile',
          name: 'UploadFile',
          component: UploadFile
        },
        {
          path: 'QueryImage',
          name: 'QueryImage',
          component: QueryImage
        }
      ]
    }
  ]
})


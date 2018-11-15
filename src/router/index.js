import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import TestVue from '@/components/TestVue'
import TestVue2 from '@/components/TestVue2'
import Default from '@/components/Default'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
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
          path: 'TestVue2',
          name: 'TestVue2',
          component: TestVue2
        }
      ]
    }
  ]
})

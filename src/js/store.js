import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state={
    loginName:window.localStorage.getItem('userName')
    // count:0
}
const mutations={
    SET_LoginName:(state, value) =>{
        state.loginName = value;
        window.localStorage.setItem('userName', value);
    }
}
// const getters = {
//     count:function(state){
//      return state.count +=100;
//     }
// }
export default new Vuex.Store({
    state,
    mutations
})
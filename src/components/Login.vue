<template>
  <div class="loginbg">
    <div class="page">
      <div class="head">渠道拓展平台</div>
      <div class="singin">SING IN</div>
      <div class="body">
        <ul class="loginForm">
          <li><label class="accountIcon"></label><input type="text" v-model="loginForm.account" class="txtAccount" placeholder="请输入登录账号" /></li>
          <li><label class="passwordIcon"></label><input type="password" v-model="loginForm.password" class="txtPwd" placeholder="请输入登录密码" /></li>
          <li style="border:0px;">
            <img class="loginBtn" src="../assets/loginBtn.png" @click="loginAction" style="margin-left:-10px;"/>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loginbg{
  width: 100%;
  height: 100vh;
  background: url(../assets/login_bg.png) center center no-repeat;
  /* background: #6699FF center center no-repeat; */
  background-size: 100%;
}
.page{
  background-color: #fff;
  width: 503px;
  height: 430px;
  border-radius: 5px;
  right: 10%;
  top: 20%;
  position:absolute;
}
.loginForm{
  width: 350px;
  height: auto;
  list-style-type: none;
  padding: 0px;
  margin: 0 auto;
}
.loginForm li{
  margin:0px;
  width: 100%;
  height: 50px;
  margin: 25px 0;
  border: solid 1px #bad2d7;
  border-radius: 3px;
}
.loginForm li dl{
  height: 40px;
  width: 145px;
  float: left;
  margin: 0px;
}
.loginForm li i{
	font-family: 'PingFang-SC-Medium';
	font-size: 12px;
  color: #e4ebf3;
  cursor: pointer;
}
.loginForm .txtAccount{
    width: 298px;
    height: 48px;
    border:0px;
    font-size: 16px;
    outline: none;
}
.loginForm .txtPwd{
    width: 298px;
    height: 48px;
    border:0px;
    font-size: 16px;
    outline: none;
}
.loginForm .txtCode{
    width: 200px;
    height: 48px;
    font-size: 16px;
    border: solid 1px #bad2d7;
    border-radius: 3px;
    float: left;
    outline: none;
}
.loginForm .imgCode{
  width: 99px;
  height: 33px;
  border: 0px;
  margin: 0px 0 0 40px;
}
.loginForm .accountIcon
{
  padding: 25px;
  background: url(../assets/account.png) no-repeat center center;
}
.loginForm .passwordIcon
{
  padding: 25px;
  background: url(../assets/password.png) no-repeat center center;
}
.loginForm .loginBtn{
  padding: 0px;
  cursor: pointer;
}
  .head{
    font-family: 'PingFang-SC-Heavy';
    font-size: 30px;
    color: #222222;
    margin-top: 50px;
    padding-left: 70px;
  }
  .singin{
    font-family: 'PingFang-SC-Heavy';
    font-size: 15px;
    color: #46a2d7;
    margin-left: 70px;
  }
  .body{
    width: 500px;
    margin: 0 auto;
  }
  .el-button{
    width: 100%;
  }
</style>


<script>
import jsencrypt from '../../static/js/jsencrypt.min.js'
import {setCookie,getCookie} from '../js/cookieUtil.js'
  export default {
    data() {
      return {
        backgroudDiv: {backgroundImage: 'url(' + require('../assets/login_bg.png') + ')'},
        // chkCodePath:"/login/getValidateCode?r="+Math.random(),
        loginForm: {
          loginName: '',
          password: ''
        }
      }
    },
    create(){
      
    },
    methods: {
      loginAction(){
        this.service({
          url: "http://127.0.0.1:8888/login/goLogin",
          data: {
            loginName:this.loginForm.account,
            password:this.loginForm.password,
          },
          method: "post"
        }).then(response => {
              let data = response.data.data;
            if(response.data.success == true){
              setCookie('token', data.Authorization);
              setCookie('refreshToken', data.Refresh_Token);
              this.$store.commit('SET_LoginName', data.userName);
              this.$store.commit('SET_UserId', data.id);
              this.$store.commit('SET_BreadCrumbs', '[]');
              this.$store.commit('SET_ActiveName', '');
              this.$router.push({ path: "/" });
            }else{
              this.$Message.error({
                content:response.data.msg,
                duration:5
              });
            }
          });  
      }
    }
  }
</script>
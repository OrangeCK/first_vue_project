<template>
    <div class="layout" style="min-width:1200px;border-bottom-width: 0px;border-top-width: 0px;">
        <Layout :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}">
            <Sider>
                <Menu theme="dark" width="auto"  @on-select="changeTab" :active-name='activeName' :accordion=true>
                    <div class="menuTop" @click="jumpIndex">
                        <Icon type="ios-home" size="28" color="#fff"></Icon>
                        <label>首页</label>
                    </div>
                    <Submenu :name="menu.id" v-for="menu in form.menus" :key="menu.id">
                        <template slot="title">
                            <Icon :type="menu.iconType" size="18"></Icon>
                            {{menu.menuName}}
                        </template>
                        <MenuItem :name="children.mName" v-for="(children,index) in menu.menuList" :key="index">
                            <Icon :type="children.iconType2" size="16"></Icon>
                            {{children.mName}}
                        </MenuItem>
                    </Submenu>
                </Menu>
            </Sider>
        </Layout>
        <Layout :style="{marginLeft: '200px'}">
            <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.3)'}" style="z-index: 1">
                <div class="topBox">
                    <img src="../assets/logo.png" /> 
                    <label>综合物料管理平台</label>
                    <div class="userInfo">
                        <img src="../assets/user.png" /> 
                        <label style="font-weight: normal;">橙子味栗子</label>
                        <Icon class="quit_user" @click="quit" custom="iconfont icon-tuichu1" size="24"/>
                    </div>
                </div> 
            </Header>
            <Content :style="{padding: '0px 16px 16px 16px',background: 'rgb(220, 242, 245)'}" >
                <Breadcrumb :style="{padding: '10px 0'}">
                    <BreadcrumbItem v-for="(tab,index) in contentTabs.tabList" :key="index">{{tab.name}}</BreadcrumbItem>
                </Breadcrumb>
                <Card>
                    <div class="card-div">
                        <router-view />
                    </div>
                </Card>
            </Content>
        </Layout>
    </div>
</template>
<style scoped>
    .layout{
        border: 0px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        /* overflow: hidden; */
    }
    .layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .topBox {
        width: 100%;
        height: 62px;
    }
    .topBox img{
        float: left;
        margin-top: 10px;
    }
    .topBox label{
        float: left;
        margin: 0 0 0 20px;
        font-size: 16px;
        font-weight: bold;
    }
    .topBox .userInfo{
        float: right;
        margin: 0 0 0 0;
        font-size: 16px;
    }
    .menuTop{
        height:62px;
        padding: 20px 0 0 50px;
    }
    .menuTop label{
        color:#fff;
        margin: 5px 0 0 15px;
        position:absolute;
        cursor: pointer;
    }
    .quit_user{
        margin-left:10px;
        cursor: pointer;
    }
    .quit_user:hover{
		transform: scale(1.1);
	 }
    /* .card-div{
        min-height: 500px;
    } */
</style>
<script>
import {setCookie,getCookie,delCookie} from '../js/cookieUtil'
    export default {
        data(){
            return{
                activeName:'Employee',
                siderShow:true,
                contentTabs:{
                    tabList:[]
                },
                form:{
                    menus:[
                        {id:4,menuName:'订单管理',menuNum:'0137',iconType:'ios-basket-outline',menuList:[{mName:'TestVue',iconType2:'ios-basket-outline'},{mName:'Employee',iconType2:'ios-basket-outline'}]},
                        {id:5,menuName:'魔方应用',menuNum:'0138',iconType:'md-cube',menuList:[{mName:'UploadFile',iconType2:'md-cube'},{mName:'QueryImage',iconType2:'md-cube'},{mName:'MarkdownEdit',iconType2:'md-cube'}]}
                        // {id:6,menuName:'应用管理',menuNum:'0138',iconType:'ios-keypad',menuList:[{mName:'菜单42号',iconType2:'ios-keypad-outline'},{mName:'菜单31号',iconType2:'ios-keypad-outline'}]},
                        // {id:7,menuName:'盒子管理',menuNum:'0138',iconType:'ios-list-box-outline',menuList:[{mName:'菜单43号',iconType2:'ios-list-box-outline'},{mName:'菜单32号',iconType2:'ios-list-box-outline'}]},
                        // {id:8,menuName:'浏览管理',menuNum:'0138',iconType:'ios-browsers',menuList:[{mName:'菜单44号',iconType2:'ios-browsers-outline'},{mName:'菜单33号',iconType2:'ios-browsers-outline'}]},
                        // {id:10,menuName:'用户管理',menuNum:'0138',iconType:'md-person',menuList:[{mName:'菜单45号',iconType2:'ios-person-outline'},{mName:'菜单34号',iconType2:'ios-person-outline'}]},
                        // {id:9,menuName:'设置管理',menuNum:'0139',iconType:'ios-settings',menuList:[{mName:'菜单56号',iconType2:'ios-settings-outline'},{mName:'菜单61号',iconType2:'ios-settings-outline'}]}
                    ]
                }
            }
        },
        created(){

        },
        methods:{
            quit(){
                this.$Modal.confirm({
                    title: "警告",
                    content: '<p>确定要退出登录吗？</p>',
                    onOk: () => {
                        this.$axios.post("/login/quitLogin").then(response => {
                            let data = response.data;
                            delCookie("token");
                            delCookie("refreshToken");
                            this.$router.replace({
                                path:'/Login'                            
                            });
                        });    
                    }
                });
            },
            jumpIndex(){
                this.$router.push({ path: 'TestVue2' });  
                this.activeName = 'ssss';
            },
            changeTab(name){
                var breakFlag = false;
                this.contentTabs.tabList=[];
                for(var i=0;i<this.form.menus.length;i++){
                    var menuList = this.form.menus[i].menuList;
                    for(var j=0;j<menuList.length;j++){
                        if(menuList[j].mName == name){
                            var myobj={
                                name:this.form.menus[i].menuName
                            }
                            this.contentTabs.tabList.push(myobj);  
                            var myobj1={
                                name:name
                            }
                            this.contentTabs.tabList.push(myobj1);
                            breakFlag = true;
                            break;  
                        }
                    } 
                    if(breakFlag){break;}
                }
                this.$router.push({ path: name });
            }
        }       
    }
</script>
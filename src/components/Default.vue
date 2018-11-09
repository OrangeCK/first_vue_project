<template>
    <div class="layout" style="min-width:1200px;">
        <Sider :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}">
            <Menu theme="dark" width="auto"  @on-select="changeTab">
                <div class="menuTop">
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
        <Layout :style="{marginLeft: '200px'}">
            <div>
            <Header :style="{background: '#fff',position: 'fixed', width: '100%', boxShadow: '0 2px 3px 2px rgba(0,0,0,.3)'}">
                <div class="topBox">
                    <img src="../assets/logo.png" /> 
                    <label>综合物料管理平台</label>
                    <div class="userInfo">
                        <img src="../assets/user.png" /> 
                        <label style="font-weight: normal;">橙子味栗子</label>
                    </div>
                </div> 
            </Header>
            </div>
            <div>
            <Content :style="{padding: '60px 16px 16px 16px'}">
                <Breadcrumb :style="{margin: '16px 0'}">
                    <BreadcrumbItem v-for="(tab,index) in contentTabs.tabList" :key="index">{{tab.name}}</BreadcrumbItem>
                </Breadcrumb>
                <Card :style="{position: 'static'}">
                    <div style="height: 1200px; ">
                        <router-view />
                    </div>
                </Card>
            </Content>
            </div>
            
        </Layout>
    </div>
</template>
<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .topBox {
        width: 100%;
        height: 62px;
        float: left;
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
        margin: 0 200px 0 0;
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
    }
</style>
<script>
    export default {
        data(){
            return{
                contentTabs:{
                    tabList:[]
                },
                form:{
                    menus:[
                        {id:4,menuName:'订单管理',menuNum:'0137',iconType:'ios-basket-outline',menuList:[{mName:'TestVue',iconType2:'ios-basket-outline'},{mName:'TestVue1',iconType2:'ios-basket-outline'}]},
                        {id:5,menuName:'魔方应用',menuNum:'0138',iconType:'md-cube',menuList:[{mName:'菜单41号',iconType2:'md-cube'},{mName:'菜单3号',iconType2:'md-cube'}]},
                        {id:6,menuName:'应用管理',menuNum:'0138',iconType:'ios-keypad',menuList:[{mName:'菜单42号',iconType2:'ios-keypad-outline'},{mName:'菜单31号',iconType2:'ios-keypad-outline'}]},
                        {id:7,menuName:'盒子管理',menuNum:'0138',iconType:'ios-list-box-outline',menuList:[{mName:'菜单43号',iconType2:'ios-list-box-outline'},{mName:'菜单32号',iconType2:'ios-list-box-outline'}]},
                        {id:8,menuName:'浏览管理',menuNum:'0138',iconType:'ios-browsers',menuList:[{mName:'菜单44号',iconType2:'ios-browsers-outline'},{mName:'菜单33号',iconType2:'ios-browsers-outline'}]},
                        {id:10,menuName:'用户管理',menuNum:'0138',iconType:'md-person',menuList:[{mName:'菜单45号',iconType2:'ios-person-outline'},{mName:'菜单34号',iconType2:'ios-person-outline'}]},
                        {id:9,menuName:'设置管理',menuNum:'0139',iconType:'ios-settings',menuList:[{mName:'菜单56号',iconType2:'ios-settings-outline'},{mName:'菜单61号',iconType2:'ios-settings-outline'}]}
                    ]
                }
            }
        },
        created(){

        },
        methods:{
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

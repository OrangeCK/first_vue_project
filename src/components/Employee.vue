<template>
    <div class="testcss">
        <div class="min_tools">
            <div class="tools" ref="tools" :class="{'is_fixed' : isFixed}">
                <Input  placeholder="请输入登录名..." v-model="searchForm.loginName" clearable class="inp"/>
                <Input  placeholder="请输入用户名..." v-model="searchForm.userName" clearable class="inp"/>
                <Select :style="{width: '200px'}">
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Button type="warning" icon="ios-search" @click="searchEmployee(1)">Search</Button>
                <Button type="warning" icon="ios-search" @click="addEmployee">新增</Button>
            </div>
        </div>
        <Divider orientation="left"><h4>查询结果</h4></Divider>
        <div class="content">
            <Table :loading="empTable.loading" ref="selection" :columns="empTable.columns" :data="empTable.datas" class="table"></Table>
            <div style="margin: 10px 10px 0 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="empTable.page.total" :page-size="empTable.page.pageSize" :current="empTable.page.pageIndex" @on-change="searchEmployee"
                        @on-page-size-change="handlePageSize" show-sizer show-total show-elevator/>
                </div>
            </div>
            <Modal v-model="addModal.show" :title="addModal.title" @on-cancel="addModal.show=false">
                <p slot="header" style="color:#f60;text-align:center">
                    <Icon type="ios-information-circle"></Icon>
                    <span>Delete confirmation</span>
                </p>
                <Form :model="addModal.form" ref="addModal.form" :label-width="80">
                    <FormItem label="用户名称">
                        <Input v-model="addModal.form.userName" placeholder="请输入用户名"/>
                    </FormItem>
                    <FormItem label="登录名称">
                        <Input v-model="addModal.form.loginName" placeholder="请输入登录名"/>
                    </FormItem>
                    <FormItem label="用户电话">
                        <Input v-model="addModal.form.phone" placeholder="请输入电话"/>
                    </FormItem>
                    <FormItem label="年龄">
                        <Input v-model="addModal.form.age" placeholder="请输入年龄"/>
                    </FormItem>
                    <FormItem label="性别">
                        <Input v-model="addModal.form.sex" placeholder="请输入性别"/>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="error" size="large" long :loading="modal_loading" @click="del">Delete</Button>
                </div>
                
            </Modal>
        </div>
    </div>
</template>

<style>
/* .table table{
    min-width: 1600px;
} */
.min_tools{
    min-height: 50px;
}
.testcss{
    height: auto;
}
div .tools {
    width: 100%;
    min-height: 50px;
    background: rgb(220, 242, 245);
    padding: 10px 24px 0 24px;
    position: relative;
}
div .is_fixed {
    top: 0px;
    left: 233px;
    right: 33px;
    width: auto;
    position: fixed;
    z-index: 999;   
}
div .inp{
    width: 200px;
}
.content {
    padding: 5px;
    height: 100%;
    overflow:hidden;
}
.modalFooter{
    height: 50px;
    line-height: 50px;
    text-align: center;
}
.modalFooter button{
    margin: 0 20px;
}
.ivu-table .demo-table-info-row td{
        background-color: #2db7f5;
        color: #fff;
    }
.ivu-table .demo-table-error-row td{
    background-color: #ff6600;
    color: #fff;
}
.ivu-table td.demo-table-info-column{
    background-color:#2db7f5;
    color: #fff;
}
.ivu-table td.demo-table-info-column2{
    background-color:#ff6600;
    color: #fff;
}
.ivu-table .demo-table-info-cell-name {
    background-color: #2db7f5;
    color: #fff;
}
.ivu-table .demo-table-info-cell-age {
    background-color: #ff6600;
    color: #fff;
}
.ivu-table .demo-table-info-cell-address {
    background-color: #187;
    color: #fff;
}
</style>
<script>
import {setCookie,getCookie} from '../js/cookieUtil.js'
export default {
        data () {
            return {
                isFixed: false,
                offsetTop:0,
                offsetWidth:0,
                searchForm:{
                    loginName:'',
                    userName:''
                },
                addModal:{
                    show:false,
                    title:'新增用户',
                    form:{
                        userName:'',
                        loginName:'',
                        age:'',
                        sex:'',
                        phone:''
                    }
                },
                empTable:{
                    loading:false,
                    columns:[
                        {
                            "title":"用户名称",
                            "key":"userName"
                        },
                        {
                            "title":"登录名称",
                            "key":"loginName"
                        },
                        {
                            "title":"年龄",
                            "key":"age"
                        },
                        {
                            "title":"性别",
                            "key":"sex"
                        },
                        {
                            "title":"用户电话",
                            "key":"userPhone"
                        },
                        {
                            "title":"操作",
                            "key":"",
                            render:(h, params) => {
                                return h('div',[
                                    h('Button', {
                                        props: {
                                            type: 'warning',
                                            size: 'default',
                                            ghost: true,
                                            icon: 'ios-create-outline'
                                        },
                                        style: {
                                            padding: '5px 10px 5px 10px'
                                        },
                                        on: {
                                            click: () => {
                                                this.editUserModel(params.index);
                                            }
                                        }
                                    }, '编辑'),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'default',
                                            ghost: true,
                                            icon: 'ios-trash-outline'
                                        },
                                        style: {
                                            padding: '5px 10px 5px 10px'
                                        },
                                        on: {
                                            click: () => {
                                                this.editUserModel(params.index);
                                            }
                                        }
                                    }, '删除')   
                                ])
                            }
                        }
                    ],
                    datas:[
                    ],
                    page:{
                        pageIndex:1,
                        pageSize:10,
                        total:0
                    } 
                },
                cityList: [
                    {
                        value: 'New York',
                        label: 'New York'
                    }
                ]                
            }
        },
        created(){

        },
        mounted(){
            window.addEventListener('scroll', this.handleScroll);
            this.$nextTick(function(){
                this.offsetTop = $(".tools").offset().top;
            });
        },
        destroyed(){
            window.removeEventListener('scroll', this.handleScroll);
        },
        methods: {
            rowClassName (row, index) {
                if (index === 1) {
                    return 'demo-table-info-row';
                } else if (index === 3) {
                    return 'demo-table-error-row';
                }
                return '';
            },
            handleScroll(){
                var scrollTop =  window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                this.isFixed = scrollTop > this.offsetTop ? true : false;
            },     
            handleSelectAll (status) {
                this.$refs.selection.selectAll(status);
            },
            handlePageSize(pageSize){
                this.empTable.page.pageSize = pageSize;
                this.searchEmployee(1);
            },
            searchEmployee(page){
                this.empTable.loading = true;
                this.$axios.post('/employee/employeePageList',{
                    'loginName':this.searchForm.loginName,
                    'userName':this.searchForm.userName,
                    'page':page,
                    'rows':this.empTable.page.pageSize
                }).then(response => {
                    var data = response.data;
                    console.log(response);
                    this.empTable.datas = data.rows;
                    this.empTable.page.total = data.total;
                    this.empTable.loading = false;
                });  
            },
            addEmployee(){
                this.addModal.show = true;
            },
            cancelEmployee(){
            }
        }
    }
</script>

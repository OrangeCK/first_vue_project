<template>
    <div>
        <div class="tools">
            <Input type="text" v-model="userManageTable.searchParam.userName" placeholder="用户名称" style="width:200px;"></Input>
            <Input type="text" v-model="userManageTable.searchParam.pointRegionCode" placeholder="网点代码" style="width:200px;margin-left:20px;"></Input>
            <Input type="text" v-model="userManageTable.searchParam.jobNumber" placeholder="工号" style="width:200px;margin-left:20px;"></Input>
            <Button type="primary" icon="ios-search" style="margin-left:24px;width:70px;" @click="getUserDatas(1)">查询</Button>
            <Button icon="md-add-circle" style="margin-left:10px;width:70px;" @click="openAddModal">新增</Button>
        </div>
        
        <div class="content">
            <Table :loading="userManageTable.table.loading" stripe border :columns="userManageTable.table.columns" :data="userManageTable.table.datas"></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page ref="page" :total="userManageTable.table.page.total" :page-size="userManageTable.table.page.pageSize" :current="userManageTable.table.page.pageIndex" @on-change="changePageUserDataTable" show-elevator show-total/>
                </div>
            </div>
            <Modal footer-hide v-model="userManageTable.modal.show" :title="userManageTable.modal.title" @on-cancel="cancelUserDataTable('userManageTable.form')" width="400">
                <Form :model="userManageTable.form" ref="userManageTable.form" :rules="userManageTable.ruleValidate" :label-width="80" style="margin-right:40px;">
                    <FormItem label="用户名称" prop="userName">
                        <Input v-model="userManageTable.form.userName" placeholder="请输入用户名"/>
                    </FormItem>
                    <FormItem label="用户工号" prop="jobNumber">
                        <Input v-model="userManageTable.form.jobNumber" placeholder="请输入工号"/>
                    </FormItem>
                    <FormItem label="角色" prop="roleCode">
                        <Select v-model="userManageTable.form.roleCode" placeholder="请选择角色" @on-change="enablePointRegion">
                            <Option  :value="b.roleCode" v-for="b in userManageTable.form.roleList" :key="b.roleCode">{{b.roleName}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="联系电话" prop="phoneNumber">
                        <Input v-model="userManageTable.form.phoneNumber" placeholder="请输入联系电话"/>
                    </FormItem>
                    <FormItem label="网点名称" prop="pointRegionCode">
                        <Select :disabled="userManageTable.form.enableFlag" v-model="userManageTable.form.pointRegionCode" placeholder="查询并选择网点" filterable remote :remote-method="remoteMethod" :loading="userManageTable.form.loading">
                            <Option :value="p.pointRegionCode" v-for="p in userManageTable.form.options" :key="p.pointRegionCode">{{p.pointRegionName}}</Option>
                        </Select>
                    </FormItem>
                </Form>
                <div class="modalFooter">
                    <Button icon="ios-undo" @click="cancelUserDataTable('userManageTable.form')">取消</Button>
                    <Button icon="ios-paper-outline" type="primary" @click="saveUserDataTable('userManageTable.form')">保存</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<style>
.tools {
    width: 100%;
    min-height: 76px;
    background: #fff;
    padding: 20px 24px 0 24px;
}
.content {
    margin-top:22px;
    padding: 20px;
    height: 100%;
    background: #fff;
}
.modalFooter{
    height: 50px;
    line-height: 50px;
    text-align: center;
}
.modalFooter button{
    margin: 0 20px;
}

</style>

<script>
export default {
        data () {
            return {
                userManageTable:{
                    searchParam:{
                        userName:'',
                        pointRegionCode:'',
                        pointRegionName:'',
                        jobNumber:''
                    },
                    modal:{
                        id:0,
                        title:'新增用户',
                        show:false
                    },
                    form:{
                        id:0,
                        userName:'',
                        loading:false,
                        jobNumber:'',
                        roleCode:'',
                        phoneNumber:'',
                        pointRegionCode:'',
                        roleList:[],
                        pointRegionList:[],
                        options:[],
                        enableFlag:false
                    },
                    ruleValidate:{
                        userName:[
                            {
                                required: true, message: '用户名称不能为空', trigger: 'blur'
                            }
                        ],
                        jobNumber:[
                            {
                                required: true, message: '工号不能为空', trigger: 'blur'
                            }
                        ],
                        roleCode:[
                            {
                                required: true, message: '角色不能为空', trigger: 'change'
                            }
                        ],
                        phoneNumber:[
                            {
                                required: true, message: '联系电话不能为空', trigger: 'blur'
                            }
                        ]
                    },
                    table:{
                        loading:false,
                        columns:[
                            {
                                "title":"用户名称",
                                minWidth:150,
                                "key":"userName"
                            },
                            {
                                "title":"网点代码",
                                minWidth:150,
                                "key":"pointRegionCode"
                            },
                            {
                                "title":"网点名称",
                                minWidth:150,
                                "key":"pointRegionName"
                            },
                            {
                                "title":"工号",
                                minWidth:150,
                                "key":"jobNumber"
                            },
                            {
                                "title":"角色",
                                minWidth:150,
                                "key":"roleName"
                            },
                            {
                                "title":"联系电话",
                                minWidth:150,
                                "key":"phoneNumber"
                            },
                            {
                                "title":"操作",
                                minWidth:150,
                                "align":"center",
                                "key":"",
                                render: (h, params) => {
                                    return h('div', [
                                        h('Button', {
                                            props: {
                                                type: 'text',
                                                size: 'large',
                                                icon: 'ios-create-outline'
                                            },
                                            on: {
                                                click: () => {
                                                    this.editUserModel(params.index);
                                                }
                                            }
                                        }, ''),
                                        h('Button', {
                                            props: {
                                                type: 'text',
                                                size: 'large',
                                                icon: 'ios-trash'
                                            },
                                            on: {
                                                click: () => {
                                                    this.confirm(params.index);
                                                }
                                            }
                                        }, '')
                                    ]);
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

                    }
                }
            }
        },
        created(){
            this.getUserDatas(1);
            this.getRoleLists();
            this.searchPointRegion();
        },
        methods:{
            changePageUserDataTable(num){
                this.getUserDatas(num)
            },
            openAddModal(){
                this.userManageTable.modal.title='新增用户';
                this.userManageTable.modal.show=true;
            },
            resetForm(){
                this.userManageTable.form.id='',
                this.userManageTable.form.userName='',
                this.userManageTable.form.roleCode='',
                this.userManageTable.form.phoneNumber='',
                this.userManageTable.form.jobNumber='',
                this.userManageTable.form.pointRegionCode='',
                this.userManageTable.form.options=[],
                this.userManageTable.form.enableFlag=false
            },
            enablePointRegion(){
                if(this.userManageTable.form.roleCode === 'user' || this.isEmptyOrUndefined(this.userManageTable.form.roleCode)){
                    this.userManageTable.form.enableFlag=false;
                }else{
                    this.userManageTable.form.pointRegionCode='';
                    this.userManageTable.form.enableFlag=true;
                }
            },
            isEmptyOrUndefined(obj){
                return (obj == null || obj == undefined || obj == '' || obj.length == 0) ? true : false ;
            },
            remoteMethod(query){
                if(query !== ''){
                    this.userManageTable.form.loading=true;
                    setTimeout(() => {
                        this.userManageTable.form.loading = false;
                        const list = this.userManageTable.form.pointRegionList.map(item => {
                            return {
                                pointRegionCode: item.pointRegionCode,
                                pointRegionName: item.pointRegionName
                            };
                        });
                        this.userManageTable.form.options = list;
                    }, 200);
                }else{
                    this.userManageTable.form.options=[];
                }
            },
            getRoleLists(){
                this.$axios.post('systemManage/listRoles').then(response => {
                    var data = response.data;console.log(data);
                    this.userManageTable.form.roleList = data;
                });    
            },
            searchPointRegion(){
                this.$axios.post('systemManage/listPointRegions',{
                    'regionType':'point'
                }).then(response => {
                    var data = response.data;console.log(data);
                    this.userManageTable.form.pointRegionList = data;
                });
            },
            deleteUser(index){
                this.$axios.post('systemManage/deleteEmployee?id='+this.userManageTable.table.datas[index].id).then(response => {
                    var data = response.data;console.log(data);
                    if(data != undefined){
                        if(data.status){
                            this.$Message.success({
                                content: '删除成功',
                                duration: 3
                            });
                        }else if(data.msg != ''){
                            this.$Message.error({
                                content: data.msg,
                                duration: 3
                            });
                        }else{
                           this.$Message.error({
                                content: '删除失败',
                                duration: 3
                            }); 
                        }
                    }else{
                        this.$Message.error({
                                content: '删除失败',
                                duration: 3
                            });
                    }
                    this.getUserDatas(1);
                });
            },
            editUserModel(index){
                this.userManageTable.modal.title = "编辑用户";
                this.$axios.post('systemManage/findEmployeeDetail?id='+this.userManageTable.table.datas[index].id).then(response => {
                    var data = response.data;console.log(data);
                    this.userManageTable.form.id = data.id;
                    this.userManageTable.form.userName = data.userName;
                    this.userManageTable.form.pointRegionCode = data.pointRegionCode;
                    this.userManageTable.form.jobNumber = data.jobNumber;
                    this.userManageTable.form.roleCode = data.roleCode;
                    this.userManageTable.form.phoneNumber = data.phoneNumber;
                    this.userManageTable.modal.show=true;
                    if(this.userManageTable.form.roleCode === 'user' || this.isEmptyOrUndefined(this.userManageTable.form.roleCode)){
                        this.userManageTable.form.enableFlag=false;
                    }else{
                        this.userManageTable.form.pointRegionCode='';
                        this.userManageTable.form.enableFlag=true;
                    }
                });    
            },
            saveUserDataTable(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$axios.post('systemManage/saveEmployee',{
                            'id':this.userManageTable.form.id,
                            'userName':this.userManageTable.form.userName,
                            'roleCode':this.userManageTable.form.roleCode,
                            'phoneNumber':this.userManageTable.form.phoneNumber,
                            'jobNumber':this.userManageTable.form.jobNumber,
                            'pointRegionCode':this.userManageTable.form.pointRegionCode
                        }).then(response => {
                            var data = response.data;console.log(data);
                            if(data != undefined){
                                if(data.status){
                                    this.$Message.success({
                                        content: '保存成功',
                                        duration: 3
                                    });
                                }else if(data.msg != ''){
                                    this.$Message.error({
                                        content: data.msg,
                                        duration: 3
                                    });
                                }else{
                                    this.$Message.error({
                                        content: '保存失败',
                                        duration: 3
                                    });
                                }
                            }else{
                                this.$Message.error({
                                        content: '保存失败',
                                        duration: 3
                                    }); 
                            }
                            this.getUserDatas(1);
                            this.$refs[name].resetFields();
                            this.userManageTable.modal.show=false;
                        });
                    } 
                })
            },
            cancelUserDataTable(name){
                this.$refs[name].resetFields();
                this.resetForm();
                this.userManageTable.modal.show=false;
            },
            getUserDatas(currentPage){
                this.userManageTable.table.loading=true;
                this.$axios.post('systemManage/queryEmployee',{
                    'userName':this.userManageTable.searchParam.userName,
                    'pointRegionCode':this.userManageTable.searchParam.pointRegionCode,
                    'pointRegionName':this.userManageTable.searchParam.pointRegionName,
                    'jobNumber':this.userManageTable.searchParam.jobNumber,
                    'page':currentPage,
                    'rows':this.userManageTable.table.page.pageSize
                }).then(response => {
                    var data = response.data;console.log(data);
                    this.userManageTable.table.datas = data.rows;
                    this.userManageTable.table.page.total = data.total;
                    if(currentPage == 1){
                        this.$refs['page'].currentPage = 1;
                    }
                    this.userManageTable.table.loading=false;
                });
            },
            confirm (index) {
                this.$Modal.confirm({
                    title: '警告',
                    content: '<p>确定要删除工号为 '+this.userManageTable.table.datas[index].jobNumber+' 的用户吗？</p>',
                    onOk: () => {
                        this.deleteUser(index);
                    },
                    onCancel: () => {
                        this.$Message.info('取消删除');
                    }
                });
            }
        }
    }
</script>

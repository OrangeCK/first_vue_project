<template>
    <div>
        <div class="min_tools">
            <div class="tools" ref="tools" :class="{'is_fixed' : isFixed}">
                <Input  placeholder="请输入标题..." v-model="searchForm.title" clearable class="inp"/>
                <Input  placeholder="请输入类别..." v-model="searchForm.category" clearable class="inp"/>
                <Button type="warning" icon="ios-search" @click="searchImage(1)">Search</Button>
            </div>
        </div>
        <Divider orientation="left"><h4>查询结果</h4></Divider>
        <div class="content">
            <Table :loading="imageTable.loading" :columns="imageTable.columns" ref="selection" :data="imageTable.datas" ></Table>
            <div style="margin: 10px 10px 0 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="imageTable.page.total" :page-size="imageTable.page.pageSize" :current="imageTable.page.pageIndex" @on-change="searchImage"
                        @on-page-size-change="handlePageSize" show-sizer show-total show-elevator/>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.table table{
    min-width: 1600px;
}
.min_tools{
    min-height: 50px;
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

</style>
<script>
import {isEmptyOrUndefined} from '../js/util'
export default {
        data () {
            return {
                isFixed: false,
                offsetTop:0,
                offsetWidth:0,
                searchForm:{
                    title:'',
                    category:''
                },
                imageTable:{
                    loading:false,
                    columns:[
                        {
                            "title":"标题",
                            "key":"title"
                        },
                        {
                            "title":"概要",
                            "key":"outline"
                        },
                        {
                            "title":"类别",
                            "key":"category"
                        },
                        {
                            "title":"正文",
                            "key":"content",
                            tooltip:true
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
                                                this.editImage(params.row.id);
                                            }
                                        }
                                    }, 'Edit'),
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
                                                this.disableImage(params.row.id);
                                            }
                                        }
                                    }, 'Disable')   
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
                }
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
            handleScroll(){
                var scrollTop =  window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                this.isFixed = scrollTop > this.offsetTop ? true : false;
            },     
            handleSelectAll (status) {
                this.$refs.selection.selectAll(status);
            },
            handlePageSize(pageSize){
                this.imageTable.page.pageSize = pageSize;
                this.searchImage(1);
            },
            // 提示信息
            tipMessage(type,msg){
                switch(type){
                    case 'info':
                        this.$Message.info({
                            content: msg,
                            duration: 5
                        });
                        break;
                    case 'warning':
                        this.$Message.warning({
                            content: msg,
                            duration: 5
                        });
                        break;
                    case 'success':
                        this.$Message.success({
                            content: msg,
                            duration: 5
                        });
                        break;
                    case 'error':
                        this.$Message.error({
                            content: msg,
                            duration: 5
                        });
                        break;
                }
            },
            searchImage(page){
                this.imageTable.loading = true;
                this.$axios.post('/image/imagePageList',{
                    'title':this.searchForm.title,
                    'category':this.searchForm.category,
                    'page':page,
                    'rows':this.imageTable.page.pageSize
                }).then(response => {
                    var data = response.data;
                    this.imageTable.datas = data.rows;
                    this.imageTable.page.total = data.total;
                    this.imageTable.loading = false;
                });  
            },
            editImage(id){
                this.$router.push({
                    name: 'UploadFile',
                    params: {
                        id: id
                    }
                });
            },
            disableImage(id){
                if(isEmptyOrUndefined(id)){
                    this.tipMessage("warning", "删除的id不存在");
                }else{
                    this.$Modal.confirm({
                        title: "警告",
                        content: '<p>确定要删除数据吗？</p>',
                        onOk: () => {
                            this.$axios.post("/image/disableImage?id="+id).then(response => {
                                let data = response.data;
                                if(data.status == 'succ'){
                                    this.tipMessage("info","操作成功");
                                    this.searchImage(1);
                                }else{
                                    this.tipMessage("error",data.msg);
                                }
                            });    
                        }
                    });
                }
            }
        }
    }
</script>

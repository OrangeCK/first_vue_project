<template>
    <div class="ssssdds">
        <div class="min_tools">
            <div class="tools" ref="tools" :class="{'is_fixed' : isFixed}">
                <Input  placeholder="请输入你的查询条件..." clearable class="inp"/>
                <Input  placeholder="请输入你的查询条件..." clearable class="inp"/>
                <Select :style="{width: '200px'}">
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Button type="warning" icon="ios-search" @click="searchEmployee(1)">Search</Button>
            </div>
        </div>
        <Divider orientation="left"><h4>查询结果</h4></Divider>
        <div class="content">
            <Table ref="selection" class="table"></Table>
            <div style="margin: 10px 10px 0 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="100" show-sizer show-elevator/>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.table table{
    min-width: 1600px;
}
.min_tools{
    min-height: 50px;
}
.ssssdds{
    height: auto;
}
div .tools {
    width: 100%;
    min-height: 50px;
    background: rgb(220, 242, 245);
    /* background-color: #c5e0f5; */
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
export default {
        data () {
            return {
                isFixed: false,
                offsetTop:0,
                offsetWidth:0,
                empTable:{
                    loginName:'',
                    userName:'',
                    age:'',
                    sex:'',
                    userPhone:''
                },
                cityList: [
                    {
                        value: 'New York',
                        label: 'New York'
                    },
                    {
                        value: 'London',
                        label: 'London'
                    },
                    {
                        value: 'Sydney',
                        label: 'Sydney'
                    },
                    {
                        value: 'Ottawa',
                        label: 'Ottawa'
                    },
                    {
                        value: 'Paris',
                        label: 'Paris'
                    },
                    {
                        value: 'Canberra',
                        label: 'Canberra'
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
            searchEmployee(page){
                this.$axios.post('/employee/employeePageList',{
                    // loginName:'',
                    // password:'',
                }).then(response => {
                    console.log(response);
                });  
            }
        }
    }
</script>

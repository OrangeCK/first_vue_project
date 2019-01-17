<template>
    <div>
        <Divider orientation="left"><h4>填写信息</h4></Divider>
        <div class="content">
            <Form :model="formItem" :label-width="80">
                <!-- <FormItem style="text-align: right">
                    
                </FormItem> -->
                <FormItem label="标题：" >
                    <Input v-model="formItem.title" placeholder="请输入标题..." class="inp"></Input>
                    <Button style="float:right;" v-if="formItem.id == null || formItem.id == ''" type="warning" @click="submitImage" :style="{width:'100px'}">新增</Button>
                    <Button style="float:right;" v-if="formItem.id != null && formItem.id != ''" type="warning" @click="updateImage" :style="{width:'100px'}">保存</Button>
                    <Button style="margin-right: 8px;float:right;" @click="resetImage" :style="{width:'100px'}">Reset</Button>
                </FormItem>
                <FormItem label="分类：" >
                    <Select v-model="formItem.category" class="inp">
                        <Option value="beijing">Beijing</Option>
                        <Option value="shanghai">Shanghai</Option>
                        <Option value="shenzhen">Chendu</Option>
                    </Select>
                </FormItem>
                <FormItem label="概要：" >
                    <Input v-model="formItem.outline" placeholder="请输入内容概要..."></Input>
                </FormItem>
                <FormItem label="图片：">
                    <Upload
                        multiple
                        :on-success="uploadSuccess"
                        :on-error="uploadFail"
                        :on-remove="removeUpload"
                        :headers="headers"
                        :before-upload="addHeaders"
                        type="drag"
                        name="multipartFile"
                        action="/upload/uploadImg">
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #ffad33"></Icon>
                            <p>Click or drag files here to upload</p>
                        </div>
                    </Upload>
                </FormItem>
                <FormItem label="正文：">
                        <mavon-editor v-model="markdownEdit.value" style="height:500px;" @change="changeData"/>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<style scoped>
.content {
    padding: 5px;
    height: 100%;
}
form .inp{
    width:500px;
}
</style>
<script>
import {setCookie,getCookie,delCookie} from '../js/cookieUtil.js'
import {isEmptyOrUndefined} from '../js/util'
export default {
        data () {
            return {
                markdownEdit:{
                    value: '# 你好'
                },
                headers:{},
                formItem: {
                    id: null,
                    title: '',
                    outline: '',
                    content: '',
                    uploadId: null,
                    category: ''                    
                }              
            }
        },
        created(){
            let id = this.$route.params.id;
            if(!isEmptyOrUndefined(id)){
                this.getImage(id);
            }
        },
        methods: {
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
            uploadSuccess(response){
                let data = response.data;
                if(response.status === 'succ'){
                    this.formItem.uploadId = data.id;
                }
            },
            uploadFail(error){
                this.tipMessage("error", "上传失败");
            },
            removeUpload(response, file){
                let data = response.response.data;
                this.$axios.post('/upload/deleteUploadImg?id=' + data.id).then(rs => {
                    this.formItem.uploadId = null;
                    this.tipMessage("info", "删除成功");
                });  
            },
            changeData(value, render) {
                this.formItem.content = render;
                console.log("render", render);
            },
            getImage(id){
                this.$axios.post('/image/imageDetail?id=' + id).then(rs => {
                    console.log(rs);
                    let data = rs.data;
                    this.formItem.id = data.data.id;
                    this.formItem.title = data.data.title;
                    this.formItem.outline = data.data.outline;
                    this.formItem.category = data.data.category;
                    this.markdownEdit.value = data.data.markdownText;
                    this.formItem.content = data.data.content;
                });
            },
            addHeaders(){
                let token = getCookie("token");
                let refreshToken = getCookie("refreshToken");
                let jsonStr = '{"Authorization":"'+token+'","Refresh_Token":"'+refreshToken+'"}';
                this.headers = JSON.parse(jsonStr);
            },
            submitImage(){
                // 提交之前的校验
                if(!this.checkForm()){
                    return;
                }
                this.$axios.post('/image/addImage',{
                    'title':this.formItem.title,
                    'outline':this.formItem.outline,
                    'content':this.formItem.content,
                    'category':this.formItem.category,
                    'uploadFile':{
                        'id':this.formItem.uploadId
                    }
                }).then(rs => {
                    console.log(rs);
                    let data = rs.data
                    this.formItem.id = data.data.id 
                });
            },
            updateImage(){
                // 更新之前的校验
                if(!this.checkForm()){
                    return;
                }
                this.$axios.post('/image/updateImage',{
                    'id': this.formItem.id,
                    'title':this.formItem.title,
                    'outline':this.formItem.outline,
                    'content':this.formItem.content,
                    'category':this.formItem.category,
                    'uploadFile':{
                        'id':this.formItem.uploadId
                    }
                }).then(rs => {
                    console.log(rs);
                    let data = rs.data
                    this.formItem.id = data.data.id 
                });
            },
            resetImage(){
                this.formItem.title = '';
                this.formItem.outline = '';
                this.formItem.content = '';
                this.formItem.category = '';
            },
            checkForm(){
                if(isEmptyOrUndefined(this.formItem.title)){
                    this.tipMessage("warning", "标题不能为空");
                    return false;
                }
                if(isEmptyOrUndefined(this.formItem.category)){
                    this.tipMessage("warning", "请选择分类");
                    return false;
                }
                if(isEmptyOrUndefined(this.formItem.outline)){
                    this.tipMessage("warning", "请填写概要");
                    return false;
                }
                if(isEmptyOrUndefined(this.formItem.uploadId)){
                    this.tipMessage("warning", "请先上传附件");
                    return false;
                }
                if(isEmptyOrUndefined(this.formItem.content)){
                    this.tipMessage("warning", "请填写正文");
                    return false;
                }
                return true;
            }
            
        }
    }
</script>

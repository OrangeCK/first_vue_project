<template>
    <div>
        <Divider orientation="left"><h4>填写信息</h4></Divider>
        <div class="content">
            <Form :model="formItem" :label-width="80">
                <FormItem label="标题" >
                    <Input v-model="formItem.title" placeholder="请输入标题..." class="inp"></Input>
                </FormItem>
                <FormItem label="分类" >
                    <Select v-model="formItem.category" class="inp">
                        <Option value="beijing">Beijing</Option>
                        <Option value="shanghai">Shanghai</Option>
                        <Option value="shenzhen">Chendu</Option>
                    </Select>
                </FormItem>
                <FormItem label="概要" >
                    <Input v-model="formItem.outline" placeholder="请输入内容概要..."></Input>
                </FormItem>
                <FormItem label="图片">
                    <Upload
                        multiple
                        :on-success="uploadSuccess"
                        :on-remove="removeUpload"
                        type="drag"
                        name="multipartFile"
                        action="/upload/uploadImg">
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #ffad33"></Icon>
                            <p>Click or drag files here to upload</p>
                        </div>
                    </Upload>                
                </FormItem>
                <FormItem label="文件描述">
                    <Input v-model="formItem.content" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="Enter something..."></Input>
                </FormItem>
                <FormItem>
                    <Button type="warning" @click="submitImage">Submit</Button>
                    <Button style="margin-left: 8px">Cancel</Button>
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
import {isEmptyOrUndefined,tipMessage} from '../js/util'
export default {
        data () {
            return {
                formItem: {
                    title: '',
                    outline: '',
                    content: '',
                    uploadId: '',
                    category: ''                    
                }              
            }
        },
        created(){
            
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
            removeUpload(response, file){
                let data = response.response.data;
                this.$axios.post('/upload/deleteUploadImg?id=' + data.id).then(rs => {
                    console.log(rs);
                });  
            },
            submitImage(){
                if(isEmptyOrUndefined(this.formItem.uploadId)){
                    this.tipMessage("warning", "请先上传附件");
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
                });
            },
            
        }
    }
</script>

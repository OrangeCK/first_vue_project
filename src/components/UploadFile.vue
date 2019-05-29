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
                        type="drag"
                        name="multipartFile"
                        action="/orangeblog/aliOss/uploadToOss">
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #ffad33"></Icon>
                            <p>Click or drag files here to upload</p>
                        </div>
                    </Upload>
                </FormItem>
                <FormItem label="正文：">
                        <mavon-editor ref=md v-model="markdownEdit.value" :toolbars="toolbars" style="height:500px;" @change="changeData" @imgAdd="$imgAdd" />
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
                    markdownText:'',
                    imageUrl: null,
                    categoryName: '',
                    categoryId: '',
                },
                toolbars:{
                    bold: true, // 粗体
                    italic: true, // 斜体
                    header: true, // 标题
                    underline: true, // 下划线
                    strikethrough: true, // 中划线
                    mark: true, // 标记
                    superscript: true, // 上角标
                    subscript: true, // 下角标
                    quote: true, // 引用
                    ol: true, // 有序列表
                    ul: true, // 无序列表
                    link: true, // 链接
                    imagelink: true, // 图片链接
                    code: true, // code
                    table: true, // 表格
                    fullscreen: true, // 全屏编辑
                    readmodel: true, // 沉浸式阅读
                    htmlcode: true, // 展示html源码
                    help: true, // 帮助
                    undo: true, // 上一步
                    redo: true, // 下一步
                    trash: false, // 清空
                    save: false, // 保存（触发events中的save事件）
                    navigation: true, // 导航目录
                    alignleft: true, // 左对齐
                    aligncenter: true, // 居中
                    alignright: true, // 右对齐
                    subfield: true, // 单双栏模式
                    preview: true, // 预览
                }           
            }
        },
        created(){
            let id = this.$route.params.id;
            if(!isEmptyOrUndefined(id)){
                this.getImage(id);
            }
            let token = getCookie("token");
            let refreshToken = getCookie("refreshToken");
            let jsonStr = '{"Authorization":"'+token+'","Refresh_Token":"'+refreshToken+'"}';
            this.headers = JSON.parse(jsonStr);
        },
        methods: {
            // markdown中上传图片
            $imgAdd(pos, $file){
                 // 第一步.将图片上传到服务器.
                var formdata = new FormData();
                formdata.append('multipartFile', $file);
                this.$axios({
                    url: '/orangeblog/aliOss/uploadToOss',
                    method: 'post',
                    data: formdata,
                    headers: { 'Content-Type': 'multipart/form-data' },
                }).then(response => {
                    var url = response.data.data;
                    // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                    this.$refs.md.$img2Url(pos, url);
                })
            },
            uploadSuccess(response){
                let data = response.data;
                if(response.success == true){
                    this.formItem.imageUrl = data;
                }
            },
            uploadFail(error){
                this.tipMessage("error", "上传失败");
            },
            removeUpload(response, file){
                let data = response.response.data;
                this.$axios.post('/upload/deleteUploadImg?id=' + data.id).then(rs => {
                    this.formItem.imageUrl = null;
                    this.tipMessage("info", "删除成功");
                });  
            },
            download(id){
                // this.$store.commit('add');
                // this.$axios({ // 用axios发送post请求
                //     method: 'post',
                //     url: '/upload/downloadImg?id='+id, // 请求地址
                //     responseType: 'arraybuffer', 
                //     headers: {
                //         'Content-Type': 'application/json;charset=utf-8'
                //     },
                //     timeout:1000*60*5
                // }).then(rs => {
                //     let blob = new Blob([rs.data]);
                //     let fileName = '下载测试.jpg';
                //     let link = document.createElement('a');
                //     link.download = fileName;
                //     link.style.display = 'none';
                //     link.href = URL.createObjectURL(blob);
                //     document.body.appendChild(link);
                //     link.click();
                //     URL.revokeObjectURL(link.href);
                //     document.body.removeChild(link);
                // })
            },
            changeData(value, render) {
                this.formItem.content = render;
                this.formItem.markdownText = value;
            },
            getImage(id){
                this.$axios.post('/image/imageDetail?id=' + id).then(rs => {
                    let data = rs.data;
                    this.formItem.id = data.data.id;
                    this.formItem.title = data.data.title;
                    this.formItem.outline = data.data.outline;
                    this.markdownEdit.value = data.data.markdownText;
                    this.formItem.content = data.data.content;
                });
            },
            submitImage(){
                // 提交之前的校验
                if(!this.checkForm()){
                    return;
                }
                this.$axios.post('/orangeblog/image/saveImageBlog',{
                    'title':this.formItem.title,
                    'outline':this.formItem.outline,
                    'content':this.formItem.content,
                    'markdownText':this.formItem.markdownText,
                    'categoryName':this.formItem.category,
                    'categoryId':this.formItem.category,
                    'imageUrl': this.formItem.imageUrl
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
                this.formItem.categoryName = '';
                this.formItem.categoryId = '';
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
                if(isEmptyOrUndefined(this.formItem.imageUrl)){
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

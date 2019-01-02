<template>
    <div>
        <Divider orientation="left"><h4>填写信息</h4></Divider>
        <div class="content">
            <Form :model="formItem" :label-width="80">
                <FormItem label="标题" >
                    <Input v-model="formItem.input" placeholder="请输入标题..." class="inp"></Input>
                </FormItem>
                <FormItem label="分类" >
                    <Select v-model="formItem.select" class="inp">
                        <Option value="beijing">New York</Option>
                        <Option value="shanghai">London</Option>
                        <Option value="shenzhen">Sydney</Option>
                    </Select>
                </FormItem>
                <FormItem label="Text">
                    <Upload
                        multiple
                        type="drag"
                        action="//jsonplaceholder.typicode.com/posts/">
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #ffad33"></Icon>
                            <p>Click or drag files here to upload</p>
                        </div>
                    </Upload>                
                </FormItem>
                <FormItem label="文件描述">
                    <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="Enter something..."></Input>
                </FormItem>
                <FormItem>
                    <Button type="warning">Submit</Button>
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
export default {
        data () {
            return {
                formItem: {
                    input: '',
                    select: '',
                    radio: 'male',
                    checkbox: [],
                    switch: true,
                    date: '',
                    time: '',
                    slider: [20, 50],
                    textarea: ''
                }              
            }
        },
        created(){

        },
        methods: {
            
        }
    }
</script>

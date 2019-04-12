<template>
    <div class="aa">
        <mavon-editor v-model="value" style="height:500px;" :defaultOpen="defaultData" @change="changeData"/>
        <!-- <mavon-editor v-html="value" :defaultOpen="defaultData" @change="changeData" /> -->
    </div>
</template>

<script>
export default {
        data () {
            return {
                value: '',
                defaultData: "preview"
            }
        },
        methods: {
            changeData(value, render) {
                console.log("value", value);
                console.log("render", render);
            }
        }
    }
</script>

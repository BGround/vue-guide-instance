<template>
    <div v-show="showDialog" class="formDialog">
        <div v-for="(item, index) in formData" :key="index" class="form">
            <h1>{{item.title}}</h1>
            <input v-model="item.inputValue" class="formInput" @input="checkValiable">
            <p v-show="item.showTip" class="tip">{{item.message}}</p>
        </div>
        <div class="btnContainer">
            <qwui-button type="primary" @click="submit">确定</qwui-button>
            <qwui-button @click="closeDialog">取消</qwui-button>
        </div>
    </div>
</template>

<script>
import QwuiInput from 'components/qwuiBase/qwuiInput/qwuiInput'
import QwuiButton from 'components/qwuiBase/qwuiButton/qwuiButton'
import Vue from 'vue'
export default {
    name: 'qw-form-dialog',
    components: {
        QwuiInput,
        QwuiButton
    },
    created() {
        this.formData = [...this.dataList];
        // this.showDialog = this.isShowDialog;
        // this.formData.forEach((itemValue, index) => {
        //     Vue.set(itemValue, 'inputValue', '');
        // })
    },
    data() {
        return {
            // 表单数据
            formData: [],
            showDialog: false,
            
            isValiabe: false,
        }
    },
    props: {
        // 表单内容列表
        dataList: {
            type: Array,
            default: () => {
                return [
                    {
                        title: '',
                        keyValue: ''
                    }
                ]
            }
        },
        
    },
    methods: {
        submit(event) {
            // console.log(this.checkValiable());
            if(this.checkValiable()){     
                this.$emit('submit', this.formData);
                this.closeDialog();
            } 
        },
        // closeDialog(){
        //     this.formData.forEach((itemValue, index) => {
        //         Vue.set(itemValue, 'inputValue', '');
        //     })
        //     this.selfShowDialog = false
        // },
        closeDialog() {
            this.showDialog = false;
            this.$emit('closeDialog');
        },
        showDialogMethod() {
            this.showDialog = true;
        },
        cancel(){
            this.formData.forEach((itemValue, index) => {
                Vue.set(itemValue, 'inputValue', '');
            });
            this.closeDialog();
        },
        checkValiable() {
            
            let isValid = true;
            this.formData.forEach((data, index) => {
                
                if(data['require']){
                    if(!data['inputValue']){
                        this.$set(data, 'showTip', true);
                        isValid = false;
                    } else {
                        this.$set(data, 'showTip', false);
                        
                    }
                } 
               
            })
            return isValid;
            
        }
    },
    
}
</script>

<style lang="scss" scoped>
@import './qw-form-dialog.scss'
</style>



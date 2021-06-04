<template>
<div class="qwui-form_item qwui-form_item_required qwui-form_item_hasLabel">
    <label class="qwui-form_item_label">{{title}}</label>
    <div class="qwui-form_item_content">
        <date-picker 
            v-model="msg" 
            placeholder="请输入起止时间"
            range-separator="至" 
            format="YYYY-MM-DD HH:mm:ss"
            show-buttons
            clearable
            @confirm="confirm">
        </date-picker>
        <div class="qwui-form_item_error_tip" v-if="showValidate">{{validateMessage}}</div>
    </div>
</div>  
</template>

<script>
import base from '../mixins/base'
import validate from '../mixins/validate'
import datePicker from "vue-datepicker-local"

export default {
    name: 'qwDatePicker',
    components: {
        datePicker
    },
    mixins: [base, validate],
    props: {
        EVENT_BUS: {
            type: Object,
            required: true
        },
        objVal: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            keyName: 'date',
            title: '评分时间',
            validateState: '',
            validateMessage: '',
            rule: {
                name: {
                    type: 'array',
                    required: true,
                    length: 2,
                    message: '时间不能为空'
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.handleBulr();
        })
    },
    methods: {
        handleBulr() {
            let inputEle = document.querySelector('.datepicker input');
            inputEle.onblur = () => {
                this.confirm();
            }
        },
        confirm() {
            let promise = this.validate().then(obj => {
                            if(obj.status){
                                let endDate = new Date(this.msg[1]);
                                let nowDate = new Date()
                                if(endDate <= nowDate){
                                    this.validateState = 'error';
                                    this.validateMessage = '评分结束时间不能早于当前系统时间';
                                    return {
                                        title: this.keyName,
                                        status: false
                                    }
                                }else {
                                    this.validateState = '';
                                    this.validateMessage = '';
                                    return {
                                        title: this.keyName,
                                        status: true
                                    }
                                }
                            }else {
                                return {
                                    title: this.keyName,
                                    status: false
                                }
                            }
                        })
            return promise
        }
    }
}
</script>

<style lang="scss">
.qwui-form_item_content /deep/ .datepicker-range {
    line-height: initial;
    min-width: 340px;
    .datepicker-popup {
        box-sizing: content-box;
    }
}
</style>
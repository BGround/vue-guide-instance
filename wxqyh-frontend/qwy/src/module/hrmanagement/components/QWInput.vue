<template>
<div class="qwui-form_item qwui-form_item_required qwui-form_item_hasLabel">
    <label class="qwui-form_item_label">{{title}}</label>
    <div class="qwui-form_item_content">
        <div class="qwui-input_wrapper">
            <div class="qwui_input_box">
                <input type="text" class="qwui_input" placeholder="如“经理晋升考核、业务能力考核"
                       v-model='msg' @blur="handleBlur">
                <span class="qwui_input_length">{{msg.length}} / 50</span>
            </div>
        </div>
        <div class="qwui-form_item_error_tip" v-if="showValidate">{{validateMessage}}</div>
    </div>
</div>
</template>

<script>
import base from '../mixins/base'
import validate from '../mixins/validate'

export default {
    name: 'qwInput',
    mixins: [base, validate],
    props: {
        EVENT_BUS: {
            type: Object,
            required: true
        },
        objVal: {
            type: String,
            required: true
        },
        keyName: {
            type: String,
            required: false
        },
        title: {
            type: String,
            required: false
        }
    },
    data() {
        return {
            rule: {
                name:{
                    "required": true,
                    "max": 50,
                    "message": "标题不能为空",
                }
            },
            validateState: '',
            validateMessage: ''
        }
    },
    watch: {
        msg(newVal) {
            if(newVal.length>50){
                this.msg = this.msg.substring(0, 50);
            }
        }
    },
    methods: {
        handleBlur() {
            this.validate();
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../style/qwInput'
</style>

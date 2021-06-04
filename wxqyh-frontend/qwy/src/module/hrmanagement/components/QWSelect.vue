<template>
<div class="qwui-form_item qwui-form_item_required qwui-form_item_hasLabel">
    <label class="qwui-form_item_label">{{title}}</label>
    <div class="qwui-form_item_content">
        <select v-model="msg" class="qwui-select" placeholder="请选择">
            <option v-for="option in selectTemplate" :value="option.id" :key="option.id" :selected="option.id == msg" :disabled="option.disabled">
                {{ option.name }}
            </option>
        </select>
        <div class="qwui-form_item_error_tip" v-if="showValidate">{{validateMessage}}</div>
    </div>
</div> 
</template>

<script>
import base from '../mixins/base'
import validate from '../mixins/validate'
export default {
    name: 'qwSelect',
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
        selectTemplate: {
            type: Array,
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
                    "message": "模板不能为空"
                }
            },
            validateState: '',
            validateMessage: ''
        }
    }
}
</script>

<style lang="scss" scoped>
.qwui-select {
    width: 340px;
    height: 100%;
    padding: 7px 54px 6px 12px;
    border-radius:2px;
    border:1px solid rgba(213,213,213,1);
}
</style>
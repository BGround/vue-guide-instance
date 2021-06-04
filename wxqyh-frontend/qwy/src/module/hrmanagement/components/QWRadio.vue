<template>
<div class="qwui-form_item qwui-form_item_required qwui-form_item_hasLabel">
    <label class="qwui-form_item_label">{{radioObj.title}}</label>
    <div class="qwui-form_item_content">
        <div class="qwui-radio_group">
            <label v-for="item in radioObj.options"
                   :key="item.value"
                   class="qwui-radio_wrapper"
                   @change="handleChange(keyName, $event.target.value)"
            >
                <span :class="['qwui-radio', { 'qwui-radio_checked' : item.value === msg }]">
                    <span class="qwui-radio_inner"></span>
                    <input type="radio" class="qwui-radio_input" :value="item.value" v-model="msg">
                </span>
                {{ item.label }}
            </label>
        </div>
    </div>
</div> 
</template>

<script>
import base from '../mixins/base'
import validate from '../mixins/validate'
export default {
    name: 'qwRadio',
    mixins: [base, validate],
    props: {
        EVENT_BUS: {
            type: Object,
            required: true
        },
        objVal: {
            type: Number,
            required: true
        },
        radioObj: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
        }
    },
    computed: {
        keyName() {
            return this.radioObj.keyName
        }
    },
    methods: {
        handleChange(keyName, value) {
            this.asyncValidate();
            this.EVENT_BUS.$emit('on-radio-change',keyName,value);
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../style/qwRadio'
</style>
<template>
<div class="qwui-form_item qwui-form_item_required qwui-form_item_hasLabel">
    <label class="qwui-form_item_label">{{title}}</label>
    <div class="qwui-form_item_content">
        <choosePerson
            :EVENT_BUS="EVENT_BUS"
            :keyName="keyName"
            :objVal="objVal"
            :leaveWeight="leaveWeight"
            :orderStatus="orderStatus"
            :disableSelfSel="disableSelfSel"
        ></choosePerson>
        <div class="qwui-form_item_error_tip" v-if="showErrorTip">{{ validateMessage }}</div>
    </div>
</div>
</template>

<script>
import choosePerson from './choosePerson'
export default {
    name: 'markPersonList',
    components: {
        choosePerson
    },
    props: {
        EVENT_BUS: {
            type: Object,
            required: true
        },
        keyName: {
            type: String,
            required: false
        },
        objVal: {
            type: Array,
            required: false
        },
        leaveWeight: {
            type: Number,
            required: true
        },
        orderStatus: {
            type: Number,
            required: true
        },
        disableSelfSel: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            title: '评分人',
            showErrorTip: false,
            validateMessage: '',
            personList: []
        }
    },
    created() {
        this.EVENT_BUS.$on('on-show-errror-tip',message => {
            if(message){
                this.showErrorTip = true;
            }else {
                this.showErrorTip = false;
            }
            this.validateMessage = message;
        })
    }
}
</script>

<style lang="scss" scoped>
</style>

<template>
<div class="qwui-form_item qwui-form_item_hasLabel">
    <label class="qwui-form_item_label">备注</label>
    <div class="qwui-form_item_content">
        <div class="textarea_box">
            <textarea v-model="msg" class="qwui_textarea" placeholder="仅后台可见" maxlength="255"></textarea>
            <span class="qwui_textarea_length">{{ msg.length }} / 255</span>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'qwTextarea',
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
            required: true
        }
    },
    computed: {
        msg: {
            get: function() {
                return this.objVal
            },
            set: function(value) {
                this.$props.EVENT_BUS.$emit('on-set-form-data', {
                    key: this.keyName,
                    value
                });
            }
        }
    },
    data() {
        return {
        }
    }
}
</script>

<style lang="scss" scoped>
.textarea_box{
    display: inline-block;
    position: relative;
    vertical-align: middle;
    width: 340px;
    height: 120px;
    padding: 7px 8px 24px 12px;
    border-radius:2px;
    border:1px solid rgba(213,213,213,1);
    line-height: initial;
    .qwui_textarea {
        width: 100%;
        height: 100%;
        color: rgb(51, 51, 51);
        border: none;
        resize: none;
        outline: none;
    }
    .qwui_textarea_length {
        display: inline-block;
        position: absolute;
        right: 8px;
        bottom: 8px;
        font-size: 12px;
        color: #999;
    }
}
</style>

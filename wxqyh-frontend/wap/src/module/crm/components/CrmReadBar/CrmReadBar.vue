/** 
  *  @params readMsg(默认:'',必填)：未阅信息文字
  *  @params totalMsg(默认:'',必填)：统计信息文字
  *  @params notReadCount (默认:0,必填)：未阅数量
  *  @params isRead(默认:'',必填)：是否已阅
  *  @params checkReadMsg：查看未阅信息回调函数
  *  @params signRead：标记已阅回调函数
  *  @example
        <crm-read-bar 
                :readMsg="readMsg"
                @checkReadMsg="checkReadMsg"
                @signRead="signRead"
            >
        </crm-read-bar>
  */
<template>
    <div class="crm_read_bar_wrap">
        <div class="crm_read_bar">
            <div class="read_msg">
                <span class="read_msg_span">{{totalMsg}}</span>
            </div>
            <div class="sign_read_wrap">
                <span class="sign_read sign_read_null" v-if="notReadCount === 0">{{readMsg}}</span>
                <span class="sign_read sign_read_dis" v-else @click="isRead ? checkReadMsg() : signRead()">{{readMsg}}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'CrmReadBar',
    props: {
        // 未阅信息数量
        readMsg: {
            type: String,
            default: '',
            required: true
        },
        // 统计数据
        totalMsg: {
            type: String,
            default: '',
            required: true
        },
        // 是否已阅
        isRead: {
            type: Boolean,
            default: true,
            required: true
        },
        notReadCount: {
            type: Number,
            default: true,
            required: true
        },
    },
    methods: {
        // 查看未阅信息
        checkReadMsg () {
            this.$emit('checkReadMsg');
        },

        // 标记已阅
        signRead () {
            this.$emit('signRead');
        }
    }
}
</script>
<style lang="scss" scoped>
@import './CrmReadBar.scss';
</style>


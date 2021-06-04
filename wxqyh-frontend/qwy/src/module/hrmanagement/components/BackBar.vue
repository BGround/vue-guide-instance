
<template>
<div class="qwui-backBar">
    <span class="backBar_icon" @click="handleClick"></span>
    <span class="backBar_before">评分考核&nbsp;&nbsp;/&nbsp;&nbsp;</span>
    <span class="backBar_current">{{ editText }}</span>
</div>
</template>

<script>
export default {
    name: 'backBar',
    props: {
        editText: {
            type: String,
            required: true
        }
    },
    methods: {
        handleClick() {
            this.$emit('goBack')
        }
    }
}
</script>

<style lang="scss" scoped>
.qwui-backBar {
    height: 40px;
    line-height: 40px;
    font-size: 0;/*防止行内块级元素水平方向上的默认间距 */
    .backBar_icon {
        display: inline-block;
        position: relative;
        top: 4px;
        width: 21px;
        height: 19px;
        background: url(~assets/images/ic_back.png) no-repeat center/21px 19px;
        cursor: pointer;
    }
    span:nth-child(n+2) {
        display: inline-block;
        font-size: 14px;
        &.backBar_before {
            margin-left: 19px;
            color: #999;
        }
        &.backBar_current {
            color: #333;
        }
    }
}
</style>

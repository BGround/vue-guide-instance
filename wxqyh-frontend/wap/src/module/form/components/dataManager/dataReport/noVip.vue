<template>
    <div class="noVip">
        <div class="img">
            <img class="img" src="~assets/images/img_VIP.png" >
        </div>
        <div class="title">该功能仅限尊享版使用</div>
        <div class="text">升级为尊享版，尊享平台各项高级特权</div>
    </div>
</template>

<script>
export default {
    name: 'noVip'
}
</script>

<style lang="scss" scoped>
.noVip {
    margin-top: 110px;
    font-size: 14px;
    color: #A2A5B2;
    font-weight: 400;
    text-align: center;
    line-height: 28px;
    .img {
        display: flex;
        width: 201px;
        height: 183px;
        margin: 0 auto;
        justify-content: center;
        align-items: center
    }
    .title {
        padding-top: 15px;
        color: #0A1735;
        font-size: 16px;
    }
    .text {
        color: #B2B9C8;
        font-size: 14px;
        font-weight: 400;
    }
}
</style>


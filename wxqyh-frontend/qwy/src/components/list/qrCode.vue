<!--
    二维码组件
 -->
<template>
    <div class="qrCode_wrap">
        <img :src="qrURL">
        <p class="qr_title">扫描关注企业微信</p>
    </div>
</template>
<script>
export default {
    data() {
        return {
            dataBase,
            qrURL:''
        }
    },
    mounted() {
        let { wxqrcode } = this.dataBase.config.logo;
        this.qrURL = wxqrcode;
    }
}
</script>
<style scoped>
.qrCode_wrap{
    text-align: center;
}
.qrCode_wrap img{
    width: 240px;
    height: 240px;
}
.qr_title{
    margin-top: 5px;
    font-size: 16px;
    color: #666;
}
</style>


 
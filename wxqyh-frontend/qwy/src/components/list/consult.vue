<!--
    咨询悬浮组件
    用法：
    <parent>
        <consult></consult>
    </parent>
 -->
<template>
    <div class="consult_wrap">
<!--        <div class="consult_item wx_consult">-->
<!--            <img :src="baseURL+'/manager/images/ic_qrcode.png'" alt="">-->
<!--            <p>微信咨询</p>-->
<!--            <div class="hover_msg">-->
<!--                <img :src="baseURL+'/manager/images/qr_home_new.png'" alt="">-->
<!--                <p>扫码关注，可微信在线咨询</p>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="consult_item qwwx_consult">-->
<!--            <img :src="baseURL+'/manager/images/ic_qywx.png'" alt="">-->
<!--            <p>企业微信</p>-->
<!--            <div class="hover_msg">-->
<!--                <img src="http://wbg.do1.com.cn/images/qywxq.png" alt="">-->
<!--                <p>企业微信扫码入群</p>-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>
<script>
export default {
    name: 'consult',
    data() {
        return {
            baseURL:_.baseURL
        }
    }
}
</script>
<style scoped>
    .consult_wrap{
        position: fixed;
        right: 10px;
        top: 50%;
        margin-top: 40px;
    }
    .consult_item{
        position: relative;
        width: 70px;
        height: 70px;
        margin-bottom: 5px;
        padding-top: 18px;
        font-size: 12px;
        color: #fff;
        text-align: center;
        background: #ff9232;
        cursor: pointer;
        box-sizing: border-box;
    }
    .consult_item:last-child{
        margin-bottom: 0;
    }
    .hover_msg{
        position: absolute;
        top: -145px;
        left: -200px;
        display: none;
        width: 190px;
        height: 215px;
        color: #999;
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.3);
        background: #fff;
    }
    .hover_msg img{
        display: block;
        width: 190px;
        height: 190px;
    }
    .consult_item:hover .hover_msg{
        display: block;
    }
</style>



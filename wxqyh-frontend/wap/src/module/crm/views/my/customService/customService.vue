<template>
    <transition name="slide-fade" >
        <div class="custom_page">
            <crm-scroll>
                <div class="height20"></div>
                <div class="wrap_block">
                <div class="custom_wrap">
                    <div class="custom-img_box">
                        <img src="~assets/images/crm/custom_icon.png">
                        <p class="custom_name">在线客服</p>
                    </div>
                    <div class="custom-code">                   
                        <div class="border-dash">
                            <p class="custom_tip mt36">长按识别二维码或者扫码添加客服</p>
                            <img src="~assets/images/crm/crm-custom-code.png">
                        </div>
                    </div>
                    <p class="custom_tip">已添加客服可直接开启会话</p>
                    <div class="custom-communicate" @click="contactClick">
                        <span class="btn_text">开启会话</span>
                    </div>
                    <!-- 垫高块 -->
                    <div class="height60"></div>
                </div>
                </div>
            </crm-scroll>
        </div>
    </transition>
</template>
<script>
import CrmScroll from '../../../components/CrmScroll/CrmScroll';
import wx from 'weixin-js-sdk';

export default {
    name: 'myItemList',
    data() {
        return {

        }
    },
    components:{
        CrmScroll
    },
    props: {
    },
    created(){

    },
    methods: {
        contactClick(){
            if(!_.isQiyeweixinApp() && !_.isQiyeweixin()){
                _.alert("提示","请在企业微信客户端中使用会话功能","确定");
            } else {
                wx.openEnterpriseChat({
                    //userIds: qwUserIds,    //参与会话的企业成员列表
                    externalUserIds: 'wo4nJkEAAAVjwjUaxsrshr0efGQfmN6g', // 参与会话的外部联系人列表
                    groupName: '',
                    success: function(res) {
    
                    },
                    fail: function(res) {
                        if(res.errMsg.indexOf('function not exist') > -1){
                            alert('版本过低请升级')
                        }
                    }
                });
            }
        }
    }
}
</script>
<style lang='scss'>
@import '../../../crmBase.scss';

.custom_page{
    height: 100%;
    background: #fff;
    .height60{
        height: 60px;
    }
    .height20{
        height: 20px;
    }
    .wrap_block{
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .custom_wrap{
            width: 100%;
            .custom-img_box{
                height: 132px;
                text-align: center;
                img{
                    width: 98px;
                    height: 97px;
                }
                .custom_name{
                    color: #313131;
                    font-size: 16px;
                    line-height: 16px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    line-height:22px;
                    text-align: center;
                    margin-top: 12px;
                }
            }
            .custom-code{
                position: relative;
                height: rem(272);
                width: 100%;
                // padding: 0 80px;
                box-sizing: border-box;
                background: url('~assets/images/crm/custom_bg.png') center no-repeat;
                background-size: cover;
                text-align: center;
                .border-dash{
                    width: 250px;
                    height: 272px;
                    margin: 0 auto;
                    border-radius: 5px;
                    background: linear-gradient(#fff, #CBDBFF);
                    img{
                        height: 216px;
                        width: 216px;
                        -webkit-touch-callout: none;            
                    }
                }
            }
            .custom_tip{
                color: #0A1735;
                font-size: 14px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                line-height: 20px;
                text-align: center;
                margin-top: 11px;
                margin-bottom: 8px;
                padding-top: 13px;
            }
            .mt36{
                margin-top: 23px;
            }
            .custom-communicate{
                position: relative;
                width:261px;
                height:40px;   
                border-radius: 20px;
                background: #5585F0;
                margin: 0 auto;
                box-shadow: 0px 4px 30px #5585F0;
                .btn_text{
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%) translateX(-50%);
                    left: 50%;
                    font-size: 15px;
                    color: #fff; 
                }
            }
        }
    }
}
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(70px);
  opacity: 0;
}
</style>


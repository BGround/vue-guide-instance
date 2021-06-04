<template>
    <div v-show="isShowRedpack" @click="openRedpack">
        <div class="qwui-redpack_wrap">
            <img :src="imgSrc" class="qwui-redpack_bg"/>
            <div class="qwui-redpack_box">
                <p class="qwui-redpack_title">{{redTitle}}</p>
                <p class="qwui-redpack_text">{{redWish}}</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'QwTweetContentRedpack',
    props: {
        redpackParamsVO: {
            type: Object,
            required: true
        },
        sendType: {
            type: Number||String,
            required: true
        },
    },
    data(){
        return{
            isShowRedpack: false,
            imgSrc: require('assets/images/ADredpacket_text.png'),
            redTitle: '',
            redWish: '',
            agentCode: _.getUrlParam('agentCode'),
        }
    },
    mounted(){
        // 设置红包属性，此方法不管有没有访问权限都能访问图片
        this.setShowRedPackBirthAndEntry();
    },
    methods:{
        setShowRedPackBirthAndEntry(){
            var self = this;
            // 设置背景图
            if(self.redpackParamsVO.openRedpackPermission=="false"){
                if(self.sendType == '1'){   // 生日
                    self.imgSrc = require('assets/images/ADredpacket_sr.png');
                } else if (self.sendType == '2'){   // 周年
                    self.imgSrc = require('assets/images/ADredpacket_zn.png');
                } else {
                    self.imgSrc = require('assets/images/ADredpacket_text.png');
                }
            } else if(self.redpackParamsVO.openRedpackPermission=="true") {
                self.imgSrc = require('assets/images/ADredpacket_text.png');
            }
            // 设置红包标题
            if(self.redpackParamsVO.repackType=='1'){
                self.redTitle = '拼手气红包';
            } else if(self.redpackParamsVO.repackType == '0'){
                self.redTitle = '普通红包';
            }
            // 红包祝福语
            self.redWish = self.redpackParamsVO.wishing;
            self.isShowRedpack = true;
        },
        // 点击红包
        openRedpack(){
            var self = this;
            // 如果id为空 或为后台，禁用超链接
            if(self.redpackParamsVO.redpackSendId==''||self.redpackParamsVO.redpackSendId=='0'
                ||self.redpackParamsVO.isManager=='1'){
                    _.alert("提示","你没有权限领取此红包");
            }else {
                var redpackUrl = _.baseURL + '/jsp/wap/redpack/get.jsp?id=' + self.redpackParamsVO.redpackSendId 
                    + '&agentCode=' + self.agentCode;
               window.location.href = redpackUrl;
            }
        }
    }
}
</script>
<style scoped lang="scss">
.qwui-redpack_wrap{
    position: relative;
    margin-top: 10px;
    margin-bottom: 10px;
}
.qwui-redpack_bg{
    width: 100%;
    max-height: 140px;
    vertical-align: middle;
}
.qwui-redpack_box{
    position: absolute;
    top: 50%;
    left: 20%;
    height: 46px;
    max-width: 55%;
    margin-top: -23px;
    color: #ffed68;
    font-size: 16px;
    .qwui-redpack_title {
        font-weight: 800;
    }
    .qwui-redpack_text{
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
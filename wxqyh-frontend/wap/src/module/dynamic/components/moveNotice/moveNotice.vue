<template>
    <div class="wrap" :style="{height: innerHeight - 43 + 'px'}">
        <div class="qwui-content_wrap">
            <div class="qwui-top">
                <h3>员工祝福迁移通知</h3>
                <div class="qwui-split_area"></div>
                <div class="qwui-tips">
                    “员工关怀”功能已迁移至“企微云人事考核”应用，企业给员工送上及时的生日祝福，入职祝福，与同事一起祝福互动，尝鲜体验。
                </div>
            </div>
            <div class="qwui-bottom">
                <a :href="linkUrl">立即体验</a>
            </div>
        </div>
    </div>
</template>

<script>
import {getUserTypeForBless} from '../../api/getData'
export default {
    name: 'moveNotice',
    data() {
        return {
            linkUrl: '',
        }
    },
    created() {
        getUserTypeForBless( (res) => {
            // 0-托管了人资，1-未托管人资，但为管理员，2-未托管人资，为普通用户
            switch (res.userType) {
                case 0:
                    this.linkUrl =  _.baseURL +"/vp/module/hrmanagement.html?corp_id=" + window.wxqyhConfig.orgConfigInfo.corpId + "&agentCode=" + dataBase.wxqyh_uploadfile.agent;
                    // this.linkUrl =  _.baseURL + "/jsp/wap/hrmanagement/hr_index.jsp?agentCode=hrmanagement&amp;abc=1";
                    break;
                case 1:
                    this.linkUrl =  _.baseURL + '/portal/weixin/weixinclientAction!authSuite.action?suiteId=tjd12c4309e0beb5ba'
                    break;
                case 2:
                    this.linkUrl = _.baseURL + '/portal/weixin/weixinclientAction!authSuite.action?suiteId=tjd12c4309e0beb5ba'
                    break;
            }
        })
    },
    computed: {
        innerHeight() {
            return window.innerHeight
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap {
    position: fixed;
    top: 43px;
    background: #fff;
    width: 100%;
    .qwui-content_wrap {
        background: url(../../../../assets/svg/dynamicMoveNotice.svg) no-repeat center center;
        background-size: cover;
        width: 100%;
        height: 100%;
        position: relative;
        .qwui-top {
            padding: 51px 54px 0;
            h3 {
                font-size: 20px;
                color: #000;
            }
            .qwui-split_area {
                margin-top: 10px;
                background: #FC8C63;
                width: 30px;
                height: 5px;
            }
            .qwui-tips {
                font-size: 14px;
                color: #7A7C80;
                margin-top: 16px;
            }
        }
        .qwui-bottom {
            position: absolute;
            bottom: 61px;
            width: 100%;
            display: flex;
            justify-content: center;
            a {
                border-radius: 20px;
                background: #FC8C63;
                color: #fff;
                width: 128px;
                height: 40px;
                line-height: 40px;
                font-size: 18px;
                text-align: center;
            }
        }
    }
}
</style>


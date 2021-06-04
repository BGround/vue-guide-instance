<template>
    <div class="qwui-applyManaWrap">
        <div class="qwui-top">
            <span class="qwui-topText">应用管理</span>
            <span class="qwui-topIcon" @click="showToast"></span>
        </div>
        <div class="qwui-itemWrapper">
            <div class="qwui-item" v-for="(item, index) in itemArr" :key="index">
                <div class="qwui-item_left">
                    <div class="qwui-icon" :class="filterIconClass(index)"></div>
                    <div class="qwui-textWrap">
                        <h3>{{item.title}}</h3>
                        <span class="qwui-tips">{{item.tips}}</span>
                    </div>
                </div>
                <div class="qwui-item_right">
                    <InlineXSwitch v-model="item.isOpen" @on-change="listenChange"></InlineXSwitch >
                </div>
            </div>
        </div>
        <div class="qwui-operateBtnWrap">
            <div class="qwui-operateBtn_heaght"></div>
            <div class="qwui-operateBtn_wrap">
                <a href="javascript:;" class="qwui-operateBtn qwui-cancel" @click="cancelSave">取消</a>
                <a href="javascript:;" class="qwui-operateBtn qwui-save" @click="checkSave">保存</a>
            </div>
        </div>
    </div>
</template>

 <script>
import { InlineXSwitch  } from 'vux'

 export default {
     name: 'applyMana',
     data() {
        return {
            itemVal: false,
            isRefresh: false,
            isTurn: false,
            itemArr: [
                {title: '考勤打卡', tips: '指纹人脸，多地考勤', val: 'checkwork', isOpen: false},
                {title: '会议助手', tips: '高效会议管理专家', val: 'meetingassistant', isOpen: false},
                {title: '企业用车', tips: '有效降低单位用车成本', val: 'car', isOpen: false},
                {title: '费控报销', tips: '成本预算，精细化管控报销费用', val: 'reimbursement', isOpen: false},
                {title: '新闻公告', tips: '公告审批发布，红包关怀', val: 'dynamic', isOpen: false},
                {title: '请假出差', tips: '假期管理，对接考勤', val: 'ask', isOpen: false},
                {title: '审批请示', tips: '快速审批，简单易用', val: 'moveapprove', isOpen: false},
            ],
        }
     },
     created() {
        this.getConfig()
     },
     methods: {
         getConfig() {
            var self = this
            _.ajax({
                url: _.baseURL + '/portal/qyservice/qyservicePortalAction!getCustomAgentDetail.action?parentAgentCode=meetingassistant',
                type: "POST",
                success: function (result) {
                    let arr = result.data.customAgentList
                    for (let i = 0; i < arr.length; i++) {
                        let itemIndex = self.filterItemAgent(arr[i].agentCode)
                        self.itemArr[itemIndex].isOpen = arr[i].agentStatus == 1 ? true : false
                    }
                }
            })
         },
         saveConfig() {
             var self = this
             let data = this.filterOpenVal();
             _.ajax({
                url: _.baseURL + '/portal/qyservice/qyservicePortalAction!editOrgCustomAgent.action',
                type: "POST",
                data: {
                    enableAgentCodes: data,
                    parentAgentCode: 'meetingassistant'
                },
                success: function (result) {
                    if (result.code == 0 && !self.isTurn) {
                        _.tooltips_succeed('保存成功', true);
                        self.isRefresh = true;
                        self.cancelSave();
                    } else if(result.code == 0 && self.isTurn) {
                        dataBase.isShowApp = false; // 从云办公跳到会议助手，防止闪动（即会先跳到首页，再到会议助手，即闪动）
                        if (data === 'meetingassistant') {
                            window.location.replace(_.baseURL + "/jsp/wap/meeting/meeting_index.jsp?agentCode=meetingassistant&type=2&status=1");
                        } else if (data === 'checkwork') {
                            window.location.replace(_.baseURL + "/jsp/wap/checkwork/add.jsp?agentCode=checkwork&abc=1");
                        }
                    }
                    else {
                        _.alert('提示',result.desc);
                    }
                }
            })
         },
         checkSave() {
            let data = this.filterOpenVal();
            // 是否单开跳转初始化
            this.isTurn = false
            if (!data) {
                _.alert('提示', '至少需启用一个应用模块');
            }
            else if (data === 'meetingassistant' || data === 'checkwork') {
                // 只启用‘会议助手’,只启用‘考勤打卡’
                let keyTip = data === 'meetingassistant' ? '会议助手' : '考勤打卡'
                this.isTurn = true
                // let keyTip = '会议助手'
                let contentTip = "<div style='text-align:left'>• 只启用“"+ keyTip +"”模块，再次进入应用时将自动跳转至独立的【" + keyTip + "】应用<br>• 保存成功后对可见范围内的成员生效<br>• 如需重新启用“企微云办公”所有功能，需前往企微云管理后台</div>"
                _.alert('设置确认', contentTip, {
                    primaryBtn:{name:"确定保存", callBack: this.saveConfig},
                    defaultBtn:{name:"取消", callBack:null}, //主操作按钮
                })
            }
            else {
                _.alert('保存设置', '保存成功后会对应用可见范围的成员生效，确认保存？', {
                    primaryBtn:{name:"确定", callBack: this.saveConfig},
                    defaultBtn:{name:"取消", callBack:null}, //主操作按钮
                })
            }
         },
         cancelSave() {
             var self = this
             this.$router.push({
                 name: 'index',
                 params: {
                    isRefresh: self.isRefresh
                 }
             })
         },
         showToast() {
            _.alert('应用管理', "<div style='text-align:left'>• 应用管理设置仅超管与托管该应用的管理员可见<br>• 应用模块关闭后，所有成员的应用端不显示对应的功能入口</div>");
         },
         listenChange(val) {
         },
         filterIconClass(index) {
            switch(index) {
                case 0:
                    return 'takeCard'
                    break;
                case 1:
                    return 'meetAssit'
                    break;
                case 2:
                    return 'useCar'
                    break;
                case 3:
                    return 'feePay'
                    break;
                case 4:
                    return 'newBoard'
                    break;
                case 5:
                    return 'vocationLeave'
                    break;
                case 6:
                    return 'approveApply'
                    break;
            }
        },
        filterItemAgent(val) {
            switch (val) {
                case 'ask':
                    // 请假申请
                    return 5
                    break;
                case 'meetingassistant':
                    // 会议助手
                    return 1
                    break;
                case 'checkwork':
                    // 微信考勤
                    return 0
                    break;
                case 'reimbursement':
                    // 移动报销
                    return 3
                    break;
                case 'car':
                    // 车辆管理
                    return 2
                    break;
                case 'dynamic':
                    // 新闻公告
                    return 4
                    break;
                case 'moveapprove':
                    // 移动审批
                    return 6
                    break;
            }
        },
        filterOpenVal() {
            let list = []
            this.itemArr.forEach(item => {
                if (item.isOpen) {
                    list.push(item.val)
                }
            })
            return list.join(',');
        },
     },
     components: {
        InlineXSwitch,
     },
     watch: {
        $route(val) {
            var self = this
            if (val.params.isRefresh) {
                this.$nextTick(function () {
                    self.getConfig()
                })
            }
        }
     }
 }
 </script>

<style lang="scss" scoped>
.qwui-applyManaWrap {
    background: #fff;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
.qwui-top {
    height: 22px;
    padding: 16px 0 16px 14px;
    border-bottom: 1px solid #F7F8FA;
    span {
        display: inline-block;
        vertical-align: middle;
    }
    .qwui-topText {
        color: #0A1735;
        font-size: 16px;
    }
    .qwui-topIcon {
        margin-left: 6px;
        width: 16px;
        height: 16px;
        background: url(../../../assets/svg/icon_a-public_info.svg) no-repeat center center;
        background-size: cover;
    }
}
.qwui-itemWrapper {
    .qwui-item {
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 17px 15px 18px 21px;
        .qwui-item_left {
            display: flex;
            align-items: center;
            .qwui-icon {
                width: 30px;
                height: 30px;
                &.takeCard {
                    background: url(../../../assets/svg/ic_takeCard.svg) no-repeat center center;
                    background-size: 100%;
                }

                &.meetAssit {
                    background: url(../../../assets/svg/ic_meetAssit.svg) no-repeat center center;
                    background-size: 100%;
                    width: 28px;
                }

                &.useCar {
                    background: url(../../../assets/svg/ic_useCar.svg) no-repeat center center;
                    background-size: 100%;
                }

                &.feePay {
                    background: url(../../../assets/svg/ic_feePay.svg) no-repeat center center;
                    background-size: 100%;
                }

                &.newBoard {
                    background: url(../../../assets/svg/ic_newBoard.svg) no-repeat center center;
                    background-size: 100%;
                    width: 29px;
                }

                &.vocationLeave {
                    background: url(../../../assets/svg/ic_vocation.svg) no-repeat center center;
                    background-size: 100%;
                    width: 28px;
                }

                &.approveApply {
                    background: url(../../../assets/svg/ic_approve.svg) no-repeat center center;
                    background-size: 100%;
                    width: 31px;
                }
            }
            .qwui-textWrap {
                margin-left: 21px;
                display: flex;
                align-items: flex-start;
                flex-direction: column;
                h3 {
                    color: #0A1735;
                    font-size: 14px;
                }
                .qwui-tips {
                    color: #B2B9C8;
                    font-size: 12px;
                }
            }
        }
        .qwui-item_right {
            .weui-switch {
                width: 34px;
                height: 18px;
                &:before {
                    width: 34px;
                    height: 18px;
                }
                &:after {
                    width: 16px;
                    height: 16px;
                }
            }
            .weui-switch:checked:after {
                transform: translateX(18px);
            }
        }
    }
}
.qwui-operateBtn_heaght {
    height: 60px;
}
.qwui-operateBtn_wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    background: #fff;
    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
        margin-bottom: 34px;
    }
    .qwui-operateBtn {
        margin: 8px 12px 8px 14px;
        flex: 1;
        border-radius: 4px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        &.qwui-cancel {
            background: #B2B9C8;
        }
        &.qwui-save {
            background: #5585F0;
        }
    }
}
.weui-switch:checked, .weui-switch-cp__input:checked ~ .weui-switch-cp__box {
    border-color: #648EEC;
    background-color: #648EEC;
}
</style>

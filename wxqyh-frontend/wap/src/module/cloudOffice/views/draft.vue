<template>
    <div class="qwui-draftWrap">
        <div class="qwui-draft_wrapper" v-show="draftArr.length">
            <div class="qwui-draft_item" v-for="(item, index) in draftArr" :key="index">
                <a :href="toDraftEdit(item.waitTaskAgent, item)" class="qwui-item_left">
                    <div class="qwui-item_top">
                        <div class="qwui-icon" :class="item.waitTaskAgent"></div>
                        <div class="qwui-name">{{item.title}}</div>
                    </div>
                    <div class="qwui-item_bottom">{{item.lineOne}}</div>
                </a>
                <div class="qwui-item_right" @click="showMore(item)">
                    <div class="qwui-item_moreIcon"></div>
                </div>
            </div>
        </div>
        <div class="qwui-draft_none" v-show="showNone">
            <div class="qwui-draft_none_wrap">
                <img src="../../../assets/svg/img_commom_emptypage.svg" alt="">
                <span>暂无数据</span>
            </div>
            <div class="qwui-turnBack" @click="backToIndex()">返回</div>
        </div>
        <dialog_mask_bottom :dialogConfig="dialogBottomConfig"></dialog_mask_bottom>
    </div>
</template>

<script>
import dialog_mask_bottom from '@/components/base/dialog_mask_bottom.vue';
export default {
    name: 'draft',
    data() {
        return {
            dialogBottomConfig: dataBase.home.dialogBottomConfig, //列表操作弹窗
            draftArr: [],
            curInfo: {
                id: '',
                type: '',
            },
            showNone: false,
        }
    },
    created() {
        this.dialogBottomConfig.btnConfig[0].callBack = this.deleteDraft
        this.getDraft()
    },
    methods: {
        showMore(item) {
            let type = item.waitTaskAgent
            this.curInfo.type = type
            switch(item.waitTaskAgent) {
                case 'ask':
                   this.curInfo.id = item.askId
                   break;
                case 'car':
                   this.curInfo.id = item.askId
                   break;
                case 'reimbursement':
                   this.curInfo.id = item.reimId
                   break;
                case 'meetingassistant':
                   this.curInfo.id = item.id
                   break;
                case 'dynamic':
                   this.curInfo.id = item.dynamicInfoId
                   break;
                case 'moveapprove':
                   this.curInfo.id = item.moveapproveId
                   break;
            }
            this.dialogBottomConfig.show = true;
        },
        getDraft() {
            var self = this
            _.ajax({
                url: _.baseURL + '/portal/qyservice/qyservicePortalAction!loadTeamWorkDrafDetail.action?parentAgentCode=meetingassistant&topCount=10',
                type: "POST",
                success: function (result) {
                    dataBase.isShowApp = true // 使之整个页面显示
                    if (result.code == "0") {
                        self.initDraftArr()
                        if (result.data.drafWaitTaskList.length !== 0) {
                            self.draftArr = self.filterWaitList(result.data.drafWaitTaskList)
                        } else {
                            self.showNone = true;
                            dataBase.totalDrafCount = 0;
                        }
                    } else {
                        _.alert('提示',result.desc);
                    }
                }
            })
        },
        deleteDraft() {
            let type = this.curInfo.type
            switch(type) {
                case 'ask':
                    this.requestDel('ask/ajaxBatchDelete.do')
                    break;
                case 'reimbursement':
                    this.requestDel('reimAction!ajaxBatchDelete.action')
                    break;
                case 'car':
                    this.requestDel('caraskAction!ajaxBatchDelete.action')
                    break;
                case 'meetingassistant':
                    this.requestDel('meetinginfoAction!ajaxBatchDel.action')
                    break;
                case 'dynamic':
                    this.requestDel('dynamicinfomanage/dynamicinfomanageAction!batchDel.action', true)
                    break;
                case 'moveapprove':
                    this.requestDel('moveapproveAction!ajaxBatchDelete.action')
                    break;
            }
        },
        filterWaitList(arr) {
            for (let i in arr) {
                var item = arr[i]
                item.title = item.title === '' ? '未填写标题' : item.title
                switch(item.waitTaskAgent) {
                    case 'ask':
                        // 请假
                        item.lineOne = '请假时长：' + item.askDay + '天'
                        break;
                    case 'reimbursement':
                        // 报销
                        item.lineOne = '报销：￥' + item.totalMoney
                        break;
                    case 'moveapprove':
                        // 审批
                        item.lineOne = '审批'
                        break;
                    case 'car':
                        // 用车申请
                        item.lineOne = '用车时间：' + item.formatTakeTime
                        break;
                    case 'meetingassistant':
                        // 会议
                        item.lineOne = '会议开始：' + item.draftStartTimeStr
                        break;
                    case 'dynamic':
                        // 新闻公告
                        item.lineOne = item.source
                        break;
                }
            }
            return arr;
        },
        requestDel(url, isDynamic) {
            var self = this
            this.dialogBottomConfig.show = false;
            let data = {
                ids: this.curInfo.id
            }
            if (isDynamic) {
                data.belongAgent = 'dynamic'
            }
            _.ajax({
                url: _.baseURL + '/portal/' + url,
                type: "POST",
                data: data,
                success: function (result) {
                    if (result.code == "0") {
                        _.tooltips_succeed('删除成功', true);
                        self.refreshList()
                    } else {
                        _.alert('提示',result.desc);
                        self.refreshList()
                    }
                }
            })
        },
        refreshList() {
            this.getDraft()
        },
        toDraftEdit(type, item) {
            switch(type) {
                case 'ask':
                    // 请假
                    return _.baseURL + '/jsp/wap/ask/edit.jsp?askId=' + item.askId + '&corp_id=' + window.wxqyhConfig.orgConfigInfo.corpId
                    break;
                case 'reimbursement':
                    // 报销
                    return _.baseURL + '/jsp/wap/reimbursement/detail.jsp?reimId=' + item.reimId
                    break;
                case 'car':
                    if (item.askType === '1') {
                        // 企业用车
                        return _.baseURL + '/jsp/wap/car/edit.jsp?askId=' + item.askId
                    } else if (item.askType === '2') {
                        // 滴滴用车
                        return _.baseURL + '/jsp/wap/didi/diditrade.jsp?didiOption=edit&askId=' + item.askId
                    }
                    break;
                case 'meetingassistant':
                    // 会议助手
                    return _.baseURL + '/jsp/wap/meeting/meeting_edit.jsp?taskId=' + item.id
                    break;
                case 'moveapprove':
                    // 审批请示
                    return _.baseURL + "/vp/module/moveapprove.html?agentCode=moveapprove&corp_id=" + window.wxqyhConfig.orgConfigInfo.corpId + "&abc=1#/add?moveId=" + item.moveapproveId
                    break;
                case 'dynamic':
                    // 新闻公告
                    return _.baseURL + "/jsp/wap/dynamicinfoManage/edit.jsp?id=" + item.dynamicInfoId
                    break;
            }
        },
        initDraftArr() {
            this.draftArr = []
        },
        backToIndex() {
            this.$router.push({
                name: 'index'
            })
        },
    },
    computed: {
        corp_id() {
            // let id = _.getUrlParam("corp_id")
            let id = window.wxqyhConfig.orgConfigInfo.corpId
            let result = id ? id : ''
            return result
        },
    },
    components: {
        dialog_mask_bottom,
    }
}
</script>

<style lang="scss" scoped>
.qwui-draftWrap {
    background: #fff;
    width: 100%;
    height: 100%;
    position: absolute;
}
.qwui-draft_wrapper {
    background: #fff;
    .qwui-draft_item {
        display: flex;
        align-items: center;
        padding: 10px 0 16px 0;
        margin-left: 15px;
        border-bottom: 1px solid #F7F8FA;
        background: #fff;
        height: 42px;
        .qwui-item_left {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            .qwui-item_top {
                display: flex;
                align-items: flex-end;
                .qwui-icon {
                    width: 20px;
                    height: 20px;
                    &.ask {
                        background: url(../../../assets/svg/ic_vocation.svg) no-repeat center center;
                        background-size: 100%;
                    }
                    &.reimbursement {
                        background: url(../../../assets/svg/ic_feePay.svg) no-repeat center center;
                        background-size: 100%;
                    }
                    &.moveapprove {
                        background: url(../../../assets/svg/ic_approve.svg) no-repeat center center;
                        background-size: 100%;
                    }
                    &.car {
                        background: url(../../../assets/svg/ic_useCar.svg) no-repeat center center;
                        background-size: 100%;
                    }
                    &.meetingassistant {
                        background: url(../../../assets/svg/ic_meetAssit.svg) no-repeat center center;
                        background-size: 100%;
                    }
                    &.dynamic {
                        background: url(../../../assets/svg/ic_newBoard.svg) no-repeat center center;
                        background-size: 100%;
                    }
                }
                .qwui-name {
                    height: 22px;
                    line-height: 22px;
                    color: #0A1735;
                    font-size: 16px;
                    margin-left: 16px;
                }
            }
            .qwui-item_bottom {
                color: #7A7C80;
                font-size: 12px;
                padding-left: 36px;
            }
        }
        .qwui-item_right {
            width: 32px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            .qwui-item_moreIcon {
                width: 4px;
                height: 18px;
                background: url(../../../assets/svg/icon_a-common_draftmore.svg) no-repeat center center;
                background-size: cover;
            }
        }
    }
}

.qwui-draft_none {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .qwui-draft_none_wrap {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        img {
            width: 160px;
            height: 160px;
        }
        span {
            margin-top: 8px;
            font-size: 14px;
            color: #A2A5B2;
        }
    }
    .qwui-turnBack {
        height: 40px;
        line-height: 40px;
        margin: 0 14px 5px;
        border-radius: 4px;
        background: #F7F8FA;
        color: #A2A4A7;
        font-size: 16px;
        text-align: center;
    }
}

@media screen and (min-width: 1024px) {
    .qwui-draftWrap {
        width: 740px !important;
    }
}
.qwui-overlay /deep/ .qwui-dialog_bottom {
    .qwui-dialog_bottom_header {
        &:after {
            width: 0;
        }
    }
}
</style>


<template>
    <div class="qwui-myIndexWrap">
        <div class="qwui-top_back"></div>
        <div class="qwui-myCard" v-show="isShowCheckWork">
            <div class="qwui-top">
                <div class="qwui-top_title_wrapper">
                    <span class="qwui-top_title">我的考勤</span>
                </div>
                <a :href="toShensu()" class="qwui-link">我的申诉</a>
            </div>
            <a :href="toCheckWork()" class="qwui-card_wrapper">
                <div class="qwui-left_total">
                    <span class="qwui-totalNum">{{this.workNum}}</span>
                    <span class="qwui-totalTips">本月出勤(天)</span>
                </div>
                <div class="qwui-right_detail">
                    <div class="qwui-right_item" v-for="(item, index) in cardArr" :key="index">
                        <span class="qwui-right_item_name">{{item.name}}</span>
                        <span :class="{'qwui-RedText': filterRedText(index, item.num)}">{{item.num}}</span>
                        <span>{{item.unit}}</span>
                    </div>
                </div>
            </a>
        </div>
        <div class="qwui-summary">
            <div class="qwui-top">
                <div class="qwui-top_title_wrapper">
                    <span class="qwui-top_title">本月简报</span>
                    <span class="qwui-top_title_tips">{{curMonth}}月</span>
                </div>
                <a href="javascript:;" class="qwui-link" style="display:none">历史</a>
            </div>
            <div class="qwui-summary_wrapper">
                <a :href="toIndex(index)" class="qwui-sum_item" v-for="(item, index) in sumArr" :key="index" v-show="filterShow(index)">
                    <div class="qwui-item_img" :class="filterIconClass(index)"></div>
                    <span class="qwui-item_name">{{item.name}}</span>
                    <div class="qwui-tips_wrap">
                        <span class="qwui-item_tips">{{item.text1}}</span>
                        <span class="qwui-item_tips">{{item.num1}}</span>
                    </div>
                    <div>
                        <span class="qwui-item_tips">{{item.text2}}</span>
                        <span class="qwui-item_tips">{{item.num2}}</span>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import * as timeUtil from '../../../../assets/js/time-util';
export default {
    name: 'myIndex',
    data() {
        return {
            workNum: 0,
            cardArr: [
                {name: '迟到', num: 0, unit: '次'},
                {name: '早退', num: 0, unit: '次'},
                {name: '漏签', num: 0, unit: '次'},
                {name: '外勤', num: 0, unit: '次'},
                {name: '旷工', num: 0, unit: '天'},
                {name: '正常', num: 0, unit: '天'},
            ],
            sumArr: [
                {name: '会议助手', text1: '发起会议：', text2: '参与会议：', num1: '0', num2: '0'},
                {name: '费控报销', text1: '发起报销：', text2: '报销金额：', num1: '0', num2: '0'},
                {name: '审批请示', text1: '发起申请：', text2: '相关申请：', num1: '0', num2: '0'},
                {name: '请假出差', text1: '请假出差：', text2: '时长/天：', num1: '0', num2: '0'},
                {name: '单位用车', text1: '发起申请：', text2: '相关申请：', num1: '0', num2: '0'},
            ],
            dataBase2: dataBase,
        }
    },
    created() {
        this.requestData()
    },
    mounted() {},
    methods: {
        requestData() {
            this.requestMove()
            this.requestAsk()
            this.requestCar()
            this.requestFeePay()
            this.requestMeetPortalCtl()
            this.requestCheck()
        },
        requestMeetPortalCtl() {
            var self = this
            _.ajax({
                url: _.baseURL + '/portal/meetingPortalCtl/ajaxViewPublishCountAndJoinCount.do',
                type: "POST",
                data: {
                    startTime: this.startTime,
                    endTime: this.endTime
                },
                success: function (result) {
                    // console.log('会议助手接口')
                    self.sumArr[0].num1 = result.data.publishCount
                    self.sumArr[0].num2 = result.data.joinCount
                }
            })
        },
        requestFeePay() {
            var self = this
            _.ajax({
                url: _.baseURL + '/portal/reimPortalCtl/getCurrentMonthCountAndTotalMoney.do',
                type: "POST",
                data: {
                    startTime: this.startTime,
                    stopTime: this.endTime
                },
                success: function (result) {
                    // console.log('报销接口')
                    self.sumArr[1].num1 = result.data.data.count
                    self.sumArr[1].num2 = result.data.data.totalMoney
                }
            })
        },
        requestMove() {
            var self = this
            let start = this.startTime + ' 00:00:00'
            let end = this.endTime + ' 23:59:59'
            _.ajax({
                url: _.baseURL + '/portal/moveapprove/getMonthCount.do',
                type: "POST",
                data: {
                    startTime: start,
                    endTime: end
                },
                success: function (result) {
                    // console.log('审批请示接口')
                    self.sumArr[2].num1 = result.data.myCommitNum
                    self.sumArr[2].num2 = result.data.relativeNum
                }
            })
        },
        requestAsk() {
            var self = this
            _.ajax({
                url: _.baseURL + '/portal/ask/getAskStatistics.do',
                type: "POST",
                data: {
                    startTime: this.startTime,
                    stopTime: this.endTime
                },
                success: function (result) {
                    // console.log('请假接口')
                    self.sumArr[3].num1 = result.data.count
                    self.sumArr[3].num2 = result.data.sumDays
                }
            })
        },
        requestCar() {
            var self = this
            _.ajax({
                url: _.baseURL + '/portal/carask/countCarAsk.do',
                type: "POST",
                data: {
                    startTime: this.startTime,
                    endTime: this.endTime
                },
                success: function (result) {
                    // console.log('用车接口')
                    self.sumArr[4].num1 = result.data.myCarAsk
                    self.sumArr[4].num2 = result.data.relatedCarAsk
                }
            })
        },
        requestCheck() {
            var self = this
            _.ajax({
                url: _.baseURL + '/portal/checkworkAction!obtainPersonCheckWorkInfo.action',
                type: "POST",
                success: function (result) {
                    // console.log('考勤接口')
                    self.cardArr[0].num = result.data.conditionVo.lateNum
                    self.cardArr[1].num = result.data.conditionVo.leaveNum
                    self.cardArr[2].num = result.data.conditionVo.noSignNum
                    self.cardArr[3].num = result.data.conditionVo.outWorkNum
                    self.cardArr[4].num = result.data.conditionVo.absWorkDate
                    self.cardArr[5].num = result.data.conditionVo.signStatusOkNum
                    self.workNum = result.data.conditionVo.workNum
                }
            })
        },
        filterIconClass(index) {
            switch(index) {
                case 0:
                    return 'meetAssit'
                    break;
                case 1:
                    return 'feePay'
                    break;
                case 2:
                    return 'approveApply'
                    break;
                case 3:
                    return 'vocationLeave'
                    break;
                case 4:
                    return 'useCar'
                    break;
            }
        },
        filterRedText(index, num) {
            if (index == 3 || index == 5) {
                return false;
            } else if (num == 0) {
                return false;
            } else {
                return true;
            }
        },
        toShensu() {
            return  _.baseURL + '/jsp/wap/checkwork/rep_list.jsp?type=0&agentCode=checkwork&abc=1'
        },
        toIndex(index) {
            switch(index) {
                case 0:
                    return _.baseURL + '/jsp/wap/meeting/meeting_index.jsp?type=1&status=all&agentCode=meetingassistant&abc=1';
                    break;
                case 1:
                    return _.baseURL + '/jsp/wap/reimbursement/reimbursement_index.jsp?agentCode=reimbursement';
                    break;
                case 2:
                    return _.baseURL + '/vp/module/moveapprove.html?agentCode=moveapprove&corp_id=' + window.wxqyhConfig.orgConfigInfo.corpId + '#/my/submit';
                    break;
                case 3:
                    return _.baseURL + '/jsp/wap/ask/ask_index.jsp?agentCode=ask';
                    break;
                case 4:
                    return _.baseURL + '/jsp/wap/car/car_index.jsp?agentCode=car';
                    break;
            }
        },
        toCheckWork() {
            return _.baseURL + "/jsp/wap/checkwork/calendarDetail.jsp?agentCode=checkwork&abc=1"
        },
        getLastDay(year, month) {
            var d = new Date(0);
            if (month == 12)
            {
                d.setUTCFullYear(year + 1);
                d.setUTCMonth(0);
            }
            else
            {
                d.setUTCFullYear(year);
                d.setUTCMonth(month);
            }
            d.setTime(d.getTime() - 1);
            return d.getUTCDate();
        },
        filterShow(index) {
            switch(index) {
                case 0:
                    return this.isShowMeet
                    break;
                case 1:
                    return this.isShowReim
                    break;
                case 2:
                    return this.isShowMove
                    break;
                case 3:
                    return this.isShowAsk
                    break;
                case 4:
                    return this.isShowCar
                    break;
            }
        },
    },
    computed: {
        corp_id() {
            // let id = _.getUrlParam("corp_id")
            let id = window.wxqyhConfig.orgConfigInfo.corpId
            let result = id ? id : ''
            return result
        },
        curMonth() {
            var date = new Date();
            var month = date.getMonth() + 1;
            return month;
        },
        curYear() {
            var date = new Date();
            var year = date.getFullYear();
            return year;
        },
        totalDay() {
            let y = this.curYear
            let m = this.curMonth
            let d = this.getLastDay(y, m)
            return d;
        },
        startTime() {
            let y = this.curYear
            let m = this.curMonth
            if (m < 10) {
                m = '0' + m;
            }
            let a = y + '-' + m + '-01';
            return a;
        },
        endTime() {
            let y = this.curYear
            let m = this.curMonth
            let d = this.totalDay
            if (m < 10) {
                m = '0' + m;
            }
            if (d < 10) {
                d = '0' + d;
            }
            return y + '-' + m + '-' + d;
        },
        isShowAsk() {
            return this.dataBase2.isShowArr.isShowAsk
        },
        isShowMeet() {
            return this.dataBase2.isShowArr.isShowMeet
        },
        isShowMove() {
            return this.dataBase2.isShowArr.isShowMove
        },
        isShowReim() {
            return this.dataBase2.isShowArr.isShowReim
        },
        isShowCar() {
            return this.dataBase2.isShowArr.isShowCar
        },
        isShowCheckWork() {
            return this.dataBase2.isShowArr.isShowCheckWork
        },
    },
}
</script>

<style lang="scss" scoped>
.qwui-myIndexWrap {
    background: #fff;
}
.qwui-RedText {
    color: #FF586D;
}
.qwui-top_back {
    background: url(../../../../assets/svg/bg_my.svg) no-repeat center center;
    background-size: 101%;
    width: 100%;
    height: 24px;
}
.qwui-top {
    padding: 0 14px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .qwui-top_title_wrapper {
        display: flex;
        align-items: center;
        .qwui-top_title {
            color: #0A1735;
            font-weight: bold;
            font-size: 14px;
        }
        .qwui-top_title_tips {
            color: #B2B9C8;
            font-size: 14px;
            margin-left: 8px;
        }
    }
    .qwui-link {
        color:#7A7C80;
        font-size: 13px;
        position: relative;
        padding-right: 13px;
        &:after {
            content: '';
            position: absolute;
            width: 23px;
            height: 23px;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            background: url(../../../../assets/svg/right.svg) no-repeat center center;
            background-size: 23px;
        }
    }
}
.qwui-myCard {
    .qwui-card_wrapper {
        display: flex;
        height: 129px;
        border-bottom: 1px solid #F7F8FA;
        .qwui-left_total {
            width: 38%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .qwui-totalNum {
                color: #0A1735;
                font-size: 36px;
            }
            .qwui-totalTips {
                color: #7A7C80;
                font-size: 12px;
            }
        }
        .qwui-right_detail {
            padding: 20px 0;
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            .qwui-right_item {
                width: 50%;
                color: #7A7C80;
                font-size: 13px;
                text-align: center;
            }
        }
    }
}
.qwui-summary {
    padding: 10px 0 5px;
    .qwui-summary_wrapper {
        padding: 10px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        .qwui-sum_item {
            width: 47%;
            height: 140px;
            border-radius: 10px;
            box-shadow: 0px 4px 1px #F7F8FA;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-bottom: 19px;
            .qwui-item_img {
                width: 38px;
                height: 38px;
                &.meetAssit {
                    background: url(../../../../assets/svg/ic_meetAssit.svg) no-repeat center center;
                    background-size: 100%;
                }
                &.feePay {
                    background: url(../../../../assets/svg/ic_feePay.svg) no-repeat center center;
                    background-size: 100%;
                }
                &.approveApply {
                    background: url(../../../../assets/svg/ic_approve.svg) no-repeat center center;
                    background-size: 100%;
                }
                &.vocationLeave {
                    background: url(../../../../assets/svg/ic_vocation.svg) no-repeat center center;
                    background-size: 100%;
                }
                &.useCar {
                    background: url(../../../../assets/svg/ic_useCar.svg) no-repeat center center;
                    background-size: 100%;
                }
            }
            .qwui-item_name {
                margin-top: 14px;
                color: #0A1735;
                font-size: 14px;
            }
            .qwui-tips_wrap {
                margin-top: 4px;
            }
            .qwui-item_tips {
                color: #7A7C80;
                font-size: 12px;
            }
        }
    }
}
</style>

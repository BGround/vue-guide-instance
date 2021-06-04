<template>
  <div class="qwui-waitIndexWrap">
    <div class="qwui-top" >
      <div class="qwui-top_img" :style="filterHeight"></div>
      <div class="qwui-btn_wrapper">
        <div v-for="(item, index) in btnArr" :key="index" class="qwui-btn_item" v-show="filterShow(item.agentCode)">
          <a :href="item.url" @click="toApplyManma(item.agentCode)">
            <div class="qwui-btn_img" :class="filterTopIconClass(item.agentCode)">
              <span class="qwui-btn_red" v-if="item.dynamicWaitCount">{{item.dynamicWaitCount}}</span>
            </div>
            <span class="qwui-btn_item_text">{{item.title}}</span>
          </a>
        </div>
      </div>
    </div>
    <div class="qwui-content-wrapper" v-if="waitTaskList.length || meetingWaitTaskList.length">
      <div class="qwui-meeting" v-show="isShowMeet">
        <div class="qwui-no_meet" v-if="meetingWaitTaskList.length == 0">
          <div class="qwui-meetImg_wrap">
            <img src="../../../../assets/svg/bg_kby2.svg" alt="">
          </div>
          <div class="qwui-no_meet_right">
            <h3>暂无需你参与的会议</h3>
            <a :href="toMeetStatus()" class="qwui-no_meet_check">可查看会议室状态</a>
          </div>
        </div>
        <div class="qwui-meeting_wrapper" v-if="meetingWaitTaskList.length">
          <h3>待进行会议</h3>
          <div class="qwui-meeting_item_wrapper">
            <a :href="toMeetDetail(item.id)" class="qwui-meeting_item" v-for="(item, index) in meetingWaitTaskList" :key="index">
              <div class="qwui-top_area " :class="filterMeetTimeClass(item.startTime, item.endTime)">
                <span class="qwui-time">{{item | filterMeetTime}}</span>
              </div>
              <div class="qwui-meeting_text">
                {{item.title}}
              </div>
              <!-- <span class="qwui-room">{{item.regionName + item.roomName}}</span> -->
              <span class="qwui-room">{{item.roomNameInIndex}}</span>
            </a>
            <a :href="toMeetIndex()" class="qwui-checkAllMeeting">查看全部 {{meetingToDoCount}}个会议&gt;</a>
          </div>
        </div>
      </div>
      <div class="qwui-splice_area" v-show="isShowMeet"></div>
      <div class="qwui-waiting">
        <div class="qwui-waiting-top">
          <h3>待处理事项</h3>
          <span>{{this.totalToDoCount}}</span>
        </div>
        <div class="qwui-no_wait" v-if="waitTaskList.length == 0">
          <div class="qwui-waitImg_wrap">
            <img src="../../../../assets/svg/bg_kby.svg" alt="">
          </div>
          <span class="qwui-wait-text">暂无需你处理的事项</span>
        </div>
        <div class="qwui-waiting_wrapper" v-if="waitTaskList.length">
          <a :href="toWaitDetail(item.waitTaskAgent, item)" class="qwui-waiting_item" v-for="(item, index) in waitTaskList" :key="index">
            <div class="qwui-waiting_title" :class="filterWaitIconClass(item.waitTaskAgent)">
              <span>{{item.title}}</span>
              <span class="qwui-btn_red" v-if="item.waitTaskAgent === 'checkwork'">{{checkworkWaitCount}}</span>
            </div>
            <div class="qwui-detail_wrapper">
              <span>{{item.lineOne}}</span>
              <span v-show="item.lineTwo">{{item.lineTwo}}</span>
              <span style="margin-top: 4px;" v-show="item.lineThree">{{item.lineThree}}</span>
            </div>
          </a>
        </div>
        <div class="qwui-bottom_text" v-if="waitTaskList.length">
          <span>已没有更多待处理事项</span>
        </div>
      </div>
    </div>
    <div class="qwui-allNone" v-if="waitTaskList.length == 0 && meetingWaitTaskList.length == 0">
      <img src="../../../../assets/svg/bg_kby.svg" alt="">
      <span class="qwui-allNone-text">没有待你处理的事项</span>
      <!-- <span class="qwui-allNone-tips">点击下方+号可快速发起会议、申请</span>	 -->
    </div>
  </div>
</template>

<script>
  import * as timeUtil from '../../../../assets/js/time-util';
  import { isVipGold } from '@/assets/js/vip-portal';
  export default {
    name: 'waitIndex',
    data() {
      return {
        meetingWaitTaskList: [],
        waitTaskList: [],
        meetingToDoCount: '',
        checkworkWaitCount: 0,
        totalToDoCount: 0,
        dataBase2: dataBase,
        canCustomAgent: false,
        btnArr: [
          {title: '考勤打卡', url: '/jsp/wap/checkwork/add.jsp?agentCode=checkwork&abc=1', agentCode: "checkwork", isShow: false},
          {title: '会议助手', url: '/jsp/wap/meeting/meeting_index.jsp?agentCode=meetingassistant', agentCode: "meetingassistant", isShow: false},
          {title: '企业用车', url: '/jsp/wap/car/car_index.jsp?agentCode=car', agentCode: "car", isShow: false},
          {title: '费控报销', url: '/jsp/wap/reimbursement/reimbursement_index.jsp?agentCode=reimbursement', agentCode: "reimbursement", isShow: false},
          {title: '新闻公告', url: '/jsp/wap/dynamicinfoManage/dynamicinfo_list.jsp?t=1&status=1&agentCode=dynamic&abc=1&corp_id=', agentCode: "dynamic", dynamicWaitCount: 0, isShow: false},
          {title: '请假出差', url: '/jsp/wap/ask/ask_index.jsp?agentCode=ask&corp_id=', agentCode: "ask",isShow: false},
          {title: '审批请示', url: '/vp/module/moveapprove.html?agentCode=moveapprove&corp_id=', agentCode: "moveapprove", isShow: false},
          {title: '应用管理', url: 'javascript:void(0)', agentCode:"management", isShow: true},
        ],
      }
    },
    created() {
      // this.requestData()
    },
    methods: {
      requestData() {
        var self = this
        _.ajax({
          url: _.baseURL + '/portal/qyservice/qyservicePortalAction!loadTeamWorkDetail.action?parentAgentCode=meetingassistant&topCount=10',
          type: "POST",
          success: function (result) {
            if (result.code == "0") {
              self.initList()
              if (result.data.meetingWaitTaskList && result.data.meetingWaitTaskList.length !== 0) {
                self.meetingWaitTaskList = result.data.meetingWaitTaskList.splice(0,2)
              }
              if (result.data.waitTaskList && result.data.waitTaskList.length !== 0) {
                self.waitTaskList = self.filterWaitList(result.data.waitTaskList)
              }
              self.totalToDoCount = result.data.totalToDoCount;
              self.meetingToDoCount = result.data.meetingToDoCount;
              self.checkworkWaitCount = result.data.checkworkWaitCount
              self.btnArr.find((element) => (element.agentCode === 'dynamic')).dynamicWaitCount = result.data.dynamicWaitCount ? result.data.dynamicWaitCount : 0;
              self.filterURL(result.data.canCustomAgent)
              self.canCustomAgent = result.data.canCustomAgent
              if (self.filterVIP) {
                // 是vip显示部分功能
                self.filterBtnArr(result.data.showAgentList)
              } else {
                // 不是vip显示全部功能
                self.initShowArr(true)
              }
              dataBase.totalDrafCount = result.data.totalDrafCount
            } else {
              _.alert('提示',result.desc);
            }
            dataBase.isShowApp = true
          }
        })
      },
      filterWaitList(arr) {
        for (let i in arr) {
          var item = arr[i]
          switch(item.waitTaskAgent) {
              case 'ask':
                // 请假
                item.lineOne = item.typeName + ' ' +item.sumAskDays + '天'
                item.lineTwo = this.filterDepName(item.departmentName) + ' - ' + item.personName
                break;
              case 'reimbursement':
                // 报销
                item.lineOne = '报销：￥' + item.totalMoney
                item.lineTwo = this.filterDepName(item.departmentName) + ' - ' + item.personName
                break;
              case 'moveapprove':
                // 审批请示
                item.lineOne = item.typeName
                item.lineTwo = this.filterDepName(item.departmentName) + ' - ' + item.personName
                break;
              case 'checkwork':
                // 考勤打卡
                item.title = '考勤异常申诉_' + item.personName
                item.lineOne = this.filterDepName(item.departmentName) + ' - ' + item.personName
                item.lineTwo = '申诉：' + item.repInfo
                break;
              case 'car':
                // 用车申请
                item.title = !item.title ? '企业用车_' +item.personName : item.title
                let lineTwo = item.beginLocation
                let lineThree = item.destinationLocation
                item.lineOne = '时间：' + item.formatTakeTime
                if (lineTwo) {
                  item.lineTwo = '出发：' + lineTwo
                } else {
                  item.lineTwo = ''
                }
                if (lineThree) {
                  item.lineThree = '终点：' + lineThree
                } else {
                  item.lineThree = ''
                }
                break;
              case 'meetingassistant':
                // 会议审核
                item.title = '[会议审批]' + item.title
                item.lineOne = '时间：' + this.filterDelYear(item.startTime) + ' 至 ' + this.filterDelYear(item.endTime)
                item.lineTwo = item.roomNameInIndex
                item.lineThree = '申请人：' + item.personName
                break;
          }
        }
        return arr;
      },
      filterWaitIconClass(type) {
        switch(type) {
          case 'ask':
            return 'qwui-ask';
            break;
          case 'reimbursement':
            return 'qwui-reimbursement';
            break;
          case 'car':
            return 'qwui-car';
            break;
          case 'meetingassistant':
            return 'qwui-meetingassistant';
            break;
          case 'checkwork':
            return 'qwui-checkwork';
            break;
          case 'moveapprove':
            return 'qwui-moveapprove';
            break;
        }
      },
      filterMeetTimeClass(startTime, endTime) {
        let s = new Date(startTime);
        let e = new Date(endTime);
        let timestamp = new Date().getTime();
        if (timestamp > s && timestamp < e ) {
          return 'qwui-icon_active'
        } else {
          return 'qwui-icon_normal'
        }
      },
      filterTopIconClass(agentCode) {
          switch(agentCode) {
              case 'checkwork':
                  return 'takeCard'
                  break;
              case 'meetingassistant':
                  return 'meetAssit'
                  break;
              case 'car':
                  return 'useCar'
                  break;
              case 'reimbursement':
                  return 'feePay'
                  break;
              case 'dynamic':
                  return 'newBoard'
                  break;
              case 'ask':
                  return 'vocationLeave'
                  break;
              case 'moveapprove':
                  return 'approveApply'
                  break;
              case 'management':
                  return 'usingMana'
                  break;
          }
      },
      filterDepName(val) {
        if (val) {
          let arr = val.split(';')
          let nameArr = []
          for(var i = 0; i < arr.length; i++) {
            let item = arr[i];
            nameArr.push(item.indexOf('->') !== -1 ? item.split('->').splice(-1,1) : item)
          }
          return nameArr.join(';')
        } else {
          return '企微云';
        }
      },
      filterDelYear(val) {
        let arr = val.split('-')
        let curY = this.curYear
        if (arr[0] == curY) {
          arr.splice(0, 1)
        }
        return arr.join('-')
      },
      filterURL(isShowMana) {
        let arr = []
        if (!isShowMana) {
          // 判断是否开启‘应用管理’功能
          this.btnArr.pop()
        }
        arr = this.btnArr
        arr.forEach((item, index) => {
          switch(item.agentCode) {
            case 'checkwork':
              item.url =  _.baseURL + item.url
              break;
            case 'meetingassistant':
              item.url =  _.baseURL + item.url
              break;
            case 'car':
              item.url =  _.baseURL + item.url
              break;
            case 'reimbursement':
              item.url =  _.baseURL + item.url
              break;
            case 'dynamic':
              if (item.dynamicWaitCount == 0) {
                item.url = _.baseURL + item.url + window.wxqyhConfig.orgConfigInfo.corpId
              } else {
                item.url = _.baseURL + '/jsp/wap/dynamicinfoManage/dynamicinfo_list.jsp?t=4&status=1&schType=8&agentCode=dynamic&abc=1&corp_id=' + window.wxqyhConfig.orgConfigInfo.corpId
              }
              break;
            case 'ask':
              item.url =  _.baseURL + item.url + window.wxqyhConfig.orgConfigInfo.corpId
              break;
            case 'moveapprove':
              item.url =  _.baseURL + item.url + window.wxqyhConfig.orgConfigInfo.corpId
              break;
          }
        })
      },
      initShowArr(type) {
        let obj = dataBase.isShowArr
        Object.keys(obj).forEach((key) => {
          obj[key] = type;
        })
      },
      initList() {
        this.meetingWaitTaskList = [];
        this.waitTaskList = [];
      },
      filterBtnArr(list) {
        let self = this;
        this.initShowArr(false);
        list.forEach((item, index) => {
          switch(item.agentCode) {
            case 'checkwork':
              dataBase.isShowArr.isShowCheckWork = true;
              break;
            case 'meetingassistant':
              dataBase.isShowArr.isShowMeet = true;
              break;
            case 'car':
              dataBase.isShowArr.isShowCar = true;
              break;
            case 'reimbursement':
              dataBase.isShowArr.isShowReim = true;
              break;
            case 'dynamic':
              dataBase.isShowArr.isShowDynamic = true;
              break;
            case 'ask':
              dataBase.isShowArr.isShowAsk = true;
              self.checkTemplateType();
              break;
            case 'moveapprove':
              dataBase.isShowArr.isShowMove = true;
              break;
          }
        })
      },
      checkTemplateType(){
        _.ajax({
          url: _.baseURL + '/portal/ask/checkTemplateType.do ',
          type: "GET",
          success: function (result) {
            if (result.code == "0") {
              let travel = result.data.travel;
              let overtime = result.data.overtime;
              if(travel){
                dataBase.isShowArr.isShowTravel = true;
              }
              if(overtime){
                dataBase.isShowArr.isShowOvertime = true;
              }
            } else {
              _.alert('提示',result.desc);
            }
          }
        })
      },
      toMeetStatus() {
        return _.baseURL + '/jsp/wap/meeting/meetingroom_list.jsp?agentCode=meetingassistant&abc=1'
      },
      toMeetDetail(id) {
        return _.baseURL + '/jsp/wap/meeting/meeting_detail.jsp?taskId=' + id
      },
      toMeetIndex() {
        return _.baseURL + '/jsp/wap/meeting/meeting_index.jsp?type=2&status=1&agentCode=meetingassistant&abc=1'
      },
      toWaitDetail(type, item) {
        switch(type) {
          case 'ask':
            return _.baseURL + '/jsp/wap/ask/detail.jsp?askId=' + item.askId + '&corp_id=' + window.wxqyhConfig.orgConfigInfo.corpId
            break;
          case 'reimbursement':
            return _.baseURL + '/jsp/wap/reimbursement/detail.jsp?reimId=' + item.reimId
            break;
          case 'car':
            return _.baseURL + '/jsp/wap/car/detail.jsp?askId=' + item.askId
            break;
          case 'meetingassistant':
            return _.baseURL + '/jsp/wap/meeting/meeting_detail.jsp?taskId=' + item.id
            break;
          case 'checkwork':
            return  _.baseURL + '/jsp/wap/checkwork/rep_list.jsp?type=1&recType=2&agentCode=checkwork&abc=1'
            break;
          case 'moveapprove':
            return _.baseURL + "/vp/module/moveapprove.html?corp_id=" + window.wxqyhConfig.orgConfigInfo.corpId + "&agentCode=moveapprove#/detail?moveId=" + item.moveapproveId
            break;
        }
      },
      toApplyManma(agentCode) {
        if (agentCode === 'management') {
          this.$router.push({
            name : 'applyMana',
            params: {
              isRefresh: true
            }
          })
        }
      },
      filterShow(type) {
        if (type === 'checkwork') {
          return this.isShowCheckWork
        } else if (type === 'meetingassistant') {
          return this.isShowMeet
        } else if (type === 'car') {
          return this.isShowCar
        } else if (type === 'reimbursement') {
          return this.isShowReim
        } else if (type === 'ask') {
          return this.isShowAsk
        } else if (type === 'moveapprove') {
          return this.isShowMove
        } else if (type === 'dynamic') {
          return this.isShowDynamic
        } else if (type === 'management') {
          return true
        }
      },
    },
    computed: {
      corp_id() {
        // let id = _.getUrlParam("corp_id")
        console.log(window.wxqyhConfig.orgConfigInfo.corpId)
        let id = window.wxqyhConfig.orgConfigInfo.corpId
        let result = id ? id : ''
        return result
      },
      curYear() {
        var date = new Date();
        var year = date.getFullYear();
        return year;
      },
      filterHeight() {
        let num = this.btnArrNum
        if (num < 5) {
          return 'height: 100px'
        } else {
          return 'height: 190px'
        }
      },
      btnArrNum() {
        let num = 0
        let obj = this.dataBase2.isShowArr
        Object.keys(obj).forEach(function(key){
          if (obj[key]) {
            num++;
          }
        });
        if (this.canCustomAgent) {
          return num+1;
        } else {
          return num;
        }
      },
      isShowAsk() {
        return this.dataBase2.isShowArr.isShowAsk
      },
      isShowDynamic() {
        return this.dataBase2.isShowArr.isShowDynamic
      },
      isShowMeet() {
        return this.dataBase2.isShowArr.isShowMeet
      },
      isShowMove() {
        return this.dataBase2.isShowArr.isShowMove
      },
      isShowCheckWork() {
        return this.dataBase2.isShowArr.isShowCheckWork
      },
      isShowReim() {
        return this.dataBase2.isShowArr.isShowReim
      },
      isShowCar() {
        return this.dataBase2.isShowArr.isShowCar
      },
      filterVIP() {
        let a = isVipGold(interfaceCode.INTERFACE_CODE_MEET)
        return a;
      },
    },
    filters: {
      filterMeetTime(item) {
        if (item.endTimeStr) {
          return item.startTimeStr + ' - ' + item.endTimeStr
        } else {
          return item.startTimeStr
        }
      },
    },
    watch: {
      $route(val) {
        var self = this
        if (val.params.isRefresh) {
          this.$nextTick(function () {
            self.requestData()
          })
        }
      }
    }
  }

</script>

<style lang="scss" scoped>
  .qwui-waitIndexWrap {
    background: #fff;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .qwui-btn_red {
    background: #FE5354;
    color: #fff;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    font-size: 12px;
    text-align: center;
  }
  .qwui-top {
    position: relative;
    .qwui-top_img {
      background: url(~assets/svg/img_a-home_bg.svg) no-repeat top center;
      background-size: 102%;
      height: 190px;
      width: 100%;
      margin-top: -2px;
    }
    .qwui-btn_wrapper {
      position: absolute;
      top: 22px;
      left: 14px;
      right: 14px;
      z-index: 3;
      padding: 8px 0;
      border-radius: 6px;
      background: #fff;
      box-shadow: 0px 2px 12px rgba(0,0,0,.07);
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .qwui-btn_item {
        padding: 10px 0;
        width: 25%;
        a {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .qwui-btn_img {
            width: 30px;
            height: 30px;
            position: relative;
            &.takeCard {
              background: url(~assets/svg/ic_takeCard.svg) no-repeat center center;
              background-size: 100%;
              width: 32px;
            }

            &.meetAssit {
              background: url(~assets/svg/ic_meetAssit.svg) no-repeat center center;
              background-size: 100%;
              width: 29px;
            }

            &.useCar {
              background: url(~assets/svg/ic_useCar.svg) no-repeat center center;
              background-size: 100%;
              width: 33px;
            }

            &.feePay {
              background: url(~assets/svg/ic_feePay.svg) no-repeat center center;
              background-size: 100%;
            }

            &.newBoard {
              background: url(~assets/svg/ic_newBoard.svg) no-repeat center center;
              background-size: 100%;
              width: 29px;
            }

            &.vocationLeave {
              background: url(~assets/svg/ic_vocation.svg) no-repeat center center;
              background-size: 100%;
              width: 28px;
            }

            &.approveApply {
              background: url(~assets/svg/ic_approve.svg) no-repeat center center;
              background-size: 100%;
              width: 31px;
            }

            &.usingMana {
              background: url(~assets/svg/ic_usingMana.svg) no-repeat center center;
              background-size: 100%;
            }
            .qwui-btn_red {
              position: absolute;
              top: -10px;
              right: -5px;
            }
          }
          img {
            width: 30px;
            height: 30px;
          }
          .qwui-btn_item_text {
            color: #7A7C80;
            font-size: 12px;
            margin-top: 8px;
          }
        }
      }
    }
  }
  .qwui-content-wrapper {
    flex: 1;
    background: #fff;
    // margin-bottom: 50px;
    // margin-top: 190px;
  }
  .qwui-meeting {
    margin-top: 24px;
    padding: 0 14px 24px 14px;
    .qwui-no_meet {
      display: flex;
      align-items: center;
      justify-content: center;
      .qwui-meetImg_wrap {
        margin-right: 22px;
        img {
          width: 160px;
          height: 60px;
        }
      }
      .qwui-no_meet_right {
        h3 {
          color: #0A1735;
          font-size: 14px;
          margin-bottom: 5px;
        }
        .qwui-no_meet_check {
          color: #B2B9C8;
          font-size: 12px;
        }
      }
    }
    .qwui-meeting_wrapper {
      h3 {
        color: #0A1735;
        font-size: 14px;
      }
      .qwui-meeting_item_wrapper {
        margin-top: 15px;
        margin-left: 4px;
        padding-bottom: 5px;
        border-left: 2px solid #F7F8FA;
        .qwui-meeting_item {
          margin-bottom: 24px;
          display: block;
          .qwui-top_area {
            display: flex;
            align-items: center;
            padding-left: 17px;
            &.qwui-icon_active {
              position: relative;
              &:before {
                content: '';
                position: absolute;
                left: -5px;
                top: 50%;
                transform: translateY(-50%);
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #5585F0;
                box-shadow: 0 0 10px #5585F0;
              }
            }
            &.qwui-icon_normal {
              position: relative;
              &:before {
                content: '';
                position: absolute;
                left: -5px;
                top: 50%;
                transform: translateY(-50%);
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #E3E4E8;
              }
            }
            .qwui-time {
              font-size: 14px;
              color: #7A7C80;
            }
          }
          .qwui-meeting_text {
            margin-top: 6px;
            padding-left: 17px;
            color: #0A1735;
            font-size: 16px;
            // overflow:hidden; //超出的文本隐藏
            // text-overflow:ellipsis; //溢出用省略号显示
            // white-space:nowrap; //溢出不换行
            // display: -webkit-box;
            // -webkit-box-orient:vertical;
            // -webkit-line-clamp:2;
          }
          .qwui-room {
            display: inline-block;
            margin-top: 8px;
            margin-left: 14px;
            padding: 0 12px;
            font-size: 12px;
            color: #A7ACB7;
            border-radius: 6px;
            background: #F3F4F6;
            max-width: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .qwui-checkAllMeeting {
          color: #5585F0;
          font-size: 12px;
          margin-left: 17px;
        }
      }
    }
  }

  .qwui-splice_area {
    width: 100%;
    height: 8px;
    background: #F7F8FA;
  }

  .qwui-waiting {
    padding: 24px 0 50px 0px;
    .qwui-no_wait {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 145px;
      margin-top: 33px;
      .qwui-waitImg_wrap {
        img {
          width: 160px;
          height: 68px;
        }
      }
      .qwui-wait-text {
        color: #B2B9C8;
        font-size: 14px;
      }
    }
    .qwui-waiting-top {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 10px;
      margin-left: 15px;
      h3 {
        color: #0A1735;
        font-size: 14px;
      }
      span {
        margin-left: 8px;
        color: #7A7C80;
        font-size: 13px;
      }
    }
    .qwui-waiting_wrapper {
      margin-left: 15px;
      .qwui-waiting_item {
        display: block;
        padding: 10px 26px 15px 35px;
        border-bottom: 1px solid #F7F8FA;
        .qwui-waiting_title {
          color: #0A1735;
          font-size: 16px;
          position: relative;
          .qwui-btn_red {
            position: absolute;
            left: -20px;
            top: -5px;
          }
          &.qwui-ask {
            position: relative;
            &:before {
              content: '';
              position: absolute;
              left: -35px;
              top: 0;
              width: 22px;
              height: 22px;
              background: url(~assets/svg/ic_vocation.svg) no-repeat center center;
              background-size: 18px 22px;
            }
          }
          &.qwui-reimbursement {
            position: relative;
            &:before {
              content: '';
              position: absolute;
              left: -35px;
              top: 0;
              width: 22px;
              height: 22px;
              background: url(~assets/svg/ic_feePay.svg) no-repeat center center;
              background-size: 18px 22px;
            }
          }
          &.qwui-car {
            position: relative;
            &:before {
              content: '';
              position: absolute;
              left: -35px;
              top: 0;
              width: 22px;
              height: 22px;
              background: url(~assets/svg/ic_useCar.svg) no-repeat center center;
              background-size: 18px 22px;
            }
          }
          &.qwui-meetingassistant {
            position: relative;
            &:before {
              content: '';
              position: absolute;
              left: -35px;
              top: 0;
              width: 22px;
              height: 22px;
              background: url(~assets/svg/ic_meetAssit.svg) no-repeat center center;
              background-size: 18px 22px;
            }
          }
          &.qwui-checkwork {
            position: relative;
            &:before {
              content: '';
              position: absolute;
              left: -35px;
              top: 0;
              width: 22px;
              height: 22px;
              background: url(~assets/svg/ic_takeCard.svg) no-repeat center center;
              background-size: 18px 22px;
            }
          }
          &.qwui-moveapprove {
            position: relative;
            &:before {
              content: '';
              position: absolute;
              left: -35px;
              top: 0;
              width: 22px;
              height: 22px;
              background: url(~assets/svg/ic_approve.svg) no-repeat center center;
              background-size: 18px 22px;
            }
          }
        }
        .qwui-detail_wrapper {
          display: flex;
          flex-direction: column;
          span {
            color: #7A7C80;
            font-size: 12px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            max-width: 100%;
            &:first-child {
              margin: 4px 0;
            }
          }
        }
      }
    }
    .qwui-bottom_text {
      padding-bottom: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #D2D5DB;
      font-size: 12px;
      height: 41px;
      span {
        display: inline-block;
        height: 17px;
        line-height: 17px;
      }
    }
  }


  .qwui-allNone {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin-bottom: 100%;
    padding-top: 170px;
    background: #fff;
    img {
      width: 197px;
      height: 124px;
    }
    .qwui-allNone-text {
      margin-top: 6px;
      margin-bottom: 4px;
      color:#0A1735;
      font-size: 15px;
    }
    .qwui-allNone-tips {
      color: #B2B9C8;
      font-size: 12px;
    }
  }
</style>

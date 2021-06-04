<template>
  <div class="qwui-addMask_wrap" >
    <a href="http://d.do1.com.cn/BT49" class="qwui-top">
      <span>审批申请单的类型不够用？</span>
      <span>使用表单流程，自定义表单与审批流程></span>
    </a>
    <div class="qwui-main_operate">
      <div class="qwui-btn_wrapper">
        <div class="qwui-btn_item" v-for="(item, index) in btnArr" :key="index" v-show="filterShow(item.agentCode)">
          <a :href="toIndex(index)" @click="toDaraft(item.agentCode)">
            <div class="qwui-btn_img" :class="filterIcon(index)"></div>
            <span class="qwui-btn_item_text">{{item.title | filterTitle}}</span>
          </a>
        </div>
      </div>
    </div>
    <div class="qwui-closeBtn_wrap">
      <a href="javascript:;" class="qwui-closeBtn" @click="closeAdd()"></a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'addMask',
    data() {
      return {
        btnArr: [{
            title: '打卡',
            agentCode: "checkwork",
            isShow: true
          },
          {
            title: '新建会议',
            agentCode: "meetingassistant",
            isShow: true
          },
          {
            title: '会议室状态',
            agentCode: "meetingassistant",
            isShow: true
          },
          {
            title: '单位用车申请',
            agentCode: "car",
            isShow: true
          },
          {
            title: '企业滴滴用车',
            agentCode: "car",
            isShow: true
          },
          {
            title: '新建报销',
            agentCode: "reimbursement",
            isShow: true
          },
          {
            title: '新建请假',
            agentCode: "ask",
            isShow: true
          },
          {
            title: '新建出差',
            agentCode: "travel",
            isShow: true
          },
          {
            title: '新建加班',
            agentCode: "overtime",
            isShow: true
          },
          {
            title: '发起审批',
            agentCode: "moveapprove",
            isShow: true
          },
          {
            title: '发布动态',
            agentCode: "dynamic",
            isShow: true
          },
          {
            title: '草稿',
            agentCode: "draft",
            isShow: true
          },
        ],
        dataBase2: dataBase,
        hasPermission: false,
      }
    },
    created() {
      this.getPermission()
    },
    methods: {
      getPermission() {
        var self = this
        _.ajax({
            url: _.baseURL + '/portal/dynamicinfomanage/dynamicinfomanageAction!getPermission.action?belongAgent=dynamic',
            type: "POST",
            success: function (result) {
              self.hasPermission = result.data.hasPermission ? true : false;
            }
        })
      },
      filterShow(type) {
        switch(type) {
          case 'checkwork':
            return this.isShowCheckWork
            break;
          case 'meetingassistant':
            return this.isShowMeet
            break;
          case 'car':
            return this.isShowCar
            break;
          case 'reimbursement':
            return this.isShowReim
            break;
          case 'ask':
            return this.isShowAsk
            break;
          case 'travel':
            return this.isShowTravel
            break;
          case 'overtime':
            return this.isShowOvertime
            break;
          case 'moveapprove':
            return this.isShowMove
            break;
          case 'dynamic':
            return (this.isShowDynamic && this.hasPermission)
            break;
          case 'draft':
            return dataBase.totalDrafCount ? true : false;
            break;
        }
      },
      filterIcon(index) {
        switch (index) {
          case 0:
            return 'takeCard'
            break;
          case 1:
            return 'addMeet'
            break;
          case 2:
            return 'meetAssit'
            break;
          case 3:
            return 'useCar'
            break;
          case 4:
            return 'didiCar'
            break;
          case 5:
            return 'feePay'
            break;
          case 6:
            return 'vocationLeave'
            break;
          case 7:
            return 'vocationTravel'
            break;
          case 8:
            return 'vocationOvertime'
            break;
          case 9:
            return 'approveApply'
            break;
          case 10:
            return 'newBoard'
            break;
          case 11:
            return 'draft'
            break;
        }
      },
      toIndex(index) {
        switch (index) {
          case 0:
            return _.baseURL + '/jsp/wap/checkwork/add.jsp?agentCode=checkwork&abc=1';
            break;
          case 1:
            return _.baseURL + '/jsp/wap/meeting/meeting_add.jsp?agentCode=meetingassistant&abc=1';
            break;
          case 2:
            return _.baseURL + '/jsp/wap/meeting/meetingroom_list.jsp?agentCode=meetingassistant&abc=1';
            break;
          case 3:
            return _.baseURL + '/jsp/wap/car/add.jsp?agentCode=car&abc=1';
            break;
          case 4:
            return _.baseURL + '/jsp/wap/didi/diditrade.jsp?type=1&agentCode=car&abc=1';
            break;
          case 5:
            return _.baseURL + '/jsp/wap/reimbursement/add.jsp?agentCode=reimbursement&abc=1';
            break;
          case 6:
            return _.baseURL + '/vp/module/leaveapply.html?corp_id=' + window.wxqyhConfig.orgConfigInfo.corpId + "#/add?leaveType=0";
            break;
          case 7:
            return _.baseURL + '/vp/module/leaveapply.html?corp_id=' + window.wxqyhConfig.orgConfigInfo.corpId + "#/add?leaveType=1";
            break;
          case 8:
            return _.baseURL + '/vp/module/leaveapply.html?corp_id=' + window.wxqyhConfig.orgConfigInfo.corpId + "#/add?leaveType=2";
            break;
          case 9:
            return _.baseURL + '/vp/module/moveapprove.html?agentCode=moveapprove&corp_id=' + window.wxqyhConfig.orgConfigInfo.corpId + '#/add';
            break;
          case 10:
            return _.baseURL + '/jsp/wap/dynamicinfoManage/add.jsp?agentCode=dynamic&abc=1';
            break;
          case 11:
            return 'javascript:void(0)';
            break;
        }
      },
      toDaraft(code) {
        if (code === 'draft') {
          this.closeAdd()
          this.$router.push({
            name: 'draft'
          })
        }
      },
      closeAdd() {
        this.$emit('closeAdd')
      }
    },
    computed: {
      corp_id() {
        // let id = _.getUrlParam("corp_id")
        let id = window.wxqyhConfig.orgConfigInfo.corpId
        let result = id ? id : ''
        return result
      },
      isShowAsk() {
        return this.dataBase2.isShowArr.isShowAsk
      },
      isShowTravel() {
        return this.dataBase2.isShowArr.isShowTravel
      },
      isShowOvertime() {
        return this.dataBase2.isShowArr.isShowOvertime
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
    },
    filters: {
      filterTitle(val) {
        if (val === '草稿') {
          return '草稿(' + dataBase.totalDrafCount + ')'
        } else {
          return val
        }
      }
    },
  }

</script>

<style lang="scss" scoped>
  .qwui-addMask_wrap {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    background: #fff;
    z-index: 10;
  }

  .qwui-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 54px;
    width: 100%;
    span {
      color: #B2B9C8;
      font-size: 14px;
      &:first-child {
        margin-bottom: 6px;
      }
    }
  }

  .qwui-main_operate {
    position: relative;
    margin-top: 110px;

    .qwui-btn_wrapper {
      z-index: 3;
      padding: 8px 20px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .qwui-btn_item {
        padding: 20px 0;
        width: 25%;

        a {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          .qwui-btn_img {
            width: 30px;
            height: 30px;

            &.takeCard {
              background: url(../../../../assets/svg/ic_takeCard.svg) no-repeat center center;
              background-size: 100%;
              width: 32px;
            }

            &.addMeet {
              background: url(../../../../assets/svg/ic_addMeet.svg) no-repeat center center;
              background-size: 100%;
              width: 32px;
            }

            &.meetAssit {
              background: url(../../../../assets/svg/ic_meetAssit.svg) no-repeat center center;
              background-size: 100%;
              width: 28px;
            }

            &.useCar {
              background: url(../../../../assets/svg/ic_useCar.svg) no-repeat center center;
              background-size: 100%;
              width: 32px;
            }

            &.didiCar {
              background: url(../../../../assets/svg/ic_didiCar.svg) no-repeat center center;
              background-size: 100%;
              width: 32px;
            }

            &.feePay {
              background: url(../../../../assets/svg/ic_feePay.svg) no-repeat center center;
              background-size: 100%;
            }

            &.vocationLeave {
              background: url(~assets/svg/ic_leave.svg) no-repeat center center;
              background-size: 100%;
              width: 35px;
            }

            &.vocationTravel {
              background: url(~assets/svg/ic_travel.svg) no-repeat center center;
              background-size: 100%;
              width: 35px;
            }

            &.vocationOvertime {
              background: url(~assets/svg/ic_overtime.svg) no-repeat center center;
              background-size: 100%;
              width: 35px;
            }

            &.approveApply {
              background: url(../../../../assets/svg/ic_approve.svg) no-repeat center center;
              background-size: 100%;
            }

            &.newBoard {
              background: url(../../../../assets/svg/ic_newBoard.svg) no-repeat center center;
              background-size: 100%;
            }

            &.draft {
              background: url(../../../../assets/svg/ic_draft.svg) no-repeat center center;
              background-size: 100%;
              width: 41px;
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

  .qwui-closeBtn_wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 62px;
    line-height: 62px;
    width: 100%;
    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
      margin-bottom: 34px;
    }
    .qwui-closeBtn {
      width: 46px;
      height: 46px;
      background: url(../../../../assets/svg/icon_a-add_back.svg) no-repeat center center;
      background-size: cover;
    }
  }

  @media screen and (min-width: 1024px) {
    .qwui-addMask_wrap {
      width: 740px !important;
    }
  }

</style>

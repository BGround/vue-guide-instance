<template>
<!-- <transition name="fade"> -->
  <div class="qwui-pop_window" v-show="popWindowConfig.showWindow">
    <!-- 阴影 -->
    <div class="qwui-mask"></div>
    <!-- 时间控件 -->
    <time-picker :show.sync="switchShow" :defaultDate="endTime" :minuteInterval="5" @confirm="confirm" @cancel="cancel"></time-picker>
    <!-- window主体 -->
    <div class="qwui-operating_btn_wrapper">
      <div class="qwui-operating_title">{{ popTitle }}</div>
      <div class="qwui-scroll_box">
        <div class="qwui-content_wrapper">
          <!-- 结束类型 -->
          <div class="qwui-wrapper" v-if="popWindowConfig.endType.showType">
            <div class="qwui-title">
              <span class="qwui-title_text">结束类型</span>
            </div>
            <div class="qwui-btn-array">
              <a href="javascript:;" v-for="(item, index) in popWindowConfig.endType.btnArray" :key="index" class="qwui-btn_item" @click="changeEndType(index)">
                <span class="qwui-btn_item_img" :class="{'active': index + 1 == popWindowConfig.endType.btnActiveNum}"></span>
                <span class="qwui-btn_item_text">{{item}}</span>
              </a>
            </div>
          </div>
          <!-- 主任务评分（当前为主任务） -->
          <div class="qwui-wrapper" v-if="showScoreItem && popWindowConfig.score.showScore && popWindowConfig.isScore == 0 && !popWindowConfig.subtaskId">
            <div class="qwui-title">
              <span class="qwui-title_main_img"></span>
              <span class="qwui-title_text">{{popWindowConfig.taskTitle}}</span>
            </div>
            <div class="qwui-detail_score">
              <div class="star">
                <div class="qwui-score_box_select">
                  <span class="qwui-score_star" :class="{actived:start >= popWindowConfig.score.scoreNum}"  v-for="(n,start) in 10" :key="start" @click="chooseScore(start)"></span>
                </div>
              </div>
            </div>
          </div>
          <!-- 子任务评分（当前为主任务） -->
          <div class="qwui-wrapper" v-if="showScoreItem && popWindowConfig.score.showScore && popWindowConfig.subtaskList.length > 0 && popWindowConfig.isScore == 0 && (popWindowConfig.curOperate === 'endTask' || popWindowConfig.curOperate == 'updateScore') && !popWindowConfig.subtaskId" v-for="(item, index) in popWindowConfig.subtaskList" :key="index">
            <div class="qwui-title">
              <span class="qwui-title_sub_img"></span>
              <span class="qwui-title_text">{{item.title}}</span>
            </div>
            <div class="qwui-detail_score">
              <div class="star">
                <div class="qwui-score_box_select">
                  <span class="qwui-score_star" :class="{actived:start >= item.score}"  v-for="(n,start) in 10" :key="start" @click="chooseScoreSub(start, item)"></span>
                </div>
              </div>
            </div>
          </div>
          <!-- 子任务评分（当前为子任务） -->
          <div class="qwui-wrapper" v-if="showScoreItem && popWindowConfig.subtask && popWindowConfig.isScore == 0 && popWindowConfig.curOperate === 'endSubTask' && popWindowConfig.subtaskId && popWindowConfig.subtask.showSubTask">
            <div class="qwui-title">
              <span class="qwui-title_sub_img"></span>
              <span class="qwui-title_text">{{popWindowConfig.subtask.title}}</span>
            </div>
            <div class="qwui-detail_score">
              <div class="star">
                <div class="qwui-score_box_select">
                  <span class="qwui-score_star" :class="{actived:start >= popWindowConfig.subtask.score}"  v-for="(n,start) in 10" :key="start" @click="chooseScoreCurSub(start)"></span>
                </div>
              </div>
            </div>
          </div>
          <!-- 修改任务截止时间 -->
          <div class="qwui-wrapper" v-if="popWindowConfig.changeTime.showTime">
            <div class="qwui-title">
              <span class="qwui-title_text">修改任务截止时间</span>
            </div>
            <div class="qwui-time_item">
              <!-- <group>
                <datetime v-model="endTime"  format="YYYY-MM-DD HH:mm"
                value-text-align="left" @datetime-header-item-cancel-font-color="'#ff0000'"
                year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分"
                :confirm-text="$t('i18n.sure')" :cancel-text="$t('i18n.cancel')"></datetime>
              </group> -->
              <div class="qwui-time_item_wrapper" @click="switchShow=true">
                <span class="qwui-time_item_text">{{endTime}}</span>
                <span class="qwui-time_item_icon"></span>
              </div>
            </div>
          </div>
          <!-- 重启任务 -->
          <div class="qwui-wrapper" v-if="popWindowConfig.updateTask.showUpadate">
            <div class="qwui-title">
              <span class="qwui-title_text">重启任务</span>
            </div>
            <div class="qwui-checkbox_wrapper">
              <label class="qwui-label">
                  <input class="qwui-checkbox" type="checkbox" name="resetAll" v-model="popWindowConfig.updateTask.resetAll"/>
                  <span class="qwui-radioInput"></span>
                  <span class="qwui-text">重置所有人进度</span>
              </label>
            </div>
          </div>
          <div class="qwui-wrapper">
            <div class="qwui-textarea_wrapper">
              <!-- <textarea class="qwui-content_textarea" name="" id="" cols="30" rows="10" placeholder="填写原因" v-model="popWindowConfig.reasonText"></textarea> -->
              <textarea class="qwui-content_textarea" name="" id="" placeholder="填写原因" v-model="popWindowConfig.reasonText" maxlength="250"></textarea>
            </div>
          </div>
        </div>
      </div>
      <div class="qwui-operating_btn">
        <span class="qwui-cancle_btn" @click="closeMask">取消</span>
        <span class="qwui-confirm_btn" @click="confirmRequest">确定</span>
      </div>
    </div>
  </div>
  <!-- </transition> -->
</template>

<script>
  import * as timeUtil from '../../../../assets/js/time-util';
  import {Group, Datetime} from 'vux';
  import { updateTaskScore } from '../../api/getData';
  import timePicker from '@/components/basicUI/qwuiPicker/time_picker.vue'
  const operateArr = ['changeTime', 'updateTask','updateSubTask', 'endTask', 'endSubTask','updateScore'];
  const operateTitle = ['修改截止时间','重启主任务','重启子任务','结束主任务','结束子任务','任务评分'];

  export default {
    name: 'popWindow',
    props: {
      popWindowConfig: {
        type: Object
      },
    },
    data() {
      return {
        resetAll: false,
        reasonText: '',
        // startDate: '',
        // endDate: '',
        endTime: timeUtil.changeFormat(new Date(), 'yyyy-MM-dd hh:mm'),
        alertText: '',
        switchShow:false,
        showScoreItem:true
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {
      cycleCancel() {},
      confirmRequest() {
        let type = this.popWindowConfig.curOperate;
        let index = operateArr.indexOf(type);
        switch (index) {
          case 0:
            this.changeEndTime() // 修改截至时间
            break;
          case 1:
            this.requestUpdateTask() // 重启主任务
            break;
          case 2:
            this.requestUpdateTask() // 重启子任务
            break;
          case 3:
            this.requestEndTask() // 结束主任务
            break;
          case 4:
            this.requestEndTask() // 结束子任务
            break;
          case 5:
            this.requestEndTask()// 任务评分
            break;
        }
      },
      closeMask() {
        this.$emit('showPopWindow', false);
      },
      showGrace(grace) {
        let graceForLevel = [8,5,2];
        let levelText = ['干得漂亮','做得不错','需要改进','不忍直视'];
        for (let i = 0; i < graceForLevel.length; i++) {
          if (grace >= graceForLevel[i]) {
            return levelText[i];
          }
        }
        //如果不存在，那么就是分数很低，返回最后一个
        return levelText[levelText.length - 1];
      },
      chooseScore(index) {
        this.popWindowConfig.score.scoreNum = index + 1;
        if (this.popWindowConfig.endType.btnActiveNum == 1) {
          this.popWindowConfig.reasonText = this.showGrace(index);
        }
      },
      chooseScoreSub(index, item) {
        item.score = index + 1;
        if (this.popWindowConfig.endType.btnActiveNum == 1) {
          this.popWindowConfig.reasonText = this.showGrace(index);
        }
      },
      chooseScoreCurSub(index, item) {
        this.popWindowConfig.subtask.score = index + 1;
        if (this.popWindowConfig.endType.btnActiveNum == 1) {
          this.popWindowConfig.reasonText = this.showGrace(index);
        }
      },
      changeEndType(index) {
        this.showScoreItem = index == 0;
        this.popWindowConfig.endType.btnActiveNum = index + 1;
        let text = ['任务已完成','任务已终止','任务已取消','任务已拒绝'];
        this.popWindowConfig.reasonText = text[index];
      },
      changeEndTime() {
        var self = this;
        let isSub = this.filterSubTask();
        // let subId = this.popWindowConfig.subtaskId;
        // return subId ? true : false;
        // 子任务修改时间
        if (isSub) {
          let isRightTime = this.filterSubTime();
          if (isRightTime) {
            this.requestChangeTime(isSub);
          } else {
            _.alert('', this.alertText)
          }
        }
        // 主任务修改时间
        else {
          let isRightTime = this.filterMainTime();
          if (isRightTime) {
            this.requestChangeTime(isSub);
          } else {
            _.alert('', this.alertText)
          }
        }
      },
      requestChangeTime(isSub) {
        var self = this
        var data = {
          taskStop: this.endTime + ':00',
          reason: this.popWindowConfig.reasonText,
          taskId: this.popWindowConfig.taskId,
          subtaskId: this.popWindowConfig.subtaskId,
        }
        if (!isSub) {
          delete data.subtaskId
        }
        _.ajax({
          url: _.baseURL + '/portal/taskPortalCtl/updateTaskStop.do',
          type: "POST",
          data: data,
          success: function (result) {
            if (result.code == '0'){
              self.closeMask();
              self.$emit('refreshListData');
              _.tooltips_succeed('修改成功', true);
            } else {
              _.tooltips_succeed(result.desc, true, "", 3000);
            }
          }
        })
      },
      requestUpdateTask() {
        var self = this;
        // let path = this.popWindowConfig.subtaskId ? 'taskinfoAction!updateSubtaskStatus.action' : 'taskPortalCtl/updateTaskStatus.do';
        let path = this.popWindowConfig.subtaskId ? 'taskPortalCtl/updateSubtaskStatus.do' : 'taskPortalCtl/updateTaskStatus.do';
        let data = {
          reason: this.popWindowConfig.reasonText,
          score: 10,
          isScore: 0,
          subtaskInfo: {
            "subtask": []
          },
          status: '1',
          taskId: this.popWindowConfig.taskId,
          subtaskId: this.popWindowConfig.subtaskId,
        };
        if (this.popWindowConfig.updateTask.resetAll) {
          data['resetType'] = 1
        }

        let isSub = this.filterSubTask();
        if (!isSub) {
          delete data.subtaskId
        }

        // if (this.popWindowConfig.subtaskId) {
        //   data['subtaskId'] = this.popWindowConfig.subtaskId
        // } else {
        //   data['taskId'] = this.popWindowConfig.taskId
        // }
        _.ajax({
          url: _.baseURL + '/portal/' + path,
          type: "POST",
          data: data,
          success: function (result) {
            if (result.code == 0) {
              self.closeMask();
              _.tooltips_succeed("重启成功", true, "", 3000);
              self.$emit('refreshListData');
            } else {
              _.tooltips_succeed(result.desc, true, "", 3000);
            }
          }
        })
      },
      requestEndTask() {
        var self = this;
        let subtaskInfo = this.filterSubTaskList(this.popWindowConfig.subtaskId);
        // let path = this.popWindowConfig.subtaskId ? 'taskinfoAction!updateSubtaskStatus.action' : 'taskPortalCtl/updateTaskStatus.do';
        let path = this.popWindowConfig.subtaskId ? 'taskPortalCtl/updateSubtaskStatus.do' : 'taskPortalCtl/updateTaskStatus.do';
        let taskCloseType = this.popWindowConfig.endType.btnActiveNum;
        // 如果是任务评分，则用评分的接口
        if (this.popWindowConfig.curOperate == 'updateScore'){
          path = 'taskPortalCtl/updateScore.do';
          taskCloseType = '';
        }
        let score = this.popWindowConfig.subtaskId ? this.popWindowConfig.subtask.score : this.popWindowConfig.score.scoreNum;
        let data = {
          reason: this.popWindowConfig.reasonText,
          score:  score,
          taskCloseType: taskCloseType,
          isScore: this.popWindowConfig.isScore,
          resetType: '',
          subtaskInfo: JSON.stringify(subtaskInfo),
          status: '2',
        };
        if (this.popWindowConfig.subtaskId) {
          data['subtaskId'] = this.popWindowConfig.subtaskId
        } else {
          data['taskId'] = this.popWindowConfig.taskId
        }
        _.showLoading();
        _.ajax({
          url: _.baseURL + '/portal/' + path,
          type: "POST",
          data: data,
          success: function (result) {
            _.hideLoading();
            if (result.code == 0) {
              self.closeMask();
              _.tooltips_succeed("结束成功", true, "", 3000);
              self.$emit('refreshListData');
            } else {
              _.tooltips_succeed(result.desc, true, "", 3000);
            }
          }
        })
      },
      filterSubTask() {
        let subId = this.popWindowConfig.subtaskId;
        return subId ? true : false;
      },
      filterSubTaskList(subId) {
        var self = this;
        let a = {
          "subtask": []
        };
        if (this.popWindowConfig.subtaskList && !subId) {
          console.log('有list')
          this.popWindowConfig.subtaskList.forEach(item => {
            let b = {};
            b['subtaskId'] = item.subtaskId;
            b['score'] = item.score;
            a.subtask.push(b);
          })
          console.log(a)
        } else if (subId) {
          let c = {};
          c['subtaskId'] = subId;
          c['score'] = self.popWindowConfig.subtask.score;
          a.subtask.push(c);
        }
        return a
      },
      // 修改主任务时间，的时间规则...子任务截止时间/主任务开始时间 < 主任务截止时间(val)
      filterMainTime() {
        let val = timeUtil.dateToUnix(this.endTime)
        let item = this.popWindowConfig.changeTime
        let mainStart = timeUtil.dateToUnix(item.mainTaskTime[0]) // 主任务开始时间
        let subEnd = 0
        if (item.subTaskTimeEnd.length) {
          subEnd = item.subTaskTimeEnd.sort().reverse()[0]; // 最大的子任务截止时间
        }
        let arr = []
        arr.splice(0, 0, val, mainStart, subEnd)
        arr = arr.sort()
        // if (item.subTaskTimeEnd) {
        //   arr = arr.concat(item.subTaskTimeEnd)
        // }
        let index = arr.indexOf(val)
        let indexSub = arr.indexOf(subEnd)
        if (index == 2) {
          return true;
        } else if (index == 1 && indexSub == 2) {
          // this.alertText = '截止时间不能早于子任务截止时间';
          this.alertText = '截止时间不能早于开始时间';
          return false;
        } else if (index == 1 && indexSub == 0) {
          // this.alertText = '截止时间不能早于主任务开始时间';
          this.alertText = '截止时间不能早于开始时间';
          return false;
        } else if (index == 0 && indexSub == 2) {
          this.alertText = '截止时间不能早于子任务截止时间';
          // this.alertText = '截止时间不能早于开始时间';
          return false;
        } else if (index == 0 && indexSub == 1) {
          // this.alertText = '截止时间不能早于主任务开始时间';
          this.alertText = '截止时间不能早于开始时间';
          return false;
        }
      },
      // 修改子任务时间，的时间规则...子任务开始时间 < 子任务截止时间(val) < 主任务截止时间
      filterSubTime() {
        let val = timeUtil.dateToUnix(this.endTime)
        let subStart = this.popWindowConfig.changeTime.subTaskTimeStart.sort().reverse()[0]; // 最大的子任务开始时间
        let mainEnd = this.popWindowConfig.changeTime.mainTaskTime[1] // 主任务截止时间
        let arr = []
        arr.splice(0, 0, val, subStart, mainEnd)
        arr = arr.sort()
        let index = arr.indexOf(val)
        if (index == 1) {
          return true;
        } else if (index == 0) {
          // this.alertText = '截止时间不能早于子任务开始时间';
          this.alertText = '截止时间不能早于开始时间';
          return false;
        } else if (index == 2) {
          // this.alertText = '截止时间不能晚于主任务截止时间';
          this.alertText = '截止时间不能早于开始时间';
          return false;
        }
      },
      // 将dateTime的start-time,end-time初始化
      initTime() {
        let isSub = this.filterSubTask();
        // 子任务(当前时间<子任务截止时间<主任务截止时间)
        if (isSub) {
          let end = this.popWindowConfig.changeTime.mainTaskTime;
          this.startDate = timeUtil.changeFormat(new Date(), 'yyyy-MM-dd');
          this.endDate = timeUtil.changeFormat(end, 'yyyy-MM-dd')
          console.log('子任务的爸爸的截止时间')
          console.log(this.endDate)
        }
        // 主任务(当前时间/子任务时间<主任务截止时间<...)
        else {
          var endsub, endDate, nowDate;
          // 有子任务
          if (this.popWindowConfig.changeTime.subTaskTime) {
            endsub = this.popWindowConfig.changeTime.subTaskTime.sort().reverse()[0];
            endDate = timeUtil.changeFormat(endsub, 'yyyy-MM-dd');
            nowDate = timeUtil.changeFormat(new Date(), 'yyyy-MM-dd');
            console.log('主任务的子任务的最晚时间')
            console.log(endDate)
            if (this.diffTime(endDate, nowDate)) {
              this.startDate = endDate;
            } else {
              this.startDate = nowDate;
            }
          }
          // 无子任务
          else {
            let nowDate = timeUtil.changeFormat(new Date(), 'yyyy-MM-dd');
            this.startDate = nowDate;
          }
        }
      },
      // 区别日期大小
      diffTime(time1, time2) {
        let val1 = timeUtil.dateToUnix(time1);
        let val2 = timeUtil.dateToUnix(time2);
        return val1 - val2 > 0 ? true : false;
      },
      cancel() {
        console.log('cancel')
      },
      confirm(val) {
        console.log('confirm',val);
        this.endTime = val;
      },
    },
    computed: {
      isMainEndTask() {
        if (popWindowConfig.subtaskList.length > 0 && popWindowConfig.isScore == 0 && popWindowConfig.curOperate === 'endTask' && !popWindowConfig.subtaskId) {
          return true;
        }
      },
      // 弹框的头部标题
      popTitle(){
        let type = this.popWindowConfig.curOperate;
        let index = operateArr.indexOf(type);
        return operateTitle[index];
      }
    },
    watch:{
      'popWindowConfig.showWindow':function () {
        this.popWindowConfig.reasonText = '任务已完成';
        this.showScoreItem = true;
      }
    },
    components: {
      Group,
      Datetime,
      timePicker,
    }
  }

</script>

<style lang="scss" scoped>
  .qwui-pop_window {
    width: 100%;
    height: 100%;
    .qwui-mask {
      position: fixed;
      z-index: 10;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      margin: auto;
      background: rgba(0, 0, 0, 0.2);
    }
    .qwui-operating_btn_wrapper {
      position: fixed;
      z-index: 11;
      top: 50%;
      left: 50%;
      width: 90%;
      padding-bottom: 48px;
      max-width: 640px;
      max-height: 492px;

      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      border-radius: 10px;
      text-align: center;
      background-color: #fff;
      .qwui-operating_title {
        position: relative;
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 16px;
        color: #0A1735;
        &:after{
           content: " ";
           position: absolute;
           left: 0;
           bottom: 0;
           right: 0;
           border-bottom: 1px solid #e5e5e5;
           -webkit-transform: scaleY(0.5);
           transform: scaleY(0.5);
           z-index: 2
         }
      }
      .qwui-operating_btn {
        position: fixed;
        width: 100%;
        height: 48px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        bottom: 0;
        border-radius: 10px;
        background: #fff;
        &:before {
          content: " ";
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          border-bottom: 1px solid #e5e5e5;
          -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5);
          z-index: 2
        }
        .qwui-cancle_btn,
        .qwui-confirm_btn {
          flex: 1;
          position: relative;
          line-height: 48px;
          color: #B2B9C8;
          font-size: 15px;
        }
        .qwui-cancle_btn:after{
          content: " ";
          position: absolute;
          height: 100%;
          top: 0;
          right: 0;
          transform:scaleX(0.5);
          border-right:1px solid #e5e5e5;
          z-index: 2
        }
        .qwui-confirm_btn {
          color: #648EEC;
        }
      }
      .qwui-scroll_box {
        overflow: hidden;
        .qwui-content_wrapper {
          max-height: 402px;
          overflow-y: scroll;
          &::-webkit-scrollbar {
            display: none;
          }
          .qwui-wrapper {
            .qwui-title {
              height: 26px;
              padding-left: 14px;
              font-size: 13px;
              color: #A2A4A7;
              text-align: left;
              display: flex;
              align-items: flex-end;
              .qwui-title_text {
                display: block;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                width: 273px;
                font-size: 13px;
              }
              .qwui-title_main_img {
                width: 22px;
                height: 22px;
                background: url(../../../../assets/svg/icon_a-newtask-list_maintask.svg) no-repeat center center;
                background-size: 22px;
                margin-right: 5px;
              }
              .qwui-title_sub_img {
                width: 22px;
                height: 22px;
                background: url(../../../../assets/svg/icon_a-newtask-list_subtask.svg) no-repeat center center;
                background-size: 22px;
                margin-right: 5px;
              }
            }
            .qwui-time_item {
              height: 50px;
              line-height: 50px;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              .qwui-time_item_wrapper {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 14px;
                span {
                  display: inline-block;
                }
                .qwui-time_item_text {
                  font-size: 15px;
                  color: #0A1735;
                }
                .qwui-time_item_icon {
                  width: 22px;
                  height: 22px;
                  background: url(../../../../assets/svg/icon_a-public_arrow-right.svg) no-repeat center center;;
                  background-size: cover;
                }
              }
              div {
                flex: 1;
              }
            }
            .qwui-btn-array {
              display: flex;
              align-items: center;
              max-width: 352px;
              .qwui-btn_item {
                flex: 1;
                padding: 0 15px;
                height: 46px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .qwui-btn_item_img {
                  width: 18px;
                  height: 18px;
                  display: inline-block;
                  background: url(../../../../assets/svg/icon-a-public_single_normal.svg) no-repeat center center;
                  background-size: 18px;
                  &.active {
                    background: url(../../../../assets/svg/icon-a-public_single_pressed.svg) no-repeat center center;
                    background-size: 18px;
                  }
                }
                .qwui-btn_item_text {
                  color: #0A1735;
                  font-size: 14px;
                  margin-left: 5px;
                }
              }
            }
            .qwui-detail_score {
              .star{
                padding: 13px 0 13px 14px;
                .qwui-score_box_select {
                  display: flex;
                  justify-content: flex-start;
                  position: relative;
                  text-align: left;
                  span {
                    display: inline-block;
                    width:19px;
                    height: 18px;
                    margin-right: 12px;
                    background: url(../../../../assets/svg/icon_a-end_state_select.svg) no-repeat;
                    background-size: cover;
                    &.actived{
                      background: url(../../../../assets/svg/icon_a-end_state.svg) no-repeat;
                      background-size: cover;
                    }
                    &span.start{
                      margin-left: 10px;
                    }
                  }
                }
              }
            }
            .qwui-textarea_wrapper {
              padding: 0 14px 30px 14px;
              .qwui-content_textarea {
                border: none;
                width: 100%;
                height: 98px;
                padding: 11px 14px;
                font-size: 15px;
                color: #0A1735;
                background: #F7F8FA;
                box-sizing: border-box;
              }
            }
            .qwui-checkbox_wrapper {
              padding: 15px 14px;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              .qwui-label {
                display: inline-block;
                font-size: 15px;
                color: #0A1735;
                margin-bottom: 5px;
                vertical-align: middle;
                &:last-child {
                  margin-bottom: 0;
                }
                .qwui-checkbox {
                  display: none;
                  &:checked + .qwui-radioInput {
                    background-position: -54px 0;
                  }
                }
                .qwui-radioInput {
                  height: 18px;
                  width: 18px;
                  background: url(../../../../assets/images/icon_check.png);
                  background-repeat: no-repeat;
                  background-size: cover;
                  background-position: -36px 0;
                  display: inline-block;
                  margin-right: 10px;
                  vertical-align: middle;
                }
                .qwui-text {
                  display: inline-block;
                  vertical-align: middle;
                }
              }
            }
          }
        }
      }
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: all 0.5s linear;
    transform: translate3d(0, 0, 0);
  }
  .fade-enter, .fade-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>

<style>
/* 去除时间选择器上下border */
.weui-cells:before, .weui-cells:after {
  display: none;
}
/* .vux-no-group-title {
  margin-top: 0;
} */

</style>

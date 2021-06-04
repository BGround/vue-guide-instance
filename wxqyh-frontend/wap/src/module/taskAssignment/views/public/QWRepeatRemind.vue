<template>
  <div>
    <div class="selectBox" v-show="remindBoxShow">
      <div class="qwui-separate_bar"></div>
      <div class="qwui-setting_inner_f_item" v-for="(item, index) in dataDetailMsg.switchControl" :key="index">
        <span class="qwui-setting_item_title">{{$t(item.content)}}</span>
        <div class="qwui-onOff_choose"
             :class="{'qwui-onOff_on': item.onOff, 'qwui-onOff': !item.onOff}"
             @click="clickOnOff(index)">
          <span class="qwui-onOff_off" :class="{'active': item.onOff}"></span>
        </div>
      </div>
      <div class="qwui-separate_bar"></div>
      <div>
        <div class="qwui-setting_inner_f_item">
          <span class="qwui-setting_item_title">{{$t('i18n.reminding')}}</span>
          <span class="qwui-remind_tip" @click="showRemindTip">i</span>
          <div class="qwui-onOff_choose"
               :class="{'qwui-onOff_on': remindData.remindSwitch, 'qwui-onOff': !remindData.remindSwitch}"
               @click="remindOnOff">
            <span class="qwui-onOff_off" :class="{'active': remindData.remindSwitch}"></span>
          </div>
        </div>
        <div v-show="remindData.remindSwitch">
          <div class="qwui-setting_inner_f_item qwui-flexbox">
            <span class="qwui-item_title">{{$t('i18n.frequency')}}</span>
            <a class="qwui-inner_item" :class="{ backgroundNone:!hasPermission }" @click="showDateBox">
              {{ remindCycleData }}
            </a>
          </div>
          <div class="qwui-time_remind">
            <group class="qwui-flexItem">
              <datetime v-model="remindData.remindTime"
                        :readonly="!hasPermission"
                        format="HH:mm"
                        :title="$t('i18n.remindingTime')"
                        hour-row="{value}时"
                        minute-row="{value}分"
                        :confirm-text="$t('i18n.sure')"
                        :cancel-text="$t('i18n.cancel')"></datetime>
            </group>
          </div>
        </div>
      </div>
      <div v-show="showCycleBox" class="qwui-pop">
        <div class="qwui-operating_title">设置重复提醒</div>
        <div class="selectContent qwui-border_bottom">
          <label
            v-for="(value,key,index) in remindData.dateList"
            :key="key">
            <input type="radio"
                   :value="key"
                   :id="value.text"
                   v-model="remindData.remindCycle"
                   style="display: none"
                   class="qwui-checkInput">
            <i class="qwui-check_btn"></i>
            {{ value.text }}
            <span>{{ value.desc }}</span>
          </label>
          <div v-show="isSelectWeek">
            <div class="qwui-setting_item">
              <div class="qwui-flex_item1">
                <p>每 <span>{{ remindData.regExp.rate }}</span> 周</p>
              </div>
              <div class="qwui-flex_item2">
                <p>
                  <span class="qwui-str_icon" @click="subNum"> - </span>
                  <span class="qwui-week_num">{{ remindData.regExp.rate }}</span>
                  <span class="qwui-add_icon" @click="addNum"> + </span>
                </p>
              </div>
            </div>
            <div>
              <ul class="qwui-week_day_choose">
                <li class="qwui-week_day"
                    v-for="(value,key,index) in weekDay"
                    :key="key"
                    :class="{ active: value.isActive }"
                    @click="selectWeek(key)">{{ value.text }}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="qwui-operating_btn">
          <span class="qwui-cancle_btn" @click="cycleCancel">{{$t('i18n.cancel')}}</span>
          <span class="qwui-confirm_btn" @click="cycleConfirm">{{$t('i18n.confirm')}}</span>
        </div>
      </div>
      <div class="qwui-mask" v-show="showCycleBox"></div>
      <button_group :fixed="true">
        <qwui_button type="default" :text="$t('i18n.cancel')" @buttonClick="cancelSelected"></qwui_button>
        <qwui_button v-if="hasPermission" type="primary" :text="$t('i18n.confirm')" @buttonClick="confirmSelected"></qwui_button>
      </button_group>
    </div>
  </div>
</template>

<script>
  import timeDetail from '@/components/base/time_detail'
  import Datetime from 'vux/src/components/datetime';
  import Group from 'vux/src/components/group';
  import * as timeUtil from '../../../../assets/js/time-util';
  import { qwui_button, button_group } from '@/components/base/button';
  import { isVipGold } from '@/assets/js/vip-portal';
  import { updateRemindTask } from '../../api/getData';

  const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五','周六']
  const WORKDAY = {
    ...WEEK,
    '1,2,3,4,5': '周一至周五',
    '1,2,3,4,5,6': '周一至周六',
    '0,1,2,3,4,5': '周一至周五; 周日',
    '0,1,2,3,4,5,6': '周一至周日'
  }
  const WEEKDAY = [
    {
      text:'日',
      isActive:false
    },
    {
      text:'一',
      isActive:false
    },
    {
      text:'二',
      isActive:false
    },
    {
      text:'三',
      isActive:false
    },
    {
      text:'四',
      isActive:false
    },
    {
      text:'五',
      isActive:false
    },
    {
      text:'六',
      isActive:false
    }
  ];
  export default {
    name: "repeat-remind",
    props: {
      remindBoxShow: {
        type: Boolean,
        default: true
      },
      remindData:{// 提醒的数据
        type:Object,
        default(){
          return {}
        }
      }
    },
    created:function () {
      this.handleTime(this.cycleTime);// 处理时间
      this.renderCycle();// 渲染频率数据
    },
    data() {
      return {
        showCycleBox:false,// 选择频率的弹框
        week: WEEK,
        weekDay:WEEKDAY,
        workDay:WORKDAY,
        dataDetailMsg:this.remindData.dataDetailMsg, // 其他提醒的信息
        remindCycleData:'', // 周期提醒频率显示的数据
        oldRemindData: {},
        oldCycleData: {},// 旧频率数据
      }
    },
    computed: {
      hasPermission(){
        if (!this.$store.getters.isDetailPage){
          return true;
        }
        return this.$store.getters.taskLevel == 'a1' && !this.$store.getters.taskOver;
      },
      // 判断是否选择了自定义选项
      isSelectWeek:function () {
        if (this.$store.getters.remindRender) {
          this.$store.commit('remindRenderUpdate', false);
          if (this.remindData.remindCycle == 5) {
            this.remindCycleData = this.customTime;
          } else {
            this.remindCycleData = this.remindData.dateList[this.remindData.remindCycle].text + this.remindData.dateList[this.remindData.remindCycle].desc;
          }
          this.$emit('listenToChild', this.remindCycleData);
        }
        return this.remindData.remindCycle == 5;
      },
      // 频率时间，无则用当前时间
      cycleTime:function () {
        return this.remindData.remindTimestamps ? new Date(this.remindData.remindTimestamps) : new Date();
      },
      // 自定义时间
      customTime:function () {
        let self = this;
        let arr = this.remindData.regExp.value.split(',');
        let str = [];
        arr.forEach(function (val) {
          str.push(WORKDAY[val]);
          self.weekDay[val].isActive = true;
        });
        str = str.join('、');
        if (str.length > 6){
          str = str.substring(0,5)+"..."
        }
        // 是否能直接转换为(周一至周六、周一至周日)等...
        if(WORKDAY[this.remindData.regExp.value]) {
          return '每 ' + this.remindData.regExp.rate + ' 周(' + WORKDAY[this.remindData.regExp.value] + ')';
        }
        return '每 ' + this.remindData.regExp.rate + ' 周(' + str + ')';
      },
    },
    watch:{
      remindBoxShow(){
        if (this.remindBoxShow){
          this.initRemindData();
        }
      }
    },
    methods: {
      // 保存旧提醒数据，用于还原
      initRemindData(){
        this.oldRemindData = {// 旧提醒数据
          remindSwitch: this.remindData.remindSwitch,// 按钮
          remindCycle: this.remindData.remindCycle,// 提醒类型，默认每天
          remindTimestamps: this.remindData.remindTimestamps,// 提醒时间戳
          remindTime: this.remindData.remindTime,// 提醒时间
          regExp: {
            rate: this.remindData.regExp.rate,
            type: this.remindData.regExp.type,
            value: this.remindData.regExp.value,
          },// 自定义时间数据
          dateList: this.remindData.dateList,// 提醒类型数据
          dataDetailMsg: {
            switchControl:[
              {content: this.$t('i18n.taskStartBeforeRemind'), onOff: this.remindData.dataDetailMsg.switchControl[0].onOff},
              {content: this.$t('i18n.taskEndBeforeRemind'), onOff: this.remindData.dataDetailMsg.switchControl[1].onOff},
              {content: this.$t('i18n.taskNewReviewRemind'), onOff: this.remindData.dataDetailMsg.switchControl[2].onOff},
              {content: this.$t('i18n.taskUpdateProgressRemind'), onOff: this.remindData.dataDetailMsg.switchControl[3].onOff}
            ]
          }// 其他提醒的数据
        }
        this.initCycleData();
      },
      // 保存旧的提醒频率数据，防止点击取消按钮后数据丢失
      initCycleData(){
        this.oldCycleData = {
          remindCycle: this.remindData.remindCycle,// 提醒类型，默认每天
          regExp: {
            rate: this.remindData.regExp.rate,
            type: this.remindData.regExp.type,
            value: this.remindData.regExp.value,
          },// 自定义时间数据
        }
      },
      // 还原提醒数据
      reduceRemindData(status){
        // status为true是频率选择的取消按钮
        if (status){
          this.remindData.regExp = {
            rate: this.oldCycleData.regExp.rate,
            type: this.oldCycleData.regExp.type,
            value: this.oldCycleData.regExp.value,
          };
          this.remindData.remindCycle = this.oldCycleData.remindCycle;
        }else {
          this.remindData.remindSwitch = this.oldRemindData.remindSwitch;
          this.remindData.remindCycle = this.oldRemindData.remindCycle;
          this.remindData.remindTimestamps = this.oldRemindData.remindTimestamps;
          this.remindData.remindTime = this.oldRemindData.remindTime;
          this.remindData.dateList = this.oldRemindData.dateList;
          this.remindData.regExp = {
            rate:this.oldRemindData.regExp.rate,
            type:this.oldRemindData.regExp.type,
            value:this.oldRemindData.regExp.value
          };
          this.remindData.dataDetailMsg = this.oldRemindData.dataDetailMsg;
        }
        this.renderCycle();
      },
      cancelSelected() {
        if(!this.$store.getters.remindDisplay){
          this.$emit('listenChildData','');
        }
        this.$emit('getShowType',false);
        this.reduceRemindData();
      },
      confirmSelected() {
        this.$store.commit('mainAddContentModuleHideUpdate');
        this.$store.commit('remindDisplayUpdate');
        if (this.remindData.remindSwitch){
          this.$emit('listenToChild', this.remindCycleData);
        }
        this.$emit('listenChildData',this.remindData);
        this.$emit('getShowType',false);
        // 任务提醒实时更新
        if(this.$store.getters.isDetailPage){
          let self = this;
          // 比对之前储存的数据，有修改传‘1’，没修改的传‘0’
          let remindBtn = this.$store.getters.switchControl;
          let remindTaskBtn = this.$store.getters.remindSwitch;
          let flag = '';
          this.remindData.dataDetailMsg.switchControl.forEach((item,i)=>{
            flag += remindBtn[i] == item.onOff ? '0':'1';
          });
          flag += remindTaskBtn == this.remindData.remindSwitch ? '0':'1';
          let params = {};
          params['tbQyTaskPO.taskId'] = this.$store.getters.taskId;
          // operationFlag,添加提醒模块传1，设置提醒传0
          params['operationFlag'] = 0;
          params['tbQyTaskPO.sendStartRemindMsg'] = this.remindData.dataDetailMsg.switchControl[0].onOff ? 0:-1;// 开始前30分钟提醒
          params['deadlineRemindMsg'] = this.remindData.dataDetailMsg.switchControl[1].onOff ? 0:1;// 截止前30分钟提醒
          params['tbQyTaskPO.commentSendMsg'] = this.remindData.dataDetailMsg.switchControl[2].onOff ? 1:0;// 有新评论时提醒
          params['tbQyTaskPO.rateSendMsg'] = this.remindData.dataDetailMsg.switchControl[3].onOff ? 1:0;// 更新进度时发送通知
          params['tbQyTaskPO.remindSwitch'] = this.remindData.remindSwitch ? 1:0;// 重复提醒按钮
          params['remindTask.remindCycle'] = this.remindData.dateList[this.remindData.remindCycle].cycle;// 重复提醒频率
          if (this.remindData.remindCycle == 5){
            params['remindTask.regExp'] = JSON.stringify(this.remindData.regExp);// 重复提醒自定义数据
          }

          params['remindTask.remindTime'] = timeUtil.changeFormat(new Date(),'yyyy-MM-dd') + ' ' + this.remindData.remindTime + ':00';// 重复提醒时间
          params['opeRemindTime'] = this.remindCycleData + this.remindData.remindTime;
          params['tbQyTaskPO.orgId'] = this.$store.getters.orgId;
          updateRemindTask(params,(result)=>{
            self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
          })
        }
      },
      handleTime(cycleTime) {
        let month = cycleTime.getMonth() + 1;
        let day = cycleTime.getDate();
        let week = cycleTime.getDay();
        this.remindData.dateList[2].desc = '(周' + '日一二三四五六'.split(/(?!\b)/)[week] + ')';
        this.remindData.dateList[3].desc = '(' + day + '日)';
        this.remindData.dateList[4].desc = '(' + month + '月' + day + '日)';
      },
      subNum(){
        if (this.remindData.regExp.rate <= 1){
          return;
        }
        this.remindData.regExp.rate -- ;
      },
      addNum(){
        if (this.remindData.regExp.rate >= 52){
          return;
        }
        this.remindData.regExp.rate ++ ;
      },
      selectWeek(index){
        let regExpValue = [];
        if (this.remindData.regExp.value != ''){
          regExpValue = this.remindData.regExp.value.split(',');
        }
        if (!this.weekDay[index].isActive){
          regExpValue.push(index);
        }else {
          if (regExpValue.length == 1) return;
          for (let i = 0; i < regExpValue.length; i++) {
            if (regExpValue[i] == index){
              regExpValue.splice(i,1);
              break;
            }
          }
        }
        this.weekDay[index].isActive = !this.weekDay[index].isActive;

        // 自定义时间排序
        this.remindData.regExp.value = regExpValue.sort().join(',');
      },
      showDateBox(){
        if (!this.hasPermission){ return; }
        this.showCycleBox = true;
      },
      clickOnOff(index){
        if (this.hasPermission){
          this.dataDetailMsg.switchControl[index].onOff = !this.dataDetailMsg.switchControl[index].onOff;
        }
      },
      remindOnOff(){
        if (!this.hasPermission){ return; }
        if (!isVipGold(interfaceCode.INTERFACE_CODE_TASK) || this.$store.getters.taskPermission.openRemind == 0){
          _.alert("", "亲爱的用户，后台没有开启重复提醒功能，请联系管理员开启");
        }else {
          this.remindData.remindSwitch = !this.remindData.remindSwitch;
        }
      },
      cycleCancel(){
        // 还原频率数据
        this.reduceRemindData(true);
        this.showCycleBox = !this.showCycleBox;
      },
      cycleConfirm(){
        if (this.remindData.remindCycle == 5 && this.remindData.regExp.value == ''){
          _.alert('','请选择具体的日期')
          return;
        }
        if(this.remindData.remindCycle != 5){
          this.remindData.regExp.value = '';
        }
        this.renderCycle();
        this.initCycleData();
        this.showCycleBox = !this.showCycleBox;
      },
      renderCycle(){
        this.weekDay.forEach((item)=>{
          item.isActive = false;
        });
        if (this.isSelectWeek){
          let arr = this.remindData.regExp.value.split(',');
          let self = this;
          arr.forEach(function (val) {
            self.weekDay[val].isActive = true;
          });
          this.remindCycleData = this.customTime;
        }else {
          this.remindCycleData = this.remindData.dateList[this.remindData.remindCycle].text + this.remindData.dateList[this.remindData.remindCycle].desc;
        }
      },
      showRemindTip(){
        _.alert('重复提醒','当任务未完成时，按照设置的频率重复提醒负责人，直至任务结束。')
      }
    },
    components: {
      qwui_button,
      button_group,
      timeDetail,
      Datetime,
      Group
    }
  }
</script>

<style>
  @media screen and (min-width:1024px) {
    .selectBox{
      width: 740px !important;
      margin: 0 auto;
    }
  }
  .selectBox {
    position: fixed;
    z-index: 11;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    /*max-width: 740px;*/
    margin: 0 auto;
    background-color: #F5F5F5;
  }
  .selectContent {
    padding-left: 15px;
    text-align: left;
    background-color: #fff;
  }
  .selectBox label {
    display: block;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
  }
  .selectBox .qwui-border_bottom:last-child:after{
    border: none;
  }
  /*选择样式*/
  .qwui-check_btn {
    background: 0 0 url("../../../../../src/assets/images/icon-a-public_single_ normal.svg") no-repeat;
    background-size: 18px 18px;
  }
  .qwui-checkInput:checked+.qwui-check_btn {
    background: 0 0 url("../../../../../src/assets/images/icon-a-public_single_pressed.svg") no-repeat;
    background-size: 18px 18px;
  }
  /*加减号*/
  .qwui-add_icon, .qwui-str_icon {
    display: inline-block;
    width: 26px;
    height: 26px;
    line-height: 26px;
    vertical-align: middle;
    text-align: center;
    font-weight: bolder;
    font-size: 24px;
    color: #7A7C80;
  }
  .qwui-str_icon {
    color: #E3E4E8;
  }
  .qwui-week_num {
    display: inline-block;
    width: 40px;
    height: 24px;
    vertical-align: middle;
    line-height: 24px;
    text-align: center;
    border-radius: 2px;
    background: #F4F6F8;
    color: #FF548F;
  }
  .qwui-week_day_choose {
    margin-left: 25px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 10px 15px;
  }
  .qwui-week_day {
    width: 28px;
    height: 28px;
    float: left;
    line-height: 28px;
    text-align: center;
    font-size: 14px;
    color: #A2A4A7;
    cursor: pointer;
  }
  .qwui-week_day.active {
    border-radius: 50%;
    color: #fff;
    background: #6E9BFF;
  }
  .qwui-setting_item {
    position: relative;
    display: flex;
    padding: 0 15px;
    height: 44px;
    line-height: 44px;
    background-color: white;
    overflow: hidden;
    clear: both;
    font-size: 14px;
  }
  .qwui-flex_item1 {
    flex: 2;
    margin-left: 25px;
    color: #7A7C80;
  }
  .qwui-flex_item2 {
    flex: 3;
    text-align: right;
  }
  .qwui-setting_inner_f_item {
    display: flex;
    position: relative;
    min-height: 19px;
    padding: 12px 15px;
    color: #333;
    font-size: 14px;
    background: #fff;
  }
  .qwui-item_title, .qwui-inner_item{
    flex: 1;
    font-size: 14px !important;
  }
  .qwui-inner_item {
    flex: 3;
    padding-right: 15px;
    text-align: right;
    color: #999;
    background: url("../../../../assets/svg/right.svg") no-repeat scroll right;
    cursor: pointer;
  }
  .qwui-inner_item.backgroundNone{
    padding-right: 0;
    background: none;
  }
  .qwui-time_remind{
    display: flex;
    position: relative;
    min-height: 19px;
    padding: 0;
    color: #333;
    font-size: 14px;
    line-height: 22px;
    background: #fff;
  }
  .qwui-flexItem {
    flex: 1;
  }
  .qwui-operating_title {
    position: relative;
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 16px;
    color: #0A1735;
  }
  .qwui-operating_btn {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 48px;
  }
  .qwui-operating_btn:after, .qwui-operating_title:after{
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
  .qwui-cancle_btn, .qwui-confirm_btn {
    position: relative;
    flex: 1;
    line-height: 48px;
    color: #B2B9C8;
    font-size:15px;
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
  .qwui-dialog {
    border-radius: 10px;
  }
  .qwui-flexItem .vux-no-group-title{
    margin: 0!important;
  }
  .qwui-time_remind .weui-cells .weui-cell{
    padding: 13px 15px;
  }
  .weui-cells:before, .qwui-separate_bar:before{
    border-top: none !important;
  }
  .weui-cells:after, .qwui-separate_bar:after{
    border-bottom: none !important;
  }
  .weui-cells{
    font-size: 14px!important;
  }
  .qwui-pop{
    position: fixed;
    z-index: 11;
    top: 50%;
    left: 50%;
    width: 80%;
    max-width: 640px;
    max-height: 450px;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    border-radius: 4px;
    text-align: center;
    background-color: #fff;
    overflow: hidden;
  }
  .qwui-remind_tip {
    position: relative;
    top: 3px;
    left: 5px;
    height: 14px;
    width: 14px;
    text-align: center;
    line-height: 14px;
    border: 1px solid #586C94;
    color: #586C94;
    border-radius: 50%
  }
</style>

<template>
  <div>
    <div class="qwui-remind_item" :class="addResponsibleClass" @click="editRemindContent">
      <i class="qwui-remind_icon"></i>
      <div class="qwui-flexItem">
        <span class="qwui-remind_data">{{ remindTimeInfomation }}</span>{{$t('i18n.taskRemind')}}
      </div>
      <i class="qwui-remind_right"></i>
    </div>
    <repeat-remind :remindBoxShow="remindBoxShow"
                   :remindData="remindData"
                   @listenToChild="getRemindCycle"
                   @listenChildData="getRemindData"
                   @getShowType="getShowType"></repeat-remind>
  </div>
</template>

<script>
  import repeatRemind from './QWRepeatRemind'

  export default {
    props:{
      remindShow:{
        type:Boolean,
      },
      reminderTaskPO:{
        type:Object,
        default(){
          return {};
        }
      },
      remindBtn:{
        type:Object,
        default(){
          return {};
        }
      }
    },
    data(){
      return {
        remindBoxShow:false,
        remindData:{// 周期提醒初始化数据
          remindSwitch:false,// 按钮
          remindCycle:0,// 提醒类型，默认每天
          remindTimestamps:'',// 提醒时间戳
          remindTime:'10:00',// 提醒时间
          regExp: {
            'type':'week_for_day',
            'rate':2,
            'value':''
          },// 自定义时间数据
          dateList: [
            {
              text: '每天',
              desc: '',
              cycle: 1
            },
            {
              text: '每周工作日',
              desc: '(周一至周五)',
              cycle: 4
            },
            {
              text: '每周',
              desc: '',
              cycle: 2
            },
            {
              text: '每月',
              desc: '',
              cycle: 3,
            },
            {
              text: '每年',
              desc: '',
              cycle: 7
            },
            {
              text: '自定义',
              desc: '',
              cycle: 8,
              regExp:{
                'type':'week_for_day',
                'rate':2,
                'value':''
              }
            },
          ],// 提醒类型数据
          dataDetailMsg: {
            switchControl: [
              {content: this.$t('i18n.taskStartBeforeRemind'), onOff: true},
              {content: this.$t('i18n.taskEndBeforeRemind'), onOff: true},
              {content: this.$t('i18n.taskNewReviewRemind'), onOff: true},
              {content: this.$t('i18n.taskUpdateProgressRemind'), onOff: true}
            ]
          }// 其他提醒的数据
        },// 传给子组件的数据
        remindTimeInfo:'',
        addResponsibleClass:'',
      }
    },
    computed: {
      // 页面展示的周期提醒时间信息
      remindTimeInfomation(){
        if (!this.remindData.remindSwitch){
          return '';
        }else {
          return this.remindTimeInfo;
        }
      },
      hasPermission(){
        if (!this.$store.getters.isDetailPage){
          return true;
        }
        return this.$store.getters.taskLevel == 'a1' && !this.$store.getters.taskOver;
      }
    },
    methods:{
      editRemindContent(){
        this.remindBoxShow = true;
      },
      getRemindCycle(val){
        this.remindTimeInfo = val + ' ' + this.remindData.remindTime + ' ';
      },
      getShowType(val){
        this.remindBoxShow = val;
      },
      getRemindData(data){
        this.$emit('listenToChild',data);
      },
      renderRemindData(){
        this.remindData.dataDetailMsg.switchControl[0].onOff = this.remindBtn.sendStartRemindMsg == -1 ? false : true;
        this.remindData.dataDetailMsg.switchControl[1].onOff = this.remindBtn.deadlineRemindMsg == 1 ? false : true;
        this.remindData.dataDetailMsg.switchControl[2].onOff = this.remindBtn.commentSendMsg == 1 ? true : false;
        this.remindData.dataDetailMsg.switchControl[3].onOff = this.remindBtn.rateSendMsg == 1 ? true : false;
        this.remindData.remindSwitch = this.remindBtn.remindSwitch ? true : false;
        this.$store.commit('switchControlUpdate',this.remindData.dataDetailMsg.switchControl);
        this.$store.commit('remindSwitchUpdate',this.remindData.remindSwitch);
        // 频率
        if (this.remindData.remindSwitch){
          for (let i in this.remindData.dateList) {
            if (this.remindData.dateList[i].cycle == this.reminderTaskPO.remindCycle){
              this.remindData.remindCycle = i;
              break;
            }
          }
          let remindTime;
          if (this.$store.getters.isDetailPage){
            this.remindData.remindTimestamps = this.reminderTaskPO.remindTime;
            remindTime = new Date(this.reminderTaskPO.remindTime);
          }else {
            this.remindData.remindTimestamps = this.reminderTaskPO.remindTime.time;
            remindTime = new Date(this.reminderTaskPO.remindTime.time);
          }

          let minutes = remindTime.getMinutes();
          this.remindData.remindTime = remindTime.getHours() + ':' + (minutes >= 10 ? minutes : '0' + minutes);
          if (this.reminderTaskPO.regExp != ''){
            let regExp;
            if (this.$store.getters.isDetailPage){
              regExp = JSON.parse(this.reminderTaskPO.regExp)
            }else {
              regExp = this.reminderTaskPO.regExp;
            }
            this.$set(this.remindData.regExp,'rate',regExp.rate);
            this.$set(this.remindData.regExp,'value',regExp.value);
          }

        }
      }
    },
    created(){
      if(this.remindShow!=undefined){
        this.addResponsibleClass = 'qwjs-remind';
      }
      if (this.reminderTaskPO){
        this.renderRemindData();
      }
    },
    watch:{
      remindShow(){
        document.querySelector('.qwjs-remind').click();
      },
      reminderTaskPO(){
        this.renderRemindData();
      }
    },
    components:{
      repeatRemind
    }
  }
</script>

<style>
  .qwui-remind_item{
    display: flex;
    color:#0A1735;
    font-size: 15px;
    line-height: 46px;
    background: #fff;
  }
  .qwui-remind_icon {
    width: 26px;
    padding-left: 15px;
    background: url("../../../../../src/assets/images/icon_a-newtask-list_remind.svg")no-repeat scroll right;
  }
  .qwui-remind_data {
    padding-left: 8px;
  }
  .qwui-flexItem {
    flex: 1;
  }
  .qwui-remind_right{
    width: 24px;
    padding-right: 15px;
    background: url("../../../../assets/svg/right.svg") no-repeat scroll left;
    background-position-y: 11px;
  }
</style>

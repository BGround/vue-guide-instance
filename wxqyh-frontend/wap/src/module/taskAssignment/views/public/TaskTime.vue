<template>
  <div class="qwui-time_item">
    <i class="qwui-time_left"
       :class="{ 'stopTime':timeConfig.type == 'endTime' }"></i>
    <time-picker :show.sync="pickerShow"
                 :defaultDate="timeConfig.timeTemp"
                 :minuteInterval="5"
                 @confirm="confirm"
                 @cancle="cancel"></time-picker>
    <div class="qwui-flexItem qwui-time_style_content"
         v-show="hasPermission"
         @click="showTimePicker">
      <span class="item-select">{{ showTime }}</span>
      <i class="qwui-icon_right"></i>
    </div>
    <div class="qwui-time_disabled"
         v-show="!hasPermission">{{ timeConfig.timeTemp | timeHandle }} {{ type }}</div>
  </div>
</template>

<script>
  import timePicker from '@/components/basicUI/qwuiPicker/time_picker.vue';
  import * as timeUtil from '@/assets/js/time-util';
  import { getWorkhour,liveUpdateTask,editSubTask } from '../../api/getData';

  export default {
    name:'taskTime',
    props:['timeConfig'],
    data(){
      return {
        dataBase:dataBase,
        type:'',
        pickerShow:false,// 显示时间选择器
      }
    },
    components:{
      timePicker,
    },
    methods:{
      showTimePicker(){
        this.pickerShow = true;
      },
      cancel(){

      },
      confirm(temp){
        this.checkTime(temp);
      },
      checkTime(val){
        if (this.timeConfig.type == 'startTime') {
          if (this.timeConfig.alertType == 'mainTask') {
            if(new Date(val.replace(/-/g,'/')) > new Date(this.$store.getters.stopTime.replace(/-/g,'/'))){
              _.alert("","开始时间不能晚于截止时间","确定");
              return;
            }else{
              this.$store.commit('startTimeHandler', val);
            }
          } else {
            if(new Date(val.replace(/-/g,'/')) > new Date(this.$store.getters.subStopTime.replace(/-/g,'/'))){
              _.alert("","开始时间不能晚于截止时间","确定");
              return;
            }else {
              this.$store.commit('subStartTimeHandler', val);
            }
          }
        } else {
          if (this.timeConfig.alertType == 'mainTask') {
            // 如果子任务截止时间大于主任务修改的截止时间
            if (new Date(this.dataBase.latestSubStopTime.replace(/-/g,'/')) > new Date(val.replace(/-/g,'/')) && this.$store.getters.subTaskNum >= 1){
              _.alert('','主任务截止时间不能早于子任务截止时间');
              return;
            }else if(new Date(this.$store.getters.startTime.replace(/-/g,'/')) > new Date(val.replace(/-/g,'/'))){
              _.alert("","截止时间不能早于开始时间","确定");
              return;
            }else {
              this.$store.commit('stopTimeHanlder', val);
            }
          } else {
              if(this.$store.getters.changeSubTaskTime && new Date(val.replace(/-/g,'/')) > new Date(this.$store.getters.stopTime.replace(/-/g,'/'))){
                _.alert("","子任务截止时间不能晚于主任务截止时间","确定");
                return;
              }else if(new Date(this.$store.getters.subStartTime.replace(/-/g,'/')) > new Date(val.replace(/-/g,'/'))){
                _.alert("","截止时间不能早于开始时间","确定");
                return;
              }else {
                this.$store.commit('subStopTimeHanlder', val);
              }
            }
        }
        // 修改任务时间
        if (this.$store.getters.isDetailPage && this.timeConfig.timeTemp != val){
          let self = this;
          let params = {};
          let flag = '';
          let type = '';
          if (this.$store.getters.subTaskPage){
            if(!this.$store.getters.addSubTaskPage){
              // 更新子任务
              flag = this.timeConfig.type == 'startTime' ? 3 : 2;
              type = this.timeConfig.type == 'startTime' ? 'startTime' : 'stopTime';
              let subtaskJsonStr = {};
              params['taskId'] = this.$store.getters.taskId;
              params['subtaskId'] = this.$store.getters.subtaskId;
              subtaskJsonStr[type] = val+':00';
              subtaskJsonStr['subtaskId'] = this.$store.getters.subtaskId;
              subtaskJsonStr['title'] = this.$store.getters.subtaskTitle;
              params['subtaskJsonStr'] = JSON.stringify(subtaskJsonStr);
              params['editFlag'] = flag;
              editSubTask(params,(result)=>{
                self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
              })
            }
          }else {
            // 更新主任务时间
            flag = this.timeConfig.type == 'startTime' ? 3 : 4;
            type = this.timeConfig.type == 'startTime' ? 'tbQyTaskPO.taskStart' : 'tbQyTaskPO.taskStop';
            params['tbQyTaskPO.taskId'] = this.$store.getters.taskId;
            params['operationFlag'] = flag;
            params[type] = val+':00';
            liveUpdateTask(params,function (result) {
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
            })
          }
        }
        this.timeConfig.timeTemp = val;
        this.$emit('listenToChild');
      }
    },
    created(){
      this.type = '截止';
      if(this.timeConfig.type=='startTime'){
        this.type = '开始';
      }
    },
    computed:{
      // 编辑权限
      hasPermission(){
        this.$store.commit('hasPermissionUpdate');
        return this.$store.getters.hasPermission;
      },
      // 展示的时间
      showTime(){
        return this.timeConfig.timeTemp + ' ' + this.type;
      }
    },
    filters:{
      timeHandle(val){
        return val.substring(0,16);
      }
    }
  }
</script>

<style type="text/css">
  .qwui-flexItem {
    flex: 1;
  }
  .qwui-time_item{
    display: flex;
    position: relative;
    min-height: 46px;
    color: #B2B9C8;
    font-size: 14px;
    line-height: 46px;
    background: #fff;
  }
  .qwui-time_left{
    width: 26px;
    padding-left: 15px;
    background: url("../../../../assets/svg/icon_a-newtask-list_time.svg") no-repeat scroll right;
  }
  .qwui-time_left.stopTime{
    background: url("../../../../assets/svg/icon_a-newtask-list_time-b.svg") no-repeat scroll right;
  }
  .qwui-time_disabled {
    padding-left: 8px;
    color: #0A1735;
  }
  .item-select {
    margin-left: 9px;
    width: 100%;
    font: normal 14px -apple-system-font,"Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
    color: #0A1735;
    background: #fff !important;
    cursor: pointer !important;
  }
  .qwui-icon_right {
    width: 24px;
    height: 46px;
    position: absolute;
    right: 15px;
    top: 0;
    background: url("../../../../assets/svg/right.svg") no-repeat center left;
  }
</style>

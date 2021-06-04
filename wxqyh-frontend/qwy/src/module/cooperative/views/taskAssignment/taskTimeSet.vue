<template>
  <div v-show="pageShow">
    <!--返回按钮-->
    <qwui-go-back class="qwui-go_back" :goBackConfig="goBackConfig"></qwui-go-back>
    <div class="qwui-input_item">
      <span class="itemTitle">默认时间设置：</span>
      <div class="qwui-radio_item">
        <qwui-radio v-model="range" :label="0">调用工作时间</qwui-radio>
        <qwui-radio v-model="range" :label="1">自定义设置</qwui-radio>
      </div>
    </div>
    <div v-if="range == 0" class="qwui-time_select">
      <p class="timeItem">
        <span>默认任务开始时间：</span>
        <span class="timeBox">上班时间 {{ workInTime }}</span>
      </p>
      <p class="timeItem">
        <span>默认任务截止时间：</span>
        <span class="timeBox">下班时间 {{ workOutTime }}</span>
      </p>
      <div class="timeDesc">
        <span class="tipStyle">注：</span>
        <div class="descTip">
          <p> 1、工作时间可前往   首页>设置>通用设置>工作时间   中设置，<a class="setLink" @click="setLink">点击前往。</a></p>
          <p> 2、如当前时间处于工作时间段内，则以当前时间为开始时间。</p>
          <p> 3、如当前时间不处于工作时间段内，则往后最近的上班时间为开始时间。</p>
        </div>
      </div>
    </div>
    <div v-else class="qwui-time_select">
      <p class="timeItem">
        <span>默认任务开始时间：</span>
        <qw-select class="selectStyle"
                   :dataList="startTimeOption"
                   :selectVal="startTimeVal"
                   @selectItem="selectStartTime"></qw-select>
      </p>
      <p class="timeItem">
        <span>默认任务截止时间：</span>
        <qw-select class="selectStyle"
                   :dataList="stopTimeOption"
                   :selectVal="stopTimeVal"
                   @selectItem="selectStopTime"></qw-select>
      </p>
    </div>
    <div class="qwui-save_btn">
      <qwui-button type='primary' @click="updateTaskTime">保存</qwui-button>
    </div>
  </div>
</template>

<script>
  import qwuiGoBack from '@/components/base/qwuiGoBack';
  import qwuiRadio from '@/components/qwuiBase/qwuiRadio/qwuiRadio';
  import qwSelect from '@/components/qwuiBase/qwuiSelect/QwSelect';
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import { getTaskSettingInfo,updateTaskSetting,getWorkTime } from '../../api/taskAssignment/getData';

  export default {
    data(){
      return {
        pageShow:false,
        goBackConfig:{
          hasLine:true,
          lastPath:'设置',
          currPath:'任务时间设置'
        },
        range:0,
        startTimeVal:{
          val: 'tenMinute',
          idx: 1,
          name: '当前时间+10分钟'
        },
        startTimeOption:{
          current:{
            val:'current',
            idx: 0,
            optionName:'当前时间'
          },
          tenMinute:{
            val:'tenMinute',
            idx: 1,
            optionName:'当前时间+10分钟'
          },
          thirtyMinute:{
            val:'thirtyMinute',
            idx: 2,
            optionName:'当前时间+30分钟'
          },
          oneHour:{
            val:'oneHour',
            idx: 3,
            optionName:'当前时间+1小时'
          },
          oneDay:{
            val:'oneDay',
            idx: 4,
            optionName:'当前时间+1天'
          }
        },
        stopTimeVal:{
          val: 'oneDay',
          idx: 2,
          name: '开始时间+1天'
        },
        stopTimeOption:{
          oneHour:{
            val:'oneHour',
            idx: 0,
            optionName:'开始时间+1小时'
          },
          threeHour:{
            val:'threeHour',
            idx: 1,
            optionName:'开始时间+3小时'
          },
          oneDay:{
            val:'oneDay',
            idx: 2,
            optionName:'开始时间+1天'
          },
          threeDay:{
            val:'threeDay',
            idx: 3,
            optionName:'开始时间+3天'
          },
          oneWeek:{
            val:'oneWeek',
            idx: 4,
            optionName:'开始时间+1周'
          }
        },
        workInTime:'09:00',
        workOutTime:'18:00',
        firstLoading:true,
      }
    },
    created(){
      dataBase.agentCode = 'task';
      this.getTimeSet();
      this.setWorkTime();
      let self = this;
      // 窗口标签切换回来要调用工作时间接口
      document.addEventListener('visibilitychange',function () {
        if (document.visibilityState == 'visible' && !this.firstLoading){
          self.setWorkTime();
        }
      })
    },
    methods:{
      // 获取任务时间
      getTimeSet(){
        getTaskSettingInfo({'belongAgent':dataBase.agentCode},(data)=>{
          this.range = data.settingVO.timeSetting;
          if (data.settingVO.timeSetting == 0){
            this.setWorkTime();
          }else {
            this.startTimeVal.val = data.settingVO.taskStartStr;
            this.startTimeVal.name = this.startTimeOption[data.settingVO.taskStartStr].optionName;
            this.stopTimeVal.val = data.settingVO.taskStopStr;
            this.stopTimeVal.name = this.stopTimeOption[data.settingVO.taskStopStr].optionName;
          }
          this.pageShow = true;
        })
      },
      // 保存设置的任务时间
      updateTaskTime(){
        updateTaskSetting({
          belongAgent:dataBase.agentCode,
          timeSetting:this.range,
          taskStartStr:this.startTimeVal.val,
          taskStopStr:this.stopTimeVal.val
        },()=>{
          dataBase.top_alert('更新成功',true,3000);
          this.$router.go(-1);
        })
      },
      // 设置工作时间
      setWorkTime(){
        this.firstLoading = false;
        getWorkTime((data)=>{
          this.workInTime = data.tbQyWorkhourPO.workInTime;
          this.workOutTime = data.tbQyWorkhourPO.workOutTime;
        })
      },
      // 跳转到工作时间修改页面
      setLink(){
        window.open(_.baseURL + '/manager/managesetting/currency_main.jsp?classClick=7','target','');
      },
      // 选择开始时间
      selectStartTime(optionName,val){
        this.startTimeVal.val = val;
        this.startTimeVal.name = optionName;
      },
      // 选择结束时间
      selectStopTime(optionName,val){
        this.stopTimeVal.val = val;
        this.stopTimeVal.name = optionName;
      },
    },
    components:{
      qwuiGoBack,
      qwuiRadio,
      qwSelect,
      qwuiButton
    }
  }

</script>

<style lang="scss" scoped>
  .qwui-go_back {
    margin-bottom: 30px;
  }
  .qwui-input_item {
    margin-bottom: 10px;

  .itemTitle {
    margin-bottom: 5px;
    padding-top: 5px;
    width: 130px;
    display: inline-block;
    text-align: right;
  }
  .qwui-radio_item {
    display: inline-block;
  }
  }
  .qwui-time_select {
    margin-left: 135px;

    .timeItem {
      margin: 10px 0;

      .timeBox {
        display: inline-block;
        width: 122px;
        line-height: 32px;
        text-align: center;
        border: 1px solid #D5D5D5;
        border-radius: 2px;
        color: #BBBBBB;
      }

      .selectStyle {
        display: inline-block;
        width: 170px;
        vertical-align: middle;
      }
    }

    .timeDesc {
      font-size: 12px;
      color: #808080;

      .setLink {
        color: #F87B00;
        cursor: pointer;
      }

      .tipStyle {
        vertical-align: top;
      }
      .descTip {
        display: inline-block;
      }
    }
  }
  .qwui-save_btn {
    padding-top: 20px;
    margin-top: 48px;
    text-align: center;
    border-top: 1px solid #dbdbdb;
  }
</style>

<!--今日考勤显示当前时间和今日总工作时长-->
<template>
  <div class="qwui-todayDate">
    <p class="qwui-currentMoment">
        {{currentMoment}}
    </p>
    <p>
      <span>考勤日：</span>
      <span>{{newtime}}</span>
    </p>
    <p class="work_hour_box">
      <span v-show="isShowWorkHour">
        已工作<span :class="[isNormal?'is_normal':'un_normal']"> {{totalNum}} </span>小时
      </span>
    </p>
  </div>
</template>

<script>
export default {
    name:"show_nowtime",
    props:["shownowtime","newContTime"],
    data(){
      return{
        currentMoment:"",
        newtime:"",
        totalNum:"",
        isNormal:true,
        isShowWorkHour:true
      }
    },
    watch:{
      "shownowtime.totalNum":function(){
        this.totalNum = this.shownowtime.totalNum;
      },
      "shownowtime.isNormal":function(){
        this.isNormal = this.shownowtime.isNormal ? true:false;
      },
      "newContTime":function(){
        /*如果打卡后工作时长有变动则更新工作时长*/
        if(this.newContTime){
          this.totalNum = this.newContTime;
        }
      },
      "shownowtime.newTime":function(){
        this.newtime = this.shownowtime.newTime;
      },
      "shownowtime.isShowWorkHour":function(){
        this.isShowWorkHour = this.shownowtime.isShowWorkHour;
      }
    },
    mounted(){
      let _this = this;
      setInterval(function(){
        let currentTime = _.getCurrentDate();
        let currentMoment = currentTime.hour + ':' + currentTime.minute + ':' + currentTime.second;
        _this.currentMoment = currentMoment;
      },50);
    },
}
</script>

<style scoped>
  .qwui-todayDate {
    padding: 35px 0 30px 0;
    font-size: 14px;
    background:#fff;
    line-height: 1;
    text-align: center;
    overflow: hidden;
    color: #999;
  }
  .qwui-currentMoment {
    height: 43px;
    font-size: 33px;
    padding-bottom: 10px;
    color: #666;
  }
  .work_hour_box{
    padding-top: 5px;
  }
  .is_normal {
    color:#467DB9;
  }
  .un_normal {
    color:#e94f4f;
  }
</style>


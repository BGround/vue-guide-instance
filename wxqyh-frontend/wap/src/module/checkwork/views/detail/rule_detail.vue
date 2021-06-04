<template>
  <div class="wrap">
    <div class="article_detail">
      <div class="name_list_detail">
        <ul>
          <li class="flexbox ckword_rulename">
              {{checkName}}
          </li>
          <li class="flexbox" v-if="checkIp">
            <span>考勤IP&nbsp;&nbsp;</span>
            <p class="flexItem">{{checkIp}}</p>
          </li>
          <li class="flexbox" v-if="shakeInfo">
            <span>摇一摇&nbsp;&nbsp;</span>
            <p class="flexItem">{{shakeInfo}}</p>
          </li>
          <li class="flexbox" v-if="elasticInfo">
            <span>弹性工作&nbsp;&nbsp;</span>
            <p class="flexItem">{{elasticInfo}}</p></li>
          <li class="flexbox">
            <span>新考勤&nbsp;&nbsp;</span>
            <p class="flexItem">{{refreshTime}}</p></li>
          <div>
            <li class='flexbox' v-for="signItem in signTimeVOs" :key="signItem.index">
              <span>{{signItem.signTypeInfo}}&nbsp;&nbsp;</span>
              <p>{{signItem.signinTime}}</p>
              <span>限制&nbsp;&nbsp;</span>
              <p>{{signItem.isSignStartStr}}</p>
            </li>
          </div>
          <li class="flexbox" v-if="restInfo">
            <span>休息时间&nbsp;&nbsp;</span>
            <p class="flexItem">{{restInfo}}</p>
          </li>
          <li class="flexbox">
            <span>考勤月度&nbsp;&nbsp;</span>
            <p class="flexItem">{{monthDate}}</p>
          </li>
          <li class="flexbox" v-if="isCalculationWorkHour">
            <span>是否统计工时&nbsp;&nbsp;</span>
            <p class="flexItem">{{isCalculationWorkHour}}</p>
          </li>
          <li class="flexbox" v-if="ckInTimeRangeDate">
            <span>打卡时间范围&nbsp;&nbsp;</span>
            <p class="flexItem">{{ckInTimeRangeDate}}</p>
          </li>
          <li class="flexbox">
            <span>工作日&nbsp;&nbsp;</span>
            <p class="flexItem">{{workDatesDes}}</p>
          </li>
          <li class="flexbox" v-if="removeDate">
            <span>排除日期&nbsp;&nbsp;</span>
            <p class="flexItem">{{removeDate}}</p>
          </li>
          <li class="flexbox" v-if="addDate">
            <span>增加日期&nbsp;&nbsp;</span>
            <p class="flexItem">{{addDate}}</p>
          </li>
        </ul>
      </div>
      <flow_button :buttondata="buttonConfig"></flow_button>
    </div>
  </div>
</template>

<script>
import flow_button from "@/components/button/flow_button.vue";
import {ruleDetailShow} from "../../api/getData";

export default {
  name: "rule_detail",
  components: {
    flow_button
  },
  data() {
    return {
      buttonConfig: {
        //操作按钮
        primaryList: [{ type: "default", name: "返回", callBack: this.goBack}],
        class: "active" //按钮是否置底部 active :底部、"":相对定位
      },
      ruleId: "",
      checkName: "",
      addressVOs: [],
      checkIp: "",
      shakeInfo: "",
      elasticInfo: "",
      refreshTime: "",
      restInfo: "",
      monthDate: "",
      workDatesDes: "",
      removeDate: "",
      addDate: "",
      isCalculationWorkHour: "",
      ckInTimeRangeDate: "",
      signTypeInfo: "",
      isSignStartStr: "",
      isSignEndStr: "",
      signinTime: "",
      signTimeVOs: []
    };
  },
  created() {
    this.initRuleDetail();
  },
  methods: {
    goBack(){
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/');
    },
    initRuleDetail() {
      let self = this;
      let data = {
        id: self.$route.query.id
      };
      ruleDetailShow(data,function (result) {
        let vo = result.vo;
        let checkType = vo.checkType;
        let isCalculationWorkHour = vo.isCalculationWorkHour; //是否统计考勤时间
        let signStartTime = vo.signStartTime; //打卡范围开始时间
        let signEndTime = vo.signEndTime; //打卡范围结束时间
        self.checkName = vo.checkName;
        if(vo.checkIp == ""){
          self.checkIp = "";
        }else{
          self.checkIp = vo.checkIp;
        }
        //摇一摇
        if(vo.isShake === "0" && (checkType === "1" || checkType === "0")){
          self.shakeInfo = "摇一摇考勤";
        }else{
          self.shakeInfo = "";
        }
        //弹性工作
        if(vo.isElastic === "1" && (checkType === "1" || checkType === "0")){
          //去掉整数后面的.0
          let workhour = vo.elasticWorkHour;
          if(null !== workhour){
            workhour = parseFloat(workhour);
            self.elasticInfo = workhour + " 小时";
          }
        }else{
          self.elasticInfo = "";
        }
        self.refreshTime = vo.refreshTime ? "每天 " + vo.refreshTime : vo.refreshTime;
        let signList = vo.signList;
        let isSignStartStr = "";
        let isSignEndStr = "";
        for (let x = 0; x < signList.length; x++) {
          let signItem = {
            signTypeInfo: "",
            isSignStartStr: "",
            signinTime: "",
            index: ""
          };
          let sign = signList[x];
          //处理限制日时间
          isSignStartStr = "";
          isSignEndStr = "";
          if(sign.isSignStartTime && null !== sign.isSignStartTime && "" !== sign.isSignStartTime){
            isSignStartStr = sign.isSignStartTime;
          }
          if(sign.isSignEndTime && null != sign.isSignEndTime && "" != sign.isSignEndTime){
            isSignEndStr = sign.isSignEndTime;
          }
          //加入显示限制时间
          if("" != isSignStartStr && "" != isSignEndStr){
            isSignStartStr = isSignStartStr + "~" + isSignEndStr;
          }else if("" == isSignStartStr && "" != isSignEndStr){
            isSignStartStr = isSignEndStr + "之前";
          }else if("" != isSignStartStr && "" == isSignEndStr){
            isSignStartStr = isSignStartStr + "之后";
          }else{
            isSignStartStr = "不限";
          }
          if(sign.signType == "1"){
            signItem.signTypeInfo = "签到时间";
          }else{
            signItem.signTypeInfo = "签退时间";
          }
          signItem.isSignStartStr = isSignStartStr;
          signItem.signinTime = sign.signinTime;
          signItem.index = x;
          self.signTimeVOs.push(signItem);
        }
        //休息时间
        let restTime = vo.restTime;
        if(null !== restTime && (checkType === "1" || checkType === "0")){
          //去掉整数后面的.0
          restTime = parseFloat(restTime);
          self.restTime = restTime + " 小时";
        }else{
          self.restTime = "";
        }
        let temp5 = vo.monthStartDate + "号至";
        if (vo.monthEndType == "1") {
          temp5 += "当月" + vo.monthEndDate + "号";
        } else {
          temp5 += "次月" + vo.monthEndDate + "号";
        }
        self.monthDate = temp5;
        self.workDatesDes = vo.workDatesDes;
        if(checkType === 2){
          if(isCalculationWorkHour === 1){
            self.isRecordWorkHourDate = "是";
          }else{
            self.isRecordWorkHourDate = "否";
          }
          if(signStartTime && signEndTime){
            self.ckInTimeRangeDate = signStartTime + "~" + signEndTime;
          }else{
            self.ckInTimeRangeDate = "未设置时间范围";
          }
        }
        self.removeDate = vo.removeDate;
        self.addDate = vo.addDate;
      });
    }
  }
};
</script>

<style scoped>
.article_detail {
  background: #ffffff;
}
.name_list_detail {
  background-color: white;
  overflow: hidden;
  line-height: 2.2;
  clear: both;
  font-size: 15px;
  position: relative;
  margin-top: 5px;
}
.flexbox {
  display: flex;
}
.flexItem {
  flex: 1;
}
.name_list_detail li {
  padding: 7px 10px;
}
.name_list_detail span {
  font-weight: 700;
  color: #666;
  margin-right: 10px;
  min-width: 100px;
  text-align: right;
  max-width: 100px;
  display: inline-block;
  line-height: 1.6;
}
.name_list_detail p {
  color: #333;
  word-break: break-all;
  line-height: 1.6;
}
.ckword_rulename {
  margin-top: 30px;
  margin-left: 25px;
  font-size: 19px;
  color: #333;
}
</style>


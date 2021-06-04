<template>
  <div class="wrap" v-if="showRuledetail">
    <div class="wrap_inner">
      <div class="article_detail">
        <div class="name_list_detail" style="margin-top:0px">
          <ul id="clientItemId">
            <li class="flexbox ckword_rulename">
              {{checkName}}
            </li>
            <li class="flexbox" v-if="addressVOs.length > 0">
              <span>考勤位置&nbsp;&nbsp;</span>
              <div>
                <p
                  v-for="(addressItem,index) in addressVOs"
                  :key="index"
                >
                  {{addressItem.address}} ;{{addressItem.distance}}米
                </p>
              </div>
            </li>
            <li class="flexbox" v-if="checkIp"><span>考勤IP&nbsp;&nbsp;</span>
              <p class="flexItem">{{checkIp}}</p></li>
            <li class="flexbox" v-if="shakeInfo"><span>摇一摇&nbsp;&nbsp;</span>
              <p class="flexItem">{{shakeInfo}}</p>
            </li>
            <li class="flexbox" v-if="elasticInfo"><span>弹性工作&nbsp;&nbsp;</span>
              <p class="flexItem">{{elasticInfo}}</p></li>
            <li class="flexbox"><span>新考勤&nbsp;&nbsp;</span>
              <p class="flexItem">{{refreshTime}}</p></li>
            <div>
              <li class='flexbox borderBottommNone' v-for="signItem in signTimeVOs" :key="signItem.index">
                <span>{{signItem.signTypeInfo}}&nbsp;&nbsp;</span>
                <p>{{signItem.signinTime}}</p>
                <span>限制&nbsp;&nbsp;</span>
                <p>{{signItem.isSignStartStr}}</p>
              </li>
            </div>
            <li class="flexbox" v-if="restInfo"><span>休息时间&nbsp;&nbsp;</span>
              <p class="flexItem">{{restInfo}}</p>
            </li>
            <li class="flexbox"><span>考勤月度&nbsp;&nbsp;</span>
              <p class="flexItem">{{monthDate}}</p>
            </li>
            <li class="flexbox" v-if="isCalculationWorkHour"><span>是否统计工时&nbsp;&nbsp;</span>
              <p class="flexItem">{{isCalculationWorkHour}}</p></li>
            <li class="flexbox" v-if="ckInTimeRangeDate"><span>打卡时间范围&nbsp;&nbsp;</span>
              <p class="flexItem">{{ckInTimeRangeDate}}</p></li>
            <li class="flexbox"><span>工作日&nbsp;&nbsp;</span>
              <p class="flexItem">{{workDatesDes}}</p></li>
            <li class="flexbox" v-if="removeDate"><span>排除日期&nbsp;&nbsp;</span>
              <p class="flexItem">{{removeDate}}</p></li>
            <li class="flexbox" v-if="addDate"><span>增加日期&nbsp;&nbsp;</span>
              <p class="flexItem">{{addDate}}</p></li>
          </ul>
        </div>
        <div style="height:60px;"></div>
        <flow_button :buttondata="buttonConfig"></flow_button>
      </div>
    </div>
  </div>
</template>

<script>
import flow_button from "@/components/button/flow_button.vue";

export default {
  name: "rule_detail",
  props:["thisRuleId"],
  components: {
    flow_button
  },
  data() {
    return {
      buttonConfig: {
        //操作按钮
        primaryList: [{ type: "default", name: "返回", callBack: this.closeRuleDetail}],
        class: "active" //按钮是否置底部 active :底部、"":相对定位
      },
      showRuledetail:true,
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
  watch:{
      "thisRuleId":function(){
          this.thisRuleId = this.ruleId;
      }
  },
  methods: {
      closeRuleDetail(){
          this.$emit('closeRuleDetail');
      },
      handleAddress(addressVO,addressVOs){
        /**处理考勤地址列表 */
        var _this = this;
        _this.addressVOs.splice(0);
        let addressItem = {
          address:"",
          distance:""
        }
        if(addressVOs){
          for(var i = 0;i<addressVOs.length;i++){
            addressItem.address = addressVOs[i].address;
            addressItem.distance = addressVOs[i].signScope;
            _this.addressVOs.push(addressItem);
          }
        }else if(addressVO.address){
          addressItem.address = addressVO.address;
          addressItem.distance = addressVO.signScope;
          _this.addressVOs.push(addressItem);
        }
      },
    initRuleDetail() {
      var _this = this;
      _.showLoading("正在加载规则...");
      _.ajax({
        url: _.baseURL + dataBase.todayCheck.getRuleDetail,
        type: "post",
        data: {
          id: _this.thisRuleId
        },
        success: function(result) {
          if (result.code == "0") {
            var vo = result.data.vo;
            var checkType = vo.checkType;
            var isCalculationWorkHour = vo.isCalculationWorkHour; //是否统计考勤时间
            var signStartTime = vo.signStartTime; //打卡范围开始时间
            var signEndTime = vo.signEndTime; //打卡范围结束时间
            _this.checkName = vo.checkName;
            _this.handleAddress(vo,result.data.addressVOs);
            if (vo.checkIp == "") {
              _this.checkIp = "";
            } else {
              _this.checkIp = vo.checkIp;
            }
            //摇一摇
            if (vo.isShake == "0" && (checkType === "1" || checkType === "0")) {
              _this.shakeInfo = "摇一摇考勤";
            } else {
              _this.shakeInfo = "";
            }
            //弹性工作
            if (
              vo.isElastic == "1" &&
              (checkType === "1" || checkType === "0")
            ) {
              //去掉整数后面的.0
              var workhour = vo.elasticWorkHour;
              if (null != workhour) {
                workhour = parseFloat(workhour);
                _this.elasticInfo = workhour + " 小时";
              }
            } else {
              _this.elasticInfo = "";
            }
            _this.refreshTime = vo.refreshTime
              ? "每天 " + vo.refreshTime
              : vo.refreshTime;
            var signList = vo.signList;
            var temp4 = "";
            var isSignStartStr = "";
            var isSignEndStr = "";
            for (var x = 0; x < signList.length; x++) {
              var signItem = {
                signTypeInfo: "",
                isSignStartStr: "",
                signinTime: "",
                index: ""
              };
              var sign = signList[x];
              //处理限制日时间
              isSignStartStr = "";
              isSignEndStr = "";
              if (
                sign.isSignStartTime &&
                null != sign.isSignStartTime &&
                "" != sign.isSignStartTime
              ) {
                isSignStartStr = sign.isSignStartTime;
              }
              if (
                sign.isSignEndTime &&
                null != sign.isSignEndTime &&
                "" != sign.isSignEndTime
              ) {
                isSignEndStr = sign.isSignEndTime;
              }
              //加入显示限制时间
              if ("" != isSignStartStr && "" != isSignEndStr) {
                isSignStartStr = isSignStartStr + "~" + isSignEndStr;
              } else if ("" == isSignStartStr && "" != isSignEndStr) {
                isSignStartStr = isSignEndStr + "之前";
              } else if ("" != isSignStartStr && "" == isSignEndStr) {
                isSignStartStr = isSignStartStr + "之后";
              } else {
                isSignStartStr = "不限";
              }
              if (sign.signType == "1") {
                signItem.signTypeInfo = "签到时间";
              } else {
                signItem.signTypeInfo = "签退时间";
              }
              signItem.isSignStartStr = isSignStartStr;
              signItem.signinTime = sign.signinTime;
              signItem.index = x;
              _this.signTimeVOs.push(signItem);
            }
            //休息时间
            var restTime = vo.restTime;
            if (null != restTime && (checkType === "1" || checkType === "0")) {
              //去掉整数后面的.0
              restTime = parseFloat(restTime);
              _this.restTime = restTime + " 小时";
            } else {
              _this.restTime = "";
            }
            var temp5 = vo.monthStartDate + "号至";
            if (vo.monthEndType == "1") {
              temp5 += "当月" + vo.monthEndDate + "号";
            } else {
              temp5 += "次月" + vo.monthEndDate + "号";
            }
            _this.monthDate = temp5;
            _this.workDatesDes = vo.workDatesDes;
            if (checkType == 2) {
              if (isCalculationWorkHour == 1) {
                _this.isRecordWorkHourDate = "是";
              } else {
                _this.isRecordWorkHourDate = "否";
              }
              if (signStartTime && signEndTime) {
                _this.ckInTimeRangeDate = signStartTime + "~" + signEndTime;
              } else {
                _this.ckInTimeRangeDate = "未设置时间范围";
              }
            }
            _this.removeDate = vo.removeDate;
            _this.addDate = vo.addDate;
          } else {
            _.alert("i18n.notice",result.desc);
          }
          _.hideLoading();
        }
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
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.flexItem {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.name_list_detail li {
  padding: 7px 10px;
}
.name_list_detail li:last-child {
  border-bottom: none;
}
.name_list_detail span {
  font-weight: 700;
  color: #666666;
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
.ckword_radio-position {
  margin-right: 10px;
  line-height: 1.4;
  font-size: 23px;
}
.borderBottommNone {
  border-bottom: none !important;
}
.wrap_inner{
    height: 720px;
    background: #fff;
}
</style>


<template>
  <div class="leave-days-wrapper">
    <date-time-field :dataDetailMsg="dataDetailMsg" @change="askForDays"></date-time-field>
    <div class="f-item">
      <div class="inner-f-item flexbox">
        <span class="f-item-title">申请时长</span>
        <div class="flexItem tright">
          <input class="item-select" type="number" placeholder="请输入" v-model.number="inputValue" oninput="if(value.length>3&&value.indexOf('.')<0) value=value.slice(0,3) ;if(value.indexOf('.')>0) value=value.slice(0,5)">
          <span class="fz13 c999">天</span>
          <input class="item-select" type="number" placeholder="0" v-show="workHour > 0" v-model.number="applyHours" oninput="if(value.length>4) value=value.slice(0,4)">
          <span class="fz13 c999" v-show="workHour > 0">小时</span>
        </div>
      </div>
    </div>
    <div class="f-item">
      <div class="inner-f-item fz12 tright" v-if="!revoking">
        <div class="iblock c999" v-if="hasLimit">
          {{templateTitle}}可用 {{remainingDays}} 天，</div>
        <div class="iblock c999" v-if="lockDays">已冻结 {{lockDays}}天； </div>
        <div class="iblock c999">本次申请 {{calculateDay}}天 </div>
        <div class="prompt" v-show="isBeyond && workHour > 0">
          小时不能大于{{workHour}}(工作日时长)，可填写天数</div>
        <div class="prompt" v-if="this.overFlowTip">实际申请时长为{{this.trueDays}}天</div>
      </div>
      <div class="inner-f-item fz12 tright" v-if="revoking">
        <div class="iblock c999">该请假单可销假天数 为 {{sumAskDays}}天，
        </div>
        <div class="iblock c999">本次销假 {{calculateDay}} 天</div>
        <div class="prompt" v-show="isBeyond && workHour > 0">销假时长的小时不能大于 {{workHour}}(工作日时长)
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DateTimeField from "./DateTimeField";
import {
  getVacationsLimit,
  getCheckWorkTime,
  getCheckedApplyDays,
  getDefaultWorkTime,
  getDefaultApplyDays,
  getFormDetail
} from "../api/getData";
import * as timeUtil from "@/assets/js/time-util";
import { debug } from "util";
export default {
  name: "leaveDays",
  props: {
    revoking: {
      type: Boolean,
      default: false
    },
    isBranchFlow: {
      type: Boolean,
      default: false
    },
    askTemplateId: {
      type: String,
      default: ""
    },
    templateTitle: {
      type: String,
      default: ""
    },
    autoCaching: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      unchecingDate: {},
      returnDays: 1,
      inputValue: 1,
      applyHours: "",
      sumAskDays: "",
      hasLimit: false,
      overFlowTip: false,
      checkingWork: true, //是否托管考勤
      lockDays: 0,
      errAskTimeDesc: "",
      canOver: 0, //是否可超过限制请假时间的可用请假时长
      remainingDays: 0,
      field: { value: "2019-09-30 20:33" },
      trueDays: 0,
      oldStartTime: 0,
      workHour: 0,
      oldEndTime: 0,
      todayDate: timeUtil.changeFormat(new Date(), "yyyy-MM-dd"),
      size: 10,
      defaultDataDetailMsg: [
        timeUtil.changeFormat(new Date(), "yyyy-MM-dd") + " 16:00",
        timeUtil.changeFormat(new Date(), "yyyy-MM-dd") + " 18:00"
      ],
      date: {}, // 从时间组件中传出的数据
      dataDetailMsg: [] // 传入时间组件中的数据
    };
  },
  components: {
    DateTimeField
  },
  mounted() {
    let name = "ask" + "_add_" + _.userId + "_leave_days";
    let LeaveDaysCache = JSON.parse(localStorage.getItem(name));
    // 新增且有缓存
    if (LeaveDaysCache && !this.$route.query.askId) {
      this.inputValue = LeaveDaysCache.inputValue;
      this.applyHours = LeaveDaysCache.applyHours;
      this.workHour = LeaveDaysCache.workHour;
      this.dataDetailMsg = LeaveDaysCache.timeDetail;
      this.remainingDays = LeaveDaysCache.remainingDays;
      this.lockDays = LeaveDaysCache.lockDays;
      this.hasLimit = LeaveDaysCache.hasLimit;
      this.canOver = LeaveDaysCache.canOver;
      this.checkingWork = LeaveDaysCache.checkingWork;
      this.$emit("getDate", "date", {
        startDate: this.dataDetailMsg[0],
        endDate: this.dataDetailMsg[1]
      });
    } else {
      // 新增无缓存，或编辑 复制 销假
      this.dataDetailMsg = this.defaultDataDetailMsg
      this.applyHours = 0
      // 编辑
      if (this.$route.query.askId && this.$route.query.type !== "copy") {
        getCheckWorkTime((res)=>{
          this.checkingWork = true
          this.workHour = Number(res.workHour) || 8
        },()=>{
          this.checkingWork = false
          getDefaultWorkTime(res => {
          this.workHour = Number(res["tbQyWorkhourPO"].workHour)||8})
        })
        getFormDetail(this.setDetailParams(), res => {
          let detail = res.detail
          this.oldStartTime = detail.startTime
          this.oldEndTime = detail.endTime
          this.dataDetailMsg = [
            this.oldStartTime.slice(0, 16),
            this.oldEndTime.slice(0, 16)
          ];
          this.$emit("getDate", "date", {
            startDate: this.dataDetailMsg[0],
            endDate: this.dataDetailMsg[1]
          });
          this.inputValue = detail.askDay
          this.sumAskDays = detail.sumAskDays
          this.applyHours = detail.ext1 || 0
          // this.applyHours = Math.round(
          //   (detail.sumAskDays - detail.askDay) * this.workHour
          // );
        });
      } else {
        // 获取工作日时间
        getCheckWorkTime(this.isCheckingCallback, this.askDefaultWorkTime)
      }
    }
  },
  beforeDestroy() {
    if (this.autoCaching) {
      let name = "ask" + "_add_" + _.userId + "_leave_days";
      localStorage.setItem(
        name,
        JSON.stringify({
          inputValue: this.inputValue,
          sumAskDays: this.sumAskDays,
          workHour: this.workHour,
          applyHours: this.applyHours,
          remainingDays: this.remainingDays,
          lockDays: this.lockDays,
          hasLimit: this.hasLimit,
          canOver: this.canOver,
          checkingWork: this.checkingWork,
          timeDetail:
            Object.values(this.date).length == 0
              ? this.dataDetailMsg
              : [this.date.startDate.slice(0, 16),this.date.endDate.slice(0, 16)]
        })
      );
    }
  },
  watch: {
    askTemplateId() {
      this.initTimeData();
      let start = this.dataDetailMsg[0];
      let end = this.dataDetailMsg[1];
      this.askLimitVacations(start, end);
    }
  },
  computed: {
    calculateDay() {
      let result
      let decimal =
        Math.round(Number(this.applyHours) / Number(this.workHour) * 100) / 100;
      result = Number(this.inputValue) + (isNaN(decimal) ? 0 : decimal)
      let dot = String(result).indexOf(".");
      if (dot >= 0) {
        let num = Number(`0${String(result).slice(dot)}`)
          .toPrecision(2)
          .slice(1)
        result = Math.floor(result) + num
      } else {
        result = result + ".00"
      }
      let canRevokeDays = Number(this.sumAskDays),
        currRevokeDays = Number(result);
      let checkRevokeDays = canRevokeDays >= currRevokeDays ? true : false
      this.verifyInputDays(checkRevokeDays)
      this.$emit("sumAskDays", "sumAskDays", result)
      // 若是小数 直接保留两位,若是整数(如10),以'10.00'格式提交
      this.$emit(
        "sumAskHours",
        "sumAskHours",
        String(result * this.workHour).indexOf(".") >= 0
          ? result * this.workHour.toPrecision(3)
          : `${result * this.workHour}.00`
      );
      return result
    },
    isBeyond() {
      if (this.workHour != 0) {
        let final = this.applyHours >= this.workHour
        if (final) {
          this.$emit("errTip", "applyHour", {
            isNeed: true,
            canCommit: false,
            errMsg: `申请时长的小时填写有误，请填写小于${
              this.workHour
            }的数字，或直接填写天数`
          });
        } else {
          this.$emit("errTip", "applyHour", {
            canCommit: true
          });
        }
        return final
      }
    }
  },

  methods: {
    initTimeData() {
      // 切换模板时 重置数据
      this.hasLimit = false
      this.overFlowTip = false
      this.lockDays = 0
    },
    // 当时间改变时,触发change函数，请求请假时间接口
    askForDays(startDate, endDate) {
      this.date.startDate = `${startDate}:00`
      this.date.endDate = `${endDate}:00`
      //只有请假时调用
      if (!this.revoking) {
        // 组件返回数据精确到分,后台接口需要数据精确到秒
        this.$emit("getDate", "date", {
          startDate: startDate,
          endDate: endDate
        });
        // 托管考勤
        if (this.checkingWork) {
          getCheckedApplyDays(this.date, this.renderTime, this.processErrAsk);
        } else {
          //不托管考勤
          this.unchecingDate.startTime = this.changeToNumber(
            startDate.slice(0, 10)
          )
          this.unchecingDate.stopTime = this.changeToNumber(
            endDate.slice(0, 10)
          )
          getDefaultApplyDays(
            this.unchecingDate,
            this.renderTime,
            this.processErrAsk
          )
        }
        // 获取此时请假单可用假期以及冻结假期情况
        this.askLimitVacations(startDate, endDate)
      } else {
        // 销假时间是否合理
        if (this.changeToNumber(startDate) > this.changeToNumber(endDate)) {
          this.processErrAsk(
            "销假时间为空或销假开始时间大于等于销假结束时间！"
          )
        }
        // 销假时间是否合法（规定的法则）
        this.isRevokeTimeOver(startDate, endDate)
      }
    },
    // 验证销假时起始时间是否超出与原请假单时间范围
    isRevokeTimeOver(startDate, endDate) {
      let startNum = this.changeToNumber(this.date.startDate)
      let endNum = this.changeToNumber(this.date.endDate)
      let oldStartNum = this.changeToNumber(this.oldStartTime)
      let oldEndNum = this.changeToNumber(this.oldEndTime)
      if (startNum < oldStartNum) {
        this.$emit("errTip", "revokeEarly", {
          isNeed: this.revoking,
          canCommit: false,
          errMsg: "销假开始时间不可以早于原请假单开始时间"
        })
      } else {
        this.$emit("errTip", "revokeEarly", {
          canCommit: true
        })
      }
      if (endNum > oldEndNum) {
        this.$emit("errTip", "revokeLater", {
          isNeed: this.revoking,
          canCommit: false,
          errMsg: "销假截止时间不可以晚于原请假单截止时间"
        })
      } else {
        this.$emit("errTip", "revokeLater", {
          canCommit: true
        })
      }
      this.$emit("getDate", "date", {
        startDate: startDate,
        endDate: endDate
      })
    },
    // 将请求回来的请假天数渲染出来
    renderTime(data) {
      //若托管考勤
      if (this.checkingWork) {
        this.returnDays = data.betweenDays
      } else {
        // this.unchecingDate.startTime: 20180911
        let UnStart = this.unchecingDate.startTime
        let UnStop = this.unchecingDate.stopTime
        let st = new Date(UnStart.slice(0,4)+'-'+UnStart.slice(4,6)+'-'+UnStart.slice(6,8)).getTime()
        let et = new Date(UnStop.slice(0,4)+'-'+UnStop.slice(4,6)+'-'+UnStop.slice(6,8)).getTime()
        this.returnDays =
          (et-st)/3600/24/1000 -
          data.holidays+1>0?  ((et-st)/3600/24/1000 -
          data.holidays)+1:0
      }
      this.inputValue = this.returnDays;
      this.$emit("askDays", "askDay",this.inputValue)
      this.$emit("errTip", "wrongReturn", {
        canCommit: true
      });
    },
    // 请求时间不合理 (时间为0或开始时间大于结束时间)
    processErrAsk(desc) {
      this.$emit("errTip", "wrongReturn", {
        isNeed: true,
        canCommit: false,
        errMsg: desc ? desc : "请假时间为空或请假开始时间大于等于请假结束时间！"
      })
    },
    // 托管考勤成功回调
    isCheckingCallback(res) {
      this.checkingWork = true;
      this.workHour = Number(res.workHour)||8;
      // 如果在后台选择只需签到时间 结束时间不返回签退结束时间 此时`${res.workDate} ${res.lastSignoutTime}`为'2018-08-10 undefined'
      this.dataDetailMsg = [
        `${res.workDate} ${res.firstSigninTime}`,
        `${res.workDate} ${res.lastSignoutTime}`.length > 16
          ? `${res.workDate} ${res.firstSigninTime}`.slice(0, 10) + " 18:00"
          : `${res.workDate} ${res.lastSignoutTime}`
      ];
      this.$emit("getDate", "date", {
        startDate: this.dataDetailMsg[0],
        endDate: this.dataDetailMsg[1]
      })
    },
    // 非托管考勤时回调
    askDefaultWorkTime() {
      this.checkingWork = false
      getDefaultWorkTime(res => {
        this.workHour = Number(res["tbQyWorkhourPO"].workHour)||8;
        // 如果在后台选择只需签到时间 结束时间不返回签退结束时间 此时`${this.todayDate} ${res["tbQyWorkhourPO"].workOutTime}`为'2018-08-10 undefined'
        this.dataDetailMsg = [
          `${this.todayDate} ${res["tbQyWorkhourPO"].workInTime}`,
          `${this.todayDate} ${res["tbQyWorkhourPO"].workOutTime}`.length > 16
            ? `${this.todayDate} ${res["tbQyWorkhourPO"].workInTime}`.slice(
                0,
                10
              ) + " 18:00"
            : `${this.todayDate} ${res["tbQyWorkhourPO"].workOutTime}`
        ];
        this.$emit("getDate", "date", {
          startDate: this.dataDetailMsg[0],
          endDate: this.dataDetailMsg[1]
        });
      });
    },
    setDetailParams() {
      return {
        size: this.size,
        askId: this.$route.query.askId
      }
    },
    setLimitParams(start, end) {
      return {
        askTemplateId: this.askTemplateId,
        askStartTime: start.slice(0, 10),
        askEndTime: end.slice(0, 10)
      }
    },
    // 将携带符号及空格字符串转化为数值
    changeToNumber(str) {
      if (str) {
        let reg = /[^\d]/g;
        return str.replace(reg, "");
      }
    },
    // 获取可用请假时间以及冻结时间
    askLimitVacations(start, end) {
      if (this.askTemplateId) {
        getVacationsLimit(this.setLimitParams(start, end), this.dealLimitData);
      }
    },
    // 获取可用请假时间以及冻结时间的回调
    dealLimitData(data) {
      this.canOver = data.type||0;
      // 有设置有效期
      if (data.vacationvo) {
        this.lockDays = data.lockDays ? data.lockDays.substring(0,data.lockDays.indexOf(".")+4) : 0
        this.hasLimit = true
        this.remainingDays = data.vacationvo.remainingDays
        this.confirmRemaining()
      } else {
        // 未设置有效期
        this.hasLimit = false
        this.$emit("errTip", "overLimit", {
          isNeed: !this.revoking,
          canCommit: true
        })
      }
    },
    // 有时间限制时验证可用时间是否大于实际时间
    confirmRemaining() {
      if (Number(this.inputValue) + (this.workHour?Number(this.applyHours) / Number(this.workHour):0) - Number(Number(this.remainingDays) - Number(this.lockDays)) > 0 && this.canOver== 0) {
        this.$emit("errTip", "overLimit", {
          isNeed: !this.revoking,
          canCommit: false,
          errMsg: "当前类型的可用假期余额不足，请重新选择"
        })
      } else {
        this.$emit("errTip", "overLimit", {
          isNeed: !this.revoking,
          canCommit: true
        })
      }
    },
    // 验证输入字段是否符合要求
    verifyInputDays(checkRevokeDays) {
      if (this.revoking) {
        if (!checkRevokeDays) {
          this.$emit("errTip", "moreRevoke", {
            isNeed: this.revoking,
            canCommit: false,
            errMsg: "销假时长大于请假时长，请确定后重新输入"
          })
        } else {
          this.$emit("errTip", "moreRevoke", {
            canCommit: true
          })
        }
        if (Number(this.inputValue)<=0&&Number(this.applyHours)<= 0) {
          this.$emit("errTip", "revokeZero", {
            isNeed: this.revoking,
            canCommit: false,
            errMsg: "销假时长不能小于等于0，请确定后重新输入"
          });
        } else {
          this.$emit("errTip", "revokeZero", {
            canCommit: true
          })
        }
      } else {
        // 请假时对inputValue的验证
        // 若后台限制请假天数
        if (this.hasLimit) {
          this.confirmRemaining();
        }
        if (
          this.returnDays - this.inputValue - 15 > 0 ||
          this.returnDays - this.inputValue + 15 < 0
        ) {
          this.overFlowTip = true;
          this.trueDays = this.returnDays;
          if (this.returnDays - this.inputValue - 15 > 0) {
            this.$emit("errTip", "lessInput", {
              needConfirm: true,
              isNeed: !this.revoking,
              canCommit: false,
              errMsg: "申请时间段的工作天数比申请时长多，请确定是否提交申请单"
            })
          } else {
            this.$emit("errTip", "lessInput", {
              needConfirm: true,
              isNeed: !this.revoking,
              canCommit: true
            })
          }
        } else {
          this.overFlowTip = false;
          this.$emit("errTip", "lessInput", {
            needConfirm: true,
            isNeed: !this.revoking,
            canCommit: true
          })
        }
      }
      this.$emit("askDays", "askDay",Number(this.inputValue))
      this.$emit("applyHours", "ext1", this.applyHours)
    }
  }
};
</script>
<style scoped>
/* 对组件内部样式修改 */
.leave-days-wrapper >>> .weui-cell__ft {
  padding-right: 0;
}
.leave-days-wrapper >>> .weui-cell__ft::after {
  display: none;
}

.leave-days-wrapper >>> .f-item-title {
  color: #7a7c80;
  font-size: 15px;
  margin-right: 10px;
}
.leave-days-wrapper >>> .item-input {
  color: #0a1735;
  font-size: 14px;
}
.prompt {
  color: #5585f0;
}
.f-item {
  width: 100%;
  background: #fff;
  font-size: 14px;
  position: relative;
  border-bottom: none !important;
}
.inner-f-item {
  color: #333;
  padding: 12px 15px;
  position: relative;
  min-height: 19px;
  margin-left: 15px;
  padding: 12px 15px 18px 0;
  /* border-top: 1px solid rgba(229, 229, 229, 0.4); */
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
.tright {
  text-align: right;
}
.item-select {
  -webkit-appearance: none;
  outline: none;
  border: none;
  width: 60px;
  font-size: 18px;
  text-align: center;
  color: #0a1735;
  font-family: "PingFangSC-Regular", "Microsoft YaHei", "宋体", "Tahoma", "Arial", "sans-serif";
}
.c999 {
  color: #b2b9c8;
}
.fz16 {
  font-size: 16px;
}
.fz13 {
  font-size: 13px;
}
.fz12 {
  font-size: 12px;
}
.iblock {
  display: inline-block;
}
.qwui-separate_bar {
  position: relative;
  width: 100%;
  height: 10px;
  background-color: #f5f5f5;
}
</style>
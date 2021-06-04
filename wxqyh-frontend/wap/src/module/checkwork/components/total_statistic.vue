<template>
  <div class="qwui-dateTabForTotle line-bottom line-top">
    <div class="qwui-dateTab-list-progress" @click="returnType('2')">
      <p>
        <span>{{checkNum}}</span>/<span>{{needCheck}}</span>
      </p>
      <p class="qwui-shouldSign">签到人数/应到人数</p>
    </div>
    <div class="dateTatle-head-bottom">
      <div class="dateHead-list" @click="returnType('3')">
        <p class="dateHead-list-CW">{{absNum}}</p>
        <p>旷工</p>
      </div>
      <div class="dateHead-list" @click="returnType('4')">
        <p class="dateHead-list-CW">{{lateNum}}</p>
        <p>迟到</p>
      </div>
      <div class="dateHead-list" @click="returnType('5')">
        <p class="dateHead-list-CW">{{askNum}}</p>
        <p>请假</p>
      </div>
    </div>
    <div class="dateTatle-head-bottom mt25">
      <div class="dateHead-list" @click="returnType('6')">
        <p class="dateHead-list-CW">{{busNum}}</p>
        <p>出差</p>
      </div>
      <div class="dateHead-list" @click="returnType('7')">
        <p class="dateHead-list-CW">{{outNum}}</p>
        <p>外勤</p>
      </div>
      <div class="dateHead-list" @click="returnType('8')">
        <p class="dateHead-list-CW">{{leaveNum}}</p>
        <p>早退</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "total_statistic",
  props: ["totalStatistic"],
  data() {
    return {
      chooseType: "",
      checkNum: 0, //打卡人数
      needCheck: 0, //应到人数
      absNum: 0, //旷工人数
      lateNum: 0, //迟到人数
      askNum: 0, //请假人数
      busNum: 0, //出差人数
      outNum: 0, //外勤人数
      leaveNum: 0 //早退人数
    };
  },
  watch: {
    totalStatistic: {
      handler: function() {
        this.checkNum = this.totalStatistic.checkNum;
        this.needCheck = this.totalStatistic.needCheck;
        this.absNum = this.totalStatistic.absNum;
        this.lateNum = this.totalStatistic.lateNum;
        this.askNum = this.totalStatistic.askNum;
        this.busNum = this.totalStatistic.busNum;
        this.outNum = this.totalStatistic.outNum;
        this.leaveNum = this.totalStatistic.leaveNum;
      },
      deep: true
    }
  },
  methods: {
    returnType: function(type) {
      this.chooseType = type;
      this.$emit('chooseTypeForList', this.chooseType);
    }
  }
};
</script>

<style scoped>
.qwui-dateTabForTotle {
  padding: 20px 0;
  margin-top: 15px;
  background: #fff;
}
.qwui-dateTab-list-progress {
  flex: 1;
  text-align: center;
}
.qwui-shouldSign {
  margin-bottom: 35px;
  color: #999;
}
/*边框定位*/
.line-top,
.line-bottom{
  position: relative;
}
/*上边框*/
.line-top::before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1px solid #e5e5e5;
  color: #999;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 2;
}
/*下边框*/
.line-bottom::after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
  color: #e5e5e5;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 2;
}
.dateTatle-head-bottom {
  display: flex;
  line-height: 1;
  text-align: center;
  color: #999;
}
.dateHead-list {
  flex: 1;
  font-size: 12px;
  cursor: pointer;
}
.dateHead-list-CW {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}
.qwui-dateTab-list-progress p:nth-child(1) {
  font-size: 30px;
  font-weight: bold;
}
.mt25 {
  margin-top: 25px;
}
</style>

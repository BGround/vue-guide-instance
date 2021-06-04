<template>
  <div class="detaildata borderBottommNone">
    <div class="f-item qw-tg-f-item show-line" style="border-bottom: none;">
      <div class="inner-f-item item-text">
        <i class="icon-trip"></i>
        <span class="f-item-title-trip">出差行程</span>
        <span class="fr c999" @click="showList">
          <span class="tg-text">{{spanMsg}}</span>
          <a class="ml5 clickJt fr" :class="{clickJt_up:!isListShow}"></a>
        </span>
      </div>
    </div>
    <div class="tg-item journey-list" :class="{none:!isListShow}">
      <div class="f-item mapItem">
        <div class="inner-f-item item-text flexbox ">
          <span class="f-item-title width-45">出发地</span>
          <div class="flexItem pr-10">
            <input class="item-input tright address item-select limit_input" placeholder="输入或地图选择" v-model="tripInfo['tbQyAskPO.beginLocation']">
            <tencent-map v-if="isBeginMapShow" :pos='pos' @positionData='getStartPositon($event,"begin")' @closeMap="closeMap"></tencent-map>
          </div>
          <span class="line"></span>
          <span class="mapBtn" @click="showMap('begin')"></span>
        </div>
      </div>
      <div class="f-item mapItem">
        <div class="inner-f-item item-text flexbox ">
          <span class="f-item-title width-45">目的地</span>
          <div class="flexItem pr-10">
            <input class="item-input tright address item-select limit_input" v-model="tripInfo['tbQyAskPO.destinationLocation']" placeholder="输入或地图选择">
            <tencent-map v-if="isEndMapShow" :pos='pos' @positionData='getStartPositon($event,"end")' @closeMap="closeMap"></tencent-map>
          </div>
          <span class="line"></span>
          <span class="mapBtn" @click="showMap('end')"></span>
        </div>
      </div>
      <div class="f-item">
        <div class="inner-f-item item-text flexbox">
          <span class="f-item-title">交通工具</span>
          <div class="flexItem">
            <select name="tbQyAskPO.transportation" v-model="tripInfo['tbQyAskPO.transportation']" class="flexItem direction_rtl item-input item-select">
              <option value="0">请选择</option>
              <option value="1">汽车</option>
              <option value="2">火车</option>
              <option value="3">高铁</option>
              <option value="4">动车组</option>
              <option value="5">轻轨</option>
              <option value="6">飞机</option>
              <option value="7">轮船</option>
            </select>
          </div>
        </div>
      </div>
      <div class="f-item">
        <div class="inner-f-item item-text flexbox">
          <span class="f-item-title">同行人员</span>
          <div class="flexItem" id="togtherPeopleDiv">
            <input type="text" class="item-input tright item-select limit_input width-257" v-model="tripInfo['tbQyAskPO.together']" placeholder="输入同行人员">
          </div>
        </div>
      </div>
      <div class="f-item" id="stayDiv">
        <div class="inner-f-item item-text flexbox">
          <span class="f-item-title">是否住宿</span>
          <div :class="{onOff:!isSleep,onOff_on: isSleep}" id="stay_switch" @click="confirmSleep">
            <span class="onOff_off" :class="{active: isSleep}"></span>
          </div>
        </div>
      </div>
      <div id="stayConfig" :class="{none: !isSleep}">
        <div class="f-item ">
          <div class="inner-f-item item-text flexbox ">
            <span class="f-item-title">入住时间</span>
            <div class="flexItem item-text-right">
              <input type="text" id="checkInStart" placeholder="请选择日期" class="item-input item-select text-r" style="width: 90px;">
              <span class="c999">至</span>
              <input type="text" id="checkOutStop" placeholder="请选择日期" class="item-input item-select" style="width: 90px;">
            </div>
          </div>
        </div>
        <div class="f-item">
          <div class="inner-f-item item-text flexbox">
            <span class="f-item-title">入住天数</span>
            <div class="flexItem">
              <input type="number" :value="tripInfo['tbQyAskPO.stayDays']" @input="inputVerify($event, 0)" class="item-input tright item-select" placeholder="0">
            </div>
          </div>
        </div>
        <div class="f-item borderBottommNone">
          <div class="inner-f-item item-text flexbox">
            <span class="f-item-title">房间数量</span>
            <div class="flexItem">
              <input type="number" :value="tripInfo['tbQyAskPO.stayRooms']" @input="inputVerify($event, 1)" class="item-input tright item-select" placeholder="0">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as timeUtil from "@/assets/js/time-util";
import tencentMap from "@/components/add/tencentMap.vue";
import { getCheckedApplyDays } from "../api/getData";
export default {
  name: "trip",
  props: {
    stayArea: {
      type: Object,
      default: {}
    },
    originTripInfo: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      isListShow: false,
      isSleep: false,
      isBeginMapShow: false,
      isEndMapShow: false,
      date: {},
      tripInfo: Object.assign({},this.originTripInfo),
      pos: {
        latitude: null,
        longitude: null
      },
      startTime: '',
      endTime: '',
      isStartFirst: true,   // 是否第一次加载旧单时间
      isEndFirst: true,     
    };
  },
  created() {
    this.isSleep = this.originTripInfo["tbQyAskPO.stay"]=='1'? true: false
  },
  mounted() {
    this.initMobiscroll();
  },
  watch: {
    isSleep() {
      if(this.isSleep) {
        this.tripInfo["tbQyAskPO.stay"] = "1";
        this.initMobiscroll();
      }else {
        this.tripInfo["tbQyAskPO.stay"] = "0"
      }
    },
    startTime() {
      this.tripInfo["tbQyAskPO.checkInTime"] = this.startTime;
      this.stayDays();
      this.isStartFirst = false
    },
    endTime() {
      this.tripInfo["tbQyAskPO.checkOutTime"] = this.endTime;
      this.stayDays();
      this.isEndFirst = false
    },
    tripInfo: {
      handler: function(val, oldVal) {
        this.$emit("getTripData", "tripInfo", this.tripInfo);
      },
      deep: true
    }
  },
  computed: {
    spanMsg() {
      return this.isListShow ? "收起" : "展开";
    },
    attitude() {
      return this.tripInfo["tbQyAskPO.beginLocation"];
    }
  },
  methods: {
    getStartPositon(address, type) {
      if (type === "begin") {
        this.tripInfo["tbQyAskPO.beginLocation"] = address.value;
        this.tripInfo["tbQyAskPO.beginLongitude"] = address.longitude;
        this.tripInfo["tbQyAskPO.beginLatitude"] = address.latitude;
      } else {
        this.tripInfo["tbQyAskPO.destinationLocation"] = address.value;
        this.tripInfo["tbQyAskPO.destinationLongitude"] = address.longitude;
        this.tripInfo["tbQyAskPO.destinationLatitude"] = address.latitude;
      }
    },
    // 显示隐藏
    showList() {
      this.isListShow = !this.isListShow;
      this.$nextTick(() => {
        console.log(document.querySelector('.line').getBoundingClientRect())
      })
    },
    // 是否住宿
    confirmSleep() {
      this.isSleep = !this.isSleep;
    },
    // 显示地图组件
    showMap(type) {
      if (type === "begin") {
        this.pos.value = this.tripInfo["tbQyAskPO.beginLocation"];
        this.pos.latitude = this.tripInfo["tbQyAskPO.beginLatitude"];
        this.pos.longitude = this.tripInfo["tbQyAskPO.beginLongitude"];
        this.isBeginMapShow = true;
      } else {
        this.pos.value = this.tripInfo["tbQyAskPO.destinationLocation"];
        this.pos.latitude = this.tripInfo["tbQyAskPO.destinationLatitude"];
        this.pos.longitude = this.tripInfo["tbQyAskPO.destinationLongitude"];
        this.isEndMapShow = true;
      }
    },
    closeMap() {
      this.isBeginMapShow = false;
      this.isEndMapShow = false;
    },
    stayDays() {
      if((!this.$route.query.askId)||(this.originTripInfo["tbQyAskPO.stayDays"]!=0&&!this.isStartFirst&&!this.isEndFirst)){
        let start = new Date(this.startTime).getTime();
        let end = new Date(this.endTime).getTime();
        this.tripInfo["tbQyAskPO.stayDays"] = (end - start) > 0 ? (end - start) / (1000 * 3600 * 24) : '';

      }
    },
    // 房间和入住天数长度验证并赋值
    inputVerify(event, flag) {
      let val = event.target.value;
      if (val.length > 3 || String(val).search(/\D/) != -1)
        event.target.value =
          flag === 0
            ? this.tripInfo["tbQyAskPO.stayDays"]
            : this.tripInfo["tbQyAskPO.stayRooms"];
      else
        flag === 0
          ? (this.tripInfo["tbQyAskPO.stayDays"] = event.target.value)
          : (this.tripInfo["tbQyAskPO.stayRooms"] = event.target.value);
    },
    initMobiscroll() {
      let self = this;
      // 如果出差里面有缓存数据,拿出差里面的,否则拿上面选择的时间
      self.startTime = self.originTripInfo["tbQyAskPO.checkInTime"]?self.originTripInfo["tbQyAskPO.checkInTime"]:self.stayArea.startDate.slice(0, 10);
      self.endTime = self.originTripInfo["tbQyAskPO.checkOutTime"]?self.originTripInfo["tbQyAskPO.checkOutTime"]:self.stayArea.endDate.slice(0, 10);
      /** 初始化mobiscroll */
      let startElement = $('#checkInStart'),
          endElement = $('#checkOutStop'),
          startConfig = dataBase.timePluginConf(),
          endConfig = dataBase.timePluginConf();

      startElement.val(self.startTime);
      endElement.val(self.endTime);
      startConfig.onInit = function(event, inst) {
        inst.setVal(self.startTime, true);
      };
      endConfig.onInit = function(event, inst) {
        inst.setVal(self.endTime, true);
      };
      startConfig.showOnTap = endConfig.showOnTap = true;
      startConfig.showOnFocus = endConfig.showOnFocus = true;
      startElement.mobiscroll().date(startConfig);
      endElement.mobiscroll().date(endConfig);
      
      startElement[0].onchange = function(e) {
        self.startTime = e.target.value;
      }
      endElement[0].onchange = function(e) {
        self.endTime = e.target.value;
      }
    }
  },
  components: {
    tencentMap
  }
};
</script>
<style scoped>
.detaildata {
  margin-top: 10px;
  padding-left: 15px;
  background-color: #fff;
  position: relative;
}
.borderBottommNone {
  border-bottom: none !important;
}
.none {
  display: none;
}
.f-item {
  width: 100%;
  background: #fff;
  font-size: 14px;
  position: relative;
}
.detaildata .inner-f-item {
  padding-left: 0;
  line-height: 22px;
}
.item-text {
  color: #333;
}
.inner-f-item {
  padding: 12px 15px;
  position: relative;
  min-height: 19px;
}
.icon-trip {
  margin: -3px 0 0 0;
  width: 20px;
  height: 20px;
  background: url(../asset/img/trip/ic_chuchai.png) no-repeat;
  background-size: 20px;
  display: inline-block;
  vertical-align: middle;
}
.c999 {
  color: #999;
  line-height: 21px;
  vertical-align: middle;
}
.fr {
  float: right;
}
.tg-text {
  margin-right: 3px;
  font-size: 13px;
}
.clickJt {
  background: url(../asset/img/trip/CSSSprites.png) no-repeat center
    right;
  height: 15px;
  display: block;
  background-size: 100px 100px;
  width: 9px;
  background-position: 0 0;
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
  margin: 3px 3px 0 5px;
}
.clickJt.clickJt_up {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
.ml5 {
  margin-left: 5px;
}
.f-item {
  width: 100%;
  background: #fff;
  font-size: 14px;
  position: relative;
}
.detaildata .inner-f-item {
  padding-left: 0;
  line-height: 22px;
}
.item-text {
  color: #333;
}
.inner-f-item {
  padding: 12px 15px;
  position: relative;
  min-height: 19px;
}
.flexbox {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.detaildata .f-item-title {
  margin-right: 5px;
}
.f-item-title {
  color: #7A7C80;
  font-size: 14px;
  margin-right: 10px;
  width: 60px;
}
.width-45{
  width: 45px !important;
}
.f-item-title-trip{
  color: #0A1735;
  font-size: 15px;
}
.flexItem {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.item-select {
  -webkit-appearance: none;
  outline: none;
  border: none;
  font-size: 16px;
  color: #0A1735;
  width: 100%;
}
.item-input {
  border: none;
  font-size: 14px;
  color: #0A1735;
  width: 100%;
}
input,button,select,textarea {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  outline: none;
  font-size: 14px;
  font-family: "PingFangSC-Regular", "Microsoft YaHei", "宋体", "Tahoma", "Arial", "sans-serif";
}
.tright {
  text-align: right;
}
.item-input {
  border: none;
  font-size: 15px;
  color: #0A1735;
  width: 100%;
}
.flexItem {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.direction_rtl {
  direction: rtl;
}
option {
  font-weight: normal;
  display: block;
  white-space: pre;
  min-height: 1.2em;
  padding: 0px 2px 1px;
}
.direction_rtl option {
  direction: ltr;
}
/* 是否住宿按钮 */
.onOff_on {
  position: absolute;
  right: 15px;
  top: 15px;
  height: 20px;
  width: 38px;
  background: #2f7dcd;
  border-radius: 10px;
  cursor: pointer;
  display: block;
}
.onOff {
  position: absolute;
  right: 15px;
  top: 15px;
  height: 20px;
  width: 38px;
  background: #bbb;
  border-radius: 10px;
  cursor: pointer;
  display: block;
}
/* 按钮关闭 */
.onOff_off {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
}
.onOff_off.active {
  left: 50%;
}
/* 选择日起 */
.item-text-right {
  text-align: right;
  color: #666;
}
.weui-cells.vux-no-group-title {
  line-height: 0.411765 !important;
}
select {
  padding-right: 20px;
  background: url(../asset/img/trip/icon_arrow_d.png) no-repeat scroll right center transparent;
  background-size: 15px 15px;
}
.limit_input {
  float: right;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.width-257 {
  max-width: 257px;
}
.mapBtn{
  width: 16px;
  height: 16px;
  background: url(../asset/img/trip/mapMarker.png) no-repeat center;
  background-size: 100%;
  margin-top: 1px;
}
.pr-10 {
  padding-right: 10px;
}
.text-r{
  text-align: right;
}
.line {
  display: inline-block;
  width: 2px;
  height: 14px;
  margin-top: 4px;
  margin-right: 6px;
  background: #f7f8fa;
}
input {
  caret-color: #5585f0;
}
</style>
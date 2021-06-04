<template>
  <div class="wrapper">
    <div class="qwui-time_detaildata">
      <div class="qwui-time_item">
        <div class="inner-f-item item-text flexbox">
          <span class="f-item-title" :class="{isNeed: isNeed}">{{startTitle}}</span>
          <div class="flexItem">
            <input class="start-field item-input tright" :class="{'mr6':isOverWork}" type="text" :value="startDate" :placeholder="startPlaceholder">
            <div :class="{'select-time':isOverWork}"></div>
          </div>
        </div>
      </div>
      <div class="qwui-time_item">
        <div class="inner-f-item item-text flexbox">
          <span class="f-item-title" :class="{isNeed: isNeed}">{{endTitle}}</span>
          <div class="flexItem">
            <input class="end-field item-input tright" :class="{'mr6':isOverWork}" type="text" :value="endDate" :placeholder="endPlaceholder">
            <div :class="{'select-time':isOverWork}"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import * as timeUtil from "@/assets/js/time-util";
export default {
  props: {
    dataDetailMsg:{
      type: Array,
      default: function() {
        return [
          this.$route.query.leaveType==2 ?'':timeUtil.changeFormat(new Date(), "yyyy-MM-dd") + " 00:00",
          this.$route.query.leaveType==2 ?'':timeUtil.changeFormat(new Date(), "yyyy-MM-dd") + " 23:59"
        ];
      }
    },
    isOverWork: {
      type: Boolean,
      default: false
    },
    isNeed: {
      type: Boolean,
      default: false
    },
    type:{
      type: String,
      default: '0'
    },  // 日期组件应该以什么形式显示： 0/1 显示小时数,2 只显示天数
    startTitle: {
      type: String,
      default: '开始时间',
    },
    endTitle: {
      type: String,
      default: '截至时间',
    }
  },
  data() {
    return {
      startDate: this.$route.query.leaveType==2 ?'':timeUtil.changeFormat(new Date(), "yyyy-MM-dd") + " 00:00",
      endDate: this.$route.query.leaveType==2 ?'':timeUtil.changeFormat(new Date(), "yyyy-MM-dd") + " 23:59",
      endPlaceholder: '请选择'+this.endTitle,
      startPlaceholder: '请选择'+this.startTitle
    };
  },
  watch: {
    dataDetailMsg:{
      handler: function() {
        if(this.type==2){
          this.startDate = this.dataDetailMsg[0]?this.dataDetailMsg[0].slice(0,10):''
          this.endDate = this.dataDetailMsg[1]?this.dataDetailMsg[1].slice(0,10):''
        }else{
          this.startDate = this.confirmDate(this.dataDetailMsg[0]?this.dataDetailMsg[0].slice(0,16):'');
          this.endDate = this.confirmDate(this.dataDetailMsg[1]?this.dataDetailMsg[1].slice(0,16):'');
        }
      },
      deep: true
    },
    // 根据类型初始化日期组件
    type(val) {
      if(val == 2){
        this.startDate = this.dataDetailMsg[0]?this.dataDetailMsg[0].slice(0,10):''
        this.endDate = this.dataDetailMsg[1]?this.dataDetailMsg[1].slice(0,10):''
      }else{
        this.startDate = this.confirmDate(this.dataDetailMsg[0]?this.dataDetailMsg[0].slice(0,16):'');
        this.endDate = this.confirmDate(this.dataDetailMsg[1]?this.dataDetailMsg[1].slice(0,16):'');
      }
      this.initMobiScroll();
    },
    startDate () {
      this.$emit("change", this.startDate, this.endDate);
    },
    endDate() {
      this.$emit("change", this.startDate, this.endDate);
    }
  },
  updated() {
    this.initMobiScroll();
  },
  mounted() {
    this.initMobiScroll();
  },
  methods: {
    setValue(value, type) {
      this[type] = value;
      this.$emit("change", this.startDate, this.endDate);
    },
    confirmDate(date){
      if(date.indexOf(':')==12){
        date = date.split('')
        date.splice(11,0,'0')
        return date.join('').slice(0,16)
      }else{
        return date
      }
    },
    //初始化日期组件
    initMobiScroll() {
      let me = this;
      var $el1 = $(this.$el).find(".start-field");
      var $el2 = $(this.$el).find(".end-field");
      if(this.type == '2') {
        $el1.mobiscroll().date({
          ...dataBase.timePluginConf(),
          showOnTap: true,
          showOnFocus: true
        });
        $el2.mobiscroll().date({
          ...dataBase.timePluginConf(),
          showOnTap: true,
          showOnFocus: true
        });
      }else {
        $el1.mobiscroll().datetime({
          ...dataBase.timePluginConf(),
          showOnTap: true,
          showOnFocus: true
        });
        $el2.mobiscroll().datetime({
          ...dataBase.timePluginConf(),
          showOnTap: true,
          showOnFocus: true
        });
      }
      $el1.on("change", function(e) {
        me.setValue(e.target.value, "startDate");
      });
      $el2.on("change", function(e) {
        me.setValue(e.target.value, "endDate");
      });
    }
  }
};
</script>
<style scoped>
.wrapper {
  margin-top: 10px;
}
.qwui-time_detaildata {
  padding-left: 15px;
  background-color: #fff;
  position: relative;
  border-bottom: none;
}
.qwui-time_item {
  width: 100%;
  background: #fff;
  font-size: 14px;
  position: relative;
}
.inner-f-item {
  line-height: 22px;
  padding: 12px 15px 12px 0;
  position: relative;
  min-height: 19px;
}
.item-text {
  color: #333;
}
.flexbox {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.f-item-title {
  margin-right: 5px;
  color: #7A7C80;
  font-size: 15px;
}
.flexItem {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  display: flex;
  align-items: center;
}
.item-input {
  border: none;
  flex: 1;
  font-size: 14px;
  color: #666666;
  width: 100%;
  font-family: "PingFangSC-Regular", "Microsoft YaHei", "宋体", "Tahoma", "Arial", "sans-serif";
}
.tright {
  text-align: right;
}
.border-top {
  border-top: 1px solid rgba(229, 229, 229, 0.4);
}
.isNeed:after {
  content: "*";
  color: #FF1515;
  padding-left: 5px;
  font-size: 16px;
}
.select-time{
  display: inline-block;
  width: 7px;
  margin-right: 5px;
  height: 13px;
  background: url("../../../assets/images/ic_arrow.png") no-repeat;
  background-size: 7px;
}
.mr6{
  margin-right: 6px;
}
</style>


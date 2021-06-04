<template>
  <div class="wrap qwui-wrap"
       ref="wrapper">
    <scroll class="qwui-scroll_content"
            ref="scroll"
            :data="dynamicDate"
            :pullUpLoad="pullUpLoad"
            :pullDownRefresh="pullDownRefresh"
            @pullingUp="onPullingUp"
            @pullingDown="onPullingDown">
      <div class="qwui-product_dynamic"
           v-for="(item,ind) in dynamicDate"
           :key="ind">
        <div class="qwui-dynamic_time">
          {{item.time}}
        </div>
        <div class="qwui-product_dynamic_list">
          <qw-user-dynamic v-for="(item,ind) in item.dynamicsList"
                           :key="ind"
                           :userAvatar="item.customerAvatar"
                           :userName="item.customerNickName"
                           :userDo="item.description"
                           :visitTime="item.createTime"
                           @click.native="enterUserInfo(item.customerId)"></qw-user-dynamic>
        </div>
      </div>
    </scroll>

    <scroll-calendar :visible="calendarVisible"
                     :selected="selectedDate"
                     @select="handleSelect"
                     @close="handleCloseCalendar"
                     @gettime="handleGetTime"></scroll-calendar>

    <img class="qwui-calendar_button"
         src="~assets/images/crm/icon_calendar.png"
         alt=""
         @click="handleOpenCalendar">
  </div>
</template>

<script>
import Scroll from "../../../components/Scroll/index";
import ScrollCalendar from "../../../components/ScrollCalendar/index";
import QwUserDynamic from "./components/UserDynamic";

import {
  getMarketingDynamicList,
  appointDynamicList
} from "../../../api/smallProgram/getBata.js";

export default {
  components: {
    QwUserDynamic,
    Scroll,
    ScrollCalendar
  },
  data() {
    return {
      dynamicDate: [], //动态数据列表
      pullUpLoad: true, //开启scroll组件的上拉加载
      pullDownRefresh: true,
      pageSize: 20, //一次请求几条数据
      firstDynamicsTime: 0, //下拉刷新必传参数
      lastDynamicsTime: 0, //上拉加载必传参数
      calendarVisible: false, //日历弹窗时候可见
      selectedDate: [], //日历组件显示可选的日期
      calendarDate: "", //日历组件选择的日期
      calendarMonth: "", //日历组件当前的年月
      refreshFlag: true //是否开启下拉刷新
    };
  },
  created() {
    this.getDynamicList(
      {
        pageSize: this.pageSize
      },
      "firstLoad"
    );
  },
  methods: {
    //获取动态列表数据
    getDynamicList(requestParam, loadWay) {
      getMarketingDynamicList(requestParam, res => {
        if (!res.totalRows) {
          return;
        }
        if (loadWay === "firstLoad") {
          //首次加载
          this.firstDynamicsTime = res.firstDynamicsTime;
          this.lastDynamicsTime = res.lastDynamicsTime;
        } else if (loadWay === "DownLoad") {
          //下拉刷新
          if (!res.firstDynamicsTime) {
            return;
          }

          this.firstDynamicsTime = res.firstDynamicsTime;
          //处理下拉刷新数据时间点一致的合并
          this.dynamicDate.map((item1, ind1) => {
            res.pageData.map((item2, ind2) => {
              if (item2.time == item1.time) {
                item1.dynamicsList = item2.dynamicsList.concat(
                  item1.dynamicsList
                );
                res.pageData.splice(ind2, 1);
              }
            });
          });
          this.dynamicDate = res.pageData.concat(this.dynamicDate);
          return;
        } else if (loadWay === "upLoad") {
          //上拉加载
          this.lastDynamicsTime = res.lastDynamicsTime;
        }
        this.dynamicDate = this.dynamicDate.concat(res.pageData);
      });
    },
    //获取指定年月的营销动态
    getAppointDynamicList(requestParam) {
      appointDynamicList(requestParam, res => {
        let selectList = res.dynamicsCalendarList.colorDateList;
        if (!selectList.length) {
          return;
        }
        this.selectedDate = selectList;
      });
    },
    //上拉加载
    onPullingUp() {
      this.getDynamicList(
        {
          pageSize: this.pageSize,
          lastDynamicsTime: this.lastDynamicsTime,
          calendarDate: this.calendarDate
        },
        "upLoad"
      );
    },
    //下拉刷新
    onPullingDown() {
      if (!this.refreshFlag) {
        return;
      }
      this.getDynamicList(
        {
          pageSize: this.pageSize,
          firstDynamicsTime: this.firstDynamicsTime
        },
        "DownLoad"
      );
    },
    //跳转到用户详情页面
    enterUserInfo(customerId) {
      event.stopPropagation();
      event.preventDefault();
      this.$router.push({ path: '/userInfo',query: { customerId } });
    },
    // 打开日历弹窗
    handleOpenCalendar() {
      this.calendarVisible = true;
    },
    // 关闭日历弹窗
    handleCloseCalendar() {
      this.calendarVisible = false;
    },
    // 获取日历当前的年月
    handleGetTime(y, m) {
      this.calendarMonth = [y, m].join("-");
    },
    // 日历选择日期
    handleSelect(y, m, d) {
      let selectDate = [y, m, d].join("-");
      // 已经是当前选中日期不请求数据
      if(this.calendarDate === selectDate){
        return;
      }
      this.calendarDate = selectDate;
      this.dynamicDate = [];
      this.getDynamicList(
        {
          pageSize: this.pageSize,
          calendarDate: this.calendarDate
        },
        "firstLoad"
      );
      //如果点击过日历选择,关闭刷新功能
      this.refreshFlag = false;
      this.handleCloseCalendar();
    }
  },
  watch: {
    calendarMonth(newVal, oldVal) {
      this.getAppointDynamicList({
        calendarMonth: newVal
      });
    }
  }
};
</script>

<style scoped lang="scss">
.qwui-wrap {
  width: 100%;
  height: 100%;
}
.qwui-wrap .qwui-scroll_content {
  height: 100%;
  box-shadow: 4rpx 6rpx 12rpx 0 rgba(224, 224, 224, 0.5);
  background-color: #f7f8fa;
}
.qwui-dynamic_time {
  padding-left: 14px;
  width: 100%;
  line-height: 33px;
  font-size: 12px;
  color: #85868f;
}

.qwui-calendar_button {
  position: absolute;
  right: 0;
  bottom: 66px;
  width: 82px;
  height: 82px;
  z-index: 999;
}
</style>

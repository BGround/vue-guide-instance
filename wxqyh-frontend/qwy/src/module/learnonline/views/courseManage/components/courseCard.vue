<template>
  <div class="learn-courseCard">
    <!--课程列表-->
    <div class="courseCard-wrap" v-for="(item, index) in courseList" @click.stop="handleClick('showDetail', item.id)">
      <div class="cover">
        <img class="img" :src="showImg(item.subjectCover)" v-if="item.subjectCover">
        <span class="img noImg" v-if="!item.subjectCover"></span>
        <div class="cover_date" v-if="item.endTime">
          <span class="fl">{{ item.endTime }} 截止&nbsp;&nbsp;<span v-if="item.state==2">{{ item.endTime | remainDay }}</span></span>
          <span class="fr" v-if="item.state!=1">{{ item.finishNum/item.personCount | finishRate }}%</span>
        </div>
      </div>
      <div class="name" :title="item.subjectName">{{ item.subjectName }}</div>
      <div class="count">
        {{ item.enclosureCount }}课时&nbsp;&nbsp;{{ item.finishNum }}人完成，{{ item.personCount-item.finishNum }}人未完成
      </div>
      <div class="operat">
        <span class="fz14 mr16 cursorPointer" @click.stop="editCourse">编辑</span>
        <span class="fz14 cursorPointer" v-if="((!isMust && item.state!=2) || (isMust))">{{ item.state==2 ? '提醒' : '删除课程' }}</span>
        <span class="switch" v-if="hideSwitch(item.endTime)">
          <qwui-switch :inline=true :defaultStatus="item.state==2" @change="changeOpen"></qwui-switch>
        </span>
        <span class="operat_status" v-if="hideSwitch(item.endTime)">{{ item.state | courseStatus }}</span>
      </div>
    </div>
    <!--无数据页-->
    <div class="noData" v-if="!courseList.length">
      <span class="noData_img"></span>
      <p class="noData_txt">还没有任何开课，请点击页面右上方按钮新增开课</p>
    </div>
  </div>
</template>

<script>
  import qwuiSwitch from '@/components/qwuiBase/qwuiSwitch/qwuiSwitch'

  export default {
  name: 'courseCard',

  components: { qwuiSwitch },

  props: {
    courseList: {
      type: Array,
      required: true
    },
    isMust: {
      type: Number,
      required: true
    },
  },

  data() {
    return {
    }
  },

  computed: {},

  filters: {
    //还剩多少天
    remainDay(value) {
      let days = Math.ceil( ( ( new Date(value+' 23:59:59') ).getTime()-( new Date ).getTime() ) / 86400000 );
      if(days > 0){
        return '还剩'+ days +'天';
      }else {
        return ''
      }
    },
    //完成进度
    finishRate(value) {
      return Math.round(value * 10000)/100.00;
    },
    //课程状态
    courseStatus(value) {
      return value == 1 ? '未上线' : value == 2 ? '上线中' : '已结束';
    }
  },

  watch: {},

  created() {
  },

  methods: {
    //显示图片
    showImg(value) {
      return _.compressURL + value;
    },
    //开关回调
    changeOpen() {
      this.isOpen = !this.isOpen;
    },
    //判断是否隐藏按钮和状态
    hideSwitch(endTime) {
      //选学课
      if(!this.isMust) {
        return true;
      }
      //必学课
      if(endTime) { //截止时间的大于当前时间就返回true
        if(((new Date(endTime+' 23:59:59')).getTime()) > (new Date).getTime()) {
          return true;
        }
      }
      return false;
    },
    //点击事件的处理
    handleClick(event, id) {
      this.$emit('click', event, id);
    },
    //编辑课程
    editCourse() {
      console.log('编辑')
    },
  },

}
</script>

<style lang="scss" scoped>
  @import "learn/style/config.scss";
  .learn-courseCard {
    font-size: 0;
    min-height: 505px;
    .courseCard-wrap {
      display: inline-block;
      width: 287px;
      height: 293px;
      margin: 0 37px 30px 0;
      border:1px solid rgba(229,229,229,1);
      border-radius:4px;
      overflow: hidden;
      @include transition;
      &:nth-child(3n) {
        margin-right: 0;
      }
      &:hover {
         box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
         cursor: pointer;
      }
      .cover {
        position: relative;
        .img {
          display: inline-block;
          width: 100%;
          height: 160px;
          vertical-align: middle;
          &.noImg {
             background: #e5e5e5 url(~assets/images/ic_courseimg.png) center no-repeat;
          }
        }
        .cover_date {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 28px;
          line-height: 28px;
          padding: 0 14px;
          color: #fff;
          font-size: 12px;
          background-color: rgba(245,98,98,1);
          opacity: 0.8464;
        }
      }
      .name {
        line-height: 20px;
        margin: 20px 16px 0 16px;
        font-size: 14px;
        color: #383838;
        @include ellipsis;
      }
      .count {
        line-height: 20px;
        margin: 12px 16px 0 16px;
        color: #A6A6A6;
        font-size: 12px;
      }
      .operat {
        margin: 29px 16px 0;
        color: #F87B00;
        font-size: 0;
        .mr16 {
          margin-right: 16px;
        }
        .operat_status {
          float: right;
          margin-right: 9px;
          color: #A6A6A6;
          font-size: 14px;
        }
        .switch {
          position: relative;
          top: 6px;
          float: right;
          /deep/ .switch_wrap {
            width: 28px;
            height: 16px;
            &.on::after {
               width: 12px;
               height: 12px;
            }
            &.off::after {
               width: 12px;
               height: 12px;
            }
          }
        }
      }
    }
    .noData {
      padding-top: 110px;
      text-align: center;
      .noData_img {
        display: inline-block;
        width: 80px;
        height: 80px;
        background: url(~assets/images/form_noData.png) no-repeat;
      }
      .noData_txt {
        margin-top: 30px;
        font-size: 16px;
        color: #999;
      }
    }
  }
</style>

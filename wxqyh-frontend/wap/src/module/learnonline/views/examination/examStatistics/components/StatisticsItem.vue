<template>
  <div class="exam_statistics_item" @click="clickItem">
    <!-- 考试名 -->
    <div class="tworows_ellipsis exam_name">{{item.examName}}</div>

    <!-- 考试时间 -->
    <div class="exam_time">{{examTime}}</div>

    <!-- 统计信息 -->
    <div class="statistic_detail qwui-flexbox">
      <div 
        class="qwui-flexItem detail_item"
        v-for="(detail,index) in detailArr"
        :key="index"
      >
        <div class="detail_title">{{detail.title}}</div>
        <div class="detail_value">{{detail.value}}</div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="rate_wrap">
      <!-- 完成率 -->
      <div class="rate_item finish" v-if="!item.isOpen">
        {{$t('i18n.finishRate')}}
        <div class="rate">
          <div class="rate_bar">
            <i class="rate_now" :style="{width: finishingRate}"></i>
          </div>
          <span class="rate_num">{{finishingRate}}</span>
        </div>
      </div>
      <!-- 通过率 -->
      <div class="rate_item pass">
        {{$t('i18n.passRate')}}
        <div class="rate">
          <div class="rate_bar">
            <i class="rate_now" :style="{width: passRate}"></i>
          </div>
          <span class="rate_num">{{passRate}}</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  name: 'StatisticsItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
    };
  },
  computed: {
    // 考试时间
    examTime() {
      return `${this.item.startTime} ${this.$t('i18n.to')} ${this.item.lastStartTime||'--'}`;
    },
    // 总人数
    totalNum() {
      return this.item.isOpen? '-': this.item.answerCount + this.item.unanswerCount;
    },
    // 统计详情信息
    detailArr() { // 这里数据不会动态渲染，这里无影响
      return [
        {title: this.$t('i18n.average'), value: this.item.avgScore},
        {title: this.$t('i18n.numOfTested'), value: this.item.answerCount},
        {title: this.$t('i18n.totalNumber'), value: this.totalNum}
      ]
    },
    finishingRate() { // 完成率
      return (this.item.finishingRate*100).toFixed(2) + '%';
    },
    passRate() { // 通过率
      return (this.item.passRate*100).toFixed(2) + '%';
    }

  },
  methods: {
    // 点击触发事件
    clickItem() {
      this.$emit('clickItem', {
        id: this.item.id,
        isOpen: this.item.isOpen
      });
    }
  }
};

</script>

<style lang="scss" scoped>
@import '../../../../static/css/mixin.scss';
.exam_statistics_item {
  padding: 11px 14px 8px;
  max-height: 271px;
  border-radius: 4px;
  box-shadow: 2px 0px 13px rgba(173,178,184,0.29);
  box-sizing: border-box;

  .exam_name {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    line-height: 24px;
  }
  .exam_time {
    margin-top: 10px;
    font-size: 12px;
    color: #999;
  }

  .statistic_detail {
    margin: 22px 0 25px;
    text-align: center;

    .detail_item{
      color: #999;

      &:first-of-type {
        .detail_value {
          color: #45A8F5;
        }
      }
      &:not(:last-of-type) {
        @include border-r-1px(#E6E6E6);
      }
      .detail_title {
        margin-top: 5px;
        height: 12px;
        line-height: 12px;
        font-size: 12px;
      }
      .detail_value {
        padding-top: 10px;
        height: 26px;
        line-height: 26px;
        font-size: 26px;
        font-weight: 700;
      }
    }
  }

  .rate_wrap {
    
    .rate_item {
      font-size: 12px;
      color: #999;

      &:not(:first-of-type) {
        margin-top: 8px;
      }

      .rate {
        position: relative;
        padding: 8px 45px 0 0;
        height: 21px;
        box-sizing: border-box;

        .rate_bar {
          height: 5px;
          border-radius: 5px;
          background-color: #F6F6F6;

          .rate_now {
            display: block;
            height: 100%;
            border-radius: 5px;
          }
        }

        .rate_num {
          position: absolute;
          top: 0;
          right: -8px;
          height: 21px;
          line-height: 21px;
          font-size: 12px;
          font-weight: 700;
        }
      }
    }

    .finish {
      .rate_now {
        background: #45A8F5;
      }
      .rate_num {
        color: #45A8F5;
      }
    }

    .pass {
      .rate_now {
        background: #63D86B;
      }
      .rate_num {
        color: #63D86B;
      }
    }
  }

}

</style>

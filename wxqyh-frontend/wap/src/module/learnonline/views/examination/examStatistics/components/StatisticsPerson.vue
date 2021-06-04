<template>
  <div class="exam_statistics_person qwui-flexbox"
      :class="rankingClass"
  >
    <!-- 奖杯 -->
    <div class="trophy">{{ranking}}</div>

    <!-- 信息 -->
    <div class="info qwui-flexItem">
      <!-- 姓名/号码 -->
      <div class="person">
        <span class="name ellipsis">{{item.personName}}</span>{{item.mobile}}
        <!-- 状态标签 -->
        <apply-status 
          class="apply_status" 
          :applystatus="applystatus">
        </apply-status>
      </div>
      <!-- 部门 -->
      <div class="department ellipsis" v-if="departmentName">{{departmentName}}</div>
      <!-- 用时 -->
      <div class="time">{{time}}</div>
    </div>

    <!-- 学数 -->
    <div class="score">{{score}}<span class="transverse" v-if="!item.finishTime"></span></div>
  </div>
</template>


<script>
import ApplyStatus from '@/components/part/apply_status';
export default {
  name: 'StatisticsPerson',
  components: {
    ApplyStatus
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
      /* 公共组件配置项 */  
    };
  },
  computed: {
    // 排名
    ranking() {
      let ranking = this.item.ranking;
      return 0 <= ranking && ranking <= 3? '': ranking; // 前三和0排名就显示空
    },
    // 排名类
    rankingClass() {
      let ranking = this.item.ranking; // 超出范围无需添加类
      if (!ranking || ranking > 3) {return;}

      let rankingClass = {};
      let classObj = {
        '1': 'ranking_st',
        '2': 'ranking_nd',
        '3': 'ranking_rd',
      };
      let nowKey = classObj[ranking];
      rankingClass[nowKey] = true;
      return rankingClass;
    },
    // 部门
    departmentName() {
      let departmentName = this.item.departmentName;
      return departmentName == '0'? '': 
             this.$t('i18n.department') + this.$t('i18n.colon') + departmentName;
    },
    // 用时
    time() {
      let spend = this.item.spend;
      let minute = parseInt(spend/60);
      minute = minute < 10? `0${minute}`: minute;
      let second = spend%60;
      second = second < 10? `0${second}`: second;
      return this.$t('i18n.timeOfUse') + this.$t('i18n.colon') + `${minute}'${second}''`;
    },
    // 学分
    score() {
      let item = this.item;
      return item.finishTime? item.score: '';
    },
    // 标签公共配置
    applystatus() {
      let item = this.item;
      let classObj = {};
      classObj[this.$t('i18n.notExam')] = 'status_notExam';
      classObj[this.$t('i18n.hasPassed')] = 'status_hasPassed';
      classObj[this.$t('i18n.notPass')] = 'status_notPass';

      let name = !item.finishTime? this.$t('i18n.notExam'):
                 item.isPass? this.$t('i18n.hasPassed'): this.$t('i18n.notPass');

      return  {// 小标签配置
        name: name,
        class: classObj[name],
        active: false,
      }
    },
  },
  methods: {
  }
};

</script>

<style lang="scss" scoped>

.exam_statistics_person {
  height: 55px;
  padding: 21px 0;

  .trophy {
    margin: 10px 12px 0 0;
    width: 34px;
    height: 34px;
    line-height: 34px;
    font-size: 17px;
    font-weight: 700;
    color: #999;
    text-align: center;
  }
  
  .info {
    
    .person {
      height: 22px;
      font-size: 16px;
      color: #333;

      .name {
        display: inline-block;
        margin-right: 6px;
        max-width: 62px;
        vertical-align: top;
      }
      .apply_status {
        margin-bottom: 4px;
      }
      .status_notExam {
        color: #F59262;
        border: 1px solid #FAC8B0;
      }
      .status_hasPassed {
        color: #bbb;
        border: 1px solid #bbb;
      }
      .status_notPass {
        color: #F56262;
        border: 1px solid #F56262;
      }
    }
    .department {
      max-width: 217px;
      font-size: 12px;
      color: #999;
    }
    .time {
      font-size: 12px;
      color: #999;
    }
  }

  .score {
    width: 60px;
    height: 55px;
    line-height: 55px;
    font-weight: 700;
    font-size: 26px;
    color: #999;
    text-align: center;

    .transverse {
      display: inline-block;
      width: 14px;
      height: 3px;
      background-color: #999;
      margin-bottom: 10px;
    }
  }
}

.ranking_st {
  .trophy {
    background: url(~assets/images/learnonline/ic_rank_first.png) no-repeat 0/34px;
  }
  .score {
    background: #FFFAEC;
    color: #FBA30A;
  }
}
.ranking_nd {
  .trophy {
    background: url(~assets/images/learnonline/ic_rank_second.png) no-repeat 0/34px;
  }
  .score {
    background: #F6F8FB;
    color: #8BA3BD;
  }
}
.ranking_rd {
  .trophy {
    background: url(~assets/images/learnonline/ic_rank_third.png) no-repeat 0/34px;
  }
  .score {
    background: #FAF4EF;
    color: #D6A16C;
  }
}
</style>

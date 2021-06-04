<template lang="html">
  <div class="budget-detail">
    <div class="budget-detail-head">
      <div class="budget-detail-title border-bottom-1px">{{name}}</div>
      <div class="budget-detail-content">
        <qw-date-carousel
          class="budget-date"
          :prev-disable="prevDisable"
          :next-disable="nextDisable"
          @prev="prevMonth"
          @next="nextMonth"
        >
          <span class="budget-date-carousel">{{currentYear}}-{{currentMonth|prefixInteger}}</span>
        </qw-date-carousel>
        <qw-progress
          class="budget-progress"
          :percentage="detail.percent && detail.percent[monthNum]"
          :width="12"
          :color="isExecssStyle(detail.percent && detail.percent[monthNum], 100)"
        ></qw-progress>
      </div>
      <div class="budget-desc" v-if="detail.general">
        <div class="budget-desc-item">
          <div class="budget-desc-name">{{$t('i18n.reim.sumGeneral')}}</div>
          <div>{{detail.general[monthNum] | formatMoney}}</div>
        </div>
        <div class="budget-desc-item">
          <div class="budget-desc-name">{{$t('i18n.reim.sumUsed')}}</div>
          <div>{{detail.used[monthNum] | formatMoney}}</div>
        </div>
        <div class="budget-desc-item">
          <div class="budget-desc-name">{{$t('i18n.reim.sumBalance')}}</div>
          <div :class="{'is-excess': checkIsExcess(detail.balance[monthNum])}">{{ detail.balance[monthNum] | formatMoney}}</div>
        </div>
      </div>
    </div>
    <div class="projects">
      <div class="projects-head border-bottom-1px">
        <div class="projects-name">{{$t('i18n.reim.subject')}}</div>
        <div class="projects-name">{{$t('i18n.reim.used')}}</div>
        <div class="projects-name">{{$t('i18n.reim.balance')}}</div>
      </div>
      <div class="projects-list">
        <div v-for="(item, index) in projects" class="projects-item border-bottom-1px">
          <div class="projects-item-name">{{item.general.subjName}}</div>
          <div class="projects-item-money">{{item.used[monthNum]|formatMoney}}</div>
          <div
            class="projects-item-money"
            :class="{'is-excess': checkIsExcess(item.balance[monthNum])}"
          >{{item.balance[monthNum] | formatMoney}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QwDateCarousel from '../../components/budget/DateCarousel';
import QwProgress from '../../components/base/Progress';
import { getBudgetDetail, getHasBudgetYear } from '../../api/budget.js';
import { budgetMixin } from '../../mixins/budgetMixin.js';

const months = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

export default {
  name: 'QwBudgetDetail',
  mixins: [budgetMixin],
  components: {
    QwDateCarousel,
    QwProgress,
  },
  data() {
    return {
      currentMonth: '',
      currentYear: '',
      id: '',
      name: '',
      detail: {},
      projects: [],
      prevDisable: false,
      nextDisable: false
    };
  },
  filters: {
    prefixInteger(num) {
      return num < 10 ? `0${num}` : num;
    }
  },
  computed: {
    monthNum() {
      return months[this.currentMonth - 1];
    },
  },
  created() {
    // 初始化数据
    this.init();
  },
  methods: {
    init() {
      const { year, month, id, name } = this.$route.query;

      // 如果没有年份或id则返回预算看板页面
      if (!year || !id) {
        this.$router.push({
          name: 'budget',
        });
      }

      // 从消息进入的链接带月份，否则为当前月份
      if (month > 0 && month < 13) {
        this.currentMonth = month
      } else {
         this.currentMonth = new Date().getMonth() + 1;
      }

      this.currentYear = year;
      this.id = id;
      this.name = name;

      // 获取预算看板详情数据
      this.getBudgetDetail();
    },
    getBudgetDetail() {
      const { id, currentYear, name } = this;

      _.showLoading();
      getBudgetDetail({ ids: id, year: currentYear }).then((res) => {
        _.hideLoading();
        this.detail = res.data.sumVO;
        this.projects = res.data.children;
      }).catch((err) => {
        _.hideLoading();
        _.alert(err.desc);
      });
    },
    prevMonth() {
      if (this.currentMonth <= 1) {
        this.prevDisable = true;
        this.getHasBudgetYear(0);
      } else {
        this.currentMonth--;
        this.nextDisable = false;
      }
    },
    nextMonth() {
      if (this.currentMonth >= 12) {
        this.nextDisable = true;
        this.getHasBudgetYear(1);
      } else {
        this.currentMonth++;
        this.prevDisable = false;
      }

    },
    getHasBudgetYear(isNext) {
      const { currentYear, id } = this;
      getHasBudgetYear({
        year: currentYear,
        isNext,
        ids: id,
      }).then(res => {
        let prevNextYear = res.data.year || '';
        if (isNext === 0) {
          this.prevDisable = !res.data.year;
          //当月份是1并且有上一年数据
          if (this.currentMonth == 1 && prevNextYear !== '') {
            this.currentYear = prevNextYear;
            this.currentMonth = 12;
            this.getBudgetDetail();
          }
        } else if (isNext === 1) {
          this.nextDisable = !res.data.year;
          //当月份是12并且有下一年数据
          if (this.currentMonth == 12 && prevNextYear !== '') {
            this.currentYear = prevNextYear;
            this.currentMonth = 1;
            this.getBudgetDetail();
          }
        }
      })
    },
    isExecssStyle(num, max) {
      return num > max ? '#E94F4F' : this.color;
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '~../../styles/mixin.scss';

  .budget-detail {
    clear: both;

    .budget-detail-head {
      margin-bottom: 10px;
      color: $color-text-d;
      background: $color-background;
      overflow: hidden;

      .budget-detail-title {
        padding: $box-padding;
        font-size: $font-size-medium-x;
      }

      .budget-detail-content {
        padding: $box-padding;

        .budget-date {
          margin-bottom: 30px;
          .budget-date-carousel {
            display: block;
            color: $color-text-d;
            font-size: $font-size-medium-x;
            text-align: center;
          }
        }
      }

      .budget-desc {
        display: flex;
        padding: $box-padding 0;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        text-align: center;

        .budget-desc-item {
          flex: 1;
          text-align: center;
          word-break: break-word;
          padding: 0 5px;

          .budget-desc-name {
            margin-bottom: 5px;
            font-size: $font-size-small;
            color: $color-text-tip;
          }
        }
      }
    }

    .projects {
      background: $color-background;

      .projects-head {
        display: flex;
        padding: $box-padding;
        font-size: 14px;
        color: $color-text-tip;

        .projects-name {
          flex: 1;

          &:first-child {
            flex: 1.5;
          }

          &:last-child {
            text-align: right;
          }
        }
      }

      .projects-item {
        display: flex;
        align-items: center;
        padding: $box-padding;
        font-size: $font-size-medium-x;
        color: $color-text-d;

        .projects-item-name, projects-item-money {
          text-align: left;
        }
      }

      .projects-item-name {
        flex: 1.5;
        @include no-wrap();
      }

      .projects-item-money {
        flex: 1;
        word-break: break-word;

        &:last-child {
          text-align: right;
        }
      }
    }
  }

  .is-excess {
    color: $color-text-warn;
  }
</style>

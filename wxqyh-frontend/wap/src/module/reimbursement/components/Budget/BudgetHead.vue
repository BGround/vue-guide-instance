<template>
  <div class="qwui-budget_header">
    <div class="qwui-budget_desc">
      <qw-date-carousel
        class="qwui-budget_date"
        :prev-disable="prevDisable"
        :next-disable="nextDisable"
        @prev="$emit('prev')"
        @next="$emit('next')"
      >
        <div class="qwui-budget_date_carousel">{{headData.currentYear + $t('i18n.reim.year')}}</div>
      </qw-date-carousel>

      <div class="qwui-budget_used">{{$t('i18n.reim.alreayUsed')}}</div>
      <div class="qwui-budget_used_percent">{{headData.percent}}%</div>
    </div>

    <div class="qwui-budget_detail border-bottom-1px">
      <div class="qwui-budget_cost">
        <div>{{$t('i18n.reim.sumGeneral')}}</div>
        <div class="qwui-cost_money">{{headData.sumGeneral | formatMoney}}</div>
      </div>
      <div class="qwui-budget_cost">
        <div>{{$t('i18n.reim.sumUsed')}}</div>
        <div class="qwui-cost_money">{{headData.sumUsed | formatMoney}}</div>
      </div>
      <div class="qwui-budget_cost">
        <div>{{$t('i18n.reim.sumBalance')}}</div>
        <div
          class="qwui-cost_money"
          :class="{'is-excess': checkIsExcess(headData.sumBalance)}"
        >{{headData.sumBalance | formatMoney}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import QwDateCarousel from './DateCarousel';
import { budgetMixin } from '../../mixins/budgetMixin';

export default {
  name: 'QwBudgetHead',
  mixins: [budgetMixin],
  props: {
    headData: {
      type: Object,
      default() {
        return {
          currentYear: '',
          lastYear: '',
          nextYear: '',
          percent: '',
          sumBalance: '',
          sumGeneral: '',
          sumUsed: '',
        }
      },
    },
  },
  components: {
    QwDateCarousel,
  },
  data() {
    return {
    };
  },
  computed: {
    prevDisable() {
      return this.headData.lastYear === 0;
    },
    nextDisable() {
      return this.headData.nextYear === 0;
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '~../../styles/mixin.scss';

  .qwui-budget_header {
    .qwui-budget_desc {
      padding: $box-padding;
      padding-bottom: 25px;
      background: $color-theme;
      text-align: center;

      .qwui-budget_date {
        margin-bottom: 20px;
        .qwui-budget_date_carousel {
          font-size: $font-size-medium;
        }
      }

      .qwui-budget_used {
        font-size: $font-size-medium;
        color: rgba(255, 255, 255, 0.5)
      }

      .qwui-budget_used_percent {
        font-size: 44px;
        color:$color-text;
      }
    }

    .qwui-budget_detail {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 15px 0;
      background: $color-background;

      .qwui-budget_cost {
        flex: 1;
        font-size: $font-size-small;
        text-align: center;
        line-height: 1;
        color: $color-text-tip;

        .qwui-cost_money {
          margin-top: 10px;
          padding: 0 5px;
          color: $color-text-d;
          font-size: $font-size-medium-x;
          word-break: break-word;
        }
      }
    }
  }

  .is-excess {
    color: $color-text-warn;
  }
</style>

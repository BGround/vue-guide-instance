<template lang="html">
  <div class="budget">
    <div class="budget-wrap" v-if="isVip && children.length">
      <qw-budget-head
        :head-data="headData"
        @prev="prevYearHandle"
        @next="nextYearHandle"
      ></qw-budget-head>

      <section class="budget-content">
        <div class="budget-title">{{`${$t('i18n.reim.manageCenterCost')}  (${budgetSize})`}}</div>
        <div class="budget-list 1px-border-bottom" id="budgetList" ref="budgetList">
          <qw-tree
            v-for="(item, index) in children"
            :node-len="children.length"
            :model="item"
            :expandAll="children.length === 1"
            :key="item.id"
            :node-index="1"
            :index="index"
          >
          </qw-tree>
        </div>
      </section>
    </div>
    <no-record class="no-record" :hasrecord="hasRecord"></no-record>
  </div>
</template>

<script>
import NoRecord from '@/components/base/no_record';
import QwBudgetHead from '../../components/budget/BudgetHead';
import QwTree from '../../components/budget/Tree';
import { checkCenterCostPermission, getBudgetBoard } from '../../api/budget';
import { pageMixin } from '../../mixins/pageMixin';
import { mapGetters } from 'vuex';
import { isVipGold } from '@/assets/js/vip-portal.js'

export default {
  name: 'QwBudget',
  mixins: [pageMixin],
  components: {
    NoRecord,
    QwBudgetHead,
    QwTree,
  },
  data() {
    return {
      isVip: false,
      noPermission: false,
      currentYear: new Date().getFullYear(),
      headData: {},
      children: [],
      budgetSize: '',
      hasRecord: {
        show: false,
        //是否置顶?覆盖整个页面
        setTop: true,
        icon: 'qwui-icon_noPermission',
        //若text无内容则title为16px #bbb，有则为18px #666
        title: 'i18n.reim.info.noBudgetRecord.title',
        //标题下面的提示
        text: 'i18n.reim.info.noBudgetRecord.noRecord',
      }
    };
  },
  computed: {
    ...mapGetters([
      'centerCostData',
    ]),
  },
  watch: {
    currentYear() {
      this.getBudgetData();
    },
    // 跳转至预算详情
    centerCostData(data) {
      if (!data.id) { return; }
      this.$router.push({
        name: 'budgetDetail',
        query: { id: data.id, name: data.name, year: this.currentYear },
      });
    },
  },
  created() {
    _.showLoading();
    wxqyhConfig.ready(() => {
      this.isVip = isVipGold(interfaceCode.INTERFACE_CODE_REIMBURSEMENT);
      this.init();
    });
  },
  methods: {
    init() {
      if (!this.isVip) {
        _.hideLoading();
        this.noPermission = true;
        this.hasRecord.show = true;
        this.hasRecord.title = 'i18n.reim.info.noVip.title';
        this.hasRecord.text = 'i18n.reim.info.noVip.content';
        this.hasRecord.operation = {
          text: 'i18n.reim.info.upgrade',
          callBack() {
            window.location.href = _.goldVipURL;
          },
        };
      } else {
        this.checkPermission();
      }
    },
    initListScrollView() {
      const winHeight = window.innerHeight || document.body.clientHeight;
      const barHeight = 50;
      const viewTop = this.$refs.budgetList.offsetTop;

      this.$refs.budgetList.style.height = (winHeight - barHeight - viewTop) + 'px';
    },
    // 预算看板权限检验
    checkPermission() {
      checkCenterCostPermission().then(res => {
        _.hideLoading();
        if (!res.data.premission) {
          this.noPermission = true;
          this.hasRecord.show = true;
          this.hasRecord.text = 'i18n.reim.info.noBudgetRecord.noPermission';
          this.hasRecord.operation = '';
        } else {
          this.getBudgetData();
        }
      });
    },
    // 获取预算看板数据
    getBudgetData() {
      _.showLoading();
      getBudgetBoard({year: this.currentYear}).then((res) => {
        _.hideLoading();
        const { currentYear, lastYear, nextYear, percent, sumBalance, sumGeneral, sumUsed, children, size } = res.data;

        if (children.length < 1 && !sumGeneral) {
          this.hasRecord.show = true;
          this.hasRecord.text = 'i18n.reim.info.noBudgetRecord.noRecord';
        }

        this.headData = {
          currentYear,
          lastYear,
          nextYear,
          percent,
          sumBalance,
          sumGeneral,
          sumUsed,
        }
        this.children = children;
        this.budgetSize = size;
      }).catch((err) => {
        _.hideLoading();
        _.alert('i18n.notice', err.desc);
      })
    },
    prevYearHandle() {
      this.currentYear --;
    },
    nextYearHandle() {
      this.currentYear ++;;
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~../../styles/mixin.scss';
  @import '~../../styles/variable.scss';

  .budget {
    .budget-content {
      .budget-title {
        padding: 15px 15px 10px;
        color: #888;
        font-size: $font-size-medium;
      }

      .budget-list {
        overflow-y: auto;
        background: $color-background;
      }
    }

    .no-record /deep/ .qwui-font_operation{
      display: block;
      width: 60%;
      margin: 20px auto;
      padding: 12px 0;
      color: $color-text-tip;
      text-align: center;
      border: 1px solid $icon-border-color;
      border-radius: 30px;
    }
  }
</style>

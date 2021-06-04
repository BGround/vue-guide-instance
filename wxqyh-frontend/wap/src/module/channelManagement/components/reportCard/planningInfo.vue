<template>
  <div class="planning-info">

    <h3 class="header">市场表现 <span v-if="prevMonth">数据：{{prevMonth}}市占率</span></h3>
    <!-- <span class="title title--rate"><span class="title__name">所在城市自主市占率表现</span></p> -->
    <p class="title title--rate2">
      <span class="title__name2">当年表现（{{getFullYear}}-01至{{getMonth}}）</span>
    </p>

    <div class="grid">
      <div class="grid__row">
        <div class="grid__col">
          <div class="city-rate">
            <div class="city-rate__left">所在城市市占率</div>
            <div class="city-rate__right">{{getData.cityPercent}}%</div>
          </div>
        </div>
        <div class="grid__col">
          <div class="province-ranking">
            <div class="province-ranking__top">
              <span>全省排名</span>
              <span>{{getData.provinceSort}}</span>
            </div>
            <div class="province-ranking__bottom">
              <span>同比：<strong>{{getData.yearOnYear}}%</strong></span>
              <span>环比：<strong>{{getData.monthOnMonth}}%</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid__row">
        <div class="grid__col">
          <div class="national-rate">
            <div class="national-rate__top">
              <span>全国市占率</span>
              <span>{{getData.countryPercent | toPercentage}}</span>
            </div>
            <div class="national-rate__bottom">
              <span>比全国：</span>
              <span><strong>{{getData.country}}%</strong></span>
            </div>
          </div>
        </div>
        <div class="grid__col">
          <div class="national-rate">
            <div class="province-rate__top">
              <span>全省市占率</span>
              <span>{{getData.provincePercent | toPercentage}}</span>
            </div>
            <div class="province-rate__bottom">
              <span>同全省：</span>
              <span><strong>{{getData.province}}%</strong></span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <p class="title title--history"><span class="title__name">月度/历史市占率表现</span><i @click="handleClickHistoryIcon"
        class="title__icon"
        :class="{'title__icon--open': isOpen}"></i></p>
    <transition name="">
      <div class="table"
        v-if="isOpen">

        <div class="table__row">
          <div class="table__col">{{getFullYear}}年01月</div>
          <div class="table__col">{{getData.january? `${getData.january}%`: '-'}}</div>
        </div>

        <div class="table__row">
          <div class="table__col">{{getFullYear}}年02月</div>
          <div class="table__col">{{getData.february? `${getData.february}%`: '-'}}</div>
        </div>

        <div class="table__row">
          <div class="table__col">{{getFullYear}}年03月</div>
          <div class="table__col">{{getData.march ? `${getData.march}%`: '-'}}</div>
        </div>

        <div class="table__row">
          <div class="table__col">{{getFullYear}}年04月</div>
          <div class="table__col">{{getData.april ? `${getData.april}%`: '-'}}</div>
        </div>

        <div class="table__row">
          <div class="table__col">{{getFullYear}}年05月</div>
          <div class="table__col">{{getData.may ? `${getData.may}%`: '-'}}</div>
        </div>

        <div class="table__row">
          <div class="table__col">{{getFullYear}}年06月</div>
          <div class="table__col">{{getData.june ? `${getData.june}%`: '-'}}</div>
        </div>

        <div class="table__row">
          <div class="table__col">{{getFullYear}}年07月</div>
          <div class="table__col">{{getData.july ? `${getData.july}%`: '-'}}</div>
        </div>

        <div class="table__row">
          <div class="table__col">{{getFullYear}}年08月</div>
          <div class="table__col">{{getData.august ? `${getData.august}%`: '-'}}</div>
        </div>

        <div class="table__row">
          <div class="table__col">{{getFullYear}}年09月</div>
          <div class="table__col">{{getData.september ? `${getData.september}%`: '-'}}</div>
        </div>

        <div class="table__row">
          <div class="table__col">{{getFullYear}}年10月</div>
          <div class="table__col">{{getData.october ? `${getData.october}%`: '-'}}</div>
        </div>

        <div class="table__row">
          <div class="table__col">{{getFullYear}}年11月</div>
          <div class="table__col">{{getData.november ? `${getData.november}%`: '-'}}</div>
        </div>

        <div class="table__row">
          <div class="table__col">{{getFullYear}}年12月</div>
          <div class="table__col">{{getData.december ? `${getData.december}%`: '-'}}</div>
        </div>

        <div class="table__row">
          <div class="table__col">{{getFullYear-1}}年</div>
          <div class="table__col">{{getData.year1}}%</div>
        </div>
        <div class="table__row">
          <div class="table__col">{{getFullYear-2}}年</div>
          <div class="table__col">{{getData.year2}}%</div>
        </div>
      </div>
    </transition>

    <p class="title title--comparison">
      <span class="title__name">与竞品对比表现</span>
      <span v-if="getDate"
        class="title__value">数据:{{getDate}}</span>
    </p>

    <div class="grid">
      <div class="grid__row">
        <div class="grid__col"
          v-if="cheeryBrandPercentData">
          <div class="comparison">
            <div class="comparison__name">{{cheeryBrandPercentData.brand}}</div>
            <p class="comparison__item">
              <span class="comparison__item__left">所在城市排名</span>
              <span class="comparison__item__right">{{(cheeryBrandPercentData.sort || (!cheeryBrandPercentData.sort && cheeryBrandPercentData.sort===0)) ? cheeryBrandPercentData.sort: '-'  }}</span>
            </p>
            <p class="comparison__item">
              <span class="comparison__item__left">所在城市市占率</span>
              <span class="comparison__item__right">{{(cheeryBrandPercentData.percent || (!cheeryBrandPercentData.percent && cheeryBrandPercentData.percent===0)) ? `${cheeryBrandPercentData.percent}%`: '-'  }}</span>
            </p>
          </div>
        </div>

        <div class="grid__col"
          v-if="otherBrandPercentData.length">
          <div class="comparison">
            <p class="comparison__item"
              v-for="(item, index) in otherBrandPercentData"
              :key="index">
              <span class="comparison__item__left">奇瑞-{{item.brand}}</span>
              <span class="comparison__item__right">{{item.relativePercent}}%</span>
            </p>
          </div>
        </div>

        <div class="grid__col"
          v-for="(item, index) in otherBrandPercentData"
          :key="index">
          <div class="comparison">
            <div class="comparison__name">{{item.brand}}</div>
            <p class="comparison__item">
              <span class="comparison__item__left">所在城市排名</span>
              <span class="comparison__item__right">{{(item.sort || (!item.sort && item.sort===0)) ? item.sort: '-'  }}</span>
            </p>
            <p class="comparison__item">
              <span class="comparison__item__left">所在城市市占率</span>
              <span class="comparison__item__right">{{(item.percent || (!item.percent && item.percent===0)) ? `${item.percent}%`: '-'  }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { filter } from 'minimatch'
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    saleList: {
      type: Array,
      default() {
        return []
      }
    },
    brandList: {
      type: Array,
      default() {
        return []
      }
    },
    salesreport: {
      type: Object,
      default() {
        return {}
      }
    },
    prevMonth:{
      type: String,
      default() {
        return ''
      } 
    }
  },
  computed: {
    getData() {
      return this.data
    },
    getSaleList() {
      return this.saleList
    },
    getDate() {
      if (this.salesreport && this.salesreport.year && this.salesreport.month) {
        const d = this.getPreMonth(
          this.salesreport.year,
          this.salesreport.month
        )
        return d + '自主城市占有率'
      }
      return ''
    },

    getFullYear() {
      if (
        this.salesreport &&
        this.salesreport.year &&
        this.salesreport.month > 1
      ) {
        return parseInt(this.salesreport.year)
      } else {
        return parseInt(this.salesreport.year) - 1
      }
    },

    /**
     * 发布日期的上一个月
     */
    getMonth() {
      if (this.salesreport && this.salesreport.year) {
        if(this.salesreport.month > 1){
          return  `${parseInt(this.salesreport.year)}-${parseInt(this.salesreport.month) -1}`
        }else {
          return `${parseInt(this.salesreport.year) - 1}-12`
        }
      } else{
        return ''
      }
    },

    cheeryBrandPercentData() {
      return this.brandList.find(item => item.brand === '奇瑞')
    },
    otherBrandPercentData() {
      return this.brandList.filter(item => item.brand !== '奇瑞')
    }
  },
  data() {
    const d = new Date()
    return {
      isOpen: true,
      thisYear: d.getFullYear(),
      thisMonth: d.getMonth() + 1
    }
  },
  methods: {
    handleClickHistoryIcon() {
      this.isOpen = !this.isOpen
    },
    getPreMonth(year, month) {
      var days = new Date(year, parseInt(month) - 1, 0)
      var t2 = days.getFullYear() + '年' + (days.getMonth() + 1) + '月'
      return t2
    }
  },
  filters: {
    toPercentage(value) {
      const parsedValue = parseFloat(value)
      if (Number.isNaN(parsedValue)) {
        return '-'
      } else {
        return `${Number(parsedValue).toFixed(2)}%`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.planning-info {
  background: #ffffff;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    transform: scaleY(0.5);
    background: #dbdbdb;
  }

  .header {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(20, 30, 40, 1);
    padding-bottom: 11px;
    padding-left: 26px;
    padding-top: 16px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      display: block;
      height: 16px;
      border-radius: 2px;
      width: 4px;
      top: 50%;
      background-color: #c6001f;
      top: 21px;
      left: 18px;
    }
    &>span{
      font-size: 14px;
      font-weight: normal;
    }
  }
  .title__name {
    padding-left: 26px;
    height: 23px;
    font-size: 17px;
    font-weight: 400;
    line-height: 23px;
    color: rgba(102, 102, 102, 1);
  }

  .title__name2 {
    padding-left: 26px;
    height: 17px;
    font-size: 13px;
    font-weight: 400;
    line-height: 23px;
    color: rgba(102, 102, 102, 1);
  }
  .title--rate {
    padding-bottom: 6px;
  }
  .title--rate2 {
    padding-bottom: 14px;
  }

  .grid {
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      transform: scaleY(0.5);
      background: #dbdbdb;
    }
  }
  .grid__row {
    display: flex;
    flex-wrap: wrap;
  }
  .grid__col {
    position: relative;
    width: 50%;
    &:nth-child(2n + 2)::before {
      display: none;
    }
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      top: 0;
      right: 0;
      width: 1px;
      transform: scaleX(0.5);
      background: #dbdbdb;
    }
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      transform: scaleY(0.5);
      background: #dbdbdb;
    }
  }

  .city-rate {
    height: 100px;
    display: flex;
    padding-top: 15px;
    align-items: flex-start;
    margin-left: 20px;
    margin-right: 10px;
    justify-content: space-between;
  }
  .city-rate__left {
    // width: 64px;
    font-size: 15px;
    font-weight: 400;
    line-height: 28px;
    color: rgba(0, 0, 0, 1);
  }
  .city-rate__right {
    font-size: 15px;
    font-weight: 400;
    line-height: 28px;
    color: rgba(0, 0, 0, 1);
  }

  .national-rate,
  .province-ranking {
    margin-left: 20px;
    margin-right: 14px;
  }

  .national-rate__top,
  .province-rate__top,
  .province-ranking__top {
    display: flex;
    justify-content: space-between;
    padding-top: 15px;
    height: 24px;
    font-size: 15px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
  }

  .national-rate__bottom,
  .province-rate__bottom,
  .province-ranking__bottom {
    margin-top: 28px;
    display: flex;
    justify-content: space-between;
    height: 19px;
    font-size: 13px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(153, 153, 153, 1);
    strong {
      color: #000000;
    }
  }

  .national-rate {
    height: 100px;
    margin-left: 20px;
    margin-right: 10px;
  }

  .title--history {
    padding-top: 16px;
    padding-bottom: 8px;
    display: flex;
    justify-content: space-between;
    padding-right: 40px;
    align-items: center;
  }

  .table {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      transform: scaleY(0.5);
      background: #dbdbdb;
    }
  }

  .table__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 35px;
    font-size: 13px;
    font-weight: 400;
    line-height: 34px;
    color: rgba(102, 102, 102, 1);
  }

  .table__row:nth-child(2n + 1) {
    height: 34px;
    background: rgba(238, 238, 238, 0.3);
  }
  .table__row:nth-child(2n) {
    height: 38px;
    background: #fff;
  }

  .title--comparison {
    padding: 16px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title__value {
      margin-right: 26px;
    }
  }

  .comparison {
    height: 100px;
    padding-left: 20px;
    padding-right: 16px;
  }

  .comparison__name {
    padding-top: 10px;
    padding-bottom: 5px;
    height: 23px;
    font-size: 16px;
    font-weight: 400;
    line-height: 28px;
    color: rgba(0, 0, 0, 1);
  }

  .comparison__item {
    height: 19px;
    font-size: 13px;
    font-weight: 400;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
    color: rgba(153, 153, 153, 1);
    margin: 5px 0;
  }

  .comparison__item__right {
    height: 19px;
    font-size: 13px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
  }

  .title__icon {
    background-image: url('~@/module/channelManagement/static/images/icon_arrow_down.png');
    background-size: 100%;
    display: block;
    width: 12px;
    height: 8px;
    transition: transform 0.4s ease-in-out;
  }

  .title__icon.title__icon--open {
    transform: rotate(180deg);
  }
}
</style>

<template>
  <div class="sales-performance">
    <h3 class="header">提车 <span class="header__date">{{getYearMonth}}</span></h3>

    <div class="grid">
      <div class="grid__row">
        <div class="grid__col">
          <div class="pick-car">
            <h4 class="pick-car__title">月度完成情况</h4>
            <div class="pick-car__filed">
              <span class="pick-car__filed__lebal">提车目标</span>
              <span class="pick-car__filed__value">{{getData.carTarget | formatNumber}}</span>
            </div>
            <div class="pick-car__filed">
              <span class="pick-car__filed__lebal">提车完成</span>
              <span class="pick-car__filed__value">{{getData.carComplete | formatNumber}}</span>
            </div>
          </div>
        </div>
        <div class="grid__col">
          <div class="pick-car">
            <div class="pick-car__filed">
              <span class="pick-car__filed__lebal">完成率</span>
              <span class="pick-car__filed__value">{{getData.carPercent | percentage}}</span>
            </div>
            <div class="pick-car__filed">
              <span class="pick-car__filed__lebal">同比</span>
              <span class="pick-car__filed__value">{{getData.carYearOnYear | percentage}}</span>
            </div>
            <div class="pick-car__filed">
              <span class="pick-car__filed__lebal">环比</span>
              <span class="pick-car__filed__value">{{getData.carMonthOnMonth | percentage}}</span>
            </div>

          </div>
        </div>
      </div>
      <div class="grid__row">
        <div class="grid__col">
          <div class="pick-car">
            <h4 class="pick-car__title">提车完成率排名</h4>
            <div class="pick-car__filed">
              <span class="pick-car__filed__lebal">全国排名</span>
              <span class="pick-car__filed__value">{{getData.carCountrySort | formatNumber}}</span>
            </div>
            <div class="pick-car__filed">
              <span class="pick-car__filed__lebal">大区排名</span>
              <span class="pick-car__filed__value">{{getData.carAreaSort | formatNumber}}</span>
            </div>
          </div>
        </div>
        <div class="grid__col">
          <div class="pick-car">
            <div class="pick-car__filed">
              <span class="pick-car__filed__lebal">全省排名</span>
              <span class="pick-car__filed__value">{{getData.carProvinceSort | formatNumber}}</span>
            </div>
            <div class="pick-car__filed">
              <span class="pick-car__filed__lebal">同城排名</span>
              <span class="pick-car__filed__value">{{getData.salesCitySort | formatNumber}}</span>
            </div>
            <div class="pick-car__filed">
              <span class="pick-car__filed__lebal">同城经销商家数</span>
              <span class="pick-car__filed__value">{{getData.carDealerNum | formatNumber}}</span>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="gutter"></div>
    <h3 class="header">实销 <span class="header__date">{{getYearMonth}}</span></h3>

    <div class="grid">
      <div class="grid__row">
        <div class="grid__col">
          <div class="sales">
            <h4 class="sales__title">月度完成情况</h4>
            <div class="sales__filed">
              <span class="sales__filed__lebal">实销目标</span>
              <span class="sales__filed__value">{{getData.salesTarget | formatNumber}}</span>
            </div>
            <div class="sales__filed">
              <span class="sales__filed__lebal">实销完成</span>
              <span class="sales__filed__value">{{getData.salesComplete | formatNumber}}</span>
            </div>
          </div>
        </div>
        <div class="grid__col">
          <div class="sales">
            <div class="sales__filed">
              <span class="sales__filed__lebal">完成率</span>
              <span class="sales__filed__value">{{getData.salesPercent| percentage}}</span>
            </div>
            <div class="sales__filed">
              <span class="sales__filed__lebal">同比</span>
              <span class="sales__filed__value">{{getData.salesYearOnYear| percentage}}</span>
            </div>
            <div class="sales__filed">
              <span class="sales__filed__lebal">环比</span>
              <span class="sales__filed__value">{{getData.salesMonthOnMonth| percentage}}</span>
            </div>

          </div>
        </div>
      </div>
      <div class="grid__row">
        <div class="grid__col">
          <div class="sales">
            <h4 class="sales__title">实销量排名</h4>
            <div class="sales__filed">
              <span class="sales__filed__lebal">全国排名</span>
              <span class="sales__filed__value">{{getData.salesCountrySort | formatNumber}}</span>
            </div>
            <div class="sales__filed">
              <span class="sales__filed__lebal">大区排名</span>
              <span class="sales__filed__value">{{getData.salesAreaSort | formatNumber}}</span>
            </div>
          </div>
        </div>
        <div class="grid__col">
          <div class="sales">
            <div class="sales__filed">
              <span class="sales__filed__lebal">全省排名</span>
              <span class="sales__filed__value">{{getData.salesProvinceSort | formatNumber}}</span>
            </div>
            <div class="sales__filed">
              <span class="sales__filed__lebal">同城排名</span>
              <span class="sales__filed__value">{{getData.salesCitySort | formatNumber}}</span>
            </div>
            <div class="sales__filed">
              <span class="sales__filed__lebal">同城经销商家数</span>
              <span class="sales__filed__value">{{getData.salesDealerNum | formatNumber}}</span>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="gutter"></div>
    <h3 class="header">库存 <span class="header__date">{{getYearMonth}}</span></h3>

    <div class="grid">
      <div class="grid__row">
        <div class="grid__col">
          <div class="stock">
            <div class="stock__left">月度库存数</div>
            <div class="stock__right">{{getStock | formatNumber}}</div>
          </div>
        </div>
        <div class="grid__col">
          <div class="stock">
            <div class="stock__left">月度存销比</div>
            <div class="stock__right">{{getStockPresent | formatNumber}}</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    sales: {
      type: Object,
      default() {
        return {}
      }
    },
    salesReport:{
        type: Object,
        default() {
            return {}
        }
    }
  },

  computed: {
    getData() {
      return this.sales
    },
    getStock() {

      return this.sales.stock
    },
    getStockPresent() {
      if(this.sales.stockPercent){
        return Number(this.sales.stockPercent).toFixed(2)
      }else{
        return '0.00';
      }
    },
    getYearMonth(){
        const {year='', month=''} = this.salesReport;
        if(year && month){
            return `(${year}年${month}月)`
        }
    }
  },

  filters:{
    percentage(value){
      const fixedValue = Number(value).toFixed(2)
      if(fixedValue === 'NaN'){
        return '-';
      }else{
        return `${fixedValue}%`
      }
    },
      formatNumber(value){
          return value === 0 || !value? '-': value;
      },
  },

  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.sales-performance {
  background: #fff;

  .header {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 23px;
    color: rgba(20, 30, 40, 1);
    padding-left: 26px;
    padding-top: 16px;
    padding-bottom: 10px;
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
      font-weight: normal;
      font-size: 14px;
    }
  }

  .title__name {
    padding-left: 26px;
    height: 23px;
    font-size: 17px;
    font-weight: 500;
    line-height: 23px;
    color: rgba(102, 102, 102, 1);
  }

  .title--status {
    padding-bottom: 16px;
  }

  .sales,
  .pick-car {
    height: 76px;
    padding-top: 14px;
    padding-bottom: 10px;
    padding-left: 20px;
    padding-right: 22px;
  }

  .sales__title,
  .pick-car__title {
    font-size: 16px;
    padding-bottom: 14px;
    height:16px;
    font-weight:bold;
    line-height:28px;
    color:rgba(39,129,219,1);
  }
  .sales__filed,
  .pick-car__filed {
    height: 20px;
    font-size: 13px;
    font-weight: 400;
    height: 20px;
    color: rgba(153, 153, 153, 1);
    padding-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title--stock,
  .title--sales {
    padding: 16px 0;
  }

  .stock {

    display: flex;
    padding-left: 18px;
    padding-right: 10px;
    justify-content: space-between;
    height: 50px;
    font-size: 13px;
    font-weight: 400;
    color:#999;
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
  }
  .grid__col {
    position: relative;
    width: 50%;

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
  .marker{
    padding: 0 15px 5px 26px;
    color: #999;
  }

  .gutter {
    height: 10px;
    background: rgba(247, 247, 247, 1);
  }

  .stock__left{
    height:50px;
    font-size:16px;
    font-weight:bold;
    line-height:50px;
    color:rgba(39,129,219,1);
  }
  .stock__right{
    height:50px;
    font-size:16px;
    font-weight:400;
    line-height:50px;
    color:rgba(0,0,0,1);
  }

  .sales__filed__value,
  .pick-car__filed__value{
    height:19px;
    font-size:13px;
    font-weight:400;
    line-height:19px;
    color:rgba(0,0,0,1);
  }
}
</style>


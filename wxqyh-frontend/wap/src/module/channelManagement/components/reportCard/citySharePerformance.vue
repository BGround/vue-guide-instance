<template>
  <div class="city-share-performance">
    <img class="pic" :src="imageCityShare" alt="">
    <h3 class="header">市占率表现-自身表现</h3>
    <p class="subtitle" v-if="reportMonth">数据：{{CalculatePrevMonth(1).year}}年{{CalculatePrevMonth(1).month}}月市占率</p>

    <div class="grid ml-18 mr-18">
      <div class="grid__row column-2">
        <div class="grid__col city-share">
          <div class="cell">
            <div class="label">
              所在城市市占率
            </div>
            <div class="value mt5">{{getMarket.cityPercent | round | addPercentSymbol}}</div>
            <div class="">
              <span>同比</span><span class="text—red">{{getMarket.yearOnYear  | round | addPercentSymbol}}</span>
              <span>环比</span><span class="text—red">{{getMarket.monthOnMonth  | round | addPercentSymbol}}</span>
            </div>
          </div>
        </div>

        <div class="grid__col compare">
          <div class="cell ">
            <div class="label">趋势对比</div>
            <div class="compare__info">
              <p><span>比全国</span><span class="text—red">{{getMarket.country  | round | addPercentSymbol}}</span></p>
              <p><span>比全省</span><span class="text—red">{{getMarket.province  | round | addPercentSymbol}}</span></p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid__row column-2">
        <div class="grid__col country-share">
          <div class="cell">
            <div class="label">全国市占率</div>
            <div class="value mt5">{{getMarket.countryPercent  | round | addPercentSymbol}}</div>
          </div>
        </div>

        <div class="grid__col province-share">
          <div class="cell">
            <div class="label">全省市占率</div>
            <div class="value mt5">{{getMarket.provincePercent  | round | addPercentSymbol}}</div>
          </div>
        </div>
      </div>
    </div>


    <h4 class="title ml-18">
      【近三月市占率】
    </h4>

    <div class="grid  ml-18 mr-18 month3">
      <div class="grid__row column-3">
          <div class="grid__col mr10">
              <div class="label">{{CalculatePrevMonth(2).year}}年{{CalculatePrevMonth(2).month}}月</div>
              <div class="value">{{getPerformance.month1  | round | addPercentSymbol}}</div>
          </div>
          <div class="grid__col mr10">
            <div class="label">{{CalculatePrevMonth(3).year}}年{{CalculatePrevMonth(3).month}}月</div>
            <div class="value">{{getPerformance.month2  | round | addPercentSymbol}}</div>
          </div>
          <div class="grid__col">
            <div class="label">{{CalculatePrevMonth(4).year}}年{{CalculatePrevMonth(4).month}}月</div>
            <div class="value">{{getPerformance.month3  | round | addPercentSymbol}}</div>
          </div>
      </div>
    </div>

    <h4 class="title ml-18">
      【历史年度市占率】
    </h4>

    <div class="grid  ml-18 mr-18 month3">
      <div class="grid__row column-3">
        <div class="grid__col mr10">
          <div class="label">{{getYear-1}}年</div>
          <div class="value">{{getMarket.year1   | round | addPercentSymbol}}</div>
        </div>
        <div class="grid__col mr10">
          <div class="label">{{getYear-2}}年</div>
          <div class="value">{{getMarket.year2   | round | addPercentSymbol}}</div>
        </div>
        <div class="grid__col">
          <div class="label">{{getYear-3}}年</div>
          <div class="value">{{getMarket.year3   | round | addPercentSymbol}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

    import imageCityShare from '../../static/images/img_cityshare.png'
    import dayjs from 'dayjs'
    export default {
        name: "citySharePerformance",
        components: {},
        data() {
            return {
                imageCityShare,
                reportMonth: null
            }
        },

        props: {
            performance: {
                type: Object,
                default(){
                    return {}
                }
            },
            salesReport:{
                type: Object,
                default(){
                    return {}
                }
            }
        },
        filters:{
            formatNumber(value){
                return value === 0 || value? value: '-';
            },
            addPercentSymbol(value){
                return (!!value || value === 0) ? `${value}%`: '-'
            },
            round(number) {
                if(!!number || number === 0){
                    const precision = 2;
                    const roundNumber = Math.round(+number + 'e' + precision) / Math.pow(10, precision);
                    return Number(roundNumber).toFixed(2);
                }else{
                    return number;
                }

                //same as:
                //return Number(Math.round(+number + 'e' + precision) + 'e-' + precision);
            }
        },
        computed:{
            getPerformance(){
                return this.performance;
            },

            getMonth(){
               return this.salesReport.month || '';
            },

            getYear(){
                return this.salesReport.year || '';
            },

            getMarket(){
                return this.getPerformance.marketPO || {};
            },

            getPrevMonth() {
                if (this.salesReport && this.salesReport.year) {
                    if(this.salesReport.month > 1){
                        return  `${parseInt(this.salesReport.year)}-${parseInt(this.salesReport.month) -1}`
                    }else {
                        return `${parseInt(this.salesReport.year) - 1}-12`
                    }
                } else{
                    return ''
                }
            },
        },
        methods: {
            /**
             * 计算前N个月
             * @param n
             * @return {{month: string, year: string}|{month: number, year: number}}
             */
            CalculatePrevMonth(n){
                if(!this.reportMonth){
                    return {
                        year: '',
                        month: ''
                    };
                };
                const d = dayjs(this.reportMonth).subtract(n, 'month');
                console.log(d.format('YYYY'), n)
                return {
                    year: d.format('YYYY'),
                    month: d.format('MM')
                }
            },

            initReportMonth(salesReport){
                const {month, year} = salesReport;
                if(month && year){
                    this.reportMonth = new Date(`${year}/${month}/01`)
                    console.log(this.reportMonth.toDateString())
                }
            }

        },
        watch:{
            salesReport:{
                deep: true,
                handler(salesReport){
                    this.initReportMonth(salesReport);
                }
            }
        },
        created() {
          this.initReportMonth(this.salesReport)

        }
    }
</script>

<style scoped lang="scss">
  .city-share-performance{
    background: #fff;
    position: relative;
    padding-bottom: 7px;
    .pic{
      position: absolute;
      top: 0;
      right: 0;
      width: 60px;
      height: 60px;
      margin-top: 6px;
      margin-right: 24px;
    }

    .ml-18{
      margin-left: 18px;
    }

    .mr-18{
      margin-right:18px ;
    }

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
        background-color: #c6001f;
        top: 21px;
        left: 18px;
      }
      &>span{
        font-weight: normal;
        font-size: 14px;
      }
    }

    .subtitle{
      height:19px;
      font-size:13px;
      font-weight:600;
      line-height:19px;
      color:rgba(102,102,102,1);
      margin-left: 26px;
      padding-bottom: 10px;
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

    .grid__col{
      height:82px;
      background:rgba(250,250,250,1);
      flex-grow: 1;
      flex-shrink: 0;
      box-sizing: border-box;
    }

    .column-2{
      .grid__col{
        width: 50%;
      }
    }

    .grid__row{
      display: flex;
    }

    .city-share{
      margin-right: 10px;
      margin-bottom: 10px;
      padding-top: 10px;
      padding-left: 15px;
    }
    .country-share{
      margin-right: 10px;
      padding-left: 15px;
      padding-top: 15px;
    }
    .compare{
      margin-bottom: 10px;
      padding-top: 10px;
      padding-left: 15px;
    }
    .province-share{
      padding-left: 15px;
      padding-top: 15px;
    }

    .label{
      height:19px;
      font-size:13px;
      font-weight:400;
      line-height:19px;
      color:rgba(102,102,102,1);
    }
    .value{
      height:28px;
      font-size:20px;
      font-weight:600;
      line-height:28px;
      color:rgba(204,49,73,1);
    }

    .mt5{
      margin-top: 5px;
    }

    .compare__info{
      font-size: 12px;
      margin-top: 13px;
    }

    .text—red{
      color: #C6001F;
      padding-left: 5px;
    }

    .title{
      margin-top: 10px;
      margin-bottom: 5px;
      height:24px;
      font-size:17px;
      font-weight:600;
      line-height:24px;
      color:rgba(0,0,0,1);
    }
    .mr10{
      margin-right: 10px;
    }

    .month3{
      .grid__col{
        padding-top: 15px;
        padding-left: 15px;
      }
    }
  }
</style>

<template>
  <div>
      <div class="subTit">
        <p> · 自身表现</p>
      </div>
      <div class="marketRateInfo">
        <div class="tableWrap">
          <table>
            <tr>
              <th class="table-head borderR">{{salesreportMarket.year?salesreportMarket.year-3:''}}</th>
              <th class="table-head borderR">{{salesreportMarket.year?salesreportMarket.year-2:''}}</th>
              <th class="table-head borderR">{{salesreportMarket.year?salesreportMarket.year-1:''}}</th>
              <th class="table-head borderR" colspan="3">近三月市占率</th>
              <th class="table-head borderR" colspan="8">{{getPastMonth(1)}}</th>
            </tr>
            <tr class="graybg">
              <th class="borderR">年度</th>
              <th class="borderR">年度</th>
              <th class="borderR">年度</th>

              <th class="borderR">{{getPastMonth(4)}}</th>
              <th class="borderR">{{getPastMonth(3)}}</th>
              <th class="borderR">{{getPastMonth(2)}}</th>

              <th class="borderR">所在城市市占率</th>
              <th class="borderR">全国市占率</th>
              <th class="borderR">全省市占率</th>
              <th class="borderR">比全国</th>
              <th class="borderR">比全省</th>
              <th class="borderR">全省排名</th>
              <th class="borderR">同比</th>
              <th >环比</th>
            </tr>
            <tr class="white">
              <!-- 前三年 -->
              <td class="borderR">{{salesreportMarket.year3 | round | addPercentSymbol}}</td>
              <td class="borderR">{{salesreportMarket.year2 | round | addPercentSymbol }}</td>
              <td class="borderR">{{salesreportMarket.year1 | round | addPercentSymbol }}</td>
              <!-- 近三月市占率 -->
              <td class="borderR">{{salesreport.month3 | round | addPercentSymbol }}</td>
              <td class="borderR">{{salesreport.month2 | round | addPercentSymbol }}</td>
              <td class="borderR">{{salesreport.month1 | round | addPercentSymbol }}</td>
              <!-- 当前月 -->
              <td class="borderR">{{salesreportMarket.cityPercent | round | addPercentSymbol }}</td>
              <td class="borderR">{{salesreportMarket.countryPercent | round | addPercentSymbol}}</td>
              <td class="borderR">{{salesreportMarket.provincePercent | round | addPercentSymbol}}</td>
              <td class="borderR">{{salesreportMarket.country | round | addPercentSymbol}}</td>
              <td class="borderR">{{salesreportMarket.province | round | addPercentSymbol}}</td>
              <td class="borderR">{{salesreportMarket.provinceSort?`${salesreportMarket.provinceSort}`: '-'}}</td>
              <td class="borderR">{{salesreportMarket.yearOnYear | round | addPercentSymbol}}</td>
              <td>{{salesreportMarket.monthOnMonth | round | addPercentSymbol}}</td>
            </tr>
          </table>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  name:"",
  props:{
    salesreportMarket:{
      type: Object,
      default: {}
    },
    salesreport:{
      type: Object,
      default: {}
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
  methods:{
    getPastMonth(pastTime){
      const year = this.salesreportMarket.year
      const month = this.salesreportMarket.month
      if(year && month){
        const d = new Date(year, (month-pastTime)); //
        return `${d.getFullYear()}年${d.getMonth()+1}月`
      }else{
        return ''
      }
    }
  }
}
</script>
<style lang="less">

</style>

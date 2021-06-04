<template>
  <div>
    <div class="subTit">
      <p> · 所在城市自主市占率表现</p>
    </div>
    <div class="specialNumWrap">
      <ul>
        <li>
          <div class="specialNum"><span class="rank">NO.</span><span>{{salesreportMarket.provinceSort}}</span></div>
          <p>全省排名</p>
        </li>
        <li>
          <div class="specialNum"><span>{{salesreportMarket.cityPercent | round | addPercentSymbol}}</span></div>
          <p>所在城市市占率</p>
        </li>
        <li>
          <div class="specialNum"><span>{{salesreportMarket.provincePercent | round | addPercentSymbol}}</span></div>
          <p>全省市占率</p>
        </li>
        <li>
          <div class="specialNum"><span>{{salesreportMarket.countryPercent | round | addPercentSymbol}}</span></div>
          <p>全国市占率</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name:"",
  components:{

  },
  props:{
    salesreportMarket : {
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
}
</script>
<style lang="less">

</style>

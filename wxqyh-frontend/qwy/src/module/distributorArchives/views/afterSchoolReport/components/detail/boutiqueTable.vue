<template>
  <table>
    <tr>
      <th>类别</th>
      <th>{{columns.length>0?columns[0].year:''}}年{{columns.length>0?columns[0].quarter:''}}季度目标</th>
      <th>{{columns.length>0?columns[0].year:''}}年{{columns.length>0?columns[0].quarter:''}}季度实际</th>
      <th>完成率</th>
      <th>{{columns.length>0?columns[0].year-1:''}}年{{columns.length>0?columns[0].quarter:''}}季度实际</th>
      <th>订购同比</th>
      <th>{{columns.length>0?(columns[0].quarter > 1 ? columns[0].year:columns[0].year-1):''}}年{{columns.length>0?(columns[0].quarter > 1 ? columns[0].quarter-1 : 4 ):''}}季度实际</th>
      <th>订购环比</th>
    </tr>
    <tr v-for="(item,index) in columns"
      :key="index">
      <td>{{item.serviceType}}</td>
      <td>{{item.goal }}</td>
      <td>{{item.reality }}</td>
      <td>{{item.finishingRate === '-'?'-': `${item.finishingRate}%`}}</td>
      <td>{{item.realityLastYear }}</td>
      <td>{{item.synchronizationBuy}}</td>
      <td>{{item.realityQuarterPre }}</td>
      <td>{{item.orderRatio}}</td>
    </tr>
    <tr v-if="columns && columns.length===0">
      <td colspan="8">暂无数据</td>
    </tr>
  </table>
</template>

<script>
export default {
    filters:{
        round(number) {
            if(number === '-'){
                return number;
            }
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
  data() {
    return {}
  },
  props: {
    columns: {
      type: Array
    }
  }
}
</script>

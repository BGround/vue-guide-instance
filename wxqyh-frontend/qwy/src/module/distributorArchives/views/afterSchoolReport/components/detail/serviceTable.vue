<template>
  <table>
    <tr>
      <th>服务ERP</th>
      <th>服务站简称</th>
      <th>性质</th>
      <th>月均进站台次</th
      <th>服务综合业绩奖励金额</th>
      <th>运营系数1.0奖励金额</th>
      <th>运营奖励评价</th>
    </tr>
    <tr>
      <td>{{columns.serviceErp}}</td>
      <td>{{columns.serviceFullName}}</td>
      <td>{{columns.property}}</td>
      <td>{{columns.intoPlatformCount}}</td>
      <td>{{columns.operatingAward | round}}</td>
      <td>{{columns.awardMoney | round}}</td>
      <td>{{columns.evaluateAward}}</td>
    </tr>
  </table>
</template>

<script>
  export default {
      filters:{
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
      data (){
          return {}
      },
      props:{
          columns:{
              type: Object
          }
      }
  }
</script>

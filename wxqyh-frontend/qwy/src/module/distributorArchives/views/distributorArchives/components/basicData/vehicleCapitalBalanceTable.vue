<template>
  <table>
    <tr>
      <th>截止日期</th>
      <th>金融当前可用额度(万元)</th>
      <th>三方银票资金余额(万元)</th>
      <th>保证金余额(万元)</th>
      <th>返利池余额(万元)</th>
      <th>自有资金(万元)</th>
    </tr>
    <tr v-if="columns && columns.updateTime">
      <td>{{columns.updateTime || '-'}}</td>
      <td>{{columns.carFinancialCurAvailability || '0'}}</td>
      <td>{{columns.carThreeWaySilver || '0'}}</td>
      <td>{{columns.carMarginBalance || '0'}}</td>
      <td>{{columns.carRebatePoolBalance || '0'}}</td>
      <td>{{columns.carOwnFunds || '0'}}</td>
    </tr>
    <tr v-else><td colspan="6">暂无数据</td></tr>
  </table>
</template>

<script>
  export default {
      data () {
          return {}
      },
      props:{
          columns:{
              type:Object
          }
      }
  }
</script>

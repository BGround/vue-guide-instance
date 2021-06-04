<template>
  <table>
    <tr>
      <th>清算汇总交财务</th>
      <th>清算汇总交法务</th>
      <th>清算汇总交会计核算</th>
      <th>资料寄出</th>
      <th>资料寄回</th>
      <th>汇款时间</th>
      <th>汇款金额</th>
    </tr>
    <tr v-if="columns && (columns.liquidationFinanceTime || columns.liquidationLegalTime || columns.liquidationAccountantTime || columns.businessDataSendTime || columns.dataSendBackTime || columns.remittanceTime || columns.remittanceMoney)">
      <td>{{columns.liquidationFinanceTime}}</td>
      <td>{{columns.liquidationLegalTime}}</td>
      <td>{{columns.liquidationAccountantTime}}</td>
      <td>{{columns.businessDataSendTime}}</td>
      <td>{{columns.dataSendBackTime}}</td>
      <td>{{columns.remittanceTime}}</td>
      <td>{{columns.remittanceMoney}}</td>
    </tr>
    <tr v-else>
      <td colspan="7">暂无数据</td>
    </tr>
  </table>
</template>

<script>
  export default {
      data () {
          return {}
      },
      props:{
          columns:{
              type: Object
          }
      }
  }
</script>

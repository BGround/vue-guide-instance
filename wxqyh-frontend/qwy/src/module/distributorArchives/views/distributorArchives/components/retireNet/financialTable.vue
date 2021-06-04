<template>
  <table>
    <tr>
      <th>截止时间</th>
      <th>贷款账户</th>
      <th>保证金账户</th>
      <th>返利账户</th>
      <th>备件账户</th>
      <th>合计</th>
      <th>清算扣款</th>
      <th>清算后余额</th>
      <th>清算扣款(含扣款)</th>
      <th>清算后余额(含金融)</th>
    </tr>
    <tr v-if="columns && (columns.caiwuStopTime  || columns.caiwuLoansUser || columns.caiwuCashUser || columns.caiwuRebateUser || columns.caiwuPartUser)">
      <td>{{columns.caiwuStopTime}}</td>
      <td>{{columns.caiwuLoansUser}}</td>
      <td>{{columns.caiwuCashUser }}</td>
      <td>{{columns.caiwuRebateUser  }}</td>
      <td>{{columns.caiwuPartUser}}</td>
      <td>{{columns.caiwuTotal}}</td>
      <td>{{columns.caiwuDeduction}}</td>
      <td>{{columns.caiwuDeductionAfter}}</td>
      <td>{{columns.caiwuBalance   }}</td>
      <td>{{columns.caiwuBalanceAfter  }}</td>
    </tr>
    <tr v-else><td colspan="10">暂无数据</td></tr>
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

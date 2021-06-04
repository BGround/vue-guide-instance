<template>
  <table>
    <tr>
      <th>保证金扣款</th>
      <th>到期时间</th>
      <th>清算单交财务</th>
      <th>资料寄出</th>
      <th>汇款时间</th>
    </tr>
    <tr v-if="columns && (columns.depositMoney || columns.expireTime || columns.submitFinanceTime || columns.depositDataSendTime || columns.depositRemittanceTime)">
      <td>{{columns.depositMoney}}</td>
      <td>{{columns.expireTime}}</td>
      <td>{{columns.submitFinanceTime}}</td>
      <td>{{columns.depositDataSendTime}}</td>
      <td>{{columns.depositRemittanceTime}}</td>
    </tr>
    <tr v-else>
      <td colspan="5">暂无数据</td>
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

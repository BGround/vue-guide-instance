<template>
  <table>
    <tr>
      <th>金融贷款</th>
      <th>三方银票</th>
      <th>自有资金（现汇+三方银票）</th>
    </tr>
    <tr v-if="columns.cumFinancialLoans || columns.cumThreeWaySilverTicket || columns.cumOwnFunds">
      <td>{{columns.cumFinancialLoans}}</td>
      <td>{{columns.cumThreeWaySilverTicket}}</td>
      <td>{{columns.cumOwnFunds}}</td>
    </tr>
    <tr v-else><td colspan="3">暂无数据</td></tr>
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

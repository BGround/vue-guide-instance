<template>
  <table>
    <tr>
      <th>截止日期</th>
      <th>备件余额(万元)</th>
<!--      <th>授信当前可用额度(万元)</th>-->
<!--      <th>保证金余额(万元)</th>-->
<!--      <th>返利池余额(万元)</th>-->
<!--      <th>自有资金(万元)</th>-->
    </tr>
    <tr v-if="columns && columns.updateTime">
      <td>{{columns.updateTime || '-'}}</td>
      <td>{{columns.spareBalance || '0'}}</td>
<!--      <td>{{columns.spareCreditCurAvailable}}</td>-->
<!--      <td>{{columns.spareMarginBalance}}</td>-->
<!--      <td>{{columns.spareRebatePoolBalance}}</td>-->
<!--      <td>{{columns.spareOwnFunds}}</td>-->
    </tr>
    <tr v-else><td colspan="5">暂无数据</td></tr>
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

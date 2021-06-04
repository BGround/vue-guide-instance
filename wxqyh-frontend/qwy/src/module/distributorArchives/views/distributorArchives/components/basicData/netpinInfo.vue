<template>
  <table class="netPTable">
    <tr>
      <th rowspan="2" class="borderR">平台名称</th>
      <th rowspan="2" class="borderR">年份</th>
      <th rowspan="2" class="borderR">月份</th>
      <th colspan="2" class="borderR borderB">费用</th>
      <th colspan="3" class="borderR borderB">日常维护(过程指标)</th>
      <th colspan="4" class="borderB">兑现费用(返利兑现)</th>
    </tr>
    <tr>
      <th class="borderR">总费用</th>
      <th class="borderR">支持额度</th>
      <th class="borderR">平台维护得分(均值)</th>
      <th class="borderR">CRM首次24h跟进率</th>
      <th class="borderR">网销成交率</th>
      <th class="borderR">一季度兑现</th>
      <th class="borderR">二季度兑现</th>
      <th class="borderR">三季度兑现</th>
      <th>四季度兑现</th>
<!--      <th>合计</th>-->
    </tr>
    <tr v-for="(item,index) in columns" :key="index">
      <td>{{item.platformName}}</td>
      <td>{{item.platformYaer}}</td>
      <td>{{item.platformMonth}}</td>
      <td>{{item.totalMoney}}</td>
      <td>{{item.keepMoney}}</td>
      <!--      <td>{{item.processIndicators}}</td>-->
      <td>{{item.platformMaintenanceScore}}</td>
      <td>{{item.crmFollowUpRate}}</td>
      <td>{{item.netSalesTurnoverRate}}</td>
      <td>{{item.quarterFirst}}</td>
      <td>{{item.quarterSecond}}</td>
      <td>{{item.quarterThird}}</td>
      <td>{{item.quarterFourth}}</td>
<!--      <td>{{item.costMoney}}</td>-->
    </tr>
    <tr v-if="columns && columns.length===0"><td colspan="10">暂无数据</td></tr>
  </table>
</template>
<script>
export default {
    data(){
        return {}
    },
    props:{
        columns:{
            type:Array
        }
    },
    filters:{
        filterDate(val){
            let txt = '-'
            if(val) {
                txt = val.substr(0,10)
            }
            return txt
        }
    }
}
</script>

<template>
  <table>
    <tr>
      <th>建店级别</th>
      <th>店面性质</th>
      <th>奖励标准</th>
      <th>开始时间</th>
      <th>转正时间</th>
      <th>应关闭时间</th>
      <th>实际关闭时间</th>
      <th>应兑现(万)</th>
      <th>已兑现(万)</th>
      <th>首兑金额(万)</th>
      <th>提车折让金额(万)</th>
      <th>余额(万)</th>
      <th>核算方式</th>
      <th>备注</th>
    </tr>
    <tr v-for="(item,index) in columns" :key="index">
      <td>{{item.storeBuildingLevel || '-'}}</td>
      <td>{{item.shopNature || '-'}}</td>
      <td>{{item.rewardCriteria || '-'}}</td>
      <td>{{item.startTime || '-'}}</td>
      <td>{{item.positiveTime || '-'}}</td>
      <td>{{item.shouldEndTime || '-'}}</td>
      <td>{{item.actualEndTime || '-'}}</td>
      <td>{{item.shouldCash || '-'}}</td>
      <td>{{item.actualCash || '-'}}</td>
      <td>{{item.firstExchangeAmount || '-'}}</td>
      <td>{{item.carCollectionAllowance || '-'}}</td>
      <td>{{item.balance || '-'}}</td>
      <td>{{item.accountWay || '-'}}</td>
      <td>{{item.mark || '-'}}</td>
    </tr>
    <tr v-if="columns && columns.length===0"><td :colspan="14">暂无数据</td></tr>
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
      }
  }
</script>

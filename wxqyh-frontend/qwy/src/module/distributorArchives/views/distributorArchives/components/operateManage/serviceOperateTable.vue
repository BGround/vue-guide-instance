<template>
  <table>
    <tr>
      <th>评估周期</th>
      <th>运营得分</th>
      <th>运营分级</th>
      <th>月均台次</th>
<!--      <th>月均备件</th>-->
      <th>服务满意度</th>
      <th>一次修复率</th>
      <th>抱怨率</th>
      <th>客户保持率</th>
      <th>客单价</th>
      <th>奖励额度</th>
    </tr>
    <tr v-for="(item,index) in columns"
        :key="index">
      <td>{{item.year}}年第{{item.quarter | filterQuarter}}季度</td>
      <td>{{item.score}}</td>
      <td>{{item.operateLevel}}</td>
      <td>{{item.monthQty}}</td>
<!--      <td>87</td>-->
      <td>{{item.satisfaction}}</td>
      <td>{{item.repairRate}}</td>
      <td>{{item.grumbleRate}}</td>
      <td>{{item.customerHoldRate}}</td>
      <td>{{item.customerPrice}}</td>
      <td>{{item.awardAmount}}</td>
    </tr>
    <tr v-if="columns && columns.length===0">
      <td colspan="10">暂无数据</td>
    </tr>
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
          filterQuarter(val){
              let txt = '-'
              switch (val) {
                  case '1':
                      txt = '一'
                      break;
                  case '2':
                      txt = '二'
                      break;
                  case '3':
                      txt = '三'
                      break
                  case '4':
                      txt = '四'
                      break
              }
              return txt
          }
      }
  }
</script>

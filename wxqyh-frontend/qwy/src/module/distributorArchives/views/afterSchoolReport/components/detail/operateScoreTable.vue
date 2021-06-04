<template>
  <table>
    <tr>
      <th>指标</th>
      <th>得分</th>
      <th>服务站分级</th>
      <th>业务联系人</th>
    </tr>
    <tr v-for="(item,index) in columns" :key="index">
      <td>{{item.indicatorName}}</td>
      <td>{{item.score}}</td>
      <td>{{item.evaluate}}</td>
      <td>{{item.servicePerson}}</td>
    </tr>
    <tr v-if="columns && columns.length===0"><td colspan="4">暂无数据</td></tr>
  </table>
</template>

<script>
  export default {
      data (){
          return {}
      },
      props:{
          columns:{
              type: Array
          }
      }
  }
</script>

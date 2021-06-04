<template>
  <table>
    <tr>
      <th>序号</th>
      <th>短板指标</th>
      <th>整改计划</th>
      <th>完成时间</th>
      <th>下阶段目标</th>
    </tr>
    <tr v-for="(item,index) in columns" :key="index">
      <td>{{index+1}}</td>
      <td>{{item.shortBoard || '-'}}</td>
      <td>{{item.rectificationContents || '-'}}</td>
      <td>{{item.planFinishedTime | formatDate}}</td>
      <td>{{item.nextObjective ||'-'}}</td>
    </tr>
    <tr v-if="columns && columns.length===0">
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
              type: Array
          }
      },
      filters:{
        formatDate(value){
          if(value){
            return value.substring(0,10);
          }else{
            return '-'
          }
        }
      }
  }
</script>

<template>
  <table>
    <tr>
      <th>培训类型</th>
      <th>培训班名称</th>
      <th>岗位名称</th>
      <th>参训人员</th>
      <th>合格情况</th>
    </tr>
    <tr v-for="(item,index) in columns"
        :key="index">
      <td>{{item.trainingType}}</td>
      <td>{{item.trainingClassName}}</td>
      <td>{{item.postName}}</td>
      <td>{{item.trainingUser}}</td>
      <td>{{item.qualifiedSituation}}</td>
    </tr>
    <tr v-if="columns && columns.length===0"><td colspan="5">暂无数据</td></tr>
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
      }
  }
</script>

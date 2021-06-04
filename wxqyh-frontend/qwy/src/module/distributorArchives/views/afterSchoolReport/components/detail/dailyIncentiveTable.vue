<template>
  <table>
    <tr>
      <th>服务ERP</th>
      <th>通报名称</th>
      <th>类别</th>
      <th>金额</th>
      <th>通报编号</th>
      <th>生效时间</th>
      <th>通报联系人</th>
    </tr>
    <tr v-for="(item,index) in columns" :key="index">
      <td>{{item.serviceErp}}</td>
      <td>{{item.reportName}}</td>
      <td>{{item.type}}</td>
      <td>{{item.money}}</td>
      <td>{{item.reportNo}}</td>
      <td>{{item.effectiveDate | formatDate}}</td>
      <td>{{item.reportPerson}}</td>
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

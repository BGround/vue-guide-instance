<template>
  <table>
    <tr>
      <th>产品培训</th>
      <th>等级认证</th>
      <th>岗位培训</th>
      <th>关键岗位</th>
      <th>业务岗位</th>
      <th>专项培训</th>
      <th>认证岗位</th>
      <th>小计</th>
    </tr>
    <tr v-if="columns && (columns.chanpin || columns.dengji || columns.gangwei || columns.guanjian || columns.yewu || columns.zhuanxiang || columns.totalNum)">
      <td>{{columns.chanpin}}</td>
      <td>{{columns.dengji}}</td>
      <td>{{columns.gangwei}}</td>
      <td>{{columns.guanjian}}</td>
      <td>{{columns.yewu}}</td>
      <td>{{columns.zhuanxiang}}</td>
      <td>{{columns.renzheng}}</td>
      <td>{{columns.totalNum}}</td>
    </tr>
    <tr v-else><td colspan="8">暂无数据</td></tr>
  </table>
</template>

<script>
  export default {
      data(){
          return {}
      },
      props:{
          columns:{
              type:Object
          }
      }
  }
</script>

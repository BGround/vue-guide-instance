<template>
  <table>
    <tr>
      <th></th>
      <th>股东(名称)</th>
      <th>股东性质</th>
      <th>经营年限</th>
      <th>投入金额(万元)</th>
      <th>所占比例(%)</th>
    </tr>
    <tr v-for="(item,index) in columns"
        :key="index">
      <td>{{item.type}}</td>
      <td>{{item.name}}</td>
      <td>{{item.nature}}</td>
      <td>{{item.business}}</td>
      <td>{{item.money}}</td>
      <td>{{item.proportion}}</td>
    </tr>
    <tr v-if="columns && columns.length>0">
      <td>合计</td>
      <td colspan="3"></td>
      <td>{{gdgbTotal}}</td>
      <td></td>
    </tr>
    <tr v-if="columns && columns.length===0">
      <td colspan="6">暂无数据</td>
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
          },
          gdgbTotal:{
              type: Number
          }
      }
  }
</script>

<template>
  <table>
    <tr>
      <th width="10%">年度</th>
      <th width="10%">ERP号</th>
      <th width="15%">经销商名字</th>
      <th width="10%">奖项名称</th>
      <th width="20%">奖励内容</th>
      <th width="10%">受表彰人姓名</th>
      <th width="25%">身份证号</th>
    </tr>
    <tr v-for="(item,index) in columns" :key="index">
      <td>{{item.year || '-'}}年</td>
      <td>{{item.erpCarNo || '-'}}</td>
      <td>{{item.dealerName || '-'}}</td>
      <td>{{item.awardsName || '-'}}</td>
      <td>{{item.content || '-'}}</td>
      <td>{{item.name || '-'}}</td>
      <td>{{item.cardNo || '-'}}</td>
    </tr>
    <tr v-if="columns && columns.length===0"><td colspan="7">暂无数据</td></tr>
  </table>
</template>

<script>
    export default {
        data(){
            return{}
        },
        props:{
            columns:{
                type: Array
            }
        }
    }
</script>

<template>
  <table>
    <tr>
      <th width="5%">ERP</th>
      <th width="7%">经销商简称</th>
      <th width="6%">省份</th>
      <th width="6%">城市</th>
      <th width="6%">区/县</th>
      <th width="7%">直营店代码</th>
      <th width="8%">直营店名称</th>
      <th width="7%">店面级别</th>
      <th width="8%">地址</th>
      <th width="7%">入网时间</th>
      <th width="7%">运营年限</th>
      <th width="5%">形象</th>
      <th width="7%">公司名称</th>
      <th width="5%">兑现金额</th>
    </tr>
    <tr v-for="(item,index) in columns" :key="index">
      <td>{{item.erpCarNo}}</td>
      <td>{{item.dealerShortName}}</td>
      <td>{{item.provinceName}}</td>
      <td>{{item.shopCity}}</td>
      <td>{{item.shopArea || '-'}}</td>
      <td>{{item.shopCode}}</td>
      <td>{{item.shopName}}</td>
      <td>{{item.shopLevel}}</td>
      <td>{{item.address || '-'}}</td>
      <td>{{item.openTime}}</td>
      <td>{{item.operatingLifeOf}}</td>
      <td>{{item.visuailze || '-'}}</td>
      <td>{{item.companyName || '-'}}</td>
      <td>{{item.cashAmount || '-'}}</td>
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

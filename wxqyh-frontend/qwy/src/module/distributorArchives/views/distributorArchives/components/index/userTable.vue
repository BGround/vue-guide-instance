<template>
  <table>
    <tr>
      <th>ERP号</th>
      <th>经销商简称</th>
      <th>董事长</th>
      <th>总经理</th>
      <th>销售总监</th>
      <th>服务总监</th>
    </tr>
    <tr v-for="(item,index) in columns" :key="index">
      <td>{{item.erpCarNo}}</td>
<!--      <td><a href="javascript:;" @click="goDistrDes(item)">{{item.dealerShortName}}</a></td>-->
      <td><p class="ellipsis">{{item.dealerShortName}}</p></td>
      <td>{{item.chairmanName | filterEmpty}}</td>
      <td>{{item.managerName | filterEmpty}}</td>
      <td>{{item.salesName | filterEmpty}}</td>
      <td>{{item.serviceName | filterEmpty}}</td>
    </tr>
    <tr v-if="columns && columns.length===0"><td colspan="6">暂无数据</td></tr>
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
      methods:{
          // 跳转到详情
          goDistrDes(item) {
              this.$router.push({ name: 'archivesBag',query:{dealerId:item.id,erpId:item.erpCarNo,province:item.provinceName,city:item.cityName,dealerName:item.dealerShortName} })
          },
      },
      filters:{
          filterEmpty(val){
              let txt = '-'
              if(val) {
                  txt = val
              }
              return txt
          }
      }
  }
</script>

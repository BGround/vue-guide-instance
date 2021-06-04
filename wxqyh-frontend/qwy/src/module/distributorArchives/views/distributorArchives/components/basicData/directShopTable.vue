<template>
  <div class="directShopInfo">
    <table>
      <tr>
        <th width="5%">直营店类别</th>
        <th width="3%">代码</th>
        <th width="3%">城市</th>
        <th width="3%">区/县</th>
        <th width="5%">直营店名称</th>
        <th width="4%">入网时间</th>
        <th width="7%">运营年限(时间跨度)</th>
        <th width="3%">形象</th>
        <th width="4%">公司名称</th>
        <th width="3%">级别</th>
        <th width="5%">运营状态</th>
        <th width="4%">直营店店长</th>
        <th width="5%">手机</th>
        <th width="5%">地址</th>
        <th width="4%">战区人员</th>
        <th width="6%">变更说明</th>
        <th width="5%">服务厂分号</th>
        <th width="5%">服务专员(姓名)</th>
        <th width="5%">服务专员手机号</th>
        <th width="6%">备注</th>
        <!--          <th>店面照片</th>-->
      </tr>
      <tr v-for="(item,index) in columns"
          :key="index">
        <td>{{item.marketSort || '-'}}</td>
        <td>{{item.shopCode || '-'}}</td>
        <td>{{item.shopCity || '-'}}</td>
        <td>{{item.shopArea || '-'}}</td>
        <td>{{item.shopName || '-'}}</td>
        <td>{{item.openTime | filterDate}}</td>
        <td>{{item.operatingLifeOf || '-'}}</td>
        <td>{{item.visuailze || '-'}}</td>
        <td>{{item.companyName || '-'}}</td>
        <td>{{item.shopLevel || '-'}}</td>
        <td>{{item.shopStatus || '-'}}</td>
        <td>{{item.shopManager || '-'}}</td>
        <td>{{item.shopPhone || '-'}}</td>
        <td>{{item.address || '-'}}</td>
        <td>{{item.warUser || '-'}}</td>
        <td>{{item.changeDesc || '-'}}</td>
        <td>{{item.serviceFactorySemicolon || '-'}}</td>
        <td>{{item.nameOfServiceOfficer || '-'}}</td>
        <td>{{item.phoneNumber || '-'}}</td>
        <td>{{item.remark || '-'}}</td>
        <!--          <td>查看</td>-->
      </tr>
      <tr v-if="columns && columns.length===0"><td colspan="20">暂无数据</td></tr>
    </table>
  </div>
</template>

<script>
  export default {
      data() {
          return {}
      },
      props:{
          columns:{
              type: Array
          }
      },
      filters:{
          filterDate(val){
              let txt = '-'
              if(val) {
                  txt = val.substr(0,10)
              }
              return txt
          }
      }
  }
</script>

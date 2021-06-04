<template>
  <table >
    <tr>
      <th width="10%">ERP号</th>
      <th width="25%">经销商简称</th>
      <th width="10%">性质</th>
      <th width="12%">店面性质</th>
      <th width="12%">店面类别</th>
      <th width="15%">店面级别</th>
      <th width="15%">运营状态</th>
    </tr>
    <tr v-for="(item,index) in columns" :key="index">
      <td>{{item.erpCarNo || '-'}}</td>
      <td><a href="javascript:;" class="ellipsis"
             @click="goDistrDes(item)">{{item.dealerShortName || '-'}}</a></td>
      <td>{{item.nature || '-'}}</td>
      <td>{{item.storeProperties || '-'}}</td>
      <td>{{item.storeType || '-'}}</td>
      <td>{{item.storeLevel || '-'}}</td>
      <td>{{item.operatingStateName || '-'}}</td>
    </tr>
    <tr v-if="columns && columns.length===0"><td colspan="7">暂无数据</td></tr>
  </table>
</template>

<script>
    export default {
        data(){
            return {}
        },
        props:{
            columns:{
                type: Array,
                default(){
                    return []
                }
            }
        },
        methods:{
            // 跳转到详情
            goDistrDes(item) {
                this.$router.push({ name: 'archivesBag',query:{dealerId:item.id,erpId:item.erpCarNo,province:item.provinceName,city:item.cityName,dealerName:item.dealerFullName} })
            },
        }
    }
</script>

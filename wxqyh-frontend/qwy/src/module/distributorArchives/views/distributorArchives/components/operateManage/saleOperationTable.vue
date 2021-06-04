<template>
  <table class="sale-operation-table">
    <tr>
      <th>评估周期</th>
      <th>飞行检查</th>
      <th>销售满意度</th>
      <th>销售运营综合得分</th>
      <th>战区内排名 </th>
      <th>销售运营分级</th>
      <th>奖励额度</th>
    </tr>
    <tr v-for="(item,index) in list" :key="index">
      <td>{{getQuarter(item)}}</td>
      <td>{{item.flightInspection || '-'}}</td>
      <td>{{item.salesSatisfaction || '-'}}</td>
      <td>{{item.salesOperationScore || '-'}}</td>
      <td>{{item.ranking || '-'}}</td>
      <td>{{item.salesOperationClassification || '-'}}</td>
      <td>{{item.rewardQuota || '-'}}</td>
    </tr>


    <tr v-if="list && list.length===0">
      <td colspan="7">暂无数据</td>
    </tr>


  </table>
</template>

<script>
    export default {
        name: "saleOperationTable",
        components: {},
        data() {
            return {
                list:[],
            }
        },
        props: {
            data: {
                type: Array,
                default(){
                    return []
                }
            }
        },
        watch:{
            data:{
                deep: true,
                handler(value){
                    this.list = value
                }
            }
        },
        methods: {
            getQuarter({year, quarter}){
                if(year && quarter){
                    const quarterMap = {'1': '第一季度','2': '第二季度','3': '第三季度','4': '第四季度',}
                    return `${year}年${quarterMap[quarter]}`
                }else{
                    return '-'
                }
            }
        },
        created() {

        }
    }
</script>

<style scoped>

</style>

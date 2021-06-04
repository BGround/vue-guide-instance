<template>
  <table class="rewards-table">
    <colgroup width="4%"></colgroup>
    <colgroup width="6%"></colgroup>
    <colgroup width="27%"></colgroup>
    <colgroup width="27%"></colgroup>
    <colgroup width="15%"></colgroup>
    <colgroup width="6%"></colgroup>
    <colgroup width="8%"></colgroup>
    <colgroup width="7%"></colgroup>
    <tr>
      <th class="borderR">序号</th>
      <th class="borderR">类别</th>
      <th class="borderR">事由</th>
      <th class="borderR">文件名称</th>
      <th class="borderR">文件编号</th>
      <th class="borderR">联系人</th>
      <th class="borderR">联系电话</th>
      <th>金额（元）</th>
    </tr>
    <tr v-for="(item,index) in columns" :key="index">
      <td class="borderR">{{index+1}}</td>
      <td class="borderR">{{item.rewardsType || '-'}}</td>
      <td class="borderR">{{item.checkThing || '-'}}</td>
      <td class="borderR">{{item.report || '-'}}</td>
      <td class="borderR">{{item.reportNo || '-'}}</td>
      <td class="borderR">{{item.linkman || '-'}}</td>
      <td class="borderR">{{item.linkmanPhone || '-'}}</td>
      <td>{{item.rewardsAmount || '-'}}</td>
    </tr>
    <tr v-if="columns && columns.length===0"><td colspan="8">暂无数据</td></tr>
  </table>
</template>

<script>
  export default {
      data() {
          return {}
      },
      props:{
          columns:{
              type: Array,
              default(){
                return []
              }
          },
          salesreport:{
            type: Object,
            default(){
              return {}
            }
          }
      },
      computed: {
        getTotal(){
          const total = this.columns.reduce((previousValue, currentValue)=>{
            const current = parseFloat(currentValue.rewardsAmount)
            return previousValue + current;
          }, 0)
          return total.toFixed(2)
        }
      },
  }
</script>

<style lang="scss" scoped>
  .rewards-table{
    margin-top: 10px;
    tr{
      border:1px solid #D5D5D5;
      background: #f7f7f7;
    }
    tr:nth-child(odd){
      background: #fff;
    }
  }
</style>

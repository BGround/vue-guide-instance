<template>
  <table>
    <tr>
      <th>期数</th>
      <th>交流时间</th>
      <th>项目类别</th>
      <th>项目内容</th>
      <th>下一步</th>
      <th>责任部门</th>
      <th>责任人</th>
      <th>计划完成时间</th>
      <th>申请关闭时间</th>
      <th>关闭依据</th>
      <th>实际完成时间</th>
      <th>状态</th>
      <th>进展</th>
    </tr>
    <tr v-for="(item,index) in columns" :key="index">
      <td :class="{borderGreen:item.state==='完成',borderYellow:item.state==='延期',borderTrans:item.state==='进行中',borderRed:item.state==='异常'}">{{item.numberPeriods}}</td>
      <td>{{item.exchangeTime || '-'}}</td>
      <td>{{item.projectCategory || '-'}}</td>
      <td>{{item.projectContent || '-'}}</td>
      <td>{{item.nextContent || '-'}}</td>
      <td>{{item.deptName || '-'}}</td>
      <td>{{item.personLiables || '-'}}</td>
      <td>{{item.planTime || '-'}}</td>
      <td>{{item.closedTime || '-'}}</td>
      <td><a v-if="item.closeEnclosureUrl" :href="curl+item.closeEnclosureUrl" :download="item.fileName">查看</a></td>
      <td>{{item.actualTime || '-'}}</td>
      <td>{{item.state || '-'}}</td>
      <td>{{item.progress || '-'}}</td>
    </tr>
    <tr v-if="columns && columns.length===0">
      <td colspan="13">暂无数据</td>
    </tr>
  </table>
</template>

<script>
  export default {
      data(){
          return {curl:''}
      },
      props:{
          columns:{
              type: Array
          }
      },
      created(){
          let temp = _.compressURL.replace('//compress','')
          this.curl = temp
      }
  }
</script>

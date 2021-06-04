<template>
  <table>
    <tr>
      <th>陈述类型</th>
      <th>交流时间</th>
      <th>交流地点</th>
      <th>交流人员</th>
      <th>异常原因</th>
      <th>背景</th>
<!--      <th>会议决议</th>-->
      <th>结论</th>
      <th>附件</th>
    </tr>
    <tr v-for="(item,index) in columns"
        :key="index">
      <td>{{item.statementType}}</td>
      <td>{{item.exchangeTime2}}</td>
      <td>{{item.exchangeAddress}}</td>
      <td>{{item.exchangeUsers}}</td>
      <td>{{item.abnormalReason}}</td>
      <td>{{item.background}}</td>
<!--      <td><a v-if="item.conferenceResolution" :href="curl+item.conferenceEnclosureUrl" :download="item.conferenceEnclosureName">查看</a></td>-->
      <td>{{item.conclusion}}</td>
      <td><a v-if="item.enclosure" :href="curl+item.enclosureUrl" :download="item.enclosureName">查看</a></td>
    </tr>
    <tr v-if="columns && columns.length===0"><td colspan="8">暂无数据</td></tr>
  </table>
</template>

<script>
  export default {
      data () {
          return {
              curl:''
          }
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

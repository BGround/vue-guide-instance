<template>
  <div class="planTableWrap">
    <div class="planTableInfo">
    <table class="secondNet">
      <tr class="cityRateTit">
        <th colspan="13">开发进度</th>
      </tr>
      <tr class="grayBg">
        <th class="borderR">申请经销商</th>
        <th class="borderR">陈述时间</th>
        <th class="borderR">网络委员会会议决策</th>
        <th class="borderR">入网报告时间</th>
        <th class="borderR">签约状态</th>
        <th class="borderR">保证金缴纳时间</th>
        <th class="borderR">保证金额度(万元)</th>
        <th class="borderR">开通时间</th>
        <th class="borderR">提车时间</th>
        <th class="borderR">临时许可销售服务合同签订</th>
        <th class="borderR">合同签订时间</th>
        <th class="borderR">ERP号</th>
        <th class="borderR">开发人员</th>
      </tr>
<!--      <tr v-if="columns && columns.applyDealerName">-->
<!--        <td>{{columns.applyDealerName}}</td>-->
<!--        <td>{{columns.presentationTime}}</td>-->
<!--        <td>{{columns.meetingDecisions}}</td>-->
<!--        <td>{{columns.netReportTime}}</td>-->
<!--        <td>{{columns.signStatus}}</td>-->
<!--        <td>{{columns.marginPayTime}}</td>-->
<!--        <td>{{columns.marginMoney}}</td>-->
<!--        <td>{{columns.openTime}}</td>-->
<!--        <td>{{columns.carTime}}</td>-->
<!--        <td>{{columns.temporarySignTime}}</td>-->
<!--        <td>{{columns.contractSignTime}}</td>-->
<!--        <td>{{columns.erpCarNo}}</td>-->
<!--        <td>{{columns.devUser}}</td>-->
<!--      </tr>-->
      <tr v-for="(item,index) in columns" :key="index">
        <td>{{item.applyDealerName || '-'}}</td>
        <td>{{item.presentationTime || '-'}}</td>
        <td>{{item.meetingDecisions || '-'}}</td>
        <td>{{item.netReportTime || '-'}}</td>
        <td>{{item.signStatus || '-'}}</td>
        <td>{{item.marginPayTime || '-'}}</td>
        <td>{{item.marginMoney || '-'}}</td>
        <td>{{item.openTime || '-'}}</td>
        <td>{{item.carTime || '-'}}</td>
        <td>{{item.temporarySignTime || '-'}}</td>
        <td>{{item.contractSignTime || '-'}}</td>
        <td>{{item.erpCarNo || '-'}}</td>
        <td>{{item.devUser || '-'}}</td>
      </tr>
      <tr v-if="columns && columns.length===0">
        <td colspan="13">暂无数据</td>
      </tr>
    </table>
    </div>
  </div>
</template>

<script>
  export default {
      data () {
          return {}
      },
      props:{
          columns:{
              type:Array
          }
      }
  }
</script>

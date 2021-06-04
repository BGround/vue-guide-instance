<template>
  <div>
<!--    <div class="table-head">-->
<!--      <table>-->
<!--        <colgroup>-->
<!--          <col v-for="(item,index) in 9" :key="index" style="width: 10%;" />-->
<!--        </colgroup>-->
<!--        <thead>-->
<!--          <tr class="cityRateTit">-->
<!--            <th colspan="10">{{cityName}}规划方案（{{currentYear}}年度）</th>-->
<!--          </tr>-->
<!--          <tr class="grayBg">-->
<!--            <th class="borderR">县市</th>-->
<!--            <th class="borderR">现有二网数量</th>-->
<!--            <th class="borderR">计划建设</th>-->
<!--            <th class="borderR">ERP号</th>-->
<!--            <th class="borderR">建设归属权</th>-->
<!--            <th class="borderR">分类</th>-->
<!--            <th class="borderR">申请级别</th>-->
<!--            <th class="borderR">计划完成时间</th>-->
<!--            <th class="borderR">实际完成时间</th>-->
<!--            <th>建店进度</th>-->
<!--          </tr>-->
<!--        </thead>-->
<!--      </table>-->
<!--    </div>-->
    <div class="table-body">
      <table class="secondNet">
<!--        <colgroup>-->
<!--          <col v-for="(item,index) in 8" :key="index" style="width: 10%;" />-->
<!--        </colgroup>-->
        <thead>
          <tr class="cityRateTit">
            <th colspan="10">{{cityName}}规划方案（{{currentYear}}年度）</th>
          </tr>
          <tr class="grayBg">
            <th class="borderR">县市</th>
            <th class="borderR">现有二网数量</th>
            <th class="borderR">计划建设</th>
            <th class="borderR">ERP号</th>
            <th class="borderR">建设归属权</th>
            <th class="borderR">分类</th>
            <th class="borderR">申请级别</th>
            <th class="borderR">计划完成时间</th>
            <th class="borderR">实际完成时间</th>
            <th>建店进度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in columns"
              :key="index">
            <td>{{item.netArea}}</td>
            <td>{{item.netNumber}}</td>
            <td>{{item.netPlan}}</td>
            <td>{{item.erpCarNo}}</td>
            <td>{{item.constructionBelong}}</td>
            <td>{{item.constructionType}}</td>
            <td>{{item.applyLevel}}</td>
            <td>{{item.planTime}}</td>
            <td>{{item.actualTime || '-'}}</td>
            <td>{{item.constructionStatus}}</td>
          </tr>
          <tr v-if="columns && columns.length===0">
            <td colspan="10">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
      data () {
          return {
              cityName:'',
              currentYear:''
          }
      },
      props:{
          columns:{
              type:Array
          }
      },
      created() {
          this.cityName = this.$route.query.city
          let dateVale = new Date()
          this.currentYear = dateVale.getFullYear()
      }
  }
</script>

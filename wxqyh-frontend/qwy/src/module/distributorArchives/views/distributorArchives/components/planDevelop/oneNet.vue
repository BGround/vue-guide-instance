<template>
  <div>
    <div class="specialNumWrap">
      <ul>
        <li v-if="tbEntQrPlanAnetVo && tbEntQrPlanAnetVo.planNumber&&tbEntQrPlanAnetVo.planNumber.length">
          <div class="specialNum"><span v-for="(item,index) in tbEntQrPlanAnetVo.planNumber.length"
                                        :key="index">{{tbEntQrPlanAnetVo.planNumber.substr(index,1)}}</span></div>
          <p>规划数量</p>
        </li>
        <li v-if="tbEntQrPlanAnetVo && tbEntQrPlanAnetVo.planDevNumber&&tbEntQrPlanAnetVo.planDevNumber.length">
          <div class="specialNum"><span v-for="(item,index) in tbEntQrPlanAnetVo.planDevNumber.length"
                                        :key="index">{{tbEntQrPlanAnetVo.planDevNumber.substr(index,1)}}</span></div>
          <p>计划开发</p>
        </li>
        <li v-if="tbEntQrPlanAnetVo && tbEntQrPlanAnetVo.nowBuildShop&&tbEntQrPlanAnetVo.nowBuildShop.length">
          <div class="specialNum"><span v-for="(item,index) in tbEntQrPlanAnetVo.nowBuildShop.length"
                                        :key="index">{{tbEntQrPlanAnetVo.nowBuildShop.substr(index,1)}}</span></div>
          <p>在建店</p>
        </li>
        <li v-if="tbEntQrPlanAnetVo && tbEntQrPlanAnetVo.cashDepositNumber&&tbEntQrPlanAnetVo.cashDepositNumber.length">
          <div class="specialNum"><span v-for="(item,index) in tbEntQrPlanAnetVo.cashDepositNumber.length"
                                        :key="index">{{tbEntQrPlanAnetVo.cashDepositNumber.substr(index,1)}}</span></div>
          <p>已打保证金</p>
        </li>
      </ul>
    </div>

    <table class="secondNet mb20">
      <tr class="cityRateTit" v-if="tbEntQrPlanAnetVo && tbEntQrPlanAnetVo.netCity">
        <th colspan="7">{{tbEntQrPlanAnetVo.netCity}}一网规划方案({{tbEntQrPlanAnetVo.netYear}}年度）</th>
      </tr>
      <tr class="cityRateTit" v-else>
        <th colspan="7">{{`${cityName}一网规划方案（${currentYear}年度）`}}</th>
      </tr>
      <tr class="grayBg">
        <th class="borderR">规划数量</th>
        <th class="borderR">运营店</th>
        <th class="borderR">在建店</th>
        <th class="borderR">开发计划数量</th>
        <th class="borderR">开发计划类别</th>
        <th class="borderR">规划网点性质</th>
        <th class="borderR">计划开发时间</th>
      </tr>
      <tr v-if="tbEntQrPlanAnetVo && tbEntQrPlanAnetVo.planNumber">
        <td>{{tbEntQrPlanAnetVo.planNumber}}</td>
        <td>{{tbEntQrPlanAnetVo.nowOperatingShop}}</td>
        <td>{{tbEntQrPlanAnetVo.nowBuildShop}}</td>
        <td>{{tbEntQrPlanAnetVo.planDevNumber}}</td>
        <td>{{tbEntQrPlanAnetVo.planDevType}}</td>
        <td>{{tbEntQrPlanAnetVo.naturePlanOutlet}}</td>
        <td>{{tbEntQrPlanAnetVo.planDevTime}}</td>
      </tr>
      <tr v-if="!tbEntQrPlanAnetVo || !tbEntQrPlanAnetVo.planDevTime">
        <td colspan="7">暂无数据</td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
      data () {
          return {
            cityName: '',
            currentYear: '',
          }
      },
      props:{
          tbEntQrPlanAnetVo:{
              type: Object
          }
      },
      created(){
        this.cityName = this.$route.query.city
        let dateVale = new Date()
        this.currentYear = dateVale.getFullYear()
      }
  }
</script>

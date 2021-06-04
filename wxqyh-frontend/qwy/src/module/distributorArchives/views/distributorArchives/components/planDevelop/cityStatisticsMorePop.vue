<template>
  <div class="cityStatisticsWrap">
    <div class="mask"></div>
    <div class="popInfo">
      <div class="scrollWrap">
        <div class="titWrap mb10">
          <h4>分月市占率</h4>
        </div>
        <div class="searchWrap">
          <el-date-picker
            v-model="sdate.selectTime"
            type="monthrange"
            range-separator="至"
            @change="dateChangeFun"
            start-placeholder="开始月份"
            end-placeholder="结束月份">
          </el-date-picker>
          <el-button type="danger" @click="searchFun">查询</el-button>
        </div>
        <!-- <city-rate-table-pop :currentYear="currentYear" :currentMonth="currentMonth" :lastMonth="lastMonth" :beforeMonth="beforeMonth" :columns="cityStatisticsList"></city-rate-table-pop> -->
        <city-rate-table-pop :startDate="startDate" :endDate="endDate" :columns="cityStatisticsList"></city-rate-table-pop>
      </div>
      <div class="closeBtn">
        <qwuiButton type="danger"
          @click="closePop">关闭</qwuiButton>
      </div>
    </div>
  </div>
</template>

<script>
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
import cityRateTablePop from "./cityRateTablePop";
import { ajaxGetCityStatisticsByMonth} from '../../../../api/getData'
export default {
  data() {
    return {
        form:{
            dealerId:3,
            startYearmonth:'',
            endYearmonth:''
        },
        startDate:'',
        endDate:'',
        cityStatisticsList:[],
        sdate: {
          selectTime: [],
        }
    }
  },
  props:['dealerId'],
  created(){
    this.init()
  },
  methods: {
      init(){
          let today = new Date()
          let year = today.getFullYear()
          let month = today.getMonth()
          this.form.startYearmonth = this.formatDate(this.getBeforeThreeMonth(today))
          this.form.endYearmonth = this.formatDate(today)
          this.startDate = this.formatDate(this.getBeforeThreeMonth(today))
          this.endDate = this.formatDate(today)
          this.sdate.selectTime.push(this.getBeforeThreeMonth(today),today)
          this.currentYear = year
          this.currentMonth = this.add0(month+1).toString()
          this.lastMonth = this.add0(month).toString()
          this.beforeMonth = this.add0(month-1).toString()
          setTimeout(()=>{
              this.form.dealerId = this.dealerId?this.dealerId:3
              this.getCityStatisticsByMonth()
          },100)
      },
      // 搜索
      searchFun(){
          // if(parseInt(this.form.endYearmonth)-parseInt(this.form.startYearmonth)!==2){
          if(!this.monthDifference(this.form.startYearmonth,this.form.endYearmonth)) {
              this.$message('请选择间隔2个月的月份，例如：2019年06月-2019年08月');
              return false
          }

          this.startDate = this.form.startYearmonth
          this.endDate = this.form.endYearmonth
          this.getCityStatisticsByMonth()
      },
      monthDifference(str1,str2){
          if(!str1 || !str2){
              return  false
          }
          const beginYear = parseInt(str1.substr(0,4));
          const endYear = parseInt(str2.substr(0,4));
          const beginMonth = parseInt(str1.substr(4,6));
          const endMonth = parseInt(str2.substr(4,6));
          const begin = new Date(beginYear, ((beginMonth-1) + 2));
          const end = new Date(endYear, (endMonth-1));
          if(begin.getTime() === end.getTime()){
              return true;
          }else{
              return false
          }
      },
      // 获取信息
      getCityStatisticsByMonth(){
          ajaxGetCityStatisticsByMonth(this.form,data => {
              if(data && data.statisticsList){
                  this.cityStatisticsList = data.statisticsList
              } else {
                 this.cityStatisticsList = []
              }
          })
      },
      // 日期切换
      dateChangeFun(val){
          if(val){
              this.form.startYearmonth = this.formatDate(val[0])
              this.form.endYearmonth = this.formatDate(val[1])
              this.currentYear = new Date(val[1]).getFullYear()
          } else {
              this.form.startYearmonth = ''
              this.form.endYearmonth = ''
          }
      },
      add0(val){
          if(val<10){
              return '0'+val
          } else {
              return val
          }
      },
      getBeforeThreeMonth(val){
          let dateVal = new Date(val)
          dateVal.setMonth(dateVal.getMonth()-2);
          return dateVal
      },
      formatDate(val){
          let dateVal = new Date(val)
          let year = dateVal.getFullYear()
          let month = dateVal.getMonth()
          return year+''+this.add0(month+1)
      },
    closePop() {
      this.$emit('closeCityStatistic', '')
    },
  },
  components: {
    qwuiButton,cityRateTablePop
  },
  filters:{
      filterNum: function (val) {
          if(val) {
              return val.toFixed(2);
          } else {
              return 0
          }
      },
  }
}
</script>

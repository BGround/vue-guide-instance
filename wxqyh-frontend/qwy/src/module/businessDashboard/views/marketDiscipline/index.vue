<template>
  <div class="enterprise-info">
      <div class="board">
        <div class="board__header">
          <div class="board__header__left">
            <h3 class="board__title">市场纪律</h3>
            <div class="board__date">
              <el-date-picker
                v-model="selectedDate"
                type="month"
                format="yyyy-MM"
                @change="handleDateChange"
                placeholder="选择日期">
              </el-date-picker>

            </div>
          </div>
          <div class="board__header__right">
            <div class="board__tab">
              <el-tabs v-model="activeTabName" @tab-click="handleClickTab">
                <el-tab-pane v-for="(item, index) in tabsOptions" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
              </el-tabs>
            </div>
            <div class="board__info">
              <div class="board__info__date">更新日期：{{updateTime}}</div>
              <div class="board__info__date">更 新 人：{{updateUser}}</div>
            </div>
          </div>
        </div>

        <component :config="mapConfig(activeTabName)" :is="activeTabName"></component>

      </div>

  </div>
</template>

<script>

  import month from "./month";
  import region from "./region";
  import report from "./report";
  import businessDashboardApi from '@/module/businessDashboard/api/getData'
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
export default {
  components:{
      month,
      region,
      report
  },
  data() {
      return {
          selectedDate: '',
          activeTabName: 'month',
          chartId: 'changeEnterpriseInfo',
          updateUser: '',
          updateTime: '',
          tabsOptions: [{
              label: '分月',
              name: 'month',
              data: {}
          },{
              label: '分大区',
              name: 'region',
              data: {}
          },{
              label: '经销商举报',
              name: 'report',
              data: {}
          }
          ],
          form:{
              year: currentYear,
              month: currentMonth
          }
      };
  },
    created(){

    },
  methods: {

      handleClickTab(tab, event){
          this.requestData()
      },

      handleDateChange(date){
          if(date instanceof Date){
              this.form.year = date.getFullYear()
              this.form.month = date.getMonth() + 1
          }else{
              this.form.year =currentYear
              this.form.year = currentMonth
          }
          this.requestData()
      },

      mapConfig(activeTabName){
          const tabOption = this.tabsOptions.find((item)=>item.name===activeTabName)
          return tabOption.data;
      },

      init(){
          this.requestData()
      },

      requestData(){
          // this.queryStatisticsByMonth()
          // this.selectStatisticsByArea()

          if(this.activeTabName === 'month'){
              this.selectStatisticsByMonth()
          }
          if(this.activeTabName === 'region'){
              this.selectStatisticsByArea()
          }
          if(this.activeTabName === 'report'){
              this.selectStatisticsByDealer()
          }
      },

      selectStatisticsByMonth(){
          businessDashboardApi.selectStatisticsByMonth(this.form).then((data)=>{
              if(data){
                  if(this.activeTabName === 'month'){
                      this.tabsOptions[0].data = data;
                  }
              }
              this.setUpdatedInfo(data.maxUpdateTimeUser)
          })
      },

      selectStatisticsByArea(){
          businessDashboardApi.selectStatisticsByArea(this.form).then((data)=>{
              this.tabsOptions[1].data = data;
              this.setUpdatedInfo(data.maxUpdateTimeUser)
          })
      },


      setUpdatedInfo(info){
          this.updateTime =info && info.updateTime && info.updateTime.time? new Date(info.updateTime.time).toISOString().substr(0,10) : ''
          this.updateUser = info && info.updateUser? info.updateUser : ''
      },

      selectStatisticsByDealer(){
          businessDashboardApi.selectStatisticsByDealer(this.form).then((data)=>{
              this.setUpdatedInfo(data.maxUpdateTimeUser)
              this.tabsOptions[2].data = data;
          })
      }



  },
    mounted() {
      this.requestData();
    },
}
</script>

<style lang="scss" scoped>
  @import '~@/module/businessDashboard/scss/common/board.scss';
  #changeEnterpriseInfo{
    height: 520px;
  }
</style>

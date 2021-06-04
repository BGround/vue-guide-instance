<template>
  <div class="enterprise-info">
      <div class="board">
        <div class="board__header">
          <div class="board__header__left">
            <h3 class="board__title">网络退出</h3>
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
              <div class="board__info__date">更新日期：{{updateTime || ''}}</div>
              <div class="board__info__date">更 新 人：{{updateUser || ''}}</div>
            </div>
          </div>
        </div>

        <component @change="handleChangeInfo" :date="{month, year}" :is="activeTabName"></component>
      </div>

  </div>
</template>

<script>

  import month from "./month";
  import region from "./region";
  import intention from "./intention";
  import freeze from "./freeze";
  import zombie from "./zombie";
  import businessDashboardApi from '@/module/businessDashboard/api/getData'
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
export default {
  components:{
      month,
      region,
      intention,
      freeze,
      zombie
  },
  data() {
      return {
          selectedDate: '',
          activeTabName: 'month',
          chartId: 'changeEnterpriseInfo',
          tabsOptions: [{
              label: '分月退网',
              name: 'month',
              data: {}
          },{
              label: '分大区',
              name: 'region',
              data: {}
          },{
              label: '意向退网',
              name: 'intention',
              data: {}
          },{
              label: '冻结网点',
              name: 'freeze',
              data: {}
          },{
              label: '僵尸网点',
              name: 'zombie',
              data: {}
          }
          ],
          year: currentYear,
          month: currentMonth,
          updateTime: '',
          updateUser: ''
      };
  },

  methods: {

      handleClickTab(tab, event){
          console.log(this.activeTabName)

      },

      handleDateChange(date){
          if(date instanceof Date){
              this.year = date.getFullYear()
              this.month = date.getMonth() + 1
          }else{
              this.year =currentYear
              this.month = currentMonth
          }

      },

      handleChangeInfo({updateTime,updateUser}){
          this.updateTime = updateTime.substr(0,10)
          this.updateUser = updateUser
      }



  },
    mounted() {

    },
}
</script>

<style lang="scss" scoped>
  @import '~@/module/businessDashboard/scss/common/board.scss';
  #changeEnterpriseInfo{
    height: 520px;
  }
</style>

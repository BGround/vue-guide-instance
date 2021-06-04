<template>
  <div class="enterprise-info">
      <div class="board">
        <div class="board__header">
          <div class="board__header__left">
            <h3 class="board__title">网络总体现状</h3>
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

            </div>
            <div class="board__info">
<!--              <div class="board__info__date">更新日期：{{updateTime}}</div>-->
<!--              <div class="board__info__date">更 新 人：{{updateUser}}</div>-->
            </div>
          </div>
        </div>

        <component @change="handleChangeInfo" :date="{month, year}" :is="activeTabName"></component>

      </div>

  </div>
</template>

<script>

  import status from "./status";
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  export default {
    components:{
        status,
    },
    data() {
        return {
            selectedDate: '',
            activeTabName: 'status',
            chartId: 'changeEnterpriseInfo',
            updateUser: '',
            updateTime: '',
            tabsOptions: [{
                label: 'status',
                name: 'status',
                data: {}
            }],
            year: currentYear,
            month: currentMonth,
        };
    },
    created(){

    },
    methods: {

        mapConfig(activeTabName){
            const tabOption = this.tabsOptions.find((item)=>item.name===activeTabName)
            return tabOption.data;
        },

        handleClickTab(tab, event){
            console.log(this.activeTabName)

        },

        handleDateChange(date){
            if(date instanceof Date){
                this.year = date.getFullYear()
                this.month = date.getMonth() + 1
            }else{
                this.year = currentYear
                this.month = currentMonth
            }
        },

        mapConfig(activeTabName){
            const tabOption = this.tabsOptions.find((item)=>item.name===activeTabName)
            return tabOption.data;
        },

        handleChangeInfo({updateTime,updateUser}){
            this.updateTime = updateTime
            this.updateUser = updateUser
        }

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../scss/common/board.scss';
  #changeEnterpriseInfo{
    height: 520px;
  }
</style>

<template>
  <div class="enterprise-info">
      <div class="board">
        <div class="board__header">
          <div class="board__header__left">
            <h3 class="board__title">一网开发完成情况</h3>
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

  import planning from "./planning";
  import enterProgress from './enterProgress'
  import networkActivation from './networkActivation';
  import storeBuilding from './storeBuilding';
  import businessDashboardApi from '@/module/businessDashboard/api/getData'

  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  export default {
    components:{
        planning,
        enterProgress,
        networkActivation,
        storeBuilding
    },
    data() {
        return {
            selectedDate: '',
            activeTabName: 'planning',
            tabsOptions: [{
                label: '开发计划',
                name: 'planning',
                data: {
                  count: {},
                  change:{},
                    chart:[]
                }
            },{
                label: '入网进展',
                name: 'enterProgress',
                data: {
                    count: {},
                    change:{},
                    chart:[],
                }
            },{
                label: '网络开通',
                name: 'networkActivation',
                data: {
                    count: {},
                    change:{},
                    chart:[],
                }
            },{
                label: '店面建设',
                name: 'storeBuilding',
                data: {
                    count: {},
                    change:{},
                    chart:[],
                }
            }],
            year: currentYear,
            month: currentMonth,
            updateTime: '',
            updateUser: '',
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

        handleChangeInfo({updateTime,updateUser}){
            this.updateTime = updateTime
            this.updateUser = updateUser
        }

  },
    mounted() {

    },
  }
</script>

<style lang="scss" scoped>
  @import '../../scss/common/board.scss';
  #changeEnterpriseInfo{
    height: 520px;
  }
</style>

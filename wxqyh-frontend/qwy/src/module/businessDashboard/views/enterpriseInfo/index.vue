<template>
  <div class="enterprise-info">
      <div class="board">
        <div class="board__header">
          <div class="board__header__left">
            <h3 class="board__title">企业信息变更</h3>
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
              <div class="board__info__date">更新日期：{{lastUpdate.updateTime || ''}}</div>
              <div class="board__info__date">更 新 人：{{lastUpdate.updateUser || ''}}</div>
            </div>
          </div>
        </div>

        <component :config="mapConfig(activeTabName)" :is="activeTabName"></component>

      </div>

  </div>
</template>

<script>

  import general from "@/module/businessDashboard/views/enterpriseInfo/general";
  import important from "@/module/businessDashboard/views/enterpriseInfo/important";
  import businessDashboardApi from '@/module/businessDashboard/api/getData'
  export default {
    components:{
        important,
        general
    },
    data() {
        return {
            selectedDate: '',
            activeTabName: 'general',
            tabsOptions: [{
                label: '一般变更',
                name: 'general',
                data: {
                  count: {},
                  change:{},
                    chart:[]
                }
            },{
                label: '重大变更',
                name: 'important',
                data: {
                    count: {},
                    change:{},
                    chart:[],
                }
            }],
            form:{
                month: '',
                year: '',
                changeType: '一般变更',
            },
            lastUpdate: {},
        };
    },
    created(){

      this.init()
    },
    methods: {

        handleClickTab(tab, event){
            this.form.changeType = tab.label;
            this.countByChangeTypeAndState()
            this.getChangeEnterpriseVOListByYear()
        },

        handleDateChange(date){
            if(date instanceof Date){
                this.form.year = date.getFullYear()
                this.form.month = date.getMonth() + 1
            }else{
                this.form.year =''
                this.form.year = ''
            }
            this.requestData()
        },

        init(){
            this.requestData()
        },

        requestData(){




            businessDashboardApi.getChangeWeek({
                month: this.form.month,
                year: this.form.year
            }).then((data)=>{
                if(data){
                    if(this.activeTabName === 'general'){
                        this.tabsOptions[0].data.change = data;
                    }else{
                        this.tabsOptions[1].data.change = data;
                    }
                    this.lastUpdate = data.lastUpdateVO ||{}
                }
            })

            this.countByChangeTypeAndState()
            this.getChangeEnterpriseVOListByYear()
        },

        countByChangeTypeAndState(){
            businessDashboardApi.countByChangeTypeAndState(this.form).then((data)=>{
                if(data){
                    if(this.activeTabName === 'general'){
                        this.tabsOptions[0].data.count = data;
                    }else{
                        this.tabsOptions[1].data.count = data;
                    }
                }
            })
        },

        getChangeEnterpriseVOListByYear(){
            businessDashboardApi.getChangeEnterpriseVOListByYear({year: this.form.year, changeType: this.form.changeType}).then((data)=>{
                if(data){
                    if(this.activeTabName === 'general'){
                        this.tabsOptions[0].data.chart = data;
                    }else{
                        this.tabsOptions[1].data.chart = data;
                    }
                }
            })
        },





        mapConfig(activeTabName){
            const tabOption = this.tabsOptions.find((item)=>item.name===activeTabName)
            return tabOption.data;
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

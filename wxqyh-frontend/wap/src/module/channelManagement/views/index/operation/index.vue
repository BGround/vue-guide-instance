<template>
  <div>
    <div>
      <cherySearch
        :departmentName="departmentName"
        @change="handleChange"
        @select="handleSelect"
        v-model="keyword">
      </cherySearch>
      <qwui-group-tab :selected="tabSelectedIndex"
                      @click="handleClick">
        <qwui-tab :key="index"
                  :text="item.name"
                  v-for="(item, index) in tabs"></qwui-tab>
      </qwui-group-tab>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import reloadApp from '@/module/channelManagement/mixins/reloadApp'
  import QwuiTab from '@/module/channelManagement/components/qwuiTab/tab.vue'
  import QwuiGroupTab from '@/module/channelManagement/components/qwuiTab/tab_group.vue'
  import cherySearch from '@/module/channelManagement/components/chery-search';
  import * as utils from '@/module/channelManagement/js/utils'

  export default {
    components: {
      QwuiTab,
      QwuiGroupTab,
      cherySearch
    },
    mixins: [reloadApp],
    data() {
      return {
        keyword: '',
        departmentName: '',
        tabSelectedIndex: 0,
        tabs: [
          {
            routeName: 'salesData',
            name: '销量数据'
          },
          {
            routeName: 'performanceEvaluation',
            name: '业绩评估'
          },
          {
            routeName: 'operationEvaluation',
            name: '运营评估'
          },
          {
            routeName: 'rewardAndPunishment',
            name: '奖惩信息'
          },
          // {
          //   routeName: 'profitStatus',
          //   name: '盈利情况'
          // },
          // {
          //   routeName: 'salesVolumeStatus',
          //   name: '销量情况'
          // },
          // {
          //   routeName: 'salesOperation',
          //   name: '销售运营',
          // },
          // {
          //   routeName: 'serviceOperation',
          //   name: '服务运营'
          // },
          // {
          //   routeName: 'evaluation',
          //   name: '综合运营评估'
          // },
          // {
          //   routeName: 'rewardsAndPunishments',
          //   name: '日常奖惩'
          // },
          // {
          //   routeName: 'productSales',
          //   name: '产品销量'
          // },
          // {
          //   routeName: 'annualCommendation',
          //   name: '年度表彰'
          // }
        ],
        queryParams: {}
      }
    },
    methods: {
      handleClick(value, name, index) {
        const tab = this.tabs[index]
        if (this.$route.name !== tab.routeName) {
          this.$router.replace({name: tab.routeName, query: this.queryParams})
        }
      },

      setTabDefaultIndex(routeName) {
        const tab = this.tabs.find(item => routeName.indexOf(item.routeName) !== -1);
        const index = this.tabs.indexOf(tab);
        if (index >= 0) {
          this.tabSelectedIndex = index;
        } else {
          window.location.href = location.pathname
        }
      },

      handleChange(e) {
        console.log(e);
      },

      handleSelect(e) {
        const query = Object.assign({}, {
          province: e.provinceName,
          city: e.cityName,
          dealerId: e.id,
          erpCarNo: e.erpCarNo
        })
        this.$router.replace({query: query}).catch((error)=>{
          console.log(error)
        })
      },

      setCity(){
          _.showLoading('');
          utils.getCityByLocation().then((city)=>{
              this.departmentName =city;
          }).catch(()=>{
              this.departmentName = '全国';
          }).finally(()=>{
              _.hideLoading();
          })
      },

      initCity(){
          if(!utils.isOpenH5){
              wx.ready((e)=>{
                  this.setCity();
              });
              wx.error(()=>{
                  this.departmentName = '全国';
              })
          }else{
              this.setCity();
          }
      }
    },
    created() {
      this.queryParams = this.$route.query || {}
      this.setTabDefaultIndex(this.$route.name)
    },
    mounted() {
      this.initCity();
    }
  }
</script>

<style>
</style>

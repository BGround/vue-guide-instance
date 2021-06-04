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
        <qwui-tab v-for="(item, index) in tabs"
          :key="index"
          :text="item.name"></qwui-tab>
      </qwui-group-tab>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
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
  data() {
    return {
      keyword: '',
      departmentName: '',
      tabSelectedIndex: 0,
      tabs: [
        {
          routeName: 'firstNetBuilding',
          name: '一网建设'
        },
        {
          routeName: 'firstNetRebate',
          name: '一网返利'
        },
        {
          routeName: 'secondNetBuilding',
          name: '二网建设'
        },
        {
          routeName: 'secondNetRebate',
          name: '二网返利'
        },
        // {
        //   routeName: 'completionInfo',
        //   name: '完工信息'
        // },
        // {
        //   routeName: 'processManagement',
        //   name: '建设过程管理'
        // },
        // {
        //   routeName: 'buildingRebate',
        //   name: '建店返利'
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
    initCity() {
        if (!utils.isOpenH5) {
            wx.ready((e) => {
                this.setCity();
            });
            wx.error(() => {
                this.departmentName = '全国';
            })
        } else {
            this.setCity();
        }
    }
  },
  created() {
    this.queryParams = this.$route.query || {}
    this.setTabDefaultIndex(this.$route.name)
  },
  watch: {
    $route: {
      handler() {
        this.dealerId = this.$route.query.dealerId;
        this.queryParams = this.$route.query;
        // console.log(this.queryParams);
      }
    }
  },
  mounted() {
    this.initCity();
  }
}
</script>

<style>
</style>

<template>
  <div>
    <cherySearch
      :departmentName="departmentName"
      v-model="keyword"
      @select="handleSelect"
      @change="handlechnage">
    </cherySearch>
    <div>
      <qwui-group-tab :selected="tabSelectedIndex" @click="handleClick">
        <qwui-tab v-for="(item, index) in tabs" :key="index" :text="item.name" ></qwui-tab>
      </qwui-group-tab>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

import QwuiTab from '@/module/channelManagement/components/qwuiTab/tab.vue'
import QwuiGroupTab from '@/module/channelManagement/components/qwuiTab/tab_group.vue'
import cherySearch from '@/module/channelManagement/components/chery-search'
import * as utils from '@/module/channelManagement/js/utils'

export default {
  components:{
    cherySearch,
    QwuiTab,
    QwuiGroupTab,
  },
  data(){
    return {
      tabSelectedIndex: 0,
      dealerId: '',
      departmentName: '全国',
      keyword: '',
      tabs:[
        // {
        //   routeName: 'basicInfo',
        //   name: '基础信息',
        // },
        // {
        //   routeName: 'equity',
        //   name: '股东股本',
        // },
        // {
        //   routeName: 'employment',
        //   name: '人员信息',
        // },
        // {
        //   routeName: 'coreStaff',
        //   name: '核心人员',
        // },
        // {
        //   routeName: 'operatingAuthority',
        //   name: '经营权限',
        // },
        // {
        //   routeName: 'trainingInfor',
        //   name: '培训信息',
        // },
        // {
        //   routeName: 'fundStatus',
        //   name: '资金状况',
        // },
        // {
        //   routeName: 'fundBalance',
        //   name: '资金余额',
        // },
        // {
        //   routeName: 'storeInfo',
        //   name: '直营店信息',
        // },
        // {
        //   routeName: 'onlineSalesPlatform',
        //   name: '网销平台'
        // },
        // {
        //   routeName: 'onlineSalesPlatformDetail',
        //   name: '网销平台详情'
        // },
        {
          routeName: 'businessInfo',
          name: '工商信息',
        },
        {
          routeName: 'authorizeInfo',
          name: '授权信息',
        },
        {
          routeName: 'fundsInfo',
          name: '资金信息',
        },
      ],
      queryParams: {},
    };
  },
  methods:{
    handleClick(value, name, index){
      const tab = this.tabs[index];
       if (this.$route.name !== tab.routeName) {
         this.$router.replace({name: tab.routeName, query: this.queryParams});
       }
    },

    setTabDefaultIndex(routeName){
      const tab = this.tabs.find(item=>routeName.indexOf(item.routeName) !== -1);
      const index = this.tabs.indexOf(tab);
      if(index>=0){
        this.tabSelectedIndex=index;
      }else{
        window.location.href = location.pathname
      }
    },

    handlechnage(e){
      console.log(e)
    },

    handleSelect(item){
      const {name} =  this.$route;
      const query = Object.assign({}, {
        province:item.provinceName,
        city:item.cityName,
        dealerId:item.id,
        erpCarNo: item.erpCarNo
      })
      this.$router.replace({query: query})
      // .then(()=>{
      //   console.log('更新')
      // }).catch((error)=>{
      //   console.log(error)
      // })
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
    this.dealerId = this.$route.query.dealerId;
    this.queryParams = this.$route.query;
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
    this.initCity()
  }
}
</script>

<style>

</style>

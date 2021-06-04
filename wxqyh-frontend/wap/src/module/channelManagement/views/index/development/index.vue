
<template>
  <div>
    <cherySearch
        :departmentName="departmentName"
        v-model="keyword"
        @select="handleSelect"
        @change="handlechnage">
    </cherySearch>
    <div>
      <qwui-group-tab :selected="tabSelectedIndex" full @click="handleClick">
        <qwui-tab text="城市介绍" ></qwui-tab>
        <qwui-tab text="城市市占"></qwui-tab>
        <qwui-tab text="一网规划"></qwui-tab>
        <qwui-tab text="二网规划"></qwui-tab>
      </qwui-group-tab>
    </div>
    <div class="view-warp">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

    import QwuiTab from '@/module/channelManagement/components/qwuiTab/tab.vue'
    import QwuiGroupTab from '@/module/channelManagement/components/qwuiTab/tab_group.vue'
    import cherySearch from '@/module/channelManagement/components/chery-search';
    import * as utils from '@/module/channelManagement/js/utils'
    export default {
        components:{
            QwuiTab,
            QwuiGroupTab,
            cherySearch
        },
        data(){
            return {
                tabSelectedIndex: 0,
                dealerId: '',
                departmentName: '',
                keyword: '',
                tabs:[
                    {
                        routeName: 'cityInfo',
                        name: '城市介绍',
                    },
                    {
                        routeName: 'cityShare',
                        name: '城市市占',
                    },
                    {
                        routeName: 'oneNetworkPlanning',
                        name: '一网规划',
                    },
                    {
                        routeName: 'twoNetworkPlanning',
                        name: '二网规划',
                    },
                ],
                queryParams: {},
            };
        },
        methods:{
            handleClick(value, name, index){
                const tab = this.tabs[index];
                if(this.$route.name !== tab.routeName){
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

            handlechnage(){

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
                .catch((error)=>{
                    console.log(error,'')
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
            this.queryParams = this.$route.query;
            this.setTabDefaultIndex(this.$route.name)
        },
        mounted() {
           this.initCity();
        }
    }
</script>

<style>
  /* .view-warp{
    position: absolute;
    top: 41px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  } */
</style>


<template>
  <div>
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
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
export default {
  mixins: [reloadApp],
  components:{
    QwuiTab,
    QwuiGroupTab,
  },

  data(){
    return {
      tabSelectedIndex: 0,
      tabs:[
        {
          routeName: 'warningInfo',
          name: '预警陈述',
        },
        // {
        //   routeName: 'riskAssessment',
        //   name: '风险评估',
        // },
        {
          routeName: 'exitNetInfo',
          name: '退网信息',
        },
      ],
      queryParams:{}
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
      this.tabSelectedIndex = Math.max(0, index);
    }
  },
  created() {
    this.queryParams = this.$route.query || {};
    this.setTabDefaultIndex(this.$route.name)
  },
}
</script>

<style>

</style>
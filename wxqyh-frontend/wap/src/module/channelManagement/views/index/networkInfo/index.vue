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
export default {
  components:{
    QwuiTab,
    QwuiGroupTab,
  },
  data(){
    return {
      tabSelectedIndex: 0,
      tabs:[
        {
          routeName: 'description',
          name: '入网陈述',
        },
        {
          routeName: 'investor',
          name: '投资人',
        },
        // {
        //   routeName: 'investorDetail',
        //   name: '投资人详情',
        // }
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
      debugger
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

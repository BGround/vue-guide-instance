<template>
  <div class="qwui-list_wrap">
    <qwTab :tabList="tabList" :index="index" @selectIndex="selectIndex"></qwTab>
    <router-view></router-view>
  </div>
</template>

<script>

  import qwTab from '@/components/Tab/QwTab';
  const routerArr = ['meetingList','meetingSummary','meetingSetting'];

  export default {
    data(){
      return {
        index:0,
        tabList:[{
          text:'会议',
          perm:'meetinglist',
        },{
          text:'会议纪要',
          perm:'meetinglist',
        },{
          text:'设置',
          perm:'meetingSet',
        }]
      }
    },
    created(){
      let routeName = this.$router.currentRoute.name;
      this.index = routerArr.indexOf(routeName) != -1 ? routerArr.indexOf(routeName) : 2;
    },
    watch:{
      $route(to,from){
        let routeName = to.name;
        this.index = routerArr.indexOf(routeName) != -1 ? routerArr.indexOf(routeName) : 2;
      }
    },
    methods:{
      selectIndex(index){
        this.$router.push({
          name:routerArr[index]
        })
      },
    },
    components:{
      qwTab,
    }
  }

</script>

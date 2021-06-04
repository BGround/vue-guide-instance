<template>
  <div class="qwui-list_wrap">
    <qwTab :tabList="tabList" :index="index" @selectIndex="selectIndex"></qwTab>
    <router-view></router-view>
  </div>
</template>

<script>
  import qwTab from '@/components/Tab/QwTab';

  const routerArr = ['diaryList','diaryStat','diarySetting'];

  export default {
    data(){
      return {
        index:0,
        tabList:[{
          text:'所有日志',
          perm:'diaryList',
        },{
          text:'统计',
          perm:'diarySet',
        },{
          text:'设置',
          perm:'diarySet',
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

<style lang="scss" scoped>
  @mixin pt15{
    padding-top: 15px;
  }

  .qwui-list_wrap {
    min-width: 960px;
  @include pt15;
  }
</style>

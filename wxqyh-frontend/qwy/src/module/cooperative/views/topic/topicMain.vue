<template>
  <div class="list_wrap">
    <qwTab :tabList="tabList" :index="index" @selectIndex="selectIndex"></qwTab>
    <router-view></router-view>
  </div>
</template>

<script>
  import qwTab from '@/components/Tab/QwTab';

  export default {
    created(){
      let routeName = this.$router.currentRoute.name;
      this.routeJump(routeName);
    },
    watch:{
      $route(to,from){
        let routeName = to.name;
        this.routeJump(routeName);
      }
    },
    data(){
      return{
        index:0,
        tabList:[{
          text:'话题',
          perm:'topicList',
        },{
          text:'评论',
          perm:'topicList',
        },{
          text:'设置',
          perm:'topicSet',
        }]
      }
    },
    methods:{
      selectIndex(index){
        if(index==0){
          this.$router.push(
            {
              path: '/topicMain/topicList',
            }
          )
        }else if(index==1){
          this.$router.push(
            {
              path: '/topicMain/topicCommentList',
            }
          )
        }else if(index==2){
         this.$router.push(
           {
             path: '/topicMain/topicSetting',
           }
         )
        }
      },
      routeJump(routeName){
        let singleArr = ['addOrEditTopic','topicList','topicSee','topicSeeUnRead','topicSeeRead'];
        let multiArr = ['topicCommentList'];
        let setArr = ['addOrEditType','topicSetting','topicAnonySet','topicTopSet','topicPublishAuthor','topicMenu','topicTypeList'];
        singleArr.includes(routeName) ?
        this.index = 0 :
        multiArr.includes(routeName) ?
        this.index = 1 :
        setArr.includes(routeName) ?
        this.index = 2 : '';
      }
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

  .list_wrap {
    min-width: 960px;
    @include pt15;
  }
</style>

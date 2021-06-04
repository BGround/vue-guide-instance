<template>
  <div class="qwui-read_wrap">
    <qwTab :tabList="tabList" :index="index" @selectIndex="selectIndex"></qwTab>
    <router-view></router-view>
  </div>
</template>

<script>
  import qwTab from '@/components/Tab/QwTab';

  export default {
    created(){
      let routeName = this.$router.currentRoute.name;
      if(routeName=='newsBulletinRead'){
        this.index = 0;
      }else if(routeName=='newsBulletinUnread'){
        this.index = 1;
      }
    },
    data(){
      return{
        index:0,
        tabList:[{
          text:'已读人员',
        },{
          text:'未读人员',
        }],
      }
    },
    methods:{
      goBack(){
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/');
      },
      selectIndex(index){
        let readObj = JSON.parse(window.sessionStorage.getItem('readObj'));
        if(index==0){
          this.$router.push({
            name:'newsBulletinRead',
            params:{
              id:readObj.id,
              title:readObj.title,
            },
          });
        }else if(index==1){
          this.$router.push({
            name:'newsBulletinUnread',
            params:{
              id:readObj.id,
              title:readObj.title,
            },
          });
        }
      }
    },
    watch:{
      $route(to,from){
        let routeName = to.name;
        if(routeName=='newsBulletinRead'){
          this.index = 0;
        }else if(routeName=='newsBulletinUnread'){
          this.index = 1;
        }
      }
    },
    components:{
      qwTab,
    }
  }
</script>

<style scoped lang="scss">
  .qwui-read_wrap{
    padding: 10px 0;
  }
</style>

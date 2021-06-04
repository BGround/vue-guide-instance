<template>
  <div class="qwui-list_wrap">
    <qwTab :tabList="tabList" :index="index" @selectIndex="selectIndex"></qwTab>
    <keep-alive include="newsBulletinList">
      <router-view></router-view>
    </keep-alive>
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
          text:'单图文',
          perm:'dynamicinfoList',
        },{
          text:'多图文',
          perm:'articleDetail',
        },{
          text:'设置',
          perm:'dynamicinfoMenu',
        }]
      }
    },
    methods:{
      routeJump(routeName){
        let singleArr = ['newsBulletinList','newsBulletinRead','newsBulletinUnread','newsBulletinAdd'];
        let multiArr = ['newsBulletinMulti','newsBulletinAddMulti'];
        let setArr = ['newsBulletinSet','newsBulletinMenu','newsBulletinAudit','newsBulletinAuthority'];
        singleArr.includes(routeName) ?
          this.index = 0 :
        multiArr.includes(routeName) ?
          this.index = 1 :
        setArr.includes(routeName) ?
          this.index = 2 : '';
      },
      selectIndex(index){
        if(index==0){
          this.$router.push(
            {
              path: '/newsMain/list',
            }
          )
        }else if(index==1){
          this.$router.push(
            {
              path: '/newsMain/multi',
            }
          )
        }else if(index==2){
          let baseURL = _.baseURL;
          let isEdu = window.localStorage.getItem('isEdu');
          window.localStorage.setItem('dynamicSet','dynamicSet');
          window.sessionStorage.setItem('agentCode',dataBase.agentCode);
          if(isEdu=='1'){//是教育版
            window.localStorage.removeItem('isEdu');
            window.location.href = `${baseURL}`+'/manager/veredu/main.jsp';
          }else{
            window.location.href = `${baseURL}`+'/manager/main.jsp';
          }
//          this.$router.push(
//            {
//              path: '/newsMain/set',
//            }
//          )
        }
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

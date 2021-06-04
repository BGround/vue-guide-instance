<template>
  <div class="qwui-list_wrap">
    <qwTab :tabList="tabList" :index="index" @selectIndex="selectIndex"></qwTab>
    <router-view></router-view>
  </div>
</template>
<script>
import qwTab from '@/components/Tab/QwTab';
export default {
  name:"",
  components:{
    qwTab,
  },
  props:{

  },
  vuex:{

  },
  data(){
    return {
      index: 0,
      tabList: [{
        text:'销售网点通讯录',
        // perm:'saleNetList',
      },{
        text:'服务网点通讯录',
        // perm:'serviceNetList',
      }]
    }
  },
  computed:{

  },
  watch:{
    $route(to,from){
      let routeName = to.name;
      this.routeJump(routeName);
    }
  },
  methods:{
    routeJump(routeName){
      let saleArr = ['contactSale'];
      let serviceArr = ['contactService'];
      saleArr.includes(routeName) ?
        this.index = 0 :
      serviceArr.includes(routeName) ?
        this.index = 1 : ''
    },
    selectIndex(index){
      if(index==0){
        if (this.$router.currentRoute.name=='contactSale') {
          return
        }
        this.$router.push(
          {
            path: '/contact/contactSale',
          }
        )
      }else if(index==1){
        if (this.$router.currentRoute.name=='contactService') {
          return
        }
        this.$router.push(
          {
            path: '/contact/contactService',
          }
        )
      }
    },
  },
  beforeCreate(){

  },
  created(){
    let routeName = this.$router.currentRoute.name;
    this.routeJump(routeName);
  },
  beforeMount(){

  },
  mounted(){

  }
}
</script>
<style lang="scss" scoped>
  @mixin pt15{
    padding-top: 15px;
  }

  .qwui-list_wrap {
    min-width: 960px;
    padding: 10px 20px 0;
  }
</style>

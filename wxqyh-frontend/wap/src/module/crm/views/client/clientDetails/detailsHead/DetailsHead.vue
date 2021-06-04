<template>
  <div>
    <!--标题-->
      <div class="qwui-details_title">
        <p class="qwui-details_title_name">{{headData.clientTitle}}</p>
      </div>
    <!--导航-->
    <ul class="qwui-details_nav">
      <li class="qwui-details_nav_item"
          :class="{line_active: $route.path==item.url || $route.path==item.path,poolNav_item:parentUrl=='poolDetails'}"
          :value="$route.name"
          v-for="(item,index) in navList"
          :key="index">
        <router-link :to="{path:item.url,query:{id:headData.clientId}}" replace class="qwui-nav_link">
          <p class="qwui-nav_name"
             :class="{font_active:($route.path==item.url || $route.path==item.path) && ($route.name=='clientContent' || $route.name=='poolContent')}"
             v-html="navText(item)"></p>
          <p class="qwui-nav_num" :class="{num_active: $route.path==item.path || $route.path==item.url}">{{item.num}}</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
    import {getClientDetails} from '../../../../api/client/getData.js';

    export default {
        data(){
          return {
            dataBase:dataBase,
            dialogConfig:dataBase.dialogConfig,
            navList: [],//导航联系人，商机，拜访，合同个数\
            parentUrl:"",//当前页面父级路由
          }
        },
        props:{
          nav:{
            type:Array,
            default:() => {
              return [];
            }
          },
          headData:Object,//联系人，商机，拜访数量
        },
        created(){
          this.navList = [...this.nav];
          //如果当前是详情列表页，则获取客户详情
          if(this.$route.name==='businessList' || this.$route.name==='contactList' || this.$route.name==='contractList' || this.$route.name==='visitList'){
            this.getClient();
          }
          this.parentUrl=this.$route.matched[0].name;
        },
        methods:{
          //获取客户详情，保存详情数据到vuex
          getClient:function(){
            let obj={
              "id":this.$route.query.id,
              "size":10,
            }
            getClientDetails(obj, (result) => {
              this.$store.commit('changeHeadData',result.detailNum);
            })
          },

          //客户详情/详情
          navText:function(item){
            if(this.$router.history.current.name==='clientContent' || this.$router.history.current.name==='poolContent'){
              this.navList[0].text='详情';
              return item.text;
            }else{
              this.navList[0].text='客户详情';
              return item.text;
            }
          },
        }
    }
</script>

<style>
  @import './DetailsHead.scss';

</style>

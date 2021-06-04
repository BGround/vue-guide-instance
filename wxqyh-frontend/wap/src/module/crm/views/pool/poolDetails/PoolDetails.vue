<template>
  <div class="wrap">
    <!--头部导航-->
    <details_head :nav="nav" :headData="headDatas"></details_head>

    <!--内容-->
    <router-view></router-view>


  </div>
</template>

<script>
  import details_head from '../../client/clientDetails/detailsHead/DetailsHead.vue';
  import {getPoolDetails} from '../../../api/pool/getData';
  export default {
    components:{
      details_head,
    },
    data(){
      return {
        detailsData:dataBase.details.headData,
        nav:[
          {class:"client_details", text:"详情", url:"/PoolDetails/PoolContent",path:"/PoolDetails/ClientContent", name:"", num:""},
          {class:"contact_details", text:"联系人", url:"/PoolDetails/PoolContactList",path:"/PoolDetails/poolContactContent", name:"", num:""},
          {class:"business_details", text:"商机", url:"/PoolDetails/PoolBusinessList",path:"/PoolDetails/poolBusinessContent", name:"", num:""},
          {class:"visit_details", text:"拜访", url:"/PoolDetails/PoolVisitList",path:"/PoolDetails/poolVisitContent", name:"", num:""},
        ],
        headDatas:{
          clientTitle:"",
          clientId:"",
          poolId:"",
        },
      }
    },
    created(){
      this.details();
    },
    methods:{
      details:function(){
        if(sessionStorage.getItem("id")){
          this.id=sessionStorage.getItem("id"); //读取缓存id
        }else{
          this.id=this.$router.history.current.query.id;
        }
        this.getDetail(this.id);
      },

      //获取详情
      getDetail:function(id){
        sessionStorage.setItem("id",id); //设置缓存
        getPoolDetails(id,(result) =>{
          this.headDatas.clientTitle=result.tbCrmPoolClientInfoPO.clientName;
          this.headDatas.clientId=result.tbCrmPoolClientInfoPO.id;
          this.headDatas.poolId=result.tbCrmPoolClientInfoPO.poolId;

          //信息数量
          this.nav[1].num=result.detailNum.contactNum;
          this.nav[2].num=result.detailNum.businessNum;
          this.nav[3].num=result.detailNum.visitNum;
        })
      },

    }
  }
</script>

<style scoped>

</style>

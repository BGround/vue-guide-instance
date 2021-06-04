<template>
  <div class="wrap">
    <!--头部导航-->
    <details_head :nav="nav" :headData="headData"></details_head>

    <!--内容-->
    <router-view></router-view>
  </div>
</template>

<script>
  import details_head from './detailsHead/DetailsHead.vue';
  export default {
    components:{
      details_head,
    },
    data(){
      return{
        navs:[
          {class:"client_details", text:"详情", url:"/ClientDetails/ClientContent",path:"/ClientDetails/ClientContent", name:"", num:""},
          {class:"contact_details", text:"联系人", url:"/ClientDetails/ContactList",path:"/ClientDetails/ContactContent", name:"", num:""},
          {class:"business_details", text:"商机", url:"/ClientDetails/BusinessList",path:"/ClientDetails/BusinessContent", name:"", num:""},
          {class:"contract_details", text:"合同", url:"/ClientDetails/ContractList",path:"/ClientDetails/ContractContent", name:"", num:""},
          {class:"visit_details", text:"拜访", url:"/ClientDetails/VisitList",path:"/ClientDetails/VisitContent", name:"", num:""},
        ],
        id:"",
      }
    },
    computed:{
      headData(){
        let obj=this.$store.state.details.headData;
        let headData={
          "clientTitle": obj.clientName,
          "clientId": obj.clientId,
        }
        return headData;
      },
      nav(){
        let obj=this.$store.state.details.headData;
        this.navs[1].num=obj.contactNum;
        this.navs[2].num=obj.businessNum;
        this.navs[3].num=obj.contractNum;
        this.navs[4].num=obj.visitNum;
        return this.navs;
      },
    },
  }
</script>

<style scoped>
  .wrap{
    background: none;
  }
</style>

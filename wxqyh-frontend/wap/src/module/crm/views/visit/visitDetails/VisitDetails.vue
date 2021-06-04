<template>
  <div class="wrap">
    <!--头部导航-->
    <details_head :nav="nav" :headData="headData" :more="more"></details_head>

    <!--内容-->
    <router-view></router-view>


  </div>
</template>

<script>
  import details_head from '../../client/clientDetails/detailsHead/DetailsHead.vue';
    export default {
      components:{
        details_head,
      },
      data(){
        return {
          detailsData:dataBase.details.headData,
          navs:[
            {class:"client_details", text:"详情", url:"/VisitDetails/ClientContent",path:"/VisitDetails/ClientContent", name:"", num:""},
            {class:"contact_details", text:"联系人", url:"/VisitDetails/ContactList",path:"/VisitDetails/ContactContent", name:"", num:""},
            {class:"business_details", text:"商机", url:"/VisitDetails/BusinessList",path:"/VisitDetails/BusinessContent", name:"", num:""},
            {class:"contract_details", text:"合同", url:"/VisitDetails/ContractList",path:"/VisitDetails/ContractContent", name:"", num:""},
            {class:"visit_details", text:"拜访", url:"/VisitDetails/VisitList",path:"/VisitDetails/VisitContent", name:"", num:""},
          ],
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
        more(){
          return this.$store.state.details.more;
        }
      },
      methods:{

      }
    }
</script>

<style scoped>

</style>

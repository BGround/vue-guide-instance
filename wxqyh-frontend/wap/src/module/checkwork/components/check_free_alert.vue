<template>
  <div v-show="showAlert">
  <div class="weui_mask" @click="hideAlert">
  </div>
    <div class="weui_dialog temporary_dialog">
      <div class="weui_dialog_bd">
        {{oneLineCont}}
        <p>{{otherCont}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name:"checkFreeAlert",
    props:["freeAlertData"],
    data(){
      return{
        showAlert:false,
        oneLineCont:"",
        otherCont:""
      }
    },
    methods:{
      hideAlert(){
        this.showAlert = false;
        this.freeAlertData.showAlert = false;
      }
    },
    watch:{
      freeAlertData:{
        handler:function(){
          this.showAlert = this.freeAlertData.showAlert;
          this.oneLineCont = this.freeAlertData.oneLineCont;
          this.otherCont = this.freeAlertData.otherCont;
        },
        deep:true
      }
    }
}
</script>

<style scoped>
.weui_mask {
  position: fixed;
  z-index: 100;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
}
.weui_dialog {
  position:fixed;
  top:50%;
  left:50%;
  z-index:130;
  width:85%;
  font-size:16px;
  text-align:center;
  border-radius:3px;
  -webkit-transform:translate(-50%,-50%);
  transform:translate(-50%,-50%);
}
.weui_dialog_bd {
  padding: 0 20px;
  font-size: 15px;
  color: #888;
}
.temporary_dialog {
  background: url("~assets/images/checkwork/checkwork_freeRule.png") no-repeat center 20px;
  background-size: 260px;
  background-color:#FAFAFC;
}
.temporary_dialog .weui_dialog_bd {
  margin-top: 130px;
  margin-bottom: 30px;
}
@media screen and (min-width:1024px){
  .weui_dialog{width:35%;}
}
</style>


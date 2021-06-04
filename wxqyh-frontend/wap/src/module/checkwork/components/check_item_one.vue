<template>
  <div>
    <div  class="qwui-checkItemOne" v-for="(signDetailItem,index) in signDetailArr" :key="index">
      <div class="qwui-flexItem"  @click="openCheckDetail(infoid,checkIsAbsWork,signDetailItem.signTime,todaySignType)">
        <div class="qwui-signStatus">
          <span class="qwui-classSignTime" :class="timeColor(signDetailItem.status)" v-if="signDetailItem.signTime">{{signDetailItem.signTime}}</span>
          <span class="qwui-classSignTime c999" v-if="!signDetailItem.signTime">{{signDetailItem.shouldTime}}</span>
          <span class="qwui-cldDetail-qiandao ft14">{{signDetailItem.signType}}</span>
          <span class="ft14 errorStatus" v-if="signDetailItem.errorCont">{{signDetailItem.errorCont}}</span>
        </div>
        <div class="ellipsis qwui-mapMarker" v-if="signDetailItem.signAddress">{{signDetailItem.signAddress}}</div>
        <div class="ellipsis ft13" v-if="!signDetailItem.signAddress">暂无考勤数据</div>
      </div>
      <div class="qwui-newArrow"></div>
    </div>
	</div>
</template>

<script>
export default {
  name: "check_item_one",
  props: ["checkItemOne","infoid","checkIsAbsWork","todaySignType"],
  data(){
    return{
      signTime:"14:16",
      signType:"签到",
      errorCont:"迟到4小时36分钟，IP异常",
      signAddress:"广东省广州市天河区员村一横路3号",
      id:"",
      status:""
    }
  },
  computed:{
    signDetailArr:function(){
      return this.checkItemOne;
    }
  },
  methods:{
    //点击进入考勤详情
    openCheckDetail(infoid,checkIsAbsWork,signTime,todaySignType){
      if(checkIsAbsWork == 0 && !signTime && todaySignType == 0){//旷工，不能点击进入考勤详情
        return
      }else{
        this.$router.push({
          path:"/checkDetail",
          query:{
            id:infoid
          }
        });
      }
    },
    timeColor(status){
      if(status == "1"){
        return "normalStatus";
      }else if(status == ""){
        return "";
      }else{
        return "errorStatus";
      }
    }
  }
}
</script>

<style scoped>
  .qwui-checkItemOne {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    position: relative;
    padding: 10px 15px 2px;
    background: #fff;
  }
  .qwui-checkItemOne::before {
    content: " ";
    position: absolute;
    left: 15px;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .qwui-flexItem {
    overflow: hidden;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  .qwui-newArrow::after {
    content: " ";
    display: inline-block;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    height: 6px;
    width: 6px;
    border-width: 2px 2px 0 0;
    border-color: #C8C8CD;
    border-style: solid;
    position: relative;
    top: 17px;
    margin-left: .3em;
  }
  .qwui-classSignTime {
    margin-right: 5px;
    font-size: 20px;
  }
  .qwui-cldDetail-qiandao {
    border-left: 1px solid #ccc;
    padding-left: 10px;
    margin-left: 10px;
    margin-right: 5px;
    color: #666;
  }
  .qwui-signStatus>span {
    vertical-align: middle;
  }
  .qwui-mapMarker {
    font-size: 13px;
    background: url(~assets/images/checkwork/mapMarker.png) no-repeat left 3px;
    -webkit-background-size: 13px 13px;
    background-size: 13px 13px;
    padding-left: 17px;
  }
  .ellipsis {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #999;
  }
  .ft14 {
    font-size: 14px;
  }
  .ft13 {
    font-size: 13px;
  }
  .errorStatus {
    color: #e94f4f;
  }
  .normalStatus {
    color: #467DB9;
  }
  .c999 {
    color: #999;
  }
</style>


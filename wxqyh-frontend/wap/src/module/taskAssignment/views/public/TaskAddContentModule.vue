<template>
  <transition name="bounce-pop">
    <div class="qwui-add_module"
         v-model="addModuleConfig"
         :style="{height:'100%'}"
         v-show="addModuleConfig.show">
      <div class="qwui-add_module_box" ref="module_num">
        <div class="qwui-add_module_item" v-if="mainModuleShow" @click="addModule(addTypeArr[1])">
          <img src="../../../../assets/svg/relevantPerson.svg" alt="">
          <span>{{$t('i18n.relevantPerson')}}</span>
        </div>
        <div class="qwui-add_module_item" v-if="mainModuleShow" @click="addModule(addTypeArr[2])">
          <img src="../../../../assets/svg/icon_place.svg" alt="">
          <span>{{$t('i18n.taskPlace')}}</span>
        </div>
        <div class="qwui-add_module_item" v-if="mainModuleShow && !isDetailPage" @click="addModule(addTypeArr[3])">
          <img src="../../../../assets/svg/group.svg" alt="">
          <span>{{$t('i18n.taskProgressFeedback')}}</span>
        </div>
        <div class="qwui-add_module_item" v-if="mainModuleShow" @click="addModule(addTypeArr[4])">
          <img src="../../../../assets/svg/group1.svg" alt="">
          <span>{{$t('i18n.taskRemind')}}</span>
        </div>
        <div class="qwui-add_module_item" v-if="mainModuleShow || addSubTaskPermission" @click="addModule(addTypeArr[5])">
          <img src="../../../../assets/svg/group2.svg" alt="">
          <span>{{$t('i18n.subTask')}}</span>
        </div>
        <div class="qwui-add_module_item" v-if="subTaskPage" @click="addModule(addTypeArr[7])">
          <img src="../../../../assets/svg/icon_a-add_enclosure.svg" alt="">
          <span>{{$t('i18n.priority')}}</span>
        </div>
        <div class="qwui-add_module_item" v-if="mainModuleShow || subTaskPage" @click="addModule(addTypeArr[8])">
          <img src="~assets/svg/icon_a-image_upload.svg" alt="">
          <span>图片</span>
        </div>
        <div class="qwui-add_module_item" v-if="mainModuleShow || subTaskPage" @click="addModule(addTypeArr[6])">
          <img src="../../../../assets/svg/icon-enclosure.svg" alt="">
          <span>附件</span>
        </div>
      </div>
      <div class="qwui-close" @click="closeAddContent"></div>
    </div>
  </transition>
</template>

<script>
  import { isVipGold } from '@/assets/js/vip-portal';
  export default {
    props:['addModuleConfig','addModuleType'],
    data(){
      return{
        addModuleContentHeight:null,//添加模块内容高度
        addTypeArr:[0,1,2,3,4,5,6,7,8],//0开始时间，1相关人，2任务地点，3进度反馈，4提醒，5子任务，6附件，7优先级,8图片
      }
    },
    created(){
      this.changeClientHeight();
      window.onresize = this.changeClientHeight();

    },
    mounted(){
      if(this.addModuleType=='mainAddModule'){
        window.sessionStorage.setItem('mainModuleNum',this.$refs.module_num.children.length)
        this.$store.commit('mainModuleNumUpdate');
      }else if(this.addModuleType=='subAddModule'){
        window.sessionStorage.setItem('subModuleNum',this.$refs.module_num.children.length)
        this.$store.commit('subModuleNumUpdate');
      }
    },
    methods:{
      changeClientHeight(){
        if(document.documentElement.clientHeight>0){
          this.addModuleContentHeight= window.screen.height;
        }else{
          this.addModuleContentHeight="auto";
        }
      },
      addModule(type){
        if (type == 5 && (!isVipGold(interfaceCode.INTERFACE_CODE_TASK) || !this.$store.getters.taskPermission.openSubtask)){
          _.alert("", "亲爱的用户，后台没有开启子任务功能，请联系管理员开启");
          return;
        }
        if (type == 2 && !this.$store.getters.taskPermission.openAccessAddress){
          _.alert('','亲爱的用户，后台没有开启任务地点功能，请联系管理员开启');
          return;
        }
        this.$emit('addType',type);
      },
      closeAddContent(){
        window.sessionStorage.removeItem('addModuleType');
        if(this.addModuleType=='mainAddModule'){
          window.sessionStorage.removeItem('fromAddContent');
        }
        this.addModuleConfig.show = false;
      },
      moduleTypeJudge(mainReturnData,subReturnData){
        if(this.addModuleType=='mainAddModule'){
          return mainReturnData;
        }else if(this.addModuleType=='subAddModule'){
          return subReturnData;
        }
      },
    },
    computed:{
      addSubTaskPermission(){
        return this.$store.getters.taskLevel == 'a2' && this.$store.getters.taskPermission.openSubtask == 2 && !this.$store.getters.subTaskPage && !this.$store.getters.taskOver;
      },
      mainTaskPage(){
        return this.addModuleType == 'mainAddModule';
      },
      mainModuleShow(){
        return this.mainTaskPage && !this.addSubTaskPermission
      },
      subTaskPage(){
        return this.addModuleType == 'subAddModule';
      },
      isDetailPage(){
        return this.$store.getters.isDetailPage;
      },
      mainAddModuleShow(){
        return this.moduleTypeJudge(this.$store.getters.mainAddContentModuleShow,this.$store.getters.subAddContentModuleShow);
      },
      relevantPersonShow(){
        return this.moduleTypeJudge(this.$store.getters.relevantPersonDisplay,true);
      },
      placeShow(){
        return this.moduleTypeJudge(this.$store.getters.placeDisplay,true);
      },
      rateShow(){
        return this.moduleTypeJudge(this.$store.getters.rateAddContentDisplay,false);
      },
      remindShow(){
        return this.moduleTypeJudge(this.$store.getters.remindDisplay,true);
      },
      subTaskShow(){
        return this.moduleTypeJudge(this.$store.getters.subTaskDisplay,true);
      },
      enclosurePicShow(){
        return this.moduleTypeJudge(this.$store.getters.mainEnclosurePicAddContentDisplay,this.$store.getters.subEnclosurePicAddContentDisplay);
      },
      priorityShow(){
        return this.moduleTypeJudge(false,this.$store.getters.priorityDisplay);
      }
    },
    watch:{
      mainAddModuleShow(val){
        if(this.addModuleType=='mainAddModule') {
          this.addModuleConfig.show = this.$store.getters.mainAddContentModuleShow;
          if (val) {
            this.addModuleConfig.show = this.$store.getters.mainAddContentModuleShow;
          }
        }else if(this.addModuleType=='subAddModule'){
          this.addModuleConfig.show = this.$store.getters.subAddContentModuleShow;
          if (val) {
            this.addModuleConfig.show = this.$store.getters.subAddContentModuleShow;
          }
        }
      }
    }
  }
</script>

<style type="text/css">
  @media screen and (min-width:1024px) {
    .qwui-add_module{
      width: 740px !important;
      margin: 0 auto;
    }
  }
  .bounce-pop-enter,.bounce-pop-leave-to{
    transform: translateY(100%);
  }
  .bounce-pop-enter-active,.bounce-pop-leave-active {
    transition: all .3s;
  }
  .qwui-add_module{
    position: fixed;
    width: 100%;
    top:0;
    left: 0;
    right: 0;
    margin: 0 auto;
    background: #fff;
    z-index: 9;
  }
  .qwui-add_module_box{
    display: flex;
    flex-wrap:wrap;
    padding: 20px;
  }
  .qwui-add_module_item{
    position: relative;
    flex:0 1 28%;
    width: 28%;
    padding-top: 28%;
    margin-bottom: 26px;
    border:1px solid #F4F6F8;
    border-radius:4px;
    box-sizing: border-box;
  }
  .qwui-add_module_item:not(:nth-child(3n)){
    margin-right: 8%;
  }
  .qwui-add_module_item img{
    position: absolute;
    left:50%;
    top: 23%;
    width: 36px;
    height: 36px;
    transform: translateX(-50%);
  }
  @media screen and (max-width:350px) {
    .qwui-add_module_item img{
      top: 15%;
    }
  }
  .qwui-add_module_item span{
    position:absolute;
    left: 50%;
    top:60%;
    width: 100%;
    color:#0A1735;
    font-size: 12px;
    line-height: 17px;
    text-align: center;
    transform: translateX(-50%);
  }
  .qwui-close{
    position: absolute;
    bottom: 22px;
    width: 46px;
    height: 46px;
    transform: translateX(-50%);
    left: 50%;
    border-radius: 50%;
    box-sizing: border-box;
    background: url("../../../../assets/svg/icon_a-add_back.svg") no-repeat;
  }
</style>

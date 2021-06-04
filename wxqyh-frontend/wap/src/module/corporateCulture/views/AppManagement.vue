<template>
  <div class="qwui-app_management">
    <div class="wrap">
      <div class="management_head">
        <span>应用管理</span>
        <img src="../../../assets/images/icon_a-public_info.png" alt="" @click="tipsClick">
      </div>
      <div class="management_item" v-for="(item,index) in managementItem" :key="index">
        <img :src="item.itemSrc" alt="">
        <div class="item_box">
          <p class="item_name">{{item.itemName}}</p>
          <p class="item_supplement">{{item.itemSupplement}}</p>
        </div>
        <div class="qwui-onOff_choose top" :class="{'qwui-onOff_on': item.isOpen, 'qwui-onOff': !item.isOpen}" @click="changeCloseSwitch(index)">
          <span class="qwui-onOff_off" :class="{'active': item.isOpen}"></span>
        </div>
      </div>
    </div>
    <div class="bottom_btn qwui-btn_box ">
      <div class="cancel" @click="goBack">取消</div>
      <div class="save" @click="save">保存</div>
    </div>
    <dialog-group :title="dialog.dialogTitle"
                  :show="dialog.dialogShow"
                  @cancel="cancelDialog"
                  @confirm="confirmDialog"
                  :cancelText="dialog.cancelText"
                  :confirmText="dialog.confirmText">
      <slot>
        <div class="saveConfirm" v-if="confirmType">
          <p>
            保存成功后会刷新“企微云文化”页面，对主应用可见范围的所有成员生效，确认保存？
          </p>
        </div>
        <div class="tips" v-else>
          <p>1.仅超管与托管该应用的管理员可设置；</p>
          <p>2.应用关闭后，所有成员的应用端不显示相应图标的入口；</p>
          <p>3.模块关闭后，创建的数据不会丢失，可再次开启使用；</p>
          <p>4.如未单独托管这些应用，关闭后管理后台对应入口不再显示。</p>
        </div>
      </slot>
    </dialog-group>
  </div>
</template>
<script>
import dialogGroup from '@/components/base/dialog/dialog-group'
import {saveAppChange,getCustomAgent} from '../api/getData';
export default {
  name:'app_management',
  data(){
    return{
      managementItem:[
        {
          itemSrc:require('../../../assets/svg/icon_a-homepage_btn1.svg'),
          itemName:'同事社区',
          itemSupplement:'同事社交圈，分享精彩身边事',
          isOpen:0,
          agentCode:'topic',
        },
        {
          itemSrc:require('../../../assets/svg/A1_btn_3.svg'),
          itemName:'企业活动',
          itemSupplement:'多形式企业活动、现场活动',
          isOpen:0,
          agentCode:'activity',
        },
        {
          itemSrc:require('../../../assets/svg/A1_btn_2.svg'),
          itemName:'问卷投票',
          itemSupplement:'多种题型，图表统计，匿名问卷',
          isOpen:0,
          agentCode:'survey',
        }
      ],
      closeSwitch:false,
      dialog:{
        dialogTitle:'',
        dialogShow:false,
        cancelText:'',
        confirmText:'',
      },
      confirmType:0,//弹出框类型 0为提示弹出框 1为保存弹出框
    }
  },
  computed:{
    hasOpen(){
      return this.managementItem[0].isOpen||this.managementItem[1].isOpen||this.managementItem[2].isOpen
    }
  },
  created(){
    this.managementItem[0].itemName = this.$route.query.topicTitleName;
    this.managementItem[2].itemName = this.$route.query.surveyTitleName
    var self = this;
    getCustomAgent((data)=>{
      data.customAgentList.forEach(function(item,index){
          if(item.agentCode == 'topic'){
            self.managementItem[0].isOpen=item.agentStatus;
          }else if(item.agentCode == 'activity'){
            self.managementItem[1].isOpen=item.agentStatus;
          }else if(item.agentCode == 'survey'){
            self.managementItem[2].isOpen=item.agentStatus;
          }
        });
    })
  },
  methods:{
    changeCloseSwitch(index){
      this.managementItem[index].isOpen=!this.managementItem[index].isOpen;
      if(!this.hasOpen){
        this.managementItem[index].isOpen=true;
        _.alert('','至少开启一个应用');
      }
    },
    tipsClick(){
      this.dialog.dialogTitle='应用管理';
      this.dialog.dialogShow=true;
      this.dialog.cancelText='';
      this.dialog.confirmText='我知道了';
      this.confirmType=0;
    },
    cancelDialog(){
      this.dialog.dialogShow=false;
    },
    confirmDialog(){
      if(this.confirmType===1){
        let enableAgentCodes='';
        for(let i=0;i<this.managementItem.length;i++){
          if(this.managementItem[i].isOpen){
            enableAgentCodes+=this.managementItem[i].agentCode+',';
          }
        }
        enableAgentCodes=enableAgentCodes.substring(0,enableAgentCodes.length-1);
        saveAppChange(enableAgentCodes,()=>{
          this.$router.go(-1);
        })
        console.log(enableAgentCodes)
      }
      this.dialog.dialogShow=false;
    },
    save(){
      this.confirmType=1;
      this.dialog.dialogTitle='保存设置';
      this.dialog.dialogShow=true;
      this.dialog.cancelText='取消';
      this.dialog.confirmText='确定';
    },
    goBack(){
      this.$router.go(-1);
    }
  },
  components:{
    dialogGroup,
  }
}
</script>
<style lang="scss" scoped>
  .qwui-app_management{
    .wrap{
      padding: 0 14px;
      background: #fff;
      .management_head{
        height: 54px;
        display: flex;
        align-items:Center;
        border-bottom: 1px solid #F7F8FA;
        span{
          color: #0A1735;
          font-size: 16px;
          font-weight: 600;
        }
        img{
          width: 16px;
          margin-left: 6px;
        }
      }
      .management_item{
        display: flex;
        position: relative;
        padding: 17px 0 19px;
        img{
          height: 40px;
          width: 40px;
          object-fit: cover;
        }
        .item_box{
          margin-left: 12px;
          .item_name{
            color: #0A1735;
            font-size: 14px;
            font-weight: 600;
          }
          .item_supplement{
            columns: #B2B9C8;
            font-size: 12px;
          }
        }
      }
    }
    .bottom_btn{
      display: flex;
      position: absolute;
      width: 100%;
      padding: 8px 14px;
      background: #fff;
      bottom: 0;
      justify-content: space-between;
      box-sizing: border-box;
      .cancel{
        height: 44px;
        flex: 1;
        color: #fff;
        text-align: center;
        font-size: 15px;
        line-height: 44px;
        background: #B2B9C8;
        margin-right: 13px;
        border-radius: 4px;
      }
      .save{
        height: 44px;
        flex: 1;
        color: #fff;
        text-align: center;
        font-size: 15px;
        line-height: 44px;
        background: #5585F0;
        border-radius: 4px;
      }
    }
  }
  @media screen and (min-width: 1024px) {
    .wrap,.bottom_btn{
      width:740px!important;
    }
  }
  .tips{
    padding: 0 30px 0 31px;
    margin-bottom: 17px;
    p{
      color: #7A7C80;
      font-size: 16px;
      text-align: left;
    }
  }
  .saveConfirm{
    padding: 0 30px 0 31px;
    margin-bottom: 25px;
    p{
      color: #7A7C80;
      font-size: 16px;
    }
  }
  .top{
    top: 28px;
  }
</style>



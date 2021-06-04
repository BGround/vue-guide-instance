<template>
  <div>
    <div class="qwui-dialog" v-if="dialogShow">
        <div class="dialog-content-up">{{content.date}}</div>
        <div class="dialog-content-down">
          <div class="dialog-content-msg">
            <div class="dialog-content-money" :class="content.statusDesc.indexOf('驳回')>-1 ? 'dialog-content-reject': ''">{{content.money}}</div>
            <div class="dialog-content-status" :class="content.statusDesc.indexOf('驳回')>-1 ? 'dialog-content-reject': ''">{{content.statusDesc}}</div>
            <div class="dialog-content-tips">{{content.tips}}</div>
          </div>

          <div class="dialog-content-reim-item"  v-if="content.reimbursement && content.reimbursement.title">
            <div class="dialog-content-reim" @click="goReim(content.reimbursement)">
              <span class="reim-title">{{content.reimbursement.title}}</span>
              <span class="reim-right">
                <span class="reim-money">¥ </span>
                <span class="reim-money">{{content.reimbursement.money}}</span>
                <i class="click_icon"></i>
              </span>
            </div>
          </div>
           <div class="qwui-dialog_footer" @click="closeStatusDialog">
              确定
           </div>
        </div>
        <div class="round left-round"></div><div class="round right-round"></div>
    </div>
    <div class="qwui-mask" v-show="dialogShow"></div>

    <!--报销单详情-->
    <reim_detail :isShowReimdetail.sync="isShowReimdetail" :reimId="reimId"></reim_detail>

  </div>
</template>
<script>
  import dialogGroup from '@/components/base/dialog/dialog-group';
  import EventBus from '@/utils/eventBus';
  import reim_detail from '../../views/Debit/Detail/reimDetail'     //关联报销单详情
  export default {
    name: 'QwStatusDialog',
    components:{
      dialogGroup,
      reim_detail
    },
    props: {
      dialogShow:{ //是否显示弹窗
        type: Boolean,
        default:false
      },
      content:{
        type:Object,
        default:{}
      }
    },
    data() {
      return {
        isShowReimdetail:false, //是否展开报销单详情
        reimId:'',        //关联报销单详情id
      }
    },
    methods:{
      closeStatusDialog(){
        this.$emit('close',false);
      },
      goReim(item){
        this.isShowReimdetail = true;
        EventBus.$emit("openReimDetail",item.id);
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import '~../../styles/common.scss';
  .qwui-dialog{
    position: fixed;
    z-index: 11;
    top: 50%;
    left: 50%;
    width: 80%;
    max-width: 640px;
    max-height: 450px;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    border-radius: 4px;
    text-align: center;
    overflow: hidden;
  }
  .dialog-content{

  }
  .dialog-content-up{
    height: 50px;
    background: #fff;
    border-bottom: 1px dashed #EFEFF5;
    font-size: 14px;
    color: #9196A1;
    text-align: center;
    line-height: 50px;
  }
  .dialog-content-down{
    padding: 15px 5px 25px 5px;
    background: #fff;
  }
  .dialog-content-msg{
    margin-bottom: 20px;
  }
  .dialog-content-money{
    height:48px;
    font-size:34px;
    color: #3F4A64;
    line-height:48px;
  }
  .dialog-content-status{
     height:21px;
     font-size:15px;
     color:#458BE9;
     line-height:21px;
   }
  .dialog-content-reject{
    color:#F76161;
  }

  .dialog-content-tips{
    padding: 10px 0;
    height:18px;
    font-size:13px;
    color:#9196A1;
    line-height:18px;
  }
  .dialog-content-reim-item{
    margin-bottom: 60px;
  }
  .dialog-content-reim{
    padding: 16px 20px 0 20px;
    border-top: 1px dashed #eee;
    color: #3F4A64;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
  }
  .reim-title{
    padding-right: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 15px;
    text-align: left;
  }
  .reim-right{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
  }
  .reim-money{
    font-size:17px;
  }
  .qwui-dialog_footer{
    margin: 5px 20px 0 20px;
    height:44px;
    background:#458BE9;
    border-radius:4px;
    font-size: 16px;
    text-align: center;
    color:#fff;
    line-height: 44px;
  }
  .qwui-mask{
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    background: #596175;
  }
  .round{
    width: 20px;
    height: 20px;
    background: #596175;
    position: absolute;
    top: 40px;
    border-radius: 10px;
  }
  .left-round{
    left: -12px;
  }
  .right-round{
    right: -12px;
  }
  .click_icon{
    display: inline-block;
    position: relative;
    margin-left: 10px;
    top: 1px;
    width: 10px;
    height: 15px;
    background: 0 0 url(../../../../assets/images/CSSSprites.png) no-repeat;
    background-size: 100px 100px;
  }
</style>

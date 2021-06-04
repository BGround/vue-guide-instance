<template>
  <dialog-group :title="'输入金额'"
                :show="dialogShow"
                @cancel="cancelDialog"
                @confirm="confirmDialog"
                cancelText="取消"
                confirmText="还款">
    <div class="pay-content">
      <div class="cash">
        <input type="text" v-model="payMoney" ref="input"  class="pay-money" @focus="focus" @input="limitMoney">
        <div class="pay-money-button" @click="payAll">全部还款</div>
      </div>
      <p class="pay-tips" :class="{'change_color':errTip}">{{tipContent}}</p>
    </div>
  </dialog-group>
</template>
<script>
  import dialogGroup from '@/components/base/dialog/dialog-group';
  export default {
    name: 'QwPayDialog',
    components:{
      dialogGroup
    },
    props: {
      dialogShow:{ //是否显示弹窗
        type: Boolean,
        default:false
      },
      countRePayMoney:{//共需还款金额
        type: Number,
        default:0
      }

    },
    data() {
      return {
        payMoney:'',
        tipContent:'',
        errTip:false,
      }
    },
    watch:{
     countRePayMoney(val){
        this.tipContent='共需还款'+val +'元';
      }
    },
    created(){

    },
    methods:{
      cancelDialog() {//取消
        this.$emit('closeDialog',false);
      },
      confirmDialog() {//还款
        //还款接口
        var pattern = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
//        this.payMoney =   _.formatMoney(this.payMoney, 2);
        if(this.payMoney=='' || !pattern.test(this.payMoney) || this.payMoney<=0){
          this.errTip = true;
          this.tipContent = '还款金额必须大于0并在两位小数以内';
        }else if(this.countRePayMoney<this.payMoney){
          this.errTip = true;
          this.tipContent = '金额不能大于总还款金额';
        }else{
          this.$emit('payBack',this.payMoney);
        }
      },
      payAll(){//填写全额
        this.payMoney = this.countRePayMoney;
        this.errTip = false;
        this.tipContent='共需还款'+this.countRePayMoney +'元';
      },
//      金额框获取焦点
      focus(){
        this.errTip = false;
        this.tipContent='共需还款'+this.countRePayMoney +'元';
      },
      // 限制最长十位数,最多两位小数
      limitMoney(e) {
        let match = e.target.value.match(/^\d{1,8}\.\d{0,2}|\d{1,8}/);
        e.target.value = match ? match[0] : '';
        this.payMoney= match ? match[0] : '';
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import '~../../styles/common.scss';
  .pay-content{
    display: inline-block;
    margin: 30px 0 20px 0;
    text-align: left;
    font-size: 0;
  }
  .cash{
    display: inline-block;
    /*border: 1px solid #DDD;*/
    border-radius: 4px;
    clear: both;
  }
  .pay-money{
    height: 20px;
    color: #3F4A64;
    border-bottom: 1px solid #DADDE4;
    font-size:16px;
    padding: 5px;
    margin-right: 10px;
    float: left;
    width: 135px;
  }
  .pay-money-button{
    display: inline-block;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    color: #fff;
    font-size: 13px;
    border-radius: 2px;
    background-color: #458BE9;
    float: left;
  }
  .pay-tips{
    margin: 10px;
    font-size: 13px;
    color: #B2B9C8;
  }
  .change_color{
    color:#F76161;
  }
</style>

<template>
  <div class="qwui-auditBtn">
    <div class="qwui-btn_list">
      <div class="qwui-btn qwui-marginRight" :class="{'qwui-cannotAudit':ableClick}" @click="cannotPass">{{btnText.leftBtn}}</div>
      <div class="qwui-btn" :class="{'qwui-audit':ableClick}" @click="pass">{{btnText.rightBtn}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name:'audit-btn',
  props:{
    ableClick:{
      type:Boolean,
      default:false,
    },
    btnText:{
      type:Object,
      default:function(){
        return {
          leftBtn:'不通过',
          rightBtn:'通过'
        }
      }
    }
  },
  data(){
    return {
      
    }
  },
  methods:{
    cannotPass(){
      if(this.ableClick){
        this.$emit('cannotPass');
      }
    },
    pass(){
      if(this.ableClick){
        this.$emit('pass');
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.qwui-auditBtn{
  .qwui-btn_list{
    display: flex;
    width: 100%;
    padding: 7px 14px;
    background: #fff;
    justify-content: space-between;
    box-sizing: border-box;
    .qwui-btn{
      height: 36px;
      flex: 1;
      color: #fff;
      cursor: pointer;
      font-size: 15px;
      text-align: center;
      line-height: 36px;
      border-radius: 4px;
      background: #E3E4E8;
    }
    .qwui-marginRight{
      margin-right: 13px;
    }
    .qwui-cannotAudit{
      background: #B2B9C8;
    }
    .qwui-audit{
      background: #5585F0;
    }
  }
}
</style>



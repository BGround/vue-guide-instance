<template>
  <div class="operation-btn">
      <div class="operation-option">
        <div class="option"
             v-for="item in buttonData"
             :key="item.key"
             @click="emitFun(item)">{{ item.value}} <img v-if="item.key < 3 && !isVip" src="../../../assets/images/tag_vipgold_large.png"></div>
      </div>
  </div>
</template>

<script>
  export default {
    name: 'operation',
    props:{
      isTask: {
        type: String,
        default: ''
      },
      isVip: {
        type: Boolean,
        default: false,
      },
      creator: {
        type: String,
        default: '',
      }
    },
    computed:{
      buttonData(){
        var buttonData =
          [{
            key:3,
            value:'手机端页面打印'
          },
          {
            key:4,
            value:'删除明细'
          }];
        //审批单则插入流程干预的按钮
          if(this.isTask == '2' || (this.isTask == '3' && this.creator)){
            buttonData = [{
                key:1,
                value:'流程干预'
              },{
              key:2,
              value:'结束流程'
            }].concat(buttonData)
          }
          return buttonData;
      }
    },
    methods:{
      emitFun(item){
        this.$emit('operateFun',item.key);
      }
    }
  }
</script>

<style scoped>
  .operation-btn {
    position: relative;
    width: 300px;
    height: 330px;
    padding: 4px 0;
    font-size: 13px;
    color: #444;
  }
  .operation-option {
    position: absolute;
    padding: 4px 0;
    z-index: 1000;
    line-height: 32px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.25);
    text-align: left;
  }
  .option {
    cursor: pointer;
    box-sizing: content-box;
    padding: 0 16px;
    font-size: 14px;
    color: #333;
    white-space: nowrap;
  }
  .option img {
    width: 28px;
  }
  .option:hover {
    background-color: #f5f5f5;
  }
</style>

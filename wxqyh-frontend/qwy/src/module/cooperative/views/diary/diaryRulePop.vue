<template>
  <div v-show="popData.popShow">
    <div class="qwui-mask_layer"></div>
    <div class="qwui-pop_box" ref="popBox">
      <div class="titleItem">
        <span>{{ popData.popTitle }}</span>
        <i @click="closeThis">×</i>
      </div>
      <div class="contentItem">
        <slot></slot>
      </div>
      <div class="buttonItem">
        <qwui-button class="btnStyle"
                     v-for="(item,key) in popData.buttonConfig"
                     :key="key"
                     :type="item.type"
                     @click="buttonFunc(key)">{{ item.text }}</qwui-button>
      </div>
    </div>
  </div>
</template>

<script>
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';

  export default {
    props:{
      popData:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    data(){
      return {

      }
    },
    watch:{
      'popData.popShow':function () {
        this.$nextTick(function(){  //页面加载完成后执行
          let h = this.$refs.popBox.offsetHeight;
          this.$refs.popBox.style.marginTop = -(h/2) + 'px';
        })
      }
    },
    methods:{
      closeThis(){
        this.$emit('listenClose')
      },
      buttonFunc(key){
        this.$emit('listenBtnFunc',key)
      }
    },
    components:{
      qwuiButton,
    }
  }
</script>

<style lang="scss" scoped>
  .qwui-mask_layer {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 9;
  }
  .qwui-pop_box {
    position: fixed;
    /*display: none;*/
    width: 600px;
    height: auto;
    top: 50%;
    left: 50%;
    margin-left: -300px;
    /*transform: translate(-50%, -50%);*/
    z-index: 10;
    overflow: auto;
    background: #f7f7f7;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);

    .titleItem {
      background: #ececec;
      color: #333;
      font-size: 18px;
      height: 45px;
      line-height: 45px;
      padding-left: 20px;
      position: relative;
      text-align: left;
      border-bottom: 1px solid #dddddd;

      i {
        cursor: pointer;
        font-style: normal;
        position: absolute;
        right: 0;
        width: 50px;
        text-align: center;
        color: #bbb;
        font-size: 28px
      }
    }

    .contentItem {
      height: 400px;
      padding: 30px 35px;
      box-sizing: border-box;
      overflow-y: auto;
    }

    .buttonItem {
      margin-top: 30px;
      text-align: center;
      background: #ececec;
      padding: 10px;

      .btnStyle {
        margin-right: 10px;
      }
    }
  }
</style>

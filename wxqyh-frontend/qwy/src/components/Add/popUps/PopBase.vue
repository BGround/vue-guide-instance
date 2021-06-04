<template>
  <div v-show="popData.popShow">
    <div class="qwui-mask_layer">
      <div class="qwui-pop_box" ref="popBox" :style="{ width:(popData.width || 600) + 'px' }">
        <div class="titleItem">
          <span class="title">{{ popData.popTitle }}</span>
          <i @click="closeThis">×</i>
        </div>
        <div class="contentItem" :style="{ minHeight:(popData.minHeight || 400) + 'px' }" ref="contentItem">
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
    created(){
      this.$nextTick(function(){  //页面加载完成后执行
        this.$refs.contentItem.style.maxHeight = document.documentElement.clientHeight - 128 + 'px';
      });
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
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.5);
    z-index: 9;
  }
  .qwui-pop_box {
    position: fixed;
    height: auto;
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

      .title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        width: 90%;
      }

      i {
        cursor: pointer;
        font-style: normal;
        position: absolute;
        top: 0;
        right: 0;
        width: 50px;
        text-align: center;
        color: #bbb;
        font-size: 28px
      }
    }

    .contentItem {
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

<template>
    <div>
      <div class="qwui-dialog" v-if="show">
        <div class="qwui-dialog_header" v-if="title">
          <strong class="qwui-dialog_title">{{title}}</strong>

        </div>
        <div class="qwui-dialog_content_box">
          <slot></slot>
        </div>
        <div class="qwui-dialog_footer">
        <a class="qwui-dialog_btn qwui-dialog_btn_default"
          :class="{'btn-primary': btn.isPrimary}"
          v-for="(btn, index) in btnConfig"
          :key="index"
          @click="emitEvent(btn.callbackName)"
        >
          {{btn.text}}
        </a>
        </div>
      </div>
      <div class="qwui-mask" v-show="show"></div>
    </div>
</template>

<script>
    export default {
      name: "dialog-group",
      props: {
        title: {
          type: String,
          default: ''
        },
        show: {
          type: Boolean,
          default: false
        },
        btnConfig: {
          type: Array,
          default: [
            {
              text: '确定',
              callbackName: 'confirm',
              isPrimary: true
            },
            {
              text: '取消',
              callbackName: 'cancel',
              isPrimary: false
            }
          ]
        }
      },
      data() {
        return {
        }
      },
      methods: {
        emitEvent(str) {
          this.$emit(str)
        }
      }
    }
</script>

<style scoped>
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
    background-color: #fff;
    overflow: hidden;
  }
  .qwui-dialog_header{
    padding: 20px 25px 8px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .qwui-dialog_title{
    font-size: 17px;
    color: #333;
    font-weight: 400;
    line-height: 28px;
  }
  .qwui-dialog_content_box{
    padding: 0 10px;
  }
  .qwui-dialog_footer{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    position: relative;
    line-height: 48px;
    font-size: 18px;
  }
  .qwui-dialog_footer:after{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    border-top: 1px solid #e5e5e5;
    color: #D5D5D6;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .qwui-dialog_btn{
    display: block;
    position: relative;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    cursor: pointer;
  }
  .qwui-dialog_btn_default{
    color:rgba(51,51,51,1);
  }
  .qwui-dialog_btn_default:after{
    content: " ";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1px;
    border-right: 1px solid #e5e5e5;
    color: #D5D5D6;
    -webkit-transform: scaleX(0.5);
    transform: scaleX(0.5);
  }
  .qwui-dialog_btn{
    display: block;
    position: relative;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    cursor: pointer;
  }
  .qwui-dialog_btn.btn-primary {
    color: #FF586D;
  }
  .qwui-dialog_btn_primary{
    color:rgba(70,125,185,1);
  }
  .qwui-mask{
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.2);
  }
</style>

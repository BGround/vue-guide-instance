<template>
  <div class="Qw-sideslip">
    <transition  name="fold">
      <div v-if="show" class="slide-panel" :style="{ width: width + 'px'}">
        <div class="slide-panel-layout">
          <div class="slide-panel-header">
            <span class="slide-panel-header-close" @click="onShow">×</span>
          </div>
          <div class="slide-panel-body">
            <slot></slot>
          </div>
        </div>
      </div>
    </transition >
    <div v-if="show"  @touchmove.prevent  class="popContainer"></div>
  </div>
</template>
<script>
  export default {
    name:'QwSideslip',
    props: {
      show: Boolean,
      width: {
        type: Number,
        default: 500
      }
    },
    methods: {
      onShow() {
        this.$emit('changeShow', false)
      }
    },
    watch: {
      show: {
        handler: function(newVal, oldVal) {
          this.show = newVal;
          if(this.show){
            document.body.style.height = '100vh';
            document.body.style['overflow'] = 'hidden';
          }
          else{
            document.body.style.height = 'unset';
            document.body.style['overflow'] = 'auto';
          }
        },
        deep: true
      }
    },
    created(){

    },
    mounted() {
      document.body.appendChild(this.$el)
    },
    destroyed() {
      this.$el.remove()
    }
  }
</script>
<style>
  .slide-panel{
    width: 550px;
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    overflow: auto;
    z-index: 11;
    border-left:1px solid #ccc;
    background-color: #fff;
  }
  .slide-panel-layout{
    padding: 15px;
  }
  .slide-panel-header{
    position: absolute;
    right: 15px;
  }
  .slide-panel-header-close{
    position: absolute;
    right: 5px;
    top: 7px;
    width: 29px;
    height: 23px;
    float: right;
    font-size: 40px;
    font-weight: 100;
    line-height: 17px;
    color: #ccc;
    cursor: pointer;
    transition: transform .5s;
    -moz-transition: -moz-transform .5s;
    -webkit-transition: -webkit-transform .5s;
  }
  .slide-panel-header-close:hover{
    transform: rotate(-90deg);
  }
  .fold-enter-active {
    animation-name: fold-in;
    animation-duration: .5s;
  }
  .fold-leave-active {
    animation-name: fold-out;
    animation-duration: .5s;
  }
  @keyframes fold-in {
    0% {
      transform: translate3d(100%, 0, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes fold-out {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(100%, 0, 0);
    }
  }
  .popContainer{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background: rgba(0,0,0,0.3);
  }
</style>

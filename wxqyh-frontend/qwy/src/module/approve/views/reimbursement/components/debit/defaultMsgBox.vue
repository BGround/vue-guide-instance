<template>
  <div class="defaultMsgBoxs">
    <!--<div class="_mask" v-show="mask"></div>-->
    <transition name="loading_gd">
      <!--<div class="_loading"  v-show="loading"><div class="_loading_logo"></div><i></i></div>-->
    </transition>
    <div class="_alert_mask" v-if="alertShow" :style="{'z-index': zzIndex}">
      <div class="_alert_box">
        <div class="_alert_header">
          <h3 id="_alert_title">{{title}}</h3>
          <span class="_alert_del" @click='close'>×</span>
        </div>
        <div class="_alert_body">
          <slot name="body"></slot>
        </div>
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'defaultMsgBoxs',
    created:function(){

    },
    components: {

    },
    props:{
      alertShow:{
        type:Boolean,
        default:false
      },
      title:{
        type:String,
        default:''
      },
      zzIndex:{
        type:[String,Number],
        default:100
      }
    },
    data(){
      return {
        /*loading:true,
        mask:true*/
      }
    },
    computed:{

    },
    methods:{
      close:function(){
        this.$emit('update:alertShow',false)
      },
    }
  }

</script>

<style scoped>
  ._mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.3);
    z-index: 100;
  }
  ._loading{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-color: rgba(246,244,245,.84);
    z-index: 100;
  }
  .loading_gd-enter-active {
    transition: all 1.5s ease;
  }
  .loading_gd-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .loading_gd-enter, .loading_gd-leave-to {
    opacity: 0;
  }
  @keyframes loading{
    0%{
      transform:rotate(0deg);
      -ms-transform:rotate(0deg);   /* IE 9 */
      -moz-transform:rotate(0deg);  /* Firefox */
      -webkit-transform:rotate(0deg); /* Safari 和 Chrome */
      -o-transform:rotate(0deg);  /* Opera */
    }
    100%{
      transform:rotate(360deg);
      -ms-transform:rotate(360deg);   /* IE 9 */
      -moz-transform:rotate(360deg);  /* Firefox */
      -webkit-transform:rotate(360deg); /* Safari 和 Chrome */
      -o-transform:rotate(360deg);  /* Opera */
    }
  }

  @-o-keyframes loading{
    0%{
      transform:rotate(0deg);
      -ms-transform:rotate(0deg);   /* IE 9 */
      -moz-transform:rotate(0deg);  /* Firefox */
      -webkit-transform:rotate(0deg); /* Safari 和 Chrome */
      -o-transform:rotate(0deg);  /* Opera */
    }
    100%{
      transform:rotate(360deg);
      -ms-transform:rotate(360deg);   /* IE 9 */
      -moz-transform:rotate(360deg);  /* Firefox */
      -webkit-transform:rotate(360deg); /* Safari 和 Chrome */
      -o-transform:rotate(360deg);  /* Opera */
    }
  }
  @-moz-keyframes loading{
    0%{
      transform:rotate(0deg);
      -ms-transform:rotate(0deg);   /* IE 9 */
      -moz-transform:rotate(0deg);  /* Firefox */
      -webkit-transform:rotate(0deg); /* Safari 和 Chrome */
      -o-transform:rotate(0deg);  /* Opera */
    }
    100%{
      transform:rotate(360deg);
      -ms-transform:rotate(360deg);   /* IE 9 */
      -moz-transform:rotate(360deg);  /* Firefox */
      -webkit-transform:rotate(360deg); /* Safari 和 Chrome */
      -o-transform:rotate(360deg);  /* Opera */
    }
  }

  @-webkit-keyframes loading{
    0%{
      transform:rotate(0deg);
      -ms-transform:rotate(0deg);   /* IE 9 */
      -moz-transform:rotate(0deg);  /* Firefox */
      -webkit-transform:rotate(0deg); /* Safari 和 Chrome */
      -o-transform:rotate(0deg);  /* Opera */
    }
    100%{
      transform:rotate(360deg);
      -ms-transform:rotate(360deg);   /* IE 9 */
      -moz-transform:rotate(360deg);  /* Firefox */
      -webkit-transform:rotate(360deg); /* Safari 和 Chrome */
      -o-transform:rotate(360deg);  /* Opera */
    }
  }
  ._loading_logo{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 75px;
    height:75px;
    background: url(~/assets/images/loading.png) no-repeat;
    animation:loading 1.5s infinite linear ;
    -ms-animation:loading 1.5s infinite linear ;
    -moz-animation:loading 1.5s infinite linear ;
    -webkit-animation:loading 1.5s infinite linear ;
  }
  ._loading i{
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 44px;
    height:33px;
    background: url(~/assets/images/loading_logo.png) no-repeat;
  }
  ._alert_mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.3);
    /*z-index: 100;*/
  }
  ._alert_box{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: auto;
    border-radius: 5px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.31);
    border: 1px solid #cccccc;
    z-index: 100;
    background-color: #FFF;
  }
  ._alert_header{
    margin: 0 15px;
    padding: 0 15px;
    height: 60px;
    text-align: right;
    border-bottom: 1px solid #cccccc;
  }
  ._alert_header h3 {
    float: left;
    margin-top: 15px;
    display: inline;
    line-height: 36px;
    font-size: 18px;
    font-weight: bold;
  }
  ._alert_header ._alert_del {
    display: inline-block;
    margin-top: 15px;
    padding: 0 5px 4px;
    line-height: 30px;
    font-size: 30px;
    color: #999;
    cursor: pointer;
  }
  ._alert_header ._alert_del:hover {
    background-color: whitesmoke;
    border-radius: 6px;
  }
  ._alert_body{
    margin-top: 15px;
    padding: 0 15px;
    text-align: center;
  }
  ._alert_opt{
    padding:20px 0 30px;
    text-align: center;
  }
  .custom_btn+span{
    margin-left: 10px;
  }
</style>

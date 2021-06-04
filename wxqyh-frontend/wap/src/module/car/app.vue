<template>
  <div id="app" class="adapt_iphonex">
    <router-view v-if="dataBase.config" v-show="dataBase.isShow"></router-view>
      <!--页面必须引入-加载过渡效果以及弹窗 start-->
	  <loading v-if="dataBase.config"
			   :show="dataBase.loading.show"
			   :icon="dataBase.loading.icon"
			   :text="dataBase.loading.text">
	  </loading>
      <dialog_mask v-if="dataBase.config"></dialog_mask>
      <!--页面必须引入-加载过渡效果以及弹窗 end-->
      <user_choose :selectconfig="dataBase.selectConfig"
									 v-if="dataBase.selectConfig.show"
									 :tabActive="dataBase.selectConfig.signIndex =='depts'?'dept':'group'"
									 :closeUser="dataBase.selectConfig.signIndex =='depts'"
									 :closeGroup="dataBase.selectConfig.signIndex =='depts'"
                   :closeDeptTab="true"
									 :closeAllTab="dataBase.selectConfig.signIndex =='depts'">
			</user_choose>
  </div>
</template>
<script>
import dialog_mask from '@/components/base/dialog_mask';//弹窗组件
import loading from '@/components/base/loading';//加载中、操作成功提示组件（删除成功、提交成功）
import user_choose from '@/components/base/user_or_dept_select.vue' //js导入
import 'swiper/dist/css/swiper.min.css'
export default {
  name: 'app',
  data(){
    return {
      dataBase:dataBase
    }
  },
  components:{
    dialog_mask,
    loading,
    user_choose
  },
  created(){
    this.$i18n.locale = "zh-CN";
  }
}

</script>

<style>
  @import '~assets/css/style.css';
  html, body {
    font-family: 'PingFangSC-Regular';
    font-weight: 400;
    height: 100%;
  }
  /*企业用车列表*/
  .qwui-cardList {
    position: relative;
    padding-left: 14px;
    background-color: #fff;
  }
  .qwui-cardList-item {
    position: relative;
    padding: 16px 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .qwui-cardList-item:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #F7F8FA;
    color: #e5e5e5;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
  .qwui-cardList-item:last-child:after {
    border-bottom: none;
  }
  .qwui-cardList-item .flex h3 {
    color: #0A1735;;
    font-size: 16px;
    font-weight: normal;
    line-height: 1.4;
    padding-right: 60px;
    word-break: break-all;
  }
  .qwui-cardList-item p {
    color: #7A7C80;
    font-size: 14px;
    line-height: 20px;
    padding-top: 10px;
    padding-right: 14px;
  }
  .qwui-cardList-item p:nth-child(2){
    padding-top: 4px;
    line-height: 21px;
    font-size: 15px;
    color: #B2B9C8;
  }
  .qwui-cardList-item p:last-of-type {
    padding-top: 4px;
  }
  .icon-flag {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
    font-style: normal;
  }
  .icon-start{
    border: 1px solid #00E691;
  }
  .icon-end{
    border: 1px solid #FFC363;
  }
  .flexbox {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
  .flex {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    width: 100%;
  }
  .ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .qwui-cardList-item span.applyStatus{
    position: absolute;
    top:18px;
    right:14px;
    display: inline-block;
    line-height: 1em;
    padding: 2px 3px;
    border-radius: 2px;
    font-size: 11px;
    text-align: center;
    vertical-align: middle;
  }
  span.applyStatus.blue{
    border: 1px solid #5585f0;
    background-color: #F6F9FE;
    color: #5585f0;
  }
  span.applyStatus.green{
    border: 1px solid #28da98;
    background-color: #F4FDFA;
    color: #28da98 ;
  }
  span.applyStatus.red{
    border: 1px solid #ff586d;
    background-color: #FFF6F7;
    color:#ff586d;
  }
  span.applyStatus.gray{
    border: 1px solid #999;
    background-color: #FAFAFA;
    color:#999;
  }
  span.applyStatus.orange{
    border: 1px solid #ffae2d;
    background-color: #FFFCF7;
    color: #ffae2d;
  }
  /* 滑动效果 */
  .slide-enter-active, .slide-leave-active {
		transition: all .2s ease;
	}
	.slide-enter, .slide-leave-to {
		transform: translate3d(100%, 0, 0);
    margin: 0 auto;
	}
</style>

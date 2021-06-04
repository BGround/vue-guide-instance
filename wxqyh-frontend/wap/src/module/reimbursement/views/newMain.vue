<template lang="html">
  <div class="main-container">
    <router-view></router-view>
    <!--底部导航-->
    <Nav_footer>
      <Tab_one tab="我的报销"
               :index="1"
               :icon="checkIndex==1? 'icon reim_sel': 'icon reim_nor'"
               defaultColor="icon-LightBlue"
               :activeIndex="tabActiveIndex"
               @tabOneClick="$router.push({ path: '/newReimbursement'})"></Tab_one>
      <Tab_one tab="我的借款"
               :index="2"
               :icon="checkIndex==2? 'icon debit_sel': 'icon debit_nor'"
               defaultColor="icon-LightBlue"
               :activeIndex="tabActiveIndex"
               @tabOneClick="$router.push({path:'/debitList'})"></Tab_one>
      <Nav_icon icon="ic_add_menu" @navIconClick="navIconClick"></Nav_icon>
      <Tab_one tab="待我处理"
               :num="waitingNum"
               :index="3"
               :icon="checkIndex==3? 'icon deal_sel': 'icon deal_nor'"
               defaultColor="icon-LightBlue"
               :activeIndex="tabActiveIndex"
               @tabOneClick="$router.push({path:'/newRelated'})"></Tab_one>
      <Tab_one tab="更多"
               :index="4"
               :icon="checkIndex==4? 'icon budget_sel': 'icon budget_nor'"
               defaultColor="icon-LightBlue"
               :activeIndex="tabActiveIndex"
               @tabOneClick="$router.push({path:'/newMore'})"></Tab_one>
    </Nav_footer>

    <!--新建、草稿弹窗-->
    <Mask_fix :show.sync="showMaskFix" :colorType="''" :modal="true" :modalExtent="modalExtent" @modelClick="closeClick">
      <transition name="maskFix">
        <div class="qwui-addDraft_nav" v-if="showMaskFix1">
          <Nav_icon :icon="icon_reim" @navIconClick="navIconClickReimAdd">
            <p class="qwui-addDraft_nav_text">新建报销</p>
          </Nav_icon>
          <Nav_icon :icon="icon_debit" @navIconClick="navIconClickDebitAdd">
            <p class="qwui-addDraft_nav_text">新建借款</p>
          </Nav_icon>
          <Nav_icon :icon="icon_draft" @navIconClick="navIconClickDraft">
            <p class="qwui-addDraft_nav_text">草稿 <span v-if="draftNum" class="text-num">({{draftNum}})</span></p>
          </Nav_icon>
        </div>
      </transition>

      <!--删除交叉图标-->
      <div class="qwui-footer_close_fixed" @click="closeClick">
        <transition name="close">
          <span class="qwui-close_icon" v-show="showCloseIcon">×</span>
        </transition>
      </div>
    </Mask_fix>
  </div>
</template>

<script>
import { getWaitAndDraftNum } from '../api/debit';
import { mapMutations } from 'vuex';
import Nav_footer from '@/components/part/nav_footer';
import Nav_icon from '@/components/part/nav_icon';
import Tab_one from '@/components/part/tab_one';
import Mask_fix from '@/components/part/mask_fix';

export default {
  name: 'QwMain',
  components: {
    Nav_footer,
    Nav_icon,
    Tab_one,
    Mask_fix
  },
  data() {
    return {
      icon_reim:'icon_reim',
      icon_debit:'icon_debit',
      icon_draft:'icon_draft',
      checkIndex:1,

      showMaskFix: false,//显示新建、草稿弹窗
      showMaskFix1: false, //显示新建、草稿图标
      modalExtent:0.9,
      draftNum:0,// 草稿条数
      waitingNum:0, //待办数量
      showCloseIcon:false,
    };
  },
  created () {
    this.getWaitAndDraftNum()
  },
  updated() {

  },
  beforeDestroy () { // 组件销毁前刪除高级搜索条件
    /*sessionStorage.removeItem('newReimbursement');
    sessionStorage.removeItem('newRelated');
    sessionStorage.removeItem('debitList');*/
  },
  watch:{

  },
  computed:{
    //当前底部导航位置
    tabActiveIndex(){
      var index = '1';
      switch (this.$route.name){
        case 'newReimbursement':
          index = '1';
          break;
        case 'debitList':
          index = '2';
          break;
        case 'newRelated':
          index = '3';
          break;
        case 'newMore':
          index = '4';
          break;
      }
      this.checkIndex = index;
      this.getWaitAndDraftNum();
      return index;
    },
  },
  methods: {
    navIconClick(){
      this.showMaskFix1 = true;
      this.showMaskFix = true;
      this.modalExtent = 0.9;
      this.showCloseIcon=true;
    },
    closeClick(){
      this.modalExtent = 0;
      this.showMaskFix1=false;
      this.showCloseIcon = false;
      var self=this;
      setTimeout(function () {
        self.showMaskFix = false;
        self.showMaskFix1=false;
        self.showCloseIcon = false
      },500)
    },
    navIconClickReimAdd(){
      this.$router.push({path:'/add'});
    },
    navIconClickDebitAdd(){
      this.$router.push({path:'/debitAdd'});
    },
    navIconClickDraft(){
      this.$router.push({path:'/newDraft'});
    },

    // 获取草稿数量和待办数量
    getWaitAndDraftNum() {
      let _this = this;
      getWaitAndDraftNum().then((res) => {
        const { waitingNum, draftNum } = res.data;

        _this.waitingNum = waitingNum;
        _this.draftNum = draftNum;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '~../styles/common.scss';
  /deep/ .icon{
    width: 24px;
    height: 24px;
    margin: 2px;
  }
  /deep/ .reim_nor{
    background: url(~assets/images/reim/loan/ic_expense-nor.svg) no-repeat;
  }

  /deep/ .reim_sel{
    background: url(~assets/images/reim/loan/ic_expense-sel.svg) no-repeat;
  }
  /deep/ .debit_nor{
    background: url(~assets/images/reim/loan/ic_borrow-nor.svg) no-repeat;
  }
  /deep/ .debit_sel{
    background: url(~assets/images/reim/loan/ic_borrow-sel.svg) no-repeat;
  }
  /deep/ .deal_nor{
    background: url(~assets/images/reim/loan/ic_approval-nor.svg) no-repeat;
  }
  /deep/ .deal_sel{
    background: url(~assets/images/reim/loan/ic_approval-sel.svg) no-repeat;
  }
  /deep/ .budget_nor{
    background: url(~assets/images/reim/loan/ic_more-nor.svg) no-repeat;
  }
  /deep/ .budget_sel{
    background: url(~assets/images/reim/loan/ic_more-sel.svg) no-repeat;
  }
  /deep/ .qwui-footer_tab_item.active.icon-LightBlue .qwui-tab_text{
    color: #5585F0;
  }
  /deep/ .qwui-mask_body{
    background-color: #fff;
  }
  /deep/ .qwui-addDraft_nav_text{
    color: #485068 !important;
  }
  /deep/ .text-num{
    color: #485068 !important;
  }
  .qwui-addDraft_nav{
    display: flex;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding-bottom: 100px;
  }
  .qwui-addDraft_nav_text{
    padding-top: 5px;
    font-size: 14px;
    color: #333;
  }
  .text-num{
    color: #999;
  }
  .qwui-footer_close_fixed{
    display: inline-block;
    position: fixed;
    bottom: 10px;
    left: 50%;
    margin-left: -18px;
    z-index: 8;
    cursor: pointer;
  }
  /*关闭图标*/
  .qwui-close_icon{
    display: inline-block;
    font-size: 25px;
    line-height: 36px;
    width:36px;
    height: 36px;
    border: 1px solid #DADDE4;
    text-align: center;
    color: #B2B9C8;
    border-radius: 50%;
  }
  .close-enter-active{
    transition: all .3s;
  }

  .close-leave-active{
    transition: all .3s;
  }
  .close-enter{
    opacity: 0.6;
    transform: rotate(-180deg);
  }
  .close-leave-to{
    opacity: 0.6;
    transform: rotate(-225deg);
  }
  /deep/ .icon_reim{
    display: inline-block;
    width: 66px;
    height: 66px;
    background: url(~assets/images/reim/ic_reim_add.svg) no-repeat;
  }
  /deep/ .icon_debit{
    display: inline-block;
    width: 66px;
    height: 66px;
    background: url(~assets/images/reim/ic_debit_add.svg) no-repeat;
  }
  /deep/ .icon_draft{
    display: inline-block;
    width: 66px;
    height: 66px;
    background: url(~assets/images/reim/ic_add_draft.svg) no-repeat;
  }
  /deep/ .ic_add_menu{
    display: inline-block;
    width: 36px;
    height: 36px;
    background: url(~assets/images/reim/ic_add_menu.svg) no-repeat;
  }
</style>

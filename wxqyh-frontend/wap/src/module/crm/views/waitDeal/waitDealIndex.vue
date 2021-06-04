<template>
  <div class="waitDealList">
    <!--tab-->
    <div class="qwui-waitDeal_tab">
      <div class="tab_btn" :class="{active:showApproval}" @click="approval">审批</div>
      <div class="tab_btn" :class="{active:showRemind}" @click="remind">提醒</div>
    </div>
    <transition name="slide">
      <div class="listNum" :class="{listNumActive:isScroll}">
        <p v-show="showApproval">待审批合同({{totalRows}})</p>
        <p v-show="showRemind">即将回收客户({{totalRows2}})</p>
      </div>
    </transition>

    <!--审批，提醒-->
    <keep-alive>
      <component v-bind:is="currentView" @isScroll="scroll"></component>
    </keep-alive>

    <!--新建导航-->
    <div class="addNav">
      <crm-head-nav :headrdata="headData" :showNav="false" ref="crmHeadNav"></crm-head-nav>
    </div>
    <transition name="slide-fade">
      <div class="qwui-add_nav" v-if="show">
        <div class="qwui-add_main">
          <p class="qwui-add_main_title">创建新的</p>
          <div class="qwui-add_main_clearfix">
            <div class="qwui-nav_box_content add_content" v-for="(item,idx) in headData.addnav" :key="idx" @click="linkUrl(item)">
              <div class="qwui-nav_box_radius">
                <i class="qwui-nav_box_icon" :class="item.class">
                </i>
              </div>
              <span class="qwui-nav_box_text qwui-new_built_box_text">{{item.text}}</span>
            </div>
          </div>
        </div>
        <span class="qwui-add_close" v-on:click="show = false">
              <i></i>
          </span>
      </div>
    </transition>
    <!--新建按钮-->
    <div class="crm_fixed_nail" @click="showNewBuilt" ></div>

  </div>
</template>

<script>
  import crmHeadNav from '../base/crm_head_nav';
  import contractList from './contractList';
  import CustomerRecoveryList from './CustomerRecoveryList';
  import {getContractList} from '../../api/contract/getData.js'
  import {getRecycle} from '../../api/waitDeal/getData.js'
  import { mapActions } from 'vuex';
    export default {
      name: "waitDealIndex",
      components:{
        crmHeadNav,
        first:contractList,
        second:CustomerRecoveryList,
      },
      data(){
        return {
          headData:dataBase.crm.headData,//头部
          show:false,// 显示新建
          showApproval:true, //显示待审批
          showRemind:false, //显示提醒
          totalRows:0, //待审批列表条数
          totalRows2:0, //提醒列表条数
          isScroll:false,//列表是否滚动
          currentView:'first',//动态组件 当前组件
          fromTab:"", //是否从消息提醒进入待办列表的，1：否，0：是
        }
      },
      created(){
        this.goRemind();
        this.getApproveData();
        this.getRemindData();
      },
      beforeRouteEnter (to, from, next) {
        next(vm => {
          let obj = {
            isClear: false,
            name: 'crmIndex',
          }
          vm.setCacheArray(obj); //缓存index这个组件
        });
      },
      methods:{
        ...mapActions('list',[
          'setCacheArray'
        ]),

        //获取待审批列表条数
        getApproveData:function(){
          let listParam={
            ['tbCrmContractSearchVO.readStatus']:'',
            ['tbCrmContractSearchVO.submitStatus']: 1,
            ['tbCrmContractSearchVO.contractStatus']:'',
            ['tbCrmContractSearchVO.contractOwner']: 3,
            ['tbCrmContractSearchVO.contractType']:'',
            ['tbCrmContractSearchVO.startSearchTime']:'',
            ['tbCrmContractSearchVO.endSearchTime']:'',
            ['tbCrmContractSearchVO.startQueryTime']:'',
            ['tbCrmContractSearchVO.endQueryTime']:'',
            ['tbCrmContractSearchVO.startContractAmount']:'',
            ['tbCrmContractSearchVO.endContractAmount']:'',
            ['tbCrmContractSearchVO.startPaymentAmount']:'',
            ['tbCrmContractSearchVO.endPaymentAmount']:'',
            ['tbCrmContractSearchVO.startNonPaymentAmount']:'',
            ['tbCrmContractSearchVO.endNonPaymentAmount']:'',
            ['tbCrmContractSearchVO.startDeelTime']:'',
            ['tbCrmContractSearchVO.endDeelTime']:'',
            ['tbCrmContractSearchVO.startCreateTime']:'',
            ['tbCrmContractSearchVO.endCreateTime']:'',
            ['tbCrmContractSearchVO.contractName']:'',
            ['tbCrmContractSearchVO.clientName']:'',
            ['tbCrmContractSearchVO.chargePerson']:'',
            ['tbCrmContractSearchVO.relater']:'',
            ['tbCrmContractSearchVO.createPerson']:'',
            ['tbCrmContractSearchVO.keyWord']:'',
            'stageType': '0',
            'page':this.currPage,
          }
          getContractList(listParam).then(result => {
            this.totalRows = result.data.totalRows;
          })
        },

        //获取提醒列表条数
        getRemindData:function(){
          let listParam={
            'page':0,
          }
          getRecycle(listParam).then(result => {
            this.totalRows2 = result.data.totalRows;
          })
        },

        // 点击审批
        approval:function(){
          this.showApproval=true;
          this.showRemind=false;
          this.currentView='first'
        },

        //  点击提醒
        remind:function(){
          this.showApproval=false;
          this.showRemind=true;
          this.currentView='second';
        },

        //从待回收消息提醒进入提醒列表
        goRemind:function(){
          this.fromTab=this.$route.query.fromTab;
          if(this.fromTab == 0){
            this.showApproval=false;
            this.showRemind=true;
            this.currentView='second';
          }
        },

        //是否滚动页面
        scroll:function(val){
          this.isScroll=val==true? true:false;
        },

        //新建按钮
        showNewBuilt(){
          this.show=true;
        },

        //进入新增页面
        linkUrl(item){
          if (item.url.includes('jsp')) {
            location.href = _.baseURL + item.url;
            this.show= false;
          } else {
            this.$router.push({name: item.url});
            this.show= false;
          }
        }
      }
    }
</script>

<style lang="scss" >
  @import '../../components/CrmFixedNail/CrmFixedNail.scss';
  .waitDealList{
    display: flex;
    flex-direction: column;
    position: relative;
    padding-bottom: 20px;
    height: 100%;
    box-sizing: border-box;
    .qwui-waitDeal_tab{
      background: #fff;
      height: 50px;
      .tab_btn{
        float: left;
        width: 50%;
        text-align: center;
        line-height: 50px;
        position: relative;
        color: #3F4A64;
        font-size: 15px;
      }
      .active{
        color: #5585F0;
        &:after{
          position: absolute;
          content: "";
          bottom: 0px;
          left: 50%;
          margin-left: -14px;
          width: 28px;
          height: 3px;
          text-align: center;
          background: #5585F0;
        }
      }

    }
    .listNum{
      padding-left: 15px;
      height: 28px;
      line-height: 28px;
      box-sizing: border-box;
      background: #F6F6FA;
      p{
        color: #9196A1;
        font-size: 12px;
      }
      transition: .1s ease;
    }
    .listNumActive{
      height: 38px;
      line-height: 38px;
      p{
        font-size: 14px;
      }
      transition: .2s ease;
    }
    .addNav .qwui-nav_box_fixed .qwui-nav_box{
      background: transparent;
    }

    /* 模糊弹窗 */
    .qwui-add_nav{
      position: fixed;
      left: 0px;
      bottom: 0px;
      width: 100%;
      height: 100%;
      background-color: #ffffff;
      z-index: 110;
    }
    .qwui-add_nav .qwui-add_close i{
      position: absolute;
      display: block;
      bottom: 0;
      left: 0;
      right: 0;
      top: 0;
      margin: auto;
      width: 1rem;
      height: 1rem;
      background: url(~assets/images/crm/CombinedShape.png);
      background-size: 100% 100%;
      background-color: #ffffff;
    }
    /* 弹窗动画 */
    .slide-fade-enter-active {
      transition: all .5s ease;
    }
    .slide-fade-leave-active {
      transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to {
      transform: translateY(100%);
      opacity: 0;
    }
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
    }
    .qwui-add_nav .qwui-add_main{
      position: absolute;
      top:57%;
      width: 100%;
      transform: translateY(-50%);
    }
    .qwui-add_nav .qwui-add_main_title{
      padding-bottom: 1.5rem;
      font-size: 1.5rem;
      color:#0A1735;
      text-align: center;
    }
    .qwui-add_close{
      position: absolute;
      display: block;
      width: 4.5rem;
      height: 4.5rem;
      background: #fff;
      bottom: 3.2rem;
      right: 1.1rem;
      font-size: 1.5rem;
      color:#fff;
      border-radius: 50%;
      box-shadow: 0 8px 14px 0 rgba(178,185,200,0.27);
    }
    .qwui-add_main_clearfix{
      padding: 1.5rem .9rem;
    }
    .qwui-new_built_box_text{
      margin-top: 10px;
    }
  }









</style>

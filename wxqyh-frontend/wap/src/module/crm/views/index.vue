<template>
  <!-- <div class="wrap" :style="{height:userOrDeptContentHeight+'px'}"> -->
  <div class="crm_index_wrap">
    <!--头部菜单栏以及搜索栏,getSearchRequest:监听搜索事件-->
    <div class="index_main">
      <crm-scroll>
        <header>
          <crm-head-nav :headrdata="headData" ref="crmHeadNav" ></crm-head-nav>
        </header>

        <section>
          <div v-show="smallProgramFlag">
            <div class="marketing">
              <div class="marketing-title">企微云小站</div>
              <div class="marketing-flex">
                <router-link to="/message" tag="div" class="marketing-content message">
                  <div class="message-position">
                    消息
                    <div class="message-icon"
                          v-show='marketingNum'>
                      <span>{{marketingNum}}</span>
                    </div>
                  </div>
                </router-link>
                <router-link to="/callingCard" tag="div" class="marketing-content card">我的名片</router-link>
                <router-link to="/words" tag="div" class="marketing-content words">常用话术</router-link>
              </div>
            </div>
            <!-- 营销动态列表 -->
            <!-- <div class="marketing-events" style="display:none;"> -->
            <div class="marketing-events">
              <div class="content">
                <div class="events">营销动态</div>
                <router-link v-show="marketingList && marketingList.length > 0" class="more" to="/marketingDynamic" tag="div">更多<span></span></router-link>
              </div>
              <div class="marketing-list"
                  v-for="(item,index) in marketingList"
                  :key="index"
                  @click="enterUserInfo(item.customerId)"
                  v-show="marketingList && marketingList.length > 0">
                <img class="avatar" :src="customerAvatar(item.customerAvatar)">
                <div class="descript">{{item.customerNickName}} {{item.description}}</div>
                <div class="time">{{item.createTime}}</div>
              </div>
              <div class="qwui-noCustomer" v-if="noVisitFlag">
                <img class="qwui-noCustomer_img" src="../../../assets/images/crm/bg_yxdt.png" alt="">
                <p class="qwui-noCustomer_text">分享自己的名片，推广公司产品和官网，所有访问用户的行为和喜好都会出现在这里，高效获客</p>
                <button class="qwui-share_btn" @click="shareCard">分享名片</button>
              </div>
            </div>
          </div>
          <crm-tab :tabData="tabData"></crm-tab>
        </section>

        <!-- 首次使用提示小程序上线提示框 -->
        <!-- <first-tip v-if="showFirstTip" @closeTip="closeTip"></first-tip> -->

        <div class="crm_fixed_nail" @click="showNewBuilt" ></div>

        <!-- 分享名片数据不完整提示框 -->
        <div class="qwui-card_mask" v-if="cardIncomplete">
          <div class="qwui-card_incomplete">
            <img class="qwui-incomplete_pic" src="../../../assets/images/crm/bg_send.png" alt="">
            <p class="qwui-incomplete_text">你的名片缺少{{cardIncompleteMess}}，联系企业管理员在后台完善，方便向用户推广企业产品和官网</p>
            <button class="qwui-incomplete_share" @click="insistShareCard">继续分享</button>
            <img @click="closeTip" class="qwui-incomplete_close" src="../../../assets/images/crm/icon_a-voice_close.png" alt="">
          </div>
        </div>
        <div class="height120"></div>
      </crm-scroll>
    </div>

    <!-- 首次使用提示小程序上线提示框 -->
    <first-tip v-if="showFirstTip" @closeTip="closeTip"></first-tip>
    <transition name="slide-fade">
        <div class="qwui-add_nav" v-if="show">
          <div class="qwui-add_main" :class="middleMt">
          <!-- <div class="qwui-add_main"> -->
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
          <div class="add_more" v-show="isQiyeShow">
            <p class="add_more_title">更多添加方式</p>
            <div class="more_icon">
              <div class="qwui-nav_box_content add_content" v-for="(item,idx) in headData.moreNav" :key="idx" @click="handleClick(item)">
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
  </div>
</template>

<script>
import wx from 'weixin-js-sdk';
import crm_head_nav from './base/crm_head_nav';
import crm_tab from './base/crm_tab';
import FirstTip from './base/firstTip';
import CrmScroll from '../components/CrmScroll/CrmScroll';
import { getMarketing,getMessageNum,getCard,getAgent } from '../api/smallProgram/getBata.js';
import { mapActions } from 'vuex';
import treeListVue from '../../demo/tree/treeList.vue';

const userVisitRecord = 'userVisitRecord';//存储用户是否首次使用的key值

export default {
  name: 'index',
  data(){
    return {
      headData:dataBase.crm.headData,//头部
      tabData:dataBase.crm.tabData,
      marketingNum:0,//消息数量
      marketingList:[],//营销动态列表
      showFirstTip: false,//首次使用提示框开关
      noVisitFlag:false,//小程序营销动态有无消息
      cardIncomplete:false,//名片不完整提示框开关
      cardIncompleteMess: '',//名片缺少相关提示信息
      smallProgramFlag:true,//是否打开营销小程序入口
      show: false,
      isQiyeShow: true
    }
  },
  computed:{
    middleMt(){
      if(_.isQiyeweixinApp()){
        this.isQiyeShow = true;
        return
      }else{
        this.isQiyeShow = false;
        return 'middleMt'
      }
    }
  },
  created:function(){
    //判断屏幕高度
    // if(document.documentElement.clientHeight>0){
    //     this.userOrDeptContentHeight = document.documentElement.clientHeight;
    // }else{
    //   this.userOrDeptContentHeight = "auto";
    // }
    _.hideLoading();
    this.setCacheArray({isClear: true});
    this.getMarketingDate()
    this.getMessageNum()

    this.firstVisit();
  },
  methods: {
    ...mapActions('list' ,[
      'setCacheArray'
    ]),
    // 拼接图片数据
    customerAvatar(customerAvatar){
      return _.filterCompressURL(customerAvatar);
    },
    //请求营销数据
    getMarketingDate(){
      getMarketing((result) => {
        this.marketingList = result.dynamicsList;
        //没有营销动态,展示分享名片引导
        if(!this.marketingList.length){
          this.noVisitFlag = true;
        }
      });
    },
    //获取消息数目
    getMessageNum(){
      getMessageNum(res => {
        this.marketingNum = res.count
      })
    },
    //关闭首次使用提示框
    closeTip(){
      this.showFirstTip = false;
      this.cardIncomplete = false;
    },
    //记录用户是否第一次访问crm
    firstVisit(){
      //判断浏览器是否有保存这个key值,如果有则说明不是第一次访问,否则打开提示框
      if(!localStorage.getItem(userVisitRecord)){
        this.showFirstTip = true;
        localStorage.setItem(userVisitRecord,'visited');
      }else{
        this.showFirstTip = false;
      }
    },
    showNewBuilt(){
     this.show = true;
    },
    hasAuthority(res,target){
      let list = res.split(",");
      let flag = false;
      for(let i = 0;i < list.length; i++){
        if(list[i] === target){
          flag = true;
          break;
        }
      }
      return flag;
    },
    //跳转到用户详情页面
    enterUserInfo(customerId){
      this.$router.push({ path: '/userInfo',query: { customerId } });
    },
    shareCard(){
      //请求名片接口,判断企业产品和官网信息是否完整
      getCard((result) => {
        if(!result.hasProduct || !result.hasHomeBuild){
          this.cardIncomplete = true;
          let message = '';
          if(!result.hasProduct){
            message += '企业产品';
          }
          if(!result.hasHomeBuild){
            message += '和官网信息';
            if(message.length === 5){
              message = message.replace('和','');
            }
          }
          this.cardIncompleteMess = message;
          return;
        }
        //此处进入我的名片页面需要自动点击生成图片,传参数作判断
        this.insistShareCard();
      });
    },
    insistShareCard(){
      this.$router.push({name: 'callingCard',params:{buildCard:true}});
    },
    linkUrl(item){
      if (item.url.includes('jsp')) {
        location.href = _.baseURL + item.url;
      } else {
        this.$router.push({name: item.url});
      }
    },

    // 点击新增外部联系人
    handleClick(item){
      if(item.name == 'wxList'){
      //  this.$router.push({name: "externalContact",query:{}})
        this.setAgentConfig();
      }
    },

    // 外部联系人注入agent权限
    setAgentConfig(){
      let self = this;
        let obj = {
          agentCode: 'crm',
          url: window.location.href.split('#')[0]
        }
        getAgent(obj).then(res => {
          if(res.code == '0'){
            let apijs = res.data.apijs;
            wx.agentConfig({
                corpid: apijs.corpId,
                agentid: apijs.agentid,
                timestamp: apijs.timestamp,
                nonceStr: apijs.noncestr,
                signature: apijs.signature,
                jsApiList: ['selectExternalContact'],
                success: function(res) {
                    self.getExternalContact();
                },
                fail: function(res) {
                    if(res.errMsg.indexOf('function not exist') > -1){
                        alert('版本过低请升级')
                    }
                }
            });
          }
        })
      },

      // 打开外部联系人弹窗接口
      getExternalContact(){
      if(!_.isQiyeweixinApp()){
        _.alert("提示","请在企业微信客户端使用此功能","确定");
        return;
      };
      wx.invoke('selectExternalContact', {}, res=> {
        if (res.err_msg == "selectExternalContact:ok") {
          var userIds  = res.userIds ; //返回此次选择的外部联系人userId列表，数组类型
          if(userIds.length > 0){
            //传入userId获得外部联系人详情
            let obj = {
              userIds : res.userIds
            }
            localStorage.setItem('externalIds', res.userIds);
            this.$router.push({name: "externalContact",query:{ type: 'home' }})
          }else if(userIds.length > 10){
            alert('一次最多导入10个外部联系人')
          }
          else{
            _.alert(" ", "请先添加外部联系人",{
              primaryBtn:{
                  name: "查看指引",
                  callBack: () => {
                      location.href = _.baseURL + '/jsp/wap/crm/contact/contact_guide.jsp';
                  }
              },
              defaultBtn:{
                  name: "取消",
                  callBack: null
              },
          });
          }
        }
        else if(res.err_msg == "selectExternalContact:cancel" || res.err_msg == "selectExternalContact:fail"){
          //错误处理
        }else{
            _.alert("提示",JSON.stringify(res),"确定");
        }
      });
    },
  },
  components:{
    "crm-head-nav":crm_head_nav,
    "crm-tab":crm_tab,
    FirstTip,
    CrmScroll
  }
}
</script>
<style lang="scss" scoped>
@import '../crmBase.scss';
@import './../components/CrmFixedNail/CrmFixedNail.scss';
.height120{
  height: rem(120);
}
// .wrap{
//   overflow-y:auto;
//   background-color: #ffffff;
//   height: 100%;
//   position: relative;
//   padding-bottom: 0;
// }
.marketing{
  padding: 0 rem(15);
  background: #fff;
  .marketing-title{
    padding: rem(32) 0 rem(16) 0;
    line-height: rem(22);
    color: #0A1735;
    font-size: rem(16);
    font-weight: 500;
  }
  .marketing-flex{
    display: flex;
    justify-content: space-between;
    .marketing-content{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 47%;
      height: 54px;
      border-radius: 4px;
      color: #fff;
      font-size: 15px;
      font-weight: 500;
      &.message{
        position: relative;
        background: url('../../../assets/images/crm/crm_news.png') center no-repeat;
        background-size: cover;
        .message-position{
          .message-icon{
            position: relative;
            bottom: 3px;
            display: inline-block;
            width: 22px;
            height: 12px;
            line-height: 13px;
            background: #fff;
            border-radius: 6px;
            font-size: 11px;
            color: #6E9BFF;
            text-align: center;
            &:before{
              position: absolute;
              top: 9px;
              left: 2px;
              content: '';
              width: 0;
              height: 0;
              border-color: transparent #fff;
              border-width: 0 0 6px 6px;
              border-style: solid;
            }
            span {
              position: relative;
            }
          }
        }
      }
      &.words{
        background: url('../../../assets/images/crm/crm_words.png') center no-repeat;
        background-size: cover;
      }
      &.card{
        margin: 0 14px;
        background: url('../../../assets/images/crm/crm_card.png') center no-repeat;
        background-size: cover;
      }
    }

  }
}
.marketing-events{
  padding: 0 15px;
  background: #fff;
  .content{
    height: 18px;
    line-height: 18px;
    padding: 16px 0 12px;
    color: #7A7C80;
    font-size: 13px;
    .events{
      float: left;
    }
    .more{
      position: relative;
      float: right;
      padding-left: 4px;
      span{
        position: relative;
        bottom: 1px;
        display: inline-block;
        vertical-align: middle;
        width: 16px;
        height: 16px;
        background: url('../../../assets/images/crm/icon_go.png') center no-repeat;
        background-size: 100%;
      }
    }
  }
  .marketing-list{
    position: relative;
    padding: rem(4) 0 rem(4) rem(44);
    .avatar{
      position: absolute;
      top: 0;
      left: 0;
      width: rem(28);
      height: rem(28);
      margin-top: rem(8);
      border-radius: 50%;
    }
    .descript{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      @include content-item(20,20,#0A1735,14);
    }
    .time{
      @include content-item(17,17,#B2B9C8,12);
    }
  }
  .qwui-noCustomer {
    text-align: center;
    .qwui-noCustomer_img {
      width: 140px;
      height: 140px;
    }
    .qwui-noCustomer_text {
      width: 330px;
      font-size: 14px;
      color: #B2B9C8;
      line-height: 20px;
      text-align: left;
      margin: 0 auto;
    }
    .qwui-share_btn {
      margin-top: 15px;
      width: 175px;
      height: 34px;
      border: none;
      border-radius: 17px;
      font-size: 14px;
      line-height: 34px;
      color: #fff;
      background: linear-gradient(90deg,rgba(142,187,249,1),rgba(85,133,240,1));
    }
  }
}
.crm_fixed_nail{
  position: fixed;
}
.qwui-card_mask {
  position: fixed;
	width: 100%;
	height: 100%;
	top:0;
	left: 0;
	right: 0;
	margin: 0 auto;
	background-color: rgba(0,0,0,.4);
  z-index: 100;
}
@media screen and (min-width: 1024px){
  .qwui-card_mask {
      width: 740px;
  }
}
.qwui-card_incomplete {
    width: 321px;
    padding-bottom: 22px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    text-align: center;
    font-size: 0;
    border-radius: 12px;
    overflow: hidden;
  .qwui-incomplete_pic {
    width: 100%;
    margin-top: -1px;
  }
  .qwui-incomplete_text {
    width: 270px;
    font-size: 15px;
    line-height: 21px;
    margin: 0 auto;
    margin-top: 25px;
    color:#7A7C80;
  }
  .qwui-incomplete_share {
    width: 80%;
    height: 44px;
    border: none;
    border-radius: 4px;
    background: #5585F0;
    color: #fff;
    font-size: 16px;
    line-height: 44px;
    margin-top: 24px;
  }
  .qwui-incomplete_close {
    position: absolute;
    width: 34px;
    height: 34px;
    top: 4px;
    right: 10px;
  }
}
.crm_index_wrap{
    display: flex;
    height: 100%;
    flex-direction: column;
    .index_main{
      position: relative;
      flex: 1;
      overflow-y: auto;
    }
}
@media screen and (max-width: 320px) {
  .qwui-card_incomplete {
    width: 282px;
  }
}
.slide-fade-enter-active {
    transition: all .2s ease;
  }
   .slide-fade-leave-active {
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
   .slide-fade-enter, .slide-fade-leave-to {
    // margin-top: -100px;
    opacity: 0;
  }
  /* 模糊弹窗 */
  .qwui-add_nav{
    position: relative;
    position: fixed;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    z-index: 110;
    .add_more{
      width: 100%;
      height: 300px;
      margin-top: rem(34);
      // position: absolute;
      // top: rem(344);
      // top: 51%;
      padding-bottom: 1.5rem;
      font-size: 1.5rem;
      color: #0A1735;
      text-align: center;
      .add_more_title{
        font-size: rem(16);
        color: #0A1735;
        text-align: center;
      }
      .more_icon{
        margin-top: rem(32);
        height: 100%;
        width: 100%;
        text-align: left;
      }
    }
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
    margin-top: rem(44);
    width: 100%;
  }
  .qwui-add_nav .qwui-add_main_title{
    font-size: rem(16);
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
    padding: rem(32) .9rem 0 .9rem;
  }
  .qwui-new_built_box_text{
    margin-top: 10px;
  }
  .wrap{
        width: 100%;
    }
    @media screen and (min-width: 1024px) {
        .wrap {
          width: 740px;
          margin: 0 auto;
        }
    }
    .middleMt{
      position: absolute;
      bottom: 135px;
      width: 100%;
    }
</style>


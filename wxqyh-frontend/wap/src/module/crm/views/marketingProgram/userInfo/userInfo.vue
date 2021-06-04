<template>
  <div class="user-container" ref="userWrap" v-scroll="loadMore">
    <div class="user-message">
      <img class="user-avatar"
           :src="userInfo.avatarUrl">
      <p class="user-name">
        <span v-if="userInfo.memoName">{{userInfo.memoName}}
          <img @click="editUser" src="~assets/images/icon_nick_edit.svg">
        </span>
      </p>
      <p class="user-nickname">昵称：{{userInfo.nickName}}</p>
      <p class="user-phone">手机号：{{userInfo.phoneNum ? userInfo.phoneNum:'暂无'}}</p>
      <div class="handle">
        <div class="call"
            v-if="userInfo.phoneNum"
           @click="callPhone(userInfo.phoneNum)">打电话</div>
        <div class="send"
            @click="enterChatRoom">发信息</div>
      </div>
    </div>
    <div class="space"></div>
    <div class="user-analysis">
      <div class="padding-seat">
        <tabs :currentTab="currentTab"
              :fixed="fixedFlag"
              @changeTab="changeTab"></tabs>
      </div>
      <!-- 互动 -->
      <div class="user-dynamic_container" v-if="currentTab === 1">
        <user-dynamic :list="list"></user-dynamic>
        <load-more v-show="loadTip.show" :tip="loadTip.text" :show-loading="loadTip.loadingImg"></load-more>
      </div>
      <!-- 互动 -->

      <!-- 智能分析 -->
      <div class="user-analyze_container" v-if="currentTab === 2">
        <user-analyze :customerId="customerId"></user-analyze>
      </div>
      <!-- 智能分析 -->
    </div>
  </div>
</template>

<script>
import Tabs from './components/Tabs'
import UserDynamic from './components/UserDynamic'
import UserAnalyze from './components/UserAnalyze'
import {
  searchUserDynamic,
  searchUserInfo
} from '../../../api/smallProgram/getBata.js';
import { LoadMore } from "vux";
export default {
  data() {
    return {
      // 用户详情信息
      userInfo: {},
      // 控制滑动开关
      fixedFlag: false,
      // 当前的显示模块,1、互动,2、智能分析
      currentTab: 1,
      // 互动列表的数据
      list: [],
      // 上拉加载所需参数
      lastDynamicsTime: '',
      // 上拉加载触发判断
      loadFlag: false,
      // 客户id
      customerId: '',
      // 加载提示
      loadTip: {
        show: false,
        text: '正在加载',
        loadingImg: true,
        loadOn: true
      }
    }
  },
  components: {
    Tabs,
    UserDynamic,
    UserAnalyze,
    LoadMore
  },
  created() {
    // 判断是否为手机端,开启电话按钮功能
    if (_.isMobileApp()) {
      this.pcOrMobile = true
    }
    // 获取客户id
    this.customerId = this.$route.query.customerId
    // 开启手机端打电话功能
    this.openCall('yes')

    // 获取客户信息
    this.searchUserInfo()
    // 获取互动数据
    this.searchUserDynamic()
  },
  destroyed() {
    // 关闭手机端打电话功能
    this.openCall('no')
  },
  methods: {
    openCall(flag) {
      document.querySelector("meta[name='format-detection']").content =
        'telephone=' + flag
    },
    callPhone(phone) {
      if (this.pcOrMobile) {
        window.location.href = 'tel:' + phone;
      } else {
        _.alert('提示', '请在手机端使用此功能')
      }
    },
    enterChatRoom() {
      this.$router.push({ path: '/chat', query: { openId: this.customerId } })
    },
    changeTab(currentId) {
      this.currentTab = currentId;

      // 如果tab已经固定,则切换的时候让对应模块重新滚动到某一高度
      if(this.fixedFlag){
        this.$refs.userWrap.scrollTop = 285;
      }
    },
    editUser(){
      const data = {
        customerId: this.customerId,
        userName: this.userInfo.memoName,
        userNum: this.userInfo.phoneNum
      }
      this.$router.replace({ path: '/editUser', query: {userInfo:data} });
    },
    searchUserInfo() {
      const data = {
        customerId: this.customerId
      }
      searchUserInfo(data, res => {
        this.userInfo = Object.assign({}, res.wxappUserInfoVO)
      })
    },
    searchUserDynamic() {
      
      if (this.loadFlag){
        this.loadTip.show = false;
        return;
      }
      const data = {
        customerId: this.customerId,
        pageSize: 20,
        lastDynamicsTime: this.lastDynamicsTime
      }
      searchUserDynamic(data, res => {

        // 处理上拉加载合并同个时间段的数据
        const pageList = JSON.parse(JSON.stringify(this.list));
        pageList.map(v1 => {
          res.pageData.map((v2, i2) => {
            if (v1.time === v2.time) {
              v1.dynamicsList = v1.dynamicsList.concat(v2.dynamicsList);
              res.pageData.splice(i2, 1);
            }
          })
        });
        // 开启触底加载开关
        this.loadTip.loadOn = true;

        this.list = pageList.concat(res.pageData);
        this.lastDynamicsTime = res.lastDynamicsTime
        this.loadFlag = res.currPage >= res.maxPage
      })
    },
    // 触底加载
    loadMore(el) {
      let scrollTop = el.scrollTop;
      let offsetHeight = el.offsetHeight;
      let scrollHeight = el.scrollHeight;
      let flag = scrollTop > 280;
     
      if (flag && this.fixedFlag != flag) {
        this.fixedFlag = true
      }else{
        if(this.fixedFlag != flag){
          this.fixedFlag = false;
        }
      }

      if (scrollTop + offsetHeight >= scrollHeight - 50) {
        // 智能分析不需要上拉加载
        if(this.currentTab === 2){
          return;
        }
        // 防止重复加载
        if(!this.loadTip.loadOn){
          return;
        }
        this.loadTip.loadOn = false;
        this.loadTip.show = true;
        this.searchUserDynamic();
      }
    }
  }
}
</script>

<style scoped lang="scss">
.user-container {
  height: 100%;
  background: #fff;
  overflow-y: auto;
}
.user-message {
  background: #fff;
  text-align: center;
  font-size: 0;
  box-sizing: border-box;
  padding: 16px 0 20px 0;
}
.block-hidden {
  opacity: 0;
}
.user-avatar {
  width: 98px;
  height: 98px;
  border-radius: 50%;
}
.user-name {
  margin-top: 16px;
  font-size: 20px;
  color: #0a1735;
  font-weight: 600;
}
.user-name span{
  display: inline-block;
  margin: 0 auto;
  position: relative;
}
.user-name img {
  position: absolute;
  right: -26px;
  top: 5px;
  width: 24px;
  height: 24px;
}
.user-nickname {
  margin-top: 8px;
  font-size: 15px;
  color: #85868f;
}
.user-phone {
  margin-top: 8px;
  font-size: 15px;
  color: #85868f;
}
.handle {
  margin-top: 12px;
}
.call {
  display: inline-block;
  width: 100px;
  height: 32px;
  line-height: 32px;
  border: 1px solid #5585f0;
  border-radius: 4px;
  background: #fff;
  color: #5585f0;
  font-size: 14px;
  margin-right: 20px;
}
.send {
  display: inline-block;
  width: 100px;
  height: 32px;
  line-height: 32px;
  border: 1px solid #5585f0;
  border-radius: 4px;
  background: #5585f0;
  color: #fff;
  font-size: 14px;
}
.user-analysis {
  width: 100%;
  background: #fff;
  position: relative;
}
.user-dynamic_container {
  flex: 1;
}
.user-analyze_container {
  flex: 1;
  overflow-y: auto;
}
.stop-scroll {
  overflow: hidden;
}
.fixedFlag {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  max-width: 740px;
}
.space {
  height:8px;
  background:#F6F6F6;
}
.padding-seat {
  height: 50px;
  background: #fff;
}
</style>

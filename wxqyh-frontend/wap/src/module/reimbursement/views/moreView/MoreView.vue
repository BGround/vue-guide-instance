<template>
  <div class="more-app">
    <router-link class="list-item" :class="{'spacing': item.icon == 'open-remind'}" v-for="(item, index) in list" :key="index" :to="item.path">
      <i class="iconfont" :class="item.icon"></i>
      <div class="content-wrapper">
        <h3 class="item-title">
          {{item.title}}
        </h3>
        <i class="list-item-tip" v-if="item.hasTip"></i>
        <i class="icon-go"></i>
      </div>
    </router-link>
    <a class="list-item"
      :class="{'spacing': item.icon == 'feedback'}"
      v-for="item in other"
      :key="item.id"
      :target="openNewWindow(item)"
      @click="goToRoute(item)"
    >
      <i class="iconfont" :class="item.icon"></i>
      <div class="content-wrapper">
        <h3 class="item-title">
          {{item.title}}
        </h3>
        <i class="list-item-tip" v-if="item.hasTip"></i>
        <i class="icon-go"></i>
      </div>
    </a>
  </div>
</template>

<script>
import {isAdministrator, feedbackList} from '../../api/more';
import { pageMixin } from '../../mixins/pageMixin';
export default {
  name: 'QwMoreView',
  mixins: [pageMixin],
  data () {
    return {
      isAdministrator: null,
      feedbackBase: `${location.href.slice(0, location.href.indexOf('/vp'))}/vp/module/form.html?agentCode=reimbursement&corp_id=${wxqyhConfig.orgConfigInfo.corpId}#/open/add?id=`,  // 正式
      list: [
        {
          title: this.$t('i18n.reim.pages.budget'),
          icon: 'add-budget',
          path: '/budget'
        },
      ],
      other: [
        {
          title: this.$t('i18n.reim.pages.feedback'),
          icon: 'feedback',
          isHash: false,
          path: ''
        },
        {
          title: this.$t('i18n.reim.pages.helpOnline'),
          icon: 'help-online',
          isHash: false,
          path: 'https://wbg.do1.com.cn/xueyuan/2541.html'
        }
      ]
    };
  },
  created() {
    if(_.isAdministrator === undefined){
      _.showLoading();
      isAdministrator().then(res => {
        _.hideLoading();
        if(res.code != 0) return;
        this.isAdministrator = _.isAdministrator = res.data.isManager
      });
    }

    //是否有新反馈信息
    // if(dataBase.home.newHomeFooterList.nav[4].hasTip) this.other[0].hasTip = true;
    //请求是否有历史反馈
    feedbackList().then(res => {
      let length = 0;
      if(res.code == '0') {//请求出错直接进入反馈页
        this.feedbackBase += res.data.feedBackVersionId;
        length = res.data.tbFormWorkOrderPOList.length;
      }
      if(length <= 0) {
        this.other[0].path = `${this.feedbackBase}&field=${wxqyhConfig.orgConfigInfo.corpId}&field1=${_.userId}&field2=邝芷欣&field3=${this.isAdministrator == 1 ? '管理员' : '普通员工'}&field4=${_.is_vip ? '付费用户' : '普通用户'}`;
        this.other[0].isHash = false;
      }else {
        this.other[0].path = '/feedback-list';
        this.other[0].isHash = true;
      }
    })
  },
  methods: {
    goToRoute(item) {
      if(item.isHash) { //跳转路由
        this.$router.push(item.path)
      }else {
        location.href = item.path;
      }
    },
    openNewWindow(item) {
      return item.icon == 'help-online' && window.top !== window.self ? '_blank' : '_self';
    }
  }
}

</script>
<style lang='scss' scoped>
$baseURL: '../assets/images/';
.list-item {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  padding: 0 0 0 14px;
  box-sizing: border-box;
  background: #fff;
  &:first-child {
    margin-top: 8px;
  }
  &:active {
    background: #F7F8FA;
  }
  &.spacing {
    margin-top: 8px;
  }
  .iconfont {
    display: block;
    width: 24px;
    height: 24px;
    background-repeat: no-repeat;
    background-size: 24px;
    background-position: center;
    margin-right: 12px;
    &.add-budget {
      background-image: url(~assets/images/reim/icon_a-fk_more_board@2x.png);
    }
    &.feedback {
      background-image: url(~assets/images/reim/icon_a-setting_6@2x.png);
    }
    &.help-online {
      background-image: url(~assets/images/reim/icon_a-setting_7@2x.png);
    }
  }
  .content-wrapper {
    border-bottom: 1px solid #F7F8FA;
    flex: 1;
    align-items: stretch;
    .item-title {
      height: 100%;
      font-size:16px;
      font-family: 'Microsoft YaHei','宋体', Tahoma, Arial, sans-serif;
      font-weight:400;
      color:rgba(10,23,53,1);
      line-height: 51px;
      max-width: 210px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .icon-go {
      width: 16px;
      height: 16px;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 14px;
      margin: auto;
      background-image: url(~assets/images/reim/icon_a-common_arrowright@2x.png);
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
  }
}
</style>

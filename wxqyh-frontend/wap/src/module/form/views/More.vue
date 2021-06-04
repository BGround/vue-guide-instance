<template>
  <div class="more-app" v-if="isWhite !== null">
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
import { whitePortCtl, isAdministrator, feedbackList } from "../api/list.js";
export default {
  data() {
    return {
      isWhite: null,
      isAdministrator: null,
      feedbackBase: `${location.href.slice(0, location.href.indexOf('/vp'))}/vp/module/form.html?agentCode=form&corp_id=${wxqyhConfig.orgConfigInfo.corpId}#/open/add?id=`,
      list: [
        {
          title: "创建表单模板",
          icon: "add-model",
          path: "/formdesign"
        },
        // {
        //   title: '表单模板管理',
        //   icon: 'model-manage',
        //   path: ''
        // },
        // {
        //   title: '应用中心',
        //   icon: 'app-center',
        //   path: ''
        // },
        {
          title: "外部单管理",
          icon: "open-remind",
          path: "/open"
        },
        {
          title: "流程委托",
          icon: "process-entrust",
          path: "/entrust"
        }
      ],
      other: [
        {
          title: "在线反馈",
          icon: "feedback",
          hasTip: false,
          isHash: false,
          path: ''
        },
        {
          title: "使用帮助",
          icon: "help-online",
          isHash: false,
          path:
            "https://mp.weixin.qq.com/s?__biz=MzA3ODk1MDcwMw==&mid=504426977&idx=2&sn=8881194fd41ded2449c34b4001e23adf&chksm=045ea9a1332920b7f8accfd033e83cac02e3c7be927a4939a4c9aebc6f5930285e74f533960e&mpshare=1&scene=1&srcid=1101nYKnqJE3OLmXkNQJ4smX&rd2werd=1#wechat_redirect"
        }
      ]
    };
  },
  created() {
    let _this = this;
    if (_.isAdministrator === undefined) {
      isAdministrator().then(res => {
        if (res.code != 0) return;
        this.isAdministrator = _.isAdministrator = res.data.isManager;
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
        _this.other[0].path = `${this.feedbackBase}&field=${wxqyhConfig.orgConfigInfo.corpId}&field1=${_.userId}&field2=林卓帆&field3=${this.isAdministrator == 1 ? '管理员' : '普通员工'}&field4=${_.is_vip ? '付费用户' : '普通用户'}`;
        _this.other[0].isHash = false;
      }else {
        _this.other[0].path = '/feedback-list';
        _this.other[0].isHash = true;
      }
    })

    whitePortCtl({
      agentCode: "form",
      agentFunction: "protal_create_form"
    }).then(res => {
      if (res.code != "0") return _.alert("提示：", res.desc);
      this.isWhite = res.data.isWhiteCorpId;

      if (!this.isWhite)
        this.list = this.list.filter(
          item => item.icon != "add-model"
        );
    });
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
      return item.icon == "help-online" && window.top !== window.self
        ? "_blank"
        : "_self";
    }
  }
};
</script>
<style lang='scss' scoped>
$baseURL: "../assets/images/";
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
    &.add-model {
      background-image: url($baseURL+"switch_a-add_form_on@2x.png");
    }
    &.model-manage {
      background-image: url($baseURL+"icon_a-setting_2@2x.png");
    }
    &.open-remind {
      background-image: url($baseURL+"icon_a-setting_4@2x.png");
    }
    &.app-center {
      background-image: url($baseURL+"icon_a-setting_3@2x.png");
    }
    &.process-entrust {
      background-image: url($baseURL+"icon_a-setting_5@2x.png");
    }
    &.feedback {
      background-image: url($baseURL+"icon_a-setting_6@2x.png");
    }
    &.help-online {
      background-image: url($baseURL+"icon_a-setting_7@2x.png");
    }
  }
  .content-wrapper {
    border-bottom: 1px solid #F7F8FA;
    flex: 1;
    align-items: stretch;
    .item-title {
      height: 100%;
      font-size: 16px;
      font-family: "Microsoft YaHei", "宋体", Tahoma, Arial, sans-serif;
      font-weight: 400;
      color: rgba(10, 23, 53, 1);
      line-height: 51px;
      max-width: 210px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .list-item-tip {
      width: 6px;
      height: 6px;
      background: #ff586d;
      border-radius: 50%;
      position: absolute;
      bottom: 0;
      top: 0;
      right: 35px;
      margin: auto 0;
    }
    .icon-go {
      width: 16px;
      height: 16px;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 14px;
      margin: auto;
      background-image: url($baseURL+"icon_a-common_arrowright@2x.png");
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
  }
}
</style>

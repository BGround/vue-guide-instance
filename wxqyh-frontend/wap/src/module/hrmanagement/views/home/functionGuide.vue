<template>
 <div class="qwui-function_guide" v-if="newUser">
  <div class="qwui-guide_box">
   <div class="qwui-guide_header">
    <span class="qwui-desc_text">
     功能指引
    </span>
    <span class="qwui-noshow" @click="hideGuide">
     不再显示
     <i class="qwui_close_icon"></i>
    </span>
   </div>
   <div class="qwui-guide_content">
    <ul class="qwui-item_box">
     <li v-for="(item, i) in itemList" :key="i" class="qwui-item" @click="goGuide(item.anchor)">
      <img class="qwui-pic" :src="item.icon" alt="">
      <p class="qwui-text">{{item.text}}</p>
     </li>
    </ul>
   </div>
  </div>
  <!-- 底部 -->
		<div class="qwui-work_gutter"></div>
 </div>
</template>
<script>
import { functionGuide, closeFunctionGuide } from "../../api/getData";
export default {
  name: "functionGuide",
  data() {
    return {
      itemList: [
        {
          text: "人事考核",
          icon: require("assets/images/icon-hr-hrcheck.png"),
          anchor: "hrCheck"
        },
        {
          text: "工资条",
          icon: require("assets/images/icon-hr-salarysheet.png"),
          anchor: "salarySheet"
        },
        {
          text: "人事管理",
          icon: require("assets/images/icon-hr-hrmanage.png"),
          anchor: "hrManage"
        },
        {
          text: "员工关怀",
          icon: require("assets/images/icon-hr-staffcare.png"),
          anchor: "staffCare"
        }
      ],
      // 是否是新用户
      newUser: false
    };
  },
  created() {
    this.searchFunctionGudie();
  },
  methods: {
    // 跳转人事功能
    goGuide(anchor) {
      window.location.href =
        "https://wbg.do1.com.cn/xueyuan/2579.html#" + anchor;
    },
    //功能指引查询
    searchFunctionGudie() {
      functionGuide({ code: "hrmanagement" }, data => {
        if (data.isGuide == "0") {
          this.newUser = true;
        }
      });
    },
    // 关闭功能指引
    hideGuide() {
      _.alert("确定不再显示功能指示吗？", "你还可以在【我的-功能指引中查看】", {
        primaryBtn: {
          name: "i18n.confirm",
          callBack: () => {
            closeFunctionGuide({ code: "hrmanagement" }, data => {
              this.newUser = false;
            });
          }
        },
        defaultBtn: {
          name: "i18n.cancel",
          callBack: null
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.qwui-guide_box {
  height: 128px;
  .qwui-guide_header {
    height: 40px;
    line-height: 40px;
    padding: 0 14px;
    overflow: hidden;
    .qwui-desc_text {
      font-size: 16px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: #0a1735;
    }
    .qwui-noshow {
      position: relative;
      float: right;
      font-size: 13px;
      color: #b2b9c8;
      padding-right: 25px;
      font-weight: 400;
      font-family: PingFangSC-Regular;
      .qwui_close_icon {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        height: 22px;
        width: 22px;
        background: url(~assets/images/icon-hr-close.png) center no-repeat;
        background-size: cover;
      }
    }
  }
  .qwui-guide_content {
    padding: 0 14px;
    height: 88px;
    .qwui-item {
      display: inline-block;
      width: 25%;
      text-align: center;
      margin-top: 14px;
      line-height: 1.2;
      .qwui-pic {
        width: 28px;
        height: 28px;
        margin-bottom: 10px;
      }
      .qwui-text {
        font-size: 12px;
        color: #0a1735;
        font-family: PingFangSC-Regular;
        font-weight: 400;
      }
    }
  }
  .qwui-work_gutter {
    width: 100%;
    height: 8px;
    background: #f7f8fa;
  }
}
</style>
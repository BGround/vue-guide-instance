<template>
  <div class="qwui-guide_details">
   <div class="qwui-guide_details_box">
    <ul class="qwui-guide_details_content">
     <li v-for="(item, i) in itemList" :key="i" class="qwui-guide_details_item" @click="goGuide(item.anchor)">
      <div class="qwui-item_text">
       <p class="qwui-item_text_header">
        {{item.textHeader}}
       </p>
       <p class="qwui-item_text_desc">
        {{item.textDesc}}
       </p>
      </div>
      <span class="qwui-item_skip"></span>
     </li>
    </ul>
   </div>
  </div>
</template>
<script>
export default {
  name: "functionGuideDetails",
  data() {
    return {
      itemList: [
        {
          textHeader: "人事考核功能指引",
          textDesc: "新建指标 > 创建评级标准 > 创建考核模板 > 发布考核",
          anchor: "hrCheck"
        },
        {
          textHeader: "工资条功能指引",
          textDesc: "自定义表头、群发任务、动态密码访问、发送详情",
          anchor: "salarySheet"
        },
        {
          textHeader: "人事管理功能指引",
          textDesc: "员工花名册管理、人事代办提醒",
          anchor: "hrManage"
        },
        {
          textHeader: "员工关怀功能指引",
          textDesc: "生日祝福、入职周年祝福",
          anchor: "staffCare"
        }
      ]
    };
  },
  methods: {
    // 跳转人事功能
    goGuide(anchor) {
      window.location.href =
        "https://wbg.do1.com.cn/xueyuan/2579.html#" + anchor;
    }
  }
};
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1024px) {
  .qwui-guide_details {
    width: 740px;
    margin: 0 auto;
  }
}
.qwui-guide_details_content {
  .qwui-guide_details_item {
    position: relative;
    height: 40px;
    border-bottom: 1px solid #f7f8fa;
    padding: 16px 14px;
    .qwui-item_text {
      .qwui-item_text_header {
        color: #0a1735;
        font-size: 15px;
      }
      .qwui-item_text_desc {
        color: #b2b9c8;
        font-size: 13px;
      }
    }
    .qwui-item_skip {
      position: absolute;
      top: 50%;
      right: 14px;
      transform: translateY(-50%);
      height: 24px;
      width: 24px;
      background: url(~assets/images/ic_white_arrow.png) center no-repeat;
      background-size: cover;
    }
  }
}
</style>
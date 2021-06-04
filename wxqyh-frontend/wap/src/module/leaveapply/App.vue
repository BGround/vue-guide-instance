<template>
  <div id="app" class="adapt_iphonex">
    <transition name="router-fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <!--页面必须引入-加载过渡效果以及弹窗 start-->
    <loading v-if="dataBase.config"
			   :show="dataBase.loading.show"
			   :icon="dataBase.loading.icon"
			   :text="dataBase.loading.text">
	  </loading>
    <dialog-mask v-if="dataBase.config"></dialog-mask>
    <!--页面必须引入-加载过渡效果以及弹窗 end-->
  </div>
</template>

<script>
import DialogMask from "@/components/base/dialog_mask"; //弹窗组件
import Loading from "@/components/base/loading"; //加载中、操作成功提示组件（删除成功、提交成功）

export default {
  name: "app",
  data() {
    return {
      dataBase: dataBase
    };
  },
  components: {
    DialogMask,
    Loading
  }
};
</script>
<style>
@import "../../assets/css/style.css";
.router-fade-enter-active, .router-fade-leave-active {
  transition: opacity .2s;
}
.router-fade-enter, .router-fade-leave-active {
  opacity: 0;
}
.qwui-list_item_title.limit_show {
  height: 21px;
  font-size: 15px;
  line-height: 21px;
  display: block;
  padding: 0 80px 5px 0;
  color: #333;
  overflow: hidden;
  white-space: nowrap;
  word-wrap: normal;
  text-overflow: ellipsis;
}
.qwui-list_user_content.type_name {
  margin: 0;
  display: inline-block;
}
span.applyStatus {
  display: inline-block;
  line-height: 1;
  padding: 2px;
  font-size: 12px;
  vertical-align: middle;
  text-align: center;
  border-radius: 2px;
  margin-right: 8px;
}
span.applyStatus.blue {
  border: 1px solid #458be9;
  color: #458be9;
}
span.applyStatus.green {
  border: 1px solid #1aad19;
  color: #1aad19;
}
span.applyStatus.red {
  border: 1px solid #d64949;
  color: #e94f4f;
}
span.applyStatus.gray {
  border: 1px solid #999;
  color: #999;
}
span.applyStatus.orange {
  border: 1px solid #ff6000;
  color: #ff6000;
}
</style>

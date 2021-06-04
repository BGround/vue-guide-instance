<template>
  <div class="wrap">
    <router-view></router-view>
    <!--底部菜单-->
    <footer-nav :footerList="homeFooterList"></footer-nav>
    <dialog_mask_bottom :dialogConfig="dialogBottomConfig"></dialog_mask_bottom>
  </div>
</template>

<script>
import FooterNav from "../components/base/newBase/FooterNav";
import dialog_mask_bottom from "@/components/base/dialog_mask_bottom.vue";
import { initHead } from "../api/list";
import {initCache, updatePageCount} from "../assets/js/keepAlive.js"

export default {
  name: "index",
  data() {
    return {
      homeFooterList: dataBase.home.newHomeFooterList.nav,
      dialogBottomConfig: dataBase.dialogBottomConfig
    };
  },
  components: {
    FooterNav,
    dialog_mask_bottom: dialog_mask_bottom
  },
  created() {
    //判断是否有新反馈信息
    // let hasTip = true;
    // if(hasTip) dataBase.home.newHomeFooterList.nav[4].hasTip = true;
    // else dataBase.home.newHomeFooterList.nav[4].hasTip = false;
  },
  mounted() {
    this.initCount();
    initCache();
  },
  methods: {
    initCount() {
      // 初始化草稿，收藏，代办数量
      var sendData = {
        queryOutRelevantNum: 1, //是否查询相关外单数
        queryOutNum: 1, //是否查询外部单数
        queryDraftNum: 1, //是否查询草稿数
        queryCollectionNum: 1, //是否查询收藏数
        queryTodoNum: 1 //是否查询代办数
      };
      initHead(sendData).then(res => {
        if (res.code != "0") {
          return _.alert("提示", res.desc);
        }
        if (res.data.draftNum || res.data.draftNum > -1) {
          //草稿单
          dataBase.home.newHeadData.nav[1].num = res.data.draftNum;
        }
        if (res.data.collectionNum || res.data.collectionNum > -1) {
          //收藏单
          dataBase.home.newHeadData.nav[2].num = res.data.collectionNum;
        }
        if (res.data.todoNum || res.data.todoNum > -1) {
          //待办
          dataBase.home.newHomeFooterList.nav[1].num = res.data.todoNum;
        }
      });
    },
  },
  activated() {
    let _this = this;
    updatePageCount(() => {_this.initCount()});
  }
};
</script>

<style lang="scss">
.index-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 6;
  background-color: #fff;
}
@media screen and (min-width: 450px) {
  ::-webkit-scrollbar {
    width: 5px;
    background-color: #F4F6F8;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #e5e5e5;;
  }
}
</style>

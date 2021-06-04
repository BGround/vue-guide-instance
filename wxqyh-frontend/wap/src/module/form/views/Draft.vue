<template>
    <div class="no-nav-wrap">
      <div class="qwui-nav_box_fixed">
        <search-box
          :searchinput="searchBar"
          :keyWord="this.setting.keyWord"
          placeholder="搜索"
          tips="搜索标题"
          @listenToSearchBox="showMsgFromSearchBar">
        </search-box>
      </div>
      <div class="list-container"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="10"
        infinite-scroll-immediate-check="false"
        :class="{'no-record': showrecord}"
      >
        <avatar-list :list="list" :showOption="true" @initOption="initOption"></avatar-list>
        <load-more
          v-show="!isLoading"
          :showrecord="showrecord"
          :busy="busy"
          :loading="loading"
          @childevent="loadMore"
          :listCount="list.length"
        >
        </load-more>
      </div>

      <dialog-mask-bottom :dialogConfig="dialogBottomConfig"></dialog-mask-bottom>
      <dialog-group
        :btnConfig="btnConfig"
        :show="showDialogGroup"
        @delItem="delItem"
        @cancel="cancel"
      >
        <p class="confirm-msg">确认删除该表单？</p>
      </dialog-group>
    </div>

</template>

<script>
import DialogGroup from "../components/base/newBase/DialogGroup";
import SearchBox from "../components/base/newBase/SearchBox.vue";
import LoadMore from "../components/base/load_more";
import DialogMaskBottom from "@/components/base/dialog_mask_bottom.vue";
import AvatarList from "../components/list/AvatarList";
import dataBase from "../dataBase";
import { initListByType } from "../api/list";
import {updateCache} from '../assets/js/keepAlive.js'

export default {
  components: {
    SearchBox,
    LoadMore,
    DialogMaskBottom,
    AvatarList,
    DialogGroup
  },
  data() {
    return {
      isLoading: true,
      list: [],
      current: {
        item: null,
        index: ""
      },
      searchBar: {
        //头部搜索框
        show: true,
        keyWord: "",
        rightSpan: {
          show: false,
          callback: null
        }
      },
      busy: false,
      currPage: 1,
      maxPage: 0,
      loading: false,
      setting: {
        page: 1,
        keyWord: "",
        pageSize: 20, //默认10
        status: 0,
        paramSearchType: 2
      },
      btnConfig: [
        {
          text: '删除',
          callbackName: 'delItem',
          isPrimary: true
        },
        {
          text: '取消',
          callbackName: 'cancel',
          isPrimary: false
        }
      ],
      showDialogGroup: false,
      dialogBottomConfig: dataBase.dialogBottomConfig
    };
  },
  created() {
    dataBase.dialogBottomConfig.title = "确认删除该表单？";
    dataBase.dialogBottomConfig.btnConfig.length = 0;
    dataBase.dialogBottomConfig.btnConfig[0] = {
      title: " 删除",
      callBack: null,
      primary: true
    };
    dataBase.dialogBottomConfig.btnConfig[1] = {
      title: " 取消",
      callBack: null
    };
    this.setting.keyWord = this.getStore("draftKeyWord") || "";
    this.$set(this.searchBar, "keyWord", this.getStore("draftKeyWord") || "");
    this.initList();
  },
  computed: {
    showrecord() {
      this.list = this.list || [];
      return this.list.length == 0 ? true : false;
    }
  },
  methods: {
    //删除列表
    updateList(index) {
      this.list.splice(index, 1);
    },
    loadMore() {
      if (this.list.length < this.setting.pageSize) return;
      this.setting.page++;
      this.loading = true;
      this.busy = true;
      this.initList();
    },
    async initList() {
      this.setting.workOrderSearchVOJson = JSON.stringify({ formTitle: this.setting.keyWord })
      let _this = this,
        res = await initListByType(this.setting)
      if(this.isLoading) this.isLoading = false;
      this.setList(res);
    },
    setList(res) {
      // 设置列表数据
      this.loading = false;
      this.setting.page = res.currPage;
      this.busy = this.setting.page == res.maxPage;
      this.list = this.list.length > 0 ? this.list.concat(res.pageData) : res.pageData;
    },
    delItem() {
      let _this = this;
      _this.showDialogGroup = false;
      _.showLoading();
      //判断能否删除
      _.ajax({
        url: _.baseURL + "/portal/portalForm/ajaxBatchCheck.do",
        type: "post",
        data: {
          ids: _this.current.item.id
        },
        dataType: "json",
        success: function(result) {
          if (result.code != "0") {
            //不能删除
            _.hideLoading();
            _.alert("提示", result.desc);
          } else {
            _.ajax({
              url: _.baseURL + "/portal/portalForm/ajaxBatchDelete.do",
              type: "post",
              data: {
                ids: _this.current.item.id
              },
              dataType: "json",
              success: function(result) {
                _.hideLoading();
                if ("0" == result.code) {
                  _this.list.splice(_this.current.index, 1);
                  _.tooltips_succeed("删除成功", true);
                  updateCache('', true) //更新首页数量信息
                } else {
                  _.alert("提示", result.desc);
                }
              }
            });
          }
        }
      });

    },
    cancel() {
      this.showDialogGroup = false;
    },
    showMsgFromSearchBar(value) {
      if (this.setting.keyWord == value) return;
      this.list = [];
      this.setting.page = 1;
      this.busy = false;
      this.setting.keyWord = value;
      this.initList();
    },
    initOption(item, index) {
      this.showDialogGroup = true;
      this.current.item = item;
      this.current.index = index;
    },
    setStore(key, value) {
      value = JSON.stringify(value);
      sessionStorage.setItem(key, value);
    },
    getStore(key) {
      return JSON.parse(sessionStorage.getItem(key));
    }
  },
  beforeDestroy() {
    this.isLoading = true;
    // 组件销毁前缓存搜索条件
    this.setStore("draftKeyWord", this.setting.keyWord);
  }
};
</script>

<style lang="scss" scoped>
.qwui-nav_box_fixed {
  position: fixed;
  z-index: 9;
  width: 100%;
}
.qwui-cardList {
  padding-top: 0;
}
.confirm-msg {
  margin-top: 5px;
  height: 110px;
  line-height: 110px;
  text-align: center;
  font-size: 16px;
  font-family: 'Microsoft YaHei','宋体', Tahoma, Arial, sans-serif;
  font-weight: 400;
  color: rgba(27, 35, 58, 1);
}
.no-record {
  height: 100%;
  background: #fff;
}
.recard-wrapper {
  margin-top: 50%;
}
.list-container {
  position: fixed;
  top: 52px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
  &.no-record {
    background: #fff;
  }
  @media screen and (min-width: 1024px) {
    width: 740px;
    margin: auto;
  }
  @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 812px) and (device-width: 375px) {
    bottom: 34px;
  }
  @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 896px) and (device-width: 414px) {
    bottom: 34px;
  }
}
</style>

<template>
  <div
    class="collection-form no-nav-wrap"
    :class="{'no-record': showrecord}"
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="busy"
    infinite-scroll-distance="10"
    infinite-scroll-immediate-check="false"
  >
    <div class="qwui-nav_box_fixed">
      <search-box :searchinput="searchBar"
                  :keyWord="setting.keyWord"
                  placeholder="搜索名称"
        @listenToSearchBox="showMsgFromSearchBar"></search-box>
    </div>
    <h3 class="collection-title">常用表单（前4个表单显示在首页）<span :class="{'title-disable': !cansort}" @click="changBtnStatus">{{canDrag === 0 ? '排序' : '完成'}}</span></h3>
    <div class="collection-wrapper">
      <sortable-list 
        lockAxis="y" 
        v-model="list" 
        :useDragHandle="true" 
        helperClass="sortting"
      >
        <sortable-item 
          v-for="(item, index) in list"
          :key="index" 
          :index="index"
          :item="item"
          :canDrag="canDrag"
        >
        </sortable-item>
      </sortable-list>
      <dialog-mask-bottom :dialogConfig="dialogBottomConfig"></dialog-mask-bottom>
      <load-more :busy="busy"
        :loading="loading"
        :showrecord="showrecord"
        @childevent="loadMore"
      >
      </load-more>
    </div>
  </div>
</template>

<script>
import SortableList from '../components/base/newBase/SortableList'
import SortableItem from '../components/base/newBase/SortableItem'
import DialogMaskBottom from "@/components/base/dialog_mask_bottom"
import SearchBox from "../components/base/newBase/SearchBox"
import LoadMore from "../components/base/load_more"
import {updateCache} from '../assets/js/keepAlive.js'
import { collection, saveCollectionSort } from "../api/list"

export default {
  components: {
    SearchBox,
    DialogMaskBottom,
    LoadMore,
    SortableList,
    SortableItem
  },
  data() {
    return {
      styleElem: null,
      list: [],
      canDrag: 0,
      searchBar: {
        //头部搜索框
        show: true,
        keyWord: "标题"
      },
      //        isGroup:true,
      busy: false,
      currPage: 1,
      maxPage: 0,
      loading: false,
      setting: {
        page: 1,
        keyWord: "",
        pageSize: 20, //默认10
        status: 0,
        type: 1
      },

      dialogBottomConfig: {
        show: false, //控制弹窗显示与否
        title: "", //头部标题，设置为空的话不显示
        btnConfig: [
          //自定义弹框操作,可以设置回调函数
          { title: "填写表单", callBack: null }, //primary为true显示为红色，默认为灰色
          { title: "查看明细数据", callBack: null },
          { title: "取消收藏", callBack: null },
          { title: " 取消", callBack: null }
        ]
      }
    };
  },
  computed: {
    showrecord() {
      this.list = this.list || [];
      return this.list.length == 0 ? true : false;
    },
    cansort() {
      return this.list.length !== 0 && this.setting.keyWord === '' ? true : false;
    }
  },
  created() {
    let _this = this;
    this.setting.keyWord = this.getStore("collectionKeyWord") || "";
    this.$set(
      this.searchBar,
      "keyWord",
      this.getStore("collectionKeyWord") || ""
    );
    this.initList();
    Events.$off('delCollection');
    Events.$on('delCollection', function (index) {
      _this.list.splice(index, 1);
    })
  },
  mounted() {
    let cssString = 'body,html {background: #fff;}}'
    this.styleElem = document.createElement("style");
    this.styleElem.setAttribute("type", "text/css");
 
    if(this.styleElem.styleSheet){// IE
      this.styleElem.styleSheet.cssText = cssString;
    } else {// w3c
      var cssText = document.createTextNode(cssString);
      this.styleElem.appendChild(cssText);
    }
  
    var heads = document.getElementsByTagName("head");
    if(heads.length)
      heads[0].appendChild(this.styleElem);
    else
      document.documentElement.appendChild(this.styleElem);
  },
  methods: {
    loadMore() {
      if (this.list.length < this.setting.pageSize) return;
      this.setting.page++;
      this.loading = true;
      this.busy = true;
      this.initList();
    },
    changBtnStatus() {
      if(!this.cansort) return; //搜索时不排序
      if(this.canDrag === 0) {
        this.canDrag = 1;
        return;
      }else { //完成
        this.canDrag = 0;
        _.showLoading();
        let sortList = this.sortCollectionList();
        saveCollectionSort(sortList).then(res => {
          _.hideLoading();
          if(res.code != 0) _.alert('提示：', res.desc);
          _.tooltips_succeed("保存成功", true);
          updateCache('mainPage'); //更新首页头部收藏
        })
      }
    },
    sortCollectionList() {
      let data = {
        'idArr': "",
        'definitionArr': ""
      };
      this.list.forEach(item => {
        data.idArr=data.idArr+"|"+item.id;
        data.definitionArr=data.definitionArr+"|"+item.definitionVersionsId;
      });
      data.idArr=data.idArr.substring(1);
      data.definitionArr=data.definitionArr.substring(1);
      return data;
    },
    initList() {
      var _this = this;
      _.showLoading();
      collection(_this.setting).then(res => {
        _this.setList(res);
      });
    },
    setList(res) {
      // 设置列表数据
      this.loading = false;
      _.hideLoading();
      if (res.code != "0") {
        return _.alert("提示", res.desc);
      } else {
        this.setting.page = res.data.currPage;
        this.busy = this.setting.page == res.data.maxPage;
        this.list =
          this.list.length > 0
            ? this.list.concat(res.data.pageData)
            : res.data.pageData;
      }
    },
    showMsgFromSearchBar(value) {
      if (this.setting.keyWord == value) return;
      this.list = [];
      this.setting.page = 1;
      this.busy = false;
      this.setting.keyWord = value;
      this.initList();
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
    // 组件销毁前缓存搜索条件
    this.setStore("collectionKeyWord", this.setting.keyWord);
    this.styleElem.remove();
    this.styleElem = null;
  }
};
</script>

<style lang="scss" scoped>
.qwui-nav_box_fixed {
  position: fixed;
  z-index: 2;
  width: 100%;
}
.collection-form /deep/ .qwui-no_record_box .qwui-no_record_icon {
  background-image: url(../assets/images/img_commom_emptypage@2x.png) !important;
  background-position: center !important;
}
.collection-form .sortable-drag {
  opacity: 1;
  box-shadow: 0px 2px 10px 0px rgba(178, 185, 200, 0.45);
  background: #fff;
}
.collection-form {
  min-height: 100%;
  &.no-record {
    height: 100%;
    background: #fff;
  }
  .collection-title {
    position: fixed;
    top: 52px;
    left: 0;
    right: 0;
    z-index: 1;
    width: 100%;
    box-sizing: border-box;
    height: 44px;
    line-height: 44px;
    background: rgba(255,255,255,1);
    padding: 0 14px;
    font-size: 14px;
    font-family: 'Microsoft YaHei','宋体', Tahoma, Arial, sans-serif;
    font-weight: 500;
    color: rgba(10,23,53,1);
    border-bottom: 1px solid #f7f8fb;
    @media screen and (min-width: 1024px){
      width: 740px;
      margin: auto;
    }
    > span {
      float: right;
      color: #5077AA;
      &.title-disable {
        color: #B2B9C8;
      }
    }
  }
  .collection-wrapper {
    padding-top: 96px;
  }
}
.list-move {
  transition: all .5s ease-in-out;
}
.form-item:nth-of-type(4) {
  margin-bottom: 8px;
}
</style>
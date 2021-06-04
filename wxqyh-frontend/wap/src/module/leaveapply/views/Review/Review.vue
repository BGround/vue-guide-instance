<template>
  <div class="review"
       v-infinite-scroll="loadMore"
       infinite-scroll-disabled="busy"
       infinite-scroll-distance="10" :class="{'no-record': list.length < 1, 'mt-43': haSearch}">
    <div v-show="haSearch">
      <div
          class="qwui-nav_box_fixed"
          :class="{'rise': ZIndex.review, 'qwui-search_mask': setTopMask}"
          @click="changeZIndex">
        <search-bar
          :searchinput="searchinput"
          @listenToSearchBox="getKeyWordSearch"
          @setDialog="setDialog"
        ></search-bar>
      </div>
    </div>
    <ul v-if="!setTopMask">
      <user-title-list v-for="(item,index) in list" :key="index" :toParams="{name:'detail', query: { askId: item.askId}}" :styleObject="{paddingLeft:'15px'}">
        <p class="qwui-list_item_title paddingRight limit_show" slot="title">{{item.title}}</p>
        <div>
          <span
            class="applyStatus"
            :class="setStatusClass(item.auditStatus)"
          >{{item.auditStatus}}</span>
          <p class="qwui-list_user_content type_name">
            <span class="descriptSpan">
              {{item.typeName +  ' ' + item.sumAskDays+'天'}}
            </span>
          </p>
          <p class="ask-descript">
            <img class="avatar" :src="item.headPic"> {{item.personName}}
          </p>
        </div>
        <span class="time">{{item.startTime.slice(5, 10)}}</span>
      </user-title-list>
    </ul>
    <load-more
			:busy="busy"
			:loading="loading"
			:showrecord="showrecord"
			@childevent="loadMore" ></load-more>
  </div>
</template>

<script>
import { getReviewList } from "../../api/getData.js";
import { mixinPage } from "../../mixin.js";
export default {
  mixins: [mixinPage],
  data() {
    return {
      setTopMask: false,
      postData: {
        keyWord: "",
        page: 1,
        pageSize: 20
      },
      searchinput: {
        show: true,
        keyWord: ""
      },
      haSearch: false,
      isShowOption: false,
      isShowAvatar: true
    };
  },
  created() {
    this.initList();
  },
  methods: {
    initList(isLoadMore) {
      var _this = this;
      _.showLoading(); //显示loading
      getReviewList(_this.postData).then(res => {
        //请求列表数据searchValue为搜索内容
        this.haSearch = !(!res.data.pageData && this.postData.keyWord == ''); // 是否显示搜素框
        _this.setList(res, isLoadMore);
      });
    },
    getKeyWordSearch(keyWord) {
      this.postData.keyWord = keyWord;
      this.postData.page = 1;
      this.initList();
    },
    changeZIndex() {
      this.ZIndex.review = true;
      this.ZIndex.curr = 'review';
    },
    setDialog(val) {
      this.setTopMask = val;
    }
  }
};
</script>
<style scoped>
.mt-43 {
  margin-top: 43px;
}
.no-record {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 50;
  right: 0;
  bottom: 50px;
  background-color: white;
}
.list-box {
  overflow-y: auto;
}
.qwui-nav_box_fixed {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
  transition: top 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.qwui-nav_box_fixed.rise {
  z-index: 11;
}
.ask-descript {
  padding-top: 8px;
  line-height: 1;
  font-size: 13px;
  color: #999;
}
.ask-descript .avatar {
  width: 15px;
  height: 15px;
  margin-right: 5px;
  border-radius: 100%;
  max-width: 100%;
  vertical-align: middle;
}
.time {
  position: absolute;
  top: 13px;
  right: 15px;
  color: #bbb;
  font-size: 14px;
}
.review /deep/ .qwui-list_item_box {
  padding: 12px 0 12px 0;
}
.review /deep/ .qwui-list_item_user {
  padding-top: 0px;
}
</style>

<template>
  <div class="related"
       v-infinite-scroll="loadMore"
       infinite-scroll-disabled="busy"
       infinite-scroll-distance="10" :class="{'no-record': list.length < 1, 'mt-43': haSearch}">
    <div v-show="haSearch">
      <div
        class="qwui-nav_box_fixed"
        ref="relate_search"
        :class="{'rise': ZIndex.related , 'qwui-search_mask': setTopMask}"
        @click="changeZIndex">
        <search-bar
          :searchinput="searchBar"
          @listenToSearchBox="getSearchMessage" @listenToClearInput="clearInput"
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
              {{item.typeName + item.sumAskDays+'天'}}
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
      @childevent="loadMore"></load-more>
  </div>
</template>

<script>
import { getPageList } from "../../api/getData.js";
import { mixinPage } from "../../mixin.js";
import * as timeUtil from "@/assets/js/time-util";

export default {
  mixins: [mixinPage],
  data() {
    return {
      setTopMask: false,
      haSearch: false,
      searchBar: {
        //头部搜索框
        show: true,
        keyWord: "",
        moreFunction: {
          show: true,
          option: [
            {
              name: "标题",
              placeholder: "搜索标题、人名"
            },
            {
              name: "部门",
              placeholder: "按部门搜索",
              value: "depart"
            },
            {
              name: "审批时间",
              placeholder: "按审批时间搜索",
              value: "lastAuditTime"
            }
          ]
        }
      },
      postData: {
        status: "all",
        type: 2,
        typeName: "",
        typeVal: "",
        keyWord: "",
        page: 1,
        pageSize: 20
      },
      element: null
    };
  },
  created() {
    this.initList();
    this.searchBar.moreFunction.option[2].callback = this.showTimeInput;
  },
  mounted(){
    this.element = $(this.$refs.relate_search).find('.qwui-search_input');
    let _this = this;
    let config = dataBase.timePluginConf();
    this.element.mobiscroll().date(config);
    this.element.on('change',function(e){
       if(_this.searchBar.keyWord == e.target.value) {
        _this.setDialog(false);
      } else {
        _this.searchBar.keyWord = e.target.value;
      }
    })
  },
  destroyed() {
    this.element = null;
  },
  methods: {
    initList(isLoadMore) {
      var _this = this;
      _.showLoading(); //显示loading
      getPageList('related', _this.postData).then(res => {
        //请求列表数据searchValue为搜索内容
        this.haSearch = !(!res.data.pageData && this.postData.keyWord == ''); // 是否显示搜素框
        _this.setList(res, isLoadMore);
      });
    },
    showTimeInput: function() {
      //搜索框的输入特殊功能，弹出时间插件
      lockScroll();
      $(this.$refs.relate_search).find('.qwui-search_input').mobiscroll('show');
    },
    getSearchMessage(keyWord, type) {
      unLockScroll();
      this.postData.keyWord = keyWord;
      this.postData.page = 1;
      this.postData.typeName = type;

      this.initList();
    },
    changeZIndex() {
      this.ZIndex.related = true;
      this.ZIndex.curr = 'related';
    },
    clearInput() {
      this.searchBar.keyWord = ''
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
.related /deep/ .qwui-list_item_box {
  padding: 12px 0 12px 0;
}
.related /deep/ .qwui-list_item_user {
  padding-top: 0px;
}
</style>

<template>
  <CrmPageLoading v-if="pageLoading"></CrmPageLoading>
  <div class="crm-competitor-list"
       v-else>
    <div class="competitor-header">
      <div class="competitor-header-search">
        <search-box class="competitor-header-search-left"
                    :searchinput="searchBar"
                    @listenToSearchBox="onSearch"
                    ref="searchBox">
        </search-box>
        <div class="competitor-header-search-right"
             @click="showAdvancedSearch = true">
          <i></i>
        </div>
      </div>
      <div class="competitor-header-tips">
        <p>
          共 {{totalRows}} 个竞争对手
        </p>
        <div class="competitor-header-tips-right"
             :idDisabled="!notReadNum">
          <span @click="getNotReadList"
                v-if="!showNotReadList">{{'未阅('+ notReadNum +')'}}</span>
          <!-- <i></i> -->
          <span @click="allRead"
                v-else>标记为已阅</span>
        </div>
      </div>
    </div>

    <div class="competitor-body"
         v-if="list.length>0||loadMoreStatus.loading"
         v-scroll="onScroll"
         ref="scrollBar">
      <div class="competitor-body-item"
           v-for="(item,index) in list"
           :key="index"
           @click="viewDetail(item)">
        <p class="item-title">{{item.competitorName}}</p>
        <div class="item-content">
          <div class="item-content-left">
            <p>
              <span>更新时间</span>
              <span>{{item.updateTime | dateFormat("YYYY-MM-DD HH:mm")}}</span>
            </p>
            <p>
              <span>竞争商机</span>
              <span>{{item.businessCount}}</span>
            </p>
            <p>
              <span>竞争力</span>
              <span>
                <template v-if="Number.parseInt(item.competitorPower)">
                  <i v-for="i in Number.parseInt(item.competitorPower)"
                     :key="i"
                     class="item-content-left-icon"></i>
                </template>
              </span>
            </p>
          </div>
          <div class="item-content-right">
            <span>{{item.personName}}</span>
            <crm-avator size="mini"
                        :avator-src="item.headPic"></crm-avator>
          </div>
        </div>
      </div>
      <load-more v-show="loadMoreStatus.show"
                 :show-loading="loadMoreStatus.loading"
                 :tip="loadMoreStatus.tips">
      </load-more>
    </div>
    <div class="competitor-nodata"
         v-else>
      <div class="competitor-nodata-img"
           :class="{'search-result-img':params.search}"></div>
      <div class="competitor-nodata-tips">没有竞争对手</div>
    </div>
    <div class="crm_fixed_nail"
         @click="onClickAdd"
         v-show="!showNotReadList"></div>

    <!-- 高级搜索 -->
    <advanced-search v-model="showAdvancedSearch"
                     @onAdvancedSearch="onAdvancedSearch"
                     ref="advancedSearch">
    </advanced-search>
  </div>
</template>

<script>
import SearchBox from "@/components/base/search_box";
import CrmAvator from "crm/components/CrmAvator";
import CrmPageLoading from "crm/components/CrmPageLoading";
import CrmFixedNail from "crm/components/CrmFixedNail/CrmFixedNail";
import AdvancedSearch from "./components/AdvancedSearch";
import { LoadMore, dateFormat } from "vux";
import {
  getCompetitorList,
  updateAllReadStatus,
  getNotReadCompetitorNum
} from "crm/api/competitor";
import { mapActions } from "vuex";

export default {
  name: "CrmCompetitorList",
  components: {
    SearchBox,
    CrmFixedNail,
    CrmAvator,
    CrmPageLoading,
    LoadMore,
    AdvancedSearch
  },
  filters: {
    dateFormat
  },
  data() {
    return {
      searchBar: {
        // 搜索框配置
        show: true, //搜索框，默认显示
        keyWord: "",
        moreFunction: {
          show: false,
          option: [
            {
              name: "标题",
              placeholder: "搜索标题"
            }
          ]
        }
      },
      list: [],
      params: {
        page: 1
      },
      totalRows: "",
      pageLoading: true,
      loadStatus: "loading",
      showAdvancedSearch: false,
      scrollTop: 0,
      notReadNum: "",
      showNotReadList: false //显示的是否是未阅列表
    };
  },
  computed: {
    loadMoreStatus() {
      let _status = {
        loading: {
          show: true,
          loading: true,
          tips: "正在加载"
        },
        nodata: {
          show: true,
          loading: false,
          tips: "暂无数据"
        },
        nomore: {
          show: true,
          loading: false,
          // tips: "没有更多"
        },
        loadfail: {
          show: true,
          loading: false,
          tips: "加载失败"
        }
      };
      return (
        _status[this.loadStatus] || {
          show: false
        }
      );
    }
  },
  watch: {
    $route(val) {
      this.showNotReadList = !!val.query.showNotReadList;
    },
    showNotReadList(val) {
      this.params = {
        page: 1,
        ["searchValue.readStatus"]: val ? 0 : ""
      };
      this.$refs.advancedSearch.reset();
      this.list = [];
      this.getList();
    }
  },
  created() {
    this.getList();
    //添加到缓存
    this.addCachePage("CrmCompetitorList");
    this.getNotReadNum();
  },
  activated() {
    if (this.scrollTop > 0) {
      this.$refs.scrollBar.scrollTop = this.scrollTop;
    }
    !this.showNotReadList && this.getNotReadNum();
  },
  methods: {
    ...mapActions(["addCachePage"]),
    // 加载更多客户列表
    onScroll(el) {
      let scrollTop = el.scrollTop;
      let offsetHeight = el.offsetHeight;
      let scrollHeight = el.scrollHeight;
      this.scrollTop = scrollTop;

      if (scrollTop + offsetHeight >= scrollHeight - 50) {
        if (!this.loadStatus) {
          this.getList();
        }
      }
    },
    //获取列表
    getList() {
      this.loadStatus = "loading";
      getCompetitorList(this.params).then(res => {
        this.pageLoading = false;
        if (res.code == 0) {
          this.params.page = res.data.currPage + 1;
          if (res.data.currPage == 1) {
            this.list = res.data.pageData || [];
          } else {
            this.list = this.list.concat(res.data.pageData);
          }

          this.totalRows = res.data.totalRows;
          if (this.list.length === 0) {
            this.loadStatus = "nodata";
          } else if (res.data.currPage >= res.data.maxPage) {
            this.loadStatus = "nomore";
          } else {
            this.loadStatus = "";
          }
        } else {
          this.loadStatus = "loadfail";
          _.alert("提示信息", res.desc);
        }
      });
    },
    viewDetail(item) {
      if (this.showNotReadList) {
        setTimeout(() => {
          this.list = this.list.filter(pre => {
            return pre.id != item.id;
          });
          this.notReadNum--;
          this.totalRows--;
        });
      }
      this.$router.push(`/competitor/detail/${item.id}`);
    },
    // 搜索
    onSearch(val) {
      Object.assign(this.params, {
        page: 1,
        search: true,
        ["searchValue.competitorName"]: val
      });
      this.list = [];
      this.totalRows = 0;
      this.getList();
    },
    // 高级搜索
    onAdvancedSearch(data) {
      Object.assign(
        this.params,
        {
          ["searchValue.businessIds"]: "",
          ["searchValue.toPerson"]: "",
          ["searchValue.ccPerson"]: "",
          ["searchValue.createPerson"]: "",
          ["searchValue.chargeType"]: "",
          ["searchValue.stageType"]: ""
        },
        {
          page: 1,
          search: true,
          ...data
        }
      );
      this.list = [];
      this.totalRows = 0;
      this.getList();
    },
    onClickAdd() {
      this.$router.push({ path: "/competitor/add", query: { from: "list" } });
    },
    //获取未阅条数
    getNotReadNum() {
      getNotReadCompetitorNum().then(res => {
        if (res.code == 0) {
          this.notReadNum = res.data.notReadCompetitorNum;
        }
      });
    },
    //一键已阅
    allRead() {
      if (!this.notReadNum) {
        return;
      }
      _.alert("提示", "确认将所有未阅标记成已阅", {
        primaryBtn: {
          name: "确认",
          callBack: () => {
            _.showLoading();
            updateAllReadStatus().then(res => {
              _.hideLoading();
              if (res.code == 0) {
                this.notReadNum = 0;
                this.$router.go(-1);
              } else {
                _.alert("提示信息", res.desc);
              }
            });
          }
        },
        defaultBtn: { name: "取消", callBack: null }
      });
    },
    //获取未阅列表
    getNotReadList() {
      if (!this.notReadNum) {
        return;
      }
      this.$router.push({
        path: "/competitor/list",
        query: {
          showNotReadList: true
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "crm/components/CrmFixedNail/CrmFixedNail.scss";

.crm-competitor-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  .competitor-header {
    background-color: #fff;

    &-search {
      display: flex;
      align-items: center;
      &-left {
        flex: 1;
      }
      &-right {
        padding: 10px 15px 10px 0;
        i {
          display: inline-block;
          height: 20px;
          width: 20px;
          background: url("~assets/images/qwui-content.png") no-repeat;
          background-position: 0px -18px;
          background-size: 100%;
        }
      }
    }
    &-tips {
      padding: 5px 15px;
      font-size: 13px;
      color: #b2b9c8;
      display: flex;
      justify-content: space-between;
      &-right {
        display: flex;
        align-items: center;
        color: #5585f0;
        &[idDisabled="true"] {
          color: #b2b9c8;
        }
        i {
          height: 12px;
          border-left: 1px solid #f5f5f5;
          margin: 0 8px;
        }
      }
    }
  }
  .competitor-body {
    background-color: #fff;
    margin-top: 8px;
    flex: 1;
    overflow-y: auto;
    &-item {
      padding: 10px 15px;
      border-bottom: 1px solid #f7f7f7;
      .item-title {
        font-size: 16px;
        margin-top: 4px;
        color: #0a1735;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 1;
        word-break: break-all;
      }
      .item-content {
        margin-top: 6px;
        color: #7a7c80;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        &-left {
          font-size: 14px;
          p {
            height: 1.5em;
            display: flex;
            span:first-child {
              margin-right: 16px;
              width: 4em;
              text-align: justify;
              &::after {
                display: inline-block;
                content: "";
                padding-left: 100%;
              }
            }
            span:last-child {
              display: flex;
              align-items: center;
            }
          }
          &-icon {
            width: 13px;
            height: 15px;
            display: inline-block;
            background: url("~assets/images/crm/icon_flash.png") no-repeat;
            background-size: contain;
            &:first-child {
              margin-left: -3px;
            }
          }
        }
        &-right {
          display: flex;
          align-items: center;
          span {
            margin-right: 6px;
            font-size: 11px;
            max-width: 6em;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
  .competitor-nodata {
    flex: 1;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    &-img {
      margin-top: 80px;
      width: 160px;
      height: 160px;
      background: url("~assets/images/crm/crm_nocomment.png") no-repeat;
      background-size: contain;
    }
    &-tips {
      margin-top: 8px;
      color: #b2b9c8;
      font-size: 14px;
    }
    .search-result-img {
      background: url("~assets/images/crm/crm_nosearch.png") no-repeat;
      background-size: contain;
    }
    .search-result-title {
      font-size: 18px;
      color: #666;
    }
    .search-result-text {
      margin-top: 10px;
      font-size: 14px;
      color: #bbb;
    }
  }
}
</style>
<style lang="scss">
.crm-competitor-list {
  .competitor-header {
    .qwui-search_wrap {
      .qwui-search_bar {
        padding: 8px 14px;
        &:after {
          border: 0;
        }
        .qwui-search_inner {
          .icon_search,
          .qwui-search_input {
            top: 0;
            bottom: 0;
            margin: auto;
            height: 26px;
            line-height: 26px;
          }
        }
        .qwui-search_inner {
          background-color: #f4f6f8;
          border-radius: 4px;
        }
        .qwui-search_text {
          height: 36px;
          line-height: 36px;
          margin: 8px 14px;
          right: 0;
          bottom: 0;
          top: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            font-size: 14px;
            margin-left: 5px;
          }
        }
        .qwui-search_hanber {
          padding-right: 15px;
          margin: 6px 0;
        }
      }
    }
  }
  .vux-loadmore {
    font-size: 10px;
    &.weui-loadmore_line {
      margin-top: 20px;
      &:before,
      &:after {
        border: 0;
      }
    }
    .weui-loadmore__tips {
      color: #b2b9c8;
      font-size: 13px;
      top: -10px;
    }
  }
}
</style>




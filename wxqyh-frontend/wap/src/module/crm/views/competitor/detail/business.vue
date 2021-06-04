<template>
  <div class="crm-competitor-detail-business"
       v-scroll="onScroll">
    <div class="business-list"
         v-if="businessList.length>0">
      <div class="business-item"
           v-for="(item,index) in businessList"
           :key="index"
           @click="viewDetail(item.id)">
        <p class="item-title">{{item.title}}</p>
        <div class="item-content">
          <div class="item-content-left">
            <p>
              <span>所属客户</span>
              <span>{{item.clientName}}</span>
            </p>
            <p>
              <span>商机阶段</span>
              <span>{{`${item.stageName}（${item.winRate}%）`}}</span>
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
                 :tip="loadMoreStatus.tips"></load-more>
    </div>

    <div class="competitor-nodata"
         v-else>
      <div class="competitor-nodata-img"></div>
      <div class="competitor-nodata-tips">没有竞争商机</div>
    </div>
    <div class="crm_fixed_nail"
         v-if="isCharge"
         @click="onClickAdd"></div>
    <!-- 商机列表弹窗 -->
    <div v-transfer-dom>
      <checklist-popup v-model="showBusinessPopup"
                       :load-status="checklistLoadStatus"
                       :checklist-option="checklistBusiness"
                       :default-checked="checkedBusiness"
                       :is-search="params.search"
                       @onSearch="checklistOnSearch"
                       @confirmChecked="confirmChecked"
                       @loadMore="checklistLoadMore"></checklist-popup>
    </div>
  </div>
</template>
<script>
import CrmAvator from "crm/components/CrmAvator";
import { LoadMore, TransferDom } from "vux";
import {
  getCompetitorBusinessList,
  listCompetitorBusiness,
  addCompetitorBusiness
} from "crm/api/competitor";
import ChecklistPopup from "../components/ChecklistPopup";
import { mapActions } from "vuex";

export default {
  name: "CrmCompetitorDetailBusiness",
  props: ["business", "isCharge"],
  components: { CrmAvator, LoadMore, ChecklistPopup },
  directives: { TransferDom },
  data() {
    return {
      businessList: [],
      currPage: 1,
      loadStatus: "", //列表加载状态
      checklistLoadStatus: "", //弹窗商机列表加载状态
      showBusinessPopup: false, //是否显示商机列表弹窗
      meBusinessList: [], //我相关的商机列表
      checkedBusiness: [], //弹窗选中的商机
      params: {
        //弹窗商机列表请求参数
        page: 1,
        pageSize: 15,
        competitorId: this.$route.params.id,
        keyWord: ""
      }
    };
  },
  computed: {
    loadMoreStatus() {
      let mun = 0;
      this.businessList.forEach(item => {
        mun += Number.parseFloat(item.estimatedSale) / 10000;
      });
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
          tips: `共计${mun.toFixed(2)}万元`
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
    },
    checklistBusiness() {
      return this.meBusinessList.map(res => {
        return {
          key: res.id,
          value: res.title
        };
      });
    }
  },
  watch: {
    business: {
      handler() {
        this.init();
      },
      deep: true
    },
    showBusinessPopup(val) {
      if (val) {
        this.params.page = 1;
        this.getChecklist();
      }
    }
  },
  created() {
    this.init();
  },
  activated() {
    this.removeCachePage("CrmCompetitorDetail");
    this.delCacheArray({ name: "CrmCompetitor" });
  },
  methods: {
    ...mapActions(["addCachePage", "removeCachePage"]),
    ...mapActions("list", ["setCacheArray", "delCacheArray"]),
    //查看商机详情
    viewDetail(id) {
      this.setCacheArray({ name: "CrmCompetitor" });
      this.addCachePage("CrmCompetitorDetail");
      setTimeout(() => {
        this.$router.push({
          path: "/BusinessDetails/BusinessContent",
          query: { id: id, isPartner: "" }
        });
      });
    },
    init() {
      this.businessList = this.business.pageData || [];
      this.currPage = this.business.currPage;
      if (this.businessList.length === 0) {
        this.loadStatus = "nodata";
      } else if (this.business.currPage >= this.business.maxPage) {
        this.loadStatus = "nomore";
      } else {
        this.loadStatus = "";
      }
    },
    //列表获取
    getList() {
      this.loadStatus = "loading";
      getCompetitorBusinessList({
        page: this.currPage + 1,
        id: this.$route.params.id
      }).then(res => {
        if (res.code == 0) {
          this.currPage = res.data.currPage;
          if (this.currPage == 1) {
            this.businessList = res.data.pageData || [];
          } else {
            this.businessList = this.businessList.concat(res.data.pageData);
          }

          if (res.data.currPage >= res.data.maxPage) {
            this.loadStatus = "nomore";
          } else {
            this.loadStatus = "";
          }
        } else {
          this.loadStatus = "loadfail";
          this.$vux.alert.show({
            title: "提示信息",
            content: res.desc
          });
        }
      });
    },
    //列表滚动加载更多
    onScroll(el) {
      let scrollTop = el.scrollTop;
      let offsetHeight = el.offsetHeight;
      let scrollHeight = el.scrollHeight;

      if (scrollTop + offsetHeight >= scrollHeight - 50) {
        if (!this.loadStatus) {
          this.getList();
        }
      }
    },
    onClickAdd() {
      this.showBusinessPopup = true;
    },
    //获取添加列表
    getChecklist() {
      this.checklistLoadStatus = "loading";
      listCompetitorBusiness(this.params).then(res => {
        if (res.code == "0") {
          this.params.page = res.data.currPage + 1;
          if (res.data.currPage == 1) {
            this.meBusinessList = res.data.pageData || [];
          } else {
            this.meBusinessList = this.meBusinessList.concat(res.data.pageData);
          }

          if (this.meBusinessList.length === 0) {
            this.checklistLoadStatus = "nodata";
          } else if (res.data.currPage >= res.data.maxPage) {
            this.checklistLoadStatus = "nomore";
          } else {
            this.checklistLoadStatus = "";
          }
        } else {
          this.checklistLoadStatus = "loadfail";
          this.$vux.alert.show({
            title: "提示信息",
            content: res.desc
          });
        }
      });
    },
    //确定选择
    confirmChecked(val) {
      if (!val || val.length == 0) {
        this.showBusinessPopup = false;
        return;
      }
      this.$vux.loading.show({
        text: "加载中"
      });
      addCompetitorBusiness(this.$route.params.id, val.join(",")).then(res => {
        this.$vux.loading.hide();
        if (res.code == "0") {
          this.$emit("reload");
          this.showBusinessPopup = false;
        } else {
          this.$vux.alert.show({
            title: "提示信息",
            content: res.desc
          });
        }
      });
    },
    //弹窗列表搜索
    checklistOnSearch(val) {
      Object.assign(this.params, {
        page: 1,
        keyWord: val || "",
        search: !!val
      });
      this.meBusinessList = [];
      this.getChecklist();
    },
    //弹窗列表加载更多
    checklistLoadMore() {
      this.getChecklist();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "crm/components/CrmFixedNail/CrmFixedNail.scss";

.crm-competitor-detail-business {
  height: 100%;
  overflow-y: auto;
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  .business-list {
    flex: 1;
    overflow-y: auto;
  }
  .business-item {
    padding: 10px 15px;
    border-bottom: 1px solid #f7f7f7;
    &:first-child {
      margin-top: 20px;
    }
    .item-title {
      font-size: 16px;
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
          display: flex;
          span:last-child {
            margin-left: 16px;
            flex: 1;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            overflow: hidden;
            -webkit-line-clamp: 1;
            word-break: break-all;
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
  .competitor-nodata {
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
  }
}
</style>

<style lang="scss">
.crm-competitor-detail-business {
  .vux-loadmore {
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

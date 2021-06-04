<template>
  <CrmPageLoading v-if="pageLoading"></CrmPageLoading>
  <div class="crm-competitor-detail"
       v-else>
    <div class="competitor-detail-header">
      <h2 class="competitor-detail-header-title">
        {{competitorDetail.competitorName}}
      </h2>
      <div class="competitor-detail-header-nav">
        <tab v-model="activeTab"
             custom-bar-width="36px"
             active-color="#5585F0">
          <tab-item v-for="(item,index) in tabs"
                    :key="index">{{item}}</tab-item>
        </tab>
      </div>
    </div>
    <div class="competitor-detail-body">
      <!-- 详情 -->
      <info-component v-show="activeTab===0"
                      :competitorDetail="competitorDetail"></info-component>
      <!-- 商机列表 -->
      <business-component v-show="activeTab===1"
                          :business="business"
                          @reload="init()"
                          :isCharge="isCharge"></business-component>
      <!-- 修改记录 -->
      <log-component v-show="activeTab===2"
                     :modifyLog="modifyLog"></log-component>
    </div>
    <div class="competitor-detail-fotter"
         v-if="isCharge">
      <div class="competitor-detail-fotter-button"
           @click="edit()">
        <i class="icon-edit"></i>
        <span>编辑</span>
      </div>
      <div class="competitor-detail-fotter-button"
           @click="move()">
        <i class="icon-move"></i>
        <span>转移</span>
      </div>
      <div class="competitor-detail-fotter-button"
           @click="remove()">
        <i class="icon-remove"></i>
        <span>删除</span>
      </div>
    </div>
    <!-- 选人 -->
    <user_choose :selectconfig="dataBase.selectConfig"
                 v-if="dataBase.selectConfig.show"
                 :tabActive="dataBase.selectConfig.signIndex =='depts'?'dept':'group'"
                 :closeUser="dataBase.selectConfig.signIndex =='depts'"
                 :closeGroup="dataBase.selectConfig.signIndex =='depts'"
                 :closeAllTab="dataBase.selectConfig.signIndex =='depts'">
    </user_choose>
  </div>
</template>

<script>
import { Tab, TabItem } from "vux";
import {
  getCompetitorDetail,
  getCompetitorBusinessList,
  getModifyLog,
  deleteCompetitor,
  transferCompetitor
} from "crm/api/competitor";
import { mapMutations } from "vuex";
import CrmPageLoading from "crm/components/CrmPageLoading";
import user_choose from "@/components/base/user_or_dept_select.vue";
import businessComponent from "./business";
import infoComponent from "./info";
import logComponent from "./log";

export default {
  name: "CrmCompetitorDetail",
  components: {
    Tab,
    TabItem,
    CrmPageLoading,
    user_choose,
    businessComponent,
    infoComponent,
    logComponent
  },
  data() {
    return {
      dataBase: dataBase,
      activeTab: 0,
      competitorId: this.$route.params.id,
      competitorDetail: {},
      isCharge: false, //是否是责任人
      business: {},
      modifyLog: [],
      pageLoading: true
    };
  },
  computed: {
    tabs() {
      return [
        "详情",
        `竞争商机 ${this.business.pageData ? this.business.totalRows : ""}`,
        "修改记录"
      ];
    }
  },
  created() {
    this.init();
  },
  activated() {
    if (this.competitorId != this.$route.params.id) {
      this.pageLoading = true;
      this.competitorId = this.$route.params.id;
      this.init();
    }
  },
  methods: {
    ...mapMutations(["COMPETITOR_DETAIL"]),
    // 点击删除 弹窗确认
    remove() {
      _.alert("", "确认删除竞争对手？", {
        primaryBtn: { name: "确认", callBack: this.confirmRemove },
        defaultBtn: { name: "取消", callBack: null }
      });
    },
    // 确认删除
    confirmRemove() {
      _.showLoading();
      deleteCompetitor(this.competitorId).then(res => {
        _.hideLoading();
        if (res.code == "0") {
          this.$router.go(-1);
        } else {
          _.alert("提示信息", res.desc);
        }
      });
    },
    // 点击转移 选人
    move() {
      this.dataBase.selectConfig.selectList.toPersonList.userRestriction = 1;
      this.dataBase.selectConfig.signIndex = "toPersonList";
      this.dataBase.selectConfig.selectList.toPersonList.callBack.confirm = this.confirmMove;
      // this.dataBase.selectConfig.selectList[type].userSelected = JSON.parse(
      //   JSON.stringify(this.userSelected[type].selectedList)
      // );
      this.dataBase.selectConfig.show = true;
    },
    // 确认转移
    confirmMove(type, data) {
      if (data.user.data.length === 0) {
        _.alert("提示信息", "未选择负责人");
        return;
      }
      const uid = data.user.data[0].userId;
      _.showLoading();
      transferCompetitor(this.competitorId, uid).then(res => {
        _.hideLoading();
        if (res.code == 0) {
          this.init();
          // if (uid !== _.userId) {
          //   this.isCharge = false;
          //   this.competitorDetail.toPersons = data.user.data;
          // }
        } else {
          _.alert("提示信息", res.desc);
        }
      });
    },
    // 编辑
    edit() {
      // 存vuex
      this.COMPETITOR_DETAIL({
        value: this.competitorDetail
      });
      this.$router.push({
        path: "/competitor/add",
        query: { id: this.competitorId }
      });
    },
    init() {
      // 获取所以信息
      Promise.all([
        getCompetitorDetail(this.competitorId),
        getCompetitorBusinessList({ id: this.competitorId }),
        getModifyLog(this.competitorId)
      ])
        .then(res => {
          this.pageLoading = false;
          if (res[0].code == 0) {
            this.competitorDetail = res[0].data.competitorDetail;
            this.isCharge = res[0].data.isCharge;
          } else {
            _.alert("提示信息", res[0].desc);
            return;
          }

          if (res[1].code == 0) {
            this.business = res[1].data;
          } else {
            _.alert("提示信息", res[1].desc);
            return;
          }

          if (res[2].code == 0) {
            this.modifyLog = res[2].data.competitorModifyLog;
          } else {
            _.alert("提示信息", res[2].desc);
            return;
          }
        })
        .catch(err => {
          _.alert("提示信息", "网络错误");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.crm-competitor-detail {
  background-color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  .competitor-detail-header {
    &-title {
      font-size: 20px;
      color: #0a1735;
      font-weight: 400;
      padding: 0 15px;
      margin: 20px 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 3;
      word-break: break-all;
    }
  }
  .competitor-detail-body {
    flex: 1;
    overflow-y: hidden;
    position: relative;
  }
  .competitor-detail-fotter {
    height: 45px;
    border-top: 1px solid #f5f5f5;
    display: flex;
    &-button {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        width: 15px;
        height: 15px;
        display: inline-block;
        margin-right: 5px;
        background-repeat: no-repeat;
        background-size: contain;
        &.icon-edit {
          background-image: url("~assets/images/crm/icon-edit.png");
        }
        &.icon-move {
          background-image: url("~assets/images/crm/icon-move.png");
        }
        &.icon-remove {
          background-image: url("~assets/images/crm/icon-remove.png");
        }
      }
      span {
        color: #383838;
        font-size: 15px;
        line-height: 1em;
      }
    }
  }
}
</style>

<style lang="scss">
.crm-competitor-detail {
  .competitor-detail-header {
    &-nav {
      .vux-tab-item {
        font-size: 16px;
        color: #7a7c80;
        background: linear-gradient(
            180deg,
            #f7f7f7,
            #f7f7f7,
            rgba(247, 247, 247, 0)
          )
          bottom left no-repeat;
        background-size: 100% 1px;
      }
      .vux-tab-ink-bar {
        .vux-tab-bar-inner {
          border-radius: 2px;
        }
      }
    }
  }
}
</style>

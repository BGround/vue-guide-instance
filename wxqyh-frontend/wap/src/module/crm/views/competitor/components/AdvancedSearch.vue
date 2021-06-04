<template>
  <div class="competitor-advanced-search">
    <!-- 高级搜索弹窗 -->
    <advanced-search @search="onAdvancedSearch"
                     :setting="advancedSearch.setting"
                     v-show="visible"
                     @close="visible=false"
                     @checkedRadio="checkedRadio"
                     :cache-search-value="advancedSearch.data"
                     @reset="reset">
      <div slot="footer"
           class="advanced-search-business"
           @click="showBusinessPopup=true">
        <div class="advanced-search-business-left">竞争商机</div>
        <div class="advanced-search-business-center">
          <p v-if="businessNames">{{businessNames}}</p>
          <span v-else>请选择</span>
        </div>
        <div class="advanced-search-business-right"></div>
      </div>
    </advanced-search>
    <user-choose :selectconfig="userChooseConfig"
                 v-if="userChooseConfig.show"
                 :tabActive="userChooseConfig.signIndex =='depts'?'dept':'group'"
                 :closeUser="userChooseConfig.signIndex =='depts'"
                 :closeGroup="userChooseConfig.signIndex =='depts'"
                 :closeAllTab="userChooseConfig.signIndex =='depts'">
    </user-choose>
    <!-- 商机列表弹窗 -->
    <checklist-popup v-model="showBusinessPopup"
                     fotterCenterText="商机"
                     :load-status="loadStatus"
                     :checklist-option="checklistOption"
                     :default-checked="confirmChecklistValue"
                     :is-search="params.search"
                     @onSearch="onSearch"
                     @confirmChecked="selectBusinessConfirm"
                     @loadMore="loadMore"></checklist-popup>

  </div>
</template>
<script>
import userChoose from "@/components/base/user_or_dept_select";
import AdvancedSearch from "@/components/base/AdvancedSearch";
import SearchBox from "@/components/base/search_box";
import { qwui_button } from "@/components/base/button";
import { Popup, Checklist } from "vux";
import { selectCompetitorBusinessList } from "crm/api/competitor";
import CrmNoRecord from "crm/components/CrmNoRecord";
import ChecklistPopup from "./ChecklistPopup";
const userChooseConfig = {
  show: false,
  signIndex: "users",
  selectList: {
    users: {
      // 单独选人
      title: "",
      selectType: "group",
      userSelected: [],
      callBack: {
        confirm: null
      }
    },
    depts: {
      // 选部门
      title: "",
      selectType: "dept",
      deptSelected: [],
      callBack: {
        confirm: null
      }
    }
  }
};

export default {
  name: "crm-competitor-advanced-search",
  components: {
    AdvancedSearch,
    userChoose,
    Popup,
    SearchBox,
    QwuiButton: qwui_button,
    Checklist,
    CrmNoRecord,
    ChecklistPopup
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      userChooseConfig: userChooseConfig, //选人组件配置
      advancedSearch: {
        //高级搜索组件配置
        setting: [
          {
            label: "发布状态",
            key: "searchValue.chargeType",
            type: "radio",
            value: [
              { text: "我负责的", value: "1" },
              { text: "我相关的", value: "2" },
              { text: "我创建的", value: "0" }
            ],
            noDefault: true
          },
          {
            label: "创建时间",
            key: ["searchValue.startCreateTime", "searchValue.endCreateTime"],
            type: "date",
            format: "YYYY-MM-DD",
            callBack: {
              start: this.createTimeChange,
              end: this.createTimeChange
            }
          },
          {
            label: "",
            key: "searchValue.stageType",
            type: "radio",
            value: [
              { text: "本月", value: "2" },
              { text: "本季", value: "3" },
              { text: "今年", value: "1" }
            ],
            noDefault: true
          },
          {
            label: "负责人",
            key: "searchValue.toPerson",
            type: "selectUserOrDepart",
            noDefault: true,
            selectType: "users",
            selectConfig: userChooseConfig
          },
          {
            label: "相关人",
            key: "searchValue.ccPerson",
            type: "selectUserOrDepart",
            noDefault: true,
            selectType: "users",
            selectConfig: userChooseConfig
          },
          {
            label: "创建人",
            key: "searchValue.createPerson",
            type: "selectUserOrDepart",
            noDefault: true,
            selectType: "users",
            selectConfig: userChooseConfig
          }
        ],
        data: {}
      },
      showBusinessPopup: false, //竞争商机列表弹窗
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
      businessList: [], //商机数据
      params: {
        //请求商机列表参数
        page: 1,
        pageSize: 15
      },
      loadStatus: "loading", //商机列表的加载状态 loading/noData/noMore/loadFail/''
      confirmChecklistValue: []
    };
  },
  computed: {
    //商机列表数据格式化
    checklistOption() {
      return this.businessList.map(item => {
        return { key: item, value: item.title };
      });
    },
    //选中商机名称
    businessNames() {
      let names = "";
      this.confirmChecklistValue.forEach((item, index) => {
        if (index === 0) {
          names = item.title || "";
        } else {
          names += `，${item.title}`;
        }
      });
      return names;
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
      if (val && this.businessList.length === 0) {
        this.getBusinessList();
      }
    }
  },
  methods: {
    //高级搜索组件单选回调
    checkedRadio(index, key, value) {
      //年 季 月 被点击 清空时间选择
      if (key === "searchValue.stageType") {
        if (this.advancedSearch.data["searchValue.startCreateTime"]) {
          this.$set(
            this.advancedSearch.data,
            "searchValue.startCreateTime",
            ""
          );
        }
        if (this.advancedSearch.data["searchValue.endCreateTime"]) {
          this.$set(this.advancedSearch.data, "searchValue.endCreateTime", "");
        }
      }
    },
    // 商机列表搜索框
    onSearch(val) {
      Object.assign(this.params, {
        page: 1,
        ["searchValue.businessName"]: val,
        search: !!val
      });
      this.businessList = [];
      this.getBusinessList();
    },
    // 点击高级搜索确定按钮
    onAdvancedSearch(data) {
      let res = JSON.parse(JSON.stringify(data));
      if (data["searchValue.toPerson"]) {
        data["searchValue.toPerson"].users.forEach((item, index) => {
          if (index === 0) {
            res["searchValue.toPerson"] = item.userId;
          } else {
            res["searchValue.toPerson"] += `,${item.userId}`;
          }
        });
      }
      if (data["searchValue.ccPerson"]) {
        data["searchValue.ccPerson"].users.forEach((item, index) => {
          if (index === 0) {
            res["searchValue.ccPerson"] = item.userId;
          } else {
            res["searchValue.ccPerson"] += `,${item.userId}`;
          }
        });
      }
      if (data["searchValue.createPerson"]) {
        data["searchValue.createPerson"].users.forEach((item, index) => {
          if (index === 0) {
            res["searchValue.createPerson"] = item.userId;
          } else {
            res["searchValue.createPerson"] += `,${item.userId}`;
          }
        });
      }
      this.confirmChecklistValue.forEach((item, index) => {
        if (index === 0) {
          res["searchValue.businessIds"] = item.id;
        } else {
          res["searchValue.businessIds"] += `,${item.id}`;
        }
      });
      this.$emit("onAdvancedSearch", res);
    },
    // 日期选择改变清空 年月季 选择
    createTimeChange() {
      if (
        this.advancedSearch.data["searchValue.startCreateTime"] ||
        this.advancedSearch.data["searchValue.endCreateTime"]
      ) {
        this.advancedSearch.data["searchValue.stageType"] &&
          this.$set(this.advancedSearch.data, "searchValue.stageType", "");
      }
    },
    // 获取商机列表
    getBusinessList() {
      this.loadStatus = "loading";
      selectCompetitorBusinessList(this.params).then(res => {
        if (res.code == "0") {
          this.params.page = res.data.currPage + 1;
          if (res.data.currPage == 1) {
            this.businessList = res.data.pageData || [];
          } else {
            this.businessList = this.businessList.concat(res.data.pageData);
          }

          // this.totalRows = res.data.totalRows;
          if (this.businessList.length === 0) {
            this.loadStatus = "nodata";
          } else if (res.data.currPage >= res.data.maxPage) {
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
    // 商机类表加载更多
    loadMore() {
      this.getBusinessList();
    },
    // 商机列表确定
    selectBusinessConfirm(data) {
      this.confirmChecklistValue = data;
      this.showBusinessPopup = false;
    },
    // 高级搜索重置回调
    reset() {
      this.advancedSearch.data = {};
      this.confirmChecklistValue = [];
    }
  },
  mounted() {
    this.visible = this.value;
    userChooseConfig.show = false;
  }
};
</script>
<style lang="scss" scoped>
.competitor-advanced-search {
  .advanced-search-business {
    margin-top: 10px;
    font-size: 13px;
    display: flex;
    border: 1px solid #e4e5e9;
    padding: 0 25px 0 10px;
    height: 34px;
    align-items: center;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      color: #999999;
      right: 5px;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 14px;
      height: 14px;
      background: url(~assets/images/icon_down.png) no-repeat;
      background-size: contain;
    }
    &-left {
      flex: 4;
    }
    &-center {
      flex: 6;
      text-align: right;
      span {
        color: #bbb;
      }
      p {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        word-break: break-all;
      }
    }
  }
  .popop-bussiness {
    height: 100%;
    width: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    &-body {
      flex: 1;
      overflow-y: auto;
    }
    &-fotter {
      display: flex;
      padding: 5px 14px;
      .button {
        font-size: 16px;
        display: inline-block;
        width: 5em;
        text-align: center;
        height: 2.5em;
        line-height: 2.5em;
        color: #a2a4a7;
        background-color: #f4f6f8;
        border-radius: 4px;
        &.button-primary {
          color: #fff;
          background-color: #5585f0;
        }
      }
      &-center {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: #a2a4a7;
        span:last-child {
          font-size: 15px;
          color: #5585f0;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.competitor-advanced-search {
  .advancedSearch .origin .weui-cell {
    justify-content: center;
  }
  .popop-bussiness {
    &-body {
      .weui-cells_checkbox {
        font-size: 15px;
        color: #0a1735;
        &::before {
          display: none;
        }
        &::after {
          border-color: #e6e6e6;
        }
        .weui-cell {
          padding: 15px 10px;

          &::before {
            border-color: #e6e6e6;
          }
        }
        .weui-cell__hd {
          display: flex;
          align-items: center;
        }
        .weui-icon-checked:before {
          content: "";
          width: 13px;
          height: 13px;
          border: 2px solid #e3e4e8;
          border-radius: 3px;
        }
        .weui-check:checked + .weui-icon-checked:before {
          content: "";
          width: 17px;
          height: 17px;
          border: 0;
          background: url("~assets/images/crm/icon_checkbox_checked.png")
            no-repeat;
          background-size: contain;
        }
      }
    }
  }
}
</style>

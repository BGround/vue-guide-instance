<template>
  <popup v-model="visible"
         class="check-list-popup"
         :show-mask="false"
         position="right"
         :is-transparent="true"
         width="100%">
    <div class="popop-bussiness popop-has-bottombar">
      <div class="popop-bussiness-header">
        <search-box :searchinput="searchBar"
                    @listenToSearchBox="onSearch"
                    ref="searchBox">
        </search-box>
      </div>
      <div class="popop-bussiness-body"
           v-scroll="loadMore">
        <checklist v-if="checklistOption.length>0"
                   :options="checklistOption"
                   v-model="checklistValue"></checklist>
        <crm-no-record v-else-if="checklistOption.length==0&&loadStatus!=='loading'"
                       :type="isSearch?'noSearch':'noData'"></crm-no-record>
      </div>
      <div class="popop-bussiness-fotter">
        <span class="button"
              @click="confirmCancel">取消</span>
        <div class="popop-bussiness-fotter-center">
          <span>已选择</span>
          <span>{{checklistValue.length}} {{fotterCenterText||'个'}}</span>
        </div>
        <span class="button button-primary"
              @click="confirmChecked">确定</span>
      </div>
    </div>
  </popup>
</template>
<script>
import { Popup, Checklist } from "vux";
import CrmNoRecord from "crm/components/CrmNoRecord";
import SearchBox from "@/components/base/search_box";

export default {
  name: "checklistPopup",
  components: { Popup, Checklist, CrmNoRecord, SearchBox },
  props: {
    value: {
      default: false
    },
    loadStatus: {
      //列表的加载状态 loading/noData/noMore/loadFail/''
      type: String,
      defalut: "noMore"
    },
    fotterCenterText: {
      default: "个"
    },
    checklistOption: {
      type: Array,
      default: () => []
    },
    defaultChecked: {//默认选中项
      type: Array,
      default: () => []
    },
    isSearch: {
      default: false
    }
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
      visible: false,
      checklistValue: []
    };
  },
  watch: {
    visible(val) {
      this.$emit("input", val);
      if (val) {
        this.$emit("on-show");
        this.checklistValue = JSON.parse(JSON.stringify(this.defaultChecked));
      }
    },
    value(val) {
      this.visible = val;
    }
  },
  mounted() {
    this.visible = this.value;
  },
  methods: {
    onSearch(value) {
      this.$emit("onSearch", value);
    },
    loadMore(el) {
      let scrollTop = el.scrollTop;
      let offsetHeight = el.offsetHeight;
      let scrollHeight = el.scrollHeight;
      if (scrollTop + offsetHeight >= scrollHeight - 50) {
        if (!this.loadStatus) {
          this.$emit("loadMore");
        }
      }
    },
    confirmCancel() {
      this.visible = false;
    },
    confirmChecked() {
      this.$emit(
        "confirmChecked",
        JSON.parse(JSON.stringify(this.checklistValue))
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.check-list-popup {
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
@import "crm/style/variable.scss";
.check-list-popup {
  .popop-bussiness {
    max-width: $pageMaxWidth;
    margin: auto;
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
<template>
  <qw-modal v-model="visible"
            :title="title"
            class="qw-select-modal"
            @on-confirm="onConfirm"
            :hide-on-blur="true"
            :zIndex="99">
    <div class="select-modal-body">
      <div class="select-modal-body-search">
        <qw-search-select :tagList="checkedList"
                          @on-delete="onDelete"
                          @on-input="onInput"
                          v-model="searchValue"
                          placeholder="请输入搜索条件"
                          v-click-outside="()=>{
                              showResult = false
                            }">
          <div class="search-result-list"
               v-if="showResult"
               v-scroll="searchLoadMore">
            <template v-if="searchList&&searchList.length>0">
              <div class="search-result-item"
                   v-for="(item,index) in searchList"
                   :key="index"
                   @click="onResultClick(item)">
                {{item.label}}
              </div>
            </template>
            <qw-load-more v-show="searchLoadMoreStatus.show"
                          :show-loading="searchLoadMoreStatus.loading"
                          :tip="searchLoadMoreStatus.tips"></qw-load-more>
          </div>
        </qw-search-select>
      </div>
      <div class="select-modal-body-list"
           v-scroll="loadMore">
        <template v-if="list.length>=0">
          <label class="select-modal-body-list-item"
                 v-for="(item,index) in list"
                 :key="index">
            <p>{{item.label}}</p>

            <crm-radio v-if="max&&max===1"
                       v-model="radioValue"
                       :option="item"
                       :hasLabel="false"></crm-radio>
            <qwui-checkbox v-else
                           @change="onListClick(item)"
                           v-model="item.checked"></qwui-checkbox>
          </label>
        </template>
        <qw-load-more v-show="loadMoreStatus.show&&loadStatus!=='nodata'"
                      :show-loading="loadMoreStatus.loading"
                      :tip="loadMoreStatus.tips"></qw-load-more>
        <qw-nodata v-show="loadStatus==='nodata'"></qw-nodata>
      </div>
    </div>
  </qw-modal>
</template>


<script>
import QwModal from "crm/components/qwModal";
import QwSearchSelect from "crm/components/qwSearchSelect";
import qwButton from "@/components/qwuiBase/qwuiButton/qwuiButton";
import qwuiCheckbox from "@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox";
import QwNodata from "crm/components/qwNodata";
import scroll from "crm/directives/scroll";
import clickOutside from "crm/directives/click-outside";
import CrmRadio from "crm/components/crm-radio/crmRadio";
import QwLoadMore from "crm/components/qwLoadMore";

export default {
  name: "compertitorAddBusiness",
  components: {
    QwModal,
    qwButton,
    qwuiCheckbox,
    QwNodata,
    QwSearchSelect,
    CrmRadio,
    QwLoadMore
  },
  directives: { scroll, clickOutside },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: String,
    checkedList: {
      type: Array,
      default: () => []
    },
    searchList: {
      type: Array,
      default: () => []
    },
    list: {
      type: Array,
      default: () => []
    },
    max: Number,
    loadStatus: String,
    searchLoadStatus: String
  },
  data() {
    return {
      visible: false,
      searchValue: "",
      showResult: false,
      radioValue: ""
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
          tips: "没有更多"
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
    searchLoadMoreStatus() {
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
          show: false,
          loading: false,
          tips: "没有更多"
        },
        loadfail: {
          show: false,
          loading: false,
          tips: "加载失败"
        }
      };
      return (
        _status[this.searchLoadStatus] || {
          show: false
        }
      );
    }
  },
  watch: {
    visible(val) {
      this.$emit("input", val);
      if (val) {
        this.init();
      }
    },
    value(val) {
      this.visible = val;
    },
    radioValue(val) {
      if (val) {
        let _obj = this.list.find(item => {
          return item.value === val;
        });
        _obj && this.$emit("update:checkedList", [_obj]);
      } else {
        this.$emit("update:checkedList", []);
      }
    }
  },
  methods: {
    init() {
      this.searchValue = "";
      if (this.max && this.max === 1) {
        if (this.checkedList[0]) {
          this.radioValue = this.checkedList[0].value;
        } else {
          this.radioValue = "";
        }
      }
    },
    loadMore(el) {
      let scrollTop = el.scrollTop;
      let offsetHeight = el.offsetHeight;
      let scrollHeight = el.scrollHeight;
      if (scrollTop + offsetHeight >= scrollHeight - 50) {
        this.$emit("load-more");
      }
    },
    //点击列表 是否勾选
    onListClick(item) {
      if (item.checked) {
        this.checkedList.push(item);
      } else {
        this.$emit(
          "update:checkedList",
          this.checkedList.filter(pre => {
            return pre.value != item.value;
          })
        );
      }
    },
    // 点击删除
    onDelete(data) {
      if (this.max && this.max === 1) {
        this.radioValue = "";
      } else {
        this.list.forEach(item => {
          if (item.value === data.value) {
            this.$set(item, "checked", false);
          }
        });
        this.$emit(
          "update:checkedList",
          this.checkedList.filter(pre => {
            return pre.value != data.value;
          })
        );
      }
    },
    // 输入值改变
    onInput() {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.showResult = !!this.searchValue;
        this.$emit("on-search", this.searchValue);
      }, 500);
    },
    // 搜索结果 加载更多
    searchLoadMore(el) {
      let scrollTop = el.scrollTop;
      let offsetHeight = el.offsetHeight;
      let scrollHeight = el.scrollHeight;
      if (scrollTop + offsetHeight >= scrollHeight - 50) {
        // if (!this.searchStatus) {
        this.$emit("search-load-more");
        // }
      }
    },
    // 点击搜索结果
    onResultClick(data) {
      if (this.max && this.max === 1) {
        this.radioValue = data.value;
        this.$emit("update:checkedList", [data]);
      } else {
        this.list.forEach(item => {
          if (item.value === data.value) {
            this.$set(item, "checked", true);
          }
        });
        this.checkedList.push(data);
      }
      this.showResult = false;
      this.searchValue = "";
    },
    onConfirm() {
      this.$emit("on-confirm");
    }
  }
};
</script>

<style lang="scss" scoped>
.qw-select-modal {
  .select-modal-body {
    // flex: 1;
    display: flex;
    flex-direction: column;
    width: 600px;
    height: 450px;
    &-search {
      padding: 20px;
      .search-result-list {
        border: 1px solid #ccc;
        max-height: 240px;
        overflow-y: auto;
        text-align: left;
        .search-result-item {
          padding: 5px;
          height: 30px;
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &:hover {
            background-color: #eee;
          }
        }
      }
    }
    &-list {
      flex: 1;
      padding: 10px 20px;
      overflow-y: auto;
      &-item {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        p {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
          overflow: hidden;
          -webkit-line-clamp: 1;
          word-break: break-all;
          flex: 1;
          margin-right: 20px;
          text-align: left;
        }
      }
    }
  }
}
</style>
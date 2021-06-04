<template>
  <qw-modal v-model="visible"
            title="选择商机"
            class="compertitor-add-business"
            @on-confirm="onConfirm"
            :zIndex="99"
            :hide-on-blur="true">
    <div class="business-body">
      <div class="business-body-search">
        <qw-search-select :tagList="selectList"
                          @on-delete="onDelete"
                          @on-input="onInput"
                          v-model="searchParams.keyWord"
                          placeholder="请输入搜索条件"
                          v-click-outside="()=>{
                              showResult = false
                            }">
          <div class="search-result-list"
               v-if="showResult"
               v-scroll="searchLoadMore">
            <div class="search-result-item"
                 v-for="(item,index) in searchResult"
                 :key="index"
                 @click="onResultClick(item)">
              {{item.title}}
            </div>
          </div>
        </qw-search-select>
      </div>
      <div class="business-body-list"
           v-scroll="loadMore">
        <template v-if="list.length>=0">
          <label class="business-body-list-item"
                 v-for="(item,index) in list"
                 :key="index">
            <p>{{item.title}}</p>
            <qwui-checkbox @change="onListClick(item)"
                           v-model="item.checked"></qwui-checkbox>
          </label>
        </template>

        <qw-nodata v-show="loadStatus==='nodata'"></qw-nodata>
      </div>
    </div>
  </qw-modal>
</template>


<script>
import QwDialog from "crm/components/qwDialog";
import QwModal from "crm/components/qwModal";
import QwSearchSelect from "crm/components/qwSearchSelect";
import qwButton from "@/components/qwuiBase/qwuiButton/qwuiButton";
import qwuiCheckbox from "@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox";
import QwNodata from "crm/components/qwNodata";
import {
  listCompetitorBusiness,
  addCompetitorBusiness
} from "crm/api/competitor";
import scroll from "crm/directives/scroll";
import clickOutside from "crm/directives/click-outside";

export default {
  name: "compertitorAddBusiness",
  components: {
    QwDialog,
    QwModal,
    qwButton,
    qwuiCheckbox,
    QwNodata,
    QwSearchSelect
  },
  directives: { scroll, clickOutside },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    id: String
  },
  data() {
    return {
      dataBase: dataBase,
      visible: false,
      list: [],
      params: {
        //弹窗商机列表请求参数
        page: 1,
        pageSize: 15,
        keyWord: "",
        competitorId: this.id
      },
      searchParams: {
        //弹窗商机列表请求参数
        page: 1,
        pageSize: 15,
        keyWord: "",
        competitorId: this.id
      },
      loadStatus: "",
      searchValue: "",
      searchResult: [],
      searchStatus: "",
      showResult: false,
      selectList: [],
      timer: null
    };
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
    }
  },
  methods: {
    init() {
      this.selectList = [];
      this.searchParams = {
        page: 1,
        pageSize: 15,
        competitorId: this.id,
        keyWord: ""
      };
      this.params = {
        //弹窗商机列表请求参数
        page: 1,
        pageSize: 15,
        competitorId: this.id,
        keyWord: ""
      };
      this.getList();
    },
    getList() {
      this.loadStatus = "loading";
      listCompetitorBusiness(this.params).then(res => {
        if (res.code == "0") {
          this.params.page = res.data.currPage + 1;
          // // 加载的结果 初始化选中
          let arr = res.data.pageData
            ? res.data.pageData.map(item => {
                if (
                  this.selectList.some(per => {
                    return per.id === item.id;
                  })
                ) {
                  item.checked = true;
                }
                return item;
              })
            : [];
          if (res.data.currPage == 1) {
            this.list = arr || [];
          } else {
            this.list = this.list.concat(arr);
          }

          if (this.list.length === 0) {
            this.loadStatus = "nodata";
          } else if (res.data.currPage >= res.data.maxPage) {
            this.loadStatus = "nomore";
          } else {
            this.loadStatus = "";
          }
        } else {
          this.loadStatus = "loadfail";
          this.dataBase.alert("提示信息", res.desc);
        }
      });
    },
    onConfirm() {
      let { alert: _alert, top_alert } = this.dataBase;
      let businessIds = "";
      this.selectList.forEach(item => {
        if (businessIds) {
          businessIds += `,${item.id}`;
        } else {
          businessIds = item.id;
        }
      });
      if (businessIds) {
        addCompetitorBusiness(this.id, businessIds).then(res => {
          if (res.code == "0") {
            top_alert("保存成功", true, 2000);
            this.$emit("refreshBusiness");
            this.visible = false;
          } else {
            _alert("提示", res.desc);
          }
        });
      } else {
        top_alert("请选择商机", false, 2000);
      }
    },
    loadMore(el) {
      let scrollTop = el.scrollTop;
      let offsetHeight = el.offsetHeight;
      let scrollHeight = el.scrollHeight;
      if (scrollTop + offsetHeight >= scrollHeight - 50) {
        if (!this.loadStatus) {
          this.getList();
        }
      }
    },
    //点击列表 是否勾选
    onListClick(item) {
      if (item.checked) {
        this.selectList.push({
          name: item.title,
          id: item.id
        });
      } else {
        this.selectList = this.selectList.filter(pre => {
          return pre.id != item.id;
        });
      }
    },
    // 点击删除
    onDelete(data) {
      this.list.forEach(item => {
        if (item.id === data.id) {
          item.checked = false;
        }
      });
      this.selectList = this.selectList.filter(pre => {
        return pre.id != data.id;
      });
    },
    //获取搜索列表
    getSearchList() {
      this.searchStatus = "loading";
      listCompetitorBusiness(this.searchParams).then(res => {
        if (res.code == "0") {
          this.searchParams.page = res.data.currPage + 1;
          this.showResult = true;
          let arr = res.data.pageData
            ? res.data.pageData.filter(item => {
                return this.selectList.every(per => {
                  return item.id != per.id;
                });
              })
            : [];
          if (res.data.currPage == 1) {
            this.searchResult = arr;
          } else {
            this.searchResult = this.searchResult.concat(arr);
          }

          if (this.searchResult.length === 0) {
            this.searchStatus = "nodata";
          } else if (res.data.currPage >= res.data.maxPage) {
            this.searchStatus = "nomore";
          } else {
            this.searchStatus = "";
          }
        } else {
          this.searchStatus = "loadfail";
          this.dataBase.alert("提示信息", res.desc);
        }
      });
    },
    // 输入值改变
    onInput() {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.searchParams.page = 1;
        if (!this.searchParams.keyWord) {
          this.searchResult = [];
          this.showResult = false;
          return;
        }
        this.getSearchList();
      }, 500);
    },
    // 搜索结果 加载更多
    searchLoadMore(el) {
      let scrollTop = el.scrollTop;
      let offsetHeight = el.offsetHeight;
      let scrollHeight = el.scrollHeight;
      if (scrollTop + offsetHeight >= scrollHeight - 50) {
        if (!this.searchStatus) {
          this.getSearchList();
        }
      }
    },
    // 点击搜索结果
    onResultClick(data) {
      this.list.forEach(item => {
        if (item.id === data.id) {
          this.$set(item, "checked", true);
        }
      });
      this.selectList.push({
        name: data.title,
        id: data.id
      });
      this.showResult = false;
      this.$set(this.searchParams, "keyWord", "");
    }
  }
};
</script>

<style lang="scss" scoped>
.compertitor-add-business {
  .business-body {
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
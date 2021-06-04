<template>
  <div :class="searchBoxShow==true ? 'treeListWrap' : 'treeListMt'"
    v-show="treeListIsShow">
    <!-- 公海列表隐藏搜索框 -->
    <header class="qwui-client_type_fixed" v-if="searchBoxShow">
      <search_box :searchinput="searchBar"
                  @listenToSearchBox="showMsgFromSearchBox">
      </search_box>
    </header>
    <!-- 搜索的内容为空 -->
    <div class="search-result" v-if="searchNone">
      <div class="search-box"><i class="search-image"></i></div>
      <span class="search-text">没有搜索结果</span>
    </div>
    <!-- 请求后没有数据 -->
    <div class="search-result" v-if="noData">
      <div class="search-box"><i class="noData-image"></i></div>
      <span class="search-text">没有数据</span>
    </div>
    <div
      class="treeListAll"
      :style="{ height: winHeight }"
      @scroll="loadMore"
      ref="treeListAll"
    >
      <qw-return-back v-if="treeLists"
        v-show="prevParentId.length"
        @returnBack="returnBack"
      >
      </qw-return-back>

      <qw-tree-item v-if="treeLists"
        v-model="selectValue"
        :options="options"
        :config="config"
        :items.sync="currentSelected"
        @clickTreeItem="clickTreeItem"
        @showNextItem="showNextItem"
      >
      </qw-tree-item>
      <!-- 滚动加载 -->
      <div class="member_tips"></div>

    </div>
    <qw-tree-button class="tree-btn"
      @cancelSelected="cancelSelected"
      @confirmSelected="confirmSelected"
      @showSelectedItem="showSelectedItem"
      :subTitle="selectName"
    >
    </qw-tree-button>
  </div>
</template>


<script>
import QwTreeItem from "@/components/tree/treeItem";
import QwTreeButton from "@/components/tree/treeButton";
import QwReturnBack from "@/components/tree/treeReturnBack";
import QwTreeList from "@/components/tree/treeList";
import search_box from "@/components/base/search_box";
import LoadMore from '@/components/list/load_more';
import { getIndustryList,getPoolList } from "../../../api/client/getData";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

const data = [];
const industryChildrenConfig = {
  id: 'code',
  title: 'industry',
  checkType: 'checkbox',
  headPic:'',
  parentId:'fatherid'
};
 const industryParentConfig = {
    id: 'id',
    title: 'industry',
    hasChildren: 'hasChildren',
    checkType: '',
    headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/industry_type.png',
    parentId:'fatherid'
  };
export default {
  name: "poolTree",
  components: {
    LoadMore,
    QwTreeItem,
    QwTreeButton,
    QwReturnBack,
    search_box,
  },
  props: {
    checkConfirm: {
      type: String,
      default: ''
    },
    treeListIsShow: {
      type:[Boolean,String],
    },
    searchBoxShow: {
      type:[Boolean,String],
    },
    noData: {
      type:[Boolean,String],
    },
  },
  data() {
    return {
      params: {
        pId: 0,
        page: 1,
        code: "",
        title: "",
      },
      searchBar: {
        show: true,
        ridMask: true
      },
      loadingMore: true,
      totalRows: 0,
      page: 1,
      maxPage: 0,
      hasMore: true,
      lastPage:{},
      treeLists:true,
      selectValueStr: '',
      clearSelectedPerson: "",
      searchNone: false,
      treeKeys: {},
      lock_roll: false,
      selected: [], //已选的数据
      showTreeList: true
    };
  },
  computed: {
    ...mapState({
      config: state => state.tree.config, // 配置
      options: state => state.tree.options, // 列表数据
      renderData: state => state.tree.renderData, // { '父级ID': [子级数据] }
      currentParentId: state => state.tree.currentParentId, // 当前列表的父Id
      prevParentId: state => state.tree.prevParentId // 上一级的父Id。每点击下一级，则push “当前列表的父Id”。每返回上一级，则pop最后一个元素
    }),
    ...mapGetters([
      "selectName" // 当前获取的数据个数
    ]),
    // 当前已选的数据【必要的】
    selectValue: {
      get() {
        return this.$store.state.tree.selectValue;
      },
      set(value) {
        this.updateSelectValue(value);
      }
    },
    currentSelected: {
      get() {
        return this.$store.state.tree.currentSelected;
      },
      set(value) {
        this.updateCurrentSelected(value)
      }
    },
    winHeight() {
      if(this.checkConfirm == 'poolList'){
        let height = window.innerHeight - 50; // 减去搜索框和nav栏
        return height + 'px';
      }else{
        let height = window.innerHeight - 43 - 50; // 减去搜索框和nav栏
        return height + 'px';
      }
    }
  },
  methods: {
    ...mapMutations([
      'changeConfig',
      'updateSelectValue',
      'handleGetData',
      'handleRenderData',
      'handlePrevParentId',
      'handleGetNextItem',
      'handleCancelSelected',
      'updateCurrentSelected',
      'handleReturnBack',
      'resetTreeConfigData',
    ]),
    getPoolListData () {
      this.lock_roll = true;
      let obj = {
        ...this.poolDatas[this.poolDatas.length-1],
        page: this.page,
      }
      this.loadingMore = true;
      // 基本配置
      this.changeConfig(clientConfig);
      getPoolList(obj,(data) => {
        let list = data.pageData;
        this.poolDatas.push(...list);
        let { maxPage, totalRows } = data;
        this.maxPage = maxPage;
        this.totalRows = totalRows;
        this.hasMore = this.page >= this.maxPage? false : true;
        this.loadingMore = false;
        this.handleGetData(list);
        this.lock_roll = false;
        // 滚动加载后，继续添加对应的 renderData 数据  【必要的】
        this.handleRenderData(list)
      })

    },
    // 滚动加载
    loadMore (el) {
      let scrollTop =  el.target.scrollTop || window.pageYOffset || document.body.scrollTop;
      let offsetHeight = el.target.offsetHeight;
      let scrollHeight = el.scrollHeight;
      if(scrollTop + offsetHeight >= this.$refs.treeListAll.scrollHeight){
          if(this.hasMore && !this.lock_roll){
            this.page++;
            if(this.checkConfirm == 'poolList'){
              this.getPoolListData();
            }
          }
      }
    },


    //搜索关键字
    showMsgFromSearchBox(val) {
      this.noData = false;
      this.params.title = val;
      let obj = {
        title: val,
        code: this.params.code,
        pId: 0,
        page: 1,
      }
       if (this.checkConfirm == "industryList") {
        // 行业数据请求
        getIndustryList(obj,data => {
          // data.isIndustry 为1是有图标搜索   0是无图标搜索
          if(data.isIndustry == '1'){
            this.treeLists = true;
            this.searchNone = false;
            // 假如搜索出来有值
            if(data.pageData){
              // 请求回来的数据赋值list
              let list = data.pageData;
              this.resetTreeConfigData();
              // 修改配置
              this.changeConfig(industryParentConfig);
              this.handleGetData(list);
              // 滚动加载后，继续添加对应的 renderData 数据  【必要的】
              this.handleRenderData(list)
            }else{ // 搜索没有数据
              this.treeLists = false;
              this.searchNone = true;
            }
          }else if(data.isIndustry == '0'){ // 无图标搜索
            this.treeLists = true;
            this.searchNone = false;
            // 无图标搜索有数据
            if(data.Industry){
              // 请求回来的数据赋值list
              let list = data.Industry;
              this.resetTreeConfigData();
              // 修改配置
              this.changeConfig(industryChildrenConfig);
              this.handleGetData(list);
              // 滚动加载后，继续添加对应的 renderData 数据  【必要的】
              this.handleRenderData(list);
            }else{ // 搜索没有数据
              this.treeLists = false;
              this.searchNone = true;
            }
          }
        })

      }
    },

    // 点击input
    clickTreeItem(payload) {
      if (payload.code && payload.fatherid == "") {
        this.params.code = payload.code;
        // 修改配置
        this.changeConfig(industryChildrenConfig)
        this.handlePrevParentId();
        let obj ={
          code: payload.code,
          page: 1,
        }
        getIndustryList(obj,(data) => {
          this.handleGetNextItem({ result:data.Industry, option:payload });
        });
      }
    },

    // 点击下一级
    showNextItem(option) {
    },

    // 返回上一级
    returnBack() {
      this.page = 1;
      this.hasMore = true;

      // 滚动加载后，继续添加对应的 renderData 数据  【必要的】
      if (this.checkConfirm == "industryList"){
        // 行业返回
        this.handleReturnBack({'isResetData':false});
        this.changeConfig(industryParentConfig)
      }
    },

    // 按确认键
    confirmSelected() {
      this.page = 1;
      this.hasMore = true;
      this.searchNone = false;
      // 根据点进去类型传值
      this.$emit("currentSelected",this.currentSelected,this.selectValue)
      // 点击公海确认，假如公海有值，那选人组件清空
      this.$emit('update:treeListIsShow', false)
      this.$emit('update:searchBoxShow', false)
      this.$emit("treeListShow", false);
      this.$emit('update:noData', false)
    },

    // 取消键
    cancelSelected(val) {
      this.page = 1;
      this.hasMore = true;
      this.$emit('update:treeListIsShow', false)
      this.$emit('update:searchBoxShow', false)
      this.$emit("treeListShow", false);
      this.$emit('update:noData', false)
    },
    showSelectedItem(selectedItems) {
    },
    input(val) {
      this.$emit("typeIds", val);
    }
  }
};
</script>

<style lang="scss" scoped>
.treeListWrap {
  position: relative;
  width: 100%;
.treeListAll{
    height:640px;
    overflow-y: auto;
  }
  .qwui-client_type_fixed {
    top: 0;
    width: 100%;
    left: 0px;
    z-index: 3;
    .qwui-no_mask {
      background: white;
    }
  }
  .qwui-tree_list {
    margin-top: 3.6rem;
    margin-bottom: 5rem;
  }
  .searchBoxhide {
    margin-bottom: 5rem;
  }
}
.treeListMt{
  margin-top: 0px;
  padding-bottom: 50px;
  overflow: auto;
  .member_tips{
    height:50px;
  }
}
.search-result {
  width: 100%;
  height: 100%;
  text-align: center;
  position: absolute;
  .search-box{
    position:relative;
    height:100%;
    width: 100%;
    .search-image {
      position: absolute;
      bottom:50%;
      margin-bottom:-80px;
      left: 50%;
      margin-left: -80px;
      background: url(../../../../../assets/images/crm/searchNone.png) center no-repeat;
      background-size: 160px, 160px;
      width: 160px;
      height: 160px;
    }
    .noData-image{
      position: absolute;
      bottom:50%;
      margin-bottom:-80px;
      left: 50%;
      margin-left: -80px;
      background: url(../../../../../assets/images/crm/emptyPage.png) center no-repeat;
      background-size: 160px, 160px;
      width: 160px;
      height: 160px;
    }
  }
  .search-text {
    position: absolute;
    bottom: 38%;
    margin-left: -47px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: #a2a5b2;
    width: 100px;
  }
}
</style>

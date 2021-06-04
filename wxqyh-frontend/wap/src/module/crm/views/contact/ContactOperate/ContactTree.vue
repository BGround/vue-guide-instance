<template>
  <div :class="searchBoxShow==true ? 'treeListWrap' : 'treeListMt'"
    v-show="treeListIsShow">
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
      <qw-return-back
        v-show="prevParentId.length"
      >
      </qw-return-back>
      <qw-tree-item v-if="treeLists"
        v-model="selectValue"
        :options="options"
        :config="config"
        :items.sync="currentSelected"
        @clickTreeItem="clickTreeItem"
      >
      </qw-tree-item>
      <div class="member_tips"></div>
    </div>
      <qw-tree-button class="tree-btn"
        @cancelSelected="cancelSelected"
        @confirmSelected="confirmSelected"
        @showSelectedItem="showSelectedItem"
        :subTitle="selectName"
      >
      </qw-tree-button>
      <div class="crm_fixed_nail"
         @click="onClickAdd"></div>
  </div>
</template>


<script>
import QwTreeItem from "@/components/tree/treeItem";
import QwTreeButton from "@/components/tree/treeButton";
import QwReturnBack from "@/components/tree/treeReturnBack";
import QwTreeList from "@/components/tree/treeList";
import LoadMore from '@/components/list/load_more';
import search_box from "@/components/base/search_box";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { getPoolList,searchClientList } from '../../../api/contact/getData';

const data = [];
// 存放所属客户的配置
const clientConfig = {
    id: 'id',
    title: 'clientName',
    checkType: 'radio',
    headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/icon_crm.png',
    parentId:'parentId',
    subTitle:'clientCode'
}
export default {
  name: "ContactTree",
  components: {
    QwTreeItem,
    LoadMore,
    QwTreeButton,
    QwReturnBack,
    search_box
  },
  props: {
    belongData: {
      type:[Array, String]
    }, // 存放客户类别请求对象
    treeListIsShow: {
      type:[Boolean,String],
    },
    searchBoxShow: {
      type:[Boolean,String],
    },
    noData: {
      type:[Boolean,String],
    },
    hasmore: {
      type:[Boolean,String],
    }
  },
  data() {
    return {
      params: {
        pId: 0,
        page: 1,
        code: "",
        title: "",
        keyWord: "",
      },
      // 搜索框初始化
      searchBar: {
        show: true,
        ridMask: true,
        moreFunction:{
          show: true,
          option: [
            {
              name:'客户名称',
              placeholder:'按客户名称搜索',
              value: ''
            },
            {
              name:'联系电话',
              placeholder:'按联系电话搜索',
              value: 2
            }
          ]
        },
      },
      loadingMore: true,  // 是否正在加载
      totalRows: 0,  // 总成员数
      page: 1,  // 当前页数
      maxPage: 0,  // 最大页数
      hasMore: true,  // 是否有更多数据
      lastPage:{},
      treeLists:true,
      selectValueStr: '',
      clearSelectedPerson: "",
      searchNone: false,
      treeKeys: {},
      lock_roll: false,
      selected: [], //已选的数据
      showTreeList: true,
      type: '',
      keyWord: '',
      cacheSelectConfig:"" //缓存选人配置
    };
  },
  watch:{
    // 监听父组件hasmore变化，赋值给hasMore
    hasmore(newVal,oldVal){
      this.hasMore = newVal
    }
  },
  computed: {
    ...mapState({
      config: state => state.tree.config, // 配置
      options: state => state.tree.options, // 列表数据
      renderData: state => state.tree.renderData, // { '父级ID': [子级数据] }
      // currentSelected: state => state.tree.currentSelected, // 先前选择的数据，点击“取消”时返回
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
      let height = window.innerHeight - 43 - 50; // 减去搜索框和nav栏
      return height + 'px';
    }
  },
  activated() {
    this.cacheSelectConfig&&this.$set(dataBase,"selectConfig",JSON.parse(this.cacheSelectConfig))
    this.delCacheArray("ContactOperate");
  },
  methods: {
    ...mapActions("list", ["setCacheArray", "delCacheArray"]),
    ...mapMutations([
      "changeConfig",
      "updateSelectValue",
      "handleGetData",
      "handleRenderData",
      "handlePrevParentId",
      "handleGetNextItem",
      "handleCancelSelected",
      'updateCurrentSelected',
      "handleReturnBack",
      "resetTreeConfigData"
    ]),
    //点击+
    onClickAdd(){
      this.setCacheArray({ name: "ContactOperate" });
      this.cacheSelectConfig = JSON.stringify(dataBase.selectConfig)
      setTimeout(()=>{
        this.$router.push({path:'/clientOperate',query:{
          from:"select"
        }})
      })
    },
    // 所属请求，判断是否搜索
    getListData(isSearch) {
      this.lock_roll = true;
      // 是否加载更多
      this.loadingMore = true;
      // 修改配置
      this.changeConfig(clientConfig)
      // 判断是否为搜索
      if(isSearch){
        var isSearchObj = {
          typeId: this.type,
          workInfo: '',
          keyWord: this.val,
          agentcode: 'crm',
          pId: 0,
          page: 1,
          code: "",
          ctype: 1,
          pageSize: 15,
        }
      }else{ // 非搜索请求列表
        var isSearchObj = {
          ...this.belongData[this.belongData.length-1],
          page: this.page,
          pageSize: 15,
        }
      }
      searchClientList(isSearchObj).then(res => {
        if(res.code == '0'){
          if(res.data.pageData){
            let list = res.data.pageData;
            this.belongData.push(...list);
            let { maxPage, totalRows } = res.data;
            this.maxPage = maxPage;
            this.totalRows = totalRows;
            this.hasMore = this.page >= this.maxPage? false : true;
            this.loadingMore = false;
            this.handleGetData(list);
            this.lock_roll = false;
            // 滚动加载后，继续添加对应的 renderData 数据  【必要的】
            this.handleRenderData(list)
          }else{
            this.searchNone = true;
          }
        }else{
          _.alert('提示',res.desc);
        }
      })
    },

    // 搜索框搜索
    showMsgFromSearchBox(val,type){
      this.searchNone = false;
      this.noData = false;
      this.type = type;
      this.val = val;
      // 重置数据
      this.resetTreeConfigData();
      // 配置
      this.changeConfig(clientConfig);
      // 请求数据
      this.getListData(true);
    },



    // 滚动加载更多
    loadMore (el) {
      let scrollTop =  el.target.scrollTop || window.pageYOffset || document.body.scrollTop;
      let offsetHeight = el.target.offsetHeight;
      let scrollHeight = el.scrollHeight;
        if(scrollTop + offsetHeight >= this.$refs.treeListAll.scrollHeight){
            if(this.hasMore && !this.lock_roll){
                this.page++;
                this.getListData();
            }
        }
    },

    // 点击input
    clickTreeItem(payload) {
      if (payload.code && payload.fatherid == "") {
        this.params.code = payload.code;
        // 修改配置
        this.changeConfig(industryChildrenConfig)
        this.handlePrevParentId();

      }
    },

    // 按确认键
    confirmSelected() {
      this.page = 1;
      this.hasMore = true;
      // 页面存在多种层级类型的选择时，才需要判断。只有一种类型时从 store 的selectValue获取
      this.$emit("typeSelected", this.selectValue);
      this.$emit("belongClientStr",this.currentSelected);
      this.$emit('update:treeListIsShow', false)
      this.$emit('update:searchBoxShow', false)
      this.$emit("treeListShow", false);
      this.$emit('update:noData', false)
    },

    // 取消键
    cancelSelected(val) {
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
@import "crm/components/CrmFixedNail/CrmFixedNail.scss";

.treeListWrap {
  position: relative;
  width: 100%;
  margin-bottom: 50px;
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
      bottom: 34%;
      margin-left: -47px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      color: #a2a5b2;
      width: 100px;
    }
  }
}

.treeListMt{
  margin-top: 0px;
}
</style>

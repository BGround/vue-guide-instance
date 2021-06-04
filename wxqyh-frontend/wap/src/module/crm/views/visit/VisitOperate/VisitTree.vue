<template>
  <div class="treeListWrap"
    v-show="treeListIsShow">
   <header class="qwui-client_type_fixed" v-if="searchBoxShow">
      <search_box :searchinput="searchBar"
                  @listenToSearchBox="showMsgFromSearchBox">
      </search_box>
    </header>
    <!-- 搜索的内容为空 -->
    <!-- <div class="search-result" v-if="searchNone">
      <div class="search-box"><i class="search-image"></i></div>
      <span class="search-text">没有搜索结果</span>
    </div> -->
    <!-- 请求后没有数据 -->
    <!-- <div class="search-result" v-if="noData">
      <div class="search-box"><i class="noData-image"></i></div>
      <span class="search-text">没有数据</span>
    </div> -->
    <crm-no-record v-if="searchNone||noData" 
    :type="searchNone?'noSearch':'noData'" :tips="noData&&showAdd?'没有数据，马上创建一个吧':''"></crm-no-record>
    <div
      v-else
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
        v-show="showAdd"
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
import { searchOutworkList ,searchClientList,searchContactList, searchBusinessList } from '../../../api/visit/getData';
import CrmNoRecord from 'crm/components/CrmNoRecord';

const data = [];
// 存放拜访客户的配置
const clientConfig = {
    id: 'id',
    title: 'clientName',
    checkType: 'radio',
    headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/icon_crm.png',
    parentId:'parentId',
    subTitle:'clientCode'
}

// 存放拜访联系人的配置
const contactConfig = {
  id: 'id',
  title: 'contactsName',
  checkType: 'radio',
  headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/touxiang02.png',
  parentId:'parentId',
  subTitle:'mobile'
}
// 存放拜访商机的配置
const businessConfig = {
  id: 'id',
  title: 'title',
  checkType: 'radio',
  headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/touxiang02.png',
  parentId:'parentId',
  subTitle:''
}
// 存放所属外勤单的配置
const fieldBelongConfig = {
  id: 'id',
  title: 'outworkTitle',
  checkType: 'radio',
  parentId:'parentId',
  subTitle:'personName'
}

export default {
  name: "VisitTree",
  components: {
    QwTreeItem,
    LoadMore,
    QwTreeButton,
    QwReturnBack,
    search_box,
    CrmNoRecord
  },
  props: {
    visitClientData: {
      type:[Array, String]
    }, // 存放拜访客户请求对象
    fieldBelongData: {
      type:[Array, String]
    }, // 存放所属外勤单列表请求对象
    visitContactData: {
      type:[Array, String]
    }, // 存放拜访联系人请求对象
    checkConfirm: {
      type:[Array, String],
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
    visitClientId:{
      type:[Array, String],
    },
    searchBar:{
      type:[Object, String],
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
        keyWord: ""
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
      haha: false,
      lock_roll: false,
      selected: [], //已选的数据
      showTreeList: true,
      type:'',
      val: '',
      cacheSelectConfig:""
    };
  },
  watch:{
    // 监听父组件hasmore变化，赋值给hasMore
    hasmore(newVal,oldVal){
      this.hasMore = newVal
    }
  },
  activated() {
    this.cacheSelectConfig&&this.$set(dataBase,"selectConfig",JSON.parse(this.cacheSelectConfig))
    this.delCacheArray("VisitOperate");
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
    },
    showAdd(){
      //拜访客户 拜访联系人 拜访商机
      return ["visitClientList",'visitContactList','visitBusinessList'].includes(this.checkConfirm)
    }
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
      this.setCacheArray({ name: "VisitOperate" });
      this.cacheSelectConfig = JSON.stringify(dataBase.selectConfig)
      let path = {
        visitClientList:"/clientOperate",//拜访客户
        visitContactList:"/contactOperate",//联系人
        visitBusinessList:"/BusinessOperate",
      }[this.checkConfirm]
      setTimeout(()=>{
        this.$router.push({path,query:{
          from:"select"
        }})
      })
    },
    // 拜访客户请求，判断是否搜索
    getClientListData (isSearch) {
      this.lock_roll = true;
      // 是否加载更多
      this.loadingMore = true;
      // 修改配置
      this.changeConfig(clientConfig)
      // 判断是否为搜索
      if(isSearch){
        var isSearchObj = {
          typeId: this.type,
          ctype: 3,
          workInfo: 1,
          keyWord: this.val,
          agentcode: 'crm',
          pId: 0,
          page: 1,
          code: "",
          title: this.val,
          pageSize: 15
        }
      }else{ // 非搜索请求列表
        var isSearchObj = {
          page: this.page,
          pageSize: 15,
          agentcode: 'crm',
          ctype: 3,
          workInfo: 1
        }
      }
      searchClientList(isSearchObj).then(res => {
        if(res.code == '0' && res.data.pageData){
          let list = res.data.pageData;
          this.visitClientData.push(...list);
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
      })
    },


    // 获取拜访联系人列表请求
    getContactListData () {
      this.lock_roll = true;
      let obj = {
          selectClientId: this.visitClientId,
          page: this.page,
          pageSize: 15
      }
      this.loadingMore = true;
      // 修改配置
      this.changeConfig(contactConfig)
      searchContactList(obj).then(res => {
        if(res.code == '0'){
          let list = res.data.pageData;
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
          _.alert('提示',res.desc);
        }
      })
    },
    getBusinessListData(){
      this.lock_roll = true;
      let obj = {
        selectClientId: this.visitClientId,
        page: this.page,
        pageSize: 15
      }
      this.loadingMore = true;
      // 修改配置
      this.changeConfig(businessConfig)
      searchBusinessList(obj).then(res => {
        if(res.code == '0'){
          let list = res.data.pageData;
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
          _.alert('提示',res.desc);
        }
      })
    },
    // 获取所属外勤单列表请求
    getFieldListData () {
      this.lock_roll = true;
      let obj = {
        page: this.page,
        pageSize: 15
      }
      this.loadingMore = true;
      // 修改配置
      this.changeConfig(fieldBelongConfig)
      searchOutworkList(obj).then(res => {
        if(res.code == '0'){
          let list = res.data.pageData;
          this.fieldBelongData.push(...list);
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
          _.alert('提示',res.desc);
        }
      })
    },

    // 搜索框搜索
    showMsgFromSearchBox(val,type){
      //  '' :按客户名称搜索  1:按拜访次数搜索  2:按联系电话搜索
      this.noData = false;
      this.params.title = val;
      this.params.keyWord = val;
      this.params.selectClientId = this.visitClientId
      // 重置数据
      this.resetTreeConfigData();
      // 请求数据
      if(this.checkConfirm == 'fieldListBelongList'){
        // 所属外勤单配置
        this.changeConfig(fieldBelongConfig);
        searchOutworkList(this.params).then(res => {
          if(res.code == '0'){
            if(res.data.pageData){
              this.handleGetData(res.data.pageData);
              this.searchNone = false
            }else{
              this.searchNone = true
            }
          }else{
            _.alert('提示',res.desc);
          }
        })
      }
      else if(this.checkConfirm == 'visitClientList'){
        this.type = type == '0' ? '' : type;
        this.val = val;
        this.getClientListData(true);
      }
      else if(this.checkConfirm == 'visitContactList'){
        // 拜访联系人配置
        this.changeConfig(contactConfig);
        searchContactList(this.params).then(res => {
          if(res.code == '0'){
            if(res.data.pageData){
              this.handleGetData(res.data.pageData);
              this.searchNone = false
            }else{
              this.searchNone = true
            }
          }else{
            _.alert('提示',res.desc);
          }
        })
      }else if(this.checkConfirm == 'visitBusinessList'){
        this.changeConfig(businessConfig);
        searchBusinessList(this.params).then(res => {
          if(res.code == '0'){
            if(res.data.pageData){

              this.handleGetData(res.data.pageData);
              this.searchNone = false
            }else{
              this.searchNone = true
            }
          }else{
            _.alert('提示',res.desc);
          }
        })
      }
    },

    // 滚动加载更多
    loadMore (el) {
      let scrollTop =  el.target.scrollTop || window.pageYOffset || document.body.scrollTop;
      let offsetHeight = el.target.offsetHeight;
      let scrollHeight = el.scrollHeight;
      if(scrollTop + offsetHeight >= this.$refs.treeListAll.scrollHeight){
          if(this.hasMore && !this.lock_roll){
            this.page++;
            if(this.checkConfirm == 'visitClientList')
            this.getClientListData(false);
            if(this.checkConfirm == 'fieldListBelongList')
            this.getFieldListData();
            if(this.checkConfirm == 'visitContactList')
            this.getContactListData();
            if(this.checkConfirm == 'visitBusinessList')
              this.getBusinessListData();
          }
      }
    },

    // 按确认键
    confirmSelected() {
      this.page = 1;
      this.hasMore = true;
      this.searchNone = false;
      // 页面存在多种层级类型的选择时，才需要判断。只有一种类型时从 store 的selectValue获取
      this.$emit("currentSelected",this.currentSelected,this.selectValue)
      // 第一次确认跟第二次确认选择的是同一个
      if(this.checkConfirm == 'visitClientList'){
        this.sameValue = this.selectValue == this.visitClientId ? true : false;
        this.$emit('sameValue',this.sameValue);
      }
      this.$emit('update:treeListIsShow', false);
      this.$emit('update:searchBoxShow', false);
      this.$emit('update:noData', false);
      this.$emit("treeListShow", false);
    },

    // 取消键
    cancelSelected(val) {
      this.searchNone = false;
      this.$emit('update:treeListIsShow', false)
      this.$emit('update:searchBoxShow', false)
      this.$emit('update:noData', false)
      this.$emit("treeListShow", false);
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
  display: flex;
  flex-direction: column;
  height: 100%;
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

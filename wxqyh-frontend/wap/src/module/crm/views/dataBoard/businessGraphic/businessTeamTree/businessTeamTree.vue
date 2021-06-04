<template>
  <div class="treeListWrap"
  v-show="treeListIsShow">
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
        :items.sync="currentSelected"
        :config="config"
      >
      </qw-tree-item>
      <div class="member_tips"></div>
    </div>
      <qw-tree-button class="tree-btn"
        @cancelSelected="cancelSelected"
        @confirmSelected="confirmSelected"
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
import LoadMore from '@/components/list/load_more';
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { getTeamList } from '../../../../api/businessGraphic/getData';

const data = [];
// 存放客户的配置
const teamConfig = {
  id: 'id',
  title: 'teamName',
  checkType: 'checkbox',
  headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/aa.jpg',
  subTitle:'teamMemberNum'
}

export default {
  name: "TeamTree",
  components: {
    QwTreeItem,
    LoadMore,
    QwTreeButton,
    QwReturnBack,
  },
  props: {
    noData: {
      type:[Boolean,String],
    }, // 请求有没有数据
    teamData: {
      type:[Array, String]
    }, // 存放所属客户数据
    checkConfirm: {
      type:[Array, String],
      default: ''
    },
    teamTreeShow: {
      type:[Boolean,String],
    },
    belongClientId:{
      type:[Array, String],
    },
    hasmore: {
      type:[Boolean,String],
    },
    treeListIsShow: {
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
        keyWord: ""
      },
      loadingMore: true,  // 是否正在加载
      isWarnShow: false, // 选择超过五个则弹toast提示
      totalRows: 0,  // 总成员数
      page: 1,  // 当前页数
      maxPage: 0,  // 最大页数
      hasMore: true,  // 是否有更多数据
      lastPage:{},
      treeLists:true,
      selectValueStr: '',
      clearSelectedPerson: "",
      treeKeys: {},
      lock_roll: false,
      selected: [], //已选的数据
      showTreeList: true,
      type:'',
      val: '',
    };
  },
  watch:{
    hasmore(newVal,oldVal){
      this.hasMore = newVal
    }
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
      let height = window.innerHeight - 50; // 减去搜索框和nav栏
      return height + 'px';
    }
  },
  methods: {
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

    // 销售团队请求
    getTeamListData () {
      this.lock_roll = true;
      // 是否加载更多
      this.loadingMore = true;
      // 修改配置
      this.changeConfig(teamConfig)
      let obj = {
        page: this.page,
        pageSize: 15
      }
      getTeamList(obj).then(res => {
        if(res.code == '0' && res.data.pageData){
          let list = res.data.pageData;
          this.teamData.push(...list);
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
        }
      })
    },

    // 滚动加载更多
    loadMore (el) {
      let scrollTop =  el.target.scrollTop || window.pageYOffset || document.body.scrollTop;
      let offsetHeight = el.target.offsetHeight;
      let scrollHeight = el.scrollHeight;
      if(scrollTop + offsetHeight >= this.$refs.treeListAll.scrollHeight){
          if(this.hasMore && !this.lock_roll){
            this.page++;
            this.getTeamListData();
          }
      }
    },

    // 按确认键
    confirmSelected() {
      this.page = 1;
      this.hasMore = true;
      // 页面存在多种层级类型的选择时，才需要判断。只有一种类型时从 store 的selectValue获取
      this.$emit("currentSelected",this.currentSelected,this.selectValue)
      this.$emit('update:treeListIsShow', false)
      this.$emit('update:teamTreeShow', false)
      this.$emit("treeListShow", false);
      this.$emit('update:noData', false)
    },

    // 取消键
    cancelSelected(val) {
      this.page = 1;
      this.hasMore = true;
      this.$emit('update:treeListIsShow', false)
      this.$emit('update:teamTreeShow', false)
      this.$emit('update:noData', false)
      this.$emit("treeListShow", false);
    },
  }
};
</script>

<style lang="scss" scoped>
@import './businessTeamTree.scss';
</style>

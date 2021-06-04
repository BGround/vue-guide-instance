<template>
  <div class="qwui-select_tree" v-if="treeConfig.isShow" @click.stop>

    <search-box
      class="qwui-search"
      :searchinput="searchBarConfig"
      @listenToSearchBox="showMsgFromSearchBox"
    ></search-box>

    <div class="qwui-tree_main">
      <!--无记录-->
      <no-record
        v-show="noResult"
        :setTop="true"
        :hasRecord="recordData"
      ></no-record>

      <div
        class="qwui-select_tree_list"
        :style="{ height: winHeight }"
        ref="treeList">

        <qw-return-back
          class="qwui-return_back border-bottom-1px"
          v-show="prevParentId.length"
          @returnBack="returnBack"
        ></qw-return-back>

        <qw-tree-item
          v-model="selectValue"
          :options="options"
          :config="config"
          :treeListShow.sync="treeListShow"
          :items.sync="currentSelected"
          @clickTreeItem="clickTreeItem"
          @showNextItem="showNextItem"
        >
        </qw-tree-item>

        <div class="qwui-footer-height"></div>
      </div>

      <qw-tree-button
        class="qwui-tree_btn"
        @cancelSelected="cancelSelected"
        @confirmSelected="confirmSelected"
        @showSelectedItem="showSelectedItem"
        :subTitle="selectTitle"
      ></qw-tree-button>
    </div>
  </div>
</template>

<script>
import SearchBox from '@/components/base/search_box';
import QwTreeItem from "@/components/tree/treeItem";
import QwTreeButton from "@/components/tree/treeButton";
import QwReturnBack from "@/components/tree/treeReturnBack";
import QwTreeList from "@/components/tree/treeList";
import search_box from "@/components/base/search_box";
import NoRecord from '@/components/base/noRecord';
import { getCenterCostList, getSubjectList } from '../../api/editor';
import { mapState, mapMutations, mapActions } from "vuex";

const projectConfig = {
    id: 'id',
    title: 'name',
    hasChildren: 'hasChildren',
    checkType: 'radio',
    headPic: '',
    parentId: 'parentId',
  };

const subjectConifg = {
  id: 'subjId',
  title: 'subjName',
  subTitle: 'subjExplain',
  hasChildren: 'hasChildren',
  checkType: 'radio',
  onlyChildCheck: true,
  headPic: '',
  parentId: 'subjectParentsId',
}

export default {
  name: 'QwSelectTree',
  components: {
    QwTreeItem,
    QwTreeList,
    QwTreeButton,
    QwReturnBack,
    SearchBox,
    NoRecord,
  },
  props: {
    reimCreator: [String, Number],
    treeConfig: Object,
  },
  data () {
    return {
      treeListShow: true,
      searchBarConfig: {
        show: true,
        ridMask: false,
        setTopMask: false,
        keyWord: '',
      },
      recordData:{
        icon: 'qwui-icon_text',
        title: this.$t('i18n.reim.info.noRecord'),
        text: '',
      },
      noResult: false,
    };
  },
  computed: {
    winHeight() {
      // 减去搜索框高度
      return `${window.innerHeight - 45 }px`;
    },
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
        this.updateCurrentSelected(value);
      }
    },
    selectTitle() {
      if (this.treeConfig.config.checkType == 'radio') {
        return this.currentSelected.length > 0 ? this.currentSelected[0][this.treeConfig.config.title] : '';
      } else {
        return this.selectValue.length + this.$t('i18n.reim.editor.piece');
      }
    },
    ...mapState({
      config: state => state.tree.config, // 配置
      options: state => state.tree.options, // 列表数据
      renderData: state => state.tree.renderData, // { '父级ID': [子级数据] }
      currentParentId: state => state.tree.currentParentId, // 当前列表的父Id
      prevParentId: state => state.tree.prevParentId // 上一级的父Id。每点击下一级，则push “当前列表的父Id”。每返回上一级，则pop最后一个元素
    }),
  },
  created () {
    if (this.treeConfig.treeType == 'showProjectData') {
      this.showProjectData();
    }else if (this.treeConfig.treeType == 'showSubjectData') {
      this.showSubjectData();
    }

    this.searchBarConfig.keyWord = '';
  },
  beforeDestroy () {
    this.treeConfig.callBack.close();
  },
  methods: {
    showMsgFromSearchBox(keyword) {
      if (this.treeConfig.treeType == 'showProjectData') {
        this.showProjectData(keyword);
      } else if (this.treeConfig.treeType == 'showSubjectData') {
        this.showSubjectData(keyword);
      }
      this.searchBarConfig.keyWord = keyword;
    },
    // 返回上一级
    returnBack() {
      //  【必要的】
      this.handleReturnBack({'isResetData':false});
    },
    //取消
    cancelSelected() {
      //  【必要的】
      this.handleCancelSelected();
      this.treeConfig.callBack.close();
    },
    // 显示下一级数据
    showNextItem(option) {
      // 点击下一级前修改 prevParentId 【必要的】
      this.handlePrevParentId();

      if (this.treeConfig.treeType == 'showProjectData') {
        this.handleGetNextItem({ result: option.children, option});
      } else if (this.treeConfig.treeType == 'showSubjectData') {
        this.handleGetNextItem({ result: option.children, option});
      }
    },
    // 点击“确定”，求出已选择的数据
    confirmSelected() {
      //  【必要的】
      this.treeListShow = false;
      this.treeConfig.callBack.confirm(this.currentSelected[0]);
    },
    // 选择成本中心
    showProjectData(keyWord) {
      _.showLoading();
      // 重置数据 【必要的】
      this.resetTreeConfigData();
      // 修改配置
      this.changeConfig(this.treeConfig.config);

      if (this.treeConfig.selected.id) {
        this.updateSelectValue(this.treeConfig.selected.id);
        this.updateCurrentSelected([this.treeConfig.selected]);
      }

      // 获取当前列表数据
      getCenterCostList({keyWord, reimCreator: this.reimCreator}).then((res) => {
        const data = res.data.children;

        // 有数据时，显示列表
        if (data.length > 0) {
          this.treeListShow = true;
          this.noResult = false;
          // 【必要的】
          this.handleGetData(data);
        } else {
          this.treeListShow = false;
          this.noResult = true;
        }

        _.hideLoading();
      }).catch((err) => {
        _.hideLoading();
        if (err.desc) {
          _.alert('i18n.notice', err.desc);
        } else {
          _.alert('i18n.notice', 'i18n.reim.info.resultError');
        }
      })
    },
    // 选择科目
    showSubjectData(keyWord) {
      _.showLoading();
      // 重置数据 【必要的】
      this.resetTreeConfigData();
      // 修改配置
      this.changeConfig(this.treeConfig.config);

      if (this.treeConfig.selected.subjId) {
        this.updateSelectValue(this.treeConfig.selected.subjId);
        this.updateCurrentSelected([this.treeConfig.selected]);
      }

      getSubjectList({keyWord, reimCreator: this.reimCreator}).then((res) => {
        let data = res.data.subjList;

        // 有数据时，显示列表
        if (data.length > 0) {
          this.treeListShow = true;
          this.noResult = false;
          // 【必要的】
          this.handleGetData(data);
        } else {
          this.treeListShow = false;
          this.noResult = true;
        }

        _.hideLoading();
      }).catch((err) => {
        _.hideLoading();
        _.alert('i18n.notice', err.desc);
      });
    },
    clickTreeItem(payload) {

    },
    showSelectedItem() {

    },
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
  },
}
</script>

<style lang="scss" scoped>
@import '~../../styles/mixin.scss';

.qwui-select_tree {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 12;
  background-color: #F6F6F6;
  .qwui-tree_main {
    position: relative;
    width: 100%;
  }

  .qwui-search {
    position: relative;
  }

  .qwui-select_tree_list {
    width: 100%;
    overflow-y: scroll;

    /deep/ .treeList {
      overflow-y: initial;
    }
  }

  .qwui-return_back {
    background: #fff;
  }

  .qwui-footer-height {
    height: 50px;
  }

  .qwui-tree_btn {
    z-index: 10;
  }

  .qwui-tree_btn /deep/ .subTitle{
    width: 150px;
    margin: 2px auto 0;
    height: 16px;;
    @include no-wrap();
  }
}

@media screen and (min-width: 1024px){
  .qwui-select_tree {
    width: 740px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>

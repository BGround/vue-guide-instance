<template>
  <div class="qwui-examination_select_paper" v-show="show">
    <div class="select_paper_wrap">
      <!-- 窗口头部 -->
      <div class="select_paper_header">
        选择试卷
        <i class="select_paper_close" @click="closeWindow">×</i>
      </div>

      <!-- 本体内容 -->
      <div class="select_paper_content" v-show="hasLoading">
        <!-- 分类框 -->
        <classification-list
          class="classification_list"
          :dataArr="paperTypes"
          keyName="typeName"
          :autoSelect=true
          :allStringShow="allStringShow"
          @selectClassification="selectClassification"
        ></classification-list>
        
        <!-- 列表操作框 -->
        <paper-operate
          class="paper_operate"
          :paper="paper"
          @search="search"
          @select="selectPaper"
          @preview="preview"
          @pageChange="pageChange"
        ></paper-operate>
      </div>

      <!-- 预览试卷 -->
      <paper-preview-wrap 
        v-bind="paperPreview"
        @close="paperPreviewHidden"
        @select="selectFromPaperPreview"
      ></paper-preview-wrap>
      
    </div>
  </div>
</template>

<script>
import ClassificationList from './selectPaper/ClassificationList';
import PaperOperate from './selectPaper/PaperOperate';
import PaperPreviewWrap from './selectPaper/PaperPreviewWrap'

export default {
  name: 'QwSelectPaper',
  components: {
    ClassificationList,
    PaperOperate,
    PaperPreviewWrap,
  },

  props: {
    show: { // 组件展示,调用:show.sync绑定
      type: Boolean,
      required: true
    },
    nowPaper: { // 当前选择试卷
      type: Object,
      required: true
    }
  },

  data() {
    return {
      hasLoading: false, // 请求完成
      paperTypes: [], // 试卷分类数据
      paper: { // 试卷数据
        page: 1, // 当前页
        maxPage: 0,
        totalRows: 0,
        pageSize: 10,
        pageData: [],
        keyWord: '', // 搜索内容
        typeId: '', // 分类id
      },
      paperPreview: {
        show: false,
        paperData: {},
        selectData: {}
      },
    };
  },
  watch: {
    'show': function(val) {
      if (val) { // 如果true， 则加载数据
        this.init();
      }
    }
  },
  computed: {
    allStringShow() { // 分类标签内 全部是否可见
      return this.paperTypes.some(item => {
        return item.typeName.includes('未分类');
      });
    },
  },
  methods: {
    // 关闭窗口
    closeWindow() {
      this.$emit('update:show', false);
      this.$emit('closeWindow');
    },

    // 预览试卷
    preview(obj) {
      this.$emit('preview', true);
      Object.assign(this.paperPreview, {
        paperData: {},
        show: true,
        selectData: obj
      });
      obj.method == 1? this.getPaperPreviewRandom(obj.id): this.getPaperPreview(obj.id);
    },

    // 隐藏预览
    paperPreviewHidden() {
      this.$emit('preview', false);
      this.paperPreview.show = false;
    },

    // 更改分类
    selectClassification(obj) {
      let paper = this.paper;
      if (obj.status > -2) {
        paper.keyWord = '';
        paper.typeId = (obj.data && obj.data.id) || '';
        this.getPaperList().then(() => {
          if (!this.paper.pageData.length) {
            dataBase.alert("提示信息","还没有创建试卷，请先在试卷管理中创建试卷");
          }
        });
      } 
    },

    // 搜索关键字
    search(text) {
      this.getPaperList();
    },

    // 页码改变
    pageChange() {
      this.getPaperList();
    },

    // 预览试卷中选择试卷
    selectFromPaperPreview() {
      this.selectPaper(this.paperPreview.selectData);
    },

    // 选择试卷
    selectPaper(obj) {
      this.$emit('update:show', false);
      this.$emit('update:nowPaper', obj);
      this.$emit('selectPaper', obj);

    },
    // 初始化
    init() {
      this.hasLoading = false;
      this.paper = { // 试卷数据
        page: 1, // 当前页
        maxPage: 0,
        totalRows: 0,
        pageSize: 10,
        pageData: [],
        keyWord: '', // 搜索内容
        typeId: '', // 分类id
      };
      this.paperTypes = [];

      this.getPaperTypes().then(this.getPaperList).then(() => {
        this.hasLoading = true;
      });
    },

    // 请求考试分类
    getPaperTypes() {
      return new Promise((resolve, reject) => {
        this.$api.getPaperTypes({}, data => {
          let paperTypes = this.paperTypes;
          while(paperTypes.length) {
            paperTypes.pop();
          }
          paperTypes.push.apply(paperTypes, data.paperTypes);

          resolve();
        });
      });
    },

    // 请求试卷列表
    getPaperList() {
      return new Promise((resolve, reject) => {
        // 传参处理
        let paper = this.paper;
        let searchParam = {
          page: paper.page,
          pageSize: paper.pageSize,
          keyWord: paper.keyWord
        };

        if (paper.typeId) {
          searchParam.typeId = paper.typeId;
        }
        this.$api.getPaperList(searchParam, data => {
          if (data.totalRows == 0) {
            data.pageData = [];
          }

          let pageLength = data.pageData.length;
          for (let i = 0; i < pageLength; i++) {
            let nowItem = data.pageData[i];
            nowItem.select = nowItem.id == this.nowPaper.id? 1: 0;

            if (nowItem.totalScore == parseInt(nowItem.totalScore)) { // 小数为0则变整
              nowItem.totalScore = parseInt(nowItem.totalScore);
            }
          }

          // 变量名与公共组件page名不同 更换
          data.page = data.currPage;
          delete data.currPage
          this.paper = Object.assign({}, this.paper, data);
 
          resolve();
        });
      });
    },



    // 请求试卷预览数据
    getPaperPreview(id) {
      dataBase.loading = true;
      this.$api.getPaperPreview({paperId: id}, data => {
        dataBase.loading = false;
        this.paperPreview.paperData = Object.assign({},this.paperPreview.paperData, data);
      });
    },

    // 请求试卷预览数据--随机
    getPaperPreviewRandom(id) {
      dataBase.loading = true;
      this.$api.getPaperPreviewRandom({paperId: id}, data => {
        dataBase.loading = false;
        this.paperPreview.paperData = Object.assign({},this.paperPreview.paperData, data);
      });
    }

  },
  created() {
    
  }
};
</script>

<style lang="scss" scoped>
.qwui-examination_select_paper {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  overflow: hidden;
  background: rgba(0,0,0,0.5);

  .select_paper_wrap {
    position: absolute;
    display: block;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 820px;
    height: 660px;
    background: #fff;

    .select_paper_header {
      position: relative;
      padding-left: 20px;
      height: 49px;
      font-size: 18px;
      color: #333;
      line-height: 49px;
      text-align: left;
      background: #ececec;
      border-bottom: 1px solid #ddd;

      .select_paper_close {
        float: right;
        width: 50px;
        height: 49px;
        line-height: 45px;
        font-size: 28px;
        color: #bbb;
        font-style: normal;
        text-align: center;
        cursor: pointer;
      }
    }

    .select_paper_content {
      display: flex;
      width: 100%;
      height: 611px;
      font-size: 0;
      overflow-y: auto;
      
      .classification_list {
        flex: 1;
        width: 24%;
        min-height: 100%;
        border-right: 1px solid #ececec;
        font-size: 14px;
        vertical-align: top;
        overflow: auto;
      }

      .paper_operate {
        flex: 4;
        width: 75%;
        min-height: 100%;
        font-size: 14px;
        overflow: auto;

      }
    }
  }
}
</style>

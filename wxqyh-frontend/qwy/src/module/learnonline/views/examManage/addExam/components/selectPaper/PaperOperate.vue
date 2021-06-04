<template>
  <div class="qwui-examination_paper_operate">
    <!-- 搜索框 -->
    <div class="search_box_wrap">
      <qwui-input 
        class="search_box" 
        v-model="paper.keyWord" 
        inputType="search" 
        inputTips="输入试卷名称"
        @search='search'
      ></qwui-input>
    </div>
    
    <!-- 列表框 -->
    <div class="data_table_wrap">
      <data-table
        :headData="headData"
        :dataList="pageData"
      >
        <div
          class="table_operate"
          v-for="(item, index) in pageData "
          :slot="'operation'+index"
        >
          <span 
            class="table_operate_item"
            :class="{chosed: !pageData[index].questcount}"
            @click="select(index)"
          >{{pageData[index].select? '已选': '选择'}}</span>

          <span 
            class="table_operate_item"
            :class="{chosed: !pageData[index].questcount}" 
            @click="preview(index)"
          >预览</span>
        </div>
      </data-table>
    </div>

    <!-- 页码组件 -->
    <div class="page_wrap">
      <page :pageData="paper" @change="pageChange"></page>
    </div>
  
  </div>
</template>

<script>
import QwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput'
import DataTable from '@/components/Table/dataTable'
import Page from '@/components/list/page'

export default {
  name: 'QwPaperOperate',
  components: {
    QwuiInput,
    DataTable,
    Page,
  },

  props: {
    paper: { // 试卷数据
      type: Object,
      required: true
    },
  },

  data() {
    return {
      headData: { // 列表头配置
        middle: [
          {
            title: '试卷名称',   // 标题名称
            key: 'testpaperName',    // 数据字段名称
            width: 267,         // 标题栏宽度
          },
          {
            title: '总分数',   // 标题名称
            key: 'totalScore',    // 数据字段名称
            width: 50,         // 标题栏宽度
            textAlign: 'center', // 数据文字方向;值：left center right
          },
          {
            title: '总题数',   // 标题名称
            key: 'questcount',    // 数据字段名称
            width: 50,         // 标题栏宽度
            textAlign: 'center', // 数据文字方向;值：left center right
          },
          {
            title: '操作',   // 标题名称
            key: 'operation',    // 数据字段名称
            width: 108,         // 标题栏宽度
            textAlign: 'center', // 数据文字方向;值：left center right
          }  
        ],
        right: {   // 操作栏设置
          isShowOperate: false  // 是否显示操作栏
        }
      },
    };
  },
  computed: {
    pageData() {
      return this.paper.pageData;
    },
    pageConfig() {
      let page = this.paper;
      let config = {
        page: this.currPage,
        maxPage: this.maxPage,
        totalRows: this.totalRows,
        pageSize: this.pageSize,
      };
      return config;
    }
  },
  methods: {
    // 搜索
    search(text) {
      this.$emit('search', text);
    },

    // 选择试卷
    select(index) {
      let nowPageData = this.pageData[index];
      if (nowPageData.questcount && !nowPageData.select) { // 有题数才可以选择, 已选的不可再次触发
        let pageData = this.pageData;
        let pageDataLength = pageData.length;
        for (let i = 0; i < pageDataLength; i++) {
          pageData[i].select = 0;
        }

        // 数据副本
        let pageDataCopy = JSON.parse(JSON.stringify(nowPageData));
        delete pageDataCopy.select;

        this.$emit('select', pageDataCopy);
        nowPageData.select = 1;
      }
    },

    // 预览
    preview(index) {
      if (this.pageData[index].questcount) { // 有题数才可以预览
        this.$emit('preview', this.pageData[index]);
      }
    },

    // 页码改变
    pageChange(index) {
      this.$emit('pageChange', index);
    },

  }
};
</script>

<style lang="scss" scoped>
.qwui-examination_paper_operate {
  padding: 30px;

  .search_box_wrap {
    text-align: right;

    .search_box {
      text-align: left;
    }
  }

  .data_table_wrap {
    margin-top: 10px; 

    /deep/ .table_wrap {
      min-width: 0;

      .dataTable {
        cursor: default;

        td {
          height: 38px;
        }
      }
    }

    .table_operate_item {
      color: #f87b00;
      cursor: pointer;

      &:first-of-type {
        margin-right: 3px;
      }
    }

    .chosed {
      color: #999;
      cursor: default;
    }
  }


}
</style>

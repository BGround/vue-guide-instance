<template>
  <div class="learn-progress">
    <!--头部-->
    <div class="header">
      <span class="status"
            :class="{ active :  ajaxParam['searchValue.state'] == item.id }"
            v-for="item in statusArray"
            @click="changeStatu(item.id, item.text)"
      >{{ item.text }}</span>
      <div class="fr">
        <!--搜索框-->
        <search-box :searchSetting="searchSetting" :keyWord="ajaxParam['searchValue.questionBank']" @click="search"></search-box>
      </div>
      <!--导出按钮-->
      <div class="btn white" @click="createReport">导出</div>
      <!--提醒按钮-->
      <div class="btn orange" v-if="isMust" @click="remindUnFinish">提醒学习</div>
    </div>
    <!--进度列表-->
    <div class="section">
      <data-table :headData="headData" :dataList="listData"></data-table>
    </div>
    <!--分页-->
    <div class="footer" v-if="pageData.totalRows">
      <page :pageData="pageData" :pageSizeOption="pageSizeOption" @change="pageChange"></page>
    </div>
  </div>
</template>

<script>
import searchBox from 'learn/components/base/searchBox'
import dataTable from '@/components/Table/dataTable.vue'
import page from '@/components/list/page'
import exportReportForm from '@/assets/js/export/export.js';

export default {
  name: 'learnProgress',

  components: { searchBox, dataTable, page },

  props: {
    isMust: {
      type: Number,
      required: true
    },
    courseId: {
      type: String,
      required: true
    },
    subjectName: {
      type: String,
      required: true
    },
  },

  //导出的公用方法
  mixins:[ exportReportForm ],

  data() {
    return {
      //是否第一次加载
      isFirstLoad: true,
      //请求进度的参数
      ajaxParam: {
        'searchValue.id': this.courseId,
        'searchValue.isMust': '',
        'searchValue.state': '',
        'searchValue.questionBank': '',
      },
      //所选状态描述
      statueText: '全部',
      //搜索框的配置
      searchSetting: {
        width: 240,
        height: 32,
        placeholder: '学员姓名/账号/手机号',
      },
      //分页的参数
      pageData: {
        page: 1,
        pageSize: 5,
        maxPage: '',
        totalRows: '',
      },
      //分页的配置
      pageSizeOption: [5, 10, 15, 20],
      //列表头部的配置
      headData: {
        middle:[
          {
            title:'姓名',
            key:'personName',
            width:80,
          },
          {
            title:'账号',
            key:'wxUserId',
            width:80,
          },
          {
            title:'部门',
            key:'departmentName',
            width:150,
          },
          {
            title:'手机号',
            key:'mobile',
            width:80,
          },
          {
            title:'进度',
            key:'schedule',
            width:60,
          },
          {
            title:'学习时长（分）',
            key:'expend',
            width:70,
          },
          {
            title:'完成时间',
            key:'finishTime',
            width:80,
          },
        ],
        right: {
          isShowOperate: false,
        },
      },
      //列表数据
      listData: [],
    }
  },

  computed: {
    statusArray() {
      if(this.isMust) {
        let statusArray = [ //必学课
          {
            id: '',
            text: '全部',
          },
          {
            id: 5,
            text: '已完成',
          },
          {
            id: 1,
            text: '未完成',
          },
        ];
        return statusArray;
      }else {
        let statusArray = [ //选学课
          {
            id: '',
            text: '全部',
          },
          {
            id: 5,
            text: '已完成',
          },
          {
            id: 1,
            text: '学习中',
          },
          {
            id: 3,
            text: '未开始',
          },
        ];
        return statusArray;
      }
    },
  },

  watch: {},

  created() {
    //加载进度列表
    if(this.isFirstLoad) {
      this.getLearnProgerss();
      this.isFirstLoad = false;
    }
  },

  methods: {
    //获取学习进度
    getLearnProgerss() {
      let ajaxParam = this.ajaxParam;
      ajaxParam['page'] = this.pageData.page;
      ajaxParam['pageSize'] = this.pageData.pageSize;
      this.$api.getLearnProgerss(ajaxParam, data => {
        let { maxPage, totalRows, page } = data;
        this.pageData.maxPage = maxPage;
        this.pageData.totalRows = totalRows;
        this.listData.splice(0);
        page && this.listData.push(...page);
      });
    },
    //搜索状态改变
    changeStatu(id, text) {
      this.ajaxParam['searchValue.state'] = id;
      this.statueText = text;
      //重置页数为第一页
      this.pageData.page = 1;
      this.getLearnProgerss();
    },
    //关键词搜索
    search(keyWord) {
      this.ajaxParam['searchValue.questionBank'] = keyWord;
      //重置页数为第一页
      this.pageData.page = 1;
      this.getLearnProgerss();
    },
    //导出进度
    createReport() {
      //判空
      if(!this.listData.length) {
        _.alert('提示', '搜索结果为空，不支持导出');
        return;
      }
      let arr = [this.subjectName , '云课程('+ this.statueText +'进度)'];
      let paramObj = {
        'reportType': 'learning_rate',
        'searchValue.state': this.ajaxParam['searchValue.state'],
        'searchValue.questionBank': this.ajaxParam['searchValue.questionBank'],
        'searchValue.id': this.courseId,
        'personalFileName': this.$utils.exportFormName(arr),
      };
      this._createReport(paramObj);
    },
    //提醒课程未完成的人
    remindUnFinish() {
      _.alert('提示', '是否提醒未完成人员学习？',() => {
        this.$api.remindUnFinish({courseId: this.courseId}, data => {
          _.alert('提示', '提醒成功');
        });
      }, '确定', true);
    },
    //改变页码
    pageChange(currentPage, pageSize) {
      this.pageData.page = currentPage;
      this.pageData.pageSize = pageSize;
      this.getLearnProgerss();
    },
  },

}
</script>

<style lang="scss" scoped>
 @import 'learn/style/config.scss';
  .learn-progress {
    padding: 17px 30px 29px 34px;
    .header {
      height: 50px;
      padding: 9px 16px;
      background-color: #fff;
      .status {
        float: left;
        display: block;
        height: 24px;
        line-height: 24px;
        padding: 0 12px;
        margin: 4px 20px 0 0;
        color: #808080;
        font-size: 12px;
        border-radius:17px;
        cursor: pointer;
        @include transition;
        &.active {
          color: #F87B00;
          background-color: rgba(255, 150 ,0 , 0.0725);
        }
      }
      .btn {
        float: right;
        height: 28px;
        line-height: 28px;
        margin: 2px 20px 0 0;
        text-align: center;
        border-radius:2px;
        cursor: pointer;
        &.white {
          width: 72px;
          color: #808080;
          border:1px solid #D5D5D5;
          background-color: $whiteBackground;
          &:hover {
            background-color: #f5f5f587;
          }
        }
        &.orange {
          width: 84px;
          color: #fff;
          background-color: $orangeBtn;
          &:hover {
            background-color: $orangeBtnHover;
          }
        }
      }
    }
    .section {
      /deep/ .table_wrap {
        min-width: 928px;
        .nodata {
          min-height: 324px;
        }
      }
    }
    .footer {
      background-color: #fff;
      padding: 30px 0 12px 0;
      /deep/ .pager-nav {
        margin: 0;
      }
    }
  }
</style>

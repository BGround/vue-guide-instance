<template>
  <div class="learn-examResult">
    <data-table :headData="headData" :dataList="listData">
      <div
        class="table_operate"
        v-for="(item, index) in listData "
        :slot="'operation'+index"
      >
          <span class="table_operate_item" @click="showExamDetail">详细统计</span>
      </div>
    </data-table>
  </div>
</template>

<script>
import dataTable from '@/components/Table/dataTable.vue'

export default {
  name: 'examResult',

  components: { dataTable,  },

  props: {
    courseId: {
      type: String,
      required: true
    },
    examId: {
      required: true
    },
  },

  data() {
    return {
      //是否第一次加载
      isFirstLoad: true,
      //列表头部的配置
      headData: {
        middle:[
          {
            title:'考试名称',
            key:'examName',
            width:150,
          },
          {
            title:'已考试人数',
            key:'answerCount',
            width:80,
          },
          {
            title:'未考试人数',
            key:'unanswerCount',
            width:80,
          },
          {
            title:'完成率',
            key:'finishingRate',
            width:80,
          },
          {
            title:'通过人数',
            key:'passCount',
            width:80,
          },
          {
            title:'未通过人数',
            key:'unpassCount',
            width:80,
          },
          {
            title:'通过率',
            key:'passRate',
            width:80,
          },
          {
            title:'操作',
            key:'operation',
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

  computed: {},

  watch: {},

  created() {
    //获取列表数据
    if(this.isFirstLoad) {
      this.getLearnExamResult();
      this.isFirstLoad = false;
    }
  },

  methods: {
    //获取列表数据
    getLearnExamResult() {
      this.$api.getLearnExamResult({'searchValue.courseId': this.courseId}, data => {
        this.listData.splice(0);
        this.listData.push(...data.vo);
      });
    },
    //详细统计
    showExamDetail() {
      let url = _.baseURL + '/manager/examination/statistics/list_detail.jsp?examId=' + this.examId;
      this.$utils.windowRedirect(url, true);
    },
  },

}
</script>

<style lang="scss" scoped>
/* @import '../style/qwInput' */
  .learn-examResult {
    padding: 17px 30px 0 34px;
    /deep/ .table_wrap {
      min-width: 928px;
      .nodata {
        min-height: 324px;
      }
    }

    /deep/ .table_wrap {
      min-width: 0;

      .dataTable {
        cursor: default;

        td {
          height: 38px;
        }
     }
    }
    .table_operate {
      text-align: center;
      .table_operate_item {
        color: #f87b00;
        cursor: pointer;
      }
    }

  }
</style>

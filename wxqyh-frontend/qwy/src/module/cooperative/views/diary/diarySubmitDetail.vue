<template>
  <div class="qwui-list_wrap">
    <qwui-go-back :goBackConfig="goBackConfig"
      @listenToChild="gotoRecordPage"></qwui-go-back>

    <div class="qwui-top_main_bar">
      <div class="qwui-bar_left">
        <span v-for="(item,key) in submitData"
          :key="key"
          :class="{ active:item.val == type }"
          @click="selectType(item.val)">{{ item.text }} {{ item.number }}</span>
      </div>
      <div class="qwui-bar_right">
        <qwui-input inputType="search"
          @search='search'
          v-model="searchTitle"
          :inputTips="'搜索姓名、所属部门'">
        </qwui-input>
        <qwui-button @click="exportReportForm()"
          v-perm="'countDiary'">导出</qwui-button>
      </div>
    </div>

    <div class="qwui-table_wrap">
      <data-table :headData="headData"
        :dataList="dataList"></data-table>
      <page :pageData="pageData"
        @change="change"></page>
    </div>
  </div>
</template>

<script>
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput'
import dataTable from '@/components/Table/dataTable.vue'
import page from '@/components/list/page.vue'
import qwuiGoBack from '@/components/base/qwuiGoBack'
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
import { searchRuleDetail } from '../../api/diary/getData'

export default {
  props: {
    submitDetailData: {
      type: Object,
      default() {
        return {}
      }
    },
    showSubmitDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      goBackConfig: {
        hasLine: false,
        isCustomEvent: true,
        lastPath: this.submitDetailData.lastPath,
        currPath: this.submitDetailData.currPath
      },
      type: 1,
      searchTitle: '',
      submitData: {
        submitNum: {
          text: '已提交',
          number: this.submitDetailData.submitNum,
          val: 0
        },
        unSubNum: {
          text: '未提交',
          number: this.submitDetailData.unSubNum,
          val: 1
        },
        leaveNum: {
          text: '请假',
          number: this.submitDetailData.leaveNum,
          val: 2
        }
      },
      headData: {
        middle: [
          {
            title: '姓名',
            key: 'personName',
            width: 160
          },
          {
            title: '帐号',
            key: 'wxUserId',
            width: 160
          },
          {
            title: '所属部门',
            key: 'deptName',
            width: 160
          }
        ],
        right: {
          isShowOperate: false
        }
      },
      dataList: [],
      pageData: {},
      page: 1,
      pageSize: 10
    }
  },
  created() {
    this.type = this.submitDetailData.type
    if (!this.submitDetailData.showLeave) {
      delete this.submitData.leaveNum
    }
    this.getSubmitDetail()
  },
  methods: {
    getSubmitDetail() {
      searchRuleDetail(
        {
          page: this.page,
          pageSize: this.pageSize,
          recordId: this.submitDetailData.id,
          type: this.type,
          name: this.searchTitle
        },
        data => {
          this.pageData = {
            page: data.currPage,
            pageSize: this.pageSize,
            maxPage: data.maxPage,
            totalRows: data.totalRows
          }
          if (this.type == 0) {
            this.headData.middle[3] = {
              title: '提交时间',
              key: 'createTimeStr'
            }
            this.headData.middle[4] = {
              title: '操作',
              key: 'operation',
              skip: {
                skipFunc: item => {
                  this.viewDiaryDetail(item)
                }
              }
            }
          } else {
            this.headData.middle.splice(3, 2)
          }
          data.pageData.forEach(item => {
            item.operation = '详情'
            item.id = item.diaryId
          })
          this.dataList = data.pageData
        }
      )
    },
    viewDiaryDetail(item) {
      let top = (window.screen.height - 630) / 2
      let left = (window.screen.width - 520) / 2
      window.open(
        _.baseURL +
          '/manager/diary/detail.jsp?id=' +
          item.id +
          '&historyYear=' +
          item.createTime.substring(0, 4),
        'newwindow',
        'left=' +
          left +
          ',top=' +
          top +
          ',height=580, width=350, toolbar=no, menubar=no, resizable=yes,location=no, status=no,scrollbars=no,directories=no,menubar=no'
      )
    },
    search(val) {
      this.searchTitle = val
      this.getSubmitDetail()
    },
    selectType(key) {
      this.type = key
      this.getSubmitDetail()
    },
    change(page, pageSize) {
      this.pageSize = pageSize
      this.page = page
      this.getSubmitDetail()
    },
    gotoRecordPage() {
      this.$emit('update:showSubmitDetail', false)
    },
    exportReportForm() {
      this.$emit('listenExport', this.submitDetailData, true, this.searchTitle)
    }
  },
  components: {
    qwuiInput,
    dataTable,
    page,
    qwuiGoBack,
    qwuiButton
  }
}
</script>

<style lang="scss" scoped>
.qwui-list_wrap {
  position: relative;
  margin-left: 240px;

  .qwui-top_main_bar {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    padding-top: 20px;

    .qwui-bar_left {
      flex: 1;

      span {
        display: inline-block;
        padding: 5px 10px;
        margin-right: 10px;
        color: #999;
        border: 1px solid #d5d5d5;
        border-radius: 2px;
        cursor: pointer;

        &.active,
        &:hover {
          color: #f78b00;
          border-color: #f87b00;
        }
      }
    }
  }

  .qwui-table_wrap {
    padding-top: 15px;
    & /deep/ .table_wrap {
      min-width: 0;
    }
  }
}
</style>

<template>
<div>
  <div class="qwui-read_box">
    <div class="qwui-read_box_left">
      <qwuiButton @click="goBack">&nbsp;返回&nbsp;</qwuiButton>
      <!--      <qwuiButton v-perm="'dynamicinfoExport'" type='primary' @click="doExportReadDetail">&nbsp;导出&nbsp;</qwuiButton> -->
      <qwui-button @click="exportReadForm">导出</qwui-button>
    </div>
    <div class="qwui-read_box_right">
      <!--        <qwui-input inputType="search" @search='search' v-model="searchPersonnel" :inputTips="'搜索人员'"></qwui-input>-->
    </div>
  </div>
  <div class="qwui-table_wrap">
    <dataTable :headData="headData" :dataList="dataList"></dataTable>
    <page :pageData="pageData" @change="change"></page>
  </div>
</div>
</template>

<script>
import {
  searchGroupReadPager
} from '../../../api/newsBulletin/getData'
import exportReportForm from '@/assets/js/export/export.js'
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput'
import dataTable from '@/components/Table/dataTable.vue'
import page from '@/components/list/page.vue'

export default {
  mixins: [exportReportForm],
  data() {
    return {
      searchPersonnel: '',
      pageData: {},
      pageSize: 10,
      page: 1,
      dataList: [],
      readObj: {},
      headData: {
        middle: [{
            title: '销售ERP号',
            key: 'erpCarNo',
            width: 100,
            textAlign: 'center',
          },
          {
            title: '经销商简称',
            key: 'dealerShortName',
            textAlign: 'center',
          },
        ],
        right: {
          isShowOperate: false,
        },
      },
    }
  },
  mounted() {

    let self = this
    let id = ''
    let title = ''
    self.readObj = JSON.parse(window.sessionStorage.getItem('readObj'))
    if (!self.readObj) {
      self.readObj = {}
      self.readObj.id = self.$route.params.id
      self.readObj.title = self.$route.params.title
      window.sessionStorage.setItem('readObj', JSON.stringify(self.readObj))
    }
    this.ajaxSearchRead()
  },
  methods: {
    // 已读导出
    exportReadForm() {
      const form = {
        'searchValue.dynamicInfoId': this.$route.query.id, //文章id
        'searchValue.type': '1', //类型 (1.已读 0.未读)
        reportType: 'dynamic_read_dealer', //导出类型
      }
      this._createReport(form)
    },
    doExportReadDetail() {
      let self = this
      this._createReport({
        'searchValue.id': self.readObj.id,
        'searchValue.title': self.readObj.title,
        reportType: 'dynamic_readDetail',
        belongAgent: dataBase.agentCode,
      })
    },
    ajaxSearchRead() {
      let self = this
      searchGroupReadPager({
          dynamicInfoId: this.$route.query.id,
          type: '1', //是		0-未读，1-已读
          page: self.page,
          pageSize: self.pageSize,
        },
        (data) => {
          self.pageData = {
            page: data.currPage,
            pageSize: self.pageSize,
            maxPage: data.maxPage,
            totalRows: data.totalRows,
          }
          self.dataList = data.pager || []
        }
      )
    },
    change(page, pageSize) {
      this.pageSize = pageSize
      this.page = page
      this.ajaxSearchRead()
    },
    search() {
      this.page = 1
      this.ajaxSearchRead()
    },
    goBack() {
      this.$router.back()
    },
  },
  components: {
    qwuiButton,
    qwuiInput,
    dataTable,
    page,
  },
}
</script>

<style lang="scss" scoped>
.qwui-read_box {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;

  .qwui-read_box_left {
    flex: 1;
  }
}

.qwui-table_wrap {
  padding-top: 15px;
}
</style>

<template>
<div>
  <div class="qwui-unread_box">
    <div class="qwui-unread_box_left">
      <qwuiButton @click="goBack">&nbsp;返回&nbsp;</qwuiButton>
      <!--        <qwuiButton v-perm="'dynamicinfoExport'" type='primary' @click="doExportReadDetail">&nbsp;导出阅读数据&nbsp;</qwuiButton>-->
      <!--        <qwuiButton v-perm="'dynamicinfoEdit'" type='primary' @click="sendMsg">&nbsp;提醒通知&nbsp;</qwuiButton>-->
      <qwui-button @click="exportUnReadForm">导出</qwui-button>
    </div>
    <div class="qwui-unread_box_right">
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
  searchGroupReadPager,
  sendMsgToUnRead,
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
    this.getUnreadPager()
  },
  methods: {
    // 未读导出
    exportUnReadForm() {
      const form = {
        'searchValue.dynamicInfoId': this.$route.query.id, //文章id
        'searchValue.type': '0', //类型 (1.已读 0.未读)
        reportType: 'dynamic_unread_dealer', //导出类型
      }
      this._createReport(form)
    },
    sendMsg() {
      let self = this
      sendMsgToUnRead({
          id: self.readObj.id,
        },
        (data) => {
          dataBase.top_alert('发送成功', true, 3000)
        }
      )
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
    getUnreadPager() {
      let self = this
      searchGroupReadPager({
          dynamicInfoId: this.$route.query.id,
          type: '0',
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
      this.getUnreadPager()
    },
    search() {
      this.page = 1
      this.getUnreadPager()
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
.qwui-unread_box {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;

  .qwui-unread_box_left {
    flex: 1;
  }
}

.qwui-table_wrap {
  padding-top: 15px;
}
</style>

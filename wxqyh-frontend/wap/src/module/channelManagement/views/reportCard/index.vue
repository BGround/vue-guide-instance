<template>
  <div class="report-card-index">
    <qwui-group-tab :fixed="true"
      :selected="tabSelectedIndex"
      @click="handleClickTabs">
      <qwui-tab v-for="(item, index) in tabs"
        :key="index"
        :text="item.name"></qwui-tab>
    </qwui-group-tab>

    <SearchHeader :region="regionName"
      ref="searchHeader"
      placeholder="搜索店铺名称、ERP号"
      :keyword="keyword"
      @pick="handlePickRegion"
      @change="handleChangeSearch">
    </SearchHeader>

    <div v-if="tabSelectedIndex === 0"
      class="scroll-list-wrap">
      <reportCardItem @click="handleClickReportCardItem(item)"
        :data="convertReportCardProp(item)"
        v-for="(item, index) in reportCardList"
        :key="index"></reportCardItem>
      <infinite-loading @infinite="infiniteHandler"
        :identifier="tabSelectedIndex">
        <div slot="spinner"
          class="more">
          <p>查看更多</p>
          <i class="more__icon"></i>
        </div>
        <div slot="no-more"
          class="more">
          <p>没有更多了</p>
        </div>
        <div slot="no-results">
        </div>
      </infinite-loading>

      <noData :style="{ paddingTop: '20vh' }"
        v-if="!reportCardList.length"></noData>
    </div>

    <div v-if="tabSelectedIndex === 1"
      class="scroll-list-wrap">
      <reportCardItem @click="handleClickReportCardItem(item)"
        :data="convertReportCardProp(item)"
        v-for="(item, index) in reportCardList"
        :key="index"></reportCardItem>
      <infinite-loading :identifier="tabSelectedIndex"
        @infinite="afterSlaesInfiniteHandler">
        <div slot="spinner"
          class="more">
          <p>查看更多</p>
          <i class="more__icon"></i>
        </div>
        <div slot="no-more"
          class="more">
          <p>没有更多了</p>
        </div>
        <div slot="no-results"></div>
      </infinite-loading>

      <noData :style="{ paddingTop: '20vh' }"
        v-if="!reportCardList.length"></noData>
    </div>

    <qw-popup v-model="isVisibleRegionPanel"
      class="region-cascader-panel"
      :transition="hasAnimation? 'fade-left': 'none'"
      position="right"
      need-refresh>
      <div class="region-cascader-panel__container">
        <div class="region-cascader-panel__header">
          <span>请选择</span>
          <i class="qw-icon-close"
            @click="handleCloseRegionPanel"></i>
        </div>
        <div class="region-cascader-panel__content">
          <qw-cascader-panel ref="cascader-panel"
            v-model="selectedRegionValue"
            :options="regionCascaderPanelOptions"
            :props="regionCascaderPanelProps"
            @change="handleRegionChange" />
        </div>
        <div class="region-cascader-panel__footer">
          <qw-button-group>
            <qw-button @click="handleReset">
              重置
            </qw-button>
            <qw-button type="primary"
              @click="handleConfirm">
              确定
            </qw-button>
          </qw-button-group>
        </div>
      </div>
    </qw-popup>
  </div>
</template>

<script>
import SearchHeader from '@/module/channelManagement/components/SearchHeader'
import { searchDepatmentList } from '@/module/channelManagement/api/getData'
import {
  searchSalesReportPage,
  searchPortalSalesAfeterreportPage
} from '@/module/channelManagement/api/reportCard'
import QwuiTab from '@/module/channelManagement/components/qwuiTab/tab.vue'
import QwuiGroupTab from '@/module/channelManagement/components/qwuiTab/tab_group.vue'
import reportCardItem from '@/module/channelManagement/components/reportCard/reportCardItem'
import noData from '@/module/channelManagement/components/noData'

export default {
  name: 'reportIndex',
  components: {
    QwuiTab,
    QwuiGroupTab,
    SearchHeader,
    reportCardItem,
    noData
  },

  data() {
    return {
      tabSelectedIndex: 0,
      tabs: [
        {
          routeName: 'reportCardOfSales',
          name: '销售成绩单'
        },
        {
          routeName: 'reportCardOfAfterSales',
          name: '售后成绩单'
        }
      ],
      regionName: '全国',
      keyword: '',
      page: 1,
      pageSize: 10,
      area: '',
      province: '',
      city: '',
      isVisibleRegionPanel: false,
      selectedRegionValue: [],
      regionCascaderPanelOptions: [],
      regionCascaderPanelProps: {
        checkStrictly: true,
        multiple: false,
        lazy: true,
        lazyLoad(node, resolve) {
          const { level, value } = node
          searchDepatmentList({ id: value }).then(data => {
            const nodes = data.departmentList.map(item => {
              return {
                value: item.id,
                label: item.name,
                leaf: level >= 2
              }
            })
            resolve(nodes)
          })
        }
      },
      reportCardList: [],
      hasAnimation: true,
    }
  },
  methods: {
    convertReportCardProp(item) {
      if (this.tabSelectedIndex === 1) {
        const statusMap = ['未发送', '已读', '未读', '已反馈','','已完成']
          console.log(statusMap[item.lookOverStatus])
        return {
          name: `${item.serviceFullName}${item.year}年${item.quarter}季度成绩单`,
          date: `发布日期：${item.year}年${item.quarter}季度`,
          statusText: statusMap[item.lookOverStatus],
          statusColor: item.readStatus === '2' ? '#06ACFF' : '#C6001F',
          avatar: '',
        }
      }
      return {
        name: `${item.dealerShortName}${item.year}年${item.month}月成绩单`,
        date: `发布日期：${item.pushTime ? item.pushTime.substring(0, 10): '暂无'}`,
        statusText: item.readStatusDesc,
        statusColor: item.readStatus === '2' ? '#06ACFF' : '#C6001F',
        avatar: '',
      }
    },

    infiniteHandler($state) {
        this.fetchSalesReportCardList().then(({ isDone }) => {
            if (isDone) {
                $state.complete()
            } else {
                $state.loaded()
                this.page = this.page + 1
            }
        })
    },

    afterSlaesInfiniteHandler($state) {
      this.fetchAfterSalesReportCardList().then(({ isDone }) => {
        if (isDone) {
          $state.complete()
        } else {
          $state.loaded()
          this.page = this.page + 1
        }
      })
    },

    fetchAfterSalesReportCardList() {
      const params = {
          page: this.page,
          pageSize: this.pageSize,
          'searchValue.keyword': this.keyword,
          'searchValue.area': this.area,
          'searchValue.province': this.province,
          'searchValue.city': this.city
      }
      return searchPortalSalesAfeterreportPage(params).then(data => {
        if (data && data.pageData) {
          const list = data.pageData || []
          this.reportCardList = this.reportCardList.concat(list)
          if (data.currPage >= data.maxPage ) {
            return { isDone: true }
          } else {
            return { isDone: false }
          }
        } else {
          return { isDone: true }
        }
      })
    },

    fetchSalesReportCardList() {
      const params = {
          page: this.page,
          pageSize: this.pageSize,
          'searchValue.keyword': this.keyword,
          'searchValue.area': this.area,
          'searchValue.province': this.province,
          'searchValue.city': this.city
      }
      return searchSalesReportPage(params).then(data => {
        if (data && data.pageData) {
          const list = data.pageData || []
          this.reportCardList = this.reportCardList.concat(list)
          if (data.currPage >= data.maxPage) {
            return { isDone: true }
          } else {
            return { isDone: false }
          }
        } else {
          return { isDone: true }
        }
      })
    },

    handleClickTabs(value, text, index) {
      if(this.tabSelectedIndex === index){
        return;
      }
      this.reportCardList = []
      this.page = 1
      this.tabSelectedIndex = index
    },

    handleClickReportCardItem(item) {
      const { routeName } = this.tabs[this.tabSelectedIndex]
      if(this.tabSelectedIndex === 0){
         this.$router.push({ name: routeName, query: {dealerId: item.dealerId, id: item.id} })
      }else{
         this.$router.push({ name: routeName, query:  {dealerId: item.dealerId, id: item.id}  })
      }

    },

    handlePickRegion() {
      this.handleOpenRegionPanel()
    },

    handleOpenRegionPanel() {
      history.replaceState({'RegionPanelStatus': 'close'}, document.title, location.href);
      history.pushState({'RegionPanelStatus': 'open'}, document.title, location.href);
      this.isVisibleRegionPanel = true
    },

    handleCloseRegionPanel() {
      this.isVisibleRegionPanel = true;
      this.isVisibleRegionPanel = false
      history.back()
    },

    handleRegionChange(val, text) {
      const [area = '', province = '', city = ''] = text
      this.area = area
      this.province = province
      this.city = city
      this.regionName = city || province || area || '全国'
    },

    handleChangeSearch(keyword) {
      this.keyword = keyword || ''
      this.clearDealerList()
      this.page = 1
      this.fetchReportCardList()
    },

    clearDealerList() {
      this.reportCardList = []
    },

    handleReset() {
      this.$refs['cascader-panel'].handleClear()
      this.handleCloseRegionPanel()
      this.page = 1
      this.regionName = '全国'
      this.area = ''
      this.province = ''
      this.city = ''
      this.clearDealerList()
      this.fetchReportCardList()
    },

    handleConfirm() {
      this.handleCloseRegionPanel()
      this.page = 1
      this.clearDealerList()
      this.fetchReportCardList()
    },

    fetchReportCardList(){
      if(this.tabSelectedIndex === 0){
        this.fetchSalesReportCardList()
      }else{
        this.fetchAfterSalesReportCardList();
      }
    }

  },
  mounted() {
    window.addEventListener('popstate', ()=>{
      if(history.state && history.state.RegionPanelStatus === 'close'){
        this.isVisibleRegionPanel = false
        this.hasAnimation = false;
      }
      if(history.state && history.state.RegionPanelStatus === 'open'){
        this.hasAnimation = true;
        this.isVisibleRegionPanel = true
      }
    })
  },
}
</script>

<style lang="scss" scoped>
.report-card-index {
  .region-cascader-panel__header {
    height: 20px;
    padding: 10px 15px;
    font-size: 16px;
    line-height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 8px solid #f5f5f5;
  }

  /deep/ {
    .qw-popup__content {
      width: 100%;
    }
  }

  .region-cascader-panel {
    width: 100%;
    height: 100%;
  }
  .region-cascader-panel__container {
    width: 100%;
    height: 100%;
    background: #ffffff;
    position: relative;
  }
  .region-cascader-panel__content {
    position: absolute;
    left: 0;
    right: 0;
    top: 48px;
    bottom: 60px;
    overflow-y: auto;
  }
  .region-cascader-panel__footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 15px;
    padding-right: 15px;
    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
      border-bottom: 34px solid #ffffff;
    }
    &::before {
      content: '';
      position: absolute;
      height: 1px;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(230, 230, 230, 1);
      display: block;
      transform: scaleY(0.5);
      z-index: 10;
    }
  }
}
</style>

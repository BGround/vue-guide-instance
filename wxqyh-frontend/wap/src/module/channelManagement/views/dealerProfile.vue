<template>
  <div class="dealer-profile">
    <SearchHeader :region="regionName"
      ref="searchHeader"
      placeholder="搜索店铺名称、ERP号"
      :keyword="keyword"
      @pick="handlePickRegion"
      @change="handleChangeSearch">
    </SearchHeader>

    <div class="gutter"></div>

    <div class="scroll-list-wrap">
      <ProfileItem v-for="(item, index) in dealerList"
        :key="index"
        @click="handleClickProfile(item)"
        :data="convertDealerData(item)">
      </ProfileItem>
      <infinite-loading @infinite="infiniteHandler">
        <div slot="spinner"
          class="more">
          <p>查看更多</p><i class="more__icon"></i>
        </div>
        <div slot="no-more"
          class="more">
          <p>没有更多了</p>
        </div>
        <div slot="no-results">
          <p>暂无数据</p>
        </div>
      </infinite-loading>
      <noData :style="{paddingTop: '20vh'}" v-if="!dealerList.length"></noData>
    </div>

    <qw-popup v-model="isVisibleRegionPanel"
      :transition="hasAnimation? 'fade-left': 'none'"
      class="region-cascader-panel"
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
import ProfileItem from '@/module/channelManagement/components/ProfileItem'
import iconPortfolio from '@/module/channelManagement/static/images/icon_portfolio.png'
import iconPranscript from '@/module/channelManagement/static/images/icon_transcript.png'
import iconBusinessBoard from '@/module/channelManagement/static/images/icon_business_board.png'
import iconArrowDown from '@/module/channelManagement/static/images/icon_arrow_down.png'
import { searchDealerPagerByKey } from '@/module/channelManagement/api/development'
import { searchDepatmentList } from '@/module/channelManagement/api/getData'
import { mapGetters, mapMutations } from 'vuex'
import noData from '@/module/channelManagement/components/noData'
import debounce from '@/module/channelManagement/utils/debounce'

// 防抖
const searchDepatments = debounce(function() {
  this.fetchDealerList();
}, 700)

//  transcript
export default {
  name: 'DealerProfile',
  components: {
    SearchHeader,
    ProfileItem,
    noData
  },
  data: function() {
    return {
      options: {
        pullUpLoad: {
          threshold: 10,
          txt: '加载更多',
          noMore: '没有更多'
        }
      },
      items: [23, 23, 2333],
      keyword: '',
      regionName: '全国',
      page: 1,
      pageSize: 10,
      dealerList: [],
      isDone: false,
      sedepartmentId: '',
      sestatus: '',

      isVisibleRegionPanel: false,
      selectedRegionValue: [],
      currentRegion: '',
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
      hasAnimation: true,
    }
  },
  computed: {
    ...mapGetters('home', {
      getRegionName: 'getRegionName',
      getDepartmentIds: 'getDepartmentIds',
    })
  },
  created() {
    // this.fetchDealerList()
    this.regionName = this.getRegionName
    this.selectedRegionValue = this.getDepartmentIds
  },
  destroyed() {
    this.setRegionName('全国');
    this.setDepartmentIds('');
  },
  mounted() {
    const eventType = this.$route.params.type
    if (eventType === 'pick') {
      this.handleOpenRegionPanel()
    }
    if (eventType === 'focus') {
      this.$refs['searchHeader'].focus()
    }
    window.addEventListener('popstate', ()=>{
      if(history.state.RegionPanelStatus === 'close'){
        this.isVisibleRegionPanel = false
        this.hasAnimation = false;
      }
      if(history.state.RegionPanelStatus === 'open'){
        this.hasAnimation = true;
        this.isVisibleRegionPanel = true
      }
    })
  },
  methods: {
    ...mapMutations('home', {
      setRegionName: 'setRegionName',
      setDepartmentIds: 'setDepartmentIds'
    }),

    ...mapMutations('dealer', {
      setDealerDetail: 'setDealerDetail'
    }),

    convertDealerData(item) {
      return {
        id: item.id,
        avatar: item.storeImg ? _.compressURL + item.storeImg : '',
        name: item.dealerFullName,
        address: item.companyAddress,
        status: item.operatingState
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
      const regionId = val && val.length ? val[val.length - 1] : ''
      const regionName = text && text.length ? text[text.length - 1] : '全国'
      this.departmentId = regionId
      this.regionName = regionName
    },

    handleReset() {
      this.$refs['cascader-panel'].handleClear()
      this.handleCloseRegionPanel()
      this.page = 1
      this.regionName = '全国'
      this.departmentId = ''
      this.clearDealerList()
      this.fetchDealerList()
    },

    handleConfirm() {
      this.handleCloseRegionPanel()
      this.page = 1
      this.clearDealerList()
      this.fetchDealerList()
      this.setRegionName(this.regionName)
      this.setDepartmentIds(this.selectedRegionValue)
    },

    clearDealerList() {
      this.dealerList = []
    },

    fetchDealerList() {
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        'searchValue.departmentId': this.departmentId,
        'searchValue.keyWord': this.keyword,
        'searchValue.status': this.status
      }
      return searchDealerPagerByKey(params).then(data => {
        if (data) {
          const list = data.pageData || []
          this.dealerList = this.dealerList.concat(list)
          if (data.maxPage <= data.currPage) {
            return { isDone: true }
          } else {
            return { isDone: false }
          }
        } else {
          return { isDone: true }
        }
      })
    },

    handleChangeSearch(keyword) {
      this.keyword = keyword
      this.clearDealerList()
      this.page = 1
      searchDepatments.call(this);
    },
    handleClickProfile(detail) {
      this.setDealerDetail(detail)
      this.$router.push({
        name: 'dealerDetail',
        query: {
          storeImg: detail.storeImg,
          dealerFullName: detail.dealerFullName || '',
          dealerId: detail.id || '',
          // storeImg: detail.storeImg,
          // storeLevel: detail.storeLevel || '',
          // openingTime: detail.openingTime || '',
          // belongGroup: detail.belongGroup || '',
          // operatingState: detail.operatingState,
          // companyAddress: detail.companyAddress || '',
          // erpSerNo: detail.erpSerNo || '', //服务ERP
          erpCarNo: detail.erpCarNo || '', //整车ERP
          // city: detail.cityName || '',
          // province: detail.provinceName || ''
        },
        params: {
          
        }
      })
    },
    infiniteHandler($state) {
      this.fetchDealerList().then(({ isDone }) => {
        if (isDone) {
          $state.complete()
        } else {
          $state.loaded()
          this.page = this.page + 1
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dealer-profile {
  @media screen and (min-width: 1024px){
    width: 740px;
    margin: auto;
  }
  background: #ffffff;
  position: absolute;
  padding-bottom: 50px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .scroll-list-wrap {
    position: absolute;
    height: calc(100% - 60px);
    // height: 100%;
    left: 0;
    right: 0;
    // overflow: auto;
  }
  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }
  
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
     @media screen and (min-width: 1024px){
      width: 740px;
      margin: auto;
    }
  }


  .region-cascader-panel__container {
    width: 100%;
    height: 100%;
    background: #ffffff;
    position: relative;
  }
  .region-cascader-panel__content{
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
    @media screen and (min-width: 1024px){
      width: 740px;
      margin: auto;
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
  .no-more {
    text-align: center;
    padding: 10px 0;
    font-size: 12px;
    color: #b2b2b2;
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

  .more {
    height: 19px;
    font-size: 13px;
    font-weight: 400;
    line-height: 19px;
    color: rgba(153, 153, 153, 1);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    background: #ffffff;
  }
}
</style>
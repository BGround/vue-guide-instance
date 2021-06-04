<!-- 产品销量-->
<template>
  <div>
    <div class="product-sales"
      v-if="currentTableData.length">
      <qw-tab-bar v-model="selectedTabValue"
        :data="tabs"
        @change="handleChange"
        scrollable>
      </qw-tab-bar>
      <div class="gutter"></div>
      <div class="table">
        <div class="table__header">
          <div class="table__row">
            <span class="table__col">品牌</span>
            <span class="table__col">提车数</span>
            <span class="table__col">实数</span>
          </div>
        </div>
        <div class="table__body">
          <div class="table__row"
            v-for="(row, index) in currentTableData"
            :key="index">
            <span class="table__col">{{row.txtsh}}</span>
            <span class="table__col table__col--warning">{{row.getCar}}</span>
            <span class="table__col">{{row.saleCar}}</span>
          </div>
        </div>
      </div>

      <div class="more">
        <p v-if="currentTableData.length">暂无更多</p>
        <p v-else>暂无数据</p>
      </div>
    </div>

    <noData style="paddingTop: 20vh"
      :visible="!currentTableData.length &&!isLoading"></noData>

  </div>
</template>

<script>
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
import { chanPinXiaoLiang } from '@/module/channelManagement/api/operation'
import noData from '@/module/channelManagement/components/noData'

export default {
  mixins: [reloadApp],
  components: { noData },
  data() {
    return {
      selectedTabValue: 1,
      tabs: [],
      tableData: [],
      isLoading: false,
    }
  },
  computed: {
    currentTableData() {
      return this.tableData[this.selectedTabValue] || []
    }
  },
  methods: {
    handleChange() {}
  },
  created() {
    const erpCarNo = this.$route.query.erpCarNo
    if (!erpCarNo) {
      this.reloadApp()
      return
    }
    const params = {
      erp: `00000${erpCarNo}`
    }
    this.isLoading = true;
    chanPinXiaoLiang(params).then(data => {
      this.isLoading = false;
      if (data && data.data && Array.isArray(data.data.yearList)) {
        const yearMap = {}
        data.data.yearList.forEach(item => {
          if (!(item.timeString in yearMap)) {
            yearMap[item.timeString] = []
            yearMap[item.timeString].push(item)
          } else {
            yearMap[item.timeString].push(item)
          }
        })
        this.tableData = yearMap
        this.tabs = Object.keys(yearMap).map(item => {
          return {
            value: item,
            label: `${item}年`
          }
        })
        if (this.tabs.length) {
          this.selectedTabValue = this.tabs[0].value
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.product-sales {
  margin-bottom: 50px;
  background: #ffffff;

  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }

  .table {
    position: relative;
    &::after {
      position: absolute;
      content: '';
      height: 1px;
      transform: scaleY(0.5);
      left: 0;
      right: 0;
      bottom: 0;
      background: #d5d5d5;
    }
  }

  .table__header {
    background: #666666;
    .table__row {
      color: #ffffff;
    }
  }

  .table__row {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px 0 15px;
  }

  .table__col {
    width: 30%;
    text-align: center;
    font-size: 15px;
  }

  .table__body .table__row {
    &:nth-child(2n + 1) {
      background: rgba(250, 250, 250, 1);
    }
  }

  .table_col {
    font-size: 15px;
    font-weight: 400;
    line-height: 40px;
    color: rgba(102, 102, 102, 1);
  }

  .more {
    height: 19px;
    font-size: 13px;
    font-weight: 400;
    line-height: 19px;
    color: rgba(153, 153, 153, 1);
    margin: 0 auto;
    // margin-top: 15px;
    padding: 15px 0;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .more__icon {
    width: 7px;
    display: inline-block;
    height: 11px;
    background-image: url('~@/module/channelManagement/static/images/icon_arrow_right.png');
    background-repeat: no-repeat;
    background-size: 100%;
    margin-left: 10px;
  }
}
</style>
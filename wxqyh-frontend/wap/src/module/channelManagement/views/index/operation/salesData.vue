<!-- 销售运营-->
<template>
  <div class="sales-data">

    <div class="assembly-date">
      <div class="select-bar">
        <div @click="handleClickDatePicker"
             class="select-bar__item select-bar__item--year">
          <span class="select-bar__value">{{currentYear}}</span>
          <i class="section__icon"></i>
        </div>
        <div @click="handleClickDatePicker"
             class="select-bar__item select-bar__item--year"
             v-if="showQuarter">
          <span class="select-bar__value">{{currentQuarter}}</span>
          <i class="section__icon"></i>
        </div>
        <div @click="handleClickDatePicker"
             class="select-bar__item select-bar__item--month">
          <span class="select-bar__value">{{currentMonth}}</span>
          <i class="section__icon"></i>
        </div>
      </div>
    </div>

    <div class="gutter"></div>

    <template v-if="isNonEmptyObject(salesDetail)">
      <content-title :content="[
                      '更新日期：'+ toFormatTime(salesDetail.modifyTime, 'yyyy-MM-dd'),
                      '更新人：'+ salesDetail.modifyUser
                     ]"
                     :showContent="salesDetail.modifyTime || salesDetail.modifyUser"
                     name="当年销量"
                     padding="15px 7px 15px 18px"
      ></content-title>
      <qw-table :cell-class-name="cellClassName"
                :data="salesDetail.list"
                :header-cell-class-name="'row-blue'"
                :row-class-name="rowClassName">
        <qw-table-column align="center" header-align="center" label="" prop="sales_0"></qw-table-column>
        <qw-table-column align="center" header-align="center" min-width="84px" prop="sales_1">
          <div slot="header" slot-scope="scope">
            <div class="mainTitle">当年目标</div>
            <div class="subtitle">({{currentYear}})</div>
          </div>
        </qw-table-column>
        <qw-table-column align="center" header-align="center" min-width="111px" prop="sales_2">
          <div slot="header" slot-scope="scope">
            <div class="mainTitle">当年累计</div>
            <div class="subtitle">({{currentYear}}{{currentMonthValue > 1 ? '1-' : ''}}{{currentMonthValue}}月)</div>
          </div>
          <template slot-scope="scope">
            <span :class="[salesSpanClassName(scope.row.sales_2)]">{{ scope.row.sales_2  || '-'}}</span>
          </template>
        </qw-table-column>
        <qw-table-column align="center" header-align="center" min-width="99px" prop="sales_3">
          <div slot="header" slot-scope="scope">
            <div class="mainTitle">当月完成</div>
            <div class="subtitle">({{currentYear}}{{currentMonthValue}}月)</div>
          </div>
          <template slot-scope="scope">
            <span :class="[salesSpanClassName(scope.row.sales_3)]">{{ scope.row.sales_3  || '-'}}</span>
          </template>
        </qw-table-column>
      </qw-table>
    </template>

    <template v-if="isNonEmptyObject(historyDetail)">
      <content-title :content="[
                      '更新日期：'+ toFormatTime(historyDetail.modifyTime, 'yyyy-MM-dd'),
                      '更新人：'+ historyDetail.modifyUser
                     ]"
                     :showContent="historyDetail.modifyTime || historyDetail.modifyUser"
                     name="历史销量"
                     padding="15px 7px 15px 18px"
      ></content-title>
      <qw-table :cell-class-name="cellClassName"
                :data="historyDetail.list"
                :row-class-name="historyRowClassName"
                :show-header="false">
        <qw-table-column align="center" header-align="center" label="" prop="history_0">
          <template slot-scope="scope">
            <span class="text-white" v-if="scope.$index === 0">{{ scope.row.history_0 | formatYear }}</span>
            <span v-else>{{scope.row.history_0||'-'}}</span>
          </template>
        </qw-table-column>
        <qw-table-column align="center" header-align="center" min-width="84px" prop="history_1">
          <template slot-scope="scope">
            <span class="text-white" v-if="scope.$index === 0">{{ scope.row.history_1 | formatYear }}</span>
            <span v-else>{{scope.row.history_1||'-'}}</span>
          </template>
        </qw-table-column>
        <qw-table-column align="center" header-align="center" min-width="111px" prop="history_2">
          <template slot-scope="scope">
            <span class="text-white" v-if="scope.$index === 0">{{ scope.row.history_2 | formatYear }}</span>
            <span v-else>{{scope.row.history_2||'-'}}</span>
          </template>
        </qw-table-column>
        <qw-table-column align="center" header-align="center" min-width="99px" prop="history_3">
          <template slot-scope="scope">
            <span class="text-white" v-if="scope.$index === 0">{{ scope.row.history_3 | formatYear }}</span>
            <span v-else>{{scope.row.history_3||'-'}}</span>
          </template>
        </qw-table-column>
      </qw-table>
    </template>

    <template v-if="isNonEmptyObject(salesProductDetail)">
      <content-title :content="[
                      '更新日期：'+ toFormatTime(salesProductDetail.modifyTime, 'yyyy-MM-dd'),
                      '更新人：'+ salesProductDetail.modifyUser
                     ]"
                     :showContent="salesProductDetail.modifyTime || salesProductDetail.modifyUser"
                     name="分产品销量"
                     padding="18px 7px 0 18px"
      ></content-title>
      <qw-tab-bar :data="tabs"
                  @change="handleChangeTab"
                  v-model="selectedTapIndex">
      </qw-tab-bar>
      <qw-table :cell-class-name="'no-border text-black3'"
                :data="salesProductDetail[selectedTapIndex]"
                :header-cell-class-name="'row-blue'"
                :row-class-name="rowClassName"
                :summary-method="getSummaries"
                show-summary
                style="padding-top: 8px;">
        <qw-table-column align="center" header-align="center" label="车型" prop="modelName" width="60px">
          <div slot="header" slot-scope="scope">
            <div class="mainTitle">车型</div>
          </div>
        </qw-table-column>
        <qw-table-column align="center" header-align="center" prop="currentMonthData">
          <div slot="header" slot-scope="scope">
            <div class="mainTitle">当月</div>
            <div class="subtitle">({{currentYear}}{{currentMonthValue}}月)</div>
          </div>
        </qw-table-column>
        <qw-table-column align="center" header-align="center" prop="currentYearData">
          <div slot="header" slot-scope="scope">
            <div class="mainTitle">当年</div>
            <div style="white-space: nowrap" class="subtitle">({{currentYear}}{{currentMonthValue > 1 ? '1-' : ''}}{{currentMonthValue}}月)</div>
          </div>
        </qw-table-column>
        <qw-table-column align="center" header-align="center" prop="lastYearData" width="62px">
          <div slot="header" slot-scope="scope">
            <div  style="white-space: nowrap" class="mainTitle">{{currentLastYear | formatYear}}</div>
          </div>
        </qw-table-column>
        <qw-table-column align="center" header-align="center" prop="beforeLastYearData" width="62px">
          <div slot="header" slot-scope="scope">
            <div class="mainTitle">{{currentLastTwoYear | formatYear}}</div>
          </div>
        </qw-table-column>
      </qw-table>
    </template>

    <noData :visible="!isLoading && false" style="paddingTop: 20vh"></noData>

    <qw-cascade-picker
      :data="dateOptions"
      :selected-index="selectedIndex"
      @select="handleSelectDate"
      v-model="isVisibleDatePicker"
    ></qw-cascade-picker>

  </div>
</template>

<script>
  import reloadApp from '@/module/channelManagement/mixins/reloadApp'
  import assemblyDate from '@/module/channelManagement/mixins/assemblyDate'
  import {getHistorySales, getSalesDetail, getSalesProductDetail} from '@/module/channelManagement/api/operation'
  import noData from '@/module/channelManagement/components/noData'
  import contentTitle from '@/module/channelManagement/components/contentTitle';

  export default {
    mixins: [reloadApp, assemblyDate],
    components: {noData, contentTitle},
    data() {
      return {
        showQuarter: false, // 是否显示季度的选项，默认是true
        salesDetail: {},
        historyDetail: {},
        salesProductDetail: {},
        currentYearSales: [
          {
            name: '提车',
            target: '20999',
            total: '22910',
            finish: '342'
          },
          {
            name: '提车同比',
            target: '-',
            total: '69.00%',
            finish: '78.88%'
          },
          {
            name: '实销',
            target: '6589',
            total: '6523',
            finish: '231'
          },
          {
            name: '实销同比',
            target: '-',
            total: '-30.3%',
            finish: '79.43%'
          },
          {
            name: '库存',
            target: '-',
            total: '456',
            finish: '12'
          },
          {
            name: '存销比',
            target: '-',
            total: '23.02',
            finish: '2.11'
          }
        ],
        selectedTapIndex: 'pickData',
        tabs: [
          {
            value: 'pickData',
            label: '提车'
          },
          {
            value: 'salesData',
            label: '实销'
          }
        ],
        currentLastYear: '',
        currentLastTwoYear: '',
        dealerId: '',
        isLoading: false
      }
    },
    filters: {
      formatYear(value) {
        if (!value) return ''
        return `${value}年`
      },
      formatTime(value, fmt) {
        if (value) {
          let da
          if (typeof value == 'string') {
            if (value.indexOf(".") > -1) {
              // 有些日期接口返回带有.0。
              value = value.substring(0, value.indexOf("."));
            }
            value = value.replace(/-/g, '/')
          }
          da = new Date(value)
          let o = {
            'M+': da.getMonth() + 1, //月份
            'd+': da.getDate(), //日
            'h+': da.getHours(), //小时
            'm+': da.getMinutes(), //分
            's+': da.getSeconds(), //秒
            'q+': Math.floor((da.getMonth() + 3) / 3), //季度
            S: da.getMilliseconds() //毫秒
          }
          if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (da.getFullYear() + '').substr(4 - RegExp.$1.length))
          }
          for (let k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
              fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
            }
          }
          return fmt
        } else {
          return value || '-'
        }
      },
    },
    computed: {
      hasData() {
        return this.isNonEmptyObject(this.salesDetail)
          || this.isNonEmptyObject(this.historyDetail)
          || this.isNonEmptyObject(this.salesProductDetail)
      }
    },
    methods: {
      isNonEmptyObject(target) {
        const isObject = Object.prototype.toString.call(target) === '[object Object]'
        return isObject && !!Object.keys(target).length
      },

      toFormatTime(value, fmt) {
        if (!value) return
        return this.$options.filters['formatTime'](value, fmt)
      },

      cellClassName({row, column, rowIndex, columnIndex}) {
        if (columnIndex == 0) return 'no-border text-black'
        return 'no-border text-black2'
      },

      rowClassName({row, rowIndex}) {
        if (rowIndex % 2 === 1) return 'row-grey'
      },

      salesSpanClassName(value) {
        if (!value || value === '-') return '-'
        if (typeof value === 'string' || typeof value === 'number') {
          if (value.indexOf('%') !== -1) {
            if (value.indexOf('-') !== -1) return 'text-red'
            return 'text-green'
          }
        }
        return ''
      },

      historyRowClassName({row, rowIndex}) {
        if (rowIndex === 0) return ' row-blue'
        if (rowIndex === 2) return ' row-grey'
      },

      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = "合计";
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = "-";
          }
        });
        return sums;
      },
      handleChangeTab(value) {
      },

      // 当年销量
      fetchSalesDetail() {
        const params = {
          dealerId: this.dealerId,
          year: this.currentYearValue,
          month: this.currentMonthValue,
        }
        return getSalesDetail(params).then((data) => {
          if (data && data.salesDetail) {
            let array = []
            if (this.isNonEmptyObject(data.salesDetail.yearTarget)) {
              array.push(data.salesDetail.yearTarget)
            }
            if (this.isNonEmptyObject(data.salesDetail.yearGrand)) {
              array.push(data.salesDetail.yearGrand)
            }
            if (this.isNonEmptyObject(data.salesDetail.monthCompletion)) {
              array.push(data.salesDetail.monthCompletion)
            }
            let name = {
              pickNum: '提车',
              pickRate: '提车同比',
              salesNum: '实销',
              salesRate: '实销同比',
              stock: '库存',
              stockSalesRate: '存销比',
            }
            let list = this.assemblyList(array, name, 'sales')
            this.$set(data.salesDetail, 'list', list || [])
            this.salesDetail = data.salesDetail
          } else {
            this.salesDetail = {}
          }
        })
      },

      // 历史销量
      fetchHistorySales() {
        const params = {
          dealerId: this.dealerId,
          year: this.currentYearValue
        }
        return getHistorySales(params).then((data) => {
          if (data && data.histotyDetail) {
            let array = data.histotyDetail && data.histotyDetail.historySalesList || []
            let name = {
              year: "",
              getCarNum: "提车",
              saleCarNum: "实销",
            }
            let list = this.assemblyList(array, name, 'history')
            this.$set(data.histotyDetail, 'list', list || [])
            this.historyDetail = data.histotyDetail
          } else {
            this.historyDetail = {}
          }
        })
      },

      // 封装数据
      assemblyList(array, name, cellName) {
        let map = {}
        for (let i = 0; i < array.length; i++) {
          for (let key in name) {
            if (map[key] == undefined) {
              map[key] = [name[key]];
            }
            map[key].push(array[i][key]);
          }
        }
        let list = [];
        for (let k in map) {
          let obj = {}
          map[k].forEach((item, index) => {
            obj[cellName + '_' + index] = item
          })
          list.push(obj);
        }
        return list
      },
      // 封装【其他】数据
      otherList(source,target){
        let tempArr = []
        let obj = {}
        tempArr = source
        tempArr.forEach(item => {
          for(let key in item) {
            if(item[key]){
              item[key] = (item[key] == '-') ? '0' : item[key]
              let value = parseInt(item[key]);
              key in obj ? (obj[key] += value) : (obj[key] = value)
            }
          }
        })
        obj.modelName = '其他'
        target.push(obj)
      },
      // 分产品销量
      fetchSalesProductDetail() {
        const params = {
          dealerId: this.dealerId,
          year: this.currentYearValue,
          month: this.currentMonthValue,
        }
        return getSalesProductDetail(params).then((data) => {
          if (data && data.salesProductDetail) {
            this.salesProductDetail = data.salesProductDetail
            //是否有其他提车数据
            if(data.salesProductDetail.otherPickData && data.salesProductDetail.otherPickData.length > 0){
              this.otherList(data.salesProductDetail.otherPickData,this.salesProductDetail.pickData)
            }
            //是否有其他实销数据
            if(data.salesProductDetail.otherSalesData && data.salesProductDetail.otherSalesData.length > 0){
              this.otherList(data.salesProductDetail.otherSalesData,this.salesProductDetail.salesData)
            }
          } else {
            this.salesProductDetail = {}
          }
        })
      },

      async initData() {
        this.dealerId = this.$route.query.dealerId || ''
        this.currentLastYear = this.currentYearValue - 1
        this.currentLastTwoYear = this.currentYearValue - 2
        this.isLoading = true
        await this.fetchSalesDetail()
        await this.fetchHistorySales()
        await this.fetchSalesProductDetail()
        this.isLoading = false
      }
    },
    watch:{
        '$route.query'(query){
            console.log(query, 'xx')
            this.initData()
        }
    },
    created() {
      this.initData()
    },
    mounted() {
    }
  }
</script>

<style lang="scss" scoped>
  .sales-data {
    margin-bottom: 50px;

    .gutter {
      height: 8px;
      background: rgba(245, 245, 245, 1);
    }

    .assembly-date {
      .select-bar {
        height: 40px;
        display: flex;
        align-items: center;
        padding: 0 15px;
        justify-content: center;
        background: #ffffff;

        .select-bar__item {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          width: 36%;

          .select-bar__value {
            height: 21px;
            font-size: 15px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 22px;
            color: rgba(0, 0, 0, 1);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .section__icon {
            display: block;
            width: 9px;
            height: 6px;
            background-image: url('~@/module/channelManagement/static/images/icon_select_arrow.png');
            background-repeat: no-repeat;
            background-size: 100%;
            margin-left: 16px;
          }

          &--year {
            .select-bar__value {
              width: 55px;
              text-align: right;
            }
          }

          &--month {
            .select-bar__value {
              width: 45px;
              text-align: right;
            }
          }
        }
      }
    }

    .text-green {
      color: rgba(0, 181, 99, 1);
    }

    .text-red {
      color: rgba(198, 0, 31, 1);
    }

    .text-white {
      color: #fff;
    }

  }
</style>
<style lang="scss">
  .sales-data {
    .qw-table {
      background-color: #fff;

      table {
        width: 100% !important;
        max-width: 100% !important;
      }

      tr:hover > td {
        background-color: transparent;
      }

      td, th {
        padding: 10px 0;
      }

      th > .cell {
        display: block;
        padding-left: 5px;
        padding-right: 5px;
      }

      .text-black {
        color: rgba(0, 0, 0, 1);
      }

      .text-black2 {
        color: rgba(51, 51, 51, 1);
      }

      .text-black3 {
        color: rgba(102, 102, 102, 1);
      }

      .row-blue {
        color: #fff;
        padding: 3px 0;
        background-color: rgba(39, 129, 219, 1);

        .mainTitle {
          font-size: 14px;
        }

        .subtitle {
          font-size: 12px;
          -webkit-transform: scale(0.84, 0.84);
          transform-origin: center;
          *font-size: 10px;
        }
      }

      .row-grey {
        background-color: rgba(247, 247, 247, 1);
      }

      .no-border {
        border: none;
      }

      .qw-table__footer-wrapper tbody td,
      .qw-table__header-wrapper tbody td {
        background-color: #fff;
        color: rgba(102, 102, 102, 1);
      }
    }
  }
</style>

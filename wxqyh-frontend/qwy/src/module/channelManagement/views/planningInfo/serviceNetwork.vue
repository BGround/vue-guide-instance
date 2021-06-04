<template>
  <div>
    <div class="qwui-top_main_bar">
      <div class="qwui-bar_left">
        <qwuiButton
          v-perm="'serviceNetWorkImport'"
          type="primary"
          @click="handleClickImportBtn"
          >&nbsp;导入&nbsp;</qwuiButton
        >
        <!--<qwuiButton
          v-perm="'serviceNetWorkExport'"
          @click="handleClickExportBtn"
          >&nbsp;导出&nbsp;</qwuiButton
        >  -->
        <el-dropdown trigger="click" placement="bottom-start" @command="handleExportCommand" style="margin-left:10px;">
          <el-button class="el-dropdown-link">
            导出<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item  command="areaDetail" icon="el-icon-document">导出区县规划明细</el-dropdown-item>
            <el-dropdown-item  command="pointType" icon="el-icon-document">导出全国规划建议</el-dropdown-item>
            <el-dropdown-item  command="protectLevel" icon="el-icon-document">导出保有量档级分布</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <span class="qwui-dotted_line"></span>
        <qwuiButton @click="handleClickDistanceBtn"
          >&nbsp;网点距离查询&nbsp;</qwuiButton>
           <span class="qwui-dotted_line"></span>
           <span>网点总数：{{totalPoint}}</span>
      </div>
      <div class="qwui-bar_right">
        <el-date-picker
          v-model="searchParams.searchYear"
          type="year"
          format="yyyy年"
          value-format="yyyy"
          placeholder="选择年"
          @change="handleChangeYear"
        >
        </el-date-picker>

        <el-select class="month" v-model="searchParams.searchMonth" clearable placeholder="请选月">
          <div slot="prefix">
            <i class="el-icon-date"></i>
          </div>
          <template v-if="searchParams.searchYear">
            <el-option
              v-for="item in searchMonthOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </template>
        </el-select>

        <span class="qwui-dotted_line"></span>
        <qwui-input
          inputType="search"
          @search="handleSimpleSearch"
          v-model="searchParams.areaName"
          @input="searchInput"
          :inputTips="'查询区县'"
        ></qwui-input>
        <a class="qwui-senior_search_btn" @click="showAdvancedScreen"
          >高级搜索</a
        >
      </div>
    </div>
    <!-- @keyup.enter="searchForm" -->
    <searchForm
      @submit="handleAdvancedSearch"
      @reset="handleResetForm"
      v-show="isShowAdvancedScreen"
    ></searchForm>

    <div class="qwui-table_wrap">
      <qwTab :tabList="tabList" :index="index" @selectIndex="selectIndex"></qwTab>
      <div class="covernetwork-point">
        <table>
          <tr>
            <th>全国{{coverTitle}}数</th>
            <th>一网覆盖{{cityCover}}数</th>
            <th>直营店覆盖{{cityCover}}数</th>
            <th>二网覆盖{{cityCover}}数</th>
            <th>覆盖{{cityCover}}小计</th>
            <th>空白{{cityCover}}数</th>
            <th>覆盖率</th>
          </tr>
          <tr>
            <td>{{coverageList.nationalTerrestrialSeries}}</td>
            <td>{{coverageList.oneNetworkCoveringNumber}}</td>
            <td>{{coverageList.directStoresCoverNumber}}</td>
            <td>{{coverageList.twoNetworkCoveringNumber}}</td>
            <td>{{coverageList.coveringCitySubtotal}}</td>
            <td>{{coverageList.blankCityNumber}}</td>
            <td>{{coverageList.fractionCoverage}}</td>
          </tr>
        </table>
      </div>
      <div class="gutter"></div>
      <dataTable :headData="headData" :dataList="planList"> </dataTable>
      <page :pageData="pageData" @change="handleChangePage"></page>

    </div>

    <el-dialog
      :title="dialogDetailTitle"
      :visible.sync="isShowNetworkDetail"
      width="700px"
    >
      <div slot="title" class="dialog-title">
        {{dialogDetailTitle}}
      </div>
      <div class="network-point">
        <table>
          <tr>
            <th>网络类型</th>
            <th>服务号</th>
            <th>简称</th>
            <th>性质</th>
            <th>状态</th>
          </tr>
          <tr v-for="(item,index) in networkDetail" :key="index">
            <td>{{item.typeNetWork}}</td>
            <td>{{item.erpSerNo || item.shopCode}}</td>
            <td>{{item.serviceStationName || item.shopName}}</td>
            <td>{{item.nature || item.category}}</td>
            <td>{{item.serviceOperatingStatus || item.afterOperationStatus}}</td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <qwuiButton type="primary" @click="handleCloseDetailDialog"
          >&nbsp;确定&nbsp;</qwuiButton>
      </span>
    </el-dialog>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="isVisibleDialog"
      :show-close="false"
      width="700px"
    >
      <div slot="title" class="dialog-title">
        {{ dialogTitle }}
      </div>
      <div class="network-point">
        <table>
          <tr>
            <th>网络类型</th>
            <th>服务电话</th>
            <th>简称</th>
            <th>规划建议</th>
            <th>状态</th>
          </tr>
          <tr v-for="(item, index) in networkPoints" :key="index">
            <td>{{ item.networkType }}</td>
            <td>{{ item.serviceNo }}</td>
            <td>{{ item.pointName }}</td>
            <td>{{ item.pointType }}</td>
            <td>{{ item.pointStatus }}</td>
          </tr>
        </table>
      </div>

      <span slot="footer" class="dialog-footer">
        <qwuiButton type="primary" @click="handleClickDialogCloseBtn"
          >&nbsp;关闭&nbsp;</qwuiButton
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
import qwuiSelect from '@/components/qwuiBase/qwuiSelect/qwuiSelect'
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput'

import dataTable from '@/components/Table/dataTable.vue'
import page from '@/components/list/page.vue'
import qwShareAlert from '@/components/Alert/QwShareAlert.vue'
// import exportReportForm from '@/assets/js/export/export.js';
import searchForm from '@/module/channelManagement/components/planningInfo/searchForm'
import qwTab from '@/components/Tab/QwTab';
// import { mapActions, mapGetters } from "vuex";
import {
  addOrUpdateServiceNetworkPlan,
  searchPlanList,
  importServiceNetworkPlan,
  exportServiceNetworkPlan,
  searchPlanPointList,
  checkReport,
  createReportTask,
  searchCoverList
} from '@/module/channelManagement/api/getData'
const statusMap = { 1: '正常运营', 2: '经营异常', 3: '退网经销商' }
export default {
  name: 'newsBulletinList',
  // mixins:[exportReportForm],
  data() {
    return {
      searchMonthOptions: [
        {
          label: '01月',
          value: '1'
        },
        {
          label: '02月',
          value: '2'
        },
        {
          label: '03月',
          value: '3'
        },
        {
          label: '04月',
          value: '4'
        },
        {
          label: '05月',
          value: '5'
        },
        {
          label: '06月',
          value: '6'
        },
        {
          label: '07月',
          value: '7'
        },
        {
          label: '08月',
          value: '8'
        },
        {
          label: '09月',
          value: '9'
        },
        {
          label: '10月',
          value: '10'
        },
        {
          label: '11月',
          value: '11'
        },
        {
          label: '12月',
          value: '12'
        }
      ],
      searchTitle: '',
      pageSize: 10,
      pageData: {
        page: 1,
        pageSize: 15,
        maxPage: 1,
        totalRows: ''
      },
      exportStartTime: '',
      exportEndTime: '',
      isShowAdvancedScreen: true,
      ids: '',
      headData: {
        // left: {
        //   id: "dynamicInfoId",
        //   checkFunc: (isSelectedAll, list) => {
        //     let arr = [];
        //     list.forEach(function(item) {
        //       if (item.isChecked) {
        //         arr.push(item.id);
        //       }
        //     });
        //     this.ids = arr.join(",");
        //   }
        // },
        //

        middle: [
          {
            title: '年度',
            key: 'serviceYear',
            textAlign: 'center',
            width: 90
          },
          {
            title: '月度',
            key: 'serviceMonth',
            textAlign: 'center',
            width: 90
          },
          {
            title: '行政划分',
            key: 'areaType',
            textAlign: 'center',
            width: 90
          },
          {
            title: '战区',
            key: 'warZone',
            textAlign: 'center',
            width: 90
          },
          {
            title: '省份',
            key: 'provinceName',
            textAlign: 'center',
            width: 90
          },
          {
            width: 90,
            key: 'cityName',
            textAlign: 'center',
            title: '城市'
          },
          {
            title: '区县',
            key: 'areaName',
            textAlign: 'center',
            width: 90
          },

          {
            title: '一网覆盖',
            key: 'oneNetworkCovering',
            textAlign: 'center',
            width: 90,
            skip: {
              skipFunc: item => {
                this.showOneNetworkCover(item)
              }
            }
          },

          {
            title: '直营店覆盖',
            key: 'directStoreCoverage',
            textAlign: 'center',
            width: 110,
            skip: {
              skipFunc: item => {
                this.showDirectNetworkCover(item)
              }
            }
          },

          {
            title: '二网覆盖',
            key: 'twoNetworkCovering',
            textAlign: 'center',
            width: 90,
            skip: {
              skipFunc: (item,title) => {
                this.showTwoNetworkCover(item)
              }
            }
          },
          {
            title: '县级距离市区公里数',
            key: 'mileage',
            textAlign: 'center',
            width: 150
          },
          {
            title: '3年累计上牌量',
            key: 'numberOfCards',
            textAlign: 'center',
            width: 120
          },
          {
            title: '保有量分级',
            key: 'quantityRating',
            textAlign: 'center',
            width: 110
          },
          {
            title: '距离分级',
            key: 'distanceClassification',
            textAlign: 'center',
            width: 90
          },
          {
            title: '规划建议',
            key: 'planningType',
            textAlign: 'center',
            width: 90
          },
          {
            title: '备注',
            key: 'remark',
            textAlign: 'center',
            width: 90
          }
        ],
        right: {
          isShowOperate: true,
          width: 100
        }
      },
      planList: [],
      coverageList: {},
      searchParams: {
        areaName: '',
        searchYear: '',
        currentPage: '1',
        pageSize: '10',
        warZoneId: '',
        provinceId: '',
        cityId:'',
        areaId: '',
        searchMonth: '',
        pointCountOfMin: '',
        pointCountOfMax: '',
        mileageOfMin: '', // 公里
        mileageOfMax: '',
        numberOfCardsOfMin: '',
        numberOfCardsOfMax: '',
        quantityRating: '', //保有量分级
        distanceClassification: '', //距离分级
        areaType:'2',  //1.市区 2.区县（默认是2），用做切换==县级覆盖率、地级覆盖率统计
      },
      searchData: [],
      exportParams: {},
      isUseAdvancedScreen: false,
      dialogTitle: '网点详情',
      isVisibleDialog: false,
      dialogDetailTitle: '一网网点',
      isShowNetworkDetail: false,
      networkPoints: [],
      totalPoint: '',
      index:0,
      tabList:[
        {text:'县级覆盖率',perm:'dynamicinfoList'},
        {text:'地级覆盖率',perm:'articleDetail'}
      ],
      networkDetail:[],
      coverTitle: '县级',
      cityCover: '县级',
    }
  },
  created() {
    this.fetchPlanList()
  },
  mounted() {},

  activated(){
    this.updateParams()
    this.cleanPlanList()
    this.fetchPlanList()
  },
  methods: {

    handleChangeYear(value) {
      if (!value) {
        this.searchParams.searchMonth = '';
      }
    },

    handleExportCommand(command){
          switch (command) {
              case 'areaDetail' :
                   var exportCommandParams = {
                     reportType: 'SERVICE_NETWORK_PLAN',
                     "searchValue.warZoneId":this.searchParams.warZoneId,           //大区
                      "searchValue.provinceId":this.searchParams.provinceId,           //省份
                      "searchValue.cityId":this.searchParams.cityId,           //城市
                      "searchValue.areaId":this.searchParams.areaId,           //区县
                      "searchValue.areaType":this.searchParams.areaType,           //类型 1.市区    2.区县
                      "searchValue.searchYear":this.searchParams.searchYear,         //年份
                      "searchValue.searchYearMonth":this.searchParams.searchMonth,           //月份
                   }
                  this.handleClickExportBtn(exportCommandParams)
                  break;
              case 'pointType' :  //导出全国规划建议
                  var exportCommandParams = {
                    "searchValue.serviceYear":this.searchParams.searchYear, //年份
                    "searchValue.serviceMonth":this.searchParams.searchMonth, //月份
                    "searchValue.warZoneId":this.searchParams.warZoneId,           //大区
                      "searchValue.provinceId":this.searchParams.provinceId,           //省份
                      "searchValue.cityId":this.searchParams.cityId,           //城市
                      "searchValue.areaId":this.searchParams.areaId,           //区县
                      "searchValue.areaType":this.searchParams.areaType,           //类型 1.市区    2.区县
                    reportType: 'national_planning_proposals',
                   }
                  this.handleClickExportBtn(exportCommandParams)
                  break;
              case 'protectLevel' : //导出保有量档级分布
                  var exportCommandParams = {
                     reportType: 'quantity_grade_distribution',
                     "searchValue.searchYear":this.searchParams.searchYear, //年份
                     "searchValue.searchMonth":this.searchParams.searchMonth, //月份
                     "searchtValue.areaType": this.searchParams.areaType,
                   }
                  this.handleClickExportBtn(exportCommandParams)
                  break;
              default:
                  break;
          }
      },

    handleClickExportBtn(params) {
      const { currentPage, pageSize, ...queryParams } = this.searchParams
      // const typeParams = { reportType: 'SERVICE_NETWORK_PLAN' }
      const typeParams = params
      const prefixParams = {}
      Object.keys(queryParams).forEach(key => {
        prefixParams['searchValue.' + key] = queryParams[key]
      })
      const exportParams = Object.assign({}, prefixParams, typeParams)
      checkReport(typeParams).then(data => {
        if (data.fileName || data.fileName === 'undefined') {
          const tipsContent = `已找到相同查询条件的报表：【${data.fileName}】是否重新导出？`
          _.alert(
            '提示',
            tipsContent,
            () => {
              this.export(exportParams)
            },
            '确定',
            true
          )
        } else {
          this.export(exportParams)
        }
      })
    },

    export(params) {
      console.log(params)
      createReportTask(params).then(data => {
        if (data && data.fileName) {
          _.alert(
            '提示',
            '操作成功，请稍后到<a href=' +
              _.baseURL +
              '/manager/report/reportTask_main.jsp>导出报表管理(点击跳转)</a>处下载对应的导出文件：' +
              data.fileName
          )
        } else {
          _.alert('提示', '导出失败，请联系管理员...')
        }
      })
    },

    handleClickImportBtn() {
      // this.$router.push({ name: "importServiceNetwork" });
      window.location.href =
        _.baseURL +
        '/manager/qiruiqd/qiruiqd_import.jsp?reportType=SERVICE_NETWORK_PLAN'
    },

    cleanPlanList() {
      this.planList = []
      this.totalPoint = 0;
    },

    /**
     * 网点距离查询
     */
    handleClickDistanceBtn() {
      this.$router.push({ name: 'networkSearch' })
    },

    handleChageYear() {},

    skipFunc(item) {
      // window.sessionStorage.removeItem('readObj')
      // this.$router.push({
      //   name: 'newsBulletinRead',
      //   params: {
      //     id: item.dynamicInfoId,
      //     title: item.title
      //   }
      // })
    },

    handleClickDialogCloseBtn() {
      this.isVisibleDialog = false
    },
    handleCloseDetailDialog() {
      this.isShowNetworkDetail = false
    },

    showNetworkPoints(item) {
      if (parseInt(item.pointCount) > 0) {
        this.networkPoints = []
        // this.dialogTitle = item.
        searchPlanPointList({ planId: item.id }).then(data => {
          this.isVisibleDialog = true
          if (data && Array.isArray(data.pointList)) {
            this.networkPoints = data.pointList
          }
        })
      } else {
        _.alert('提示', '暂无网点')
      }
    },

    handleChangePage(page, pageSize) {
      this.searchParams = Object.assign({}, this.searchParams, {
        currentPage: page,
        pageSize: pageSize
      })
      this.updateParams()
      this.cleanPlanList()
      this.fetchPlanList()
    },
    handleSimpleSearch(value) {
      this.isShowAdvancedScreen = false
      this.searchParams = Object.assign({}, this.searchParams, {
        currentPage: 1
      })
      this.updateParams()
      this.cleanPlanList()
      this.fetchPlanList()
    },

    handleResetForm(form) {
      this.searchParams = Object.assign({}, this.searchParams, form, {
        currentPage: 1
      })
      this.cleanPlanList()
      this.fetchPlanList()
    },

    handleAdvancedSearch(form) {
      this.searchParams = Object.assign({}, this.searchParams, form, {
        currentPage: 1
      })
      console.log(666,this.searchParams)
      this.cleanPlanList()
      this.fetchPlanList()
    },

    updateParams() {
      if (this.isShowAdvancedScreen) {
        return
      }
      this.searchParams = Object.assign({}, this.searchParams, {
        warZoneId: '',
        provinceId: '',
        cityId: '',
        areaId: '',
        pointCountOfMin: '',
        pointCountOfMax: '',
        mileageOfMin: '', // 公里
        mileageOfMax: '',
        numberOfCardsOfMin: '',
        numberOfCardsOfMax: '',
      })
    },
    fetchPlanList() {
      const self = this
      return searchPlanList(this.searchParams)
        .then(data => {
          if (!data) {
            return Promise.reject(new Error(''))
          }
          this.pageData = {
            page: data.currPage,
            pageSize: this.searchParams.pageSize,
            maxPage: data.maxPage,
            totalRows: data.totalRows,
          }
          this.totalPoint = data.totalPoint? data.totalPoint : 0;
          const list = data.pageData || [];
          this.coverageList = data.coverageRateVO || {}
          this.planList = list.map(item => {
            return Object.assign({}, item, {
              statuses: statusMap[item.statuses] || statuses,
              operationList: [
                {
                  perm: 'serviceNetWorkEdit',
                  text: '编辑',
                  operationFunc: detail => {
                    self.handleClickEdit(item)
                  }
                }
              ]
            })
          })
        }).catch(()=>{})
        // .finally(() => {})
    },

    handleClickEdit(data) {
      this.$router.push({ name: 'serviceNetworkEdit', params: data })
    },

    // exportReportForm(){
    //   let startTime = this.exportStartTime;
    //   let endTime = this.exportEndTime;
    //   if(startTime==""||endTime==""){
    //     dataBase.top_alert('请在【高级搜索】设置导出数据的创建时间段',false,3000);
    //   }else{
    //     if(this.exportDaysLimitByMonthCounts(startTime,endTime)){
    //       if(this.totalRows>0){
    //         this.updateExportParams();
    //         this._createReport(this.exportParams);
    //       } else{
    //         dataBase.top_alert('搜索结果为空，不支持导出',false,3000);
    //       }
    //     }
    //   }
    // },
    updateExportParams() {},
    searchInput(data) {
      // this.advancedScreenData.title = this.searchTitle
    },
    showAdvancedScreen() {
      this.isShowAdvancedScreen = !this.isShowAdvancedScreen
    },
    selectIndex(index) {
      console.log(index)
      if(index == 1){
        this.searchParams.areaType = 1
        this.coverTitle = '地级'
        this.cityCover = '城市'
      }
      else{
        this.coverTitle = '县级'
        this.cityCover = '县级'
        this.searchParams.areaType = 2
      } 
      this.fetchPlanList()
    },
    getNetworkCoverList(params){
      searchCoverList(params).then(data => {
        this.isShowNetworkDetail = true
        if(data && Array.isArray(data.areaList)){
          this.networkDetail = data.areaList
        }
        this.dialogDetailTitle = data.netWork
      })
    },
    showOneNetworkCover(item){
      if(parseInt(item.oneNetworkCovering) > 0){
        this.networkDetail = []
        let params = {
          "type":"oneNetworkCovering",       //一网类型
          "provinceName":item.provinceName,           //省份
          "cityName":item.cityName,               //城市
          "areaName":item.areaName,               //区县
        }
        this.getNetworkCoverList(params)
      }
    },
    showTwoNetworkCover(item){
      if(parseInt(item.twoNetworkCovering) > 0){
        this.networkDetail = []
        let params = {
          "type":"twoNetworkCovering",       //二网类型
          "provinceName":item.provinceName,           //省份
          "cityName":item.cityName,               //城市
          "areaName":item.areaName,               //区县
        }
        this.getNetworkCoverList(params)
      }
    },
    showDirectNetworkCover(item){
      if(parseInt(item.directStoreCoverage) > 0){
      console.log(111111)
        this.networkDetail = []
        let params = {
          "type":"directStoreCoverage",       //直营店类型
          "provinceName":item.provinceName,           //省份
          "cityName":item.cityName,               //城市
          "areaName":item.areaName,               //区县
        }
       this.getNetworkCoverList(params)
      }
    }
  },
  computed: {},
  watch: {},
  components: {
    qwuiButton,
    qwuiInput,
    // advancedScreen,
    dataTable,
    page,
    qwShareAlert,
    qwuiSelect,
    searchForm,
    qwTab
  }
}
</script>

<style lang="scss" scoped>
@mixin tip-style {
  display: inline-block;
  border-radius: 3px;
  color: #fff;
  font-size: 12px;
  margin-right: 5px;
  padding: 2px 5px;
  background: #32cd32;
}
@mixin pt15 {
  padding-top: 15px;
}
@mixin pt20 {
  padding-top: 20px;
}
.qwui-dotted_line {
  border-right: 1px dashed #cfcfcf;
  margin: 0 8px 0 5px;
}

.qwui-top_main_bar {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  @include pt20;
  .qwui-bar_left {
    flex: 1;
    .el-button{
      padding: 8px 14px;
      color: #333;
      // #f87b00
    }
    .el-button.el-button--danger{
      background-color: #C31725;
      border-color: #C31725;
      &:focus{
        background-color: #F08088;
        color: #fff;
      }
      &:hover{
        background-color: #F08088;
        color: #fff;
      }
    }
    .el-button:focus, .el-button:hover{
      color: #C31725;
      border-color: #C31725;
      background: #fff;
    }
  }
  .qwui-bar_right {
    .qwui-senior_search_btn {
      cursor: pointer;
      float: right;
      font-size: 12px;
      height: 35px;
      line-height: 16px;
      margin: 0 5px;
      padding: 0 3px;
      text-align: center;
      width: 30px;
      color: #C31725;
      user-select: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
.qwui-table_wrap {
  @include pt15;
  .qwui-content {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .qwui-set_top {
      @include tip-style;
    }
    .qwui-secret {
      @include tip-style;
      background: #ff574d;
    }
    .goLink {
      color: #C31725;
      text-decoration: underline;
    }
  }
}

.qwui-bar_right {
  /deep/ {
    .el-date-editor.el-input.el-date-editor--month,
    .el-date-editor.el-input.el-date-editor--year {
      .el-input__inner {
        border-radius: 0 !important;
        border: 1px #ccc solid;
      }
    }

    .el-select.month{
       width: 130px;
      .el-input__inner {
        border-radius: 0 !important;
        border: 1px #ccc solid;
      }
      .el-icon-date{
        line-height: 32px;
        width: 25px;
      }
    }

    .el-select {
      width: 120px;
      .el-input.is-focus {
        .el-input__inner {
          border-color: #ccc;
        }
      }
      .el-input__inner:focus {
        border-color: #ccc;
      }

      .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
      .el-input__icon {
        line-height: 32px;
      }
    }
    .el-input {
      .el-input__inner {
        line-height: 32px;
        height: 32px;
      }
      .el-input__icon {
        line-height: 32px;
      }
      &.is-active .el-input__inner,
      .el-input__inner:focus {
        border-color: #ccc;
      }
    }
    .el-input--prefix .el-input__inner {
      padding-left: 39px;
    }
    .el-date-editor--month {
      .el-input__inner {
        padding-left: 43px;
      }
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 130px;
    }
  }
}

/deep/ {
  .el-dialog__body {
    padding: 20px;
  }
  .el-dialog__header {
    padding: 15px;
    background: rgba(242, 242, 242, 1);
  }
  .el-dialog__footer {
    text-align: center;
  }
}
.network-point {
  table {
    width: 100%;
    text-align: center;
    th {
      border: 1px solid rgba(121, 121, 121, 1);
      line-height: 30px;
      width: 20%;
    }
    td {
      border: 1px solid rgba(121, 121, 121, 1);
      line-height: 30px;
      width: 20%;
    }
  }
}
.covernetwork-point {
  table {
    width: 100%;
    text-align: center;
    margin-top: 40px;
    th {
      border: 1px solid #ccc;
      background:#eee;
      line-height: 50px;
      width: 14.3%;
    }
    td {
      border: 1px solid #ccc;
      line-height: 50px;
      width: 14.3%;
    }
  }
}
.gutter{
  margin-top: 40px;
}
</style>

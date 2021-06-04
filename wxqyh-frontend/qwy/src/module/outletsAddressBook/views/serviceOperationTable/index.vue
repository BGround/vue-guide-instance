<template>
<div class="service_operaion_table">
  <div class="qwui-list_wrap">
    <div class="qwui-top_main_bar">
      <div class="qwui-bar_left">
        <qwui-button @click="exportReportForm">导出</qwui-button>
      </div>
      <div class="qwui-bar_right">
        <qwui-input inputType="search"
                    @search='search'
                    v-model="searchERP"
                    :inputTips="'搜索ERP号'">
        </qwui-input>
        <!-- <a class="qwui-senior_search_btn" @click="showAdvancedScreen">高级搜索</a> -->
      </div>
    </div>
    <div class="qwui-table_wrap">
      <el-table
        border
        :data="tableData"
        @selection-change="handleSelectionChange"
        style="width: 100%">

        <el-table-column
          type="selection"
          width="40">
        </el-table-column>

        <el-table-column
          prop="updateRecord"
          label="变更描述"
          width="320"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="actualServiceClassification"
          label="服务业务状态分类"
          width="160"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="regional"
          label="大区"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="provinceName"
          label="省份"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="cityName"
          label="城市"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="areaName"
          label="县/区"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="erpCarNo"
          label="销售号"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="erpSerNo"
          label="服务号"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="serviceStationName"
          label="服务站简称"
          width="140"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="serviceStoreProperties"
          label="性质"
          width="80"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="belongingAdministrative"
          label="归属行政"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="warZoneResponsible"
          label="区域服务总监"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="warZoneResponsibleTel"
          label="手机"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="warZoneResponsibleEmail"
          label="邮箱"
          width="200"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="regionalServiceName"
          label="大区服务总监"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="serviceOperatingStatus"
          label="服务状态"
          width="160"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="dailyAssessmentCriteria"
          label="日常考核标准"
          width="140"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="dailyAssessmentBusinessScope"
          label="日常考核范围"
          width="140"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="serviceRewardAccountingQualifications"
          label="服务综合业绩奖励核算资格"
          width="140"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="serviceOperatingStatusMark"
          label="运营状态分类"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="serviceExceptionDescribe"
          label="异常简述"
          width="320"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="isAccept"
          label="是否验收"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="serviceStartTime"
          label="过渡开通时间"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="serviceTime"
          label="服务转正时间"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="serviceShopTime"
          label="服务暂停时间"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="serviceBackTime"
          label="服务退网时间"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="systemCloseTime"
          label="系统关闭时间"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="openingYear"
          label="开通年份"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="serviceStoreType"
          label="店面形象"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="serviceStoreLevel"
          label="级别"
          width="140"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="branchInstructions"
          label="网点说明"
          width="240"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          v-for="(item,index) in carList"
          :key="'carType'+index"
          :prop="item.prop"
          :label="item.name"
          width="120">
        </el-table-column>

        <el-table-column
          prop="permissionChangeDescription"
          label="权限变更说明"
          width="320"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <page :pageData="pageData" @change="change"></page>
    </div>
  </div>
</div>
</template>
<script>
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
import page from '@/components/list/page.vue';
import {ajaxServiceOutlets, ajaxServiceModelsName} from '../../api/serviceOperationTable/api.js';
import exportReportForm from '@/assets/js/export/export.js';
export default {
  mixins:[exportReportForm],
  name:"",
  components:{
    qwuiButton,
    qwuiInput,
    page,
  },
  props:{

  },
  vuex:{

  },
  data(){
    return {
      searchERP: '',
      tableData: [],
      carList: [],
      pageSize:10,
      pageData:{},
      page:1,
    }
  },
  computed:{

  },
  watch:{

  },
  methods:{
    getCarList() {
      const getList = ajaxServiceModelsName()
        .then(res=>{
          // console.log(res)
          if (res) {
            res.celebrityModelsPO.forEach((item,index) => {
              this.carList.push({
                prop: 'carType'+index,
                name: item
              })
            });
            // console.log(this.carList)
          }
          this.init()
        })
    },
    init() {
      this.tableData = []
      let params = {
        pageSize: this.pageSize || 10,
        page: this.page || 1
      }
      params['searchValue.erpSerNo'] = this.searchERP || ''
      ajaxServiceOutlets(params)
        .then(res=>{
          // console.log(res)
          if (res) {
            this.pageData = {
              page: res.currPage,
              pageSize: res.pageSize || this.pageSize,
              totalRows: res.totalRows,
              maxPage: res.maxPage
            };
            if (res.pageData) {
              let resData = res.pageData || []
              this.tableData = this.formatData(resData)
            }
            // console.log(this.tableData)
          }
        })
    },
    formatData(resData) {
      let temp = resData;
      temp.forEach(item => {
        let carTemp = item.serviceModelsName;
        carTemp.forEach((element,index) => {
          item['carType'+index] = element
        });
      });
      return temp
    },
    search() {
      console.log('搜索',this.searchERP)
      this.page = 1
      this.init()
    },
    handleSelectionChange(val) {
      console.log(val)
    },
    change(page,pageSize){
      this.pageSize = pageSize;
      this.page = page;
      console.log(this.page,this.pageSize)
      this.init()
    },
    // 导出
    exportReportForm(){
      if(this.pageData.totalRows>0){
        let searchParams = {}
        searchParams['searchValue.erpSerNo'] = this.searchERP || ''
        searchParams['reportType'] = 'operation_service_outlets';
        this._createReport(searchParams);
      } else{
        dataBase.top_alert('搜索结果为空，不支持导出',false,3000);
      }
    },
  },
  beforeCreate(){

  },
  created(){
    this.pageData = {
      page: this.page,
      pageSize: this.pageSize,
      totalRows: 0,
      maxPage: 1
    };
    this.getCarList()
    // this.init()
  },
  beforeMount(){

  },
  mounted(){

  }
}
</script>
<style lang="scss" scoped>
@mixin pt15{
  padding-top: 15px;
}
@mixin pt20{
  padding-top: 20px;
}


.service_operaion_table {
  min-width: 960px;
  padding: 30px 20px 0;
  .qwui-dotted_line{
    border-right:1px dashed #cfcfcf;
    margin: 0 8px 0 5px;
  }
  .qwui-list_wrap{
    position: relative;
    /*@include pt15;*/
    height: 100%;
    box-sizing: border-box;

    .qwui-top_main_bar{
      display: flex;
      justify-content: space-between;
      // padding-bottom: 20px;
      // @include pt20;

      .qwui-bar_left{
        flex:1;
      }

      .qwui-bar_right{
        .qwui-senior_search_btn{
          cursor: pointer;
          float: right;
          font-size: 12px;
          height: 35px;
          line-height: 16px;
          margin: 0 5px;
          padding: 0 3px;
          text-align: center;
          width: 30px;
          color:#f87b00;
          &:hover{
            text-decoration:underline;
          }
        }
      }
    }
  }
}

.qwui-table_wrap /deep/{
  @include pt15;
  .el-table {
    &--border {
      border: 1px solid #ddd;
      border-bottom: none;
    }
    .el-table__header thead th{
      background-color: #EEE;
      color: #333;
      text-align: center;
      border-right: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
    }
  }
}
</style>
<style lang="css">
.el-tooltip__popper {
  max-width: 400px;
  line-height: 180%;
}
</style>

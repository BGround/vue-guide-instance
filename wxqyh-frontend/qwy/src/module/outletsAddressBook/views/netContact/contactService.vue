<template>
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
          :data="dataList"
          @selection-change="handleSelectionChange"
          style="width: 100%">

          <el-table-column
            type="selection"
            width="45">
          </el-table-column>
          <el-table-column
            prop="regional"
            label="区域"
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
            width="75"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="erpSerNo"
            label="服务号"
            width="75"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="serviceStoreProperties"
            label="类型"
            width="75"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="serviceStationName"
            label="服务站简称"
            width="120"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="serviceStationFullName"
            label="服务站全称"
            width="220"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="openingTime"
            label="开网时间"
            width="120"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="serviceBackTime"
            label="退网时间"
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
            prop="serviceOperatingStatusMark"
            label="服务业务状态分类"
            width="135"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="serviceOperatingStatus"
            label="运营状态分类"
            width="160"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="serviceExceptionDescribe"
            label="异常情况简述"
            width="200"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="legalRepresentative"
            label="法人代表"
            width="120"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="email"
            label="电子邮件"
            width="140"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="fax"
            label="传真"
            width="140"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="stationName"
            label="站长姓名"
            width="120"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="stationPhone"
            label="联系方式"
            width="120"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="serviceBusinessTel"
            label="服务业务电话"
            width="120"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="serviceStationPhone"
            label="24小时电话"
            width="120"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="serviceStationAddress"
            label="服务站地址"
            width="300"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="regionalServiceDirector"
            label="区域服务总监"
            width="120"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="regionalServiceDirectorPhone"
            label="联系方式"
            width="140"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="regionalServiceName"
            label="大区服务总监"
            width="120"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="regionalServicePhone"
            label="联系方式"
            width="140"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <page :pageData="pageData" @change="change"></page>
      </div>
    </div>
</template>
<script>
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
import page from '@/components/list/page.vue';
import {ajaxBranchesSearch} from '../../api/netContact/api.js';
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
      pageSize:10,
      pageData:{},
      page:1,
      dataList:[],
    }
  },
  computed:{

  },
  watch:{

  },
  methods:{
    init() {
      this.dataList = []

      let params = {
        pageSize: this.pageSize || 10,
        page: this.page || 1,
        doType: '售后'
      }
      params['searchValue.erpSerNo'] = this.searchERP || ''
      ajaxBranchesSearch(params)
        .then(res=>{
          // console.log(res)
          if (res) {
            this.pageData = {
              page: res.currPage,
              pageSize: res.pageSize || this.pageSize,
              totalRows: res.totalRows,
              maxPage: res.maxPage
            }
            if (res.pageData) {
              this.dataList = res.pageData
            }
          }   
        })
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
      this.init();
    },
    // 导出
    exportReportForm(){
      if(this.pageData.totalRows>0){
        let searchParams = {}
        searchParams['searchValue.type'] = "售后";
        searchParams['searchValue.erpSerNo'] = this.searchERP || ''
        searchParams['reportType'] = 'service_outlet_export';
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
    }
    this.init()
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
.qwui-dotted_line{
  border-right:1px dashed #cfcfcf;
  margin: 0 8px 0 5px;
}
.qwui-list_wrap{
  position: relative;
  padding: 15px 0 0 0;
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

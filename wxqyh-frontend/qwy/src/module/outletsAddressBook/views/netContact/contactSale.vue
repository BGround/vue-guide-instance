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
        :data="tableData"
        @selection-change="handleSelectionChange"
        style="width: 100%">

        <el-table-column
          type="selection"
          width="40">
        </el-table-column>

        <el-table-column label="基础信息">
          <el-table-column
            prop="regional"
            label="大区"
            width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="provinceName"
            label="省份"
            width="90"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="cityName"
            label="城市"
            width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="areaName"
            label="区县"
            width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="nature"
            label="性质"
            width="80"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="erpCarNo"
            label="整车ERP"
            width="80"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="dealerFullName"
            label="经销商名称"
            width="240"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="dealerShortName"
            label="经销商简称"
            width="140"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="belongGroup"
            label="集团归属"
            width="150"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="openingTime"
            label="开通时间"
            width="120"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>

        <el-table-column
          prop="operatingStateName"
          label="状态"
          width="80"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column label="售前信息">
          <el-table-column label="董事长">
            <el-table-column
              prop="chairmanName"
              label="姓名"
              width="100"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="chairmanPhone"
              label="电话"
              width="120"
              show-overflow-tooltip>
            </el-table-column>
          </el-table-column>
          <el-table-column label="集团副总">
            <el-table-column
              prop="vicePresidentName"
              label="姓名"
              width="100"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="vicePresidentTelephone"
              label="电话"
              width="120"
              show-overflow-tooltip>
            </el-table-column>
          </el-table-column>
          <el-table-column label="总经理">
            <el-table-column
              prop="generalManager"
              label="姓名"
              width="100"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="generalManagerPhone"
              label="电话"
              width="120"
              show-overflow-tooltip>
            </el-table-column>
          </el-table-column>
          <el-table-column label="销售总监">
            <el-table-column
              prop="directorSalesName"
              label="姓名"
              width="100"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="directorSalesPhone"
              label="电话"
              width="120"
              show-overflow-tooltip>
            </el-table-column>
          </el-table-column>
          <el-table-column label="市场总监">
            <el-table-column
              prop="marketingDirectorNames"
              label="姓名"
              width="100"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="marketingDirectorPhone"
              label="电话"
              width="120"
              show-overflow-tooltip>
            </el-table-column>
          </el-table-column>
          <el-table-column label="信息员">
            <el-table-column
              prop="researcherName"
              label="姓名"
              width="100"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="researcherPhone"
              label="电话"
              width="120"
              show-overflow-tooltip>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="salesStoreAddress"
            label="销售地址"
            width="320"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="salesPhone"
            label="销售热线"
            width="140"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="postalCode"
            label="邮政编码"
            width="80"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="salesEmail"
            label="销售E-MAIL"
            width="200"
            show-overflow-tooltip>
          </el-table-column>
        </el-table-column>

        <el-table-column
          prop="productOrder"
          label="产品序列"
          width="120"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column label="奇瑞产品">
          <el-table-column
            v-for="(item,index) in qiruiList"
            :key="'qirui'+index"
            :prop="item.prop"
            :label="item.name"
            width="120">
          </el-table-column>
        </el-table-column>

        <el-table-column label="星途产品">
          <el-table-column
            v-for="(item,index) in xingtuList"
            :key="'xingtu'+index"
            :prop="item.prop"
            :label="item.name"
            width="120">
          </el-table-column>
        </el-table-column>

        <el-table-column
          prop="storeProperties"
          label="性质"
          width="80"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          prop="storeLevel"
          label="店面级别"
          width="140"
          show-overflow-tooltip>
        </el-table-column>
        <!-- ???? -->
        <el-table-column
          prop="storeProperties"
          label="店面类型"
          width="100"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          prop="storeType"
          label="三代店/非三代店"
          width="140"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          prop="beforeStoreLevel"
          label="店面变更信息"
          width="320"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column label="区域负责人">
          <el-table-column
            prop="regionalManagerName"
            label="大区总经理"
            width="120"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="regionalManagerTelephone"
            label="电话"
            width="120"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="marketingDirectorName"
            label="市场总监"
            width="120"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="marketingDirectorTelephone"
            label="电话"
            width="120"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="salesDirectorName"
            label="区域销售总监"
            width="120"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="salesDirectorTelephone"
            label="电话"
            width="120"
            show-overflow-tooltip>
          </el-table-column>
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
import {
  ajaxBranchesSearch,
  ajaxModelsOnSaleByName,
  ajaxCelebrityModelsByName,
} from '../../api/netContact/api.js';
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
      qiruiList: [],
      xingtuList: [],
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
      const getListqirui = ajaxModelsOnSaleByName()
        .then(res=>{
          // console.log(res)
          if (res) {
            res.modelsOnSaleByName.forEach((item,index) => {
              this.qiruiList.push({
                prop: 'qirui'+index,
                name: item
              })
            });
            // console.log(this.qiruiList)
          }
        })
      const getListxingtu = ajaxCelebrityModelsByName()
        .then(res=>{
          // console.log(res)
          if (res) {
            res.celebrityModelsPO.forEach((item,index) => {
              this.xingtuList.push({
                prop: 'xingtu'+index,
                name: item
              })
            });
            // console.log(this.xingtuList)
          }
        })

      Promise.all([getListqirui,getListxingtu]).then(res=>{
        // console.log(res)
        // console.log('qirui',this.qiruiList)
        // console.log('xingtu',this.xingtuList)
        this.init()
      })
    },
    init() {
      this.tableData = []
      let params = {
        pageSize: this.pageSize || 10,
        page: this.page || 1,
        doType: '售前'
      }
      params['searchValue.erpCarNo'] = this.searchERP || ''
      ajaxBranchesSearch(params)
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
            // console.log('tableData',this.tableData)
          }
        })
    },
    formatData(resData) {
      let temp = resData;
      temp.forEach(item => {
        let qiruiTemp = item.carsSale;
        let xingtuTemp = item.celebrityModels;
        qiruiTemp.forEach((element1,index1) => {
          item['qirui'+index1] = element1
        });
        xingtuTemp.forEach((element2,index2) => {
          item['xingtu'+index2] = element2
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
      this.init();
    },
    // 导出
    exportReportForm(){
      if(this.pageData.totalRows>0){
        let searchParams = {}
        searchParams['searchValue.type'] = "售前";
        searchParams['searchValue.erpCarNo'] = this.searchERP || ''
        searchParams['reportType'] = 'outlets_address_book';
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

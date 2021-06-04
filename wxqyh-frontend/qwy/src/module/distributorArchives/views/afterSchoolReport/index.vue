<template>
  <div class="afterSchoolReportWrap">
    <el-row>
      <el-col :span="16">
        <div class="searchWrap searchBorder">
          <div class="oitem area">
            <span>区域</span>
            <el-select v-model="selectedRegionId"
                       @change="handleSelectRegion"
                       clearable
                       popper-class="select-region"
                       placeholder="请选择">
              <el-option v-for="(item, index) in regionOptions"
                         :key="index"
                         :label="item.name"
                         :value="item.id+'_'+item.name">
              </el-option>
            </el-select>

            <el-select v-model="selectedProvinceId"
                       @change="handleSelectProvince"
                       clearable
                       popper-class="select-region"
                       placeholder="请选择">
              <el-option v-for="(item, index) in provinceOptions"
                         :key="index"
                         :label="item.name"
                         :value="item.id+'_'+item.name">
              </el-option>
            </el-select>

            <el-select v-model="selectedCityId"
                       @change="handleSelectCity"
                       clearable
                       popper-class="select-region"
                       placeholder="请选择">
              <el-option v-for="(item, index) in cityOptions"
                         :key="index"
                         :label="item.name"
                         :value="item.id+'_'+item.name">
              </el-option>
            </el-select>
          </div>

          <div class="oitem statusItem">
            <span class="label">查阅状态 </span>
            <el-select v-model="status" placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="oitem dateItem">
            <span>年份 </span>
            <el-date-picker
              v-model="dateVal"
              type="year"
              @change="dateChangeFun"
              placeholder="选择年">
            </el-date-picker>
          </div>
          <div class="oitem dateItem">
            <span>季度 </span>
            <el-select v-model="quarter" clearable placeholder="请选择">
              <el-option
                v-for="item in quarterOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>

          <div class="oitem keyword">
            <span>关键字</span>
            <el-input placeholder="ERP号，经销商简称"
                      v-model="keyword"
                      clearable>
            </el-input>
          </div>

          <div class="oitem">
            <el-button @click="searchFun" type="danger">查询</el-button>
<!--            <el-button @click="exportReportForm">导出</el-button>-->
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="searchWrap searchRight">
          <div class="oitem">
            <el-button v-perm="'saleReportButton'" @click="goSchoolManage">成绩单管理</el-button>
          </div>
          <div class="oitem">
            <el-button v-perm="'saleSendButton'" @click="sendOutFun('mulit','')">发送</el-button>
          </div>
          <div class="oitem">
            <el-button v-perm="'saleRemindersButton'" @click="remindFun('mulit','')">提醒查阅</el-button>
          </div>
          <div class="oitem">
            <el-button v-perm="'saleRegionalButton'" @click="goLeaderManagement">大区负责人管理</el-button>
          </div>

          <div class="oitem">
            <el-button v-perm="'salePlanExportButton'" @click="exportSchedule('mulit','')">整改计划表导出</el-button>
          </div>

        </div>
      </el-col>
    </el-row>

<!--    table start -->
    <el-table
      :data="reportData"
      ref="multipleTable"
      border
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        fixed
        type="selection"
        width="40">
      </el-table-column>
      <el-table-column
        prop="year"
        label="年度"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="quarter"
        label="季度"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="serviceErp"
        label="服务ERP"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="region"
        label="区域"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column
        label="服务站名称"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.detailStatus==='1'" @click="goDetailFun(scope.row.id)" type="text" size="small">{{scope.row.serviceFullName}}</el-button>
          <p v-else>{{scope.row.serviceFullName}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="property"
        label="性质"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
          prop="lookOverStatus"
          label="查阅状态"
          align="center"
          width="100">
        <template slot-scope="scope">
            {{mapLookOverStatus(scope.row.lookOverStatus)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="intoPlatformCount"
        label="进站台次"
        width="80">
      </el-table-column>
      <el-table-column
        prop="operatingAward"
        label="运营奖励"
        width="80">
      </el-table-column>
      <el-table-column
        prop="awardMoney"
        label="运营系数1.0奖励金额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="evaluateAward"
        label="运营奖励评价"
        width="120">
      </el-table-column> <el-table-column
      prop="serviceStatus"
      label="服务状态"
      width="80">
    </el-table-column>
      <el-table-column
        prop="guaranteePermission"
        label="保修开通权限"
        align="center"
        width="110">
      </el-table-column>
      <el-table-column
        prop="operateFactor"
        label="运营系数"
        align="center"
        width="80">
      </el-table-column> <el-table-column
      prop="partFactor"
      label="备件系数"
      align="center"
      width="80">
    </el-table-column>
      <el-table-column
        prop="boutiqueFactor"
        label="精品系数"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="synthesisFactor"
        label="综合系数"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="mark"
        label="备注"
        align="center"
        width="120">
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="120">
        <template slot-scope="scope">
          <el-button @click="sendOutFun('single',scope.row.id)" :disabled="!(scope.row.lookOverStatus==='0' && scope.row.detailStatus==='1')" type="text" size="small">发送</el-button>
<!--          <el-button @click="remindFun('single',scope.row.id)" type="text" :disabled="!(scope.row.detailStatus==='1' && scope.row.lookOverStatus!=='3' && scope.row.lookOverStatus!=='0')" size="small">提醒查阅</el-button>-->
          <el-button @click="remindFun('single',scope.row.id)" type="text" :disabled="!(scope.row.detailStatus==='1' && scope.row.lookOverStatus!=='3') || scope.row.lookOverStatus==='0'" size="small">提醒查阅</el-button>
        </template>
      </el-table-column>
    </el-table>
<!--    table end -->

    <div class="pageWrap">
      <page :pageData='pageSetting'
        @change='pageChange'></page>
    </div>
  </div>
</template>

<script>
import page from '@/components/list/page'
import exportReportForm from '@/assets/js/export/schoolReportexport.js';
import {
    ajaxSearchDepatmentList,
    ajaxGetSalesAfetrReportList,
    ajaxSalesAfetrPushMessage,
    ajaxSalesAfetrPushNotesMessage,
    ajaxPushNotesMessage
} from '@/module/distributorArchives/api/getData'
export default {
  name: 'afterSchoolReport',
  mixins:[exportReportForm],
  data() {
    return {
      selectedRegionId: '',
      selectedCityId: '',
      selectedProvinceId: '',
      regionOptions: [],
      provinceOptions: [],
      cityOptions: [],
      pageSetting: { page: 1, pageSize: 10, maxPage: 5, totalRows: 10 },
      status:'',
      statusOptions:[{
          value: '',
          label: '全部状态'
      },{
          value: '0',
          label: '未发送'
      }, {
          value: '2',
          label: '未读'
      }, {
          value: '1',
          label: '已读'
      }, {
          value: '3',
          label: '已反馈'
      },{
          value: '5',
          label: '已完成'
      }],
      quarterOptions:[{name:'第一季度',id:1},{name:'第二季度',id:2},{name:'第三季度',id:3},{name:'第四季度',id:4},],
      dateVal:[],
      reportData:[],
      keyword:'',
      year:'',
      quarter:'',
      multipleSelection: [],
      isSending:false, // 是否发送中
      isReminding: false, // 是否提醒中
      checkList:[],
      exportParams:{},
      baseURL:_.baseURL
    }
  },
  created(){
    this.init()
  },
    computed:{
      isCheckedAll(){
          return this.reportData.length == this.checkList.length
      }
    },
  methods: {
      mapLookOverStatus(statusValue){
           const option = this.statusOptions.find((item)=>item.value===statusValue);
           return option && option.label ? option.label: '-';
      },
    init(){
        this.getRegionOptions()
        this.getSalesAfetrReportList()
    },
    // 获取成绩单
    getSalesAfetrReportList(){
        let areaName = this.selectedRegionId?this.selectedRegionId.split('_')[1]:''
        let provinceName = this.selectedProvinceId?this.selectedProvinceId.split('_')[1]:''
        let cityName = this.selectedCityId?this.selectedCityId.split('_')[1]:''

        let params = {
            'page': this.pageSetting.page,
            'pageSize': this.pageSetting.pageSize,
            'reportOrder':1,
            'searchValue.lookover': this.status,
            'searchValue.keyword': this.keyword, // 关键字
            'searchValue.region':areaName, // 战区名
            'searchValue.province':provinceName, // 盛名
            'searchValue.city':cityName, // 市名
            'searchValue.year':this.year,
            'searchValue.quarter':this.quarter
        }
        ajaxGetSalesAfetrReportList(params,data => {
              this.reportData = data.pageData || []
              this.pageSetting.maxPage = data.maxPage
              this.pageSetting.totalRows = data.totalRows
        })
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
        if(val && val.length>0) {
            let temp = []
            val.map(item => {
              temp.push(item.id)
            })
            this.checkList = temp
        } else {
            this.checkList = []
        }

    },
    // 跳转详情
    goDetailFun(data){
        this.$router.push({name:'afterSchoolReportDes',query:{id:data}})
    },
    // 跳转到成绩单管理
    goSchoolManage(){
        let baseURL = this.baseURL;
        window.location.href = `${baseURL}/xentmanager/salesreport/aftersale/main.jsp`;
    },


    goLeaderManagement(){
        this.$router.push({name:'leaderManagement'})
    },
    // 查询
    searchFun(){
      this.getSalesAfetrReportList()
    },
    // 导出
    exportReportForm(){
        if(this.exportDaysLimitByMonthCounts()){
            if(this.pageSetting.totalRows>0){
                this.updateExportParams();
                this._createReport(this.exportParams);
            } else{
                dataBase.top_alert('搜索结果为空，不支持导出',false,3000);
            }
        }
    },
    updateExportParams(){
        let areaName = this.selectedRegionId?this.selectedRegionId.split('_')[1]:''
        let provinceName = this.selectedProvinceId?this.selectedProvinceId.split('_')[1]:''
        let cityName = this.selectedCityId?this.selectedCityId.split('_')[1]:''
        this.exportParams = {
            'reportOrder':1,
            'searchValue.lookover': this.status,
            'searchValue.keyword': this.keyword, // 关键字
            'searchValue.region':areaName, // 战区名
            'searchValue.province':provinceName, // 盛名
            'searchValue.city':cityName, // 市名
            'searchValue.year':this.year,
            'searchValue.quarter':this.quarter,
            'reportType':'salesAfterReport',
        }
    },
    // 发送
    sendOutFun(param,pdata){
        let ids = []
        if(param === 'mulit') {
            if(this.checkList.length===0){
                this.$message('请选择要发送的数据')
                return false
            }
            ids = this.checkList
        } else {
            ids = [pdata]
        }
        this.isSending = true

        let params = {
            ids:ids
        }
        ajaxSalesAfetrPushMessage(params,data => {
            if(data){
                this.$message({
                    message: '发送成功',
                    type: 'success'
                });
                this.getSalesAfetrReportList()
            }
            this.isSending = false
        })
    },
    // 提醒
    remindFun(param,pdata){
        let ids = []
        if(param==='mulit') {
            if(this.checkList.length===0){
                this.$message('请选择要提醒查阅的数据')
                return false
            }
            ids = this.checkList
        } else {
            ids = [pdata]
        }

        this.isReminding = true

        let params = {
            ids:ids
        }
        ajaxSalesAfetrPushNotesMessage(params,data => {
            if(data){
                this.$message({
                    message: '已成功提醒查阅',
                    type: 'success'
                });
                this.getSalesAfetrReportList()
            }
            this.isReminding = false
        })
    },
    // 年份
    dateChangeFun(val){
        if(val) {
            let dateVal = new Date(val)
            this.year = dateVal.getFullYear()
        } else {
            this.year = ''
        }
    },
    /**
     * 请求战区
     */
    getRegionOptions() {
        ajaxSearchDepatmentList().then((data)=>{
            if(data){
                this.regionOptions = data.departmentList || []
            }
        })
    },
    getProvinceOptions() {
        let rid = this.selectedRegionId.split('_')[0]
        ajaxSearchDepatmentList({ id: rid }).then((data)=>{
            if(data){
                this.provinceOptions = data.departmentList || []
            }
        })
    },
    getCityOptions() {
        let pid = this.selectedProvinceId.split('_')[0]
        return ajaxSearchDepatmentList({ id: pid }).then((data)=>{
            if(data){
                this.cityOptions = data.departmentList || []
            }
        })
    },

     // 查找城市名
    findDistrictNameById(options, id){
        const option = options.find(item=>item.id===id);
        return option && option.name || '';
    },
    // 战区变化
    handleSelectRegion(val) {
        this.provinceOptions = []
        this.cityOptions = []
        this.selectedProvinceId = ''
        this.selectedCityId = ''
        if(val){
            this.getProvinceOptions()
        }
    },
    // 省变化
    handleSelectProvince(val) {
        this.cityOptions = []
        this.selectedCityId = ''
        if(val){
            this.getCityOptions()
            const provinceName = this.findDistrictNameById(this.provinceOptions,val);
        }
    },
    // 市变化
    handleSelectCity(val) {
        const cityName = this.findDistrictNameById(this.cityOptions,val);
    },
    // 分页
    pageChange() {
        this.getSalesAfetrReportList()
    },


    assemblyParams(param, pdata){
        let areaName = this.selectedRegionId?this.selectedRegionId.split('_')[1]:''
        let provinceName = this.selectedProvinceId?this.selectedProvinceId.split('_')[1]:''
        let cityName = this.selectedCityId?this.selectedCityId.split('_')[1]:''
        const baseParams = {
            // 'reportOrder':1,
            'searchValue.lookover': this.status,
            'searchValue.keyword': this.keyword, // 关键字
            'searchValue.region':areaName, // 战区名
            'searchValue.province':provinceName, // 盛名
            'searchValue.city':cityName, // 市名
            'searchValue.year':this.year,
            'searchValue.quarter':this.quarter,
        }

        // isAll：1，全选，0：非全选

        if(this.isCheckedAll){
            return Object.assign({}, baseParams, {
                'searchValue.isAll': 1,
                // ids: '',
                'reportType':'SALES_SERVICE_PLAN',
            })
        }else{
            let ids = ''
            const isMultiple = param === 'mulit'
            if(isMultiple) {
                ids = this.checkList.join(',')
            } else {
                ids = pdata
            }
            return {
                'searchValue.isAll': 0,
                'searchValue.ids': ids,
                'reportType':'SALES_SERVICE_PLAN',
            }
        }
    },

    exportSchedule(param, pdata){

        const isMultiple = param === 'mulit'
        if(this.checkList.length===0 && isMultiple){
            this.$message('请选择要导出的数据')
            return false
        }
        // 全选
        const params = this.assemblyParams(param, pdata)
        this._createReport(params);

        // let ids = []
        // if(param === 'mulit') {
        //     if(this.checkList.length===0){
        //         this.$message('请选择要发送的数据')
        //         return false
        //     }
        //     ids = this.checkList
        // } else {
        //     ids = [pdata]
        // }
        // this.isSending = true
        //
        // const form = {
        //     'searchValue.ids': ids.join(','),
        //     'reportType': 'SALES_SERVICE_PLAN', //导出成绩单明细
        // }
        // this._createReport(form);
    },
  },
  components: {
    page
  }
}
</script>

<style lang="less">
@import url('./css/index.less');
</style>

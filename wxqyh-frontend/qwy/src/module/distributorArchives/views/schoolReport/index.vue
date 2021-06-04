<template>
  <div class="schoolReportWrap">
    <el-row>
      <el-col :span="15">
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
            <span>年月</span>
            <el-date-picker
              v-model="dateVal"
              type="month"
              @change="dateChangeFun"
              placeholder="选择年月">
            </el-date-picker>
          </div>

          <div class="oitem keyword">
            <span>关键字</span>
            <el-input placeholder="ERP号，经销商简称"
                      v-model="keyword"
                      clearable>
            </el-input>
          </div>

          <div class="oitem nature">
            <span>性质</span>
            <el-input placeholder=""
                      v-model="types">
            </el-input>
          </div>

          <div class="oitem status">
            <span>店面性质</span>
            <el-input placeholder=""
                      v-model="properties">
            </el-input>
          </div>

          <div class="oitem status">
            <span>运营状态</span>
            <el-input placeholder=""
                      v-model="operatings">
            </el-input>
          </div>

          <div class="oitem sendtime">
            <span class="sendLabel">发送时间</span>
            <el-date-picker
              v-model="sendingTime"
              @change="sendTimeChange"
              type="date"
              placeholder="发送日期">
            </el-date-picker>
          </div>

          <div class="oitem sendtime">
            <span class="sendLabel">生成时间</span>
            <el-date-picker
              v-model="createTime"
              @change="createTimeChange"
              type="date"
              placeholder="生成日期">
            </el-date-picker>
          </div>

          <div class="oitem">
            <el-button @click="handleClickSearchbtn" type="danger">查询</el-button>
            <el-dropdown trigger="click" placement="bottom-start" @command="handleExportCommand" style="margin-left:10px;">
              <el-button class="el-dropdown-link">
                导出<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  command="reportCardDetail" icon="el-icon-document">导出成绩单明细</el-dropdown-item>
                <el-dropdown-item  command="dealerFeedback" icon="el-icon-paperclip">导出经销商反馈</el-dropdown-item>
                <el-dropdown-item  command="photo" icon="el-icon-picture-outline">导出照片</el-dropdown-item>
                <el-dropdown-item  command="readPerson" icon="el-icon-document">导出已读人员</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-button  @click="isImportPopShow=true" style="margin-left:10px;">导入</el-button> -->
          </div>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="searchWrap">
          <div class="oitem statusItem">
            <span class="label">生成年份 </span>
            <el-date-picker
              v-model="createYearVal"
              type="year"
              @change="yearChangeFun"
              placeholder="生成年份">
            </el-date-picker>
          </div>

          <div class="oitem statusItem">
            <span class="label">生成月份 </span>
            <el-select v-model="createMonth"
                       clearable
                       popper-class="select-region"
                       placeholder="生成月份">
              <el-option v-for="(item, index) in monthOptions"
                         :key="index"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </div>

          <div class="oitem" v-perm="'salesreportCreate'">
            <el-button :disabled="isCreating" @click="createFun">{{createTxt}}</el-button>
          </div>
          <div class="oitem" v-perm="'salesreportPushMsg'">
            <el-button :disabled="isSending" @click="sendOutFun('mulit','')">发送</el-button>
          </div>
          <div class="oitem" v-perm="'salesreportRemind'">
            <el-button :disabled="isReminding" @click="remindFun('mulit','')">提醒查阅</el-button>
          </div>
          <div class="oitem" v-perm="'salesreportBatchDel'">
            <el-button :disabled="isDeleting" @click="delFun('mulit','')">批量删除</el-button>
          </div>
          <div class="oitem" v-perm="'salesreportApproval'">
            <el-badge :value="approvalCount" class="item">
              <el-button size="middle" @click="feedApprHandle">反馈审批</el-button>
            </el-badge>
          </div>
          <div class="oitem" v-perm="'salesreportBrandMgr'">
            <el-button size="middle" @click="handleClickCompetingManagement">竞品管理</el-button>
          </div>
          <div class="oitem" v-perm="'salesreportAdmin'">
            <el-button @click="goLeaderManagement">大区负责人管理</el-button>
          </div>
          <div class="oitem" v-perm="'salesreportLeaders'">
            <el-button @click="gosendMsgToLeaders">通知领导</el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <table>
      <tr>
        <th class="checkbox">
          <input
            type="checkbox"
            v-model="checkedAll"
            @change="allSelect">
        </th>
        <th>战区</th>
        <th>省份</th>
        <th>城市</th>
        <th>ERP号</th>
        <th>经销商简称</th>
        <th>性质</th>
        <th>店面性质</th>
        <th>运营状态</th>
        <th>年份</th>
        <th>月份</th>
        <th>查阅状态</th>
        <th>生成时间</th>
        <th>操作</th>
      </tr>
      <tr v-for="(item,index) in reportData"
          :key="index">
        <td class="checkbox">
          <input
            type="checkbox"
            v-model="reportData[index].isChecked"
            @change="singleSelect(item.id)">
        </td>
        <td>{{item.area}}</td>
        <td>{{item.province}}</td>
        <td>{{item.city}}</td>
        <td>{{item.erp}}</td>
        <td><el-button @click="goDetailFun(item.id)" type="text">{{item.dealerShortName}}</el-button></td>
        <td>{{item.nature}}</td>
        <!-- 店面性质（销售） -->
        <td>{{item.storeProperties}}</td>
        <td>{{item.dealerStatusDesc}}</td>
        <td>{{item.year}}年</td>
        <td>{{item.month}}月</td>
        <!-- <td :class="getReadStatusClass(item)">{{item.readStatusDesc || '-'}}</td> -->
        <td :class="getReadStatusClass(item)"><el-button :disabled="item.readStatusDesc!=='已读'&&item.readStatusDesc!=='已反馈'" @click="handleShowReadPerson(item.id)" type="text">{{item.readStatusDesc || '-'}}</el-button></td>
        <td>{{item.createTime}}</td>
        <td><el-button :disabled="item.readStatus!=='1'" @click="sendOutFun('single',item.id)" type="text">发送</el-button>
          <el-button :disabled="item.readStatus==='1' || item.readStatus==='4'" @click="remindFun('single',item.id)" type="text">提醒查阅</el-button>
          <el-button :disabled="item.readStatus!=='1'" @click="delFun('single',item.id)" type="text">删除</el-button>
        </td>
      </tr>
      <tr v-if="reportData && reportData.length===0"><td colspan="13">暂无数据</td></tr>
    </table>

    <div class="pageWrap">
      <page :pageData='pageSetting'
        @change='pageChange'></page>
    </div>
    <div class="mask" v-show="isShowReadPerson">
      <read-person :readId="readId" @clickBack="handleHideReadPerson"></read-person>
    </div>
  </div>
</template>

<script>
import page from '@/components/list/page';
import saleReportTable from "./components/saleReportTable";
import readPerson from "./components/readPerson"
import exportReportForm from '@/assets/js/export/schoolReportexport.js';
import {
    ajaxSearchDepatmentList, ajaxGetSalesreportList, ajaxCreateSalesreport, ajaxPushNotesMessage, ajaxPushMessage, ajaxDelSalesreport,searchFeedBackList,
    // batchImportExles, //表单提交
    // viewImportProcess, //表单提交结果
    checkDealerDownLoadZip, //导出照片
    sendMsgToLeaders, //通知领导
} from '@/module/distributorArchives/api/getData'
import store from "module/distributorArchives/store";
export default {
  name: 'schoolReportIndex',
  mixins:[exportReportForm],
  data() {
    return {
      file:'',//上传的文件数据
      gengxChecked: false, //是否需要更新现有数据
      isShowProcess: false, //是否显示提交结果
      processResult:{ //提交结果
        processNum: '',
        totalNum: '',
        ifFinish: false,
        errorlist: [],
      },
      errorId: '', //错误id
      isShowReadPerson: false, // 是否展示已读人员情况
      readId: '',
      isShowErrorId: false, //是否展示错误id
      isImportPopShow: false, //是否展示导入弹框
      isImportPopInnershow: false,
      selectedRegionId: '',
      selectedCityId: '',
      selectedProvinceId: '',
      regionOptions: [],
      provinceOptions: [],
      cityOptions: [],
      pageSetting: { page: 1, pageSize: 10, maxPage: 0, totalRows: 0 },
      status:'',
      statusOptions:[
        {
            value: '',
            label: '全部状态'
        },{
            value: '1',
            label: '未发送'
        }, {
            value: '2',
            label: '未读'
        }, {
            value: '3',
            label: '已读'
        }, {
            value: '4',
            label: '已反馈'
        }
      ],
      dateVal:[],
      reportData:[],
      keyword:'',
      year:'',
      month:'',
      isCreating: false,
      createTxt:'生成',
      createYearVal:'',
      createYear:'', // 生成年份
      createMonth:'', // 生成月份
      monthOptions:[{name:'1月',id:'01'},{name:'2月',id:'02'},{name:'3月',id:'03'},{name:'4月',id:'04'},{name:'5月',id:'05'},{name:'6月',id:'06'},{name:'7月',id:'07'},{name:'8月',id:'08'},{name:'9月',id:'09'},{name:'10月',id:'10'},{name:'11月',id:'11'},{name:'12月',id:'12'},],
      checkedAll: false,
      checkList:[],
      isSending: false,
      isReminding: false,
      isDeleting: false,
      exportParams:{},
      types: '', // 性质
      properties: '', //店面性质（销售） 
      operatings: '', // 运营状态
      sendingTime: '',
      sendTimeVal:'',
      createTime:'',
      createTimeVal:'',
      approvalCount:'', //待审批条数
      iframeHeight:'',
      importantPopMsg:'',
      currentClickTime: 0,
      checkedAllLength: 0, //全选数据条数
    }
  },
  created(){
    this.currentClickTime = new Date().getTime()
    //
  },
  activated(){
    this.init();
  },
  methods: {

      getReadStatusClass(item){
          //sonStatus：1：子账户已读，0：子账户未读
         if( item.readStatusDesc === '已反馈' ){
             return String(item.sonStatus) === '1'? {haveRead: true}: {unread: true}
         }
         return {}
      },
    goLeaderManagement(){
        this.$router.push({name:'leaderManagementSale'})
    },
    getFile(event) {
      this.file = event.target.files[0];
    },
    feedApprHandle(){
      this.$router.push('/archivesList/feedbackApproval')
    },
    doImport(){
      var upFileVal = document.getElementById('upFile').value
      // 如果没有选择上传文件，弹出提示
      if(upFileVal == ""){
        this.importantPopMsg = '请选择要上传的文件'
        this.isImportPopInnershow = true
        return ;
      }
      // 如果选择上传文件的格式不是xls，弹出提示
      if(upFileVal.indexOf('.xls') == -1){
        this.importantPopMsg = '请选择正确格式的文件'
        this.isImportPopInnershow = true
        document.getElementById('upFile').value = ""
        return ;
      }

      // 是否更新现有数据：hidden的value为1 更新，为0 不更新
      this.isShowProcess =  false

      let formData = new FormData();
      formData.append('upFile', this.file);
      formData.append('type', this.gengxChecked ? 1:0);
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      batchImportExles(formData,config).then(data => {
        document.getElementById('upFile').value = ""
        this.gengxChecked = false
        this.file = ''
        this.$message({
            message: '导入成功',
            type: 'success'
        });
        var id =  data.id
        this.showProcess(id);
        // viewprocess = setInterval(function(){

        // },3000);
      })

        // showLoading("正在导入.....");
      //   $('#id_form_save').ajaxSubmit({
      //     dataType: 'json',
      //     success: function (result) {
      //       if(result.code=="0"){
      //         //alert("文件上传成功,正在后台执行导入...");
      //         document.getElementById("id_form_save").reset();
      //         id=result.data.id;
      //         errorId=result.data.id;
      //         // viewprocess = setInterval(function(){
      //         //     showProcess();
      //         // },3000);
      //       }else{
      //         // hideLoading();
      //         _alert("",result.desc);
      //       }
      //     },
      //     error: function () {
      //       // hideLoading();
      //       _alert("","导入商机过程中发生错误");
      //     }
      // });
      return
    },
    showProcess(id){
      let params =  {
        id:id
      }
      viewImportProcess(params).then(data => {
        this.isShowProcess = true
        if(data){
          this.processResult = data
        }
        if(this.isFinish){
          if(totalNum!="0"){
              if(errorlist == null || errorlist =="" || errorlist.length==0){
                document.getElementById('errorlist').html("<br/>导入成功！");
                document.getElementById('errorId').hide();
              }else{
                document.getElementById('errorlist').html("<br/> 导入失败条数："+errorlist.length+"<br />");
                document.getElementById('errorId').show();
              }
          }
        }
      })
      return
        // $.ajax({
        //     url : "/wxqyh/mgr/fileUploadMgr/fileUploadMgrAction!viewImportProcess.action?reportType=PLAN_PLANCITY_INFO_REPORT",
        //     type :"get",
        //     data:{id:id},
        //     dataType :"json",
        //     success :function(result){
        //         result.data
        //         var processNum = result.data.processNum;
        //         var totalNum = result.data.totalNum;
        //         var isFinish = result.data.isFinish;
        //         $("#process").html("已处理条数："+processNum+"/"+"总条数"+totalNum);
        //         if(isFinish){
        //             var errorlist = result.data.errorlist;
        //             if(totalNum!="0"){
        //                 if(errorlist == null || errorlist =="" || errorlist.length==0){
        //                     $("#errorlist").html("<br/>导入成功！");
        //                     $("#errorId").hide();
        //                 }else{
        //                     $("#errorlist").html("<br/> 导入失败条数："+errorlist.length+"<br />");
        //                     $("#errorId").show();
        //                 }
        //             }
        //             clearInterval(viewprocess);
        //             _resetFrameHeight();
        //             hideLoading();
        //         }
        //     }
        // });
    },
    // 下载模板
    // doExpertTemp(){
    //     window.location.href = _.baseURL + "/mgr/fileUploadMgr/fileUploadMgrAction!exportTemplate.action?reportType=PLAN_PLANCITY_INFO_REPORT";
    // },
    init(){
        this.getRegionOptions()
        this.getSalesreportList()
        searchFeedBackList({status:0,page: 1,pageSize: 10}).then(data => {
          if(data){
            this.approvalCount = data.totalRows
          }
        })

    },
    // 发送时间改变
    sendTimeChange(val){
      if(val){
        this.sendTimeVal = this.formatDate(val)
      } else {
        this.sendTimeVal = ''
      }
    },
    // 生成时间
    createTimeChange(val){
      if(val){
        this.createTimeVal = this.formatDate(val)
      } else {
        this.createTimeVal = ''
      }
    },
    formatDate(val){
      let dateVal = new Date(val)
      let year = dateVal.getFullYear()
      let month = dateVal.getMonth()+1
      let day = dateVal.getDate()
      return year+'-'+this.add0(month)+'-'+this.add0(day)
    },
    // 提醒
    remindFun(param,pdata){

        const isMultiple = param === 'mulit'
        if(this.checkList.length===0 && isMultiple){
            this.$message('请选择要发送的数据')
            return false
        }
        // 全选
        
        const params = this.assemblyParams(param, pdata)
        this.isReminding = true
        ajaxPushNotesMessage(params,data => {
            if(data){
                this.$message({
                    message: '已成功提醒查阅',
                    type: 'success'
                });
                this.getSalesreportList()
            }
            this.isReminding = false
        })
    },
    // 详情
    goDetailFun(id){
      this.$router.push({name:'schoolReportDes',query:{id:id}})
    },

     assemblyParams(param, pdata){
         let areaName = this.selectedRegionId?this.selectedRegionId.split('_')[1]:''
         let provinceName = this.selectedProvinceId?this.selectedProvinceId.split('_')[1]:''
         let cityName = this.selectedCityId?this.selectedCityId.split('_')[1]:''
         let baseParams = {
             'searchValue.readStatus': this.status,
             'searchValue.keyword': this.keyword, // 关键字
             'searchValue.area':areaName, // 战区名
             'searchValue.province':provinceName, // 盛名
             'searchValue.city':cityName, // 市名
             'searchValue.year':this.year,
             'searchValue.month':this.month,
             'searchValue.pushTime':this.sendTimeVal,
             'searchValue.createTime':this.createTimeVal,
            'searchValue.types':this.types.split(' ').join(','),
            'searchValue.properties':this.properties.split(' ').join(','),
            'searchValue.operatings':this.operatings.split(' ').join(','),
         }
         // isAll：1，全选，0：非全选
         if(this.checkedAll && this.checkList.length === this.checkedAllLength){
           this.checkedAllLength = 0
             return Object.assign({}, baseParams, {
                 isAll: 1,
                 ids: ''
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
                 isAll: 0,
                 ids: ids,
             }
         }
     },

    selectUnSendId(){
      var unSendIds = this.checkList.filter((item) => {
          var listItem = this.reportData.find((iitem) => {
            return iitem.id === item
          })
          return listItem.readStatus ==='1'
        })
        if(unSendIds.length === 0){
          this.$message('不可重复发送！')
          this.getSalesreportList()
            return true
        }
        if(this.checkList.length !== unSendIds.length)this.checkList = unSendIds
        console.log(this.checkList.length,this.checkList)
    },
    // 发送
    sendOutFun(param,pdata){
        const isMultiple = param === 'mulit'
        if(this.checkList.length===0 && isMultiple){
            this.$message('请选择要发送的数据')
            return false
        }
        this.checkedAllLength = this.checkList.length
        if(this.selectUnSendId()){
          if(this.checkedAll){
              this.checkedAll = false;
          }
          return false
        }
        // 全选
        const params = this.assemblyParams(param, pdata)
        this.isSending = true

        ajaxPushMessage(params,data => {
            if(data){
                this.$message({
                    message: '发送成功',
                    type: 'success'
                });
                this.getSalesreportList()
                console.log(this.checkedAll)
                if(this.checkedAll){
                    this.checkedAll = false;
                }
                this.checkedAllLength = 0
            }
            this.isSending = false
        })
    },
    // 生成
    createFun(){
      if(this.isCreating){
          return false
      }
      if(!this.createYear) {
          this.$message('请选择生成年份');
          return false
      }
      if(!this.createMonth) {
          this.$message('请选择生成月份');
          return false
      }

      let ids = ''
      if(this.checkList.length>0){
            ids = this.checkList.join(',')
      }

      this.createTxt = '生成中'
      this.isCreating = true
      let params = {
          year: this.createYear,
          month: this.createMonth,
          ids: ids
      }

      ajaxCreateSalesreport(params,data => {
          // if(data && data.code==='0'){
              //if(this.createTxt === '重新生成') {
              //    let msg = `已重新生成${data.successNum}家经销商成绩单，备注：已发出的成绩单无法重新生成！`
              //    this.$message({
              //        message: msg,
              //        type: 'success'
              //    });
              //} else {
              //    let msg = `已生成${data.successNum}家经销商成绩单`
              //    this.$message({
              //        message: msg,
              //        type: 'success'
              //    });
             //}

          // }
          this.$message({
                message: data.isSuccessMsg,
                type: 'success'
          });
          this.getSalesreportList()
          this.createTxt='重新生成'
          this.isCreating = false
      })
    },


    assemblyDeleteParams(param, pdata){
        let areaName = this.selectedRegionId?this.selectedRegionId.split('_')[1]:''
        let provinceName = this.selectedProvinceId?this.selectedProvinceId.split('_')[1]:''
        let cityName = this.selectedCityId?this.selectedCityId.split('_')[1]:''
        let baseParams = {
            // 'searchValue.readStatus': this.status,
            'searchValue.keyword': this.keyword, // 关键字
            'searchValue.area':areaName, // 战区名
            'searchValue.province':provinceName, // 盛名
            'searchValue.city':cityName, // 市名
            'searchValue.year':this.year,
            'searchValue.month':this.month,
            'searchValue.pushTime':this.sendTimeVal,
            'searchValue.createTime':this.createTimeVal,
            'searchValue.types':this.types.split(' ').join(','),
            'searchValue.properties':this.properties.split(' ').join(','),
            'searchValue.operatings':this.operatings.split(' ').join(','),
            'ids': this.checkList.join(',')
        }
        // isAll：1，全选，0：非全选
        if(pdata){ // 单独删除
            return Object.assign({}, baseParams, {
                'searchValue.isAll': 0,
                'ids': pdata,
            })
        }

        if(this.checkedAll){
            return Object.assign({}, baseParams, {
                'searchValue.isAll': 1,
            })
        }else{
            return Object.assign({}, baseParams, {
                'searchValue.isAll': 0,
            })
        }
    },

    // 删除
    delFun(param,pdata){
        const isMultiple = param === 'mulit'
        if(this.checkList.length===0 && isMultiple){
            this.$message('请选择要删除的数据')
            return false
        }
        // 全选
        const params = this.assemblyDeleteParams(param, pdata)
        this.isReminding = true

      ajaxDelSalesreport(params,data => {
        if(data){
            this.$message({
                message: '删除成绩单成功',
                type: 'success'
            });
            this.getSalesreportList()
        }
        this.isReminding = false
      })
    },
    yearChangeFun(val){
      if(val){
          let dateVal = new Date(val)
          let year = dateVal.getFullYear()
          this.createYear = year
      } else {
          this.createYear = ''
      }
    },
    //导入
    importReportForm(){

    },


      assemblyExportReportCardParams(reportType){
          let areaName = this.selectedRegionId?this.selectedRegionId.split('_')[1]:''
          let provinceName = this.selectedProvinceId?this.selectedProvinceId.split('_')[1]:''
          let cityName = this.selectedCityId?this.selectedCityId.split('_')[1]:''
          return {
              'searchValue.readStatus': this.status,
              'searchValue.keyword': this.keyword, // 关键字
              'searchValue.area':areaName, // 战区名
              'searchValue.province':provinceName, // 盛名
              'searchValue.city':cityName, // 市名
              'searchValue.year':this.year,
              'searchValue.month':this.month,
              'searchValue.pushTime':this.sendTimeVal,
              'searchValue.createTime':this.createTimeVal,
              'reportType':reportType, //导出成绩单明细
              'searchValue.ids': this.checkList.join(','),
              'searchValue.isAll': this.checkedAll? '1': 0,
            'searchValue.types':this.types.split(' ').join(','),
            'searchValue.properties':this.properties.split(' ').join(','),
            'searchValue.operatings':this.operatings.split(' ').join(','),
          }
      },

      assemblyExportParams(reportType) {
          let areaName = this.selectedRegionId ? this.selectedRegionId.split('_')[1] : ''
          let provinceName = this.selectedProvinceId ? this.selectedProvinceId.split('_')[1] : ''
          let cityName = this.selectedCityId ? this.selectedCityId.split('_')[1] : ''
          let baseParams = {
              'searchValue.readStatus': this.status,
              'searchValue.keyword': this.keyword, // 关键字
              'searchValue.area': areaName, // 战区名
              'searchValue.province': provinceName, // 盛名
              'searchValue.city': cityName, // 市名
              'searchValue.year': this.year,
              'searchValue.month': this.month,
              'searchValue.pushTime': this.sendTimeVal,
              'searchValue.createTime': this.createTimeVal,
              'reportType': reportType, //导出成绩单明细
            'searchValue.types':this.types.split(' ').join(','),
            'searchValue.properties':this.properties.split(' ').join(','),
            'searchValue.operatings':this.operatings.split(' ').join(','),
          }

          if (this.checkedAll) {
              return Object.assign({}, baseParams, {
                  'searchValue.isAll': 1,
              });
          } else {
              const ids = this.checkList.join(',');
              return {
                  'searchValue.isAll': 0,
                  'searchValue.ids': ids,
                  'reportType': reportType, //导出成绩单明细
              }
          }
      },
      assemblyExportParamsRead(reportType) {
        const ids = this.checkList.join(',');
        return {
          'searchValue.ids': ids,
          'reportType': reportType, //导出已读人员
        }
      },
      // 检验已勾选的成绩单是否为已读或已反馈
      checkExportRead() {
        console.log(this.reportData)
        console.log(this.checkList)
        let selectList = this.reportData.filter(item=>{
          return this.checkList.indexOf(item.id)!==-1
        })
        console.log(selectList)
        for (let item of selectList) {
          console.log(item.readStatusDesc)
          if (item.readStatusDesc != '已读' && item.readStatusDesc != '已反馈') {
            return false
          }
        }
        return true
      },

      handleExportCommand(command){
          const hasCheckedItem = this.checkList.length>0;
          if(!hasCheckedItem){
              this.$message('请选择要导出的数据')
              return;
          }
          if(['readPerson'].includes(command)){
              let flag = this.checkExportRead()
              if (!flag) {
                this.$message('请选择查阅状态为已读或已反馈的数据进行导出!')
                return;
              }
          }
          if(['dealerFeedback','photo'].includes(command) && this.status !== '4'){
              this.$message('请选择查阅状态为已反馈的数据进行导出!')
              return;
          }


          let form = {};
          switch (command) {
              case 'reportCardDetail' :
                   form = this.assemblyExportReportCardParams('REPORT_CARD_BRAND_MGR')
                  this._createReport(form);
                  break;
              case 'dealerFeedback' :
                   form = this.assemblyExportParams('DEALER_FEED_PROJECT')
                  this._createReport(form);
                  break;
              case 'photo' :
                   form = this.assemblyExportParams('DEALER_FEEDBACK_IMAGE_REPORT')
                  this._createReport(form)
                  break;
              case 'readPerson' :
                  form = this.assemblyExportParamsRead('REPORT_SALESREPORT_READ')
                  this._createReport(form)
                  break;
              default:
                  break;
          }
      },

    //判断是否全选
    isAllSelected(){
        let selectData = this.reportData.filter(item => {
            return item.isChecked == true
        });
        this.checkedAll = selectData.length == this.checkList.length? true : false;

        let temp = []
        this.reportData.map(item => {
            if(item.isChecked) {
                temp.push(item.id)
            }
        })
        this.checkList = temp
    },
    // 点击checkbox
    singleSelect(id){
        this.isAllSelected();
    },
    // 点击全选checkbox
    allSelect(){
        let temp = []
        this.reportData.map(item => {
            item.isChecked = this.checkedAll;
            if(this.checkedAll) {
                temp.push(item.id)
            }
        });
        this.checkList = temp
    },
    // 获取成绩单
    getSalesreportList(){
        let areaName = this.selectedRegionId?this.selectedRegionId.split('_')[1]:''
        let provinceName = this.selectedProvinceId?this.selectedProvinceId.split('_')[1]:''
        let cityName = this.selectedCityId?this.selectedCityId.split('_')[1]:''

        let params = {
            'page': this.pageSetting.page,
            'pageSize': this.pageSetting.pageSize,
            'searchValue.readStatus': this.status,
            'searchValue.keyword': this.keyword, // 关键字
            'searchValue.area':areaName, // 战区名
            'searchValue.province':provinceName, // 盛名
            'searchValue.city':cityName, // 市名
            'searchValue.year':this.year,
            'searchValue.month':this.month,
            'searchValue.pushTime':this.sendTimeVal,
            'searchValue.createTime':this.createTimeVal,
            'searchValue.types':this.types.split(' ').join(','),
            'searchValue.properties':this.properties.split(' ').join(','),
            'searchValue.operatings':this.operatings.split(' ').join(','),
        }
        ajaxGetSalesreportList(params,data => {
          let temp = data.pageData || []
          temp.map(item => {
              item.isChecked = false
          })
          this.reportData = temp
          this.idList = []
          temp.forEach(item => {
            if(item.id){
              this.idList.push(item.id)
            }
          });
          this.pageSetting.maxPage = data.maxPage
          this.pageSetting.totalRows = data.totalRows
          this.checkList = []
        })
    },
    add0(val){
      let txt = val
      if(val<10) {
          txt = '0'+val
      }
      return txt
    },
    // 年月
    dateChangeFun(val){
        if(val) {
            let dateVal = new Date(val)
            this.year = dateVal.getFullYear()
            this.month = this.add0(dateVal.getMonth()+1)
        } else {
            this.year = ''
            this.month = ''
        }
    },
    // 查询
    handleClickSearchbtn(){
        this.pageSetting.page = 1
        this.pageSetting.pageSize = 10
        this.getSalesreportList()
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
    chooseRegion(optionName, val) {
      this.area.selectRegion = {
        idx: val,
        val: val,
        name: optionName
      }
    },
    // 选择日期
    chooseTime() {},
    // 分页
    pageChange() {
        this.checkedAll = false
        this.getSalesreportList()
    },

    handleClickCompetingManagement(){
      this.$router.push({
          name: 'competingManagement'
      })
    },
    handleShowReadPerson(id) {
      this.readId = id
      this.isShowReadPerson = true
    },
    handleHideReadPerson() {
      this.isShowReadPerson = false
    },
    gosendMsgToLeaders(){
      var time = new Date().getTime()
      if(time - this.currentClickTime >= 2000){
        this.currentClickTime = time
        sendMsgToLeaders()
      }
      

      
    }
  },
  mounted: function(){
    // this.$nextTick(() => {
    //   if(this.$$refs.iframeDom){
    //     this.iframeHeight = window.innerHeight - this.$refs.iframeDom.$el.offsetTop;
    //   }
    // })
  },
  components: {
    page,saleReportTable,
    readPerson
  }
}
</script>

<style lang="less">
@import url('./css/index.less');
  .el-dialog__wrapper .el-dialog{
    width: 800px;
  }
  .ImportContact { width: 600px; margin: 0 auto; }
  .importTitle { height: 40px; line-height: 34px;vertical-align: middle; border-bottom: 1px dashed #b6b6b6;}
  .newImportContact .importTitle { heightimport: 35px; line-height: 35px;border-bottom: none; }
  .importTitle h3 {
      font-family: Georgia;
      font-size: 48px;
      color: #b6b6b6;
      float: left;
      line-height: 24px;
      font-style: italic;
  }
  .importTitle span {
    margin-left: 10px;
  }

  .mt50 {
      margin-top: 30px;
  }
  #id_form_save .mt10.f12.f999 {
      margin-top: 20px;
  }
  #xuanzhe {
      border-bottom: 1px dashed #ababab;
      color: red;
      margin-bottom: 20px;
      padding-bottom: 10px;
      margin-top: 20px;
  }
  #xuanzhe input{margin-right: 10px;}
  #xuanzhe .orangeBtn{width: 150px;}
  & /deep/ {
  .el-badge__content.is-fixed{
    top: 2px;
    right: 14px;
  }
  .el-badge__content{
    background-color: #cf2e46;
  }
}

  .schoolReportWrap{
    .haveRead{
      color: #333333;
      /deep/ .el-button--text {
        color: #333333;
      }
    }
    .unread{
      font-weight: bold;
      color: #409eff;
      /deep/ .el-button--text {
        color: #409eff;
      }
    }
  }

  .mask {
    background-color: rgba(0,0,0,0.3);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
  }
</style>

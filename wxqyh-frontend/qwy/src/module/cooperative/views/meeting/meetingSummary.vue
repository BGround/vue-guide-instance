<template>
  <div class="qwui-list_wrap">
    <div>
      <div class="qwui-top_main_bar">
        <div class="qwui-bar_left">
          <qwui-button @click="exportReportForm" v-perm="'meetingExport'">导出</qwui-button>
          <span class="qwui-dotted_line" v-perm="'meetingExport'"></span>
          <qwui-button @click="doDels(ids,true)" v-perm="'meetingdel'">删除</qwui-button>
        </div>
        <div class="qwui-bar_right">
          <qwui-input inputType="search"
                      @search='search'
                      v-model="searchTitle"
                      :inputTips="'搜索标题'"></qwui-input>
          <a class="qwui-senior_search_btn" @click="showAdvancedScreen">高级搜索</a>
        </div>
      </div>
      <advancedScreen v-show="isShowAdvancedScreen"
                      :screenItemList="screenItemList"
                      @searchResult="searchResult">
      </advancedScreen>
      <div class="qwui-table_wrap">
        <data-table :headData="headData" :dataList="dataList"></data-table>
        <page :pageData="pageData" @change="change"></page>
      </div>
    </div>
  </div>
</template>

<script>
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
  import advancedScreen from '@/components/Screen/AdvancedScreen/AdvancedScreen';
  import dataTable from '@/components/Table/dataTable.vue';
  import page from '@/components/list/page.vue';
  import exportReportForm from '@/assets/js/export/export.js';
  import { searchSummaryList,deleteSummary } from '../../api/meeting/getData';

  export default {
    mixins:[exportReportForm],
    data(){
      return {
        searchTitle:'',
        isShowAdvancedScreen:false,
        ids:'',
        screenItemList:[
          {
            type:'text',
            name:'纪要标题',
            modelName:'title'
          },
          {
            type:'text',
            name:'所属会议',
            modelName:'meetingTitle'
          },
          {
            type:'text',
            name:'纪要创建人',
            modelName:'founder',
            searchObj:{
              searchUrl:'/contact/contactAction!ajaxSearchUserByPersonName.action',
              type:'user',
              params:{
                keyWord: 1,
                pageSize: 10
              }
            }
          },
          {
            type:'time',
            name:'创建时间',
            modelName:'createTime',
            timeHandler:(startTime,endTime)=> {
              this.exportStartTime = startTime;
              this.exportEndTime = endTime;
            }
          }
        ],
        exportStartTime:'',
        exportEndTime:'',
        headData:{
          left:{
            id:'id',
            checkFunc:(isSelectedAll,list)=>{
              let arr = [];
              list.forEach(function(item){
                if(item.isChecked){
                  arr.push(item.id);
                }
              });
              this.ids = arr.join(',');
            }
          },
          middle:[
            {
              title:'纪要标题',
              key:'title',
              width:150
            },
            {
              title:'所属会议',
              key:'meetingTitle',
              width:150
            },
            {
              title:'纪要创建人',
              key:'personName',
              width:125
            },
            {
              title:'创建时间',
              key:'createTime',
              width:140
            }
          ],
          right: {
            isShowOperate: true,
            width:100,
          }
        },
        dataList:[],
        pageSize:10,
        pageData:{},
        page:1,
        totalRows:0,
        searchParams:{},
        searchData:[],
      }
    },
    created(){
      dataBase.agentCode = 'meet';

      // 初始化参数
      this.updateParams();
      // 获取日志列表数据
      this.searchSummary();

    },
    methods:{
      updateParams(){
        this.searchParams = {
          'searchValue.summaryTitle':this.searchData.title || '',
          'searchValue.startTimes':this.searchData.createTime ? this.searchData.createTime[0] : '',
          'searchValue.endTimes':this.searchData.createTime ? this.searchData.createTime[1] : '',
          'searchValue.meetingTitle':this.searchData.meetingTitle || '',
          'searchValue.personId':this.searchData.founder ? this.searchData.founder.userId : '',
          'page':this.page || 1,
          'pageSize':this.pageSize || 10,
        }
      },
      searchSummary(){
        let self = this;
        searchSummaryList(this.searchParams,(data)=>{
          this.pageData = {
            page: data.currPage,
            pageSize: this.pageSize,
            maxPage: data.maxPage,
            totalRows: data.totalRows
          };
          this.totalRows = data.totalRows;
          if (!data.pageData){
            this.dataList = [];
            return;
          }
          data.pageData.forEach((item)=>{
            item.operationList = [
              {
                text:'查看详情',
                perm:'meetingdetail',
                operationFunc(){
                  self.doDetailList(item.meetingId)
                }
              },
              {
                text:'查看会议',
                perm:'meetingdetail',
                operationFunc(){
                  self.doViewMeeting(item.meetingId)
                }
              },
              {
                text:'导出',
                perm:'meetingExport',
                operationFunc(){
                  self.exportReportForm(item.id,true,item.title)
                }
              },
              {
                text:'删除',
                perm:'meetingdel',
                operationFunc(){
                  self.doDels(item.id)
                }
              }
            ]
          });
          this.dataList = data.pageData;
        })
      },
      showAdvancedScreen(){
        this.isShowAdvancedScreen = !this.isShowAdvancedScreen;
      },
      search(value){
        this.searchData.title = value;
        this.updateParams();
        this.searchSummary();
      },
      searchResult(data){
        this.searchData = data;
        this.page = 1;
        this.updateParams();
        this.searchSummary();
      },
      change(page,pageSize){
        this.pageSize = pageSize;
        this.page = page;
        this.updateParams();
        this.searchSummary();
      },
      doDetailList(id){
        let top=(window.screen.height-560)/2;
        let left=(window.screen.width-350)/2;
        window.open(_.baseURL + '/manager/meetingassis/summary_detail.jsp?id='+id, 'newwindow', 'left='+left+',top='+top+',height=580, width=350, toolbar=no, menubar=no, resizable=yes,location=no, status=no,scrollbars=no,directories=no,menubar=no');
      },
      doViewMeeting(meetingId){
        let top=(window.screen.height-560)/2;
        let left=(window.screen.width-350)/2;
        window.open(_.baseURL + '/manager/meetingassis/detail.jsp?id='+meetingId, 'newwindow', 'left='+left+',top='+top+',height=580, width=350, toolbar=no, menubar=no, resizable=yes,location=no, status=no,scrollbars=no,directories=no,menubar=no');
      },
      doDels(id,status){
        let self = this;
        if (status && !id){
          _.alert('提示','请选择要删除的数据');
          return;
        }
        _.alert('提示','删除数据后将无法恢复，确认要删除吗？',function(){
          deleteSummary({ids:id},()=>{
            dataBase.top_alert('删除成功',true,3000);
            self.ids = '';
            self.searchSummary();
          })
        },'确定',true)
      },
      // 导出
      exportReportForm(id,status,title){
        let startTime = this.exportStartTime;
        let endTime = this.exportEndTime;
        if((startTime==""||endTime=="") && !status){
          dataBase.top_alert('请在【高级搜索】设置导出数据的创建时间段',false,3000);
        }else{
          if(this.exportDaysLimitByMonthCounts(startTime,endTime)){
            if(this.totalRows>0){
              this.updateParams();
              this.searchParams['reportType'] = status ? 'meeting_summary':'mutilSummary';
              this.searchParams['searchValue.id'] = id || '';
              this.searchParams['fileName'] = title || '';
              this._createReport(this.searchParams);
            } else{
              dataBase.top_alert('搜索结果为空，不支持导出',false,3000);
            }
          }
        }
      },
    },
    components:{
      qwuiButton,
      qwuiInput,
      advancedScreen,
      dataTable,
      page
    }
  }
</script>
<style src="../../scss/meeting/meeting.scss" lang="scss" scoped></style>

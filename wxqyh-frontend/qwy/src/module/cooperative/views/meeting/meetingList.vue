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
                      :inputTips="'搜索'"></qwui-input>
          <a class="qwui-senior_search_btn" @click="showAdvancedScreen">高级搜索</a>
        </div>
      </div>
      <advancedScreen v-show="isShowAdvancedScreen"
                      :screenItemList="screenItemList"
                      @searchResult="searchResult">
      </advancedScreen>
      <div class="qwui-table_wrap">
        <data-table :headData="headData" :dataList="dataList">
          <div class="qwui-cycle_meeting" v-for="(item,key) in dataList" :key="key" :slot="'title' + key" v-if="item.cycleId !== '0'">
            <span class="meetCycle">周期</span>
            <span>{{ item.title }}</span>
          </div>
        </data-table>
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
  import { searchMeetingList,deleteMeeting,getAllMeetingRoom } from '../../api/meeting/getData';

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
            name:'标题',
            modelName:'title',
          },
          {
            type:'select',
            name:'会议室',
            dataList:[
              {
                text:'全部',
                value:''
              }
            ],
            modelName:'type',
          },
          {
            type:'text',
            name:'创建人',
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
            type:'text',
            name:'部门',
            modelName:'deptName',
            searchObj:{
              searchUrl:'/contact/contactAction!ajaxSearchDeptByDeptName.action',
              type:'dept',
              params:{
                keyWord: 2,
                pageSize: 10
              }
            },
          },
          {
            type:'time',
            name:'开始时间',
            modelName:'meetStartTime',
            timeHandler:(startTime,endTime)=>{

            }
          },
          {
            type:'time',
            name:'结束时间',
            modelName:'meetEndTime',
            timeHandler:(startTime,endTime)=>{

            }
          },
          {
            type:'select',
            name:'会议状态',
            dataList:[
              {
                text:'全部',
                value:''
              },
              {
                text:'草稿',
                value:0
              },
              {
                text:'已发布',
                value:1
              },
              {
                text:'已结束',
                value:2
              },
              {
                text:'已取消',
                value:3
              },
              {
                text:'审批中',
                value:4
              },
              {
                text:'退审',
                value:5
              },
              {
                text:'审核超时',
                value:6
              }
            ],
            modelName:'status'
          },
          {
            type:'time',
            name:'创建时间',
            modelName:'createTime',
            timeHandler:(startTime,endTime)=>{
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
              title:'标题',
              key:'title',
              width:150
            },
            {
              title:'创建人',
              key:'personName',
              width:80
            },
            {
              title:'会议室',
              key:'roomName',
              width:125
            },
            {
              title:'开始时间',
              key:'startTime',
              width:140
            },
            {
              title:'结束时间',
              key:'endTime',
              width:140
            },
            {
              title:'会议状态',
              key:'statusDesc',
              width:80
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
      let self = this;
      getAllMeetingRoom((data)=>{
        data.pageData.forEach((item)=>{
          self.screenItemList[1].dataList.push({
            text:item.roomName,
            value:item.id
          })
        })
      });
      // 初始化参数
      this.updateParams();
      // 获取会议列表数据
      this.searchMeeting();
    },
    methods:{
      updateParams(){
        this.searchParams = {
          'searchValue.name':this.searchData.title || '',
          'searchValue.startTimes':this.searchData.createTime ? this.searchData.createTime[0] : '',
          'searchValue.endTime':this.searchData.createTime ? this.searchData.createTime[1] : '',
          'searchValue.type':this.searchData.type || '',
          'searchValue.userId':this.searchData.founder ? this.searchData.founder.userId : '',
          'searchValue.deptName':this.searchData.deptName
            ? this.searchData.deptName.deptFullName
            : '',
          'searchValue.meetStartTime1':this.searchData.meetStartTime ? this.searchData.meetStartTime[0] : '',
          'searchValue.meetStartTime2':this.searchData.meetStartTime ? this.searchData.meetStartTime[1] : '',
          'searchValue.meetEndTime1':this.searchData.meetEndTime ? this.searchData.meetEndTime[0] : '',
          'searchValue.meetEndTime2':this.searchData.meetEndTime ? this.searchData.meetEndTime[1] : '',
          'searchValue.status':this.searchData.status,
          'page':this.page || 1,
          'pageSize':this.pageSize || 10,
          'belongAgent':dataBase.agentCode
        }
      },
      searchMeeting(){
        let self = this;
        searchMeetingList(this.searchParams,(data)=>{
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
                text:'大屏幕',
                perm:'signByQRCode',
                operationFunc(){
                  self.doScreen(item.id)
                }
              },
              {
                text:'详情',
                perm:'meetingdetail',
                operationFunc(){
                  self.doDetailList(item.id)
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
            ];

            if (item.auditResult == 3){
              item.operationList.splice(0,1);
            }
          });
          this.dataList = data.pageData;
        })
      },
      doScreen(id){
        window.open(_.baseURL + '/manager/meetingassis/screen.jsp?id='+id);
      },
      doDetailList(id){
        let top=(window.screen.height-560)/2;
        let left=(window.screen.width-350)/2;
        window.open(_.baseURL + '/manager/meetingassis/detail.jsp?id='+id, 'newwindow', 'left='+left+',top='+top+',height=580, width=350, toolbar=no, menubar=no, resizable=yes,location=no, status=no,scrollbars=no,directories=no,menubar=no');
      },
      doDels(id,status){
        let self = this;
        if (status && !id){
          _.alert('提示','请选择要删除的数据');
          return;
        }
        _.alert('提示','删除数据后将无法恢复，确认要删除吗？',function(){
          deleteMeeting({ids:id},()=>{
            dataBase.top_alert('删除成功',true,3000);
            self.ids = '';
            self.searchMeeting();
          })
        },'确定',true)

      },
      search(value){
        this.searchData.title = value;
        this.updateParams();
        this.searchMeeting();
      },
      showAdvancedScreen(){
        this.isShowAdvancedScreen = !this.isShowAdvancedScreen;
      },
      searchResult(data){
        this.searchData = data;
        this.page = 1;
        this.updateParams();
        this.searchMeeting();
      },
      change(page,pageSize){
        this.pageSize = pageSize;
        this.page = page;
        this.updateParams();
        this.searchMeeting();
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
              this.searchParams['reportType'] = status ?  'meeting':'mutilMeeting';
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
<style lang="scss">
  .qwui-cycle_meeting {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>

<template>
  <div class="qwui-list_wrap">
    <div>
      <div class="qwui-top_main_bar">
        <div class="qwui-bar_left">
          <qwui-button @click="exportReportForm" v-perm="'countDiary'">导出</qwui-button>
          <span class="qwui-dotted_line" v-perm="'countDiary'"></span>
          <qwui-button @click="doDels(ids,true)" v-perm="'diarydel'">删除</qwui-button>
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
                      @searchResult="searchResult"
                      ref="screen">
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

  import { getDiaryType,searchDiaryList,delDiary,isWhiteName } from '../../api/diary/getData';


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
            type:'text',
            name:'发起人',
            modelName:'sponsor',
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
            type:'text',
            name:'内容',
            modelName:'content'
          },
          {
            type:'time',
            name:'创建时间',
            modelName:'createTime',
            defaultValue:[],
            timeHandler:(startTime,endTime)=> {
              this.exportStartTime = startTime;
              this.exportEndTime = endTime;
            }
          },
          {
            type:'select',
            name:'日志类型',
            dataList:[],
            modelName:'type',
          },
        ],
        exportStartTime:'',
        exportEndTime:'',
        headData:{
          left:{
            id:'diaryId',
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
              title:'日志类型',
              key:'typeName',
              width:100,
            },
            {
              title:'发起人',
              key:'personName',
              width:80,
            },
            {
              title:'标题',
              key:'title',
              width:230,
            },
            {
              title:'创建时间',
              key:'createTime',
              width:150,
            },
          ],
          right: {
            isShowOperate: true,
            width:80,
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
      let self = this;
      // 获取所有日志类型
      getDiaryType((data)=>{
        data.template.forEach((item)=>{
          self.screenItemList[5].dataList.push({
            text:item.name,
            value:item.id
          })
        })
      });
      // 是否白名单
      isWhiteName((data)=>{
        if (data.isWhiteName){
          let startTime = new Date((new Date().getTime() - 60*24*3600*1000)).Format("yyyy-MM-dd") + ' 00:00:00';
          let endTime = (new Date()).Format("yyyy-MM-dd") + ' 23:59:59';
          this.searchData.createTime = [startTime,endTime];
          this.screenItemList[4].defaultValue = [startTime.substr(0,10),endTime.substr(0,10)];
          this.$refs.screen.resetForm();
        }
        // 初始化参数
        this.updateParams();
        // 获取日志列表数据
        this.searchDiary();
      });
    },
    methods:{
      updateParams(){
        this.searchParams = {
          'searchValue.title':this.searchData.title || '',
          'searchValue.content':this.searchData.content || '',
          'searchValue.userId':this.searchData.sponsor ? this.searchData.sponsor.userId : '',
          'searchValue.deptName':this.searchData.deptName
            ? this.searchData.deptName.deptFullName
            : '',
          'searchValue.type':this.searchData.type || '',
          'searchValue.startTimes':this.searchData.createTime ? this.searchData.createTime[0] : '',
          'searchValue.endTime':this.searchData.createTime ? this.searchData.createTime[1] : '',
          'searchValue.historyYear':'',
          'page':this.page || 1,
          'pageSize':this.pageSize || 10,
          'belongAgent':'diary'
        }
      },
      searchDiary(){
        let self = this;
        searchDiaryList(this.searchParams,(data)=>{
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
                text:'详情',
                perm:'diarydetail',
                operationFunc(){
                  self.doDetailList(item.diaryId,item.createTime);
                }
              },
              {
                text:'删除',
                perm:'diarydel',
                operationFunc(){
                  self.doDels(item.diaryId);
                }
              }
            ]
          });
          this.dataList = data.pageData;
        })
      },
      // 查看日志详情
      doDetailList(id,createTime){
        let top=(window.screen.height-630)/2;
        let left=(window.screen.width-520)/2;
        window.open(_.baseURL+'/manager/diary/detail.jsp?id='+id+'&historyYear='+createTime.substring(0,4), 'newwindow', 'left='+left+',top='+top+',height=580, width=350, toolbar=no, menubar=no, resizable=yes,location=no, status=no,scrollbars=no,directories=no,menubar=no')
      },
      search(value){
        this.searchData.title = value;
        this.updateParams();
        this.searchDiary();
      },
      doDels(id,status){
        let self = this;
        if (status && id == ''){
          _.alert('提示','请选择要删除的数据');
          return;
        }
        _.alert('提示','删除数据后将无法恢复，确认要删除吗？',function(){
          delDiary({ids:id},()=>{
            dataBase.top_alert('删除成功',true,3000);
            self.ids = '';
            self.searchDiary();
          })
        },'确定',true)
      },
      showAdvancedScreen(){
        this.isShowAdvancedScreen = !this.isShowAdvancedScreen;
      },
      searchResult(data){
        this.searchData = data;
        this.page = 1;
        this.updateParams();
        this.searchDiary();
      },
      change(page,pageSize){
        this.pageSize = pageSize;
        this.page = page;
        this.updateParams();
        this.searchDiary();
      },
      // 导出
      exportReportForm(){
        let startTime = this.exportStartTime;
        let endTime = this.exportEndTime;
        if(startTime==""||endTime==""){
          dataBase.top_alert('请在【高级搜索】设置导出数据的创建时间段',false,3000);
        }else{
          if(this.exportDaysLimitByMonthCounts(startTime,endTime)){
            if(this.totalRows>0){
              this.updateParams();
              this.searchParams['reportType'] = 'diary';
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

<style src="../../scss/diary/diary.scss" lang="scss" scoped></style>

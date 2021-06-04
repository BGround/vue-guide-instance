<template>
  <div class="qwui-list_wrap">
    <div class="qwui-top_main_bar">
      <div class="qwui-bar_left">
        <qwuiButton @click="exportReportForm" v-perm="'countExpress'">&nbsp;导出&nbsp;</qwuiButton>
        <span class="qwui-dotted_line" v-perm="'expressdel'"></span>
        <qwuiButton @click="doDels(ids)" v-perm="'expressdel'">&nbsp;删除&nbsp;</qwuiButton>
        <span class="qwui-dotted_line" v-perm="'expressSet'"></span>
        <qwuiButton @click="toSettings()" v-perm="'expressSet'">&nbsp;设置&nbsp;</qwuiButton>
      </div>
      <div class="qwui-bar_right">
        <qwui-input inputType="search" @search='search' v-model="searchTitle" :inputTips="'搜索收件人'"></qwui-input>
        <a class="qwui-senior_search_btn" @click="showAdvancedScreen">高级搜索</a>
      </div>
    </div>
    <advancedScreen v-show="isShowAdvancedScreen" :screenItemList="screenItemList" @searchResult="searchResult"></advancedScreen>
    <div class="qwui-table_wrap">
      <dataTable :headData="headData" :dataList="dataList"></dataTable>
      <page :pageData="pageData" @change="change"></page>
    </div>
  </div>
</template>

<script>
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
  import advancedScreen from '@/components/Screen/AdvancedScreen/AdvancedScreen';
  import dataTable from '@/components/Table/dataTable.vue';
  import page from '@/components/list/page.vue';
  import {searchExpressPager,batchDeleteExpressPO} from '../../api/newsBulletin/getExpress';
  import exportReportForm from '@/assets/js/export/export.js';
  import { mapActions, mapGetters } from "vuex";
  const refType = ['关闭','自取','代领'];

  export default {
    name:'express',
    mixins:[exportReportForm],
    data(){
      return{
        searchTitle:'',
        pageSize:10,
        pageData:{},
        screenItemList:[ //高级搜索
          {
            type:'text',
            name:'收件人',
            modelName:'userId',
            searchObj:{
              searchUrl:'/contact/contactAction!ajaxSearchUserByPersonName.action',
              type:'user',
              params:{
                keyWord: 1,
                pageSize: 10
              }
            },
          },
          {
            type:'text',
            name:'收件人部门',
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
            name:'代领人',
            modelName:'closeUserId',
            searchObj:{
              searchUrl:'/contact/contactAction!ajaxSearchUserByPersonName.action',
              type:'user',
              params:{
                keyWord: 1,
                pageSize: 10
              }
            },
          },
          {
            type:'time',
            name:'创建时间',
            defaultValue:[],
            modelName:'createdTime',
            timeHandler:(startTime,endTime)=> {
               this.createdStartTime = startTime;
               this.createdEndTime = endTime;
            }
          },
          {
            type:'time',
            name:'领取时间',
            defaultValue:[],
            modelName:'receivedTime'
          },
          {
            type:'select',
            name:'领取状态',
            dataList:[
              {
                text:'全部',
                value:'',
              },
              {
                text:'未领取',
                value:'0',
              },
              {
                text:'已领取',
                value:'1',
              },
            ],
            modelName:'status',
          },
        ],
        createdStartTime:'',
        createdEndTime:'',
        isShowAdvancedScreen:false,
        ids:'',
        headData:{ //列表配置
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
              title: '收录人',
              key: 'personName',
              textAlign: 'center'
            },
            {
              title:'录入时间',
              key:'createTime',
              textAlign: 'center'
            },
            {
              title: '收件人',
              key: 'receiveUser',
              textAlign: 'center'
            },
            {
              title: '代领人',
              key: 'receiveRefUser',
              textAlign: 'center',
            },
            {
              title: '领取方式',
              key: 'lastType',
              textAlign: 'center',
            },
            {
              title:'领取时间',
              key:'receiveTime',
              textAlign: 'center'
            },
          ],
          right: {
            isShowOperate: true,
            width:100,
          }
        },
        dataList:[],
        searchParams:{}, //搜索的关键字段
        searchData:{},
        page:1,
        totalRows:0,
        exportParams:{},
      }
    },
    mounted(){
      this.searchExpressPager();
    },
    methods:{
      toSettings(){
        this.$router.push('/express/setting')
      },
      change(page,pageSize){ //底部页数
        this.pageSize = pageSize;
        this.page = page;
        this.searchExpressPager();
      },
      search(value){ //搜索收件人
        this.searchData.title = value;
        this.page = 1;
        this.searchExpressPager();
      },
      searchResult(data){ //高级搜索
        this.searchTitle = '';
        this.searchData = data;
        this.page = 1;
        this.searchExpressPager();
      },
      updateParams(isExport){ //更新搜索关键字段
        this.searchParams = {
          'searchValue.title':this.searchData.title ? this.searchData.title : '',
          'searchValue.deptName':this.searchData.deptName ? this.searchData.deptName['deptFullName'] : '',
          'searchValue.userId':this.searchData.userId ? this.searchData.userId['userId'] : '',
          'searchValue.closeUserId':this.searchData.closeUserId ? this.searchData.closeUserId['userId'] : '',
          'searchValue.receiveStartTime':this.searchData.receivedTime ? this.searchData.receivedTime[0] : '',
          'searchValue.receiveEndTime':this.searchData.receivedTime ? this.searchData.receivedTime[1] : '',
          'searchValue.status':this.searchData.status ? this.searchData.status : '',
          'searchValue.startTimes':this.searchData.createdTime ? this.searchData.createdTime[0] : '',
          'searchValue.endTime':this.searchData.createdTime ? this.searchData.createdTime[1] : '',
          //'belongAgent': dataBase.agentCode,
        };
        if(isExport){
          this.searchParams['reportType'] = 'express'
        } else {
          this.searchParams['page'] = this.page;
          this.searchParams['pageSize'] = this.pageSize
        }
      },
      searchExpressPager(){ //执行搜索
        this.updateParams();
        let self = this;
        searchExpressPager(this.searchParams,(data)=>{
          this.pageData = {
            page: data.currPage,
            pageSize: this.pageSize,
            maxPage: data.maxPage,
            totalRows: data.totalRows
          };
          this.totalRows = data.totalRows;
          this.dataList = data.pageData || [];
          this.dataList.forEach((item,index)=>{
            item.lastType = item.lastType ? refType[item.lastType] : '-'
            item.operationList = [
              {
                perm:'expressdetail',
                text:'查看详情',
                operationFunc:()=>{
                  self.doDetailList(item.id);
                }
              },
              {
                perm: 'expressdel',
                text:'删除',
                operationFunc:()=>{
                  self.doDels(item.id);
                }
              },
            ];
          });
        });
      },
      doDetailList(id){ //查看详情
        let top=(window.screen.height-630)/2;
        let left=(window.screen.width-520)/2;
        window.open(_.baseURL+'/manager/express/detail.jsp?id='+id,'newwindow','height=580,width=350,left='+left+',top='+top+',toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no');
      },
      doDels(ids){ //删除
        let self = this;
        if(!ids){
          dataBase.top_alert('未选中任何快递', false, 3000);
          return
        }
        _.alert('提示','删除数据后将无法恢复，确认要删除吗？',function(){
          batchDeleteExpressPO({
            ids:ids,
            belongAgent:dataBase.agentCode
          },(data)=>{
            dataBase.top_alert('删除成功', true, 3000);
            self.searchExpressPager();
          });
        });
      },
      exportReportForm(){ //导出
        let startTime = this.createdStartTime;
        let endTime = this.createdEndTime;
        if(startTime==""||endTime==""){
          dataBase.top_alert('请在【高级搜索】设置导出数据的创建时间段',false,3000);
        }else{
          if(this.exportDaysLimitByMonthCounts(startTime,endTime)){
            if(this.totalRows>0){
              this.updateParams(true);
              this._createReport(this.searchParams);
            } else{
              dataBase.top_alert('搜索结果为空，不支持导出',false,3000);
            }
          }
        }
      },
      showAdvancedScreen(){ //显示隐藏高级搜索
        this.isShowAdvancedScreen = !this.isShowAdvancedScreen;
      }
    },
    computed:{
      ...mapGetters("advancedScreen", ["advancedScreenData"]),
    },
    components:{
      qwuiButton,
      qwuiInput,
      advancedScreen,
      dataTable,
      page,
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
    @include pt15;
    .qwui-top_main_bar{
      display: flex;
      justify-content: space-between;
      padding-bottom: 20px;
      @include pt20;
      .qwui-bar_left{
        flex: 1;
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
    .qwui-table_wrap{
      @include pt15;
    }
  }
</style>

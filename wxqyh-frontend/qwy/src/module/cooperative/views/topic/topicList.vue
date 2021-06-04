<template>
  <div>
    <div class="top_main_bar">
      <div class="bar_left">
        <qwuiButton v-perm="'topicExport'" type='primary' @click="publicAdd">&nbsp;发布&nbsp;</qwuiButton>
        <span class="dotted_line"></span>
        <qwuiButton v-perm="'topicExport'" @click="exportReportForm">&nbsp;导出&nbsp;</qwuiButton>
        <span v-perm="'topicDel'" class="dotted_line"></span>
        <qwuiButton v-perm="'topicDel'" @click="doDels(ids,'all')">&nbsp;删除&nbsp;</qwuiButton>
      </div>
      <div class="bar_right">
        <qwui-input inputType="search" @search='search' v-model="searchTitle" @input="searchInput" :inputTips="'搜索话题'"></qwui-input>
        <a class="senior_search_btn" @click="showAdvancedScreen">高级搜索</a>
      </div>
    </div>
    <advancedScreen v-show="isShowAdvancedScreen" :screenItemList="screenItemList" @searchResult="searchResult"></advancedScreen>
    <div class="table_wrap">
      <dataTable :headData="headData" :dataList="dataList">
        <!-- 置顶 -->
        <div 
          v-for="(item,index) in dataList" 
          :key="index" 
          :slot="'title'+index"
          class="content">
          <span
            class="set_top"
            v-show="item.showSetTop">置顶</span>
          {{item.title}}
        </div>
        <!-- 查看未阅 -->
        <div v-for="(item,index) in dataList"
              :key="index"
              :slot="'viewCount'+index">
          <span
            title="点击查看明细"
            @click="skipFunc(item)"
            class="goLink">
              {{item.viewCount}}
            </span>
        </div>
      </dataTable>
      <page :pageData="pageData" @change="change"></page>
    </div>
    <funcBox
      v-show="showFuncBox"
      @closeBox="closeBox" 
      firstBtn="确认" 
      secondBtn="取消" 
      :boxTitle="'编辑话题类型'"
      @firstFunc="firstFunc" 
      @secondFunc="closeBox">
      <div class="fun_box">
        <span class="box_text">选择类型：</span>
        <qwui-select class="select_type" @selectItem="selectItemType" :dataList="typeData" :selectVal="selectValType"></qwui-select>
      </div>
    </funcBox>
  </div>
</template>

<script>
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
import advancedScreen from '@/components/Screen/AdvancedScreen/AdvancedScreen';
import dataTable from '@/components/Table/dataTable.vue';
import page from '@/components/list/page.vue';
import funcBox from '@/components/list/funcBox'; 
import qwShareAlert from '@/components/Alert/QwShareAlert.vue';
import qwuiSelect from '@/components/qwuiBase/qwuiSelect/QwSelect';
import exportReportForm from '@/assets/js/export/export.js';
import { mapActions, mapGetters } from "vuex";
import {
  getTopicList,
  getAllTypeList,
  updateTop,
  getTypeList,
  editTopicType,
  getTopicHistoryInfo,
  ajaxBatchDelete
} from '../../api/topic/getData';
export default {
  name:'topicList',
  mixins:[exportReportForm],
  data(){
    return {
      searchTitle:'',
      isShowAdvancedScreen:false,//高级搜索框显示
      screenItemList:[
        {
          type:'text',
          name:'标题',
          modelName:'title',
        },
        {
          type:'select',
          name:'类型',
          dataList:[
            {
              text:'全部',
              value:'',
            },
          ],
          modelName:'topicTypeId',
        },
        {
          type:'select',
          name:'审核状态',
          dataList:[
            {
              text:'全部类型',
              value:'',
            },
            {
              text:'草稿',
              value:'1',
            },
            {
              text:'待审核',
              value:'2',
            },
            {
              text:'已通过',
              value:'0',
            },
            {
              text:'未通过',
              value:'-1',
            },
          ],
          modelName:'isPassReview',
        },
        {
          type:'text',
          name:'创建人',
          modelName:'searchCreator',
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
          name:'创建时间',
          defaultValue:[],
          modelName:'createTime',
          timeHandler:(startTime,endTime)=> {
              this.exportStartTime = startTime;
              this.exportEndTime = endTime;
          }
        },
      ],
      exportStartTime:'',
      exportEndTime:'',
      headData:{
        left:{
          id:'topicId',
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
            width:150,
          },
          {
            title: '创建人',
            key: 'personName',
            width:100,
          },
          {
            width:70,
            title:'查看',
            key:'viewCount',
          },
          {
            title:'回复',
            key:'commentCount',
            width:50,
          },
          {
            title:'点赞',
            key:'praise',
            width:50,
          },
          {
            title:'状态',
            key:'status',
            width:100,
          },
          {
            title:'创建时间',
            key:'createTime',
          },
        ],
        right: {
          isShowOperate: true,
          width:100,
        },
      },
      dataList:[],
      pageData:{},
      searchParams:{//请求参数
        'searchValue.title':'',
        'searchValue.typeId':'',
        'searchValue.startTimes':'',
        'searchValue.endTime':'',
        'searchValue.userId':'',
        'searchValue.deptName':'',
        'searchValue.auditStatus':'',
        page: 1,
        pageSize: 10
      },
      totalRows:0,
      topicStatus:{
        '0':'已通过',
        '1':'草稿',
        '-1':'未通过',
        '2':'待审核',
      },
      showFuncBox:false,//修改类型弹出框
      typeData:[],
      selectValType: {
        name: '',
        idx: 0
      },
      updateTypeData:{
        typeId:'',
        id:''
      },
      ids:'',//话题id字符串
      exportParams:{},//导出数据参数
    }
  },
  mounted(){
    this.searchTopicPager();
    let self=this;
    window.localStorage.setItem('personName',wxqyhConfig.personName);
    getTypeList((data)=>{
      data.typeList.forEach(function(item){
        self.typeData.push({
          val:item.id,
          optionName:item.typeName
        })
      })
    });
    getAllTypeList((data)=>{
      data.typeList.forEach(function(item,index){
        self.screenItemList[1].dataList.push({
          text:item.typeName,
          value:item.id,
        });
      })
    })
  },
  computed:{
    ...mapGetters("advancedScreen", ["advancedScreenData"]),
  },
  watch:{
    'advancedScreenData.title':function(newValue,oldValue){
      this.searchTitle = newValue;
    }
  },
  methods:{
    publicAdd(){
      this.$router.push('addOrEditTopic');
    },
    exportReportForm(){
      let startTime = this.exportStartTime;
      let endTime = this.exportEndTime;
      if(startTime==""||endTime==""){
        dataBase.top_alert('请在【高级搜索】设置导出数据的创建时间段',false,3000);
      }else{
        if(this.exportDaysLimitByMonthCounts(startTime,endTime)){
          if(this.totalRows>0){
            this.updateExportParams();
            this._createReport(this.exportParams);
          } else{
            dataBase.top_alert('搜索结果为空，不支持导出',false,3000);
          }
        }
      }
    },
    updateExportParams(){
      this.exportParams = {
        'searchValue.title':this.searchParams['searchValue.title'] ? this.searchParams['searchValue.title'] : '',
        'searchValue.typeId':this.searchParams['searchValue.typeId'] ? this.searchParams['searchValue.typeId'] : '',
        'searchValue.auditStatus':this.searchParams['searchValue.auditStatus'] ? this.searchParams['searchValue.auditStatus'] : '',
        'searchValue.userId':this.searchParams['searchValue.userId'] ? this.searchParams['searchValue.userId'] : '',
        'searchValue.deptName':this.searchParams['searchValue.deptName'] ? this.searchParams['searchValue.deptName'] : '',
        'searchValue.startTimes':this.searchParams['searchValue.startTimes'] ? this.searchParams['searchValue.startTimes'] : '',
        'searchValue.endTime':this.searchParams['searchValue.endTime'] ? this.searchParams['searchValue.endTime'] : '',
        'searchValue.belongAgent': '',
        'reportType':'topic',
      }
    },
    doDels(topicIds,type){
      let self=this;
      if(topicIds){
        _.alert('提示','删除数据后将无法恢复，确认要删除吗？',function(){
          ajaxBatchDelete({ids:topicIds},(data)=>{
            if(type==='all'){
              self.ids='';
            }
            dataBase.top_alert('删除成功', true, 3000);
            self.searchTopicPager();
          })
        },'确定',true);
      }else{
        _.alert('提示','请选择要删除的数据');
      }
    },
    search(){
      this.searchParams.page=1;
      this.searchParams['searchValue.title']=this.searchTitle;
      this.searchTopicPager();
    },
    searchInput(){
      this.advancedScreenData.title = this.searchTitle;
    },
    //显示高级搜索框
    showAdvancedScreen(){
      this.isShowAdvancedScreen = !this.isShowAdvancedScreen;
    },
    searchResult(data){
      Object.assign(this.searchParams,{
        'searchValue.title':data.title,
        'searchValue.typeId':data.topicTypeId,
        'searchValue.startTimes':data.createTime[0],
        'searchValue.endTime':data.createTime[1],
        'searchValue.userId':data.searchCreator.userId,
        'searchValue.deptName':data.deptName.deptFullName,
        'searchValue.auditStatus':data.isPassReview,
        page: 1,
        pageSize: 10
      })
      this.searchTopicPager();
    },
    change(page,pageSize){
      this.searchParams.pageSize=pageSize;
      this.searchParams.page=page;
      this.searchTopicPager();
    },
    //获取话题列表信息
    searchTopicPager(){
      getTopicList(this.searchParams,(data)=>{
        this.pageData = {
          page: data.currPage,
          pageSize: this.searchParams.pageSize,
          maxPage: data.maxPage,
          totalRows: data.totalRows
        };
        this.totalRows = data.totalRows;
        this.dataList = data.pageData || [];
        let self=this;
        this.dataList.forEach(function(item,index){
          item.status=self.topicStatus[item.status];
          if(item.isTop>0){
            item.showSetTop = true;
          }
          item.operationList = [
            {
              perm:'disTop',
              text:item.isTop>0?'取消置顶':'置顶',
              operationFunc:()=>{
                let type = '1';
                if(item.isTop>0){
                  type = '0';
                }
                self.doSignTop(item.topicId,type);
              }
            },
            {
              perm:'updateType',
              text:'编辑类型',
              operationFunc:()=>{
                self.showFuncBox=true;
                self.updateTypeData.id=item.topicId;
                self.updateTypeData.typeId=item.topicType;
                getTopicHistoryInfo({
                  editType:1,
                  id:item.topicId
                },(data)=>{
                  self.selectValType.name=data.tbXyhTopicPO.typeName;
                })
              }
            },
            {
              perm:'updateTopic',
              text:'编辑话题',
              operationFunc:()=>{
                self.$router.push({
                  path:'addOrEditTopic',
                  query:{
                    id:item.topicId
                  }
                })
              }
            },
            {
              perm:'topicDetail',
              text:'查看详情',
              operationFunc:()=>{
                let top=(window.screen.height-560)/2;
                let left=(window.screen.width-350)/2;
                window.open(_.baseURL+'/manager/topic/detail.jsp?id='+item.topicId, 'newwindow', 'left='+left+',top='+top+',height=580, width=350, toolbar=no, menubar=no, resizable=yes,location=no, status=no,scrollbars=no,directories=no,menubar=no');
              }
            },
            {
              perm:'topicDel',
              text:'删除',
              operationFunc:()=>{
                self.doDels(item.topicId);
              }
            },
          ];
        })
      })
    },
    doSignTop(id,type){
      updateTop({
        id,
        type
      },(data)=>{
        this.searchTopicPager();
      })
    },
    closeBox(){
      this.showFuncBox=false;
      this.updateTypeData.typeId='';
      this.updateTypeData.id='';
    },
    firstFunc(){
      editTopicType({...this.updateTypeData},(data)=>{
        this.closeBox();
        dataBase.top_alert('修改成功',true,3000);
      })
    },
    //类型选择回调
    selectItemType(optionName,val){
      this.updateTypeData.typeId=val;
    },
    //跳转未阅
    skipFunc(listItem){
      window.sessionStorage.removeItem('readObj');
      this.$router.push({
        path:'topicSee/topicSeeRead',
        query:{
          id:listItem.topicId,
        },
      });
    },
  },
  components:{
    qwuiButton,
    qwuiInput,
    advancedScreen,
    dataTable,
    page,
    qwShareAlert,
    funcBox,
    qwuiSelect
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
  @mixin tip-style{
    display: inline-block;
    border-radius: 3px;
    color: #fff;
    font-size: 12px;
    margin-right: 5px;
    padding: 2px 5px;
    background:#32cd32;
  }
  .table_wrap{
    @include pt15;
  }
  .dotted_line{
    border-right:1px dashed #cfcfcf;
    margin: 0 8px 0 5px;
  }
  .top_main_bar{
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    @include pt20;
    .bar_left{
      flex: 1;
    }
    .bar_right{
      .senior_search_btn{
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
        user-select: none;
        &:hover{
          text-decoration:underline;
        }
      }
    }
  }
  .fun_box{
    padding: 30px 30px;
    .box_text{
      display: inline-block;
      color: #666;
      height: 26px;
      line-height: 30px;
      width: 75px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .select_type{
      position: absolute;
      width: 240px;
      top:75px;
      left: 100px;
    }
  }
  .table_wrap{
    @include pt15;
    .content{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .set_top{
        @include tip-style;
      }
      .secret{
        @include tip-style;
        background: #ff574d;
      }
      .goLink{
        color: #f87b00;
        text-decoration: underline;
      }
    }
  }
</style>





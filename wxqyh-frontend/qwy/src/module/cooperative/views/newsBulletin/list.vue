<template>
  <div>
    <div class="qwui-top_main_bar">
      <div class="qwui-bar_left">
        <qwuiButton v-perm="'dynamicinfoEdit'" type='primary' @click="publicAdd">&nbsp;发布&nbsp;</qwuiButton>
        <qwuiButton @click="skipApi">&nbsp;通过API发布&nbsp;</qwuiButton>
        <span class="qwui-dotted_line"></span>
        <qwuiButton v-perm="'dynamicinfoExport'" @click="exportReportForm">&nbsp;导出&nbsp;</qwuiButton>
        <span v-perm="'dynamicinfoDel'" class="qwui-dotted_line"></span>
        <qwuiButton v-perm="'dynamicinfoDel'" @click="doDels(ids,'all')">&nbsp;删除&nbsp;</qwuiButton>
      </div>
      <div class="qwui-bar_right">
        <qwui-input inputType="search" @search='search' v-model="searchTitle" @input="searchInput" :inputTips="'搜索动态'"></qwui-input>
        <a class="qwui-senior_search_btn" @click="showAdvancedScreen">高级搜索</a>
      </div>
    </div>
    <advancedScreen v-show="isShowAdvancedScreen" :screenItemList="screenItemList" @searchResult="searchResult"></advancedScreen>
    <div class="qwui-table_wrap">
      <dataTable :headData="headData" :dataList="dataList">
        <div v-for="(item,key) in dataList" :key="key" :slot="'title'+key" class="qwui-content">
          <span
            class="qwui-set_top"
            v-show="item.showSetTop">置顶</span>
          <span
            class="qwui-secret"
            v-show="item.showSecret">保密</span>
          {{item.title}}
        </div>
        <div v-for="(item,key) in dataList" :key=key :slot="'viewCount'+key" class="qwui-content center">
          <span>{{item.publishCount}}</span>
          <span>/</span>
          <span
            title="点击查看明细"
            @click="skipFunc(item)"
            class="goLink">{{item.viewCount}}</span>
          <span>/</span>
          <span>{{item.commentCount}}</span>
        </div>

        <div v-for="(item,key) in dataList" :key=key :slot="'viewDealerCount'+key" class="qwui-content center">
          <span
              title="点击查看明细"
              @click="handleClickDealerView(item, 'newsBulletinDealerRead')"
              class="goLink">
            {{item.readGroupCount}}
          </span>
          <span>/</span>
          <span
                  title="点击查看明细"
                  @click="handleClickDealerView(item, 'newsBulletinDealerUnread')"
                  class="goLink">
            {{item.groupCount}}
          </span>

        </div>


      </dataTable>
      <page :pageData="pageData" @change="change"></page>
    </div>
    <qwShareAlert :shareObj="shareObj"></qwShareAlert>
  </div>
</template>

<script>
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
  import advancedScreen from '@/components/Screen/AdvancedScreen/AdvancedScreen';
  import dataTable from '@/components/Table/dataTable.vue';
  import page from '@/components/list/page.vue';
  import qwShareAlert from '@/components/Alert/QwShareAlert.vue';
  import {getDynamicType,searchDynamicPager,updateTop,updateEnable,batchDeleteDynamicinfoPO} from '../../api/newsBulletin/getData';
  import exportReportForm from '@/assets/js/export/export.js';
  import { mapActions, mapGetters } from "vuex";

  export default {
    name:'newsBulletinList',
    mixins:[exportReportForm],
    data(){
      return{
        shareObj:{
          isShow:false,
          title:'',
        },
        searchTitle:'',
        pageSize:10,
        pageData:{},
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
              {
                text:'员工祝福',
                value:'-1',
              },
            ],
            modelName:'dynamicType',
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
                text:'审核中',
                value:'1',
              },
              {
                text:'已通过',
                value:'0',
              },
              {
                text:'未通过',
                value:'2',
              },
            ],
            modelName:'isPassReview',
          },
          {
            type:'text',
            name:'创建人',
            modelName:'searchCreator',
            // searchObj:{
            //   searchUrl:'/contact/contactAction!ajaxSearchUserByPersonName.action',
            //   type:'user',
            //   params:{
            //     keyWord: 1,
            //     pageSize: 10
            //   }
            // },
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
        isShowAdvancedScreen:false,
        ids:'',
        headData:{
          left:{
            id:'dynamicInfoId',
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
              title:'内容标题',
              key:'title',
              width:150,
            },
            {
              title: '创建人',
              key: 'creator',
              width:100,
            },
            {
              title:'类型',
              key:'dynamicType',
              width:100,
            },
            {
              width:140,
              key:'viewCount',
              title:'发布量/查看/回复',
            },
            {
                width:140,
                key:'viewDealerCount',
                title:'已读家数/总家数',
            },
            {
              title:'点赞',
              key:'praise',
              width:50,
            },
            {
              title:'审核状态',
              key:'reviewStatus',
              width:70,
            },
            {
              title:'状态',
              key:'status',
              width:100,
            },
            {
              title:'创建时间',
              key:'createTimeBack',
            },
          ],
          right: {
            isShowOperate: true,
            width:100,
          },
        },
        dataList:[],
        searchParams:{},
        searchData:[],
        page:1,
        totalRows:0,
        exportParams:{},
        isUseAdvancedScreen:false,
      }
    },
    mounted(){
      let self = this;
      getDynamicType({
        isForSelect:0,
        belongAgent:dataBase.agentCode
      },(data)=>{
        data.list.forEach(function(item,index){
          if(item.typeName=='员工祝福'){
            item.typeName = '员工祝福（系统自带）';
          }
          self.screenItemList[1].dataList.push({
            text:item.typeName,
            value:item.id,
          });
        });
      });

      this.updateParams();
      this.searchDynamicPager();
    },
    methods:{
      skipFunc(item){
        window.sessionStorage.removeItem('readObj');
        this.$router.push({
          name:'newsBulletinRead',
          params:{
            id:item.dynamicInfoId,
            title:item.title,
          },
        });
      },
      publicAdd(){
        this.$router.push({
          name:'newsBulletinAdd',
        });
      },
      change(page,pageSize){
        this.pageSize = pageSize;
        this.page = page;
        this.updateParams();
        this.searchDynamicPager();
      },
      search(value){
        this.page = 1;
        this.isUseAdvancedScreen = false;
        this.updateParams();
        this.searchDynamicPager();
      },
      searchResult(data){
        this.isUseAdvancedScreen = true;
        this.searchData = data;
        this.page = 1;
        this.updateParams();
        this.searchDynamicPager();
      },
      updateParams(){
        if(!this.isUseAdvancedScreen){
          this.searchParams = {
            'searchValue.title':this.searchTitle,
            'page': this.page,
            'pageSize': this.pageSize,
            'belongAgent': dataBase.agentCode,
          }
        }else {
          this.searchParams = {
            'searchValue.title': this.searchTitle,
            'searchValue.dynamicType': this.searchData.dynamicType ? this.searchData.dynamicType : '',
            'searchValue.isPassReview': this.searchData.isPassReview ? this.searchData.isPassReview : '',
            // 'searchValue.searchCreator': this.searchData.searchCreator ? this.searchData.searchCreator['userId'] : '',
            'searchValue.searchCreator': this.searchData.searchCreator,
            'searchValue.deptName': this.searchData.deptName ? this.searchData.deptName['deptFullName'] : '',
            'searchValue.startTimes': this.searchData.createTime ? this.searchData.createTime[0] : '',
            'searchValue.endTime': this.searchData.createTime ? this.searchData.createTime[1] : '',
            'page': this.page,
            'pageSize': this.pageSize,
            'belongAgent': dataBase.agentCode,
          }
        }
      },
      searchDynamicPager(){
        let self = this;
        searchDynamicPager(this.searchParams,(data)=>{
          this.pageData = {
            page: data.currPage,
            pageSize: this.pageSize,
            maxPage: data.maxPage,
            totalRows: data.totalRows
          };
          this.totalRows = data.totalRows;
          this.dataList = data.pageData || [];
          this.dataList.forEach((item,index)=>{
            if(item.isTiming=='1'){
              item.status = item.status + ' | 定时';
            }
            if(item.isTop>0){
              item.showSetTop = true;
            }
            if(item.isSecret=='1'){
              item.showSecret = true;
            }
            item.operationList = [
              {
                perm:'dynamicinfoEdit',
                text:item.isTop>0?'取消置顶':'置顶',
                operationFunc:()=>{
                  let type = '1';
                  if(item.isTop>0){
                    type = '0';
                  }
                  self.doSignTop(item.dynamicInfoId,type);
                }
              },
              {
                perm:'dynamicinfoEdit',
                text:item.isEnable=='0'?'开启查阅':'关闭查阅',
                isHide:item.status!='草稿'?false:true,
                operationFunc:()=>{
                  let type = '0'
                  if(item.isEnable=='0'){
                    type = '1';
                  }
                  self.doEnable(item.dynamicInfoId,type);
                }
              },
              {
                perm:'dynamicinfoList',
                text:'查看详情',
                operationFunc:()=>{
                  self.doDetailList(item.dynamicInfoId);
                }
              },
              {
                perm:'dynamicinfoEdit',
                text:'分享',
                isHide:item.isOpen=='1'?false:true,
                operationFunc:()=>{
                  self.doShare(item.dynamicInfoId,item.title);
                }
              },
              {
                perm:'dynamicinfoList',
                text:'预览',
                operationFunc:()=>{
                  self.preview(item.dynamicInfoId);
                }
              },
              {
                perm:'dynamicinfoEdit',
                text:'编辑',
                isHide:item.isSuperAdminUpdate!='3'&&item.sendType!='1'&&item.sendType!='2'&&item.isPassReview!='3'?false:true,
                operationFunc:()=>{
                  self.doEdit(item);
                }
              },
              {
                perm:'dynamicinfoEdit',
                text:'复制',
                operationFunc:()=>{
                  self.doCopy(item.dynamicInfoId);
                }
              },
              {
                perm:'dynamicinfoDel',
                text:'删除',
                operationFunc:()=>{
                  self.doDels(item.dynamicInfoId);
                }
              },
            ];
          });
        });
      },
      doSignTop(id,type){
        let self = this;
        updateTop({
          'id':id,
          'type':type
        },(data)=>{
          self.updateParams();
          self.searchDynamicPager();
        });
      },
      doEnable(id,isEnable){
        let self = this;
        updateEnable({
          "dynamicId":id,
          "isEnable":isEnable
        },()=>{
          self.updateParams();
          self.searchDynamicPager();
        });
      },
      doDetailList(id){
        window.localStorage.setItem('personName',wxqyhConfig.personName);
        let top=(window.screen.height-630)/2;
        let left=(window.screen.width-520)/2;
        window.open(_.baseURL+'/manager/dynamic/detail.jsp?id='+id,'newwindow','height=580,width=350,left='+left+',top='+top+',toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no');
      },
      preview(id){
        window.localStorage.setItem('personName',wxqyhConfig.personName);
        let top=(window.screen.height-630)/2;
        let left=(window.screen.width-520)/2;
        window.open(_.baseURL+'/manager/dynamic/preview.jsp?id='+id,'newwindow','height=580,width=350,left='+left+',top='+top+',toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no');
      },
      doShare(dynamicInfoId,title){
        let url;
        if(_.is_qiweiyun){
          url = _.openURL + '/open/dynamic/'+dynamicInfoId+'?jsp=detail.jsp&idName=id';
        }else{
          url = _.openURL + '/open/dynamic/detail.jsp?id='+dynamicInfoId;
        }
        if(dataBase.agentCode=='partyconstruction'){
          url = _.baseURL + '/vp/module/partyConstruction.html#/open/detail?typeId=1&schType=&id='+dynamicInfoId;
        }
        this.shareObj.title = title;
        this.shareObj.isShow = true;
        this.shareObj.shareUrl = url;
        this.shareObj.type = 'news';
      },
      doEdit(item){
        if(item.reviewStatus==='已通过' && item.status==='已发布') {
            _.alert('提示','该通知已审核通过无法编辑，如需修改，请新建发布。')
            return false
        }
        let personId = item.dynamicInfoId
        this.$router.push({
          name:'newsBulletinAdd',
          query:{
            id:personId,
            pageType:'edit',
          },
        });
      },
      doCopy(personId){
        this.$router.push({
          name:'newsBulletinAdd',
          query:{
            id:personId,
            pageType:'copy',
          },
        });
      },
      doDels(dynamicInfoIds,type){
        let self = this;
        if(dynamicInfoIds){
          _.alert('提示','删除数据后将无法恢复，确认要删除吗？',function(){
            batchDeleteDynamicinfoPO({
              ids:dynamicInfoIds,
              belongAgent:dataBase.agentCode
            },(data)=>{
              type === 'all' ? self.ids = '' : '';
              dataBase.top_alert('删除成功', true, 3000);
              self.updateParams();
              self.searchDynamicPager();
            });
          },'确定',true);
        }else{
          _.alert('提示','请选择要删除的数据');
        }
      },
      skipApi(){
        window.open(_.baseURL + '/api/add_news.html');
      },
      exportReportForm(){
        let startTime = this.exportStartTime;
        let endTime = this.exportEndTime;
            if(this.totalRows>0){
              this.updateExportParams();
              this._createReport(this.exportParams);
            } else{
              dataBase.top_alert('搜索结果为空，不支持导出',false,3000);
            }

      },
      updateExportParams(){
        this.exportParams = {
          'searchValue.title':this.searchData.title ? this.searchData.title : '',
          'searchValue.dynamicType':this.searchData.dynamicType ? this.searchData.dynamicType : '',
          'searchValue.isPassReview':this.searchData.isPassReview ? this.searchData.isPassReview : '',
          // 'searchValue.searchCreator':this.searchData.searchCreator ? this.searchData.searchCreator['userId'] : '',
          'searchValue.searchCreator': this.searchData.searchCreator,
          'searchValue.deptName':this.searchData.deptName ? this.searchData.deptName['deptFullName'] : '',
          'searchValue.startTimes':this.searchData.createTime ? this.searchData.createTime[0] : '',
          'searchValue.endTime':this.searchData.createTime ? this.searchData.createTime[1] : '',
          'belongAgent': dataBase.agentCode,
          'reportType':'dynamic',
          'searchValue.userName': _.personName,
        }
      },
      searchInput(data){
        this.advancedScreenData.title = this.searchTitle;
      },
      showAdvancedScreen(){
        this.isShowAdvancedScreen = !this.isShowAdvancedScreen;
      },

      handleClickDealerView(item, routeName){
        this.$router.push({
            name: routeName,
            params:{
                id:item.dynamicInfoId,
                title:item.title,
            },
            query:{
                id:item.dynamicInfoId,
            }
        })
      },

    },
    computed:{
      ...mapGetters("advancedScreen", ["advancedScreenData"]),
    },
    watch:{
      'advancedScreenData.title':function(newValue,oldValue){
        this.searchTitle = newValue;
      }
    },
    components:{
      qwuiButton,
      qwuiInput,
      advancedScreen,
      dataTable,
      page,
      qwShareAlert,
    }
  }
</script>

<style lang="scss" scoped>
  @mixin tip-style{
    display: inline-block;
    border-radius: 3px;
    color: #fff;
    font-size: 12px;
    margin-right: 5px;
    padding: 2px 5px;
    background:#32cd32;
  }
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
        user-select: none;
        &:hover{
          text-decoration:underline;
        }
      }
    }
  }
  .qwui-table_wrap{
    @include pt15;
    .qwui-content{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .qwui-set_top{
        @include tip-style;
      }
      .qwui-secret{
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

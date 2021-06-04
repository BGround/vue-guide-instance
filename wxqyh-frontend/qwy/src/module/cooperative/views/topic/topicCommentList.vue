<template>
  <div>
    <div class="top_main_bar">
      <div class="bar_left">
        <qwuiButton v-perm="'topicDel'" @click="doDels(ids,'all')">&nbsp;删除&nbsp;</qwuiButton>
        <span class="dotted_line"></span>
        <qwuiButton v-perm="'updateTopic'" @click="reviewBatchComment(ids,'all')">&nbsp;批量通过&nbsp;</qwuiButton>
        <span v-perm="'updateTopic'" class="dotted_line"></span>
        <qwuiButton v-perm="'topicDel'" @click="reviewAllComment">&nbsp;全部通过&nbsp;</qwuiButton>
      </div>
      <div class="bar_right">
        <qwui-input inputType="search" @search='search' v-model="searchTitle" @input="searchInput" :inputTips="'搜索话题'"></qwui-input>
        <a class="senior_search_btn" @click="showAdvancedScreen">高级搜索</a>
      </div>
    </div>
    <advancedScreen v-show="isShowAdvancedScreen" :screenItemList="screenItemList" @searchResult="searchResult"></advancedScreen>
    <div class="table_wrap">
      <dataTable :headData="headData" :dataList="dataList">
        <div v-for="(item,index) in dataList" 
              :key="index"
              :slot="'content'+index"
              class="commentContent">
          <img v-if="item.type=='2'"
           :src="item.content" 
           class="commentImg"
           @click="showImg(item.content)">
          <span v-else>{{item.content}}</span>
        </div>
      </dataTable>
      <page :pageData="pageData" @change="change"></page>
    </div>
    <div v-show="showCommentImg" class="commentImgDiv" @click="hideImg">
      <img :src="commentImgUrl" class="normalImg">
    </div>
  </div>
</template>
<script>
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
import advancedScreen from '@/components/Screen/AdvancedScreen/AdvancedScreen';
import dataTable from '@/components/Table/dataTable.vue';
import page from '@/components/list/page.vue';
import { mapActions, mapGetters } from "vuex";
import {ajaxSearchComment,ajaxDeleteComment,ajaxReviewAllComment,ajaxReviewComment} from '../../api/topic/getData';
export default {
  name:'topicCommentList',
  data(){
    return {
      searchTitle:'',
      isShowAdvancedScreen:false,
      ids:'',
      screenItemList:[
        {
          type:'text',
          name:'评论内容:',
          modelName:'content',
        },
        {
          type:'text',
          name:'所在标题:',
          modelName:'title',
        },
        {
          type:'select',
          name:'审核状态',
          dataList:[
            {
              text:'全部',
              value:'',
            },
            {
              text:'待审核',
              value:0,
            },
            {
              text:'已通过',
              value:1,
            },
          ],
          modelName:'auditStatus',
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
      ],
      headData:{
        left:{
          id:'commentId',
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
            title:'评论人',
            key:'personName',
            width:80,
          },
          {
            title: '评论内容',
            key: 'content',
            width:300,
          },
          {
            title: '所在话题',
            key: 'topicTitle',
            width:200,
          },
          {
            title:'审核状态',
            key:'statusName',
            width:75,
          },
          {
            title:'评论时间',
            key:'createTime',
            width:160,
          },
        ],
        right: {
          isShowOperate: true,
          width:100,
        },
      },
      dataList:[],
      pageData:{},
      searchData:{
        'searchValue.title':'',
        'searchValue.userId':'',
        'searchValue.deptName':'',
        'searchValue.auditStatus':'',
        'searchValue.content':'',
        page:1,
        pageSize:10
      },
      commentImgUrl:'',//评论图片路径
      showCommentImg:false,//显示图片
    }
  },
  mounted(){
    this.getCommentList();
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
    search(){
      this.searchData.page=1;
      this.searchData['searchValue.title']=this.searchTitle;
      this.getCommentList();
    },
    searchInput(){
      this.advancedScreenData.title = this.searchTitle;
    },
    showAdvancedScreen(){
      this.isShowAdvancedScreen=!this.isShowAdvancedScreen;
    },
    searchResult(data){
      Object.assign(this.searchData,{
        'searchValue.title':data.title,
        'searchValue.userId':data.searchCreator?data.searchCreator.userId:'',
        'searchValue.deptName':'',
        'searchValue.auditStatus':data.auditStatus,
        'searchValue.content':data.content,
        page:1,
        pageSize:10
      });
      this.getCommentList();
    },
    change(page,pageSize){
      this.searchData.pageSize=pageSize;
      this.searchData.page=page;
      this.getCommentList();
    },
    getCommentList(){
      ajaxSearchComment({...this.searchData},(data)=>{
        let self=this;
        this.pageData={
          page:data.currPage,
          pageSize:this.searchData.pageSize,
          maxPage:data.maxPage,
          totalRows:data.totalRows
        };
        this.dataList=data.pageData||[];
        this.dataList.forEach(function(item,index){
          item.operationList=[
            {
              perm:'updateType',
              text:'话题详情',
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
                self.doDels(item.commentId);
              }
            },
          ];
          if(item.auditStatus==='0'){
            item.operationList.splice(1,0,{
              perm:'updateTopic',
              text:'通过',
              operationFunc:()=>{
                self.reviewBatchComment(item.commentId);
              }
            });
          }
        })
      })
    },
    doDels(commentIds,type){
      let self=this;
      if(commentIds){
        _.alert('提示','删除数据后将无法恢复，确认要删除吗？',function(){
          ajaxDeleteComment({ids:commentIds},(data)=>{
            if(type==='all'){
              self.ids='';
            }
            dataBase.top_alert('删除成功', true, 3000);
            self.getCommentList();
          })
        },'确定',true);
      }else{
        _.alert('提示','请选择要删除的数据');
      }
    },
    reviewAllComment(){
      ajaxReviewAllComment(()=>{
        _.alert("提示", "操作成功，系统正在审核评论信息，请稍后查询");
      })
    },
    reviewBatchComment(ids,type){
      ajaxReviewComment({commentIds:ids,status:1},(data)=>{
        if(type=='all'){
          this.ids='';
        }
        dataBase.top_alert('评论已通过', true, 3000);
        this.getCommentList();
      })
    },
    showImg(url){
      this.commentImgUrl = url;
      this.showCommentImg = true;
    },
    hideImg(){
      this.commentImgUrl = '';
      this.showCommentImg = false;
    }
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
<style lang="scss" scoped>
  .top_main_bar{
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
    .bar_left{

      .dotted_line{
        border-right:1px dashed #cfcfcf;
        margin: 0 8px 0 5px;
      }
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
  .table_wrap{
    padding-top: 15px;
    .commentContent{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .commentImg{
        width: 50px;
      }
    }
  }
  .commentImgDiv{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1100;
    filter: progid:DXImageTransform.Microsoft.gradient(enabled='true',startColorstr='#7F000000', endColorstr='#7F000000');
    background-color: rgba(0, 0, 0, 0.5);
  }
  .normalImg{
    z-index: 2000;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -webkit-transform: translate(-50%,-50%);
    max-width: 1029px;
    max-height: 858px;
  }
</style>



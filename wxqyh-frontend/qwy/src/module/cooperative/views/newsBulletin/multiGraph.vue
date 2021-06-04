<template>
  <div>
    <div class="qwui-multi_wrap">
      <div class="qwui-bar_left">
        <qwuiButton v-perm="'articleEdit'" @click="addMulti" type='primary'>&nbsp;推送多图文&nbsp;</qwuiButton>
        <span class="qwui-dotted_line"></span>
        <qwuiButton v-perm="'articleEdit'" @click="_doSignlDel(ids,'all')">&nbsp;删除&nbsp;</qwuiButton>
      </div>
      <div class="qwui-bar_right">
        <qwui-input inputType="search" @search='search' v-model="searchTitle" @input="searchInput" :inputTips="'搜索标题'"></qwui-input>
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
  import dataTable from '@/components/Table/dataTable.vue';
  import advancedScreen from '@/components/Screen/AdvancedScreen/AdvancedScreen';
  import page from '@/components/list/page.vue';
  import {getArticleGroupList,batchDelArticleGroup} from '../../api/newsBulletin/getData';
  import { mapActions, mapGetters } from "vuex";

  export default {
    data(){
      return{
        isShowAdvancedScreen:false,
        searchTitle:'',
        ids:'',
        dataList:[],
        startTime:'',
        endTime:'',
        screenItemList:[
          {
            type:'text',
            name:'标题',
            modelName:'title',
          },
          {
            type:'time',
            name:'创建时间',
            defaultValue:[],
            modelName:'createTime',
            timeHandler:(startTime,endTime)=> {
              this.startTime = startTime;
              this.endTime = endTime;
            }
          },
        ],
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
              console.log(this.ids);
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
              title:'图文数',
              key:'articleCount',
              width:100,
            },
            {
              title:'状态',
              key:'status',
              width:100,
            },
            {
              title:'创建时间',
              key:'createTime',
              width:150,
            },
          ],
          right: {
            isShowOperate: true,
            width:100,
          },
        },
        page:1,
        pageSize:10,
        pageData:{},
        isUseAdvancedScreen:false,
      }
    },
    created(){
      this.getArticleGroupList();
    },
    methods:{
      //新增多图文
      addMulti(){
        this.$router.push({
          name:'newsBulletinAddMulti',
        });
      },
      getArticleGroupList(){
        let self = this;
        let params = {};
        if(!this.isUseAdvancedScreen){
          params = {
            'searchValue.title':self.searchTitle,
            page: self.page,
            pageSize: self.pageSize,
            belongAgent: dataBase.agentCode,
          };
        }else{
          params = {
            'searchValue.title':self.searchTitle,
            'searchValue.startTime':self.startTime,
            'searchValue.endTime':self.endTime,
            page: self.page,
            pageSize: self.pageSize,
            belongAgent: dataBase.agentCode,
          };
        }
        getArticleGroupList(params,(data)=>{
          self.pageData = {
            page: data.currPage,
            pageSize: self.pageSize,
            maxPage: data.maxPage,
            totalRows: data.totalRows
          };
          self.dataList = data.pageData || [];
          self.dataList.forEach((item,index)=>{
            if(item.status=='0'){
              item.status = '草稿 ';
            }else if(item.status=='1'){
              item.status = '已推送 ';
            }
            if(item.isTiming=='1'){
              item.status += '| 定时';
            }
            item.operationList = [
              {
                perm:'articleEdit',
                text:'编辑',
                operationFunc:()=>{
                  self.doEdit(item.id);
                }
              },
              {
                perm:'articleEdit',
                text:'删除',
                operationFunc:()=>{
                  self._doSignlDel(item.id);
                }
              },
            ];
          });
        });
      },
      doEdit(id){
        this.$router.push({
          name:'newsBulletinAddMulti',
          query:{
            id:id,
          },
        });
      },
      _doSignlDel(ids,type){
        let self = this;
        if(ids){
          _.alert('提示','删除数据后将无法恢复，确认要删除吗？',function(){
            batchDelArticleGroup({
              ids:ids,
              belongAgent:dataBase.agentCode
            },(data)=>{
              if(type==='all'){
                self.ids = '';
              }
              dataBase.top_alert('删除成功', true, 3000);
              self.getArticleGroupList();
            });
          },'确定',true);
        }else{
          _.alert('提示','请选择要删除的数据');
        }
      },
      search(){
        this.page = 1;
        this.isUseAdvancedScreen = false;
        this.getArticleGroupList();
      },
      searchInput(data){
        this.advancedScreenData.title = this.searchTitle;
      },
      change(page,pageSize){
        this.pageSize = pageSize;
        this.page = page;
        this.getArticleGroupList();
      },
      showAdvancedScreen(){
        this.isShowAdvancedScreen = !this.isShowAdvancedScreen;
      },
      searchResult(data){
        this.isUseAdvancedScreen = true;
        this.page = 1;
        this.startTime = data.createTime[0];
        this.endTime = data.createTime[1];
        this.searchTitle = data.title;
        this.getArticleGroupList();
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
      dataTable,
      advancedScreen,
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

  .qwui-multi_wrap {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    @include pt20;
    .qwui-bar_left {
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
  }
</style>

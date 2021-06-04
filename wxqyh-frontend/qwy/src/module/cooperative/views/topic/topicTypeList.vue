<template>
  <div>
    <div class="qwui-audit_wrap">
      <div class="qwui-bar_left">
        <qwuiButton @click="goBack">&nbsp;返回&nbsp;</qwuiButton>
        <span class="qwui-dotted_line"></span>
        <qwuiButton v-perm="'typeDel'" @click="_doDel(ids,'all')">&nbsp;删除&nbsp;</qwuiButton>
        <span class="qwui-dotted_line"></span>
        <qwuiButton v-perm="'typeAdd'" type='primary' @click="goAdd">&nbsp;新增&nbsp;</qwuiButton>
      </div>
      <div class="qwui-bar_right">
        <qwui-input inputType="search" @search='search' v-model="title" :inputTips="'搜索类型名称'"></qwui-input>
      </div>
    </div>
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
  import page from '@/components/list/page.vue';
  import {searchTypeList,delTopicType} from '../../api/topic/getData';

  export default {
    data(){
      return{
        title:'',
        ids:'',
        dataList:[],
        startTime:'',
        endTime:'',
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
              title:'类型名称',
              key:'typeName',
              width:100,
            },
            {
              title: '创建时间',
              key: 'createTime',
              width:150,
            },
            {
              title:'排序号',
              key:'type',
              width:100,
            },
            {
              title:'类型状态',
              key:'isOpenTips',
              width:100,
            },
            {
              title:'发布审核',
              key:'isDynamicReviewTips',
              width:100,
            },
            {
              title:'评论审核',
              key:'isCommentReviewTips',
              width:100,
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
        totalRows:1,
      }
    },
    created(){
      this.searchTopicTypePager();
    },
    methods:{
      goBack(){
        this.$router.push('topicSetting');
      },
      searchTopicTypePager(){
        let self = this;
        searchTypeList({
          'searchValue.title':self.title,
          page: self.page,
        },(data)=>{
          self.pageData = {
            page: data.currPage,
            pageSize: self.pageSize,
            maxPage: data.maxPage,
            totalRows: data.totalRows
          };
          self.totalRows=data.totalRows;
          self.dataList = data.pageData || [];
          self.dataList.forEach((item,index)=>{
            item.type=item.sortNum;
            item.isOpenTips=item.status==='1'?'已启用':'已禁用';
            item.isCommentReviewTips=item.isEnable=='1'?'已启用':'已禁用';
            item.isDynamicReviewTips=item.isUsing=='1'?'已启用':'已禁用';
            item.operationList = [
              {
                perm:'typeEdit',
                text:'编辑',
                operationFunc:()=>{
                  self.doEdit(item.id);
                }
              },
              {
                perm:'typeDel',
                text:'删除',
                isHide:item.optType!='1'?false:true,
                operationFunc:()=>{
                  self._doDel(item.id);
                }
              },
            ];
          });
        });
      },
      doEdit(id){
        this.$router.push({
          path:'addOrEditType',
          query:{
            id,
            agentCode:'topic'
          }
        })
      },
      _doDel(ids,type){
        let self = this;
        if(ids) {
          _.alert('提示', '删除数据后将无法恢复，确认要删除吗？', function () {
            delTopicType({
              ids: ids,
              belongAgent: dataBase.agentCode
            }, (data) => {
              if(type==='all'){
                self.ids = '';
              }
              dataBase.top_alert('删除成功', true, 3000);
              self.searchTopicTypePager();
            });
          }, '确定', true);
        }else{
          dataBase.top_alert('请选择要删除的数据', false, 3000);
        }
      },
      search(){
        this.page = 1;
        this.searchTopicTypePager();
      },
      change(page,pageSize){
        this.pageSize = pageSize;
        this.page = page;
        this.searchTopicTypePager();
      },
      goAdd(){
        this.$router.push({
          path:'addOrEditType',
          query:{
            sortNum:this.totalRows+1
          }
        });
      }
    },
    components:{
      qwuiButton,
      qwuiInput,
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

  .qwui-audit_wrap {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    @include pt20;
    .qwui-bar_left {
      flex: 1;
    }
  }
  .qwui-table_wrap{
    @include pt15;
  }
</style>

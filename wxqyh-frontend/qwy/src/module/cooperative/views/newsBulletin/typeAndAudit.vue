<template>
  <div>
    <div class="qwui-audit_wrap">
      <div class="qwui-bar_left">
        <qwuiButton @click="goBack">&nbsp;返回&nbsp;</qwuiButton>
        <span class="qwui-dotted_line"></span>
        <qwuiButton v-perm="'dynamicSet'" @click="_doDel(ids,'all')">&nbsp;删除&nbsp;</qwuiButton>
        <span class="qwui-dotted_line"></span>
        <qwuiButton v-perm="'dynamicSet'" type='primary'>&nbsp;新增&nbsp;</qwuiButton>
      </div>
      <div class="qwui-bar_right">
        <qwui-input inputType="search" @search='search' v-model="searchType" :inputTips="'搜索类型名称'"></qwui-input>
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
  import {searchDynamicTypePager,delDynamicType} from '../../api/newsBulletin/getData';

  export default {
    data(){
      return{
        searchType:'',
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
      }
    },
    created(){
      this.searchDynamicTypePager();
    },
    methods:{
      goBack(){
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/');
      },
      searchDynamicTypePager(){
        let self = this;
        searchDynamicTypePager({
          'searchValue.typeName':self.searchType,
          page: self.page,
          belongAgent: dataBase.agentCode,
        },(data)=>{
          self.pageData = {
            page: data.currPage,
            pageSize: self.pageSize,
            maxPage: data.maxPage,
            totalRows: data.totalRows
          };
          self.dataList = data.typePage || [];
          self.dataList.forEach((item,index)=>{
            item.operationList = [
              {
                perm:'dynamicSet',
                text:'编辑',
                operationFunc:()=>{
                  self.doEdit(item.id);
                }
              },
              {
                perm:'articleEdit',
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
        document.location.href = _.baseUrl+"/manager/dynamic/type_edit.jsp?id="+id+"&agentCode="+dataBase.agentCode;
      },
      _doDel(ids,type){
        let self = this;
        if(ids) {
          _.alert('提示', '删除数据后将无法恢复，确认要删除吗？', function () {
            delDynamicType({
              ids: ids,
              belongAgent: dataBase.agentCode
            }, (data) => {
              if(type==='all'){
                self.ids = '';
              }
              dataBase.top_alert('删除成功', true, 3000);
              self.searchDynamicTypePager();
            });
          }, '确定', true);
        }else{
          _.alert('提示','请选择要删除的数据');
        }
      },
      search(){
        this.page = 1;
        this.searchDynamicTypePager();
      },
      change(page,pageSize){
        this.pageSize = pageSize;
        this.page = page;
        this.searchDynamicTypePager();
      },
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

<template>
  <div class="qwui-list_wrap">
    <div class="qwui-top_main_bar">
      <div class="qwui-bar_left">
        <qwui-button @click="toSettingPage">返回</qwui-button>
        <span class="qwui-dotted_line" v-perm="'taskTemAdd'"></span>
        <qwui-button type="primary" @click="addOrEditType('')" v-perm="'taskTemAdd'">新增</qwui-button>
        <span class="qwui-dotted_line" v-perm="'taskTemDel'"></span>
        <qwui-button @click="deleteType(ids,true)" v-perm="'taskTemDel'">删除</qwui-button>
        <span class="qwui-dotted_line" v-perm="'taskTemAdd'"></span>
        <qwui-button @click="exportImportForm" v-perm="'taskexport'">导入</qwui-button>
      </div>

      <div class="qwui-bar_right">
        <qwui-input inputType="search"
                    @search='search'
                    v-model="searchTitle"
                    :inputTips="'搜索类型名称/负责人'"></qwui-input>
      </div>
    </div>
    <div class="qwui-table_wrap">
      <data-table :headData="headData" :dataList="dataList"></data-table>
      <page :pageData="pageData" @change="change"></page>
    </div>
    <Upload :isImportPopShow="isImportPopShow" :reportType="reportType"  @closeDialog="closeDialog"></Upload>
  </div>
</template>

<script>
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
  import dataTable from '@/components/Table/dataTable.vue';
  import page from '@/components/list/page.vue';
  import Upload from '@/components/Add/Upload/Upload';

  import { searchTaskType,updateTypeStatus,deleteTaskType } from '../../api/taskAssignment/getData';

  export default {
    data(){
      return {
        ids:'',
        searchValue:'',
        searchTitle:'',
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
              key:'name',
              width:200
            },
            {
              title:'状态',
              key:'statusName',
              width:80
            },
            {
              title:'负责人',
              key:'chargeName',
              width:200
            },{
              title:'分管领导',
              key:'leaderName',
              width:200
            },{
              title:'管理范围',
              key:'erpSerNos',
              width:200
            }
          ],
          right:{
            isShowOperate: true,
            width:80
          }
        },
        dataList:[],
        pageData:{},
        pageSize:10,
        page:1,
        totalRows:0,
        isImportPopShow: false,
        reportType:"",
      }
    },
    mounted(){
      this.getTaskType();
    },
    methods:{
      getTaskType(){
        let self = this;
        searchTaskType({
          'searchValue.name':this.searchValue,
          page:this.page,
          pageSize:this.pageSize
        },(data)=>{
          if (!data.pageData){
            this.dataList = [];
            return;
          }
          this.pageData = {
            page: data.currPage,
            pageSize: this.pageSize,
            maxPage: data.maxPage,
            totalRows: data.totalRows
          };
          data.pageData.forEach((item)=>{
            item.operationList = [
              {
                text:item.status == '0' ? '启用' : '禁用',
                perm:'',
                operationFunc(){
                  self.disOrEnable(item.id,item.status);
                }
              },
              {
                text:'编辑',
                perm:'taskTemEdit',
                operationFunc(){
                  self.addOrEditType(item.id);
                }
              },
              {
                text:'删除',
                perm:'taskTemDel',
                operationFunc(){
                  self.deleteType(item.id);
                }
              }
            ]
          });
          this.dataList = data.pageData;
        })
      },
      toSettingPage(){
//        this.$router.push({name:'taskSetting'});
        this.$router.go(-1)
      },
      addOrEditType(id){
        this.$router.push({
          name:'addOrEditType',
          query:{
            id:id
          }
        })
      },
      //导入
      exportImportForm(){
        this.reportType="TEMPLATE"
        this.isImportPopShow = true;
      },
      deleteType(id,status){
        let self = this;
        if (status && id == ''){
          _.alert('提示','请选择要删除的数据');
          return;
        }
        _.alert('提示','删除数据后将无法恢复，确认要删除吗？',function(){
          deleteTaskType({
            ids:id,
            belongAgent:'task'
          },(result)=>{
            _.alert('提交结果',result.desc);
            self.ids = '';
            self.getTaskType();
          })
        },'确定',true);
      },
      disOrEnable(id,status){
        status = status == '0' ? '1' : '0';
        let text = status == '1' ? '启用' : '禁用';
        updateTypeStatus({
          id:id,
          status:status
        },()=>{
          dataBase.top_alert(text+'成功',true,3000);
          this.getTaskType();
        })
      },
      search(value){
        this.searchValue = value;
        this.getTaskType();
      },
      change(page,pageSize){
        this.pageSize = pageSize;
        this.page = page;
        this.getTaskType();
      },
      closeDialog(){
        this.isImportPopShow = false;
      },
    },
    components:{
      qwuiButton,
      qwuiInput,
      dataTable,
      page,
      Upload,
    }
  }

</script>

<style lang="scss" scoped>
  .qwui-dotted_line{
    border-right:1px dashed #cfcfcf;
    margin: 0 8px 0 5px;
  }
  .qwui-list_wrap {
    position: relative;

  .qwui-top_main_bar{
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    padding-top: 20px;

    .qwui-bar_left {
      flex: 1;
    }
  }

  .qwui-table_wrap{
    padding-top: 15px;
  }
  }

</style>

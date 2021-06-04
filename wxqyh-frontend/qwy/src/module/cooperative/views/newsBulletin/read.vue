<template>
  <div>
    <div class="qwui-read_box">
      <div class="qwui-read_box_left">
        <qwuiButton @click="goBack">&nbsp;返回&nbsp;</qwuiButton>
        <qwuiButton v-perm="'dynamicinfoExport'" type='primary' @click="doExportReadDetail">&nbsp;导出阅读数据&nbsp;</qwuiButton>
      </div>
      <div class="qwui-read_box_right">
        <qwui-input inputType="search" @search='search' v-model="searchPersonnel" :inputTips="'搜索人员'"></qwui-input>
      </div>
    </div>
    <div class="qwui-table_wrap">
      <dataTable :headData="headData" :dataList="dataList"></dataTable>
      <page :pageData="pageData" @change="change"></page>
    </div>
  </div>
</template>

<script>
  import {ajaxSearchRead} from '../../api/newsBulletin/getData';
  import exportReportForm from '@/assets/js/export/export.js';
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
  import dataTable from '@/components/Table/dataTable.vue';
  import page from '@/components/list/page.vue';

  export default {
    mixins:[exportReportForm],
    data(){
      return{
        searchPersonnel:'',
        pageData:{},
        pageSize:10,
        page:1,
        dataList:[],
        readObj:{},
        headData:{
          middle:[
            {
              title:'姓名',
              key:'personName',
              width:100,
            },
            {
              title:'帐号',
              key:'wxUserId',
              width:100,
            },
            {
              title:'手机号码',
              key:'mobile',
              width:130,
            },
            {
              title:'部门',
              key:'departmentName',
              width:300,
            },
            {
              title:'阅读时间',
              key:'createTime',
            }
          ],
          right: {
            isShowOperate: false,
          },
        },
      }
    },
    mounted(){
      let self = this;
      let id = '';
      let title = '';
      self.readObj = JSON.parse(window.sessionStorage.getItem('readObj'));
      if(!self.readObj){
        self.readObj = {};
        self.readObj.id = self.$route.params.id;
        self.readObj.title = self.$route.params.title;
        window.sessionStorage.setItem('readObj',JSON.stringify(self.readObj));
      }
      this.ajaxSearchRead();
    },
    methods:{
      doExportReadDetail(){
        let self = this;
        this._createReport({
          'searchValue.id':self.readObj.id,
          'searchValue.title': self.readObj.title,
          'reportType': 'dynamic_readDetail',
          'belongAgent': dataBase.agentCode,
        });
      },
      ajaxSearchRead(){
        let self = this;
        ajaxSearchRead({
          id: self.readObj.id,
          title:self.readObj.title,
          'searchValue.title':self.searchPersonnel,
          page: self.page,
          pageSize:self.pageSize,
        },(data)=>{
          self.pageData = {
            page: data.currPage,
            pageSize: self.pageSize,
            maxPage: data.maxPage,
            totalRows: data.totalRows
          }
          self.dataList = data.pageData || [];
        });
      },
      change(page,pageSize){
        this.pageSize = pageSize;
        this.page = page;
        this.ajaxSearchRead();
      },
      search(){
        this.page = 1;
        this.ajaxSearchRead();
      },
      goBack(){
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/');
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

<style scoped lang="scss">
  .qwui-read_box{
    display: flex;
    justify-content:space-between;
    padding-top: 20px;
    .qwui-read_box_left{
      flex:1;
    }
  }
  .qwui-table_wrap{
    padding-top: 15px;
  }
</style>

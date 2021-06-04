<template>
  <div>
    <div class="read_box">
      <div class="read_box_left">
        <qwuiButton @click="goBack">&nbsp;返回&nbsp;</qwuiButton>
        <qwuiButton v-perm="'dynamicinfoExport'" type='primary' @click="doExportReadDetail">&nbsp;导出阅读数据&nbsp;</qwuiButton>
      </div>
    </div>
    <div class="table_wrap">
      <dataTable :headData="headData" :dataList="dataList"></dataTable>
      <page :pageData="pageData" @change="change"></page>
    </div>
  </div>
</template>

<script>
  import {getUnreadPager} from '../../api/topic/getData';
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
        self.readObj.id = self.$route.query.id;
        self.readObj.title = self.$route.query.title;
        window.sessionStorage.setItem('readObj',JSON.stringify(self.readObj));
      }
      this.ajaxSearchRead();
    },
    methods:{
      doExportReadDetail(){
        let self = this;
        this._createReport({
          'searchValue.id':self.readObj.id,
          'reportType': 'topic_readDetail',
          'belongAgent': '',
        });
      },
      ajaxSearchRead(){
        let self = this;
        getUnreadPager({
          id: self.readObj.id,
          groupId:self.readObj.id,
          currentPage: self.page,
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
  .read_box{
    display: flex;
    justify-content:space-between;
    padding-top: 20px;
    .read_box_left{
      flex:1;
    }
  }
  .table_wrap{
    padding-top: 15px;
  }
</style>

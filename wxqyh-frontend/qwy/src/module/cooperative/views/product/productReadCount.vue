<template>
  <div class="qwui-read_wrap">
    <qwTab :tabList="tabList" :index="indexPage" @selectIndex="selectIndex"></qwTab>
    <div class="qwui-list_wrap">
      <div class="qwui-top_main_bar">
        <div class="qwui-bar_left">
          <qwui-button @click="goBack">返回</qwui-button>
          <qwui-button type="primary" @click="exportReportForm">导出阅读数据</qwui-button>
          <qwui-button type="primary" v-if="indexPage == 1" @click="sendRemindUnRead">提醒通知</qwui-button>
        </div>

        <div class="qwui-bar_right">
          <qwui-input v-if="indexPage == 0"
                      inputType="search"
                      @search='search'
                      v-model="searchTitle"
                      :inputTips="'搜索人员'"></qwui-input>
        </div>
      </div>
      <div v-if="viewRange || indexPage == 0" class="qwui-table_wrap">
        <data-table :headData="headData" :dataList="dataList"></data-table>
        <page :pageData="pageData" @change="change"></page>
      </div>
      <p v-else class="over_range">未读人员超过50人，请导出查看！</p>
    </div>
  </div>
</template>

<script>
  import qwTab from '@/components/Tab/QwTab';
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
  import dataTable from '@/components/Table/dataTable.vue';
  import page from '@/components/list/page.vue';
  import exportReportForm from '@/assets/js/export/export.js';
  import { viewReadCount,viewUnReadCount,sendRemind } from '../../api/product/getData';

  export default {
    mixins:[exportReportForm],
    data(){
      return{
        indexPage:0,
        tabList: [
          {
            text: '已读人员',
          },
          {
            text: '未读人员',
          }
        ],
        headData:{
          middle:[
            {
              title:'姓名',
              key:'personName',
              width:120
            },
            {
              title:'帐号',
              key:'wxUserId',
              width:150
            },
            {
              title:'部门',
              key:'departmentName',
              width:200
            },
            {
              title:'阅读时间',
              key:'createTime',
              width:150
            }
          ],
          right:{
            isShowOperate:false
          }
        },
        dataList:[],
        pageData:{},
        searchTitle:'',
        page:1,
        totalRows:0,
        viewRange:true,
      }
    },
    created(){
      this.searchReadData();
    },
    methods:{
      goBack(){
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/');
      },
      // 查询已阅未阅数据
      searchReadData(){
        let params = {
          id:this.$route.query.productId,
          title:this.$route.query.title,
          page:this.page
        };
        if (this.indexPage == 0){
          this.headData.middle[3] = {
            title:'阅读时间',
            key:'createTime',
            width:150
          };
          params['searchValue.title'] = this.searchTitle;
          viewReadCount(params,data => this.handleData(data));
        }else {
          this.headData.middle.splice(3,1);
          viewUnReadCount(params,result => {
            if (result.code == '0'){
              this.handleData(result.data);
            }else if (result.code == '3') {
              this.viewRange = false;
            }
          })
        }
      },
      handleData(data){
        this.pageData = {
          page: data.currPage,
          pageSize: 10,
          maxPage: data.maxPage,
          totalRows: data.totalRows
        };
        this.totalRows = data.totalRows;
        if (!data.pageData){
          this.dataList = [];
          return;
        }
        this.dataList = data.pageData;
      },
      selectIndex(index){
        this.indexPage = index;
        this.page = 1;
        this.searchReadData();
      },
      search(title){
        this.page = 1;
        this.searchTitle = title;
        this.searchReadData();
      },
      change(page){
        this.page = page;
        this.searchReadData();
      },
      // 导出
      exportReportForm(){
        let params = {
          'reportType':'product_readDetail',
          'searchValue.id':this.$route.query.productId,
          'searchValue.title':this.$route.query.title
        };
        this._createReport(params);
      },
      sendRemindUnRead(){
        sendRemind({
          id:this.$route.query.productId
        },()=>{
          dataBase.top_alert('发送成功',true,3000)
        })
      }
    },
    components:{
      qwTab,
      qwuiButton,
      qwuiInput,
      dataTable,
      page
    }
  }
</script>

<style scoped lang="scss">
  .qwui-read_wrap{
    padding: 10px 0;
  }
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

  .over_range {
    padding-top: 15px;
    font-size: 16px;
    color: rgb(153, 153, 153);
  }
</style>


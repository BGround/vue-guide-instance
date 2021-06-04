<template>
  <div class="qwui-read_wrap">
    <div class="qwui-list_wrap">
      <div class="qwui-top_main_bar">
        <div class="qwui-bar_left">
          <qwui-button @click="goBack">返回</qwui-button>
          <span class="qwui-dotted_line" v-perm="'productAdd'"></span>
          <qwui-button type="primary" v-perm="'productAdd'" @click="addOrEditCase()">新增</qwui-button>
          <span class="qwui-dotted_line" v-perm="'productDel'"></span>
          <qwui-button v-perm="'productDel'" @click="doDels(ids,true)">删除</qwui-button>
        </div>

        <div class="qwui-bar_right">
          <qwui-input inputType="search"
                      @search='search'
                      v-model="searchTitle"
                      :inputTips="'搜索案例'"></qwui-input>
        </div>
      </div>
      <div class="qwui-table_wrap">
        <data-table :headData="headData" :dataList="dataList"></data-table>
        <page :pageData="pageData" @change="change"></page>
      </div>
    </div>
  </div>
</template>

<script>
  import qwTab from '@/components/Tab/QwTab';
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
  import dataTable from '@/components/Table/dataTable.vue';
  import page from '@/components/list/page.vue';
  import { searchCase,deleteCase } from '../../api/product/getData';

  export default {
    data(){
      return{
        ids:'',
        headData:{
          left:{
            id:'caseId',
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
              title:'案例名称',
              key:'title',
              width:350
            },
            {
              title:'创建时间',
              key:'createTime',
              width:350
            }
          ],
          right:{
            isShowOperate:true,
            width:100
          }
        },
        dataList:[],
        pageData:{},
        searchTitle:'',
        page:1,
        pageSize:10,
      }
    },
    created(){
      this.searchDataList();
    },
    methods:{
      goBack(){
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/');
      },
      searchDataList(){
        let self = this;
        searchCase({
          id:this.$route.query.productId,
          'searchValue.title':this.searchTitle,
          page:this.page,
          pageSize:this.pageSize
        },(data)=>{
          this.pageData = {
            page: data.currPage,
            pageSize: 10,
            maxPage: data.maxPage,
            totalRows: data.totalRows
          };
          if (!data.pageData){
            this.dataList = [];
            return;
          }
          data.pageData.forEach((item)=>{
            item.operationList = [
              {
                text:'编辑',
                perm:'productEdit',
                operationFunc(){
                  self.addOrEditCase(item.caseId)
                }
              },
              {
                text:'删除',
                perm:'productDel',
                operationFunc(){
                  self.doDels(item.caseId)
                }
              }
            ]
          });
          this.dataList = data.pageData;
        })
      },
      addOrEditCase(caseId){
        this.$router.push({name:'caseAddOrEdit',query:{
          id:this.$route.query.productId,
          caseId:caseId
        }})
      },
      doDels(id,status){
        let self = this;
        if (status && !id){
          _.alert('提示','请选择要删除的数据');
          return;
        }
        _.alert('提示','删除数据后将无法恢复，确认要删除吗？',function(){
          deleteCase({ids:id},()=>{
            dataBase.top_alert('删除成功',true,3000);
            self.ids = '';
            self.searchDataList();
          })
        },'确定',true)
      },
      search(title){
        this.page = 1;
        this.searchTitle = title;
        this.searchDataList();
      },
      change(page,pageSize){
        this.page = page;
        this.pageSize = pageSize;
        this.searchDataList();
      },
    },
    components:{
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

</style>



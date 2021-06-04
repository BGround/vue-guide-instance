<template>
  <div class="qwui-list_wrap">
    <div class="qwui-top_main_bar">
      <div class="qwui-bar_left">
        <qwui-button @click="toSettingPage">返回</qwui-button>
        <span class="qwui-dotted_line" v-perm="'templateAdd'"></span>
        <qwui-button type="primary" @click="addOrEditType('')" v-perm="'templateAdd'">新增</qwui-button>
        <span class="qwui-dotted_line" v-perm="'templateDel'"></span>
        <qwui-button @click="deleteType(ids,true)" v-perm="'templateDel'">删除</qwui-button>
      </div>

      <div class="qwui-bar_right">
        <qwui-input inputType="search"
                    @search='search'
                    v-model="searchTitle"
                    :inputTips="'搜索'"></qwui-input>
      </div>
    </div>
    <div class="qwui-table_wrap">
      <data-table :headData="headData" :dataList="dataList"></data-table>
      <page :pageData="pageData" @change="change"></page>
    </div>
  </div>
</template>

<script>
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
  import dataTable from '@/components/Table/dataTable.vue';
  import page from '@/components/list/page.vue';

  import { searchDiaryType,updateDiaryStatus,deleteDiaryType } from '../../api/diary/getData';

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
              width:100
            },
            {
              title:'标题',
              key:'title',
              width:320
            },
            {
              title:'状态',
              key:'statusName',
              width:60
            },
            {
              title:'创建时间',
              key:'createTime',
              width:140,
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
      }
    },
    created(){
      this.getDiaryType();
    },
    methods:{
      getDiaryType(){
        let self = this;
        searchDiaryType({
          'searchValue.title':this.searchValue,
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
                perm:item.status == '0' ? 'templateStart' : 'templateIsable',
                operationFunc(){
                  self.disOrEnable(item.id,item.status);
                }
              },
              {
                text:'编辑',
                perm:'templateEdit',
                operationFunc(){
                  self.addOrEditType(item.id);
                }
              },
              {
                text:'删除',
                perm:'templateDel',
                operationFunc(){
                  self.deleteType(item.id);
                }
              }
            ];
            item.statusName = item.status == '1' ? '已启用' : '已禁用';
          });
          this.dataList = data.pageData;
        })
      },
      toSettingPage(){
        this.$router.push({name:'diarySetting'});
      },
      addOrEditType(id){
        this.$router.push({
          name:'diaryTypeAddOrEdit',
          query:{
            id:id
          }
        })
      },
      deleteType(id,status){
        let self = this;
        if (status && id == ''){
          _.alert('提示','请选择要删除的数据');
          return;
        }
        _.alert('提示','删除数据后将无法恢复，确认要删除吗？',function(){
          deleteDiaryType({
            ids:id,
            belongAgent:'diary'
          },()=>{
            dataBase.top_alert('删除成功',true,3000);
            self.ids = '';
            self.getDiaryType();
          })
        },'确定',true);
      },
      disOrEnable(id,status){
        let self = this;
        status = status == '0' ? '1' : '0';
        let text = status == '1' ? '启用' : '禁用';
        updateDiaryStatus({
          id:id,
          status:status
        },()=>{
          // 启用、禁用局部刷新即可，无需重新请求接口
          this.dataList.forEach((item)=>{
            if (item.id == id){
              item.status = status;
              item.operationList[0] = {
                text:item.status == '0' ? '启用' : '禁用',
                perm:item.status == '0' ? 'templateStart' : 'templateIsable',
                operationFunc(){
                  self.disOrEnable(item.id,item.status);
                }
              };
              item.statusName = item.status == '1' ? '已启用' : '已禁用';
            }
          });
          dataBase.top_alert(text+'成功',true,3000);
        })
      },
      search(value){
        this.searchValue = value;
        this.getDiaryType();
      },
      change(page,pageSize){
        this.pageSize = pageSize;
        this.page = page;
        this.getDiaryType();
      }
    },
    components:{
      qwuiButton,
      qwuiInput,
      dataTable,
      page
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

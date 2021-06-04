<template>
  <div class="qwui-list_wrap">
    <div>
      <div class="qwui-top_main_bar">
        <div class="qwui-bar_left">
          <qwui-button type='primary' v-perm="'productAdd'" @click="doAddProduct()">新增</qwui-button>
          <span class="qwui-dotted_line" v-perm="'productDel'"></span>
          <qwui-button v-perm="'productDel'" @click="doDels(ids,true)">删除</qwui-button>
          <span class="qwui-dotted_line" v-perm="'productLicensing'"></span>
          <qwui-button v-perm="'productLicensing'" @click="doAuthorize(ids)">授权</qwui-button>
          <span class="qwui-dotted_line" v-perm="'productSet'"></span>
          <qwui-button v-perm="'productSet'" @click="toSettingPage">设置</qwui-button>
          <span class="qwui-dotted_line"></span>
          <qwui-button @click="exportReportForm">导出</qwui-button>
        </div>
        <div class="qwui-bar_right">
          <qwui-input inputType="search"
                      @search='search'
                      v-model="searchTitle"
                      :inputTips="'搜索标题'"></qwui-input>
          <a class="qwui-senior_search_btn" @click="showAdvancedScreen">高级搜索</a>
        </div>
      </div>
      <advancedScreen v-show="isShowAdvancedScreen"
                      :screenItemList="screenItemList"
                      @searchResult="searchResult">
      </advancedScreen>
      <div class="qwui-table_wrap">
        <data-table :headData="headData" :dataList="dataList">
          <div class="read_like" v-for="(item,key) in dataList"
               :key="key"
               :slot="'readLike'+key">
            <!-- 发布量 -->
            <span class="like_num">{{ item.publishCount }}/</span>
            <span class="read_num" @click="viewReadCount(item.productId,item.title)">{{ item.viewCount }}</span>
            <span class="like_num">/{{ item.praise }}</span>
          </div>
          <div class="read_like" v-for="(item,key) in dataList"
               :key="key"
               :slot="'readTotal'+key">
            <!-- 已读家数 -->
            <span class="read_num" @click="toReadDetail(item.productId,item.title,0)">{{ item.readGroupCount }}</span>
            <span>/</span>
            <!-- 总家数 -->
            <span class="read_num" @click="toReadDetail(item.productId,item.title,1)">{{ item.groupCount }}</span>
          </div>
        </data-table>
        <page :pageData="pageData" @change="change"></page>
      </div>
    </div>
    <authorize-pop v-show="authorizeConfig.authorizePopShow"
                   :authorizeConfig="authorizeConfig"
                   @listenClose="closePop"
                   @listenBtnFunc="listenBtnFunc"></authorize-pop>
    <qw-share-alert :shareObj="shareObj"></qw-share-alert>
  </div>
</template>

<script>
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
  import advancedScreen from '@/components/Screen/AdvancedScreen/AdvancedScreen';
  import dataTable from '@/components/Table/dataTable.vue';
  import page from '@/components/list/page.vue';
  import authorizePop from './authorizePop';
  import qwShareAlert from '@/components/Alert/QwShareAlert.vue';
  import exportReportForm from '@/assets/js/export/export.js';

  import {
    searchProductList,
    updateProductStatus,
    deleteProduct,
    getAuthorizePeople,
    addAuthorize,
    getMoreAuthorize
  } from '../../api/product/getData';

  export default {
    mixins:[exportReportForm],
    data(){
      return {
        searchTitle:'',
        isShowAdvancedScreen:false,
        ids:'',
        screenItemList:[
          {
            type:'text',
            name:'标题',
            modelName:'title'
          },
          {
            type:'text',
            name:'类别',
            modelName:'type'
          },
          {
            type:'select',
            name:'启用状态',
            dataList:[
              {
                text:'全部',
                value:''
              },
              {
                text:'已启用',
                value:1
              },
              {
                text:'禁用',
                value:0
              }
            ],
            modelName:'status'
          },
          {
            type:'time',
            name:'创建时间',
            modelName:'createTime',
            timeHandler:(startTime,endTime)=>{}
          }
        ],
        headData:{
          left:{
            id:'productId',
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
              title:'标题',
              key:'title',
              width:200
            },
            {
              title:'类别',
              key:'productTypeName',
              width:100
            },
            {
              title:'发布量/已读/点赞',
              key:'readLike',
              width:135
            },
            {
              title:'已读家数/总家数',
              key:'readTotal',
              width:135
            },
            {
              title:'发布状态',
              key:'statusDesc',
              width:75
            },
            {
              title:'启用状态',
              key:'enableStatus',
              width:75
            },
            {
              title:'编辑人',
              key:'lastEditor',
              width:80
            },
            {
              title:'最后编辑',
              key:'lastEditTime',
              width:100
            }
          ],
          right:{
            isShowOperate: true,
            width:80,
          }
        },
        dataList:[],
        pageSize:10,
        pageData:{},
        page:1,
        totalRows:0,
        searchParams:{},
        searchData:[],
        authorizeConfig:{
          authorizePopShow:false,
          unAuthorizeList:[],
          authorizeList:[],
          groupId:'',
          isAllowEdit:false,
          popData:{
            popShow:true,
            popTitle:'',
            buttonConfig:{
              cancel:{
                text:'取消',
                type:''
              },
              confirm:{
                text:'保存',
                type:'primary'
              }
            }
          },
        },
        shareObj:{},
      }
    },
    created(){
      dataBase.agentCode = 'productinfo';
      this.updateParams();
      this.searchListData();
    },
    methods:{
      updateParams(){
        this.searchParams = {
          'productIds':'',
          'searchValue.title':this.searchData.title || '',
          'searchValue.productTypeName':this.searchData.type || '',
          'searchValue.enableStatus':this.searchData.status || (this.searchData.status === 0 ? 0 : ''),
          'searchValue.startTimes':this.searchData.createTime ? this.searchData.createTime[0] : '',
          'searchValue.endTime':this.searchData.createTime ? this.searchData.createTime[1] : '',
          'page':this.page || 1,
          'pageSize':this.pageSize || 10,
          'belongAgent':dataBase.agentCode
        }
      },
      searchListData(){
        let self = this;
        searchProductList(this.searchParams,(data)=>{
          this.pageData = {
            page: data.currPage,
            pageSize: this.pageSize,
            maxPage: data.maxPage,
            totalRows: data.totalRows
          };
          this.totalRows = data.totalRows;
          if (!data.pageData){
            this.dataList = [];
            return;
          }
          data.pageData.forEach((item)=>{
            item.operationList = [
              {
                text:item.isEnable == '1' ? '禁用':'启用',
                perm:'productEnable',
                operationFunc(){
                  self.updateStatus(item.productId,item.isEnable)
                }
              },
              {
                text:'授权',
                perm:'productLicensing',
                operationFunc(){
                  self.doAuthorize(item.productId,true,item.creator,item.title)
                },
                isHide:item.isShowLicensing == -1
              },
              {
                text:'编辑案例',
                perm:'productEdit',
                operationFunc(){
                  self.doEditCase(item.productId)
                },
                isHide:item.isShowEdit == -1 || item.isShowEdit == -2
              },
              {
                text:'查看详情',
                perm:'productEdit',
                operationFunc(){
                  self.doView(item.productId,'detail')
                }
              },
              {
                text:'分享',
                perm:'productEdit',
                operationFunc(){
                  self.doShare(item.productId,item.title)
                },
                isHide:item.isOpen === '0'
              },
              {
                text:'预览',
                perm:'productPreview',
                operationFunc(){
                  self.doView(item.productId,'preview')
                }
              },
              {
                text:'编辑',
                perm:'productEdit',
                operationFunc(){
                  self.doAddProduct(item.productId,1)
                }
              },
              {
                text:'复制',
                perm:'productCopy',
                operationFunc(){
                  self.doAddProduct(item.productId,2)
                }
              },
              {
                text:'删除',
                perm:'productDel',
                operationFunc(){
                  self.doDels(item.productId)
                }
              }
            ];
            if (item.isPassReview === "1") {
              item.statusDesc = "审核中"
            } else if (item.isPassReview === "2") {
              item.statusDesc = "未通过"
            } else {
              item.statusDesc = "已发布"
            }
          });
          this.dataList = data.pageData;
          console.log(this.dataList)
        })
      },
      search(value){
        this.searchData.title = value;
        this.updateParams();
        this.searchListData();
      },
      searchResult(data){
        this.searchData = data;
        this.page = 1;
        this.updateParams();
        this.searchListData();
      },
      showAdvancedScreen(){
        this.isShowAdvancedScreen = !this.isShowAdvancedScreen;
      },
      change(page,pageSize){
        this.pageSize = pageSize;
        this.page = page;
        this.updateParams();
        this.searchListData();
      },
      updateStatus(productId,status){
        let self = this;
        status = status == '0' ? '1' : '0';
        let text = status == 0 ? '禁用' : '启用';
        updateProductStatus({
          productId:productId,
          isEnable:status == 1 ? 0 : 1
        },()=>{
          this.dataList.some((item)=>{
            if (item.productId == productId){
              item.isEnable = status;
              item.enableStatus = status == 0 ? '禁用' : '已启用';
              item.operationList[0] = {
                text:status == 0 ? '启用' : '禁用',
                operationFunc(){
                  self.updateStatus(item.productId,item.isEnable);
                }
              };
              return true;
            }
          });
          dataBase.top_alert(text+'成功',true,3000);
        })
      },
      // 授权
      doAuthorize(id,status,creator,title){
        if (!id){
          _.alert('提示','请选择要批量授权的数据');
          return;
        }
        this.authorizeConfig.popData.popTitle = '授权知识百科：' + (status ? title : id.split(',').length + '个知识百科');
        this.authorizeConfig.groupId = id;
        if (status){
          getAuthorizePeople({
            id:id,
            creator:creator
          },(data)=>{
            this.renderAuthorizeData(data);
          })
        }else {
          getMoreAuthorize((data)=>{
            this.renderAuthorizeData(data);
          })
        }
      },
      // 渲染授权数据
      renderAuthorizeData(data){
        this.authorizeConfig.authorizeList = data.licensingList || [];
        this.authorizeConfig.unAuthorizeList = data.userList;
        this.authorizeConfig.isAllowEdit = data.licensingAllowEdit == 1;
        this.authorizeConfig.authorizePopShow = true;
      },
      // 关闭授权弹窗
      closePop(){
        this.authorizeConfig.authorizePopShow = false;
      },
      // 保存或取消授权
      listenBtnFunc(key){
        if (key == 'cancel'){
          this.authorizeConfig.authorizePopShow = false;
          return;
        }
        let userIds = [];
        this.authorizeConfig.authorizeList.forEach((item)=>{
          userIds.push(item.userName);
        });
        addAuthorize({
          groupId:this.authorizeConfig.groupId,
          isAllowEdit:this.authorizeConfig.isAllowEdit ? 1 : 0,
          userIds:userIds.join('|'),
          agentCode:dataBase.agentCode
        },()=>{
          dataBase.top_alert('授权成功',true,3000);
          this.authorizeConfig.authorizePopShow = false;
        })
      },
      doEditCase(productId){
        this.$router.push({name:'productCase',query:{
          productId:productId
        }})
      },
      doView(id,type){
        window.localStorage.setItem('personName',wxqyhConfig.personName);
        let top=(window.screen.height-630)/2;
        let left=(window.screen.width-520)/2;
        window.open(_.baseURL + '/manager/product/'+ (type == 'detail' ? 'product_detail':'product_preview') + '.jsp?id='+id,'newwindow','height=580,width=350,left='+left+',top='+top+',toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no');
      },
      doShare(groupId,title){
        this.shareObj = {
          title:title,
          isShow:true,
          shareUrl:_.openURL + '/open/product/product_detail.jsp?id=' + groupId,
          type:dataBase.agentCode
        }
      },
      doAddProduct(productId,status){
        this.$router.push({name:'productAddOrEdit',query:{
          id:productId,
          status:status
        }})
      },
      doDels(id,status){
        let self = this;
        if (status && !id){
          _.alert('提示','请选择要删除的数据');
          return;
        }
        _.alert('提示','删除数据后将无法恢复，确认要删除吗？',function(){
          deleteProduct({ids:id},()=>{
            dataBase.top_alert('删除成功',true,3000);
            self.ids = '';
            self.searchListData();
          })
        },'确定',true)
      },
      toSettingPage(){
        this.$router.push({name:'productSetting'})
      },
      viewReadCount(productId,title){
        this.$router.push({name:'productReadCount', query:{
            productId:productId,
            title:title
          }
        })
      },
      toReadDetail(productId,title,status) {
        if (status == 0) {
          this.$router.push({
            name: 'productDealerRead',
            query: {
              id:productId,
              title:title
            }
          })
        } else {
          this.$router.push({
            name: 'productDealerUnread',
            query: {
              id:productId,
              title:title
            }
          })
        }
      },
      // 导出
      exportReportForm(){
        if(this.totalRows>0){
          this.updateParams();
          this.searchParams['reportType'] = 'product_list';
          this._createReport(this.searchParams);
        } else{
          dataBase.top_alert('搜索结果为空，不支持导出',false,3000);
        }
      },
    },
    components:{
      qwuiButton,
      qwuiInput,
      advancedScreen,
      dataTable,
      page,
      authorizePop,
      qwShareAlert
    }
  }
</script>

<style src="../../scss/common/common.scss" lang="scss" scoped></style>
<style lang="scss" scoped></style>

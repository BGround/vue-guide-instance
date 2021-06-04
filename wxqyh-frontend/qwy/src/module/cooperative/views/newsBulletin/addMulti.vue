<template>
  <div class="qwui-multi_wrap">
    <qwuiButton @click="goBack" class="mt20 mb20">&nbsp;返回&nbsp;</qwuiButton>
    <div class="qwui-multi_main">
      <div class="qwui-multi_name">
        <qwForm
          :model="ruleForm"
          :rules="rules"
          label-width="140"
          width="460"
          ref="ruleForm">
          <qwFormItem
            prop="title"
            label="多图文名称">
            <qwuiInput
              v-model="ruleForm.title"
              inputTips="用于后台管理"
              :maxLength="30"></qwuiInput>
            <span class="qwui-timing_tip">{{timingTip}}</span>
          </qwFormItem>
        </qwForm>
      </div>
      <div class="qwui-dotted_line"></div>
      <div class="qwui-multi_content">
        <qwuiButton @click="selectArticle">&nbsp;选择文章&nbsp;</qwuiButton>
        <span class="ml10 c999">从已有的新闻公告里选择，最多8篇，在下方拖动可更换顺序</span>
        <p class="c999 mt10 mb10"><i class="multiIcon"></i>多图文推送，以第一条图文的目标对象为接收消息对象</p>
        <SortableList lockAxis="y" v-model="selectDataArr" :lockToContainerEdges="lockToContainerEdges" :useDragHandle="useDragHandle">
          <SortableItem v-for="(list, index) in selectDataArr" @doDelLi="doDelLi" :index="index" :key="index" :list="list"/>
        </SortableList>
      </div>
      <div class="qwui-multi_preview">
        <div class="c999 mb5">多图文预览：</div>
        <div class="qwui-multi_preview_pop" v-if="selectDataArr.length==0">
          <div class="qwui-notice_pop_div">
            <img :src="defaultImg">
            <span>图文标题</span>
          </div>
          <ul>
            <li>
              <div class="tit">图文标题</div>
              <div><img :src="defaultImg"></div>
            </li>
            <li>
              <div class="tit">图文标题</div>
              <div><img :src="defaultImg"></div>
            </li>
            <li>
              <div class="tit">图文标题</div>
              <div><img :src="defaultImg"></div>
            </li>
          </ul>
        </div>
        <div class="qwui-multi_preview_pop" v-else>
          <div class="qwui-notice_pop_div">
            <img v-show="selectDataArr[0].coverImageFull" :src="selectDataArr[0].coverImageFull">
            <span>{{selectDataArr[0].title}}</span>
          </div>
          <ul>
            <li
              v-for="(item,index) in selectDataArrNew"
              :key="index">
              <div class="tit">{{item.title}}</div>
              <div v-show="item.coverImageFull"><img :src="item.coverImageFull"></div>
            </li>
          </ul>
        </div>
      </div>
      <div v-show="showSelectArticle">
        <funcBox
          boxTitle="选择文章"
          firstBtn="确定"
          secondBtn="取消"
          boxWidth="1000"
          @secondFunc="close"
          @closeBox="close"
          @firstFunc="ok">
          <div>
            <div class="qwui-select_top">
              <div class="qwui-bar_left">
              </div>
              <div class="qwui-bar_right">
                <qwui-input
                  class="iblock"
                  inputType="search"
                  @search='search'
                  v-model="searchTitle"
                  @input="searchInput"
                  :inputTips="'搜索动态'"></qwui-input>
                <a class="qwui-senior_search_btn" @click="showAdvancedScreen">高级搜索</a>
              </div>
            </div>
            <advancedScreen
              class="mb15"
              v-show="isShowAdvancedScreen"
              :screenItemList="screenItemList"
              @searchResult="searchResult"></advancedScreen>
            <dataTable :headData="headData" :dataList="dataList">
              <div v-for="(item,key) in dataList" :key="key" :slot="'title'+key" class="qwui-content">
                <span
                  class="qwui-set_top"
                  v-show="item.showSetTop">置顶</span>
                <span
                  class="qwui-secret"
                  v-show="item.showSecret">保密</span>
                {{item.title}}
              </div>
              <div v-for="(item,key) in dataList" :key=key :slot="'viewCount'+key" class="qwui-content">
                <span
                  title="点击查看明细"
                  class="goLink">{{item.viewCount}}</span>
                <span>/</span>
                <span>{{item.commentCount}}</span>
              </div>
            </dataTable>
            <page :pageData="pageData" @change="change"></page>
          </div>
        </funcBox>
      </div>
    </div>
    <div class="pt20 pb20 tcenter">
      <qwuiButton v-perm="'articleEdit'" @click="saveArticleGroup('0');" v-show="showDraftBtn">&nbsp;保存为草稿&nbsp;</qwuiButton>
      <qwuiButton v-perm="'articleEdit'" @click="saveArticleGroup('1');" type='primary' class="ml10 mr10">&nbsp;立即推送&nbsp;</qwuiButton>
      <qwuiButton v-perm="'articleEdit'" @click="timingPublish" v-show="showTimingBtn" type='primary'>&nbsp;定时推送&nbsp;</qwuiButton>
      <qwuiButton v-perm="'articleEdit'" @click="saveArticleGroup('0','cancelTiming')" v-show="showCancelTiming" type='primary'>&nbsp;取消定时&nbsp;</qwuiButton>
    </div>
    <div v-show="showTimingAlert">
      <funcBox boxTitle="定时发送" firstBtn="确定" secondBtn="取消" boxWidth="500" @secondFunc="closeTiming" @closeBox="closeTiming" @firstFunc="okTiming">
        <div class="qwui-timing_content tcenter pt30 pb30">
          <span class="pr5">选择发送时间</span>
          <VueDatepickerLocal v-model="timing" @confirm="confirm" show-buttons placeholder="定时时间" format="YYYY-MM-DD HH:mm:ss"></VueDatepickerLocal>
        </div>
      </funcBox>
    </div>
  </div>
</template>

<script>
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/QwInput';
  import qwForm from '@/components/form/form';
  import qwFormItem from '@/components/form/formItem';
  import funcBox from '@/components/list/funcBox';
  import advancedScreen from '@/components/Screen/AdvancedScreen/AdvancedScreen';
  import dataTable from '@/components/Table/dataTable.vue';
  import page from '@/components/list/page.vue';
  import VueDatepickerLocal from '@/components/base/VueDatepickerLocal';
  import {ContainerMixin, ElementMixin,HandleDirective } from 'vue-slicksort';
  import { mapActions, mapGetters } from "vuex";
  import {
    getDynamicType,
    searchDynamicPager,
    saveArticleGroup,
    getArticleGroupInfo,
  } from '../../api/newsBulletin/getData';

  const SortableList = {
    mixins: [ContainerMixin],
    template: `
    <ul class="qwui-multi_box">
      <slot />
    </ul>`,
  };

  const SortableItem = {
    mixins: [ElementMixin],
    props: ['list', 'index'],
    directives: { handle: HandleDirective },
    template: `
            <li class="qwui-multi_item">
            <div class="qwui-multi_txt"  v-handle>
              <span>{{list.title}}</span>
              <img v-show="list.coverImageFull" :src="list.coverImageFull" alt="">
            </div>
            <div
              class="delete_icon"
              @click="doDelLi(list.dynamicInfoId,index)"><i>-</i></div>
          </li>`,
    methods:{
      doDelLi(id,index){
        this.$emit('doDelLi',id,index);
      },
    },
  };

  export default {
    name:'newsBulletinAddMulti',
    mounted(){
      let self = this;
      getDynamicType({
        isForSelect:1,
        belongAgent:dataBase.agentCode
      },(data)=>{
        data.list.forEach(function(item,index){
          self.screenItemList[1].dataList.push({
            text:item.typeName,
            value:item.id,
          });
        });
      });
      this.loadArticleGroupInfo();
    },
    data(){
      return{
        showTimingBtn:false,
        showDraftBtn:false,
        showCancelTiming:false,
        timingTip:'',
        timing:'',
        showTimingAlert:false,
        lockToContainerEdges:true,
        useDragHandle:true,
        selectDataArr:[],
        selectDataArrTemp:[],
        dataList:[],
        headData:{
          left:{
            id:'dynamicInfoId',
            hideSelectedAll:true,
            checkFunc:(isSelectedAll,list,index)=> {
              if(list[index].isChecked) {
                this.dataList[index].isChecked = true;
                if (this.dataList[index].isSecret == '1') {
                  this.dataList[index].coverImageFull = require('assets/images/icon_secret.jpg');
                } else if (this.dataList[index].coverImage) {
                  this.dataList[index].coverImageFull = _.compressURL + this.dataList[index].coverImage;
                }
                this.selectDataArrTemp.push(this.dataList[index]);
              }else{
                this.selectDataArrTemp.forEach((item,idx)=>{
                  if(item.dynamicInfoId==list[index].id){
                    this.selectDataArrTemp.splice(idx,1);
                  }
                });
              }
            }
          },
          middle:[
            {
              title:'内容标题',
              key:'title',
              width:150,
            },
            {
              title: '创建人',
              key: 'personName',
              width:100,
            },
            {
              title:'类型',
              key:'dynamicType',
              width:100,
            },
            {
              width:100,
              title:'查看/回复',
              key:'viewCount',
            },
            {
              title:'点赞',
              key:'praise',
              width:100,
            },
            {
              title:'状态',
              key:'status',
              width:100,
            },
            {
              title:'创建时间',
              key:'createTimeBack',
            },
          ],
          right: {
            isShowOperate: true,
            width:100,
          },
        },
        screenItemList:[
          {
            type:'text',
            name:'标题',
            modelName:'title',
          },
          {
            type:'select',
            name:'类型',
            dataList:[
              {
                text:'全部',
                value:'',
              },
            ],
            modelName:'dynamicType',
          },
          {
            type:'text',
            name:'创建人',
            modelName:'searchCreator',
            searchObj:{
              searchUrl:'/contact/contactAction!ajaxSearchUserByPersonName.action',
              type:'user',
              params:{
                keyWord: 1,
                pageSize: 10
              }
            },
          },
          {
            type:'text',
            name:'部门',
            modelName:'deptName',
            searchObj:{
              searchUrl:'/contact/contactAction!ajaxSearchDeptByDeptName.action',
              type:'dept',
              params:{
                keyWord: 2,
                pageSize: 10
              }
            },
          },
          {
            type:'time',
            name:'创建时间',
            defaultValue:[],
            modelName:'createTime',
            timeHandler:(startTime,endTime)=> {
              this.exportStartTime = startTime;
              this.exportEndTime = endTime;
            }
          },
        ],
        isShowAdvancedScreen:false,
        searchTitle:'',
        showSelectArticle:false,
        defaultImg:require('assets/images/icon_default_cover_img.png'),
        ruleForm:{
          title:'',
        },
        rules: {
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'},
          ],
        },
        searchParams:{},
        isUseAdvancedScreen:false,
        page:1,
        pageSize:10,
        searchData:[],
        totalRows:0,
        pageData:{},
        isTiming:false,
        timingTime:'',
        isSendStatus:false,
      }
    },
    methods:{
      //定时任务时间选择确定按钮
      confirm(date){
        this.timing = date;
      },
      //加载多图文数据
      loadArticleGroupInfo(){
        let id = this.$route.query.id;
        let self = this;
        if(id){
          getArticleGroupInfo({
            'id':id,
          },(data)=>{
            let ArticleGroupInfoVO = data.ArticleGroupInfoVO;
            self.ruleForm.title = ArticleGroupInfoVO.title;
            //设置定时开关
            if(ArticleGroupInfoVO.isTiming == 1){
              self.isTiming = true;
              if("1"==ArticleGroupInfoVO.timingSendStatus){
                self.isSendStatus = true;
                self.timingTip = "图文已于"+ArticleGroupInfoVO.timingTime+"发布";
              }else if(ArticleGroupInfoVO.timingTime){
                self.timingTip = "图文将于"+ArticleGroupInfoVO.timingTime+"发布";
              }
            }
            self.timingTime = ArticleGroupInfoVO.timingTime;
            let articleList=ArticleGroupInfoVO.sendArticleVOList;
            articleList.forEach((item)=>{
              if(item.coverImage){
                if(item.coverImage.includes('/themes/default/images/qw/secret.jpg')){
                  item.coverImageFull = require('assets/images/icon_secret.jpg');
                }else{
                  item.coverImageFull = _.compressURL + item.coverImage;
                }
              }
              item.dynamicInfoId = item.foreignId;
            });
            self.selectDataArr = articleList.slice();
            self.selectDataArrTemp = articleList.slice();
            if("1"!=ArticleGroupInfoVO.status){
              if("1"==ArticleGroupInfoVO.isTiming && "0"==ArticleGroupInfoVO.timingSendStatus){
                self.showCancelTiming = true;
              }else{
                self.showDraftBtn = true;
                self.showTimingBtn = true;
              }
            }
            self.updateParams();
            self.searchDynamicPager();
          });
        }else{
          self.showDraftBtn = true;
          self.showTimingBtn = true;
          self.updateParams();
          self.searchDynamicPager();
        }
      },
      //定时发布
      timingPublish(){
        if(!_.isVipSilver(interfaceCode.INTERFACE_CODE_DYNAMIC) && !_.isOldUserVip()){
          _._alertVip('新闻公告定时发布');
          return;
        }
        this.showTimingAlert = true;
      },
      //定时发布确定按钮
      okTiming(){
        this.timingTime = this.timing ? this.timing.Format('yyyy-MM-dd hh:mm:ss') : '';
        if(this.timingTime===''){
          dataBase.top_alert('请选择定时时间',false,3000);
          return;
        }
        this.showTimingAlert = false;
        this.saveArticleGroup('0','isTiming');
      },
      //底部按钮处理
      saveArticleGroup(status, saveType){
        let self = this;
        this.$refs['ruleForm'].validate((valid) => {
          if(valid){
            if(self.selectDataArr.length <= 0){
              dataBase.top_alert('请选择文章',false,3000);
              return;
            }
            if("isTiming"===saveType){
              self.isTiming = true;
            }else{
              //如果是非定时发布，设置定时为关闭
              self.timingTime = '';
            }
            self.doCheckBeforeSend(status);
          }
        });
      },
      doCheckBeforeSend(status){
        let self = this;
        let articleGroupJsonStr = this.getArticleGroupJsonStr(status);
        //选择多图文“发送”：查找是否含有草稿条目，再保存，保存时将所有草稿条目的状态变为“发送”
        if (status == '1') {
          let hasDraft = this.selectDataArr.some((item)=>{
            return item.status==='草稿';
          });
          let str = '';
          if(hasDraft){
            str = '选择的单图文中有草稿条目，是否确定发送？';
          }else{
            if(self.isSendStatus){
              str = '该多图文消息已通过定时任务发送出去，确定重新推送消息？';
            }else{
              str = '确定立即推送多图文消息？';
            }
          }
          _.alert('提示',str,function(){
            self.sendArticleGroup(articleGroupJsonStr,'推送成功');
          },'确定',true);
        }else{
          //选择多图文“草稿”：直接保存
          this.sendArticleGroup(articleGroupJsonStr,'保存成功');
        }
      },
      //发送多图文
      sendArticleGroup(articleGroupJsonStr,tipStr){
        let self = this;
        saveArticleGroup({
          'articleGroupJsonStr':articleGroupJsonStr,
          'belongAgent':dataBase.agentCode,
        },(data)=>{
          dataBase.top_alert(tipStr,true,3000);
          self.$router.push({
            name:'newsBulletinMulti',
          });
        });
      },
      getArticleGroupJsonStr(status){
        let jsonObj = {};
        jsonObj['agentCode'] = dataBase.agentCode;
        jsonObj['groupId'] = this.$route.query.id || '';
        jsonObj['title'] = this.ruleForm.title;
        jsonObj['isTiming'] = this.isTiming ? 1 : 0;
        jsonObj['timingTime'] = this.timingTime;
        jsonObj['status'] = status;
        let arr = [];
        this.selectDataArr.forEach((item)=>{
          arr.push({
            'foreignId':item.dynamicInfoId
          });
        });
        jsonObj['articleList'] = arr;
        return JSON.stringify(jsonObj);
      },
      //删除单图文条目
      doDelLi(id,index){
        let self = this;
        //删除备份数组数据
        self.selectDataArrTemp.forEach((item,idx)=>{
          if(item.dynamicInfoId==id){
            self.selectDataArrTemp.splice(idx,1);
            return;
          }
        });
        //删除当前列表显示的数组数据
        self.dataList.forEach((item,index)=>{
          if(item.dynamicInfoId==id){
            item.isChecked = false;
            self.dataList.splice(index,1,item);
            return;
          }
        });
        //删除显示的数组数据
        self.selectDataArr.splice(index,1);
      },
      change(page,pageSize){
        this.pageSize = pageSize;
        this.page = page;
        this.updateParams();
        this.searchDynamicPager();
      },
      //普通搜索
      search(value){
        this.page = 1;
        this.isUseAdvancedScreen = false;
        this.updateParams();
        this.searchDynamicPager();
      },
      //高级筛选搜索
      searchResult(data){
        this.isUseAdvancedScreen = true;
        this.searchData = data;
        this.page = 1;
        this.updateParams();
        this.searchDynamicPager();
      },
      updateParams(){
        if(!this.isUseAdvancedScreen){
          this.searchParams = {
            'searchValue.title':this.searchTitle,
            'page': this.page,
            'pageSize': this.pageSize,
            'belongAgent': dataBase.agentCode,
          }
        }else {
          this.searchParams = {
            'searchValue.title': this.searchTitle,
            'searchValue.isEnable': 1,
            'searchValue.dynamicType': this.searchData.dynamicType ? this.searchData.dynamicType : '',
            'searchValue.searchCreator': this.searchData.searchCreator ? this.searchData.searchCreator['userId'] : '',
            'searchValue.deptName': this.searchData.deptName ? this.searchData.deptName['deptFullName'] : '',
            'searchValue.startTimes': this.searchData.createTime ? this.searchData.createTime[0] : '',
            'searchValue.endTime': this.searchData.createTime ? this.searchData.createTime[1] : '',
            'page': this.page,
            'pageSize': this.pageSize,
            'belongAgent': dataBase.agentCode,
          }
        }
      },
      searchDynamicPager(){
        let self = this;
        searchDynamicPager(this.searchParams,(data)=>{
          this.pageData = {
            page: data.currPage,
            pageSize: this.pageSize,
            maxPage: data.maxPage,
            totalRows: data.totalRows
          };
          this.totalRows = data.totalRows;
          this.dataList = data.pageData || [];
          this.dataList.forEach((item,index)=>{
            if(item.isTop>0){
              item.showSetTop = true;
            }
            if(item.isSecret!='0'){
              item.showSecret = true;
            }
            item.operationList = [
              {
                text:'预览',
                operationFunc:()=>{
                  self.preview(item.dynamicInfoId);
                }
              },
              {
                text:'查看详情',
                operationFunc:()=>{
                  self.doDetailList(item.dynamicInfoId);
                }
              }
            ];
            self.selectDataArrTemp.forEach((list)=>{
              if(item.dynamicInfoId==list.dynamicInfoId){
                item.isChecked = true;
                return;
              }
            });
          });
        });
      },
      preview(id){
        window.localStorage.setItem('personName',wxqyhConfig.personName);
        let top=(window.screen.height-630)/2;
        let left=(window.screen.width-520)/2;
        window.open(_.baseURL+'/manager/dynamic/preview.jsp?id='+id,'newwindow','height=580,width=350,left='+left+',top='+top+',toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no');
      },
      doDetailList(id){
        window.localStorage.setItem('personName',wxqyhConfig.personName);
        let top=(window.screen.height-630)/2;
        let left=(window.screen.width-520)/2;
        window.open(_.baseURL+'/manager/dynamic/detail.jsp?id='+id,'newwindow','height=580,width=350,left='+left+',top='+top+',toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no');
      },
      showAdvancedScreen(){
        this.isShowAdvancedScreen = !this.isShowAdvancedScreen;
      },
      searchInput(data){
        this.advancedScreenData.title = this.searchTitle;
      },
      close(){
        this.showSelectArticle = false;
      },
      ok(){
        let selectMax=8;
        if(this.selectDataArrTemp.length > selectMax){
          dataBase.top_alert("最多只能选中"+selectMax+"篇文章",false,3000);
          return;
        }
        this.showSelectArticle = false;
        this.selectDataArr = this.selectDataArrTemp.slice();
      },
      goBack(){
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/');
      },
      selectArticle(){
        this.showSelectArticle = true;
      },
      //定时发布取消和关闭按钮
      closeTiming(){
        this.showTimingAlert = false;
      },
    },
    computed:{
      ...mapGetters("advancedScreen", ["advancedScreenData"]),
      //计算选择文章第一个之后的数据
      selectDataArrNew(){
        return this.selectDataArr.filter((item,index)=>{
          return index>0;
        });
      },
    },
    watch:{
      'advancedScreenData.title':function(newValue,oldValue){
        this.searchTitle = newValue;
      }
    },
    components:{
      qwuiButton,
      qwForm,
      qwFormItem,
      qwuiInput,
      funcBox,
      advancedScreen,
      dataTable,
      page,
      SortableList,
      SortableItem,
      VueDatepickerLocal,
    },
  }
</script>

<style lang="scss">
  .qwui-timing_content /deep/ .datepicker-popup{
    position:fixed;
  }

  .qwui-multi_wrap{
    .qwui-multi_main{
      position: relative;
      border-top: 1px solid #dbdbdb;
      border-bottom: 1px solid #dbdbdb;
      padding-top: 20px;
      .qwui-multi_name{
        .qwui-timing_tip{
          position: absolute;
          left: 330px;
          top: 7px;
          width: 100vh;
          font-size: 10px;
          color: red;
        }
      }
      .qwui-multi_content{
        padding-left: 110px;
        .multiIcon{
          margin: -3px 5px 0 0;
          background: url(~assets/images/gantan.png) no-repeat center center;
          width: 18px;
          min-width: 18px;
          height: 16px;
          display: inline-block;
          vertical-align: middle;
        }
      }
      .qwui-dotted_line{
        position: relative;
        height: 1px;
        margin-bottom: 20px;
        &:before{
          content:' ';
          position: absolute;
          width: 100%;
          height: 1px;
          background-image: linear-gradient(to right, #ccc 0%, #ccc 75%, transparent 75%);
          background-size: 14px 1px;
          background-repeat: repeat-x;
        }
      }
      .qwui-multi_preview{
        position: absolute;
        top: 90px;
        right: 10px;
        .qwui-multi_preview_pop{
          width: 280px;
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.1), -2px 2px 5px rgba(0,0,0,0.1);
          padding-bottom: 5px;
          .qwui-notice_pop_div{
            padding: 10px;
            position: relative;
            height: 110px;
            display: block;
            img{
              height: 110px;
              width: 100%;
              object-fit: cover;
            }
            span{
              position: absolute;
              bottom: 10px;
              left: 10px;
              width: 240px;
              overflow: hidden;
              text-overflow: ellipsis;
              background-color: rgba(0,0,0,0.5);
              color: #fff;
              height: 30px;
              line-height: 30px;
              padding: 0 10px;
              text-align: left;
            }
          }
          li{
            padding: 5px 10px;
            border-top: 1px solid #eee;
            overflow: hidden;
            .tit{
              float: left;
              width: 200px;
              color: #999;
              white-space: normal;
              height: 36px;
              overflow: hidden;
              padding-top: 5px;
              margin-right: 12px;
              text-align: left;
            }
            img{
              width: 47px;
              height: 47px;
            }
          }
        }
      }
      .qwui-select_top{
        display: flex;
        justify-content: space-between;
        padding: 20px 0;
        .qwui-bar_left{
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
    }
  }

  .qwui-multi_box{
    width: 510px;
    min-height: 400px;
  }

  .qwui-multi_item{
    position: relative;
    margin-bottom: 10px;
    list-style: none;
    user-select: none;
    cursor:move;
    .qwui-multi_txt{
      display: flex;
      width: 460px;
      padding: 10px;
      border: 1px #cbcbcb solid;
      background-color: #fff;
      span{
        flex:1;
      }
      img{
        width: 126px;
        height: 70px;
      }
    }
    .delete_icon{
      position: absolute;
      top: 42%;
      right: 0;
      width: 17px;
      height: 17px;
      background: #df4949;
      border-radius: 50%;
      cursor: pointer;
      i{
        color: white;
        font-size: 35px;
        font-style: normal;
        left: 1px;
        position: absolute;
        top: -21px;
      }
    }
  }

  @mixin tip-style{
    display: inline-block;
    border-radius: 3px;
    color: #fff;
    font-size: 12px;
    margin-right: 5px;
    padding: 2px 5px;
    background:#32cd32;
  }

  .qwui-content{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .qwui-set_top{
      @include tip-style;
    }
    .qwui-secret{
      @include tip-style;
      background: #ff574d;
    }
    .goLink{
      color: #f87b00;
      text-decoration: underline;
    }
  }
</style>

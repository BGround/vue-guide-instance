<template>
  <div class="wrap">
    <div>
      <!--是否需要补交日志-->
      <div class="qwui-diary_uncommit" v-if="needCommit.show" @click="doCommit">
        <span>你有日志未提交，点击前往补交</span>
      </div>
      <!--标题和类型-->
      <data_detail autoCaching :contentMaxLength="60000" :dataDetailMsg="add_nav" agent="diary" @listenToChild="showMsgFromDataDetail" @moreFunction="doMoreFunction"
                   @content="doContentCache" ref="diaryTitle" :isUseUeditor="isUseUeditor" @changeUeditor="changeUeditor" freeTextareaHeight></data_detail>
      <!--上传图片-->
      <img_detail :dataDetailMsg="add.imgUpload" @listenToChild="showMsgFromImgDetail" v-if="!isUseUeditor"></img_detail>
      <!--上传附件-->
      <file_detail :dataDetailMsg="add.fileUpload" @listenToChild="showMsgFromFileDetail"></file_detail>
      <!--选择负责人-->
      <user_selected_group
        :isEdit="toPersonEdit"
        :title="dataBase.selectConfig.selectList.toPersonList.title"
        :loadLast="dataBase.selectConfig.selectList.toPersonList.loadLast" @confirmPick="confirmPick">
        <user_selected_item
          :isEdit="toPersonEdit"
          :userTotal="dataBase.selectConfig.selectList.toPersonList.userSelected.length"
          :List="dataBase.selectConfig.selectList.toPersonList.userSelected"
          :title="dataBase.selectConfig.selectList.toPersonList.title"
          @showPersonList="showPersonList"
          @showUserSelectedBox="toPersonListShowBox"
          @removeSelected="removeTOPerson"
          slot="user_selected_item">
        </user_selected_item>
      </user_selected_group>
      <!--选择相关人-->
      <user_selected_group
        :title="dataBase.selectConfig.selectList.ccPersonList.title"
        :loadLast="dataBase.selectConfig.selectList.ccPersonList.loadLast" @confirmPick="confirmPick">
        <user_selected_item
          :userTotal="dataBase.selectConfig.selectList.ccPersonList.userSelected.length"
          :List="dataBase.selectConfig.selectList.ccPersonList.userSelected"
          :title="dataBase.selectConfig.selectList.ccPersonList.title"
          @showPersonList="showPersonList"
          @showUserSelectedBox="ccPersonListShowBox"
          @removeSelected="removeCCPerson"
          slot="user_selected_item">
        </user_selected_item>
      </user_selected_group>

      <div class="qwui-padding_twenty"></div>
      <!--底部操作按钮-->
      <flow_button :buttondata="draftDetail.buttonConfig"></flow_button>
    </div>

    <!--负责人、相关人详细列表-->
    <user_show :title="userselectTitle" :userSelect="userSelectList" :limitPreview="limitPreview" :show.sync="showPerson"></user_show>

    <!--选择人员-->
    <user_select :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user_select>

    <!--底部弹窗-->
    <dialog_mask_bottom :dialogConfig="dialogListConfig" ></dialog_mask_bottom>

  </div>
</template>

<script>
import data_detail from '../../../../components/add/add_title';
import img_detail from '../../../../components/add/add_img';
import file_detail from '../../../../components/add/add_file';
import flow_button from '@/components/button/flow_button';
import user_select from '@/components/base/user_or_dept_select';
import user_selected_item from '@/components/base/userOrDeptSelect/user_selected';
import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group';
import user_show from '@/components/detail/user_show'; // 所有相关人列表
import * as timeUtil from '../../../../assets/js/time-util';
import addUpdate from '../../js/add'
import dialog_mask_bottom from '@/components/base/dialog_mask_bottom';
import {getTitleTemp} from '../../api/getData';

export default {
  data(){
    return {
      dataBase:dataBase,
      commitDraft: addUpdate.draftDetail.commitDraft,
      draftDetail: addUpdate.draftDetail,
      draftUpdate: addUpdate.add.draftUpdate,
      addDiary: addUpdate.add.addDiary,
      homeFooterList: dataBase.home.homeFooterList,//底部菜单
      summaryData:dataBase.home.summaryData,//汇总数据
      draftId: '',//对将要操作的日志id保存起来
      add: addUpdate.add, // 传入组件的详细数据
      isClickWhich: '', // 0代表保存，1代表提交
      addOrUpdateUrl: '', // 功能接口url back
      isPhoto:0,//图片是否必须
      selectListCache:{ //缓存 上次加载 的选人内容
        "toPersonList":{"userSelected": []},
        "ccPersonList":{"userSelected": []},
      },
      add_nav:{ //数据详情头部信息
        nav: '日志类型', //头部标题
        title:"",
        titlePlaceholder: '请输入日志标题',
        content:"",
        contentPlaceholder: '请输入日志内容',
        templateTypeId:"",
        templateType:[],
        isDisabled:false,
        moreFunctions:[],
        summaryContent:''
      },
      // 底部弹窗列表操作
      dialogListConfig: {
        show: false,
        title: '',
        btnConfig: []
      },
      needCommit:{ //补交日志
        show:false,
        unSubmitNum:0
      },
      temptoUser:[],
      tempccUser:[],
      isPC:_.isWeChat() && !_.isWeChatApp(),//true表示pc端才可以使用
      getUnSubmit:"/portal/diaryAction!getAllUnSubmitByPerson.action",//查询一个未提及列表id
      isUseUeditor:false,   //个人网页版,true：是
      originalToPersons:[],       //保存新建、编辑时的默认负责人，选择类型时需要添加上去并去重
      showPerson: false,
      userselectTitle:'',   //人员详细列表标题
      userSelectList:[],   //人员详细列表
      limitPreview:false,   //限制弹个人信息弹窗
      toPersonEdit: true,  // 负责人是否可编辑
    }
  },
  watch: {
    '$route' (to, from) { //从补交页面返回
      if(to.fullPath == '/add') {
        this.resetSelectPerson();
        this.add_nav.moreFunctions = [{name: "summaryDiary"}]
        this.getDiaryType();
        this.needCommit.show = true;
        this.add_nav.isDisabled = false;
        this.add_nav.templateTypeId='';
        this.add_nav.title='';
      }
    }
  },
  created:function(){
    _.showLoading("加载中",true);
    this.resetSelectPerson();
    this.draftDetail.buttonConfig.primaryList[0].callBack=this.checkCommit;
    if(this.draftDetail.buttonConfig.defaultList.length != 0){
      this.draftDetail.buttonConfig.defaultList[0].callBack=this.checkDraft;
    }
    if(this.$route.query.diaryId){ //如果有id，说明是复制或者编辑功能
      this.draftId = this.$route.query.diaryId;
      this.loadDraftData();
      if(this.$route.query.isCopy) { // 如果是 复制 功能，url变为新增接口，否则为更新接口
        this.addOrUpdateUrl = this.addDiary.url;
        this.add.fileUpload.moduleId = '';
      } else {
        this.addOrUpdateUrl = this.draftUpdate.url;
        this.add.fileUpload.moduleId = this.$route.query.diaryId;
      }
    } else { //如果没有，就是新增，新增页面才能选择汇总日志
      this.addOrUpdateUrl = this.addDiary.url;
      var cache = JSON.parse(localStorage.getItem("diaryContentCache"));
      var diaryCache = JSON.parse(localStorage.getItem('diary_add_'+_.userId));
      if(cache&&cache.userId == _.userId&&cache.agentCode=='diary'){ //新建的时候使用缓存
        this.add_nav.content = cache.content;
        if(diaryCache&&diaryCache.title){
          this.add_nav.title = diaryCache.title;
        }
        if(diaryCache&&diaryCache.templateTypeId){
          this.add_nav.templateTypeId = diaryCache.templateTypeId;
        }
      }
      this.add_nav.moreFunctions = [{name:"summaryDiary"}]
    }
    this.draftDetail.buttonConfig.defaultList = (this.$route.query.status=="1" && !this.$route.query.isCopy)? []
      :[{type:"default",name:'保存为草稿', callBack:this.checkDraft}];
    if(this.$route.query.fromSummary || this.$route.query.summaryIds){ //如果不是从汇总页面跳转过来，就要清除旧数据
    }else{
      this.commitDraft.draftFormData = { // 清除数据
        'tbQyDiaryPO.currentDay':'',
        'tbQyDiaryPO.diaryType': '',
        'tbQyDiaryPO.title': '',
        'tbQyDiaryPO.content': '',
        'tbQyDiaryPO.titleFormat': '',
        'toSelectId':0,
        'ccSelectId':0,
        'incharges':'',
        'relatives':'',
        'tbQyDiaryPO.diaryStatus': '',
        'mediaIds': '',
        'imageUrls': '',
        'tbQyDiaryPO.diaryId':'',
        'tbQyDiaryPO.creator':'',
        'tbQyDiaryPO.isUEditor':''
      };
    }
    this.getDiaryType();
    if(this.$route.query.ueditorStatus&&(this.$route.query.ueditorStatus=='true'||this.$route.query.ueditorStatus!='false')){
      this.isUseUeditor = true;
    }else{
      this.isUseUeditor = false;
    }
  },
  methods: {
    changeUeditor:function (val) {//改变是否使用富文本
      this.isUseUeditor = val
    },
    resetSelectPerson(){
      this.dataBase.selectConfig.selectList["toPersonList"].deptSelectedShow = false;
      this.dataBase.selectConfig.selectList["ccPersonList"].deptSelectedShow = false;
      this.dataBase.selectConfig.selectList["toPersonList"].deptSelected = [];
      this.dataBase.selectConfig.selectList["ccPersonList"].deptSelected = [];
      this.dataBase.selectConfig.selectList["toPersonList"].title="负责人";
      this.dataBase.selectConfig.selectList["ccPersonList"].title="相关人";
      this.dataBase.selectConfig.selectList["toPersonList"].loadLast={show:true,name:"加载上次",type:'toPersonList',isGetVal:false};
      this.dataBase.selectConfig.selectList["ccPersonList"].loadLast={show:true,name:"加载上次",type:'ccPersonList',isGetVal:false};
    },
    //获取日志类型
    getDiaryType:function(){
      var self = this;
      _.ajax({
        url: _.baseURL + self.add.diaryTemplate.url,
        type: 'post',
        success: function (result) {
          if(result.code=="0"){
            self.add_nav.templateType = result.data.template;
            //是否有未提交日志，只有新增页面才能点击前往补交日志
            if (_.is_vip && !self.$route.query.diaryId && result.data.unSubmitNum && result.data.unSubmitNum > 0 && self.$route.query.unCommitted != "1") {
              self.needCommit.show = true;
              self.needCommit.unSubmitNum = result.data.unSubmitNum;
            }

            if(!self.$route.query.diaryId) { //如果有id，说明是复制或者编辑功能
              //赋值默认负责人和相关人
              if (result.data.tolist && result.data.tolist.length > 0) {
                self.originalToPersons = result.data.tolist
                self.commitDraft.draftFormData['incharges'] = result.data.tolist.map(value=>{
                  return value.userId
                }).join(',');
                self.dataBase.selectConfig.selectList['toPersonList'].userSelected = result.data.tolist;
              }
              if (result.data.cclist && result.data.cclist.length > 0) {
                self.commitDraft.draftFormData['relatives'] = result.data.cclist.map(value=>{
                  return value.userId
                }).join(',');
                self.dataBase.selectConfig.selectList['ccPersonList'].userSelected = result.data.cclist;
              }
            }
            //是否是补交日志
            self.isUncommittedDiary();

            if(self.$route.query.summaryIds){ //加载完类型后，如果是从选择汇总的日志界面过来，则根据id生成content
              self.initSummaryDiarys(self.$route.query.summaryIds);
            }
            _.hideLoading();
          }else{
            _.alert("提示",result.desc);
            _.hideLoading();
          }
        },
      })
    },
    //点击补交日志
    doCommit:function () {
      if(this.needCommit.unSubmitNum==1){
        this.temptoUser = this.dataBase.selectConfig.selectList["toPersonList"].userSelected;
        this.tempccUser = this.dataBase.selectConfig.selectList["ccPersonList"].userSelected;
        this.findSubmitList();
      }else if(this.needCommit.unSubmitNum > 1){ //前往补交页面列表
        this.$router.push({
          path: '/unCommittedList',
        })
      }
    },
    findSubmitList(){
      var self=this;
      _.ajax({
        url: _.baseURL + self.getUnSubmit,
        type: 'post',
        success: function (result) {
          if(result.data.pageDate){
            var data=result.data.pageDate;
            if(data.pageData){
              self.$router.replace({
                path: '/add',
                query: { unCommitted: '1', unSubmitNum:'1',"diaryTypeId":data.pageData[0].diaryId,
                  "personId":data.pageData[0].personId,"countDay":data.pageData[0].countDay.substring(0,10)}
              });
              self.needCommit.show=false;
              self.temptoUser.length>0?
                self.dataBase.selectConfig.selectList["toPersonList"].userSelected.push(...self.temptoUser):"";
              self.tempccUser.length>0?
                self.dataBase.selectConfig.selectList["ccPersonList"].userSelected.push(...self.tempccUser):"";
              self.resetSelectPerson();
              //是否是补交日志
              self.isUncommittedDiary();
            }
          }
        }
      });
    },
    //判断进来本页面是否是补交日志
    isUncommittedDiary:function () {
      if(this.$route.query.unCommitted == '1'){
        var self = this;
        var flag = false;
        self.needCommit.show = false;
        self.add_nav.templateType.forEach(function (e) { //在类型数据中寻找 补交日志传来的类型id
          if(e.id == self.$route.query.diaryTypeId){
            flag = true;
            self.isPhoto=e.isPhoto;
            // 设置标题
            if(e.title){
              self.getTitleTemp(e.orgId, e.titleFormat, 1, e.title);
            } else {
              self.add_nav.title = _.personName+'_'+timeUtil.moreDateInfo();
            }
            self.add_nav.content = e.content?e.content:'';
            if (e.defaultCclist && e.defaultCclist.length > 0) {
              self.commitDraft.draftFormData['relatives'] = e.defaultCclist.map(value=>{
                return value.userId
              }).join(',');
              self.dataBase.selectConfig.selectList['ccPersonList'].userSelected.push(...e.defaultCclist);
            }
            return false;
          }
        });
        if(flag == false){
          var btnConfig={
            primaryBtn:{name:"确定", callBack:this.routeBack},
            defaultBtn:{name:"", callBack:null}, //次操作按钮
          };
          _.alert("提示","无法使用该日志类型模板，请联系管理员添加进使用范围",btnConfig);
          return;
        }
        self.add_nav.templateTypeId = self.$route.query.diaryTypeId;
        self.commitDraft.draftFormData['tbQyDiaryPO.diaryType'] = self.$route.query.diaryTypeId;
        self.add_nav.isDisabled = true;
        self.commitDraft.draftFormData['tbQyDiaryPO.currentDay'] = self.$route.query.countDay.substring(0,10);
        delete self.commitDraft.draftFormData['tbQyDiaryPO.diaryId'];
        delete self.commitDraft.draftFormData['tbQyDiaryPO.creator'];
        //隐藏加载上次
        self.dataBase.selectConfig.selectList["toPersonList"].loadLast={show:false};
        self.dataBase.selectConfig.selectList["ccPersonList"].loadLast={show:false};
        //加载负责人，负责人不可以重新选择
        self.toPersonEdit=false;
        if(self.commitDraft.draftFormData['incharges'].indexOf(self.$route.query.personId)==-1){
          _.ajax({
            url: _.baseURL + addUpdate.unCommitted.getToPersonUrl,
            type: 'POST',
            data: {userId: self.$route.query.personId},
            dataType: 'json',
            success: function (result) {
              if(result.code == "0") {
                if(result.data.userInfo) {
                  var isExist = false;
                  self.dataBase.selectConfig.selectList["toPersonList"].userSelected.forEach(function (e) {
                    if(e.userId == result.data.userInfo.userId){
                      isExist = true;
                      return;
                    }
                  })
                  if(!isExist) {
                    self.dataBase.selectConfig.selectList["toPersonList"].userSelected.push(result.data.userInfo);
                    self.commitDraft.draftFormData['incharges'] += ','+ self.$route.query.personId;
                  }
                }
              }
            }
          })
        }
      }
    },
    routeBack(){
      this.$router.push({path:'/'});
    },
    //头部传来，需要更多操作,新增页面才能选择汇总日志
    doMoreFunction:function (item) {
      if(item.name="summaryDiary"){
        this.summaryDiary();
      }
    },
    //根据需要汇总的日志id，生成content
    initSummaryDiarys:function (val) {
      var self = this;
      _.ajax({
        url: _.baseURL + self.summaryData.url,
        type: 'POST',
        data: {
          "ids": val
        },
        success: function (result) {
          if (result.code == "0") {
            _.hideLoading();
            var diaryList = result.data.summaryDiaryList;
            var targetStr = "";
            var isLast = "";
            for (var i = 0; i < diaryList.length; i++) {
              isLast = (i != diaryList.length - 1) ? "\r\n" : "";
              targetStr += diaryList[i].title + "\r\n" + diaryList[i].content + isLast;
            }
            if(self.isUseUeditor) { //富文本
              self.add_nav.summaryContent = targetStr;
            }else {
              self.add_nav.content = self.add_nav.content ? (self.add_nav.content + "\r\n" + targetStr) : targetStr;
            }
          } else {
            _.alert('提示', result.desc);
          }
        }
      })
    },
    summaryDiary:function () {
      var btnConfig = [
        {title: "从我提交的日志汇总", callBack: this.jumpToSubmit},
        {title: "从我负责的日志汇总", callBack: this.jumpToDue},
        {title: "取消", callBack: null}
      ];
      this.showBottomMsg('将已有的日志内容合并到当前日志', btnConfig);
    },
    //显示底部弹窗列表
    showBottomMsg:function (title, btnConfig) {
      this.dialogListConfig.title = title? title: "";
      this.dialogListConfig.btnConfig={};
      if(btnConfig){
        this.dialogListConfig.btnConfig=btnConfig;
      }else{
        this.dialogListConfig.btnConfig=[
          {title:"取消", callBack:null}
        ]
      }
      this.dialogListConfig.show = true;
    },
    jumpToSubmit:function () {//我提交的
      this.$router.push({
        path: '/summary',
        query: {status:1, isUeditor:this.isUseUeditor}
      })
    },
    jumpToDue:function () {//我负责的
      this.$router.push({
        path: '/summary',
        query: {status:3, isUeditor:this.isUseUeditor}
      })
    },
    //从编辑或者复制界面进来导入旧数据
    loadDraftData:function(){
      var self = this;
      _.ajax({
        url:_.baseURL+self.draftDetail.url + self.draftId +"&status="+self.$route.query.status,
        type:"get",
        success:function(result){
          _.hideLoading();
          if(result.code==0){
            // 将接口返回数据打包
            var obj=result.data.vo;
            self.isUseUeditor = obj.isUEditor == '1'?true:false;
            //设置标题，只有复制时进行更新
            if(self.$route.query.status == '1' && self.$route.query.isCopy){
              self.getTitleTemp(obj.orgId, obj.titleFormat, 0, obj.title);
            } else {
              self.add_nav.title = obj.title;
            }
            self.add_nav.content=obj.content;
            self.add_nav.templateTypeId=obj.diaryType;
            self.commitDraft.draftFormData['tbQyDiaryPO.diaryType'] = obj.diaryType;
            self.add.imgUpload.picList = obj.picList;
            self.add.fileUpload.mediaList = result.data.mediaList;
            self.add.fileUpload.agent = self.dataBase.wxqyh_uploadfile.agent;
            self.commitDraft.draftFormData['tbQyDiaryPO.diaryId'] = obj.diaryId;
            self.commitDraft.draftFormData['tbQyDiaryPO.creator'] = obj.creator;
            if(obj.ccPersons){
              self.commitDraft.draftFormData['relatives'] = obj.ccPersons.map(value=>{
                return value.userId
              }).join(',');
              _.historySelectPerson("ccPersonList",obj.ccPersons);
            }
            if(obj.toPersons){
              self.originalToPersons = obj.toPersons
              self.commitDraft.draftFormData['incharges'] = obj.toPersons.map(value=>{
                return value.userId
              }).join(',');
              _.historySelectPerson("toPersonList",obj.toPersons);
            }
          }else{
            _.alert("提示",result.desc);
          }
        }
      })
    },
    showMsgFromImgDetail:function (imgurl) {
      this.commitDraft.draftFormData['imageUrls'] = '';
      this.commitDraft.draftFormData['imageUrls'] = imgurl.join(',');
    },
    showMsgFromFileDetail:function (mediaId) {
      this.commitDraft.draftFormData['mediaIds'] = mediaId.join(',');
    },
    doContentCache:function (val) { //保存内容cache
      if(!this.$route.query.diaryId) {
        var jsonCache = {
          'content': val,
          'userId': _.userId,
          'agentCode': 'diary'
        }
        localStorage.setItem("diaryContentCache", JSON.stringify(jsonCache));
      }
    },
    //切换类型，自动设置标题、内容、负责人相关人
    showMsgFromDataDetail:function (val) {
      if(val){
        // 标题、标题模板
        this.add_nav.title = '';
        if(val.title) {
          this.getTitleTemp(val.orgId, val.titleFormat, 2, val.title);
        }
        this.commitDraft.draftFormData['tbQyDiaryPO.titleFormat'] = val.titleFormat;
        this.isPhoto = val.isPhoto?val.isPhoto:0;
        this.commitDraft.draftFormData['tbQyDiaryPO.diaryType'] = val.id;
        this.commitDraft.draftFormData['tbQyDiaryPO.title'] = this.add_nav.title;
        this.commitDraft.draftFormData['tbQyDiaryPO.content'] = this.add_nav.content;

        this.commitDraft.draftFormData['incharges']="";
        this.dataBase.selectConfig.selectList['toPersonList'].userSelected=[];
        this.dataBase.selectConfig.selectList['toPersonList'].loadLast.isGetVal = false;
        let temp = this.originalToPersons.slice(0);
        if (val.tolist && val.tolist.length > 0) {
          val.tolist.forEach(function (e) {
            if(temp.findIndex(item => {
              return item.userId == e.userId
              }) == -1){
              temp.push(e)
            }
          })
        }
        this.commitDraft.draftFormData['incharges'] = temp.map(value=>{
          return value.userId
        }).join(',');
        this.dataBase.selectConfig.selectList['toPersonList'].userSelected = temp;

        this.commitDraft.draftFormData['relatives']="";
        this.dataBase.selectConfig.selectList['ccPersonList'].userSelected=[];
        this.dataBase.selectConfig.selectList['ccPersonList'].loadLast.isGetVal = false;
        if (val.defaultCclist && val.defaultCclist.length > 0) {
          this.commitDraft.draftFormData['relatives'] = val.defaultCclist.map(value=>{
            return value.userId
          }).join(',');
          this.dataBase.selectConfig.selectList['ccPersonList'].userSelected = val.defaultCclist;
        }
      }else{
        this.commitDraft.draftFormData['tbQyDiaryPO.titleFormat'] = '';
        this.commitDraft.draftFormData['tbQyDiaryPO.diaryType'] = '';
      }
    },
    // 获取模板标题 只有复制时需要实时更新标题
    /*
     * param orgId {string} 机构id
     * param titleFormat {string} 标题模版
     * param title {string} 标题
     * param type {number} 类型 1-补交日志 0-复制 2-切换类型
     *  */
    getTitleTemp(orgId, titleFormat, type, title){
      // 判断是否是高级设置的模板（含有{}），兼容xxx yyyyMMdd格式
      var self = this;
      var newStr = titleFormat;
      var arry = titleFormat.match(/{[^}]+}/g);
      if(arry){
        // 类型为1为未补交日志，日期需固定而不是获取最新的
        if(type==1){
          var timeObj = {
            "{createTime@yyyy_MM_dd_HH_mm_ss_E}":  'yyyy_MM_dd_hh_mm_ss_E',
            "{createTime@yyyy_MM_dd_HH_mm_ss}": "yyyy_MM_dd_hh_mm_s",
            "{createTime@yyyyMMdd HHmmss}": "yyyyMMdd hhmmss",
            "{createTime@yyyyMMddHHmmss}": "yyyyMMddhhmmss",
            "{createTime@yyyy/MM/dd HH:mm}": "yyyy/MM/dd hh:mm",
            "{createTime@yyyyMMddHHmm}": "yyyyMMddhhmm",
            "{createTime@yyyyMMdd}":"yyyyMMdd",
            "{createTime@yyyyMM}":"yyyyMM",
            "{createTime@yyyy}": "yyyy",
            "{createTime@E}": "E"
          }
          arry.forEach(item=>{
            // 存在，属于时间字段
            if(timeObj[item]){
              var day = self.$route.query.countDay.replace(/-/g,'/');
              var date = timeUtil.changeFormat(new Date(day), timeObj[item]).replace("E","星期" + "日一二三四五六".charAt(new Date(day).getDay()));
              titleFormat = titleFormat.replace(item, date);
            }
          })
        }
        let dataPost = {
          'orgId': orgId,
          'userId': _.userId,
          'titleFormat': titleFormat
        }
        getTitleTemp(dataPost, (result)=>{
          newStr = result.data.length > 100 ? result.data.substr(0,100) : result.data;
          self.add_nav.title = newStr;
        });
      } else {
        // 兼容旧的格式
        // 1-补交日志 0-复制 2-切换类型
        switch(type) {
          case 0 : newStr = title.replace(/[0-9]{8}/, timeUtil.changeFormat(new Date(),"yyyyMMdd"));
            break;
          case 1: var day = self.$route.query.countDay.replace(/-/g,'/');
                  newStr = titleFormat ? titleFormat.replace("xxx", _.personName).replace("yyyyMMdd", timeUtil.changeFormat(new Date(day),"yyyyMMdd")) :
                         title.replace("xxx", _.personName).replace("yyyyMMdd", timeUtil.changeFormat(new Date(day),"yyyyMMdd"));
            break;
          case 2: newStr = titleFormat ? titleFormat.replace("xxx", _.personName).replace("yyyyMMdd", timeUtil.changeFormat(new Date(),"yyyyMMdd")) :
                         title.replace("xxx", _.personName).replace("yyyyMMdd", timeUtil.changeFormat(new Date(),"yyyyMMdd"));
            break;
          default: break;
        }
        self.add_nav.title = newStr;
      }
    },
    checkCommit:function () {
      this.commitDraft.draftFormData['tbQyDiaryPO.diaryStatus'] = 1; // 提交
      this.isClickWhich = 1; //返回的是一个vue对象，所以可以直接调用其方法
      this.isCheck();
    },
    checkDraft:function () {
      this.commitDraft.draftFormData['tbQyDiaryPO.diaryStatus'] = 0; // 保存为草稿
      this.isClickWhich = 0;
      this.isCheck();
    },
    isCheck: function () { // 父组件点击提交检验数据
      this.commitDraft.draftFormData["tbQyDiaryPO.isUEditor"] = this.isUseUeditor?'1':'0';
      this.commitDraft.draftFormData["tbQyDiaryPO.title"] =  this.add_nav.title;
      this.commitDraft.draftFormData["tbQyDiaryPO.diaryType"] =  this.add_nav.templateTypeId;
      if(this.isUseUeditor&&this.$refs.diaryTitle.getUEContentIsOver()){
        _.alert("提示","内容输入字符超限");
        return;
      }
      this.commitDraft.draftFormData["tbQyDiaryPO.content"] = !this.isUseUeditor?
        this.add_nav.content:this.$refs.diaryTitle.getUEContent();
      if(this.commitDraft.draftFormData['tbQyDiaryPO.diaryType'] == ''){
        _.alert("提示","请选择日志类型");
        return;
      } else if(this.commitDraft.draftFormData["tbQyDiaryPO.title"] == ''){
        _.alert("提示","请填写日志标题");
        return
      } else if(this.commitDraft.draftFormData["tbQyDiaryPO.content"] == ''){
        _.alert("提示","请填写日志内容");
        return
      } else if(this.isPhoto == 1 && !this.isUseUeditor && this.commitDraft.draftFormData['imageUrls'] == ''){
        _.alert("提示","请上传图片");
        return
      }
      this.update();
    },
    //删除负责人
    removeTOPerson(payload){
      this.dataBase.selectConfig.selectList.toPersonList.userSelected.splice(payload.index,1);
      this.removePersonParam('toPersonList','incharges');
    },
    //删除相关人
    removeCCPerson(payload){
      this.dataBase.selectConfig.selectList.ccPersonList.userSelected.splice(payload.index,1);
      this.removePersonParam('ccPersonList','relatives');
    },
    // 点击删除后处理负责人/相关人提交参数
    removePersonParam(el, paramName){
      var personList = this.dataBase.selectConfig.selectList[el].userSelected;
      this.commitDraft.draftFormData[paramName] = personList.map(value=>{
        return value.userId
      }).join(',');
    },
    // 显示所有人
    showPersonList(title,list){
        this.userselectTitle = title;
        this.userSelectList = list;
        this.showPerson = true;
    },
    toPersonListShowBox(){
      var self = this;
      self.dataBase.selectConfig.signIndex="toPersonList";
      self.dataBase.selectConfig.show=true;
      self.dataBase.selectConfig.selectList.toPersonList.callBack.confirm = (type, obj) => {
        self.selectPerson(type, obj);
      }
    },
    ccPersonListShowBox(){
      var self = this;
      self.dataBase.selectConfig.signIndex="ccPersonList";
      self.dataBase.selectConfig.show=true;
      self.dataBase.selectConfig.selectList.ccPersonList.callBack.confirm = (type, obj) => {
        self.selectPerson(type, obj);
      }
    },
    //确定选择的人员返回的数据
    selectPerson(el,obj){
      if(el=="toPersonList"){
        this.commitDraft.draftFormData['incharges'] = obj.user.idStr.replace(/\|/g,",");
      }
      if(el=="ccPersonList"){
        this.commitDraft.draftFormData['relatives'] = obj.user.idStr.replace(/\|/g,",");
      }
    },

    //选人 加载上次
    confirmPick(el,isGet){
      var self = this;
      if(!isGet){
        // 取消加载上次 若是手动加载进来的人员并且属于“加载上次”人员的，取消加载后 主动加载人员不删除
        var [...selectList] = self.dataBase.selectConfig.selectList[el].userSelected;
        var [...ccOrTolist] = self.selectListCache[el].userSelected.slice(0);
        let tempList = [];
        selectList.forEach((e)=>{
          if(ccOrTolist.findIndex(item=>{
            return item == e;
          }) == -1) {
            tempList.push(e);
          }
        })
        self.dataBase.selectConfig.selectList[el].userSelected = tempList;
        var dataParam = el == 'toPersonList'?'incharges':'relatives';
        self.commitDraft.draftFormData[dataParam] = self.dataBase.selectConfig.selectList[el].userSelected.map(value=>{
          return value.userId;
        }).join(',');
      }else if(self.selectListCache[el].userSelected.length > 0){
        var [...selectList] = self.dataBase.selectConfig.selectList[el].userSelected;
        var [...ccOrTolist] = self.selectListCache[el].userSelected.slice(0);
        var [...userList] = [...selectList, ...ccOrTolist];
        let obj = {};
        self.dataBase.selectConfig.selectList[el].userSelected = userList.reduce((curr,next)=>{
          obj[next.userId]?"": obj[next.userId] = true&&curr.push(next);
          return curr;
        }, []);
        var dataParam = el == 'toPersonList'?'incharges':'relatives';
        self.commitDraft.draftFormData[dataParam] = self.dataBase.selectConfig.selectList[el].userSelected.map(value=>{
          return value.userId;
        }).join(',');
      }else {
        _.showLoading();
        _.ajax({
          url: _.baseURL + self.add.getLastPick.url,
          type: 'POST',
          data: {type: el == "toPersonList"?0:1},
          dataType: 'json',
          success: function (result) {
            if(result.code=="0"){
              self.selectListCache[el].userSelected = result.data.ccOrTolist.slice(0);
              var [...selectList] = self.dataBase.selectConfig.selectList[el].userSelected;
              var [...ccOrTolist] = result.data.ccOrTolist.slice(0);
              var [...userList] = [...selectList, ...ccOrTolist];
              let obj = {};
              self.dataBase.selectConfig.selectList[el].userSelected = userList.reduce((curr,next)=>{
                obj[next.userId]?"": obj[next.userId] = true&&curr.push(next);
                return curr;
              }, []);
              var dataParam = el == 'toPersonList'?'incharges':'relatives';
              self.commitDraft.draftFormData[dataParam] = self.dataBase.selectConfig.selectList[el].userSelected.map(value=>{
                return value.userId;
              }).join(',');
            }else{
              _.alert("提示",result.desc);
            }
            _.hideLoading();
          }
        })
      }
    },
    //新增&保存为草稿
    update:function () {
      var self = this;
      _.showLoading('提交中');
      _.ajax({
        url: _.baseURL + self.addOrUpdateUrl,
        type: 'POST',
        data: self.commitDraft.draftFormData,
        dataType: 'json',
        success: function (result) {
          if(result.code=="0"){
            localStorage.removeItem("diaryContentCache")
            localStorage.removeItem("ueditor_preference")
            _.hideLoading();
            if(self.isClickWhich == 1){
              self.homeFooterList.nav_on = 0;
              self.$router.push({path:'/'})
            } else {
              self.$router.push({path:'/draft'})
            }
          }else{
            _.hideLoading();
            _.alert("提示",result.desc);
          }
        }
      })
    }
  },
  components:{
    data_detail,
    img_detail,
    file_detail,
    flow_button,
    user_select,
    dialog_mask_bottom,
    user_selected_item,
    user_selected_group,
    user_show
  },
}

</script>
<style>
  .qwui-diary_uncommit{
    padding: 10px 0;
    color: #fff;
    font-size: 13px;
    line-height: 1.5em;
    text-align: center;
    background: #85868d;
  }
  .qwui-padding_twenty{
    position: relative;
    width: 100%;
    height: 20px;
    background-color: #f5f5f5;
  }
</style>

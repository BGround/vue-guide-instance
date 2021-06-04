<template>
  <div class="wrap">
    <div class="qwui-wrap_bg" :style="{height:mainTaskBoxHeight+'px'}">
      <!--类型-->
      <data_detail class="qwui-data_detail" :dataDetailMsg="add_nav" @listenToChild="showChangeTemplateData"></data_detail>
      <!--标题与内容-->
      <task-title :dataDetailMsg="add_nav"
                  :imageList="imageList"
                  :showStyle.sync="showStyle"
                  @updateImageList="updateImageList"
                  ref="task_title"></task-title>
      <!--任务分派附件/图片组件-->
      <task_enclosure_pic v-show="enclosurePicDisplay"
                          class="qwjs-add_page_file"
                          :enclosure-pic-show="enclosurePicShow"
                          :enclosure-pic-del-class="enclosurePicDelClass"
                          :enclosure-pic-preview-class="enclosurePicPreviewClass"
                          :dataDetailMsg="mediaIds"
                          :fileList="newFileList"
                          :previewImageUrl="previewImageUrl"
                          ref="enclosure_pic"
                          @listenToImg="getImgUrl"
                          @listenToFile="getFileId" @listenToFileList="getFileList"></task_enclosure_pic>
      <!--任务分派主要负责人组件-->
      <task_main_responsible :selectconfig="dataBase.selectConfig3" :closeSwitch="closeSwitch" :taskPage="'mainTask'" :loadLastBtn="loadLastBtn" @listenToChild="getCloseSwitch"></task_main_responsible>
      <!--任务分派相关人组件-->
      <task_main_responsible :selectconfig="dataBase.selectConfig2" :taskPage="'mainTask'" :loadLastBtn="loadLastBtn" v-show="relevantPersonDisplay" :relevant-person-show="relevantPersonShow"></task_main_responsible>
      <!--任务分派时间组件(开始)-->
      <task_time :time-config="timeConfig" @listenToChild="saveTimeCache"></task_time>
      <!--任务分派时间组件(结束)-->
      <task_time :time-config="timeConfig2" @listenToChild="saveTimeCache"></task_time>
      <!--任务分派优先级组件-->
      <task-priority :priority="priority" @listenToChild="getTaskPriority"></task-priority>
      <!--任务分派地图组件-->
      <taskPlace v-show="placeDisplay" :place-show="placeShow" @listenToChild="getPlaceData" :taskAddress="taskAddress"></taskPlace>
      <!--任务分派进度反馈组件-->
      <task-rate v-show="rateDisplay" :selectconfig="dataBase.selectConfig3" :rate-show="rateShow" :rate="rate" @listenToChild="getRateData" @listenChildData="getWorkHours"></task-rate>
      <!--任务分派重复提醒组件-->
      <task-remind v-show="remindDisplay" :remind-show="remindShow"  :reminderTaskPO="reminderTaskPO" :remindBtn="remindBtn"  @listenToChild="getRemindData"></task-remind>
      <!--任务分派子任务组件-->
      <task_subtask v-show="subTaskDisplay" :sub-task-show="subTaskShow"></task_subtask>
      <!--嵌套路由-->
      <router-view></router-view>
      <!--任务分派添加内容组件-->
      <task_add_content @addType="addType" :add-module-type="addModuleType"></task_add_content>
      <!--选择人员(负责人)-->
      <user_select :selectconfig="dataBase.selectConfig3" v-if="dataBase.selectConfig3.show"></user_select>
      <!--选择人员(相关人)-->
      <user_select :selectconfig="dataBase.selectConfig2" v-if="dataBase.selectConfig2.show"></user_select>
      <div class="qwui-height"></div>
      <!--Button组件-->
      <flow_button :buttondata="dataBase.buttonConfig"></flow_button>
    </div>

    <!-- 初次弹出的提示 -->
    <transition name="fade">
      <div class="ft_wrapper" v-if="isFirstTimeLogin">
        <div class="ft_content">
          <div class="top_img"></div>
          <div class="bottom_wrappr">
            <ul>
              <li class="ft_subTitle">· 任务实时协作，操作记录有迹可寻</li>
              <li class="ft_subTitle">· 界面全新改版，交互体验全面提升</li>
              <li class="ft_subTitle">· 更多功能，持续来袭</li>
            </ul>
            <a href="javascript:;" class="ft_closeBtn" @click="closeFT()">立即体验</a>
          </div>
        </div>
      </div>
    </transition>
    <!--预览图片组件-->
    <previewImages></previewImages>
    <!--无权限蒙版-->
    <div class="qwui-perm_mark" v-if="!hasPubPermission"></div>

  </div>
</template>

<script>
  import data_detail from '@/components/add/add_title';
  import taskTitle from '../public/TaskTitle';
  import task_time from '../public/TaskTime';
  import task_main_responsible from '../public/TaskMainResponsible';
  import task_add_content from '../public/TaskAddContent';
  import user_select from '@/components/base/user_or_dept_select';
  import task_enclosure_pic from '../public/TaskAddEnclosurePicture';
  import flow_button from '@/components/button/flow_button';
  import task_subtask from '../public/TaskSubtask';
  import taskRate from '../public/TaskRate';
  import taskPriority from '../public/TaskPriority'
  import taskRemind from '../public/TaskRemind';
  import taskPlace from '../public/TaskPlace';
  import * as timeUtil from '../../../../assets/js/time-util';
  import previewImages from "@/components/base/previewImages";
  import {
    getTaskPermission,
    getTaskTemplate,
    taskAddSubmit,
    getWorkhour,
    getTaskHistoryInfo,
    getTitleTemp
  } from '../../api/getData';

  export default {
    data() {
      return {
        dataBase: dataBase,
        // 发布权限
        hasPubPermission:true,
        add_nav: { //头部信息数据
          nav: '', //头部标题
          title: '',
          titlePlaceholder: 'i18n.taskTitlePlaceholder',
          content: '',
          contentPlaceholder: 'i18n.taskContentPlaceholder',
          templateTypeId: '',
          templateType: [],
          lastTaskTemplate: {},
          isDisabled: false,
          customAlert: true,
          moreFunctions: [],
        },
        // 图片列表
        imageList:[],
        // 图片显示方式
        showStyle:0,
        // 开始时间
        timeConfig: {
          type: 'startTime',
          taskStart: '',
          alertType: 'mainTask',
          timeTemp: ''
        },
        // 截止时间
        timeConfig2: {
          type: 'endTime',
          taskStop: '',
          alertType: 'mainTask',
          timeTemp: ''
        },
        relevantPersonShow: false, // 相关人模块
        placeShow: false,// 任务地点模块
        placeDisplay:false,
        rateShow: false,// 进度反馈模块
        rateDisplay:false,
        loadLastBtn:false,// 加载上次按钮
        remindShow: false,// 提醒模块
        remindDisplay:false,
        subTaskShow: false,// 子任务模块
        enclosurePicShow: false,// 图片附件模块
        addModuleType: 'mainAddModule',
        enclosurePicDelClass: 'qwjs-main_del',
        enclosurePicPreviewClass: 'main-previewer-demo-img',
        initDataFinished: false,
        // 任务优先级
        priority: 0,
        // 进度反馈
        rate: 0,
        closeSwitch:0,
        // 任务地点数据
        taskAddress: {
          value: '',
          longitude: 0,
          latitude: 0
        },
        // 主任务页面高度
        mainTaskBoxHeight: null,
        // 提醒频率信息
        reminderTaskPO: {},
        // 提醒按钮
        remindBtn: {
          sendStartRemindMsg: 0,
          deadlineRemindMsg: 0,
          commentSendMsg: 1,
          rateSendMsg: 1,
          remindSwitch: 0
        },
        // 图片附件组件内展示的图片附件数据列表
        newFileList: [],
        // 图片附件id（传给后台）
        mediaIds: [],
        // 图片预览列表
        previewImageUrl:[],

        // 新建或者保存草稿成功，跳转页面是否需要刷新
        isHomeRefresh: false,
        isFirstTimeLogin: false, // 用户第一次登陆进入新版本任务分派，需要引导图
        // 提交任务的默认数据
        taskData: {
          'tbQyTaskPO.isUseRate': 0,
          'tbQyTaskPO.closeSwitch': 0, // 负责人可结束/拒绝/重启任务
          'imageUrls': '',
          'mediaIds': '',
          'subtaskJsonStr': [],
          'tbQyTaskPO.sendStartRemindMsg': 0,
          'deadlineRemindMsg': 0,
          'tbQyTaskPO.commentSendMsg': 1,
          'tbQyTaskPO.rateSendMsg': 1,
          'tbQyTaskPO.remindSwitch': 0,
          'tbQyTaskPO.accessAddress': '',
          'tbQyTaskPO.latitude': '',
          'tbQyTaskPO.longitude': '',
          'tbQyTaskPO.taskStatus': 1,
          'tbQyTaskPO.priority': 0,
          'taskSendMsgStatus': 0, // 0新建，1更新
          'relatives': ''
        },
        // 新建页面缓存数据
        addDataCache:{
          taskType:'',
          title:'',
          content: '',
          taskStart:'',
          taskStop:'',
          toPersons:[],
          ccPersons:[],
          priority:0,
          isUseRate:0,
          closeSwitch:0,
          accessAddress:'',
          longitude:'',
          latitude:'',
          reminderTaskPO:{
            remindCycle:0,
            regExp:'',
            remindTime:{
              time:''
            }
          },
          sendStartRemindMsg:0,
          sendMsg:0,
          commentSendMsg:1,
          rateSendMsg:1,
          remindSwitch:0,
        },
        // 是否有缓存
        hasCache:false,
        // 主任务附件缓存数据
        mediaListCache:{
          mediaList:[]
        },
        picListCache:{
          picList:[]
        },
        // 任务时间类型数据
        timeCollection:{
          current:0,
          tenMinute:1000*60*10,
          thirtyMinute:1000*60*30,
          oneHour:1000*60*60,
          threeHour:1000*3600*3,
          oneDay:1000*3600*24,
          threeDay:1000*3600*24*3,
          oneWeek:1000*3600*24*7
        },
        // 子任务是否加载主任务标题内容
        isLoad:'0',
      }
    },
    created() {
      // 请求判断是否是第一次进入
      var self = this
      _.ajax({
        url: _.baseURL + '/portal/taskPortalCtl/isNeedGuide.do',
        type: 'POST',
        success: function (result) {
          if (result.data.isNeedGuide) {
            self.showFT()
          }
        }
      })
      // 如果新建页面有缓存数据，则将缓存的数据赋值给addDataCache
      if (localStorage.getItem('addDataCache')){
        this.hasCache = true;
        this.addDataCache = JSON.parse(localStorage.getItem('addDataCache'))
    }
      // 渲染任务数据
      this.renderTaskData();

    },
    methods: {
      renderTaskData(){

        // 新建页面初始化
        this.$store.commit('taskDataStatusInit');
        // dataBase部分数据初始化
        if (!localStorage.getItem('addDataCache')){
          this.initAddData();
        }

        window.sessionStorage.removeItem('fromAddContent');
        this.dataBase.buttonConfig.primaryList[0].callBack = this.checkCommit;
        this.dataBase.buttonConfig.defaultList[0].callBack = this.checkDraft;

        // 赋值新建页面高度
        if (document.documentElement.clientHeight > 0) {
          this.mainTaskBoxHeight = document.documentElement.clientHeight;
        } else {
          this.mainTaskBoxHeight = "auto";
        }
        // 获取任务权限
        getTaskPermission((result) => {
          this.hasPubPermission = result.hasPermission;
          if (!result.hasPermission){
            let self = this;
            let btn={
              primaryBtn: {
                name: '确定',
                callBack: function(){
                  self.$router.push({
                    name: 'home',
                  });
                }
              },
              defaultBtn:{
                name:"",
                callBack:null
              },
            };
            _.alert('提示','你没有发布任务权限，请联系管理员开通',btn);
            return;
          }
          this.$store.commit('taskPermissionUpdate', result.tbQyTaskScoresettingVO);

          // 获取任务类型
          getTaskTemplate((data) => {
            // 无缓存任务类型的新增页
            if (!this.$store.getters.isDetailPage && !this.$store.getters.isCopyPage && this.addDataCache.taskType == '') {
              // 不开启自动加载上一次任务类型按钮，显示类型为请选择
              if (!result.tbQyTaskScoresettingVO.openLoadTaskType) {
                this.add_nav.lastTaskTemplate = '';
              }else {
                // 获取上一次所选的任务类型或者第一个，没有任务类型则为空
                this.add_nav.lastTaskTemplate = data.lastTaskTemplate || (data.template[0] ? data.template[0].id : '');
              }
            }
            // 任务类型数据列表
            this.add_nav.templateType = data.template;
            // 如果没有任务类型，显示请选择
            if (data.template.length == 0){
              document.querySelector('.qwui-data_detail .qwui-title_item_select option:first-child').style = 'display:inline-block !important'
            }

            // 是否默认开启负责人可结束按钮
            this.closeSwitch = result.tbQyTaskScoresettingVO.openOverTask;
            this.addDataCache.closeSwitch = this.closeSwitch;

            // 新建时无缓存数据 或者复制页面，自动初始化时间

            if (this.$route.query.taskId || this.addDataCache.taskStart == '' || (this.addDataCache.taskStart && new Date() > new Date(this.addDataCache.taskStart.replace(/-/g,'/')))){
              // 任务默认开始时间为当前时间加一个小时，默认截止时间为当前时间加两个小时
              if (result.tbQyTaskScoresettingVO.timeSetting == 0){
                getWorkhour((data)=>{
                  // 当前时间大于下班时间且小于第二天0点，默认为第二天上下班时间
                  let todayTime = timeUtil.changeFormat(new Date(),'yyyy/MM/dd');
                  let mornTime = timeUtil.changeFormat(new Date().getTime()+3600000*24,'yyyy-MM-dd');
                  let currTime = timeUtil.changeFormat(new Date(),'yyyy-MM-dd hh:mm');
                  let workInTime = timeUtil.changeFormat(new Date(todayTime + ' ' + data.tbQyWorkhourPO.workInTime),'hh:mm');
                  let workOutTime = timeUtil.changeFormat(new Date(todayTime + ' ' + data.tbQyWorkhourPO.workOutTime),'hh:mm');
                  // 超过下班时间
                  let isTimeOut = new Date() > new Date(todayTime + ' ' + workOutTime) && new Date(todayTime + ' ' + workOutTime) <= new Date(todayTime + ' 23:59');
                  // 超过上班时间
                  let isOutWorkInTime = new Date() > new Date(todayTime + ' ' + workInTime);
                  if (isTimeOut){
                    this.timeConfig.timeTemp = mornTime + ' ' + workInTime;
                  }else {
                    this.timeConfig.timeTemp = isOutWorkInTime ? currTime : todayTime.replace(/\//g,'-') + ' ' + workInTime;
                  }
                  this.timeConfig2.timeTemp = (isTimeOut ? mornTime : todayTime.replace(/\//g,'-')) + ' ' + workOutTime;

                  this.$store.commit('startTimeHandler', this.timeConfig.timeTemp);
                  this.$store.commit('stopTimeHanlder', this.timeConfig2.timeTemp);

                  this.renderCopyDraftData();
                  return;
                })
              }else {
                this.timeConfig.timeTemp = timeUtil.changeFormat(new Date().getTime() + this.timeCollection[result.tbQyTaskScoresettingVO.taskStartStr],'yyyy-MM-dd hh:mm');
                this.timeConfig2.timeTemp = timeUtil.changeFormat(new Date(this.timeConfig.timeTemp.replace(/-/g,'/')).getTime() + this.timeCollection[result.tbQyTaskScoresettingVO.taskStopStr],'yyyy-MM-dd hh:mm');
                this.renderCopyDraftData();
              }

              this.$store.commit('startTimeHandler', this.timeConfig.timeTemp);
              this.$store.commit('stopTimeHanlder', this.timeConfig2.timeTemp);

            }else {
              this.renderCopyDraftData();
            }

          });

        });

      },
      renderCopyDraftData(){
        // 复制任务或编辑草稿数据初始化
        if (this.$route.query.taskId) {
          this.$store.commit('isCopyPageUpdate', true);
          this.$store.commit('taskIdUpdate',this.$route.query.taskId);

          // isDraft为true,草稿编辑页
          if (this.$route.query.isDraft){
            this.$store.commit('isDraftPageUpdate',true);
          }

          // 获取任务历史信息
          getTaskHistoryInfo({
            taskId: this.$route.query.taskId,
            status: ''
          }, this.renderAddData)
        }else {
          // 有缓存，渲染缓存数据
          if (this.hasCache){
            this.renderAddData('',true)
          }
        }
      },
      // 初始化一些dataBase的数据
      initAddData(){
        this.dataBase.selectConfig3 = { //负责人
          show: false,
          signIndex: '',
          selectList: {
            "toPersonList": {
              "title": "",
              "selectType": "user",
              "userName": "incharges",
              "userSelected": [],
              "deptSelected": [],
              "deptSelectedShow": false,
              "callBack": {
                "confirm": null,
              },
            },
            type: 'toPersonList',
            showContent: '负责人',
            showBtn: false,
          },
        };
        this.dataBase.selectConfig2 = { //相关人
          show: false,
          signIndex: '',
          selectList: {
            "ccPersonList": {
              "title": "",
              "selectType": "user",
              "userName": "relatives",
              "userSelected": [],
              "deptSelectedShow": false,
              "callBack": {
                "confirm": null,
              }
            },
            type: 'ccPersonList',
            showContent: '相关人',
          }
        }
      },
      // 渲染任务历史信息或缓存的任务信息，根据status判断是否是缓存，status为true则是缓存
      renderAddData(result,status){
        let detail;
        detail = status ? JSON.parse(localStorage.getItem('addDataCache')) : result.vo;

        // 任务类型、标题、内容
        this.add_nav.templateTypeId = detail.taskType;

        // 根据缓存或者复制草稿接口返回的任务类型，存储子任务模板
        for (let i = 0; i < this.add_nav.templateType.length; i++) {
          let template = this.add_nav.templateType[i];
          if (template.id == this.add_nav.templateTypeId){
            this.isLoad = template.isLoad;
            this.templateTransform('subNumber',template.orgId,template.subtaskNumberFormat,template.subtaskNumber);
            this.templateTransform('subTitle',template.orgId,template.subtaskTitleFormat);
            this.$store.commit('subTaskContentFormatUpdate', template.subtaskContentFormat || '');
            break;
          }
        }

        this.add_nav.title = detail.title;
        this.add_nav.content = detail.content;
        // 如果是草稿或者有缓存时间，加上时间
        if (this.$route.query.isDraft || (status &&  this.addDataCache.taskStart && new Date() < new Date(this.addDataCache.taskStart.replace(/-/g,'/')))){
          this.$store.commit('startTimeHandler', detail.taskStart.substring(0, 16));
          this.$store.commit('stopTimeHanlder', detail.taskStop.substring(0, 16));
          this.timeConfig.timeTemp = detail.taskStart.substring(0, 16);
          this.timeConfig2.timeTemp = detail.taskStop.substring(0, 16);
        }

        // 任务负责人
        if (detail.toPersons) {
          this.closeSwitch = detail.closeSwitch;
          this.dataBase.selectConfig3.selectList['toPersonList'].userSelected = detail.toPersons;
          this.$store.commit('updateMainIncharges', detail.toPersons);
        }
        // 任务相关人
        if (detail.ccPersons.length > 0) {
          this.dataBase.selectConfig2.selectList['ccPersonList'].userSelected = detail.ccPersons;
          this.$store.commit('mainAddContentModuleHideUpdate');
          this.$store.commit('relevantPersonDisplayUpdate', true);
        }

        // 任务优先级、进度反馈
        this.$store.commit('rateAddContentDisplayUpdateHide');
        this.$store.commit('mainAddContentModuleHideUpdate');
        this.$store.commit('rateDisplayUpdate');
        this.rateDisplay = true;
        this.priority = Number(detail.priority);
        this.rate = Number(detail.isUseRate);
        this.$store.commit('taskRateUpdate', this.rate);

        // 任务地点经纬度
        if (detail.accessAddress) {
          this.$store.commit('placeDisplayUpdate');
          this.placeDisplay = true;
          this.taskAddress = {
            'value': detail.accessAddress,
            'longitude': detail.longitude,
            'latitude': detail.latitude
          };
        }

        // 任务提醒数据
        this.$store.commit('remindDisplayUpdate');
        this.remindDisplay = true;
        this.reminderTaskPO = detail.reminderTaskPO;
        this.remindBtn.sendStartRemindMsg = detail.sendStartRemindMsg;
        this.remindBtn.deadlineRemindMsg = detail.sendMsg;
        this.remindBtn.commentSendMsg = detail.commentSendMsg;
        this.remindBtn.rateSendMsg = detail.rateSendMsg;
        this.remindBtn.remindSwitch = detail.remindSwitch;
        this.$store.commit('remindRenderUpdate', true);

        // 子任务数据
        let subtask;
        if (status && localStorage.getItem('subListDataCache')){
          subtask = JSON.parse(localStorage.getItem('subListDataCache')).subtask;
        }else {
          subtask = result == '' ? [] : result.subtask;
        }
        if (subtask && subtask.length > 0) {
          this.$store.commit('mainAddContentModuleHideUpdate');
          this.$store.commit('subTaskDisplayUpdate');
          this.$store.commit('subTaskDetailDataUpdate',subtask);
          this.$store.commit('subTaskNumUpdate', subtask.length);
        }

        // 图片数据
        if (status && localStorage.getItem('picListCache')){
          this.imageList = JSON.parse(localStorage.getItem('picListCache')).picList;
        }else {
          if (result){
            detail.picList.forEach((item)=>{
              item.src = item.picPath;
            });
            this.imageList = detail.picList;
            this.showStyle = detail.showStyle;
          }
        }
        if (this.imageList.length > 0){
          this.$store.commit('imageDisplayUpdate',true)
        }

        // 附件数据
        let mediaList;
        if (status && localStorage.getItem('mediaListCache')){
          mediaList = JSON.parse(localStorage.getItem('mediaListCache')).mediaList;
        }else {
          mediaList = result == '' ? [] : result.mediaList;
        }
        if (mediaList.length > 0) {
          this.$store.commit('mainAddContentModuleHideUpdate');
          this.$store.commit('mainEnclosurePicAddContentDisplayUpdateHide');
          this.$store.commit('enclosurePicDisplayUpdate');
          for (let i = 0; i < mediaList.length; i++) {
            let media = mediaList[i];
            let file = {
              fileName: media.fileName,
              id: media.id,
              fileExt: media.fileExt || 'JPG',
            };
            let imgType = ['PNG', 'JPG', 'BMP', 'JPEG'];
            if (imgType.indexOf(file.fileExt) != -1) {
              file.src = media.url ? _.compressURL + media.url : media.src;
              file.fileSize = media.fileSizeStr || media.fileSize;
              this.previewImageUrl.push({src: file.src});
            } else {
              file.fileSizeStr = media.fileSizeStr || media.fileSize;
              file.url = _.compressURL + media.url;
            }

            this.newFileList.push(file);
            this.mediaIds.push(media.id);
          }
        }

        // 数据存储需要发送的数据
        this.taskData = {
          'tbQyTaskPO.taskType': detail.taskType,
          'tbQyTaskPO.isUseRate': detail.isUseRate,
          'tbQyTaskPO.closeSwitch': detail.closeSwitch, // 负责人可结束/拒绝/重启任务
          'imageUrls': '',
          'mediaIds': this.mediaIds.join(','),
          'subtaskJsonStr': [],
          'tbQyTaskPO.sendStartRemindMsg': detail.sendStartRemindMsg,
          'deadlineRemindMsg': detail.sendMsg,
          'tbQyTaskPO.commentSendMsg': detail.commentSendMsg,
          'tbQyTaskPO.rateSendMsg': detail.rateSendMsg,
          'tbQyTaskPO.remindSwitch': detail.remindSwitch,
          'remindTask.remindCycle': detail.remindCycle,
          'tbQyTaskPO.accessAddress': detail.accessAddress,
          'tbQyTaskPO.latitude': detail.latitude,
          'tbQyTaskPO.longitude': detail.longitude,
          'tbQyTaskPO.taskStatus': 1,
          'tbQyTaskPO.priority': detail.priority,
          'taskSendMsgStatus': 0, // 0新建，1更新
          'relatives': ''
        };
        // 有提醒数据且任务提醒按钮打开了
        if (detail.reminderTaskPO && detail.remindSwitch) {
          // 提醒频率数据
          this.taskData['remindTask.regExp'] = JSON.stringify(detail.reminderTaskPO.regExp);
          // 重复提醒时间
          this.taskData['remindTask.remindTime'] = timeUtil.changeFormat(new Date(),'yyyy-MM-dd') + ' ' + timeUtil.changeFormat(new Date(
            detail.reminderTaskPO.remindTime.time), 'hh:mm:ss');
        }

        // 主任务负责人id
        let inchargeId = [];
        let taskHours = [];
        if (this.inchargeData.length > 0) {
          this.inchargeData.forEach((item) => {
            inchargeId.push(item.userId);
            taskHours.push(item.workHour)
          });
        }
        this.taskData['incharges'] = inchargeId.join(','); // 主任务负责人
        this.taskData['taskHours'] = taskHours.join(','); // 任务工时
      },
      // 修改任务类型触发
      showChangeTemplateData(data) {
        // 复制页面修改类型不触发类型模版
        if (data && data.id) {
          this.taskData['tbQyTaskPO.taskType'] = data.id; // 类型
        }
        if (data){

          // 主任务与子任务编号赋值
          this.templateTransform('mainTitle',data.orgId,data.maintaskTitleFormat,data.title);
          this.templateTransform('subNumber',data.orgId,data.subtaskNumberFormat,data.subtaskNumber);

          // 子任务不加载主任务标题内容则使用模板内容

          this.isLoad = data.isLoad;

          if (data.isLoad === '0'){
            this.templateTransform('subTitle',data.orgId,data.subtaskTitleFormat);
            this.$store.commit('subTaskContentFormatUpdate', data.subtaskContentFormat || '');

            // 是否替换内容的提示弹框
            let hasContent = data.content && this.add_nav.content;
            let hasSubContent = data.subtaskContentFormat && this.subTaskData.subtask.length > 0;
            let self = this;
            if (hasContent || hasSubContent){

              let btn = {
                primaryBtn: {name: '替换', data: data.subtaskContentFormat, callBack: function () {
                  // 赋值主任务内容及子任务内容
                  self.add_nav.content = data.content || self.add_nav.content;

                  if (hasSubContent){
                    if (self.subTaskData.subtask.length > 0){
                      self.subTaskData.subtask.forEach((item)=>{
                        item.content = data.subtaskContentFormat;
                      });
                      self.$store.commit('subTaskDataUpdate',self.subTaskData);
                    }
                  }
                }},
                defaultBtn: {name: "不替换", callBack: null},
              };
              _.alert("提示", '是否用[' + data.name + ']的模板内容替换正文内容？', btn);

            }else {
              this.add_nav.content = data.content || '';
            }
          }else {
            if (this.add_nav.content && data.content){
              let self = this;
              let btn = {
                primaryBtn: {name: '替换', callBack: function () {
                  self.add_nav.content = data.content || '';
                }},
                defaultBtn: {name: "不替换", callBack: null},
              };
              _.alert("提示", '是否用[' + data.name + ']的模板内容替换正文内容？', btn);
            }

            this.$store.commit('subTaskTitleFormatUpdate',this.add_nav.title);
            this.$store.commit('subTaskContentFormatUpdate',this.add_nav.content);
          }
        }
        // 新增页且有数据
        if (!this.$store.getters.isDetailPage && !this.$store.getters.isCopyPage && data) {
          // 任务类型里的负责人
          this.dataBase.selectConfig3.selectList.toPersonList.userSelected = [];
          this.dataBase.selectConfig3.selectList.toPersonList.userSelected.push(...data.tbQyTaskGivenVOList);
          // 存储主任务负责人，用于设置工时
          this.$store.commit('updateMainIncharges', data.tbQyTaskGivenVOList);
          // 任务类型里的相关人，没有则将相关人数据清空
          if (data.ccTbQyTaskGivenVOList.length > 0) {
            this.dataBase.selectConfig2.selectList.ccPersonList.userSelected = [];
            this.dataBase.selectConfig2.selectList.ccPersonList.userSelected.push(...data.ccTbQyTaskGivenVOList);
            // 如果还没添加相关人模块，则添加
            if (!this.$store.getters.relevantPersonDisplay) {
              this.$store.commit('relevantPersonDisplayUpdate', true);

            }
          } else {
            this.dataBase.selectConfig2.selectList.ccPersonList.userSelected = [];
          }
          // 关闭加载上次按钮
          this.loadLastBtn = !this.loadLastBtn;
        }
      },
      // 模板转换成文字
      templateTransform(type,orgId,titleFormat,text){
        if (!titleFormat){
          switch (type) {
            case 'mainTitle':
              this.add_nav.title = text || '';
              break;
            case 'subNumber':
              this.$store.commit('subTaskNumberUpdate',text || '');
              break;
            case 'subTitle':
              this.$store.commit('subTaskTitleFormatUpdate','');
              break;
          }
          return;
        }
        getTitleTemp({
          'orgId': orgId,
          'userId': _.userId,
          'titleFormat': titleFormat
        },(data)=>{
          // 模板内容超过一百字则截取前一百
          data.data.length > 100
            ? data.data = data.data.substr(0,100)
            : '';
          switch (type){
            case 'mainTitle':
              this.add_nav.title = data.data;
              break;
            case 'subNumber':
              this.$store.commit('subTaskNumberUpdate',data.data);
              break;
            case 'subTitle':
              this.$store.commit('subTaskTitleFormatUpdate',data.data);
              if (this.subTaskData.subtask.length > 0){
                this.subTaskData.subtask.forEach((item)=>{
                  item.title = data.data;
                });
                this.$store.commit('subTaskDataUpdate',this.subTaskData);
              }
              break
          }
        })
      },
      // 任务时间缓存
      saveTimeCache(){
        if (!this.isAddPage){
          return;
        }
        this.addDataCache.taskStart = this.timeConfig.timeTemp + ':00';
        this.addDataCache.taskStop = this.timeConfig2.timeTemp + ':00';
        localStorage.setItem('addDataCache',JSON.stringify(this.addDataCache));
      },
      // 获取负责人可结束、拒绝、重启按钮
      getCloseSwitch(key) {
        this.closeSwitch = key;
        this.taskData['tbQyTaskPO.closeSwitch'] = key;

        if (!this.isAddPage){
          return;
        }
        this.addDataCache.closeSwitch = key;
        localStorage.setItem('addDataCache',JSON.stringify(this.addDataCache));
      },
      // 获取任务优先级
      getTaskPriority(key) {
        this.taskData['tbQyTaskPO.priority'] = key; // 优先级

        if (!this.isAddPage){
          return;
        }
        this.addDataCache.priority = key;
        localStorage.setItem('addDataCache',JSON.stringify(this.addDataCache));
      },
      // 获取进度反馈数据
      getRateData(key) {
        if (key == ''){
          this.rateDisplay = false;
          return;
        }
        this.taskData['tbQyTaskPO.isUseRate'] = key; // 进度反馈
        this.$store.commit('taskRateUpdate', key);

        if (!this.isAddPage){
          return;
        }
        this.addDataCache.isUseRate = key;
        localStorage.setItem('addDataCache',JSON.stringify(this.addDataCache));
      },
      // 获取任务工时
      getWorkHours(data) {
        let taskHours = [];
        for (let i = 0; i < data.length; i++) {
          var taskHour = data[i].workHour || '10';
          taskHours.push(taskHour);
        }
        this.taskData['taskHours'] = taskHours.join(',');
      },
      updateImageList(imageList){
        this.imageList = imageList;
        if (!this.isAddPage){return}
        this.picListCache.picList = imageList;
        localStorage.setItem('picListCache',JSON.stringify(this.picListCache));
      },
      getImgUrl(url) {
        this.taskData['imageUrls'] = url.join(',');
      },

      // 获取图片附件数据
      getFileId(mediaIds) {
        document.querySelector('.qwjs-add_page_file').scrollIntoView(true);
        this.taskData['mediaIds'] = mediaIds.join(',');
      },
      // 获取详细的图片附件数据
      getFileList(list){
        if (!this.isAddPage){
          return;
        }
        this.mediaListCache.mediaList = list;
        localStorage.setItem('mediaListCache',JSON.stringify(this.mediaListCache));
      },

      // 获取子任务数据
      getSubTaskData(subTaskData) {
        this.$store.commit('subTaskNumUpdate', subTaskData.subtask.length);
        this.taskData['subtaskJsonStr'] = JSON.stringify(subTaskData); // 子任务数据
      },

      // 获取任务提醒数据
      getRemindData(remindData) {
        if (remindData == ''){
          this.remindDisplay = false;
          return;
        }
        // 开始前30分钟与截止前30分钟传值有差异
        this.taskData['tbQyTaskPO.sendStartRemindMsg'] = remindData.dataDetailMsg.switchControl[0].onOff ? 0 : -1; // 开始前30分钟提醒
        this.taskData['deadlineRemindMsg'] = remindData.dataDetailMsg.switchControl[1].onOff ? 0 : 1; // 截止前30分钟提醒
        this.taskData['tbQyTaskPO.commentSendMsg'] = remindData.dataDetailMsg.switchControl[2].onOff ? 1 : 0; // 有新评论时提醒
        this.taskData['tbQyTaskPO.rateSendMsg'] = remindData.dataDetailMsg.switchControl[3].onOff ? 1 : 0; // 更新进度时发送通知
        this.taskData['tbQyTaskPO.remindSwitch'] = remindData.remindSwitch ? 1 : 0; // 重复提醒按钮

        // 缓存提醒数据
        this.addDataCache.sendStartRemindMsg = this.taskData['tbQyTaskPO.sendStartRemindMsg'];
        this.addDataCache.sendMsg = this.taskData['deadlineRemindMsg'];
        this.addDataCache.commentSendMsg = this.taskData['tbQyTaskPO.commentSendMsg'];
        this.addDataCache.rateSendMsg = this.taskData['tbQyTaskPO.rateSendMsg'];

        if(remindData.remindSwitch){
          this.taskData['remindTask.remindCycle'] = remindData.dateList[remindData.remindCycle].cycle; // 重复提醒频率

          this.addDataCache.remindSwitch = 1;
          this.addDataCache.reminderTaskPO.remindCycle = this.taskData['remindTask.remindCycle'];

          if (remindData.remindCycle == 5) {
            this.taskData['remindTask.regExp'] = JSON.stringify(remindData.regExp); // 重复提醒自定义数据

            this.addDataCache.reminderTaskPO.regExp = remindData.regExp;
          }
          this.taskData['remindTask.remindTime'] = timeUtil.changeFormat(new Date(),'yyyy-MM-dd') + ' ' + remindData.remindTime + ':00'; // 重复提醒时间

          this.addDataCache.reminderTaskPO.remindTime.time = new Date(this.taskData['remindTask.remindTime'].replace(/-/g,'/')).getTime();
        }

        if (!this.isAddPage){
          return;
        }
        localStorage.setItem('addDataCache',JSON.stringify(this.addDataCache));
      },
      // 获取任务地点信息
      getPlaceData(placeData) {
        if (placeData == 'hide'){
          this.placeDisplay = false;
          return;
        }
        if (placeData) {
          this.taskData['tbQyTaskPO.accessAddress'] = placeData.address; // 地点
          this.taskData['tbQyTaskPO.latitude'] = placeData.latitude; // 纬度
          this.taskData['tbQyTaskPO.longitude'] = placeData.longitude; // 经度
          // 缓存任务地点数据

          if (!this.isAddPage){
            return;
          }
          this.addDataCache.accessAddress = placeData.address;
          this.addDataCache.latitude = placeData.latitude;
          this.addDataCache.longitude = placeData.longitude;
          localStorage.setItem('addDataCache',JSON.stringify(this.addDataCache));
        }
      },
      // 点击立即提交按钮
      checkCommit() {
        this.taskData['tbQyTaskPO.taskStatus'] = 1;
        this.taskSubmit();
      },
      // 点击保存草稿按钮
      checkDraft() {
        this.taskData['tbQyTaskPO.taskStatus'] = 0; // 任务状态，0为草稿，1为已提交
        this.taskSubmit();
      },
      // 保存草稿与立即提交
      taskSubmit() {
        let self = this;
        if (this.add_nav.templateTypeId == '' || this.add_nav.templateTypeId == undefined) {
          _.alert('i18n.notice', 'i18n.taskTypeNotEmpty');
          return;
        }
        if (this.add_nav.title === '') {
          _.alert('i18n.notice', 'i18n.taskTitleNotEmpty');
          return;
        }
        _.showLoading("i18n.submitting");
        this.taskData['tbQyTaskPO.title'] = this.add_nav.title; // 标题
        this.taskData['tbQyTaskPO.content'] = this.add_nav.content; // 内容
        this.taskData['tbQyTaskPO.taskStart'] = this.timeConfig.timeTemp + ':00'; // 开始时间
        this.taskData['tbQyTaskPO.taskStop'] = this.timeConfig2.timeTemp + ':00'; // 结束时间
        this.taskData['tbQyTaskPO.filepicCount'] = this.mediaIds.length + this.imageList.length;
        this.taskData['tbQyTaskPO.showStyle'] = this.showStyle;
        // 任务图片
        let imageUrl = [];
        this.imageList.forEach((item)=>{
          imageUrl.push(item.src)
        });
        this.taskData['imageUrls'] = imageUrl.join(',');
        // 主任务负责人id
        let inchargeId = [];
        if (this.inchargeData.length > 0) {
          this.inchargeData.forEach((item) => {
            inchargeId.push(item.userId);
          });
        }
        this.taskData['incharges'] = inchargeId.join(','); // 主任务负责人

        // 添加相关人模块，获取相关人id
        if (this.$store.getters.relevantPersonDisplay) {
          let relativeId = [];
          this.relativeData.forEach((item) => {
            relativeId.push(item.userId);
          });
          this.taskData['relatives'] = relativeId.join(','); // 主任务相关人
        }
        // 子任务数据
        this.getSubTaskData(this.$store.getters.subTaskData);
        // 草稿页进入新建多加一个taskId
        if (this.$route.query.isDraft) {
          this.taskData['tbQyTaskPO.taskId'] = this.$route.query.taskId;
        }
        // 发送请求，立即提交后返回首页，保存草稿则跳转草稿页
        taskAddSubmit(this.taskData, function () {
          localStorage.removeItem('addDataCache');
          localStorage.removeItem('mediaListCache');
          localStorage.removeItem('subListDataCache');
          localStorage.removeItem('subTaskCache');
          self.isHomeRefresh = true;
          if (self.taskData['tbQyTaskPO.taskStatus'] == 1) {
            self.$router.push({
              name: 'home',
            });
          } else {
            self.$router.push({
              name: 'draft',
            });
          }
        })
      },
      // 点击添加内容页面里的任务模块
      addType(type) {
        if (type == 1) {
          this.relevantPersonShow = !this.relevantPersonShow;
        } else if (type == 2) {
          this.placeDisplay = true;
          this.placeShow = !this.placeShow;
        } else if (type == 3) {
          this.rateDisplay = true;
          this.rateShow = !this.rateShow;
        } else if (type == 4) {
          this.remindDisplay = true;
          this.remindShow = !this.remindShow;
        } else if (type == 5) {
          this.$router.push({
            name:'subtask'
          });
          this.subTaskShow = !this.subTaskShow;
        } else if (type == 6) {
          if (_.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp()) {
            this.$store.commit('enclosurePicDisplayUpdate');
          }
          this.$refs.enclosure_pic.enclosure_pic_click();
        } else if (type == 8){
          this.$refs.task_title.$refs.img_upload.$refs.add_img.$refs.input.click();
        }
      },
      showFT() {
        this.isFirstTimeLogin = true;
      },
      closeFT() {
        this.isFirstTimeLogin = false;
      },
    },
    computed: {
      isAddPage(){
        return !this.$route.query.taskId;
      },
      relevantPersonDisplay() {
        return this.$store.getters.relevantPersonDisplay;
      },
      subTaskDisplay() {
        return this.$store.getters.subTaskDisplay;
      },
      enclosurePicDisplay() {
        return this.$store.getters.enclosurePicDisplay;
      },
      inchargeData() {
        return this.dataBase.selectConfig3.selectList.toPersonList.userSelected;
      },
      relativeData() {
        return this.dataBase.selectConfig2.selectList.ccPersonList.userSelected;
      },
      subTaskData(){
        return this.$store.getters.subTaskData;
      },
    },
    watch: {
      'add_nav.templateTypeId':function () {
        if (!this.isAddPage){
          return;
        }
        this.addDataCache.taskType = this.add_nav.templateTypeId;
        localStorage.setItem('addDataCache',JSON.stringify(this.addDataCache));
      },
      // 任务类型编号模版
      'add_nav.title': function () {
        let title = this.add_nav.title;
        if (title != "") {
          if (title.indexOf("[") != -1 && title.indexOf("]") != -1) {
            let title_split = title.substring(title.indexOf("[") + 1, title.indexOf("]"));
            let title_format = timeUtil.changeFormat(new Date(), title_split);
            this.add_nav.title = title.replace('[' + title_split + ']', title_format);
          }
        }

        if (this.isLoad === '1'){
          this.$store.commit('subTaskTitleFormatUpdate',title);
        }

        if (!this.isAddPage){
          return;
        }
        this.addDataCache.title = title;
        localStorage.setItem('addDataCache',JSON.stringify(this.addDataCache));
      },
      'add_nav.content':function () {
        if (this.isLoad === '1'){
          this.$store.commit('subTaskContentFormatUpdate',this.add_nav.content);
        }

        if (!this.isAddPage){
          return;
        }
        this.addDataCache.content = this.add_nav.content;
        localStorage.setItem('addDataCache',JSON.stringify(this.addDataCache));
      },

      // 负责人默认赋值10工时
      'dataBase.selectConfig3.selectList.toPersonList.userSelected': function () {
        this.dataBase.selectConfig3.selectList.toPersonList.userSelected.forEach((item) => {
          if (!item.workHour) {
            item.workHour = 10;
          }
        })
        this.getWorkHours(this.dataBase.selectConfig3.selectList.toPersonList.userSelected);

        if (!this.isAddPage){
          return;
        }
        this.addDataCache.toPersons = this.dataBase.selectConfig3.selectList.toPersonList.userSelected;
        localStorage.setItem('addDataCache',JSON.stringify(this.addDataCache));
      },
      'dataBase.selectConfig2.selectList.ccPersonList.userSelected':function () {
        if (!this.isAddPage){
          return;
        }
        this.addDataCache.ccPersons = this.dataBase.selectConfig2.selectList.ccPersonList.userSelected;
        localStorage.setItem('addDataCache',JSON.stringify(this.addDataCache));
      }
    },
    beforeRouteLeave(to, from, next) {
      if (this.isHomeRefresh) {
        from.params.isRresh = true;
      }
      next();
    },
    components: {
      data_detail,
      taskTitle,
      task_time,
      task_main_responsible,
      task_add_content,
      user_select,
      task_enclosure_pic,
      flow_button,
      taskRate,
      taskPriority,
      taskRemind,
      taskPlace,
      task_subtask,
      previewImages
    },

  }

</script>

<style lang="scss">
  @media screen and (min-width:1024px) {
    .wrap {
      width: 740px;
      margin: 0 auto;
    }
  }
  .ft_wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: rgba(0,0,0,0.6);
    border-radius: 3px;
    .ft_content {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      width: 335px;
      height: 400px;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      .top_img {
        flex: 1;
        border-radius: 3px 3px 0 0;
        background: url(../../../../assets/svg/bg_yhyd.svg) no-repeat center center;
        background-size: cover;
        z-index: 101;
      }
      .bottom_wrappr {
        flex: 1;
        padding: 14px 14px 21px 14px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        .ft_mainTitle {
          color: #444;
          font-size: 22px;
          margin-bottom: 5px;
        }
        ul {
          display: flex;
          flex-direction: column;
          align-items: center;
          .ft_subTitle {
            color: #999;
            font-size: 16px;
            margin-top: 7px;
          }
        }
        .ft_closeBtn {
          width: 100%;
          height: 50px;
          line-height: 50px;
          text-align: center;
          background: #5585F0;
          color: #fff;
          font-size: 17px;
          border-radius: 3px;
          margin-top: 23px;
        }
      }
    }
  }
  .wrap {
    height: 100%;
    background: #fff;
  }

  .qwui-data_detail {
    position: relative;
  }

  .qwui-data_detail .qwui-title_inner_f_item,
  .qwui-data_detail .qwui-tape_box,
  .qwui-data_detail .please_select_box,
  .qwui-data_detail .qwui-title_item_select option:first-child{
    display: none !important;
  }
  .qwui-data_detail .qwui-title_item_select {
    opacity: 1 !important;
  }

  .qwui-data_detail .qwui-title_detaildata {
    margin-top: 0 !important;
    padding-left: 0 !important;
  }

  .qwui-data_detail .qwui-title_box:after {
    border-bottom: none !important;
  }

  .qwui-data_detail .qwui-title_item_select {
    width: auto;
    padding-left: 20px;
    /*margin-left: 14px;*/
    color: #7a7c80;
    font-size: 14px !important;
    background: url("../../../../assets/images/icon_arrow.png") no-repeat scroll 4px !important;
    background-size: 14px 14px !important;
    direction: ltr !important;
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
  }

  .qwui-data_detail .select_bg_grey {
    background: #fff;
  }

  .qwui-data_detail .qwui-title_item_title {
    margin-right: 0;
  }

  .qwui-wrap_bg {
    position: relative;
    height: 100%;
    background: #ffffff;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 60px;
    box-sizing: border-box;
  }

  .qwui-wrap_bg::-webkit-scrollbar {
    display: none;
  }

  .qwui-wrap_bg .qwui-tape_box .item_content_two {
    max-height: 800px !important;
  }

  .qwui-height {
    height: 10px;
  }

  .qwui-onOff_choose {
    height: 18px;
    top: 12px;
  }

  .qwui-onOff_choose .qwui-onOff_off {
    width: 16px;
    height: 16px;
  }

  .qwui-onOff_choose .qwui-onOff_off.active {
    left: 55%;
  }

  .qwui-subtask_left {
    background-position-x: 15px;
  }
  .qwui-perm_mark {
    position: fixed;
    z-index: 3;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #eee;
  }
</style>

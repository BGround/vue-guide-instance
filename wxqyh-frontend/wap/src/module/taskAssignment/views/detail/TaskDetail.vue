<!--Created by liangrisheng 2018.07.10-->
<template>
  <div class="wrap qwui-detail_page">
    <!--任务标题-->
    <data-title class="qwui-detail_data" :dataDetailMsg="add_nav"></data-title>
    <task-title :dataDetailMsg="add_nav"
                :imageList="imageList"
                :showStyle.sync="showStyle"
                @updateImageList="updateImageList"
                ref="task_title"></task-title>
    <!--附件-->
    <task-enclosure-pic v-show="enclosurePicDisplay"
                        :dataDetailMsg="mediaIds"
                        :fileList="newFileList"
                        ref="enclosure_pic"
                        :enclosure-pic-del-class="enclosurePicDelClass"
                        :previewImageUrl="previewImageUrl"></task-enclosure-pic>
    <!--任务进度-->
    <task-rate-detail
                      v-show="rateDisplay"
                      :selectConfig="dataBase.selectConfig3"
                      :listRecRate="listRecRate"
                      :rate="rate"
                      :rateAverage="rateAverage"
                      :taskLevel="taskLevel"
                      :closeSwitch="closeSwitch"
                      :mainTitle="add_nav.title"
											:taskStatus="taskStatus"
                      @listenToChild="changeSwitch"
                      @listenToRate="updateRate"
                      @listenToListRecRate="getListRecRate"
                      @listenToSelectShow="getSelectShow" >12300</task-rate-detail>
    <user_select :selectconfig="selectConfig" v-if="selectConfig.show"></user_select>
		<!-- 责任岗位 -->
		<div class="responsibility">
			<span class="responsibility-title">责任岗位</span>
			<span class="responsibility-content">
				{{postName}}
			</span>
		</div>
		<!--截止时间-->
		<!--<task-time :time-config="stopTimeConfig" class="qwjs-stop_time"></task-time>-->
    <!--任务相关人-->
		<!-- v-show="relevantPersonDisplay && !subTaskPage" -->
    <task-main-responsible :selectconfig="dataBase.selectConfig2"

                           :relevant-person-show="relevantPersonShow"
                           :taskPage="'mainTask'"></task-main-responsible>
    <user_select :selectconfig="dataBase.selectConfig2" v-if="dataBase.selectConfig2.show"></user_select>
    <!-- 编号 -->
    <div class="responsibility" v-if="taskNo">
      <span class="responsibility-title">编号</span>
      <span class="responsibility-content">
				{{taskNo}}
			</span>
    </div>
    <!--开始时间-->
    <!-- <task-time :time-config="starTimeConfig"></task-time> -->

    <!--优先级-->
    <!-- <task-priority v-show="true" :priority="priority"></task-priority> -->
    <!--任务地点-->
    <task-place v-show="placeDisplay" :place-show="placeShow" :taskAddress="taskAddress" @listenToChild="getPlaceData"></task-place>
    <!--任务进度反馈-->
    <task-rate v-show="rateBoxShow && rateDisplay && !taskOver"
               :selectconfig="dataBase.selectConfig3"
               :rate-show="rateShow"
               :rate="rate"
               @listenToChild="getRateData"
               @listenToReload="reloadDetailData"></task-rate>
    <!--任务提醒-->
    <task-remind v-show="remindDisplay && taskLevel == 'a1'"
                 :remind-show="remindShow"
                 :reminderTaskPO="reminderTaskPO"
                 :remindBtn="remindBtn"
                 @listenToChild="getRemindData"></task-remind>
    <!--子任务-->
    <task-subtask v-show="subTaskDisplay" :sub-task-show="subTaskShow" :createrName="personName"></task-subtask>
    <!--路由嵌套-->
    <router-view></router-view>
    <!--添加内容-->
    <task-add-content :addModuleType="addModuleType" @addType="addType"></task-add-content>
    <!--评论-->
    <div class="qwui-separate_bar"></div>
    <task-comment v-if="!subTaskPage"
                  ref="mainComment"
                  :commentList="commentList"
                  :personName="personName"
                  :creatorTime="creatorTime"
                  :closeSwitch="closeSwitch"
                  type="mainTask"
                  :commentCount="commentCount"
                  :onlyCommentCount="onlyCommentCount"
                  :taskCloseType="taskCloseType"
                  @listenToTaskClose="getTaskClose"
                  @listenToTaskRestart="getTaskRestart"
                  @listenToScore="getScorePop"
                  @listenToComment="updateCommentList"
                  @listenToCommentCount="updateCommentCount"
                  @listenToDeleteComment="deleteComment"
                  @listenToShowInput="showInput"></task-comment>
    <!--预览图片组件-->
    <previewImages></previewImages>
    <!--结束任务、重启任务、评分弹框-->
    <pop-window :popWindowConfig="popWindowConfig" @showPopWindow="cancelPopWindow" @refreshListData="confirmPopWindow"></pop-window>
    <task-rate-pop v-show="!subTaskPage"
                   :selectConfig="dataBase.selectConfig3"
                   :listRecRate="listRecRate"
                   :rate="rate"
                   :rateAverage="rateAverage"
                   :taskLevel="taskLevel"
                   :closeSwitch="closeSwitch"
                   :mainTitle="add_nav.title"
                   @listenToChild="changeSwitch"
                   @listenToRate="updateRate"
                   @listenToListRecRate="getListRecRate"
                   @listenToSelectShow="getSelectShow"></task-rate-pop>
    <chat-input :show.sync="showChatTool"
                agent="task"
                :autofocus.sync="autofocus"
                :dataBase="dataBase"
                @updateContent="updateContent"
                @dealccPerson="dealccPerson"
                @closeChat="closeChatMask"></chat-input>

    <Alert :value="isConfirm" :content="confirmContent" button-text="确定"
              dialog-transition="none" @on-hide="turnToList"></Alert>

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
  </div>
</template>

<script>
  import dataTitle from '@/components/add/add_title';
  import taskTitle from '../public/TaskTitle';
  import taskRateDetail from '../public/TaskRateDetail';
  import user_select from '@/components/base/user_or_dept_select';
  import taskMainResponsible from '../public/TaskMainResponsible';
  import taskTime from '../public/TaskTime';
  import taskPriority from '../public/TaskPriority';
  import taskPlace from '../public/TaskPlace';
  import taskRate from '../public/TaskRate';
  import taskRemind from '../public/TaskRemind';
  import taskSubtask from '../public/TaskSubtask';
  import taskEnclosurePic from '../public/TaskAddEnclosurePicture';
  import taskAddContent from '../public/TaskAddContent';
  import taskComment from '../public/TaskComment';
  import previewImages from "@/components/base/previewImages";
  // 结束任务、任务评分、重启任务弹框
  import popWindow from '../components/pop_window';
  import chatInput from '@/components/detail/chatInput';
  import taskRatePop from '../public/TaskRatePop';
  import { getTaskDetail,
    updateTaskIncharges,
    updateInchargesRelative,
    deleteRecipient,
    getAllTaskRate,
    addCommentList,
    deleteCommentList,
    getTitleTemp } from '../../api/getData';
  import { Alert  } from 'vux'

  export default {
    data(){
      return {
        taskNo:'',
        dataBase:dataBase,
        rateDetailConfig:dataBase.rateDetailConfig,
        taskLevel:'',
        add_nav:{//头部信息数据
          nav:'',//头部标题
          title:'',
          titlePlaceholder:'i18n.taskTitlePlaceholder',
          content:'',
          contentPlaceholder:'i18n.taskContentPlaceholder',
          taskTypeDesc:'',
          isDisabled:true,
          moreFunctions:[],
          titleHide:true,//公共组件标题及内容隐藏
          templateHide:true,//公共组件类型隐藏
          taskTypeShow:true,//显示类型
        },// 头部数据
        imageList:[],
        showStyle:0,
        // 空的负责人配置数据
				postName: '',
        selectConfig:{
          show:false,
          signIndex:'toPersonList',
          selectList:{
            "toPersonList": {
              "title":"",
              "selectType": "user",
              "userName": "incharges",
              "userSelected": [],
              "deptSelected":[],
              "deptSelectedShow": false,
              "callBack": {
                "confirm": null,
              },
            },
            type:'toPersonList',
            showContent:'负责人',
            showBtn:false,
          },
        },
        closeSwitch:0,// 负责人可结束/拒绝/重启任务
//        oldRelative:[],// 添加或删除前的相关人
        starTimeConfig:{
          type:'startTime',
          taskStart:'',
          alertType:'mainTask',
          timeTemp:''
        },// 任务开始时间
        stopTimeConfig:{
          type:'endTime',
          taskStop:'',
          alertType:'mainTask',
          timeTemp:''
        },// 任务截止时间
        priority:0,// 任务优先级
        rate:0,// 进度反馈类型
        listRecRate:[],// 进度反馈人员数据
        rateAverage:'',// 平均进度
        taskAddress:{
          value:'',
          longtitude:0,
          latitude:0
        },// 任务地点数据
        reminderTaskPO:{},// 提醒数据
        remindBtn:{
          sendStartRemindMsg:0,
          deadlineRemindMsg:0,
          commentSendMsg:0,
          rateSendMsg:0,
          remindSwitch:0
        },// 提醒模块按钮
        mediaIds:[],// 附件图片id
        newFileList:[],// 渲染的附件图片数据
        relevantPersonShow:false,// 相关人模块
        placeShow: false,// 任务地点模块
        placeDisplay:false,
        rateShow: false,// 进度反馈模块
        rateDisplay:false,
        remindShow: false,// 提醒模块
        remindDisplay:false,
        subTaskShow:false,// 子任务模块
        enclosurePicShow:false,// 附件图片模块
        addModuleType:'mainAddModule',// 添加模块类型，主任务
        commentList:[],// 评论列表
        hasMore:false,// 是否有更多评论
        commentCount:0,// 评论数
        onlyCommentCount:0,// 只看评论数
        showChatTool:false,// 显示评论框
        autofocus:false,
        personName:'',// 创建者名称
        creatorTime:'',// 创建时间
        creator:'',// 创建者id
        popWindowConfig: dataBase.home.popWindowConfig, //弹窗
        previewImageUrl:[],// 预览图片
        allRateShow:false,
        enclosurePicDelClass:'qwjs-main_del',
        isConfirm: false,
        confirmContent: '',
        closeCancel: false,
        taskCloseType:'',
        // 结束成功，跳转页面是否需要刷新
        isHomeRefresh: false,
        isFirstTimeLogin: false, // 用户第一次登陆进入新版本任务分派，需要引导图
        // 子任务是否加载主任务标题内容
        isLoad:'0',
				taskStatus: '',
      };
    },
    computed:{
      relevantPersonDisplay(){
        return this.$store.getters.relevantPersonDisplay;
      },
      subTaskDisplay(){
        return this.$store.getters.subTaskDisplay;
      },
      enclosurePicDisplay(){
        return this.$store.getters.enclosurePicDisplay;
      },
      mainModuleNum(){
        return this.$store.getters.mainModuleNum;
      },
      rateBoxShow(){
        return this.rate == 2 && this.$store.getters.taskLevel == 'a1';
      },
      subTaskPage(){
        return this.$store.getters.subTaskPage;
      },
      taskOver(){
        return this.$store.getters.taskOver;
      }
    },
    watch:{
      'add_nav.title':function () {
        if (this.isLoad === '1'){
          this.$store.commit('subTaskTitleFormatUpdate',this.add_nav.title);
        }
      },
      'add_nav.content':function () {
        if (this.isLoad === '1'){
          this.$store.commit('subTaskContentFormatUpdate',this.add_nav.content);
        }
      },
      // 添加负责人
      'selectConfig.selectList.toPersonList.userSelected':function(){
        let self = this;
        if (this.selectConfig.selectList['toPersonList'].userSelected.length > 0){
          let newIncharges = [];
          newIncharges.push(...this.selectConfig.selectList['toPersonList'].userSelected);
          console.log(newIncharges);
          // 跟所返回的负责人作对比，如有相同的则移除掉
          this.selectConfig.selectList['toPersonList'].userSelected.forEach((item,i)=>{
            // 初始工时与完成状态
            if (this.rate == 2){
              item.workHour = 10;
            }
            item.rate = 0;
            item.isOver = 0;
            this.dataBase.selectConfig3.selectList['toPersonList'].userSelected.forEach((value)=>{
              if (item.userId == value.userId){
                newIncharges.splice(i,1,'');
              }
            })
          });

          // 添加负责人
          let addIncharges = [];
          newIncharges.forEach((item)=>{
            if (item != ''){
              addIncharges.push(item);
            }
          });
          if (addIncharges.length > 0){
            this.dataBase.selectConfig3.selectList['toPersonList'].userSelected.unshift(...addIncharges);
            this.$store.commit('updateMainIncharges',this.dataBase.selectConfig3.selectList['toPersonList'].userSelected);
            let inchargesId = [];
            let taskHours = [];
            let isIncharge = false;
            addIncharges.forEach((item)=>{
              // 添加的负责人id等于当前登录人id，显示更新进度按钮
              if (item.userId == _.userId){
                isIncharge = true;
              }
              inchargesId.push(item.userId);
              if (item.workHour){
                taskHours.push(item.workHour);
              }
            });
            // 添加负责人
            updateInchargesRelative({
              'tbQyTaskPO.isUseRate':this.rate,
              'tbQyTaskPO.taskId':this.$store.getters.taskId,
              'tbQyTaskPO.creator':this.creator,
              'incharges':inchargesId.join(','),
              'taskHours':taskHours.join(',')
            },(result)=>{
              // 更新进度数据
              if (self.dataBase.allRateShow){
                let params = {};
                params['taskId'] = self.$store.getters.taskId;
                self.dataBase.rateCurrentPage = 1;
                params['page'] = 1;
                getAllTaskRate(params,(result)=>{
                  self.rateDetailConfig.lock_roll = false;
                  self.dataBase.rateCurrentPage = result.currPage + 1;
                  self.dataBase.hasMoreRate = result.currPage >= result.maxPage ? false:true;
                  self.rateDetailConfig.loading = false;
                  self.listRecRate = result.pageData;
                })
              }else {
                self.listRecRate = result.listRecRate;
              }
              self.rateAverage = result.rateAverage;
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
              if (isIncharge){
                self.dataBase.isMainIncharge = true;
                self.$store.commit('isInchargeUpdate',true);
              }
            });
          }
          // 清空新选的负责人数据
          this.selectConfig.selectList['toPersonList'].userSelected = [];
          newIncharges = [];
        }
      },
      // 监听相关人数据变化
      'dataBase.selectConfig2.selectList.ccPersonList.userSelected':function () {
        if (this.dataBase.selectConfig2.selectList.ccPersonList.userSelected.toString() != this.dataBase.oldRelative.toString()){
          let self = this;
          // 旧相关人数据为空数组，则为添加了相关人模块
          if (!this.$store.getters.relevantPersonDisplay){
            this.$store.commit('mainAddContentModuleHideUpdate');
            this.$store.commit('relevantPersonDisplayUpdate',true);
          }
          let newRelative = [];// 新增的相关人
          let delRelative = [];// 删除的相关人
          newRelative.push(...this.dataBase.selectConfig2.selectList.ccPersonList.userSelected);
          delRelative.push(...this.dataBase.oldRelative);
          this.dataBase.selectConfig2.selectList.ccPersonList.userSelected.forEach((item,i)=>{
            this.dataBase.oldRelative.forEach((value,j)=>{
              if (item.userId == value.userId){
                newRelative.splice(i,1,'');
                delRelative.splice(j,1,'');
              }
            })
          });

          if (newRelative.length > 0){
            let relative = [];
            newRelative.forEach((item)=>{
              item.userId ? relative.push(item.userId):'';
            });
            // 添加相关人
            if (relative.length > 0){
              updateInchargesRelative({
                'tbQyTaskPO.isUseRate':this.rate,
                'tbQyTaskPO.taskId':this.$store.getters.taskId,
                'tbQyTaskPO.creator':this.creator,
                'relatives':relative.join(',')
              },(result)=>{
                // 添加操作记录
                self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
                // 重新赋值oldRelative
                self.dataBase.oldRelative = this.dataBase.selectConfig2.selectList.ccPersonList.userSelected;
                console.log(result);
              })
            }
          }
          if (delRelative.length > 0){
            let relative = [];
            delRelative.forEach((item)=>{
              item.userId ? relative.push(item.userId):'';
            });
            // 删除相关人
            if (relative.length > 0){
              deleteRecipient({
                'tbQyTaskPO.taskId':this.$store.getters.taskId,
                'relatives':relative.join(',')
              },(result)=>{
                self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
                // 重新赋值oldRelative
                self.dataBase.oldRelative = this.dataBase.selectConfig2.selectList.ccPersonList.userSelected;
                console.log(result);
              });
            }
          }

        }
      },
      'dataBase.selectConfig3.selectList.toPersonList.userSelected':function () {
        this.dataBase.selectConfig3.selectList.toPersonList.userSelected.forEach((item)=>{
          if (item.userId == _.userId){
            this.dataBase.isMainIncharge = true;
            this.$store.commit('isInchargeUpdate',true);
            return;
          }
        })
      }
    },
    created(){
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
      // 数据初始化
      this.$store.commit('taskDataStatusInit');
      this.detailDataBaseInit();

      this.$store.commit('isDetailPageUpdate',true);

      let taskId = this.$route.query.taskId;
      this.$store.commit('taskIdUpdate',taskId);
      getTaskDetail(this.$store.getters.taskId,this.renderDetailData);
    },
    methods:{
      //分享链接，配文字图片
      shareLink () {
        let logoPic = window.document.location.host+_.baseURL+'/qwweb/images/icon_task.png';
        _.checkApi.setDataForWeixinValue(
          this.add_nav.title,
          logoPic,
          this.add_nav.content,
          window.location.href
        );
      },
      detailDataBaseInit(){
        this.dataBase.oldRelative = [];
        this.dataBase.rateDetailConfig = {
          isRateDetail: false,
          currentPersonName: '',
          currentRecipient: '',
          recipientId: '',
          currentUserId: '',
          currentIsOver: false,
          rateDetail: [],
          rateHandleShow: false,
        };
        this.dataBase.allRateShow = false;
        this.dataBase.firstLoading = true;
        this.dataBase.hasMoreRate = true;
        this.dataBase.rateCurrentPage = 0;
        this.dataBase.isMainIncharge = false;
        this.dataBase.latestSubStopTime = '';
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
      renderDetailData(params) {
        var result = params.data
        var self = this
        if (params.code == '0') {
          // 获取任务权限 a1:主任务发起人，a2：主任务负责人，a3：主任务相关人，b1：子任务负责人，b2：子任务执行人
          this.taskLevel = result.taskLevel;
          this.$store.commit('taskLevelUpdate', result.taskLevel);

          let detail = result.detail;
					// 责任岗位
					this.postName = detail.postName;
					this.taskNo = detail.taskNo;
					this.taskStatus = detail.taskStatusDesc;
          // 任务权限
          this.$store.commit('taskPermissionUpdate', result.tbQyTaskScoresettingVO);
          // orgId
          this.$store.commit('orgIdUpdate', detail.orgId);
          // 任务状态
          if (!this.$store.getters.subTaskPage){
            if (detail.taskStatus == 2) {
              this.$store.commit('taskOverUpdate', true);
              this.$store.commit('mainTaskOverUpdate', true);
            }else {
              this.$store.commit('taskOverUpdate', false);
              this.$store.commit('mainTaskOverUpdate', false);
            }
          }

          // 任务类型、标题、内容
          this.add_nav.taskTypeDesc = detail.taskTypeDesc;
          this.add_nav.title = detail.title;
          this.add_nav.content = detail.content;

          this.isLoad = detail.isLoad;

          if (detail.isLoad === '0'){
            this.templateTransform('subNumber',detail.orgId,detail.subtaskNumberFormat);
            this.templateTransform('subTitle',detail.orgId,detail.subtaskTitleFormat);
            this.$store.commit('subTaskContentFormatUpdate', detail.subtaskContentFormat);
          }

        // 任务负责人进度及相关人
        if (detail.toPersons) {// 负责人
          this.closeSwitch = Number(detail.closeSwitch);
          this.dataBase.selectConfig3.selectList['toPersonList'].userSelected = detail.toPersons;
          this.$store.commit('updateMainIncharges', detail.toPersons);
          this.listRecRate = result.listRecRate;
          this.rateAverage = result.rateAverage;
        }
        if (detail.ccPersons) {// 相关人
          this.dataBase.selectConfig2.selectList['ccPersonList'].userSelected = detail.ccPersons;
          this.dataBase.oldRelative = detail.ccPersons;
          this.$store.commit('mainAddContentModuleHideUpdate');
          this.$store.commit('relevantPersonDisplayUpdate', true);
        }

          // 任务时间
          this.$store.commit('startTimeHandler', detail.taskStart.substring(0, 16));
          this.$store.commit('stopTimeHanlder', detail.taskStop.substring(0, 16));
          this.starTimeConfig.timeTemp = detail.taskStart.substring(0, 16);
          this.stopTimeConfig.timeTemp = detail.taskStop.substring(0, 16);

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
            this.$store.commit('mainAddContentModuleHideUpdate');
            this.$store.commit('placeDisplayUpdate');
            this.placeDisplay = true;
            this.$set(this.taskAddress, 'value', detail.accessAddress);
            this.$set(this.taskAddress, 'longitude', detail.longitude);
            this.$set(this.taskAddress, 'latitude', detail.latitude);
          }

          // 任务提醒数据
          this.$store.commit('remindDisplayUpdate');
          this.remindDisplay = true;
          this.$store.commit('mainAddContentModuleHideUpdate');
          this.reminderTaskPO = detail.reminderTaskPO;
          this.remindBtn.sendStartRemindMsg = detail.sendStartRemindMsg;
          this.remindBtn.deadlineRemindMsg = detail.sendMsg;
          this.remindBtn.commentSendMsg = detail.commentSendMsg;
          this.remindBtn.rateSendMsg = detail.rateSendMsg;
          this.remindBtn.remindSwitch = detail.remindSwitch;
          this.$store.commit('remindRenderUpdate', true);

          // 子任务数据
          if (result.subtask) {
            this.$store.commit('mainAddContentModuleHideUpdate');
            this.$store.commit('subTaskDisplayUpdate');
            this.$store.commit('subTaskDetailDataUpdate',result.subtask);
            this.$store.commit('subTaskNumUpdate', result.subtask.length);
          }

          // 图片数据
          if (detail.picList && detail.picList.length > 0){
            this.$store.commit('imageDisplayUpdate',true);
            detail.picList.forEach((item)=>{
              item.src = item.picPath;
            })
            this.imageList = detail.picList;
          }
          this.showStyle = detail.showStyle;

          // 附件数据,有附件且未添加附件模块
          if (result.mediaList.length > 0 && !this.enclosurePicDisplay) {
            this.$store.commit('mainAddContentModuleHideUpdate');
            this.$store.commit('mainEnclosurePicAddContentDisplayUpdateHide');
            this.$store.commit('enclosurePicDisplayUpdate');

            for (let i = 0; i < result.mediaList.length; i++) {
              let media = result.mediaList[i];
              let file = {
                fileName: media.fileName,
                id: media.id,
                fileExt: media.fileExt,
              };
              let imgType = ['PNG', 'JPG', 'BMP', 'JPEG'];
              if (imgType.indexOf(media.fileExt) != -1) {
                file.src = _.compressURL + media.url;
                file.fileSize = media.fileSizeStr;
                this.previewImageUrl.push({src: file.src});
              }else {
                file.url = media.url;
                file.fileSizeStr = media.fileSizeStr;
              }

              this.newFileList.push(file);
              this.mediaIds.push(media.id);
            }
          }

          // 评论数据
          if (result && result.comments && result.comments.length > 0) {
            this.commentList = result.comments;
          }
          this.dataBase.hasMore = result.hasMore;
          this.commentCount = detail.commentCount;
          this.onlyCommentCount = detail.onlyCommentCount;

          // 评分数据
          // 主任务评分
          if (result.scoreInfo) {
            this.$store.commit('mainScoreUpdate', true);
            this.$store.commit('scoreInfoUpdate', result.scoreInfo);
          }
          // 子任务评分
          if (result.subtaskScoreList) {
            this.$store.commit('subtaskScoreListUpdate', result.subtaskScoreList);
          }

          // 创建者、创建时间
          this.personName = detail.personName;
          this.$store.commit('personNameUpdate',detail.personName)
          this.creatorTime = detail.creatorTime;
          this.creator = detail.creator;
          this.taskCloseType = detail.taskCloseType;
        } else {
          this.confirmContent = params.desc
          this.isConfirm = true;
        }

        // 分享链接
        window.wxqyh_corpId = this.$route.query.corpId || '';
        this.shareLink();
        console.log('rateDisplay',this.rateDisplay)
      },
      templateTransform(type,orgId,titleFormat,text){
        if (!titleFormat){
          switch (type) {
            case 'subNumber':
              this.$store.commit('subTaskNumberUpdate',text || '');
              break
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
            case 'subNumber':
              this.$store.commit('subTaskNumberUpdate',data.data);
              break;
            case 'subTitle':
              this.$store.commit('subTaskTitleFormatUpdate',data.data);
              break
          }
        })
      },
      addType(type){
        if(type==1){
          this.relevantPersonShow = !this.relevantPersonShow;
        }else if(type==2){
          this.placeDisplay = true;
          this.placeShow = !this.placeShow;
        }else if(type==3){
          this.rateDisplay = true;
          this.rateShow = !this.rateShow;
        }else if(type==4){
          this.remindDisplay = true;
          this.remindShow = !this.remindShow;
        }else if(type==5){
          this.$router.push({
            name:'subtaskDetail',
            query:{
              taskId:this.$store.getters.taskId
            }
          });
          this.subTaskShow = !this.subTaskShow;
        }else if(type==6){
          if(_.isHefeixin()||_.isWeChatApp()||_.isQiyeweixinApp()) {
            this.$store.commit('enclosurePicDisplayUpdate');
          }
          this.$refs.enclosure_pic.enclosure_pic_click();
        }else if (type == 8){
          this.$refs.task_title.$refs.img_upload.$refs.add_img.$refs.input.click();
        }
      },
      updateImageList(imageList){
        this.imageList = imageList;
      },
      getRateData(key){
        if (key == ''){
          this.rateDisplay = false;
          return;
        }
      },
      getRemindData(remindData){
        if (remindData == ''){
          this.remindDisplay = false;
          return;
        }
      },
      getPlaceData(placeData) {
        if (placeData == 'hide'){
          this.placeDisplay = false;
          return;
        }
      },
      changeSwitch(val){
        this.closeSwitch = val;
      },
      updateRate(listRecRate,rateAverage){
        // 如果是查看全部负责人的页面,渲染10个，否则，渲染五个

        this.listRecRate = listRecRate;

        this.rateAverage = rateAverage;
      },
      getListRecRate(currPage,list){
        if (currPage == 1){
          this.listRecRate.splice(0,this.listRecRate.length);
        }
        this.listRecRate.push(...list);
      },
      //
      getSelectShow(val){
        this.selectConfig.show = val;
      },
      updateCommentList(data,commentCount,onlyCommentCount){
        this.commentList = data;
        this.commentCount = commentCount;
        this.onlyCommentCount = onlyCommentCount;
      },
      updateCommentCount(val){
        if (val){
          this.onlyCommentCount++;
          this.commentCount++;
        }else {
          this.onlyCommentCount--;
          this.commentCount--;
        }
      },
      deleteComment(index){
        this.commentList.splice(index,1);
      },
      // 发送评论
      updateContent(data){

        if(data){
          let msg={
            "tbQyTaskCommentPO.content":data.content,
            "tbQyTaskCommentPO.taskId":this.$store.getters.taskId,
            "id":this.$store.getters.taskId,
            "type":data.type,
            "userId":_.userId
          };
          data.userIds? msg.userIds=data.userIds:"";

          let self=this;
          addCommentList(msg,function (result) {
            if(result.id){
              self.commentList.splice(0,0,{
                commentId:result.id,
                headPic:_.headPic,
                personName:_.personName,
                creator:_.userId,
                type:data.type,
                content:data.content,
                time:"刚刚",
                commentStatus:data.status,
              });
              self.updateCommentCount(true);
            }
            self.$refs.mainComment.$refs.comment.scrollIntoView(true);
          });
        }
      },
     //@人后把人添加为相关人,去除重复的相关人、负责人、相关人
      dealccPerson(obj){
        let addRelative = obj.data;
        let newRelative = [];
        obj.data.forEach((item,i)=>{
          this.dataBase.selectConfig2.selectList.ccPersonList.userSelected.forEach((items)=>{
            if (item.userId == items.userId){
              addRelative.splice(i,1,'');
            }
          });
          this.dataBase.selectConfig3.selectList.toPersonList.userSelected.forEach((items)=>{
            if (item.userId == items.userId){
              addRelative.splice(i,1,'');
            }
          })
          if (item.userId == _.userId){
            addRelative.splice(i,1,'');
          }
        });
        // 获取去除相同相关人后的相关人数组
        addRelative.forEach((item)=>{
          if (item != ''){
            newRelative.push(item);
          }
        });
        if (newRelative.length > 0){
          this.dataBase.selectConfig2.selectList.ccPersonList.userSelected.push(...newRelative);
          if (!this.$store.getters.relevantPersonDisplay){
            this.dataBase.oldRelative.push(...newRelative)
          }
          if (!this.$store.getters.relevantPersonDisplay){
            this.$store.commit('mainAddContentModuleHideUpdate');
            this.$store.commit('relevantPersonDisplayUpdate',true);
          }
        }
      },
      showInput(){
        this.showChatTool = true;
        this.autofocus = true;
      },
      // 关闭输入框
      closeChatMask(val){

      },
      // 点击了结束任务
      getTaskClose(){
        this.initPopWindowConfig();
        this.popWindowConfig.taskId = this.$store.getters.taskId;
        this.popWindowConfig.endType.showType = true;
        this.popWindowConfig.curOperate = 'endTask';
        this.popWindowConfig.taskTitle = this.add_nav.title;
        this.popWindowConfig.subtaskList.push(...this.$store.getters.subtaskScoreList);
        this.popWindowConfig.subtaskList.forEach((item)=>{
          item.score = 10;
        });
        this.popWindowConfig.isScore = this.$store.getters.taskPermission.isScore;
        this.popWindowConfig.score.showScore = this.$store.getters.taskPermission.isScore && this.$store.getters.taskLevel == 'a1';

        this.popWindowConfig.showWindow = true;
      },
      // 点击了重启任务
      getTaskRestart(){
        this.initPopWindowConfig();
        this.popWindowConfig.taskId = this.$store.getters.taskId;
        this.popWindowConfig.updateTask.showUpadate = true;
        this.popWindowConfig.curOperate = 'updateTask';
        this.popWindowConfig.showWindow = true;
      },
      // 点击了任务评分
      getScorePop(){
        this.initPopWindowConfig();
        this.popWindowConfig.taskId = this.$store.getters.taskId;
        this.popWindowConfig.taskTitle = this.add_nav.title;
        this.popWindowConfig.subtaskList.push(...this.$store.getters.subtaskScoreList);
        this.popWindowConfig.subtaskList.forEach((item)=>{
          item.score = 10;
        });
        this.popWindowConfig.endType.showType = false;
        this.popWindowConfig.curOperate = 'updateScore';
        this.popWindowConfig.isScore = this.$store.getters.taskPermission.isScore;
        this.popWindowConfig.score.showScore = true;
        this.popWindowConfig.showWindow = true;
      },
      cancelPopWindow(){
        this.popWindowConfig.showWindow = false;
      },
      confirmPopWindow(){
        this.isHomeRefresh = true;
        if (this.popWindowConfig.curOperate == 'endTask'){
          this.$router.push({
            name:'home',
          });
        }else {
          getTaskDetail(this.$store.getters.taskId,this.renderDetailData);
        }
      },
      reloadDetailData(){
        this.detailDataBaseInit();
        getTaskDetail(this.$store.getters.taskId,this.renderDetailData);
      },
      // 初始化popwindow的数据
      initPopWindowConfig() {
        this.popWindowConfig = {
          showWindow: false, // window显示与否
          curOperate: '', // 当前操作类型
          taskId: '', // 当前任务的id
          subtaskId: '', // 当前子任务的id
          subtaskList: [], // 子任务的list
          subtask: { // 子任务(当前为子任务(用于评分))
            score: 10,
            subTaskId: '',
            title: '',
            showSubTask: false,
          },
          reasonText: '',
          taskTitle: '', // 任务标题
          roleArr: [], // 角色
          isScore: 0, // 是否可以评分，0可以，1不可以
          endType: {
            showType: false,
            btnArray: ['完成', '终止', '取消', '拒绝'], // 结束类型按钮组
            btnActiveNum: 1,
          },
          score: {
            showScore: false,
            scoreNum: 10, // 评分分数
          },
          changeTime: {
            showTime: false,
            endTime: '',
            mainTaskTime: '',
            subTaskTime: [],
          },
          updateTask: {
            showUpadate: false,
            resetAll: false,
          },
        }
      },
      // 弹窗出来，isPin=1背景不滚动,isPin=0背景正常滚动
      toggleBody(isPin){
        if(isPin){
          document.body.style.height = '100vh'
          document.body.style['overflow-y'] = 'hidden'
        }
        else{
          document.body.style.height = 'unset'
          document.body.style['overflow-y'] = 'auto'
        }
      },
      turnToList() {
        this.$router.push({
          name: 'home'
        })
        this.isConfirm = false
      },
      showFT() {
        this.isFirstTimeLogin = true;
      },
      closeFT() {
        this.isFirstTimeLogin = false;
      },
    },
    beforeRouteLeave(to, from, next) {
      if (this.isHomeRefresh) {
        from.params.isRresh = true;
      }
      next();
    },
    components:{
      dataTitle,
      taskTitle,
      taskRateDetail,
      user_select,
      taskMainResponsible,
      taskTime,
      taskPriority,
      taskPlace,
      taskRate,
      taskRemind,
      taskSubtask,
      taskEnclosurePic,
      taskAddContent,
      taskComment,
      popWindow,
      taskRatePop,
      previewImages,
      chatInput,
      Alert
    }
  }
</script>

<style src="../../scss/taskDetail.scss" lang="scss"></style>
<style lang="scss" scoped>
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
.responsibility{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-left: 48px;
	padding-right: 14px;
	.responsibility-title{
		font-size: 15px;
		color: #0A1735;
		line-height: 46px;
	}
	.responsibility-content{
		color: #999;
		font-size: 15px;
		line-height: 46px;
	}
}
</style>

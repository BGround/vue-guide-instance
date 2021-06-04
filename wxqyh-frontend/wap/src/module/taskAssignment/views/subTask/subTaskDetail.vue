<template>
	<div class="wrap" :class="{ 'qwui-subtask_wrap':isAddSubtaskPage || !isDetailPage }">
		<div class="qwui-subtask_wrap-relative">

			<!--子任务编号-->
			<task-numbering @listenToChild="getSubTaskShow"></task-numbering>
			<!--标题和类型-->
			<data_detail class="qwui-subtask_detail" :dataDetailMsg="add_nav"></data_detail>
			<!--标题与内容-->
			<task-title :dataDetailMsg="add_nav" :imageList="imageList" :showStyle.sync="showStyle" @updateImageList="updateImageList"
			 ref="task_title"></task-title>
      <!--附件-->
      <task-sign :dataDetailMsg="newMediaIds"
                 :fileList="fileList"
                 :imgList="imgList"
                 ref="sub_enclosure_pic"
                 :enclosure-pic-del-class="enclosurePicDelClass"
                 :previewImageUrl="previewImageUrl"
                 :showDealer="showDealer"
                 :status="status"
                 @listenToImg="getImgUrl"
                 @listenToFile="getFileId"
                 @listenToFileList="getFileList"
      ></task-sign>
			<!--任务执行人进度-->
			<task-rate-detail v-if="isDetailPage && !isAddSubtaskPage"
			 :selectConfig="selectConfig2" :listRecRate="listRecRate" :rateAverage="rateAverage" :rate="rate" :closeSwitch="executorCloseTask"
			 :currentSubTask="currentSubTask" :taskStatus="taskStatus" @listenToSelectShow="getSelectShow" @listenToChild="changeSwitch"
			 @listenToListRecRate="getListRecRate" @listenTosubRate="updateRate" @listenToSubIncharge="changeSubIncharge"></task-rate-detail>
      <!-- 编号 -->
      <TaskInfo :taskItem="taskItem"></TaskInfo>

			<!--详情页执行人组件-->
			<user_select :selectconfig="selectConfig3" v-if="isDetailPage && !isAddSubtaskPage && selectConfig3.show"></user_select>
			<!--任务分派子任务负责人组件-->
			<!-- <task_main_responsible :selectconfig="selectConfig"></task_main_responsible> -->
			<!--任务分派执行人组件-->
			<task_main_responsible v-if="isAddSubtaskPage || !isDetailPage" :selectconfig="selectConfig2" :closeSwitch="executorCloseTask"
			 @listenToChild="getExecutorCloseTask"></task_main_responsible>
			<!--任务分派时间组件(开始)-->
			<!-- <task_time :time-config="timeConfig" ></task_time> -->
			<!--任务分派时间组件(结束)-->
			<task_time :time-config="timeConfig2"></task_time>
			<!--任务分派附件/图片组件-->
			<task_enclosure_pic :dataDetailMsg="mediaIds"
				:fileList="newFileList"
				ref="sub_enclosure_pic"
				:enclosure-pic-del-class="enclosurePicDelClass"
				:previewImageUrl="previewImageUrl"
				:showDealer="showDealer"
				:status="status"
				@listenToImg="getImgUrl"
				@listenToFile="getFileId"
				@listenToFileList="getFileList"
				></task_enclosure_pic>

			<!-- 任务整改情况描述 -->
			<taskRectification v-model="rectificationText" :status="status" :showDealer="showDealer"></taskRectification>
      <!-- 审批意见 -->
      <div v-if="appList.length > 0">
        <TaskReason :appList="appList"></TaskReason>
      </div>
			<!-- 实际完成时间 -->
			<taskFinishTime :finishTime="finishTime" v-if="finishTime"></taskFinishTime>
			<!--任务分派优先级组件-->
			<!-- <task-priority v-show="priorityShow" :priority="priority" :sub-priority-show="priorityPageShow" @listenToChild="getTaskPriority"></task-priority> -->
			<!--任务分派进度反馈组件-->
			<task-rate v-show="rate == 2 && hasPermission" :selectconfig="selectConfig2" :rate="rate" @listenToReload="reloadSubtaskData"></task-rate>
			<!--任务分派添加内容组件-->
			<task_add_content @addType="addType" :add-module-type="addModuleType"></task_add_content>
			<!--选择人员(负责人)-->
			<user_select :selectconfig="selectConfig" v-if="selectConfig.show"></user_select>
			<!--选择人员(相关人)-->
			<user_select :selectconfig="selectConfig2" v-if="selectConfig2.show"></user_select>
			<div class="qwui-height"></div>
			<!--Button组件-->
			<!--非新增或者非详情页，显示-->
			<flow_button :class="{ 'subTaskBtn': subTaskDetailShow }" :buttondata="buttonConfig" v-if="currentSubTask === '' || !isDetailPage"></flow_button>
			<!--子任务评论组件-->
			<div class="qwui-separate_bar" v-if="isDetailPage && currentSubTask !== ''"></div>
			<!-- v-show="isDetailPage && currentSubTask !== ''" v-if="!subTaskPage"-->
			<!-- <task-comment  ref="mainComment"
				:commentList="commentList"
				:personName="personName"
				:creatorTime="creatorTime"
			 :closeSwitch="closeSwitch"
			 :showPutBtn="true"
			 type="subTask"
			 :commentCount="commentCount"
			 :onlyCommentCount="onlyCommentCount"
			 :taskCloseType="taskCloseType"
			 @listenToTaskClose="getTaskClose"
			 @listenToTaskRestart="getTaskRestart"
			 @listenToScore="getScorePop"
			 @listenToComment="updateCommentList"
				@listenToCommentCount="updateCommentCount"
			 @listenToDeleteComment="deleteComment" @listenToShowInput="showInput" @postTask="postTask"></task-comment> -->
			<!-- 原子任务评论 -->
			<!-- v-show="isDetailPage && currentSubTask !== ''" -->
			<task-comment :subOperationRecord="commentList"
				v-if="status=='0'&&showDealer"
				:subHasMore="hasMore"
				:creatorTime="creatorTime"
				:showPutBtn="true"
				:closeSwitch="executorCloseTask"
				type="subTask"
				@listenToTaskClose="getTaskClose"
				@listenToTaskRestart="getTaskRestart"
				@listenToOperation="updateSubOperation"
				@listenTosubHasMore="updateHasMore"
				@listenToDeleteComment="deleteComment"
				@listenToShowInput="showInput"
				@postTask="postTask"
				></task-comment>
			<!-- 评论弹窗 -->
			<chat-input
				:show.sync="showChatTool"
				agent="task"
				:autofocus.sync="autofocus"
				:dataBase="dataBase"
				@updateContent="updateContent"
				@dealccPerson="dealccPerson"
				@closeChat="closeChatMask"></chat-input>
				<!-- 任务审核 -->
				<taskApprovalModal
					v-if="status=='1'&&!showDealer"
					:options="approvalOption"
					:radioOption="radioOption"
					:taskStopTime="taskStopTime"
					@approvalComfirm="approvalComfirm"
				></taskApprovalModal>
			<!--结束任务、重启任务、评分弹框-->
			<pop-window :popWindowConfig="popWindowConfig" @showPopWindow="cancelPopWindow" @refreshListData="confirmPopWindow"></pop-window>
			<task-rate-pop v-show="isDetailPage && !isAddSubtaskPage" :selectConfig="selectConfig2" :rate="rate" :currentSubTask="currentSubTask"
			 :listRecRate="listRecRate" @listenTosubRate="updateRate" @listenToSubIncharge="changeSubIncharge" @listenToWorkHour="updateWorkHour"></task-rate-pop>
		</div>
		<!--预览图片组件-->
		<previewImages v-if="isDetailPage"></previewImages>
	</div>
</template>

<script>
	import taskNumbering from '../public/TaskNumbering'
	import data_detail from '@/components/add/add_title';
	import taskTitle from '../public/TaskTitle';
	import task_time from '../public/TaskTime';
	import taskRateDetail from '../public/TaskRateDetail';
	import task_main_responsible from '../public/TaskMainResponsible';
	import user_select from '@/components/base/user_or_dept_select';
	import flow_button from '@/components/button/flow_button';
	import task_add_content from '../public/TaskAddContent';
	import taskPriority from '../public/TaskPriority';
	import taskRate from '../public/TaskRate';
	import task_enclosure_pic from '../public/TaskAddEnclosurePicture';
  import TaskSign from '../public/TaskSign';

	import taskComment from '../public/TaskComment';
	import popWindow from '../components/pop_window';
	import taskRatePop from '../public/TaskRatePop';
	import taskRectification from '../public/TaskRectification';
	import TaskReason from '../public/TaskReason'
	import * as timeUtil from '../../../../assets/js/time-util';
	import eventBus from '@/utils/eventBus';
	import previewImages from "@/components/base/previewImages";
	import taskFinishTime from "../public/TaskFinishTime"
	import chatInput from '@/components/detail/chatInput';
	import taskApprovalModal from '../public/TaskApprovalModal'
	import TaskInfo from '../public/TaskInfo'
	import {
		getSubTaskDetail,
		addCommentList,
		editSubTask,
		addSubTask,
		addSubTaskIncharges,
		updateSubtaskIncharge,
		getAllTaskRate,
		dealerFeedback,
		subTaskApproval
	} from '../../api/getData';

	export default {
		data() {
			return {
        taskItem:{},
				dataBase: dataBase,
				rateDetailConfig: dataBase.rateDetailConfig,
				popWindowConfig: dataBase.home.popWindowConfig,
				add_nav: { //头部信息数据
					nav: '新建子任务', //头部标题
					title: '',
					titlePlaceholder: this.$t('i18n.subtaskTitleHolder'),
					content: '',
					contentPlaceholder: 'i18n.taskContentPlaceholder',
					templateTypeId: '',
					templateType: [],
					isDisabled: false,
					moreFunctions: [],
					taskType: 'subTask'
				},
				imageList: [],
				showStyle: 0,
				timeConfig: {
					type: 'startTime',
					taskStart: '',
					alertType: 'subTask',
					timeTemp: ''
				},
				timeConfig2: {
					type: 'endTime',
					taskStop: '',
					alertType: 'subTask',
					timeTemp: ''
				},
        appList:[],
				personName: '', // 创建者名称
				closeSwitch: 0, // 负责人可结束/拒绝/重启任务
				commentCount: 0, // 评论数
				onlyCommentCount: 0, // 只看评论数
				taskCloseType: '',
				// 子负责人
				selectConfig: { //负责人
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
							"userRestriction": 1,
							"callBack": {
								"confirm": null,
							},
						},
						type: 'toPersonList',
						showContent: '负责人',
					},
					level: 'subIncharge'
				},
				// 子执行人
				selectConfig2: { //子执行人
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
						showContent: '执行人',
						showBtn: false
					}
				},
				// 子执行人（详情页，空的数据配置，每次添加后清空数据）
				selectConfig3: {
					show: false,
					signIndex: 'ccPersonList',
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
						showContent: '执行人',
						showBtn: false
					}
				},
				// 底部操作按钮
				buttonConfig: {
					primaryList: [{
						type: "primary",
						name: this.$t('i18n.save'),
						callBack: null
					}, ],
					defaultList: [{
						type: "default",
						name: this.$t('i18n.cancel'),
						callBack: null
					}],
					class: "active" //按钮是否置底部 active :底部、"":相对定位
				},
				addResponsibleClass: '',
				addModuleType: 'subAddModule',
				priorityShow: false,
				priorityPageShow: false,
				priority: 0, // 任务优先级
				executorCloseTask: 0, // 子任务负责人可拒绝/重启/结束任务
				allExecutorNum: 0, // 子任务执行人总数
				imageUrls: '',
				mediaIds: [], // 子任务附件图片id
        newMediaIds: [], // 子任务描述图片id
				newFileList: [], // 子任务附件图片展示列表
				fileList: [], // 子任务附件图片展示列表
				imgList: [], // 子任务描述图片展示列表
				previewImageUrl: [],
				currentSubTask: '', // 当前的子任务
				enclosurePicDelClass: 'qwjs-sub_del',
				subTaskBoxHeight: null,
				creatorTime: '', // 创建时间
				commentList: [], // 操作记录
				oldIncharge: {}, // 旧的负责人
				oldInchargeId: '', // 旧的负责人id
				oldRecipientId: '', // 旧的负责人recipientId
				listRecRate: [], // 进度反馈人员数据
				hasMore: false,
				subListDataCache: {
					subtask: []
				},
				// 子任务缓存
				subTaskCache: {
					title: '',
					content: '',
					executorCloseTask: '',
					toPersons: [],
					ccPersons: [],
					subStartTime: '',
					subStopTime: '',
					priority: 0,
					fileList: [],
					picList: [],
				},
				taskStatus: '',
				rectificationText: '', // 整改情况描述
        approvalReason: '789789', // 审批意见
				showChatTool: false,
				autofocus: false,
				approvalOption: { // 审批参数
					btnText: '审批', //显示在页面的按钮名称
					title: '子任务审批',
					subTitle: '审批结果',
					timeLabel: '下次整改截止时间',
					approvalPlacehold: '请输入评价(选填)',
					radio: ''
				},
				radioOption: [{
					label: '通过',
					value: '1',
				},{
					label: '未通过',
					value: '2',
				},{
					label: '强制关闭',
					value: '3',
				}],
				status: '0',
				showDealer: false,
				finishTime: '',
				taskStopTime: '',
			};
		},
		created() {
			// 刷新页面，跳回详情页
			if (this.$route.path == '/subtaskDetail' && this.$route.query.taskId && this.$store.getters.taskId == '') {
				this.$router.push({
					path: '/detail',
					name: 'detail',
					query: {
						taskId: this.$route.query.taskId
					}
				})
				return;
			}
			this.$store.commit('isDetailPageUpdate', true);
			this.$store.commit('subStartTimeHandler', this.$store.getters.startTime);
			this.$store.commit('subStopTimeHanlder', this.$store.getters.stopTime);
			window.sessionStorage.setItem('fromAddContent', 'fromAddContent');
			window.sessionStorage.setItem('addModuleType', 'subAddModule');

			window.sessionStorage.removeItem('clickEnclosurePicType');

			// 子任务dataBase的一些数据初始化
			this.subDetailDataBaseInit();

			if (this.$route.params && this.$route.params.key != undefined) {
				let id = this.$route.query.subtaskId || this.subTaskData.subtask[key].subtaskId;
				this.$store.commit('subtaskIdUpdate', id);
				this.modifySubTask(this.$route.params.key);
			} else {
				if (localStorage.getItem('subTaskCache')) {
					this.subTaskCache = JSON.parse(localStorage.getItem('subTaskCache'));
					this.showSubtaskDetail(true);
				} else {
					this.showSubtaskDetail();
				}

			}
			if (this.subTaskShow != undefined) {
				this.addResponsibleClass = 'qwjs-subtask';
			}
			this.buttonConfig.defaultList[0].callBack = this.hideSubtaskDetail;
			this.buttonConfig.primaryList[0].callBack = this.saveSubtaskDetail;
			if (document.documentElement.clientHeight > 0) {
				this.subTaskBoxHeight = document.documentElement.clientHeight;
			} else {
				this.subTaskBoxHeight = "auto";
			}

			this.$store.commit('changeSubTaskTimeUpdate', true);
		},
		methods: {
			//@人后把人添加为相关人,去除重复的相关人、负责人、相关人
			dealccPerson(obj) {
				let addRelative = obj.data;
				let newRelative = [];
				obj.data.forEach((item, i) => {
					this.dataBase.selectConfig2.selectList.ccPersonList.userSelected.forEach((items) => {
						if (item.userId == items.userId) {
							addRelative.splice(i, 1, '');
						}
					});
					this.dataBase.selectConfig3.selectList.toPersonList.userSelected.forEach((items) => {
						if (item.userId == items.userId) {
							addRelative.splice(i, 1, '');
						}
					})
					if (item.userId == _.userId) {
						addRelative.splice(i, 1, '');
					}
				});
				// 获取去除相同相关人后的相关人数组
				addRelative.forEach((item) => {
					if (item != '') {
						newRelative.push(item);
					}
				});
				if (newRelative.length > 0) {
					this.dataBase.selectConfig2.selectList.ccPersonList.userSelected.push(...newRelative);
					if (!this.$store.getters.relevantPersonDisplay) {
						this.dataBase.oldRelative.push(...newRelative)
					}
					if (!this.$store.getters.relevantPersonDisplay) {
						this.$store.commit('mainAddContentModuleHideUpdate');
						this.$store.commit('relevantPersonDisplayUpdate', true);
					}
				}
			},
			approvalComfirm(val){
				let that = this;
				let params = {
					taskId: this.$store.getters.taskId,
					subTaskId: this.$store.getters.subtaskId,
					reason: val.approvalText,
					subStopTime: val.timeNum,
					subTaskStatus: val.radio,
				}
				subTaskApproval(params,(res)=>{
          _.alert('提示','提交成功')
          setTimeout(()=>{
            that.$router.go(-1)
          },1000)

				})
			},
			// 关闭输入框
			closeChatMask(val){

			},
			// 发送评论
			updateContent(data) {
				if (data) {
					let msg = {
						"tbQyTaskCommentPO.content": data.content,
						"tbQyTaskCommentPO.taskId": this.$store.getters.taskId,
						"tbQyTaskCommentPO.subTaskId": this.$store.getters.subtaskId,
						"id": this.$store.getters.taskId,
						"type": data.type,
						"userId": _.userId
					};
					data.userIds ? msg.userIds = data.userIds : "";

					let self = this;
					addCommentList(msg, function(result) {
						if (result.id) {
							self.commentList.splice(0, 0, {
								commentId: result.id,
								headPic: _.headPic,
								personName: _.personName,
								creator: _.userId,
								type: data.type,
								content: data.content,
								time: "刚刚",
								commentStatus: data.status,
							});
							self.updateCommentCount(true);
						}
						self.$refs.mainComment.$refs.comment.scrollIntoView(true);
					});
				}
			},
			deleteComment(index) {
				this.commentList.splice(index, 1);
			},
			showInput() {
				this.showChatTool = true;
				this.autofocus = true;
			},
			// 提交任务信息
			postTask(){
				let that = this;
				if(this.newFileList.length==0){
					_.alert('提示','请上传附件后再提交')
					return
				}

				if(this.rectificationText==''){
					_.alert('提示','请输入整改情况描述后再提交')
					return
				}
				let btn = {
					primaryBtn: {
					  name: '确定',
					  callBack: function(){
							dealerFeedback({
								taskId: that.$store.getters.taskId,
								subTaskId: that.$store.getters.subtaskId,
								remark: that.rectificationText
							},(res)=>{
								that.$router.go(-1)
							})
					  }
					},
					defaultBtn:{
					  name:"取消",
					  callBack:function(){

						}
					},
				}
        _.alert('提示','提交后信息不能修改，确认提交？',btn);
			},
			subDetailDataBaseInit() {
				this.dataBase.allRateShow = false;
				this.dataBase.subHasMoreRate = true;
				this.dataBase.subRateCurrentPage = 0;
			},
			// 新增子任务
			showSubtaskDetail(status) {
				// 添加子任务初始化
				this.moduleInit();
				// 子任务新增页面
				this.$store.commit('addSubTaskPageUpdate', true);
				this.$store.commit('subTaskPageUpdate', true);
				if (this.$store.getters.isDetailPage) {
					let subStartTime = this.$store.getters.subStartTime;
					// 如果当前时间晚于主任务截止时间，新增子任务开始时间等于主任务开始时间
					if (new Date() > new Date(this.$store.getters.stopTime.replace(/-/g, '/'))) {
						subStartTime = this.$store.getters.startTime;
					}
					this.timeConfig.timeTemp = subStartTime;
					this.$store.commit('subLoadFinishUpdate', true);
					this.timeConfig2.timeTemp = this.$store.getters.stopTime;
					// 修改vuex里的子任务开始时间与截止时间
					this.$store.commit('subStopTimeHanlder', this.$store.getters.stopTime);
					this.$store.commit('subStartTimeHandler', subStartTime);
				}

				window.sessionStorage.setItem('clickEnclosurePicType', 'subClick');
				this.currentSubTask = '';
				// 子任务内容标题
				this.add_nav.title = this.subTaskCache.title || this.$store.getters.subTaskTitleFormat;
				this.add_nav.content = this.subTaskCache.content || this.$store.getters.subTaskContentFormat;

				// 子任务开始结束时间
				this.timeConfig.timeTemp = this.subTaskCache.subStartTime || this.$store.getters.subStartTime;
				this.timeConfig2.timeTemp = this.subTaskCache.subStopTime || this.$store.getters.subStopTime;


				this.selectConfig.selectList.toPersonList.userSelected = this.subTaskCache.toPersons;
				this.selectConfig2.selectList.ccPersonList.userSelected = this.subTaskCache.ccPersons;
				// 子任务负责人默认为发起人
				if (this.subTaskCache.toPersons.length == 0) {
					this.oldIncharge = {
						userId: _.userId,
						personName: _.personName,
						headPic: _.headPic
					};
					this.selectConfig.selectList.toPersonList.userSelected.push(this.oldIncharge);
				}
				//        this.imageUrls = '';
				// 清空附件图片列表
				this.mediaIds.splice(0, this.mediaIds.length);
				this.newFileList.splice(0, this.newFileList.length);
				this.previewImageUrl.splice(0, this.previewImageUrl.length);
				this.buttonConfig.defaultList.splice(1, 1);
				// 新建子任务的缓存数据
				if (status) {
					this.priorityShow = true;
					this.priorityPageShow = false;
					if (this.subTaskCache.fileList.length > 0) {
						this.addFilePic(this.subTaskCache.fileList);
					}
				}
				this.priority = this.subTaskCache.priority;
				this.subTaskCache.executorCloseTask !== '' ? this.executorCloseTask = this.subTaskCache.executorCloseTask : '';
			},
			// 取消按钮
			hideSubtaskDetail() {
				window.sessionStorage.removeItem('clickEnclosurePicType');
				this.$store.commit('subTaskPageUpdate', true);
				var fromAddContent = window.sessionStorage.getItem('fromAddContent');
				if (fromAddContent && fromAddContent == 'fromAddContent') {
					window.sessionStorage.removeItem('fromAddContent');
					window.sessionStorage.setItem('addModuleType', 'mainAddModule');
				}

				// 初始化一些权限数据
				this.$store.commit('isInchargeUpdate', this.dataBase.isMainIncharge);
				this.$store.commit('taskOverUpdate', this.$store.getters.mainTaskOver);
				this.$store.commit('urgentPermissionUpdate', false);
				this.$store.commit('changeSubTaskTimeUpdate', false);
				this.$store.commit('addSubTaskPageUpdate', false);

				localStorage.removeItem('subTaskCache');
				// 详情页子任务跳详情页
				if (this.$store.getters.isDetailPage) {
					this.$router.push({
						path: '/detail',
						name: 'detail',
						query: {
							taskId: this.$route.query.taskId
						}
					});
				} else {
					let query = {};
					// 判断是新建任务、复制任务还是编辑草稿
					if (this.$store.getters.isCopyPage) {
						query.taskId = this.$store.getters.taskId;
						if (this.$store.getters.isDraftPage) {
							query.isDraft = this.$store.getters.isDraftPage;
						}
					}
					this.$router.push({
						path: '/add',
						name: 'add',
						query: query
					});
				}
			},
			// 删除子任务按钮
			deleteSubTask() {
				let self = this;
				let btn = {
					primaryBtn: {
						name: '删除',
						callBack: function() {
							self.subTaskData.subtask.splice(self.currentSubTask, 1);
							self.subTaskFileList.splice(self.currentSubTask);
							self.$store.commit('subTaskFileListUpdate', self.subTaskFileList);
							self.$store.commit('subTaskDataUpdate', self.subTaskData);
							//              self.$emit('listenToChild',self.subTaskData);
							self.$store.commit('subTaskPageUpdate', true);
							// 删除缓存的子任务数据
							self.subtaskDataCache();
							self.hideSubtaskDetail();
						}
					},
					defaultBtn: {
						name: "取消",
						callBack: null
					},
				};
				_.alert('', '是否删除该子任务', btn)
			},
			// 保存子任务按钮
			saveSubtaskDetail() {
				if (this.add_nav.title == '') {
					_.alert('', '子任务标题不能为空');
					return;
				}
				if (this.incharges.length == 0) {
					_.alert('', '子任务负责人不能为空');
					return;
				}
				let self = this;
				window.sessionStorage.removeItem('clickEnclosurePicType');
				this.$store.commit('subTaskPageUpdate', true);
				// 如果主任务的进度反馈类型为“按工时”,子任务负责人默认为所有执行人工时相加
				if (this.rate == 2) {
					for (var i = 0; i < this.executors.length; i++) {
						this.incharges[0].workHour += Number(this.executors[i].workHour);
					}
				}
				let imageUrls = [];
				this.imageList.forEach((item) => {
					imageUrls.push(item.src);
				});
				let singleSubTaskData = {
					subtaskId: 'subtaskpercentageId_' + (this.subTaskData.subtask.length + 1),
					number: this.$store.getters.subTaskNumber, // 子任务编号
					title: this.add_nav.title,
					content: this.add_nav.content,
					startTime: this.timeConfig.timeTemp + ':00',
					stopTime: this.timeConfig2.timeTemp + ':00',
					incharges: this.incharges, // 子任务负责人
					executors: this.executors, // 子任务执行人
					executorCloseTask: this.executorCloseTask, // 执行人可结束/拒绝/重启子任务
					priority: this.priority, // 优先级
					imageUrls: imageUrls.join(','), // 图片
					showStyle: this.showStyle,
					mediaIds: this.mediaIds.join(','), // 附件
					filepicCount: this.mediaIds.length + imageUrls.length, // 附件图片数量
					rate: this.$store.getters.taskRate, // 进度反馈
				};

				let fileList = [];
				for (let i = 0; i < this.newFileList.length; i++) {
					fileList.push(this.newFileList[i])
				}
				// 如果是新增子任务，就把数据添加到子任务数组，否则直接替换当前的内容
				if (!this.subTaskDetailShow) {
					this.subTaskData.subtask.push(singleSubTaskData);
					this.subTaskFileList.push(fileList);
				} else {
					this.$set(this.subTaskData.subtask, this.currentSubTask, singleSubTaskData);
					this.subTaskFileList[this.currentSubTask] = fileList;
				}
				this.$store.commit('subTaskFileListUpdate', this.subTaskFileList);
				this.$store.commit('subTaskDataUpdate', this.subTaskData);

				// 缓存子任务数据
				if (!this.$store.getters.isDetailPage) {
					this.subtaskDataCache();
				}
				// 如果是详情页，点击保存按钮直接发送添加子任务的请求
				if (this.$store.getters.isDetailPage) {
					addSubTask({
						'tbQyTaskPO.taskId': this.$store.getters.taskId,
						'subtaskJsonStr': JSON.stringify(singleSubTaskData),
						'oldTaskStatus': 1
					}, (result) => {
						localStorage.removeItem('subTaskCache');
						this.$router.push({
							path: '/detail',
							name: 'detail',
							query: {
								taskId: this.$store.getters.taskId
							}
						});
					})
				} else {
					var fromAddContent = window.sessionStorage.getItem('fromAddContent');
					if (fromAddContent && fromAddContent == 'fromAddContent') {
						this.$store.commit('mainAddContentModuleHideUpdate');
						this.$store.commit('subTaskDisplayUpdate');
						window.sessionStorage.removeItem('fromAddContent');
						window.sessionStorage.removeItem('addModuleType');
					}
					this.$store.commit('subTaskDisplayUpdate');
					this.hideSubtaskDetail();
				}
			},
			// 编辑子任务
			modifySubTask(key, subtaskId) {
				// 子任务模块初始化
				this.moduleInit();

				window.sessionStorage.setItem('clickEnclosurePicType', 'subClick');
				this.$store.commit('priorityDisplayUpdateHide');
				this.priorityShow = true;
				this.priorityPageShow = false;
				this.$store.commit('subAddContentModuleHideUpdate');
				this.$store.commit('subTaskPageUpdate', true);
				this.$store.commit('subLoadFinishUpdate', false);

				this.currentSubTask = key;
				this.previewImageUrl.splice(0, this.previewImageUrl.length);
				// 控制评分模块显示
				if (this.$store.getters.subtaskScoreList.length > 0 && this.$store.getters.subtaskScoreList[key].score != '') {
					this.$store.commit('subScoreUpdate', true);
				} else {
					this.$store.commit('subScoreUpdate', false);
				}

				this.add_nav.title = this.subTaskData.subtask[key].title;
				this.add_nav.content = this.subTaskData.subtask[key].content;
				this.imageList.splice(0, this.imageList.length);
				this.mediaIds.splice(0, this.mediaIds.length);
				this.newFileList.splice(0, this.newFileList.length);
				this.priority = Number(this.subTaskData.subtask[key].priority);
				this.timeConfig2.timeTemp = this.subTaskData.subtask[key].stopTime.substring(0, 16);
				this.taskStatus = this.subTaskData.subtask[key].taskStatusDesc;
				// 详情页面
				if (this.$store.getters.isDetailPage) {
					// 子任务编辑页面
					this.$store.commit('addSubTaskPageUpdate', false);

					// 获取子任务详情页数据
					getSubTaskDetail(this.$store.getters.subtaskId, (result) => {

						// 子任务内容数据
						let subtask = result.subtask;
						this.taskItem = subtask;
						// 子任务创建者id等于当前登录人id，设置任务权限为发起人
						if (subtask.creator == _.userId) {
							this.$store.commit('taskLevelUpdate', 'a1');
						}
						this.$store.commit('personNameUpdate', subtask.personName);
						if (subtask.taskStatus == '2') {
							this.$store.commit('taskOverUpdate', true);
						} else {
							this.$store.commit('taskOverUpdate', false)
						}
						// 基础信息
						this.add_nav.title = subtask.title;
						this.taskStatus = subtask.taskStatusDesc;
						this.status = subtask.taskStatus;
						this.showDealer = subtask.showDealer;
						this.taskStopTime = subtask.stopTime;
						this.finishTime = subtask.completionTime;
						this.rectificationText = subtask.describe;
						this.approvalReason = subtask.approvalReason;
						console.log('this.approvalReason',subtask.approvalReason)
            this.appList = subtask.appList;
						this.$store.commit('subtaskTitleUpdate', subtask.title);
						this.add_nav.content = subtask.content;
						this.mediaIds.splice(0, this.mediaIds.length);
						this.newFileList.splice(0, this.newFileList.length);
						this.priority = Number(subtask.subtaskPriority);
						//            this.allExecutorNum = subtask.allExecutorNum;

						if (subtask.picList && subtask.picList.length > 0) {
							this.$store.commit('subImageDisplayUpdate', true);
							subtask.picList.forEach((item) => {
								item.src = item.picPath;
							});
							this.imageList = subtask.picList;
						}
						this.showStyle = subtask.showStyle || 0;

						// 子任务附件
						if (result.mediaList.length > 0) {
							this.addFilePic(result.mediaList);
						}

            // 子任务描述文件
            if (result.fileList.length > 0) {
              this.addFileImg(result.fileList);
            }
            // 子任务描述图片
            if (result.imgList.length > 0) {
              this.imgList = result.imgList;
              this.imgList.forEach(item=>{
                item.url = _.fileDownURL+item.url;
              })
            }

						// 子任务编号
						if (subtask.number != '') {
							this.$store.commit('subTaskNumberUpdate', subtask.number);
						} else {
							this.$store.commit('subTaskNumberUpdate', '');
						}
						// 子任务负责人与执行人
						this.selectConfig.selectList.toPersonList.userSelected = [subtask.incharge];
						this.oldIncharge = subtask.incharge;
						if (subtask.incharge) {
							this.oldInchargeId = subtask.incharge.userId;
							this.oldRecipientId = subtask.incharge.recipientId;
							// 默认不是任务的负责人或执行人，当子负责人id等于当前登录人id，是负责人
							this.$store.commit('isInchargeUpdate', false);
							if (subtask.incharge.userId == _.userId) {
								this.$store.commit('isInchargeUpdate', true);
								this.$store.commit('urgentPermissionUpdate', true);
							}
						}
						this.selectConfig2.selectList.ccPersonList.userSelected = subtask.allExecutor;
						this.listRecRate = subtask.executorList;
						// 子执行人可拒绝、结束任务按钮开关
						this.executorCloseTask = subtask.executorCloseTask;
						// 子任务创建时间
						this.creatorTime = timeUtil.changeFormat(new Date(subtask.creatorTime.time), 'yyyy-MM-dd hh:mm:ss');
						// 子任务时间
						// let subStartTime = timeUtil.changeFormat(new Date(subtask.startSubtaskTime.time), 'yyyy-MM-dd hh:mm');
						let subStopTime = timeUtil.changeFormat(new Date(subtask.stopSubtaskTime.time), 'yyyy-MM-dd');
						this.$store.commit('subLoadFinishUpdate', true);
						// this.$store.commit('subStartTimeHandler', subStartTime);
						// this.timeConfig.timeTemp = subStartTime;
						this.timeConfig2.timeTemp = subStopTime;
						// 子任务优先级
						//            this.$store.commit('subAddContentModuleHideUpdate');
						this.$store.commit('priorityDisplayUpdateHide');
						// 子任务评论
						this.commentList = result.comments;
						this.hasMore = result.hasMore;
						this.dataBase.subCurrentPage = 0;
						this.dataBase.firstLoading = true;

					})
				} else {
					// 非详情页面
					console.log('非详情页面')
					this.timeConfig.timeTemp = this.subTaskData.subtask[key].startTime.substring(0, 16);
					this.selectConfig.selectList.toPersonList.userSelected = this.subTaskData.subtask[key].incharges;
					this.oldIncharge = this.subTaskData.subtask[key].incharges;
					this.selectConfig2.selectList.ccPersonList.userSelected = this.subTaskData.subtask[key].executors;
					this.executorCloseTask = this.subTaskData.subtask[key].executorCloseTask;
					// 子任务图片
					if (this.subTaskData.subtask[key].imageUrls) {
						this.$store.commit('subImageDisplayUpdate', true);
						this.subTaskData.subtask[key].imageUrls.split(',').forEach((item) => {
							this.imageList.push({
								src: item
							})
						});
					}
					this.showStyle = this.subTaskData.subtask[key].showStyle || 0;
					let media, file;
					if (this.subTaskData.subtask[key].mediaIds != '') {
						media = this.subTaskData.subtask[key].mediaIds.split(',');
						file = this.subTaskFileList[key];
						this.mediaIds.push(...media);
						this.newFileList.push(...file);
						this.newFileList.forEach((item) => {
							this.previewImageUrl.push({
								src: item.src
							});
						})
						// 隐藏子任务添加内容模块
						this.$store.commit('subAddContentModuleHideUpdate');
						// 隐藏添加内容中附件模块
						this.$store.commit('subEnclosurePicAddContentDisplayUpdate', false);
						this.$store.commit('subEnclosurePicDisplayUpdate');
					} else {
						window.sessionStorage.setItem('subModuleNum', 1);
						this.$store.commit('subModuleNumUpdate');
						this.$store.commit('subEnclosurePicAddContentDisplayUpdate', true);
						this.$store.commit('subEnclosurePicDisplayUpdateHide');
					}

					// 点开已新增的任务增加删除任务的按钮
					if (!this.buttonConfig.defaultList[1]) {
						this.buttonConfig.defaultList.push({
							type: "default",
							name: '删除',
							callBack: null
						});
					}
					this.buttonConfig.defaultList[1].callBack = this.deleteSubTask;
				}
			},
      addFileImg(mediaList) {
        if (mediaList.length > 0) {
          for (let i = 0; i < mediaList.length; i++) {
            let media = mediaList[i];
            let file = {
              fileName: media.fileName,
              id: media.id,
              fileExt: media.fileExt || 'JPG'
            };
            let imgType = ['PNG', 'JPG', 'BMP', 'JPEG'];
            if (imgType.indexOf(file.fileExt) != -1) {
              file.src = media.url ? _.compressURL + media.url : media.src;
              file.fileSize = media.fileSizeStr || media.fileSize;
              this.previewImageUrl.push({
                src: file.src
              });
            } else {
              file.url = media.url;
              file.fileSizeStr = media.fileSizeStr || media.fileSize;
            }
            this.fileList.push(file);
            this.newMediaIds.push(media.id);
          }
        }
      },
			addFilePic(mediaList) {
				if (mediaList.length > 0) {
					this.$store.commit('subAddContentModuleHideUpdate');
					this.$store.commit('subEnclosurePicAddContentDisplayUpdate', false);
					this.$store.commit('subEnclosurePicDisplayUpdate');
					for (let i = 0; i < mediaList.length; i++) {
						let media = mediaList[i];
						let file = {
							fileName: media.fileName,
							id: media.id,
							fileExt: media.fileExt || 'JPG'
						};
						let imgType = ['PNG', 'JPG', 'BMP', 'JPEG'];
						if (imgType.indexOf(file.fileExt) != -1) {
							file.src = media.url ? _.compressURL + media.url : media.src;
							file.fileSize = media.fileSizeStr || media.fileSize;
							this.previewImageUrl.push({
								src: file.src
							});
						} else {
							file.url = media.url;
							file.fileSizeStr = media.fileSizeStr || media.fileSize;
						}
						this.newFileList.push(file);
						this.mediaIds.push(media.id);
					}
				} else {
					window.sessionStorage.setItem('subModuleNum', 1);
					this.$store.commit('subModuleNumUpdate');
					this.$store.commit('subEnclosurePicAddContentDisplayUpdate', true);
					this.$store.commit('subEnclosurePicDisplayUpdateHide');
				}
			},
			// 初始化添加的模块
			moduleInit() {
				// 默认是否开启【执行人可结束按钮】
				this.executorCloseTask = this.$store.getters.taskPermission.openOverTask;
				this.$store.commit('priorityDisplayUpdate');
				// 新增子任务页面，优先级、附件初始化（默认不添加）
				this.priorityShow = false;
				this.$store.commit('subEnclosurePicDisplayUpdateHide');
				this.$store.commit('subImageDisplayUpdate', false);
			},
			// 缓存子任务数据
			subtaskDataCache() {
				for (let i in this.subTaskData.subtask) {
					this.subListDataCache.subtask[i] = this.subTaskData.subtask[i];
					this.subListDataCache.subtask[i].filepicList = this.subTaskFileList[i];
				}
				localStorage.setItem('subListDataCache', JSON.stringify(this.subListDataCache));
			},
			// 任务时间缓存
			saveTimeCache() {
				if (!this.isAddSubtaskPage) {
					return;
				}
				this.subTaskCache.subStartTime = this.timeConfig.timeTemp + ':00';
				this.subTaskCache.subStopTime = this.timeConfig2.timeTemp + ':00';
				localStorage.setItem('subTaskCache', JSON.stringify(this.subTaskCache));
			},
			getTaskPriority(key) {
				this.priorityShow = true;
				this.priorityPageShow = false;
				this.priority = key; // 优先级
				if (this.currentSubTask != '') {
					this.subTaskData.subtask[this.currentSubTask].priority = key;
					this.$store.commit('subTaskDataUpdate', this.subTaskData);
				}

				if (!this.isAddSubtaskPage) {
					return;
				}
				this.subTaskCache.priority = key;
				localStorage.setItem('subTaskCache', JSON.stringify(this.subTaskCache));
			},
			getImgUrl(url) {
				this.imageUrls = url;
			},
			updateImageList(imageList) {
				this.imageList = imageList;
				if (!this.isAddSubtaskPage) {
					return;
				}
				this.subTaskCache.picList = imageList;
				localStorage.setItem('subTaskCache', JSON.stringify(this.subTaskCache));
			},
			getFileId(mediaIds) {
				this.mediaIds = mediaIds;
			},
			getFileList(list) {
				this.newFileList = list;
				if (!this.isAddSubtaskPage) {
					return;
				}
				this.subTaskCache.fileList = list;
				localStorage.setItem('subTaskCache', JSON.stringify(this.subTaskCache));
			},
			getExecutorCloseTask(executorCloseTask) {
				if (!this.isAddSubtaskPage) {
					return;
				}
				this.executorCloseTask = executorCloseTask;
				localStorage.setItem('subTaskCache', JSON.stringify(this.subTaskCache));
			},
			getSelectShow(val) {
				this.selectConfig3.show = val;
			},
			changeSwitch(val) {
				this.executorCloseTask = val;
			},
			changeSubIncharge(isFinishTask, ownFinishRate, currentSubTask) {
				this.selectConfig.selectList.toPersonList.userSelected[0].isOver = isFinishTask ? 1 : 0;
				if (this.$store.getters.taskRate == 1) {
					if (ownFinishRate == 100) {
						this.$set(this.subTaskDetailData[currentSubTask], 'taskStatus', 2);
					} else {
						this.$set(this.subTaskDetailData[currentSubTask], 'taskStatus', 1);
					}
				} else {
					this.$set(this.subTaskDetailData[currentSubTask], 'taskStatus', isFinishTask ? 2 : 1)
				}
				this.selectConfig.selectList.toPersonList.userSelected[0].rate = ownFinishRate;
				if (this.subTaskDetailData[currentSubTask].taskStatus == 2) {
					this.$store.commit('taskOverUpdate', true);
					this.modifySubTask(this.currentSubTask);
				} else {
					this.$store.commit('taskOverUpdate', false);
				}
			},
			// 点击查看全部进度
			getListRecRate(currPage, list) {
				if (currPage == 1) {
					this.listRecRate.splice(0, this.listRecRate.length);
				}
				this.listRecRate.push(...list);
			},
			// 更新执行人列表
			updateRate(listRecRate) {
				this.listRecRate = listRecRate;
			},
			updateWorkHour(val) {
				this.selectConfig.selectList.toPersonList.userSelected[0].workHour = val;
			},
			addType(type) {
				if (type == 6) {
					if (_.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp()) {
						this.$store.commit('subEnclosurePicDisplayUpdate');
					}
					this.$refs.sub_enclosure_pic.enclosure_pic_click();
				} else if (type == 7) {
					this.priorityShow = true;
					this.priorityPageShow = true;
				} else if (type == 8) {
					this.$refs.task_title.$refs.img_upload.$refs.add_img.$refs.input.click();
				}
			},
			// 判断是否点击了“返回主任务”按钮
			getSubTaskShow(key) {
				this.$store.commit('subTaskPageUpdate', true);
			},
			updateSubOperation(data) {
				this.commentList = data;
			},
			updateHasMore(val) {
				this.hasMore = val;
			},
			// 点击了结束子任务
			getTaskClose() {
				this.initPopWindowConfig();
				this.popWindowConfig.taskId = this.$store.getters.taskId;
				this.popWindowConfig.subtaskId = this.$store.getters.subtaskId;
				this.popWindowConfig.subtask.showSubTask = true;
				this.popWindowConfig.endType.showType = true;
				this.popWindowConfig.curOperate = 'endSubTask';
				this.popWindowConfig.subtask.title = this.add_nav.title;
				this.popWindowConfig.isScore = this.$store.getters.taskPermission.isScore;
				this.popWindowConfig.score.showScore = this.$store.getters.taskPermission.isScore && this.$store.getters.urgentPermission;

				this.popWindowConfig.showWindow = true;
			},
			// 点击了重启子任务
			getTaskRestart() {
				this.initPopWindowConfig();
				this.popWindowConfig.taskId = this.$store.getters.taskId;
				this.popWindowConfig.subtaskId = this.$store.getters.subtaskId;

				this.popWindowConfig.updateTask.showUpadate = true;
				this.popWindowConfig.curOperate = 'updateSubTask';
				this.popWindowConfig.showWindow = true;
			},
			// 点击了任务评分
			getScorePop() {
				this.initPopWindowConfig();
				this.popWindowConfig.taskId = this.$store.getters.taskId;
				this.popWindowConfig.taskTitle = this.add_nav.title;
				this.popWindowConfig.subtaskList.push(...this.$store.getters.subtaskScoreList);
				this.popWindowConfig.subtaskList.forEach((item) => {
					item.score = 10;
				});
				this.popWindowConfig.endType.showType = false;
				this.popWindowConfig.curOperate = 'updateScore';
				this.popWindowConfig.isScore = this.$store.getters.taskPermission.isScore;
				this.popWindowConfig.score.showScore = true;
				this.popWindowConfig.showWindow = true;
			},
			updateCommentList(data, commentCount, onlyCommentCount) {
				this.commentList = data;
				this.commentCount = commentCount;
				this.onlyCommentCount = onlyCommentCount;
			},
			updateCommentCount(val) {
				if (val) {
					this.onlyCommentCount++;
					this.commentCount++;
				} else {
					this.onlyCommentCount--;
					this.commentCount--;
				}
			},
			cancelPopWindow() {
				this.popWindowConfig.showWindow = false;
			},
			confirmPopWindow() {
				if (this.popWindowConfig.curOperate == 'endSubTask') {
					this.$store.commit('taskOverUpdate', true);
				} else {
					this.$store.commit('taskOverUpdate', false);
				}
				this.modifySubTask(this.currentSubTask);
			},
			reloadSubtaskData() {
				this.subDetailDataBaseInit();
				this.modifySubTask(this.currentSubTask);
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
			filterTime(stopTime) {
				let dateNow = new Date(); //当前时间数据
				let isOverTime = (new Date() > (new Date(stopTime.replace(/-/g, "\/"))))
				return isOverTime ? 'overTime' : 'inProgress'
			},
		},
		watch: {
			subTaskShow(val) {
				document.querySelector('.qwjs-subtask').click();
			},
			executors: function() {
				console.log('incharges-------executors----')
				//console.log(this.executors)
				// for (let i = 0; i < this.executors.length; i++) {
				// 	if (this.incharges && this.incharges.length >= 1 && this.executors.length >= 1 && this.incharges[0].userId == this.executors[i].userId) {
				// 		this.selectConfig2.selectList.ccPersonList.userSelected.splice(i, 1);
				// 		_.alert('', '子任务负责人不能同时是执行人');
				// 		break;
				// 	}
				// }
				if (this.executors.length) {
					this.$set(this.selectConfig2.selectList, 'showBtn', true);
				} else {
					this.$set(this.selectConfig2.selectList, 'showBtn', false);
				}

				// 新建子任务页面，缓存执行人数据
				if (this.isAddSubtaskPage) {
					this.subTaskCache.ccPersons = this.executors;
					localStorage.setItem('subTaskCache', JSON.stringify(this.subTaskCache));
				}

			},
			incharges: function() {
				console.log('incharges-----------')
				// if (this.incharges && this.incharges.length == 0) {
				// 	this.selectConfig.selectList.toPersonList.userSelected = [this.oldIncharge];
				// 	_.alert('', '子任务负责人不能为空');
				// 	this.selectConfig.show = true;
				// 	return;
				// }
				// for (var i = 0; i < this.executors.length; i++) {
				// 	// 负责人、执行人都有数据，负责人不可等于执行人，且负责人不能为空
				// 	if (this.incharges && this.incharges && this.incharges.length >= 1 && this.executors.length >= 1 && this.incharges[0].userId == this.executors[i].userId) {
				// 		this.selectConfig.selectList.toPersonList.userSelected = [this.oldIncharge];
				// 		_.alert('', '子任务负责人不能同时是执行人');
				// 		this.selectConfig.show = true;
				// 		return;
				// 	}
				// }
				if (this.$store.getters.isDetailPage && this.$store.getters.subLoadFinish && !this.$store.getters.addSubTaskPage &&
					this.$store.getters.subTaskPage) {

					// 旧的与新的不一样，为修改子任务负责人
					if (this.incharges && this.incharges.length > 0 && this.oldInchargeId != this.incharges[0].userId) {
						let addIncharges = [];
						let workHour = this.rate == 2 ? this.oldIncharge.workHour : '';
						this.incharges.forEach((item) => {
							addIncharges.push({
								userId: item.userId,
								personName: item.personName,
								headPic: item.headPic,
								workHour: workHour,
								isOver: 0,
								rate: 0,
							});
						});

						let userJson = {
							'incharges': addIncharges,
						};
						updateSubtaskIncharge({
							'taskId': this.$store.getters.taskId,
							'subtaskId': this.$store.getters.subtaskId,
							'userJson': JSON.stringify(userJson),
							'oldTaskStatus': this.$store.getters.oldTaskStatus,
							'subinchargeId': this.oldInchargeId,
							'title': this.$store.getters.subtaskTitle
						}, (result) => {
							// 如果修改后userId为当前的userId,则加上负责人权限
							if (addIncharges[0].userId == _.userId) {
								this.$store.commit('isInchargeUpdate', true);
								this.$store.commit('urgentPermissionUpdate', true);
							}
							// 如果修改前的userId为当前的userId,则移除负责人权限
							if (this.oldInchargeId == _.userId) {
								this.$store.commit('isInchargeUpdate', false);
								this.$store.commit('urgentPermissionUpdate', false);
							}
							this.oldInchargeId = addIncharges[0].userId;
							this.oldRecipientId = result.recipientId;
							this.subTaskData.subtask[this.currentSubTask].incharges = addIncharges;
							this.$store.commit('operationRecordUpdate', result.tbQyTaskCommentList);
							this.modifySubTask(this.currentSubTask)
						})
					}
				}
				this.oldIncharge = this.selectConfig.selectList.toPersonList.userSelected[0];

				if (this.isAddSubtaskPage) {
					this.subTaskCache.toPersons = this.incharges;
					localStorage.setItem('subTaskCache', JSON.stringify(this.subTaskCache));
				}
			},
			'selectConfig3.selectList.ccPersonList.userSelected': function() {
				let self = this;
				// 更改子执行人
				if (this.$store.getters.isDetailPage && !this.$store.getters.addSubTaskPage) {
					if (this.selectConfig3.selectList['ccPersonList'].userSelected.length > 0) {
						let newIncharges = [];
						newIncharges.push(...this.selectConfig3.selectList['ccPersonList'].userSelected);
						console.log(newIncharges);
						// 跟所返回的执行人作对比，如有相同的则移除掉
						this.selectConfig3.selectList['ccPersonList'].userSelected.forEach((item, i) => {
							if (item.userId == this.incharges[0].userId) {
								newIncharges.splice(i, 1, '');
							}
							// 初始完成状态
							item.rate = 0;
							item.isOver = 0;
							this.selectConfig2.selectList['ccPersonList'].userSelected.forEach((value) => {
								if (item.userId == value.userId) {
									newIncharges.splice(i, 1, '');
								}
							})
						});

						// 添加执行人
						console.log(newIncharges);
						let addIncharges = [];
						let workHour = this.rate == 2 ? 10 : '';
						let isIncharge = false;
						newIncharges.forEach((item) => {
							if (item.userId == _.userId) {
								isIncharge = true;
							}
							if (item != '') {
								addIncharges.push({
									userId: item.userId,
									personName: item.personName,
									headPic: item.headPic,
									workHour: workHour
								});
							}
						});
						if (addIncharges.length > 0) {
							this.selectConfig2.selectList['ccPersonList'].userSelected.unshift(...addIncharges);

							// 添加子执行人
							let userJson = {
								'executors': addIncharges
							};
							addSubTaskIncharges({
								//                'tbQyTaskPO.isUseRate':this.rate,
								'taskId': this.$store.getters.taskId,
								'subtaskId': this.$store.getters.subtaskId,
								'userJson': JSON.stringify(userJson),
								'oldTaskStatus': this.$store.getters.oldTaskStatus,
								'title': this.$store.getters.subtaskTitle
							}, (result) => {
								// 更新进度数据
								//                self.listRecRate = result.listRecRate;
								if (self.rate == 2) {
									self.selectConfig.selectList.toPersonList.userSelected[0].workHour = result.allExecutorWorkhour;
								}
								self.$store.commit('operationRecordUpdate', result.tbQyTaskCommentList);
								if (self.dataBase.allRateShow) {
									let params = {};
									params['subtaskId'] = this.$store.getters.subtaskId;
									self.dataBase.rateCurrentPage = 1;
									params['page'] = 1;
									getAllTaskRate(params, (result) => {
										self.rateDetailConfig.lock_roll = false;
										self.dataBase.rateCurrentPage = result.currPage + 1;
										self.dataBase.hasMoreRate = result.currPage >= result.maxPage ? false : true;
										self.rateDetailConfig.loading = false;
										self.listRecRate = result.pageData;
									})
								} else {
									self.listRecRate = result.fiveSubtaskExecutor;
								}
								// 如果添加了当前登录人，显示更新进度按钮
								if (isIncharge) {
									self.$store.commit('isInchargeUpdate', true);
								}
							});
						}
						// 清空新选的子执行人数据
						this.selectConfig3.selectList['ccPersonList'].userSelected = [];
						newIncharges = [];
					}
				} else {
					if (this.selectConfig3.selectList['ccPersonList'].userSelected.length > 0) {
						this.selectConfig3.selectList['ccPersonList'].userSelected.forEach((item) => {
							item.rate = 0;
							item.isOver = 0;
							item.workHour = self.rate == 2 ? 10 : '';
						});
						this.selectConfig2.selectList['ccPersonList'].userSelected = this.selectConfig3.selectList['ccPersonList'].userSelected;
					}
				}
			},
			'add_nav.title': function() {
				if (!this.isAddSubtaskPage) {
					return;
				}
				this.subTaskCache.title = this.add_nav.title;
				localStorage.setItem('subTaskCache', JSON.stringify(this.subTaskCache));
			},
			'add_nav.content': function() {
				if (!this.isAddSubtaskPage) {
					return;
				}
				this.subTaskCache.content = this.add_nav.content;
				localStorage.setItem('subTaskCache', JSON.stringify(this.subTaskCache));
			},
		},
		computed: {
			subTaskData() {
				return this.$store.getters.subTaskData;
			},
			subTaskDetailData() {
				return this.$store.getters.subTaskDetailData;
			},
			subTaskFileList() {
				return this.$store.getters.subTaskFileList;
			},
			subEnclosurePicDisplay() {
				return this.$store.getters.subEnclosurePicDisplay;
			},
			subModuleNum() {
				return this.$store.getters.subModuleNum;
			},
			incharges() {
				let personList = [];
				this.selectConfig.selectList.toPersonList.userSelected.forEach((item) => {
					// personList.push({
					// 	userId: item.userId == null ? '':item.userId,
					// 	personName: item.personName,
					// 	headPic: item.headPic,
					// 	workHour: item.workHour || 0
					// });
					if (this.$store.getters.subTaskPage && this.$store.getters.addSubTaskPage) {
						personList[0].rate = 0;
						personList[0].isOver = 0;
						this.rate == 2 ? personList[0].workHour = 10 : '';
					}
				});
				return personList;
			},
			executors() {
				let personList = [];
				this.selectConfig2.selectList.ccPersonList.userSelected.forEach((item) => {
					// personList.push({
					// 	userId: item.userId == null ? '':item.userId,
					// 	personName: item.personName,
					// 	headPic: item.headPic,
					// 	workHour: item.workHour || 0
					// });
					if (item.userId == _.userId && this.$store.getters.subTaskPage) {
						this.$store.commit('isInchargeUpdate', true);
					}
				});
				return personList;
			},
			rateAverage() {
				let personList = [];
				if (this.$store.getters.addSubTaskPage) {
					personList = this.incharges;
				} else {
					personList = this.selectConfig.selectList.toPersonList.userSelected;
				}
				if (personList.length > 0) {
					if (this.rate == 0) {
						//return personList[0].isOver ? '1/1' : '0/1';
						return '0/1';
					} else if (this.rate == 1) {
						return personList[0].rate + '%';
					} else {
						return personList[0].rate + '/' + personList[0].workHour;
					}
				}
				return '';
			},
			subTaskDetailShow() {
				if (this.currentSubTask === '') {
					return false;
				}
				return true;
			},
			hasPermission() {
				if (!this.$store.getters.isDetailPage || ((this.$store.getters.taskLevel == 'a1' || (this.$store.getters.subTaskPage &&
						this.$store.getters.urgentPermission)) && !this.$store.getters.taskOver)) {
					return true
				}
				return false;
			},
			// 是否新增子任务页面
			isAddSubtaskPage() {
				return this.$store.getters.addSubTaskPage;
			},
			// 是否详情页
			isDetailPage() {
				return this.$store.getters.isDetailPage
			},
			rate() {
				return this.$store.getters.taskRate;
			},
			taskOver() {
				return this.$store.getters.taskOver;
			},
		},
		components: {
			taskNumbering,
			data_detail,
			taskTitle,
			task_time,
			task_main_responsible,
			taskRateDetail,
			taskComment,
			user_select,
			flow_button,
			task_add_content,
			taskPriority,
			taskRate,
			task_enclosure_pic,
			popWindow,
			taskRatePop,
			previewImages,
			taskRectification,
      TaskReason,
			taskFinishTime,
			chatInput,
			taskApprovalModal,
      TaskSign,
      TaskInfo
		}
	}
</script>

<style lang="scss">
	@media screen and (min-width:1024px) {
		.qwui-subtask_wrap {
			width: 740px !important;
			margin: 0 auto;
		}
	}

	.qwui-subtask_left {
		width: 26px;
		padding-left: 15px;
		background: url("../../../../assets/svg/icon_a-newtask-list_subtask.svg") no-repeat scroll right;
		background-position-y: 9px;
	}

	.qwui-subtask {
		display: flex;
		color: #0A1735;
		font-size: 15px;
		line-height: 46px;
		background: #fff;
	}

	.qwui-subtask_right {
		width: 24px;
		padding-right: 15px;
		background: url("../../../../assets/svg/icon-a-public_arrow-lower.svg") no-repeat scroll left;
		background-position-y: 9px;
	}

	.qwui-subtask_placeholder {
		width: 24px;
		padding-right: 15px;
	}

	.qwui-flexItem {
		flex: 1;
	}

	.qwui-subtask_add {
		padding-left: 8px;
	}

	.qwui-subtask_wrap {
		position: fixed;
		height: 100%;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		margin: 0 auto;
		background: #fff;
		z-index: 10;
		box-sizing: border-box;
		overflow-y: auto;
	}

	.qwui-subtask_wrap-relative {
		height: 100%;
		position: relative;
		overflow-y: auto;
		padding-bottom: 50px;
		overflow-x: hidden;
		box-sizing: border-box;
	}

	.qwui-subtask_wrap-relative::-webkit-scrollbar,
	.qwui-subtask_wrap::-webkit-scrollbar {
		display: none;
	}

	.qwui-subtask_listbox {
		/*padding-right: 50px;*/
	}

	.qwui-subtask_list {
		position: relative;
		height: 42px;
		width: 100%;
		margin-bottom: 10px;
		border-left: 3px solid;
		border-radius: 3px;
	}

	.qwui-subtask_list.active {
		opacity: 0.3;
	}

	.qwui-subtask_box {
		display: inline-block;
		padding-left: 12px;
	}

	.qwui-subtask_title {
		height: 20px;
		line-height: 20px;
		margin-bottom: 6px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden
	}

	.qwui-subtask_info {
		height: 13px;
		line-height: 13px;
		font-size: 13px;
		color: #B2B9C8;

		.stopTime {
			padding: 1px 5px;
			border-radius: 2px;
			font-size: 11px;
			// height: 16px;
			// line-height: 16px;
			text-align: center;

			&.overTime {
				color: #fff;
				background: #FE5354;
			}

			&.inProgress {
				color: #6E9BFF;
				background: #E8EFFF;
			}
		}
	}

	.qwui-subtask_over {
		padding: 0 5px;
		border-radius: 2px;
		font-size: 11px;
		color: #fff;
		background: #B2B9C8;
	}

	.qwui-subtask_img {
		position: absolute;
		top: 0;
		right: -20px;
	}

	.qwui-subtask_headpic {
		width: 24px;
		height: 24px;
		border-radius: 50%;
	}

	.qwui-media_num {
		display: inline-block;
		padding-left: 13px;
		margin-left: 13px;
		background: url("../../../../assets/svg/icon_a-newtask-list_enclosure.svg") no-repeat scroll left;
		background-size: 13px 13px;
	}

	.subTaskBtn .qwui-btn_default {
		flex: 1;
		color: #A2A4A7;
	}

	.subTaskBtn .qwui-btn_default:nth-child(2) {
		color: #FF548F;
	}

	.subTaskBtn .qwui-btn_primary {
		flex: 2;
	}

	.qwui-height {
		height: 10px;
	}

	.qwui-rate_detail.subtaskNum {
		margin-top: -10px;
	}

	.qwui-subtask_num {
		position: absolute;
		color: #6E9BFF;
	}

	.progBox {
		padding-left: 40px;
	}

	.progressbar {
		vertical-align: middle;
	}

	.qwui-subtask_detail .qwui-title_detaildata {
		display: none;
	}

</style>

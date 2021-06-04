<template>
    <div class="title-wrap" v-if="detail">
      <div class="title-color">
        <div class="wrap-head">
          <img src="../../../assets/images/btn_close.png" alt="" class="form-title-close" @click="removeFrame" >
          <div class="form-title-operate">
            <div class="form-title-btn" @click="buttonEdit.callback()">{{buttonEdit.value}}</div>
            <div class="form-title-btn form-title-cancel" v-if="buttonEdit.value == '保存'" @click="cancelEdit">取消</div>
            <div v-else class="form-title-btn form-title-cancel" @mouseover="showMore=true" @mouseout="showMore=false">
              <span class="form-title-btn_more"> 更多</span>
              <operate v-show="showMore" @operateFun="operateFun" :isTask="isTask" :isVip="permission.isVip" :creator="detail.creator"></operate>
            </div>
          </div>
          <!--标题信息-->
          <div class="form-title-read" v-if="!updateTitle">
            <span class="form-title-title">{{formTitle}}</span>
          </div>
          <div v-else class="form-title-edit form-title-read">
            <input class="form-title-edit" @blur="saveFormTitle($event)" v-model="formTitle" maxlength="100">
            <span class="font-count-position" :class="{colorRed:formTitle.length == 100}">{{formTitle.length}}/100<span class="icon-title-edit"></span></span>
          </div>
        </div>
      </div>
      <div class="wrap-flex">
          <div class="wrap" id="wrap" ref="wrap" v-windowscroll="scrollList">
          <div class="form-bg">
            <div class="form-title-msg">
              <span class="form-title-span">{{createTime}}</span>
              <span class="form-title-span" :class="{colorblue:creatorColor}" @click="showPersonDetail">{{personName}}</span>

            </div>
          <div class="form-detail-box" v-if="detail_content">
            <div ref="content" class="form-detail-content"   :class="{'form-detail-content-height':showToggle&&!showAllMsg}">
              <p id="content" v-html="detail_content"></p>
            </div>
            <!--模糊效果-->
            <div class="form-detail-content-blur" v-if="showToggle&&!showAllMsg"></div>
            <div  v-if="showToggle" @click="toggleMsgfn" class="form-detail-content-toggle">{{toggleMsg}} <span :class="{'toggle-up': showAllMsg,'toggle-down':!showAllMsg}"></span></div>
          </div>
        </div>

        <formBase v-if="refresh" v-show="showFormBase" @historyTitle="paramHistoryData" @showSaveBtn="showSave = true"></formBase>
        <!--附件列表-->
        <add-file-list v-if="mediaList && mediaList.length"
                       agent="form"
                       customClass="file_list_len"
                       :filesList="mediaList"
                       :deleteFile="false"
                       :downLoad="true">
          <div slot="title" class="file_title">附件({{mediaList.length}})</div>
        </add-file-list>
        <add-img-list class="uploadFile"
                      v-if="imgUploadPicList && imgUploadPicList.length"
                      :imageList="imgUploadPicList"
                      :disabled="true">
        </add-img-list>
        <!--<prev_next @refreshFrom="refreshFrom"></prev_next>-->
        <!--<div style="position: relative;" :class="{'circulationDetails':isShowSerial}">-->
            <!--审批人或负责人-->
            <!--<user_selected_group-->
              <!--v-if="showToPersons && userSelect.toPersonList.userSelected.length"-->
              <!--:title="userSelect.toPersonList.title"-->
              <!--:isEdit="false">-->
              <!--<user_selected_item-->
                <!--:List="userSelect.toPersonList.userSelected"-->
                <!--:title="userSelect.toPersonList.title"-->
                <!--:isEdit="false"-->
                <!--@atThisPersonUtil="atThisPersonUtil"-->
                <!--@showPersonList="showPersonList"-->
                <!--slot="user_selected_item"></user_selected_item>-->
            <!--</user_selected_group>-->

            <!--当前处理人-->
            <!--<user_selected_group-->
              <!--v-for="(item,index) in startAuditList"-->
              <!--:key="index"-->
              <!--v-if="startAuditList && item.auditUserList.length"-->
              <!--:title="startAuditTitle(item)"-->
              <!--:isEdit="false">-->
              <!--<user_selected_item-->
                <!--:List="item.auditUserList"-->
                <!--:title="startAuditTitle(item)"-->
                <!--:isEdit="false"-->
                <!--@atThisPersonUtil="atThisPersonUtil"-->
                <!--@showPersonList="showPersonList"-->
                <!--slot="user_selected_item">-->
              <!--</user_selected_item>-->
            <!--</user_selected_group>-->

            <!--下一步处理人-->
            <!--<user_selected_group-->
              <!--v-if="nextAuditListShow"-->
              <!--v-for="(item,index) in FlowAuditUser"-->
              <!--title="下一步处理人"-->
              <!--:isEdit="false">-->
              <!--<user_selected_item-->
                <!--v-if="flowNodeItemKeysShow"-->
                <!--slot="user_selected_item"-->
                <!--title="下一步处理人"-->
                <!--:List="isListShow"-->
                <!--:isEdit="isEditShow"-->
                <!--@atThisPersonUtil="atThisPersonUtil"-->
                <!--@showUserSelectedBox="FlowAuditUserShowBox(index)"-->
                <!--@showPersonList="showPersonList"-->
                <!--@removeSelected="(payload)=>removeFlowAuditUser({delUserIndex:payload.index,index})"-->
                <!--:isRemove="FlowAuditUser-->
                            <!--&& FlowAuditUser[index]-->
                            <!--&& FlowAuditUser[index].startAuditList.isCanEdit-->
                            <!--&& FlowAuditUser[index].startAuditList.isCanDelete">-->
              <!--</user_selected_item>-->
              <!--<div class="qwui-user_cell_title" slot="qwui-user_select_person_open"-->
                <!--v-show="item.startAuditList.flowNodeItemKeys && item.startAuditList.allUser.length === 0">-->
                <!--<p class="qwui-user_flowNodeItemKeys">已关联[{{isItemKeys(item.startAuditList.flowNodeItemKeys)}}]字段，请先填写</p>-->
              <!--</div>-->
            <!--</user_selected_group>-->

            <!--相关人-->
            <!--<user_selected_group-->
              <!--v-if="userSelect.ccPersonList.userSelected.length"-->
              <!--title="相关人" :isEdit="false">-->
              <!--<user_selected_item-->
                <!--:List="userSelect.ccPersonList.userSelected"-->
                <!--:isEdit="false"-->
                <!--title="相关人"-->
                <!--@atThisPersonUtil="atThisPersonUtil"-->
                <!--@showPersonList="showPersonList"-->
                <!--slot="user_selected_item">-->
              <!--</user_selected_item>-->
            <!--</user_selected_group>-->

            <!--负责人和相关人内容-->
            <!--<user-select :userselect="userSelect"></user-select>-->
          </div>

            <!--处理人范围选人-->
            <user_selected_ranglist
              v-if="FlowAuditUserBoxShow"
              :options="FlowAuditUser[appointUserIndex].startAuditList.flowUserList"
              :selectType="FlowAuditUser[appointUserIndex].startAuditList.selectType.type"
              :checkedType="FlowAuditUser[appointUserIndex].startAuditList.selectType.checkedType"
              :config="FlowAuditUser[appointUserIndex].startAuditList.selectType"
              :defaultAllSelect="FlowAuditUser[appointUserIndex].startAuditList.defaultAllSelect"
              :checked="FlowAuditUserIds(appointUserIndex)"
              @FlowAuditUserResult="FlowAuditUserResult">
            </user_selected_ranglist>

        <child-view></child-view>


        <!--选择节点-->
        <qw_select_node @selectNodeClick="selectNodeClick"></qw_select_node>

        <!--预览图片组件-->
        <previewImages :urls="previewImageUrl"></previewImages>

        <!--负责人、相关人详细列表-->
        <user-show :userselect="userSelect"></user-show>

        <!--个人信息-->
        <user_info></user_info>
        <!--轨迹历史-->
        <showHistory v-if="showHistoryBox" @closeHistory="hideHistory" :history="history"></showHistory>

        <!--人员列表组件-->
        <user_show :title="userselectTitle" :userSelect="userSelectList" :limitPreview="limitPreview" :show.sync="showPerson"></user_show>
        <!--显示评论的地理位置-->
        <tencent-map v-if="showMap"
                     :pos="commentAddress"
                     :type="mapType"
                     @closeMap="showMap = false"
        >
        </tencent-map>
        <select_crm v-if="dataBase.selectCrm.show"></select_crm>
        <!--crm字段信息-->
        <crm_info></crm_info>

        <div class="wrap-right">
          <div class="wrap-right-title">
            <div :style="{width : 88 * selectData.nav.length + 'px'}">
              <select-card
              :selectdata="selectData"
              @listenTabChange="showMsgFromSelectCard"
              :top="0"
              :height="0"
              :fixed="true">
            </select-card></div>
          </div>
          <div class="wrap-right-content">
            <!--评论列表-->
            <comment_list
              :commentList="commentList"
              :totalRow="listTotalRows"
              :dealListIcon="dealListIcon"
              :dealListContent="dealListContent"
              :dealListDelete="dealListDelete"
              @sendAddress="openMap"
              @onlyComment="onlySeeComment"
              @atThisPersonUtil="atThisPersonUtil"
              @commentListImagesURL="commentListImagesURL"
              @delete="deleteThisComment"
              v-show="curNav == '审批回复'" >
            </comment_list>
            <!-- 流转明细 -->
            <flow_serial :flowSerialData="flowSerialData" :isover="flow.isover" v-show="curNav == '流转明细'"></flow_serial>
            <!--加载更多-->
            <Load_more :loading="loading"
                       :type="'commentList'"
                       :hasMore="hasMore"
                       @loadMoreClick="loadMoreList(true)"
                       v-show="selectData.index == 0">
              <span v-if="!listTotalRows">还没有任何评论</span>
            </Load_more>
          </div>
          <!--选人-->
          <user_selected_Box :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user_selected_Box>
          <vip-dialog v-show="vipDialog" @close="vipDialog = false"></vip-dialog>
          <process v-if="process" :id="id" @closeProcess="closeProcess" :flow="flow" :refId="id" :isFirstIntervene="isFirstIntervene"></process>
        </div>
      </div>
    </div>
</template>

<script>
	import wx from 'weixin-js-sdk'
	import Vue from 'vue'
	import childView from '../childView'
	import formBase from '../formBase.vue'
	import html2canvas from 'html2canvas'                  //html转换为图片
	import {isVipSilver,isVipGold} from 'vpModule/assets/js/vip-portal.js' 	//判断VIP
	import {form_validation, filterData} from 'vpModule/js/form/validation'
  import { compatible } from 'vpModule/js/form/compatible'  //导入fields的兼容性方法
  import prev_next from './prev_next.vue'
	import userSelect from 'vpCommon/detail/user_select'
	import user_info from 'vpCommon/detail/user_info_card';//个人信息
	import userShow from 'vpCommon/base/user_show';
	import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';
	import flow_serial from 'vpCommon/flow/flow_serial'; // 流转明细
	import user_selected_item from 'vpCommon/base/userOrDeptSelect/user_selected';
	import user_selected_group from 'vpCommon/base/userOrDeptSelect/user_selected_group';
	import user_selected_Box from 'vpCommon/base/user_or_dept_select.vue' //js导入
	import operate from './operate';
	import previewImages from "vpCommon/detail/previewImages";
	import EventBus from 'vpModule/utils/eventBus';
	import qw_select_node from 'vpCommon/flow/selectNode';
	import comment_list from 'vpCommon/list/comment_list';
	import Load_more from 'vpCommon/list/load_more';
	import chatInput from 'vpCommon/detail/chatInput';
  import select_crm from '../base/select_crm.vue';
  import crm_info from '../base/crm_info';
	import {
		commentListMore,
		addCommentList,
		deleteCommentList,
		detailGetFroms,
		render_field,
		setReadonly,
		setFieldRead,
		setFieldShowHide,
		setFieldEdit,
		commitComment,
		loadScript,
		setEditAgain,
    setFieldShowRead,
    saveFormData,
    setEditAll
	} from 'vpModule/js/form/getData'
	import {getHistory,updateFormByToUser,checkFormAuthority,deleteForm,finishFlow} from 'vpModule/api/form/list'
	//轨迹组件
	import showHistory from './showHistory.vue'
	import vipDialog from './vipDialog.vue'
	import Process from './process_intervention.vue'
//	地图组件
	import tencentMap from 'vpCommon/add/tencentMap.vue'
	import audit_flow_api from 'vpCommon/flow/api/getData';
	import addFileList from 'vpCommon/add/upload/addFileList'
	import AddImgList from 'vpCommon/add/upload/imgList';
	import user_selected_ranglist from 'vpCommon/base/userOrDeptSelect/user_selected_ranglist'
	import user_show from 'vpCommon/detail/user_show'
  import selectCard from 'vpCommon/button/menu_tab_two'
	export default {
		components: {
			formBase,
			childView,
			userSelect,
			user_info,
			userShow,
			prev_next,
			showHistory,
			flow_serial,
			user_selected_item,
			user_selected_group,
			user_selected_Box,
			previewImages,
			qw_select_node,
			comment_list,
			Load_more,
			chatInput,
			addFileList,
			AddImgList,
			user_selected_ranglist,
			user_show,
			tencentMap,
      select_crm,
      crm_info,
      selectCard,
      operate,
      vipDialog,
      Process
		},
		data() {
			return {
				agent:'form',
				id: this.$route.query.id,
				definition_id:null,
        isUpdateTitle: false,//标题是否能更新
        updateTitle: false,
				dataBase: dataBase,
        formTitleCache: '', //暂存未编辑的标题
				formTitle: '',
				instanceTitleTemplate:'',
				content: '',
				detail: {},
				applystatus: {
					active: false,
					class: "status_blue",
					name: "i18n.inProgress",
					show: false
				},
				mediaList:[],
				//负责人和相关人
				userSelect: {
					toPersonList: {
						title: "负责人",
						show: false,
						num: 0,
						userSelected: [],
					},
					ccPersonList: {
						title: "相关人",
						show: false,
						num: 0,
						userSelected: [],
					}
				},
				loading:false,
				hasMore:false,
				lock_roll:false,
				currentPage:1,
				commentStatus:"1",
				listTotalRows:0,
				commentList:[],                                                        //评论列表
				deleteListIndex:"",                                                     //需要删除的index
				detailPicList:[],                                                       //详情头部图片列表
        contentImageUrl:[],                                                     //富文本图片列表
				previewImageUrl:[],                                                     //需要预览的图片列表
				//单的属性
        vipURL:'',
				stopTime: '',
				lastTime: '',															//加载上一页评论的时间
				createLeave: '',
				createTime: '',
				personName: '',
				creatorColor: true,
				isCreator: false,
				detail_content:'',//表单详细内容
				showAllMsg:false,
				toggleMsg:'展开显示全部',
				showToggle:false, //是否展开收起全部的按钮
				//展示轨迹的数据
				showHistoryBox:false,
				orbitList:[],
				history:{
					title:'',
					eachOrbitList:[]
				},
				orbitItemKeyList:[],
				showAt:true,
				currentFormId:'',//设置表单打印的字段
				isHasPrintTemplate:0,
				isShowFoot:'block',
				flow: {
					isBranchFlow: false,
					nodeId: '', //当前节点id
					creatorId:"",
					status: '', //审批状态
					isover:"",
					isAlreadyAudit:""
				},
				startAuditList:null,//当前审批人
				flowSerial: {
					isFirstRequest: true,
					isShowFlowSerial: false,
					list: [],
					isFreeFlow: ''
				},
				showToPersons:true,//是否显示审批人，非自由流程的审批单并且未审批完成时不显示
				buttonConfig: { //操作按钮
					primaryList: [{type: "primary", name: '保存', callBack: null}],
					defaultList: [],
					style: {class: ""}//按钮是否置底部 active :底部、"":相对定位
				},
        buttonEdit:{
				  value:'编辑',
          callback:null,
        },
				showSave:false, //保存按钮显示
				imgUploadPicList:[],
				showPerson:false,                                                   //是否展开所有选中人员列表
				userselectTitle:'',
				userSelectList:[],
				limitPreview:false,                                                //限制弹个人信息弹窗
				isTask:'',   //单的类型  2：审批单
				limitPreview:false,                                                //限制弹个人信息弹窗
				commitData:{},                  // 提交数据
				//地图数据
				showMap:false,
				commentAddress:undefined,
				mapType:'',
        showFormBase:true,    //控制字段显示隐藏
        saveType:false,
        selectData: {
          index:0,
          nav:[
            {
              content: '审批回复',
            },
            {
              content: '流转明细',
            },
//            {
//              content: '操作日志',
//            }
          ]
        },
        curNav:'审批回复',
        showMore:false,  //显示更多
        permission:{},   //权限数据
        vipDialog:false,
        process:false,
        itemMap:{},   //存储初始的itemMap
        isFirstIntervene: true,   //是否第一次干预
        refresh: true, //取消保存刷新重新渲染所有字段
			}
		},
		created() {
			var EventBus = new Vue();
			this.$root.EventBus = EventBus;
			this.$store.commit('reset');
			var _this = this;

			this.initForm();
			this.$store.commit('resetFlowData');
			this.$store.commit('resetDetailData');
			this.buttonConfig.primaryList[0].callBack = function () {
				_this.saveChange('activeSave');
			};
			this.buttonEdit.callback =  function () {
			  _this.formEdit()
      };
			window.onresize = function () {
        _this.setHeight()
      }
		},
		computed: {
			...mapState({
				FlowAudit: state => state.detail.FlowAudit,     // 详情信息
				FlowAuditUser: state => state.userSelected.FlowAuditUser,    // 处理人信息
				approveVo: state => state.detail.approveVo,       // 自由流程获取转审人员
				FlowAuditUserBoxShow: state => state.userSelected.FlowAuditUserBoxShow,
				appointUserIndex:state => state.userSelected.appointUserIndex,
				isChoise: state => state.userSelected.isChoise,
				audtiFlag: state => state.userSelected.audtiFlag,
				detailData: state => state.detail.detailData,
				controlPO: state => state.detail.detailData.controlPO,
        ctrlPermission: state => state.permission.roles         //表单权限信息列表
			}),
			...mapGetters([
				'FlowAuditUserIds'
			]),
			flowSerialData: function () {
				return this.flowSerial;
			},
      schema(){
        return this.$store.state.formBase.schema;
      },
			// 下一步处理人是否显示
			// 是当前处理人且不可选、不是当前处理人、nextAuditList.length>0
			nextAuditListShow() {
				// 人员控件
				if(this.FlowAudit && this.FlowAudit.flowNodeItemKeys){
					return true;
				}
				let flag1 = this.FlowAudit && this.FlowAudit.nextAuditList.length>0
				let flag2 =  this.FlowAudit && !(this.FlowAudit.isChoise!=1 || this.FlowAudit.audtiFlag==2)
					&& this.FlowAudit.vo && this.FlowAudit.vo.handleAccounts.indexOf(_.userId) > -1     // 是当前处理人
				let flag3 =  this.FlowAudit && this.FlowAudit.vo && this.FlowAudit.vo.handleAccounts.indexOf(_.userId)==-1    // 或不是当前处理人
				return flag1 && (flag2 || flag3)
			},
			// 人员控件关联下一步处理人组件显示
			flowNodeItemKeysShow() {
				// 如果下一步处理人由人员控件决定时
				if(this.FlowAuditUser && this.FlowAuditUser[0].startAuditList.flowNodeItemKeys){
					let flag1 = this.FlowAuditUser[0].startAuditList.allUser.length === 0     // 已选列表
					if(flag1){
						return false
					}else{
						return true
					}
				}else if(this.FlowAuditUser[0].startAuditList){
					return true;
				}else{
					return false;
				}
			},
			// 下一步处理人是否能编辑
			isEditShow(){
				// 如果下一步处理人由人员控件决定时
				if(this.FlowAuditUser && this.FlowAuditUser[0].startAuditList.flowNodeItemKeys){
                  let flag1 = this.FlowAudit && this.FlowAudit.vo && this.FlowAudit.vo.handleAccounts.indexOf(_.userId)==-1    // 或不是当前处理人
                  if (flag1){
                    return false;
                  }else {
                    return this.FlowAuditUser[0].startAuditList.isCanEdit;
                  }
				}else{
					return false;
				}
			},
			// 下一步处理人列表显示判断
			isListShow(){
				// 如果下一步处理人由人员控件决定时
				if(this.FlowAuditUser && this.FlowAuditUser[0].startAuditList.flowNodeItemKeys){
					return this.FlowAuditUser[0].startAuditList.userSelected
				}else{
					return this.FlowAudit.nextAuditList
				}
			},
			isCanUpdate(){
				return this.flow.isover === '2' && this.approveVo && this.approveVo.vo && this.approveVo.vo.userId.indexOf(_.userId) > -1 && this.controlPO.isCanUpdate == 0;
			},
			isShowSerial(){
				//审批单非自由流程或外部单显示流转明细入口 或者 是外部单且已经转为内部单时显示流转明细入口
				return (this.isTask == '2') || (this.isTask == '3' && this.detailData.openIsSubmit)
			},
		},
		updated() {
			var content = document.getElementsByClassName('form-detail-content')[0]
			if(content){
				var contentH = content.offsetHeight;
				if(contentH > 129){
					content.style.setProperty('padding-bottom', '0px');
					this.showToggle = true;
				}
			}
			this.setHeight()
    },
		methods: {
			...mapMutations([
        "removeFlowAuditUser",        // 删除处理人
			]),
			...mapActions([
				"getApprove",   // 自由流程获取转审人员
				"getNodeListInfo", //获取节点选择信息
				"updateFlowUserSelected",     // 更新已选处理人
			]),
      saveFormTitle({target}){    //存储临时标题内容并过滤表情字符（失焦过滤）
        let reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
        if(reg.test(target.value)){
          target.value = target.value.replace(reg,'');
          this.formTitle = target.value;
        }
      },
			//并行流程选择节点后进行处理
			selectNodeClick (item,data){
				this.flow.nodeId = item.nodeId
				this.showDetailPage(data)
			},
			// 处理人标题
			startAuditTitle(item) {
				if(this.startAuditList.length>1) {
					return item.vo.nodeName+' 处理人'
				}else {
					return '当前处理人'
				}
			},
			atThisPersonUtil(user){
				// 查看个人头像信息
				if(user){
					EventBus.$emit("atThisPersonUtil",user);
				}
			},
//			showPersonList(title,list,type){
//				this.userselectTitle = title;
//				this.userSelectList = list;
//				this.showPerson = true;
//				if(type){
//					this.limitPreview = true
//				}else{
//					this.limitPreview = false
//				}
//			},
			// 查询人员控件字段
			isItemKeys(keys){
				var str = '';
				if(keys){
					this.$store.state.formBase.schema.forEach((item) => {
						if(keys.indexOf(item._id) >= 0){
							str += item.label + '，';
						}
					})
				}
				return str.substring(0,str.length-1);
			},
			// 选择处理人弹窗
			FlowAuditUserShowBox(index) {
				this.$store.commit('updateUserSelectedData',{type:'appointUserIndex',data:index})
				// 如果是指定范围选人
				if(this.FlowAuditUser[index].startAuditList.assignRange) {
					this.$store.commit('updateUserSelectedData',{type:"FlowAuditUserBoxShow", data: true})
				}else {
					let self = this
					let toPersonList = this.dataBase.selectConfig.selectList.toPersonList
					this.dataBase.selectConfig.signIndex="toPersonList"
					this.dataBase.selectConfig.show=true
					toPersonList.userSelected.length=0
					if(this.FlowAuditUser[index].startAuditList.userSelected.length) {
						toPersonList.userSelected.push(...this.FlowAuditUser[index].startAuditList.userSelected)
					}
					toPersonList.callBack.confirm=function (type, obj) {
						toPersonList.userSelected.length=0
						toPersonList.userSelected.push(...obj.user.data);
						self.$store.commit('resetFlowAuditUser')
						self.$store.commit('updateUserSelected',obj.user.data)
					}
				}
			},
			// 选择处理人后
			FlowAuditUserResult(payload) {
				let self = this
				this.$store.commit('updateUserSelectedData',{type:"FlowAuditUserBoxShow", data: false})
				// 如果是多部门，则请求部门负责人
				this.updateFlowUserSelected(payload)
				let result = payload.result
				this.FlowAuditUser.forEach(function(value){
					if(value.audtiFlag == "2"){
						if (value.isChoise == "1") {
							self.commitData.flowDpId = payload.ids;
						} else {
							self.commitData.flowDpId = result.length ? payload.result[0].deptId:'';
						}
					}
				})
			},

			scrollList(){                                                // 滚动更多列表
				var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
				if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
					if(!this.lock_roll && this.hasMore){
						this.lock_roll=true;
						this.currentPage++;
						this.loadMoreList(status);
					}
				}
			},
			onlySeeComment(type){
				this.currentPage=1;
				this.commentList.length=0;
				this.commentStatus=type? "2":"1";
				if(!this.loading){
					this.loadMoreList();
				}
			},
			dealCommentList(data){
				this.loading=false;
				this.showCommentList(data.comments,data.hasMore);
			},
			showCommentList(data,hasMore){                                    // 处理返回的评论
				this.hasMore=hasMore;
				this.lock_roll=false;
				if(data && data.length>0){
					this.commentList.push(...data);
				}else{
          this.commentList = [];
					this.listTotalRows=0;
				}
			},
			commentListImagesURL(urls){// 处理详情的全部图片src
				this.previewImageUrl=[];
        //		this.previewImageUrl.push(...this.detailPicList);
				this.previewImageUrl.unshift(...this.contentImageUrl);
				this.previewImageUrl.push(...urls);
			},
			loadMoreList(type){                                               // 加载更多列表
        type && this.currentPage ++;
				var data={
					id:this.id,
					size: 10,
					status: this.commentStatus
				};
				this.loading = true;
				data.page = this.currentPage;
				commentListMore(data,this.dealCommentList);
			},

			deleteThisComment(data,index){                                 // 删除评论
				if(data){
					this.deleteListIndex=index;
					var self=this;
					deleteCommentList({commentId:data.commentId},function (result) {  // 删除成功
						self.commentList.splice(self.deleteListIndex,1);
						self.listTotalRows--;
					});
				}
			},
			getFlowAuditDetail: function (result) { //当前节点的详细信息
				var detail = result.data.detail;
				var dataParam = {
					refId: this.id,
					definitionId: detail.definitionId,
					isBranch: this.flow.isBranchFlow,
					nodeId: this.flow.nodeId,
					status: this.flow.isover
				};
				//固定流程和分支流程审批状态的数据显示
				let statusString = audit_flow_api.statusFormCheck(this.flow.creatorId, this.flow.status, this.flow.isover,this.flow.isClose);
				if(statusString){
					let status = _.append_status(statusString,true);
					this.applystatus = status;
					this.applystatus.show = true;
				}
				var _this = this;
				var _result = result;
				//固定流程和分支流程查询下一节的审批人和节点的信息
          this.showFormBase = false;
          audit_flow_api.getFlowAuditDetail(dataParam, (result) => {
            _this.showFormBase = true;
					let data=result.data[0];
					this.startAuditList = [...result.data]
//					let fieldContralList = data.fieldContralList;
//					_this.fieldContralList(fieldContralList);
					if(setEditAgain(_this.$store)){
						_this.showSave = true;
					}
					//判断下一节点是否是人员控件选择的处理人
					var flowNodeItemKeys = data.flowNodeItemKeys
					if(flowNodeItemKeys){
						_this.$store.commit('updateFlowNodeItemKeys', flowNodeItemKeys);
						setTimeout(() => {
							var person = _this.$store.state.detail.FlowAudit.nextAuditList;
							var users = [];
							person.forEach(item =>{
								users.push({
									userId:item.userId,
									personName:item.personName,
									headPic:item.headPic,
								})
							});
								_this.$store.commit('updateItemKeysSelected',users);
						}, 0);
					}
          //如果已退审、已关闭或者审批完则nodeInfo传空
          if(!(_result.data.detail.isover == 0 || _result.data.detail.isClose == 1)){
            this.$store.commit('updateFlowAuditUser',result.nodeInfo)
          }else {
            this.$store.commit('updateFlowAuditUser','')
          }
					if(result.data.length===1){
						this.$store.commit('updateFlowAudit',data)
						this.$store.commit("updateAppointNodeVOList", data.appointNodeAndUserVOList)
						this.$store.commit('updateFlowChioseNodeAuditUser')
					}
					this.doOperation();
				})
			},
//			fieldContralList(data){
//				var map = {};
//				var editMap = {};
//				data.forEach((item)=>{
//					map[item.fieldId] = item.isRead?true:false;
//					editMap[item.fieldId] = item.isUpdate?true:false;
//					if(item.isUpdate && !this.isUpdateTitle){
//            this.isUpdateTitle = true
//          }
//				});
//        setFieldShowRead(this.$store,map);
//				setFieldEdit(this.$store,editMap);
//			},
      doOperation() {
        //直接执行干预动作 1 干预流程  2 结束流程
        var operateType = this.$route.query.type;
        location.hash = location.hash.replace(`&type=${operateType}`,"")
        this.operateFun(Number(operateType));
      },
			initForm() {
				var _this = this;
				var id = this.id = this.$route.query.id;
				_.showLoading()
				detailGetFroms(id).then(function (result) {
					_.hideLoading()
					if (result.code == "0") {
            //兼容旧的字表的数据
            compatible(result.data.fields);
						_this.instanceTitleTemplate=result.data.instanceTitleTemplate;
						_this.showToPersons=true
						_this.startAuditList=null;
						_this.$store.commit('resetFlowData')
						_this.$store.commit('resetDetailData')
						//判断是否是并行，是就查询并行接口获取节点列表
						if (result.data.detail && result.data.detail.currentNodeId.indexOf(',')!=-1){
              var _detailData = {
                detail: result.data.detail
              }
              _this.$store.commit('updateListName', _detailData);
            }
             _this.flow.nodeId = result.data.detail?  result.data.detail.currentNodeId : '';
             var url = result.data.distpicker_data;
             _.showLoading();
             loadScript(url).then(res => {
               _.hideLoading()
               _this.showDetailPage(result)
             });
            checkFormAuthority({id:_this.id}).then(res =>{
              if(res.code !=  '0'){
                let btnConfig={
                  primaryBtn:{name:"i18n.confirm", callBack:function () {
                    _this.removeFrame();
                  }},
                  defaultBtn:{name:"", callBack:null}, //主操作按钮
                  }
                  return _.alert('提示',result.desc,btnConfig)
                }
              _this.permission = res.data;
              if (result.data.controlPO.isFreeFlow == "1"){
                _this.doOperation()
              }
            })
					} else {
            let btnConfig={
              primaryBtn:{name:"i18n.confirm", callBack:function () {
                _this.removeFrame();
              }},
              defaultBtn:{name:"", callBack:null}, //主操作按钮
              close:{name:"", callBack:function () {
                _this.removeFrame();
              }},
            }
            return _.alert('提示',result.desc,btnConfig)
					}
				});

			},
			showDetailPage(result){
				//表单的初始化
				let _this=this
				var id = this.id;
				this.definition_id = result.data.id;
				var data = result.data.fields;
				var itemMap = Object.assign(result.data.default,result.data.itemMap);
				this.itemMap = itemMap ;
				var store = _this.$store;
				var controlPO = result.data.controlPO;
				this.isTask = controlPO.isTask;
				this.showAt = result.data.controlPO.isCanAt == "1" ? true : false;
//				_this.detailPicList.push(...result.data.mediaList)
				_this.mediaList = result.data.mediaList;
				if(result.data.picList && result.data.picList.length>0){
					var list = [];
					result.data.picList.forEach((item,index)=>{
						list.push({src:item.picPath});
					})
					_this.imgUploadPicList = list;
				}
				_this.lastTime=result.data.lastTime;
				//表单状态的数据
				_this.flow.status = result.data.detail.status;
				_this.flow.creatorId=result.data.detail.creator;
				_this.flow.isover=result.data.detail.isover;
				_this.flow.isClose = result.data.detail.isClose;
				_this.flow.isBranchFlow = controlPO.isFreeFlow == 3 ? true : false;
				_this.flowSerial.isFreeFlow = controlPO.isFreeFlow;
				if(!(_this.isTask == '2') && !(_this.isTask == '3' && result.data.detail.creator)) {//   不是 审批单非自由流程
          _this.selectData.nav.splice(1,1)
          _this.selectData.nav[0].content = '表单评论'
        }
        _this.flowSerial.isFirstRequest = true;
        _this.flowSerial.list = [];
				_this.flow.status=result.data.detail.status;
				store.commit('setFormDetail', controlPO);
				var detailData = {
					detail: result.data.detail,
					detailsPO: result.data.detailsPO,
					controlPO: result.data.controlPO,
					createLeave: result.data.createLeave,
					isRecipient: result.data.isRecipient,
					approve: result.data.approve,
					openIsSubmit: result.data.openIsSubmit,
          orderVersion: result.data.orderVersion,//工单版本号
				};
				store.commit('updateDetailData', detailData);
				//表单是审批单或者是外部单的时候执行
				// isTask：2审批单 / 3外部单
				if(controlPO.isTask == '2' || controlPO.isTask == '3'){
					//固定流程和分支流程的代码执行
					if (controlPO.isFreeFlow!= "1") {      // 非自由流程
						_this.getFlowAuditDetail(result);
						if (result.data.openIsSubmit == false) {
							_this.showSave = true;
							this.buttonConfig.primaryList[0].name = "转内部流程处理";
							this.buttonConfig.primaryList[0].callBack = function(){
								_this.$router.push({name: 'add', query: {id: _this.$route.query.id,type:'edit'}})
							}
						}
					}else {
						//自由流程的处理
						_this.getApprove(id);   // 自由流程获取转审人员
						let statusString = audit_flow_api.statusFormCheck(_this.flow.creatorId, _this.flow.status, _this.flow.isover,_this.flow.isClose);
						if(statusString){
							let status = _.append_status(statusString,true);
							this.applystatus = status;
							this.applystatus.show = true;
						}
					}
				}else if(controlPO.isTask == "1"){
					//修改状态数据
					if (_this.flow.isover == '-1') {//任务已经结束
						_this.applystatus.show = true;
						_this.applystatus.class = 'status_gray';
						_this.applystatus.name = '已关闭';
					}
				}
        //打印的代码
        _this.currentFormId=result.data.detailsPO.definitionVersionsId;
        _this.isHasPrintTemplate = result.data.controlPO.isHasPrintTemplate;

        //评论列表处理
        this.hasMore = result.data.hasMore;
        this.listTotalRows=Number(result.data.commentCount);
        this.showCommentList(result.data.comments, result.data.hasMore);
        _this.detail_content = _this.formatContent(result.data.detailsPO.content);  //对content数=数据中的url转换

        _this.orbitItemKeyList = result.data.orbitItemKeyList ||[];
        render_field(store, data, itemMap,_this.orbitItemKeyList);
        setReadonly(store);
        setFieldShowHide(store);
        setFieldRead(store);
        //表单标题模板代码
        var instanceTitleTemplate = result.data.instanceTitleTemplate;
        _this.instanceTitleTemplate = instanceTitleTemplate;
        var typeMap = _this.$store.state.formBase.typeMap;
        var choiceMap = _this.$store.state.formBase.choiceMap;
        var fieldArry = [];
        var templateObj = {};
        var defaultData = result.data.itemMap;
        if(instanceTitleTemplate){
          var arry = instanceTitleTemplate.match(/{[^}]+}/g);
          if(arry&&arry.length>0){
            arry.forEach(function(item){
              var key = item.substring(1,item.length-1);
              fieldArry.push(key);
              var defaultvalue = defaultData[key]||'';
              templateObj[item] = defaultvalue;
              if(typeMap[key] == 'DropDown'){
                templateObj[item] = choiceMap[defaultvalue]||'';
              }
            });
          }
        }
        store.commit('setTemplateObj',templateObj);
        store.commit('setFieldArry',fieldArry);
				//单的属性
				var detail = _this.detail = result.data.detail;
				var ct = detail.createaTime;
				if (ct.substring(0, 10) == new Date().Format("yyyy-MM-dd")) {
					//当天发布的任务只显示时分
					_this.createTime = ct.substring(11, 16);
				} else {
					_this.createTime = ct;
				}
				_this.personName = detail.personName;
				var creator = detail.creator;
				if (creator == dataBase.config.userId) {
					_this.isCreator = true;
					_this.creatorColor = false;
				}
				_this.createLeave = result.data.createLeave;//提单人离职
				_this.formTitle = result.data.instanceTitle;
				var isover = result.data.detail.isover;//表单状态
				var isClose = result.data.detail.isClose;//1结束状态
				if (controlPO.stopTime != null && controlPO.stopTime != "") {
					this.stopTime = controlPO.stopTime;
				}
				//看单权限：1.提单人查看单2.负责人查看单3.相关人查看单
				//result.data.isRecipient false为相关人查看单
				var isRecipient = result.data.isRecipient;
				var openIsSubmit = result.data.openIsSubmit;
				var isCanUpdate = controlPO.isCanUpdate;//0允许重新编辑，1为不能重新编辑（普通单和任务单）
				if (controlPO.isTask == "3") {//外部单

				}
				//相关人和负责人
				//显示负责人
				var toPersons = result.data.inchargesList || [];
				//加载相关人
				var ccPersons = result.data.receiveList || [];
				_this.userSelect.toPersonList.userSelected.length=0;
				_this.userSelect.ccPersonList.userSelected.length=0;
				if (toPersons.length > 0) {
					_this.userSelect.toPersonList.num = toPersons.length;
					_this.userSelect.toPersonList.userSelected = [...toPersons];
					if(controlPO.isTask == '2' || controlPO.isTask == '3'){
						_this.userSelect.toPersonList.title = '审批人';
						//审批中并且非自由流程不显示所有审批人
						if (isover == "2" && controlPO.isFreeFlow != "1") {
							_this.showToPersons = false;
						}
					}
				}
				if (ccPersons.length > 0) {
					_this.userSelect.ccPersonList.num = ccPersons.length;
					_this.userSelect.ccPersonList.userSelected = [...ccPersons];
				}
				_this.$nextTick(()=>{
					_this.imgsClickFunc();
				})
			},
			getFlowSerial: function () { //获取流程流转明细
				let dataParam = {
					refId: this.id,
          isFree: this.flowSerial.isFreeFlow
				}
				audit_flow_api.getParallelFlowSerial(dataParam, this.flowSerial, (result) => {
					this.flowSerial = result
				})
			},
			validations(itemMap) {
				let schema = this.$store.state.formBase.schema;
				return form_validation(schema,itemMap);
			},
			getFormData(itemMap) {
				return this.validations(itemMap);
			},
			printDetail() {
				if(isVipSilver(interfaceCode.INTERFACE_CODE_FORM)){
					if (!isVipGold(interfaceCode.INTERFACE_CODE_FORM)) {
			     	this.isShowFoot = "none";
			       	var self=this;
			    	setTimeout(function () {
			    		self.myprint();
			    	},10)
					}else{
						var foreignid = this.id;
						var currentFormId = this.currentFormId;
						var isHasPrintTemplate = this.isHasPrintTemplate;
						var url = _.baseURL + '/jsp/wap/form/customPrint_preview.jsp?id='+foreignid+'&printType=1&definitionVersionsId='+ currentFormId +'&hasPrintTemplate='+isHasPrintTemplate;
						window.open(url)
					}
				}else{
					_.alert("提示","打印功能仅限VIP用户使用","确定",function(){
						restoreSubmit();
					});
				 }
//				打印生成图片页面
			},
			myprint() {
				let print = document.querySelector(".wrap");
				html2canvas(print).then(canvas => {
					_.showLoading("打印中");
					this.convertCanvasToImage(canvas);
				});
				 let c_img = true;
				//将表单中的图片能够进行跨域处理
				 if(c_img){
					 let img = document.querySelectorAll(".wrap img");
					 for(var i = 0;i<img.length;i++){
						 let src = img[i].getAttribute("src");
						 if(src.indexOf(_.baseURL+"/jsp/wap/images/emoji")==-1){
							 src = encodeURIComponent(src);
							 let newsrc = _.baseURL+"/portal/errcode/errcodeAction!loadImage.action&imgUrl=" + src;
							 img[i].setAttribute('src',newsrc);
						 }
					 }
					 c_img = false;
				 }
				//画布转化成图片
			},
			convertCanvasToImage(canvas) {
		        var image = new Image();
	        	image.src = canvas.toDataURL("image/png");
		         if(image.src){
		        	localStorage.setItem("imageSrc",image.src);
		         	window.location.href=_.baseURL+"/jsp/wap/include/printDetail.jsp";
				 }
	         },
			showPersonDetail:function (){
				//判断提单人是否离职
				if(this.$store.state.detail.detailData.createLeave==true){
					_.alert('提示','此提单人已离职');
					return;
				}
				//判断是否是匿名提交
				if(this.$store.state.detail.detailData.controlPO.isAnonymous == 1)return;
				var data = {
					userId: this.detail.creator,
					personName:this.detail.personName,
					headPic:this.detail.headPic,
				};
				if(data.userId!=_.userId){
					this.atThisPersonUtil(data);
				}
			},
//			goCopyForm() {
//				this.$router.push({name: 'add', query: {id: this.$route.query.id,type:'copy'}})
//			},
//			goEditForm() {
//				var schema = this.$store.state.formBase.schema;
//				schema.map(item => {
//						item.disabled = false;
//				});
//				this.showSave = true;
//			},
			toggleMsgfn() {
				this.showAllMsg = !this.showAllMsg;
				this.toggleMsg = this.showAllMsg ? '收起': '展开显示全部' ;
			},
			//获取修改轨迹的数据
			paramHistoryData(id,title){
				if(this.orbitList ==false) {
					var _this = this;
					var query = {
						id:this.$route.query.id,
						fieldItemKeys:this.orbitItemKeyList.join(',')+',',
					}
					_.showLoading();
					getHistory(query).then((res)=>{
						_.hideLoading();
						if(res.code != '0'){
							return _.alert("提示",res.desc);
						}
						_this.orbitList = res.data.orbitList;
						_this.setHistory(id,title)
					})
				}else{
					this.setHistory(id,title)
				}
			},
			//隐藏轨迹
			hideHistory(){
				this.showHistoryBox = false;
			},
			setHistory(id,title){
				this.showHistoryBox = true;
				this.history.eachOrbitList = [];
				this.orbitList.forEach(item =>{
					if(id == item.itemKey){
						this.history.title = title;
						this.history.eachOrbitList.push(item);
					}
				})
			},
			//修改富文本中的网址和图片地址
			formatContent(str){
        str = _.checkURL(str,false)
        return str.replace(/@fileweb@\/compress/g,_.compressURL);
			},
			imgsClickFunc(){
				if(!this.$refs.content) return;
				var imgs = this.$refs.content.getElementsByTagName('img');
				this.contentImageUrl = [];
				for(let i=0;i<imgs.length; i++){
					imgs[i].classList.add("previewImages")
          this.contentImageUrl.push({picPath:imgs[i].src.replace(/compress\//,'',)});
				}
				this.commentListImagesURL(this.previewImageUrl);
				for(let i=0;i<imgs.length; i++){
					imgs[i].addEventListener('click',(event)=>{
						EventBus.$emit("previewImages",event.target.currentSrc.replace(/compress\//,''));
					})
				}
			},
			//保存审批人修改
			saveChange(saveType){
//				if(!this.showSave ) return ;
				this.saveType = !saveType;
				var _this = this;
				if (!this.getFormData(this.itemMap)) return ;
				var itemMap = JSON.parse( filterData(this.$store) ) ;
        for(var key in itemMap){
          if(!itemMap[key]&&!this.itemMap[key]&&this.itemMap[key]!=undefined){
            Reflect.deleteProperty(itemMap,key)
          }
        }
				var queryData ={
					id: this.id,
					definition_id: this.definition_id,
					formEditType:saveType?'':1,
					formTitle: this.formTitle,
					instanceTitleTemplate:this.instanceTitleTemplate,
					instanceTitle: this.formTitle,
					itemMap: JSON.stringify(itemMap),
          orderVersion: this.detailData.orderVersion,
				};
          saveType && _.showLoading('保存中...');
          updateFormByToUser(queryData).then(res => {
            _.hideLoading();
            if(res.code == '0'){
              if (saveType) {
                _.tooltips_succeed('保存成功');
                _this.showSave = false;
                _this.updateTitle = false;
                this.switchBtn('edit');
                setReadonly(_this.$store);
                var type = this.commentStatus == "2";
                _this.onlySeeComment(type)
              }
              _this.detailData.orderVersion = res.data.orderVersion;
            }else{
              return _.alert('提示', res.desc);
            }
          })
			},
			dealListIcon(status){
				let icon = {
					'2': "qwui-meeting_icon icon_icon7"
				}
				return icon[status]? icon[status] : ''
			},
			dealListContent(status){
				return status!="2" ? true:false;
			},
			dealListDelete() {
			  //后台评论都不能删除
			  return false;
			},
      //打开地图
			openMap(data){
				this.commentAddress = data;
				this.mapType = 'showPosition';
				this.showMap = true;
			},
      removeFrame(){
        window.top.document.documentElement.style.overflow = 'scroll'
        window.top.$("#popframe").remove();
      },
      showMsgFromSelectCard(data){
        if (data.content == '流转明细'){
          this.getFlowSerial();
        }
        this.curNav = data.content == '表单评论' ? '审批回复' : data.content;
      },
      switchBtn(type){
        var _this = this;
        if (type == 'edit') {
          this.buttonEdit.value = '编辑';
          this.buttonEdit.callback = function () {
            _this.formEdit()
          };
        } else {
          this.buttonEdit.value = '保存';
          this.buttonEdit.callback = function () {
            _this.saveChange('activeSave');
          };
        }
      },
      //取消编辑
      cancelEdit() {
        var cache = JSON.parse(sessionStorage.getItem('formDataCache')) || {},
          formData = this.$store.state.formBase.data;
        Object.keys(formData).forEach(key => {
          let val = {
            key,
            value: cache[key]
          };
          this.$store.commit('setValue', val);
        });
        this.updateTitle = false;
        this.formTitle = this.formTitleCache;
        setReadonly(this.$store);
        this.switchBtn('edit');
        this.refresh = false;
        this.$nextTick(() => {
          this.refresh = true;
        })
      },
      formEdit(){
        var _this = this;
        if( !this.checkPermission("编辑明细") ) return;
        sessionStorage.setItem('formDataCache', JSON.stringify(this.$store.state.formBase.data));
        this.updateTitle = true;
        this.formTitleCache = this.formTitle;
        this.switchBtn('save')
        setEditAll(this.$store, false);
      },
      //判断是vip和权限
      checkPermission (type) {
        this.vipURL =  _.baseURL + '/qiweipublicity/companysrv/vip/vip_gold_index.jsp';
        if(!this.permission.isVip) {
          type == '编辑明细' ? _.alert('提示', '该功能仅限尊享版使用，<a style="color:#f87b00" href='+this.vipURL+' target="_blank">马上升级</a>') : this.vipDialog = true;
          return false;
        }else if (!this.permission.bindWxUser) {
          _.alert('提示', '当前账户未绑定通讯录，绑定后才有权限执行此操作。');
          return false;
        } else if (!this.permission.authority) {
          _.alert('提示', `您不是该表单创建人，无法${ type }。`)
          return false;
        } else if (!this.ctrlPermission.formMgrUpdate) {
          _.alert('提示', `没有表单流程编辑明细权限，无法${ type }，请联系企业管理员开启。`)
        } else {
          return true;
        }
      },
      setHeight(){
        var height = window.innerHeight || document.documentElement.clientHeight;
        var wrap_title = document.getElementsByClassName('title-wrap')[0];
        var wrap_flex = document.getElementsByClassName('wrap-flex')[0];
        var wrap = document.getElementById('wrap');
        var wrapRight = document.getElementsByClassName('wrap-right-content')[0];
        wrap_title.style.height = height + 'px'
        wrap_flex.style.height = height - 70 + 'px'
        wrap.style.height = height - 70 + 'px'
        wrapRight.style.height = height - 114 + 'px'
      },
      //更多操作
      operateFun(type) {
        var _this = this;
        this.showMore = false;
        switch (type) {
          case 1:
            if(!this.checkPermission("流程干预")) return;
            if(this.flow.isover == '1' || this.flow.isover == '-1') {    //流程结束
              return _.alert('提示', '该流程已结束，无法进行干预');
            } else if( !this.flow.nodeId && this.flowSerial.isFreeFlow != "1" ) {
              return _.alert('提示', '当前节点是填单节点，无法进行干预');
            }
            this.process = true;
            break;
          case 2:
            if(!this.checkPermission("结束流程")) return;
            if(this.flow.isover == '1' || this.flow.isover == '-1') {
              return _.alert('提示', '该流程已结束');
            } else if( !this.flow.nodeId && this.flowSerial.isFreeFlow != "1") {
              return _.alert('提示', '当前节点是填单节点，无法进行干预');
            }
            _.alert("提示",'结束流程后明细将停止流转，确定结束此流程？',{
              primaryBtn:{name:"i18n.confirm", callBack:function(){
                _this.finishFlow();
              }},
              defaultBtn:{name:"取消", callBack:null},
            })
            break;
          case 3:
            this.doDetail(this.id, this.isTask, this.detail.creator)
            break;
          case 4:
            _.alert('提示','确定删除此明细？',{
              primaryBtn:{ name:"i18n.confirm", callBack:function(){
                _.showLoading()
                deleteForm({
                  definitionVersionsId: _this.definition_id,
                  ids: _this.id
                }).then(res => {
                  _.hideLoading();
                  _this.removeFrame();
                })
              }},
              defaultBtn:{name:"取消", callBack:null},
            });
            break;
        }
      },
      //结束流程
      finishFlow() {
        var isFree = this.flowSerial.isFreeFlow == "1";
        var extraJson = {};
        extraJson = {orderVersion:this.detailData.orderVersion};
        var formData = {
          currentNodeId: isFree ? 'isFree' : this.flow.nodeId,
          refId: this.id,
          isFree: this.flowSerial.isFreeFlow,
          isMiddleNode: isFree ? false : this.FlowAuditUser[0].vo.nodeStatus == 4,
          agentCode: this.agent,
          versionId: this.currentFormId,
          extraJson:JSON.stringify(extraJson),
        }
        _.showLoading();
        finishFlow(formData).then(res => {
          _.hideLoading();
          if(res.code != '0'){
            return _.alert('提示', res.desc)
          }
          this.flow.isover = '1';
          this.detailData.orderVersion = res.data.extraJson.orderVersion;
          this.isFirstIntervene = false;
          this.flowSerial.isFirstRequest = true;
          this.getFlowSerial();
          var type = this.commentStatus == "2";
          this.onlySeeComment(type);
          _.tooltips_succeed('流程结束', true);
        })
      },
      closeProcess(msg) {
        this.process = false;
        if(msg == 'success') {
          this.isFirstIntervene = false;
          this.flowSerial.isFirstRequest = true;
          this.getFlowSerial();
          var type = this.commentStatus == "2";
          this.onlySeeComment(type)
          _.tooltips_succeed('干预成功');
        }else if (msg == 'finishFlow'){
          this.finishFlow();
        }
      },
      doDetail(id,isTask,formCreator){
        var ua = navigator.userAgent;
        ua = ua.toLocaleLowerCase();
        if(ua.indexOf('trident') > -1){
          _alert("提示","当前浏览器无法完美预览表单在手机上的展现，请使用谷歌Chrome浏览器，来获得最佳的效果！");
        }
        else{
          var top=(window.screen.height-610)/2;
          var left=(window.screen.width-380)/2;
          var page = '';
          if(isTask=="3"&&formCreator==''){
            page = 'open_detail_preview'
          }else{
            page = 'detail_preview'
          }
          window.open(_.baseURL + '/manager/form/'+ page +'.jsp?id='+id,'表单详情','left='+left+',top='+top+',height=580,width=380,toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no');
        }
      }
    }

	}

</script>
<style scoped>
  .title-wrap{
    position: relative;
    overflow: scroll;
  }
  .wrap-head {
    height: 70px;
    width: 1150px;
    margin: 0 auto;
    line-height: 70px;
  }
  .wrap-flex{
    display: flex;
    min-width: 1200px;
    justify-content: center;
  }
  .wrap {
    position: relative;
    overflow: hidden;
    min-width: 266px;
    width:680px;
    background:#fff;
    box-shadow:1px 0px 0px 0px rgba(240,240,240,1),-1px 0px 0px 0px rgba(240,240,240,1);
    margin-right:17px;
    overflow-y: scroll;
  }
  .wrap-right{
    width:454px;
    background:rgba(255,255,255,1);
    box-shadow:1px 0px 0px 0px rgba(240,240,240,1),-1px 0px 0px 0px rgba(240,240,240,1);
    margin-left: 0;
  }
  .wrap-right-title{
    width:454px;
    height:44px;
    background:#fff;
    box-shadow:0px 1px 0px 0px rgba(240,240,240,1);
    position: absolute;
  }
  .wrap-right-content{
    margin-top: 44px;
    overflow-y: scroll;
    overflow-x: hidden;
    height: 94%;
  }
  .content-wrap{
    width: 999px;
    margin: 0 auto;
    overflow: scroll;
    box-shadow: 1px 0px 0px 0px rgba(240, 240, 240, 1), -1px 0px 0px 0px rgba(240, 240, 240, 1);
  }
	.uploadFile{
		padding:5px 15px;
		background-color: #fff;
	}
	.circulationDetails{
		min-height: 50px;
		background-color: #fff;
		margin: 10px 0;
	}
  .form-title-span{
    cursor: pointer;
    margin-right: 10px;
  }

  .title-color{
    min-width: 1200px;
    background-color: #F7F7F7;
  }
  .form-title-btn{
    width: 72px;
    height: 32px;
    margin: 0 8px;
    background: #C31725;
    color: #fff;
    text-align: center;
    line-height: 32px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
  }
  .form-title-btn:hover {
    background-color: #F08088;
  }
  .form-title-cancel {
    color: #666;
    border:1px solid #CBCBCB;
    background: #FBFBFB;
  }
  .form-title-cancel:hover {
    background-color: #f5f5f5;
  }
  .form-title-btn_more:after {
    font-family: "iconfont" !important;
    content: " \E685";
    display: inline-block;
    margin-left: 4px;
    color: #c2c2c2;
    font-weight: bold;
    transform: rotate(-90deg);
    background: transparent;
  }
  @media screen and (min-width: 1440px) {
    .wrap, .form-title-read {
      width: 856px !important;
      margin-right: 33px;
    }

    .title-wrap {
      /*width: 1440px;*/
    }

    .dp-mask, .dp-container {
      width: 740px;
      left: auto;
    }

    .wrap-head {
      height: 70px;
      width: 1340px;
      line-height: 70px;
    }

    .form-title-close {
      margin: 27px 24px 27px 32px;
    }
  }
</style>

<template>
	<div>
		<flow_action_btn_group
      :moreButton="moreButtonConfig"
      @moreButtonClick="showMoreApproveBtn"
    >
				<div v-if="chatInputShow" class="comment_btn_add" @click="showChatClick">
          <input class="comment-chat_input" readonly="readonly" type="text" :value="value" placeholder="评论一句吧">
        </div>
        <!--保存-->
        <flow_action_btn icon="icon_a-review_save" v-if="showSave"  text="暂存"  @actionButtonClick="saveChange('activeSave')" class="btn_add"></flow_action_btn>
				<flow_action_btn v-if="agreeBtn || agreeEndBtn" text="同意" icon="icon_a-review_ok" @actionButtonClick="showAgreeApproveBtn" customClass="btn_approve"></flow_action_btn>
				<!--审批-->
				<flow_action_btn v-if="approveBtn"
								 :text="returnApproveText[1]"
								 icon="icon_a-review_ok"
								 @actionButtonClick="approve"
                 customClass="btn_approve"></flow_action_btn>
				<!--退审按钮-->
				<flow_action_btn v-if="returnApproveBtn"
								 :text="returnApproveText[0]"
								 icon="icon_a-review_no"
								 @actionButtonClick="returnApprove"
                 customClass="btn_end">
				</flow_action_btn>
				<flow_action_btn v-if="agreeEndBtn" text="转审" icon="icon_a-review_review" @actionButtonClick="agreeReApprove"></flow_action_btn>
				<!--表单的普通单和任务单按钮 审批单的退审到-->
				<flow_action_btn icon="icon_a-review_end" v-if="showEndBtn" text="结束"  @actionButtonClick="endFormTask" customClass="btn_end"></flow_action_btn>
				<flow_action_btn icon="icon_a-review_edit" v-if="showEditBtn" text="编辑" @actionButtonClick="editApprove" class="btn_add"></flow_action_btn>
				<flow_action_btn icon="icon_a-review_add" v-if="assignBtn"  text="加签"  @actionButtonClick="assignApprove" class="btn_add"></flow_action_btn>
		</flow_action_btn_group>
    <div v-if="nextNodeListShow">
      <div class="approveDialogPop" v-show="!isShowNodeBox">
        <div class="approveDialog">
          <div class="selectBoxContent">
            <p class="chooseNodeListUI-top-title">{{approveTitle}}</p>
            <p class="chooseNodeListUI-title" v-show="chooseNextNodeShow">选择下一步处理节点</p>
            <div class="selectNodeBox" @click="showNodeBox" v-show="chooseNextNodeShow">
              {{choosedNodeName}}
              <i class="qwui-click_icon_right"></i>
            </div>
            <p class="chooseNodeListUI-title" v-show="nextNodeList.length&&ApproveStatusBtn=='returnApprove'">选择退回的节点 <span class="tip">*</span></p>
            <div class="selectReturnNodeBox" v-show="nextNodeList.length&&ApproveStatusBtn=='returnApprove'">
              <select v-model="returnNextNodeId">
                <!--<option class="qwui-click_icon_right" v-if="nextNodeList.length>1">请选择</option>-->
                <option class="qwui-click_icon_right"
                        :value="item.nodeId"
                        v-for="(item,index) in nextNodeList">
                  {{item.nodeName}}
                </option>
                <option class="qwui-click_icon_right" value="">提单人</option>
              </select>
            </div>
            <!--加签-->
            <div class="selectAssignBox" v-if="assignSelctBoxShow">
              <label class="item" v-if="isSign">
                <input value="1" type="radio" class="icon_check" v-model="assignType">
                加会签 <span class="tip">(在当前节点中添加处理人)</span>
              </label>
              <label class="item" v-if="isFrontSign">
                <input value="2" type="radio" class="icon_check" v-model="assignType">
                加前签 <span class="tip">(在当前节点之前添加处理人)</span>
              </label>
              <label class="item" v-if="isBackSign">
                <input value="3" type="radio" class="icon_check" v-model="assignType">
                加后签 <span class="tip">(在当前节点之后添加处理人)</span>
              </label>
            </div>
            <!--选择处理人-->
            <div v-if="flowAuditUserShow">
              <user_selected_group
                customClass="chooseNodeListUI"
                v-if="(item && item.startAuditList.show) || assignSelctBoxShow"
                v-for="(item,index) in FlowAuditUser"
                :key="index"
                :title="startAuditTitle(item.nodeName)"
                :personNumber="item.startAuditList.userSelected && item.startAuditList.userSelected.length"
                :mustChoose="true">
                <user_selected_item
                  v-if="flowNodeItemKeysShow(index)"
                  slot="user_selected_item"
                  @showUserSelectedBox="FlowAuditUserShowBox(index)"
                  :title="startAuditTitle(item.nodeName)"
                  @showPersonList="showPersonList"
                  :isEdit="item.startAuditList.isCanEdit"
                  :List="item.startAuditList.userSelected"
                  @removeSelected="(payload)=>removeFlowAuditUser({delUserIndex:payload.index,index})"
                  :isRemove="FlowAuditUser
                        && FlowAuditUser[index]
                        && FlowAuditUser[index].startAuditList.isCanEdit
                        && FlowAuditUser[index].startAuditList.isCanDelete">
                </user_selected_item>
                <div class="qwui-user_cell_title" slot="qwui-user_select_person_open"
                     v-show="item.startAuditList.flowNodeItemKeys&&item.startAuditList.allUser.length===0">
                  <p class="qwui-user_flowNodeItemKeys">已关联[{{isItemKeys(item.startAuditList.flowNodeItemKeys)}}]字段，请先填写</p>
                </div>
              </user_selected_group>
            </div>
            <!--选择其它处理人-->
            <div v-if="otherAuditUserShow">
              <user_selected_group
                :title="'['+item.nodeName+'] 处理人'"
                :personNumber="flowChioseNodeAuditUser[index] && flowChioseNodeAuditUser[index].length"
                v-for="(item,index) in appointNodeAndUserVOList"
                :key="item.index"
                class="chooseNodeListUI" :mustChoose="true">
                <user_selected_item
                  slot="user_selected_item"
                  :title="'['+item.nodeName+'] 处理人'"
                  @showPersonList="showPersonList"
                  :List="flowChioseNodeAuditUser[index]"
                  @showUserSelectedBox="otherAuditUserShowBox(index)"
                  @removeSelected="(payload)=>{removeChioseNodeUser({parentIndex:index,index:payload.index})}">
                </user_selected_item>
              </user_selected_group>
            </div>
            <div class="qwui-dialog_textarea">
              <textarea cols="30" rows="2" :placeholder="approveTip" maxlength="200" v-model="approveText"></textarea>
              <p class="qwui-dialog_textarea_counter" @input="changeApproveTip">
                <span :class="{'active':approveText.length===200}">{{approveText.length}}</span>/200
              </p>
            </div>
            <p class="qwui-dialog_textarea_tips" v-show="approveErrorTip">{{approveErrorTip}}</p>
            <!--签名-->
            <assign_btn v-if="writeAssignBtnShow" @showAssignBox="showAssignBox" :isWriteSign="isWriteSign"></assign_btn>
            <div v-if="usePresetSignShow" class="usePresetSign_div">
              <label>
                <input type="checkbox" class="qwui-icon_checkbox" id="isUsePresetSign" :checked="isUsePresetSign" @click="checkUsePresetSign">
                使用后台存档的手写签名图
              </label>
              <p class="">开启指纹审批更安全</p>
            </div>
          </div>
          <button_group>
            <qwui_button type="default" text="取消" @buttonClick="cancelDialog"></qwui_button>
            <!--其他操作确定-->
            <qwui_button v-if="!assignConfirmBtn" type="primary" text="确定" @buttonClick="confirmDialog"></qwui_button>
            <!--加签确定-->
            <qwui_button v-if="assignConfirmBtn" type="primary" text="确定" @buttonClick="assignConfirm"></qwui_button>
          </button_group>
        </div>
      </div>
      <!--签名-->
      <qw_assign_box
        v-show="assignBoxShow"
        @cancelCanvas="assignBoxShow=false"
        :imgUrl="signImg"
        :isFree="controlPO.isFreeFlow"
        @saveCanvasToURL="saveCanvasToURL"
      ></qw_assign_box>
    </div>
    <!--下拉选择-->
    <chooseNextNode v-show="isShowNodeBox"></chooseNextNode>

		<!--更多审批按钮-->
		<dialog_mask_bottom :dialogConfig="dialogBottomConfig">
			<dialog_mask_bottom_item slot="item" v-if="agreeBtn || agreeEndBtn || approveBtn || returnApproveBtn || showEditBtn || showEndBtn || assignBtn" name="评论" @dialogBtnClick="showChatClick"></dialog_mask_bottom_item>
			<dialog_mask_bottom_item slot="item" v-if="endBtn" name="结束流程" @dialogBtnClick="endApprove"></dialog_mask_bottom_item>
      <dialog_mask_bottom_item slot="item" v-if="moreCreatorEnd" name="关闭" @dialogBtnClick="endFormTask"></dialog_mask_bottom_item>
      <dialog_mask_bottom_item slot="item" v-if="moreCreatorEdit" name="编辑" @dialogBtnClick="editApprove"></dialog_mask_bottom_item>
			<!--自由流程不显示明细-->
			<dialog_mask_bottom_item slot="item" name="流转明细" @dialogBtnClick="getFlowSerial"></dialog_mask_bottom_item>
			<dialog_mask_bottom_item slot="item" name="取消" @dialogBtnClick="showMoreApproveBtn" ></dialog_mask_bottom_item>
		</dialog_mask_bottom>
		<!--同意弹窗-->
		<dialog_mask_bottom :dialogConfig="agreeBottomConfig">
			<dialog_mask_bottom_item slot="item" v-if="agreeBtn" name="仅同意" @dialogBtnClick="agreeApprove"></dialog_mask_bottom_item>
			<dialog_mask_bottom_item slot="item" v-if="agreeEndBtn" name="同意并结束" @dialogBtnClick="agreeEndApprove"></dialog_mask_bottom_item>
			<dialog_mask_bottom_item slot="item" name="取消" @dialogBtnClick="showAgreeApproveBtn" ></dialog_mask_bottom_item>
		</dialog_mask_bottom>
		<!-- 流转明细 -->
    <flow_serial :flowSerialData="flowSerial" :isover="this.detail.isover" v-if="flowSerial.isShowFlowSerial"></flow_serial>
	</div>
</template>

<script>
	/*
    * TODO 创建者离职
    * */
  import  FlowApproveButton from '@/components/flow/flowApproveButton'
  import DialogMaskItem from '@/components/base/dialog_mask_bottom_item'
  import { bottomApproveButton, moreApproveButton } from '@/components/flow/config'

	import user_selected_item from '@/components/base/userOrDeptSelect/user_selected'
	import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group'
	import user_selected_ranglist from '@/components/base/userOrDeptSelect/user_selected_ranglist'
	import {qwui_button, button_group} from '@/components/base/button'
	import {flow_action_btn,flow_action_btn_group} from '@/components/base/button'
	import audit_flow_api from '@/components/flow/api/getData'
	import assign_btn from '@/components/assign/assign_btn'
	import flow_serial from '@/components/flow/flow_serial'; // 流转明细
	import qw_assign_box from '@/components/assign/assign_box'
	import dialog_mask_bottom from '@/components/base/dialog_mask_bottom'
	import dialog_mask_bottom_item from '@/components/base/dialog_mask_bottom_item'
	import chooseNodeList from '../components/chooseNodeList'
	import chooseNextNode from '../components/chooseNextNode'

	import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
	import {images_upload} from '@/utils/uploadImages';
	import {form_validation,scroll_height} from '../js/validation'
  import {getMember,setEditAgain,setEditAgainFree} from '../js/getData'
  import {updateCache} from '../assets/js/keepAlive.js'
  export default {
		name: "approve_btn",
		components: {
      FlowApproveButton,
      DialogMaskItem,
      FlowActionButton: flow_action_btn,

			flow_action_btn,
			flow_action_btn_group,
			flow_serial,
			user_selected_group,
			user_selected_item,
			button_group,
			qwui_button,
			user_selected_ranglist,
			chooseNodeList,
			chooseNextNode,
			assign_btn,
			qw_assign_box,
			dialog_mask_bottom,
			dialog_mask_bottom_item,

		},
		props: {
      value:String,
			agent:String,
			nodeId: String,
            saveType: Boolean,
      showSave: Boolean,
        },
		data() {
			return {
				dataBase,
        approveText: '',               // 输入的文字
				approveTip: '',                // 输入的提示语
				approveTitle: '',              // 标题文字
				approveErrorTip: '',           // 审批理由错误提示
				status: '',                    // 审批单状态修改（退审0，关闭-1，通过1，审批并结束2）
				ApproveStatusBtn: '',          // 审批单状态修改（agreeReApprove同意并转审，returnApprove退审，approve审批）
				commitData:{},                  // 提交数据
				returnNextNodeId:null,            // 选择的可退回节点
				assignSelctBoxShow: false,       // 显示加签选择
				assignConfirmBtn: false,       // 加签弹窗确定
				assignType:'',                 // 选择的加签类型
				assignBoxShow:false,           // 签名窗口
				dialogBottomConfig: {         // 更多审批按钮弹窗
					show: false,
				},
				agreeBottomConfig: {          // 同意的弹窗
					show: false
				},
				flowSerial: {                   // 流程明细
					isFirstRequest: true,
					isShowFlowSerial: false,
				},
				isWriteSign: false,          // 有无手写签名
				signImg:'',                  // 签名图
				isShowAssignBtn:false,      // 是否显示手写签名入口
        chatInputValue: null,
        isApprove:true,             // 是否点击审批
      }
		},
		computed: {
			...mapState({
				FlowAuditUserBoxShow: state => state.userSelected.FlowAuditUserBoxShow,
				flowChioseNodeAuditUser: state  => state.userSelected.flowChioseNodeAuditUser,
				nextNodeList: state => state.userSelected.nextNodeList,
				nextNodeListShow: state => state.userSelected.nextNodeListShow,
				flowDpIdJson: state => state.userSelected.flowDpIdJson,
				appointNodeAndUserVOList: state => state.userSelected.appointNodeAndUserVOList,
				appointUserIndex:state => state.userSelected.appointUserIndex,
				FlowAuditUser: state => state.userSelected.FlowAuditUser,    // 处理人信息
				flowChioseNodeAuditUserJson: state => state.userSelected.flowChioseNodeAuditUserJson,
				isChoise: state => state.userSelected.isChoise,
				audtiFlag: state => state.userSelected.audtiFlag,
				nextNodeId: state => state.userSelected.nextNodeId,
				parallelNextNodeIds: state => state.userSelected.parallelNextNodeIds,
				choiseFlowUserJson: state => state.userSelected.choiseFlowUserJson,
				detailData: state => state.detail.detailData,
				detail: state => state.detail.detailData.detail,
				controlPO: state => state.detail.detailData.controlPO,
				FlowAudit: state => state.detail.FlowAudit,       // 当前节点详细信息
				approveVo: state => state.detail.approveVo,       // 自由流程获取转审人员
        isShowNodeBox: state => state.userSelected.isShowNodeBox, // 显示选择下一节点弹窗
        choosedNodeName: state => state.userSelected.choosedNodeName,
			}),
			...mapGetters([
				'FlowAuditUserIds'
			]),
      chatInputShow() {
        return !this.agreeBtn && !this.agreeEndBtn && !this.approveBtn
          && !this.returnApproveBtn && !this.showEditBtn && !this.showEndBtn &&!this.assignBtn
      },
      // “更多按钮”
      moreButtonConfig() {
        return {
          show: this.moreApproveBtnShow,
          text: '更多',
          border: !this.chatInputShow,
        }
      },
      // 节点选择弹窗显示。新增/审批
      chooseNextNodeShow() {
        return this.nextNodeList.length>1 && (this.ApproveStatusBtn==='' || this.ApproveStatusBtn === 'approve' )
      },
			//编辑按钮
			showEditBtn(){
				//普通单和任务单
				if(!!this.detailData){
					let isRecipient = this.detailData.isRecipient;//如果负责人和提单人允许重新编辑
					let isCanUpdate = this.controlPO.isCanUpdate;//如果负责人和提单人允许重新编辑，添加重新编辑按钮
					let isClose = this.detail.isClose;
					//普通单
					if(this.controlPO.isTask == "0"){
						return (isRecipient && isCanUpdate == '0')
					}
					//任务单，如果没有离职允许重新编辑
					if(this.controlPO.isTask == "1"){
						if(isClose !=1){
							return (!this.detailData.createLeave && isRecipient && isCanUpdate == '0')
						}
					}
				}
				//审批单或者外部单  isTask：2审批单 / 3外部单
        if (!!this.detailData && (this.controlPO.isTask == "2" || this.controlPO.isTask == "3")) {
          return (
            this.detail.creator === _.userId                                                                             // 是提单人
            && ( this.detailData.approve === '0'                                                                         // 未审批过
              && ( (this.controlPO.isFreeFlow == 1                                                                       // 自由流程
                    && this.approveVo && this.approveVo.vo && this.approveVo.vo.userId.indexOf(_.userId) == -1)          // 自由流程不是当前审批人
                || this.FlowAudit && this.FlowAudit.vo && this.FlowAudit.vo.handleAccounts.indexOf(_.userId) == -1 )     // 固定，分支流程不是当前处理人
              || this.detail.isover == 0 )                                                                               // 被退审
            && this.detail.isClose != 1                                                                                  // 未关闭
					)
				}
			},
			//结束按钮
			showEndBtn(){
				//任务单
				if(!!this.detailData){
					let isClose = this.detail.isClose;
					if(this.controlPO.isTask == "1" && this.detailData.isRecipient){
						if(isClose !=1){ //任务单isClose == 1已经结束
							return true;
						}
					}
				}
				//审批单或者外部单  isTask：2审批单 / 3外部单
        if (!!this.detailData && (this.controlPO.isTask == "2" || this.controlPO.isTask == "3")) {
          return (
            this.detail.creator === _.userId                                                                                               // 是提单人
            && ( this.detailData.approve === '0'                                                                                           // 未审批过
              && ( (this.controlPO.isFreeFlow == 1                                                                                         // 自由流程
                    && this.approveVo && this.approveVo.vo && this.approveVo.vo.userId.indexOf(_.userId) == -1)                            // 自由流程不是当前审批人
                || this.FlowAudit && this.FlowAudit.vo && this.FlowAudit.vo.handleAccounts.indexOf(_.userId) == -1 )                       // 固定，分支流程不是当前处理人
              || this.detail.isover == 0 )                                                                                                 // 被退审
            && this.detail.isClose != 1                                                                                                    // 未关闭
            || ( this.FlowAudit && this.FlowAudit.vo && this.FlowAudit.vo.handleAccounts.indexOf(_.userId) > -1                            // 当前处理人
               && this.FlowAudit.auditLeave                                                                                                // 下一步处理人已离职
               || this.FlowAudit && this.FlowAudit.audtiFlag == '3' )                                                                      // 下一节点没有部门负责人
          )
				}
			},
			// 当前节点id
			currentNodeId() {
				return this.nodeId || this.detail.currentNodeId
			},
			// 根据节点审批类型，显示“退审”/“审批”按钮文字
			returnApproveText() {
				if (!this.FlowAudit) {
					return ['退审', '审批']
				}
				let obj = {
					1: ['退审', '审批'],
					2: ['退回', '确认'],
					3: ['退回', '办理']
				}
				return (
					!this.FlowAudit.auditLeave              // 下一步处理人未离职
					&& obj[this.FlowAudit.nodeType]
				)
			},
			// 退审理由
			reasonText() {
				if (!this.FlowAudit) {
					return ['退审', '审批']
				}
				let obj = {
					1: '同意。',
					2: '已确认。',
					3: '已办理。'
				}
				return (
					!this.FlowAudit.auditLeave              // 下一步处理人未离职
					&& obj[this.FlowAudit.nodeType]
				)
			},
//			editAction(){
//				if(!!this.detailData){
//					let isRecipient = this.detailData.isRecipient;//如果负责人和提单人允许重新编辑
//					let isCanUpdate = this.controlPO.isCanUpdate;//如果负责人和提单人允许重新编辑，添加重新编辑按钮
//					let isClose = this.detail.isClose;
//					if(this.controlPO.isTask == "0"){//普通单
//						return (isRecipient && isCanUpdate == '0')
//					}
//					//任务单，如果没有离职允许重新编辑
//					if(this.controlPO.isTask == "1"){
//						if(isClose !=1){
//							return (!this.detailData.createLeave&&isRecipient && isCanUpdate == '0')
//						}
//					}
//
//				}
//
//			},
      // （自由流程）当前顺序代办人数,0：则不是顺序代办规则；1：代表是最后一个审批人（显示转审的按钮,或同意并结束）；>1：显示同意按钮
      isOrderAuditNum() {
        return this.approveVo && this.approveVo.vo.isOrderAuditNum
      },
			//approveVo为自由流程的数据
			// 退审
			returnApproveBtn() {
				let flag = false
				//固定流程和分支流程的退审按钮是否显示
				if (!!this.detail && !!this.FlowAudit) {
					flag = (
						this.detail.isover == 2                                             // 未审批完
						&& this.FlowAudit.vo                                                // 固定分支流程数据
						&& this.FlowAudit.vo.handleAccounts.indexOf(_.userId) > -1          // 是当前处理人
						&& !this.FlowAudit.auditLeave                                       // 下一步处理人未离职
            && this.FlowAudit && this.FlowAudit.audtiFlag !== '3'               // 下一节点没有部门负责人
					)
				}
				//自由流程的退审按钮是否显示
				if (!!this.detail && !!this.approveVo) {
					flag = (
						this.detail.isover == 2                                             // 未审批完
						&& this.approveVo.vo                                                // 固定分支流程数据
						&& this.approveVo.vo.userId.indexOf(_.userId) > -1                  // 是当前处理人
					)
				}
				return flag
			},
			//固定流程和分支流程的审批按钮
			// 审批
			approveBtn() {
				if (!!this.detail && !!this.FlowAudit) {
					return (
						this.detail.isover == 2                                             // 未审批完
						&& this.FlowAudit.vo                                                // 固定分支流程数据
						&& this.FlowAudit.vo.handleAccounts.indexOf(_.userId) > -1          // 是当前处理人
						&& !this.FlowAudit.auditLeave                                       // 下一步处理人未离职
            && this.FlowAudit && this.FlowAudit.audtiFlag !== '3'               // 下一节点没有部门负责人
					)
				}
			},
			// 同意
			agreeBtn() {
				if (!!this.detailData && !!this.approveVo) {
					return (
						this.controlPO.isFreeFlow == 1                                      // 自由流程
						&& this.detail.isover == 2                                          // 未审批完
						&& this.approveVo.vo                                                // 自由流程数据
						&& this.approveVo.vo.userId.indexOf(_.userId) > -1                  // 是当前处理人
						&& (this.approveVo.vo.userId.split('|').length > 1                  // 多个处理人
                             || this.isOrderAuditNum > 1)                                   // 是顺序审批且不是审批最后一个处理人
					)
				}
			},
			// 同意并结束、同意并转审
			agreeEndBtn() {
				if (!!this.detailData && !!this.approveVo) {
					return (
						this.controlPO.isFreeFlow == 1                                      // 自由流程
						&& this.detail.isover == 2                                          // 未审批完
						&& this.approveVo.vo                                                // 自由流程数据
						&& this.approveVo.vo.userId.indexOf(_.userId) > -1                  // 是当前处理人
                        && this.isOrderAuditNum <= 1                                        // 顺序审批且是最后一个处理人或者不是顺序审批
					)
				}
			},
			//固定流程和分支流程节点允许结束vo.handleAccounts为当前处理人
			// 结束
			endBtn() {
				if (!!this.detailData && !!this.FlowAudit) {
					return (
            ( this.detail.isover == 2                                           // 未审批完
							&& this.FlowAudit.vo                                              // 固定分支流程数据
							&& this.FlowAudit.vo.isCanEnd == "0"                              // 允许提前结束
							&& this.FlowAudit.vo.handleAccounts.indexOf(_.userId) > -1)       // 是当前处理人
					)
				}
			},
      // 更多 编辑
      moreCreatorEdit(){
			  if(!!this.detailData && (this.controlPO.isTask == "2" || this.controlPO.isTask == "3")){
          return (
            this.detail.creator === _.userId                                                                           // 是提单人
            && this.detailData.approve === '0'                                                                         // 未审批过
            && (this.approveVo && this.approveVo.vo && this.approveVo.vo.userId.indexOf(_.userId) > -1                 // 自由流程,是当前处理人
                || this.FlowAudit && this.FlowAudit.vo && this.FlowAudit.vo.handleAccounts.indexOf(_.userId) > -1)     // 固定分支流程,是当前处理人
            && this.detail.isClose != 1                                                                                // 未关闭
          )
        }
      },
      //更多 结束
      moreCreatorEnd(){
        return this.moreCreatorEdit && !this.showEndBtn // 有更多-编辑按钮，且没有外部结束按钮
      },
			//固定流程和分支流程节点设置允许加签
			// 加签
			assignBtn() {
				if (!!this.detailData && !!this.FlowAudit) {
					return (
						this.FlowAudit.vo                                                   // 固定分支流程数据
						&& this.FlowAudit.parseAddSignVO
						&& this.FlowAudit.parseAddSignVO.canAddSign                         // 加签
						&& this.detail.isover == 2                                          // 未审批完
            && !this.FlowAudit.auditLeave                                       // 下一步处理人未离职
					)
				}
			},
			// 更多审批按钮是否显示
			moreApproveBtnShow() {
				//如果是isTask：3外部单且还未转为内部单时
				if(this.controlPO.isTask == '3' && !this.detailData.openIsSubmit){
					return false;
				}else{
					return this.endBtn                        // 结束按钮
						|| this.assignBtn                       // 加签按钮
						|| this.moreCreatorEdit                 // 更多编辑按钮
            || this.moreCreatorEnd                  // 更多关闭按钮
						|| this.controlPO.isFreeFlow !=1        // 自由流程不显示明细
            || this.agreeEndBtn
            || this.approveBtn
            || this.returnApproveBtn
            || this.showEditBtn
            || this.showEndBtn
				}
			},
			// 审批时，是否要选择下一步处理人
			flowAuditUserShow() {
				// 是可选的isChoise!=1 并且审批人是多部门的 auditFlag==2
				let flag1 = this.ApproveStatusBtn==='approve' && this.FlowAudit && (this.FlowAudit.isChoise!=1 || this.FlowAudit.audtiFlag==2)
				// 或是分支多节点
				let flag2 = this.ApproveStatusBtn==='approve' && this.controlPO.isFreeFlow == 3 && this.FlowAudit && this.FlowAudit.isBranchNode
				// 或是加签、或是转审
				return flag1 || flag2 || this.assignSelctBoxShow || this.ApproveStatusBtn==='agreeReApprove'
			},
			// 选择节点处理人
			otherAuditUserShow() {
				// 如果下个节点由当前节点自由选择处理人
				let flag1 = this.ApproveStatusBtn==='approve' && this.appointNodeAndUserVOList.length
				return flag1
			},
			// 是否可以选择会签 1:是 0:否addSign.countersignPersons
			isSign() {
				return this.FlowAudit && this.FlowAudit.parseAddSignVO
					&& this.FlowAudit.parseAddSignVO.canAddSign && this.FlowAudit.parseAddSignVO.canAddConterSign
			},
			// 是否可以加前签
			isFrontSign() {
				return this.FlowAudit && this.FlowAudit.parseAddSignVO
					&& this.FlowAudit.parseAddSignVO.canAddSign && this.FlowAudit.parseAddSignVO.canAddFrontSign
			},
			// 是否可以加后签
			isBackSign() {
				return this.FlowAudit && this.FlowAudit.parseAddSignVO
					&& this.FlowAudit.parseAddSignVO.canAddSign && this.FlowAudit.parseAddSignVO.canAddBackSign
			},
			// 是否显示手写签名入口(微信端&&审批/退审/结束/同意/同意并结束/同意并转审) false:未开启
			writeAssignBtnShow() {
				return _.isWeChatApp() && this.isShowAssignBtn

			},
			// 是否显示开启存档签名的入口（审批/退审/允许提前结束）
			usePresetSignShow() {
				return (this.ApproveStatusBtn=="approve" || this.ApproveStatusBtn=="returnApprove" || this.ApproveStatusBtn=="canEnd")
					&& this.controlPO.isFreeFlow!=1
			},
			// 是否开启存档签名 false:未开启
			isUsePresetSign() {
				return this.FlowAudit && this.FlowAudit.vo.isUsePresetSign && this.FlowAudit.userHandSignImg!=""
			},
			// 流程明细数据
			flowSerialData() {
				return this.flowSerial
			},
		},
		watch: {
			"approveErrorTip"(val){
				if(val!=""){
					_.tooltips_succeed(val,true,"",3000);
					this.approveErrorTip="";
				}
			}
		},
		methods: {
			...mapMutations([
				"updateUserSelectedData",
				"removeFlowAuditUser",    // 删除已选处理人
				"removeChioseNodeUser",
				"saveChoiseFlowUserJson",     // 保存自由选择的处理人
			]),
			...mapActions([
				"updataAuditStatus",     // 更新状态(关闭/退审)
				"addCountersignType",    // 加签
				"updateFlowUserSelected",     // 更新已选处理人
				"getFlowReturnAudit",         // 获取可退审节点
        "checkEntrustAddSignRule",    // 校验委托加签规则
			]),
      // 人员控件关联下一步处理人组件显示
      flowNodeItemKeysShow(index) {
        if (this.FlowAuditUser.length != 0 && this.FlowAuditUser[index].startAuditList.flowNodeItemKeys) {
          if (this.FlowAuditUser[index].startAuditList.allUser.length === 0) {
            return false
          } else {
            return true
          }
        } else if (this.FlowAuditUser[index].startAuditList) {
          return true;
        } else {
          return false;
        }
      },
			startAuditTitle:function(nodeName) {
				return nodeName ? nodeName+' 处理人' : '处理人'
			},
			// 重置数据
			resetData() {
				this.approveText= ''               // 输入的文字
				this.approveTip= ''                // 输入的提示语
				this.approveTitle= ''              // 标题文字
				this.assignSelctBoxShow= false     // 显示加签选择
				this.status= ''                    // 审批单状态修改（退审0，关闭2，通过1，审批并结束2）
				this.approveErrorTip= ''
				this.ApproveStatusBtn=''
				this.isShowAssignBtn=false
				this.isWriteSign=false
				this.signImg=''
				// 重置节点
				this.$store.commit('updateNextNodeList',[])
				// 隐藏加签弹窗确定按钮
				this.assignConfirmBtn = false
				this.commitData = Object.assign({},{})
			},
			// 关闭
			closeApprove() {
				this.resetData()
				this.updateUserSelectedData({type: "nextNodeListShow", data: true})
				this.approveTitle = '关闭申请单'
				this.approveText = '已完成。'
				this.status = -1
				this.showMoreApproveBtn()
			},
			showChatClick(){
				this.$emit("showChatTool",true);
			  if(this.agreeBtn || this.agreeEndBtn || this.approveBtn || this.returnApproveBtn || this.showEditBtn || this.showEndBtn || this.assignBtn){
          this.showMoreApproveBtn()
        }
      },
			// 编辑
			editApprove() {
        var type = this.detail.creator != _.userId ? "toEdit" : "edit";
        this.$router.replace({path: '/add',query:{id:this.detailData.detail.id,type: type}})
			},
			// 退审
			returnApprove() {
				let self = this
        this.isApprove = false;
				this.resetData()
				this.updateUserSelectedData({type: "nextNodeListShow", data: true})
				this.approveTitle = '退审'
				this.approveText = '不同意。'
				this.status = 0
				this.ApproveStatusBtn='returnApprove'
				this.isShowAssignBtn=true
				// 非自由流程获取可退审节点
				if(this.controlPO.isFreeFlow !=1) {
					this.getFlowReturnAudit({
						refId: this.detail.id,
						isBranch: this.controlPO.isFreeFlow == 3,
						currentNodeId: this.currentNodeId,
						isMiddleAudit: this.FlowAudit.vo.nodeStatus == 4,     // 是否并行流程子节点
						callback: function (data) {
							self.$store.commit('updateNextNodeList',data.returnedNodeList.reverse())
							self.returnNextNodeId =data.returnedNodeList[0] ? data.returnedNodeList[0].nodeId : ''
						}
					})
				}
			},
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
			// 审批
			async approve(e) {
			  this.isApprove = true;
				//验证表单字段
				if(!await this.saveChange()) return
				this.resetData()
				this.updateUserSelectedData({type: "nextNodeListShow", data: true})
				this.approveTitle = '审批'
				this.approveText = this.reasonText
				this.status = 1
				this.ApproveStatusBtn='approve'
				this.isShowAssignBtn=true
				if (this.controlPO.isFreeFlow == 3 && this.FlowAudit.isBranchNode) {   // 分支流程
					let defaultNextNodeId=this.FlowAudit.vo.defaultNextNodeId;
					let data = {
						initRefId: this.detail.id,//表单实例id
						currentNodeId: defaultNextNodeId? defaultNextNodeId:this.currentNodeId,
					};
					let typeMap = this.$store.state.formBase.typeMap
					let choiceMap = this.$store.state.formBase.choiceMap;
					let formData = JSON.parse(JSON.stringify(this.$store.state.formBase.data));
					let newData = {};
					for(let i in formData){
						//	不同的字段类型不同传参
						switch(typeMap[i]){
							case 'MEMBERCustomerField':		//	通讯录字段
							case 'DEPTCustomerField':			//	部门字段
							case 'CRMCustomerField':			//  CRM字段
								newData['searchValue.'+ i] = formData[i].join('|');
							break;
							case 'RadioButton':						// 单项选择
							case 'DropDown':							// 下拉框
								newData['searchValue.'+ i] = choiceMap[formData[i]]
							break;
              case 'CheckBox':              //多选
                let checkVal = formData[i];
                if(checkVal){
                  let val = []
                  for (let j=0;j<checkVal.length;j++){
                    val.push(choiceMap[checkVal[j]]);
                  }
                  newData['searchValue.'+ i] = val.join(',');
                }
                break;
							default:
								newData['searchValue.'+ i] = formData[i];
						}
					}
					data = Object.assign(data,newData)
					audit_flow_api.findBranchFlowNextNodeInfo(data, (result) => {
						this.$store.commit('updateFlowAuditUser', result.nodeInfo);
						this.$store.commit("updateNextNodeList", result.nextNodeList)
            // 更新下拉选择节点名称
            this.$store.commit("updateChooseNodeName");
						this.$store.commit("updateUserSelectedData", {type: 'nextNodeId', data: result.nextNodeId})
						this.$store.commit("updateUserSelectedData", {type:'flowId',data:result.flowId})
						this.$store.commit('updateUserSelectedData', {type: 'parallelNextNodeIds', data: result.parallelNextNodeIds});
						this.$store.commit("updateUserSelectedData", {type: 'currentNodeId', data: data.currentNodeId})
            this.flowNodeItemKeysDate();
					})
				}
			},
			// 加签操作
			assignApprove() {
				this.resetData()
				this.$store.commit('resetFlowAuditUser')
				this.approveTitle = '加签'
				this.approveText = '请协助处理。'
				this.updateUserSelectedData({type: "nextNodeListShow", data: true})
				this.assignConfirmBtn = true
				this.assignSelctBoxShow = true
			},
			// 加签确定  请选择加签处理人/加签说明不能为空/不能加签提单人/不能加签自己/不能加签当前负责人
			assignConfirm() {
				let self = this
				let addCounterSignPersonStr=''        // 被加签的id
        let nextAuditUserIdArr = [];          // 下一步处理人id数组
				this.FlowAuditUser.forEach(function(value){
					let users = value.startAuditList.userSelected
					if(!users) return;
					let ids = users.map((item)=>{
						return item.userId
					})
					addCounterSignPersonStr+=ids.join('|')
				})
				// 请选择加签类型
				if(!this.assignType){
					this.approveErrorTip = '请选择加签类型';
					return false
				}
				// 请选择加签处理人
				if(!this.FlowAuditUser[0].startAuditList.userSelected.length) {
					this.approveErrorTip = '请选择加签处理人'
					return false
				}
				// 当前选择的处理人是否在当前负责人
				let addCounterSignFlag = this.FlowAudit.auditUserList.filter(value=>{
					return addCounterSignPersonStr.indexOf(value.userId)>-1
				})
				// 不能加签当前负责人
				if(addCounterSignFlag.length>0){
					this.approveErrorTip = '不能加签当前负责人'
					return false
				}
				//不能加签自己
				if(addCounterSignPersonStr.indexOf(_.userId)>-1){
					this.approveErrorTip = '不能加签自己';
					return false;
				}
				// 不能加签下一步处理人
				if(this.FlowAudit.nextAuditList && this.FlowAudit.nextAuditList.length) {
					let nextAuditFlag = this.FlowAudit.nextAuditList.filter(value=>{
						return addCounterSignPersonStr.indexOf(value.userId)>-1
					})
					if(nextAuditFlag.length>0){
						this.approveErrorTip = '不能加签下一步处理人'
						return false
					}
				}
				// 如果用户没有输入理由
				if (!this.approveText) {
					this.approveErrorTip = '加签说明不能为空'
					return false
				}
				// 如果有下一步处理人
				if (this.FlowAudit.nextAuditList){
          this.FlowAudit.nextAuditList.forEach((item) => {
            nextAuditUserIdArr.push(item.userId);
          });
        }
				// 校验委托加签规则
        this.checkEntrustAddSignRule({
          'agentCode': dataBase.wxqyh_uploadfile.agent,
          'addSignUserId': addCounterSignPersonStr,
          'currentAuditUserId': this.FlowAudit.vo.handleAccounts,
          'nextAuditUserId': nextAuditUserIdArr.join('|'),
          'callback': function () {
            // 提交
            self.addCountersignType({
              'isFree': self.controlPO.isFreeFlow,
              'type': self.assignType,
              'addCounterSignPersonStr': addCounterSignPersonStr,
              'reason':self.approveText,
              'id':self.detail.id,
              'currentNodeId': self.currentNodeId,
              'orderVersion': self.detailData.orderVersion,
            })
          }
        });

			},
			// 结束
			endApprove() {
				this.resetData()
				this.updateUserSelectedData({type: "nextNodeListShow", data: true})
				// 创建者已离职
				this.status = 2
				this.ApproveStatusBtn='canEnd'
				this.showMoreApproveBtn()
				this.approveText = '同意并结束。'
				this.isShowAssignBtn=true
        this.isApprove = false;
			},
			//表单任务单的结束
			endFormTask(){
				this.resetData();
				this.updateUserSelectedData({type: "nextNodeListShow", data: true})
				this.status = -1;
				this.ApproveStatusBtn = '';
				this.approveText = '已完成。';
        this.isApprove = false;
				if(this.moreCreatorEnd){
          this.showMoreApproveBtn();
        }
        if(this.FlowAudit && this.FlowAudit.auditLeave) {
          this.approveText = '下一步处理人已离职。'
          return;
        }
        if(this.FlowAudit && this.FlowAudit.audtiFlag == '3'){
          this.approveText = '下一节点未找到部门负责人。'
          return;
        }
			},
			// 同意
			agreeApprove() {
				this.resetData()
				this.updateUserSelectedData({type: "nextNodeListShow", data: true})
                this.approveTitle = '仅同意'
				this.approveText = '同意。'
				this.status = 1
				this.showAgreeApproveBtn()
				this.isShowAssignBtn=true
			},
			// 同意并结束
			agreeEndApprove() {
				this.resetData()
				this.updateUserSelectedData({type: "nextNodeListShow", data: true})
				this.approveTitle = '同意并结束'
				this.approveText = '同意。'
				this.status = 2
				this.showAgreeApproveBtn()
				this.isShowAssignBtn=true
			},
			// 同意并转审
			async agreeReApprove(e) {
				//验证表单字段
        if(!await this.saveChange()) return
				this.resetData()
				this.updateUserSelectedData({type: "nextNodeListShow", data: true})
				this.$store.commit('resetFlowAuditUser')
				this.ApproveStatusBtn = 'agreeReApprove'
				this.approveTitle = '选择转审处理人'
				this.approveText = '同意。'
				this.status = 1
				this.isShowAssignBtn=true
			},
			// 同意并转审判断方法
			changeTo() {
				// 转审人不能为空
				if(!this.FlowAuditUser[0].startAuditList.userSelected.length) {
					this.approveErrorTip = '转审人不能为空'
					return false
				}
				// 如果是自由流程，则保存转审的数据
				this.commitData.chooseFlowUser = this.FlowAuditUserIds(0).join('|')
				return true
			},
			// 输入审批文字
			changeApproveTip() {
				if (this.approveText.length > 200) {
					this.approveText = this.approveText.splice(0, 100)
				}
			},
			stringUserIds(array) {
				let ids = array.map((value)=>{
					return value.userId;
				})
				return ids.join('|');
			},
      isRelevanceFlowNodeItemKeys() {
        // 如果关联了人员控件，且人员控件没有选人，则跳到人员控件字段
        if (this.isApprove && this.FlowAuditUser.length) {
          var arr = this.FlowAuditUser;
          for (let j = 0; j < arr.length; j++) {
            if (arr[j].startAuditList.flowNodeItemKeys && arr[j].startAuditList.allUser.length === 0) {
              let incharges = arr[j].startAuditList.userSelected;
              if (!incharges.length) {
                var schema = this.$store.state.formBase.schema, labels = [];
                for (let i = 0; i < schema.length; i++) {
                  if (arr[j].startAuditList.flowNodeItemKeys.indexOf(schema[i]._id) != -1) {
                    labels.push(schema[i].label);
                    schema[i].help = `请填写${schema[i].label}`
                  }
                }
                var ids = arr[j].startAuditList.flowNodeItemKeys.split('|');
                _.tooltips_succeed(`已关联${labels}字段，请先填写`, true, "");
                scroll_height(ids[0]);
                this.updateUserSelectedData({type: "nextNodeListShow", data: false})
                return false
              }
            }
          }
        }
        return true;
      },
			// 点击确定
			confirmDialog() {
        let self = this
        if(!this.isRelevanceFlowNodeItemKeys()) return;
				// 审批或退审时验证手写签名
				if(this.isShowAssignBtn &&this.controlPO.isFreeFlow!=1) {
					if(!this.checkSoterInfo()) return
				}
				// 如果用户没有输入理由
				if (!this.approveText) {
					this.approveErrorTip = '结束理由不能为空'
					return
				}
				// 如果是转审
				if(this.ApproveStatusBtn==='agreeReApprove'&&!this.changeTo()) {return}
				// 如果是退审
				if(this.ApproveStatusBtn ==='returnApprove' && this.nextNodeList.length) {
					if(this.controlPO.isFreeFlow==3) {
						this.commitData.nextNodeId = this.returnNextNodeId
					}else {
						this.commitData.nextNodeId = this.returnNextNodeId
						this.commitData.chooseFlowUser = this.returnNextNodeId
					}
				}
        // 如果提单人离职且退审到提单人，则弹窗提示
        if(this.ApproveStatusBtn ==='returnApprove' && this.detailData.createLeave && !this.returnNextNodeId){
          return _.alert('提示','提单人已不在通讯录中，请联系管理员结束流程');
        }
				// 如果是分支流程，传下个节点id
				if (this.ApproveStatusBtn !=='returnApprove' && this.controlPO.isFreeFlow == 3) {
					if(this.FlowAudit && this.FlowAudit.vo && this.FlowAudit.vo.defaultNextNodeId){
						this.commitData.nextNodeId = this.FlowAudit.vo.defaultNextNodeId
					}else {
						this.commitData.nextNodeId = this.nextNodeId
					}
				}
				// 如果是审批,验证是否选择处理人
				if(this.ApproveStatusBtn==='approve') {
					if(this.flowAuditUserShow && !audit_flow_api.isCheckAuditUser({FlowAuditUser:this.FlowAuditUser})) {return}
					if (this.otherAuditUserShow && this.appointNodeAndUserVOList.length && !audit_flow_api.isCheckAppointNodeAndUser({flowChioseNodeAuditUser: this.flowChioseNodeAuditUser})) {return}
					this.$store.commit('saveChoiseFlowUserJson')
					this.$store.commit('saveNodeAuditUserJson')
					// 有选择部门负责人// 如果选择了处理人
					if (this.controlPO.isFreeFlow == "2") {
						if (this.FlowAuditUser.length) {
							let userSelected = this.FlowAuditUser[0].startAuditList.userSelected;
							if (this.FlowAuditUser[0].isChoise == "0" || this.FlowAuditUser[0].isChoise == "2") {
								this.commitData.chooseFlowUser = this.stringUserIds(userSelected);
							}
							if (this.FlowAuditUser[0].audtiFlag == "2") {
								this.commitData.flowDpId = userSelected[0].deptId;
							}
						}
					}
					if (this.controlPO.isFreeFlow == "3") {
						if(this.choiseFlowUserJson.length) {
							this.commitData.chooseFlowUser = this.choiseFlowUserJson
						}
						if(this.flowDpIdJson.length){
							this.commitData.flowDpId = this.flowDpIdJson
						}
					}
				}
				// 有选择节点负责人
				if(this.flowChioseNodeAuditUserJson.length) {
					this.commitData.flowChioseNodeAuditUserJson = JSON.stringify(this.flowChioseNodeAuditUserJson)
				}
				// 非自由流程
				let currentNodeId = this.nodeId || this.detail.currentNodeId
				if(this.controlPO.isFreeFlow!=1 && currentNodeId) {
					this.commitData.currentNodeId = currentNodeId
				}
				this.updataAuditStatus({
					'id': this.detail.id,
					'reason': this.approveText,
                    'formEditType':this.saveType? 1: '',
					'status': this.status,
					'parallelNextNodeIds': this.parallelNextNodeIds,
          'orderVersion': this.detailData.orderVersion,
					...this.commitData,
					// 'chooseFlowUser':'',
					// 'parallelNextNodeIds':'',
					// 'flowDpId':'',
					// 'flowChioseNodeAuditUserJson':'',
					// 'signImg':'',
					'callback': function () {
						_.tooltips_succeed('操作成功');
						if(self.ApproveStatusBtn=="agreeReApprove"){
              window.location.reload();
            }else{
							setTimeout(()=>{
                updateCache('audit', true); // 执行操作后更新列表页数据更新首页数量信息
								self.$router.replace('/audit')
							},1000)
						}
					}
				})
			},
			cancelDialog() {
				this.updateUserSelectedData({type: "nextNodeListShow", data: false})
			},
			// 选择处理人弹窗
			FlowAuditUserShowBox(index) {
				this.$store.commit('updateUserSelectedData',{type:'appointUserIndex',data:index})
				// 如果是指定范围选人
				if(this.FlowAuditUser[index].startAuditList.assignRange) {
					this.$store.commit('updateUserSelectedData',{type:"FlowAuditUserBoxShow", data: true})
				}else {
					let self = this
					let users = this.dataBase.selectConfig.selectList.users
					this.dataBase.selectConfig.signIndex="users"
					this.dataBase.selectConfig.show=true
          users.userSelected.length=0
					if(this.FlowAuditUser[index].startAuditList.userSelected.length) {
            users.userSelected.push(...this.FlowAuditUser[index].startAuditList.userSelected)
					}
          users.callBack.confirm=function (type, obj) {
            users.userSelected.length=0
            users.userSelected.push(...obj.user.data);
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
			otherAuditUserShowBox(index) {
				let self = this
				let users = this.dataBase.selectConfig.selectList.users
				this.dataBase.selectConfig.signIndex="users"
				this.dataBase.selectConfig.show=true
        users.userSelected.length=0
				if(this.flowChioseNodeAuditUser.length && this.flowChioseNodeAuditUser[index]) {
          users.userSelected.push(...this.flowChioseNodeAuditUser[index])
				}
        users.callBack.confirm=function (type, obj) {
          users.userSelected.length=0
          users.userSelected.push(...obj.user.data);
					self.$store.commit('updateChooiseNodeAuditUser',{
						index: index,
						data: obj.user.data
					})
				}
			},
			showPersonList (title,list){                                           //显示人员预览弹窗
				this.$emit("showPersonList",title,list,true);
			},
			// 显示签名窗口
			showAssignBox(payload) {
				this.assignBoxShow = payload
			},
			// 保存签名图
			saveCanvasToURL(payload) {
				this.isWriteSign = payload.isWriteSign
				if(payload.isWriteSign) {
                    _.showLoading('上传中');
					images_upload(payload.imageUrl,this.agent,(callback)=>{
						this.commitData.signImg = callback.imgurl
					})
					this.signImg = payload.imageUrl
				}else {
					this.commitData.signImg=''
					this.signImg = ''
				}
				this.assignBoxShow = false
			},
			// 显示更多审批按钮
			showMoreApproveBtn() {
				this.dialogBottomConfig.show=!this.dialogBottomConfig.show
			},
			// 显示同意按钮弹窗
			async showAgreeApproveBtn() {
        //验证表单字段
        if(!await this.saveChange()) return
        // 自由流程顺序审批，且不是最后一个处理人，点击“同意”，则直接弹窗，调用的是仅同意的方法
        if(this.isOrderAuditNum > 1){
          this.resetData()
          this.updateUserSelectedData({type: "nextNodeListShow", data: true})
          this.approveTitle = '仅同意'
          this.approveText = '同意。'
          this.status = 1
          this.isShowAssignBtn=true
          return
        }
				// 多个处理人
				if(this.approveVo.vo.userId.split('|').length > 1){
					this.agreeBottomConfig.show=!this.agreeBottomConfig.show
				}else{
					this.resetData()
					this.updateUserSelectedData({type: "nextNodeListShow", data: true})
					this.approveTitle = '同意并结束'
					this.approveText = '同意。'
					this.status = 2
					this.isShowAssignBtn=true
				}
			},
			// 获取流程流转明细
			getFlowSerial() {
				this.showMoreApproveBtn()
				let dataParam = {
					refId: this.detail.id,
          isFree: this.controlPO.isFreeFlow
				}
				this.flowSerial.isFreeFlow = this.controlPO.isFreeFlow
				audit_flow_api.getParallelFlowSerial(dataParam, this.flowSerial, (result) => {
					this.flowSerial = Object.assign({},result)
				})
			},
			// 后台是否上传签名图
			checkUsePresetSign(event) {
				if(event.target.checked){
					if(!this.FlowAudit.vo.isUsePresetSign){
						this.approveErrorTip = '后台未开启“允许使用存档签名”功能';
						return
					}
					if(this.FlowAudit.userHandSignImg==""){
						this.approveErrorTip = '后台还未上传手写签名，请联系管理员';
						return
					}
				}
			},
			// 手写签名验证
			checkSoterInfo() {
				if (this.FlowAudit.vo.isUseHandWriteSign) { //必须手写签名
					let isUseSign = false
					if (this.isWriteSign) { //没有手写签名的时候验证有无使用留档签名
						isUseSign = true
					} else if (document.getElementById("isUsePresetSign").checked && this.FlowAudit.userHandSignImg != "") {
						isUseSign = true
						this.commitData.signImg = this.FlowAudit.userHandSignImg
					}
					if (!isUseSign) {
						this.approveErrorTip = '必须使用签名功能才能审批';
						return false
					}
				} else { //只勾选存档签名
					if (document.getElementById("isUsePresetSign").checked && this.FlowAudit.userHandSignImg != "") {
						this.commitData.signImg = this.FlowAudit.userHandSignImg
					}
				}
				return true
			},
			//审批，转审，退审，同意验证保存字段
			async saveChange(saveType){
			  if(saveType){
          await this.$parent.saveChange(saveType);
          return;
        }
				//验证表单字段
        //自由流程不要执行
        if(this.controlPO.isFreeFlow == 1 && this.$store.state.detail.detailData.controlPO.isCanUpdate === "0"){
          if(setEditAgainFree(this.$store)){
            var schema = this.$store.state.formBase.schema;
            var validation = form_validation(schema);
            if (!validation) {
              this.$emit("update:showSave", true);
              return false;
            }
          }
        }else{
          if(setEditAgain(this.$store)) {
            var schema = this.$store.state.formBase.schema;
            var validation = form_validation(schema,true);
            if (!validation) {
              this.$emit("update:showSave", true);
              return false;
            }
          }
        }
        if(!await this.$parent.saveChange()) return false;//审批时保存
        return true;
			},
      showNodeBox() {
        this.$store.commit("updateUserSelectedData", {type: 'isShowNodeBox', data: true});
      },
      flowNodeItemKeysDate() {
        if (this.FlowAuditUser.length != 0) {
          this.FlowAuditUser.forEach((value, index) => {
            if (value.flowNodeItemKeys) {
              var ItemKeys = [];
              ItemKeys = value.flowNodeItemKeys.split('|');
              let users = [];
              let userItem = [];
              for (let i = 0; i < ItemKeys.length; i++) {
                var person = this.$store.state.formBase.data[ItemKeys[i]] || [];
                userItem.push(...person);
                if (userItem) {
                  userItem.forEach(item => {
                    let arry = item.split('_');
                    arry.pop();
                    users.push(arry.join('_'));
                  });
                }
              }
              let ids = users.unique().join(',');
              getMember(ids, (res) => {
                this.$store.commit('updateItemKeysSelected', {index: index, data: res});
              });
            }
          })
        }
      },
		},
	}

</script>

<style scoped>
	@media screen and (min-width: 1024px) {
		.approveDialogPop {
			width: 740px;
			margin: auto;
		}
		.approveDialogPop .qwui-btn_box{
			width: 730px!important;
		}
	}
	.approveDialogPop {
		position: fixed;
		z-index: 3;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		padding: 5px;
		box-sizing: border-box;
		background-color: #7a7a7a;
	}

	.approveDialog {
		position: relative;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		background-color: #F7F7F7;
	}

	.selectBoxContent {
		position: absolute;
		top: 0;
		bottom: 60px;
		width: 100%;
		overflow-y: auto;
	}

	.selectBoxContent::-webkit-scrollbar {
		width: 0;
	}

	.chooseNodeListUI-top-title {
		margin: 25px 15px 15px;
		font-size: 16px;
		color: #333;
		line-height: 1;
	}

	.chooseNodeListUI .qwui-user_select_title{
		background: #f5f5f5;
	}

	.chooseNodeListUI .qwui-user_cell_title{
		color: #333;
		font-size: 16px;
	}
	.chooseNodeListUI .qwui-user_select_item{
		background-color: transparent;
	}
	.chooseNodeListUI .qwui-user_select_title:after, .qwui-user_select_charge:after {
		border: 0;
	}
	.chooseNodeListUI .qwui-user_select_list{
		margin: 0;
	}
	.chooseNodeListUI .qwui-user_select_add {
		margin-bottom: 15px;
	}
  .chooseNodeListUI.qwui-user_select_charge_view {
    background-color: transparent;
  }

	.chooseNodeListUI-title {
		font-size: 16px;
		padding: 15px 15px 10px;
		color: #333;
	}

	.selectReturnNodeBox {
		position: relative;
		margin: 0 15px 15px;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 2px;
		background-color: #fff;
	}

	.selectReturnNodeBox select {
		width: 100%;
		padding-right: 20px;
		color: #333;
		font-size: 16px;
		-webkit-appearance: none;
		-moz-appearance: none;
		outline: none;
		border: none;
		background: url("../../../assets/images/icon_arrow_d.png") no-repeat right center;
		background-size: 12px 8px;
	}

	.qwui-click_icon_right {
		display: block;
		position: absolute;
		top: 50%;
		right: 15px;
		width: 9px;
		height: 15px;
		background: 0 0 url("../../../assets/images/CSSSprites.png") no-repeat;
		background-size: 100px 100px;
		transform: translate(0, -50%);
	}



	.selectTitle {
		position: absolute;
		top: 0;
		padding: 10px 15px;
		width: 100%;
		color: #333;
		font-size: 16px;
		background-color: #fff;
	}

	.selectContent {
		position: absolute;
		top: 54px;
		bottom: 60px;
		width: 100%;
		overflow-y: auto;
		background-color: #fff;
	}

	.selectContent::-webkit-scrollbar {
		width: 0;
	}

	.selectAssignBox {
		margin: 0 15px 25px;
	}

	.selectAssignBox .item {
		display: flex;
		align-items: center;
		margin-bottom: 25px;
		line-height: 1;
		font-size: 16px;
		color: #333;
	}

	.selectAssignBox .tip {
		color: #999;
	}

	.nodeItemContent p {
		color: #999;
		font-size: 14px;
	}

	.nodeItemContent p:nth-child(1) {
		color: #333;
		font-size: 16px;
	}

	.nodeItemContent p:nth-child(2) {
		margin-top: 10px;
	}

	.qwui-dialog_textarea {
		flex-direction: column;
		margin: 0 15px;
		padding: 10px;
		border: 1px #ccc solid;
		border-radius: 2px;
		background-color: #fff;
	}

	.qwui-dialog_textarea_counter {
		font-size: 14px;
		color: #999;
		text-align: right;
		line-height: 1;
	}

	.approveDialog textarea {
		width: 100%;
		height: 94px;
		text-align: left;
		vertical-align: top;
		font-size: 16px;
		color: #333;
		line-height: 1.5;
		border: none;
	}

	.qwui-dialog_textarea_counter .active {
		color: red;
	}

	.tip {
		color: red;
	}

	.approveDialog .subTitle {
		font-size: 14px;
		color: #999;
	}

	.usePresetSign_div {
		margin: 30px 15px;
	}

	.usePresetSign_div label {
		display: flex;
		align-items: center;
		font-size: 14px;
		color: #333;
		line-height: 1;
	}

	.usePresetSign_div p {
		margin-top: 5px;
		font-size: 12px;
		color: #999;
	}

	.approveDialogPop .qwui-btn_box {
		position: absolute;
		bottom: 0;
		background-color: #fff;
	}

	.approveDialogPop .qwui-btn_tab {
		padding: 8px 10px;
	}

	.approveDialogPop .qwui-btn_tab:before {
		content: " ";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		border-top: 1px solid #e5e5e5;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
  .comment_btn_add{
    display: flex;
    justify-content: left;
    align-items: center;
    flex: 1;
    margin: 6px 15px;
    padding-left: 10px;
    border-radius: 5px;
    font-size: 15px;
    color: #B2B9C8;
    text-align: left;
    background: #F6F6FA;
    cursor: pointer;
  }
  .comment-chat_input{
    font-size: 14px;
    background: none;
    width: 100%;
    color: #999;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .btn_more_before{
    margin-left: -6px;
    width:3px;
    height:20px;
    border-left:1px solid rgba(218,221,228,1);
  }
  .btn_end >>> .text{
    color: #FF596D;
  }
  .btn_approve >>> .text{
    color: #5585F0;
  }
  /*审批、同意*/
  .qwui-action-button >>> .icon_a-review_ok,.flowAgreeBtn >>> .icon_a-review_ok{
    background-image: url("~assets/images/icon_a-review_ok@3x.png");
  }
  /*退审*/
  .qwui-action-button >>> .icon_a-review_no {
    background-image: url("~assets/images/icon_a-review_no@3x.png");
  }
  /*转审*/
  .qwui-action-button >>> .icon_a-review_review {
    background-image: url("~assets/images/icon_a-review_review@3x.png");
  }
  /*关闭*/
  .qwui-action-button >>> .icon_a-review_end {
    background-image: url("~assets/images/icon_a-review_end@3x.png");
  }
  /*编辑*/
  .qwui-action-button >>> .icon_a-review_edit {
    background-image: url("~assets/images/icon_a-review_edit@3x.png");
  }
  /*加签*/
  .qwui-action-button >>> .icon_a-review_add {
    background-image: url("~assets/images/icon_a-review_add@3x.png");
  }
  /*暂存*/
  .qwui-action-button >>> .icon_a-review_save {
    background-image: url("~assets/images/icon_a-review_save@2x.png");
    background-size: contain;
  }
  /*选择下一节点*/
  .selectNodeBox {
    position: relative;
    margin: 0 15px 15px;
    padding: 10px 25px 10px 10px;
    color: #333;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background-color: #fff;
    box-sizing: border-box;
  }
  .selectNodeBox:after{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    border: 1px solid #ccc;
    box-sizing: border-box;
    transform: scale(0.5);
    transform-origin: left top;
  }
  >>> .qwui-assign_btn {
    margin: 30px 15px 0 0;
  }
</style>

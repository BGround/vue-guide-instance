<template>
	<!--审批请示按钮-->
	<div class="apporve-btn" v-if="detailData">
		<flow-approve-button
			:FlowAudit="FlowAuditList[0]"
			:detail="flowApproveDetail"
			:approveVo="approveVo"
			:bottomApproveButton="bottomButton"
			@showChatTool="showChatToolFun"
			@actionButtonClick="actionButtonClick"
			@approveAction="approveAction">
			<!--自定义底部按钮-->
			<div v-if="showCloseBtn"
						class="action-button-item close-btn"
						slot="bottomApproveButton">
				<span class="iconfont icon-shenpiqingshi-guanbi"></span>
				<span class="text" @click="cancelUse">结束</span>
			</div>
			<div v-if="showCancelBtn"
						class="action-button-item return-btn"
						slot="bottomApproveButton"
						@click="hideBtn">
				<span class="iconfont icon-shenpiqingshi-guanbi"></span>
				<span class="text">取消</span>
			</div>
			<div v-if="showConfirmBtn && !showCancelBtn || showCancelBtn && showSendBtn" class="action-button-item confirm-btn" slot="bottomApproveButton">
				<span class="iconfont icon-shenpiqingshi-tongyi"></span>
				<span class="text" @click="sendInfo">{{confirmText}}</span>
			</div>
			<div v-if="showCancelBtn && showConfirmBtn" class="action-button-item confirm-btn" slot="bottomApproveButton">
				<span class="iconfont icon-shenpiqingshi-tongyi"></span>
				<span class="text" @click="editPassenger">保存</span>
			</div>
			<div v-if="showStartBtn" class="action-button-item confirm-btn" slot="bottomApproveButton">
				<span class="iconfont icon-shenpiqingshi-tongyi"></span>
				<span class="text" @click="useCar">开始用车</span>
			</div>
			<div v-if="showFinishBtn" class="action-button-item close-btn" slot="bottomApproveButton">
				<span class="iconfont icon-shenpiqingshi-guanbi"></span>
				<span class="text" @click="finishCar">结束用车</span>
			</div>
		</flow-approve-button>
	</div>
</template>

<script>
	//zdq
	import { closeCarAskAfterAudited} from '../../api/getData'
	import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
	import FlowApproveButton from '@/components/flow/flowApproveButton'
	export default {
		name: 'approveButton',
		components: {
			FlowApproveButton
		},
		props: {
			flowApproveDetail: {
				type: Object,
				default() {
					return {}
				}
			},
			showCancelBtn: {
				type: Boolean,
				default: false
			},
			isVip: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				showChatTool: false,   //显示评论输入框
				autofocus: false
			}
		},
		computed: {
			...mapState({
				detailData: state => state.detail.detailData,     //详情信息
				detail: state => state.detail.detailData && state.detail.detailData.detail,     //detail信息
				FlowAuditList: state => state.flowUserSelected.FlowAuditList, // 详情节点当前和下一步处理人信息
				approveVo: state => state.flowUserSelected.approveVo,  // 自由流程信息
				isFree: state => state.flowUserSelected.isFree,          //流程类型,默认是自由流程'1'（固定为0，分支为3，全部应用需要统一）
				isBranchNode: state => state.flowUserSelected.isBranchNode,          //接口返回的流程数据
			}),
			//底部评论按钮不显示输入框
			bottomButton() {
				let button = {}
				//不存在自定义按钮时
				if(this.showCloseBtn || this.showCancelBtn || this.showConfirmBtn || this.showStartBtn || this.showFinishBtn) {
					this.$set(button, 'chatInputShow', {show: false})
				} else {
					this.$set(button, 'chatInputShow', {show: 1})
				}
				return button
			},
			status() {
				return this.detail && this.detail.status
			},
			isover() {
				return this.detail && this.detail.isover
			},
			confirmText() {
				if(this.showConfirmBtn) return '确认派车'
				else return '确认'
			},
			// 显示自定义结束按钮
      showCloseBtn() {
				if(this.showCancelBtn) return false
        return ((this.isCreator || this.isCarManager) && this.status == 2 && this.isover == 1) ||
               (this.status == 3 && this.isStarted == '' &&  this.isover != -1 && this.isDealPerson &&
               (this.detailData.config.allowUserCloseCar == 1 || this.detailData.config.allowManagerCloseCar == 1 || this.detailData.config.allowDriverCloseCar == 1))
      },
      // 显示自定义开始用车按钮
      showStartBtn() {
				if(this.showCancelBtn) return false
        return ((this.canUserClose && this.isCreator) || 
							 (this.canManagerClose && this.isCarManager) || 
							 (this.canDriverClose && this.isCarDriver)) && 
							 this.isVip && this.status == 3 && this.isStarted == '' && this.isover != -1
      },
      // 显示自定义结束用车按钮
      showFinishBtn() {
				if(this.showCancelBtn) return false
				return ((this.canUserClose && this.isCreator) || 
							 (this.canManagerClose && this.isCarManager) || 
							 (this.canDriverClose && this.isCarDriver)) && 
							 this.status == 3 && this.isStarted == 1 && this.isover != -1
      },
      //显示自定义确认按钮
      showConfirmBtn() {
        return this.isCarManager && this.status == 2 && this.isover == 1
			},
			//显示已派车确认按钮
			showSendBtn() {
				return this.isCarManager && this.status == 3 && this.isover != -1 && 
							(this.isVip && this.isStarted == '' || !this.isVip)
      },
      //提单人、车管、司机
      isDealPerson() {
        return this.isCreator || this.isCarManager || this.isCarDriver
      },
      // 是提单人
      isCreator() {
        return (this.detail && this.detail.creator) === _.userId
      },
			// 是车管员
			isCarManager() {
				return this.detailData && this.detailData.isCarManager == 1
			},
			// 是司机
			isCarDriver() {
				return this.detailData && this.detailData.isCarDriver == 1
			},
			// 开始用车
			isStarted() {
				if(this.isVip) return this.detail && (this.detail.isStarted == '0' ? '' : this.detail.isStarted)
				else {
					if(this.status == 3 && this.isover != -1) return '1'
					else if(this.status == 4) return '2'
					else return ''
				}
			},
			// 司机可关闭用车
			canDriverClose() {
				return this.detailData && this.detailData.config && this.detailData.config.driverOpen == 1
			},
			// 车管员可关闭用车
			canManagerClose() {
				return this.detailData && this.detailData.config && this.detailData.config.managerOpen == 1
			},
			// 用车人可关闭用车
			canUserClose() {
				return this.detailData && this.detailData.config && this.detailData.config.carUserOpen == 1
			}
		},
		methods: {
			...mapMutations([
				'updateUserSelectedState'
			]),
			finishCar(){
				this.$emit('endUse')
			},
			//开始用车
			useCar(){
				this.$emit('openUseCar')
			},
			//关闭用车
			cancelUse(){
				this.$emit('closeAsk')
			},
			//车管员派车
			sendInfo(){
				this.$emit('confirmInfo')
			},
			//车管员修改乘车人
			editPassenger(){
				this.$emit('editPassenger')
			},
			//显示评论弹窗
      showChatToolFun(){
				this.$emit('showChatToolFun', {showChatTool: true, autofocus: true})
			},
			// 底部“更多按钮”的点击事件
      actionButtonClick(payload) {
        // 底部按钮点击查看流程明细
        if(payload==='getFlowSerial') {
					this.$emit('getFlowSerial')
        }
        // 底部按钮点击编辑
        if(payload==='editApprove') {
          this.$router.push({path: '/add', query: {askId: this.detail.askId, type: 'edit'}})
        }
      },
      // 点击各个审批按钮
      approveAction(payload) {
				this.$emit('approveActionStatus', payload)
        // 审批
        if(payload === 'approve') {
          if (this.isFree == 3 && this.isBranchNode) {
            this.$emit('requestNextBranchNode')
          }
				}
				// 加签
				if(payload === 'assignApprove') {
					this.$emit('updateFlowAuditUser')
				}
        this.updateUserSelectedState({type: "flowApproveDialogShow", data: true})
      },
			hideBtn() {
				this.$emit('hideIcon')
				this.$emit('update:showCancelBtn', false)
			}
		},
		watch: {
			showCancelBtn(val) {
				if(this.showConfirmBtn) {
					if(val) this.$store.commit('updateCanEdit', true)
					else this.$store.commit('updateCanEdit', false)
				}
			}
		}
	}
</script>

<style lang='scss'>
	.action-button-item {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		color: #0A1735;
		font-size: 16px;
		cursor: pointer;
		.iconfont {
			margin-right: 5px;
			font-size: 18px;
			color: rgba(166, 166, 166, 1);
			vertical-align: middle;
		}
		&.confirm-btn {
			color: #5585F0;
			.iconfont {
				color: #5585F0;
			}
		}
		&.close-btn, &.return-btn {
			color: #FF596D;
			.iconfont {
				color: #FF596D;
			}
		}
	}
</style>

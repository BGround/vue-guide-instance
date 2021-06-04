<template>
	<div class="task-approval-modal-box">
		<div class="task-approval-button">
			<span class="task-approval-text" @click="showApproval">{{options.btnText}}</span>
		</div>
		<div class="task-approval-modal" v-if="isShowModal" @click="isShowModal = false">
			<div class="task-approval-box" @click.stop="noClose">
				<div class="task-approval-title">{{options.title}}</div>
				<div class="task-approval-result-title">{{options.subTitle}}</div>
				<!-- 审批选项 -->
				<div class="task-approval-radio" v-if="radioOption.length>0">
					<qwuiRadioGroup :inline="true" @radio="radioReturn" :radio="radio">
						<qwui-radio
							v-for="(item,index) in radioOption"
							:label="item.value"
							:key="index">{{item.label}}</qwui-radio>
					</qwuiRadioGroup>
				</div>
				<!-- 下次整改截止时间 -->
				<div class="select-endApproval-time" v-if="radio==='2'">
					<span class="end-time-label">{{options.timeLabel}}</span>
					<span class="end-time-text" @click="pickerShow=true">{{timeNum}}</span>
					<timePicker :dateOnly="true" :show.sync="pickerShow" :minuteInterval="5" :defaultDate="timeNum" @confirm="confirm"></timePicker>
				</div>
				<!-- 意见输入框 -->
				<div style="margin-top: 10px;display: flex;">
					<span class="approval-comment" v-if="!showApprovalTextarea" :class="{'placeholder':approvalText==''}" @click="showTextarea">{{approvalText!=''?approvalText:placeholderText}}</span>
					<textarea class="approval-comment" ref="approvalTextarea" v-model="approvalText" v-else :maxlength="2048"
					 :placeholder="placeholderText" @blur="hideTextarea"></textarea>
				</div>
				<!-- 按钮组件 -->
				<div class="btn-group">
					<div class="cancel-btn" @click="cancelApproval">取消</div>
					<div class="comfirm-btn" @click="comfirmApproval">确定</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import qwuiRadio from '@/components/base/qwuiRadio/radio'
	import qwuiRadioGroup from '@/components/base/qwuiRadio/radio_group'
	import timePicker from '@/components/basicUI/qwuiPicker/time_picker'
	export default {
		components: {
			qwuiRadio,
			qwuiRadioGroup,
			timePicker
		},
		props: {
			options: {
				type: Object,
				default () {
					return { // 审批参数
						btnText: '审批', //显示在页面的按钮名称
						title: '子任务审批',
						subTitle: '审批结果',
						timeLabel: '下次整改截止时间',
						approvalPlacehold: '请输入评价(选填)',
						radio: ''
					}
				}
			},
			radioOption: {
				type: Array,
				default(){return []}
			},
			taskStopTime: {
				type: String,
			}
		},
		data() {
			return {
				isShowModal: false,
				radio: "", //单选默认选项
				pickerShow: false,
				timeNum: this.getDate(),
				approvalText: '',
				placeholderText: '请输入评价(选填)',
				showApprovalTextarea: false,
				selectDate: false,
			};
		},
		watch: {
			radio: {
				handler(val) {
					switch (val) {
						case '2':
							this.placeholderText = '请输入未通过原因';
							this.approvalText = '';
							this.showApprovalTextarea = false;
							break;
						case '3':
							this.placeholderText = '请输入强制关闭原因';
							this.approvalText = '';
							this.showApprovalTextarea = false;
							break;
						default:
							this.placeholderText = '请输入评价(选填)';
							this.approvalText = '';
							this.showApprovalTextarea = false;
					}
				}
			}
		},
		mounted() {
			this.placeholderText = this.options.approvalPlacehold;
			this.radio = this.options.radio?this.options.radio:'';
		},
		methods: {
			comfirmApproval() {
				let that = this;
				if(this.radio == ''){
					_.alert('提示','请选择审批结果')
					return
				}
				if(!this.selectDate && this.radio=='2'){
					_.alert('提示','请选择下次整改截止时间')
					return
				}
				if(this.approvalText==''&&this.radio!='1'){
					_.alert('提示','请输入原因')
					return
				}
				this.isShowModal = false;
				let val = {
					radio: this.radio,
					approvalText: this.approvalText,
					timeNum: this.radio == "2" ? this.timeNum : null
				}
				this.$emit('approvalComfirm', val)
			},
			cancelApproval() {
				this.isShowModal = false;
				this.radio = "",
					this.timeNum = this.getDate()
				this.showApprovalTextarea = false;
				this.approvalText = ''
			},
			showTextarea() {
				this.showApprovalTextarea = true;
				this.$nextTick(() => {
					this.$refs.approvalTextarea.focus()
					let range = this.getSelectedText(); //创建range
					range.collapseToEnd(); //光标移至最后
				})
			},
			radioReturn(val) {
				this.radio = val
			},
			confirm(temp) {
				let selectTime = new Date(temp.replace(/-/g,'/')).getTime()
				let currentTime = new Date(this.getDate().replace(/-/g,'/')).getTime()
				let taskStopTime = new Date(this.taskStopTime.replace(/-/g,'/')).getTime()
				//let currentTime = new Date().getTime();//2020-07-18 45:45:00 2020-07-18
				if(selectTime-currentTime<0){
					_.alert('提示','截止时间不能早于当前时间')
					this.selectDate = false;
					return
				}

				this.selectDate = true;
				this.timeNum = temp;
			},
			showApproval() {
				this.isShowModal = true;
			},
			noClose() {
				return
			},
			hideTextarea() {
				this.showApprovalTextarea = false;
			},
			// 兼容性处理，获取所选的对象，用于鼠标聚到文本尾部
			getSelectedText() {
				var txt = '';
				if (window.getSelection) {
					txt = window.getSelection();
				} else if (window.document.getSelection) {
					txt = window.document.getSelection();
				} else if (window.document.selection) {
					txt = window.document.selection.createRange().text;
				}
				return txt;
			},
			getDate() {
				let date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				let resetMonth = month < 10 ? '0' + month : month;
				let resetDay = day < 10 ? '0' + day : day;
				return year + '-' + resetMonth + '-' + resetDay;
			}
		}
	}
</script>

<style scoped>
	.task-approval-modal-box {}

	.task-approval-button {
		display: flex;
		justify-content: center;
		align-items: center;
		background: #fff;
		height: 46px;
	}

	.task-approval-text {
		padding: 20px;
		background: url("../../../../assets/images/ic_unright.png") no-repeat 0 center;
		background-size: 14px;
	}

	.task-approval-modal {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		position: fixed;
		width: 100%;
		top: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, .2);
		z-index: 10;
	}

	.task-approval-box {
		position: relative;
		width: 90%;
		height: 370px;
		background: #fff;
		border-radius: 10px;
		padding: 0 28px;
		box-sizing: border-box;
	}

	.task-approval-title {
		height: 50px;
		text-align: center;
		line-height: 50px;
		font-weight: bold;
		font-size: 16px;
	}

	.task-approval-result-title {
		font-size: 16px;
		font-weight: bold;
	}

	.task-approval-radio {
		box-sizing: border-box;
		padding: 10px 0;
		height: 50px;
	}

	.select-endApproval-time {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 16px;
	}

	.end-time-label {
		flex: 1;
		color: #000000;
	}

	.end-time-text {
		flex: 1;
		color: #666;
		background: #eeeeee;
		text-align: center;
	}

	.btn-group {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 50px;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		border-top: 1px solid #eee;
		font-size: 18px;
		font-weight: bold;
		text-align: center;
	}

	.cancel-btn {
		flex: 1;
		height: 49px;
		line-height: 49px;
		border-right: 1px solid #eee;
		color: #999999;
	}

	.comfirm-btn {
		flex: 1;
		height: 49px;
		line-height: 49px;
		color: #2f86dc;
	}

	.approval-comment {
		display: block;
		padding: 0 8px;
		line-height: 25px;
		height: 146px;
		background: #eee;
		width: 100%;
		border: 0 none;
		font-size: 14px;
		flex: 1;
		overflow: auto;
	}

	.placeholder {
		color: #bbbbbb;
	}
</style>

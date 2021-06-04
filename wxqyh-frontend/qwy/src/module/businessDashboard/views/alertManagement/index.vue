<template>
	<div class="enterprise-info">
		<div class="board">
			<div class="board__header">
				<div class="board__header__left">
					<h3 class="board__title">预警管理</h3>
					<div class="board__date">
						<el-date-picker v-model="selectedDate" type="month" format="yyyy-MM" :picker-options="expireTimeOption"
						 :clearable="false" @change="selectDate" placeholder="选择日期">
						</el-date-picker>
					</div>
				</div>
				<div class="board__header__right">
					<div class="board__tab">
						<el-tabs v-model="activeTabName" @tab-click="handleClickTab">
							<el-tab-pane v-for="(item, index) in tabsOptions" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
						</el-tabs>
					</div>
					<div class="board__second__tab">
						<div class="board__second__tab__item" :class="{'active': secondTabName === item.name}" v-for="(item,index) in secondTabsOptons"
						 :key="index" @click="secondTabName = item.name">{{item.label}}</div>
					</div>
					<div class="board__info">
						<div class="board__info__date">更新日期：{{updateTime}}</div>
						<div class="board__info__date">更 新 人：{{userName}}</div>
					</div>
				</div>
			</div>
			<component :is="secondTabName" :config="starConfig"></component>
		</div>
	</div>
</template>

<script>
	import projectOverview from './projectOverView'
	import exception from './exception'
	import region from './region'
	import alertManagementApi from '@/module/businessDashboard/api/alertManagement'
	export default {
		components: {
			projectOverview,
			exception,
			region
		},
		data() {
			return {
				maxUpdateTimeUser: {},
				userName: '',
				updateTime: '',
				expireTimeOption: {
					disabledDate(date) {
						return date.getTime() > Date.now();
					}
				},
				tabsOptions: [{
					label: '红色预警',
					name: 'red'
				}, {
					label: '黄色预警',
					name: 'yellow'
				}],
				secondTabsOptons: [{
					label: '项目总览',
					name: 'projectOverview'
				}, {
					label: '分大区',
					name: 'region'
				}, {
					label: '分异常类型',
					name: 'exception'
				}],
				activeTabName: 'red',
				secondTabName: 'projectOverview',
				selectedDate: new Date().toISOString().substr(0, 7),
				starConfig: {},
				selectedYear: new Date().getFullYear(),
				selectedMonth: new Date().getMonth() + 1,
			};
		},
		created() {
			this.init()
		},
		watch: {
			activeTabName: {
				handler(newVal) {
					this.secondTabName = 'projectOverview';
					this.init()
				},
				deep: true,
			},
			secondTabName: {
				handler(newVal) {
					this.init()
				},
				deep: true,
			},
			maxUpdateTimeUser: {
				handler(data) {
					this.userName = data.updateUser || '';
					if('updateTime' in data){
						let date = new Date(data.updateTime.time);
						this.updateTime = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
					}else{
						this.updateTime = ''
					}
				},
				deep: true,
			}
		},
		methods: {
			init() {
				let that = this;
				let params = {
					year: that.selectedYear,
					month: that.selectedMonth,
					typeWarn: that.activeTabName === 'red' ? encodeURI('红色') : encodeURI('黄色')
				}
				if (this.secondTabName === 'projectOverview') {
					this.selectStatisticsByProject(params);
				} else if (this.secondTabName === 'region') {
					this.selectStatisticsByArea(params);
				} else if (this.secondTabName === 'exception') {
					this.selectStatisticsByType(params);
				}
			},
			//获取项目总览
			selectStatisticsByProject(params) {
				let that = this;
				alertManagementApi.selectStatisticsByProject(params).then(res => {
					if (res) {
						that.$set(that, 'starConfig', res);
						if ('maxUpdateTimeUser' in res) {
							that.$set(that, 'maxUpdateTimeUser', res.maxUpdateTimeUser)
						}else{
							that.$set(that,'maxUpdateTimeUser',{})
						}
					}
				})
			},
			//获取分大区
			selectStatisticsByArea(params) {
				let that = this;
				alertManagementApi.selectStatisticsByArea(params).then(res => {
					if (res) {
						that.$set(that, 'starConfig', res);
						if ('maxUpdateTimeUser' in res) {
							that.$set(that, 'maxUpdateTimeUser', res.maxUpdateTimeUser)
						}else{
							that.$set(that,'maxUpdateTimeUser',{})
						}
					}
				})
			},
			//获取分异常类型
			selectStatisticsByType(params) {
				let that = this;
				alertManagementApi.selectStatisticsByType(params).then(res => {
					if (res) {
						that.$set(that, 'starConfig', res);
						if ('maxUpdateTimeUser' in res) {
							that.$set(that, 'maxUpdateTimeUser', res.maxUpdateTimeUser)
						}else{
							that.$set(that,'maxUpdateTimeUser',{})
						}

					}
				})
			},
			// tab切换选择
			handleClickTab(tab, event) {

			},
			// 年月选择
			selectDate(e) {
				let date = new Date(e)
				let year = date.getFullYear();
				let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
				this.selectedYear = year;
				this.selectedMonth = date.getMonth() + 1;
				this.$set(this, 'selectedDate', year + '-' + month)
				this.init();
			},
		},
	}
</script>

<style lang="scss" scoped>
	@import '~@/module/businessDashboard/scss/common/board.scss';

	#changeEnterpriseInfo {
		height: 520px;
	}

	.board__second__tab {
		display: flex;
		align-items: center;
		width: 300px;
		height: 30px;
		border: 1px solid #ccc;
		margin-right: 16px;
		border-radius: 4px;
		box-sizing: border-box;
		font-size: 14px;

		.board__second__tab__item {
			display: flex;
			justify-content: center;
			align-items: center;
			flex: 1;
			height: 100%;
			text-align: center;
			color: #333333;
		}

		.active {
			background: #D1031C;
			color: #fff;
		}
	}
</style>

<template>
	<div class="enterprise-info">
		<div class="board">
			<div class="board__header">
				<div class="board__header__left">
					<h3 class="board__title">人员信息</h3>
					<div class="board__date">
						<!-- :picker-options="expireTimeOption" -->
						<el-date-picker v-model="selectedDate" type="month" format="yyyy-MM" :clearable="false" @change="selectDate"
						 placeholder="选择日期">
						</el-date-picker>
					</div>
				</div>
				<div class="board__header__right">
					<div class="board__tab">
						<el-tabs v-model="activeTabName" @tab-click="handleClickTab">
							<el-tab-pane v-for="(item, index) in tabsOptions" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
						</el-tabs>
					</div>
					<div class="board__info">
						<div class="board__info__date">更新日期：{{updateTime}}</div>
						<div class="board__info__date">更 新 人：{{updateUser}}</div>
					</div>
				</div>
			</div>
			<component :is="activeTabName" :config="starConfig"></component>
		</div>
	</div>
</template>

<script>
	import allView from './allView'
	import month from './month'
	import subDistributor from  './subDistributor'
	import region from  './region'
	import personnelInfoApi from '@/module/businessDashboard/api/personnelInfoApi'
	export default {
		components: {
			allView,
			month,
			subDistributor,
			region
		},
		data() {
			return {
				expireTimeOption: {
					disabledDate(date) {
						return date.getTime() > Date.now();
					}
				},
				tabsOptions: [{
					label: '总览',
					name: 'allView'
				}, {
					label: '分月',
					name: 'month'
				}, {
					label: '分大区',
					name: 'region'
				}, {
					label: '分经销商',
					name: 'subDistributor'
				}],
				activeTabName: 'allView',
				selectedDate: new Date().toISOString().substr(0, 7),
				starConfig: {},
				selectedYear: new Date().getFullYear(),
				selectedMonth: new Date().getMonth() + 1,
				updateUser: '',
				updateTime: '',
			};
		},
		created() {
			this.init()
		},
		watch: {
			activeTabName: {
				handler(newVal) {
					this.init()
				},
				deep: true,
			},
		},
		methods: {
			init(){
				let that = this;
				let params = {
					year: that.selectedYear,
					month: that.selectedMonth
				}
				if(this.activeTabName === 'allView'){
					this.overviewHome(params)
					this.homeChart(params)
					this.getLastUpdate()
				}else if(this.activeTabName === 'month'){
					this.overviewHome(params)
					this.monthProgress(params)
					this.getLastUpdate()
				}else if(this.activeTabName === 'region'){
					this.regionalInfo(params)
					this.getLastUpdate()
				}else if(this.activeTabName === 'subDistributor'){
					this.dealerRank(params)
					this.getLastUpdate()
				}
			},
			//获取项目总览和分月左边数据
			overviewHome(params) {
				let that = this;
				personnelInfoApi.overviewHome(params).then(res => {
					if (res) {
						that.$set(that.starConfig,'leftObj',res);
					}
				})
			},
			//获取项目总览图表数据
			homeChart(params){
				let that = this;
				personnelInfoApi.homeChart(params).then(res => {
					if (res) {
						that.$set(that.starConfig,'chartData',res.allChartList);
					}
				})
			},
			//获取分大区
			regionalInfo(params) {
				let that = this;
				personnelInfoApi.regionalInfo(params).then(res => {
					if (res) {
						that.$set(that,'starConfig',res);
					}
				})
			},
			//获取分月图表数据
			monthProgress(params){
				let that = this;
				personnelInfoApi.monthProgress(params).then(res => {
					if (res) {
						that.$set(that.starConfig,'chartData',res);
					}
				})
			},
			//获取分经销商
			dealerRank(params) {
				let that = this;
				personnelInfoApi.dealerRank(params).then(res=>{
					if(res){
						that.$set(that,'starConfig',res)
					}
				})
			},
			// tab切换选择
			handleClickTab(tab, event) {

			},
			getLastUpdate(){
				personnelInfoApi.getLastUpdate().then(res=>{
					this.updateUser = res.updateUser || '';
					this.updateTime = res.updateTime || '';
				})
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
</style>

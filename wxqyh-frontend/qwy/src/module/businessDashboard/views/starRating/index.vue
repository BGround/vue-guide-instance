<template>
	<div class="enterprise-info">
		<div class="board">
			<div class="board__header">
				<div class="board__header__left">
					<h3 class="board__title">星级评估</h3>
					<div class="board__date">
						<el-date-picker v-if="activeTabName === 'overallSituation'" v-model="selectedDate" type="month" :picker-options="expireTimeOption"
						 format="yyyy-MM" :clearable="false" @change="selectDate" placeholder="选择日期" key="overallSituation">
						</el-date-picker>

						<quarterPicker v-if="activeTabName === 'indexAnalysis'" :defaultValue="defaultValue" @getValue="getQuarter"></quarterPicker>

						<el-date-picker v-if="activeTabName === 'subDistributor'" v-model="subSelectedDate" type="year" :picker-options="expireTimeOption"
						 :clearable="false" @change="subSelectDate" placeholder="选择日期" key="subDistributor">
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
			<component :is="activeTabName" :starConfig="starConfig"></component>
		</div>
	</div>
</template>

<script>
	import overallSituation from "./overallSituation";
	import indexAnalysis from "./indexAnalysis";
	import subDistributor from './subDistributor';
	import quarterPicker from './components/quarterPicker';
	import starRatingApi from '@/module/businessDashboard/api/starRating.js'
	export default {
		components: {
			overallSituation,
			indexAnalysis,
			subDistributor,
			quarterPicker,
		},
		data() {
			return {
				expireTimeOption: {
					disabledDate(date) {
						return date.getTime() > Date.now();
					}
				},
				tabsOptions: [{
					label: '整体情况',
					name: 'overallSituation'
				}, {
					label: '指标分析',
					name: 'indexAnalysis'
				}, {
					label: '分经销商',
					name: 'subDistributor'
				}],
				activeTabName: 'overallSituation',
				selectedDate: new Date().toISOString().substr(0, 7),
				subSelectedDate: new Date().toISOString().substr(0, 4),
				selectedYear: new Date().getFullYear(),
				selectedMonth: new Date().getMonth() + 1,
				starConfig: {

				},
				defaultValue: '',
				quarter: 0,
				updateUser: '',
				updateTime: '',
			};
		},
		created() {
			this.defaultquarter()
		},
		watch: {
			activeTabName: {
				handler(newVal) {
					this.init()
				},
				deep: true,
				immediate: true,
			}
		},
		methods: {
			// tab切换选择
			handleClickTab(tab, event) {

			},
			// 初始化
			init() {
				let params = this.paramsFormat();
				if (this.activeTabName === 'overallSituation') {
					this.getAllSituation(params)
				} else if (this.activeTabName === 'indexAnalysis') {
					this.getIndexAnalysis(params)
				} else if (this.activeTabName === 'subDistributor') {
					this.getDealerSituation(params)
				}
			},
			// 整体情况请求接口
			getAllSituation(params) {
				let that = this;
				starRatingApi.getAllSituation(params)
					.then(data => {
						if (data) {
							that.$set(that.starConfig, 'allSituation', data);
							that.$set(that.starConfig, 'year', that.selectedYear);
							that.updateUser = data.lastUpdateVO.updateUser || '';
							that.updateTime = data.lastUpdateVO.updateTime || '';
						}
					})
			},
			// 指标分析
			getIndexAnalysis(params) {
				let that = this;
				starRatingApi.getIndexAnalysis(params)
					.then(data => {
						if (data) {
							that.$set(that.starConfig, 'indexAnalysis', data.objectiveVOS);
							that.$set(that.starConfig, 'year', params.year);
							that.updateUser = data.lastUpdateVO.updateUser || '';
							that.updateTime = data.lastUpdateVO.updateTime || '';
						}
					})
			},
			// 分经销商
			getDealerSituation(params) {
				let that = this;
				starRatingApi.getDealerSituation(params)
					.then(data => {
						if (data) {
							that.$set(that.starConfig, 'dealerSituation', data);
							that.$set(that.starConfig, 'year', params.year);
							that.updateUser = data.lastUpdateVO.updateUser || '';
							that.updateTime = data.lastUpdateVO.updateTime || '';
						}
					})
			},
			// 季度选择
			getQuarter(res) {
				this.defaultValue = res[0];
				this.quarter = res[1];
				this.init();
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
			// 年选择
			subSelectDate(e) {
				let date = new Date(e)
				let year = date.getFullYear().toString();
				this.subSelectedDate = year;
				this.init();
			},
			// 格式化参数
			paramsFormat() {
				let params = {};
				if (this.activeTabName === 'overallSituation') {
					if (this.selectedMonth <= 6) {
						params.month = 6;
					} else {
						params.month = 12;
					}
					params.year = this.selectedYear;
				} else if (this.activeTabName === 'indexAnalysis') {
					params.quarter = this.quarter;
					params.year = this.defaultValue.substr(0, 4);
				} else if (this.activeTabName === 'subDistributor') {
					params.year = this.subSelectedDate;
				}
				return params
			},
			// 季度默认时间格式化
			defaultquarter() {
				let that = this;
				let date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let quarter = this.quarterFormat(month);
				this.quarter = quarter;
				switch (quarter) {
					case 1:
						that.defaultValue = year + '01-' + year + '03';
						break;
					case 2:
						that.defaultValue = year + '04-' + year + '06';
						break;
					case 3:
						that.defaultValue = year + '07-' + year + '09';
						break;
					case 4:
						that.defaultValue = year + '10-' + year + '12';
						break;
				}
			},
			// 季度格式化
			quarterFormat(month) {
				let quarter = 0;
				switch (month) {
					case 1:
					case 2:
					case 3:
						quarter = 1;
						break;
					case 4:
					case 5:
					case 6:
						quarter = 2;
						break;
					case 7:
					case 8:
					case 9:
						quarter = 3;
						break;
					case 10:
					case 11:
					case 12:
						quarter = 3;
						break;
				}
				return quarter
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import '~@/module/businessDashboard/scss/common/board.scss';

	#changeEnterpriseInfo {
		height: 520px;
	}
</style>

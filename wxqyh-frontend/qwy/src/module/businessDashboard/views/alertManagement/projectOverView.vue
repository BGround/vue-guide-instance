<template>
	<div class="general">
		<div class="board__content">

			<div class="board__content__left">
				<div class="board__card overview">
					<div class="overview__top">
						<h3 class="overview__title">整体情况</h3>
						<h3 class="overview__data">
							<div class="overview__data__value">{{warningWholeTotals}}</div>
							<div class="overview__data__label">预警家次</div>
						</h3>
					</div>
					<div class="overview__bottom1">
						<div class="overview__legend">
							<div id="projectOverViewpieChart" class="pieChart"></div>
							<div class="overview__legend_item1">
								<div class="overview__legend_item1_content">
									<div class="label">陈述</div>
									<div class="value">{{stateWholeTotals}}家次</div>
								</div>
								<div class="overview__legend_item1_content">
									<div class="label">整改完成</div>
									<div class="value">{{finishWholeTotals}}家次</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="board__card mt16 overview">
					<div class="overview__top">
						<h3 class="overview__title">本月情况</h3>
						<h3 class="overview__data">
							<div class="overview__data__value">{{warningMonthTotals}}</div>
							<div class="overview__data__label">预警家次</div>
						</h3>
					</div>
					<div class="overview__bottom">
						<div class="overview__legend">
							<div class="overview__legend__item">
								<div class="legend__label">陈述</div>
								<div class="legend__value">{{stateMonthTotals}}家</div>
							</div>
							<div class="overview__legend__item orange">
								<div class="legend__label">整改中</div>
								<div class="legend__value">{{inProgressMonthTotals}}家</div>
							</div>
							<div class="overview__legend__item red">
								<div class="legend__label">未完成整改</div>
								<div class="legend__value">{{notFinishMonthTotals}}家</div>
							</div>
						</div>
					</div>
				</div>

				<div class="board__card mt16 desc">
					<div class="board__card__header">
						本周变化
					</div>
					<div class="desc__content">
						<div v-if="newWeekChange" v-html="newWeekChange"></div>
						<div v-else>暂无</div>
					</div>
				</div>
			</div>

			<div class="board__content__right">
				<projectOverViewTable :listWarning="listWarning" :listState="listState" :listProgress="listProgress"></projectOverViewTable>
			</div>

		</div>
	</div>
</template>

<script>
	let chartOption = {
		series: {
			name: '彩虹仪表盘',
			type: "gauge",
			startAngle: 180,
			endAngle: 0,
			radius: "140%",
			center: ["40%", "80%"],
			axisLine: {
				lineStyle: {
					width: 12,
					color: [
						[0, '#5B8FF9'],
						[1, '#eef2fd']
					]
				}
			},
			axisTick: {
				show: false //小刻度
			},
			axisLabel: {
				show: false,
			},
			splitLine: {
				show: false
			},
			pointer: {
				show: false,
			},
			title: {
				color: '#666',
				fontSize: 10,
				offsetCenter: [0, "-50%"],
			},
			detail: {
				show: true,
				formatter: '{value}%',
				offsetCenter: ['0', '-10%'],
				textStyle: {
					fontSize: 14,
					color: '#333',
					fontWeight: 'bold',
				}
			},
			data: [{
				value: 0,
				name: '完成率',
			}]
		}
	}
	import echarts from 'echarts'
	import projectOverViewTable from './components/projectOverViewTable'
	export default {
		components: {
			projectOverViewTable
		},
		data() {
			return {
				warningWholeTotals: 0, //预警家次
				stateWholeTotals: 0, //陈述家次
				finishWholeTotals: 0, //整改完成家次
				warningMonthTotals: 0, //预警家次
				stateMonthTotals: 0,  //陈述家次
				inProgressMonthTotals: 0, //整改中家次
				notFinishMonthTotals: 0, //未完成整改家次
				newWeekChange: '',
				listWarning: [], //预警
				listState: [], //陈述
				listProgress: [], //整改
			};
		},
		props: {
			config: {
				type: Object,
				required: true,
			}
		},
		watch: {
			config: {
				deep: true,
				immediate: true,
				handler: function(data) {
					this.setData(data);
					this.setChartOptions(data)
					this.$nextTick(()=>{
						this.initChart()
					})
				}
			}
		},
		methods: {
			setData(data) {
				this.warningWholeTotals = data.warningWholeTotals*1 || 0; //预警家次
				this.stateWholeTotals = data.stateWholeTotals*1 || 0; //陈述家次
				this.finishWholeTotals = data.finishWholeTotals*1 || 0; //整改完成家次
				this.warningMonthTotals = data.warningMonthTotals*1 || 0; //预警家次
				this.stateMonthTotals = data.stateMonthTotals*1 || 0;  //陈述家次
				this.inProgressMonthTotals = data.inProgressMonthTotals*1 || 0; //整改中家次
				this.notFinishMonthTotals = data.notFinishMonthTotals*1 || 0; //未完成整改家次
				this.newWeekChange = data.newWeekChange || ''
				this.$set(this,'listWarning',data.listWarning); //预警
				this.$set(this,'listState',data.listState); //陈述
				this.$set(this,'listProgress',data.listProgress); //整改
			},
			setChartOptions(data){
				let finishProportion = data.finishProportion || 0;
				chartOption.series.axisLine.lineStyle.color = [
					[finishProportion/100, '#5B8FF9'],
					[1, '#eef2fd']
				];
				chartOption.series.data = [{
					value: finishProportion,
					name: '完成率',
				}];
			},
			resetChartSize() {
				this.chart.resize()
			},

			initChart() {
				const dom = document.getElementById('projectOverViewpieChart');
				this.chart = echarts.init(dom);
				this.chart.setOption(chartOption)
				window.addEventListener('resize', this.resetChartSize)
			},
		},
		mounted() {
			this.initChart()
		},
	}
</script>

<style lang="scss" scoped>
	@import '~@/module/businessDashboard/scss/common/board.scss';

	.general {
		.overview {
			padding: 32px 24px 0;

			.overview__top {
				display: flex;
				border-bottom: 1px solid #E6E6E6;
				align-items: flex-start;
				padding-bottom: 17px;
			}

			.overview__title {
				margin-right: auto;
				height: 26px;
				font-size: 20px;
				font-weight: bold;
				line-height: 20px;
				color: rgba(20, 30, 40, 1);
			}

			.overview__data {
				text-align: right;

				.overview__data__value {
					height: 42px;
					font-size: 32px;
					font-weight: bold;
					line-height: 42px;
					color: rgba(195, 23, 37, 1);
					margin-bottom: 4px;
				}

				.overview__data__label {
					height: 19px;
					font-size: 14px;
					font-weight: 400;
					line-height: 19px;
					color: rgba(102, 102, 102, 1);
				}
			}

			.overview__bottom {
				height: 70px;
			}

			.overview__bottom1 {
				height: 80px;
			}

			.overview__legend_item1 {
				flex: 1;

				.overview__legend_item1_content {
					display: flex;
					align-items: center;

					.label {
						width: 50%;
						text-align: right;
						color: #666;
					}

					.value {
						width: 50%;
						text-align: center;
						color: #333;
						font-weight: bold;
					}
				}
			}

			.overview__legend {
				height: 100%;
				display: flex;
				align-items: center;

				.overview__legend__item {
					flex: 1;

					&.orange {
						.legend__label {
							&:before {
								background: #FD9707;
							}
						}
					}

					&.red {
						.legend__label {
							&:before {
								background: #E63752;
							}
						}
					}
				}

				.legend__label {
					font-size: 14px;
					font-weight: 400;
					color: rgba(102, 102, 102, 1);

					&:before {
						content: '';
						height: 10px;
						width: 10px;
						background: rgba(91, 143, 249, 1);
						display: inline-block;
						margin-right: 8px;
					}
				}

				.legend__value {
					text-indent: 1.5em;
					font-size: 14px;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
				}
			}
		}

		.desc__content {
			padding: 16px 24px;
			height: 266px;

			.desc__item {
				display: flex;
				align-items: flex-start;
				margin-bottom: 10px;
			}

			.desc__item__label {
				height: 19px;

				font-size: 14px;
				font-weight: bold;
				line-height: 19px;
				color: rgba(51, 51, 51, 1);
				margin-right: 8px;
				flex-basis: 77px;
				flex-shrink: 0;
			}

			.desc__item__value {
				font-size: 14px;
				font-weight: 400;
				line-height: 22px;
				color: rgba(102, 102, 102, 1);
			}
		}
	}

	.pieChart {
		width: 50%;
		height: 100%;
	}
</style>

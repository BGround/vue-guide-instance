<template>
	<div class="region">
		<div class="board__content">

			<div class="board__content__left">
				<div class="board__card">
					<div class="board__card__header">
						整体情况
					</div>
					<div class="situation">
						<div class="situation__content__box">
							<div class="situation__content__title">关键岗位</div>
							<div class="situation__row">
								<div class="situation__col">TOP3战区:</div>
								<div class="situation__col situation__item" v-for="(item,index) in keyPostTOPThreeList" :key="'keyPostTOP'+index">{{item.warZone}}</div>
							</div>
							<div class="situation__row">
								<div class="situation__col">BOT3战区:</div>
								<div class="situation__col situation__item" v-for="(item,index) in keyPostBOTThreeList" :key="'keyPostBOT'+index">{{item.warZone}}</div>
							</div>
						</div>

						<div class="situation__content__box mt16">
							<div class="situation__content__title">核心业务岗位</div>
							<div class="situation__row">
								<div class="situation__col">TOP3战区:</div>
								<div class="situation__col situation__item" v-for="(item,index) in businessPostTOPThreeList" :key="'businessPostTOP'+index">{{item.warZone}}</div>
							</div>
							<div class="situation__row">
								<div class="situation__col">BOT3战区:</div>
								<div class="situation__col situation__item" v-for="(item,index) in businessPostBOTThreeList" :key="'businessPostBOT'+index">{{item.warZone}}</div>
							</div>
						</div>
					</div>
				</div>

				<div class="board__card mt16 desc">
					<div class="board__card__header">
						本周变化
					</div>
					<div class="desc__content">
						<div class="desc__content__box">
							<div class="desc__contetn__title">1.关键岗位配备率</div>
							<div class="mt10">
								<span v-if="keyPostHighList.length>0">最高</span>
								<span v-for="(item,index) in keyPostHighList" :key="'keyPostHighList'+index">{{item.warZone}}{{item.actualRatio}},</span>
								<span v-if="keyPostLowList.length>0">最低</span>
								<span v-for="(item,index) in keyPostLowList" :key="'keyPostLowList'+index">{{item.warZone}}{{item.actualRatio}},</span>
							</div>
						</div>
						<div class="desc__content__box mt10">
							<div class="desc__contetn__title">2.核心业务岗位配备率</div>
							<div class="mt10">
								<span v-if="businessPostHighList.length>0">最高</span>
								<span v-for="(item,index) in businessPostHighList" :key="'businessPostHighList'+index">{{item.warZone}}{{item.actualRatio}},</span>
								<span v-if="businessPostLowList.length>0">最低</span>
								<span v-for="(item,index) in businessPostLowList" :key="'businessPostLowList'+index">{{item.warZone}}{{item.actualRatio}},</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="board__content__right">
				<div class="chart">
					<div class="chart__item" v-for="(item, index) in areaOptions" :key="index">
						<div class="chart__item__label">{{item.name}}</div>
						<div class="chart__item__wrapper">
							<moreBarChart ref="chart" :option="item"></moreBarChart>
						</div>
					</div>

					<div class="chart__item x">
						<div class="chart__item__label"></div>
						<div class="chart__item__wrapper">
							<div id="marketDisciplineChat"></div>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	const chartOption = {
		color: ['#5B8FF9', '#73DEB3', '#FD9707'],
		legend: {
			data: ['应配备人数', '实配备人数', '配备率'],
			bottom: 12,
			left: 'center',
			itemHeight: 13,
			itemWidth: 13,
		},
		tooltip: {
			backgroundColor: '#ffffff',
			textStyle: {
				color: '#2781DB'
			},
			trigger: 'item',
			extraCssText: 'box-shadow:0px 2px 3px rgba(0,0,0,0.1);',
			formatter: '{a} <br/>{b}: {c}'
		},
		grid: {
			top: 0,
			left: 25,
			right: 0,
			bottom: 40,
			containLabel: true
		},
		xAxis: {
			type: 'category',
			data: [],
			axisLabel: {
				// 刻度值
				interval: function(index, value) {
					// 如果跳过则返回 false。
					return true
				},
				textStyle: {
					color: function(value, index) {
						return '#999999'
					}
				},
				showMaxLabel: true // 显示最后一个
			},
			axisTick: {
				// 刻度
				show: false
			},
			axisLine: {
				// 轴线
				lineStyle: {
					color: '#DBDBDB'
				}
			},
			splitLine: {
				// 分割线
				lineStyle: {
					color: '#E6E6E6',
					type: 'dashed'
				}
			}
		},
		yAxis: {
			axisTick: {
				// 刻度
				show: false
			},
			axisLine: {
				// 轴线
				lineStyle: {
					color: '#DBDBDB'
				},
				show: false
			},
			splitLine: {
				// 分割线
				lineStyle: {
					color: '#E6E6E6',
					type: 'dashed'
				}
			}
		},
		series: [{
				name: '应配备人数',
				type: 'bar',
				data: [],
				smooth: true,
				showSymbol: false,
				lineStyle: {
					width: 2,
					shadowColor: 'rgba(91,143,249,0.5)',
					shadowBlur: 2,
					shadowOffsetY: 4
				},
			},
			{
				name: '实配备人数',
				type: 'bar',
				data: [],
				smooth: true,
				showSymbol: false,
				lineStyle: {
					width: 2,
					shadowColor: 'rgba(91,143,249,0.5)',
					shadowBlur: 2,
					shadowOffsetY: 4
				},
			},
			{
				name: '配备率',
				type: 'line',
				data: [],
				smooth: true,
				showSymbol: false,
				lineStyle: {
					width: 2,
					shadowColor: 'rgba(230,55,82,0.5)',
					shadowBlur: 2,
					shadowOffsetY: 4
				},
			}
		]
	}
	import echarts from 'echarts'
	import moreBarChart from './components/moreBarChart'
	export default {
		components: {
			moreBarChart
		},
		data() {
			return {
				chart: null,
				selectedYear: null,
				markStar: {
					area: '',
					total: 0,
				},
				areaOptions: [],
				generalChange: '',
				chartId: 'marketDisciplineChat',
				keyPostTOPThreeList: [],
				keyPostBOTThreeList: [],
				businessPostTOPThreeList: [],
				businessPostBOTThreeList: [],
				keyPostHighList: [],
				keyPostLowList: [],
				businessPostHighList: [],
				businessPostLowList: [],
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
				// immediate: true,
				handler(data) {
					this.setData(data)
					this.chartOptions(data.postTypeVOList, data.postVOList,data.warZoneList)
					this.$nextTick(() => {
						this.initChart()
					})
				}
			}
		},
		mounted() {
			this.initChart()
		},
		methods: {
			resetChartSize() {
				this.chart.resize()
			},

			setData(data) {
				if (data) {
					this.$set(this, 'keyPostTOPThreeList', data.keyPostTOPThreeList);
					this.$set(this, 'keyPostBOTThreeList', data.keyPostBOTThreeList);
					this.$set(this, 'businessPostTOPThreeList', data.businessPostTOPThreeList);
					this.$set(this, 'businessPostBOTThreeList', data.businessPostBOTThreeList);
					this.$set(this, 'keyPostHighList', data.keyPostHighList);
					this.$set(this, 'keyPostLowList', data.keyPostLowList);
					this.$set(this, 'businessPostHighList', data.businessPostHighList);
					this.$set(this, 'businessPostLowList', data.businessPostLowList);
				} else {
					this.$set(this, 'keyPostTOPThreeList', []);
					this.$set(this, 'keyPostBOTThreeList', []);
					this.$set(this, 'businessPostTOPThreeList', []);
					this.$set(this, 'businessPostBOTThreeList', []);
					this.$set(this, 'keyPostHighList', []);
					this.$set(this, 'keyPostLowList', []);
					this.$set(this, 'businessPostHighList', []);
					this.$set(this, 'businessPostLowList', []);
				}
			},

			chartOptions(areaShow = [], areaSale = [],warZoneList = []) {
				chartOption.xAxis.data = warZoneList;
				const showTypes = {}
				areaShow.forEach((item) => {
					if (typeof showTypes[item.postType] === 'undefined') {
						showTypes[item.postType] = [item]
					} else {
						showTypes[item.postType].push(item)
					}
				})

				let showTypesArr = [];
				Object.keys(showTypes).forEach(key => {
					let showTypesObj = {};
					showTypesObj['name'] = key;
					showTypesObj['allocation'] = warZoneList.map((warZone) => {
						const target = showTypes[key].find(item => item.warZone === warZone)
						return target && target.allocation || 0
					});
					showTypesObj['realPeople'] = warZoneList.map((warZone) => {
						const target = showTypes[key].find(item => item.warZone === warZone)
						return target && target.realPeople || 0
					});
					showTypesObj['actualRatio'] = warZoneList.map((warZone) => {
						const target = showTypes[key].find(item => item.warZone === warZone)
						return target && target.actualRatio || 0
					});
					showTypesArr.push(showTypesObj)
				})
				const saleTypes = {}
				areaSale.forEach((item) => {
					if (typeof saleTypes[item.post] === 'undefined') {
						saleTypes[item.post] = [item]
					} else {
						saleTypes[item.post].push(item)
					}
				}) 
				let saleTypesArr = [];
				Object.keys(saleTypes).forEach(key => {
					let saleTypesObj = {};
					saleTypesObj['name'] = key;
					saleTypesObj['allocation'] = warZoneList.map((warZone) => {
						const target = saleTypes[key].find(item => item.warZone === warZone)
						return target && target.allocation || 0
					});
					saleTypesObj['realPeople'] = warZoneList.map((warZone) => {
						const target = saleTypes[key].find(item => item.warZone === warZone)
						return target && target.realPeople || 0
					});
					saleTypesObj['actualRatio'] = warZoneList.map((warZone) => {
						const target = saleTypes[key].find(item => item.warZone === warZone)
						return target && target.actualRatio || 0
					});
					saleTypesArr.push(saleTypesObj)
				})
				// 合并数据
				let areas = []
				areas = areas.concat(showTypesArr, saleTypesArr);
				this.$set(this, 'areaOptions', areas)
			},

			initChart() {
				const dom = document.getElementById(this.chartId)
				this.chart = echarts.init(dom);
				this.chart.setOption(chartOption)
				window.addEventListener('resize', this.resetChartSize)
				this.chart.on('legendselectchanged', (event) => {
					this.$refs['chart'].forEach((chart) => {
						chart.legendToggleSelect(event.name)
					})
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	@import '~@/module/businessDashboard/scss/common/board.scss';

	.region {
		.board__card {
			min-height: 240px;
		}

		.situation {
			padding: 16px 25px 16px;

			.situation__content__box {
				.situation__content__title {
					font-weight: bold;
				}

				.situation__row {
					display: flex;
					margin-top: 10px;

					.situation__col {
						width: 25%
					}

					.situation__item {
						color: #666;
					}
				}

			}
		}

		.change {
			padding: 16px 24px;

			.change__item {
				height: 76px;
				box-sizing: border-box;

				.change__item__content {
					display: flex;
					align-items: center;
					height: 100%;

					.change__item__content__title {
						font-size: 14px;
						width: 60px;
						font-weight: bold;
						color: #333;
					}

					.change__item__content__right {
						flex: 1;

						.right__item {
							width: 100%;
							display: flex;
							justify-content: space-between;
							align-items: center;
						}

						.tall,
						.area__name,
						.strip,
						.strip_item,
						.tall__num {
							display: inline-block;
							color: #666;
							font-size: 14px;
						}

						.strip {
							position: relative;
							width: 118px;
							height: 8px;
							background: rgba(91, 143, 249, .1);

							.strip_item {
								position: absolute;
								top: 0;
								left: 0;
								width: 80%;
								height: 8px;
								background: rgba(91, 143, 249, 1);
							}
						}

						.strip1 {
							background: rgba(230, 55, 82, .1);

							.strip_item {
								background: rgba(230, 55, 82, 1);
							}
						}

						.strip2 {
							background: rgba(117, 133, 162, .1);

							.strip_item {
								background: rgba(117, 133, 162, 1);
							}
						}
					}
				}
			}
		}

		.desc__content {
			padding: 16px 24px;

			.desc__content__box {
				.desc__contetn__title {
					font-weight: bold;
				}
			}
		}

		.board__content__right {
			min-height: 500px;
		}

		.chart {
			padding-bottom: 20px;
			height: 100%;
			display: flex;
			flex-direction: column;
			background: #F7F7F7;
			justify-content: flex-end;
			box-sizing: border-box;

			.chart__item {
				justify-content: space-around;
				flex-basis: 80px;
				flex-grow: 1;
				flex-shrink: 0;
				display: flex;
				align-items: center;
				text-align: center;

				&.x {
					flex-basis: 48px;
					flex-grow: 0;
				}

				.chart__item__label {
					flex-basis: 100px;
					flex-shrink: 0;
				}

				.chart__item__wrapper {
					flex-grow: 1;
					height: 100%;
					padding-right: 50px;
				}
			}
		}
	}

	.border__bottom {
		border-bottom: 1px solid #E6E6E6;
	}

	#marketDisciplineChat {
		height: 60px;
	}
</style>

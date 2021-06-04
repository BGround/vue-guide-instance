<template>
	<div class="region">
		<div class="board__content">

			<div class="board__content__left">
				<div class="board__card">
					<div class="board__card__header">
						本月进度
					</div>
					<div class="situation">
						<div class="situation__content border__bottom">
							<div class="situation__row">
								<div class="situation__col">
									<div class="situation__table__title">关键岗位</div>
								</div>
								<div class="situation__col situatin__col__center">
									<div class="situation__table__title">目标{{keyActualRadio.targetRatio?keyActualRadio.targetRatio:0}}%</div>
								</div>
								<div class="situation__col">
									<div class="situation__table__title">实际{{keyActualRadio.actualRatio?keyActualRadio.actualRatio:0}}%</div>
								</div>
							</div>
							<div class="situation__row" v-for="(item,index) in keyPositionList" :key="index" v-if="index<=showkey">
								<div class="situation__col">
									<div class="situation__table__info">{{item.post}}</div>
								</div>
								<div class="situation__col situatin__col__center">
									<div class="situation__table__info">目标{{item.targetRatio}}%</div>
								</div>
								<div class="situation__col">
									<div class="situation__table__info">实际{{item.actualRatio}}%</div>
								</div>
							</div>
							<div class="load__more" @click="loadMore('key')" v-if="keyPositionList.length>4">{{keyTip}} ></div>
						</div>

						<div class="situation__content">
							<div class="situation__row">
								<div class="situation__col">
									<div class="situation__table__title">核心业务岗位</div>
								</div>
								<div class="situation__col situatin__col__center">
									<div class="situation__table__title">目标{{businessActualRadio.targetRatio?businessActualRadio.targetRatio:0}}%</div>
								</div>
								<div class="situation__col situatin__col__center">
									<div class="situation__table__title">实际{{businessActualRadio.actualRatio?businessActualRadio.actualRatio:0}}%</div>
								</div>
							</div>
							<div class="situation__row" v-for="(item,index) in businessPositionList" :key="index" v-if="index<=showBusiness">
								<div class="situation__col">
									<div class="situation__table__info">{{item.post}}</div>
								</div>
								<div class="situation__col situatin__col__center">
									<div class="situation__table__info">目标{{item.targetRatio}}%</div>
								</div>
								<div class="situation__col">
									<div class="situation__table__info">实际{{item.actualRatio}}%</div>
								</div>
							</div>
							<div class="load__more" @click="loadMore('business')" v-if="businessPositionList.length>4">{{businessTip}} ></div>
						</div>

					</div>
				</div>

				<div class="board__card mt16 desc">
					<div class="board__card__header">
						本周变化
					</div>
					<div class="desc__content">
						<div class="desc__content__box">
							<div class="desc__content__title">配备率TOP3岗位</div>
							<div class="desc__content__row">
								<div class="desc__content__col">
									<div class="header mt10">关键岗位</div>
									<div v-for="(item,index) in lastKeyThree" :key="index">{{item.post}}</div>
								</div>
								<div class="desc__content__col">
									<div class="header mt10">核心业务岗位</div>
									<div v-for="(item,index) in lastBusinessThree" :key="index">{{item.post}}</div>
								</div>
							</div>
						</div>
						<div class="desc__content__box mt16">
							<div class="desc__content__title">配备率BOP3岗位</div>
							<div class="desc__content__row">
								<div class="desc__content__col">
									<div class="header mt10">关键岗位</div>
									<div v-for="(item,index) in laterKeyThree" :key="index">{{item.post}}</div>
								</div>
								<div class="desc__content__col">
									<div class="header mt10">核心业务岗位</div>
									<div v-for="(item,index) in laterBusinessThree" :key="index">{{item.post}}</div>
								</div>
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
			data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
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
				barWidth: 13,
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
				barWidth: 13,
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
				barWidth: 13,
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
				showCharts: false,
				generalChange: '',
				chartId: 'marketDisciplineChat',
				// 关键岗位标题
				keyActualRadio: {},
				// 核心业务标题
				businessActualRadio: {},
				//关键岗位内容
				keyPositionList: [],
				//核心业务内容
				businessPositionList: [],
				//关键岗位前三
				lastKeyThree: [],
				// 关键岗位后三
				laterKeyThree: [],
				// 核心业务前三
				lastBusinessThree: [],
				// 核心业务后三
				laterBusinessThree: [],
				showkey: 3,
				keyTip: '查看更多',
				showBusiness: 3,
				businessTip: '查看更多',
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
					this.chartOptions(data.chartData.postTypeVOList, data.chartData.postVOList)
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

			// 数据处理
			setData(data) {
				if (data && 'leftObj' in data) {
					this.$set(this, 'keyActualRadio', data.leftObj.keyActualRadio);
					this.$set(this, 'businessActualRadio', data.leftObj.businessActualRadio);
					this.$set(this, 'keyPositionList', data.leftObj.keyPositionList);
					this.$set(this, 'businessPositionList', data.leftObj.businessPositionList);
					this.$set(this, 'lastKeyThree', data.leftObj.lastKeyThree);
					this.$set(this, 'laterKeyThree', data.leftObj.laterKeyThree);
					this.$set(this, 'lastBusinessThree', data.leftObj.lastBusinessThree);
					this.$set(this, 'laterBusinessThree', data.leftObj.laterBusinessThree);
				} else {
					this.$set(this, 'keyActualRadio', {});
					this.$set(this, 'businessActualRadio', {});
					this.$set(this, 'keyPositionList', []);
					this.$set(this, 'businessPositionList', []);
					this.$set(this, 'lastKeyThree', []);
					this.$set(this, 'laterKeyThree', []);
					this.$set(this, 'lastBusinessThree', []);
					this.$set(this, 'laterBusinessThree', []);
				}
			},
			chartOptions(areaShow = [], areaSale = []) {
				const showTypes = {}
				areaShow.forEach((item) => {
					if (typeof showTypes[item.postType] === 'undefined') {
						showTypes[item.postType] = [item]
					} else {
						showTypes[item.postType].push(item)
					}
				})

				const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
				let showTypesArr = [];
				Object.keys(showTypes).forEach(key => {
					let showTypesObj = {};
					showTypesObj['name'] = key;
					showTypesObj['allocation'] = months.map((month) => {
						const target = showTypes[key].find(item => item.month === month)
						return target && target.allocation || 0
					});
					showTypesObj['realPeople'] = months.map((month) => {
						const target = showTypes[key].find(item => item.month === month)
						return target && target.realPeople || 0
					});
					showTypesObj['actualRatio'] = months.map((month) => {
						const target = showTypes[key].find(item => item.month === month)
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
					saleTypesObj['allocation'] = months.map((month) => {
						const target = saleTypes[key].find(item => item.month === month)
						return target && target.allocation || 0
					});
					saleTypesObj['realPeople'] = months.map((month) => {
						const target = saleTypes[key].find(item => item.month === month)
						return target && target.realPeople || 0
					});
					saleTypesObj['actualRatio'] = months.map((month) => {
						const target = saleTypes[key].find(item => item.month === month)
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
			loadMore(type) {
				if (type === 'key' && this.keyTip === '查看更多') {
					this.showkey = this.keyPositionList.length >= 4 ? this.keyPositionList.length - 1 : this.keyPositionList.length;
					this.keyTip = '收起'
					this.$forceUpdate()
				} else if (type === 'key' && this.keyTip === '收起') {
					this.showkey = 3;
					this.keyTip = '查看更多'
					this.$forceUpdate()
				} else if (type === 'business' && this.businessTip === '查看更多') {
					this.showkey = this.businessPositionList.length >= 4 ? this.businessPositionList.length - 1 : this.businessPositionList
						.length;
					this.businessTip = '收起'
					this.$forceUpdate()
				} else if (type === 'business' && this.businessTip === '收起') {
					this.showkey = 3;
					this.businessTip = '查看更多'
					this.$forceUpdate()
				}
			}
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
			padding: 16px 25px 0px;

			.situation__content {
				padding: 16px 0;
			}

			.situation__row {
				display: flex;
			}

			.load__more {
				margin-top: 16px;
				font-size: 14px;
				color: #C31725;
				text-align: center;
			}

			.situation__col {
				flex: 1;

				.situation__table__title {
					font-size: 14px;
					font-weight: bold;
					margin-bottom: 4px;
				}

				.star__icon__box {
					.star__icon {
						width: 12px;
						height: 12px;
						margin-right: 4px;
					}
				}

				.no__star {
					font-size: 14px;
					color: #666;
				}
			}

			.situatin__col__center {
				text-align: center;
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
				.desc__content__title {
					display: inline-block;
					color: #fff;
					background: #E63752;
					border-radius: 4px;
					padding: 0 10px;
					transform: skewX(-15deg);
					font-size: 12px;
				}

				.desc__content__row {
					display: flex;

					.desc__content__col {
						flex: 1;

						.header {
							font-weight: bold;
						}
					}
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

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
									<div class="situation__table__title">目标 {{keyActualRadio.targetRatio?keyActualRadio.targetRatio:0}}%</div>
								</div>
								<div class="situation__col">
									<div class="situation__table__title">实际 {{keyActualRadio.actualRatio?keyActualRadio.actualRatio:0}}%</div>
								</div>
							</div>
							<div class="situation__row" v-for="(item,index) in keyPositionList" :key="index" v-if="index<=showkey">
								<div class="situation__col">
									<div class="situation__table__info">{{item.post}}</div>
								</div>
								<div class="situation__col situatin__col__center">
									<div class="situation__table__info">目标 {{item.targetRatio}}%</div>
								</div>
								<div class="situation__col">
									<div class="situation__table__info">实际 {{item.actualRatio}}%</div>
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
									<div class="situation__table__title">目标 {{businessActualRadio.targetRatio?businessActualRadio.targetRatio:0}}%</div>
								</div>
								<div class="situation__col">
									<div class="situation__table__title">实际 {{businessActualRadio.actualRatio?businessActualRadio.actualRatio:0}}%</div>
								</div>
							</div>
							<div class="situation__row" v-for="(item,index) in businessPositionList" :key="index" v-if="index<=showBusiness">
								<div class="situation__col">
									<div class="situation__table__info">{{item.post}}</div>
								</div>
								<div class="situation__col situatin__col__center">
									<div class="situation__table__info">目标 {{item.targetRatio}}%</div>
								</div>
								<div class="situation__col">
									<div class="situation__table__info">实际 {{item.actualRatio}}%</div>
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
				<div id="overallSituationBarChart" class="chart">
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	const chartOption = {
		color: ['#5B8FF9', '#73DEB3', '#FD9707'],
		tooltip: {
			trigger: 'axis',
		},
		grid: {
			top: '15%',
			right: '10%',
			left: '10%',
			bottom: '10%',
		},
		legend: {
			x: 'center', //可设定图例在左、右、居中
			y: 'bottom',
			itemWidth: 10,
			itemHeight: 10,
			textStyle: {
				fontSize: 12,
				color: '#999'
			},
			data: ['应配备人数', '实配备人数', '配备率']
		},
		xAxis: {
			type: 'category',
			axisTick: {
				show: false,
			},
			axisLabel: {
				interval: 0,
				// rotate: 20,
				fontSize: 12,
				align: 'center',
				verticalAlign: 'top',
				color: '#666'
			},
			axisLine: {
				// 轴线
				lineStyle: {
					color: '#E6E6E6'
				},
			},
			data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
		},
		yAxis: [{
				type: 'value',
				name: '人数',
				min: 0,
				max: 7000,
				interval: 1000,
				axisLine: {
					// 轴线
					lineStyle: {
						color: '#999'
					},
					show: false
				},
				axisTick: {
					show: false
				},
				splitLine: {
					show: true,
					lineStyle: {
						type: 'dashed'
					}
				},
			},
			{
				type: 'value',
				name: '百分比',
				min: 0,
				max: 100,
				maxInterval: 100,
				minInterval: 0,
				interval: Math.ceil(100 / 7 * 100) / 100,
				axisLine: {
					// 轴线
					lineStyle: {
						color: '#999'
					},
					show: false
				},
				axisTick: {
					show: false
				},
				splitLine: {
					show: true,
					lineStyle: {
						type: 'dashed'
					}
				},
				axisLabel: {
					formatter: '{value}'
				}
			}
		],
		dataZoom: [{
			show: false,
			type: 'inside',
			realtime: true,
			start: 0,
			end: 30,
			// zoomOnMouseWheel: false,
			zoomLock: true,
		}],
		series: [{
				name: '应配备人数',
				type: 'bar',
				barWidth: '10',
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			},
			{
				name: '实配备人数',
				type: 'bar',
				barWidth: '10',
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			},
			{
				name: '配备率',
				smooth: true,
				type: 'line',
				yAxisIndex: 1,
				symbol: 'none',
				lineStyle: {
					color: '#FD9707',
					width: 2,
					shadowColor: 'rgba(253,151,7,0.5)', //设置折线阴影
					shadowBlur: 10,
					shadowOffsetY: 10,
				},
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			}
		]
	}
	import echarts from 'echarts'
	export default {
		data() {
			return {
				chart: null,
				selectedYear: null,
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
				showCharts: false,
				generalChange: '',


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
					this.handlerChartData(data)
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
				this.chart.resize({
					height: 'auto',
				})
			},

			initChart() {
				const dom = document.getElementById('overallSituationBarChart');
				this.chart = echarts.init(dom);
				this.chart.setOption(chartOption)
				window.addEventListener('resize', this.resetChartSize)
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
			// 图表数据处理
			handlerChartData(data) {
				if ('chartData' in data && data.chartData.length > 0) {
					let xaxisArr = [];
					let seriesArr0 = [];
					let seriesArr1 = [];
					let seriesArr2 = [];
					data.chartData.forEach((item, index) => {
						xaxisArr.push(item.post);
						seriesArr0.push(item.allocation);
						seriesArr1.push(item.realNum);
						seriesArr2.push(item.actualRatio);
					})
					chartOption.xAxis.data = xaxisArr;
					chartOption.series[0]['data'] = seriesArr0;
					chartOption.series[1]['data'] = seriesArr1;
					chartOption.series[2]['data'] = seriesArr2;
				} else {
					let arr1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
					chartOption.xAxis.data = [];
					chartOption.series[0]['data'] = arr1;
					chartOption.series[1]['data'] = arr1;
					chartOption.series[2]['data'] = arr1;
				}
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
					margin-bottom: 6px;
				}

				.situation__table__info {
					line-height: 24px;
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
			min-height: 500px;
			display: flex;
			flex-direction: column;
			background: #F7F7F7;
			box-sizing: border-box;
		}
	}

	.border__bottom {
		border-bottom: 1px solid #E6E6E6;
	}

	#marketDisciplineChat {
		height: 60px;
	}
</style>

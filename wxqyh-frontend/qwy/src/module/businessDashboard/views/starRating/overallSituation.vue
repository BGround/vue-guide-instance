<template>
	<div class="region">
		<div class="board__content">

			<div class="board__content__left">
				<div class="board__card">
					<div class="board__card__header">
						整体情况
					</div>
					<div class="situation">
						<div class="situation__col">
							<div class="situation__table__title">星级</div>
							<div class="star__icon__box">
								<img class="star__icon" v-for="item in 5" :key="item" src="../../static/icon-star.png" alt="" />
							</div>
							<div class="star__icon__box">
								<img class="star__icon" v-for="item in 4" :key="item" src="../../static/icon-star.png" alt="" />
							</div>
							<div class="star__icon__box">
								<img class="star__icon" v-for="item in 3" :key="item" src="../../static/icon-star.png" alt="" />
							</div>
							<div class="star__icon__box">
								<img class="star__icon" v-for="item in 2" :key="item" src="../../static/icon-star.png" alt="" />
							</div>
							<div class="star__icon__box">
								<img class="star__icon" src="../../static/icon-star.png" alt="" />
							</div>
							<div class="no__star">
								无星
							</div>
						</div>
						<div class="situation__col situatin__col__center">
							<div class="situation__table__title">{{selectedYear}}年上半年</div>
							<div v-if="firstHalf.length>0">
								<div class="no__star" v-for="(item,index) in firstHalf" :key="index">
									{{item.total}}家
								</div>
							</div>
						</div>
						<div class="situation__col situatin__col__center">
							<div class="situation__table__title">{{selectedYear}}年下半年</div>
							<div v-if="secondHalf.length>0">
								<div class="no__star" v-for="(item,index) in secondHalf" :key="index">
									{{item.total}}家
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="board__card mt16">
					<div class="board__card__header">
						备注
					</div>
					<div class="change">
						<!-- 五星 -->
						<div class="change__item border__bottom">
							<div class="change__item__content">
								<div class="change__item__content__title">五星</div>
								<div class="change__item__content__right">
									<div class="right__item" v-for="(item,index) in markFiveHigh" :key="'markFiveHigh'+index">
										<div class="tall">{{index===0?'最高:':''}}</div>
										<div class="area__name" v-if="item.total > 0">{{item.area}}</div>
										<div class="strip" v-if="item.total > 0">
											<div class="strip_item" style="width: 100%"></div>
										</div>
										<div class="tall__num" v-if="item.total > 0">{{item.total}}</div>
									</div>
									<div class="right__item" v-for="(item,index) in markFiveLow" :key="'markFiveLow'+index">
										<div class="tall">{{index===0?'最低:':''}}</div>
										<div class="area__name" v-if="item.total > 0">{{item.area}}</div>
										<div class="strip" v-if="item.total > 0">
											<div class="strip_item" :style="{width: fiveStarWidth > 100 ? '100%': fiveStarWidth+'%' }"></div>
										</div>
										<div class="tall__num" v-if="item.total > 0">{{item.total}}</div>
									</div>
								</div>
							</div>
						</div>
						<!-- 一星 -->
						<div class="change__item border__bottom">
							<div class="change__item__content">
								<div class="change__item__content__title">一星</div>
								<div class="change__item__content__right">
									<div class="right__item" v-for="(item,index) in markOneHigh" :key="'markOneHigh'+index">
										<div class="tall">{{index===0?'最高:':''}}</div>
										<div class="area__name" v-if="item.total > 0">{{item.area}}</div>
										<div class="strip strip1" v-if="item.total > 0">
											<div class="strip_item" style="width: 100%"></div>
										</div>
										<div class="tall__num" v-if="item.total > 0">{{item.total}}</div>
									</div>
									<div class="right__item" v-for="(item,index) in markOneLow" :key="'markOneLow'+index">
										<div class="tall">{{index===0?'最低:':''}}</div>
										<div class="area__name" v-if="item.total > 0">{{item.area}}</div>
										<div class="strip strip1" v-if="item.total > 0">
											<div class="strip_item" :style="{width: oneStarWidth > 100 ? '100%': oneStarWidth+'%' }"></div>
										</div>
										<div class="tall__num" v-if="item.total > 0">{{item.total}}</div>
									</div>
								</div>
							</div>
						</div>
						<!-- 无星 -->
						<div class="change__item">
							<div class="change__item__content">
								<div class="change__item__content__title">无星</div>
								<div class="change__item__content__right">
									<div class="right__item" v-for="(item,index) in markZeroHigh" :key="'markZeroHigh'+index">
										<div class="tall">{{index===0?'最高:':''}}</div>
										<div class="area__name" v-if="item.total > 0">{{item.area}}</div>
										<div class="strip strip2" v-if="item.total > 0">
											<div class="strip_item" style="width: 100%"></div>
										</div>
										<div class="tall__num" v-if="item.total > 0">{{item.total}}</div>
									</div>
									<div class="right__item" v-for="(item,index) in markZeroLow" :key="'markZeroLow'+index">
										<div class="tall">{{index===0?'最低:':''}}</div>
										<div class="area__name" v-if="item.total > 0">{{item.area}}</div>
										<div class="strip strip2" v-if="item.total > 0">
											<div class="strip_item" :style="{width:zeroStarWidth>100? '100%':zeroStarWidth+'%' }"></div>
										</div>
										<div class="tall__num" v-if="item.total > 0">{{item.total}}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="board__content__right">
				<div id="overallSituationBarChart" class="chart" v-if="showCharts">
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	const chartOption = {
		color: ['#5B8ff9', '#73deb3', '#eb7f65', '#f7c739', '#e63752', '#7585a2'],
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			},
			formatter: function(params) {
				let str = '<p>' + params[0]['axisValueLabel'] + '</p>';
				params.forEach(item => {
					str += '<p>' + item.marker + ' ' + item.seriesName + ' : ' + item.data + '%</p>'
				})
				return str;

			},
		},
		legend: {
			x: 'center', //可设定图例在左、右、居中
			y: 'bottom',
			data: ['五星', '四星', '三星', '二星', '一星', '无星', ]
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '10%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			data: ['东南大区', '华中大区', '华东大区', '山东大区', '华南大区', '华北大区', '西南一区', '西南二区', '东北大区', '西北大区'],
			axisLine: {
				// 轴线
				lineStyle: {
					color: '#666'
				},
				show: false
			},
			axisLabel: {
				interval: 0,
				// rotate: 20,
				// fontSize: 9,
				// align: 'center',
				// verticalAlign: 'top',
				// 	color: '#666'
			},
			axisTick: {
				show: false
			},
		},
		yAxis: {
			name: '百分比',
			type: 'value',
			min: 0,
			max: 100,
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
		dataZoom: [{
			show: false,
			type: 'inside',
			realtime: true,
			start: 0,
			end: 50,
			// zoomOnMouseWheel: false,
			zoomLock: true,
		}],
		series: [{
				name: '五星',
				type: 'bar',
				stack: '广告',
				barWidth: '30',
				label: {
					position: 'right',
					color: '#5B8ff9',
					show: true,
					formatter: '{c}%'
				},
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			},
			{
				name: '四星',
				type: 'bar',
				stack: '广告',
				barWidth: '30',
				label: {
					position: 'right',
					color: '#73deb3',
					show: true,
					formatter: '{c}%'
				},
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			},
			{
				name: '三星',
				type: 'bar',
				stack: '广告',
				barWidth: '30',
				label: {
					position: 'right',
					color: '#eb7f65',
					show: true,
					formatter: '{c}%'
				},
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			},
			{
				name: '二星',
				type: 'bar',
				stack: '广告',
				barWidth: '30',
				label: {
					position: 'right',
					color: '#f7c739',
					show: true,
					formatter: '{c}%'
				},
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			},
			{
				name: '一星',
				type: 'bar',
				stack: '广告',
				barWidth: '30',
				label: {
					position: 'right',
					color: '#e63752',
					show: true,
					formatter: '{c}%'
				},
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			},
			{
				name: '无星',
				type: 'bar',
				stack: '广告',
				barWidth: '30',
				label: {
					position: 'right',
					color: '#7585a2',
					show: true,
					formatter: '{c}%'
				},
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			},
		]
	}
	import echarts from 'echarts'
	export default {
		data() {
			return {
				chart: null,
				selectedYear: null,
				// 五星最高
				markFiveHigh: [],
				// 五星最低
				markFiveLow: [],
				//一星最高
				markOneHigh: [],
				//一星最低
				markOneLow: [],
				//零星最高
				markZeroHigh: [],
				// 零星最低
				markZeroLow: [],
				fiveStarWidth: 0,
				oneStarWidth: 0,
				zeroStarWidth: 0,
				markStar: [{
					area: '',
					total: 0,
				}],
				// 上半年
				firstHalf: [],
				// 下半年
				secondHalf: [],
				showCharts: false,
			};
		},
		props: {
			starConfig: {
				type: Object,
				required: true,
			}
		},
		watch: {
			starConfig: {
				deep: true,
				// immediate: true,
				handler(data) {
					this.setData(data)
					if (data.allSituation.formRankVOList.length > 0) {
						this.$nextTick(() => {
							this.initChart()
						})
					}
				}
			}
		},
		methods: {
			resetChartSize() {
				this.chart.resize()
			},

			initChart() {
				const dom = document.getElementById('overallSituationBarChart');
				this.chart = echarts.init(dom);
				this.chart.setOption(chartOption)
				window.addEventListener('resize', this.resetChartSize)
			},
			// 数据处理
			setData(data) {
				this.selectedYear = data.year;
				if ('markFiveHigh' in data.allSituation && data.allSituation.markFiveHigh.length > 0) {
					this.$set(this, 'markFiveHigh', data.allSituation.markFiveHigh)
				} else {
					this.$set(this, 'markFiveHigh', this.markStar)
				}
				if ('markFiveLow' in data.allSituation && data.allSituation.markFiveLow.length > 0) {
					this.$set(this, 'markFiveLow', data.allSituation.markFiveLow)
				} else {
					this.$set(this, 'markFiveLow', this.markStar)
				}
				if ('markOneHigh' in data.allSituation && data.allSituation.markOneHigh.length > 0) {
					this.$set(this, 'markOneHigh', data.allSituation.markOneHigh)
				} else {
					this.$set(this, 'markOneHigh', this.markStar)
				}
				if ('markOneLow' in data.allSituation && data.allSituation.markOneLow.length > 0) {
					this.$set(this, 'markOneLow', data.allSituation.markOneLow)
				} else {
					this.$set(this, 'markOneLow', this.markStar)
				}
				if ('markZeroHigh' in data.allSituation && data.allSituation.markZeroHigh.length > 0) {
					this.$set(this, 'markZeroHigh', data.allSituation.markZeroHigh)
				} else {
					this.$set(this, 'markZeroHigh', this.markStar)
				}
				if ('markZeroLow' in data.allSituation && data.allSituation.markZeroLow.length > 0) {
					this.$set(this, 'markZeroLow', data.allSituation.markZeroLow)
				} else {
					this.$set(this, 'markZeroLow', this.markStar)
				}
				// 整体情况--星级
				if ('starRankVOList' in data.allSituation && data.allSituation.starRankVOList.length > 0) {
					this.handlerHalf(data.allSituation.starRankVOList)
				} else {
					this.$set(this, 'firstHalf', [])
					this.$set(this, 'secondHalf', [])
				}
				// 整体情况--图表
				if ('formRankVOList' in data.allSituation && data.allSituation.formRankVOList != null) {
					this.handlerChartData(data.allSituation.formRankVOList)
				}
				this.fiveStarWidth = this.markFiveLow[0].total / this.markFiveHigh[0].total * 100 || 0;
				this.oneStarWidth = this.markOneLow[0].total / this.markOneHigh[0].total * 100 || 0;
				this.zeroStarWidth = this.markZeroLow[0].total / this.markZeroHigh[0].total * 100 || 0;
			},
			// 整体情况数据处理
			handlerHalf(starRankVOList) {
				if (starRankVOList.length > 0) {
					let arr1 = starRankVOList.filter(item => {
						return item.month === 6
					})
					let arr2 = starRankVOList.filter(item => {
						return item.month === 12
					})
					arr1 = arr1.sort((a, b) => {
						return b.starRank * 1 - a.starRank * 1;
					})
					arr2 = arr2.sort((a, b) => {
						return b.starRank * 1 - a.starRank * 1;
					})
					this.$set(this, 'firstHalf', arr1)
					this.$set(this, 'secondHalf', arr2)
				} else {
					this.$set(this, 'firstHalf', [])
					this.$set(this, 'secondHalf', [])
				}
			},
			// 图表数据处理
			handlerChartData(formRankVOList) {
				if (formRankVOList.length > 0) {
					this.showCharts = true;
					let xArrData = [];
					let starArr5 = [];
					let starArr4 = [];
					let starArr3 = [];
					let starArr2 = [];
					let starArr1 = [];
					let starArr0 = [];
					formRankVOList.forEach((item, index) => {
						starArr5.splice(index, 0, 0);
						starArr4.splice(index, 0, 0);
						starArr3.splice(index, 0, 0);
						starArr2.splice(index, 0, 0);
						starArr1.splice(index, 0, 0);
						starArr0.splice(index, 0, 0);
						xArrData.push(item.area)
						item.starVOList.forEach(starItem => {
							if (starItem.starRank === '5') {
								let pesent = (starItem.total * 1) / (item.total * 1) * 100;
								pesent = pesent.toFixed(2);
								starArr5.splice(index, 1, pesent)
							} else if (starItem.starRank === '4') {
								let pesent = (starItem.total * 1) / (item.total * 1) * 100;
								pesent = pesent.toFixed(2);
								starArr4.splice(index, 1, pesent)
							} else if (starItem.starRank === '3') {
								let pesent = (starItem.total * 1) / (item.total * 1) * 100;
								pesent = pesent.toFixed(2);
								starArr3.splice(index, 1, pesent)
							} else if (starItem.starRank === '2') {
								let pesent = (starItem.total * 1) / (item.total * 1) * 100;
								pesent = pesent.toFixed(2);
								starArr2.splice(index, 1, pesent)
							} else if (starItem.starRank === '1') {
								let pesent = (starItem.total * 1) / (item.total * 1) * 100;
								pesent = pesent.toFixed(2);
								starArr1.splice(index, 1, pesent)
							} else if (starItem.starRank === '0') {
								let pesent = (starItem.total * 1) / (item.total * 1) * 100;
								pesent = pesent.toFixed(2);
								starArr0.splice(index, 1, pesent)
							}
						})
					})
					chartOption.xAxis.data = xArrData;
					chartOption.series[0].data = starArr5;
					chartOption.series[1].data = starArr4;
					chartOption.series[2].data = starArr3;
					chartOption.series[3].data = starArr2;
					chartOption.series[4].data = starArr1;
					chartOption.series[5].data = starArr0;
				} else {
					this.showCharts = false;
				}
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
			display: flex;

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
				min-height: 76px;
				box-sizing: border-box;
				padding: 10px 0;

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
						.tall{
							width: 32px;
						}
						.strip {
							position: relative;
							width: 118px;
							height: 8px;
							background: rgba(91, 143, 249, .1);
							overflow: hidden;

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

						.tall__num {
							width: 26px;
							text-align: right;
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

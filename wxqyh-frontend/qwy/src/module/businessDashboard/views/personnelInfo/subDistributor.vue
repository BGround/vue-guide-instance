<template>
	<div class="report">
		<div class="board__content">

			<div class="board__content__right top">
				<div class="top__section">
					<h3 class="top__section__title">关键岗位BOT10</h3>
					<ul class="ranking">
						<li class="ranking__item" v-for="(item, index) in mainTop" :key="index">
							<div class="ranking__item__no">{{index+1}}</div>
							<div class="ranking__item__name">{{item.dealerShortName}}</div>
							<div class="ranking__item__value">{{item.actualRatio}}%</div>
							<div class="ranking__item__change" :class="{'up': item.contrast >0, 'down': item.contrast <0}">
								{{item.contrast >0 ? '+' :(item.contrast<0?'': '&nbsp;')}}
								{{item.contrast}}
								{{item.contrast >0 ? '↑' :(item.contrast<0?'↓': '&nbsp;')}}
							</div>
						</li>
					</ul>

				</div>

				<div class="top__section">
					<h3 class="top__section__title">核心业务岗位BOT10</h3>
					<ul class="ranking">
						<li class="ranking__item" v-for="(item, index) in coverTop" :key="index">
							<div class="ranking__item__no">{{index+1}}</div>
							<div class="ranking__item__name">{{item.dealerShortName}}</div>
							<div class="ranking__item__value">{{item.actualRatio}}%</div>
							<div class="ranking__item__change" :class="{'up': item.contrast >0, 'down': item.contrast <0}">
								{{item.contrast >0 ? '+' :(item.contrast<0?'': '&nbsp;')}}
								{{item.contrast}}
								{{item.contrast >0 ? '↑' :(item.contrast<0?'↓': '&nbsp;')}}
							</div>
						</li>

					</ul>

				</div>
			</div>

		</div>
	</div>
</template>

<script>
	const chartOption = {
		color: ['#2781DB', '#06ACFF'],
		legend: {
			data: ['奇瑞', '容量'],
			backgroundColor: '#ffffff',
			bottom: 10,
			left: 'center',
			itemHeight: 13,
			itemWidth: 13,
			icon: 'rect'
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
			top: 30,
			left: 18,
			right: 18,
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
				name: '奇瑞',
				type: 'bar',
				barWidth: 13,
				data: []
			},
			{
				name: '容量',
				type: 'bar',
				barWidth: 13,
				data: []
			}
		]
	}
	import echarts from 'echarts'

	export default {
		data() {
			return {
				mainTop: [],
				coverTop: [],
			};
		},
		created() {

		},
		props: {
			config: {
				type: Object,
				required: true,
			}
		},
		watch: {
			'config': {
				deep: true,
				handler: function(data) {
					this.setData(data)
				}
			}
		},
		methods: {
			setData(data) {
				this.mainTop = data.laterKeyTen || [];
				this.coverTop = data.laterBusinessTen || [];
			}

		},
		components: {

		},
		mounted() {

		},
	}
</script>

<style lang="scss" scoped>
	@import '~@/module/businessDashboard/scss/common/board.scss';

	.report {
		.situation {
			display: flex;
			width: 100%;
			padding: 16px 0;

			.situation__item {
				flex-basis: 50%;
				flex-shrink: 0;
				text-align: center;
			}

			.situation__name {
				height: 31px;
				width: 130px;
				margin: 0 auto;
				font-size: 24px;
				font-weight: bold;
				line-height: 31px;
				color: rgba(51, 51, 51, 1);
				padding-bottom: 9px;
				border-bottom: 1px solid #E6E6E6;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.situation__label {
				height: 19px;
				font-size: 14px;
				font-weight: bold;
				line-height: 19px;
				color: rgba(209, 3, 28, 1);
				margin-top: 8px;

				&.yellow {
					color: #FD9707;
				}
			}

			.situation__value {
				height: 19px;
				font-size: 14px;
				font-weight: 400;
				line-height: 19px;
				color: rgba(102, 102, 102, 1);
				margin-top: 8px;
			}
		}

		.change {
			padding: 16px 24px 0;
			min-height: 210px;

			.change__content {
				display: flex;
				flex-wrap: nowrap;
				margin-bottom: 16px;
			}

			.change__col__item {
				display: flex;
				height: 19px;
				font-size: 14px;
				font-weight: 400;
				line-height: 25px;
				color: rgba(51, 51, 51, 1);
				margin-bottom: 10px;

				.change__col__item__label {}
			}

			.change__title {
				flex-grow: 1;
				height: 19px;
				font-size: 14px;
				line-height: 19px;
				font-weight: bold;
				margin-bottom: 10px;
				color: rgba(51, 51, 51, 1);
			}
		}

		.top {
			flex-basis: 100%;
			display: flex;
			justify-content: space-between;

			.top__section {
				width: 49%;
				min-height: 445px;
				background: rgba(255, 255, 255, 1);
				border: 1px solid rgba(230, 230, 230, 1);
				opacity: 1;
				border-radius: 4px;
				padding: 24px 24px 0;
				box-sizing: border-box;
			}

			.top__section__title {
				height: 26px;
				font-size: 20px;
				font-weight: bold;
				line-height: 26px;
				color: rgba(51, 51, 51, 1);
			}

			.ranking {
				margin-top: 26px;

				.ranking__item {
					margin-bottom: 11px;
					display: flex;

					&:nth-child(1) .ranking__item__no {
						background: #F1405C;
						color: #ffffff;
					}

					&:nth-child(2) .ranking__item__no {
						background: #FF8547;
						color: #ffffff;
					}

					&:nth-child(3) .ranking__item__no {
						background: #FFBC00;
						color: #ffffff;
					}
				}

				.ranking__item__no {
					width: 24px;
					height: 24px;
					text-align: center;
					opacity: 1;
					border-radius: 12px;
					color: #666666;
					line-height: 24px;
					margin-right: 12px;
					flex-shrink: 0;
					flex-basis: 24px;
				}

				.ranking__item__name {
					height: 24px;
					font-size: 14px;
					font-weight: 400;
					line-height: 24px;
					color: rgba(102, 102, 102, 1);
					margin-right: auto;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;

				}

				.ranking__item__value {
					flex-basis: 60px;
					flex-shrink: 0;
					line-height: 24px;
					text-align: left;
					font-size: 14px;
					font-weight: 400;
					color: rgba(102, 102, 102, 1);
				}

				.ranking__item__change {
					flex-basis: 50px;
					flex-shrink: 0;
					line-height: 24px;
					text-align: right;
					color: rgba(102, 102, 102, 1);

					&.up {
						color: #00B563;
					}

					&.down {
						color: #D1031C;
					}
				}

			}
		}
	}

	#changeEnterpriseInfo {
		height: 520px;
	}
</style>

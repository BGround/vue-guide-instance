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
							<div class="situation__item" v-if="index%2===0" v-for="(item,index) in areaTotals" :key="index">
								<div class="situation__item__label">{{item.area}}：</div>
								<div class="situation__item__value">{{item.total}}例</div>
							</div>
						</div>

						<div class="situation__col">
							<div class="situation__item" v-if="index%2===1" v-for="(item,index) in areaTotals" :key="index">
								<div class="situation__item__label">{{item.area}}：</div>
								<div class="situation__item__value">{{item.total}}例</div>
							</div>
						</div>

					</div>
				</div>

				<div class="board__card mt16">
					<div class="board__card__header">
						本周变化
					</div>
					<div class="change">
						<div v-if="newWeekChange" v-html="newWeekChange"></div>
						<div v-else>暂无</div>
					</div>
				</div>
			</div>

			<div class="board__content__right">
				<div class="exception__chart__box" v-for="(item,key,index) in mapArea" :key="index">
					<exceptionBarChart :chartId="'id'+index" :chartTitle="key" :areaMap="item" :proportion="mapProportion[key]"></exceptionBarChart>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	import exceptionBarChart from './components/exceptionBarChart'
	export default {
		components: {
			exceptionBarChart
		},
		data() {
			return {
				areaTotals: [{
					area: '店面异常',
					total: 0,
				}, {
					area: '目标未达成',
					total: 0,
				}, {
					area: '能力异常',
					total: 0,
				}, {
					area: '渠道异常',
					total: 0,
				}, {
					area: '人员异常',
					total: 0,
				}, {
					area: '运营异常',
					total: 0,
				}, {
					area: '资金异常',
					total: 0,
				}, {
					area: '其他',
					total: 0,
				}, ],
				mapArea: {},
				mapProportion: {},
				newWeekChange: '',
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
				handler(data) {
					if (data) {
						this.setData(data)
					}
				}
			}
		},
		methods: {
			setData(data) {
				this.areaTotals.forEach((item, index) => {
					let idx = index+1;
					item.total = data['type' + idx]
				})
				this.newWeekChange = data.newWeekChange || '';
				if (data.mapArea) {
					this.$set(this, 'mapArea', data.mapArea)
				} else {
					this.$set(this, 'mapArea', {})
				}
				if (data.mapProportion) {
					this.$set(this, 'mapProportion', data.mapProportion)
				} else {
					this.$set(this, 'mapProportion', {})
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import '~@/module/businessDashboard/scss/common/board.scss';

	.region {
		.board__card {
			min-height: 100px;
		}

		.situation {
			padding: 16px 25px 16px;
			display: flex;

			.situation__col {
				width: 50%;

				.situation__item {
					display: flex;
					align-items: center;
				}

				.situation__item__label {
					width: 90px;
					font-size: 14px;
					font-weight: bold;
					line-height: 28px;
					color: rgba(51, 51, 51, 1);
				}

				.situation__item__value {
					height: 28px;
					font-size: 14px;
					font-weight: 400;
					line-height: 28px;
					color: rgba(102, 102, 102, 1);
				}
			}
		}

		.change {
			padding: 16px 24px;

			.change__content {
				display: flex;
				flex-wrap: nowrap;
			}

			.change__col__item {
				display: flex;
				height: 19px;
				font-size: 14px;
				font-weight: 400;
				line-height: 25px;
				color: rgba(51, 51, 51, 1);
				margin-bottom: 10px;

				.change__col__item__label {
					width: 70px;
				}
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

			.change__col {
				width: 50%;
			}
		}

		.board__content__right {
			height: 600px;
			overflow: auto;
			overflow-x: hidden;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-content: flex-start;
			justify-content: space-between;

			.exception__chart__box {
				width: 49%;
				height: 255px;
				margin-bottom: 10px;
				background: #F7F7F7;
			}
		}

		.board__content__right::-webkit-scrollbar {
			display: none;
		}

	}
</style>

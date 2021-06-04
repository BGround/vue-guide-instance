<template>
	<div class="general">
		<div class="board__content">

			<div class="board__content__left">
				<div class="board__card overview">
					<div class="overview__top">
						<h3 class="overview__title">整体情况</h3>
						<h3 class="overview__data">
							<div class="overview__data__value">{{projectNums}}</div>
							<div class="overview__data__label">项目总数</div>
						</h3>
					</div>
					<div class="overview__bottom1">
						<div class="overview__legend">
							<div class="overview__legend__item">
								<div class="legend__label">到期项目</div>
								<div class="legend__value">{{delayFinishedNums}}</div>
							</div>
							<div class="overview__legend__item">
								<div class="legend__label" style="flex:1;text-align: right;">到期项目完成率</div>
								<div class="legend__value">{{finishProportion}}%</div>
							</div>
						</div>
						<div class="overview__legend">
							<div class="overview__legend__item">
								<!-- <div class="legend__label">项目完成率</div>
								<div class="legend__value">{{finishCount}}</div> -->
							</div>
							<div class="overview__legend__item">
								<div class="legend__label" style="flex:1;text-align: right;">考核数</div>
								<div class="legend__value" style="color:#E63752">{{examNums}}</div>
							</div>
						</div>
					</div>
				</div>

				<div class="board__card overview mt16">
					<div class="overview__top">
						<h3 class="overview__title">本月情况</h3>
					</div>
					<div style="min-height: 50px">
						<div v-if="newWeekChange" v-html="newWeekChange"></div>
						<div v-else>暂无</div>
					</div>
				</div>

				<div class="board__card mt16">
					<div class="board__card__header">
						大区排名
					</div>
					<div class="change">
						<!-- 项目总数 -->
						<div class="change__item border__bottom">
							<div class="change__item__content">
								<div class="change__item__content__title">项目</br>总数</div>
								<div class="change__item__content__right">
									<div class="right__item">
										<div class="tall">最高:</div>
										<div>
											<div v-for="(item,index) in maxProjectNumsList" :key="'maxProjectNums'+index">
												<div class="area__name" v-if="item.projectNums>=0">{{item.area}}</div>
												<div class="strip" v-if="item.projectNums>=0">
													<div class="strip_item" style="width: 100%"></div>
												</div>
												<div class="tall__num" v-if="item.projectNums>=0">{{item.projectNums}}</div>
											</div>
										</div>
									</div>
									<div class="right__item">
										<div class="tall">最低:</div>
										<div>
											<div v-for="(item,index) in minProjectNumsList" :key="'minProjectNums'+index">
												<div class="area__name" v-if="item.projectNums>=0">{{item.area}}</div>
												<div class="strip" v-if="item.projectNums>=0">
													<div class="strip_item" :style="{width:projectWidth>100? '100%':projectWidth+'%'}"></div>
												</div>
												<div class="tall__num" v-if="item.projectNums>=0">{{item.projectNums}}</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!-- 项目完成率 -->
						<div class="change__item border__bottom">
							<div class="change__item__content">
								<div class="change__item__content__title">项目</br>完成率</div>
								<div class="change__item__content__right">
									<div class="right__item">
										<div class="tall">最高:</div>
										<div>
											<div v-for="(item,index) in maxProportionList" :key="'maxProportion'+index">
												<div class="area__name" v-if="item.expireProportion>=0">{{item.area}}</div>
												<div class="strip strip1" v-if="item.expireProportion>=0">
													<div class="strip_item" style="width: 100%"></div>
												</div>
												<div class="tall__num" v-if="item.expireProportion>=0">{{item.expireProportion}}%</div>
											</div>
										</div>
									</div>
									<div class="right__item">
										<div class="tall">最低:</div>
										<div>
											<div v-for="(item,index) in minProportionList" :key="'minProjectNums'+index">
												<div class="area__name" v-if="item.expireProportion>=0">{{item.area}}</div>
												<div class="strip strip1" v-if="item.expireProportion>=0">
													<div class="strip_item" :style="{width:propsrtionWidth > 100 ? '100%': propsrtionWidth+'%'}"></div>
												</div>
												<div class="tall__num" v-if="item.expireProportion>=0">{{item.expireProportion}}%</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!-- 考核家数 -->
						<div class="change__item">
							<div class="change__item__content">
								<div class="change__item__content__title">考核</br>家数</div>
								<div class="change__item__content__right">
									<div class="right__item">
										<div class="tall">最高:</div>
										<div>
											<div v-for="(item,index) in maxExamNumsList" :key="'maxExamNums'+index">
												<div class="area__name" v-if="item.examNums>=0">{{item.area}}</div>
												<div class="strip strip2" v-if="item.examNums>=0">
													<div class="strip_item" style="width: 100%"></div>
												</div>
												<div class="tall__num" v-if="item.examNums>=0">{{item.examNums}}</div>
											</div>
										</div>
									</div>
									<div class="right__item">
										<div class="tall">最低:</div>
										<div>
											<div v-for="(item,index) in minExamNumsList" :key="'minExamNums'+index">
												<div class="area__name" v-if="item.examNums>=0">{{item.area}}</div>
												<div class="strip strip2" v-if="item.examNums>=0">
													<div class="strip_item" :style="{width: examWidth > 100? '100%' : examWidth+'%'}"></div>
												</div>
												<div class="tall__num" v-if="item.examNums>=0">{{item.examNums}}</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>



			<div class="board__content__right">
				<div v-if="chartStatisticsVOS.length>0">
					<regionTable :chartStatisticsVOS="chartStatisticsVOS"></regionTable>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	import regionTable from './components/regionTable'
	export default {
		components: {
			regionTable
		},
		data() {
			return {
				projectNums: 0,
				delayFinishedNums: 0,
				finishProportion: '0',
				examNums: 0,
				generalChange: '',
				maxProjectNumsList: [],
				minProjectNumsList: [],
				maxProportionList: [],
				minProportionList: [],
				maxExamNumsList: [],
				minExamNumsList: [],
				projectWidth: 0,
				propsrtionWidth: 0,
				examWidth: 0,
				chartStatisticsVOS: [],
				newWeekChange: '',
			};
		},
		props: {
			config: {
				type: Object,
				default () {
					return {}
				},
				required: true,
			}
		},
		watch: {
			config: {
				deep: true,
				handler: function(data) {
					if (data) {
						this.setData(data)
					}
				}
			}
		},
		methods: {
			setData(data) {
				this.projectNums = data.projectNums || 0;
				this.delayFinishedNums = data.delayFinishedNums || 0;
				this.finishProportion = data.finishProportion || '0';
				this.examNums = data.examNums || 0;
				this.newWeekChange = data.newWeekChange || '';
				if ('maxProjectNumsList' in data && data.maxProjectNumsList != null) {
					this.$set(this, 'maxProjectNumsList', data.maxProjectNumsList);
				} else {
					this.$set(this, 'maxProjectNumsList', []);
				}
				if ('minProjectNumsList' in data && data.minProjectNumsList != null) {
					this.$set(this, 'minProjectNumsList', data.minProjectNumsList);
				} else {
					this.$set(this, 'minProjectNumsList', []);
				}
				if ('maxProportionList' in data && data.maxProportionList != null) {
					this.$set(this, 'maxProportionList', data.maxProportionList);
				} else {
					this.$set(this, 'maxProportionList', []);
				}
				if ('minProportionList' in data && data.minProportionList != null) {
					this.$set(this, 'minProportionList', data.minProportionList);
				} else {
					this.$set(this, 'minProportionList', []);
				}
				if ('maxExamNumsList' in data && data.maxExamNumsList != null) {
					this.$set(this, 'maxExamNumsList', data.maxExamNumsList);
				} else {
					this.$set(this, 'maxExamNumsList', []);
				}
				if ('minExamNumsList' in data && data.minExamNumsList != null) {
					this.$set(this, 'minExamNumsList', data.minExamNumsList);
				} else {
					this.$set(this, 'minExamNumsList', []);
				}
				if (this.minProjectNumsList.length > 0 && this.maxProjectNumsList.length > 0) {
					this.projectWidth = this.minProjectNumsList[0].projectNums / this.maxProjectNumsList[0].projectNums * 100;
				} else {
					this.projectWidth = 0;
				}
				if (this.minProjectNumsList.length && this.maxProportionList.length) {
					this.propsrtionWidth = this.minProjectNumsList[0].expireProportion / this.maxProportionList[0].expireProportion *
						100;
				} else {
					this.propsrtionWidth = 0;
				}
				if (this.minExamNumsList.length && this.maxExamNumsList.length) {
					this.examWidth = this.minExamNumsList[0].examNums / this.maxExamNumsList[0].examNums * 100;
				} else {
					this.examWidth = 0;
				}
				this.$set(this, 'chartStatisticsVOS', data.chartStatisticsVOS)
			}
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
				height: 50px;
				line-height: 50px;
			}

			.overview__bottom1 {
				display: flex;
				flex-direction: column;
				justify-content: center;
				height: 80px;
				line-height: auto;
			}

			.overview__legend {
				display: flex;

				.overview__legend__item {
					display: flex;
					width: 50%;
					text-align: center;
				}

				.legend__label {
					font-size: 14px;
					font-weight: 400;
					color: rgba(102, 102, 102, 1);
					margin-right: 10px;
				}

				.legend__value {
					font-size: 14px;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
				}
			}
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

					.tall {
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

	.border__bottom {
		border-bottom: 1px solid #E6E6E6;
	}
</style>

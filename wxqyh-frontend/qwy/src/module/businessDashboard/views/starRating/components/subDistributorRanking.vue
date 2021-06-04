<template>
	<div class="sub__distributor__ranking">
		<div class="sub__distributor__ranking__title">{{title}}</div>
		<div class="sub__distributor__ranking__table__box">
			<!-- 上半年 -->
			<div class="sub__distributor__ranking__table">
				<div class="sub__distributor__ranking__table__title">
					<div class="name">{{year}}年上半年</div>
					<div class="line"></div>
				</div>
				<div class="sub__distributor__ranking__table__body" v-if="upArr.length > 0">
					<div class="sub__distributor__ranking__table__tr" v-for="(item,index) in upArr" :key="index">
						<div class="ranking__num" :class="['ranking__num'+(index+1)]">{{index+1}}</div>
							<div class="name">
								{{item.dealerShortName.length>6?item.dealerShortName.substring(0,6)+'...':item.dealerShortName}}
								<span class="show__name" v-if="item.dealerShortName.length>6">{{item.dealerShortName}}</span>
							</div>
						<div class="all__num">{{item.dealerErpNo}}</div>
						<div class="normal rise" v-if="item.rankingDiff*1>0">
							<span>{{item.rankingDiff}}</span>
							<img class="ranking__icon" src="../../../static/icon-rise.png" alt="" />
						</div>
						<div class="normal" v-if="item.rankingDiff*1==0">
							<span>-</span>
						</div>
						<div class="normal fall" v-if="item.rankingDiff*1<0">
							<span>{{item.rankingDiff}}</span>
							<img class="ranking__icon" src="../../../static/icon-fall.png" alt="" />
						</div>
					</div>
				</div>
			</div>
			<!-- 下半年 -->
			<div class="sub__distributor__ranking__table">
				<div class="sub__distributor__ranking__table__title">
					<div class="name">{{year}}年下半年</div>
					<div class="line"></div>
				</div>
				<div class="sub__distributor__ranking__table__body" v-if="downArr.length > 0">
					<div class="sub__distributor__ranking__table__tr" v-for="(item,index) in downArr" :key="index">
						<div class="ranking__num" :class="['ranking__num'+(index+1)]">{{index+1}}</div>
							<div class="name">
								{{item.dealerShortName.length>6?item.dealerShortName.substring(0,6)+'...':item.dealerShortName}}
								<span class="show__name" v-if="item.dealerShortName.length>6">{{item.dealerShortName}}</span>
							</div>
						<div class="all__num">{{item.dealerErpNo}}</div>
						<div class="normal rise" v-if="item.rankingDiff*1>0">
							<span>{{item.rankingDiff}}</span>
							<img class="ranking__icon" src="../../../static/icon-rise.png" alt="" />
						</div>
						<div class="normal" v-if="item.rankingDiff*1==0">
							<span>-</span>
						</div>
						<div class="normal fall" v-if="item.rankingDiff*1<0">
							<span>{{item.rankingDiff}}</span>
							<img class="ranking__icon" src="../../../static/icon-fall.png" alt="" />
						</div>
					</div>
				</div>
			</div>

		</div>

	</div>
</template>

<script>
	export default {
		props: {
			pieConfig: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		data() {
			return {
				year: '',
				title: '',
				upArr: [],
				downArr: [],
			}
		},
		watch: {
			pieConfig: {
				handler(data) {
					this.year = data.year;
					this.title = data.rankingTitle;
					data.upArr != undefined ? this.$set(this, 'upArr', data.upArr) : this.$set(this, 'upArr', []);
					data.downArr != undefined ? this.$set(this, 'downArr', data.downArr) : this.$set(this, 'downArr', []);
				},
				deep: true,
			}
		}
	}
</script>

<style lang="less" scoped>
	.sub__distributor__ranking {
		width: 100%;

		.sub__distributor__ranking__title {
			font-size: 20px;
			font-weight: bold;
			padding: 20px 0 20px 0;
		}

		.sub__distributor__ranking__table__box {
			display: flex;
			justify-content: space-between;

			.sub__distributor__ranking__table {
				width: 48%;

				.sub__distributor__ranking__table__title {
					.name {
						font-size: 14px;
						font-weight: bold;
						line-height: 25px;
					}

					.line {
						background: #C31725;
						width: 40px;
						height: 2px;
					}
				}

				.sub__distributor__ranking__table__body {
					.sub__distributor__ranking__table__tr {
						display: flex;
						align-items: center;
						margin-top: 18px;
						font-size: 14px;
						color: #666;

						.ranking__num {
							width: 24px;
							height: 24px;
							line-height: 24px;
							text-align: center;
							margin-right: 12px;
							border-radius: 50%;
						}

						.ranking__num1 {
							background: rgba(241, 64, 92, 1);
							color: #fff;
						}

						.ranking__num2 {
							background: rgba(255, 133, 71, 1);
							color: #fff;
						}

						.ranking__num3 {
							background: rgba(255, 188, 0, 1);
							color: #fff;
						}

						.name {
							position: relative;
							flex: 1;
							font-size: 14px;
							margin-right: 27px;
							&:hover .show__name{
								display: block;
							}
							.show__name{
								position: absolute;
								min-width: 140px;
								text-align: center;
								bottom: -105%;
								left: 20px;
								display: none;
								border: 1px solid #666;
								padding: 0 10px;
								background: #fff;
								font-size: 12px;
								box-shadow: 4px 4px 4px #ddd;
							}
						}

						.all__num {}

						.normal {
							min-width: 50px;
							text-align: right;
						}

						.rise {
							color: #00B563;
						}

						.fall {
							color: #D1031C;
						}

						.ranking__icon {
							width: 8px;
							height: 11px;
						}
					}
				}
			}
		}

	}
</style>

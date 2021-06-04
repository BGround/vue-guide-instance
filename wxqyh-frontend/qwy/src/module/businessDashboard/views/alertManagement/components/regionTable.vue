<template>
	<div>
		<table class="board__content__table" v-if="regionTableData.length>0">
			<tr class="board__content__th">
				<td class="board__content__td border__right" rowspan="2">战区</td>
				<td class="board__content__td border__right border__bottom" colspan="4">预警销售服务商</td>
				<td class="board__content__td border__right border__bottom" colspan="6">整改提升项目</td>
				<td class="board__content__td border__right" rowspan="2">考核</br>家数</td>
				<td class="board__content__td" rowspan="2">排名</td>
			</tr>
			<tr class="board__content__th">
				<td class="board__content__td">预警</td>
				<td class="board__content__td">陈述</td>
				<td class="board__content__td">整改</br>已完成</td>
				<td class="board__content__td border__right">整改</br>未完成</td>
				<td class="board__content__td">项目</br>总数</td>
				<td class="board__content__td">到期</br>完成项目</td>
				<td class="board__content__td">到期未</br>完成项目</td>
				<td class="board__content__td">进行</br>中项目</td>
				<td class="board__content__td">延期</br>项目</td>
				<td class="board__content__td">到期项</br>目完成率</td>
			</tr>
			<tbody>
				<tr class="board__content__tr " v-for="(item,index) in regionTableData" :key="index">
					<!-- 战区 -->
					<td class="board__content__td board__content__td1">{{item.area}}</td>
					<!-- 预警 -->
					<td class="board__content__td">{{item.warningNums}}</td>
					<!-- 陈述 -->
					<td class="board__content__td">{{item.stateNums}}</td>
					<!-- 整改已完成 -->
					<td class="board__content__td">{{item.finishedNums}}</td>
					<!-- 整改未完成 -->
					<td class="board__content__td">{{item.notFinishedNums}}</td>
					<!-- 项目总数 -->
					<td class="board__content__td">{{item.projectNums}}</td>
					<!-- 到期完成项目 -->
					<td class="board__content__td">{{item.delayFinishedNums}}</td>
					<!-- 到期未完成项目 -->
					<td class="board__content__td" style="color:#ED3E3E">
						{{item.delayNotFinishedNums}}
						<div class="tr__show__box" v-if="item.notFinishedDetails">{{item.notFinishedDetails}}</div>
					</td>
					<!-- 进行中项目 -->
					<td class="board__content__td">
						{{item.inProgressNums}}
						<div class="tr__show__box" v-if="item.inProgressDetails">{{item.inProgressDetails}}</div>
					</td>
					<!-- 延期项目 -->
					<td class="board__content__td">
						{{item.delayNums}}
						<div class="tr__show__box" v-if="item.delayDetails">{{item.delayDetails}}</div>
					</td>
					<!-- 到期项目完成率 -->
					<td class="board__content__td">
						{{item.expireProportion}}%
					</td>
					<!-- 考核家数 -->
					<td class="board__content__td">
						{{item.examNums}}
						<div class="tr__show__box" v-if="item.examDetails">{{item.examDetails}}</div>
					</td>
					<!-- 排名 -->
					<td class="board__content__td">{{item.top}}</td>
				</tr>
				<tr class="board__content__tr board__content__tr__total" v-for="(item,index) in totalTableData" :key="'t'+index">
					<td class="board__content__td board__content__td1">{{item.area}}</td>
					<td class="board__content__td">{{item.warningNums}}</td>
					<td class="board__content__td">{{item.stateNums}}</td>
					<td class="board__content__td">{{item.finishedNums}}</td>
					<td class="board__content__td">{{item.notFinishedNums}}</td>
					<td class="board__content__td">{{item.projectNums}}</td>
					<td class="board__content__td">{{item.delayFinishedNums}}</td>
					<td class="board__content__td" style="color:#ED3E3E">{{item.delayNotFinishedNums}}</td>
					<td class="board__content__td">{{item.inProgressNums}}</td>
					<td class="board__content__td">{{item.delayNums}}</td>
					<td class="board__content__td">{{item.expireProportion}}%</td>
					<td class="board__content__td">{{item.examNums}}</td>
					<td class="board__content__td">{{item.top}}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	export default {
		props: {
			chartStatisticsVOS: {
				type: Array,
				default(){
					return []
				}
			},
		},
		data() {
			return {
				regionTableData: [],
				totalTableData: [],
			}
		},
		watch: {
			chartStatisticsVOS: {
				handler(data) {
					if (data) {
						let arr1 = data.filter(item => {
							return item.area != '合计'
						})
						let arr2 = data.filter(item => {
							return item.area === '合计'
						})
						this.$set(this, 'regionTableData', arr1)
						this.$set(this, 'totalTableData', arr2)
					}
				},
				deep: true,
				immediate: true,
			}
		},
		methods:{
		}
	}
</script>

<style lang="less" scoped>
	.board__content__table {
		width: 100%;
		border: 1px solid #E6E6E6;
		border-bottom: 0 none;
		table-layout: fixed;
		font-size: 12px;

		.board__content__th {
			width: 100%;
			border-bottom: 1px solid #E6E6E6;

			.board__content__td {
				height: 40px;
				background: rgba(20, 30, 40, .1);
			}
		}

		.board__content__tr {
			width: 100%;
			border-bottom: 1px solid #E6E6E6;

			.board__content__td {
				line-height: 48px;
				position: relative;
				.tr__show__box{
					display: none;
					position: absolute;
					left: 100%;
					top: 0;
					z-index: 1000;
					box-shadow: 4px 4px 4px #ddd;
					background: #fff;
					width: 100px;
					padding: 10px;
					line-height: normal;
				}
				&:hover .tr__show__box{
					display: block;
				}
			}
		}

		.board__content__tr__bg {
			background: rgba(247, 247, 247, 1);
		}

		.board__content__tr__total {
			font-weight: bold;
		}

		.board__content__td {
			height: 48px;
			text-align: center;
		}
	}

	.border__right {
		border-right: 2px solid #fff;
	}

	.border__bottom {
		border-bottom: 2px solid #fff;
	}
</style>

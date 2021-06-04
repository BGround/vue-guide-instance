<template>
	<table class="board__content__table">
		<tr class="board__content__th">
			<td class="board__content__td">类别</td>
			<td class="board__content__td">类别</td>
			<td class="board__content__td">1月</td>
			<td class="board__content__td">2月</td>
			<td class="board__content__td">3月</td>
			<td class="board__content__td">4月</td>
			<td class="board__content__td">5月</td>
			<td class="board__content__td">6月</td>
			<td class="board__content__td">7月</td>
			<td class="board__content__td">8月</td>
			<td class="board__content__td">9月</td>
			<td class="board__content__td">10月</td>
			<td class="board__content__td">11月</td>
			<td class="board__content__td">12月</td>
			<td class="board__content__td">合计</td>
		</tr>
		<tbody>
			<tr class="board__content__tr">
				<td class="board__content__td board__content__td1">预警</td>
				<td class="board__content__td">/</td>
				<td class="board__content__td" v-for="(warning,index) in warningList" :key="index">{{warning}}</td>
				<td class="board__content__td">{{warningTotal}}</td>
			</tr>
			<tr class="board__content__tr">
				<td class="board__content__td board__content__td2">陈述</td>
				<td class="board__content__td">/</td>
				<td class="board__content__td" v-for="(state,index) in stateList" :key="index">{{state}}</td>
				<td class="board__content__td">{{stateTotal}}</td>
			</tr>
			<tr class="board__content__tr">
				<td class="board__content__td board__content__td3" rowspan="4">整改</td>
				<td class="board__content__td" style="line-height:normal">整改</br>完成率</td>
				<td class="board__content__td" v-for="(complete,index) in completeList" :key="index">{{complete}}</td>
				<td class="board__content__td">{{completeTotal}}</td>
			</tr>
			<tr class="board__content__tr">
				<td class="board__content__td">完成</td>
				<td class="board__content__td" v-for="(finished,index) in progressFinishedList" :key="index">{{finished}}</td>
				<td class="board__content__td">{{progressFinishedTotal}}</td>
			</tr>
			<tr class="board__content__tr">
				<td class="board__content__td">进行中</td>
				<td class="board__content__td" v-for="(ongoing,index) in ongoingList" :key="index">{{ ongoing}}</td>
				<td class="board__content__td">{{ongoingTotal}}</td>
			</tr>
			<tr class="board__content__tr">
				<td class="board__content__td">未完成</td>
				<td class="board__content__td" v-for="(progressUnfinished,index) in progressUnfinishedList" :key="index">{{progressUnfinished}}</td>
				<td class="board__content__td">{{progressUnfinishedTotal}}</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
	export default {
		props: {
			listWarning: {
				type: Array,
				default () {
					return []
				}
			},
			listState: {
				type: Array,
				default () {
					return []
				}
			},
			listProgress: {
				type: Array,
				default () {
					return []
				}
			},
		},
		data() {
			return {
				stateList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				warningList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				progressUnfinishedList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				progressFinishedList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				ongoingList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				completeList: ['0%', '0%', '0%', '0%', '0%', '0%', '0%', '0%', '0%', '0%', '0%', '0%'],
				stateTotal: 0,
				warningTotal: 0,
				progressUnfinishedTotal: 0,
				progressFinishedTotal: 0,
				ongoingTotal: 0,
				completeTotal: '0%',
				dataArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			};
		},
		watch: {
			listState: {
				handler(data) {
					let that = this;
					if (data.length > 0) {
						that.stateTotal = 0;
						let arr = JSON.parse(JSON.stringify(this.dataArr));
						data.forEach(item => {
							arr.splice(item.month - 1, 1, item.total);
							that.stateTotal += item.total * 1;
						})
						this.$set(this,'stateList',arr);
					} else {
						that.stateTotal = 0;
						this.$set(this, 'stateList', this.dataArr)
					}
				},
				deep: true,
				immediate: true,
			},
			listWarning: {
				handler(data) {
					let that = this;
					if (data.length > 0) {
						that.warningTotal = 0;
						let arr = JSON.parse(JSON.stringify(this.dataArr));
						data.forEach(item => {
							arr.splice(item.month - 1, 1, item.total);
							that.warningTotal += item.total * 1;
						})
						this.$set(this,'warningList',arr)
					} else {
						that.warningTotal = 0;
						this.$set(this, 'warningList', this.dataArr)
					}
				},
				deep: true,
				immediate: true,
			},
			listProgress: {
				handler(data) {
					let that = this;
					if (data.length > 0) {
						that.progressFinishedTotal = 0;
						that.ongoingTotal = 0;
						that.progressUnfinishedTotal = 0;
						let arr1 = JSON.parse(JSON.stringify(this.dataArr));
						let arr2 = JSON.parse(JSON.stringify(this.dataArr));
						let arr3 = JSON.parse(JSON.stringify(this.dataArr));
						data.forEach(item => {
							if (item.progress === '完成') {
								arr1.splice(item.month - 1, 1, item.total);
								that.progressFinishedTotal += item.total * 1;
							} else if (item.progress === '进行中') {
								arr2.splice(item.month - 1, 1, item.total);
								that.ongoingTotal += item.total * 1;
							} else if (item.progress === '未完成') {
								arr3.splice(item.month - 1, 1, item.total);
								that.progressUnfinishedTotal += item.total * 1;
							}
						})
						this.$set(this,'progressFinishedList',arr1)
						this.$set(this,'ongoingList',arr2)
						this.$set(this,'progressUnfinishedList',arr3)
						let finishTotal = that.progressFinishedTotal + that.ongoingTotal + that.progressUnfinishedTotal;
						that.completeTotal = Math.round(that.progressFinishedTotal / finishTotal * 100) + '%';
						let complete = [];
						that.completeList.forEach((item, index) => {
							let total = 0;
							if (that.progressFinishedList[index] != undefined && that.ongoingList[index] != undefined && that.progressUnfinishedList[
									index] != undefined) {
								total = that.progressFinishedList[index] + that.ongoingList[index] + that.progressUnfinishedList[index];
							}
							if (total > 0) {
								let completeItem = Math.round(that.progressFinishedList[index] / total * 100) + '%';
								complete.push(completeItem)
							} else {
								complete.push('0%');
							}
						})
						this.$set(this, 'completeList', complete)
					} else {
						let arr = ['0%', '0%', '0%', '0%', '0%', '0%', '0%', '0%', '0%', '0%', '0%', '0%'];
						that.progressFinishedTotal = 0;
						that.ongoingTotal = 0;
						that.progressUnfinishedTotal = 0;
						that.completeTotal = '0%';
						this.$set(this, 'progressFinishedList', this.dataArr)
						this.$set(this, 'ongoingList', this.dataArr)
						this.$set(this, 'progressUnfinishedList', this.dataArr)
						this.$set(this, 'completeList', arr)
					}
				},
				deep: true,
				immediate: true,
			}
		},
	}
</script>

<style lang="scss" scoped>
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
				background: rgba(20, 30, 40, .1);
			}
		}

		.board__content__tr {
			width: 100%;
			border-bottom: 1px solid #E6E6E6;
		}

		.board__content__td {
			height: 48px;
			line-height: 48px;
			text-align: center;
		}

		.board__content__td1 {
			color: rgba(230, 55, 82, 1);
			background: rgba(247, 223, 226, 1);
		}

		.board__content__td2 {
			color: rgba(91, 143, 249, 1);
			background: rgba(224, 232, 249, 1);
		}

		.board__content__td3 {
			color: rgba(253, 151, 7, 1);
			background: rgba(247, 241, 222, 1);
		}
	}
</style>

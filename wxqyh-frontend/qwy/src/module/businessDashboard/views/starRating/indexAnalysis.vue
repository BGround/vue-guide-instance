<template>
	<div class="region">
		<div class="board__content">
			<template v-if="pieConfigArr.length>0">
				<div class="pie__box" v-for="(item,index) in pieConfigArr" :key="index">
					<indexAnalysisPieChart :chartId="'pie'+index" :pieConfig="item"></indexAnalysisPieChart>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
	import indexAnalysisPieChart from './components/indexAnalysisPieChart'
	export default {
		components: {
			indexAnalysisPieChart
		},
		data() {
			return {
				pieConfig: {},
				pieConfigArr: []
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
				handler(data) {
					this.$set(this, 'pieConfigArr', data.indexAnalysis)
				}
			}
		},
		methods: {

		},
	}
</script>

<style lang="scss" scoped>
	@import '~@/module/businessDashboard/scss/common/board.scss';

	.region {
		.board__content {
			flex-wrap: wrap;
			justify-content: flex-start;

			.pie__box {
				width: 278px;
				height: 230px;
				padding: 20px 20px 0;
				background: rgba(247, 247, 247, 1);
				border: 1px solid rgba(230, 230, 230, 1);
				border-radius: 4px;
				box-sizing: border-box;
				margin-right: 10px;
				margin-bottom: 10px;
			}

		}
	}
</style>

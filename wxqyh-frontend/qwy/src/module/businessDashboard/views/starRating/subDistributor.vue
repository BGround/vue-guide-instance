<template>
	<div class="region">
		<div class="board__content">
			<div class="sub__distributor__rangking__box">
				<subDistributorRanking :pieConfig="fiveStarConfig"></subDistributorRanking>
			</div>
			<div class="sub__distributor__rangking__box">
				<subDistributorRanking :pieConfig="oneStarConfig"></subDistributorRanking>
			</div>
		</div>
	</div>
</template>

<script>
	import subDistributorRanking from './components/subDistributorRanking'
	export default {
		components: {
			subDistributorRanking
		},
		data() {
			return {
				showYear: null,
				pieConfig: {},
				oneStarConfig: {},
				fiveStarConfig: {},
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
					let oneObj = {};
					let fiveObj = {};
					oneObj.rankingTitle = "一星BOP10";
					oneObj.year = data.year;
					oneObj.upArr = data.dealerSituation.starOneUpRankVOList;
					oneObj.downArr = data.dealerSituation.starOneDownRankVOList;
					fiveObj.rankingTitle = "五星TOP10";
					fiveObj.year = data.year;
					fiveObj.upArr = data.dealerSituation.starFiveUpRankVOList;
					fiveObj.downArr = data.dealerSituation.starFiveDownRankVOList;
					this.$set(this,'oneStarConfig',oneObj)
					this.$set(this,'fiveStarConfig',fiveObj)
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
			justify-content: space-between;
			.sub__distributor__rangking__box{
				width: 49%;
				box-sizing: border-box;
				padding: 0 20px 30px;
				background:rgba(255,255,255,1);
				border:1px solid rgba(230,230,230,1);
				border-radius:4px;
			}
		}
	}
</style>
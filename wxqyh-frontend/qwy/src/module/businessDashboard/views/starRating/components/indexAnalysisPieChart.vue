<template>
	<div :id="chartId" class="pie__chart"></div>
</template>

<script>
	let colors = ['#5B8FF9','#73DEB3','#F7C739','#EB7F65','#7585A2'];
	import echarts from 'echarts'
	export default {
		props: {
			chartId: {
				type: String,
				default: 'chartId'
			},
			pieConfig: {
				type: Object,
				default(){
					return {}
				}
			}
		},
		data() {
			return {
				chart: null,
				
				chartOption: {
					title: {
						text: '天气情况统计',
					},
					color: colors,
					tooltip: {
						trigger: 'item',
						formatter: '{b} : {c} ({d}%)'
					},
					grid: {
						bottom: 0,
					},
					legend: {
						type: 'scroll',
						orient: 'vertical',
						top: 'middle',
						left: '0',
						data: ['西凉', '益州', '兖州', '荆州', '幽州'],
						itemWidth: 14,
						textStyle:{
							fontSize: 10,
						},
						itemGap: 4,
						formatter: function(name){
							let str = name;
							if(name.length>8){
								let arr = [];
								arr.push(name.slice(0,6))
								arr.push(name.slice(6))
								str = arr.join('\n')
							}
							return str;
						}
					},
					series: {
						type: 'pie',
						radius: '60%',
						center: ['70%', '50%'],
						selectedMode: 'single',
						data: [],
					}
				}
			};
		},
		watch: {
			pieConfig: {
				deep: true,
				immediate: true,
				handler(data) {
					this.setData(data)
					this.$nextTick(() => {
						this.initChart()
					})
				}
			}
		},
		methods: {
			setData(data){
				let obj = {};
				obj.text = data.targetName;
				let seriseData = [];
				let legendData = [];
				this.$set(this.chartOption,'title',obj)
				data.itemVOList.forEach(item=>{
					legendData.push(item.targetTerm)
					seriseData.push({
						value: item.numbers*1,
						name: item.targetTerm,
						label: {
							normal: {
								formatter: '{d}%',
								position: 'inside'
							}
						},
					})
				})
				this.$set(this.chartOption.series,'data',seriseData)
				this.$set(this.chartOption.legend,'data',seriseData)
			},
			initChart() {
				let that = this;
				let dom = document.getElementById(that.chartId);
				this.chart = echarts.init(dom,{width: '100%'});
				this.chart.setOption(that.chartOption)
				window.addEventListener('resize', this.resetChartSize)
			}
		}
	}
</script>

<style lang="less" scoped>
	.pie__chart {
		width: 100%;
		height: 100%;
	}
</style>

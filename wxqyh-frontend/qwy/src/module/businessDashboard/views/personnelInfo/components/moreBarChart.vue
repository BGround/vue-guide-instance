<template>
	<div ref="area-chart" class="market-discipline-area-chart">

	</div>
</template>

<script>
	import echarts from 'echarts'
	export default {
		name: "marketDisciplineAreaChart",
		data() {
			return {
				chart: null,
				chartOption: {
					color: ['#5B8FF9', '#73DEB3', '#FD9707'],
					legend: {
						show: false,
						data: ['应配备人数', '实配备人数', '配备率'],
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
						formatter: '{a} <br/>{b}月: {c}'
					},
					grid: {
						top: 12,
						left: 0,
						right: 0,
						bottom: 0,
						containLabel: true
					},
					xAxis: {
						type: 'category',
						show: false,
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
					yAxis: [{
							show: false,
							min: 0,
							max: 100,
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
						{
							show: false,
							type: 'value',
							name: '百分比',
							min: 0,
							max: 100,
							maxInterval: 100,
							minInterval: 0,
							interval: Math.ceil(100 / 7 * 100) / 100,
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
								// 分割线
								lineStyle: {
									color: '#E6E6E6',
									type: 'dashed'
								}
							},
							axisLine: {
								// 轴线
								lineStyle: {
									color: '#DBDBDB'
								},
								show: false
							},
						}
					],
					series: [{
							name: '应配备人数',
							type: 'bar',
							barWidth: 13,
							data: [],
							label:{
								show: true,
								position: 'top',
								fontSize: 8,
							},
						},
						{
							name: '实配备人数',
							type: 'bar',
							barWidth: 13,
							data: [],
							label:{
								show: true,
								position: 'top',
								fontSize: 8,
							},
						},
						{
							name: '配备率',
							type: 'line',
							barWidth: 13,
							data: [],
							smooth: true,
							label:{
								show: true,
								position: 'top',
								fontSize: 8,
							},
							lineStyle: {
								width: 2,
								shadowColor: 'rgba(230,55,82,0.5)',
								shadowBlur: 2,
								shadowOffsetY: 4
							},
						}
					]
				}
			}
		},
		props: {
			option: {
				type: Object,
			},

		},
		watch:{
			option:{
				handler(data){
					if (data.allocation) {
						this.chartOption.series[0].data = data.allocation
					}
					if (data.realPeople) {
						this.chartOption.series[1].data = data.realPeople
					}
					if (data.actualRatio) {
						this.chartOption.series[2].data = data.actualRatio
					}
					this.$nextTick(()=>{
						this.initChart()
					})
				},
				deep:true,
				immediate:true,
			}
		},
		methods: {
			resetChartSize() {
				this.chart.resize()
			},
			initChart(){
				const dom = this.$refs['area-chart']
				this.chart = echarts.init(dom);
				this.chart.setOption(this.chartOption)
				window.addEventListener('resize', this.resetChartSize)
			},
			legendToggleSelect(name) {
				this.chart.dispatchAction({
					type: 'legendToggleSelect',
					name: name // 图例名称
				})
			}
		},
		mounted() {
			
		}
	}
</script>

<style lang="scss" scoped>
	.market-discipline-area-chart {
		height: 100%;
	}
</style>

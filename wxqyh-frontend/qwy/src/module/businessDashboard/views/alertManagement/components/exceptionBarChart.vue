<template>
	<div :id="chartId" class="exception__chart"></div>
</template>

<script>
	import echarts from 'echarts'
	export default {
		props: {
			chartId: {
				type: String,
				default: 'chartIds'
			},
			chartTitle: {
				type: String,
				default: ''
			},
			areaMap:{
				type: Array,
				default(){
					return {}
				}
			},
			proportion:{
				type: Array,
				default(){
					return {}
				}
			},
		},
		data() {
			return {
				chart: null,
				chartOption: {
					title: {
						text: '柱状图',
						x: 'center', //可设定图例在左、右、居中
						y: '4%'
					},
					color: ['#5B8FF9', '#FD9707'],
					tooltip: {
						trigger: 'axis',
					},
					grid: {
						top: '20%',
						right: '15%',
						left: '10%',
						bottom: '20%',
					},
					legend: {
						x: 'center', //可设定图例在左、右、居中
						y: '90%',
						itemWidth: 8,
						itemHeight: 8,
						textStyle: {
							fontSize: 10,
							color: '#999'
						},
						data: ['经销商家数', '占比']
					},
					xAxis: {
						type: 'category',
						axisTick: {
							show: false,
						},
						axisLabel: {
							interval: 0,
							rotate: 20,
							fontSize: 9,
							align: 'center',
							verticalAlign: 'top',
							color: '#666'
						},
						axisLine: {
							// 轴线
							lineStyle: {
								color: '#E6E6E6'
							},
						},
						data: ['店面异常', '目标未达成', '能力异常', '渠道异常', '人员异常', '运营异常', '资金异常', '其他']
					},
					yAxis: [{
							type: 'value',
							name: '数量',
							min: 0,
							max: 50,
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
								show: true,
								lineStyle: {
									type: 'dashed'
								}
							},
						},
						{
							type: 'value',
							name: '百分比',
							min: 0,
							max: 100,
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
								show: true,
								lineStyle: {
									type: 'dashed'
								}
							},
							axisLabel: {
								formatter: '{value}%'
							}
						}
					],
					series: [{
							name: '经销商家数',
							type: 'bar',
							barWidth: '10',
							data: [0, 0, 0, 0, 0, 0, 0, 0]
						},
						{
							name: '占比',
							smooth: true,
							type: 'line',
							yAxisIndex: 1,
							symbol: 'none',
							lineStyle: {
								color: '#FD9707',
								width: 2,
								shadowColor: 'rgba(253,151,7,0.5)', //设置折线阴影
								shadowBlur: 10,
								shadowOffsetY: 10,
							},
							data: ['0', '0', '0', '0', '0', '0', '0', '0']
						}
					]
				}
			};
		},
		watch:{
			areaMap:{
				handler(data){
					if(data){
						this.setChartOption(data)
						this.initChart()
					}
				},
				deep: true,
				immediate: true,
			}
		},
		mounted() {
			this.initChart()
		},
		methods: {
			setChartOption(data){
				let that = this;
				let arr = [0,0,0,0,0,0,0,0]
				data.forEach((item,index)=>{
					if(item.type === '店面异常'){
						arr[0] = item.total;
					}else if(item.type === '目标未达成'){
						arr[1] = item.total;
					}else if(item.type === '能力异常'){
						arr[2] = item.total;
					}else if(item.type === '渠道异常'){
						arr[3] = item.total;
					}else if(item.type === '人员异常'){
						arr[4] = item.total;
					}else if(item.type === '运营异常'){
						arr[5] = item.total;
					}else if(item.type === '资金异常'){
						arr[6] = item.total;
					}else if(item.type === '其他'){
						arr[7] = item.total;
					}
				})
				this.$set(this.chartOption.series[0],'data',arr)
				// this.chartOption.series[0]['data'] = arr;
				let arr1 = [0,0,0,0,0,0,0,0]
				this.proportion.forEach(item=>{
					if(item.type === '店面异常'){
						arr1[0] = item.proportion;
					}else if(item.type === '目标未达成'){
						arr1[1] = item.proportion;
					}else if(item.type === '能力异常'){
						arr1[2] = item.proportion;
					}else if(item.type === '渠道异常'){
						arr1[3] = item.proportion;
					}else if(item.type === '人员异常'){
						arr1[4] = item.proportion;
					}else if(item.type === '运营异常'){
						arr1[5] = item.proportion;
					}else if(item.type === '资金异常'){
						arr1[6] = item.proportion;
					}else if(item.type === '其他'){
						arr1[7] = item.proportion;
					}
				})
				this.$set(this.chartOption.series[1],'data',arr1)
				// this.chartOption.series[1]['data'] = arr1;
				this.$set(this.chartOption.title,'text',this.chartTitle)
				// that.chartOption.title.text = this.chartTitle;
				
			},
			resetChartSize() {
				this.chart.resize()
			},

			initChart() {
				const dom = document.getElementById(this.chartId);
				this.chart = echarts.init(dom);
				this.chart.setOption(this.chartOption)
				window.addEventListener('resize', this.resetChartSize)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.exception__chart {
		width: 100%;
		height: 100%;
	}
</style>

<template>
	<div class="nodata">
		<i class="ico_nodata"></i>
		<p>暂无数据</p>
	</div>
</template>

<script type="text/javascript">
	export default{
		name:'noData',

	}
</script>

<style type="text/css">
	.nodata{
		padding-top: 110px;
    	text-align: center;
    	min-height: 505px;
	}
	.nodata .ico_nodata{
		display: block;
		width: 80px;
		height: 80px;
		margin: 0 auto 20px;
		background: url(../../assets/images/form_noData.png) no-repeat;
	}
	.nodata p{
		color: #999;
    	font-size: 16px;
	}
</style>
<template>
  <div class="main">
	<div class="left">
		<Left></Left>
	</div>
	<div class="right">
		<div class="top">
			<img src="../../public/img/title.jpg" />
		</div>
		<div class="bottom">
			<Right></Right>
		</div>
	</div>
	
  </div>
</template>

<script type="text/javascript">
	import Left from './Left.vue'
	import Right from './Right.vue'
	export default {
		components: {
			Left,
			Right
		}
	}
</script>

<style scoped>
	*{
		padding: 0;
		margin: 0;
	}
	.left{
		width: 150px;
		float: left;
		margin-left: 10px;
		margin-right: 20px;
	}
	.right{
		width: 1000px;
		float: right;
		margin-left: 10px;
	}
	.main{
		width: 1200px;
		margin: 20px auto;
	}
	.top img{
		height: 200px;
		width: 1000px;
	}
	.left, .right{
		background-color: #f5f5f5;
		height: 600px;
	}
	
</style>

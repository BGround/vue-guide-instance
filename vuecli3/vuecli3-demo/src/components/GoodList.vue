<template>
	<div name="show">
		<ul class="goodList">
			<li v-for="good in list" :key="good.id">
				<img v-bind:src="good.img">
				<p>{{good.goodName}}</p>
			</li>
		</ul>
	</div>
</template>

<script type="text/javascript">
	export default{
		name: "show",
		data(){
			var obj = this;
			var url = "";
			if(obj.goodId == '1') {
				url = "json/bjb.json";
			}else if(obj.goodId == '2') {
				url = "json/phone.json";
			}else {
				url = "json/bjb.json";
			}
			this.$http.get(url).then(function(res){
				obj.list = res.data;
			})
			return{
				list: []
			}
		},
		props:{
			goodId: Number
		},
		watch:{
			goodId(){
				var obj = this;
				var url = "";
				if(obj.goodId == '1') {
					url = "json/bjb.json";
				} else if(obj.goodId == '2') {
					url = "json/phone.json";
				}
				this.$http.get(url).then(function(res){
					obj.list = res.data;
				})
				return{
					list: []
				}
			}
		}
	}
</script>

<style type="text/css">
	.goodList li{
		width: 190px;
		height: 190px;
		float: left;
		list-style: none;
		color: red;
		margin-bottom: 30px;
		font-size: 10px;
	}
	.goodList img{
		width: 180px;
		height: 180px;
	}
</style>

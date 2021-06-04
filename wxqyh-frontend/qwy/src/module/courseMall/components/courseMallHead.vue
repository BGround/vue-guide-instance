<template>
	<div class="mallHead clearfix">
		<div class="head-main">
			<router-link :to="{name: 'list'}" class="">
				<div class="head-logo">
					<span class="">课程商城</span>
				</div>
			</router-link>
			<div class="head-r">
				<span class="searchBox mr50">
    	            <input placeholder="搜索课程名称" class="inputSearchBox" type="text" v-model="subjectName" @keyup.enter="searchCourse">
    	            <input class="submitSearchBtn" type="button" value="" @click="searchCourse">
    	        </span>
				<a class="" target="_blank" :href="baseURL+'/manager/companysrv/order_list.jsp'">课程订单</a>
				<span class="borderLine"></span>
				<a class="" target="_blank" :href="baseURL+'/manager/companysrv/account.jsp'">企业账户</a>
				<span class="borderLine"></span>
				<a class="" target="_blank" href="http://wbg.do1.com.cn/School/">帮助</a>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name:'head',
  		props:["pagedata"],
		methods:{
			"searchCourse":function(){
				if(this.subjectName==''){return}
				this.$router.push({name: 'list'});
				this.pagedata.param.subjectName = this.subjectName;
				this.pagedata.param.grandId = '';
				this.pagedata.param.parentId = '';
				this.pagedata.param.id = '';
				this.pagedata.param.orderWay = '';
				this.pagedata.param.freeYON = '';
				//分类不显示
				this.pagedata.isHideCategory = true;
				if(this.pagedata.pageDataInit){
					this.pagedata.pageDataInit(1);
				}
			}
		},
  		data(){
  		  return {
  		  	subjectName:'',
  		  	baseURL:_.baseURL
  		}
  		}
	}
</script>

<style>
	.mallHead{
		background: #fcfcfc;
		border-bottom: 1px solid #ddd;
	}
	.head-main{
		position: relative;
		width: 1200px;
		height: 49px;
		line-height: 49px;
		margin:0 auto;
	}
	.head-logo{
		float: left;
		padding-left: 178px;
		background: url(../../../assets/images/logo_mall.png) no-repeat center left;
	}
	.head-logo span{
		padding-left: 10px;
		font-size: 16px;
		color: #666;
		border-left: 1px solid #ddd
	}
	.head-r{
		float: right;
	}
	.borderLine{
		display: inline-block;
		height:10px;
		margin: 0 10px;
		border-left: 1px solid #ddd;
	}
	.searchBox {
		position: relative;
		display: inline-block;
		width: 208px;
		height: 30px;
		border-radius: 2px;
		border: 1px solid #ccc;
		background: #fff;
		vertical-align: middle;
	}
	
	.inputSearchBox {
		width: 165px;
		margin-left: 10px;
		color: #333;
		line-height: 26px;
		border: none;
		font-family: inherit;
		vertical-align: top;
	}
	
	.submitSearchBtn {
		position: absolute;
		top: 0;
		right: 0;
		width: 32px;
		height: inherit;
		background: url("../../../assets/images/search_icon.png") no-repeat center center;
		border: none;
		border-left: 1px solid #ccc;
		cursor: pointer;
	}
	
	.submitSearchBtn:hover {
		background-color: #f5f5f5;
	}
</style>
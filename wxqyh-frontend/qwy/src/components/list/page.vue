<!-- 组件说明：
pageData: {
	page: 1
	pageSize: 15
	maxPage: 1
	totalRows: ''
}
change  回调函数

在父组件中如何使用：
<parent>
	<page :pageData="" @change="" ></page>
</parent>
-->

<template>
	<div class="pager-nav">
		<slot name="top"></slot>
		<ul class="clearfix">
    		<li class="shownum">每页显示
				<select name="showNum" class="numSelection" @change="pageSizeChange()" v-model="pageData.pageSize">
					<option v-for="item in pageSizeOption" :key="item" :value="item">{{item}}</option>
				</select>
				条
			</li>
    		<li class="shownum">共计{{pageData.totalRows}}条</li>
			<li class="pager-prev" @click="prev" v-if="pageData.page > 1">上一页</li>
    	  	<li class="page" :class="[{more:index=='...'},{active:pageData.page==index}]" v-for="index in indexs" @click="pageChange(index)">{{index}}</li>
			<li class="pager-next" @click="next" v-if="pageData.page > 0 && pageData.page < pageData.maxPage">下一页</li>
    	</ul>
		<slot name="bottom"></slot>
	</div>
</template>

<script>
import axios from 'axios'
export default {
  	name: 'page',
	computed:{
		indexs:function(){
			return this.pageIndex();
		}
	},
	props:["pageData"],
  props: {
    pageData: {
      type: Object,
      required: true
    },
    pageSizeOption: {
      type:Array,
      default:function(){
        return [10, 20, 50, 100]
      }
    },
  },
	data() {
		return {
			// pageSizeOption: [10, 20, 50, 100]
		}
	},
	methods:{
		vaild() {
			let str = this.pageData.pageSize + '';
			this.pageData.pageSize = str.replace(/[^\d]/g,'')
		},
		prev() {
			if(this.pageData.page <= this.pageData.maxPage) {
				this.pageChange(this.pageData.page - 1)
			}
		},
		next() {
			if(this.pageData.page >= 1) {
				this.pageChange(this.pageData.page + 1)
			}
		},
		pageChange(index) {
			if(index == 'active' || index == '...' || index == this.pageData.page) {
				return
			}
			this.pageData.page = index
			this.$emit('change', this.pageData.page, this.pageData.pageSize)
		},
		pageSizeChange() {
			if(this.pageData.page == 1) {
				this.$emit('change', this.pageData.page, this.pageData.pageSize)
			} else {
				this.pageChange(1)
			}
		},
		//分页页码
		pageIndex: function() {
			var index = parseInt(this.pageData.page);
			var sum = parseInt(this.pageData.maxPage);
			var left = 1;
			var right = sum;
			var ar = [];
			if (sum >= 7) {
				if (index > 3 && index < sum - 2) {
					left = index - 2
					right = index + 2
				} else {
					if (index <= 3) {
						left = 1
						right = 6
					} else {
						right = sum
						left = sum - 4
					}
				}
			}
			if(left!=1){
				if(left > 2) {
					ar.unshift("...")
				}
				ar.unshift(1);
			}
			while (left <= right) {
				ar.push(left)
				left++
			}
			if (index <= sum - 3 && right != sum) {
				if(right < sum -1) {
					ar.push("...")
				}
				ar.push(sum);
			}
			this.pageData.indexs=ar;
			return ar;
		}
	},
	watch: {
		'pageData': {
			handler(newVal) {
				if(newVal.totalRows < newVal.pageSize * newVal.page) {
					newVal.page = newVal.maxPage
				}
			}
		}
	}
}
</script>

<style>
	.pager-nav {
		margin: 30px 0 21px;
		text-align: center;
	}
	.pager-nav ul {
    	display: inline-block;
	}
	.pager-nav li {
	  	float: left;
	  	margin: 0 5px;
	  	padding: 0px 5px 0 5px;
	  	min-width: 28px;
	  	height: 28px;
	  	font-size: 13px;
	  	color: #B3B3B3;
	  	line-height: 28px;
	  	cursor: pointer;
    	border: solid 1px #E4E7E9;
    	background-color: #F6F7F7;
	  	border-radius: 4px;
	}
	.pager-nav li:hover{
		color: #fff;
  		background-color: #C31725;
	}
	.pager-nav li.active{
		color: #fff;
  		background-color: #C31725;
	}
	.pager-nav li.more{
	  	border: none;
	  	background: none;
	  	min-width: 5px;
	  	font-size: 14px;
    	color: #333;
	}
	.pager-nav li.more:hover{
	  	border: none;
	  	background: none;
	}
	.pager-nav .shownum{
		font-size: 14px;
	  	color: #999;
		border: none;
		background: none;
		cursor: auto;
	}
	.pager-nav .shownum:hover{
	  	color: #999;
    	border: none;
    	background: none;
	}
	.pager-nav .numSelection {
		color: #999;
		border: 1px solid #ddd;
	}
</style>

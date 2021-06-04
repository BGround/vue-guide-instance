<template>
	<div class="wrap qwui-myCheck" v-windowscroll="scrollList">
		<div class="searchFixed mt10">
      		<search-box 
				:searchinput="searchBar"
			  	:placeholder = "placeholder"
				@listenToSearchBox="showMsgFromSearchBox">
      		</search-box>
    	</div>
		<!--让搜索框顶部悬浮，占位作用-->
		<div class="seize"></div>
		<!--考核结果列表-->
		<div class="check_list" v-if="!hasrecord.show">
			<div class="list_item" v-for="(item,index) in checkList" :key="index">
				<div class="flex_col">
				<div class="list_score">{{ item.totalScore }}</div>
				<p>总分</p>
				</div>
				<div class="item_info">
					<p class="check_name">{{ item.name }}</p>
					<p class="check_time">{{ item.startTime }} 至 {{ item.endTime }}</p>
					<p class="check_garde">评级：{{ item.degree }}</p>
				</div>
			</div>
		</div>

		<!--无数据时显示-->
		<no-record :hasrecord='hasrecord' v-if="hasrecord.show"></no-record>

		<!--更多数据-->
		<load-more v-bind="loadMoreMes"></load-more>
	</div>
</template>
<script>
import searchBox from '@/components/base/search_box';
import loadMore from '@/components/list/load_more';
import noRecord from '@/components/base/no_record';
import { getCheckList } from '../../api/getData';

export default {
	name: 'myCheck',
	components:{
		searchBox, //搜索组件
		loadMore, //加载更多组件
		noRecord, //无数据显示
	},
    data() {
      return {
		  	searchBar: {
				show:true, //显示搜索框
			},
			placeholder:'搜索关键词',
			loadMoreMes:{  // 加载更多配置
				loading:false,
				currPage:1,
				maxPage:1,
			},
			params:{
				page:1, //页数
				"searchValue.markName":"", //搜索条件:考核名称模糊搜索
			},
			checkList:[], //考核数据列表
			hasrecord:{  //无数据配置
				 show: false,
				 icon: "icon_noCheck",
				 text:"没有搜索结果"
			},
        }
	},
	created(){
		this._getCheckData();
	},
	beforeDestroy(){
		window.removeEventListener('scroll',this.scrollList);
	},
	methods:{
		//搜索发送请求
		showMsgFromSearchBox(inputKey){
			//取消显示无数据页
			this.hasrecord.show=false;
			this.params={
				page:1,
				"searchValue.markName":inputKey,
			};
			this.loadMoreMes={
				loading:false,
				currPage:1,
				maxPage:1,
			}
			this.checkList = [];
			this._getCheckData();
		},
		//滑动加载更多数据
		async scrollList(){
			//滑动锁，等异步数据加载完成后才可继续滑动加载
			let lock_scroll = true; 
			let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + document.documentElement.clientHeight >= document.body.scrollHeight) {
					if(lock_scroll&&this.loadMoreMes.currPage < this.loadMoreMes.maxPage){
					this.loadMoreMes.loading = true;
					lock_scroll = false;
					this.params.page = this.loadMoreMes.currPage+1;
					// 请求列表数据
					try {
						await this._getCheckData();
					} catch (error) {
						_.alert('提示',this.$t('i18n.loadRequestFail'));
					}
					lock_scroll = true;
				}
			}else{
				//隐藏滑动加载更多
				this.loadMoreMes.loading = false;
			}
		},
		//获取考核列表数据
		async _getCheckData(){
			return new Promise((res,rej)=>{
				getCheckList(this.params,data=>{
					if(data.pageData.pageData.length>0){
						// 有数据时不显示无数据组件
						this.hasrecord.show=false;
						//是否还有更多数据
						data.pageData.currentPage < data.pageData.totalPages?this.loadMoreMes.hasMore = true:this.loadMoreMes.hasMore = false; 
						this.loadMoreMes.currPage=data.pageData.currentPage;
						this.loadMoreMes.maxPage=data.pageData.totalPages;
						data.pageData.pageData.forEach(item => {
							if(item.degree===""){
								item.degree="超出已设的评级范围";
							}
						});
						this.checkList=this.checkList.concat(data.pageData.pageData);
					}else if(this.params.page==1){
						// 无数据且为第一页时显示无数据组件
						this.hasrecord.show=true;
					}
					res(true);
				})
			})
		}
	}
}

</script>
<style lang='scss' scoped>
.qwui-myCheck{
	margin: 0 auto;

	/deep/ .icon_noCheck{
		display: inline-block;
		height: 160px;
		width: 160px;
		background: url('~assets/images/img_comment_emptypage1@3x.png') center no-repeat;
		background-size: cover;
	}
	.seize{
		height: 43px;
	}
}
	.searchFixed{
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 10;
	}	

	@media screen and (min-width: 1024px){
		.searchFixed{
			width: 740px;
		}
	}

.check_list{
	border-bottom-style: solid;
	border-top-style: solid;
	border-color: rgba(247,248,250,1);
	border-width: 1px;
}


.list_item{
	display: flex;
	align-items: center;
	height: 104px;
	width: 100%;
	margin-left: 15px;
	box-shadow:0px -1px 0px 0px rgba(247,248,250,1);

	.flex_col{
		height: 76px;
		min-width: 76px;
		display: flex;
		flex-direction: column;
		text-align: center;
		justify-content: center;
		border-right:1px solid;
		border-color: rgba(247,248,250,1);

		p{
			height:18px;
			font-size:13px;
			font-family:PingFangSC-Regular;
			font-weight:400;
			color:rgba(122,124,128,1);
			line-height:18px;
			text-align: center;
		}
	}

	.list_score{
		margin-bottom: 4px;
		font-size:24px;
		height: 33px;
		font-family:DIN-Medium;
		font-weight:500;
		color:rgba(255,88,109,1);
		line-height:33px;
	}	

	.item_info{
		width: 0;
		margin-left: 28px;
		flex:1;
		display: flex;
		flex-direction: column;

		.check_name{
			height: 22px;
			width: 90%;
			font-size:16px;
			font-family:PingFangSC-Regular;
			font-weight:400;
			color:rgba(10,23,53,1);
			line-height:22px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.check_time{
			height:18px;
			font-size:13px;
			font-family:PingFangSC-Regular;
			font-weight:400;
			color:rgba(178,185,200,1);
			line-height:18px;
			margin-top: 4px;
			overflow: hidden;
		}

		.check_garde{
			height:18px;
			width: 90%;
			font-size:13px;
			font-family:PingFangSC-Regular;
			font-weight:400;
			color:rgba(122,124,128,1);
			line-height:18px;
			margin-top: 8px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
}

</style>


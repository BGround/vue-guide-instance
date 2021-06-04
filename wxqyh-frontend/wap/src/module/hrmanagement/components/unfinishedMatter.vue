<template>
	<div class="wrap qwui_unfinished_matter" v-windowscroll="scrollList">
		<!--搜索框-->
 		<div class="searchFixed mt10">
      		<search-box 
						:searchinput="searchBar"
			  		:placeholder = "placeholder"
        		@listenToSearchBox="showMsgFromSearchBox">
      		</search-box>
    	</div>
    	<div class="fixedHeight"></div>
		<!--搜索框 end-->

		<!--列表数据-->
		<div class="qwui_data_item box_bor pl15">
			<div
				v-for="item in list"
				:key="item.text"
				class="qwui_data_list">
				<div
					@click="goToMyMes(item.employeeId)"
					class="data_mes">
					<img v-bind:src="item.headPic == '' ||item.headPic=='0'?defaultImg:item.headPic" :alt="item.personName" class="qwui_data_list_img">
					<span
						class="qwui_font_title">
						<span class="name box_bor" v-text="item.personName"></span>
						<span class="time" v-text="item.endDay?item.endDay:item.regularDay"></span>
						<span class="text">{{ tagText }}</span>
					</span>
					<span class="qwui_font_category mt6" >
						<span class="ilblock" v-text="item.deptName.replace(/,/g,'/')"></span>
						<span class="ilblock wfont" v-if="item.deptName != ''&& item.positionName !=''"> / </span>
						<span class="ilblock" v-text="item.positionName"></span>
					</span>


				</div>

			</div>

		</div>
		<!--无数据-->
		<no-record
			v-if="!hasData"
      :hasrecord="hasrecord">
    </no-record>

		<!--更多数据-->
		<load-more v-bind="loadMoreMes"></load-more>

	</div>
</template>
<script>
import searchBox from '@/components/base/search_box';
import NoRecord from '@/components/base/no_record';
import loadMore from '@/components/list/load_more';
import { listWaitRegular,listWillExpContract,listWillExpCert} from '../api/getData';

export default {
	name:'unfinishedMatter',
	components:{
		searchBox,
		NoRecord,
		loadMore,
	},
	data(){
		return{
			searchBar: {
				show:true, //显示搜索框
			},
			placeholder:'姓名/职位',
			params:{  //请求参数
				page:1,
				condition:'',
			},
			getListFun:['_listWaitRegular','_listWillExpContract','_listWillExpCert'], //请求数据方法
			Width:(window.screen.width-92)+'px',
			list:[],
			tagText:'',
			title:'',
			hasrecord:{  //无数据配置
				show: true,
        setTop: true,
			},
			hasData:true,
			loadMoreMes:{  // 加载更多配置
				loading:false,
				hasMore:false,
				type:'commentList'
			},
			getMoreData:{}, //加载数据请求配置
			defaultImg: require('../../../assets/images/touxiang02.png')
		}
	},
	created(){
		// const getListFun = ['_listWaitRegular','_listWillExpContract','_listWillExpCert']; //数据请求方法名
		this.params.days = this.$route.query.days; // 获取请求参数
		eval('this.'+this.getListFun[this.$route.query.index]+'()'); // 请求列表数据
	},
	methods:{
		showMsgFromSearchBox(inputKey){
			this.params.condition = inputKey;
			this.params.page = 1;
			this.list = [];  //清空数据
			eval('this.'+this.getListFun[this.$route.query.index]+'()'); // 请求列表数据
		},
		//待转正
		_listWaitRegular(){
			let _this = this;
			listWaitRegular(_this.params,data => {
				let textObj = {
					title:'待转正',
					tagText:'转正',
					icon: "img_a-nodata_01",
					text: "暂无待转正员工",
				}
				_this.showData(data,textObj);
			})
		},
		_listWillExpContract(){
			let _this = this;
			listWillExpContract(_this.params,data => {
				let textObj = {
					title:'合同到期',
					tagText:'到期',
					icon: "img_a-nodata_03",
					text: "暂无合同到期员工",
				}
				_this.showData(data,textObj); //渲染数据

			})
		},
		_listWillExpCert(){
			let _this = this;
			listWillExpCert(_this.params,data => {
				let textObj = {
					title:'证书到期',
					tagText:'到期',
					icon: "img_a-nodata_02",
					text: "暂无证书到期员工",
				}
				_this.showData(data,textObj); //渲染数据
			})
		},
		//个人档案
		goToMyMes(employeeId){
      // window.location.href = _.baseURL+"/jsp/wap/hrmanagement/emp_info.jsp?empId="+employeeId;;
      this.$router.push({path:"personalData",query:{empId:employeeId}})
		},
		scrollList(){
			let lock_scroll = true;
			let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        	if(scrollTop + document.documentElement.clientHeight >= document.body.scrollHeight) {
				if(lock_scroll&&this.getMoreData.currPage < this.getMoreData.maxPage){
					this.loadMoreMes.loading = true;
					lock_scroll = false;
					this.params.page = this.getMoreData.currPage+1;
					eval('this.'+this.getListFun[this.$route.query.index]+'()'); // 请求列表数据
				}
			}else{
				this.loadMoreMes.loading = false;
			}
		},
		showData(data,textObj){
			let _this = this;
			if(data.waitList){
					data.currPage < data.maxPage?this.loadMoreMes.hasMore = true:this.loadMoreMes.hasMore = false; //是否还有更多数据
					this.getMoreData.currPage = data.currPage; //当前页面数
					this.getMoreData.maxPage = data.maxPage; // 最大页面数
					this.hasData = true;
					data.waitList.forEach(function(ele){
						ele.certList?ele.endDay = ele.certList[0].endDay:''; //证书到期时间
						_this.list.push(ele);
					});
			}else{
				this.hasData = false;
			}
			this.tagText = textObj.tagText;
			document.title = textObj.title;
			this.hasrecord.icon = textObj.icon;
			this.hasrecord.text = textObj.text;
		}
	}
}
</script>
<style lang="scss" scoped>
	.qwui-topic_draft{
		.searchFixed{
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 10;
		}
		.fixedHeight{
		height: 43px;
		}

  }
  .qwui_data_list{
	  box-shadow:0px -1px 0px 0px rgba(247,248,250,1) !important;
	  .data_mes{
		  position: relative;
		  display: block !important;
		  padding: 16px 15px 0 62px;
		  box-sizing: border-box;
		  -webkit-box-sizing: border-box;
		  -moz-box-sizing: border-box;

		  .qwui_data_list_img{
				display: block;
				position: absolute;
				width: 48px;
				height: 48px;
				left: 0;
				border-radius: 4px;
		  }
		.qwui_font_category{
			display: block;
			height:18px;
			font-size:13px;
			font-family:PingFangSC-Regular;
			font-weight:400;
			color:rgba(122,124,128,1);
			line-height:18px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
	  }
	  }


  }

  .ic_a-certificate{
		background: url('../../../assets/images/touxiang02.png') no-repeat left center;
		background-size: 48px 48px;
	}
	.qwui_font_title{
		  position: relative;
		  text-align:right;
		  .name{
			  display: inline-block;
			  width: 60%;
			  float: left;
			  text-align: left;
			  overflow: hidden;
			  text-overflow: ellipsis;
			  white-space: nowrap;
		  }
		  .time{
			display: inline-block;
			height: 18px;
			font-size: 13px;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			color: rgba(178,185,200,1);
			line-height: 18px;
			vertical-align: super;
		  }
		  .text{
			display: inline-block;
			width: 34px;
			background: rgba(178, 185, 200, 0.1);
			border-radius: 2px;
			font-size: 12px;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			color: #b2b9c8;
			vertical-align: super;
			text-align: center;
		  }
	  }
	.no_data_tip{
		height:21px;
		font-size:15px;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(178,185,200,1);
		line-height:21px;
	}
	.qwui_unfinished_matter /deep/ .qwui-no_record_box{
		margin-top: 0 !important;
		top: 121px;
	}
	.qwui_unfinished_matter /deep/ .img_a-nodata_01 {
		display: inline-block;
		width: 300px;
		height: 210px;
		background: url('../../../assets/images/img_a-nodata_01.png') center no-repeat;
		background-size: cover;
	}
	.qwui_unfinished_matter /deep/ .img_a-nodata_02 {
		display: inline-block;
		width: 300px;
		height: 210px;
		background: url('../../../assets/images/img_a-nodata_02.png') center no-repeat;
		background-size: cover;
	}
	.qwui_unfinished_matter /deep/ .img_a-nodata_03 {
		display: inline-block;
		width: 300px;
		height: 210px;
		background: url('../../../assets/images/img_a-nodata_03.png') center no-repeat;
		background-size: cover;
	}
	.qwui_unfinished_matter /deep/ .qwui-no_record_text {
		height:21px;
		font-size:15px;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(178,185,200,1);
		line-height:21px;
	}
	.ilblock{
		max-width: 6em;
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.wfont{
		width: 0.5em;
	}
</style>

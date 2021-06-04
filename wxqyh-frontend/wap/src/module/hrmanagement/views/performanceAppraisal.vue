<template>
	<div class="qwui_performance_appraisal">
		<!--待我考评-->
		<div class="myAssessment box_bor pl15">
			<div class="qwui-lean_entry_list pr15">
				<div
				class="lean_entry_list_item qwui-flexbox none-bd">
					<span class="qwui-flexItem">待我考评</span>
					<i @click="goToHistroy('1')" class="qwui-icon_arrow_fr icon_gray icon_head">历史</i>
				</div>
			</div>
			<div
				v-for="item in list"
				:key="item.id"
				@click="goToDetail(item.id,item.status)"
				class="qwui_list_item flex box_bor qwui_list_item_new ">
				<div class="flex_one">
					<span class="the_num" v-text="item.count"></span>
					<span class="the_text">待评人数</span>
				</div>
				<div class="flex_two" >
					<span class="the_head" v-text="item.name"></span>
					<span class="the_time" >{{ item.startTime.substring(0,16) }} 至 {{ item.endTime.substring(0,16) }}</span>
				</div>
			</div>
			<div v-if="!hasData" class="no_data">
				<no-record :hasrecord='hasrecord'></no-record>
			</div>


		</div>
		<div
			v-if="hasMore"
			class="more" @click="goToHistroy('0')">查看更多</div>


		<!--员工绩效档案-->
		<div class="employessAssessment mb10 pl15">
			<div class="qwui-lean_entry_list mt10 pr15">
				<div
				class="lean_entry_list_item qwui-flexbox none-bd">
					<span class="qwui-flexItem">员工绩效档案</span>
					<i
						v-if="hasResultData"
						@click="goRecordList"
						class="qwui-icon_arrow_fr icon_gray icon_head">全部</i>
				</div>
			</div>
			<div
				v-for="item in resultMarkList"
				:key='item.id'
				@click="goToResultDetail(item.id,item.templateId)"
				class="qwui_list_item flex box_bor qwui_list_item_new">
				<div class="flex_one">
					<span class="the_num_employess">{{ item.count }}<span class="inline" :class="{'cgray':item.count != item.allTarget}">/{{ item.allTarget }}</span></span>
					<span class="the_text">考核人数</span>
				</div>
				<div class="flex_two">
					<span class="the_head"  v-text="item.name"></span>
					<span class="the_time" >{{ item.startTime.substring(0,16) }} 至 {{ item.endTime.substring(0,16) }}</span>
				</div>
			</div>
			<div v-if="!hasResultData" class="no_data">
				<no-record :hasrecord='hasrecordEmoloyess'></no-record>
			</div>
		</div>
		<!--自评-->
		<div class="selfAssessment mb10">
			<div class="qwui-lean_entry_list mt10 pad15">
				<div
				class="lean_entry_list_item qwui-flexbox">
					<span class="qwui-flexItem">自评</span>
					<i class="icon_head nopad">更多功能敬请期待</i>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { findMarkList,findResultMarkList } from '../api/getData';
import NoRecord from '@/components/base/no_record';
export default {
	name:'performanceAppraisal',
	components:{
		NoRecord,
	},
	data(){
		return {
			list:[], //待我考核列表数据
			resultMarkList:[], // 员工绩效档案数据
			Width:(window.screen.width-130)+'px',
			hasData:true, // 是否有待我考核数据
			hasMore:false, // 待我考核数据是否超过3
			hasResultData:true,
			hasrecord:{  //待我审核无数据配置
				 show: true,
				 setTop: false,
				 icon: "emptyPage",
				 text: "暂无需要处理的考评项",
			},
			hasrecordEmoloyess:{  //员工绩效档案无数据配置
				 show: true,
				 setTop: false,
				 icon: "icon_noCheck",
				 text: "暂无数据",
			},

		}
	},
	created(){
		this._findMarkList(); // 获取待我考核数据
		this._findResultMarkList(); //获取员工绩效档案列表
	},
	methods:{
		goToAll(url){ //查看全部
			window.location.href = _.baseURL + url
		},
		_findMarkList(){
			let _this = this;
			let params = {
				page:1,
				pageSize:20,
				'searchValue.name':'' ,
				'searchValue.status': 0
			}
			findMarkList(params,data =>{
				if(data.pageData){
					if(data.pageData.length>3){
						this.hasMore = true;
					}
					_this.list = data.pageData.slice(0,3)
				}else{
					this.hasData = false;
				}
			})
		},
		_findResultMarkList(){
			let _this = this;
			let params = {
				pageSize:3,
				'searchValue.name':''
			}
			findResultMarkList(params,data =>{
				data.pageData?_this.resultMarkList = data.pageData:_this.hasResultData = false;
			})
		},
		goToDetail(id,markStatus){
      // window.location.href = _.baseURL +"/jsp/wap/hrmanagement/xent/mark/mark_target_list.jsp?markId=" +id+"&markStatus="+status+"&status=0";
      this.$router.push({path: "checkMarkList",query:{markId:id,markStatus:markStatus,status:"0"}})
		},
		goToHistroy(status){
      // window.location.href = _.baseURL + '/jsp/wap/hrmanagement/xent/mark/mark_list.jsp?status=1'
      this.$router.push({path: 'checkHistory',query:{status:status}})
    },
    goRecordList(){
      this.$router.push({path: 'allRecord'})
    },
		goToResultDetail(id,templateId){
      // window.location.href = _.baseURL +"/jsp/wap/hrmanagement/human_filter_affairs.jsp?markId=" + id+"&tempId="+templateId;
      this.$router.push({
        path: "checkResult",
        query: { markId: id, tempId: templateId}
      });
		}
	}
}
</script>
<style lang="scss" scoped>
.qwui_performance_appraisal{
	height: 100%;
	width: 100%;
	overflow-y: auto;
	overflow-x:hidden;
	background:rgba(247,248,250,1);
	>div{
		background: #fff;
	}
	.myAssessment .qwui_list_item_new,.employessAssessment .qwui_list_item_new{
		position: relative;
		width: 100%;
		height: 80px;
		padding: 13px 0 14px 0;
		justify-content: left;
		box-shadow:0px 1px 0px 0px rgba(247,248,250,1);
		text-align: center;
		:first-child,:last-child{
			box-shadow: none !important;
		}
		.flex_one{
			.the_num{
				display: block;
				width: 50px;
				height:29px;
				line-height: 29px;
				margin-bottom: 5px;
				font-size:24px;
				font-family:PingFangSC-Regular;
				font-weight:500;
				color:rgba(255,88,109,1);

			}
			.the_text{
				width:50px;
				height:17px;
				font-size:12px;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(122,124,128,1);
				line-height:17px;
			}
		}
		.flex_two{
			flex: 1;
    		width: 0;
			height: 40px;
			margin: 4px 0 3px 15px;
			padding-left: 15px;
			border-left: 1px solid #f7f8fa;
			text-align: left;
			.the_head{
				display: block;
				width: 90%;
				height:22px;
				font-size:16px;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(10,23,53,1);
				line-height:22px;
				margin-bottom: 6px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.the_time{
				width: 250px !important;
				display: block;
				height:18px;
				font-size:13px;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(178,185,200,1);
				line-height:18px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
	.employessAssessment {
		.flex_one{
			width:6em !important;
			.the_num_employess{
			display: inherit;
			height:22px;
			font-size:18px;
			font-family:DIN-Medium;
			margin: 4px 0 7px 0;
			font-weight:500;
			color:rgba(110,155,255,1);
			line-height:22px;
		}
		}
		.flex_two{
			margin-left: 9px !important;
			padding-left: 15px !important;
		}

	}
	& /deep/ .qwui-no_record_box{
		position: relative;
		top: 41px;
		margin-top: 0;
		padding-right: 15px;
	}
	& /deep/ .qwui-no_record_text{
		margin-top: 10px;
		height:21px;
		font-size:15px;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(178,185,200,1);
		line-height:21px;
	}
	& /deep/ .emptyPage {
		display: inline-block;
		width: 130px;
		height: 130px;
		background: url('../../../assets/svg/img_commom_emptypage.svg') center no-repeat;
		background-size: cover;
	}

	& /deep/ .icon_noCheck {
		display: inline-block;
		width: 130px;
		height: 130px;
		background: url('../../../assets/images/icon_noCheck.png') center no-repeat;
		background-size: cover;
	}
}

	.icon_head{
		padding-right: 25px;
		font-size:14px;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(178,185,200,1);
	}
	.more{
		width: 100%;
		height:46px;
		line-height:46px;
		font-size:13px;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(110,155,255,1);
		text-align: center;
	}
	.cgray{
		color:#B2B9C8
	}
	.no_data{
		height: 240px;
	}
	.qwui-lean_entry_list .lean_entry_list_item::after{
		border: none !important;
	}
	.inline{
		display: inline;
	}
</style>



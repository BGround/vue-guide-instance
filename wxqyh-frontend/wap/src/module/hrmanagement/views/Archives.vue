<template>
	<div class="wrap archives" v-windowscroll="scrollList">
			<!--搜索框-->
			<div
				v-if="hasShowSearchBox"
				class="searchFixed">
						<search-box
								v-bind="searchBoxConfig"
								@listenToSearchBox="showMsgFromSearchBox">
						</search-box>
			</div>
			<!--搜索框 end-->
				<div class="qwui-search_box">
					<!--部门列表-->
					<div
						v-for="item in deptList"
						:key="item.id"
						class="qwui-lean_entry_list"
						@click= goToDatail(item.id,item.totalUser)>
						<div
							class="lean_entry_list_item qwui-flexbox">
							<div class="qwui-flexItem ">
							<i class="relavent_icon ic_a-positive"></i>
							<span class="ic_a-positive"></span>
							{{ item.departmentName }}</div>
							<i class="qwui-icon_arrow_fr"><i class="qwui-num">{{ item.totalUser }}</i></i>
						</div>
					</div>
					<!--无部门成员列表-->
					<div
						v-for="item in getMoreData.empList"
						:key ="item.bigHeadPic"
						@click="goToDatail(item.employeeId)"
						class="qwui-lean_entry_list">
						<div
							class="lean_entry_list_item qwui-flexbox">
							<div class="qwui-flexItem qwui-flexItem_person">
							<img class="relavent_icon" :src='item.bigHeadPic && item.bigHeadPic!="" && item.bigHeadPic!="0"?item.bigHeadPic:defaultImg'>
							<span class="ic_a-positive"></span>
							<span class="qwui-person_dept">{{ item.personName }} <i :class="item.sex == 1?'user_sex_male':'user_sex_female'"></i></span><span class="qwui-person_position" v-text="item.deptName == '' || item.positionName == ''?item.deptName +item.positionName:item.deptName+'/'+item.positionName"></span></div>
						</div>

					</div>
				</div>
				<p class="qwui-total_user" v-if="!hasData && hasMoreData">共{{ totalUser}}人</p>


			<!--无权限-->
			<no-record
				v-if="!isPower"
				:hasrecord="hasrecord">
			</no-record>
			<!--无数据-->
			<no-record
				v-if="hasData"
				:hasrecord="hasrecord">
			</no-record>
			<!--更多数据-->
			<load-more v-bind="loadMoreMes"></load-more>
		</div>



</template>

<script>
/* 搜索框 */
import searchBox from '@/components/base/search_box';
/* 无数据 */
import NoRecord from '@/components/base/no_record';
/* 加载更多 */
import loadMore from '@/components/list/load_more';
import { isPowerSearch,listEmployeeUnderDept,getDeptList } from '../api/getData';

export default {
	name: 'archives',
	components:{
		searchBox,
		NoRecord,
		loadMore,
	},
	data(){
		return{
			searchBoxConfig:{ //搜索框配置
				searchinput: {
					show: true,
				},
				placeholder: this.$t('i18n.searchTips')
			},
			hasrecord:{  //无数据配置
				show: true,
				setTop: true,
				icon: 'img_a-nodata_01',
				text: this.$t('i18n.noPowerTips'),
			},
			isPower:true, //是否有权限
			params:{},  //无部门成员列表请求求参数
			loadMoreMes:{  // 加载更多配置
				loading:false,
				hasMore:false,
				type:'commentList'
			},
			getMoreData:{}, //无部门成员数据和更多数据配置
			deptList:[], //人事档案数据
			defaultImg: require('../../../assets/images/touxiang02.png'), //默认头像
			totalUser:0, // 总人数
			hasMoreData:false,
			hasDept:true,
			hasPerson:true,
			hasShowSearchBox:false, // 是否显示搜索框
		}
	},
	created() {
		this._isPowerSearch(); // 获取统计权限
	},
	computed:{
		hasData(){
			return !this.hasDept && !this.hasPerson;
		}
	},
	methods:{
		showMsgFromSearchBox (inputKey) {
			this.deptList = [];
			window.location.href=_.baseURL+"/jsp/wap/hrmanagement/employeeProfile.jsp?key="+inputKey;
		},
		_isPowerSearch(){
			let _this = this;
			isPowerSearch({}, data =>{
				_this.isPower = data.isPower;
				if(_this.isPower){
					_this._listEmployeeUnderDept(); //获取人事档案无部门人员列表
					_this._getDeptList(); //获取人事档案部门列表
				}
			})
		},
		//滚动查询
		scrollList(){
			let lock_scroll = true;
			let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + document.documentElement.clientHeight >= document.body.scrollHeight) {
					if(lock_scroll&&this.getMoreData.currPage < this.getMoreData.maxPage){
						this.loadMoreMes.loading = true;
						lock_scroll = false;
						this.getMoreData.currPage++;
						this._listEmployeeUnderDept(); // 请求列表数据
						lock_scroll = true;
					}
				}else{
					this.loadMoreMes.loading = false;
				}
		},
		//查询无部门成员列表数据
		_listEmployeeUnderDept(){
			let _this = this;
			let params = {
				rootDept: 'org00000000',
				page : _this.getMoreData.currPage? _this.getMoreData.currPage: 1,
			};
			listEmployeeUnderDept(params,data =>{
				if(data.empList && data.empList.length > 0){
					_this.hasMoreData = data.empList.length<9;
					_this.hasPerson = true;
					_this.hasShowSearchBox = true;
					_this.getMoreData = { ...data };
				}else{
					_this.hasPerson = false;
					_this.hasMoreData = true;
				}
			})
		},
		_getDeptList(){
			let _this = this;
			let params = {
				page:1,
				agentCode: dataBase.wxqyh_uploadfile.agent,
			}
			getDeptList(params,data =>{
				_this.totalUser = data.totalUser? data.totalUser : 0;
				if(data.deptList && data.deptList.length>0){
					_this.deptList = data.deptList
					_this.hasDept = true;
					_this.hasShowSearchBox = true;
				}else{
					_this.hasrecord.icon = 'img_a-nodata_02';
					_this.hasrecord.text = this.$t('i18n.noData');
					_this.hasDept = false;
				}
			})
		},
		//跳转员工档案详情
		goToDatail(id,totalUser){
			if(totalUser){
        totalUser != '0'? window.location.href=_.baseURL+"/jsp/wap/hrmanagement/employeeProfile.jsp?deptId="+id +'&totalUser=' + totalUser:'';
        // this.$router.push({path:'profilesList',query:{deptId:id,totalUser:totalUser}})
			}else{
				window.location.href=_.baseURL+"/jsp/wap/hrmanagement/emp_info.jsp?empId="+id;
			}
		}
	}
}
</script>
<style lang="scss" scoped>
	.archives{
		position: relative;
		min-height: 90vh;
		font-family: -apple-system-font,"Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
	  .searchFixed{
			margin-top: 10px;
			top: 0;
			width: 100%;
			z-index: 10;
			/deep/ .qwui-search_bar{
				padding: 8px 14px;
				border-bottom: 1px solid rgba(247,248,250,1);
			}
			/deep/ .qwui-search_text{
				height: 36px;
				line-height: 36px;
				margin: 8px 14px;
				background:rgba(244,246,248,1);
				& span{
					font-size: 14px;
					font-family: PingFangSC-Regular;
					font-weight: 400;
					color: rgba(204,204,204,1);
					line-height: 14px;
				}
			}
			/deep/ .icon_search{
				top: 12px;
			}
			/deep/ .qwui-search_input {
				height: 26px;
			}
		}
		.qwui-search_box{
			padding-left: 15px;
			box-sizing: border-box;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
		}
		/deep/ .qwui-no_record_box.active{
			margin-top: -170px;
		}
		.qwui-lean_entry_list{
			.lean_entry_list_item{
				position: relative;
				height: 60px;
				line-height: 60px;
				box-shadow:0px 1px 0px 0px rgba(247,248,250,1);
				.qwui-flexItem {
					margin-left: 54px;
					font-size: 16px;
					font-family: PingFangSC-Regular;
					font-weight: 400;
					color: rgba(10,23,53,1);
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					.qwui-person_dept{
						display: block;
						line-height: 22px;
						margin-top: 10px;
						padding-right: 15px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						.user_sex_male{
							width: 30px;
							height: 15px;
							margin-top: -3px;
							margin-left: 5px;
							background: url('~assets/images/ic_male.png') no-repeat;
							background-size: 15px 15px;
							display: inline-block;
							vertical-align: middle;
						}
						.user_sex_female{
							width: 30px;
							height: 15px;
							margin-top: -3px;
							margin-left: 5px;
							background: url('~assets/images/ic_female.png') no-repeat;
							background-size: 15px 15px;
							display: inline-block;
							vertical-align: middle;
						}
					}
					.qwui-person_position{
						display: block;
						padding-right: 15px;
						font-size: 13px;
						color: #7A7C80;
						line-height: 18px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.ic_a-positive{
						background-image: url('~assets/images/ic_a-record_department.png');
					}
			}
			.qwui-flexItem_person{
				display: table-cell;
			}
			.relavent_icon{
				position: absolute;
				width: 40px;
				height: 40px;
				top: 10px;
				left: 0;
				margin: 0;
				background-size: 100% 100%;
			}
			.qwui-icon_arrow_fr{
				float: right;
    		margin-right: 15px;
				padding-right: 15px;
				color:#B2B9C8;
				.qwui-num{
					font-size: 15px;
					font-family: PingFangSC-Regular;
					font-weight: 500;
					color: rgba(122,124,128,1);
				}
			}
			}


		}
		/deep/ .img_a-nodata_01 {
			display: inline-block;
			width: 300px;
			height: 210px;
			background: url('~assets/images/img_a-nodata_01.png') center no-repeat;
			background-size: cover;
		}
		/deep/ .img_a-nodata_02 {
			display: inline-block;
			width: 300px;
			height: 210px;
			background: url('~assets/images/img_a-nodata_02.png') center no-repeat;
			background-size: cover;
		}
		.qwui-total_user{
			padding-bottom: 20px;
			margin-top: 10px;
			text-align: center;
			color: #999;
			font-size: 14px;
		}
	}

</style>



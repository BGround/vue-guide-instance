<template>
	<div class="qwui-employess">
		<div class="qwui-lean_entry_list h40 pad15">
			<div class="lean_entry_list_item qwui-flexbox h40">
					<span class="qwui-flexItem h40">员工关怀</span>
					<i class="qwui-icon_arrow_fr icon_gray" @click="showCareList">更多</i>
			</div>
		</div>

		<div class="qwui-employess_home_list">
			<ul>
				<li class="qwui-employess_every" v-for="(item,index) in careList" :key="index+'care'" @click="viewCareDetail(item.dynamicinfoId,1)">
					<span class="qwui-user_img"><img :src="item.headPic"></span>
					<div class="qwui-blessing">
						<div class="qwui-blessing_tip">
							<span class="qwui-blessing_tip_msg" v-cloak>{{item.commentNewsTitle}}</span> 
							<span class="qwui-blessing_tip_icon " :class="{'qwui-blessing_birthday':item.sendType == 1,'qwui-blessing_gift':item.sendType == 2}"></span>
						</div>
						<p class="qwui-blessing_detail" v-cloak v-if="item.type ==1">{{item.content | formatURL}}</p>
						<p class="qwui-blessing_detail" v-cloak v-else>[请点击查看图片]</p>
					</div>
				</li>
			</ul>
		</div>

		<!--填写生日信息入口-->
		<!-- <div
			v-if="isFull"
			@click="entryFrom"
			class="qwui-isFull pad15"
			:style="{width:WidthTwo}">
			<div class="right">
				<span class="tips">立即完善生日信息</span>
				<span><span class="tips_two">与同事祝福互动</span><i class="qwui-icon_arrow_fr icon_gray font_color"></i></span>
			</div>
		</div> -->
			
    <!--无数据-->
    <no-record
      v-if="!hasData"
      :hasrecord="hasrecord"
			class="qwui_data_list_div pad15">
    </no-record>
	</div>

</template>
<script>
import { getCareCount, hasSetBirth, viewSetting ,getNewestCareList} from "../../api/getData";
import NoRecord from '@/components/base/no_record';
import '@/assets/js/emojify.min.js';
export default {
  name: "emplyessCare",
  data() {
    return {
      remind: [],
      isFull: false, //生日信息是否填写完整
      Width: (window.innerWidth - 45) / 2 + "px",
			WidthTwo: window.innerWidth - 30 + "px",
			hasData:true,
			hasrecord:{  //无数据配置
				show: true,
				setTop: false,
				icon: 'img_a-nodata_02',
				text:"暂无员工关怀数据",
			},
			careList:[],//关怀列表
    };
  },
  created() {
    this._getCareCount(); // 获取今日生日祝福和入职周年人数
		this._viewSetting(); //生日信息设置入口
		this.viewNewestCareList();//获取员工关怀数据
	},
  methods: {
    _getCareCount() {
      let _this = this;
      getCareCount({}, data => {
        dataBase.remind[0].num = data.newBless ? data.newBless : 0;
        dataBase.remind[1].num = data.newEntry ? data.newEntry : 0;
        _this.remind = dataBase.remind;
      });
    },
    _hasSetBirth() {
      let _this = this;
      hasSetBirth({}, data => {
        _this.isFull = !data.hasSetBirth;
      });
    },
    entryFrom() {
      this.$router.push({ name: "complete_birthday_mes" });
		},
		viewNewestCareList(){
			getNewestCareList({},res => {
				if(res&&res.list){
					this.hasData = true;
					this.careList = [...res.list];
					this.$nextTick(() => {
						var demo=document.querySelector(".qwui-employess_home_list");
						emojify.run(demo);
					});
				}else{
					this.hasData = false;
				}
			});
		},
		viewCareDetail(id,scroll=2){
			 window.location.href= `${_.baseURL}/vp/module/dynamic.html?corp_id=${window.wxqyhConfig.orgConfigInfo.corpId}&agentCode=${dataBase.wxqyh_uploadfile.agent}#/partyDetail?id=${id}&title=&typeId=&page=1&isPassReview=&schType=10&scrolltop=${scroll}`;
		},
    showCareList(index) {
      this.$router.push({ name: "employees_care_list"});
    },
    //生日信息编辑权限
    _viewSetting() {
      let _this = this;
      viewSetting({ type: "hrPersonal" }, data => {
        let hasEditBirthMoon =
          data.setting.hrPersonal.editBySelf.field.birthDayMoon;
        let hasEditBirth = data.setting.hrPersonal.editBySelf.field.birthDay;
        hasEditBirthMoon && hasEditBirth ? _this._hasSetBirth() : "";
      });
    }
	},
	filters:{
 		formatURL(value) {
      if (!value) {
        return "";
      }
      var str = value;
      if (typeof str != "string") {
        str = JSON.stringify(str);
      }
			//替换转义
			str = _.getUrlHtml(str.replace(/&nbsp;/g, '').replace(/<br>/g, ''));
			//替换空格
      str = str.replace(/([rl("]?[rl(']?[rl(]?[=]?['"]?)(http(s)?\:\/\/[a-zA-Z0-9]+.[a-zA-Z0-9]+[a-zA-Z0-9\$\%\#\&\/\?\-\=\.\_\;\:]+)/gi,'[网页链接]').replace(/\n/g, '');
      return str;
    },
	},
	components:{
		NoRecord,
	},
};
</script>
<style lang="scss" scoped>
	%ellipsis{
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	
	.qwui-lean_entry_list .lean_entry_list_item {
		height: 40px;
		line-height: 40px;
		&::after {
			border: none;
		}
		.qwui-icon_arrow_fr {
			padding-right: 25px;
			color: #B2B9C8;
			font-size: 14px;
			font-weight:400;
			font-family:PingFangSC-Regular;
			cursor:pointer;
		}
	}

	.qwui-employess_home_list{
		padding-left:15px;
		.qwui-employess_every{
			display:-webkit-flex;
			display:flex;
			align-items: center;
			height:75px;
			padding:15px 0 16px;
			box-shadow:0 -1px 0  #F7F8FA inset;
			&:last-child{
				box-shadow: none;
			}
			box-sizing:border-box;
			.qwui-user_img{
				display: inline-block;
				width: 32px;
				height: 32px;
				margin-right:14px;
				border-radius:50%;
				overflow: hidden;
				img{
					width: 100%;
					height: 100%;
				}
			}
			.qwui-blessing{
				flex:1;
				overflow: hidden;
			}
			.qwui-blessing_tip{
				width:100%;
				.qwui-blessing_tip_msg{
					font-size:14px;
					font-family:PingFangSC-Regular;
					font-weight:400;
					color:rgba(159,165,179,1);
				}
				.qwui-blessing_tip_icon{
					display: inline-block;
					width: 24px;
					height: 24px;
					box-sizing: border-box;
					padding:4px;
					background-origin:content-box;
					background-position:center;
					background-size:100%;
					background-repeat:no-repeat;
					vertical-align: bottom;
					&.qwui-blessing_gift{
						background-image: url(~assets/images/hr_care_gift.png);
					}
					&.qwui-blessing_birthday{
						padding:3px;
						background-image: url(~assets/images/hr_care_birthday.png);
					}
				}
			}
			.qwui-blessing_detail{
				@extend %ellipsis;
				margin-top:4px;
				width:100%;
				font-size:15px;
				padding-right:15px;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:#0A1735;
				box-sizing:border-box;
				/deep/ .emoji{
					 display: inline-block;
						width: 1.2em;
						height: 1.2em;
				}
			}
		}
	}

	.qwui-isFull {
		width: 100%;
		height: 90px;
		background: url("~assets/images/img_a-workbench_banner.png")
			no-repeat left top;
		background-size: 150px 100%;
		padding-right: 37px;
		text-align: right;
		cursor: pointer;
		display: table-cell;
		vertical-align: middle;
		border-radius: 4px;
		border: 1px solid rgba(247, 247, 247, 1);
		.right {
			float: right;
			text-align: left;
			.tips {
				display: block;
				margin-bottom: 4px;
				height: 22px;
				font-size: 16px;
				font-family: PingFangSC-Medium;
				font-weight: 500;
				color: rgba(122, 125, 128, 1);
				line-height: 22px;
			}
			.tips_two {
				margin-right: 10px;
				height: 18px;
				font-size: 13px;
				font-family: PingFangSC-Regular;
				font-weight: 400;
				color: rgba(178, 185, 200, 1);
				line-height: 18px;
			}
			.qwui-icon_arrow_fr:after {
				height: 4px !important;
				width: 4px !important;
				margin-top: -2px !important;
			}
		}
		.ml15 {
			margin-left: 15px;
		}
	}
	.qwui_data_list_div{
		height:196px;
	}
	.qwui-employess /deep/ .img_a-nodata_04 {
		display: inline-block;
		width: 274px;
		height: 142px;
		background: url('~assets/images/img_a-nodata_04.png') center no-repeat;
		background-size: cover;
	}
	.qwui-employess /deep/ .qwui-no_record_text{
		margin-top: 0;
		height:21px;
		font-size:15px;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(178,185,200,1);
		line-height:21px;
	}
	.qwui-employess /deep/ .qwui-no_record_box{
		position: relative;
		top: 0;
		margin-top: 0;
	}
</style>



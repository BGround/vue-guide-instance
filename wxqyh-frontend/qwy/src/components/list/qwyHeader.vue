<!--
    后台头部组件
    @param pswPath(可选,字符,默认:/changePsw):修改密码的路由地址
    @param tabName(必传,字符):当前选中的tab名字(审批:form_flow 协同:content 销售:sales 培训:examination 人资:hr 通讯录:addressBook 设置:setting 企业服务:companysrv)

    注意：
    组件在全局的vuex中暴露了应用托管状态trustApp,可用来判断应用的托管状态

    用法：
    <parent>
        <qwy-header :pswPath="pswPath" tabName="sales"></qwy-header>
    </parent>
 -->
<template>
	<div>
		<div id="header">
			<div class='inner-header'>
				<a :href="logoLink" target="_blank" class="logo_link">
					<img :src="logoURL">
				</a>
				<div class="login_text vip-benefit-header">
					<!--VIP超期提醒-->
					<div class="vip-benefit-tip" @mouseover="mouseOverTipFun" @mouseout="mouseOutTipFun" v-if="vipBenefitDateNotifyList || vipPersonNotifyList">
						<div class="vip-benefit-text">
							<span v-if="vipBenefitDateNotifyList">您有 <span class="tip">
									{{vipMsg.vip60DateNotifyList.length}}
								</span> 项会员权益即将到期</span>
							<i v-if="vipBenefitDateNotifyList && vipPersonNotifyList">，</i>
							<span v-if="vipPersonNotifyList">您有 <span class="tip">
									{{vipMsg.vipPersonNotifyList.length}}
								</span> 个应用使用人数超限</span>
						</div>
						<span class="vip-benefit-btn" v-if="vipBenefitDateNotifyList" @click="clickBuyPackage">马上续期</span>
						<span class="vip-benefit-btn" v-if="vipPersonNotifyList" @click="clickBuyPerson">人数扩容</span>
						<div class="tip-info-box" v-show="vipBenefitInFoBox">
							<div class="tip-info-content dateNotifyTipList">
								<div v-if="vipBenefitDateNotifyList">
									<p class="dateNotify-tip" v-for="(item,index) in vipMsg.vip60DateNotifyList" :key="index">
										<span class="vipName"> {{item.vipName}}</span>
										<span class="last">剩余<span class="time">
												{{item.endDay | filterDay}}</span>天
										</span>
									</p>
								</div>
								<div v-if="vipPersonNotifyList">
									<p class="dateNotify-tip" v-for="(item,index) in vipMsg.vipPersonNotifyList" :key="index">
										<span class="vipName"> {{item.vipName}}</span>
										<span class="last">超额<span class="time">
												{{item.agentUserCount - Number(item.personMax)}}
											</span>人</span></p>
								</div>
							</div>
						</div>
					</div>
					<!--VIP超期提醒-end-->
					<div class="text_item login_msg" @mouseenter="mouseEnterVip" @mouseleave="mouseLeaveVip">
						<div>
							<span>{{dataBase.config.personName}}</span>
							<span>{{dataBase.config.managerType == 0? '[超管]' : ''}}</span>
							<i class="icon_notice_dot" v-if="noCompleteData"></i>
						</div>
						<div class="vipLogo_wrap">
							<a href="javascript:void(0)" :class="[{vipLogo:true},vipMsg.vipStyle]" @click="goVip"></a>
							<div :class="{vip_hover:true,vipShow:isShow}">
								<!-- <div class="vip_msg">
                                <a class="vipLogo" href="javascript:void(0)" :class="[vipMsg.vipStyle]" @click="goVip">{{vipMsg.vipName}}</a>
                            </div> -->
								<!-- <div class="hover_item vip-permission-packages" v-if="vipShowVOList">
                                <p>已购功能：</p>
                                <p class="item-text" v-for="(item,index) in vipMsg.vipShowVOList"
                                   :key="index"
                                ><span class="vipName">{{item.vipName}}</span><span class="endTime">{{item.maxEndDay}}</span></p>
                            </div> -->
								<div class="hover_item">
									<!-- <p>已使用：{{vipMsg.useSpace}}MB</p>
                                <p class="mt5">总空间：{{vipMsg.spaceTotal}} <a target="_blank" :href="vipMsg.spaceBuyURL" class="cf87b00" v-if="!vipMsg.isCoop">[ 升级 ]</a></p>
                                <progress :class='[{space_progress:true},vipMsg.warnStyle]' max='100' :value='vipMsg.progressVal'></progress> -->
									<p class="mt10">CorpID：{{vipMsg.corpId}}</p>
								</div>
								<!-- <div class="hover_item hover_spItem" @click="openQrCode">关注二维码</div>
                            <div class="hover_item hover_spItem" @click="goAddressList">绑定通讯录 <i class="icon_notice_dot" v-if="noCompleteData"></i></div> -->
								<div class="hover_item hover_spItem" @click="goChangePsw(pswPath)">修改密码</div>
								<!-- <div class="hover_item hover_spItem" @click="goAPI">API文档</div> -->
								<div class="hover_item hover_spItem" @click="signOut">退出</div>
							</div>
						</div>
					</div>
					<!-- <div class="text_item">
                    <a  target="_blank" href="http://wbg.do1.com.cn/QWinformation/Product_Notice/" title="升级公告" class="headIcon headIcon_notice"></a>
                </div> -->
					<!-- <div class="text_item">
                    <a target="_blank" href="http://wbg.do1.com.cn/xueyuan/" title="帮助中心" class="headIcon headIcon_help"></a>
                </div> -->
				</div>
			</div>
			<div class="nav">
				<div class="nav_bar_wrap">
					<ul class="nav_bar">
						<li :class="{active: tabName === 'channel'}" @click="goModules('channel')" v-if="appMsg.showContentMenun && permissions['qiruiqdIndexMenu']">
							<span>渠道首页</span>
						</li>
						<li class="distributorNav" v-if="appMsg.showContentMenun&& permissions['qiruiqdArchivesMenu']" :class="{active: tabName === 'archives'}"
						 @mouseenter="isDisNavShow=true" @mouseleave="isDisNavShow=false" @click.stop="goModules('archives','schoolReport')">
							<span>成绩单</span>
							<div class="disNavInfo" v-show="isDisNavShow">
<!--								<div v-if="permissions['archivesIndexMenu']" class="subNavItem" @click.stop="goModules('archives','archivesList')">档案袋</div>-->
								<div v-if="permissions['reportCardIndexMenu']" class="subNavItem" @click.stop="goModules('archives','salesSchoolReport')">售前</div>
								<div v-if="permissions['saleReportCardIndexMenu']" class="subNavItem" @click.stop="goModules('archives','afterSalesSchoolReport')">售后</div>
							</div>
						</li>
						<li class="distributorNav" v-if="permissions['qiruidashboardMenu']" :class="{active: tabName === 'businessDashboard'}"
						 @mouseenter="isShowBusinessDashboard=true" @mouseleave="isShowBusinessDashboard=false" @click.stop="goModules('businessDashboard','oneNetworkSize')">
							<span>网络业务看板</span>
							<div class="disNavInfo" v-show="isShowBusinessDashboard">

<!--
网络规模、总体现状、规划进展、开发完成情况、新网销量提升、星级评估、人员信息、市场纪律、企业信息变更、预警管理、网络退出
-->
                <div  class="subNavItem" @click.stop="goModules('businessDashboard','oneNetworkSize')">网络规模</div>
                <div  class="subNavItem" @click.stop="goModules('businessDashboard','networkStatus')">总体现状</div>
                <div  class="subNavItem" @click.stop="goModules('businessDashboard','planningProgress')">规划进展</div>
                <div  class="subNavItem" @click.stop="goModules('businessDashboard','completionSituation')">开发完成情况</div>

                <div v-if="permissions['networkSaleMenu']" class="subNavItem" @click.stop="goModules('businessDashboard','networkSale')">新网销量提升</div>
                <div v-if="permissions['starRatingMenu']" class="subNavItem" @click.stop="goModules('businessDashboard','starRating')">星级评估</div>
                <div v-if="permissions['personnelInfoMenu']" class="subNavItem" @click.stop="goModules('businessDashboard','personnelInfo')">人员信息</div>
                <div v-if="permissions['marketDiscipMenu']" class="subNavItem" @click.stop="goModules('businessDashboard','marketDiscipline')">市场纪律</div>
                <div v-if="permissions['enterpriseInfoMenu']" class="subNavItem" @click.stop="goModules('businessDashboard','enterpriseInfo')">企业信息变更</div>
								<div v-if="permissions['alertManagerMenu']" class="subNavItem" @click.stop="goModules('businessDashboard','alertManagement')">预警管理</div>
								<div v-if="permissions['exitingNetworkMenu']" class="subNavItem" @click.stop="goModules('businessDashboard','exitingNetwork')">网络退出</div>

              </div>
						</li>
						<li :class="{active: tabName === 'form_flow'}" @click="goModules('form_flow')" v-if="appMsg.showFormMenun">
							<span>审批</span>
						</li>
						<li :class="{active: tabName === 'content'}" @click="goModules('content')" v-if="appMsg.showContentMenun">
							<span>协同</span>
						</li>

						<li :class="{active: tabName === 'qiruiqd'}" @click="goModules('qiruiqd')" v-if="appMsg.showQiruiqdMenun&& permissions['qiruiqdMenu']">
							<span>奇瑞渠道</span>
						</li>
            <li :class="{active: tabName === 'mainreport'}" @click="goModules('mainreport')" v-if="permissions['mainreportMgrMenu']">
              <span>看板管理</span>
            </li>

            <li class="distributorNav" v-if="permissions['outletsAddressBookMenu']"  :class="{active: tabName === 'outletsAddressBook'}"
                @mouseenter="isShowOutletsAddressBook=true" @mouseleave="isShowOutletsAddressBook=false" @click.stop="goModules('outletsAddressBook','contactSale')">
              <span>网点通讯录</span>
              <div class="disNavInfo" v-show="isShowOutletsAddressBook">
                <div v-if="permissions['contactSaleMenu']" class="subNavItem" @click.stop="goModules('outletsAddressBook','contactSale')">网点通讯录</div>
                <div v-if="permissions['serviceOperationTableMenu']" class="subNavItem" @click.stop="goModules('outletsAddressBook','serviceOperationTable')">服务网点运作表</div>
                <div v-if="permissions['operatingAuthorityMenu']" class="subNavItem" @click.stop="goModules('outletsAddressBook','operatingAuthority')">车型经营权限</div>
                <div v-if="permissions['serviceModelMenu']" class="subNavItem" @click.stop="goModules('outletsAddressBook','serviceModel')">服务车型管理</div>
              </div>
            </li>

            <li :class="{active: tabName === 'sales'}" @click="goModules('sales')" v-if="appMsg.showSalesMenun">
							<span>销售</span>
						</li>
						<li :class="{active: tabName === 'examination'}" @click="goModules('examination')" v-if="appMsg.showExaminationMenun && permissions['examinationMenu']">
							<span>培训考试</span>
						</li>
						<li :class="{active: tabName === 'hr'}" @click="goModules('hr')" v-if="appMsg.showHrMenun">
							<span>人资</span>
						</li>
						<li :class="{active: tabName === 'addressBook'}" @click="goModules('addressBook')" v-if="permissions['contactMenu']">
							<span>通讯录</span>
						</li>
						<li :class="{active: tabName === 'setting'}" @click="goModules('setting')" v-if="permissions['settingmenu']">
							<span>设置</span>
							<i class="icon-fuwu-num" v-if="navMsg.showSettingNum">{{navMsg.settingNum}}</i>
						</li>
						<li :class="{active: tabName === 'companysrv'}" @click="goModules('companysrv')" v-if="isShowCompanysrv">
							<span>企业服务</span>
							<i class="icon-fuwu-num" v-if="navMsg.showServieceNum">{{navMsg.serviceNum}}</i>
						</li>
					</ul>
					<div :class="{more_application:true, more_application_hover:isShowApp}" @click="handleClickMoreAppsMenu"
					 @mouseenter="mouseEnterApp" @mouseleave="mouseLeaveApp" v-if="isShowQW">
						<span class="tips_new"></span>
						<span :class="{moreApplicationLink:true, cf87b00:isShowApp}">+ 更多应用</span>
					</div>
					<div :class="{application_list_wrap:true, appShow:isShowApp}" @mouseenter="mouseEnterApp" @mouseleave="mouseLeaveApp">
						<div class="content_main">
							<div class="head_installApp_tip" v-if="appMsg.noInstallAll">点击下方免费安装更多应用</div>
							<div class="application_main">
								<div class="column" v-for="(colItem,colIdx) in appArr" :key="colIdx">
									<div :class="{application_wrap:true, bdLine:wrapItem.hasLine}" v-for="(wrapItem,wrapIdx) in colItem" :key="wrapIdx">
										<h2>{{wrapItem.title}}</h2>
										<ul class="application_list">
											<li v-for="(appItem,appIdx) in wrapItem.appList" :key="appIdx" v-if="appStatus[appItem.name]" :title="appStatus[appItem.name]['tips']"
											 @click="goApp(
                                                {
                                                    isInstall:appStatus[appItem.name]['isInstall'],
                                                    suiteId:appStatus[appItem.name]['suiteId'],
                                                    moduleName:wrapItem.moduleName,
                                                    agentCode:appStatus[appItem.name]['agentCode'],
                                                    permission:appItem['permission']
                                                })">
												<i :class="[{application_icon:true}, appItem.name + '_app']"></i>
												<span :class="[appStatus[appItem.name]['textStyle']]">
													{{appStatus[appItem.name]['appName']}}
												</span>
												<i class="application_icon hot_icon" v-if="appItem.hasHot"></i>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div class="refresh_wrap">
							<span class="refresh_btn" @click="refreshStatus">刷新应用托管状态</span> | <span class="refresh_btn" @click="synCompany">同步企业认证信息</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import axios from 'axios';
	import {
		mapActions,
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				baseURL: _.baseURL,
				isDisNavShow: false, // 经销商档案子菜单
				isShowBusinessDashboard: false, //业务看板菜单
        isShowOutletsAddressBook: false, //网点菜单
        isNetworkDashboard: false,
				isShow: false, //是否显示vip信息浮层
				isShowCompanysrv: false, //是否显示企业服务tab
				isShowApp: false, //是否显示更多应用浮层
				dataBase,
				vipMsg: { //vip信息
					vipName: '', //显示的vip名字
					vipTime: '', //vip有效期
					vipLink: '', //vip跳转链接
					vipStyle: 'novip', //vip背景图片
					vipService: [], //已购vip功能
					corpId: '', //corpId
					isCoop: false, //是否渠道
					warnStyle: '', //空间进度条提示样式
					progressVal: 0, //容量进度条
					spaceBuyURL: '', //升级空间链接
					spaceTotal: '', //空间总数
					useSpace: 0, //已用空间数
					//会员权益超期
					vip60DateNotifyList: [],
					//人数超限
					vipPersonNotifyList: [],
					vipShowVOList: []
				},
				logoURL: '', //logo地址
				logoLink: 'http://wbg.do1.com.cn', //logo跳转地址
				noCompleteData: false, //是否完善信息,
				navMsg: { //导航栏信息
					serviceNum: 0,
					showServieceNum: false,
					settingNum: 0,
					showSettingNum: false
				},
				appMsg: { // 托管信息
					noInstallAll: false, //是否安装全部应用
					isClickRefresh: false, //是否允许点击刷新委托状态
					isClickSyc: false, //是否允许点击同步企业信息
					showFormMenun: false, //是否显示审批菜单
					showContentMenun: false, //是否显示协同菜单
					showQiruiqdMenun: false, //是否显示奇瑞渠道菜单
					showSalesMenun: false, //是否显示销售菜单
					showExaminationMenun: false, //是否显示培训菜单
					showHrMenun: false //是否显示人资菜单
				},
				appArr: [ //更多应用列表结构
					[{
							hasLine: true, //是否有底线
							title: '审批', //标题
							moduleName: 'form_flow', //模块名称
							appList: [{ //应用列表
									name: 'form', //应用名称
									hasHot: true, //有没有推荐图标
									permission: 'formMenu' // 对应权限
								},
								{
									name: 'ask',
									hasHot: false,
									permission: 'askMenu'
								},
								{
									name: 'car',
									hasHot: false,
									permission: 'caraskList'
								},
								{
									name: 'reimbursement',
									hasHot: false,
									permission: 'reimbursementList'
								},
								{
									name: 'moveapprove',
									hasHot: false,
									permission: 'moveMenu'
								}
							]
						},
						{
							hasLine: false,
							title: '销售',
							moduleName: 'sales',
							appList: [{
									name: 'crm',
									hasHot: true,
									permission: 'crmMenu'
								},
								{
									name: 'contract',
									hasHot: false,
									permission: 'contractList'
								},
								{
									name: 'outsidework',
									hasHot: false,
									permission: 'outworkMenu'
								},
								{
									name: 'sale',
									hasHot: false,
									permission: 'saleMenu'
								}
							]
						}
					],
					[{
						hasLine: false,
						title: '协同',
						moduleName: 'content',
						appList: [{
								name: 'meetingassistant',
								hasHot: false,
								permission: ''
							},
							{
								name: 'dynamic',
								hasHot: true,
								permission: 'dynamicinfoMenu'
							},
							{
								name: 'checkwork',
								hasHot: false,
								permission: 'checkworkMenu'
							},
							{
								name: 'qydisk',
								hasHot: false,
								permission: 'qydiskMenu'
							},
							{
								name: 'activity',
								hasHot: false,
								permission: 'activityMenu'
							},
							{
								name: 'diary',
								hasHot: false,
								permission: 'diaryMenu'
							},
							{
								name: 'survey',
								hasHot: false,
								permission: 'surveyMenu'
							},
							{
								name: 'topic',
								hasHot: false,
								permission: 'topicMenu'
							},
							{
								name: 'task',
								hasHot: false,
								permission: 'taskTemMenu'
							},
							{
								name: 'productinfo',
								hasHot: false,
								permission: 'productMenu'
							},
							{
								name: 'express',
								hasHot: false,
								permission: 'expressMenu'
							}
						]
					}],
					[{
							hasLine: true,
							title: '培训',
							moduleName: 'examination',
							appList: [{
									name: 'learnonline',
									hasHot: true,
									permission: 'courseView'
								},
								{
									name: 'examination',
									hasHot: false,
									permission: 'questionPoolMenu'
								}
							]
						},
						{
							hasLine: true,
							title: '人资',
							moduleName: 'hr',
							appList: [{
									name: 'hrmanagement',
									hasHot: false,
									permission: 'hrmanagementMenu'
								},
								{
									name: 'groupsend',
									hasHot: false,
									permission: 'groupsendMenu'
								}
							]
						},
						{
							hasLine: true,
							title: '通讯录',
							moduleName: 'addressBook',
							appList: [{
								name: 'addressBook',
								hasHot: false,
								permission: 'contactMenu'
							}]
						},
						{
							hasLine: false,
							title: '其它',
							moduleName: 'other',
							appList: [{
								name: 'todo',
								hasHot: false,
								permission: ''
							}]
						},
					],
					[{
						hasLine: false,
						title: '渠道首页',
						moduleName: 'channel',
						appList: [{
							name: 'channel',
							hasHot: true,
							permission: ''
						}, ]
					}],
					[{
						hasLine: false,
						title: '经销商档案',
						moduleName: 'archives',
						appList: [{
								name: 'archivesList',
								hasHot: true,
								permission: ''
							},
							{
								name: 'archivesBag',
								hasHot: true,
								permission: ''
							},
							{
								name: 'archivesMap',
								hasHot: true,
								permission: ''
							},
							{
								name: 'schoolReport',
								hasHot: true,
								permission: ''
							}, {
								name: 'afterSchoolReport',
								hasHot: true,
								permission: ''
							}
						]
					}],
					[{
						hasLine: false,
						title: '业务看板',
						moduleName: 'businessDashboard',
						appList: [{
								name: 'enterpriseInfo',
								hasHot: true,
								permission: 'enterpriseInfoMenu'
							},
							{
								name: 'marketDiscipline',
								hasHot: true,
								permission: 'marketDiscipMenu'
							},
							{
								name: 'starRating',
								hasHot: true,
								permission: 'starRatingMenu'
							},
							{
								name: 'networkSale',
								hasHot: true,
								permission: 'networkSaleMenu'
							}, {
								name: 'alertManagement',
								hasHot: true,
								permission: 'alertManagerMenu'
							},
							{
                name: 'exitingNetwork',
                hasHot: true,
                permission: 'exitingNetworkMenu'
              },
              {
                 name: 'personnelInfo',
                 hasHot: true,
                 permission: 'personnelInfoMenu'
              }
						]
					}],
				],
				appStatus: {}, //应用的安装状态
				trustAppData: {}, // 应用托管状态
				permissions: {}, // 权限列表
				isShowQW: true, // 是否显示非渠道的东西
				//会员权益浮层
				vipBenefitInFoBox: false
			}
		},
		props: {
			pswPath: {
				type: String,
				default: '/changePsw'
			},
			tabName: {
				type: String,
				default: '',
				require: true
			}
		},
		filters: {
			//过滤应用名称
			filterDay(endDate) {
				let startDate = new Date().Format("yyyy-MM-dd");
				let startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
				let endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
				let dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
				return dates + 1;
			},
		},
		computed: {
			...mapGetters('header', [
				'showQRCode',
				'permission'
			]),
			vipBenefitDateNotifyList() {
				return this.vipMsg.vip60DateNotifyList && this.vipMsg.vip60DateNotifyList.length
			},
			vipPersonNotifyList() {
				return this.vipMsg.vipPersonNotifyList && this.vipMsg.vipPersonNotifyList.length
			},
			//已购套餐
			vipShowVOList() {
				return this.vipMsg.vipShowVOList && this.vipMsg.vipShowVOList.length
			}
		},
		methods: {
			...mapActions('header', [
				'setShowQRCode',
				'setTrustApp',
				'setPermission'
			]),
			//鼠标移入vip信息
			mouseEnterVip() {
				this.isShow = true;
			},

			//鼠标移出vip信息
			mouseLeaveVip() {
				this.isShow = false;
			},

			//跳转API文档
			goAPI() {
				window.open('https://qy.do1.com.cn/qwy/api/index.html');
			},

			// 跳转修改密码
			goChangePsw(path) {
				this.$router.push(path);
			},

			//跳转绑定通讯录
			goAddressList() {
				let baseURL = this.baseURL;

				window.location.href = baseURL + '/manager/sales/main.jsp?new=1';
			},

			//关注二维码
			openQrCode() {
				this.setShowQRCode(true);
				document.body.style.overflow = 'hidden'; // 禁止黑幕状态下底部内容可以滚动
			},

			//退出
			signOut() {
				let baseURL = this.baseURL;
				let {
					alert: _alert
				} = this.dataBase;

				axios({
						url: baseURL + '/portal/cooperationOpen/cooperationOpenAction!logoutManager.action',
						method: 'POST',
						dataType: 'json'
					})
					.then(res => {
						if (res.code == '0') {
							let {
								loginType,
								logoutUrl,
								isUseAuthorization
							} = res.data;

							if (loginType == 'mycompany') {
								if (isUseAuthorization) {
									window.location.href =
										`${baseURL}/authclient/logout.do?redirect_uri=${baseURL}/jsp/default/login/login_result_success.jsp`;
								} else {
									window.location.href = `${baseURL}/j_spring_security_logout`;
								}
							} else if (loginType == 'cooperation') {
								this.delCookies('do1qw@loginType');
								this.delCookies('do1qw@loginUrl');
								this.delCookies('do1qw@managerLoginurl');
								this.delCookies('do1qw@qwwebLoginurl');
								if (isUseAuthorization) {
									window.location.href = `${baseURL}/authclient/logout.do?redirect_uri=${logoutUrl}`;
								} else {
									window.location.href = logoutUrl;
								}
							}
						} else {
							_alert('提示', res.desc);
						}
					})
					.catch(err => {
						_alert('提示', '网络错误');
					});
			},

			//删除cookie
			delCookies(name) {
				document.cookie = `${name}=${escape('')};path=/`;
			},

			//比较日期
			dateCompare(startDate, endDate) {
				let startData = new Date(startDate);
				let startTime = startTime.getTime();

				let endData = new Date(endDate);
				let endTimes = endTimes.getTime();

				if (startTime >= endTimes) {
					return false;
				} else {
					return true;
				}
			},

			//点击vip图标跳转
			goVip() {
				if (this.vipMsg.vipLink) {
					window.open(this.vipMsg.vipLink);
				}
			},
			mouseOverTipFun() {
				clearTimeout(this.vipTimer);
				this.vipBenefitInFoBox = true
			},
			mouseOutTipFun() {
				let self = this
				this.vipTimer = setTimeout(function() {
					self.vipBenefitInFoBox = false
					clearTimeout(self.vipTimer);
				}, 100)
			},
			//购买尊享本会员套餐
			clickBuyPackage() {
				window.open(`${this.baseURL}/vm/module/service.html#/open/home`);
			},
			//购买人数扩容页面
			clickBuyPerson() {
				window.open(`${this.baseURL}/vm/module/service.html#/expansion`);
			},
			// 是否渠道
			isQuDao() {
				let {
					config
				} = this.dataBase;
				if (config.orgConfigInfo && config.orgConfigInfo.isCooperation && config.orgConfigInfo.type == '1') {
					return true;
				}
				return false;
			},

			// 是否显示企微信息
			showQw() {
				let {
					config
				} = this.dataBase;
				if (!this.isQuDao()) {
					return true;
				}
				if (config.orgConfigInfo.isShowQw == '0') {
					return false;
				}
				return true;
			},

			//vip相关功能
			vipInit() {
				let baseURL = this.baseURL;
				let {
					alert: _alert,
					config
				} = this.dataBase;
				let {
					VIPTime,
					myInterfaceList,
					fileStatisticsVO,
					spaceTixingCount,
					corpId,
					logoUrl,
					managerLoginurl,
					vipGrade
				} = config.logo;
				let spaceBuyURL = `${baseURL}/qiweipublicity/companysrv/space/space_index.jsp`;
				const vipGoldLink = `${baseURL}/qiweipublicity/companysrv/vip/vip_gold_index.jsp`;
				const vipSliverLink = `${baseURL}/qiweipublicity/companysrv/vip/vip_index.jsp`;

				//设置vip信息
				this.vipMsg.vipTime = VIPTime; //vip有效期
				this.vipMsg.vipService = myInterfaceList; //已购金卡功能
				if (fileStatisticsVO) {
					this.vipMsg.useSpace = fileStatisticsVO.cannotuseSpace //已使用空间
				}
				this.vipMsg.isCoop = false; //是否合作商
				this.vipMsg.spaceBuyURL = spaceBuyURL //购买空间链接
				this.vipMsg.corpId = corpId //corpId
				//头部尊享会员即将到期提示
				this.vipMsg.vip60DateNotifyList = config.vip60DateNotifyList
				//人数超限头部提示
				this.vipMsg.vipPersonNotifyList = config.vipPersonNotifyList
				//已购套餐列表
				this.vipMsg.vipShowVOList = config.vipShowVOList

				//判断是否合作商
				if (config.logo.cooperationSettingVO && config.logo.cooperationSettingVO.status == '1') {
					this.vipMsg.isCoop = true;
					this.logoLink = managerLoginurl;
				}

				//如果是非渠道，显示更多应用
				if (config.is_qiweiyun && this.showQw()) {
					this.isShowQW = true;
				}

				//显示企业服务
				if (wxqyhConfig.is_qiweiyun && this.showQw()) {
					if ("superManager" == config.logo.managerLevelCode || "1" == config.logo.isShowCompanysrv) { //超管或者打开了子管理员显示的开关
						this.isShowCompanysrv = true;
					}
				}
				if (fileStatisticsVO) {
					//总空间
					if (fileStatisticsVO.sumSpace > 200) {
						let sumSpace = fileStatisticsVO.sumSpace / 1024;
						this.vipMsg.spaceTotal = `${sumSpace.toFixed(2)}GB`;
					} else {
						this.vipMsg.spaceTotal = `${fileStatisticsVO.sumSpace}MB`;
					}

					// vip显示相关
					if (this.isQuDao() || wxqyhConfig.vipShowVOList) { //是否在有效期
						this.vipMsg.vipLink = vipGoldLink;
						this.vipMsg.vipName = '尊享会员';
						this.vipMsg.vipStyle = 'vipGold';
					} else {
						this.vipMsg.vipLink = vipSliverLink;
						this.vipMsg.vipName = '团队版';
						this.vipMsg.vipStyle = 'novip';
					}

					// 空间容量相关
					if (fileStatisticsVO.canuseSpace >= 0) {
						// 进度条数值
						this.vipMsg.progressVal = fileStatisticsVO.cannotusePercent;

						// 进度条颜色状态
						if (fileStatisticsVO.cannotusePercent >= 0 && fileStatisticsVO.cannotusePercent <= 20) {
							this.vipMsg.warnStyle = '';
						} else if (fileStatisticsVO.cannotusePercent > 20 && fileStatisticsVO.cannotusePercent < 90) {
							this.vipMsg.warnStyle = 'yellow_progress';
						} else if (fileStatisticsVO.cannotusePercent >= 90 && fileStatisticsVO.cannotusePercent <= 100) {
							this.vipMsg.warnStyle = 'red_progress';
							//弹框提醒
							if (spaceTixingCount < 2) {
								if (this.vipMsg.isCoop) {
									//90%时每次登录只提示一次
									_alert("超限提示", "空间使用量已超过90%，为了不影响正常使用，请尽快购买存储空间。");
								} else {
									//90%时每次登录只提示一次
									_alert("道一云|企微空间超限提示", "空间使用量已超过90%，为了不影响正常使用，请尽快购买存储空间，<br/><a target='_blank' href='" + spaceBuyURL +
										"'>点击链接购买。</a>");
								}
							}
						}
					} else {
						//超过总容量
						this.vipMsg.progressVal = 100;
						this.vipMsg.warnStyle = 'red_progress';

						let overPercent = parseInt(fileStatisticsVO.cannotuseSpace) / parseInt(fileStatisticsVO.sumSpace);
						if (overPercent >= 2) {
							if (this.vipMsg.isCoop) {
								_alert("空间超限提示", "空间使用量已超过" + ((overPercent * 100).toFixed(0)) + "%，为了不影响正常使用，请尽快购买存储空间。");
							} else {
								_alert("道一云|企微空间超限提示", "空间使用量已超过" + ((overPercent * 100).toFixed(0)) +
									"%，为了不影响正常使用，请尽快购买存储空间，<br/><a target='_blank' href='" + spaceBuyURL + "'>点击链接购买！</a>", () => {
										window.location.href = "http://qy.do1.com.cn/qwy/qiweipublicity/companysrv/space/space_index.jsp";
									});
							}
						} else {
							//超过容量每次提醒
							if (this.vipMsg.isCoop) {
								_alert("空间超限提示", `${fileStatisticsVO.orgName}的管理员，你的账号存储空间已经超限，请尽快购买或者升级存储空间，以免影响系统正常使用。`);
							} else {
								_alert("道一云|企微存储空间超限提示",
									`${fileStatisticsVO.orgName}的管理员，你的账号存储空间已经超限，请尽快购买或者升级存储空间，以免影响系统正常使用。<a target='_blank' href='${spaceBuyURL}'>点击获得升级秘籍！</a>`,
									() => {
										window.open(spaceBuyURL);
									}, '立即购买');
							}
						}
					}
				}
				// logo地址
				this.logoURL = logoUrl == '/manager/images/logo.png' ? `${baseURL}${logoUrl}` : `${_.compressURL}${logoUrl}`;

				// 是否完善资料
				if (!config.mgrUserInfo.mobile && config.mgrUserInfo.age <= 1) {
					this.noCompleteData = true;
				}
			},

			//根据参数跳转不同链接
			getIndVersion(type, code) {
				let baseURL = this.baseURL;
				let {
					alert: _alert
				} = this.dataBase;
				axios({
						url: `${baseURL}/managesetting/managesettingAction!getIndustryVer.action`,
						method: 'POST',
						dataType: 'json'
					})
					.then(res => {
						if (res.code == '0') {
							let url = `${baseURL}/manager/addressbook/main.jsp`;

							if (res.data.eduPO && res.data.eduPO.industryVer == '1') {
								if (type === 'content') {
									url = `${baseURL}/manager/veredu/main.jsp${code}`;
								} else {
									url = `${baseURL}/manager/addressbook/veredu/main.jsp${code}`;
								}
							} else {
								if (type === "content") {
									url = `${baseURL}/manager/main.jsp${code}`;
								} else {
									url = `${baseURL}/manager/addressbook/main.jsp${code}`;
								}
							}
							window.location.href = url;
						} else {
							_alert("提示", res.desc);
						}
					})
					.catch(err => {
						let url = `${baseURL}/manager/addressbook/main.jsp`;
						if (type === 'content') {
							url = `${baseURL}/manager/main.jsp`;
						}
						window.location.href = url;
					});
			},

			// 跳转进入对应的模块
			goModules(type, code) {
				let url = '';
				let agentCode = code ? `?agentCode=${code}` : '';
				let baseURL = this.baseURL;
				switch (type) {
					case 'channel':
						window.location.href = baseURL + '/vm/module/channelHome.html#/channelHome';
						break;
					case 'archives':
						var pathJsont = {
							'archivesList': '/vm/module/distributorArchives.html#/archivesList/index?status=&departmentId=&keyWord=',
							'archivesBag': '/vm/module/distributorArchives.html#/archivesList/archivesBag?erpId=',
							'archivesMap': '/vm/module/distributorArchives.html#/archivesList/archivesMap',
              'schoolReport': '/vm/module/distributorArchives.html#/archivesList/schoolReport',
							'salesSchoolReport': '/vm/module/distributorArchives.html#/archivesList/schoolReport',
							'afterSalesSchoolReport': '/vm/module/distributorArchives.html#/archivesList/afterSchoolReport'
						};
						window.sessionStorage.removeItem('jumpVue');
						if (pathJsont[code]) {
                const hasSalesMenu = this.permissions['reportCardIndexMenu']
                const hasAfterSales = this.permissions['saleReportCardIndexMenu']
						    if(code === 'schoolReport' && !hasSalesMenu && hasAfterSales){ // 只有售后时跳转到售后
                    window.location.href = baseURL + pathJsont['afterSalesSchoolReport'];
                }else{
                    window.location.href = baseURL + pathJsont[code];
                }
						} else if (code) {
							this.getIndVersion('content', agentCode);
						} else {
							window.location.href = baseURL + pathJsont['archivesList'];
						}
						break;

          case 'outletsAddressBook':
              var pathJsont = {
                  'contactSale': '/vm/module/outletsAddressBook.html#/contact/contactSale',
                  'serviceOperationTable': '/vm/module/outletsAddressBook.html#/serviceOperationTable',
                  'operatingAuthority': '/vm/module/outletsAddressBook.html#/operatingAuthority',
                  'serviceModel': '/vm/module/outletsAddressBook.html#/serviceModel',
              };
              window.sessionStorage.removeItem('jumpVue');
              if (pathJsont[code]) {
                  window.open(baseURL + pathJsont[code], '_self')
              } else if (code) {
                  this.getIndVersion('content', agentCode);
              } else {
                  window.location.href = baseURL + pathJsont['serviceModelManagement']; //todo default
              }
          break;

					case 'businessDashboard':
						var pathJsont = {
							'enterpriseInfo': '/vm/module/businessDashboard.html#/enterpriseInfo',
							'marketDiscipline': '/vm/module/businessDashboard.html#/marketDiscipline',
							'starRating': '/vm/module/businessDashboard.html#/starRating',
							'networkSale': '/vm/module/businessDashboard.html#/networkSale',
							'alertManagement': '/vm/module/businessDashboard.html#/alertManagement',
							'exitingNetwork': '/vm/module/businessDashboard.html#/exitingNetwork',
							'personnelInfo': '/vm/module/businessDashboard.html#/personnelInfo',
              'oneNetworkSize': '/vm/module/businessDashboard.html#/oneNetworkSize',
              'networkStatus': '/vm/module/businessDashboard.html#/networkStatus',
              'planningProgress': '/vm/module/businessDashboard.html#/planningProgress',
              'completionSituation': '/vm/module/businessDashboard.html#/completionSituation',
						};
						window.sessionStorage.removeItem('jumpVue');
						if (pathJsont[code]) {
							window.open(baseURL + pathJsont[code], '_self')
						} else if (code) {
							this.getIndVersion('content', agentCode);
						} else {
							window.location.href = baseURL + pathJsont['enterpriseInfo'];
						}
						break;

            case 'networkDashboard':
                var pathJsont = {
                    'oneNetworkSize': '/vm/module/networkDashboard.html#/oneNetworkSize',
                    'networkStatus': '/vm/module/networkDashboard.html#/networkStatus',
                    'planningProgress': '/vm/module/networkDashboard.html#/planningProgress',
                    'completionSituation': '/vm/module/networkDashboard.html#/completionSituation',
                };
                window.sessionStorage.removeItem('jumpVue');
                if (pathJsont[code]) {
                    window.open(baseURL + pathJsont[code], '_self')
                } else if (code) {
                    this.getIndVersion('content', agentCode);
                } else {
                    window.location.href = baseURL + pathJsont['oneNetworkSize'];
                }
                break;
					case 'content':
						var pathJson = {
							'dynamic': '/vm/module/cooperative.html#/newsMain/list',
							'diary': '/vm/module/cooperative.html#/diary/diaryList',
							'meetingassistant': '/vm/module/cooperative.html#/meeting/meetingList',
							'productinfo': '/vm/module/cooperative.html#/product/productList',
							'task': '/vm/module/cooperative.html#/taskList',
							'express': '/vm/module/cooperative.html#/express',
						};
						window.sessionStorage.removeItem('jumpVue');
						let isEdu = window.localStorage.getItem('isEdu');
						if (pathJson[code]) {
							window.location.href = baseURL + pathJson[code];
						} else if (code) {
							this.getIndVersion('content', agentCode);
						} else if (isEdu == '1') { //是教育版
							window.localStorage.removeItem('isEdu');
							window.location.href = `${baseURL}` + '/manager/veredu/main.jsp';
						} else {
							window.location.href = baseURL + pathJson['dynamic'];
						}
						break;
					case 'addressBook':
						this.getIndVersion('addressBook', agentCode);
						break;
					case 'qiruiqd':
						url = `${baseURL}/manager/qiruiqd/main.jsp${agentCode}`;
						break;
          case 'mainreport':
                url = `${baseURL}/manager/qiruiqd/main_report.jsp${agentCode}`;
                break;
					case 'hr':
						url = `${baseURL}/manager/hrmanagement/hrmanagement_main.jsp${agentCode}`;
						break;
					case 'examination':
						url = `${baseURL}/manager/examination/main.jsp${agentCode}`;
						break;
					case 'setting':
						url = this.getSettingUrl(agentCode);
						break;
					case 'companysrv':
						url = `${baseURL}/manager/companysrv/account.jsp${agentCode}`;
						break;
					case 'form_flow':
						url = `${baseURL}/manager/form_flow/main.jsp${agentCode}`;
						break;
					case 'sales':
						//如果有公海池权限就跳公海
						if (this.permissions['poolClientList']) {
							url = `${baseURL}/vm/module/crm.html#/crm/territorialSea/list`
						} else if (this.permissions['clientList']) {
							url = `${baseURL}/vm/module/crm.html#/crm/client/list`
						}
						//                    else if(this.permissions['outsideList']){
						//                        url = `${baseURL}/vm/module/crm.html#/crm/visit/list`
						//                    }
						else {
							url = `${baseURL}/manager/sales/main.jsp${agentCode}`
						}
						break;
				}

				if (type != "content" && type != "addressBook" && type != "archives" && type != "channel" && type != "businessDashboard" && type != "networkDashboard" && type!=='outletsAddressBook') {
					window.location.href = url;
				}
			},

			// 获取设置路径
			getSettingUrl(agentCode) {
				let baseURL = this.baseURL;
				if (this.permissions['settingaccountmenu'] && !this.isCoop) {
					return `${baseURL}/manager/managesetting/account_main.jsp${agentCode}`;
				}
				if (this.permissions['settingusermenu']) {
					return `${baseURL}/manager/managesetting/user_main.jsp${agentCode}`;
				}
				if (this.permissions['settingrolemenu']) {
					return `${baseURL}/manager/managesetting/role_main.jsp${agentCode}`;
				}
				if (this.permissions['dimissionmenu']) {
					return `${baseURL}/manager/addressbook/dimission/main.jsp${agentCode}`;
				}
				if (this.permissions['qyPaySettingMenu']) {
					return `${baseURL}/manager/managesetting/pay_main.jsp${agentCode}`;
				}
				if (this.permissions['currencySettingMenu']) {
					return `${baseURL}/manager/managesetting/currency_main.jsp${agentCode}`;
				}
				if (this.permissions['sensitiveWordSettingMenu']) {
					return `${baseURL}/manager/managesetting/sensitiveword_main.jsp${agentCode}`;
				}
				return `${baseURL}/manager/managesetting/main.jsp${agentCode}`;
			},

			// 获取企业服务提醒数量
			getSerivceNum() {
				let baseURL = this.baseURL;
				let {
					alert: _alert
				} = this.dataBase;
				axios({
						url: `${baseURL}/assetmgr/assetmgrAction!getInvoiceInfo.action`,
						method: 'POST',
						dataType: 'json'
					})
					.then(res => {
						if (res.code == '0') {
							let {
								tbDidiInvoicePOList,
								orderList
							} = res.data;
							if (tbDidiInvoicePOList.length > 0 || orderList.length > 0) {
								let num = tbDidiInvoicePOList.length + orderList.length;
								this.navMsg.serviceNum = num;
								this.navMsg.showServieceNum = true;
							}
						} else {
							_alert('提示', res.desc);
						}
					})
					.catch(err => {
						_alert('提示', '网络错误');
					});
			},

			// 获取设置提醒数量
			getSettingNum() {
				let {
					mgrUserInfo
				} = this.dataBase.config;
				if (!mgrUserInfo.mobile && mgrUserInfo.age == 0) {
					this.navMsg.settingNum = 1;
					this.navMsg.showSettingNum = true;
				}
			},

			// 判断是否已安装应用
			getWxSuite() {
				let baseURL = this.baseURL;
				let {
					alert: _alert
				} = this.dataBase;
				let wxSuite = {};

				return new Promise((resolve, reject) => {
					axios({
							url: `${baseURL}/weixinsuite/weixinsuiteAction!getWxSuite.action`,
							method: 'POST',
							dataType: 'json'
						})
						.then(res => {
							if (res.code == '0') {
								let {
									list
								} = res.data;

								list.map((listVal, idx) => {
									let {
										agentList
									} = listVal;
									agentList.map((agListVal, idx) => {
										let {
											agentCode
										} = agListVal;
										wxSuite[agentCode] = agListVal;
									});
								});
								resolve(wxSuite);
							} else {
								_alert('提示', res.desc);
							}
						})
						.catch(err => {
							_alert('提示', '网络错误');
						});
				});
			},

			// 更多应用初始化
			applicationInit() {
				// 获取应用套件
				let appObj = {}
				this.getWxSuite().then(res => {
					for (let obj in res) {
						let {
							bunding,
							suiteId,
							agentName,
							agentCode
						} = res[obj];
						appObj[agentCode] = {
							bunding,
							suiteId,
							agentCode,
							appName: agentName,
							tips: '点击免费安装',
							textStyle: 'disabled',
							isInstall: false
						};
						if (bunding != '') {
							appObj[agentCode]['appName'] = bunding;
							appObj[agentCode]['tips'] = '点击进入应用';
							appObj[agentCode]['textStyle'] = '';
							appObj[agentCode]['isInstall'] = true;
						} else {
							this.appMsg.noInstallAll = true;
						}
					}

					//只要托管了”人事考核“应用或”新闻公告“应用，显示“工资条”菜单,如果没有，则为“人事考核”的跳转安装链接
					appObj['groupsend'] = {
						agentCode: 'groupsend',
						appName: '工资条',
						tips: '点击免费安装',
						textStyle: 'disabled',
						isInstall: false
					}
					if (appObj['hrmanagement']['bunding'] || appObj['dynamic']['bunding']) {
						appObj['groupsend']['tips'] = '点击进入应用';
						appObj['groupsend']['textStyle'] = '';
						appObj['groupsend']['isInstall'] = true;
					} else {
						this.appMsg.noInstallAll = true;
					}

					this.appStatus = appObj;
					this.showMenu();
				});
			},

			//刷新应用托管状态
			refreshStatus() {
				let baseURL = this.baseURL;
				let {
					top_alert
				} = this.dataBase;

				// 限制请求过程中再次点击
				if (!this.isClickRefresh) {
					this.isClickRefresh = true;
					axios({
							url: `${baseURL}/application/application!authHandleRefreshAll.action`,
							method: 'POST',
							dataType: 'json'
						})
						.then(res => {
							this.isClickRefresh = false;
							if (res.code == '0') {
								top_alert('刷新托管状态成功', true, 2000);
							} else {
								top_alert(res.desc, false, 2000);
							}
						})
						.catch(err => {
							this.isClickRefresh = false;
							_alert('提示', '网络错误');
						});
				}

			},

			// 同步企业信息
			synCompany() {
				let baseURL = this.baseURL;
				let {
					top_alert
				} = this.dataBase;

				// 限制请求过程中再次点击
				if (!this.isClickSyc) {
					this.isClickSyc = true;
					axios({
							url: `${baseURL}/application/application!authHandleRefresh.action`,
							method: 'POST',
							dataType: 'json'
						})
						.then(res => {
							this.isClickSyc = false;
							if (res.code == '0') {
								top_alert('同步成功', true, 2000);
							} else {
								top_alert(res.desc, false, 2000);
							}
						})
						.catch(err => {
							this.isClickSyc = false;
							_alert('提示', '网络错误');
						});
				}
			},

			// 获取菜单状态
			getMenunStatus(arr) {
				arr.map((arrItem, arrIdx) => {
					arrItem.appList.map((item, idx) => {
						if (this.appStatus[item.name] && this.appStatus[item.name].isInstall) {
							this.appMsg[arrItem.name] = true;
						}
					});
				});
			},

			// 根据托管状态显示菜单
			showMenu() {
				let formList = this.appArr[0][0].appList,
					salsList = this.appArr[0][1].appList;
				let contentList = this.appArr[1][0].appList,
					trainList = this.appArr[2][0].appList;
				let hrList = this.appArr[2][1].appList,
					addressBookList = this.appArr[2][2].appList;

				// 获取菜单状态
				this.getMenunStatus([{
						appList: formList,
						name: 'showFormMenun'
					},
					{
						appList: salsList,
						name: 'showSalesMenun'
					},
					{
						appList: contentList,
						name: 'showContentMenun'
					},
					{
						appList: trainList,
						name: 'showExaminationMenun'
					},
					{
						appList: hrList,
						name: 'showHrMenun'
					}
				]);

				// 如果安装了会议助手，显示“审批”菜单
				if (this.appStatus["meetingassistant"]["bunding"]) {
					this.appMsg.showFormMenun = true;
				}
				// 如果安装了新闻公告或人事考核，显示“人资”菜单
				let arr = Object.keys(this.permission)
				let str = 'groupsendMenu|hrMenu'
				let isTrue = arr.some((value) => {
					return str.includes(value)
				})
				this.appMsg.showHrMenun = false
				if (this.appStatus['dynamic']['bunding'] && isTrue) {
					this.appMsg.showHrMenun = true
				}
				if (!this.dataBase.config.is_qiweiyun) {
					this.appMsg.showContentMenun = true;
					this.appMsg.showQiruiqdMenun = true
				}

			},

			// 跳转到对应应用
			goApp(obj) {
				let baseURL = this.baseURL;
				let {
					top_alert
				} = this.dataBase;

				// 安装和未安装跳转不同的链接
				if (!obj.isInstall) {
					window.open(`${baseURL}/application/application!authSuite.action?suiteId=${obj.suiteId}`);
				} else {
					if (obj.permission != '') {
						if (this.permissions[obj.permission]) {
							this.goModules(obj.moduleName, obj.agentCode);
						} else {
							top_alert('管理员没有开启该应用的使用权限', false, 800);
						}
					} else {
						this.goModules(obj.moduleName, obj.agentCode);
					}
				}
			},

			//鼠标移入更多应用
			mouseEnterApp() {
				// this.isShowApp = true;
			},

			//鼠标移出更多应用
			mouseLeaveApp() {
				// this.isShowApp = false;
			},

			// 点击更多应用菜单
			handleClickMoreAppsMenu() {
				window.location.href = _.baseURL + '/manager/appconfig_main.jsp'
			},

			// 对比结果
			computeResult(result) {
				let resObj = {};
				result.data.list.map((item, idx) => {
					resObj[item.agentCode] = item;
				});

				return resObj;
			}
		},
		mounted() {
			// 初始化
			let self = this;
			window.getPerm().then(function() {
				self.permissions = self.permission;
          console.log(self.permission)
			});
			this.vipInit();
			this.applicationInit();
			this.getSerivceNum();
			this.getSettingNum();
		}
	}
</script>
<style lang="scss" scoped>
	// 经销商档案导航
	.distributorNav {
		z-index: 1;
	}

	.disNavInfo {
		position: absolute;
		left: 0;
		top: 40px;
		width: 100%;
		background: #fff;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .15);
	}

	.subNavItem {
		text-align: center;
		border-bottom: 1px solid #f1efef;
		color: #333;
		font-size: 14px;
	}


	#header {
		min-width: 1200px;
	}

	.mt5 {
		margin-top: 5px;
	}

	.mt10 {
		margin-top: 10px;
	}

	.inner-header {
		position: relative;
		margin: 0 auto;
		max-width: 1200px;
		color: #333;
	}

	.logo_link {
		height: 50px;
		line-height: 50px;
	}

	.logo_link img {
		height: 30px;
		border: 0;
		vertical-align: middle;
	}

	.login_text {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 10px;
	}

	.login_msg {
		position: relative;
		display: flex;
		padding: 14px 0;
		cursor: pointer;
	}

	.vipLogo {
		position: relative;
		display: inline-block;
		margin-top: -3px;
		width: 30px;
		height: 20px;
		vertical-align: middle;
	}

	.vipLogo:before {
		content: "";
		position: absolute;
		top: 8px;
		left: 38px;
		border-color: transparent transparent #7d838f;
		border-style: solid;
		border-width: 5px;
		transform: rotate(180deg);
		-webkit-transform: rotate(180deg);
	}

	.vipGold {
		color: #feaa00;
		background: url(../../assets/images/icon_vip_gold.png) no-repeat left center;
	}

	.vip1 {
		color: #e13727;
		background: url(../../assets/images/icon_vip.png) no-repeat left center;
	}

	.novip {
		color: #999;
		background: url(../../assets/images/icon_novip.png) no-repeat left center;
	}

	.text_item {
		margin-right: 15px;
	}

	.text_item:last-child {
		margin-right: 0;
	}

	.vipLogo_wrap {
		position: relative;
		margin: 0 18px 0 5px;
	}

	.headIcon {
		display: inline-block;
		margin-top: -3px;
		width: 30px;
		height: 30px;
		vertical-align: middle;
		background: url(../../assets/images/headIcon.png) no-repeat;
	}

	.headIcon_notice {
		background-position: 0 -30px;
	}

	.headIcon_help {
		background-position: 0 -90px;
	}

	.vip_hover {
		position: absolute;
		top: 26px;
		left: -81px;
		z-index: 1000;
		display: none;
		// padding-top:10px;
		width: 228px;
		font-size: 12px;
		line-height: normal;
		border: 1px solid #ccc;
		border-radius: 2px;
		box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.1);
		background: none repeat 0 0 white;
	}

	.vip_hover:before {
		content: "";
		position: absolute;
		top: -5px;
		left: 88px;
		width: 10px;
		height: 10px;
		border: 1px solid #ccc;
		background: white;
		-webkit-transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		-o-transform: rotate(45deg);
		transform: rotate(45deg);
	}

	.vip_hover:after {
		content: "";
		position: absolute;
		top: 0;
		left: 85px;
		width: 20px;
		height: 10px;
		background: white;
	}

	.vip_hover .hover_item {
		padding: 8px;
		color: #999;
		border-top: 1px solid #e5e5e5;
	}

	.vip_msg {
		padding: 0 8px 8px;
		color: #999;
	}

	.vip_msg .vipLogo {
		padding-left: 35px;
		width: auto;
		line-height: 20px;
		vertical-align: top;
	}

	.vip_msg .vipLogo:before {
		content: normal;
	}

	.vip_date {
		margin-top: 5px;
	}

	.vip_hover .hover_spItem {
		color: #333;
	}

	.vip_hover .hover_spItem:hover {
		background: #f4f5f9;
	}

	.space_progress {
		display: inline-block;
		margin-top: 5px;
		width: 100%;
		height: 10px;
		background: #ddd;
		color: #49AE14;
		border: none;
	}

	.space_progress::-webkit-progress-bar {
		background: #ddd;
	}

	.space_progress::-webkit-progress-value {
		background: #49AE14;
	}

	.yellow_progress::-webkit-progress-value {
		background: #FF9300;
	}

	.red_progress::-webkit-progress-value {
		background: #E73D2E;
	}

	.icon_notice_dot {
		display: inline-block;
		margin-left: -5px;
		width: 10px;
		height: 10px;
		vertical-align: super;
		border: 1px solid #fff;
		border-radius: 50%;
		background-color: #eb5342;
	}

	.nav {
		height: 40px;
		/*background: #f87b00;*/
		background: #C31725;
	}

	.cf87b00 {
		color: #f87b00 !important;
	}

	.red {
		color: #E73D2E;
	}

	.nav_bar_wrap {
		position: relative;
		margin: 0 auto;
		max-width: 1200px;
    z-index: 8;
	}

	.nav_bar {
		display: flex;
	}

	.nav_bar li {
		position: relative;
		width: 100px;
		height: 40px;
		line-height: 40px;
		font-size: 16px;
		text-align: center;
		color: #fff;
		cursor: pointer;
	}

	.nav_bar li:hover,
	.nav_bar .active {
		background: #F08088;
	}

	.icon-fuwu-num {
		position: absolute;
		top: -4px;
		right: 0;
		width: 16px;
		height: 16px;
		line-height: 16px;
		text-align: center;
		font-size: 12px;
		color: #fff;
		border: 1px #fff solid;
		border-radius: 50%;
		background-color: #eb5342;
	}

	.more_application {
		position: absolute;
		top: 0px;
		right: 0;
		padding: 0 20px;
		height: 40px;
		line-height: 38px;
		cursor: pointer;

		&:hover {
			z-index: 1001;
			/*background-color: #C31725;*/
			background-color: #F08088;
		}
	}

	.moreApplicationLink {
		font-size: 16px;
		color: #fff;
	}

	.tips_new {
		position: absolute;
		top: -10px;
		right: 0;
		display: block;
		width: 37px;
		height: 20px;
		background: url(../../assets/images/tips_new_1.png) no-repeat 0 0;
	}

	.more_application_hover {
		background: #fff;
	}

	.application_list_wrap {
		position: absolute;
		right: 0;
		float: right;
		display: none;
		background: #fff;
		box-shadow: 0 0 14px rgba(0, 0, 0, 0.2);
		z-index: 1000;
	}

	.head_installApp_tip {
		margin-bottom: 10px;
		width: 475px;
		height: 36px;
		line-height: 36px;
		font-size: 14px;
		text-align: center;
		background: url(../../assets/images/head_installApp_pic.png) no-repeat;
		background-size: 100% 100%;
	}

	.application_main {
		display: flex;
	}

	.column {
		margin-left: 50px;
		width: 125px;
	}

	.column:first-child {
		margin-left: 0;
	}

	.application_wrap h2 {
		height: 28px;
		line-height: 28px;
		color: #333;
		font-size: 14px;
		font-weight: bold;
	}

	.application_list li {
		position: relative;
		margin: 15px 0;
		cursor: pointer;
	}

	.application_icon {
		display: inline-block;
		margin-top: -2px;
		width: 20px;
		height: 20px;
		vertical-align: middle;
		background: url(../../assets/images/head_app.png) no-repeat;
	}

	.bdLine {
		margin-bottom: 14px;
		border-bottom: 1px solid #ccc;
	}

	.hot_icon {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		background-position-y: -500px;
	}

	.from_app {
		background-position-y: 0;
	}

	.ask_app {
		background-position-y: -200px;
	}

	.car_app {
		background-position-y: -20px;
	}

	.reimbursement_app {
		background-position-y: -480px;
	}

	.moveapprove_app {
		background-position-y: -240px;
	}

	.crm_app {
		background-position-y: -340px;
	}

	.contract_app {
		background-position-y: -60px;
	}

	.outsidework_app {
		background-position-y: -360px;
	}

	.sale_app {
		background-position-y: -520px;
	}

	.teamwork_app {
		background-position-y: -560px;
	}

	.dynamic_app {
		background-position-y: -320px;
	}

	.checkwork_app {
		background-position-y: -100px;
	}

	.qydisk_app {
		background-position-y: -180px;
	}

	.activity_app {
		background-position-y: -140px;
	}

	.diary_app {
		background-position-y: -40px;
	}

	.survey_app {
		background-position-y: -300px;
	}

	.topic_app {
		background-position-y: -280px;
	}

	.task_app {
		background-position-y: -220px;
	}

	.productinfo_app {
		background-position-y: -400px;
	}

	.express_app {
		background-position-y: -160px;
	}

	.learnonline_app {
		background-position-y: -380px;
	}

	.examination_app {
		background-position-y: -120px;
	}

	.hrmanagement_app {
		background-position-y: -460px;
	}

	.groupsend_app {
		background-position-y: -540px;
	}

	.addressBook_app {
		background-position-y: -420px;
	}

	.todo_app {
		background-position-y: -580px;
	}

	.disabled {
		color: #999;
	}

	.content_main {
		padding: 20px 20px 60px 30px;
	}

	.refresh_wrap {
		height: 40px;
		line-height: 40px;
		color: #999;
		text-align: center;
		border-top: 1px solid #ddd;
	}

	.refresh_btn:hover {
		color: #f87b00;
		cursor: pointer;
	}

	@keyframes vip {
		0% {
			width: 0;
			height: 0;
			overflow: hidden;
		}

		100% {
			width: 200px;
			height: 300%;
			overflow: hidden;
		}
	}

	.vipShow {
		display: block;
		animation: vip 0.15s linear;
	}

	.appShow {
		display: block;
		animation: vip 0.18s linear;
	}

	/*会员权益*/
	.vip-benefit-header {
		display: flex;
		align-items: center;
	}

	.vip-benefit-tip {
		display: flex;
		background: #f5f5f5;
		border-radius: 4px;
		padding: 6px 15px;
		margin-right: 15px;
		border: 1px solid #e5e5e5;
	}

	.vip-benefit-text {
		display: flex;
		align-items: center;
		font-size: 13px;
		color: #333;
	}

	.vip-benefit-text .tip {
		color: #F87B00;
	}

	.vip-benefit-btn {
		padding: 0px 8px;
		margin-left: 8px;
		border: 1px solid #f87b00;
		border-radius: 4px;
		font-size: 12px;
		color: #fff;
		cursor: pointer;
		background: #f87b00;
		line-height: 22px;
	}

	.tip-info-box {
		position: absolute;
		left: 0;
		width: 200px;
		background: #fff;
		box-shadow: 1px 1.732px 10px 0px rgba(4, 0, 0, 0.1);
		border: 1px solid rgb(221, 221, 221);
		z-index: 24;
		padding: 10px;
		border-radius: 4px;
		top: 60px;
	}

	.tip-info-content {
		font-size: 14px;
	}

	.tip-info-box:after {
		background: white;
		content: "";
		height: 10px;
		left: 25px;
		position: absolute;
		top: 0;
		width: 20px;
	}

	.tip-info-box:before {
		background: white;
		border: 1px solid #ccc;
		content: "";
		height: 10px;
		left: 30px;
		position: absolute;
		top: -5px;
		-webkit-transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		-o-transform: rotate(45deg);
		transform: rotate(45deg);
		width: 10px;
	}

	.dateNotify-tip {
		display: flex;
		color: #666;
		line-height: 22px;
	}

	.dateNotify-tip .vipName {
		display: inline-block;
		width: 112px;
		max-width: 112px;
		border: none;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.dateNotify-tip .last {
		color: #A6A6A6;
		margin-left: 10px;
	}

	.dateNotify-tip .last .time {
		color: #F87B00;
		padding: 0 3px;
	}

	.vip-permission-packages .item-text {
		display: flex;
		line-height: 21px;
	}

	.vip-permission-packages .vipName {
		display: inline-block;
		width: 90px;
		max-width: 90px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.vip-permission-packages .endTime {
		padding-left: 5px;
	}
</style>

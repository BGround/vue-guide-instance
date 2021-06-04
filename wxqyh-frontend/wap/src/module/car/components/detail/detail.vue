<template>
  <div class="wrap" v-windowscroll="scrollList" :class="{'qwui-flow_top':flowTip}">
    <!--无法流转提示-->
    <div class="qwui-flow_tip" v-show="flowTip">
      <p class="qwui-flow_word">{{flowTip}}</p>
    </div>
    <div class="car-wrapper" v-show="!showCarList&&!showDrivers">
      <div class="detail-title flexbox" ref="detailTitle">
        <div class="flex">
          <div class="title">
            <span class="text">{{title}}</span>
            <span
              v-if="!showEndIcon"
              class="applyStatus"
              :class="statusClass(isOver, status)">{{showStatus(isOver, status)}}
            </span>
          </div>
          <div class="time">
            <span>{{formatTime}}</span>
            <span class="name" @click.stop="showPersonDetail">{{personName}}</span>
            <span class="copy" v-if="isCreator" @click.stop="copy">复制</span>
          </div>
        </div>
        <div class="car-end_icon" v-if="showEndIcon">
          <i :class="carEndIcon"></i>
        </div>
      </div>
      <nav-tabs v-if="showTabs"
              :selectdata="tabs"
              @listenTabChange="listenNavTabsBack">
      </nav-tabs>
    </div>
    <div class="swiper-container" ref="content" v-show="!showCarList&&!showDrivers">
      <div class="swiper-wrapper">
        <!-- tab1 -->
        <div class="swiper-slide tab1" id="use-detail" @scroll="scrollList">
          <div class="use-detail" v-show="showUseDetail || swiper" >
            <div class="car-wrapper basic-fields">
              <basic-list
                :detail="detail"
                :basicFields="basicFields"
                :basicList="basicList"
                :canEditTime="showModiTimeBtn"
                :isCarManager="isCarManager"
                @openModifyTime="openTimeEdit = true"
                @showPassengerBtn="showCancelBtn = true"
                @openContacts="addPassenger">
              </basic-list>
            </div>
            <div class="car-wrapper custom-fields">
              <custom-fields :list="list" :readonly="true"></custom-fields>
            </div>

            <!-- 流程明细 -->
            <div class="flow-relative">
              <span v-if="this.isFree != 1" class="qwui-serial_entrance" @click="getFlowSerial">
                <i class="qwui-icon_serial"></i>
                流转明细
              </span>

              <!--当前处理人-->
              <user_selected_group
                  v-if="FlowAuditList.length"
                  v-for="(item,index) in FlowAuditList"
                  :key="index"
                  :title="startAuditTitle(item)"
                  :isEdit="false">
                  <user_selected_item
                    :title="startAuditTitle(item)"
                    :List="item.auditUserList"
                    :isEdit="false"
                    @showPersonList="showPersonList"
                    @atThisPersonUtil="atThisPersonUtil"
                    slot="user_selected_item">
                  </user_selected_item>
                </user_selected_group>

              <!--下一步处理人-->
              <user_selected_group
                v-if="FlowAuditListShow"
                title="下一步处理人" :isEdit="false">
                <user_selected_item
                  title="下一步处理人"
                  :List="FlowAuditList[0].nextAuditList"
                  :isEdit="false"
                  @showPersonList="showPersonList"
                  @atThisPersonUtil="atThisPersonUtil"
                  slot="user_selected_item">
                </user_selected_item>
              </user_selected_group>

              <!--自由流程审批人-->
              <user_selected_group
                v-if="freeAuditList.length"
                title="审批人(或签)"
                :isEdit="false">
                <user_selected_item
                  title="审批人(或签)"
                  :List="freeAuditList"
                  :isEdit="false"
                  @atThisPersonUtil="atThisPersonUtil"
                  @showPersonList="showPersonList"
                  slot="user_selected_item"></user_selected_item>
              </user_selected_group>

              <!--相关人-->
              <user_selected_group
                v-if="ccPersonList.length"
                title="相关人" :isEdit="false">
                <user_selected_item
                  title="相关人"
                  :List="ccPersonList"
                  :isEdit="false"
                  @showPersonList="showPersonList"
                  @atThisPersonUtil="atThisPersonUtil"
                  slot="user_selected_item">
                </user_selected_item>
              </user_selected_group>

              <!--评论列表-->
              <comment_list
                :commentList="commentList"
                :totalRow="listTotalRows"
                @onlyComment="onlySeeComment"
                @atThisPersonUtil="atThisPersonUtil"
                @delete="deleteThisComment">
              </comment_list>

              <!--加载更多-->
              <Load_more :loading="loading"
                        :type="'commentList'"
                        :hasMore="hasMore"
                        @loadMoreClick="loadMoreList">
                <span v-if="listTotalRows>0">— 已经到底了 —</span>
                <span v-if="!listTotalRows">还没有任何评论</span>
              </Load_more>
              <div v-show="!hasMore && listTotalRows && contentHeight" class="height-margin"></div>
              <div class="height-bottom" ></div>
            </div>
          </div>
        </div>
        <!-- tab2 -->
        <div class="swiper-slide " id="tab2" v-show="showTabs" :style="{height:this.contentHeight+'px',background:'#FFFFFF'}">
          <div class="car-detail "  ref="tab2">
            <div class="modSendCar" v-if="isCarManager && status == 3 && isStarted == '' && isOver != -1">
              <span class="title">修改派车信息</span>
              <div class="modify" @click="modifyCar">
                <span class="modify-icon"></span>
                <span class="text">修改</span>
              </div>
            </div>
            <div class="send-car">
              <span class="title">分派车辆</span>
              <input type="text" unselectable="on" onfocus="this.blur()"
                placeholder="请选择车辆"
                :readonly="true"
                :value="carDetail.carName"
                @click="selectCar">
              <i class="rightspan-icon" @click="selectCar" v-if="canEditCar"></i>
            </div>
            <div class="car-number">
              <span class="title">车牌号</span>
              <input type="text" unselectable="on" onfocus="this.blur()"
                placeholder="请填写车牌号"
                :readonly="true"
                v-model="carDetail.carNumber"
                @click="selectCar">
            </div>
            <div class="send-driver">
              <span class="title">分派司机</span>
              <input type="text"
                v-show ="canEditCar"
                placeholder="请选择司机，可手动填写"
                v-model="carDetail.driverName"
                @change="updateCarDetail(0)">
              <div class="readonlyText" v-show="!canEditCar">{{carDetail.driverName || '无'}}</div>
              <i class="add-icon" @click="selectDriver" v-show="canEditCar"></i>
            </div>
            <div class="driver-contact">
              <span class="title">司机联系方式</span>
              <input type="tel"
                v-show ="canEditCar"
                placeholder="请填写手机号码"
                :value="telFormat"
                @input="mobileChange($event)"
                @change="updateCarDetail(1)">
              <div class="readonlyText" v-show="!canEditCar">{{telFormat || '无'}}</div>
              <a v-show="carDetail.driverMobile" :href="'tel:'+carDetail.driverMobile"><i class="phone-icon" ></i></a>
            </div>
          </div>
        </div>

        <!-- zdq用车详情 tab3 -->
        <div class="swiper-slide" id="tab3" v-show="tabs.nav && navLen>=3 && showTabs" >
          <div class="use-car-detail-wrap" ref="tab3">
            <div class="use-car-detail" v-if="showRecordPosition" :style="!showMileInfo ? 'margin-bottom: 0' : ''">
              <div class="real-take-time">
                <span class="time-title">实际开始时间</span>
                <span class="real-time">{{realTakeTime || '无'}}</span>
              </div>
              <div class="real-take-time" v-show="isStarted=='2'">
                <span class="time-title">实际结束时间</span>
                <span class="real-time">{{ realBackTime || '无'}}</span>
              </div>
              <div class="start-address end-address">
                <i class="blue-marker" :class="isStarted=='2'?'beginLocation':''"></i>
                <span class="flex ellipsis">{{ realBeginLocation || '未获取到地址' }}</span>
                <i class="address-marker"  @click="showMap(realBeginLocation,true)"></i>
                <!-- bug -->
              </div>
              <div class="start-address" v-show="isStarted=='2'">
                <i class="blue-marker yellow-icon" :class="isStarted=='2'?'destinationLocation':''"></i>
                <span class="flex ellipsis">{{ realDestinationLocation || '未获取到地址' }}</span>
                <i class="address-marker"  @click="showMap(realDestinationLocation,false)"></i>
              </div>
            </div>
            <mile-info v-if="showMileInfo && (currentIndex === 2 || swiper)"
              @closeChangeMile="openMileEdit = false"
              @openChangeMile="openMileEdit = true">
            </mile-info>
          </div>
          <div class="fix-bc-tab3" ref="fixBc"></div>
        </div>
      </div>
    </div>

    <!-- 审批按钮 -->
    <approve-button
        :showCancelBtn.sync="showCancelBtn"
        :flowApproveDetail="flowApproveDetail"
        :isVip="isVip"
        @hideIcon="hideBottomBtn"
        @editPassenger="savePassenger"
        @requestNextBranchNode="requestNextBranchNode"
        @getFlowSerial="getFlowSerial"
        @showChatToolFun="showChatToolFun"
        @closeAsk="closeAsk"
        @openUseCar="openUseCar"
        @confirmInfo="carManagerSendcar"
        @endUse="showUseCarEnd = true"
        @updateFlowAuditUser="getFlowAuditNodeData"
        @approveActionStatus="payload => approveActionStatus = payload">
    </approve-button>
    <!--个人信息-->
    <user_info @showChatTool="chatButtonClick"></user_info>

    <!--流程明细-->
    <flow_serial v-if="flowSerial.isShowFlowSerial"
                 :flowSerialData="flowSerialData"
                 :isover="flowSerial.isover" >
    </flow_serial>

    <!--选择节点处理人 弹窗-->
    <flow-approve-dialog
      :agent="agent"
      :detail="flowApproveDetail"
      v-if="flowApproveDialogShow"
      @showPersonList="showPersonList"
      @saveNodeAuditUserJson="commitTask"
      :action="approveActionStatus">
    </flow-approve-dialog>

    <!--处理人范围选人-->
    <user_selected_ranglist
      :options="FlowAuditUser[appointUserIndex].startAuditList.flowUserList"
      :selectType="FlowAuditUser[appointUserIndex].startAuditList.selectType.type"
      :checkedType="FlowAuditUser[appointUserIndex].startAuditList.selectType.checkedType"
      :config="FlowAuditUser[appointUserIndex].startAuditList.selectType"
      :defaultAllSelect="FlowAuditUser[appointUserIndex].startAuditList.defaultAllSelect"
      :checked="FlowAuditUserIds(appointUserIndex)"
      @FlowAuditUserResult="FlowAuditUserResult"
      v-if="FlowAuditUserBoxShow">
    </user_selected_ranglist>

    <!--评论输入框组件-->
    <chatInput
      :show.sync="showChatTool"
      :autofocus.sync="autofocus"
      :dataBase="dataBase"
      :agent="agent"
      @updateContent="updateContent"
      @dealccPerson="backUserSelect"
      @closeChat="closeChatMask">
    </chatInput>

    <!--选择节点-->
    <qw_select_node @selectNodeClick="selectNodeClick"></qw_select_node>

    <!--预览图片组件-->
    <previewImages></previewImages>

    <!--人员列表组件-->
    <user_show
      :title="userselectTitle"
      :userSelect="userSelectList"
      :limitPreview="limitPreview"
      :show.sync="showPerson">
    </user_show>

    <!--公共选人组件-->
    <user_selected_Box v-if="selectConfig.show"
                      :selectconfig="selectConfig">
    </user_selected_Box>

    <!-- 更改用车时间 -->
    <change-time-range
      v-if="openTimeEdit && basicFields.takeTime"
      @closeEvent="closeEvent"
      :allowModifyStart="isCreator && detailData.config.allowUpdateTakeTime == 1 && isStarted == ''"
      :allowModifyEnd="isCreator && detailData.config.allowUpdateBackTime == 1"
      :takeTime="basicFields.takeTime"
      :backTime="basicFields.backTime"
      :id="askId">
    </change-time-range>

    <!-- 开始用车确认 -->
    <confirm-to-use
      v-if="showRecordPosition && openStart"
      @closeStart="closeStart"
      @startUse="startUse">
    </confirm-to-use>

    <!-- 修改里程数 -->
    <change-mile
      v-if="isStarted=='2' && currentIndex === 2 && detail && openMileEdit"
      @closeChangeMile="openMileEdit=false"
      @confirmEvent="confirmEvent">
    </change-mile>

    <!-- 关闭用车 -->
    <transition name="slide">
      <div class="pop-window" v-show="openReason">
        <div class="title">关闭用车确认</div>
        <text-area-field
          :field="windowField"
          :newPlaceholder="'请输入' + windowField.optionName"
          v-model="endReason"
          @change="getReason"
          :maxLength="100">
        </text-area-field>
        <button-group class="absolute_active">
          <qwui-button type="default" text="返回" @buttonClick="openReason=false"></qwui-button>
          <qwui-button type="primary" :text="primaryText" @buttonClick="confirmReason"></qwui-button>
        </button-group>
      </div>
    </transition>

    <!-- 结束用车 -->
    <use-car-end :isVip="isVip" v-if="showUseCarEnd" @close="showUseCarEnd = false" @seeMap="seeMap"></use-car-end>

    <!-- 车辆状态列表 -->
    <status
      v-if="showCarList"
      :isSendCar="true"
      :unPassList="unPassList"
      :showCarList="showCarList"
      @seeMap="seeMap"
      @closeStatus="showCarList=false">
    </status>

    <!-- 司机列表 -->
    <driver
      v-if="showDrivers"
      @closeDrivers="showDrivers=false"
      @seeMap="seeMap">
    </driver>

    <!--地图组件-->
    <map-search :openMap="openMap" @close="openMap=false" v-if="openMap"
    :mapStatus="mapStatus" :location="location" :isBegin="isBegin" :sendAddress="sendAddress"
    ></map-search>

    <!-- 分派车辆引导页 -->
    <div class="guide" v-show="showGuide">
      <div class="flexbox guide-content" ref="guideContent">
        <div class="flex">
          <div class="bg">
            <span></span>
          </div>
          <div class="text">分派车辆移到了这里</div>
          <div class="btn" @click="hideGuide">我知道了</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import {
    findBranchFlowNextNodeInfoFun,
    getDetailFlowAuditFun,
    getDepartmentInfoFun,
    getParallelFlowSerialFun
  } from '@/components/flow/getAuditFlow'
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
  import EventBus from '@/utils/eventBus';
  import {getDetail, hasAudited, getCustomField, getConfigInfo,
         commentListMore, addCommentList, deleteCommentList,
         commentList, updateAuditStatus, closeCarAskAfterAudited,
         sendCar, startUseCar, carDetail, addCountersignType, getGuidanceTypes,
         addGuidanceType, updatePassenger
         } from '../../api/getData'
  import {setErrorTips} from '../../js/validate'
  import {isVipGold} from '@/assets/js/vip-portal.js'
  import textAreaField from "../fields/textAreaField"
  import NavTabs from '@/components/button/menu_tab_two'
  import CustomFields from '../customFields/customFields'
  import comment_list from '@/components/list/comment_list'
  import Load_more from '@/components/list/load_more'
  import chatInput from '@/components/detail/chatInput'
  import user_info from '@/components/detail/user_info_card'
  import flow_serial from '@/components/flow/flow_serial'
  import audit_flow_api from '@/components/flow/api/getData.js'
  import user_selected_item from '@/components/base/userOrDeptSelect/user_selected'
  import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group'
  import user_selected_ranglist from '@/components/base/userOrDeptSelect/user_selected_ranglist'
  import user_selected_Box from '@/components/base/user_or_dept_select'
  import FlowApproveDialog from '@/components/flow/flowApproveDialog'
  import previewImages from "@/components/base/previewImages"
  import qw_select_node from '@/components/flow/selectNode'
  import user_show from '@/components/detail/user_show'
  import basicList from '../customFields/basicList'
  import ChangeTimeRange from '../base/ChangeTimeRange'
  import ConfirmToUse from '../base/ConfirmToUse'
  import mileInfo from '../base/mileInfo'
  import useCarEnd from '../useCarEnd/useCarEnd'
  import changeMile from '../useCarEnd/changeMile'
  import status from '../status/status'
  import driver from '../driver/driver'
  import qwuiButton from '@/components/base/button/button'
  import buttonGroup from '@/components/base/button/button_group'
  import approveButton from '../base/approveButton'
  import mapSearch from '../mapSearch/mapSearch'
  export default {
    name: 'detail',
    components: {
      buttonGroup,
      qwuiButton,
      textAreaField,
      NavTabs,
      CustomFields,
      comment_list,
      Load_more,
      user_info,
      flow_serial,
      user_selected_item,
      user_selected_group,
      user_selected_ranglist,
      FlowApproveDialog,
      user_selected_Box,
      chatInput,
      previewImages,
      qw_select_node,
      user_show,
      basicList,
      ChangeTimeRange,
      ConfirmToUse,
      mileInfo,
      approveButton,
      changeMile,
      useCarEnd,
      status,
      driver,
      mapSearch
    },
    data() {
      return {
        agent: dataBase.wxqyh_uploadfile.agent,
        windowField: {
          optionName: "结束原因",
          status: 1,
          itemId: 'endReason'
        },
        unPassList: false,
        editClick: false,
        openStart: false,
        startLocation: '',
        primaryText: '确认',
        openReason: false,
        endReason: '行程有变，暂时不需要用车。',
        reason: '',
        endIcon: '',
        openMileEdit: false,
        openTimeEdit: false,
        dataBase: dataBase,
        askId: '',
        title: '',
        createTime: '',
        personName: '',
        statusClassList: {
          '已关闭': 'gray',
          '退审': 'red',
          '已审批': 'green',
          '审批中': 'blue',
          '已结束': 'gray',
          '已派车': 'orange',
          '草稿': 'gray'
        },
        tabs: {
          index:0,
          nav:[{content: '用车申请'}, {content: '分派车辆'}]
        },
        basicList: [], //基础字段
        list: [], //自定义字段
        basicFields: { //基础字段数据
          subject: '', //用车理由
          takeTime: '', //用车时间
          backTime: '',  //结束时间
          beginLocation: '', //出发地点
          destinationLocation: '', //结束地点
          beginLongitude: '', //出发地点经度
          beginLatitude: '', //出发地点纬度
          destinationLongitude: '', //结束地点经度
          destinationLatitude: '', //结束地点纬度
          managerGroupId: '', //车辆管理组id
          managerGroupName: '' //车辆管理组name
        },
        configInfo: {},
        realTakeTime:'',//zdq
        realBackTime: '',
        realBeginLocation: '',
        realBeginLongitude: '',
        realBeginLatitude:'',
        realDestinationLatitude:'',
        realDestinationLocation: '',
        realDestinationLongitude: '',
        isCarManager: '', //是否是车管员
        isCarDriver: '', //是否是司机
        hasManager: '', //是否有车管员
        approveActionStatus: '',
        flowApproveDetail: {},
        freeAuditList: [],//自由流程审批人
        toPersonList: [], // 审批人/处理人
        flowSerial: { //流转明细
          isFirstRequest: true,
          isShowFlowSerial: false,
          list: [],
          isFreeFlow: '',
          isover:'',
          currentTime: ''
        },
        loading: false,
        hasMore: false,
        lock_roll: false,
        commentStatus: '1', //1为查看全部，2为只看评论
        listTotalRows: 0,
        commentList: [],                                                        //评论列表
        commentValue: '',                                                        //评论输入框的值
        showChatTool: false,                                                      //显示评论输入框
        autofocus: false,                                                      //审批单id
        deleteListIndex: '',                                                     //需要删除的index
        showPerson: false,                                                   //是否展开所有选中人员列表
        userselectTitle: '',
        userSelectList: [],
        limitPreview: false,
        allowUserCloseCar: 1, //允许提单人关闭用车
        allowManagerCloseCar: 1, //允许车管员关闭用车
        allowDriverCloseCar: 1, //允许司机关闭用车
        isStarted: '', //'':还没开始用车; '1':已经开始用车; '2':结束用车
        showCancelBtn: false,
        showCarList:false,
        showDrivers: false,
        showUseCarEnd: false,
        clientHeight:0,
        top: '',
        swiper: '',
        contentHeight: '',
        showMile: true,
        showFee: true,
        showRecordPosition: false, //金卡vip才能使用
        openMap: false,
        titleHeight: '',
        showGuide: false, //引导页显示
        isIphoneX: false,
        isBegin: undefined,
        sendAddress:'',
        screenHeight: '',
        isVip: false //是否是金卡
      }
    },
    mounted() {
      let _this  = this
      if(this.fromPath == 'map' && this.$route.query.carIdx){
        this.showCarList = true
      }
      this.askId = this.$route.query.askId
      this.tabs.index = this.currentIndex
      this.isVip = isVipGold(this.agent)
      this.$store.commit('resetFlowData')
      this.$store.commit('resetBasicData')
      this.updateUserSelectedState({type: "flowApproveDialogShow", data: false})
      this.initDetail()
      window.onresize = () => {
        this.screenHeight = document.body.clientHeight
      }
    },
    computed: {
      ...mapGetters([
        "FlowAuditUserIds",   // 已选择的处理人id
        "FlowAuditListShow",    // 下一步处理人是否显示
      ]),
      ...mapState({
        basicValue: state => state.fieldData.basicValue,
        _innerPassenger: state => state.fieldData._innerPassenger,
        _outerPassenger: state => state.fieldData._outerPassenger,
        detailData: state => state.detail.detailData, //详情页面数据
        carDetail: state => state.detail.carDetail, //车辆信息
        currentIndex: state => state.detail.currentIndex, //详情页导航索引
        FlowAudit: state => state.detail.FlowAudit,     // 流程信息
				isFree: state => state.flowUserSelected.isFree,          //流程类型,默认是自由流程'1'（固定为0，分支为3，全部应用需要统一）
        templateRefId: state => state.flowUserSelected.templateRefId,          //模板审批单id
        refId: state => state.flowUserSelected.refId,          // 审批单askId

        isBranchFlow: state => state.flowUserSelected.isBranchFlow,          //接口返回的流程数据
        isBranchNode: state => state.flowUserSelected.isBranchNode,          //接口返回的流程数据
        flowId: state => state.flowUserSelected.flowId, // 已选的流程id
        currentNodeId: state => state.flowUserSelected.currentNodeId, // 当前节点id
        nextNodeId: state => state.flowUserSelected.nextNodeId, // 下一节点id
        defaultNextNodeId: state => state.flowUserSelected.defaultNextNodeId, // 下一节点id
        parallelNextNodeIds: state => state.flowUserSelected.parallelNextNodeIds,  // 并行子节点id，逗号隔开

        FlowAuditUser: state => state.flowUserSelected.FlowAuditUser, // 处理人信息
        FlowAuditList: state => state.flowUserSelected.FlowAuditList, // 详情节点当前和下一步处理人信息
        selectConfig: state => state.flowUserSelected.selectConfig, // 选人基础配置
        ccPersonList: state => state.flowUserSelected.ccPersonList, // 相关人信息

        flowList: state => state.flowUserSelected.flowList, // 流程列表

        FlowAuditUserBoxShow: state => state.flowUserSelected.FlowAuditUserBoxShow, //流程勾选类型弹窗：指定人员、部门、部门负责人
        flowApproveDialogShow: state => state.flowUserSelected.flowApproveDialogShow, // 选择审批人弹窗
        appointUserIndex:state => state.flowUserSelected.appointUserIndex, // 用户当前选择的处理人（第几个节点）
        appointNodeAndUserVOList: state => state.flowUserSelected.appointNodeAndUserVOList,  // 当前节点指定处理人的节点信息
        approveVo: state => state.flowUserSelected.approveVo,  // 自由流程信息
        commitTaskParams: state => state.flowUserSelected.commitTaskParams, ////提交返回的流程字段
        mapStatus: state => state.mapStatus.mapStatus,
        location: state => state.mapStatus.location,
        fromPath: state => state.mapStatus.fromPath,
      }),
      // 流程流转信息
      flowSerialData() {
				return this.flowSerial;
      },
      telFormat() {
        let tel = this.carDetail.driverMobile
        if(tel == '') return ''
        if(this.carDetail.driverMobile && this.carDetail.driverMobile.length<=3 ){
          return tel
        }else if(this.carDetail.driverMobile && this.carDetail.driverMobile.length<=7 && this.carDetail.driverMobile.length>3){
          return tel.substring(0, 3) + ' ' + tel.substring(3, 7)
        }else{
          return tel.substring(0, 3) + ' ' + tel.substring(3, 7) + ' ' + tel.substring(7, 11);
        }

      },
      navLen(){
        return this.tabs.nav.length
      },
      //detail信息
      detail() {
        return this.detailData && this.detailData.detail
      },
      status() {
        return this.detail && this.detail.status
      },
      isOver() {
        return this.detail && this.detail.isover
      },
      showEndIcon() {
        return this.status == 4
      },
      showMileInfo() {
        return this.isStarted == '2' && (this.showMile || this.showFee)
      },
      // 无法流转的提示语
      flowTip(){
        if(this.detailData && this.detailData.createLeave){
          return '提单人不在通讯录中，流程无法流转';
        }
        if(this.FlowAudit && this.FlowAudit.auditLeave){
          return '下一节点处理人不在通讯录中，流程无法流转';
        }
        if(this.FlowAudit && this.FlowAudit.audtiFlag == '3'){
          return '下一节点未找到部门负责人，流程无法流转';
        }
        return false;
      },
      //格式化时间
      formatTime() {
        return this.createTime.slice(0, -3)
      },
      // 是提单人
      isCreator() {
        return this.detail && this.detail.creator === _.userId
      },
      // currentIndex===0
      showUseDetail() {
        return this.currentIndex === 0
      },
      // 已审批、已派车、已结束、currentIndex===1
      showCarDetail() {
        return this.showTabs && this.currentIndex === 1
      },
      // 已审批、已派车、已结束（看到单的人都可以看到）
      showTabs() {
        return this.status == 2 && this.isOver == 1 && this.isCarManager || this.status == 3 && this.isOver != -1 || this.status == 4
      },
      // 可以进行派车操作
      canEditCar() {
        return (this.status == 3 && this.isStarted == '' && this.isCarManager && this.editClick) ||
               (this.status == 2 && this.isOver == 1 && this.isCarManager)
      },
      //地图
      mapType(){
        if(this.status == '2'){
          return 'mapSearch'//审批结束点击可跳转
        }else if(this.status == '3'){
          return 'getLocation' //自动定位
        }else{
          return 'showMap' //查看地图
        }
      },
      //结束用车的人
      carEndIcon() {
        if((this.detail && this.detail.creator) === (this.detail && this.detail.closePerson)){ //用车人 > 司机 > 车管
          this.endIcon = "self-end"
        }else if(this.detail && this.detail.driverUserId === (this.detail && this.detail.closePerson)){
          this.endIcon = "driver-end"
        }else {
          this.endIcon = "manager-end"
        }
        return this.endIcon
      },
      //显示修改时间按钮
      showModiTimeBtn() {
        return this.isCreator && this.status == 3 && this.isOver != -1 && ((this.configInfo && this.configInfo.allowUpdateTakeTime == 1) || (this.configInfo && this.configInfo.allowUpdateBackTime == 1))
      }
    },
    methods: {
      ...mapActions([
        "getApprove",   // 自由流程获取转审人员
        "updateFlowUserSelected",     // 更新已选处理人
        "getNodeListInfo" //获取节点选择信息
      ]),
      ...mapMutations([
        "updateUserSelectConfirm",
        'updateCCPerson',//更新相关人
        'updateUserSelectedState'
      ]),
      initDetail() { //详细页数据初始化
        let _this = this
        _this.askId = this.$route.query.askId
        _.showLoading()
        let p1 = new Promise((resolve, reject) => {
          getCustomField().then(res => { //请求字段数据
            if(res.code == '0') {
              resolve(res.data)
              _this.basicList = res.data.basicList
            } else {
              _.hideLoading()
              _.alert("提示", res.desc)
            }
          })
        })
        let p2 = new Promise((resolve, reject) => {
          getConfigInfo().then(res => { //配置信息
            if(res.code == '0') {
              resolve(res.data)
              _this.configInfo = res.data.config
              _this.hasManager = res.data.hasManager == '1' ? true : false
              _this.allowUserCloseCar = res.data.config.allowUserCloseCar
              _this.allowManagerCloseCar = res.data.config.allowManagerCloseCar
              _this.allowDriverCloseCar = res.data.config.allowDriverCloseCar
              _this.showMile = res.data.config.showMile == 1 ? true : false
              _this.showFee = res.data.config.showFee == 1 ? true : false
              _this.showRecordPosition = _this.isVip && res.data.config.recordPosition == 1 ? true : false
            } else {
              _.hideLoading()
              _.alert("提示", res.desc)
            }
          })
        })
        let p3 = new Promise((resolve, reject) => {
          getDetail({askId: this.askId}).then(res => {
            if(res.code == '0') {
              resolve(res.data)
              let detail = res.data.detail
              //'':还没开始用车; '1':已经开始用车; '2':结束用车
              this.isStarted = detail.isStarted == '0' ? '' : detail.isStarted
              //初始化标题数据
              _this.title = detail.title
              _this.personName = detail.personName
              _this.createTime = detail.createTime
              _this.realTakeTime = detail.realTakeTime
              _this.realBackTime = detail.realBackTime
              _this.isCarManager = res.data.isCarManager == '1' ? true : false
              _this.isCarDriver = res.data.isCarDriver == '1' ? true : false
              _this.realBeginLocation = detail.realBeginLocation
              _this.realDestinationLocation = detail.realDestinationLocation
              //初始化基础字段
              _this.basicFields = {
                takeTime: detail.takeTime,
                backTime: detail.backTime,
                subject: detail.subject,
                managerGroupId: detail.managerGroupId,
                managerGroupName: detail.managerGroupName,
                beginLatitude: detail.beginLatitude,
                beginLocation: detail.beginLocation,
                beginLongitude: detail.beginLongitude,
                destinationLatitude: detail.destinationLatitude,
                destinationLocation: detail.destinationLocation,
                destinationLongitude: detail.destinationLongitude
              }
              _this.$store.commit('updateBasicValue', {
                innerPassenger: res.data.innerPassenger,
                outerPassenger: res.data.outerPassenger
              })
              // 更新处理人/审批人
              this.toPersonList = detail.toPersons
              //初始化tab栏(showRecordPosition=false时不显示)
              if(this.showRecordPosition && detail.isStarted == 1 ||
                detail.isStarted == 2 && (this.showRecordPosition || this.showMile || this.showFee)) {
                _this.tabs.nav.push({content: '用车详情' })
                setTimeout(()=>{
                  _this.top = _this.$el.offsetHeight
                  if(detail.status == 3) _this.top -= 8
                }, 0)
              }
              //更新派车信息
              _this.$store.commit('updateCarDetail', {
                carId: detail.carId,
                carName: detail.carName.split('-')[0],
                carNumber: detail.carName.split('-')[1],
                driverName: detail.driverName,
                driverMobile: detail.mobileno,
                driverId: detail.driverUserId
              })
            } else {
              _.hideLoading()
              _.alert("提示", res.desc)
            }
          })
        })
        let p4 = new Promise((resolve, reject) => {
          hasAudited({askId: _this.askId}).then(res => {
            if(res.code == '0') {
              resolve(res.data)
            } else {
              _.hideLoading()
              _.alert("提示", res.desc)
            }
          })
        })
        let p5 = new Promise((resolve, reject) => {
          getGuidanceTypes({userType:   2, appType: 0}).then(res => {
            if(res.code == '0') {
              resolve(res.data)
            } else {
              _.hideLoading()
              _.alert("提示", res.desc)
            }
          })
        })
        Promise.all([p1, p2, p3, p4, p5]).then((result) => {
          _.hideLoading()
          //更新流程类型
          let data = Object.assign({}, ...result)
          let isFree = data.detail.auditType == "0" || data.detail.auditType == "3" ? String(data.detail.auditType) : '1'
          _this.updateUserSelectedState({type: "isFree", data: isFree})
          _this.updateUserSelectedState({type: "refId", data: _this.askId})
          let isover = data.detail.isover == 2 && data.detail.status == 1 ? '' : data.detail.isover //审批组件里审批中的isover为''
          let status = (data.detail.status == 3 || data.detail.status == 4) ? '2' : data.detail.status //审批组件里已审批、已派车、已结束派车的status为'2'
          _this.flowApproveDetail = Object.assign({}, this.flowApproveDetail, {
            isover: isover,
            status: status,
            creator: data.detail.creator,
            isFree: isFree,
            approve: data.detail.auditType == '4' ? '1' : data.hasAudited, //不用审批的就直接为'1'
          })
          if(_this.$route.query.carIdx){
            _this.showCarList = true
            this.$store.commit('updateCurrentIndex', 1)
            this.tabs.index = this.currentIndex
          }
          //初始化自定义字段
          if(data.detail.hasItem == 1 && data.detail.itemList) {
            _this.list = data.list
            data.detail.itemList.forEach((item,index) => {
              let value = item.content == '' ? '未填写' : item.content
              this.$set(_this.list[index], 'value', value)
            })
          }
          //判断是否是并行，是就查询并行接口获取节点列表
          if (data.detail && data.detail.currentNodeId.indexOf(',') != -1){
            _this.$store.commit('updateListName', data)
            _this.getDetailNodeList(data)
          } else {
            //非并行流程
            _this.updateUserSelectedState({type: "currentNodeId", data: data.detail? data.detail.currentNodeId : ''})
            _this.showDetailPage(data)
          }
          if(data.detail.status == 2 && data.detail.isover == 1 && this.isCarManager && (_.isMobileApp() || _.isQiyeweixin())) {
            this.showGuide = !data.pageType.includes('2')
            if(this.showGuide) {
              let x = 0
              // 显示更新引导页
              if(document.documentElement.clientWidth > 408) x = -4
              else if(document.documentElement.clientWidth <= 320) x = 4
              this.titleHeight = this.$refs.detailTitle.clientHeight + x
              this.$refs.guideContent.style.top = this.titleHeight + 'px'
            }
          }
          //初始化滑动插件
          _this.isIPhoneX()
            if(_this.showTabs){
              document.body.style.overflow = 'hidden'
              setTimeout(()=>{
                var swiper = _this.swiper = new Swiper('.swiper-container',{
                  observer:true, //修改swiper自己或子元素时，自动初始化swiper
                  observeParents:true, //修改swiper的父元素时，自动初始化swiper
                  on:{
                    slideChange: function(){
                      _this.$store.commit('updateCurrentIndex',this.activeIndex)
                      _this.tabs.index = _this.currentIndex
                      if(_this.activeIndex>=1 ){
                        _this.$el.height = document.documentElement.clientHeight
                      }
                    }
                  }
                })
              },0)
              this.fixScreenHeight()
          }else{
            document.body.style.overflow = 'auto'
          }
        }).catch(err => {
          _.hideLoading()
        })
      },
      copy() {
        this.$router.push({path:'/add', query: {askId: this.askId, type: 'copy'}})
      },
      seeMap(address){
        if(_.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp()){
          this.openMap = true
          this.sendAddress = address
        }else{
          _.alert('提示', '您的终端暂不支持选择地址!')
        }
      },
      isIPhoneX(){
        var u = navigator.userAgent;
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isIOS) {
          if (screen.height == 812 && screen.width == 375){
            this.isIphoneX = true
            this.contentHeight = document.documentElement.clientHeight - this.$refs.detailTitle.offsetHeight - 139
          }else{
            this.contentHeight = document.documentElement.clientHeight - this.$refs.detailTitle.offsetHeight - 105
          }
        }else{
          this.contentHeight = document.documentElement.clientHeight - this.$refs.detailTitle.offsetHeight - 105
        }
      },
      isWeiXin(){
        //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
        var ua = window.navigator.userAgent.toLowerCase();
        //通过正则表达式匹配ua中是否含有MicroMessenger字符串
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
        }else{
        return false;
        }
      },
      fixScreenHeight() {
        let _this = this
        if(this.showTabs){
          setTimeout(()=>{
            if(_this.$refs.tab3 && _this.$refs.tab3.offsetHeight){
              var tabHeight
              if(_this.isIphoneX){
                tabHeight = document.documentElement.clientHeight-_this.$refs.detailTitle.offsetHeight- 52 - _this.$refs.tab3.offsetHeight -86
              }else{
                tabHeight = document.documentElement.clientHeight-_this.$refs.detailTitle.offsetHeight -52 - _this.$refs.tab3.offsetHeight -53
              }
              $('.fix-bc-tab3').css({'height':tabHeight + 'px','background': '#FFFFFF'})
            }
            _this.swiper.slideTo(_this.currentIndex,500,false)
          },10)
          $('.swiper-slide').css({'height':_this.contentHeight + 'px','overflow': 'auto',})
          $('.tab1').css({'height':_this.contentHeight+50 + 'px','overflow': 'auto',})
        }
      },
      openUseCar(){
        if(this.showRecordPosition) {
          this.openStart = true
        } else {
          let _this = this
          startUseCar({askId: this.askId}, res => {
            _.tooltips_succeed('操作成功')
            setTimeout(function() {
              _this.$router.push({path: '/travel'})
            }, 1000)
          })
        }
      },
      closeStart() {
        this.openStart = false
      },
      //type=0为更新司机名字，type=1为更新司机号码
      updateCarDetail(type){
        switch (type) {
          case 0:
            this.$store.commit('updateCarDetail', {driverName: this.carDetail.driverName, driverId: ''})
            break
          case 1:
            this.$store.commit('updateCarDetail', {driverMobile: this.carDetail.driverMobile, driverId: ''})
            break
        }
      },
      mobileChange(e) {
        let value = e.target.value.replace(/[^\d]/g, '').slice(0, 11)
        this.$store.commit('updateCarDetail', {driverMobile: value})
      },
      getReason(val){
        this[val.key] = val.value;
      },
      //结束原因(关闭申请单)
      confirmReason(){
        let _this = this
        closeCarAskAfterAudited({
          askId: this.askId,
          isOver: '-1',
          reason:this.endReason,
        },res => {
          _.tooltips_succeed('操作成功')
          setTimeout(function() {
            _this.$router.push({path: '/travel'})
          }, 1000) //设下延时
        })
      },
      showMap(address,isBegin){
        if(_.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp()){
          if(address&&address.length>0){
            if(this.status >= 3){//开始或结束后可查看地图
              this.$store.commit('updateMapStatus', 'showMap')
              this.openMap = true
              this.isBegin = isBegin
              this.sendAddress = address
            }
          }else _.alert('提示', '无法获取该详情地址')
        }else{
          _.alert('提示', '您的终端暂不支持选择地址!')
        }

      },
			//开始用车
			startUse(data){
        this.openStart = true
        let _this = this
        let postData = data ? Object.assign({}, data, {
          askId: this.askId
          }) : {
            askId: this.askId,
            realTakeTime: this.realTakeTime,
            realBeginLocation: this.realBeginLocation,
            realBeginLongitude: this.realBeginLongitude,
            realBeginLatitude: this.destinationLatitude
            }
        startUseCar(postData, res => {
          _.tooltips_succeed('操作成功')
          setTimeout(function() {
            _this.$router.push({path: '/travel'})
          }, 1000)
        })
			},
			//关闭用车
			closeAsk(){
        this.openReason = true;
      },
      // 隐藏底部按钮
      hideBottomBtn() {
        this.$store.commit('updateBasicValue', {
          innerPassenger: this._innerPassenger,
          outerPassenger: this._outerPassenger
        })
        this.editClick = false
        this.$nextTick(() => {
          this.$store.commit('updateCanEdit', false)
        })
      },
      // 保存修改乘车人
      savePassenger() {
        // 检验是否必填提示
        if(this.basicList[7].status !=0 && this.basicList[7].isMust !=0 && (this.basicValue.innerPassenger == undefined || this.basicValue.innerPassenger.length == 0) &&
          this.basicList[7].status !=0 && this.basicList[7].isMust !=0 && (this.basicValue.outerPassenger == undefined || this.basicValue.outerPassenger.length == 0)) {
          setErrorTips(this.basicList[7].id, this.basicList[7].optionName)
          return
        }
        let _this = this
        let innerPassenger = [] //内部乘车人
        let outerPassenger = [] // 外部乘车人
        // 处理乘车人数据
        if(this.basicValue.innerPassenger && this.basicValue.innerPassenger.length > 0) {
          innerPassenger = this.basicValue.innerPassenger.map(item => {
            return item.userId
          })
        }
        outerPassenger = this.basicValue.outerPassenger || []
        updatePassenger({
          askId: this.askId,
          innerPassenger: innerPassenger.join('|'),
          outerPassenger: outerPassenger.join('|')
        }, res => {
          _.showLoading()
          getDetail({askId: _this.askId}).then(res => {
            _.hideLoading()
            if(res.code==='0'){
              _.tooltips_succeed('保存成功')
              _this.editClick = false
              _this.showCancelBtn = false
              _this.commentList.length = 0
              _this.dealCommentList({comments: res.data.comments, tbTaskinfo: res.data.detail.commentCount, hasMore: res.data.hasMore})
              _this.$store.commit('updateDetailData', {detail: res.data.detail})
            }else {
              _.alert('提示',res.desc)
            }
          })
        })
      },
      // 校验参数
      noHas(){
        let carParams = []
        for(let key in this.carDetail) {
          if(!this.carDetail[key] && key.indexOf('driver')<0 ) carParams.push(key)
        }
        return carParams
      },
			//车管员派车
      carManagerSendcar(){
        let _this = this
        let isTrue = this.noHas()
        let type = '1'
        if(this.status == 3 && this.isCarManager) type ='2'
        if((!isTrue.length && !isTrue[0])){
          let sendCarData = {
            askId: this.askId,
            carId: this.carDetail.carId,
            carName: this.carDetail.carName,
            driverName: this.carDetail.driverName,
            driverMobile: this.carDetail.driverMobile,
            driverId: this.carDetail.driverId,
            type
          }
          sendCar(sendCarData, res => {
            _.tooltips_succeed('操作成功')
            setTimeout(function() {
              _this.$router.push({path: '/audit'})
            }, 1000) //设下延时
          })
        }else{
          if(isTrue[0].indexOf('car')>=0){
            _.tooltips_succeed('请选择车辆', true, '', 1500)
          }
        }
      },
      // 查询并行的节点选择接口
      getDetailNodeList (data) {
        let _this = this
        this.getNodeListInfo({'refId': _this.askId,'callback': function (result){
          if (result && result.length>0){
            _this.updateUserSelectedState({type: "currentNodeId", data: result[0].nodeId})
          } else {
            _this.updateUserSelectedState({type: "currentNodeId", data: data.detail? data.detail.currentNodeId :''})
          }
          _this.showDetailPage(data)
        }})
      },
      //并行流程选择节点后进行处理
      selectNodeClick (item,data){
        //更新当前节点
        this.updateUserSelectedState({type: "currentNodeId", data: item.nodeId})
        this.showDetailPage(data)
      },
      showDetailPage (data){
        this.$store.commit('updateDetailData',data)
        //评论列表处理
        this.hasMore = data.hasMore;
        this.showCommentList(data.comments, data.hasMore ,data.detail.commentCount);

        if (this.isFree != "1") {      // 非自由流程
          this.getFlowAuditNodeData();
        }else {
          this.getApprove(this.askId);   // 自由流程获取转审人员
        }
        //更新明细数据
        this.flowSerial.isover = data.detail.isover;
        this.flowSerial.isFreeFlow = this.isFree;
        // 已关闭、已审批、已派车、已结束、被退审、自由流程：显示所有审批人
        if(data.detail.isover == '-1' || data.detail.status == '2' ||
          data.detail.status == '3' || data.detail.status == '4'||
          data.detail.isover == '0' || this.isFree == 1 ) {
          this.freeAuditList.length = 0
          this.freeAuditList=[...data.detail.toPersons]
        }
        //更新相关人
        this.updateCCPerson(data.detail.ccPersons)
      },
      chatButtonClick(data){
        this.showChatTool = true;
        this.autofocus = true
      },
      // 评论中的@事件
      backUserSelect(obj) {
        let toPerson = this.toPersonList // 审批人
        let toPersonIdStr = ''
        toPerson.forEach((item) => {
          toPersonIdStr += item.userId
        })
        let ccPersonsIds = this.ccPersonList.map(value => {
          return value.userId
        })
        ccPersonsIds = ccPersonsIds.join('|')
        for(let i=obj.data.length-1; i>=0; i--) {
          if(toPersonIdStr.indexOf(obj.data[i].userId) > -1 || ccPersonsIds.indexOf(obj.data[i].userId) > -1) {  // @人后把人添加为相关人, 当@的人是审批人的话, 不加到相关人
            obj.data.splice(i, 1)
          }
        }
        this.$store.commit('updateCCPerson', this.ccPersonList.concat(obj.data))  // 更新相关人
      },
      getFlowAuditNodeData: function () { //当前节点的详细信息
        let _this = this
        // 已关闭、已审批、已派车、已结束、被退审,不需要请求/portal/flow/flowParallel/ajaxGetFlowAudit.do
        if(this.isOver == '-1' || this.status == '2' || this.status == '3'|| this.status == '4'
          || this.isOver == '0') {
          return
        }
        let Param = {
          refId: this.askId,
          definitionId: this.agent + this.detail.orgId,
          isBranch: this.isFree== '3' ? true : false,
          nodeId: this.currentNodeId,
          status: this.status
        }
        getDetailFlowAuditFun(Param ,(result) => {
          _this.$store.commit('updateSearchFlowListData', result);
          _this.$store.commit('updateFlowAuditList', result.nodeInfo);
        })
      },
      //点击查看流程明细
      getFlowSerial: function () {
        let Param = {
          refId: this.askId,
          isFree: this.isFree == '0' ? 2 : this.isFree //固定流程转为2
        }
        getParallelFlowSerialFun(Param, (result) => {
          if(result.auditSerial && result.auditSerial.length){
            this.flowSerial.list = result.auditSerial;
            this.flowSerial.currentTime = result.currentTime;
            this.flowSerial.isShowFlowSerial = true;
            this.flowSerial.isFirstRequest = false;
          }
        })
      },
      requestNextBranchNode(){
        let orgId = this.detail.orgId.replace(/-/g,"")
        let params = {
          initRefId: this.askId || '',
          templateRefId: this.agent + orgId,
          currentNodeId: (this.isBranchNode && this.defaultNextNodeId)? this.defaultNextNodeId:this.currentNodeId,
        }
        //最后接口数据回调
        findBranchFlowNextNodeInfoFun(params,(result) => {
          this.$store.commit('updateFlowAuditUserData', result)
          this.updateUserSelectedState({type: "flowApproveDialogShow", data: true})
          //更新下拉选择节点名称
          this.$store.commit('updateChooseNodeName')
        })
      },
      //选择处理人后点击确定回调
      FlowAuditUserResult(payload){
        this.$store.commit('checkFlowAuditUserType',payload)
        // 如果是多部门，则请求部门负责人
        this.updateFlowUserSelected(payload)
      },
      // 处理人标题
      startAuditTitle(item) {
        if(this.FlowAuditList.length===1) {
          return  '当前处理人'
        }
        return item.vo ? item.vo.nodeName+' 处理人' : item.nodeName+' 处理人'
      },
      atThisPersonUtil(user){      // 查看个人头像信息
        if(user) {
          EventBus.$emit("atThisPersonUtil", user);
        }
      },
      //显示评论弹窗
      showChatToolFun(payload){
        this.showChatTool = payload.showChatTool
        this.autofocus = payload.autofocus
      },
      // 保存提交数据
      commitTask(data) {
        let _this = this
        // 加签
        if(this.approveActionStatus == 'assignApprove') {
          let assignData = {
            askId: this.askId,
            type: data.type,
            reason: data.reason,
            addCountersignPersons: data.addCounterSignPersonStr
          }
          addCountersignType(assignData, function() {
            _this.$router.push({path: 'travel'})
          })
        } else {
          let approveData = {
            askId: this.askId,
            flowDpId: this.commitTaskParams.flowDpId,
            currentNodeId: this.currentNodeId,
            nextNodeId: data.nextNodeId,
            reason: data.reason,
            flowChioseNodeAuditUserJson: this.commitTaskParams.flowChioseNodeAuditUserJson,
            choiseFlowUser: data.chooseFlowUser,
            signImg: data.signImg,
            status: data.status
          }
          _.showLoading()
          updateAuditStatus(approveData, function() {
            setTimeout(function() {
              _this.$router.push({path: '/travel'})
            }, 1000) //设下延时
          })
        }
      },
      showPersonList(title,list,type){
        this.userselectTitle = title;
        this.userSelectList = list;
        this.showPerson = true;
        if(type){
          this.limitPreview = true
        }else{
          this.limitPreview = false
        }
      },
      scrollList(){ // 滚动更多列表
        if(!this.showTabs){
          var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
          if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
            if(!this.lock_roll && this.hasMore){
              this.lock_roll=true;
              this.loadMoreList();
            }
          }
        }else if( $('#use-detail') && $('#use-detail')[0] ){
          var scrollTop = $('#use-detail').scrollTop()
          if( scrollTop + this.contentHeight >= $('#use-detail')[0].scrollHeight - 50 ){
            if(!this.lock_roll && this.hasMore ){
              this.lock_roll = true
              this.loadMoreList()
            }
          }
        }
      },
      onlySeeComment(type){
        let _this = this
        _this.commentList.length=0
        _this.commentStatus=type ? "2" : "1";
        if(!_this.loading){
          _this.loading = true
          commentList({askId: _this.askId}).then(res => {
            _.hideLoading()
            if(res.code == '0') {
              _this.dealCommentList(res.data)
            }
          })
        }
      },
      loadMoreList(){ // 加载更多列表
        var data={
          lastCommentId: this.commentList.length ? this.commentList[this.commentList.length - 1].commentId : ''
        };
        this.loading = true;
        commentListMore(data, this.dealCommentList);
      },
      dealCommentList(data){
        this.loading=false;
        let commentCount = data.tbTaskinfo? data.tbTaskinfo.commentCount : null
        let comments = []
        if(this.commentStatus == '1') {
          comments = data.comments
        } else {
          if(data.comments && data.comments.length) {
            data.comments.forEach((item, index) => {
              if(item.status != '2') {
                comments.push(item)
              }
            })
            commentCount = null
          }
        }
        this.showCommentList(comments,data.hasMore,commentCount);
      },
      showCommentList(data,hasMore,commentCount){        // 处理返回的评论
        this.hasMore=hasMore;
        this.lock_roll=false;
        if(data && data.length>0){
          this.commentList.push(...data);
          this.listTotalRows=commentCount? commentCount : Number(this.commentList.length);
        }else{
          this.commentList.length=0;
          this.listTotalRows=0;
        }
      },
      closeChatMask(val){
        this.commentValue = val
      },
      updateContent(data){      // 发送评论
        if(data){
          let msg={
          "tbQyCarCommentPO.content": data.content,
          "tbQyCarCommentPO.askId": this.askId,
          "tbQyCarCommentPO.status": 0, //普通评论status为0
          "tbQyCarCommentPO.creator": _.userId,
          "commentId": this.detailData.comments && this.detailData.comments.length > 0 ? this.detailData.comments[0].commentId : '',
          'userIds':  data.userIds,  // 被@人的id
          'isApproves': data.isApproves,
          'signImg': data.signImg
          };
          let _this=this;
          _.showLoading()
          addCommentList(msg, function () {
            commentList({askId: _this.askId}).then(res => {
              _.hideLoading()
              _.tooltips_succeed("评论成功")
              if(res.code == '0') {
                _this.commentList.splice(0,0,{
                  commentId:res.data.comments[0].commentId,
                  headPic:_.headPic,
                  personName:_.personName,
                  creator:_.userId,
                  content:res.data.comments[0].content,
                  time:"刚刚",
                  status:res.data.comments[0].status,
                });
                _this.listTotalRows++;
              }
            })
          });
        }
      },
      deleteThisComment(data,index){       // 删除评论
        if(data){
          this.deleteListIndex=index;
          var _this=this;
          deleteCommentList({commentId:data.commentId},function (result) {  // 删除成功
            _this.commentList.splice(_this.deleteListIndex,1);
            _this.listTotalRows--;
          });
        }
      },
      showStatus(isover, status) { // 车辆显示状态
        if(isover == '-1') {
          return '已关闭'
        }
        else if(isover == '0' && status == '0'){
          return '退审'
        }
        else if(status == '0' && isover == '2'){
          return '草稿'
        }
        else if(status == '1' && isover == '2'){
          return '审批中'
        }
        else if(status == '2' && isover == '1'){
          return '已审批'
        }
        else if(status == '3'){
          return '已派车'
        }
        else if(status == '4'){
          return '已结束'
        }
        else return ''
      },
      statusClass(isover, status) {
        let classStatus = this.showStatus(isover, status)
        if(classStatus == '') {
          return 'none'
        }
        return this.statusClassList[classStatus]
      },
      calDateTime(datetime, type) {  //计算时间和日期
        let date = datetime.split(' ')[0]
        let time = datetime.split(' ')[1]
        if(type == 0) {
          return date
        } else return time
      },
      listenNavTabsBack(item, index) {
        this.$store.commit('updateCurrentIndex', index)
        this.swiper.slideTo(index,500,true)
      },
      showPersonDetail() {
        let data = {
					userId: this.detail.creator,
					personName:this.detail.personName,
					headPic:this.detail.headPic,
				};
				if(data.userId){
					this.atThisPersonUtil(data);
				}
      },
      modifyCar() {
        this.editClick = true
        this.showCancelBtn = true
      },
      selectCar() {
        if(!this.canEditCar) return
        this.showCarList = true,
        this.unPassList = true,
        this.$store.commit('updateCurrentIndex', 1)
        this.tabs.index = this.currentIndex
        this.top = 0
      },
      selectDriver() {
        if(!this.canEditCar) return
        this.showDrivers = true
        this.top = 0
      },
      closeEvent(data) { //data: 修改成功后的时间
        let _this = this
        this.openTimeEdit = false
        if(data) {
          //更新时间
          this.basicFields.takeTime = data.takeTime.slice(0, -3) || this.basicFields.takeTime
          this.basicFields.backTime = data.delayTime.slice(0, -3) || this.basicFields.backTime
          //更新评论
          _.showLoading()
          //更新详情信息
          getDetail({askId: this.askId}).then(res => {
            _.hideLoading()
            if(res.code=='0'){
              this.commentList.length = 0
              this.dealCommentList({comments: res.data.comments, tbTaskinfo: res.data.detail.commentCount, hasMore: res.data.hasMore})
              this.$store.commit('updateDetailData',{detail: res.data.detail})
            }else{
              _.alert(res.desc)
            }
          })
        }
      },
      confirmEvent(data){//data发送的参数
        let _this = this;
        this.openMileEdit = false;
        if(data){
          _.showLoading()
          //更新详情信息
          getDetail({askId: this.askId}).then(res => {
            _.hideLoading()
            if(res.code=='0'){
              this.commentList.length = 0
              this.dealCommentList({comments: res.data.comments, tbTaskinfo: res.data.detail.commentCount, hasMore: res.data.hasMore})
              this.$store.commit('updateDetailData',{detail: res.data.detail})
            }else{
              _.alert(res.desc)
            }
          })
        }
      },
      // 增加乘车人
      addPassenger() {
        this.updateUserSelectConfirm({data: (this.basicValue.innerPassenger || []),
          callBack: (result) => {
            this.$store.commit('updateBasicValue', {innerPassenger: result.user.data})
          }
        });
      },
      hideGuide() {
        this.showGuide = false
        if(this.isCarManager && this.status == 2 && this.isOver == 1) {
          addGuidanceType({userType: 2, appType: 0, pageType: 2})
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      if(to.name === 'travel' || to.name === 'audit' || to.name === 'relate') {
        this.$store.commit('resetDetailData')
        this.$store.commit('resetCarDetail')
        this.$store.commit('resetCurrentIndex')
      }
      next()
    },
    watch:{
      openMap(val){
        if(val===true){
          document.body.style.overflow = 'auto'
        } else if(this.showTabs) {
          document.body.style.overflow = 'hidden'
        }
      },
      screenHeight(val){
        this.isIPhoneX()
        this.fixScreenHeight()
      }
    }
  }
</script>

<style scoped>
  body{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  html{
    height: 100%;
    overflow: hidden;
  }
  .height-margin{
    height: 10px;
  }
  .height-bottom{
    height: 50px;
  }
  .car-wrapper {
    position: relative;
    padding:0 15px;
    background-color: #fff;
    margin-bottom: 8px;
  }
  .detail-title {
    padding: 17px 0 14px 0;
    border-bottom: 1px solid #F7F8FA;
  }
  .detail-title .title {
    font-size: 16px;
    color: #1B233A;
    line-height: 22px;
    margin-bottom: 6px;
    word-break: break-all;
  }
  .detail-title .time {
    font-size: 15px;
    color: #B2B9C8;
    line-height: 21px;
  }
  .detail-title .time .name {
    cursor: pointer;
  }
  .detail-title .time .copy {
    color: #6278A6;
    margin-left: 4px;
    cursor: pointer;
  }
  .detail-title .applyStatus {
    display: inline-block;
    line-height: 1em;
    padding: 2px  3px;
    border-radius: 2px;
    font-size: 12px;
    text-align: center;
    margin-left: 8px;
    word-break: keep-all;
    vertical-align: text-bottom;
    margin-bottom: 1px;
  }
  /* tab样式 */
  .car-wrapper >>> .vux-tab .vux-tab-item {
    background: 0;
  }
  .car-wrapper >>> .vux-tab .vux-tab-item.vux-tab-selected {
    color: #5585F0;
  }
  .car-wrapper >>> .vux-tab-bar-inner {
    width: 28px !important;
    background: #6E9BFF;
    height: 1px;
    border: 1px solid #6E9BFF;
    border-radius: 1.5px;
    margin-top: -1.5px;
  }
  .use-detail .basic-fields {
    padding: 0;
  }
  .use-detail .flow-relative {
    width: 100%;
    position: relative;
  }
  .car-detail {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    padding:0 15px;
    background-color: #fff;
  }
  .car-detail > div {
    display: flex;
    width: 100%;
    padding: 12px 0;
  }
  .car-detail input, .car-detail .readonlyText {
    flex: 1;
    width: 100%;
    height: 21px;
    line-height: 21px;
    font-size:15px;
    color: #0A1735;
    background: #fff;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .car-detail .title {
    height: 21px;
    line-height: 21px;
    font-size:15px;
    color: #7A7C80;
    margin-right: 20px;
  }
  .modSendCar {
    position: relative;
    padding:  16px 14px 10px 0;
    border-bottom: 1px solid #F7F8FA;
  }
  .modSendCar .title {
    height: 22px;
    line-height: 22px;
    font-size: 16px;
    color: #1B233A;
  }
  .modSendCar .modify {
    position: absolute;
    top: 12px;
    right: 0;
    cursor: pointer;
  }
  .modSendCar .modify-icon {
    display: inline-block;
    vertical-align: middle;
    width: 12px;
    height: 16px;
    background:url(~assets/images/car/modify-icon.png) no-repeat center;
    background-size: 12px 12px;
    margin-bottom: 2px;
  }
  .modSendCar .text {
    height: 17px;
    line-height: 17px;
    font-size: 12px;
    color: #467DB9;
    vertical-align: middle;
    margin-left: 4px;
  }
  .send-car .rightspan-icon {
    float: right;
    margin: 2px 0 0 4px;
    width: 16px;
    height: 16px;
    background:url(~assets/images/car/icon-a-public_arrow-right.png) no-repeat center;
    background-size: 16px 16px;
    cursor: pointer;
  }
  .send-driver .add-icon {
    float: right;
    width: 20px;
    height: 20px;
    margin: 0 -8px 0 12px;
    padding-left: 12px;
    border-left: 1px solid #F7F7F7;
    background:url(~assets/images/car/icon_add.png) no-repeat center;
    background-size: 32px auto;
    cursor: pointer;
  }
  .driver-contact input{
    vertical-align: middle;
  }
  .driver-contact a{
    float: right;
    margin-left: 12px;
    border-left: 1px solid #F7F7F7;
  }
  .phone-icon{
    display: inline-block;
    width: 24px;
    height: 24px;
    vertical-align: middle;
    margin-left:0;
    margin-right: 0;
    margin: 0 -4px 0 4px;
    background: url(~assets/images/car/icon_tel.png) no-repeat;
    background-size: 24px 24px;
  }
  .car-status {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    overflow: scroll;
    z-index: 10;
    background: #fff;
  }
  /* 用车详情 zdq*/
  .use-car-detail{
    background-color: #FFFFFF;
    padding: 0 14px;
    margin-bottom: 8px;
    overflow-x: hidden;
  }
  .use-car-detail > div{
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 13px 0 12px;
  }
  .use-car-detail > div > span{
    display: inline-block;
    height: 21px;
    font-size: 15px;
    line-height: 21px;
    color: #0A1735;
  }
  .real-take-time{
    display: flex;
  }
  .real-time{
    flex: 1;
    text-align: right;
  }
  .use-car-detail > div > .time-title{
    color: #7A7C80;
    margin-right: 15px;
  }
  .start-address{
    position: relative;
  }
  .address-marker{
    display: inline-block;
    width: 24px;
    height: 24px;
    background: url(~assets/images/car/icon_a-newtask-list_place.png) no-repeat center;
    background-size: 24px 24px;
    cursor: pointer;
  }
  .blue-marker{
    position: relative;
    display: inline-block;
    margin-top: 6px;
    left: 0;
    width: 10px;
    height: 10px;
    margin-right: 7px;
    background:url(~assets/images/car/icon_begin.png) no-repeat;
    background-size: 10px 10px;
  }
  .yellow-icon{
    background: url(~assets/images/car/icon_end.png) no-repeat;
    background-size: 10px 10px;
  }
  .mile-list{
    margin-top: 8px;
  }
  .car-end_icon{
    width: 56px;
    height: 52px;
    background: #FFFFFF;
    margin-left: 14px;
  }
  .car-end_icon i{
    display: inline-block;
    width: 56px;
    height: 52px;
    background-size: 56px 52px;
  }
  .self-end{
    background: url(~assets/images/car/icon_over_00.png) no-repeat;
  }
  .driver-end{
    background: url(~assets/images/car/icon_over_01.png) no-repeat;
  }
  .manager-end{
    background: url(~assets/images/car/icon_over_02.png) no-repeat;
  }
  .pop-window, .guide{
    position: fixed;
    box-sizing: border-box;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    z-index: 9;
  }
  .pop-window .title {
    height: 54px;
    font-size: 16px;
    color: #1b233a;
    line-height: 54px;
    margin-left: 14px;
    border-bottom: 1px solid #f4f6f8;
  }
  .pop-window .field-content {
    box-sizing: border-box;
    width: 100%;
    padding: 14px;
    z-index: 10;
  }
  .swiper-slide {
    width: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .tab3 {
    width: 100%;
  }
  .beginLocation::before,.destinationLocation::before{
    content: '';
    position: absolute;
    width: 0;
    height: 19px;
    border-left: 1px dotted #E3E4E8;
    left: 4.5px;
  }
  .beginLocation::before{
    top: 10px;
  }
  .destinationLocation::before{
    top: -20px;
  }
  .wrap .guide {
    background: rgba(0, 0, 0, .6)
  }
  .guide .guide-content {
    position: absolute;
    right: 0;
    top: 72px;
    width: 50%;
    font-size: 14px;
    font-family: 'MicrosoftYaHei';
    color: #fff;
    text-align: center;
  }
  .guide-content .bg {
    width: 204px;
    margin: 0 auto;
  }
  .guide-content .bg span {
    display: inline-block;
    box-sizing: border-box;
    width: 100%;
    height: 0;
    padding-bottom: 57%;
    background: url(~assets/images/car/car_guide.png) no-repeat;
    background-size: 100% auto;
    margin: 0 auto;
  }
  .guide-content .text {
    height: 19px;
    line-height: 19px;
    margin: 13px 0 20px;
  }
  .guide-content .btn {
    width: 56px;
    height: 19px;
    line-height: 19px;
    border-radius: 4px;
    border: 1px solid #fff;
    padding: 11px 22px;
    margin: 0 auto;
  }
  @media screen and (min-width: 1024px) {
    .pop-window, .guide {
      width: 740px;
      margin: 0 auto;
    }
  }
  @media (max-width: 408px) {
    .guide-content .bg {
      width: 100% !important;
    }
  }
   /*input.placeholder颜色*/
  ::-webkit-input-placeholder { /* WebKit browsers */
    color: #D2D5DB;
  }
  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #D2D5DB;
  }
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #D2D5DB;
  }
  :-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #D2D5DB;
  }
  .wrap >>> .qwui-btn_box.absolute_active {
    position: absolute;
    background: #fff;

  }
  .wrap >>> .qwui-btn_box.absolute_active::before{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    -ms-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
    -ms-transform-origin: 0 0;
    transform-origin: 0 0;
    box-sizing: border-box;
  }
</style>

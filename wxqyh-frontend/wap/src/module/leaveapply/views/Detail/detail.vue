<template>
  <div class="wrap" ref="wrap" v-windowscroll="scrollList">
    <!--详情标题头部-->
    <detail-title
      v-if="detailTitleData"
      :titledata="detailTitleData"
      :printTag="canPrint"
      @showThisPersonUtil="atThisPersonUtil"
      @handlePrint="printDetail"
      @clickEditOrCopy = "goPage">
      <describe
        slot="describes"
        :List = "detailData"
        @showMap = "showMap"
        @goDetailPage = "goPage"
      >
      </describe>
    </detail-title>

    <div style="position: relative">
      <span class="qwui-serial_entrance" @click="getFlowSerial" v-show="flowSerial.isFreeFlow!=1"><i class="qwui-icon_serial"></i>流转明细</span>
      <!--当前处理人-->
      <div v-if="FlowAuditList.length">
        <user-selected-group
          v-for="(item,index) in FlowAuditList"
          v-if="item.auditUserList.length"
          :key="index"
          :title="startAuditTitle(item)+'('+item.auditUserList.length+')'"
          :isEdit="false">
          <user-selected-item
            :title="startAuditTitle(item)"
            :List="item.auditUserList"
            :isEdit="false"
            @showPersonList="showPersonList"
            @atThisPersonUtil="atThisPersonUtil"
            slot="user_selected_item">
          </user-selected-item>
        </user-selected-group>
      </div>

      <!--审批人-->
      <user-selected-group
        v-if="showToPersons && toPersonList.length"
        :title="'审批人'+'('+toPersonList.length+')'"
        :isEdit="false">
        <user-selected-item
          :List="toPersonList"
          :isEdit="false"
          title="审批人"
          @atThisPersonUtil="atThisPersonUtil"
          @showPersonList="showPersonList"
          slot="user_selected_item"
        >
        </user-selected-item>
      </user-selected-group>

      <!--下一步处理人-->
      <user-selected-group
        v-if="FlowAuditListShow"
        :title="'下一步处理人'+'('+FlowAuditList[0].nextAuditList.length+')'" :isEdit="false">
        <user-selected-item
          title="下一步处理人"
          :List="FlowAuditList[0].nextAuditList"
          :isEdit="false"
          @showPersonList="showPersonList"
          @atThisPersonUtil="atThisPersonUtil"
          slot="user_selected_item">
        </user-selected-item>
      </user-selected-group>

      <!--相关人-->
      <user-selected-group
        v-if="ccPersonList.length"
        :title="'相关人'+'('+ccPersonList.length+')'" :isEdit="false">
        <user-selected-item
          title="相关人"
          :List="ccPersonList"
          :isEdit="false"
          @atThisPersonUtil="atThisPersonUtil"
          @showPersonList="showPersonList"
          slot="user_selected_item">
        </user-selected-item>
      </user-selected-group>

    </div>

    <!--审批请示按钮-->
    <flow-approve-button
      :FlowAudit="FlowAuditList[0]"
      :detail="flowApproveDetail"
      :bottomApproveButton = "bottomApproveButton"
      :approveVo="approveVo"
      :IsNotSolved = "isNotSolved"
      @showChatTool="showChatToolFun"
      @approveAction="approveAction"
      @actionButtonClick="actionButtonClick">
      <template slot="bottomApproveButton">
        <div
          v-if="revokeAction"
          class="qwui-action-button-item"
          @click="actionButtonClick('revokeApprove')"
        >
          <span :class="['iconfont', bottomApproveButton.revokeApprove.icon]"></span>
          <span class="text">{{bottomApproveButton.revokeApprove.text}}</span>
        </div>
      </template>
    </flow-approve-button>

    <!--选择节点处理人 弹窗-->
    <flow-approve-dialog
      v-if="flowApproveDialogShow"
      @showPersonList="showPersonList"
      @saveNodeAuditUserJson="commitTask"
      :action="approveActionStatus"
      :agent="agent"
      :config="dialogConfig"
      :detail="flowApproveDetail"
    >
    </flow-approve-dialog>

    <!--处理人范围选人-->
    <user-selected-ranglist
      :options="FlowAuditUser[appointUserIndex].startAuditList.flowUserList"
      :selectType="FlowAuditUser[appointUserIndex].startAuditList.selectType.type"
      :checkedType="FlowAuditUser[appointUserIndex].startAuditList.selectType.checkedType"
      :config="FlowAuditUser[appointUserIndex].startAuditList.selectType"
      :defaultAllSelect="FlowAuditUser[appointUserIndex].startAuditList.defaultAllSelect"
      :checked="FlowAuditUserIds(appointUserIndex)"
      @FlowAuditUserResult="FlowAuditUserResult"
      v-if="FlowAuditUserBoxShow">
    </user-selected-ranglist>

    <!--公共选人组件-->
    <user-selected-box
      v-if="selectConfig.show"
      :selectconfig="selectConfig">
    </user-selected-box>

     <!--评论列表-->
    <comment-list
      :commentList="commentList"
      :totalRow="listTotalRows"
      :dealListContent="dealCommitStatus"
      :dealListIcon="setCommentIcon"
      @onlyComment="onlySeeComment"
      @atThisPersonUtil="atThisPersonUtil"
      @commentListImagesURL="commentListImagesURL"
      @delete="deleteThisComment">
    </comment-list>

    <!--加载更多-->
    <load-more :loading="loading"
               :type="'commentList'"
               :hasMore="hasMore"
               @loadMoreClick="loadMoreList">
      <span v-if="!listTotalRows">还没有任何评论</span>
    </load-more>

    <!-- 流转明细 -->
		<flow-serial :flowSerialData="flowSerialData" :isover="flowSerial.isover" v-if="flowSerial.isShowFlowSerial"></flow-serial>

    <!--个人信息-->
    <user-info @showChatTool="showChatToolFun"></user-info>

    <!--人员列表组件-->
    <user-show :title="userselectTitle" :userSelect="userSelectList" :limitPreview="limitPreview" :show.sync="showPerson"></user-show>

    <!--评论输入框组件-->
		<chat-input :show.sync="showChatTool"
               :autofocus.sync="autofocus"
							 :dataBase="dataBase"
							 :agent="agent"
							 @updateContent="updateContent"
							 @dealccPerson="backUserSelect"
							 @closeChat="showChatTool=false">
		</chat-input>

    <!--选人-->
    <user-selected-box :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user-selected-box>
    <!--地图-->
    <tencent-map  v-if="locationInfo.showMap"  :pos="locationInfo"  @closeMap="closeMap" type="showPosition"></tencent-map>
    <!--预览图片组件-->
    <preview-images :urls="previewImageUrl"></preview-images>
  </div>
</template>

<script>
  import EventBus from '@/utils/eventBus'
  import CommentList from '@/components/list/comment_list'
  import LoadMore from '@/components/list/load_more'
  import FlowSerial from '@/components/flow/flow_serial' // 流转明细
  import UserInfo from '@/components/detail/user_info_card' // 个人信息
  import ChatInput from '@/components/detail/chatInput'
  import PreviewImages from '@/components/base/previewImages'
  import DetailTitle from '@/components/detail/detail_title' // 头部信息
  import UserShow from '@/components/detail/user_show'
  import TencentMap from '@/components/add/tencentMap.vue'  // 地图组件
  import UserSelectedBox from '@/components/base/user_or_dept_select'
  import QwSelectNode from '@/components/flow/selectNode'
  import UserSelectedItem from '@/components/base/userOrDeptSelect/user_selected'
  import UserSelectedGroup from '@/components/base/userOrDeptSelect/user_selected_group'
  import UserSelectedRanglist from '@/components/base/userOrDeptSelect/user_selected_ranglist'
  import FlowApproveButton from '@/components/flow/flowApproveButton'
  import FlowApproveDialog from '@/components/flow/flowApproveDialog'
  import Describe from '../../components/describe'

  import {
    findBranchFlowNextNodeInfoFun,
    getDetailFlowAuditFun,
    getParallelFlowSerialFun
  } from '@/components/flow/getAuditFlow'

  import AuditFlowApi from '@/components/flow/api/getData'
  import {mapState,mapGetters, mapMutations, mapActions} from 'vuex'

  import {
    getFormDetail,
    commentListMore,
    addCommentList,
    deleteCommentList,
    checkHasRevoked,
  } from '../../api/getData'

  import {approveDialogConfig} from '@/components/flow/config'
  import html2canvas from 'html2canvas'   // html转换为图片
  import {isVipSilver, isVipGold} from '@/assets/js/vip-portal.js' 	// 判断VIP
  import wx from 'weixin-js-sdk'

  export default {
    name: 'detail',
    components: {
      UserSelectedItem,
      UserSelectedGroup,
      CommentList,
      LoadMore,
      FlowSerial,
      UserInfo,
      ChatInput,
      PreviewImages,
      DetailTitle,
      UserShow,
      UserSelectedBox,
      QwSelectNode,
      FlowApproveButton,
      FlowApproveDialog,
      TencentMap,
      UserSelectedRanglist,
      Describe
    },
    data () {
      return {
        id: '',
        dataBase: dataBase,
        createTime: '',
        showToPersons: true,   // 是否显示审批人，未审批完成时不显示
        loading: false,
        hasMore: false,
        agent: 'leaveapply',
        flowSerial: {        // 流程明细
          isFirstRequest: true,
          isShowFlowSerial: false,
          list: [],
          isFreeFlow: '',
          isover: '',
          currentTime: '',// 当前时间
        },
        previewImageUrl:[],       // 需要预览的图片列表
        detailPicList: [],
        showChatTool: false,     // 显示评论输入框
        commentValue: '',       // 评论输入框的值
        autofocus: false,
        userSelectList: [],    // 选择人
        userselectTitle: '',
        limitPreview: false,  // 限制弹个人信息弹窗
        showPerson: false,   // 是否展开所有选中人员列表
        lock_roll: false,
        flowApproveDetail: {},   // 审批按钮需要用到的节点详情数据
        bottomApproveButton: {
          // 销假
          revokeApprove: {
            text: '销假',
            icon: 'icon-shenpiqingshi-revoke',
            show: 1,
          },
          chatInputShow: {
            show: 1
          }
        },
        toPersonList: [],    // 审批人/处理人
        approveActionStatus: '' ,   // 审批按钮
        commentList: [],       // 评论列表
        listTotalRows: '',
        currentPage: 1,
        pageSize: 10,
        pageNum: 1,
        deleteListIndex: '',  // 需要删除评论的index
        commentStatus: '1',
        dialogConfig: null,
        locationInfo: {  // 地图信息
          showMap: false,
          latitude: '',
          longitude: '',
          value: ''
        },
        canPrint: true,
        leaveType: '0' // 请假单类型 0请假 1出差 2加班
      }
    },
    created() {
      this.id = this.$route.query.askId
      this.resetFlowData()
      this.resetDetailData()
      this.$store.commit('updateFlowChioseNodeAuditUser')
      this.dataBase.selectConfig.selectList['toPersonList'].deptSelectedShow = false
      this.dataBase.selectConfig.selectList['ccPersonList'].deptSelectedShow = false
      this.getFormDetail()
    },
    methods: {
      ...mapActions([
        'getApprove',   // 自由流程获取转审人员
        'updateFlowUserSelected',     // 更新已选处理人
        'getNodeListInfo', // 获取节点选择信息
        'updateAuditStatus',  // 非自由流
        'assignAudit',    // 加签
        'addApprove',     // 转审
        'updateFreeAuditStatus',  // 自由
      ]),

      ...mapMutations([
        'updateUserSelectConfirm',
        'updateCCPerson', // 更新相关人
        'updateUserSelectedState',  // 更新流程的类型
        'resetFlowData',  // 重置流程信息
        'resetDetailData'
      ]),

      // 页面跳转
      goPage(val) {
        this.$router.push({ path: val.name, query: {leaveType: this.leaveType,askId:val.params.askId,type:val.params.type}})
      },

      // 调取接口获取详情信息
      getFormDetail() {
        let req_param = {
          askId: this.id,
          size: 10
        }
        getFormDetail(req_param, (res) => {
          let detail = res.detail
          // 标题设置
          detail.title ? document.title = detail.title : ''
          this.leaveType = detail.isTravel
          let isFree = detail.isFree == '0' || detail.isFree == '3' ? detail.isFree : '1'
          // 更新流程类型
          this.updateUserSelectedState({type: 'isFree', data: isFree})
          this.updateUserSelectedState({type: 'refId', data: this.id})
          this.updateUserSelectedState({type: 'isBranchFlow', data: res.detail.isFree == 3 ? true : false})
          res.approve =  res.approve || '0',
          this.flowApproveDetail = Object.assign({}, this.flowApproveDetail,{
            isover: detail.isover,
            status:  detail.askStatus,
            creator: detail.creator,
            isFree: detail.isFree,
            approve: res.approve,
          })
          // 判断是否是并行，是就查询并行接口获取节点列表
          if (res.detail && res.detail.currentNodeId.indexOf(',') != -1) {
            console.log('并行流程')
          } else {
            // 非并行流程
            this.updateUserSelectedState({type: 'currentNodeId', data: res.detail? res.detail.currentNodeId : ''})
            this.showDetailPage(res)
          }
        })
      },

      // 处理并展示详情信息
      showDetailPage(res) {
        // 复制： 登录人为提单人 & 不是销假单
        if(res.detail.creator == _.userId && (!res.detail.isRevoked || res.detail.isRevoked != '1')) {
          res.detail.configCopy = {
            name: 'add',
            params: {
              askId: this.id ,
              type: 'copy'
            }
          }
        }

        // 请假单中的销假单若已经被审批通过了，则请假单的状态为已销假
        let isover = res.detail.isover
        let status = {
          active: true,
          class: isover == '' ||  isover == 2 ? 'status_blue' : isover == 0 ? 'status_red' : isover == -1 ? 'status_gray' : isover == 1 || isover == 3 ? 'status_green' : '',
          name: res.revokedIds && res.revokedIds.length > 0  && res.detail.alreadyRevoked > 0 ? '已销假' : res.detail.auditStatus,
          show: true
        }
        res.detail.titleStatus = status

        // 基本信息
        let describes = [
          {
            text: '申请时长',
            content: this.dealAskTime(res.detail.ext1, res.detail.askDay),
          },{
            text: '申请类型',
            content: res.detail.typeName
          },{
            text: '开始时间',
            content: res.detail.startTime
          },{
            text: '结束时间',
            content: res.detail.endTime
          }
        ]

        // 图片列表
        this.detailPicList.push(...res.detail.picList)

        res.detail.describes = describes
        res.detail.content = res.detail.content
        res.detail.status = res.detail.askStatus
        this.share(res.shareVO)
        this.$store.commit('updateDetailData', res)
        this.$store.commit('updateTitleData', res)
        this.toPersonList = res.detail.toPersons || []
        this.updateCCPerson(res.detail.ccPersons)
        this.updateUserSelectedState({type:'templateRefId', data: 'ask' + res.detail.orgId.replace(/-/g, '')})  // 模版id
        this.listTotalRows = res.detail.commentCount
        this.showCommentList(res.comments, res.hasMore, this.listTotalRows)
        this.flowSerial.isover = res.detail.isover
        this.showToPersons = res.detail.isFree == 1 || (res.detail.isover != '2' && res.detail.isover != '') ? true : false
        this.flowSerial.isFreeFlow = this.isFree

        // 更新审批状态
        if (res.detail.isFree != '1') {
          this.getFlowAuditNodeData()
        } else{
          this.getApprove(this.id)   // 自由流程获取转审人员
        }

      },

      // 获取当前审批节点信息
      getFlowAuditNodeData() {
        let req_param = {
          refId: this.id,
          definitionId: 'ask' + this.detail.orgId,
          isBranch: this.isBranchFlow,
          nodeId: this.currentNodeId,
          status: this.detail.askStatus
        }
        getDetailFlowAuditFun(req_param ,(res) => {
          // 加签不能是空的currentNodeId
          if(res.nodeInfo && res.nodeInfo[0].vo) {
            res.currentNodeId = res.currentNodeId == '' ? res.nodeInfo[0].vo.nodeId : res.currentNodeId
          }
          this.updateUserSelectedState({type: 'isBranchNode', data: res.isBranchNode})
          this.$store.commit('updateFlowAuditList', res.nodeInfo)
          this.$store.commit('updateSearchFlowListData', res)      // 第一接口返回的数据进行统一更新
          this.$store.commit('updateFlowChioseNodeAuditUser')      // 更新由上一个节点已选择的处理人

        })
      },

      // 查看个人头像信息
      atThisPersonUtil(user) {
        if(user){
          EventBus.$emit('atThisPersonUtil', user)
        }
      },

      // 处理人标题
      startAuditTitle(item) {
        let auditInfo = this.FlowAuditList[0]
        if( (auditInfo.nextAuditList && auditInfo.nextAuditList.length>0 || auditInfo.auditLeave)
            || auditInfo.audtiFlag == '2'    // 多部门
            || auditInfo.audtiFlag == '3'    // 直接负责人
            || auditInfo.isBranchNode
            || auditInfo.flowNodeItemKeys
            || auditInfo.appointNodeAndUserVOList && auditInfo.appointNodeAndUserVOList.length > 0
        ) {
          return  '当前处理人'
        }
        return '最后处理人'
      },

      // 展示所有被选人员
      showPersonList(title, list, type) {
        this.userselectTitle = title
        this.userSelectList = list
        this.showPerson = true
        this.limitPreview = type ? true : false
      },

      // 显示评论弹窗
      showChatToolFun() {
        this.showChatTool = true
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

      // 发送评论
      updateContent(data) {
        if(data) {
          let req_param = {
            'tbQyAskCommentPO.content': data.content,
            'tbQyAskCommentPO.askId': this.id,
            'tbQyAskCommentPO.type': data.type,
            'tbQyAskCommentPO.status': data.status == 1 ? data.status : 0,  // 发布评论的状态, 0:普通，1：转审
            'userIds':  data.userIds,       // 被@人的id
            'isApproves': data.isApproves,
            'signImg': data.signImg,
          }
          addCommentList(req_param, (res) => {
            if(data.status == '1') {     // 退审等审批操作
              window.location.reload()
            } else {
              _.tooltips_succeed('评论成功')
              let new_commonet = {
                headPic: _.headPic,
                personName: _.personName,
                creator: _.userId,
                type: data.type,
                content: data.content,
                time: '刚刚',
                commentStatus: data.status
              }
              this.listTotalRows++
              if (res.commentId) {
                new_commonet.commentId =  res.commentId
                this.commentList.splice(0, 0, new_commonet)
              } else {
                this.commentList.length = 0
                this.currentPage = 1
                this.loadMoreList(this.currentPage)
              }
            }
          })
        }
      },

      // 只看评论
      onlySeeComment(type) {
        this.currentPage = 1
        this.commentList.length = 0
        this.commentStatus = type ? '2' : '1'  // 只看评论状态值为2
        if(!this.loading) {
          this.loadMoreList(this.currentPage)
        }
      },

      // 处理详情的全部图片src
      commentListImagesURL(urls) {
        this.previewImageUrl = []
        this.previewImageUrl.push(...this.detailPicList, ...urls)
      },

      dealCommitStatus(item) {
        let status = item.status || item.commentStatus
        return status != '6' ? true : false       // 是否以文字的形式展示
      },

      setCommentIcon(item) {
        let iconMap = {
          '6': 'qwui-meeting_icon icon_icon7',  // 已阅
        }
        let status = item.status || item.commentStatus
        return iconMap[status] ? iconMap[status] : ''
      },

      // 删除当前指定评论
      deleteThisComment(data, index) {
        if(data) {
          this.deleteListIndex = index
          let commentId = data.commentId
          let nextList = []
          deleteCommentList({commentId: commentId}, (res) => {
            this.commentList.splice(this.deleteListIndex, 1)
            this.listTotalRows--
          })
        }
      },

      // 处理返回的评论
      showCommentList(data, hasMore, commentCount) {
        this.hasMore = hasMore
        this.lock_roll = false
        if ( data && data.length > 0 ) {
          this.commentList.push(...data)
          this.listTotalRows = commentCount? commentCount : Number(this.commentList.length)
        } else {
          this.commentList.length = 0
          this.listTotalRows = 0
        }
      },

      dealCommentList(data) {
				this.loading = false
				this.showCommentList(data.comments, data.hasMore, data.tbTaskinfo.commentCount)
      },

      // 加载更多评论
      loadMoreList(pageNum, pageSize) {
        let req_param = {
          id: this.id,
          size: pageSize || this.pageSize,
          page: pageNum || this.pageNum,
          commentStatus:  this.commentStatus
        }
        this.loading = true
        commentListMore(req_param, this.dealCommentList)
      },

      // 下拉加载更多
      scrollList() {
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
          if(!this.lock_roll && this.hasMore) {
            this.lock_roll = true
            this.currentPage++
            this.loadMoreList(this.currentPage)
          }
        }
      },

      // 获取流转明细
      getFlowSerial() {
        let req_param = {
          refId: this.id,
          isFree: this.isFree == '0'? 2 : this.isFree, //固定流程转为2,
        }
        getParallelFlowSerialFun(req_param, (res) => {
          this.flowSerial.list = res.auditSerial;
          this.flowSerial.currentTime = res.currentTime;
          this.flowSerial.isShowFlowSerial = true
          this.flowSerial.isFirstRequest = false
        })
      },

      // 销假
      revokeApprove() {
        // vip用户才有销假的功能
        let sumAskDays = this.detail.sumAskDays
        if (this.detail.isFree === '1') {
          return _.alert('提示', '自由流程的请假单无法销假')
        } else if(this.leaveType == 2){
          return _.alert('提示', '加班暂不支持销假功能')
        }
        else {
          if (isVipSilver(interfaceCode.INTERFACE_CODE_ASK)) {
            if (sumAskDays) {
              checkHasRevoked(this.id).then(res => {  //查询是否存在销假单
                if (res.code == '0') {
                  if (res.data.revokedCount == 0) {
                     this.$router.push({path: '/add', query: {leaveType: this.leaveType,askId: this.id, type: 'revoke'}})
                  } else {
                    _.alert( '提示', '当前请假单已存在一个审批中的销假单，请前往已提交列表查询')
                  }
                } else {
                  _.alert('提示', '查询请假单所关联的销假单出错')
                }
              })
            } else {
              _.alert('提示', '2017年之前的请假单无法销假')
            }
          } else {
            return _.alert('提示', '销假功能仅限VIP用户使用')
          }
        }
      },

      // 获取下一节点
      requestNextBranchNode() {
        // 最后接口数据回调
        let req_param = {
          ...this.findBranchFlowNextNodeInfoParams,
          'searchValue.field_askTemplate': this.detail.typeName,
          'searchValue.field_askDays': this.detail.sumAskDays
        }
        findBranchFlowNextNodeInfoFun(req_param, (res) => {
          this.$store.commit('updateFlowAuditUserData', res)
          this.updateUserSelectedState({type: 'flowApproveDialogShow', data: true})
          // 更新下拉选择节点名称
          this.$store.commit('updateChooseNodeName')
        })
      },

      // 审批事件
      approveAction(payload) {
        this.approveActionStatus = payload
        // 审批
        if(payload === 'approve') {
          if (this.isFree == 3 && this.isBranchNode) {
            this.requestNextBranchNode()
          }
        }
        this.updateUserSelectedState({type: 'flowApproveDialogShow', data: true})
      },

      // 点击事件
      actionButtonClick(payload) {
        if(payload === 'getFlowSerial') {   // 流程明细
          this.getFlowSerial('getFlowSerial')
        }
        if(payload === 'editApprove') {     // 编辑
          let val = this.detail.isRevoked
          this.$router.push({path: '/add', query: { leaveType: this.leaveType,askId: this.detail.askId, type: 'edit', isRevoked: val}})
        }
        if(payload === 'revokeApprove') {  // 销假
          this.revokeApprove()
        }
      },

      // 保存提交数据
      commitTask(data) {
        let req_param = {
          askId: this.id,
          currentNodeId: this.currentNodeId,
          // nextNodeId: this.nextNodeId,
          relatives: data.chooseFlowUser,  // 转审人
          isOver: this.detail.isover,
          ...data
        }
        if(this.approveActionStatus == 'assignApprove') {    // 加签
          req_param.addCountersignPersons = req_param.addCounterSignPersonStr
          this.assignAudit({
            ...req_param,
            'callback': () => {
              setTimeout(() => {
                this.$router.push('/review')
              }, 500)
            }
          })
        } else if(this.approveActionStatus == 'agreeReApprove') {  // 自由转审
          req_param.addCountersignPersons = req_param.addCounterSignPersonStr
          req_param.agent_code = 'ask'
          this.addApprove({
            ...req_param,
            'callback': () => {
              this.sendAgreenApproveContent(req_param.reason, req_param.signImg)
            }
          })
        } else if(this.isFree == 1) {   // 自由非转审
          req_param.status = this.approveActionStatus == 'agreeApprove' ? 1 : this.approveActionStatus == 'agreeEndApprove' ? 2 : this.approveActionStatus == 'returnApprove' ? 0 : this.approveActionStatus == 'closeApprove' ? -1 : ''
          req_param.addCountersignPersons = req_param.addCounterSignPersonStr
          this.updateFreeAuditStatus({
            ...req_param,
            'callback': () => {
              setTimeout(() => {
                this.$router.push('/review')
              }, 500)
            }
          })
        } else { // 非自由
          req_param.status = this.approveActionStatus == 'approve' ? 1 : this.approveActionStatus == 'endApprove' ? 2 :this.approveActionStatus == 'returnApprove' ? 0 : this.approveActionStatus == 'closeApprove' ? -1 : ''
          this.updateAuditStatus({
            ...req_param,
            'callback': () => {
              setTimeout(() => {
                this.$router.push('/review')
              }, 500)
            }
          })
        }
      },

      // 转审后发送评论
      sendAgreenApproveContent(reason, signImg) {
				let userSelected = this.FlowAuditUser[0].startAuditList.userSelected
				let content = ''
				userSelected.forEach((item,index) => {
					content += item.personName + '、'
				})
        content = content.substring(0, content.lastIndexOf('、'))
				let req_param = {
					type: 1,
					status: 1,
					content: reason + '。 请(' + content + ')审批',
          userIds:this.FlowAuditUserIds(0).join('|'),
          isApproves: '0',
          signImg: signImg
        }
        this.updateContent(req_param)
			},

      closeMap() {
        this.locationInfo.showMap = false
      },

      showMap(val) {
        this.locationInfo.showMap = true
        if(val == 'begin') { // start
          this.locationInfo.latitude = this.detail.beginLatitude
          this.locationInfo.longitude = this.detail.beginLongitude
          this.locationInfo.value = this.detail.beginLocation
        } else {
          this.locationInfo.latitude = this.detail.destinationLatitude
          this.locationInfo.longitude = this.detail.destinationLongitude
          this.locationInfo.value = this.detail.destinationLocation
        }
      },

      // 选择处理人后点击确定回调
      FlowAuditUserResult(payload) {
        this.$store.commit('checkFlowAuditUserType', payload)
        // 如果是多部门，则请求部门负责人
        this.updateFlowUserSelected(payload)
      },

      printDetail() {
				if(isVipSilver(interfaceCode.INTERFACE_CODE_ASK)) {
          this.myprint()
				} else {
					_.alert('提示', '打印功能仅限VIP用户使用', '确定')
				}
      },

			myprint() {
        document.getElementsByClassName('qwui-action-button')[0].style.display = 'none'
				let print = document.querySelector('.wrap')
				html2canvas(print).then( canvas => {
					_.showLoading('打印中')
					this.convertCanvasToImage(canvas)
				})
				let flag = true
				// 将表单中的图片能够进行跨域处理
				if(flag) {
					let img = document.querySelectorAll('.wrap img')
          for(let i = 0; i<img.length; i++) {
            let src = img[i].getAttribute('src')
            if(!!src && src.indexOf(_.baseURL + '/jsp/wap/images/emoji') == -1) {
              src = encodeURIComponent(src)
              let newsrc = _.baseURL + '/portal/errcode/errcodeAction!loadImage.action?imgUrl=' + src
              img[i].setAttribute('src', newsrc)
            }
          }
					flag = false
				}
      },

			convertCanvasToImage(canvas) {
        let image = new Image()
        image.src = canvas.toDataURL('image/png')
        if(image.src) {
          localStorage.setItem('imageSrc', image.src)
          window.location.href=_.baseURL + '/jsp/wap/include/printDetail.jsp'
        }
      },

      dealAskTime(hours, days) {
        let format_h = parseFloat(hours)
        let format_d = parseFloat(days)
        var resTime
        if(this.leaveType==2){
          resTime = [hours,days]
        }else{
          resTime = format_h > 0 && format_d > 0 ? days + '天零' + hours + '小时' : format_h > 0 ? hours + '小时' : days + '天'
        }
        return resTime
      },

      // 分享配置
			share(shareVO) {
        let link = shareVO.shareUrl.split('#')[0] + '#' + shareVO.shareUrl.split('#')[1]
				wx.onMenuShareTimeline( {
          title: shareVO.shareTitle,  // 标题
          link: link,                 // 链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: shareVO.shareImg,   // 图标
          success: () => {}           // 用户点击了分享后执行的回调函数
				})
        wx.onMenuShareAppMessage({
          title: shareVO.shareTitle,
          desc: shareVO.shareContent.replace(/<[^>]+>/g, ''), // 描述
          link: link,
          imgUrl: shareVO.shareImg,  // 分享图标
          type: '',                  // 分享类型,music、video或link，不填默认为link
          dataUrl: '',               // 如果type: music、video，则要提供数据链接，默认为空
          success: () => {}
        })
				wx.onMenuShareQQ({
					title: shareVO.shareTitle,
					desc: shareVO.shareContent.replace(/<[^>]+>/g, ''),
					link: link,
					imgUrl: shareVO.shareImg,
					success: () => {},
					cancel: () => {}
				})
      },
    },
    computed: {
       ...mapGetters([
        'FlowAuditUserIds',    // 已选择的处理人id
        'FlowAuditListShow',   // 下一步处理人是否显示
        'findBranchFlowNextNodeInfoParams'    // 查找下一节点信息的入参
      ]),
      ...mapState({
        detailTitleData: state => state.detail.detailTitleData,   // 头部信息
        detailData: state => state.detail.detailData,     // 详情内容数据
        detail: state => state.detail.detailData.detail,  // 详情信息

        templateRefId: state => state.flowUserSelected.templateRefId,          // 模板审批单id
        isBranchFlow: state => state.flowUserSelected.isBranchFlow,          // 是否是分支流
        isBranchNode: state => state.flowUserSelected.isBranchNode,          // 接口返回的流程数据
        isFree: state => state.flowUserSelected.isFree,          //流程类型,默认是自由流程'1'（固定为0，分支为3，全部应用需要统一）
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

        FlowAuditUserBoxShow: state => state.flowUserSelected.FlowAuditUserBoxShow, // 流程勾选类型弹窗：指定人员、部门、部门负责人
        flowApproveDialogShow: state => state.flowUserSelected.flowApproveDialogShow, // 选择审批人弹窗
        appointUserIndex:state => state.flowUserSelected.appointUserIndex, // 用户当前选择的处理人（第几个节点）

        approveVo: state => state.flowUserSelected.approveVo,  // 自由流程信息
        commitTaskParams: state => state.flowUserSelected.commitTaskParams, // 提交返回的流程字段
        appointNodeAndUserVOList: state => state.flowUserSelected.appointNodeAndUserVOList,  // 当前节点指定处理人的节点信息

      }),

      // 流转明细
      flowSerialData () {
        return this.flowSerial
      },

      // 销假
      revokeAction() {
        if(this.bottomApproveButton.revokeApprove.show !==1) {
          return this.bottomApproveButton.revokeApprove.show
        }
        if(!!this.detail) {
          let canRevoke = (
            this.detail.creator === _.userId        // 是提单人
            && this.detail.isover != -1             // 未关闭
            && this.detail.askStatus == '2'         // 审批完 
            && this.detailData.approve == '1'       // 审批通过  
            && this.detail.isRevoked == '0'         // 是请假单   
            && this.detail.alreadyRevoked == 0      // 无销假单（则未进行销假）
            && this.detail.isTravel != 2            // 非加班单        
          )
          if(canRevoke) {   // 未销假的
            this.bottomApproveButton.chatInputShow.show = 0
          }
          return canRevoke
        }
      },

      // 是否未审批完
      isNotSolved() {
        if(!!this.detail) {
          return this.detail.isover == 2 || this.detail.isover == '' // 审批中
        }
        return false
      }
    },
    destroyed() {
      this.closeMap()
    }
  }

</script>
<style scoped>
  .height-bottom{height: 50px;}
  .height-margin{height: 15px;}
  .qwui-detail_header /deep/ .qwui-detail_item_title{
    width: 70px;
  }
  .qwui-action-button-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    color: #333;
    font-size: 16px;
    cursor: pointer;
  }
  .iconfont{
    margin-right: 5px;
    font-size: 18px;
    color: rgba(166, 166, 166, 1);
  }
  .wrap {
    margin-bottom: 50px;
  }
  .icon-shenpiqingshi-revoke {
    width: 18px;
    height: 18px;
    background: url(../../asset/img/icon_revoke.png) center no-repeat;
    background-size: 100% ;
    margin-top: 1px;
  }
</style>

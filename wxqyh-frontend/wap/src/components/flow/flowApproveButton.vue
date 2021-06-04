<template>
<div class="flowApproveButton">
  <flow-action-group
    :moreButton="moreButtonConfig"
    @moreButtonClick="actionButtonClick('moreApprove')"
  >
    <!--评论输入-->
    <div v-if="chatInputShow" class="comment_btn_add"
      @click="showChatClick">
      <input class="comment-chat_input" :value="approveInputValue" placeholder="评论一句吧" type="text">
    </div>

    <!--评论-->
    <flow-action-button
      v-if="chatBtnShow"
      customClass="chatBtn"
      :icon="bottomButton.chatBtnShow.icon"
      :text="bottomButton.chatBtnShow.text"
      @actionButtonClick="showChatClick"
    >
    </flow-action-button>

    <!--同意-->
    <flow-action-button
      v-if="agreeBtn || agreeEndBtn"
      customClass="flowAgreeBtn"
      :icon="bottomButton.agreeApprove.icon"
      :text="bottomButton.agreeApprove.text"
      @actionButtonClick="actionButtonClick('agreeEndApprove')"
    >
    </flow-action-button>

    <!--审批-->
    <flow-action-button
      v-if="approveBtn"
      customClass="flowApproveBtn"
      :icon="bottomButton.approve.icon"
      :text="bottomButton.approve.text || returnApproveText[1]"
      @actionButtonClick="approveAction('approve')"
    >
    </flow-action-button>

    <!--退审-->
    <flow-action-button
      v-if="returnApproveBtn"
      customClass="flowReturnApproveBtn"
      :icon="bottomButton.returnApprove.icon"
      :text="bottomButton.returnApprove.text || returnApproveText[0]"
      @actionButtonClick="approveAction('returnApprove')"
    >
    </flow-action-button>

    <!--转审-->
    <flow-action-button
      v-if="agreeReApproveBtn"
      customClass="flowAgreeReApproveBtn"
      :icon="bottomButton.agreeReApprove.icon"
      :text="bottomButton.agreeReApprove.text"
      @actionButtonClick="approveAction('agreeReApprove')"
    >
    </flow-action-button>

      <!--关闭-->
    <flow-action-button
      v-if="bottomCloseAction"
      customClass="flowBottomCloseAction"
      :icon="bottomButton.closeApprove.icon"
      :text="bottomButton.closeApprove.text"
      @actionButtonClick="approveAction('closeApprove')"
    >
    </flow-action-button>

      <!--编辑-->
    <flow-action-button
      v-if="bottomEditAction"
      customClass="flowBottomEditAction"
      :icon="bottomButton.editApprove.icon"
      :text="bottomButton.editApprove.text"
      @actionButtonClick="actionButtonClick('editApprove')"
    >
    </flow-action-button>

      <!--加签-->
    <flow-action-button
      v-if="assignBtn"
      customClass="flowAssignBtn"
      :icon="bottomButton.assignApprove.icon"
      :text="bottomButton.assignApprove.text"
      @actionButtonClick="approveAction('assignApprove')"
    >
    </flow-action-button>

    <!--自定义底部按钮-->
    <slot name="bottomApproveButton"></slot>

  </flow-action-group>

  <!--更多审批按钮-->
  <dialog-mask
    :dialogConfig="dialogBottomConfig"
  >
    <!--自定义按钮-->
    <slot name="moreApproveButton" slot="item"></slot>

    <!--评论-->
    <dialog-mask-item
      slot="item"
      v-if="moreChatBtnShow"
      :name="moreButton.moreChatBtnShow.text"
      @dialogBtnClick="showChatClick"
    >
    </dialog-mask-item>


    <!--转审-->
    <dialog-mask-item
      slot="item"
      v-if="agreeReApproveBtn1"
      :name="moreButton.agreeReApprove.text"
      @dialogBtnClick="approveAction('agreeReApprove')"
    >
    </dialog-mask-item>

    <!--结束-->
    <dialog-mask-item
      slot="item"
      v-if="endBtn"
      :name="moreButton.endApprove.text"
      @dialogBtnClick="approveAction('endApprove')"
    >
    </dialog-mask-item>

    <!--关闭-->
    <dialog-mask-item
      slot="item"
      v-if="moreCloseAction"
      :name="moreButton.closeApprove.text"
      @dialogBtnClick="approveAction('closeApprove')"
    >
    </dialog-mask-item>

    <!--编辑-->
    <dialog-mask-item
      slot="item"
      v-if="moreEditAction"
      :name="moreButton.editApprove.text"
      @dialogBtnClick="actionButtonClick('editApprove')">
    </dialog-mask-item>

    <!--流程明细-->
    <dialog-mask-item
      slot="item"
      v-if="flowSerialBtn"
      :name="moreButton.flowSerial.text"
      @dialogBtnClick="actionButtonClick('getFlowSerial')"
    >
    </dialog-mask-item>

    <dialog-mask-item
      slot="item"
      name="取消"
      @dialogBtnClick="actionButtonClick('cancelShowMoreButton')"
    >
    </dialog-mask-item>
  </dialog-mask>

  <!--同意弹窗-->
  <dialog-mask
    :dialogConfig="agreeBottomConfig">
    <dialog-mask-item
      slot="item"
      v-if="agreeBtn"
      name="仅同意"
      @dialogBtnClick="approveAction('agreeApprove')">
    </dialog-mask-item>
    <dialog-mask-item
      slot="item"
      v-if="agreeEndBtn"
      name="同意并结束"
      @dialogBtnClick="approveAction('agreeEndApprove')">
    </dialog-mask-item>
    <dialog-mask-item
      slot="item"
      name="取消"
      @dialogBtnClick="actionButtonClick('cancelShowMoreButton')" >
    </dialog-mask-item>
  </dialog-mask>
</div>
</template>

<script>
  import DialogMask from '@/components/base/dialog_mask_bottom'
  import DialogMaskItem from '@/components/base/dialog_mask_bottom_item'
  import {flow_action_btn,flow_action_btn_group} from '@/components/base/button'
  import {bottomApproveButton, moreApproveButton} from '@/components/flow/config'

  export default {
    name: "flow-approve-button",
    components: {
      DialogMask,
      DialogMaskItem,
      FlowActionButton: flow_action_btn,
      FlowActionGroup: flow_action_btn_group,
    },
    props: {
      //评论一句吧的输入框值
      approveInputValue:{
        type: String,
        default: ''
      },
      // 底部显示的按钮(参考 defaultBottomButton)
      bottomApproveButton: {
        type: Object
      },
      // 折叠的按钮(参考 moreApproveButton)
      moreApproveButton:{
        type: Object
      },
      // 详情数据
      detail: {
        type: Object,
        required: true,
        default() {
          return {
            "isover": null,     // 审批单具体状态（审批中：“”，退审：0，关闭：-1，完成：1）
            "status": null,     // 审批状态（0：草稿，1：审批中，2：审批完成）
            "creator": "",      // 创建者ID
            "isFree": null,     // 流程类型（"1"自由流程，"0"固定流程，"3"分支流程）
            "approve": null,    // 是否审批过（String "0"未审批过，"1"审批过）
          }
        },
      },
      // 当前节点审批信息（/ajaxGetFlowAudit.do）
      FlowAudit: null,
      // 自由流程转审信息（/workflowAction!getApprove.action）
      approveVo: null,
      // 未关闭
      IsNotOver: {
        default: 'false'
      },
      // 未审批完
      IsNotSolved: {
        default: 'false'
      },
      // 未被审批过
      IsApprove: {
        default: 'false'
      },
      // 被退审 ( !IsReturnBack 未被退审 )
      IsReturnBack: {
        default: 'false'
      },
      // 下一步处理人未离职
      IsAuditNotLeave: {
        default: 'false'
      },
    },
    data() {
      return {
        dialogBottomConfig: {
          show: false,
        },
        agreeBottomConfig: {
          show: false
        }
      }
    },
    mounted() {
      console.log(this.FlowAudit)
    },
    computed: {
      // 底部显示的按钮
      bottomButton() {
        return Object.assign({},bottomApproveButton, this.bottomApproveButton || {})
      },
      // 更多按钮的折叠
      moreButton() {
        return Object.assign({},moreApproveButton, this.moreApproveButton || {})
      },
      // 未关闭
      isNotOver() {
        if(this.IsNotOver!=='false') {return this.IsNotOver}
        return this.detail.isover !== '-1'
      },
      // 未审批完
      isNotSolved() {
        if(this.IsNotSolved!=='false') {return this.IsNotSolved}
        return this.detail.status != 2
      },
      // 未被审批过
      isApprove() {
        if(this.IsApprove!=='false') {return this.IsApprove}
        return this.detail.approve=='0'
      },
      // 被退审 ( !isReturnBack 未被退审 )
      isReturnBack() {
        if(this.IsReturnBack!=='false') {return this.IsReturnBack}
        return this.detail.isover === '0'
      },
      // 是当前处理人
      isHandleAccount() {
        return (
          (this.FlowAudit && this.FlowAudit.vo && this.FlowAudit.vo.handleAccounts.indexOf(_.userId) > -1)
          || (this.approveVo && this.approveVo.vo && this.approveVo.vo.userId.indexOf(_.userId) > -1)
        )
      },
      // 未审批完 && 是当前处理人
      isHandle() {
        return this.isNotSolved            // 未审批完
          && this.isHandleAccount          // 是当前处理人
      },
      // 是提单人
      isCreator() {
        return this.detail.creator === _.userId
      },
      // 下一步处理人未离职   true:未离职
      isAuditNotLeave() {
        if(this.IsAuditNotLeave!=='false') {return this.IsAuditNotLeave}
        return this.FlowAudit && !this.FlowAudit.auditLeave
      },
      // 是否有多个处理人（自由流程）
      isApproveMoreUsers() {
        return this.approveVo && this.approveVo.vo && this.approveVo.vo.userId.split('|').length > 1
      },

      // （自由流程）当前顺序代办人数,0：则不是顺序代办规则；1：代表是最后一个审批人（显示转审的按钮,或同意并结束）；>1：显示同意按钮
      isOrderAuditNum() {
        return this.approveVo && this.approveVo.vo.isOrderAuditNum
      },

      /*按钮显示条件 start*/

      // 审批
      approveBtn() {
        if(this.bottomButton.approve.show!==1) {
          return this.bottomButton.approve.show
        }
        return (
            this.FlowAudit
            && this.isHandle
            && this.isAuditNotLeave     // 下一步处理人未离职
            && !this.isReturnBack       // 未被退审
          )
      },
      // 退审
      returnApproveBtn() {
        if(this.bottomButton.returnApprove.show!==1) {
          return this.bottomButton.returnApprove.show
        }
        return this.approveBtn ||
          (
            this.approveVo
            && this.isHandle
            && !this.isReturnBack       // 未被退审
          )
      },
      // 同意
      agreeBtn() {
        if(this.bottomButton.agreeApprove.show!==1) {
          return this.bottomButton.agreeApprove.show
        }
        return (
            this.isHandle
            && (this.isApproveMoreUsers     // 多个处理人
              || this.isOrderAuditNum > 1)   // 自由流程是顺序审批且不是审批最后一个处理人
            && this.detail.isFree == 1
          )
      },
      // 同意并结束
      agreeEndBtn() {
        return (this.isHandle && this.detail.isFree == 1 && this.isOrderAuditNum <= 1)
      },
      // 同意并转审
      agreeReApproveBtn() {
        if(this.bottomButton.agreeReApprove.show !==1){
          return this.bottomButton.agreeReApprove.show
        }
        return this.agreeEndBtn
      },
      // 折叠的“转审”按钮
      agreeReApproveBtn1() {
        return this.moreButton.agreeReApprove.show && this.agreeEndBtn
      },
      // 结束
      endBtn() {
        if(this.moreButton.endApprove.show !==1){
          return this.moreButton.endApprove.show
        }
        return (this.isHandle
          &&
          (
            (this.FlowAudit && this.FlowAudit.vo.isCanEnd === "0")      // 允许提前结束
            ||
            !this.isAuditNotLeave                                        // 下一步处理人未离职
          )
        )
      },
      // 关闭、编辑
      creatorAction() {
        return ( this.isCreator                                                   // 是提单人
            && ( this.isReturnBack || (this.isNotOver && this.isApprove)          // 被退审或 （未关闭 && 未审批过）
          )
        )
      },
      // 关闭、编辑按钮被折叠
      moreCreatorAction() {
        return this.creatorAction && (this.agreeEndBtn || this.agreeBtn || this.returnApproveBtn)
      },
      // 关闭按钮被折叠
      moreCloseAction() {
        if(this.moreButton.closeApprove.show!==1) {
          return this.moreButton.closeApprove.show
        }
        return this.moreCreatorAction
      },
      // 编辑按钮被折叠
      moreEditAction() {
        if(this.moreButton.editApprove.show!==1) {
          return this.moreButton.editApprove.show
        }
        return this.moreCreatorAction
      },
      // 底部的关闭、编辑按钮显示
      bottomCreatorAction() {
        return this.creatorAction && !(this.agreeEndBtn || this.agreeBtn || this.returnApproveBtn)
      },
      // 底部关闭按钮
      bottomCloseAction() {
        if(this.bottomButton.closeApprove.show!==1) {
          return this.bottomButton.closeApprove.show
        }
        return this.bottomCreatorAction
      },
      // 底部编辑按钮
      bottomEditAction() {
        if(this.bottomButton.editApprove.show!==1) {
          return this.bottomButton.editApprove.show
        }
        return this.bottomCreatorAction
      },
      // “更多”
      moreButtonShow() {
        if(this.bottomButton.moreApprove.show!==1) {
          return this.bottomButton.moreApprove.show
        }
        // 评论、转审、关闭、编辑、结束、流程明细其中一个显示，就显示“更多”
        return this.moreChatBtnShow || this.agreeReApproveBtn1 || this.moreCloseAction || this.moreEditAction || this.flowSerialBtn || this.endBtn
      },
      // 加签
      assignBtn() {
        if(this.bottomButton.assignApprove.show!==1) {
          return this.bottomButton.assignApprove.show
        }
        return (
          this.FlowAudit
          && this.FlowAudit.parseAddSignVO
          && this.FlowAudit.parseAddSignVO.canAddSign            // 加签
          && this.isNotSolved           // 未审批完
          && !this.isReturnBack          // 未被退审
          && this.isAuditNotLeave        // 下一步处理人未离职
        )
      },

      // 流程明细
      flowSerialBtn() {
        if(this.moreButton.flowSerial.show!==1) {
          return this.moreButton.flowSerial.show
        }
        return this.detail.isFree !=1
      },

      // 评论输入框显示
      chatInputShow() {
        if(this.bottomButton.chatInputShow.show!==1) {
          return this.bottomButton.chatInputShow.show
        }
        // 审批、退审、转审、加签其中一个显示，就不显示评论输入框
        return !(this.agreeBtn || this.agreeEndBtn  || this.approveBtn || this.bottomCreatorAction || this.assignBtn)
      },

      // 评论按钮
      chatBtnShow() {
        return this.bottomButton.chatBtnShow.show
      },

      // “更多”里的评论按钮
      moreChatBtnShow() {
        if(this.moreButton.moreChatBtnShow.show!==1) {
          return this.moreButton.moreChatBtnShow.show
        }
        return !this.chatInputShow && !this.chatBtnShow
      },

      /*按钮显示条件 end */

      // 根据节点审批类型，显示“退审”/“审批”按钮文字
      returnApproveText() {
        if (!this.FlowAudit) {
          return ['退审', '审批']
        }
        let obj = {
          1: ['退审', '审批'],
          2: ['退回', '确认'],
          3: ['退回', '办理']
        }
        return (
          this.isAuditNotLeave                     // 下一步处理人未离职
          && obj[this.FlowAudit.nodeType]         // 1 审批，2 知会，3 承办
        )
      },
      // “更多按钮”
      moreButtonConfig() {
        return {
          show: this.moreButtonShow,
          text: this.bottomButton.moreApprove.text,
          border: !this.chatInputShow,
        }
      },
    },
    methods: {
      /*按钮操作 start*/
      actionButtonClick(name) {
        this.dialogBottomConfig.show = false
        this.agreeBottomConfig.show = false
        // 如果是点击'更多'
        if(name === 'moreApprove') {
          this.dialogBottomConfig.show = true
        }
        // 点击“同意”，如果是多个处理人，则弹窗选择“仅同意”、“同意并结束”
        if(name === 'agreeEndApprove' && this.isApproveMoreUsers) {
          this.agreeBottomConfig.show = true
        }
        // 自由流程顺序审批，且不是最后一个处理人，点击“同意”，则直接弹窗，调用的是仅同意的方法
        if(name === 'agreeEndApprove' && !this.isApproveMoreUsers && this.isOrderAuditNum > 1) {
          this.$emit('approveAction','agreeApprove')
          return;
        }
        // 点击“同意”，如果是单个处理人，则直接则弹窗
        if(name === 'agreeEndApprove' && !this.isApproveMoreUsers) {
          this.$emit('approveAction',name)
        }
        this.$emit('actionButtonClick',name)
      },
      // 需要弹窗的按钮操作
      approveAction(name) {
        this.dialogBottomConfig.show = false
        this.agreeBottomConfig.show = false
        this.$emit('approveAction',name)
      },
      // 显示评论弹窗
      showChatClick(){                                              //显示评论弹窗
        this.dialogBottomConfig.show = false
        this.$emit("showChatTool",true);
      },

      /*按钮操作 end*/
    }
  }
</script>
<style scoped>
  /*审批、同意*/
  .flowApproveBtn >>> .icon_a-review_ok,.flowAgreeBtn >>> .icon_a-review_ok{
    background-image: url("~assets/images/icon_a-review_ok@3x.png");
  }
  /*退审*/
  .flowReturnApproveBtn >>> .icon_a-review_no {
    background-image: url("~assets/images/icon_a-review_no@3x.png");
  }
  /*转审*/
  .flowAgreeReApproveBtn >>> .icon_a-review_review {
    background-image: url("~assets/images/icon_a-review_review@3x.png");
  }
  /*关闭*/
  .flowBottomCloseAction >>> .icon_a-review_end {
    background-image: url("~assets/images/icon_a-review_end@3x.png");
  }
  /*编辑*/
  .flowBottomEditAction >>> .icon_a-review_edit {
    background-image: url("~assets/images/icon_a-review_edit@3x.png");
  }
  /*加签*/
  .flowAssignBtn >>> .icon_a-review_add {
    background-image: url("~assets/images/icon_a-review_add@3x.png");
  }
  /*评论按钮*/
  .chatBtn >>> .icon_a-review_chat {
    background-image: url("~assets/images/icon_a-review_chat@3x.png");
  }
  .flowAgreeBtn.qwui-action-button-item,.flowApproveBtn.qwui-action-button-item {
    color: #5585F0;
  }
  .flowReturnApproveBtn.qwui-action-button-item,.flowBottomCloseAction.qwui-action-button-item {
    color: #FF596D;
  }
  /*TODO 删除掉*/
  .qwui-action-button-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    color: #333;
    font-size: 16px;
    cursor: pointer;
  }

  .comment_btn_add{
    display: flex;
    justify-content: left;
    align-items: center;
    flex: 1;
    margin: 6px 15px;
    padding-left: 10px;
    border-radius: 5px;
    font-size: 15px;
    color: #999;
    text-align: left;
    background: #F5F5F5;
    cursor: pointer;
  }
  .comment-chat_input{
    font-size: 15px;
    background: none;
    width: 100%;
    color: #999;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>

/*@zengjiaying 2018-07-28*/
/*
// 如果要修改其中一项
this.$set(this.bottomApproveButton,'agreeApprove',{
  ...bottomApproveButton.agreeApprove,
  show: true,
})
*/
/* 审批按钮事件
* comment               评论
* agreeApprove          同意
* agreeReApprove        转审
* agreeEndApprove       同意并结束
* approve               审批
* returnApprove         退审
* closeApprove          关闭
* editApprove           编辑
* moreApprove           “更多”
* endApprove            结束
* assignApprove         加签
* getFlowSerial         获取明细
* cancelShowMoreButton  取消
* */

// 审批按钮，默认底部显示的按钮
export const bottomApproveButton = {
  //  审批
  approve: {
    text: '',                       // 自定义按钮文字
    icon: 'icon_a-review_ok',  // 自定义按钮图标
    show: 1,                            // 自定义按钮显示条件（Boolean 类型，true 显示 / false 不显示）
  },
  //  退审
  returnApprove: {
    text: '',
    icon: 'icon_a-review_no',
    show: 1,
  },
  //  同意
  agreeApprove: {
    text: '同意',
    icon: 'icon_a-review_ok',
    show: 1,
  },
  //  转审
  agreeReApprove: {
    text: '转审',
    icon: 'icon_a-review_review',
    show: 1,
  },
  //  关闭
  closeApprove: {
    text: '关闭',
    icon: 'icon_a-review_end',
    show: 1,
  },
  //  编辑
  editApprove: {
    text: '编辑',
    icon: 'icon_a-review_edit',
    show: 1,
  },
  //  更多
  moreApprove: {
    text: '更多',
    icon: '',
    show: 1,
  },
  // 加签
  assignApprove: {
    text: '加签',
    icon: 'icon_a-review_add',
    show: 1,
  },
  // 评论输入框
  chatInputShow: {
    show: 1,
  },
  // 评论按钮
  chatBtnShow: {
    text: '评论',
    icon: 'icon_a-review_chat',
    show: false,
  }
}

//  审批按钮，折叠的按钮
export const moreApproveButton = {
  // 结束
  endApprove: {
    text: '结束',         // 自定义按钮文字
    show: 1,              // 自定义按钮显示条件。Boolean 类型
  },
  // 关闭
  closeApprove: {
    text: '关闭',
    show: 1,
  },
  // 编辑
  editApprove: {
    text: '编辑',
    show: 1,
  },
  // 流程明细
  flowSerial: {
    text: '流转明细',
    show: 1,
  },
  // 转审
  agreeReApprove: {
    text: '转审',
    show: false,
  },
  // 评论
  moreChatBtnShow: {
    text: '评论',
    show: 1,
  }
}


/*弹窗的文案配置 start*/
export const approveDialogConfig = {
  '': {
    title:'提交',
    reason:'',
    approveTip:'',
    status:'',
    isShowAssign: false,
    usePresetSignShow: false,
  },
  // 审批
  approve: {
    title: {                        // 标题
      1: '审批',
      2: '确认',
      3: '办理'
    },
    reason: {                       // 审批意见
      1: '同意',
      2: '已确认',
      3: '已办理'
    },
    approveTip: '请输入流转意见',     // 未输入时的提示语
    approveTitle: '处理意见',              // 处理意见标题
    status: 1,                     // 传给后台的标记
    isShowAssign: true,            // 显示手写签名入口
    usePresetSignShow: true,       // 是否显示开启存档签名的入口
  },
// 退审
  returnApprove: {
    title: {                        // 标题
      1: '退审',
      2: '退回',
      3: '退回'
    },
    reason: '不同意',
    approveTip: '请输入退审原因',
    approveTitle: '处理意见',
    status: 0,
    isShowAssign: true,
    usePresetSignShow: true,
  },
// 关闭
  closeApprove: {
    title: '关闭',
    reason: '已完成',
    approveTip: '请输入关闭原因',
    approveTitle: '关闭原因',
    status: -1,
    isShowAssign: true,
  },
// 同意
  agreeApprove: {
    title: '仅同意',
    reason: '同意',
    approveTip: '请输入同意意见',
    approveTitle: '处理意见',
    status: 1,
    isShowAssign: true,
  },
// 同意并结束
  agreeEndApprove: {
    title: '同意并结束',
    reason: '同意',
    approveTip: '请输入结束原因',
    approveTitle: '处理意见',
    status: 2,
    isShowAssign: true,
  },
// 同意并转审
  agreeReApprove: {
    title: '同意并转审',
    reason: '同意',
    approveTip: '请输入流转意见',
    approveTitle: '处理意见',
    status: 1,
    isShowAssign: true,
  },
// 加签
  assignApprove: {
    title: '加签',
    reason: '请协助处理',
    approveTip: '请输入加签原因',
  },
// 结束
  endApprove: {
    title: '结束',
    reason: {
      0: '同意并结束',
      1: '下一步处理人离职或者不存在'    // 下一步处理人离职时的提示语
    },
    approveTip: '请输入流转意见',
    approveTitle: '处理意见',
    status: 2,
    isShowAssign: true,
    usePresetSignShow: true,
  },
}
/*弹窗的文案配置 end*/

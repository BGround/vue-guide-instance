# 审批按钮
**[示例](http://localhost:8089/vp/module/flowDemo.html#/flowButton)**
```vue
<!--审批请示按钮-->
<flow-approve-button
  :FlowAudit="FlowAuditList[0]"
  :detail=""
  :approveVo="approveVo"
  :bottomApproveButton="bottomButton"
  :moreApproveButton="moreButton"
  :IsNotOver=""
  :IsNotSolved=""
  :IsApprove=""
  :IsReturnBack=""
  :IsAuditNotLeave=""
  @approveAction="approveAction"
  @showChatTool="showChatToolFun"
  @actionButtonClick="actionButtonClick"
>
  <!--自定义底部按钮，要保持样式统一，一定要用 flow_action_btn 组件-->
  <!--自定义样式
    图标
    .baoxiaoBtn >>> .ic_average {
      background-image: url("~assets/images/ic_average.png");
    }
    文字
    .baoxiaoBtn >>> .text {
      color: #0BBC3F;
    }
  -->
  <template slot="bottomApproveButton">
    <flow-action-button
      customClass="baoxiaoBtn"
      icon="ic_average"
      text="报销"
      @actionButtonClick="approveAction('baoxiao')"
    >
    </flow-action-button>
    <flow-action-button
      icon="public-phone-edit"
      text="请假"
      @actionButtonClick="approveAction('qingjia')"
    >
    </flow-action-button>
  </template>

  <!--自定义折叠的按钮，要保持样式统一，一定要用 DialogMaskItem 组件-->
  <template slot="moreApproveButton">
     <dialog-mask-item
       slot="item"
       name="自定义折叠的按钮"
       @dialogBtnClick="actionButtonClick('cancelShowMoreButton')"
     >
     </dialog-mask-item>
     <dialog-mask-item
       slot="item"
       name="自定义折叠的按钮"
       @dialogBtnClick="actionButtonClick('cancelShowMoreButton')"
     >
    </dialog-mask-item>
  </template>
</flow-approve-button>

<script >
import  FlowApproveButton from '@/components/flow/flowApproveButton'
import {flow_action_btn} from '@/components/base/button'
import DialogMaskItem from '@/components/base/dialog_mask_bottom_item'
import { bottomApproveButton, moreApproveButton } from '@/components/flow/config'
export default {
    components: {
      FlowApproveButton,
      DialogMaskItem,
      FlowActionButton: flow_action_btn,
    },
    data() {
      return {
        // 当前点击的按钮
        approveActionStatus: '',
        
        // 如果要修改底部按钮的某一项，请参考下面的方式更改
        bottomButton: {
          ...bottomApproveButton,
          moreApprove: {
            ...bottomApproveButton.moreApprove,
            show: true
          }
        },
        // 如果要修改折叠按钮的某一项，请参考下面的方式更改
        moreButton: {
          ...moreApproveButton,
          agreeReApprove: {
            ...moreApproveButton.agreeReApprove,
            show: true,
          }
        },
        showChatTool: false, //评论组件
        autofocus: false,
      }
    },
    computed: {
      ...mapState({
        FlowAuditList: state => state.flowUserSelected.FlowAuditList, // 详情节点当前和下一步处理人信息
        detailData: state => state.detail.detailData,     // 详情内容数据
        approveVo: state => state.flowUserSelected.approveVo,  // 自由流程信息

      })  
    },
    methods:{
      // 当前点击的按钮，根据 flowApproveButton 组件的 @approveAction 返回的值
      approveAction(name) {
        console.log(name)  
        this.approveActionStatus = name
      },
      // 底部“更多按钮”的点击事件
      actionButtonClick(payload) {
          console.log(payload)
      },
      //预览个人信息
      showPersonList(title,list,type){
        console.log("预览")
      },
      //显示评论弹窗
      showChatToolFun(){
        this.showChatTool = true
        this.autofocus = true
      },
    }
  }
</script>
<style scoped>
  .baoxiaoBtn >>> .ic_average {
    background-image: url("~assets/images/ic_average.png");
  }
  .baoxiaoBtn >>> .text {
    color: #0BBC3F;
  }
</style>
```

## API
|属性|说明|类型|可选值|默认值|
|----|----|----|----|-----|
| FlowAudit | 当前节点流程信息，<br>接口 /portal/flow/flowParallel/ajaxGetFlowAudit.do ，<br>  从 store 的 FlowAuditList 获取 | Object | - | 必填：有审批流程时 <br> 不必填：自由流程 |
| detail | 详情数据 |Object |{ <br> isover  <br> status  <br> creator <br>  isFree <br>  approve  <br>  }| 必填 |
| approveVo | 自由流程转审信息<br>   /workflowAction!getApprove.action，<br>   从 store 的 approveVo 获取  | Object | - | 自由流程时，必填 |
| bottomApproveButton| 底部按钮配置<br>   @/components/flow/config.js 的 bottomApproveButton | Object | {<br>agreeApprove:Object // 同意<br> agreeReApprove:Object // 转审<br> approve:Object // 审批<br> closeApprove:Object // 关闭 <br> editApprove:Object // 编辑 <br> moreApprove:Object // “更多”<br> returnApprove:Object // 退审 <br>} | 非必填
| moreApproveButton| 审批按钮，折叠的按钮配置<br>   @/components/flow/config.js 的 moreApproveButton | Object | {<br>  endApprove:Object //结束  <br>   assignApprove :Object //加签 <br> closeApprove:Object //关闭  <br> editApprove:Object //编辑  <br> flowSerial:Object //流程明细 <br>  }  | 非必填
| IsNotOver | 未关闭 | Boolean | 非必填 | detail.isover!=='-1' 子组件默认用这个条件做了判断，如果不是这个条件，则父组件判断后再传入。下同
| IsNotSolved | 未审批完 | Boolean | 非必填 | detail.status != 2
| IsApprove | 未被审批过 | Boolean| 非必填 | detail.approve=='0'
| IsReturnBack | 被退审 | Boolean| 非必填 | detail.isover === '0'
| IsAuditNotLeave | 下一步处理人未离职 | Boolean| 非必填 | FlowAudit.auditLeave

## detail

`API`中的`detail`配置有以下`key`：

| key | 说明 | 类型 |
|-----------|-----------|--------|
| isover | 审批单具体状态（审批中：“”，退审：0，关闭：-1，完成：1） | String |
| status | 审批状态（0：草稿，1：审批中，2：审批完成） | Number |
| creator | 创建者ID | String |
| isFree | 流程类型（"1"自由流程，"0"固定流程，"3"分支流程） | String/Number | 
| approve | 是否审批过（ "0"未审批过，"1"审批过） | String/Number | 

## bottomApproveButton
`API`中的`bottomApproveButton`为一个对象，对象中的每一个对象配置有以下`key`：

| key | 说明 | 类型 |
|-----------|-----------|--------|
| text | 按钮文案 | String |
| icon | 按钮图标 | String |
| show | 按钮显示隐藏控制 | Boolean |

## moreApproveButton
| key | 说明 | 类型 |
|-----------|-----------|--------|
| text | 按钮文案 | String |
| icon | 按钮图标 | String |
| show | 按钮显示隐藏控制 | Boolean |

## 事件
|属性|说明|参数|
|----|----|----|
| @approveAction | 需要弹窗的按钮操作 | 'agreeApprove'//同意  <br> 'approve'//审批 <br> 'returnApprove'//退审  <br>'agreeReApprove'//转审 <br>  'closeApprove'//关闭<br> 'endApprove'//结束<br>  'assignApprove'//加签|

### 底部按钮显示条件
* 对应 '@/components/flow/config.js' 的 bottomApproveButton
* 对应按钮如不符合子组件默认的显示条件判断，则父组件配置

| 按钮 | 显示条件 | 配置 |
| -----|--------|------|
| “更多” | 被折叠的按钮其中一个显示时 |  bottomApproveButton.moreApprove.show
| 评论输入框 | 以下按钮都不显示时 | bottomButton.chatInputShow.show <br> false: 显示按钮，不显示输入框；<br> true: 不显示按钮，显示输入框 |
| 同意 |  <br> 是当前处理人 <br>未审批完 <br>  自由流程 <br> | bottomApproveButton.agreeApprove.show |
| 转审 |  <br> 是当前处理人 <br>未审批完 <br>  自由流程 <br> | bottomApproveButton.agreeReApprove.show |
| 仅同意 |   <br> 是当前处理人 <br>未审批完 <br> 自由流程 <br> 只有一个处理人 <br>  | 无需配置 |
| 同意并结束 |  <br> 是当前处理人 <br>未审批完  <br>  自由流程 <br> 有多个处理人  <br> | 无需配置 |
| 审批 |   <br> 是当前处理人 <br>未审批完   <br>   下一步处理人未离职 <br> 未被退审 <br> 非自由流程 <br>  | bottomApproveButton.approve.show
| 退审 |  <br> 非自由流程，同“审批”条件一致 <br> 自由流程， 是当前处理人 <br>未审批完  <br> 未被退审  <br> | bottomApproveButton.returnApprove.show
| 关闭 |  <br> 同意、转审、退审、审批按钮无显示 <br> 是提单人 <br> 被退审或  <br> 未关闭 且 未审批过  <br> | bottomApproveButton.closeApprove.show
| 编辑 |  <br> 同“关闭”条件一致 <br>  |  bottomApproveButton.editApprove.show
| 加签 |  <br>未审批完 <br> 未被退审 <br> 允许加签 <br>  | 无需配置 |

### 底部被折叠按钮显示条件
* 对应 '@/components/flow/config.js' 的 moreApproveButton
* 对应按钮如不符合子组件默认的显示条件判断，则父组件配置

| 按钮 | 显示条件 | 配置 |
| -----|--------|------|
| 转审 |  <br> 是当前处理人 <br>未审批完 <br>  自由流程 <br> | moreApproveButton.agreeReApprove.show |
| 结束 |  <br> 是当前处理人 <br>未审批完 <br>  允许提前结束或  <br> 下一步处理人未离职| moreApproveButton.endApprove.show |
| 关闭 |  <br> 同意、转审或 退审、审批按钮显示 <br> 是提单人 <br> 被退审或  <br> 未关闭 且 未审批过  <br> | moreApproveButton.closeApprove.show
| 编辑 |  <br> 同“关闭”条件一致 <br>  |  moreApproveButton.editApprove.show
| 流程明细 |  <br> 非自由流程 <br>  |  moreApproveButton.flowSerial.show

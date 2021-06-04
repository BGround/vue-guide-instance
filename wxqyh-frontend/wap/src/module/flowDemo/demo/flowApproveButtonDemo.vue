<template>
  <div>
    <!--审批请示按钮-->
    <flow-approve-button
      :FlowAudit="FlowAuditList[0]"
      :detail="flowApproveDetail"
      @approveAction="approveAction"
      :bottomApproveButton="bottomButton"
    >
      <!--自定义底部按钮，要保持样式统一，一定要用 flow_action_btn 组件-->
      <!--自定义样式
        图标
        .flowApproveButton >>> .ic_average {
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
          icon="icon_a-review_review"
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
  </div>
</template>

<script>
  import {flow_action_btn} from '@/components/base/button'
  import FlowApproveButton from '@/components/flow/flowApproveButton'
  import {bottomApproveButton} from '@/components/flow/config'
  import DialogMaskItem from '@/components/base/dialog_mask_bottom_item'
  import detailData from './detailData'

  export default {
    name: "flow-approve-button-demo",
    components: {
      FlowApproveButton,
      FlowActionButton: flow_action_btn,
      DialogMaskItem,
    },
    data() {
      return {
        FlowAuditList: detailData.flowUserSelected.FlowAuditList,
        flowApproveDetail: {
          approve:"1",
          creator:"13821f42790d0819757d4d306d1ac8a5",
          isFree:"0",
          isover:"",
          status:"1",
        },
        // 自定义底部按钮
        bottomButton: {
          ...bottomApproveButton,
          chatInputShow: {
            show: false,
          },
          approve: {
            ...bottomApproveButton.approve,
            text: '审批1'
          }
        }
      }
    },
    methods: {
      approveAction(payload) {
        alert(payload)
      },
      actionButtonClick(payload) {
        alert(payload)
      }
    }
  }
</script>

<style scoped>
  .flowApproveButton >>> .ic_average {
    background-image: url("~assets/images/ic_average.png");
  }
  .baoxiaoBtn >>> .text {
    color: #0BBC3F;
  }
</style>

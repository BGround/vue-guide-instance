# 审批弹窗
```vue
  <!--选择节点处理人 弹窗-->
    <flow-approve-dialog
      v-if="flowApproveDialogShow"
      :agent="agent"
      :action="approveActionStatus"
      :config="dialogConfig"
      :detail="flowApproveDetail"
      @showPersonList="showPersonList"
      @saveNodeAuditUserJson="commitTask"
      >
    </flow-approve-dialog>
    
  <script >
      import FlowApproveDialog from '@/components/flow/flowApproveDialog'
      import { approveDialogConfig } from '@/components/flow/config'
      export default {
          components: {
            FlowApproveDialog,
          },
          data() {
            return {
              // 和 flowApproveButton 组件的props "detail"一致
              flowApproveDetail: {
                creator: '',        // 提单人ID  
              },
              // 应用的agentCode
              agent:'',
              
              /* 当前点击的按钮，根据 flowApproveButton 组件的 @approveAction 返回的值
                   <flow-approve-button
                     @approveAction="approveAction">
                   </flow-approve-button>
                   
                   approveAction(name) {
                     this.approveActionStatus = name
                   }
               */
              approveActionStatus: '',
              
              // 如果要修改弹窗配置的某一项，请参考下面的方式更改
              dialogConfig: {
                ...approveDialogConfig,
                approve: {
                    ...approveDialogConfig.approve,
                    status:2,
                },
                returnApprove: {
                    ...approveDialogConfig.returnApprove,
                    status: 3,
                }
              }
            }
          },
          computed: {
            ...mapState({
              // 选择审批人弹窗
              flowApproveDialogShow: state => state.flowUserSelected.flowApproveDialogShow,
            })  
          },
          methods:{
            //预览个人信息
            showPersonList(title,list,type){
              console.log("预览")
            },
            // 保存提交数据
            commitTask(data) {
              console.log("提交接口请求")
              console.log(data)
            }
          }
        }
  </script>
```

# API
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|-----|------|-------|-------|
| agent | 应用的agentCode | String | - | 必填 |
| action | 当前点击的按钮，根据 flowApproveButton 组件的 @approveAction 返回的值 | String | agreeApprove // 同意    <br>     agreeReApprove // 转审    <br>     agreeEndApprove // 同意并结束     <br>     approve // 审批      <br>      returnApprove  // 退审    <br>     closeApprove // 关闭    <br>     endApprove //  结束    <br>     assignApprove // 加签    <br>     ""  // 新增 | false |
| config | 弹窗的配置 | Object | 非必填 | 参考 /components/flow/config 的 approveDialogConfig
| flowApproveDetail | 单的详情数据 | Object | 必填 | { <br> creator  //创建者ID  <br>}


# approveDialogConfig
* 说明
可自定义弹窗配置的某一项

```
agreeApprove // 同意 
agreeReApprove // 转审 
agreeEndApprove // 同意并结束 
approve // 审批 
returnApprove // 退审 
closeApprove // 关闭 
endApprove // 结束 
assignApprove // 加签
```

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|-----|------|-------|-------|
| title | 标题 | String | - | - |
| reason | 审批意见 | String | - | - |
| approveTip | 未输入时的提示语 | String | - | - |
| status | 传给后台的标记 | String / Number | - | - |
| isShowAssign | 显示手写签名入口 | Boolean | - | - |
| usePresetSignShow | 是否显示开启存档签名的入口 | Boolean | - | - |

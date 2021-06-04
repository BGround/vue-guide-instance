

### mixin引入，新建和详情页面的流程组件和计算属性都不需要进行定义

```javascript
  import flowManager from '@/components/mixins/flow-manager';
```
```javascript
    mixins: [flowManager]
```

### 新建模板

#### 选择处理人 (title 可自定义，loadLastConfig：加载上一次配置、confirmPick： 点击加载上一次按钮触发、FlowAuditUserShowBox：选择审批人入口触发)
```javascript
    <div v-if="FlowAuditUser.length">
      <user-selected-group
        v-if="item && item.startAuditList.show"
        v-for="(item,index) in FlowAuditUser"
        :key="index"
        :title="startAuditTitle(item.nodeName)"
        :mustChoose="true"
        :loadLast="loadLastConfig.toPersonList"
        @confirmPick="confirmPick">
        <user-selected-item
          slot="user_selected_item"
          :title="startAuditTitle(item.nodeName)"
          :isEdit="item.startAuditList.isCanEdit"
          :List="item.startAuditList.userSelected"
          @showPersonList="showPersonList"
          @showUserSelectedBox="FlowAuditUserShowBox(index)"
          @removeSelected="(payload)=>removeFlowAuditUser({delUserIndex:payload.index,index})"
          :isRemove="FlowAuditUser
                      && FlowAuditUser[index]
                      && FlowAuditUser[index].startAuditList.isCanEdit
                      && FlowAuditUser[index].startAuditList.isCanDelete">
        </user-selected-item>
    
```

#### 相关人（示例: ccPersonListShowBox 点击添加相关人按钮触发，removeCCPerson删除相关人）
```javascript
    <user-selected-group
      title="相关人"
      :loadLast="loadLastConfig.ccPersonList"
      @confirmPick="confirmPick"
    >
      <user-selected-item
        :userTotal="ccPersonList.length"
        :List="ccPersonList"
        title="相关人"
        @showPersonList="showPersonList"
        @showUserSelectedBox="ccPersonListShowBox"
        slot="user_selected_item"
        @removeSelected="removeCCPerson">
      </user-selected-item>
    </user-selected-group>
    
```

### 处理人范围选人

```javascript
    <user-selected-rang
      v-if="FlowAuditUserBoxShow"
      :options="FlowAuditUser[appointUserIndex].startAuditList.flowUserList"
      :selectType="FlowAuditUser[appointUserIndex].startAuditList.selectType.type"
      :checkedType="FlowAuditUser[appointUserIndex].startAuditList.selectType.checkedType"
      :config="FlowAuditUser[appointUserIndex].startAuditList.selectType"
      :defaultAllSelect="FlowAuditUser[appointUserIndex].startAuditList.defaultAllSelect"
      :checked="FlowAuditUserIds(appointUserIndex)"
      @FlowAuditUserResult="FlowAuditUserResult"
    >
    </user-selected-rang>
```
#### 处理人范围选人弹窗

```javascript
    <flow-approve-dialog
      v-if="flowApproveDialogShow"
      :agent="agentCode"
      @showPersonList="showPersonList"
      @saveNodeAuditUserJson="commitTask"
    >
    </flow-approve-dialog>
```
#### 查看全部人员列表组件
```javascript
    <user-preview
      v-bind="userPreviewConfig"
      :show.sync="showPerson"
    ></user-preview>
```

### methods

#### 初始化编辑流程 （示例: editFlowTemplate（id） id：审批单id）
```javascript
  beforeCreate(){
      //...
      //更新refId必须在created周期之前进行
      this.editFlowTemplate(id)
  }
```
```javascript
  methods:{
    //...是编辑页面，并初始化
    editFlowTemplate (id) {
        //更新refId必须在created周期之前进行
         this.updateUserSelectedState({type:'refId',data: id}) 
         //返回数据
         ...
         (res=>{
            //初始化查询到编辑历史的模板id、流程id、审批人、相关人等
            this.updateUserSelectedState({type: "isFree", data: res.isFree})
            this.updateUserSelectedState({type: 'flowId', data: res.flowId});
            this.$store.commit('updateUserSelected', res.toPersons);
            this.updateCCPerson(res.ccPersons);
            ...
            //初始化当前的流程节点
            this.getFlowTemplate()
         })
    }
  }
```

#### 若改变当前流程模板，需要查询当前模板的流程类型（各应用业务不同，有些应用没有切换模板功能）
```javascript
  templateChange(data){
      //重置流程数据
      this.resetFlowData()
      // 重置加载上一次数据
      this.resetLoadLastConfig()
      
      // ...其他逻辑操作(更新当前相关人、加载上一次状态)
      
       //根据流程类型查询当前节点
      this.getFlowTemplate(id)
  }
```

#### 初始化当前的流程节点，getFlowTemplate
```javascript
  methods:{
    //根据流程类型查询当前节点
    getFlowTemplate (id){
         //返回数据
         ...
         (res=>{
            if(res.isFree == "0" || res.isFree == "3" ){
                //更新流程类型,查询流程节点
                let params = {
                  id: id,
                  agentCode: this.agentCode,
                  isBranchFlow: res.isFree == '3'? true : false
                }
                //查询当前节点
                this.getAuditFlowListFun(res.isFree,params)
            }else{
                //更新流程类型
                this.updateUserSelectedState({type: "isFree", data: '1'})
            }
         })

    }
  }
```


#### 提交
#### 
```javascript
 methods:{
    checkCommit(){
        ...
        
        //非保存草稿
        //检验流程字段是否填写，是否存在分支流转
        this.checkFlowUserConfirmFun(()=>{
          //校验成功回调
          this.commitTask()
        })
    },
    //提交请求操作
    commitTask(){
        ...
    }
 }
```

### 详情模板

####   当前审批人(title 标题可自定义，showPersonList触发显示审批人列表、atThisPersonUtil @人 触发)

```javascript
        <div v-if="FlowAuditList.length">
          <user-selected-group
            v-for="(item,index) in FlowAuditList"
            :key="index"
            :title="detailAuditTitle(item)"
            :isEdit="false">
            <user-selected-item
              :title="detailAuditTitle(item)"
              :List="item.auditUserList"
              :isEdit="false"
              @showPersonList="showPersonList"
              @atThisPersonUtil="atThisPersonUtil"
              slot="user_selected_item">
            </user-selected-item>
          </user-selected-group>
        </div>
```
#### 自由流程审批人 (title 标题可自定义)

```javascript
      <user-selected-group
        v-if="freeAuditList.length"
        title="审批人"
        :isEdit="false">
        <user-selected-item
          title="审批人"
          :List="freeAuditList"
          :isEdit="false"
          @showPersonList="showPersonList"
          @atThisPersonUtil="atThisPersonUtil"
          slot="user_selected_item"
          >
         </user-selected-item>
      </user-selected-group>
```
#### 下一步处理人 (title 标题可自定义)

```javascript
      <user-selected-group
        v-if="FlowAuditListShow"
        title="下一步处理人" :isEdit="false">
        <user-selected-item
          title="下一步处理人"
          :List="FlowAuditList[0].nextAuditList"
          :isEdit="false"
          @showPersonList="showPersonList"
          @atThisPersonUtil="atThisPersonUtil"
          slot="user_selected_item">
        </user-selected-item>
      </user-selected-group>
```
#### 相关人 (title 标题可自定义)

````javascript
      <user-selected-group
        v-if="ccPersonList.length"
        title="相关人" :isEdit="false">
        <user-selected-item
          title="相关人"
          :List="ccPersonList"
          :isEdit="false"
          @showPersonList="showPersonList"
          @atThisPersonUtil="atThisPersonUtil"
          slot="user_selected_item">
        </user-selected-item>
      </user-selected-group>
````

#### 审批按钮 （approveVo转审配置、flowApproveDetail审批按钮需要用到的节点详情数据、moreButton更多按钮配置、approveAction审批按钮点击回调、actionButtonClick更多按钮点击回调）

````javascript
    <flow-approve-button
      :FlowAudit="FlowAuditList[0]"
      :detail="flowApproveDetail"
      :approveVo="approveVo"
      :moreApproveButton="moreButton"
      @showChatTool="showChatToolFun"
      @actionButtonClick="actionButtonClick"
      @approveAction="approveAction">
    </flow-approve-button>

````
### 窗口定位弹窗

#### 并行流程选择节点（非并行可不定义，selectNodeClick选择某节点 点击触发）

```javascript
    <select-node @selectNodeClick="selectNodeClick"></select-node>
```

#### 流程明细

```javascript
    <flow-serial v-if="flowSerial.isShowFlowSerial"
                 :flowSerialData="flowSerial"
                 :isover="flowSerial.isover" >
    </flow-serial>
```

#### 选择节点处理人 弹窗（approveActionStatus当前点击的按钮索引、flowApproveDetail审批按钮需要用到的节点详情数据、commitTask 确认提交数据）

```javascript
    <flow-approve-dialog v-if="flowApproveDialogShow"
      :agent="agent"
      :action="approveActionStatus"
      :detail="flowApproveDetail"
      @showPersonList="showPersonList"
      @saveNodeAuditUserJson="commitTask"
    >
    </flow-approve-dialog>
```
#### 处理人范围选人弹窗

```javascript
    <user-selected-rang v-if="FlowAuditUserBoxShow"
      :options="FlowAuditUser[appointUserIndex].startAuditList.flowUserList"
      :selectType="FlowAuditUser[appointUserIndex].startAuditList.selectType.type"
      :checkedType="FlowAuditUser[appointUserIndex].startAuditList.selectType.checkedType"
      :config="FlowAuditUser[appointUserIndex].startAuditList.selectType"
      :defaultAllSelect="FlowAuditUser[appointUserIndex].startAuditList.defaultAllSelect"
      :checked="FlowAuditUserIds(appointUserIndex)"
      @FlowAuditUserResult="FlowAuditUserResult"
      >
    </user-selected-rang>
```
#### 查看全部人员列表组件
```javascript
    <user-preview
      v-bind="userPreviewConfig"
      :show.sync="showPerson"
    ></user-preview>
```

### 详情 

#### 底部审批显示更多按钮
```javascript
  import { bottomApproveButton, moreApproveButton } from '@/components/flow/config'
  import {mapState,mapGetters, mapMutations,mapActions} from 'vuex';
```

#### data
```javascript
  data(){
    return {
        // 如果要修改折叠按钮的某一项，请参考下面的方式更改
        moreButton: {
          ...moreApproveButton,
          flowSerial: {
            ...moreApproveButton.flowSerial,
            show: true,
          }
        },
         // 自由流程审批人列表
        freeAuditList: [],   
        // 审批按钮需要用到的节点详情数据
        flowApproveDetail: {}, 
         //显示评论输入框
         showChatTool:false
    }
  }
```

### 流程数据初始化 （methods）

#### 并行需要定义方法(选择并行的某一节点进行审批)

```javascript
      selectNodeClick (item,data){
        //更新当前节点
        this.updateUserSelectedState({type: "currentNodeId", data: item.nodeId})
        
        //进行详情页面接口查询方法，此处省略不写
        // callBack()
      }
```
####  更新审批单id  更新refId必须在created周期之前进行（审批单id）
```javascript
    beforeCreate(){
        this.updateUserSelectedState({type: "refId", data: self.refId})
    }
```

#### 详情数据请求完成，需要初始化流程数据（示例:requestDetail）
```javascript
methods:{
    requestDetail(){
        let self = this;
        ...(res=>{
          let detail = result.data.detail
          let isFree = detail.isFree == "0" || detail.isFree == "3" ?detail.isFree:'1'
          //更新流程类型
          self.updateUserSelectedState({type: "isFree", data: isFree})
          //初始化并显示审批按钮
          self.flowApproveDetail = Object.assign({},self.flowApproveDetail,{
            isover: detail.isover,
            status:  detail.moveapproveStatus,
            creator: detail.creator,
            isFree: detail.isFree,
            approve: result.data.approve,
          })
          
          //判断是否是并行，是就查询并行接口获取节点列表(无并行不需要判断)
          if (result.data.detail && result.data.detail.currentNodeId.indexOf(',')!=-1){
              //...查询并行接口数据
          } else {
            //非并行流程
            //更新当前节点
            const currentNodeId = result.data.detail? result.data.detail.currentNodeId : ''
            self.updateUserSelectedState({type: "currentNodeId", data: currentNodeId})
            
            //更新明细数据
            self.flowSerial.isover = data.detail.isover;
            self.flowSerial.isFreeFlow = self.isFree;  
            // ...自由流程获取转审人员
            self.getApprove(self.refId);
            //...dealDetailData(detail) 处理详情数据
        })
    },
    dealDetailData(data){
        //...处理详情数据
        //...审批状态判断
        //...自由流程显示审批人列表
        if(this.isFree ==='1' ...){
          this.freeAuditList.length = 0
          this.freeAuditList.push(...data.detail.toPersons)
        }
        //更新相关人
        this.updateCCPerson(data.detail.ccPersons)
    }
 
``` 

### 点击更多按钮操作 （methods 示例）

```javascript
methods:{
      actionButtonClick(payload) {
        // 底部按钮点击查看流程明细
        if(payload==='getFlowSerial') {
          this.getFlowSerial('getFlowSerial')
        }
        //其他逻辑操作（自定义）
        // 如果是编辑
        if(payload==='editApprove') {
          ...
        }
        ...
      },
}
```
### 点击其他审批按钮（methods 示例）
#### 按钮状态（ assignApprove: 加签、returnApprove： 退审、agreeEndApprove：同意、 approve： 审批 、agreeReApprove： 转审 ，closeApprove： 关闭、editApprove：编辑 ， assignApprove： 加签）
```javascript
methods:{
      approveAction(payload) {
        this.approveActionStatus = payload
        // 如果是“审批”
        if(payload==='approve') {
          if (this.isFree == 3 && this.isBranchNode) {
            let params = {
              initRefId: this.refId? this.refId:'',
              templateRefId: this.templateRefId,
              currentNodeId: (this.isBranchNode && this.defaultNextNodeId)? this.defaultNextNodeId:this.currentNodeId,
            }
            this.requestNextBranchNode(params)
          }
        }
        //...其他按钮逻辑（自定义）
        
        //显示审批弹窗（不需要显示可不写）
        this.updateUserSelectedState({type: "flowApproveDialogShow", data: true})
      }
}
```
### commitTask 提交数据

```javascript
methods:{
    commitTask(payload){
        //...提交数据处理
    }
}
```

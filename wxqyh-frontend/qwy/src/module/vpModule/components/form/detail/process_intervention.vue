<template>
  <div class="qwui-dialog_overlay">
    <div class="qwui-mask z-index_top"></div>
    <!--弹窗类型1-->
    <div class="qwui-dialog z-index_top">
      <!--普通弹窗标题-->
      <div class="qwui-dialog_header">
        <strong class="qwui-dialog_title">流程干预&emsp;</strong>
        <div class="qwui-parallel-tip" v-show="!isFree && FlowAuditUser.length && FlowAuditUser[0].vo.nodeStatus == 4">
          <img class="qwui-dialog_vipmark" src="../../../assets/images/form-vip_tips.png">
          <span>当前流程已进入并行流程中流转</span>
        </div>
        <img src="../../../assets/images/btn_close.png" alt="" class="qwui-dialog_title_close" @click="close">
      </div>
      <!--自由流程-->
      <div v-if="isFree" class="qwui-dialog_content">
        <div class="qwui-nodes">
          <div class="qwui-dialog_content-title">处理人</div>
          <ul class="qwui-addPerson" @click="showPick(0)">
            <!--  人员选择  -->
            <li class="qwui-inline">
              <div class="qwui-dept_selected" v-for="item in nodePerson[0].userList" :key="item.userId">
                <img v-if="item.headPic && item.headPic!='0'" class="qwui-dept_selected_icon" :src="item.headPic">
                <div v-else class="qwui-user_default_img"></div>
                {{item.personName}}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!--非自由流程-->
      <div v-else class="qwui-dialog_content">
        <div class="qwui-nodes" v-for="(item, index) in nodePerson" :key="index">
          <div class="qwui-dialog_content-title"><span v-show="nodePerson.length > 1">并行分支{{index + 1}}</span>流转至节点
          </div>
          <div class="drop-field">
            <select class="qwui-dropdown"
                    :class="{'qwui-dropdown-disabled' : isOver(item) }"
                    v-model="targetNodeId[index]"
                    @change="getNodePerson(targetNodeId[index], index)"
                    :disabled="isOver(item)">
              <option v-for="node in nodeIds[index]" :key="node.nodeId" :value="node.nodeId">
                <span v-if="isOver(item)">该并行分支已结束,无法干预</span>
                <span v-else>{{node.nodeName}}</span></option>
            </select>
          </div>
          <div v-show="!isOver(item)">
            <div class="qwui-dialog_content-title">该节点处理人</div>
            <ul class="qwui-addPerson" @click="showPick(index)">
              <!--  人员选择  -->
              <li class="qwui-inline">
                <div class="qwui-dept_selected" v-for="(item,index) in nodePerson[index].userList" :key="item.userId">
                  <img v-if="item.headPic && item.headPic!='0'" class="qwui-dept_selected_icon" :src="item.headPic">
                  <div v-else class="qwui-user_default_img"></div>
                  {{item.personName}}
                </div>
              </li>
              <!--<div class="qwui-click_choose_word">-->
              <!--修改-->
              <!--</div>-->
            </ul>
            <div v-if="nodePerson[index].userList.length > 1" class="ipt-cb" @click="setIsSign(index)">
              <span class="input-cb-off" :class="{'input-cb-on':nodePerson[index].auditVO.isSign == '0'}"></span><span>当前节点启用会签</span>
            </div>
          </div>
        </div>
      </div>
      <div class="qwui-dialog_footer">
        <a href="javascript:;" class="qwui-dialog_btn qwui-dialog_btn_primary" @click="saveChange">
          确定</a>
        <a href="javascript:;" class="qwui-dialog_btn qwui-dialog_btn_primary qwui-dialog_btn_default " @click="close">
          取消</a>
      </div>
    </div>
    <pick-person :show="show"
                 :defaultUsers="defaultUsers"
                 :functionTab="functionTab"
                 :maxUser="maxUser"
                 @chooseDone="chooseDone"
                 @closeThis="closeThis"></pick-person>
  </div>
</template>
<script>
  import pickPerson from 'components/pickPerson/pickPerson'
  import crmPickPerson from 'components/pickPerson/crmPickPerson'
  import {getIntercenceNode, getFlowNodes, saveNodeChange, getParallelFlow} from 'vpModule/api/form/list'

  export default {
    name: "processInteration",
    components: {
      pickPerson,
      crmPickPerson
    },
    props: {
      flow: {
        type: Object,
        required: true
      },
      refId: {
        type: String,
        required: true
      },
      isFirstIntervene: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        show: false,
        isSign: false,
        functionTab: [
          {text: '特定人员'},
          {text: '标签人员'},
        ],
        defaultUsers: [],
        useUsers: [],
        maxUser: 500,

        //审批单
        sourceNodeId: [],  //起始节点id
        targetNodeId: [],  //目标节点id
        nodeIds: [],       //可干预节点
        nodePerson: [{
          auditVO: {},
          userList: [],
        }],    //节点和节点负责人
        curIndex: 0,       //第n个节点打开的选人控件
        hasChange: [],      //有修改过
        currentNodeIds: []
      }
    },
    computed: {
      FlowAuditUser() {
        return this.$store.state.userSelected.FlowAuditUser;
      },
      controlPO() {
        return this.$store.state.detail.detailData.controlPO;
      },
      detailsPO() {
        return this.$store.state.detail.detailData.detailsPO;
      },
      detailData() {
        return this.$store.state.detail.detailData;
      },
      isFree() {
        return this.controlPO.isFreeFlow == "1";
      }
    },
    created() {
      if (this.isFree) {
        this.isFreeFlow();
      } else {
        this.isApprovalFlow();
      }
    },
    methods: {
      //并行分支结束
      isOver(item) {
        return this.FlowAuditUser.length && this.FlowAuditUser[0].vo.nodeStatus == 4 && item.auditVO.auditStatus == 1;
      },
      close(success) {
        this.$emit('closeProcess', success);
      },
      isFreeFlow() {
        getParallelFlow({
          refId: this.refId,
          isFreeFlow: this.isFree
        }).then(res => {
          if (res.code == '0') {
            this.nodePerson[0].userList = res.data.NodeAndHandles[0].handleUserList;
          } else {
            _.alert('提示', res.desc)
          }
        })
      },
      //非自由流程
      isApprovalFlow() {
        if (this.FlowAuditUser.length && this.FlowAuditUser[0].vo.nodeStatus == 4) {   //并行流程
          _.showLoading();
          getParallelFlow({
            refId: this.refId,
            isFreeFlow: this.isFree
          }).then(res => {
            _.hideLoading()
            if (res.code == '0') {
              this.nodePerson = [];
              res.data.NodeAndHandles.forEach((item, index) => {
                this.nodePerson.push({
                  auditVO: item.auditVO,
                  userList: item.handleUserList,
                })
                this.sourceNodeId.push(item.auditVO.nodeId);
                this.targetNodeId.push(item.auditVO.nodeId);
//                并行未结束
                if (item.auditVO.auditStatus != 1) {
                  this.getNode(item.auditVO.nodeId, index);
                } else {
                  this.$set(this.nodeIds, index, [{nodeId: item.auditVO.nodeId}])
                }

              })
            } else {
              _.alert("提示", res.desc)
            }
          })
        } else {
          //非并行流程节点直接选择
          var nodeId = this.flow.nodeId;
          this.sourceNodeId.push(nodeId);
          this.targetNodeId.push(nodeId);
          this.getNode(nodeId, 0);
          if (this.isFirstIntervene) {
            //进入单第一次干预使用ajaxGetFlowAudit接口返回的节点信息
            if (!this.FlowAuditUser[0].vo.nodeId.includes('-')) {
              [this.FlowAuditUser[0].vo.id, this.FlowAuditUser[0].vo.nodeId] = [this.FlowAuditUser[0].vo.nodeId, this.FlowAuditUser[0].vo.id]
            }
            this.$set(this.nodePerson, 0, {
              auditVO: this.FlowAuditUser[0].vo,
              userList: this.FlowAuditUser[0].auditUserList
            })
          } else {
            this.getNodePerson(nodeId, 0);
          }
        }
      },
      chooseDone(dept, tag, user) {
        this.defaultUsers = user.slice(0);
        this.nodePerson[this.curIndex].userList = this.defaultUsers;
        this.hasChange[this.curIndex] = true,
          this.show = false;
      },
      closeThis() {
        this.show = false;
      },
      showPick(index) {
        if (this.nodePerson[index].auditVO && this.nodePerson[index].auditVO.nodeName == '填写表单') return;
        this.curIndex = index;
        this.defaultUsers = [];
        if (this.nodePerson[index].userList) {
          this.nodePerson[index].userList.forEach(item => {
            this.defaultUsers.push({
              personName: item.personName,
              headPic: item.headPic,
              userId: item.userId
            })
          })
        }
        this.show = !this.show
      },
      //选择会签
      setIsSign(index) {
        this.hasChange[index] = true,
          this.nodePerson[index].auditVO.isSign = this.nodePerson[index].auditVO.isSign == '1' ? "0" : "1";
      },
      //获取可干预节点的信息
      getNode(nodeId, index) {
        var _this = this;
        var data = {
          nodeId,
          refId: this.refId,
          isBranch: this.flow.isBranchFlow,
          isMiddleNode: this.FlowAuditUser.length != 0 && this.FlowAuditUser[0].vo.nodeStatus == 4,
        }
        getFlowNodes(data).then(res => {
          _this.$set(_this.nodeIds, index, res.data.interveneNodes)
        })
      },
      //获取当前节点的负责人信息
      getNodePerson(nodeId, index) {
        var _this = this;
        if (this.sourceNodeId[index] == nodeId && this.isFirstIntervene) {
          return this.$set(this.nodePerson, index, {
            auditVO: this.FlowAuditUser[index].vo,
            userList: this.FlowAuditUser[index].auditUserList
          })
        }
        var data = {
          nodeId,
          refId: this.refId
        };
        getIntercenceNode(data).then(res => {
          _this.$set(_this.nodePerson, index, res.data)
        });
      },
      saveChange() {
        var _this = this,
          isEmpty = false,
          finishFlow = false,
          extraJson = {};
        extraJson = {orderVersion: this.detailData.orderVersion};
        this.nodePerson.forEach(item => {
          if (_.isNull(item.userList) && !this.isOver(item)) {
            isEmpty = true;
          }
          if (item.auditVO.nodeName == '结束节点') {
            finishFlow = true;
          }
        })
        if (finishFlow) {
          return _.alert("提示", '干预到结束节点后明细将停止流转，确定结束此流程？', {
            primaryBtn: {
              name: "i18n.confirm", callBack: function () {
                _this.close('finishFlow')
              }
            },
            defaultBtn: {name: "取消", callBack: null},
          })
        }
        if (isEmpty) return _.alert('提示', '至少选择一个处理人')
        var nodeJson = [],
          userIds = [],
          currentNodeIds = [],  //修改过的nodeId
          currentNames = [],
          data = {},
          modified = false;  //判断有没有修改过
        if (this.controlPO.isFreeFlow == '1') {
          if (!this.hasChange[0]) {
            return this.close();
          }
          this.nodePerson[0].userList.forEach(item => {
            userIds.push(item.userId)
          })
          nodeJson.push({
            "sourceNodeId": "isFree",
            "targetNodeId": "isFree",
            "userIds": userIds.join('|'),
          });
          data = {
            refId: this.refId,
            nodeJson: JSON.stringify(nodeJson),
            agentCode: "form",
            isFree: this.controlPO.isFreeFlow,
            versionId: this.detailsPO.definitionVersionsId,
            extraJson:JSON.stringify(extraJson),
          }
        } else {
          this.nodePerson.forEach((item, index) => {
            if (!this.isOver(item)) {
              currentNodeIds.push(item.auditVO.nodeId)
              currentNames.push(item.auditVO.nodeName)
            }
            if (this.sourceNodeId[index] != this.targetNodeId[index] || this.hasChange[index]) {
              modified = true;
              item.userList.forEach(item => {
                if (!userIds[index]) userIds[index] = [];
                userIds[index].push(item.userId)
              })
              nodeJson.push({
                "sourceNodeId": this.sourceNodeId[index],
                "targetNodeId": this.targetNodeId[index],
                "userIds": userIds[index].join('|'),
                "isSign": item.auditVO.isSign
              })
            }
          })
          if (!modified) return this.close(); //没有修改则不请求保存接口
          data = {
            refId: this.refId,
            nodeJson: JSON.stringify(nodeJson),
            agentCode: "form",
            isFree: this.controlPO.isFreeFlow,
            versionId: this.detailsPO.definitionVersionsId,
            currentNodeIds: currentNodeIds.join('|'),
            currentNames: currentNames.join('|'),
            extraJson:JSON.stringify(extraJson),
          }
        }
        _.showLoading();
        saveNodeChange(data).then(res => {
          _.hideLoading();
          if (res.code != '0') {
            return _.alert('提示', res.desc);
          };
          this.detailData.orderVersion = res.data.extraJson.orderVersion;
          _this.flow.nodeId = _this.targetNodeId.join(',');
          _this.close('success');
        });
      }
    }
  };
</script>
<style scoped>
  .qwui-dialog_overlay.active {
    opacity: 1;
  }

  .qwui-mask {
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.2);
  }

  .qwui-dialog {
    position: fixed;
    z-index: 11;
    top: 50%;
    left: 50%;
    width: 80%;
    max-width: 640px;
    transform: translate(-50%, -50%);
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .qwui-dialog_header {
    padding: 21px 28px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    vertical-align: bottom;
    background-color: #F7F7F7;
  }

  .qwui-parallel-tip {
    display: inline-block;
    font-size: 14px;
    color: #333;
  }

  .qwui-dialog_vipmark {
    display: inline-block;
    margin: 0 3px -3px;
    width: 16px;
  }

  .qwui-dialog_title {
    font-size: 18px;
    color: #333;
    font-weight: 400;
    line-height: 28px;
  }

  .qwui-dialog_title_close {
    float: right;
    margin: 6px;
  }

  .qwui-nodes {
    padding: 28px 0;
    border-top: 1px solid #f0f0f0;
  }

  .qwui-nodes:first-child {
    border: none;
  }

  .qwui-dialog_content {
    max-height: 453px;
    padding: 0 28px;
    font-size: 14px;
    color: #333;
    word-wrap: break-word;
    word-break: break-all;
    overflow-y: scroll;
  }

  .qwui-dialog_content .qwui-dialog_content-title {
    margin-bottom: 16px;
    color: #383838;
    line-height: 1;
  }

  .qwui-dialog_content-content {
    color: #666;
  }

  .qwui-dialog_footer {
    text-align: center;
    padding: 20px;
  }

  .qwui-dialog_btn_primary {
    display: inline-block;
    height: 32px;
    padding: 0 20px;
    margin: 0 10px;
    font-size: 14px;
    background: #C31725;
    border-radius: 2px;
    line-height: 32px;
    color: #fff;
  }

  .qwui-dialog_btn_default {
    background: #fbfbfb;
    color: #666;
    border: 1px solid #cbcbcb;
  }

  .qwui-liuchengganyu {
    display: block;
    width: 100%;
  }

  .qwui-dropdown {
    position: relative;
    width: 100%;
    height: 40px;
    margin-bottom: 24px;
    padding: 10px;
    font-size: 15px;
    color: #666;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
    line-height: 1;
  }

  .qwui-dropdown.qwui-dropdown-disabled {
    margin: 0;
    background: #f5f5f5;
    border: none;
  }

  .qwui-addPerson {
    min-height: 40px;
    padding: 4px;
    overflow: hidden;
    border: 1px dashed #dcdcdc;
    border-radius: 2px;
    border-top: 1px dashed #ccc;
  }

  .qwui-addPerson-head {
    float: left;
    width: 30px;
    height: 30px;
  }

  .qwui-addPerson-name {
    float: left;
    display: inline-block;
    padding: 0 6px;
    background: #fbfbfb;
    color: #333;
    font-size: 14px;
    line-height: 30px;
  }

  .qwui-addPerson-personList {
    float: left;
    display: inline-block;
    overflow: hidden;
    margin: 4px;
    border: 1px solid #e9e9e9;
    border-radius: 1px;
  }

  .ipt-cb {
    margin-top: 12px;
    font-size: 14px;
    color: #333;
  }

  .input-cb-off {
    content: "";
    vertical-align: sub;
    margin-right: 8px;
    background: url(../../../../../assets/images/checkbox_off.png) no-repeat;
    width: 16px;
    height: 16px;
    background-size: contain;
    display: inline-block;
  }

  .input-cb-on {
    background: url(../../../../../assets/images/checkbox_on.png) no-repeat center center;
    background-size: contain;
  }

  .qwui-dept_selected {
    display: inline-block;
    height: 32px;
    margin: 4px;
    padding-right: 12px;
    line-height: 32px;
    list-style: none;
    background-color: #FBFBFB;
    border: 1px solid #E9E9E9;
    border-left: none;
    vertical-align: top;
  }

  .qwui-dept_selected_icon {
    display: inline-block;
    width: 31px;
    height: 30px;
    margin-right: 8px;
    list-style: none;
    vertical-align: top;
    background: url(../../../../../assets/images/dept_icon.png) no-repeat center;
  }

  .qwui-inline {
    display: inline;
    vertical-align: middle;
  }

  .qwui-user_default_img {
    display: inline-block;
    width: 31px;
    height: 30px;
    margin-right: 8px;
    list-style: none;
    vertical-align: top;
    background: url(../../../../../assets/images/touxiang02.png) no-repeat center;
    background-size: 26px 24px;
  }

  .qwui-tag_selected_icon {
    display: inline-block;
    width: 31px;
    height: 30px;
    margin-right: 8px;
    list-style: none;
    vertical-align: top;
    background: url(../../../../../assets/images/tag_icon02.png) no-repeat center;
  }
</style>

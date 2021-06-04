<template>
  <div>
    <div class="flow_list_wrap">
      <div class="qwui-flow_list">
        <div class="qwui-user_cell_title">
          <p class="title qwui-flow_list-title">审批流程
            <span class="qwui-required_mark">*</span>
          </p>
        </div>
      </div>
      <ul class="flow_list">
        <li class="flow_list_item" v-for="(item,index) in flowList" :key="item.id">
          <label class="flow_name" @click="getFlowAuditUser(item.id)">
            <input type="radio" class="icon_check" :checked="item.id==flowId">
            <p>{{item.name}}</p>
          </label>
          <div class="icon_help" @click.stop="showFlowNode(item.id,item.name)"></div>
        </li>
      </ul>
    </div>
    <div class="process_pop" v-if="isShowFlowNode">
      <div class="process_mask">
        <div class="process_head">{{flowName}}</div>
        <div class="process_content">
          <div class="process_list">
            <div class="process_item">
              <div class="title">
                <i class="icon_step"></i>
                <div class="name">
                  <p>提单</p>
                </div>
              </div>
              <div class="content"></div>
            </div>
            <div class="process_item" v-for="(item,index) in nodeList" :key="item.id">
              <div class="title">
                <i class="icon_step">{{index + 1}}</i>
                <div class="name">
                  <p>{{item.nodeName}}</p>
                </div>
              </div>
              <div class="content">
                <p>[{{nodeType[item.nodeType - 1]}}{{item.isSign == 0 ? '/会签' : ''}}] {{item.handleAccounts}}</p>
              </div>
            </div>
            <div class="process_item">
              <div class="title">
                <i class="icon_step"></i>
                <div class="name">
                  <p>结束</p>
                </div>
              </div>
              <div class="content"></div>
            </div>
          </div>
        </div>
        <div class="processFooter">
          <span class="qwui-btn qwui-btn_default" @click="showOrHideProcessPop">返回</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from "vuex";
  import audit_flow_api from "@/components/flow/api/getData.js";

  export default {
    name: "QwFlowList",
    data() {
      return {
        isShowFlowNode: false,
        nodeList: [],
        flowName: "",
        nodeType: ["审批", "知会", "承办"],
        oldFlowId: ""
      };
    },
    props: {
      definition_id: {
        type: String,
        default: ""
      },
      id: {//审批单id
        type: String,
        default: ""
      },
      initFlowId: {//新增时绑定的流程id
        type: String,
        default: ""
      }
    },
    computed: {
      ...mapState({
        flowList: state => state.userSelected.flowList,
        flowId: state => state.userSelected.flowId
      })
    },
    methods: {
      getFlowAuditUser(flowId) {
        let self = this;
        if (flowId == self.flowId) return;
        this.$store.commit("updateUserSelectedData", {
          type: "flowId",
          data: flowId
        });
        let paramData = {
          definitionId: this.definition_id,
          id: flowId == this.initFlowId?this.id:"",
          flowId: flowId,
          currentNodeId: "",
          nextNodeId: "",
          parallelNextNodeIds: "",
          isBranchFlow: false
        };
        audit_flow_api.getFlowAuditUser(paramData, function (data) {
          self.$store.commit(
            "updateAppointNodeVOList",
            data.appointNodeAndUserVOList
          );
          self.$store.commit("updateFlowAuditUser", data.nodeInfo);
          //表单字段
          if (data.firstFieldControlList && data.firstFieldControlList.length > 0) {
            self.$parent.formFieldControlList(data.firstFieldControlList);
          }
        });
      },
      showFlowNode(flowId, flowName) {
        if (flowId == this.oldFlowId) {
          this.showOrHideProcessPop();
          return;
        }
        this.oldFlowId = flowId;
        let data = {
          flowId: flowId,
          id: this.id
        }
        audit_flow_api.showFlowNode(data, (nodeList) => {
          this.nodeList = nodeList;
          this.flowName = flowName;
          this.showOrHideProcessPop();
        });
      },
      showOrHideProcessPop() {
        this.isShowFlowNode = !this.isShowFlowNode;
      }
    }
  };
</script>
<style scoped>
  @import "css/flowList.css";
</style>

<template>
  <div class="selectBox">
    <div class="selectTitle">选择下一处理节点</div>
    <div class="selectBoxContent">
      <label class="nodeItem"
             v-for="(item,index) in nextNodeList"
             :key="item.nodeId">
        <div class="nodeSelectItem">
          <input type="radio" class="icon_check" :value="item.id" :checked="item.id==initNextNodeId"
                 @change="changeNodeId(item)">
          <div class="nodeItemContent">
            <p>{{item.nodeName}}</p>
            <p v-for="(childItem,index) in item.nextNodeList" v-if="item.nodeStatus==3&&item.ext1!=2">
              · {{childItem.nodeName}}</p>
          </div>
        </div>
      </label>
    </div>
    <button_group>
      <qwui_button type="default" text="取消" @buttonClick="cancelSelected"></qwui_button>
      <qwui_button type="primary" text="提交" @buttonClick="confirmSelected"></qwui_button>
    </button_group>
  </div>
</template>
<script>
  import {getFlowAuditUserFun} from "@/components/flow/getAuditFlow";
  import {qwui_button, button_group} from '@/components/base/button'
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'

  export default {
    name: "QWChooseNextNode",
    components: {
      button_group,
      qwui_button,
    },
    data() {
      return {
        initNextNodeId: '',//初始下一节点id，id不同时才请求处理人
      }
    },
    computed: {
      ...mapState({
        nextNodeList: state => state.flowUserSelected.nextNodeList,
        flowId: state => state.flowUserSelected.flowId,
        currentNodeId: state => state.flowUserSelected.currentNodeId,
        nextNodeId: state => state.flowUserSelected.nextNodeId,
        chooseNodeName: state => state.flowUserSelected.chooseNodeName,
        parallelNextNodeIds: state => state.flowUserSelected.parallelNextNodeIds,
      })
    },
    created: function () {
      this.initNextNodeId = this.nextNodeId;
    },
    methods: {
      changeNodeId(nodeItem) {
        this.initNextNodeId = nodeItem.id;
        this.choosedNodeItem = {...nodeItem};
      },
      confirmSelected() {
        let self = this
        this.$store.commit("updateUserSelectedState", {type: 'isShowNodeBox', data: false});

        if (this.initNextNodeId == this.nextNodeId) return

        if(this.choosedNodeItem) {
          let chooseNodeTitle = ''
          let parallelNextNodeIds = ''
          let nodeItem = this.choosedNodeItem
          if (nodeItem.nodeStatus == 3 && nodeItem.ext1 != 2) {
            chooseNodeTitle += nodeItem.nodeName + '：'
            chooseNodeTitle += nodeItem.nextNodeList.map(value=>{
              return value.nodeName
            }).join('+');
            parallelNextNodeIds = nodeItem.nextNodeList.map(value=>{
              return value.id
            }).join(',');
          } else {
            chooseNodeTitle += nodeItem.nodeName
            parallelNextNodeIds = ""
          }
          console.log(chooseNodeTitle)
          this.$store.commit("updateUserSelectedState", {type: 'nextNodeId', data: nodeItem.id})
          this.$store.commit("updateUserSelectedState", {type: 'chooseNodeName', data: chooseNodeTitle})
          this.$store.commit("updateUserSelectedState", {type: 'parallelNextNodeIds', data: parallelNextNodeIds})
        }

        let paramData = {
          definitionId: '',
          flowId: this.flowId,
          id: "",//新建是空的
          currentNodeId: this.currentNodeId,
          nextNodeId: this.nextNodeId,
          isBranchFlow: true,
          parallelNextNodeIds: this.parallelNextNodeIds
        }
        getFlowAuditUserFun(paramData, (result) => {
          self.$store.commit('updateFlowAuditUserData', result);
        })
      },
      // 取消弹窗
      cancelSelected() {
        this.$store.commit("updateUserSelectedState", {type: 'isShowNodeBox', data: false});
      }
    }
  }
</script>
<style scoped>
  @media screen and (min-width: 1024px) {
    .selectBox {
      width: 740px;
      margin: auto;
    }
  }

  .selectBox {
    display: flex;
    flex-direction: column;
    position: fixed;
    z-index: 4;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin-top: 10px;
    border-radius: 8px 8px 0 0;
    background-color: #fff;
  }
  .selectBoxContent {
    flex: 1;
    position: relative;
    width: 100%;
    overflow-y: auto;
    background-color: #fff;
  }

  .selectBoxContent::-webkit-scrollbar {
    width: 0;
  }

  .selectTitle {
    padding: 20px 0 18px;
    color: #0A1736;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
  }

  .nodeItem {
    display: flex;
    padding: 0 16px;
  }

  .nodeSelectItem {
    display: flex;
    flex: 1;
    padding: 12px 0;
  }

  .nodeSelectItem [type=radio].icon_check {
    min-width: 20px;
  }

  .nodeItemContent p {
    color: #B2B9C8;
    font-size: 14px;
    line-height: 22px;
  }

  .nodeItemContent p:nth-child(1) {
    color: #0A1736;
    font-size: 16px;
  }

  .nodeItemContent p:nth-child(2) {
    margin-top: 8px;
  }

  .selectBox /deep/ .qwui-btn_box {
    position: relative;
    z-index: inherit;
    border-top: 1px #F7F8FA solid;
  }
</style>

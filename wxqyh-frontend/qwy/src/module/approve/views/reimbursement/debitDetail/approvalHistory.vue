<template>
  <div class="approval_history">
      <div class="processContent">
        <div class="processList">
          <div class="processItem" v-for="(item,index) in auditSerial" :key="index">
            <div class="title">
              <i :class="['iconStep',item.status!=2?'active':'']">{{index+1}}</i>
            <!--  <p class="time" v-if="item.auditTime != ''">{{item.auditTime}}</p>-->
              <p class="name">{{item.nodeName}}
                <span>{{item.signType}}</span>
              </p>
            </div>
            <div :class="['content',item.status!=2?'active':'']">
              <!--<p v-if="item.auditTime != ''">{{item.nodeName}}
                <span>{{item.signType}}</span>
              </p>-->
              <p v-if="item.handleAccounts!=''"><span class="label">[处理人{{item.isSign ? '/会签' : ''}}]</span>{{item.handleAccounts}}</p>
              <p v-for="(auditUserItem,index) in item.auditUserList" v-if="auditUserItem.auditUser!=''"
                 :key="index">
                <span class="label">[{{auditUserItem.nodeType}}] </span>{{auditUserItem.auditUser}} <span class="time">{{auditUserItem.createTime}}</span>
              </p>
              <div v-for="(parallel,index) in item.parallelList" :key="index">
                <div class="parallelList">
                  <div :class="['processItem',parallel[0].status!=2?'active':'']" v-show="!parallel[0].isShow">
                    <div class="title">
                      <i :class="['iconStep',parallel[0].status!=2?'active':'']">{{index+1}}</i>
                      <div class="name">
                        <p>{{parallel[0].nodeName}}
                          <span>{{parallel[0].signType}}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div :class="['processItem',parallelItem.status!=2?'active':'']"
                       v-for="(parallelItem,index) in parallel" v-show="parallel[0].isShow" :key="index">
                    <div class="title">
                      <i :class="['iconStep',parallelItem.status!=2?'active':'']"></i>
                      <div class="name">
                        <p>{{parallelItem.nodeName}}
                          <span>{{parallelItem.signType}}</span>
                        </p>
                      </div>
                    </div>
                    <div :class="['content',parallelItem.status!=2?'active':'']">
                      <p v-if="parallelItem.handleAccounts!=''">
                        [处理人{{parallelItem.isSign ? '/会签' : ''}}] {{parallelItem.handleAccounts}}</p>
                      <p v-for="(auditUserItem,index) in parallelItem.auditUserList"
                         v-if="auditUserItem.auditUser!=''" :key="index">
                        [{{auditUserItem.nodeType}}] <span>{{auditUserItem.auditUser}}</span>
                      </p>
                    </div>
                  </div>
                  <i :class="['icon_arrow_up',parallel[0].isShow?'':'icon_arrow_down']"
                     @click="parallelToggle(parallel[0])">{{index+1}}</i>
                </div>
              </div>
            </div>
          </div>
          <div class="processItem">
            <div class="title">
              <i :class="['iconStep',isOverActive?'active':'']"></i>
              <div class="name">
                <p>{{this.lastNodeText}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
  export default {
    name: 'flowSerial',
    props: {
      flowSerialData: {
        type: Object
      },
      isover: {
        type: String
      }
    },
    computed: {
      lastNodeText() {
        let isFree = this.flowSerialData.isFreeFlow;
        //已审批或关闭显示结束，自由或分支审批中显示流转中
        if (this.isover == 1 || this.isover == -1) {
          return '结束'
        } else {
          return (isFree == '0' || isFree == '2') ? '结束' : '流转中'
        }
      },
      isOverActive() {
        //已审批或者已关闭勾选结束节点
        return this.isover == 1 || this.isover == -1
      }
    },
    data() {
      return {
        auditSerial: [],
        approveText: {
          1: ['通过', '退审'],
          2: ['确认', '退回'],
          3: ['办理', '退回']
        }
      }
    },
    created() {
      if (this.flowSerialData.isFreeFlow == '1') {
        this.auditSerial = this.dealFreeSerial();
      } else {
        this.auditSerial = this.dealAuditSerial();
      }
    },
    methods: {
      parallelToggle(item) {
        item.isShow = !item.isShow;
      },
      dealFreeSerial() {
        let list = this.flowSerialData.list;
        let auditSerial = [];
        for (let i = 0; i < list.length; i++) {
          let auditSerialItem = {
            nodeName: '', //节点名称
//            auditTime:'', //最后处理时间
            handleAccounts: '', //处理人
            auditUserList: [], //实际处理人
            status: '', //处理类型0已处理2未处理
          }
          let listItem = list[i];
          auditSerialItem.nodeName = listItem.nodeName;
          auditSerialItem.handleAccounts = listItem.handlePersons.replace(/,/g, '、');
          auditSerialItem.status = listItem.isCheck == '0' ? 2 : 0;
        if(listItem.auditStatus==1){//提单节点
            let auditUserItem = {};
            auditSerialItem.nodeName = '提单人处理';
            auditUserItem.createTime = listItem.auditTime;
            auditUserItem.auditUser = listItem.handlePersons;
            auditUserItem.nodeType = this.dealFreeAudit(listItem.auditStatus);
            auditSerialItem.auditUserList.push({...auditUserItem});
          }
          if(listItem.auditPersonsList.length){
            listItem.auditPersonsList.forEach((value) => {
              let auditUserItem = {};
              auditUserItem.createTime = value.auditTime;
              auditUserItem.auditUser = value.handlePersons;
              auditUserItem.nodeType = this.dealFreeAudit(value.auditStatus);
              auditSerialItem.auditUserList.push({...auditUserItem});
            })
          }
          auditSerial.push(auditSerialItem);
        }
        return auditSerial;
      },
      dealFreeAudit(auditStatus) {
        let nodeType = '';
        switch (auditStatus) {
          case 0:
            nodeType = '退审';
            break;
          case 4:
            nodeType = '重新提交';
            break;
          case 5:
            nodeType = '转审';
            break;
          case 6:
            nodeType = '同意并结束';
            break;
          case 7:
            nodeType = '关闭';
            break;
          default:
            nodeType = '通过';
            break;
        }
        return nodeType;
      },
      dealAuditSerial() {
        let list = this.flowSerialData.list;
        let auditSerial = [];
        let isFree = this.flowSerialData.isFreeFlow;
        for (let i = 0; i < list.length; i++) {
          let auditSerialItem = {
            nodeName: '', //节点名称
            handleAccounts: '', //处理人
//            auditTime:'', //最后处理时间
            isSign: false, //是否会签,signType非空时为true
            signType: '', //加签类型1前签2后签3普通会签
            auditUserList: [], //实际处理人
            createTime:'',//处理时间
            status: '', //处理类型0已审批1退审2未处理
            parallelList: [],//并行中间节点list
          };
          let listItem = list[i];
//          auditSerialItem.auditTime = listItem.auditTime;
          auditSerialItem.createTime = listItem.createTime;
          if (listItem.signType && listItem.signType != '') {
            auditSerialItem.isSign = true;
            auditSerialItem.signType = listItem.signType != '3' ? listItem.signType == '1' ? ' · 前签' : ' · 后签' : '';
          }

          //0提单人1审批通过2退审3未审批4审批通过5未重新提交6结束节点未审批7重新提交8提单人自结束9退审
          let status = listItem.auditStatus;

          if (isFree == '0' || isFree == '2') { //固定流程
            //2未结束的最后节点
            let nodeStatus = listItem.nodeStatus;
            auditSerialItem.handleAccounts = listItem.personName.replace(/,/g, '、');
            if (status == '0') {
              auditSerialItem.nodeName = '提单人处理';
              auditSerialItem.status = 0;
            } else {
              auditSerialItem.nodeName = status == '5' || status == '7' ? '提单人处理' : listItem.nodeName;
              if ((status == '3' && (nodeStatus == '1' || nodeStatus == '2')) || status == '5') {
                // 未审批
                auditSerialItem.status = 2;
              } else {
                //status:2或者9时是退审，其他为已审批
                auditSerialItem.status = status == '2' || status == '9' ? 1 : 0;
              }
            }
              // 实际处理人数据处理
              auditSerialItem.auditUserList = [...this.getAuditUserDetail(listItem, auditSerialItem.status)];

          } else if (isFree == '3') { //分支流程
            auditSerialItem.handleAccounts = listItem.handleAccounts.replace(/,/g, '、');
            if (listItem.status && listItem.status == '1') {
              auditSerialItem.nodeName = '提单人处理';
              auditSerialItem.status = 0;
            } else {
              auditSerialItem.nodeName = listItem.nodeName;
              if (status == '2') {
                //未审批
                auditSerialItem.status = 2;
              } else {
                //status:0退审，其他为已审批
                auditSerialItem.status = listItem.status == '0' || status == '0' ? 1 : 0;
              }
            }
              // 实际处理人数据处理
              auditSerialItem.auditUserList = [...this.getAuditUserDetail(listItem, auditSerialItem.status)];


            //有并行子节点
            if (listItem.parallelFlowNodes && listItem.parallelFlowNodes.length > 0) {
              for (let j = 0; j < listItem.parallelFlowNodes.length; j++) {
                auditSerialItem.parallelList.push(this.dealParallelNodes(listItem.parallelFlowNodes[j]));
              }
            }

          }
          auditSerial.push(auditSerialItem);
        }
        return auditSerial;
      },
      dealParallelNodes(parallelFlowNodes) {
        let parallelNodes = [];
        for (let i = 0; i < parallelFlowNodes.length; i++) {
          let auditSerialItem = {
            nodeName: '', //节点名称
            handleAccounts: '', //处理人
            isSign: false, //是否会签,signType非空时为true
            signType: '', //加签类型1前签2后签3普通会签
            auditUserList: [], //实际处理人
            status: '', //处理类型0已审批1退审2未处理
            isShow: true, //是否显示并行子节点，默认展示
          }
          let parallelNodeItem = parallelFlowNodes[i];

          auditSerialItem.nodeName = parallelNodeItem.nodeName;

          if (parallelNodeItem.signType && parallelNodeItem.signType != '') {
            auditSerialItem.isSign = true;
            auditSerialItem.signType = parallelNodeItem.signType != '3' ? parallelNodeItem.signType == '1' ? ' · 前签' : ' · 后签' : '';
          }

          //auditStatus:0退审2未审批3已审批
          let status = parallelNodeItem.auditStatus;
          auditSerialItem.handleAccounts = parallelNodeItem.handleAccounts;
          if (status == '2') {
            auditSerialItem.status = 2;
          } else {
            auditSerialItem.status = status == '0' ? 1 : 0;
          }
          // 实际处理人数据处理
          auditSerialItem.auditUserList = [...this.getAuditUserDetail(parallelNodeItem, auditSerialItem.status, true)];
          parallelNodes.push(auditSerialItem);
        }
        return parallelNodes;
      },
      getNodeType(nodeType, status) {
        nodeType = nodeType == '' || nodeType == '0' ? 1 : nodeType;
        return this.approveText[nodeType][status];
      },
      getAuditUserDetail(listItem, nodeStatus, isParallelNode) {
        let isFree = this.flowSerialData.isFreeFlow;
        let auditUserList = [];
        if (listItem.signAuditPersons && listItem.signAuditPersons.length > 0) {
          listItem.signAuditPersons.forEach((value) => {
            let auditUserItem = {};
            auditUserItem.auditUser = isFree == '0' || isFree == '2' ? value.personName : value.auditUserName;
            auditUserItem.createTime = isFree == '0' || isFree == '2' ? value.createTime : value.auditTime;
            let status = 0;
            if (isFree == '0' || isFree == '2') {
              status = value.auditStatus == '2' || value.auditStatus == '9' ? 1 : 0;
            } else if (isFree == '3') {
              if (isParallelNode) { // 并行节点状态判断
                status = value.auditStatus == '0' ? 1 : 0;
              } else {
                status = value.status == '0' || value.auditStatus == '0' ? 1 : 0;
              }
            }
            auditUserItem.nodeType = this.getNodeType(value.nodeType, status);
            auditUserList.push({...auditUserItem});
          })
        } else {
          if (nodeStatus != 2 ) {
            let auditUserItem = {};
            auditUserItem.auditUser = isFree == '0' || isFree == '2' ? listItem.personName : listItem.auditUserName;
            auditUserItem.createTime = isFree == '0' || isFree == '2' ? listItem.createTime : listItem.auditTime;
            if (isFree == '3') {
              auditUserItem.nodeType = listItem.auditStatus == '4' ? '重新提交' : this.getNodeType(listItem.nodeType, nodeStatus);
            } else {
              auditUserItem.nodeType = listItem.auditStatus == '7' ? '重新提交' : this.getNodeType(listItem.nodeType, nodeStatus);
            }
            auditUserList.push(auditUserItem);
          }
        }
        return auditUserList;
      },
    }
  }

</script>
<style scoped>
  .approval_history{
    color:#666;
    padding: 20px;
  }
  .flow_person{
    margin: 0 20px;
  }
  .handling_time{
    float: right
  }
  .processContent::-webkit-scrollbar {
    width: 0;
  }
  .processContent .processList {
    padding: 0 17px;
  }
  .processItem:last-child {
    padding-bottom: 30px;
  }
  .processItem .title {
    display: flex;
    display: -webkit-flex;
  }
  .processItem .title .name{
    color:#333;
  }
  .processItem .label{
    display: inline-block;
    min-width: 65px;
  }
  .processItem .time{
    color:#999;
    margin-left: 15px;
  }
  .processItem .iconStep {
    float: left;
    margin-right: 10px;
    width: 19px;
    height: 19px;
    color:#ccc;
    text-align: center;
    border-radius: 50%;
    border: 1px #ccc solid;
  }

  .iconStep.active {
    color:#f87b00;
    border: 1px #f87b00 solid;
   /* background-color:#f87b00 ;*/
  }

  .processItem .content {
    padding-bottom: 20px;
    margin: 0 10px;
    border-left: 1px #ccc solid;
  }

  .processItem .content.active {
    border-left: 1px #f87b00 solid;
  }

  .processItem:last-child > .content {
    border-left: none;
  }
  .approval_history{
    color:#666;
    padding: 20px;
  }
  .processContent .processList {
    padding: 0 17px;
  }

  .processItem:last-child {
    padding-bottom: 30px;
  }

  .processItem .title {
    display: flex;
  }

  .processItem .title .name span {
    color: #467DB9;
  }

  .icon_arrow_up {
    position: absolute;
    top: 20px;
    right: 15px;
    width: 50px;
    height: 20px;
    cursor: pointer;
  }

  .icon_arrow_up::after {
    content: "";
    position: absolute;
    top: 7px;
    right: 2px;
    width: 8px;
    height: 8px;
    border-top: 2px solid #ccc;
    border-left: 2px solid #ccc;
    transform: rotate(45deg);
  }

  .processItem:last-child > .content {
    border-left: none;
  }

  .processItem .content > p {
    margin-left: 20px;
    color: #333;
    font-size: 14px;
    line-height: 21px;
  }

  .processFooter {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 8px 15px;
    background: #fff;
    box-sizing: border-box
  }

  .processFooter::before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid #e5e5e5;
    transform: scaleY(0.5);
    box-sizing: border-box;

  }

  .parallelList {
    position: relative;
    padding: 20px 15px;
    margin: 10px 0 0 15px;
    background-color: #F5F5F5;
  }

  .parallelList .processItem:nth-last-child(2) .content {
    padding-bottom: 0;
    margin-bottom: 0;
    border-left: 0;
  }

</style>

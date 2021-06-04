<template>
  <div class="qwui-cardList">
    <div
      class="qwui-cardList_item flexbox"
      v-for="(item,index) in list"
      :key="item.id">
      <div
        class="flexItem pr20"
        @click="isVipUser(item)"
        tag="div">
        <div class="entrust-list-title">
          <h3>{{item.title}}</h3>
          <span
            class="applyStatus"
            :class="statusRuleStatusClass(item.ruleStatus)">{{showRuleStatus(item.ruleStatus)}}</span>
        </div>
        <div class="entrust-list-time">
          <img src="~assets/images/entrust_time.svg" alt="" class="entrust-time-img">
          <p>{{item.startTime}}&nbsp;至&nbsp;{{item.endTime}}</p>
        </div>
        <p class="entrust-user">被委托人：{{item.consigneeUserName}}</p>
      </div>
      <i
        class="qwui-icon-operate showActionSheet"
        @click="updateData(item.id,index,item.ruleStatus)"></i>
    </div>
  </div>
</template>

<script>
  import { mixinList } from './list'
  import { isVipGold } from '@/assets/js/vip-portal.js' 	//判断VIP
  import { entrustRuleStatus,delEntrustRule } from '../../api/list'

  export default {
    mixins: [mixinList],
    props: ['list'],
    methods: {
      isVipUser(item){
        if(isVipGold(interfaceCode.INTERFACE_CODE_FORM)) {
          this.$router.push({path:'/entrustAdd', query: { id: item.id,type:'edit'}});
        } else{
          _.alert("提示","流程委托仅限尊享版使用，请联系管理员升级","确定",function(){
            restoreSubmit();
          });
        }
      },
      updateData(id,index,ruleStatus) {
        let _this = this;
        var status = '';
        var statusTip = '';
        this.$emit('updateData', ruleStatus);
        dataBase.dialogBottomConfig.show = true;
        // 如果状态是已暂停或者执行中才多一个dialog按钮 0，已暂停；1，执行中；2，待执行；3，已结束
        if (ruleStatus == 0 || ruleStatus == 1) {
          ruleStatus == 1 ? status = 0 : status = 1;
          ruleStatus == 1 ? statusTip = '已经暂停委托' : statusTip = '已开启委托';
          dataBase.dialogBottomConfig.btnConfig[0].callBack = async function () {
            if(isVipGold(interfaceCode.INTERFACE_CODE_FORM)) {
              dataBase.dialogBottomConfig.show = false;
              let res = await entrustRuleStatus({
                "tbQyFlowEntrustRulePO.id": id,
                "tbQyFlowEntrustRulePO.ruleStatus": status
              });
              _this.$emit('listenUpdateList');
              setTimeout(function () {
                _.tooltips_succeed(statusTip, true);
              }, 100);
            } else {
              _.alert("提示","流程委托仅限尊享版使用，请联系管理员升级","确定",function(){
                restoreSubmit();
              });
            }
          }
          this.delDialog(1, id, index);
        } else {
          this.delDialog(0, id, index);
        }
      },
      delDialog(i,id,index) {
        let _this = this;
        dataBase.dialogBottomConfig.btnConfig[i].callBack = function(){
          _.alert("提示", '删除后将不再执行该委托规则，已删除规则不可找回',{
            primaryBtn: {
              name: "确定",
              callBack: async () => {
                dataBase.dialogBottomConfig.show = false;
                let res = await delEntrustRule({
                  "tbQyFlowEntrustRulePO.id": id
                });
                //把需要删除的委托的索引发送给父组件
                _this.$emit('listenDelList', index);
                _.tooltips_succeed('删除成功', true);
              },
            },
            defaultBtn:{
              name: "i18n.cancel",
              callBack: () => {
                dataBase.dialogBottomConfig.show = false;
              }
            },
          });
        }
      }
    }
  }
</script>

<style scoped>
  .pr20{
    padding-right: 20px;
  }
  .entrust-list-title{
    display: flex;
  }
  .entrust-list-time{
    margin-top: 2px;
    display: flex;
    align-items: center;
  }
  .entrust-list-time p{
    color: #b2b9c8;
  }
  .entrust-time-img{
    margin-right: 6px;
    width: 13px;
    height: 13px;
  }
  .entrust-list-title span.applyStatus.red{
    margin-left: 10px;
    margin-top: 1px;
    padding: 2px 8px;
    line-height: 1.3;
    white-space: nowrap;
    background-color: rgba(233, 79, 79, 0.05);;
  }
  .entrust-list-title span.applyStatus.blue{
    margin-left: 10px;
    margin-top: 1px;
    padding: 2px 8px;
    line-height: 1.3;
    white-space: nowrap;
    background-color: rgba(69, 139, 233, 0.05);;
  }
  .entrust-list-title span.applyStatus.gray{
    margin-left: 10px;
    margin-top: 1px;
    padding: 2px 8px;
    line-height: 1.3;
    white-space: nowrap;
    background-color: rgba(153, 153, 153, 0.05);
  }
  .entrust-list-title span.applyStatus.yellow{
    margin-left: 10px;
    margin-top: 1px;
    padding: 2px 8px;
    line-height: 1.3;
    white-space: nowrap;
    background-color: rgba(255, 194, 97, 0.05);
  }
  .qwui-cardList_item .flexItem .entrust-list-title h3{
    -webkit-line-clamp: 1;
  }
  .entrust-user{
    margin-top: 4px;
    color: #7A7C80;
  }
</style>

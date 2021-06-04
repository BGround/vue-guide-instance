<template>
  <div>
    <!--返回按钮-->
    <qwui-go-back class="qwui-go_back" :goBackConfig="goBackConfig"></qwui-go-back>

    <div class="qwui-subtask_item"
         v-for="(item,key) in subTaskSetConfig"
         :key="key"
         v-show="!item.hide">
      <span class="qwui-item_title">{{ item.title }}</span>
      <qwui-checkbox class="qwui-check_custom_box" v-model="item.isCheck" :disabled="item.disabled">{{ item.option }}</qwui-checkbox>
      <span class="qwui-item_desc">{{ item.desc }}</span>
      <a v-if="item.showVipTip" class="qwui-vip_tip" :href="vipHref" target="_blank">尊享版功能</a>
    </div>
    <div class="qwui-save_btn">
      <qwui-button type='primary' @click="updateSubTaskPerm">保存</qwui-button>
    </div>
  </div>
</template>

<script>
  import qwuiGoBack from '@/components/base/qwuiGoBack';
  import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox'
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import { isVipGold } from '@/assets/js/vip-manager';
  import { updateTaskSetting,getTaskSettingInfo } from '../../api/taskAssignment/getData';

  export default {
    data(){
      return {
        goBackConfig:{
          hasLine:true,
          lastPath:'设置',
          currPath:'子任务功能设置'
        },
        subTaskSetConfig:{
          'subOnOff':{
            title:'子任务功能',
            option:'开启',
            showVipTip:true,
            disabled:false,
            isCheck:true,
          },
          'sponsor':{
            hide:false,
            title:'谁能发起子任务',
            option:'主任务发起人',
            disabled:true,
            isCheck:true,
            desc:'（必选项，发起人拥有发起和编辑全部子任务的权限）',
          },
          'principal':{
            hide:false,
            option:'主任务负责人',
            desc:'（勾选后，主任务负责人拥有发起子任务权限）',
            isCheck:false,
          }
        }
      }
    },
    mounted(){
      dataBase.agentCode = 'task';
      getTaskSettingInfo({'belongAgent':dataBase.agentCode},(data)=>{
        this.subTaskSetConfig.subOnOff.isCheck = data.settingVO.openSubtask != 0;
        this.subTaskSetConfig.principal.isCheck = data.settingVO.openSubtask == 2;
        if (!isVipGold(interfaceCode.INTERFACE_CODE_TASK)){
          this.subTaskSetConfig.subOnOff.isCheck = false;
          this.subTaskSetConfig.subOnOff.disabled = true;
        }
      });
    },
    methods:{
      updateSubTaskPerm(){
        let self = this;
        let openSubtask = this.subTaskSetConfig.subOnOff.isCheck ? (this.subTaskSetConfig.principal.isCheck ? 2 : 1) : 0;
        updateTaskSetting({
          openSubtask:openSubtask,
          belongAgent:dataBase.agentCode
        },()=>{
          dataBase.top_alert('更新成功',true,3000);
          self.$router.push({name:'taskSetting'})
        })
      }
    },
    watch:{
      'subTaskSetConfig.subOnOff.isCheck':function () {
        this.subTaskSetConfig.sponsor.hide = !this.subTaskSetConfig.subOnOff.isCheck;
        this.subTaskSetConfig.principal.hide = !this.subTaskSetConfig.subOnOff.isCheck;
      }
    },
    computed:{
      vipHref(){
        return _.baseURL + '/qiweipublicity/companysrv/vip/vip_gold_index.jsp?utm_source=pc&utm_medium=nav'
      }
    },

    components:{
      qwuiGoBack,
      qwuiCheckbox,
      qwuiButton
    }
  }

</script>

<style lang="scss" scoped>
  .qwui-go_back {
    margin-bottom: 30px;
  }
  .qwui-subtask_item {
    height: 52px;
    line-height: 52px;

    .qwui-item_title {
      width: 130px;
      display: inline-block;
      text-align: right;
      margin-right: 10px;
      color: #666;
    }
  }
  .qwui-vip_tip {
    color: #F78B00;
    cursor: pointer;
  }
  .qwui-item_desc {
    color: #999;
  }
  .qwui-save_btn {
    padding-top: 20px;
    margin-top: 48px;
    text-align: center;
    border-top: 1px solid #dbdbdb;
  }
  .qwui-check_custom_box /deep/ {
    .qwui-checkbox-input,.qwui-checkbox-label {
      vertical-align: baseline !important;
    }
  }
</style>

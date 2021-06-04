<template>
  <div>
    <qwui-go-back :goBackConfig="goBackConfig"></qwui-go-back>
    <setting-item :settingItemConfig="settingItemConfig" @listenToChange="updateSettingBtn"></setting-item>
  </div>
</template>

<script>
  import qwuiGoBack from '@/components/base/qwuiGoBack';
  import settingItem from '@/components/base/settingItem';
  import { isVipGold } from '@/assets/js/vip-manager';
  import { viewBatchRead,updateBatchRead } from '../../api/product/getData';

  const SettingBtn = {
    batch:'isBatchRead',
    type:'productTypeSet',
    menu:'productMenu'
  };
  // vip功能数组
  const vipFuncArr = ['batch'];

  export default {
    data(){
      return {
        goBackConfig:{
          hasLine:true,
          lastPath:'首页',
          currPath:'设置'
        },
        settingItemConfig:{
          batch:{
            title:'一键已阅功能',
            desc:'在应用端可将未阅消息一键标记为已阅',
            switchOnOff:false,
          },
          type:{
            title:'知识百科类别设置',
            desc:'设置知识百科类别，每个类别下面可以有多个子类，已经被知识百科使用的类别不能删除',
            perm:'productTypeSet'
          },
          menu:{
            title:'菜单设置',
            desc:'修改应用菜单名称或增加二级菜单链接，修改后最迟24小时内在应用端生效，可以一键恢复为系统默认菜单',
            perm:'menuUpdate'
          }
        }
      }
    },
    created(){
      viewBatchRead({
        belongAgent:dataBase.agentCode
      },(data)=>{
        this.settingItemConfig.batch.switchOnOff = data.isBatchRead == 1;
      })
    },
    methods:{
      updateSettingBtn(key,val){
        if (val != undefined){
          if (!isVipGold(interfaceCode.INTERFACE_CODE_PRODUCTINFO) && vipFuncArr.indexOf(key) != -1){
            this.settingItemConfig[key].switchOnOff = false;
            _.alert("提示", "该功能仅限尊享版使用，<a href=\"https://qy.do1.com.cn/qwy/qiweipublicity/companysrv/vip/vip_gold_index.jsp?utm_source=pc&utm_medium=nav\" class='orange' target=\"_blank\">马上升级 ></a>");
            return;
          }
          this.settingItemConfig[key].switchOnOff = val;
          let params = {};
          params['belongAgent'] = dataBase.agentCode;
          params[SettingBtn[key]] = val ? 1 : 0;
          updateBatchRead(params,()=>{
            this.settingItemConfig[key].switchOnOff = val;
          })
        }else {
          this.$router.push({name:SettingBtn[key]})
        }
      }
    },
    components:{
      qwuiGoBack,
      settingItem,
    }
  }

</script>

<style lang="scss" scoped></style>

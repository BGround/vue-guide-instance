<template>
  <div class="examSetting">
    <setting-item :settingItemConfig="settingItemConfig" @listenToChange="updateMeetSettingBtn"></setting-item>
  </div>
</template>

<script>
  import settingItem from '@/components/base/settingItem';
  import { isVipGold } from '@/assets/js/vip-manager';


  const SettingBtn = {
    menuSetting:'menuSetting',
    availSetting:'availSetting',
    //mark:'isMark',
  };

  const vipFuncArr = [
    'manyRoom',
    'approval',
    'cycle'
  ];

  export default {
    data(){
      return {
        settingItemConfig:{
          menuSetting:{
            title:'培训考试菜单设置',
            desc:'修改应用菜单名称或增加二级菜单链接，修改后最迟24小时内在手机端生效，可以一键恢复为系统默认菜单',
            perm:'learnSetting'
          },
          availSetting:{
            title:'考试统计可见设置',
            desc:'获授权人员可在应用端查看所有考试的情况和所有人员的考试成绩',
            perm:'learnSetting'
          },
//          mark:{
//            title:'课程评分',
//            desc:'开启后，学员可以对所有课程进行评分',
//            switchOnOff: false,
//            perm:'learnSetting'
//          }
        }
      }
    },
    created(){
      dataBase.agentCode = 'learnonline';
      // 获取设置页按钮开关
    },
    methods:{
      updateMeetSettingBtn(key,val){
        if(val != undefined){
          if (!isVipGold(interfaceCode.INTERFACE_CODE_LEARN) && vipFuncArr.indexOf(key) != -1){
            this.settingItemConfig[key].switchOnOff = false;
            _.alert("提示", "该功能仅限尊享版使用，<a href=\"https://qy.do1.com.cn/qwy/qiweipublicity/companysrv/vip/vip_gold_index.jsp?utm_source=pc&utm_medium=nav\" target=\"_blank\">马上升级 ></a>");
            return;
          }
          let params = {};
          params['belongAgent'] = dataBase.agentCode;
          params[SettingBtn[key]] = val ? 1 : 0;
          this.settingItemConfig[key].switchOnOff = val;
        }else {
          this.$router.push({name:SettingBtn[key]})
        }
      }
    },
    components:{
      settingItem,
    }
  }
</script>
<style scoped>
  .examSetting {
    margin: 30px 30px 0 30px;
    border-bottom: 1px solid #dbdbdd;
  }
</style>

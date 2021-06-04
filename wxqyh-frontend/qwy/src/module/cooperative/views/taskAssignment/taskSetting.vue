<template>
  <div class="mb30">
    <qwui-go-back :goBackConfig="goBackConfig"></qwui-go-back>
    <setting-item :settingItemConfig="settingItemConfig" @listenToChange="updateTaskSettingBtn"></setting-item>
  </div>
</template>

<script>
  import settingItem from '@/components/base/settingItem';
  import qwuiGoBack from '@/components/base/qwuiGoBack';

  import { isVipGold } from '@/assets/js/vip-manager';
  import { getTaskSettingInfo,updateTaskSetting } from '../../api/taskAssignment/getData';

  const SettingBtn = {
    'type':'taskType',
    'time':'taskTimeSet',
    'remind':{
      param:'openRemind'
    },
    'score':{
      param:'openScore'
    },
    'subtask':'subTaskSet',
    'place':{
      param:'openAccessAddress'
    },
    'loadLast':{
      param:'openLoadTaskType'
    },
    'overTask':{
      param:'openOverTask'
    },
    'permission':'taskPermission',
    'menu':'taskMenu'
  };

  export default{
    name:"taskSetting",
    data(){
      return {
        agentCode:'task',
        settingItemConfig: {
          'type': {
            title: '任务分派类型设置',
            desc: '',
            perm: 'taskTemList'
          },
          'time':{
            title:'任务时间设置',
            desc:'设置默认的任务开始、截止时间',
            perm:'taskTemList'
          },
          'remind': {
            title: '任务重复提醒',
            desc: '在新建任务时，可设置任务未完成时重复提醒负责人，直到任务完成',
            switchOnOff: false,
            perm: 'taskTemList'
          },
          'score': {
            title: '开启评分设置',
            desc: '设置发起人可以对任务进行评分',
            switchOnOff: false,
            perm: 'taskOpenScoreSet'
          },
          'place': {
            title: '开启任务地点字段',
            desc: '任务分派人可填写任务地点',
            switchOnOff: true,
            perm: 'taskTemList'
          },
          'loadLast':{
            title:'默认加载上一次任务类型',
            desc:'开启后，在应用端新建任务时，将自动加载上次任务所选择的任务类型',
            switchOnOff: true,
            perm: 'taskTemList'
          },
          'overTask':{
            title:'默认开启【负责人可结束/拒绝/重启任务】',
            desc:'开启后，在应用端新建任务时，将默认开启【负责人可结束/拒绝/重启任务】按钮',
            switchOnOff: true,
            perm:'taskTemList'
          },
          'subtask': {
            title: '子任务功能设置',
            desc: '开启子任务功能，支持自定义发起子任务角色权限',
            perm: 'taskTemList'
          },
          'permission': {
            title: '发布权限设置',
            desc: '设置可发起任务的成员',
            perm: 'taskAuthoritySet'
          },
          'menu': {
            title: '菜单设置',
            desc: '设置应用端消息主页菜单名称或增加二级菜单，修改后最迟24小时内生效',
            perm: 'menuUpdate'
          }
        },
        goBackConfig:{
          hasLine:true,
          lastPath:'首页',
          currPath:'设置'
        },
        scoreId:''
      }
    },
    mounted(){
      dataBase.agentCode = 'task';
      // 获取设置项开关按钮
      getTaskSettingInfo({'belongAgent':this.agentCode},(data)=>{
        this.settingItemConfig['score'].switchOnOff = data.settingVO.isScore == '0' ? true : false;
        this.scoreId = data.settingVO.id;
        this.settingItemConfig['remind'].switchOnOff = data.settingVO.openRemind ? true : false;
        this.settingItemConfig['place'].switchOnOff = data.settingVO.openAccessAddress ? true : false;
        this.settingItemConfig['loadLast'].switchOnOff = data.settingVO.openLoadTaskType ? true : false;
        this.settingItemConfig['overTask'].switchOnOff = data.settingVO.openOverTask ? true : false;
        if(!isVipGold(interfaceCode.INTERFACE_CODE_TASK)){
          this.settingItemConfig['remind'].switchOnOff = false;
        }
      });
    },
    methods:{
      updateTaskSettingBtn(key,val){
        if (val != undefined){
          this.settingItemConfig[key].switchOnOff = val;
          let params = {};
          params['belongAgent'] = this.agentCode;
          params[SettingBtn[key].param] = val ? 1 : 0;
          if (key == 'score'){
            params[SettingBtn[key].param] = val ? '0' : '1';
            params['id'] = this.scoreId;
          }
          if (key == 'remind' || key == 'subtask'){
            if (!isVipGold(interfaceCode.INTERFACE_CODE_TASK)){
              this.settingItemConfig[key].switchOnOff = false;
              _.alert("提示", "该功能仅限尊享版使用，<a href=\"https://qy.do1.com.cn/qwy/qiweipublicity/companysrv/vip/vip_gold_index.jsp?utm_source=pc&utm_medium=nav\" class='orange' target=\"_blank\">马上升级 ></a>");
              return;
            }
          }
          updateTaskSetting(params,()=>{
            this.settingItemConfig[key].switchOnOff = val;
          })
        }else {
          this.$router.push({name:SettingBtn[key]});
        }
      },
    },
    components:{
      settingItem,
      qwuiGoBack
    }
  }
</script>

<style lang="scss" scoped>

</style>

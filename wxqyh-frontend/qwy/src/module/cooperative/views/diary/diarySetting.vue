<template>
  <div v-show="show" class="mb30">
    <setting-item :settingItemConfig="settingItemConfig" @listenToChange="updateTaskSettingBtn"></setting-item>
  </div>
</template>

<script>
  import settingItem from '@/components/base/settingItem';

  import { isVipGold } from '@/assets/js/vip-manager';
  import { getDiarySetBtn,updateDiarySetBtn,getWaterMarkBtn,updateWaterMarkBtn} from '../../api/diary/getData';

  const SettingBtn = {
    type:'diaryType',
    stat:'diaryStatSet',
    editPerm:'isEditor',
    score:'isScore',
    batch:'isBatchRead',
    ignore:'isIgnore',
    toUser:'hasTouser',
    waterMark:'isAddWatermark',
    menu:'diaryMenu'
  };

  export default {
    data(){
      return {
        settingItemConfig:{
          type:{
            title:'工作日志类型设置',
            desc:'设置日志类型及日志模板，日志图片可设为必填项',
            perm:'templateList'
          },
          stat:{
            title:'应用端日志统计设置',
            desc:'设置应用端统计管理功能，可设置统计规则，查看日志提交情况',
            perm:'templateList'
          },
          editPerm:{
            title: '负责人编辑日志权限',
            desc: '开启后，负责人可以对其负责的日志进行编辑',
            switchOnOff: false,
            perm: 'templateList'
          },
          score:{
            title:'日志评分功能',
            desc:'开启后，负责人可以对日志进行评分',
            switchOnOff: false,
            perm:'diaryScoreSet'
          },
          batch:{
            title:'一键已阅功能',
            desc:'在应用端可将未阅日志一键标记为已阅',
            switchOnOff: false,
            perm:'diaryScoreSet'
          },
          ignore:{
            title:'日志补交忽略功能',
            desc:'开启后，支持在应用端忽略需补交的日志（规则负责人提醒补交日志后，则会重新显示）',
            switchOnOff:false,
            perm:'diaryScoreSet'
          },
          toUser:{
            title:'默认部门负责人为日志负责人',
            desc:'自动加载当前部门负责人作为默认负责人',
            switchOnOff: false,
            perm:'hasTouser'
          },
          waterMark:{
            title:'图片添加水印',
            desc:'图片上传后在图片上增加用户名和上传时间标记',
            switchOnOff: false,
            perm:'diaryWatermark'
          },
          menu:{
            title:'菜单设置',
            desc:'设置应用端消息主页菜单名称或增加二级菜单，修改后最迟24小时内生效',
            perm:'menuUpdate'
          }
        },
        show:false,
      }
    },
    created(){
      dataBase.agentCode = 'diary';
      getDiarySetBtn((data)=>{
        this.settingItemConfig.editPerm.switchOnOff = data.inputuserPO.isEditor == '1';
        this.settingItemConfig.score.switchOnOff = data.inputuserPO.isScore == '1';
        this.settingItemConfig.batch.switchOnOff = data.inputuserPO.isBatchRead == 1;
        this.settingItemConfig.ignore.switchOnOff = data.inputuserPO.isIgnore == 1;
        this.settingItemConfig.toUser.switchOnOff = data.inputuserPO.hasTouser == '1';
        if (!isVipGold(interfaceCode.INTERFACE_CODE_DIARY)){
          this.settingItemConfig.batch.switchOnOff = false;
        }
        this.show = true;
      });
      getWaterMarkBtn((data)=>{
        this.settingItemConfig.waterMark.switchOnOff = data.tbQyWatermarkSettingVO.isAddWatermark == '1';
      })
    },
    methods:{
      updateTaskSettingBtn(key,val){
        if (val != undefined){
          let params = {};
          params['belongAgent'] = dataBase.agentCode;
          params['isBatchRead'] = this.settingItemConfig.batch.switchOnOff ? 1 : 0;
          params[SettingBtn[key]] = val ? 1 : 0;
          if (key == 'batch' && !isVipGold(interfaceCode.INTERFACE_CODE_DIARY)){
            this.settingItemConfig[key].switchOnOff = false;
            _.alert("提示", "该功能仅限尊享版使用，<a href=\"https://qy.do1.com.cn/qwy/qiweipublicity/companysrv/vip/vip_gold_index.jsp?utm_source=pc&utm_medium=nav\" class='orange' target=\"_blank\">马上升级 ></a>");
            return;
          }
          if (key == 'waterMark'){
            params['agentCode'] = dataBase.agentCode;
            updateWaterMarkBtn(params,()=>{
              this.settingItemConfig[key].switchOnOff = val;
            })
          }else {
            updateDiarySetBtn(params,()=>{
              this.settingItemConfig[key].switchOnOff = val;
            })
          }
        }else {
          this.$router.push({name:SettingBtn[key]});
        }
      }
    },
    components:{
      settingItem,
    }
  }

</script>

<style lang="scss" scoped>

</style>

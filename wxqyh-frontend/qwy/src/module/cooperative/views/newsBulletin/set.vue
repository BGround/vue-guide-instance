<template>
  <div class="pb50">
    <setting-item :settingItemConfig="settingItemConfig" @listenToChange="listenToChange"></setting-item>
  </div>
</template>

<script>
  import settingItem from '@/components/base/settingItem';
  import {
    ajaxViewBatchReadState,
    setBatchReadState,
    getBirthdayTemp,
  } from '../../api/newsBulletin/getData';

  export default {
    data(){
      return{
        settingItemConfig:{
          'oneKeyRead':{
            title:'一键已阅功能',
            desc:'在应用端可将未阅消息一键标记为已阅',
            perm:'dynamicSet',
            switchOnOff:false,
          },
          'birthdayTipSet':{
            title:'开启生日提醒设置',
            desc:'提醒开启后隔天生效，在通讯录设置生日信息后，生日祝福将在生日当天推送',
            switchOnOff:false,
          },
          'birthdayWishSet':{
            title:'生日祝福设置',
            desc:'编辑生日祝福模版、接收祝福的成员、设置发送祝福时间等信息',
          },
          'anniversaryTip':{
            title:'开启入职周年祝福提醒',
            desc:'提醒开启后隔天生效，在通讯录设置员工入职时间后，入职周年祝福消息将在每天早上十点推送',
            switchOnOff:false,
          },
          'anniversarySet':{
            title:'入职周年祝福设置',
            desc:'编辑入职祝福模版、接收祝福的成员、设置发送祝福时间等信息',
          },
          'auditSet':{
            title:'新闻类型及审核设置',
            desc:'设置新闻类型信息，可开启新闻发布审核和评论审核功能',
            perm:'dynamicSet',
          },
          'authoritySet':{
            title:'应用端发布权限设置',
            desc:'设置应用端可发布动态的成员',
            perm:'dynamicAuthoritySet',
          },
          'blessingAppShow':{
            title:'员工祝福在应用端展示',
            desc:'员工祝福开启展示后，可在新闻类型中查看。',
            switchOnOff:false,
          },
          'menuSet':{
            title:'菜单设置',
            desc:'设置应用端消息主页菜单名称或增加二级菜单，修改后最迟24小时内生效',
            perm:'menuUpdate',
          },
        },
      }
    },
    mounted(){
      let self = this;
      ajaxViewBatchReadState({
        'belongAgent':dataBase.agentCode,
      },(data)=>{
        self.settingItemConfig['oneKeyRead'].switchOnOff = data.isBatchRead == '1' ? true : false;
      });

      getBirthdayTemp({},(data)=>{
        console.log(data);
      });
    },
    methods:{
      //获取生日模板信息
      getBirthdayTemp(){

      },
      listenToChange(key,onOff){
        let self = this;
        let keyObj = {
          'oneKeyRead':function(){
            self.settingItemConfig[key].switchOnOff = onOff;
            setBatchReadState({
              isBatchRead: onOff ? 1 : 0,
              belongAgent: dataBase.agentCode,
            },()=>{
              dataBase.top_alert('修改成功',true,3000);
            });
          },
          'auditSet':function(){
            self.$router.push({
              name:'newsBulletinAudit',
            });
          },
          'authoritySet':function () {
            self.$router.push({
              name:'newsBulletinAuthority',
            });
          },
          'menuSet':function () {
            self.$router.push({
              name:'newsBulletinMenu',
            });
          }
        };
        keyObj[key]();
      }
    },
    components:{
      settingItem,
    }
  };
</script>

<style lang="scss" scoped>

</style>

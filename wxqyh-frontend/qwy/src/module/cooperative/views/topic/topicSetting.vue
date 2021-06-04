<template>
  <div class="pb50">
    <setting-item :settingItemConfig="settingItemConfig" @listenToChange="listenToChange"></setting-item>
  </div>
</template>

<script>
  import settingItem from '@/components/base/settingItem';
  import {isVipGold} from '@/assets/js/vip-manager';
  import {
      ajaxViewBatchReadState,
      ajaxViewDefaultSendMsgConfig,
      setBatchReadState,
      setIsSendMsg
      } from '../../api/topic/getData'

  export default {
    data(){
      return{
        settingItemConfig:{
          'oneKeyRead':{
            title:'一键已阅功能',
            desc:'在应用端可将未阅消息一键标记为已阅',
            switchOnOff:false,
          },
          'topicAnonySet':{
            title:'社区匿名设置',
            desc:'可启用发布话题、发布评论匿名',
            perm:'topicAnony',
          },
          'topicTopSet':{
            title:'设置话题置顶个数',
            perm:'topNumber',
          },
          'topicTypeSet':{
            title:'话题类型',
            desc:'可创建多种话题类型，设置话题类型的：可见范围、话题发布权限、话题编辑时限、开启话题审核、评论审核、设置审核人',
            perm:'topicType',
          },
          'topicPublishAuthor':{
            title:'发布权限设置',
            desc:'设置可发布话题的成员',
            perm:'topicSetting',
          },
          'sendMsgSet':{
            title:'应用端发布话题默认发送消息通知',
            desc:'开启后，应用端默认开启：发布时发送消息通知',
            perm:'dynamicSet',
            switchOnOff:false,
          },
          'topicMenu':{
            title:'菜单设置',
            desc:'修改应用菜单名称或增加二级菜单链接，修改后最迟24小时内在应用端生效，可以一键恢复为系统默认菜单',
            perm:'menuUpdate'
          },
        },
        isGoldVip:false,//是否是vip
        vipHref: 'https://qy.do1.com.cn/qwy/qiweipublicity/companysrv/vip/vip_gold_index.jsp?utm_source=pc&utm_medium=nav',
      }
    },
    mounted(){
      let self = this;
      self.isGoldVip=isVipGold(interfaceCode.INTERFACE_CODE_TOPIC);
      ajaxViewBatchReadState((data)=>{
        this.settingItemConfig['oneKeyRead'].switchOnOff=data.isBatchRead?true:false;
      });
      ajaxViewDefaultSendMsgConfig((data)=>{
        this.settingItemConfig['sendMsgSet'].switchOnOff=data.isSendMsg=='1'?true:false;
      })
    },
    methods:{
      listenToChange(key,onOff){
        let self = this;
        let keyObj = {
          'oneKeyRead':function(){
            if(!self.isGoldVip){
              _.alert("提示", "该功能仅限尊享版使用，<a class='orange' href='"+ self.vipHref+"' target='_blank'>马上升级></a>");
              return ;
            }
            self.settingItemConfig[key].switchOnOff = onOff;
            setBatchReadState({
              isBatchRead: onOff ? 1 : 0,
            },()=>{
              dataBase.top_alert('修改成功',true,3000);
            });
          },
          'topicAnonySet':function(){
            self.$router.push({
              name:'topicAnonySet',
            });
          },
          'topicTopSet':function () {
            self.$router.push({
              name:'topicTopSet',
            });
          },
          'topicTypeSet':function () {
            self.$router.push({
              name:'topicTypeList',
            });
          },
          'topicPublishAuthor':function () {
            self.$router.push({
              name:'topicPublishAuthor',
            });
          },
          'sendMsgSet':function(){
            self.settingItemConfig[key].switchOnOff = onOff;
            setIsSendMsg({
              isSendMsg: onOff ? 1 : 0,
            },()=>{
              dataBase.top_alert('修改成功',true,3000);
            });
          },
          'topicMenu':function () {
            self.$router.push({
              name:'topicMenu',
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

<template>
  <div class="main_setting">
  <back :goBackConfig="goBackConfig"></back>
  <setting :settingItemConfig="settingConfig"
           @listenToChange="clickChange"></setting>
  </div>
</template>

<script>
  import setting from '@/components/base/settingItem.vue'
  import back from '@/components/base/qwuiGoBack.vue'
  import {getExpressUserPower,updateExpressUserPower,updateExpressPic,updateExpressViewOthers} from '../../api/newsBulletin/getExpress'
  export default {
    data() {
      return{
        settingConfig:{ //设置菜单
          'powerSetting':{
            title:'收录与查看权限',
            desc:'可设置能录入快递、查看快递信息的成员',
            callBack:''// 设置按钮的回调函数
          },
         'close':{
            title:'收录人关闭通知单权限',
            desc:'收录人在录入错误信息等特殊情况下，可以主动关闭通知单，并填写理由',
            switchOnOff:true,// 开关状态，无switchOnOff则为设置
            callBack:'',// 开关按钮的回调函数
          },
          'descSetting':{
            title:'备注设置',
            desc:'设置录入快递页面默认的备注提示信息',
            callBack:''// 设置按钮的回调函数
          },
          'pic':{
            title:'图片设置',
            desc:'设置快递是否需要上传图片',
            switchOnOff:true,// 开关状态，无switchOnOff则为设置
            callBack:'',// 开关按钮的回调函数
          },
          'open':{
            title:'快递记录相互可见',
            desc:'设置"未领取快递"列表是否相互可见',
            switchOnOff:true,// 开关状态，无switchOnOff则为设置
            callBack:'',// 开关按钮的回调函数
          },
          'menuSetting':{
            title:'菜单设置',
            desc:'修改应用菜单名称或增加二级菜单链接，修改后最迟24小时内在应用端生效，可以一键恢复为系统默认菜单\n' +
            '\n' +
            '应用端消息主页菜单，修改后1天内生效',
            callBack:''// 设置按钮的回调函数
          }
        },
        goBackConfig:{
          hasLine:true,
          lastPath:'首页',
          currPath:'设置'
        },
      }
    },
    beforeCreate(){
      getExpressUserPower('', (data) => {
        data.isclose == 0 ? this.settingConfig['close'].switchOnOff = false : ''
        data.picmust == 0 ? this.settingConfig['pic'].switchOnOff = false : ''
        data.canviewothers == 0 ? this.settingConfig['open'].switchOnOff = false : ''
      })
    },
    methods:{
      clickChange(key, val){ //点击开关或设置，key：点击的是第几个，val：如果是开关则为true或false
        if (val != undefined) {
          this.settingConfig[key].switchOnOff = val;
        }
        if(key == 'close'){
          this.updateExpressUserPower(val?1:0)
        }else if(key == 'pic'){
          this.updateExpressPic(val?1:0)
        } else if(key == 'open'){
          this.updateExpressViewOthers(val?1:0)
        } else if(key != undefined){
          this.$router.push({
            path:'/express/' + key,
          });
        }
      },
      updateExpressUserPower(val){ //收录人关闭通知单权限
        updateExpressUserPower({
          power:val
        }, ()=>{});
      },
      updateExpressPic(val){ //设置快递是否需要上传图片
        updateExpressPic({
          picmust:val
        }, ()=>{});
      },
      updateExpressViewOthers(val){ //快递记录相互可见
        updateExpressViewOthers({
          canviewothers:val
        }, ()=>{});
      }
    },
    components:{
      setting,
      back,
    }
  }
</script>
<style scoped>
  .main_setting{
    padding-top:20px
  }
</style>

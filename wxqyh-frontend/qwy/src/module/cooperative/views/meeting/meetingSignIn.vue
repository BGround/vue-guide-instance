<template>
  <div>
    <!--返回按钮-->
    <qwui-go-back :goBackConfig="goBackConfig"></qwui-go-back>
    <div class="qwui-item_box" v-for="(item,key) in signInConfig" :key="key" v-show="!item.hide">
      <span class="qwui-item_title">{{ item.title }}</span>
      <div class="qwui-item_content">
        <qwui-checkbox v-model="item.isCheck" :disabled="item.disabled">开启</qwui-checkbox>
        <span class="qwui-item_desc">{{ item.desc }}</span>
        <a v-if="item.vipTip" class="qwui-vip_tip" :href="vipHref" target="_blank">尊享版功能</a>
      </div>
    </div>
    <div class="qwui-save_btn">
      <qwui-button type='primary' @click="updateSignSetting">保存</qwui-button>
    </div>
  </div>
</template>

<script>
  import qwuiGoBack from '@/components/base/qwuiGoBack';
  import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox';
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import { isVipGold } from '@/assets/js/vip-manager';
  import { getSignInSetting,updateSignInSetting } from '../../api/meeting/getData';

  export default {
    data(){
      return {
        goBackConfig:{
          hasLine:false,
          lastPath:'设置',
          currPath:'会议签到/签退设置'
        },
        signInConfig:{
          shake:{
            title:'摇一摇签到功能：',
            desc:'发起新会议时可以选择【摇一摇签到功能】功能',
            isCheck:true
          },
          signOff:{
            title:'会议签退：',
            desc:'发起新会议时可以选择【会议签退】功能',
            vipTip:true,
            isCheck:true,
            disabled:false
          },
          delaySignOut:{
            title:'',
            desc:'会议结束后1小时内支持签退（不开启则会议结束即不支持签退）',
            isCheck:true,
            hide:false,
          },
          qrCode:{
            title:'二维码签到/退：',
            desc:'发起新会议时可以选择【二维码签到/退】功能',
            isCheck:true
          },
          refresh:{
            title:'二维码动态刷新：',
            desc:'发起新会议时可以选择【二维码动态刷新】功能',
            vipTip:true,
            isCheck:true,
            disabled:false
          }
        }
      }
    },
    created(){
      // 获取签到、签退设置
      getSignInSetting((data)=>{
        this.signInConfig.shake.isCheck = data.shakeStatus === '1';
        this.signInConfig.signOff.isCheck = data.isQuickmarkOut === 1;
        this.signInConfig.delaySignOut.isCheck = data.isDelaySignOut === 1;
        this.signInConfig.qrCode.isCheck = data.isQuickmark === '0';
        this.signInConfig.refresh.isCheck = data.isDynamic === 1;

        // 判断是否是尊享版vip
        if (!isVipGold(interfaceCode.INTERFACE_CODE_MEET)){
          this.signInConfig.signOff.isCheck = false;
          this.signInConfig.signOff.disabled = true;
          this.signInConfig.refresh.isCheck = false;
          this.signInConfig.refresh.disabled = true;
        }
      })
    },
    computed:{
      vipHref(){
        return _.baseURL + '/qiweipublicity/companysrv/vip/vip_gold_index.jsp?utm_source=pc&utm_medium=nav'
      }
    },
    watch:{
      'signInConfig.signOff.isCheck':function () {
        this.signInConfig.delaySignOut.hide = !this.signInConfig.signOff.isCheck;
        this.signInConfig.delaySignOut.isCheck = this.signInConfig.signOff.isCheck;
        this.signInConfig.qrCode.title = this.signInConfig.signOff.isCheck
          ? '二维码签到/退：'
          : '二维码签到：'
      }
    },
    methods:{
      updateSignSetting(){
        let params = {
          shakeStatus: this.signInConfig.shake.isCheck ? 1 : 0,
          isQuickmarkOut: this.signInConfig.signOff.isCheck ? 1 : 0,
          isQuickmark: this.signInConfig.qrCode.isCheck ? 0 : 1,
          isDynamic: this.signInConfig.refresh.isCheck ? 1 : 0,
          isDelaySignOut:this.signInConfig.delaySignOut.isCheck ? 1 : 0,
          type: 2
        };
        updateSignInSetting(params,()=>{
          _.alert('提示','保存成功',function () {
            this.$router.go(-1)
          });
        })
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

  .qwui-item_box {
    margin-bottom: 5px;
  }
  .qwui-item_title {
    display: inline-block;
    width: 130px;
    text-align: right;
    vertical-align: bottom;
  }

  .qwui-item_content {
    display: inline-block;

    .qwui-item_desc {
      margin-left: 10px;
      margin-right: 20px;
      vertical-align: bottom;
      color: #999;
    }

    .qwui-vip_tip {
      vertical-align: bottom;
      color: #f87b00;
      cursor: pointer;
    }
  }


  .qwui-save_btn {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e4e4e4;
    text-align: center;
  }
</style>

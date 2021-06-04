<template>
  <div>
    <setting-item :settingItemConfig="settingItemConfig" @listenToChange="updateMeetSettingBtn"></setting-item>
  </div>
</template>

<script>
  import settingItem from '@/components/base/settingItem';
  import { isVipGold } from '@/assets/js/vip-manager';
  import { getMeetingSetting,updateMeetingSetting } from '../../api/meeting/getData';

  const SettingBtn = {
    roomSet:'meetingRoom',
    address:'isLocation',
    manyRoom:'isRoom',
    approval:'isApproval',
    cycle:'isCycle',
    signIn:'meetingSignIn',
    permHour:'meetingPermission',
    signage:'meetingSignage',
    menu:'meetingMenu'
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
          roomSet:{
            title:'会议室设置',
            desc:'管理会议室的名称、设备、以及可使用的成员等信息',
            perm:'meetingRoomList'
          },
          address:{
            title:'签到时记录地理位置',
            desc:'会议签到时，进行地址定位并生成记录',
            switchOnOff: false,
            perm:'meetingLocation'
          },
          manyRoom:{
            title:'启用多选会议室功能',
            desc:'开启后，发起会议可以选择多个会议室',
            switchOnOff: false,
            perm:'meetingshakearound'
          },
          approval:{
            title:'启用会议请假审批功能',
            desc:'开启后，参会人员请假需要审批通过后才加入到请假列表中',
            switchOnOff: false,
            perm:'meetingshakearound'
          },
          cycle:{
            title:'启用周期会议功能',
            desc:'开启后，会议发起人可创建周期性会议',
            switchOnOff: false,
            perm:'meetingshakearound'
          },
          signIn:{
            title:'会议签到/签退设置',
            desc:'设置用户发起新会议时可选择开启会议签退、二维码签到/退、二维码动态刷新、摇一摇签到等功能',
            perm:'meetingRoomList'
          },
          permHour:{
            title:'会议权限与时长设置',
            desc:'设置能发起新会议的成员、可预定的时间段、以及每次会议的时长',
            perm:'meetingSetting'
          },
          signage:{
            title:'数字标牌设备设置',
            desc:'设置“数字标牌”的默认背景图片、Logo',
            perm:'meetingRoomList'
          },
          menu:{
            title:'菜单设置',
            desc:'设置应用端消息主页菜单名称或增加二级菜单，修改后最迟24小时内生效',
            perm:'menuUpdate'
          }
        }
      }
    },
    created(){
      dataBase.agentCode = 'meet';
      // 获取设置页按钮开关
      getMeetingSetting({type:1},(data)=>{
        this.settingItemConfig.address.switchOnOff = data.isLocation == '0';
        this.settingItemConfig.manyRoom.switchOnOff = data.isRoom == 1;
        this.settingItemConfig.approval.switchOnOff = data.isApproval == 1;
        this.settingItemConfig.cycle.switchOnOff = data.isCycle == 1;

      })

    },
    methods:{
      updateMeetSettingBtn(key,val){
        if(val != undefined){
          if (!isVipGold(interfaceCode.INTERFACE_CODE_MEET) && vipFuncArr.indexOf(key) != -1){
            this.settingItemConfig[key].switchOnOff = false;
            _.alert("提示", "该功能仅限尊享版使用，<a href=\"https://qy.do1.com.cn/qwy/qiweipublicity/companysrv/vip/vip_gold_index.jsp?utm_source=pc&utm_medium=nav\" target=\"_blank\">马上升级 ></a>");
            return;
          }
          let params = {};
          params['belongAgent'] = dataBase.agentCode;
          params[SettingBtn[key]] = val ? 1 : 0;
          key == 'address'
            ? params['isLocation'] = (val ? '0' : '1')
            : '';

          updateMeetingSetting(params,()=>{
            this.settingItemConfig[key].switchOnOff = val;
          })
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

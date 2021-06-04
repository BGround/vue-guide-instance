<template>
  <div>
    <!--返回按钮-->
    <qwui-go-back :goBackConfig="goBackConfig"></qwui-go-back>
    <div>
      <div class="qwui-item_box">
        <span class="qwui-item_title">可发起会议的成员：</span>
        <div class="qwui-item_content">
          <pick-exam :useDepts="useDepts"
                     :useTags="useTags"
                     :useUsers="useUsers"
                     :useTab="useTab"
                     :useRadio="useRadio"
                     @changeRadio="changeRadio"
                     @chooseDone="chooseDone"></pick-exam>
        </div>
      </div>
      <div class="qwui-item_box">
        <span class="qwui-item_title">会议时长限制：</span>
        <div class="qwui-item_content">
          <qwui-input :value="meetTimes" inputType="sort" @input="changeMeetTimes"></qwui-input>
          <span>小时</span>
          <span class="qwui-item_desc">(0为不限制)</span>
        </div>
      </div>
      <div class="qwui-item_box">
        <span class="qwui-item_title">可预定：</span>
        <div class="qwui-item_content">
          <qwui-input :value="reservationDays" inputType="sort" :disabled="!isVipGold" @input="changeReservationDays"></qwui-input>
          <span>天内的会议室</span>
          <span class="qwui-item_desc">(0为不限制，以自然天计算)</span>
          <a class="qwui-vip_tip" :href="vipHref" target="_blank">尊享版功能</a>
        </div>
      </div>
    </div>
    <div class="qwui-save_btn">
      <qwui-button type='primary' @click="updateMeetingPerm">保存</qwui-button>
    </div>
  </div>
</template>

<script>
  import qwuiGoBack from '@/components/base/qwuiGoBack';
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import pickExam from '@/components/pickPerson/pickExam';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
  import { isVipGold } from '@/assets/js/vip-manager';
  import { getMeetPermAndTime,updateMeetPermAndTime } from '../../api/meeting/getData';

  export default {
    data(){
      return {
        goBackConfig:{
          hasLine:false,
          lastPath:'设置',
          currPath:'会议权限与时长设置'
        },
        id:'',
        useDepts:[],
        useTags:[],
        useUsers:[],
        useTab:[
          {text:'部门'},
          {text:'标签'},
          {text:'标签人员'},
          {text:'特定人员'},
          {text:'批量导入'},
          {text:'高级筛选'},
        ],
        useRadio:'所有人',
        // 会议时长限制
        meetTimes:0,
        // 可预定时长
        reservationDays:0,
        isVipGold:true,
      }
    },
    created(){
      getMeetPermAndTime((data)=>{
        if (data.tbQyIntercalateVO && data.tbQyIntercalateVO.rangs === '3'){
          this.useRadio = '特定对象';
        }
        this.useDepts = data.selectDeptVOList || [];
        this.useTags = data.selectTagVOList || [];
        this.useUsers = data.selectUserVOList || [];
        this.id = data.tbMeetingTimesPO.id || '';
        this.meetTimes = data.tbMeetingTimesPO.times || 0;
        this.reservationDays = data.tbMeetingTimesPO.reservationDays || 0;

        if (!isVipGold(interfaceCode.INTERFACE_CODE_MEET)){
          this.reservationDays = '';
          this.isVipGold = false;
        }

      })
    },
    computed:{
      vipHref(){
        return _.baseURL + '/qiweipublicity/companysrv/vip/vip_gold_index.jsp?utm_source=pc&utm_medium=nav'
      }
    },
    methods:{
      updateMeetingPerm(){
        let deptIds = [];
        let tagIds = [];
        let userIds = [];
        let range = this.useRadio == '所有人' ? 1 : 3;

        if (range == 3 && this.useDepts.length == 0 && this.useTags.length == 0 && this.useUsers.length == 0){
          _.alert('提示','特定对象为空');
          return;
        }
        if (range == 3){
          this.useDepts.forEach((item)=>{
            deptIds.push(item.nodeId || item.deptId || item.id)
          });
          this.useTags.forEach((item)=>{
            tagIds.push(item.tagId || item.id)
          });
          this.useUsers.forEach((item)=>{
            userIds.push(item.userId || item.id)
          });
        }

        let params = {
          range:range,
          deptIds:deptIds.join('|'),
          tagIds:tagIds.join('|'),
          userIds:userIds.join('|'),
          'tbMeetingTimesPO.id':this.id,
          'tbMeetingTimesPO.times':this.meetTimes || 0,
          'tbMeetingTimesPO.reservationDays':this.reservationDays || 0
        };
        updateMeetPermAndTime(params,()=>{
          _.alert('提示','保存成功',function () {
            this.$router.go(-1)
          });
        })
      },
      chooseDone(dept,tag,user){
        this.useDepts = dept;
        this.useTags = tag;
        this.useUsers = user;
      },
      changeRadio(val){
        this.useRadio = val;
      },
      changeMeetTimes(val){
        this.meetTimes = val || 0;
      },
      changeReservationDays(val){
        this.reservationDays = val || 0;
      }
    },
    components:{
      qwuiGoBack,
      qwuiButton,
      pickExam,
      qwuiInput
    }
  }

</script>

<style lang="scss" scoped>
  .qwui-item_box {
    margin-bottom: 10px;
  }
  .qwui-item_title {
    display: inline-block;
    width: 130px;
    margin-top: 5px;
    text-align: right;
    vertical-align: top;
  }
  .qwui-item_content {
    display: inline-block;

    .qwui-item_desc{
      margin-right: 10px;
      color: #999;
    }
  }

  .qwui-vip_tip {
    color: #f87b00;
    cursor: pointer;
  }

  .qwui-save_btn {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e4e4e4;
    text-align: center;
  }
</style>

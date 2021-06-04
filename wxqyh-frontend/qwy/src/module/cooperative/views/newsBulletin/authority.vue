<template>
  <div class="qwui-authority_wrap">
    <div class="qwui-bar_wrap">
      <qwuiButton @click="goBack">&nbsp;返回&nbsp;</qwuiButton>
    </div>
    <qwTitle :titleContent="titleContent"></qwTitle>
    <div class="qwui-authority_main">
      <div class="qwui-use_manager">
        <div class="qwui-use_manager_left">
          <span>使用管理员权限</span>
          <span class="info">（发布对象为后台绑定的管理员管理对象）</span>
          <span>：</span>
        </div>
        <div class="qwui-use_manager_right">
          <qwuiSwitch :defaultStatus="defaultStatus" @change="change"></qwuiSwitch>
        </div>
      </div>
      <div class="qwui-public_dynamic">
        <span class="qwui-dynamic_must">*</span>
        <span>可发布动态的成员：</span>
      </div>
      <pick-exam :useTab="useTab"
                 :useDepts="useDepts"
                 :useTags="useTags"
                 :useUsers="useUsers"
                 :useRadio="useRadio"
                 @chooseDone="chooseDone"
                 @changeRadio="changeRadio"></pick-exam>
    </div>
    <div class="qwui-operation">
      <qwuiButton v-perm="'dynamicAuthoritySet'" type='primary' @click="save">&nbsp;保存&nbsp;</qwuiButton>
    </div>
  </div>
</template>

<script>
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwuiSwitch from '@/components/qwuiBase/qwuiSwitch/qwuiSwitch';
  import qwTitle from '@/components/base/QwTitle';
  import pickExam from '@/components/pickPerson/pickExam';
  import {getDynamicPublishAuthor,updateDynamicPublishAuthor} from '../../api/newsBulletin/getData';

  export default {
    mounted(){
      let self = this;
      getDynamicPublishAuthor({
        belongAgent:dataBase.agentCode,
      },(data)=>{
        //设置是否使用了管理员权限
        if(data.dynamicSettingPO&&data.dynamicSettingPO.val=='1'){
          self.defaultStatus = true;
        }
        //设置选中的人员
        let tbQyIntercalateVO = data.tbQyIntercalateVO;
        if(tbQyIntercalateVO){
          self.useRadio = data.tbQyIntercalateVO.rangs == '1' ? '所有人' : '特定对象';
          self.useUsers = data.selectUserVOList;
          self.useDepts = data.selectDeptVOList;
          self.useTags = data.selectTagVOList;
          let deptIds = [];
          let tagIds = [];
          let userIds = [];
          if(data.selectDeptVOList){
            data.selectDeptVOList.forEach((item,index)=>{
              deptIds.push(item.deptId);
            });
          }
          if(data.selectTagVOList) {
            data.selectTagVOList.forEach((item, index) => {
              tagIds.push(item.tagId);
            });
          }
          if(data.selectUserVOList) {
            data.selectUserVOList.forEach((item, index) => {
              userIds.push(item.userId);
            });
          }
          self.deptIds = deptIds.join('|');
          self.tagIds = tagIds.join('|');
          self.userIds = userIds.join('|');
        }
      });
    },
    data(){
      return{
        titleContent:'设置权限',
        defaultStatus:false,
        useTab:[
          {text:'部门'},
          {text:'标签'},
          {text:'标签人员'},
          {text:'特定人员'},
          {text:'批量导入'},
          {text:'高级筛选'},
        ],
        useDepts:[],
        useTags:[],
        useUsers:[],
        useRadio:'所有人',
        deptIds:[],
        userIds:[],
        tagIds:[],
      }
    },
    methods:{
      change(isOn){
        this.defaultStatus = isOn;
      },
      goBack(){
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/');
      },
      //返回的部门、标签、人员数组
      chooseDone:function (dept,tag,user) {
        console.log(dept,tag,user)
        let self = this;
        let deptIds = [];
        let tagIds = [];
        let userIds = [];
        dept.forEach((item,index)=>{
          deptIds.push(item.nodeId||item.deptId);
        });
        tag.forEach((item,index)=>{
          tagIds.push(item.id||item.tagId);
        });
        user.forEach((item,index)=>{
          userIds.push(item.userId);
        });
        self.deptIds = deptIds.join('|');
        self.tagIds = tagIds.join('|');
        self.userIds = userIds.join('|');
        console.log(self.deptIds,self.tagIds,self.userIds)
      },
      changeRadio(val){
        this.useRadio = val;
      },
      save(){
        let self = this;
        console.log(self.defaultStatus);
        updateDynamicPublishAuthor({
          'useManagerAuthor':self.defaultStatus?1:0,
          range: self.useRadio=='所有人'?1:3,
          deptIds:self.deptIds,
          userIds: self.userIds,
          tagIds:self.tagIds,
          belongAgent: dataBase.agentCode,
        },(data)=>{
          console.log(data);
          let users = data.users;
          //设置成功
          if(users && users.length>0){
            let msg = '';
            for(let items in users){
              if(items < 5){
                msg += users[items].personName+","
              }else{
                break;
              }
            }
            msg = msg.substring(0, msg.length-1);
            if(users.length == 1){
              msg += "未绑定管理账户，请在设置中心-子账户管理页面绑定后再试";
            }else if(users.length > 5){
              msg += "等" + users.length + "个用户未绑定管理账户，请在设置中心-子账户管理页面绑定后再试";
            }else{
              msg += "共" + users.length + "个用户未绑定管理账户，请在设置中心-子账户管理页面绑定后再试";
            }
            dataBase.top_alert(msg,false,3000);
          }else{
            dataBase.top_alert('操作成功',true,3000);
          }
        });
      },
    },
    components:{
      qwuiButton,
      qwTitle,
      qwuiSwitch,
      pickExam,
    }
  }
</script>

<style lang="scss" scoped>
  .qwui-authority_wrap{
    padding-top: 20px;
    .qwui-bar_wrap{
      margin-bottom: 15px;
    }
    .qwui-authority_main{
      padding-top: 20px;
      .qwui-use_manager{
        display: flex;
        justify-content: space-between;
        background:#f6f6f6;
        padding-left: 5px;
        height: 30px;
        line-height: 30px;
        .qwui-use_manager_left{
          flex:1;
          .info{
            color:#999;
          }
        }
      }
      .qwui-public_dynamic{
        margin-top: 10px;
        .qwui-dynamic_must{
          color:red;
          margin-right: 5px;
        }
      }
    }
    .qwui-operation{
      margin-top: 20px;
      border-top: 1px solid #dbdbdb;
      padding: 20px 0;
      text-align: center;
    }
  }
</style>

<template>
  <div>
    <!--返回按钮-->
    <qwui-go-back :goBackConfig="goBackConfig"></qwui-go-back>
    <div class="qwui-setting_title">设置权限</div>
    <div class="qwui-setting_rangs">
      <p><span class="start">*</span>可发布任务的成员</p>
      <div>
        <qwui-radio v-model="range" label="1" border>所有人</qwui-radio>
        <qwui-radio v-model="range" label="3" border>特定对象</qwui-radio>
      </div>
      <div v-if="range == 3" class="qwui-person_count">
        <qwui-button @click="addPerson">添加</qwui-button>
        <span>已选
          <span class="qwui-count_num">{{ deptCount }}</span>
          部门，
          <span class="qwui-count_num">{{ personCount }}</span>
          成员
        </span>
        <span v-if="deptCount || personCount" class="clearSelect" @click="deleteAll">清空已选</span>
        <!--选人展示框-->
        <div v-if="deptCount || personCount" class="qwui-main_result">
          <div class="qwui-selected_input">
            <!--  部门已选择  -->
            <div class="qwui-dept_selected" v-for="(item,index) in defaultDepts">
              <div class="qwui-dept_selected_icon"></div>
              {{item.nodeName ? item.nodeName : item.deptName}}
              <span class="qwui-selected_close" @click="deleteDept(index)">×</span>
            </div>

            <!--  人员选择  -->
            <div class="qwui-inline">
              <div class="qwui-dept_selected" v-for="(item,index) in defaultUsers">
                <img v-if="item.headPic && item.headPic!='0'" class="qwui-dept_selected_icon" :src="item.headPic">
                <div v-else class="qwui-user_default_img"></div>
                {{item.personName}}
                <span class="qwui-selected_close" @click="deleteUser(index)">×</span>
              </div>
            </div>
          </div>
        </div></div>
      </div>
      <!--选人组件-->
      <pick-person :show="show"
                   :defaultDepts="defaultDepts"
                   :defaultUsers="defaultUsers"
                   :functionTab="functionTab"
                   @chooseDone="chooseDone"
                   @closeThis="closeThis"></pick-person>

      <div class="qwui-save_btn">
        <qwui-button type='primary' @click="updatePermission">保存</qwui-button>
      </div>

  </div>
</template>

<script>
  import qwuiGoBack from '@/components/base/qwuiGoBack';
  import qwuiRadio from '@/components/qwuiBase/qwuiRadio/qwuiRadio';
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import pickPerson from '@/components/pickPerson/pickPerson';

  import { getTaskPermission,updateTaskPermission } from '../../api/taskAssignment/getData';

  export default {
    data(){
      return {
        range:'1',
        id:'',
        show:false,
        defaultDepts:[],// 部门
        defaultUsers:[],// 成员
        functionTab:[
          {text:'部门'},
          {text:'标签人员'},
          {text:'特定人员'},
          {text:'批量导入'},
          {text:'高级筛选'},
        ],
        goBackConfig:{
          hasLine:false,
          lastPath:'设置',
          currPath:'发布权限'
        }
      }
    },
    mounted(){
      getTaskPermission({keywork:'taskAdd',agent:'task'},(data)=>{
        if (data.tbQyIntercalatePO){
          this.range = data.tbQyIntercalatePO.rangs;
          this.id = data.tbQyIntercalatePO.id;
        }
        // 部门
        if (data.selectDeptVOList){
          this.defaultDepts = data.selectDeptVOList;
        }
        if (data.selectUserVOList){
          this.defaultUsers = data.selectUserVOList;
        }
      })
    },
    methods:{
      addPerson(){
        this.show = true;
      },
      chooseDone(deptSelected,tagList,specialUsers){
        this.defaultDepts = deptSelected;
        this.defaultUsers = specialUsers;
        this.show = false;
      },
      closeThis(){
        this.show = false;
      },
      deleteDept(index){
        this.defaultDepts.splice(index,1);
      },
      deleteUser(index){
        this.defaultUsers.splice(index,1);
      },
      deleteAll(){
        this.defaultDepts.splice(0,this.defaultDepts.length);
        this.defaultUsers.splice(0,this.defaultUsers.length);
      },
      updatePermission(){
        if (this.range == 3 && !this.deptCount && !this.personCount){
          _.alert('提示','特定对象为空');
          return;
        }
        let deptIds = [];
        let userIds = [];
        let self = this;
        if (this.range == 3){
          this.defaultDepts.forEach((item)=>{
            deptIds.push(item.nodeId || item.deptId);
          });
          this.defaultUsers.forEach((item)=>{
            userIds.push(item.userId);
          });
        }
        let params = {
          'tbQyIntercalatePO.permission':'taskAdd',
          'tbQyIntercalatePO.agentCode':'task',
          'range':this.range,
          'tbQyIntercalatePO.id':this.id,
          'agent':'task',
          'a1':'on',
          'isSetting':1,
          'deptIds':deptIds.join('|'),
          'userIds':userIds.join('|')
        };
        if (!this.id){
          params['tbQyIntercalatePO.belongAgent'] = 'task';
        }
        updateTaskPermission(this.id,params,()=>{
          dataBase.top_alert('更新成功',true,3000);
          self.$router.push({name:'taskSetting'})
        });
      }
    },
    computed:{
      deptCount(){
        return this.defaultDepts.length;
      },
      personCount(){
        return this.defaultUsers.length;
      }
    },
    components:{
      qwuiGoBack,
      qwuiRadio,
      qwuiButton,
      pickPerson
    }
  }
</script>

<style lang="scss" scoped>
  .qwui-setting_title {
    height: 47px;
    line-height: 47px;
    margin-top: 15px;
    padding-left: 20px;
    font-weight: 700;
    font-size: 16px;
    background-color: #F5F5F5;
    border-left: 4px solid #F87B00;
    color: #666666;
  }
  .qwui-setting_rangs{
    margin-top: 30px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e4e4;

    .start {
      margin-right: 5px;
      color: red;
    }
  p {
      margin: 5px 0;
    }
  }
  .qwui-person_count {
    margin-top: 5px;

    .qwui-count_num {
      color: #f87b00;
    }

    .clearSelect {
      float: right;
      color: #999;
      line-height: 28px;
      cursor: pointer;

      &:hover{
        color: red;
      }
    }
  }
  .qwui-main_result{
    padding: 5px 0 10px;

    .qwui-selected_input{
      background: #fff;
      border: 1px solid #cccccc;
      padding: 5px;
      max-height: 110px;
      overflow: auto;
      box-sizing: border-box;

        .qwui-inline{
          display: inline;
          vertical-align: middle;
        }
    }
  }
  .qwui-dept_selected{
    display: inline-block;
    width: auto;
    height: 24px;
    margin: 5px 5px 0 0;
    line-height: 24px;
    list-style: none;
    background-color: #eee;
    border: 1px solid #ddd;
    border-left:none;
    border-radius: 3px;
    vertical-align: top;

  .qwui-dept_selected_icon{
    display: inline-block;
    width: 26px;
    height: 24px;
    margin-right: 5px;
    list-style: none;
    vertical-align: top;
    background: url(~assets/images/dept_icon.png) no-repeat center;
  }
  .qwui-user_default_img{
    display: inline-block;
    width: 26px;
    height: 24px;
    margin-right: 5px;
    list-style: none;
    vertical-align: top;
    background: url(~assets/images/touxiang02.png) no-repeat center;
    background-size: 26px 24px;
  }
  .qwui-selected_close{
    display: inline-block;
    width: 18px;
    height: 18px;
    margin: 3px 5px 0 10px;
    line-height: 17px;
    text-align: center;
    color: #afafaf;
    font-size: 19px;
    font-weight: 600;
    cursor: pointer;
    vertical-align: text-bottom;
    border-radius: 100%;
    opacity: 1;

    &:hover{
       background: #ffb164;
       color: #fff;
     }
  }
  }
  .qwui-save_btn {
    padding-top: 20px;
    text-align: center;
  }

</style>

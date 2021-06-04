<template>
  <div class="express_desc">
    <div class="express_desc_line"></div>
    <back :goBackConfig="goBackConfig"></back>
    <div class="express_title">
      <h3>设置权限</h3>
    </div>
    <div class="express_desc_line"></div>
    <label><span class="mustInput">*</span>可录入快递的成员：</label>
    <pick-exam :useTab="useTab"
               :useRadio="useRadio"
               :useDepts="useDepts"
               :useUsers="useUsers"
               @changeRadio="changeRadio"
               @chooseDone="chooseDone"></pick-exam>
    <div class="express_button">
      <qwui-button type='primary' @click="changePower">保存</qwui-button>
    </div>
  </div>
</template>
<script>
  import back from '@/components/base/qwuiGoBack.vue'
  import pickExam from '@/components/pickPerson/pickExam'
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
  import {viewIntercalate, expressAdd, expressUpdate} from '../../api/newsBulletin/getExpress'
  export default {
    components:{
      back,
      pickExam,
      qwuiButton
    },
    data(){
      return {
        useTab:[
          {text:'部门'},
          {text:'标签人员'},
          {text:'特定人员'},
          {text:'批量导入'},
          {text:'高级筛选'},
        ],
        useDepts:[],
        useUsers:[],
        useRadio:'所有人',
        operation:1, //操作描述，1保存，2添加
        searchParams:{ //接口参数
          'tbQyIntercalatePO.permission': 'expressSet',
          'tbQyIntercalatePO.agentCode': 'express',
          'a1': 'on',
          'deptIds': '',
          'userIds': '',
          'range': 1,
          'tbQyIntercalatePO.id': '',
          'agent': 'express',
          'isSetting': 1
        },
        goBackConfig:{
          hasLine:false,
          currPath:'收录与查看权限设置'
        },
      }
    },
    created(){
      viewIntercalate('',(data)=>{ //初始化数据
        if(data.hasNone){
          this.operation = 2
        } else {
          this.operation = 1;
          this.searchParams['tbQyIntercalatePO.id'] = data.tbQyIntercalatePO.id
          let rangs=data.tbQyIntercalatePO.rangs;
          if(rangs != '1') { //不是所有人
            this.useRadio = '特定对象'
            let departIds = data.departIds;
            let departName = data.departName;
            //拼接部门
            if (departIds != "" && departIds != undefined) {
              let departId = departIds.split("|");
              let departmentName = departName.split("|");
              for (let i = 0; i < departId.length; i++) {
                let dept = {};
                dept.deptId = departId[i];
                dept.deptName = departmentName[i];
                this.useDepts.push(dept);
              }
            }
            this.useUsers = data.persons || [];
          }
        }
      })
    },
    methods:{
      //返回的部门、标签、人员数组
      chooseDone:function (dept,tag,user) {
        this.useDepts = dept;
        this.useUsers = user;
      },
      changeRadio(val){
        this.useRadio = val;
      },
      //保存设置
      changePower(){
        this.resetParams();
        if(this.searchParams['range'] == 3 && this.useDepts.length == 0 && this.useUsers.length == 0){
          _.alert('提示信息','特定对象为空')
          return
        }
        let self = this;
        if(self.operation == 2){
          expressAdd(self.searchParams,(data)=>{
            _.alert('提示','新增成功',function(){
              self.$router.push('/express')
            });
          })
        } else {
          self.searchParams['id'] = self.searchParams['tbQyIntercalatePO.id'];
          expressUpdate(self.searchParams,(data)=>{
            _.alert('提示','更新成功',function(){
              self.$router.push('/express')
            });
          })
        }
      },
      //设置参数
      resetParams(){
        this.searchParams['range'] = this.useRadio == '所有人' ? 1 : 3;
        this.searchParams['deptIds'] = this.useDepts.map(value => {
          return value.nodeId || value.deptId
        }).join('|')
        this.searchParams['userIds']= this.useUsers.map(value => {
          return value.userId
        }).join('|')
      }
    }
  }
</script>
<style scoped>
  .express_desc{
    padding:20px;
  }
  .express_desc_line{
    height:20px;
    width:100%
  }
  .mustInput{
    color: red;
    margin-right: 5px;
    font-style: normal;
  }
  .express_button{
    width:100%;
    margin-top: 10px;
    padding-top: 20px;
    text-align: center;
    border-top: 1px solid #eee;
  }
  .express_title{
    height: 47px;
    margin-top: 15px;
    border-left: 4px solid #F87B00;
    line-height: 47px;
    font-size: 16px;
    background-color: #F5F5F5;
  }
  .express_title h3{
    float: left;
    margin-left: 20px;
    color: #666;
    font-weight: 700;
  }
</style>

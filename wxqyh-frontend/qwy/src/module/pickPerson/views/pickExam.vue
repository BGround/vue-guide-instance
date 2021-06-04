<template>
  <div>
    <crm-pick :useTab="useTab"
              :useDepts="useDepts"
              :useTags="useTags"
              :useUsers="useUsers"
              :maxUser="6"
              @chooseDone="chooseDone"></crm-pick>
    <pick-exam :useTab="useTab"
              :useDepts="useDepts"
              :useTags="useTags"
              :useUsers="useUsers"
               :intersectionDept="useDepts"
               :intersectionTag="useTags"
               :intersectionUser="useUsers"
               onlyUser
              @chooseDone="chooseDone"></pick-exam>
  </div>
</template>
<script>
  import crmPick from  '@/components/pickPerson/crmPickPerson'
  import pickExam from '@/components/pickPerson/pickExam'
  export default {
    data(){
      return{
        dataBase:dataBase,
        useTab:[
          {text:'部门'},
          {text:'标签'},
          {text:'特定人员'},
          {text:'标签人员'},
          {text:'批量导入'},
          {text:'高级筛选'},
        ],
        useDepts:[],
        useTags:[],
        useUsers:[]
      }
    },
    created:function () {
      this.setData()
    },
    methods:{
      setData:function () {
        var self = this;
        setTimeout(function () {
          self.useDepts = [
            {
              deptId:"1734bfcb5628737e220531cca42e93fd",
              deptName:"事业二部揪咪",
              value:0
            },
            {
              deptId:'632ce24955c32ba71c9f3d8707392f95',
              deptName:"222",
              value:1
            },
          ]
          self.useUsers = [
            {
              userId:'7f15f5b13d254ed7a46a42e1ca0ca225',
              value:1
            },
          ]
          self.useTags = [
            {
              tagId:'96fa0ac1a18948358e988ba557b6ea81'
            },
          ]
        },2000);
      },
      //返回的部门、标签、人员数组
      chooseDone:function (dept,tag,user) {
        console.log(dept.length,tag.length,user.length)
      }
    },
    components:{
      crmPick,
      pickExam
    }
  }
</script>

<template>
  <div class="permission_wrap">
    <div class="bar_wrap">
        <qwuiButton @click="goBack">&nbsp;返回&nbsp;</qwuiButton>
    </div>
    <qwTitle :titleContent="titleContent"></qwTitle>
    <div class="permission_main">
      <div>可发表社区话题的成员：</div>
      <pickExam
          :useTab="visibleTab"
          :useDepts="useDepts"
          :useUsers="useUsers"
          :useTags="useTags"
          :useRadio.sync="useRadio"
          @chooseDone="chooseDone"
          @changeRadio="changeRadio"></pickExam>
    </div>
    <div class="operation">
        <qwuiButton v-perm="'topicSetting'" type='primary' @click="save">&nbsp;保存&nbsp;</qwuiButton>
    </div>
  </div>
</template>
<script>
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwTitle from '@/components/base/QwTitle';
  import pickExam from '@/components/pickPerson/pickExam';
  import {getTopicPublishAuthor,updateTopicPublishAuthor} from '../../api/topic/getData'
export default {
  data(){
    return {
      titleContent:'发布权限设置',
      visibleTab:[
        {text:'部门'},
        {text:'标签'},
        {text:'标签人员'},
        {text:'特定人员'},
        {text:'批量导入'},
        {text:'高级筛选'},
      ],
      useDepts:[],
      useUsers:[],
      useTags:[],
      deptStr:'',
      userStr:'',
      tagStr:'',
      useRadio:'所有人',
      range:'1',
    }
  },
  mounted(){
    getTopicPublishAuthor((data)=>{
      if(data.tbQyIntercalateVO){
        this.useDepts=data.selectDeptVOList;
        this.useUsers=data.selectUserVOList;
        this.useTags=data.selectTagVOList;
        this.useRadio='特定对象';
      }
    })
  },
  methods:{
    goBack(){
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/');
    },
    chooseDone(dept=[],tag=[],user=[]){
      let deptArr=[];
      let tagArr=[];
      let userArr=[];
      dept.forEach((item,index)=>{
        deptArr.push(item.nodeId||item.deptId);
      });
      tag.forEach((item,index)=>{
        tagArr.push(item.id||item.tagId);
      });
      user.forEach((item,index)=>{
        userArr.push(item.userId);
      });
      this.deptStr=deptArr.join('|');
      this.tagStr=tagArr.join('|');
      this.userStr=userArr.join('|');
    },
    changeRadio(val){
      this.range=val==='所有人'?'1':'3';
    },
    save(){
      if(this.range=='3'&&!this.deptStr&&!this.userStr&&!this.tagStr){
        _.alert('提示','特定对象为空');
        return ;
      }
      updateTopicPublishAuthor({
        range:this.range,
        deptIds:this.deptStr,
        userIds:this.userStr,
        tagIds:this.tagStr
      },(data)=>{
        dataBase.top_alert('保存成功',true,3000);
        this.$router.push('topicSetting');
      })
    }
  },
  components:{
    qwuiButton,
    qwTitle,
    pickExam,
  }
}
</script>
<style lang="scss" scoped>
  .permission_wrap{
    padding-top: 20px;
    .bar_wrap{
      margin-bottom: 15px;
    }
    .permission_main{
      width: 40%;
      margin-top: 20px;
    }
    .operation{
      margin-top: 20px;
      border-top: 1px solid #dbdbdb;
      padding: 20px 0;
      text-align: center;
    }
  }
</style>


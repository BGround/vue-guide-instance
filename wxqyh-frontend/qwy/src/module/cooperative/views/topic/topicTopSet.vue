<template>
  <div class="top_wrap">
    <div class="bar_wrap">
        <qwuiButton @click="goBack">&nbsp;返回&nbsp;</qwuiButton>
    </div>
    <qwTitle :titleContent="titleContent"></qwTitle>
    <div class="top_main">
        <div>置顶个数：</div>
        <div>
        <qwui-select class="num_select" @selectItem="selectItemType" :dataList="typeData" :selectVal="selectValType"></qwui-select>
        </div>
    </div>
    <div class="operation">
        <qwuiButton v-perm="'saveTopNum'" type='primary' @click="save">&nbsp;保存&nbsp;</qwuiButton>
    </div>
  </div>
</template>
<script>
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwTitle from '@/components/base/QwTitle';
  import qwuiSelect from '@/components/qwuiBase/qwuiSelect/QwSelect';
  import {getTopicTopNum,editTopNumber} from '../../api/topic/getData'
export default {
  data(){
    return {
      titleContent:'设置话题置顶个数',
      typeData:[
        {val:1,optionName:1,},
        {val:2,optionName:2},
        {val:3,optionName:3},
        {val:4,optionName:4},
        {val:5,optionName:5},
        {val:6,optionName:6},
        {val:7,optionName:7},
        {val:8,optionName:8},
        {val:9,optionName:9},
        {val:10,optionName:10},
        {val:15,optionName:15},
        {val:20,optionName:20},
      ],
      selectValType: {
        name: 1,
        idx: 1
      },
      id:'',
      topicTopNum:1,
    }
  },
  mounted(){
    getTopicTopNum((data)=>{
      let topicNumIndex=0;
      if(data.tbXyhTopicTopnumberPO.number<=10){
        topicNumIndex=data.tbXyhTopicTopnumberPO.number-1;
      }else{
        topicNumIndex=data.tbXyhTopicTopnumberPO.number==15?10:11;
      }
      this.selectValType={
        name:data.tbXyhTopicTopnumberPO.number,
        idx:topicNumIndex
      };
      this.id=data.tbXyhTopicTopnumberPO.id;
      this.topicTopNum=data.tbXyhTopicTopnumberPO.number;
    });
  },
  methods:{
    goBack(){
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/');
    },
    selectItemType(optionName, val){
      let topicNumIndex=0;
      if(val<=10){
        topicNumIndex=val-1;
      }else{
        topicNumIndex=val==15?10:11;
      }
      this.selectValType={
        name:optionName,
        idx:topicNumIndex
      }
      this.topicTopNum=val;
    },
    save(){console.log(this.topicTopNum)
      editTopNumber(
          {'tbXyhTopicTopnumberPO.id':this.id,
          'tbXyhTopicTopnumberPO.number':this.topicTopNum
          },(data)=>{
            dataBase.top_alert('保存成功',true,3000);
            this.$router.push('topicSetting');
          })
    }
  },
  components:{
    qwuiButton,
    qwTitle,
    qwuiSelect,
  }
}
</script>
<style lang="scss" scoped>
  .top_wrap{
    padding-top: 20px;
    .bar_wrap{
      margin-bottom: 15px;
    }
    .top_main{
      width: 40%;
      margin-top: 20px;
      .num_select{
        width: 300px;
        margin-top: 10px;
      }
    }
    .operation{
      margin-top: 20px;
      border-top: 1px solid #dbdbdb;
      padding: 20px 0;
      text-align: center;
    }
  }
</style>


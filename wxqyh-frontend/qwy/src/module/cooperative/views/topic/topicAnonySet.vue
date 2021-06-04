<template>
  <div class="anony_wrap">
  <div class="bar_wrap">
    <qwuiButton @click="goBack">&nbsp;返回&nbsp;</qwuiButton>
  </div>
  <qwTitle :titleContent="titleContent"></qwTitle>
  <div class="anony_main">
    <div class="setting_item">
      <div class="setting_content">
        <span class="setting_left">启用匿名发布话题</span>
        <div  class="setting_right">
          <qwuiSwitch :defaultStatus="isAnony" @change="topicChange"></qwuiSwitch>
        </div>
      </div>
    </div>
    <div class="setting_item">
      <div class="setting_content">
        <span class="setting_left">启用匿名评论话题</span>
        <div  class="setting_right">
          <qwuiSwitch :defaultStatus="isAnonyComment" @change="comChange"></qwuiSwitch>
        </div>
      </div>
    </div>
  </div>
  <div class="operation">
    <qwuiButton v-perm="'topicAnony'" type='primary' @click="save">&nbsp;保存&nbsp;</qwuiButton>
  </div>
  </div>
</template>
<script>
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwTitle from '@/components/base/QwTitle';
  import qwuiSwitch from '@/components/qwuiBase/qwuiSwitch/qwuiSwitch';
  import {getTopicAnony,editTopicAnony} from '../../api/topic/getData'
export default {
  data(){
    return {
      titleContent:'匿名设置',
      isAnony:false,
      isAnonyComment:false,
      id:'',
    }
  },
  mounted(){
    getTopicAnony((data)=>{
      let tbXyhTopicAnonyPO=data.tbXyhTopicAnonyPO;
      this.isAnony=tbXyhTopicAnonyPO.isTopic==='0'?true:false;
      this.isAnonyComment=tbXyhTopicAnonyPO.isComment==='0'?true:false;
      this.id=tbXyhTopicAnonyPO.id;
    })
  },
  methods:{
    goBack(){
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/');
    },
    topicChange(isOn){
      this.isAnony=isOn;
    },
    comChange(isOn){
      this.isAnonyComment=isOn;
    },
    save(){
      editTopicAnony({
        'tbXyhTopicAnonyPO.id':this.id,
        'tbXyhTopicAnonyPO.isTopic':this.isAnony?'0':'1',
        'tbXyhTopicAnonyPO.isComment':this.isAnonyComment?'0':'1'
      },(data)=>{
        dataBase.top_alert('保存成功',true,3000);
        this.$router.push('topicSetting');
      })
    }
  },
  components:{
    qwuiButton,
    qwTitle,
    qwuiSwitch,
  }
}
</script>
<style lang="scss" scoped>
  .anony_wrap{
    padding-top: 20px;
    .bar_wrap{
      margin-bottom: 15px;
    }
    .anony_main{
      width: 40%;
      margin-top: 20px;
      .setting_item{
        background: #f6f6f6;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        margin-bottom: 10px;
        overflow: hidden;
        padding-left: 5px;
        .setting_content{
          display: flex;
          justify-content: space-between;
          .setting_left{
            flex: 1;
          }
          .setting_right{
            line-height: 30px;
          }
        }
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


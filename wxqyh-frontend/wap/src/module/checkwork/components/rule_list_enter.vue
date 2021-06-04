<!--考勤规则以及规则列表-->
<template>
  <div class="qwui-bgfff">
    <div :class="[entertype = 2 ? 'qwui-ruleTitleforscheduling' :'qwui-ruleTitle']" @click="enterCheckRuleList">
      <span class="ruleItem">
      <span :class="'icon-class'+returnClass(ruleListenter.nowRule.item)" v-if="returnClass(ruleListenter.nowRule.item)">
        <span :class="returnClass(ruleListenter.nowRule.item)"></span>
      </span>
      <span class="qwui-nowRule">{{nowCheckName}}</span>
      </span>
      <p class="qwui-changeRule" v-if="noShowTab">切换</p>
    </div>
  </div>
</template>

<script>

export default {
  name:"rule_list_enter",
  props:["ruleListenter","ruleType"],
  data(){
    return{
      nowRule:{//当前规则
        id:"",
        item:{//当前规则项
          checkName:"当前规则",
          noShowTab:false
        },
      },
      ruleList:[],
      enterType:"",//入口样式
      showTab:true
    }
  },
  methods:{
    returnClass(option){
      if(option.isShake && option.isElastic){
        if(option.isShake == "0" && option.isElastic=="1"){
          return 'icon-shakeElastic';
        }else if(option.isShake == "1" && option.isElastic=="1"){
          return 'icon-elastic';
        }else if(option.isShake == "0" && option.isElastic=="0"){
          return 'icon-shake';
        }else{
          return '';
        }
      }else{
        return '';
      }
    },
    enterCheckRuleList(){
    },
  },
  watch:{
    "ruleListenter.nowRule.item.checkName":function(){
      let _this =this;
      _this.nowRule.item.checkName = _this.ruleListenter.nowRule.item.checkName;
    },
    "ruleType" :function(){
      this.enterType = this.ruleType;
    }
  },
  computed:{
    nowCheckName:function(){
      return this.ruleListenter.nowRule.item.checkName;
    },
    noShowTab:function(){
      return !this.ruleListenter.nowRule.item.noShowTab;
    }
  }
}
</script>

<style scoped>
.qwui-bgfff {
  background: #fff;
}
.qwui-ruleTitle {
  position: relative;
  height: 40px;
  background: #fff;
  margin:0 15px 0px;
}
.qwui-ruleTitle:before,.qwui-ruleTitleforscheduling::before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  height: 1px;
  width: 100%;
  bottom: 0;
  border-top: 1px solid #e5e5e5;
  color: #e5e5e5;
  -webkit-transform-origin: 100% 0;
  transform-origin: 100% 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.qwui-ruleTitleforscheduling {
  position: relative;
  height: 40px;
  background: #F5F5F5;
  padding:0 15px 0;
}
.qwui-nowRule {
  position: relative;
  font-size: 14px;
  color: #999;
  vertical-align: middle;
}
.qwui-changeRule {
  position: absolute;
  right: 20px;
  top: 10px;
  font-size: 14px;
  color: #999;
}
.qwui-changeRule:after {
  content: "";
  display: inline-block;
  font-family: FontAwesome;
  background: url('~assets/images/checkwork/ic_arrow.png') no-repeat;
  background-size: 8px 14px;
  background-position: 0;
  width: 8px;
  height: 14px;
  position: absolute;
  right: -17px;
  top: 4px;
}
.icon-classicon-shake,.icon-classicon-elastic {
  position: relative;
  display: inline-block;
  margin-right: 5px;
  width: 23px;
  height: 23px;
}
.icon-classicon-shakeElastic {
  position: relative;
  display: inline-block;
  margin-right: 5px;
  width: 56px;
  height: 23px;
}
.icon-shake {
    content: '';
    background: url(~assets/images/checkwork/ic_tan.png) no-repeat 0 0;
    position: absolute;
    top: 9px;
    left: 0;
    width: 23px;
    height: 23px;
    background-size: 56px 23px;
    background-position: -28px 0;
}
.icon-elastic {
    content: '';
    background: url(~assets/images/checkwork/ic_tan.png) no-repeat 0 0;
    position: absolute;
    top: 9px;
    left: 0;
    width: 23px;
    height: 23px;
    background-size: 56px 23px;
    background-position: -1px 0;
}
.icon-shakeElastic {
    content: '';
    background: url(~assets/images/checkwork/ic_tan.png) no-repeat 0 0;
    position: absolute;
    top: 9px;
    left: 0;
    width: 56px;
    height: 23px;
    background-size: 56px 23px;
}
.ruleItem {
  left: 0;
  top: 0;
  line-height: 40px;
}
</style>

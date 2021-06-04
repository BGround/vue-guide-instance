<template>
  <div class="qwui-wrap_box">
    <rule_detail v-if="showDetail" :thisRuleId="detailRuleId" @closeRuleDetail="closeRuleDetail"></rule_detail>
    <div v-show="!showDetail">
      <qw-tree-item
        v-model="selectValue"
        :options="options"
        :config="config"
        :treeListShow.sync="treeListShow"
        v-on:showNextItem="showRuleDetail"
        v-on:update:items="updateItems"
      >
      <span :slot="'leftContent'+option[config.id]" v-for="(option,index) in options" :key="index" class="icon-relative">
        <span :class="'icon-class'+returnClass(option)" v-if="returnClass(option)">
          <span :class="returnClass(option)"></span>
        </span>
      </span>
      </qw-tree-item>
      <div class="qwui-footerDiv"></div>
      <div class="qwui-bottom_confirm">
        <flow_button :buttondata="buttonConfig"></flow_button>
      </div>
    </div>
  </div>
</template>

<script>
import QwTreeItem from '@/components/tree/treeItem';
import flow_button from '@/components/button/flow_button.vue';
import rule_detail from './rule_detail';

const config = {
  id: 'id',
  title: 'checkName',
  checkType: 'radio',
  arrow:true,
  subTitle:'address'
}
const buttonConfig = { //操作按钮
  primaryList:[
    {type:"primary",name:'确定',callBack:null},
  ],
  style:{class:""}//按钮是否置底部 active :底部、"":相对定位
}


export default {
  name:"ruleListDetail",
  components: {
    QwTreeItem,flow_button,rule_detail
  },
  props:["ruleData"],
  data() {
    return {
      ruleList:[],
      treeListShow: true,        // 显示列表
      lock_roll: false,          // 下拉滚动加载控制
      options:[],
      config:config,
      buttonConfig:buttonConfig,
      chooseRule:"",
      chooseTitle:"",
      detailRuleId:"",
      showDetail:false
    }
  },
  computed:{
    // 当前已选的数据【必要的】
    selectValue: {
      get() {
        return this.$store.state.tree.selectValue;
      },
      set(value) {
        this.updateSelectValue(value)
      },
    },
  },
  created() {
    this.buttonConfig.primaryList[0].callBack = this.confirmRule;
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
    updateItems(items){
      this.chooseTitle = items[0].checkName;
    },
    closeRuleDetail(){
      this.showDetail = false;
    },
    showRuleDetail(options){
      this.showDetail = true;
      this.detailRuleId = options.id;
    } ,
    updateSelectValue(value){
        this.chooseRule = value;
    },
    confirmRule(){
      let _this = this;
      let chooseItem = {
        id:_this.chooseRule,
        checkName:_this.chooseTitle
      }
      this.$emit('showMainPage',chooseItem);
    },
  },
  watch:{
    "ruleData.ruleList":function(){
      let _this =this;
      _this.options = _this.ruleData.ruleList;
      _this.$store.state.tree.selectValue = _this.ruleData.nowRule.id;
      _this.chooseRule = _this.ruleData.nowRule.id;
    },
  }

}
</script>

<style scoped>
.qwui-wrap_box{
  z-index: 12;
}
.qwui-footerDiv {
  display: block;
  height: 60px;
}
.qwui-bottom_confirm{
  position: fixed;
  bottom: 0;
  z-index: 90;
  width: 100%;
  min-height: 50px;
  background: #fff;
  border-top: 1px solid #ddd;
}
@media screen and (min-width: 1024px) {
  .qwui-bottom_confirm {
    width: 740px !important;
    margin: 0 auto;
  }
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
.icon-relative {
  position: relative;
}
</style>


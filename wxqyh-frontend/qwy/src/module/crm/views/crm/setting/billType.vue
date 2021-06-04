
<template>
    <div class="dataWrap">
      <header>
        <setting-header :pages="['设置','发票类型及税率设置']" @go-back="goBackClick"></setting-header>
      </header>
      <div class="bill-select">
        <div class="left-select">
          <!-- 团队列表 -->
          <left-side-bar
                        v-show="hasBillData"
                        :renderConfig="renderConfig"
                        @listenToChild="changeTeamId"
                        @listenAddPop="addTeam"
          ></left-side-bar>
        </div>
        <div class="right-select">
          <p class="type-name">{{typeName}}</p>
          <div class="taxDetail">
            <span>税率列表 (%)：</span>
            <span>
              <textarea class="rateTextArea" readonly="readonly" v-model="taxDetailValue" @input="updateValue($event)" @blur="changeTextArea"></textarea>
            </span>
          </div>
        </div>
      </div>
      <func-box :secondBtn="secondBtn" @closeBox="closeMask"  @firstFunc="confirmMask" :boxTitle="boxTitle" v-if="funcBoxShow">
          <template>
            <div class="addTeam_box">
              <div class="teamNameItem">
                <span class="itemTitle"><span class="star">*</span>发票类型名称</span>
                <qwui-input
                            v-model="billTypeName"
                            class="qwui-input_style"
                            :inputType="'text'"
                            :maxLength=20
                            :isWarning="isWarning"
                            :warningTips="'发票类型名称不能为空'"
                            @input="changeInput"
                            @blur="changeInput">
                </qwui-input>
                <p class="input-bottom_text">支持数字、字母、汉字、减号、下划线和点</p>
                <div class="textInput">
                  <span class="taxRate">税率列表(%)</span>
                  <textarea class="rateTextArea" v-model="textAreaVal" @input="updateValue($event)" @blur="changeTextArea"></textarea>
                  <p class="taxWarning" v-show="taxWarningShow">请先填写税率</p>
                  <!-- <textarea class="rateTextArea" v-model="textAreaVal"></textarea> -->
                </div>
              </div>
            </div>
          </template>
      </func-box>
    </div>

</template>

<script>
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import leftSideBar from '@/components/list/LeftSideBar';
import funcBox from '@/components/list/funcBox';
import settingHeader from "./components/settingHeader";
import { saveDetail,findTaxType,saveTaxType,delTaxType } from "crm/api/setting";
export default {
  data(){
    return{
      taxDetailValue: '', // 详情返回的数据
      taxWarningShow: false, // 税率必填提示
      textAreaVal: '', // 税率
      editId: '', // 获取当前编辑的团队id
      billTypeName: '', // 发票类型名称
      isWarning: false, // 发票类型名称提示，不能为空
      funcBoxShow: false, // 遮罩弹窗显示隐藏
      boxTitle: '新建类型', // 遮罩title
      secondBtn: '', // 传给组件，默认没有取消按钮

      showType:{
        person:true,
      },
      pickPersonShow:false,
      teamId: '', // 测试团队的id
      typeName: '', // 测试团队的名字
      taxListData: [], // 团队数据
      hasBillData: true,
      renderConfig:{
        addOperateName:'新建类型',
        renderList:[],// 规则列表
        currentIndex:0
      },
    }
  },
  components: {
    settingHeader,
    leftSideBar,
    qwuiButton,
    funcBox,
    qwuiInput
  },
  created(){
    this.init();
  },
  watch: {
    // 监听输入团队，去除前后空格
    billTypeName(newVal, oldVal) {
      this.billTypeName = this.trim(newVal);
    },
  },
  computed: {
  },
  methods: {
    init(){
      this.renderConfig.renderList = [];
      this.taxListData = [];
      dataBase.loading = true;
      findTaxType().then(res => {
        dataBase.loading = false;
        if(res.code == '0'){
          // 获取返回的发票数据
          this.taxListData = res.data.taxTypeList;
          this.typeName = res.data.taxTypeList[0].typeName;
          this.taxDetailValue = res.data.taxTypeList[0].ratio.replace(/\|/g,"\n")
          this.taxListData.forEach((item) => {
            this.renderConfig.renderList.push({
              itemName: item.typeName,
              itemIcon:require('../../../../../assets/images/ic_b-log_day.svg'),
              id: item.id,
              status:0,
              ratio: item.ratio,
              operateList:[
                {
                  operateName:'编辑',
                  operateFunc:()=> {
                    this.editTeam(item)
                  }
                },
                {
                  operateName:'删除',
                  operateFunc:()=> {
                    this.delTeam(item)
                  }
                }
              ]
            })
          })
          if (this.taxListData && this.taxListData.length > 0){
            this.renderConfig.currentIndex = 0;
            this.typeName = this.taxListData[0].typeName;
            this.textAreaVal = ''
          }
        }else{
          _.alert('提示',res.desc)
        }
      })
    },

    // 返回上一级
    goBackClick(){
      this.$router.go(-1);
    },

    // 选择团队监听事件
    changeTeamId(id,key){
      this.taxListData.forEach((item,idx) => {
        if(id == item.id){
          this.taxDetailValue = item.ratio.replace(/\|/g,"\r\n");
        }
      })
      if(this.taxListData[key]){
        this.typeName = this.taxListData[key].typeName
      }
      this.renderConfig.currentIndex = key;
    },
    // 新增团队
    addTeam(){
      if(this.taxListData.length == 20){
        // dataBase.top_alert('最多只能增加20个团队',false,3000);
      }else{
        // 初始化提醒
        this.billTypeName = '';
        this.textAreaVal = '';
        this.isWarning = false;
        this.taxWarningShow = false;
        this.closeMask();
      }
    },

    // 关掉tip
    deleteTip(item){
      item.show = false;
    },

    // 关闭遮罩
    closeMask(){
      this.funcBoxShow = !this.funcBoxShow;
    },

    // 遮罩层确定事件
    confirmMask(){
      this.valiTeamName();
      if(this.isWarning == false && this.taxWarningShow == false){
        let obj = {
          'taxTypePO.id':this.editId,
          'taxTypePO.typeName': this.billTypeName,
          'taxTypePO.ratio': this.textAreaVal.replace(/\n/g,'|')
        }
        // 新增发票请求
        dataBase.loading = true;
        saveTaxType(obj).then(res => {
          dataBase.loading = false;
          if(res.code == '0'){
            dataBase.top_alert('保存成功',true,2000);
            this.init();
            this.closeMask();
          }else{
            dataBase.top_alert(res.desc,false,2000);
          }
        })
      }
    },

    // 输入input
    changeInput(){
      this.isWarning = this.billTypeName == '';
    },

    changeTextArea(){
      this.taxWarningShow = this.textAreaVal === '' ? true : false
    },

    // 遮罩层判空处理
    valiTeamName(){
      if(this.billTypeName == ''){
        this.isWarning = true;
      }else if(this.textAreaVal == ''){
        this.taxWarningShow = true
      }
    },

    // 正则去掉左右空白格
    trim(str){
      return str.replace(/(^\s*)|(\s*$)/g, '');
    },

    // 编辑团队
    editTeam(item){
      this.funcBoxShow = true;
      this.isWarning = false;
      this.taxWarningShow = false;
      // 团队名不需要请求便可拿到
      this.billTypeName = item.typeName;
      this.editId = item.id;
      this.textAreaVal = item.ratio.replace(/\|/g,"\n")
    },

    // 删除团队
    delTeam(item){
      let self = this
      _.alert('提示','确定要删除该类型吗？',function () {
        self.delRequest(item);
      },'确定',true)
    },

    // 删除请求
    delRequest(val){
      dataBase.loading=true;
      delTaxType({id: val.id}).then(res => {
        dataBase.loading=false;
        if(res.code == '0'){
          dataBase.top_alert('删除成功',true,2000);
          this.init();
        }else{
          _.alert('提示',res.desc)
        }
      })
    },
    // 监听textarea
    updateValue(event){
      var pos = event.target.selectionEnd;
      let ratio = this.textAreaVal;
      if(ratio == '' || undefined){
        ratio = ratio.replace(/。/g, '.');//兼容中文输入法
      }
      if(ratio!=''){
        let ratios = ratio.split(/\n|\r\n/);
        if (ratios == undefined) {
          this.textAreaVal = ''
          return;
        }
        ratio = ''
        var result = "";
        var count = 0;//税率个数
        for (let i = 0; i < ratios.length; i++) {
          let num = this.ratioFilter(ratios[i]);
          count++;
          if (count > 16) {
            _.alert("温馨提示", "同一发票类型的税率不能超过16个");
            break;//同一类型税率个数不能超过16个
          }
          if (i < ratios.length - 1) {
            ratio += num + "\n";
          } else {
            ratio += num;
          }
          result += num + "|";
        }
        if (result.length > 1) {
          result = result.substring(0, result.length - 1);
        }
      }
      this.textAreaVal = ratio;
      event.target.setSelectionRange(pos, pos);//设置光标位置
    },

    // 过滤textarea
    ratioFilter(str) {
      let items = str.match(/\d+|\./g);
      let num;
      if (items == null) {
          return '';
      } else {
          num = items.join('');
      }

      let result = "", dec = "";
      let list = num.split(".");
      result=list[0];
      if(result.length>1){
        //整数去前导0
        result = list[0].replace(/(^0+)/, '');
        if(result=="")result="0";
      }
      if (result.length > 2) {
        result = result.substring(0, 2);
      } else {
        result = result;
      }
      if (list.length > 1) {
        //小数限制为两位
        if (list[1].length > 2) {
            dec = list[1].substring(0, 2);
        } else {
            dec = list[1];
        }
        if (result.length == 0) {
            //小数点前没有0,我们自动加上0
            result = '0';
        }
        //加上小数点
        result = result + '.';

        if (dec.length > 0) {
          //加上小数
          result = result + dec;
        }
      }
      return result;
    }
  }
}
</script>

<style lang="scss" scoped>
.dataWrap{
  height: 100%;
  .bill-select{
    margin-top: 20px;
    height: 100%;
    width: 100%;
    position: relative;
    .right-select{
      margin-left: 40px;
      float: left;
      width: 700px;
      .taxDetail{
        margin-top: 40px;
      }
      .typeNameDetail{
        margin-top: 40px;
        margin-bottom: 20px;
        .nameDetail{
          display: inline-block;
          margin-left: 10px;
          text-align: center;
          width: 340px;
          height: 32px;
          border-radius: 2px;
          border: 1px solid #ccc;
          color: #333;
          vertical-align: middle;
        }
        .detailTip{
          font-size: 12px;
          color: #999;
          margin-left: 110px;
        }
      }
      .team-member{
        height: 100%;
      }
      .type-name{
        line-height: 20px;
        font-size: 20px;
      }
      .team{
        margin-top: 32px;
      }
      .grayFont{
        font-size: 14px;
        color: #999;
      }
      .qwui-save_btn {
        padding-top: 20px;
        padding-bottom: 30px;
        text-align: center;
        margin-top: 40px;
        border-top: 1px solid #eee;
      }
    }
  }
  .addTeam_box{
    padding: 30px 0 40px;
    font-size: 14px;
    margin-bottom: 9px;
    .teamNameItem{
      text-align: center;
      .textInput{
        margin-top: 20px;
        padding: 0px 93px;
        text-align: left;
        .taxWarning{
          color: #F56262;
          text-align: left;
          margin-left: 90px;
        }
      }
      .input-bottom_text{
        color: #999;
        font-size: 12px;
      }
      .itemTitle {
        margin-bottom: 5px;
        margin-right: 10px;
        line-height: 32px;
        display: inline-block;
        text-align: right;
        vertical-align: top;
        .star {
          margin-right: 5px;
          color: red;
        }
      }
    }
  }
  /deep/ .warningTips{
    text-align: left;
  }

  .rateTextArea{
    width: 100px;
    height: 160px;
    resize:none;
    margin-left: 10px;
    vertical-align: top;
    border-radius: 2px;
    border: 1px solid #ccc;
    transition: border linear 0.2s, box-shadow linear 0.2s;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>


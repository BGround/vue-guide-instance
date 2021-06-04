<template>
  <div>
    <!--头部返回-->
    <qwui-go-back :goBackConfig="goBackConfig"></qwui-go-back>

    <!--输入框-->
    <div class="qwui-input_item" v-for="(item,key) in inputObject" :key="key">
      <span class="itemTitle"><span v-if="key == 'name'" class="star">*</span>
        {{ item.title }}</span>

      <!--高级设置-->
      <div v-if="item.inputType == 'custom'" class="customInput">
        <div class="titleInput" :contenteditable="true" v-html="setPopData.titleHtml" ref="titleInput"></div>
        <p @click="showSetPop">+高级设置</p>
        <advanced-set-pop :setPopData="setPopData" @listenClose="closeSetPop" @listenBtnFunc="saveSetting"></advanced-set-pop>
      </div>
      <qwui-input
        v-else
        v-model="item.value"
        class="qwui-input_style"
        :inputType="item.inputType"
        :isWarning="item.isWarning"
        :warningTips="item.warningTips"
        :maxLength="item.maxLength"
        @input="changeInput(key)"
      ></qwui-input>
      <p class="functionDesc">{{ item.functionDesc }}</p>
    </div>

    <!--选人-->
    <div class="qwui-select_item">
      <div class="qwui-input_item">
        <span class="itemTitle">可见范围：</span>
        <div class="qwui-radio_item">
          <qwui-radio v-model="range" label="1" border>所有人</qwui-radio>
          <qwui-radio v-model="range" label="3" border>特定对象</qwui-radio>
        </div>
        <person-count class="qwui-principal_count"
                      :personCountShow="principalCountShow"
                      :defaultUsers="principalUsers"
                      :defaultDepts="principalDepts"
                      :showType="principalShowType"
                      @listenAddPerson="addPerson(true)"></person-count>
        <!--选人组件-->
        <pick-person :show="principalPickShow"
                     :defaultUsers="principalUsers"
                     :defaultDepts="principalDepts"
                     :functionTab="principalFunctionTab"
                     @chooseDone="choosePrincipal"
                     @closeThis="closeThis(true)"></pick-person>
      </div>
      <div class="qwui-input_item">
        <span class="itemTitle">默认相关人：</span>
        <person-count class="qwui-person_count"
                      :personCountShow="personCountShow"
                      :defaultUsers="defaultUsers"
                      :showType="showType"
                      @listenAddPerson="addPerson"></person-count>
        <pick-person :show="pickPersonShow"
                     :defaultUsers="defaultUsers"
                     :functionTab="functionTab"
                     @chooseDone="chooseDone"
                     @closeThis="closeThis"></pick-person>
      </div>
    </div>

    <!--设置勾选项-->
    <div class="qwui-input_item">
      <span class="itemTitle">设置：</span>
      <div class="itemOption">
        <p v-for="(item,key) in checkInfoObj">
          <qwui-checkbox class="qwui-check_custom_box" v-model="item.isCheck">{{ item.option }}</qwui-checkbox>
        </p>
      </div>
    </div>
    <div class="qwui-save_btn">
      <qwui-button type='primary' @click="saveDiaryType">保存</qwui-button>
    </div>
  </div>
</template>

<script>
  import qwuiGoBack from '@/components/base/qwuiGoBack';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput'
  import personCount from '@/components/pickPerson/qwuiPersonCount';
  import pickPerson from '@/components/pickPerson/pickPerson';
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwuiRadio from '@/components/qwuiBase/qwuiRadio/qwuiRadio';
  import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox';
  import advancedSetPop from '@/components/Add/popUps/AdvancedSetPop';

  import { getSettingLabel,viewDiaryType,updateDiaryType,addDiaryType } from '../../api/diary/getData';

  export default {
    data(){
      return {
        goBackConfig:{
          hasLine:false,
          lastPath:'日志类型',
          currPath:'新增类型'
        },
        inputObject:{
          name:{
            title:'类型名称：',
            inputType: 'text',
            isWarning: false,
            warningTips: '类型名称不能为空',
            value:''
          },
          number: {
            title: '排序号：',
            inputType: 'sort',
            value:'0'
          },
          mainTitle: {
            title: '模板标题：',
            inputType: 'custom',
            value:''
          },
          mainContent: {
            title: '模板内容：',
            inputType: 'textarea',
            value:'',
            maxLength:1024
          },
        },
        principalCountShow:false,
        principalShowType:{
          person:true,
          dept:true
        },
        principalUsers:[],// 成员
        principalDepts:[],// 部门
        principalPickShow:false,// 选人组件显示隐藏
        principalFunctionTab:[
          {text:'部门'},
          {text:'标签人员'},
          {text:'特定人员'},
          {text:'批量导入'},
          {text:'高级筛选'},
        ],
        personCountShow:true,// 选人结果显示隐藏
        defaultUsers:[],
        showType:{
          person:true,
        },
        pickPersonShow:false,
        functionTab:[
          {text:'标签人员'},
          {text:'特定人员'},
          {text:'批量导入'},
        ],
        range:'1',
        checkInfoObj:{
          status:{
            isCheck:true,
            option:'启用该日志类型'
          },
          needImg:{
            isCheck:false,
            option:'填写日志时，图片为必填项'
          },
          pushRemind:{
            isCheck:true,
            option:'提单时通知相关人'
          }
        },
        setPopData:{
          popShow:false,
          popTitle:'日志标题高级设置',
          titleName:'日志标题',
          titleHtml:'',
          labelData:[
            {
              labelTitle:'可选日志字段',
              labelList:[],
              flex:2
            },
            {
              labelTitle:'日期时间',
              labelList:[],
              flex:1
            }
          ],
        },
        tempFormat:{},
//        titleHtml:''
      }
    },
    created(){
      // 获取高级设置
      getSettingLabel({
        orgId:_qwy.orgConfigInfo.orgId,
        agentCode:'work_diary'
      },(data)=>{
        data.data.forEach((item)=>{
          // 根据labelType自动归类
          this.setPopData.labelData[item.labelType].labelList.push(item);
          item.labelCode = item.labelType == 0 ? item.labelCode : 'createTime@'+item.labelCode;
          this.tempFormat[item.labelCode] = item.labelName;
        });
        // id有值为编辑页面
        if (this.$route.query.id){
          this.goBackConfig.currPath = '更新类型';
          viewDiaryType({id:this.$route.query.id},(data)=>{
            let po = data.tbQyDiaryTemplatePO;
            this.inputObject.name.value = po.name;
            po.sortNum ? this.inputObject.number.value = po.sortNum : '';

            this.setPopData.titleHtml = po.titleFormat
              ? this.changeTitleTemp(po.titleFormat) : po.title;
            this.inputObject.mainContent.value = po.content;
            this.range = po.ranges;

            data.personList ? this.principalUsers = data.personList : '';
            data.departList ? this.principalDepts = data.departList : '';
            data.defaultpersonList ? this.defaultUsers = data.defaultpersonList : '';

            this.checkInfoObj.status.isCheck = po.status == '1';
            this.checkInfoObj.needImg.isCheck = po.isPhoto == '1';
            this.checkInfoObj.pushRemind.isCheck = po.pushRelative == '1';
          })
        }
      });

    },
    watch:{
      range(){
        this.principalCountShow = this.range == '3';
      }
    },
    methods:{
      // 显示高级设置弹框
      showSetPop(){
        this.setPopData.titleHtml = this.$refs.titleInput[0].innerHTML;
        this.setPopData.popShow = true;
      },
      // 关闭设置弹框
      closeSetPop(){
        this.setPopData.popShow = false;
      },
      // 设置弹框保存按钮
      saveSetting(format){
        this.setPopData.titleHtml = format;
        this.setPopData.popShow = false;
      },
      // 将模板格式转换成html
      changeTitleTemp(format){
        let newFormat = format;
        let temp;
        let formatArr = format.match(/{[^}]+}/g) || [];
        formatArr.forEach((item)=>{
          let el = item.substring(1, item.length-1);
          if (this.tempFormat[el]){
            temp = '<span class="labelStyle" data-attrid="'+el+'" contenteditable="false">'+ this.tempFormat[el]+'</span>';
            newFormat = newFormat.replace(new RegExp(item,"g"),temp);
          }
        });
        return newFormat;
      },
      changeInput(key){
        if (key == 'name'){
          this.inputObject.name.isWarning = this.inputObject.name.value == '';
        }
      },
      // 添加人员
      addPerson(status){
        if (status){
          this.principalPickShow = true;
        }else {
          this.pickPersonShow = true;
        }
      },
      // 选人回调
      chooseDone(deptSelected,tagList,specialUsers){
        this.defaultUsers = specialUsers;
        this.pickPersonShow = false;
      },
      // 选人确定按钮回调
      choosePrincipal(deptSelected,tagList,specialUsers){
        this.principalUsers = specialUsers;
        this.principalDepts = deptSelected;
        this.principalPickShow = false;
      },
      // 选人关闭按钮回调
      closeThis(status){
        if (status){
          this.principalPickShow = false;
        }else {
          this.pickPersonShow = false;
        }
      },
      saveDiaryType(){
        if (this.inputObject.name.value == ''){
          this.inputObject.name.isWarning = true;
          return;
        }
        if (this.$refs.titleInput[0].innerText.length > 100){
          dataBase.top_alert('标题长度不能超过100字',false,3000);
          return;
        }
        let deptIds = [],userIds = [],givenUserIds = [];
        this.principalDepts.forEach((item)=>{
          deptIds.push(item.nodeId || item.deptId || item.id)
        });
        this.principalUsers.forEach((item)=>{
          userIds.push(item.userId);
        });
        this.defaultUsers.forEach((item)=>{
          givenUserIds.push(item.userId);
        });
        // 将html替换成模版格式
        let formatCopy = this.$refs.titleInput[0].cloneNode(true);
        let titleFormat = formatCopy.querySelectorAll('span') || [];
        titleFormat.forEach((item)=>{
          item.replaceWith('{'+item.dataset.attrid+'}');
        });
        let params = {
          'tbQyDiaryTemplatePO.name':this.inputObject.name.value,
          'tbQyDiaryTemplatePO.sortNum':this.inputObject.number.value,
          'tbQyDiaryTemplatePO.title':this.$refs.titleInput[0].innerText,
          'tbQyDiaryTemplatePO.titleFormat':formatCopy.innerText,
          'tbQyDiaryTemplatePO.content':this.inputObject.mainContent.value,
          'a1':'on',
          'deptIds':deptIds.join('|'),
          'userIds':userIds.join('|'),
          'range':this.range,
          'givenUserIds':givenUserIds.join('|'),
          'tbQyDiaryTemplatePO.status':this.checkInfoObj.status.isCheck ? 1 : 0,
          'tbQyDiaryTemplatePO.isPhoto':this.checkInfoObj.needImg.isCheck ? 1 : 0,
          'tbQyDiaryTemplatePO.pushRelative':this.checkInfoObj.pushRemind.isCheck ? 1 : 0
        };
        if (this.$route.query.id){
          params['tbQyDiaryTemplatePO.id'] = this.$route.query.id;
          updateDiaryType(params,()=>{
            _.alert('提示','更新成功',function () {
              this.$router.go(-1);
            })
          })
        }else {
          addDiaryType(params,()=>{
            _.alert('提示','新增成功',function () {
              this.$router.go(-1);
            })
          })
        }
      }
    },
    components:{
      qwuiGoBack,
      qwuiInput,
      personCount,
      pickPerson,
      qwuiButton,
      qwuiRadio,
      qwuiCheckbox,
      advancedSetPop
    }
  }
</script>

<style src="../../scss/diary/diary.scss" lang="scss" scoped></style>
<style lang="scss" scoped>
  .qwui-setting_title {
    height: 47px;
    line-height: 47px;
    margin-top: 15px;
    margin-bottom: 20px;
    padding-left: 20px;
    font-weight: 700;
    font-size: 16px;
    background-color: #F5F5F5;
    border-left: 4px solid #F87B00;
    color: #666666;
  }
  .qwui-input_item {
    margin-bottom: 10px;
  .functionDesc{
    margin-top: 5px;
    padding-left:130px;
    color: #999;
  }
  .itemTitle {
    margin-bottom: 5px;
    padding-top: 5px;
    width: 130px;
    display: inline-block;
    text-align: right;
  }
  .itemOption {
    display: inline-block;
    vertical-align: text-top;
  }
  .star {
    margin-right: 5px;
    color: red;
  }
  .customInput {
    display: inline-block;
    vertical-align: top;

    .titleInput {
      height: auto;
      min-height: 19px;
      padding: 6px;
      width: 325px;
      margin-bottom: 8px;
      border-radius: 2px;
      border: 1px solid #ccc;
      background: #fff;
      outline: none;
      overflow: auto;
    }

    p {
      line-height: 28px;
      color: #f87b00;
      cursor: pointer;
    }
  }
  }
  .qwui-add_person{
    margin-top: 5px;
    margin-bottom: 10px;
  }
  .qwui-setting_item {
    position: relative;
    background: none repeat scroll 0 0 #f6f6f6;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
    overflow: hidden;
    padding-left: 5px;
  }
  .qwui-switch_btn {
    position: absolute;
    right: 0;
    top: 7px;
  }
  .qwui-save_btn {
    padding-top: 20px;
    padding-bottom: 30px;
    text-align: center;
    border-top: 1px solid #eee;
  }
  .qwui-radio_item {
    display: inline-block;
  }
  .qwui-input_style {
    vertical-align: top;

    & /deep/ {
        .textarea_wrap .qw_textarea,.input_wrap .qw_sortInput{
          width: 340px;
        }
      }
  }
  .qwui-select_item {
    margin: 30px 0;
    padding: 30px 0;
    border-top: 1px dashed #ddd;
    border-bottom: 1px dashed #ddd;
  }
  .qwui-input_item .qwui-person_count {
    display: inline-block;
    margin-top: -5px;
    width: 600px;
    vertical-align: text-top;
  }
  .qwui-principal_count {
    padding-left: 134px;
    width: 600px;
  }
  .qwui-check_custom_box /deep/ {
    .qwui-checkbox-input,.qwui-checkbox-label {
      vertical-align: baseline !important;
    }
  }
</style>

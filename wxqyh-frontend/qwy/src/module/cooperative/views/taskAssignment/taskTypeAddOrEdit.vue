<template>
  <div>
    <qwui-go-back :goBackConfig="goBackConfig"></qwui-go-back>
    <div class="qwui-setting_title">{{ titleText }}</div>
    <div class="qwui-moudle_item">
      <h2 class="qwui_moudle_itle">基础设置</h2>
      <div class="qwui-input_item" v-for="(item,key) in baseInputData" :key="key">
      <span class="itemTitle"><span v-if="key == 'name'" class="star">*</span>
        {{ item.title }}</span>
        <qwui-input  :disabled="isExistTask"
          v-model="item.value"
          class="qwui-input_style"
          :inputType="item.inputType"
          :isWarning="item.isWarning"
          :warningTips="item.warningTips"
          :maxLength="item.maxLength"
          @input='changeInput(key)'></qwui-input>
      </div>
    </div>

    <!--<div class="qwui-moudle_item">-->
      <!--<h2 class="qwui_moudle_itle">模板设置</h2>-->
      <!--<div class="qwui-input_item" v-for="(item,key) in templateInputData" :key="key">-->
        <!--<span class="itemTitle">{{ item.title }}</span>-->
        <!--&lt;!&ndash;高级设置&ndash;&gt;-->
        <!--<div v-if="item.inputType == 'custom'" class="customInput">-->
          <!--<div class="titleInput" :contenteditable="true" v-html="item.setPopData.titleHtml" :ref="key"></div>-->
          <!--<p @click="showSetPop(key)">+高级设置</p>-->
          <!--<advanced-set-pop :setPopData="item.setPopData" @listenClose="closeSetPop(key)" @listenBtnFunc="saveSetting(arguments[0],key)"></advanced-set-pop>-->
        <!--</div>-->
        <!--<qwui-input-->
          <!--v-else-->
          <!--class="qwui-input_style"-->
          <!--v-model="item.value"-->
          <!--:inputType="item.inputType"-->
          <!--:maxLength="item.maxLength"-->
          <!--@input='changeInput(key)'></qwui-input>-->
      <!--</div>-->
      <!--<div class="qwui-title_type">-->
        <!--<p class="funcTitle">新建子任务时，子任务标题和内容默认加载成主任务的标题和内容</p>-->
        <!--<qwui-checkbox v-model="isLoad">启用</qwui-checkbox>-->
        <!--<span class="funcDesc">（启用后，将不加载类型中设置的子任务标题和内容模板）</span>-->
      <!--</div>-->
    <!--</div>-->

    <!--<div class="qwui-moudle_item">-->
      <!--<h2 class="qwui_moudle_itle">人员设置</h2>-->
      <!--<div class="qwui-add_person">-->
        <!--<p class="personTitle">主任务默认负责人：</p>-->
        <!--<qwui-person-count class="qwui-principal_count"-->
                           <!--:personCountShow="principalCountShow"-->
                           <!--:defaultUsers="principalUsers"-->
                           <!--:showType="showType"-->
                           <!--@listenAddPerson="addPrincipal"></qwui-person-count>-->
        <!--&lt;!&ndash;选人组件&ndash;&gt;-->
        <!--<pick-person :show="principalPickShow"-->
                     <!--:defaultUsers="principalUsers"-->
                     <!--:functionTab="functionTab"-->
                     <!--@chooseDone="choosePrincipal"-->
                     <!--@closeThis="closeThis"></pick-person>-->
      <!--</div>-->
      <!--<div class="qwui-add_person">-->
        <!--<p class="personTitle">默认相关人：</p>-->
        <!--<qwui-person-count class="qwui-principal_count"-->
                           <!--:personCountShow="relativeCountShow"-->
                           <!--:defaultUsers="relativeUsers"-->
                           <!--:showType="showType"-->
                           <!--@listenAddPerson="addRelative"></qwui-person-count>-->
        <!--&lt;!&ndash;选人组件&ndash;&gt;-->
        <!--<pick-person :show="relativePickShow"-->
                     <!--:defaultUsers="relativeUsers"-->
                     <!--:functionTab="functionTab"-->
                     <!--@chooseDone="chooseRelative"-->
                     <!--@closeThis="closeThis"></pick-person>-->
      <!--</div>-->
    <!--</div>-->


    <div class="qwui-moudle_item">
      <h2 class="qwui_moudle_itle">负责人设置</h2>

      <div class="qwui-add_person">
        <p class="personTitle"><span style="color: red;text-align: center">*</span>&nbsp;&nbsp;任务类型负责人：</p>

        <qwui-person-count class="qwui-principal_count"
                           :personCountShow="principalCountShow"
                           :defaultUsers="principalUsers"
                           :showType="showType"
                           @listenAddPerson="addPrincipal"></qwui-person-count>
        <!--选人组件-->
        <pick-person :show="principalPickShow"
                     :defaultUsers="principalUsers"
                     :functionTab="functionTab"
                     @chooseDone="choosePrincipal"
                     @closeThis="closeThis"></pick-person>
        <p style="color: red;margin-left: 130px;" class="warningTips" v-show="principalWarning">请选择任务类型负责人</p>
      </div>

      <!--<div class="qwui-add_person">-->
        <!--<p class="personTitle"><span style="color: red;text-align: center">*</span>&nbsp;&nbsp;管理范围：</p>-->
        <!--<textarea class="qwui-principal_count" v-model="managementScope" @blur="doBlur" rows="2" cols="80"></textarea>-->
        <!--<p style="color: red;margin-left: 130px;" class="warningTips" v-show="manageWarning">{{warningManage}}</p>-->
      <!--</div>-->


      <div class="qwui-main_senior_select clearfix qwui-add_person" >
        <div class="qwui-select_keyword">
          <div v-for="(item,index) in inputData" :key="item.description">
            <div v-if="item.keyWord!=='positions'">
              <p class="personTitle"><span style="color: red;text-align: center">*</span>&nbsp;&nbsp;{{item.description}}：</p>
              <input style="height: 30px" class="qwui-principal_count" type="text" :placeholder="item.placeholder" v-model="managementScope" @blur="doBlur"></input>
              <p style="color: red;margin-left: 130px;" class="warningTips" v-show="manageWarning">{{warningManage}}</p>

            </div>
          </div>
        </div>
      </div>


      <div class="qwui-add_person">
        <p class="personTitle">分管领导：</p>
        <qwui-person-count class="qwui-principal_count"
                           :personCountShow="relativeCountShow"
                           :defaultUsers="leaderUsers"
                           :showType="showType"
                           @listenAddPerson="addLeader"></qwui-person-count>
        <!--选人组件-->
        <pick-person :show="relativePickShow"
                     :defaultUsers="leaderUsers"
                     :functionTab="functionTab"
                     @chooseDone="chooseLeader"
                     @closeThis="closeThis"></pick-person>
      </div>
    </div>

    <!--<div class="qwui-add_person">-->
      <!--<p class="personTitle">经销商：</p>-->
      <!--<qwui-person-count class="qwui-principal_count"-->
                         <!--:personCountShow="relativeCountShow"-->
                         <!--:defaultUsers="relativeUsers"-->
                         <!--:showType="showType"-->
                         <!--@listenAddPerson="addDealer"></qwui-person-count>-->
      <!--&lt;!&ndash;选人组件&ndash;&gt;-->
      <!--<pick-dealer :show="dealerPickShow"-->
                   <!--:defaultUsers="relativeUsers"-->
                   <!--:functionTab="functionTab"-->
                   <!--@chooseDone="chooseDealer"-->
                   <!--@closeThis="closeThis"></pick-dealer>-->
    <!--</div>-->

    <!--<div class="qwui-add_person">-->
      <!--<p class="personTitle">岗位：</p>-->
      <!--<qwui-person-count class="qwui-principal_count"-->
                         <!--:personCountShow="relativeCountShow"-->
                         <!--:defaultUsers="relativeUsers"-->
                         <!--:showType="showType"-->
                         <!--@listenAddPerson="addPost"></qwui-person-count>-->
      <!--&lt;!&ndash;选人组件&ndash;&gt;-->
      <!--<pick-post :show="postPickShow"-->
                   <!--:defaultUsers="relativeUsers"-->
                   <!--:functionTab="functionTab"-->
                   <!--@chooseDone="choosePost"-->
                   <!--@closeThis="closeThis"></pick-post>-->
    <!--</div>-->


    <div class="qwui-moudle_item">
      <h2 class="qwui_moudle_itle">更多设置</h2>
      <div class="qwui-setting_item" v-for="(item,key) in settingBtnData" >
        <p>{{ item.text }}</p>
        <qwui-switch class="qwui-switch_btn" :defaultStatus="item.onOff" @change="change(key,arguments[0])" :disabled="isExistTask"></qwui-switch>
      </div>
    </div>

    <div class="qwui-save_btn">
      <qwui-button type='primary' @click="updateTaskType">提交</qwui-button>
    </div>




  </div>
</template>

<script>
  import qwuiGoBack from '@/components/base/qwuiGoBack';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput'
  import qwuiPersonCount from './qwuiPersonCount';
  import pickPost from '@/components/pickPerson/pickPost';
  import pickDealer from '@/components/pickPerson/pickDealer';
  import pickPerson from '@/components/pickPerson/pickSubPerson';
  import qwuiSwitch from '@/components/qwuiBase/qwuiSwitch/qwuiSwitch';
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import advancedSetPop from '@/components/Add/popUps/AdvancedSetPop';
  import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox'

  import { addTaskType,getTaskTypeData,updateTaskType,getSettingLabel,isDealer } from '../../api/taskAssignment/getData';




  export default {
    data(){
      return {
        isTaskAdd:false,
        inputData:[ //输入框item
          {
            description:'管理范围',
            placeholder:'ERP号搜索，多个以空格分开',
            val:'',
            keyWord:'deptCode'
          },
        ],

        titleText:'新增类型',
        principalWarning:false,
        isWarning:true,
        model:{},
        // 基础设置输入框配置数据
        baseInputData:{
          name: {
            title: '类型名称：',
            inputType: 'text',
            isWarning: false,
            warningTips: '类型名称不能为空',
            value:''
          },
          number: {
            title: '列表序号：',
            inputType: 'sort',
            value:'0'
          },
        },
        // 模板设置输入框配置数据
        templateInputData:{
          mainTitle: {
            title: '主任务标题模板：',
            inputType: 'custom',
            value:'',
            setPopData:{
              popShow:false,
              popTitle:'任务标题高级设置',
              titleName:'任务标题',
              titleHtml:'',
              labelData:[
                {
                  labelTitle:'可选任务字段',
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
          },
          mainContent: {
            title: '主任务内容模板：',
            inputType: 'textarea',
            value:'',
            maxLength:1024
          },
          subNum: {
            title: '子任务编号模板：',
            inputType: 'custom',
            value:'',
            setPopData:{
              popShow:false,
              popTitle:'子任务编号高级设置',
              titleName:'子任务编号',
              inputDesc:'例：“年月日”可生成“20180101”',
              titleHtml:'',
              labelData:[
                {
                  labelTitle:'日期时间',
                  labelList:[],
                  flex:1
                }
              ],
            },
          },
          subTitle:{
            title:'子任务标题模板：',
            inputType:'custom',
            value:'',
            setPopData:{
              popShow:false,
              popTitle:'子任务标题高级设置',
              titleName:'子任务标题',
              titleHtml:'',
              labelData:[
                {
                  labelTitle:'可选子任务字段',
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
          },
          subContent:{
            title:'子任务内容模板：',
            inputType:'textarea',
            value:'',
            maxLength:1024
          }
        },
        // 是否子任务默认加载主任务标题
        isLoad:false,
        managementScope:'',
        tempFormat:{},
        dealerPickShow:false,
        principalCountShow:true,
        principalUsers:[],
        leaderUsers:[],
        principalPickShow:false,
        relativeCountShow:true,
        relativeUsers:[],
        postPickShow:false,
        relativePickShow:false,
        manageWarning:false,
        warningManage:'必须是数字！',
        isExistTask:false, //是否存在明检任务
        functionTab:[
          {text:'管理员'},
          {text:'批量导入'},
        ],
        showType:{
          person:true,
        },
        settingBtnData:{
          'sendInfo':{
            text:'任务结束时推送关闭通知到主任务负责人、子任务负责人、相关人',
            onOff:true
          },
          'disEnable':{
            text:'启用本任务类型',
            onOff:true
          }
        },
        goBackConfig:{
          hasLine:true,
          lastPath:'任务类型',
          currPath:'新增类型'
        },
      }
    },
    created(){
      getSettingLabel({
        orgId:_qwy.orgConfigInfo.orgId,
        agentCode:'task'
      },(data)=>{
       // console.log(data)
        data.data.forEach((item)=>{
          item.labelCode = item.labelType == 0 ? item.labelCode : 'createTime@'+item.labelCode;
          // 主任务标题
          this.templateInputData.mainTitle.setPopData.labelData[item.labelType].labelList.push(item);

          // 子任务编号只添加日期模板编号
          if (item.labelType == 1){
            this.templateInputData.subNum.setPopData.labelData[0].labelList.push(item);
          }

          // 子任务标题
          this.templateInputData.subTitle.setPopData.labelData[item.labelType].labelList.push(item);

          this.tempFormat[item.labelCode] = item.labelName;

        });

        if (this.$route.query.id){
          this.titleText = '更新类型';
          this.goBackConfig.currPath = '更新类型';
          getTaskTypeData({id:this.$route.query.id},(data)=>{
            console.log(data)
            let po = data.tbQyTaskTemplatePO;
            if(po.name === '明检任务') this.isExistTask = true;
            this.baseInputData.name.value = po.name;
            po.sortNum ? this.baseInputData.number.value = po.sortNum : '';
            // // 主任务标题
            // this.templateInputData.mainTitle.setPopData.titleHtml = po.maintaskTitleFormat
            //   ? this.changeTitleTemp(po.maintaskTitleFormat)
            //   : po.title;
            //
            // this.templateInputData.mainContent.value = po.content;
            // // 子任务编号
            // this.templateInputData.subNum.setPopData.titleHtml = po.subtaskNumberFormat
            //   ? this.changeTitleTemp(po.subtaskNumberFormat)
            //   : po.subtaskNumber;
            // // 子任务标题
            // this.templateInputData.subTitle.setPopData.titleHtml = po.subtaskTitleFormat
            //   ? this.changeTitleTemp(po.subtaskTitleFormat)
            //   : '';
            // // 子任务内容
            // this.templateInputData.subContent.value = po.subtaskContentFormat;
            // 是否开启子任务默认加载主任务标题内容
            this.isLoad = po.isLoad == 1;
            this.managementScope = po.erpSerNos.replace(/\|/g,' ');
            data.toUserList ? this.principalUsers = data.toUserList : '';
            data.ccUserList ? this.leaderUsers = data.ccUserList : '';
            if (data.toUserList){
              this.principalUsers.forEach(value => {
                let qyUserId = value.userId;
                value.qyUserId=qyUserId;
              })
            }
            if (data.ccUserList){
              this.leaderUsers.forEach(value => {
                let qyUserId = value.userId;
                value.qyUserId=qyUserId;
              })
            }
            this.settingBtnData.sendInfo.onOff = po.needPush === '1';
            this.settingBtnData.disEnable.onOff = po.status === '1';
          })
        }
        console.log(this.principalUsers)
      });
    },
    methods:{


      toTaskTypePage(){
        this.$router.push({path:'/taskType'})
      },
      showSetPop(key){
        this.templateInputData[key].setPopData.titleHtml = this.$refs[key][0].innerHTML;
        this.templateInputData[key].setPopData.popShow = true;
      },
      closeSetPop(key){
        this.templateInputData[key].setPopData.popShow = false;
      },
      saveSetting(format,key){
        this.templateInputData[key].setPopData.titleHtml = format;
        this.templateInputData[key].setPopData.popShow = false;
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
      // 将html替换成模版格式
      changeToFormat(html){
        let titleFormat = html.querySelectorAll('span') || [];
        titleFormat.forEach((item)=>{
          item.replaceWith('{'+item.dataset.attrid+'}');
        });
        return html.innerText;
      },
      addPrincipal(){
        this.principalPickShow = true;
      },
      addLeader(){
        this.relativePickShow = true;
      },
      addDealer(){
        this.dealerPickShow = true;
      },
      chooseDealer(val){
        console.log(val)
        this.dealerPickShow = false;
      },
      choosePost(val){
        console.log(val)
        this.postPickShow = false;
      },
      addPost(){
        //console.log('dddddddddddd')
        this.postPickShow = true;
      },
      choosePrincipal(val){
        console.log(val)
        // console.log(tagList)
        // console.log(specialUsers)
        this.principalUsers = val;
        this.principalPickShow = false;
      },
      chooseLeader(val){
        this.leaderUsers = val;
        this.relativePickShow = false;
      },
      closeThis(){
        this.principalPickShow = false;
        this.relativePickShow = false;
        this.dealerPickShow = false;
        this.postPickShow = false;
      },
      changeInput(key){
        if (key == 'name'){
          this.baseInputData.name.isWarning = this.baseInputData.name.value == '';
        }
      },

      change(key,val){
        if(this.isExistTask) val = true;
        this.settingBtnData[key].onOff = val;
      },

      isNumber(val) {
        var reg = /^[\d]+$/;
        var s = reg.test(val);
        return s;
      },
      doBlur(envt){
        var val = envt.target.value;
        //console.log('doBlur',val)

        var falg = false;
        if(val) {
          val = val.trim().replace(/\s+/g,' ');
          //console.log('str',val)
          val.trim().split(" ").forEach(num=>{
            if(!this.isNumber(num)){
              falg = true;
              return;
            };
          })
        }
        this.manageWarning = falg;
        if(!falg) {
          var erpNos =  val.trim().split(" ").join('|');
          this.isDealer(erpNos);
        }
      },

      isDealer(val){
       // console.log('isDealer',val)
        var params = {erpSerNos:val};
        isDealer(params,(res)=>{
          console.log(res)
          if(res.isDealer) {
            this.manageWarning = false;
          }else if(!res.isDealer){
            this.manageWarning = true;
            this.warningManage = '请输入正确服务ERP号';
          }
        })
      },
      updateTaskType(){
        if (this.baseInputData.name.value == ''){
          this.baseInputData.name.isWarning = true;
          return;
        }

        if(this.principalUsers.length <= 0){
          this.principalWarning = true;
          return;
        }else{
          this.principalWarning = false;
        }
        let principalUsers = this.principalUsers.map(item=> {return item.qyUserId}).join('|');
        let leaderUsers = this.leaderUsers.map(item=> {return item.qyUserId}).join('|');
        let managementScopes = '';
        if(!this.managementScope){
          this.manageWarning = true;
          this.warningManage = '请输入管理范围';
          return;
        }else{
          this.manageWarning = false;
        }
        if(this.managementScope) {
          this.managementScope.trim().split(" ").forEach(num=>{
            if(!this.isNumber(num)){
              this.manageWarning = true;
              return;
            };
          })
          managementScopes = this.managementScope.trim().split(" ").join('|');// 4545|454

          //this.isDealer(managementScopes);
        }

        let params = {
          'tbQyTaskTemplatePO.name':this.baseInputData.name.value,
          'tbQyTaskTemplatePO.sortNum':this.baseInputData.number.value,
          'tbQyTaskTemplatePO.isLoad':this.isLoad ? 1 : 0,
          'userIds':principalUsers,
          'givenUserIds':leaderUsers,
          'tbQyTaskTemplatePO.needPush':this.settingBtnData.sendInfo.onOff ? 1 : 0,
          'tbQyTaskTemplatePO.status':this.settingBtnData.disEnable.onOff ? 1 : 0,
          'tbQyTaskTemplatePO.erpSerNos':managementScopes,
        };


        var params2 = {erpSerNos:managementScopes};
        isDealer(params2,(res)=>{
         // console.log(res)
          if(res.isDealer) {
           // console.log("dddddddddddddddddddddddd")
            //return;
            if (this.$route.query.id){
              params['tbQyTaskTemplatePO.id'] = this.$route.query.id;
              params['status'] = 1;

              // 编辑任务类型
              updateTaskType(params,()=>{
                dataBase.top_alert('更新成功',true,3000);
                this.$router.go(-1);
              })
            }else {
              // 新增任务类型
              addTaskType(params,()=>{
                dataBase.top_alert('新增成功',true,3000);
                this.$router.go(-1);
              })
            }
          }else{
            this.manageWarning = true;
            this.warningManage = '请输入正确服务ERP号';
          }
        })


      }
    },
    components:{
      qwuiGoBack,
      qwuiInput,
      qwuiPersonCount,
      pickPerson,
      qwuiSwitch,
      qwuiButton,
      advancedSetPop,
      qwuiCheckbox,
      pickDealer,
      pickPost
    }
  }

</script>

<style src="../../scss/task/task.scss" lang="scss" scoped></style>
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
  .qwui-moudle_item {
    padding-bottom: 30px;
    border-bottom: 1px solid #E5E5E5;
  }
  .qwui_moudle_itle {
    margin: 30px 0;
    font-size: 16px;
    font-weight:bold;
    color: #383838;
  }
  .qwui-input_item {
    margin-bottom: 10px;
    .functionDesc{
      margin-top: 5px;
      color: #999;
    }
    .itemTitle {
      margin-bottom: 5px;
      padding-top: 5px;
      width: 130px;
      display: inline-block;
      text-align: right;
    }
    .star {
      margin-right: 5px;
      color: red;
    }
  }
  .qwui-add_person{
    margin-top: 5px;
    margin-bottom: 10px;

      .personTitle {
        display: inline-block;
        width: 130px;
        text-align: right;
      }

     .qwui-principal_count {
       display: inline-block;
       margin-top: -5px;
       width: 600px;
       vertical-align: text-top;
    }
  }
  .qwui-setting_item {
    position: relative;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    margin: 0 250px 10px 130px;
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
  .qwui-input_style {
    vertical-align: top;

  & /deep/ {
  .textarea_wrap .qw_textarea,.input_wrap .qw_sortInput{
    width: 340px;
  }
  }
  }

  .qwui-title_type {
    margin: 30px 0 0 132px;

    .funcTitle {
      margin-bottom: 5px;
    }

    .funcDesc {
      vertical-align: bottom;
      color: #808080;
    }
  }
</style>

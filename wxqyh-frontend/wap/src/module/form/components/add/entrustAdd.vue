<template>
  <div class="wrap">
    <div class="entrust-top">
      <!--标题-->
      <div class="add-title">
        <input type="text" v-model="title" :maxlength="titleMaxLength" :placeholder="titleErrorTip?titleErrorTip:$t('输入委托标题（必填）')" class="title-font" :class="titleErrorTip?'error-tip':''">
        <p class="title-counter" v-show="titleNum>0">{{titleNum}}/{{titleMaxLength}}</p>
      </div>
      <div class="entrust-date">
        <span class="entrust-date-font">委托时间</span>&nbsp;<span class="qwui-required_mark">*</span>
      </div>
      <div class="entrust-date-time">
        <div class="start-time">
          <input class="text-start-time" type="text" :placeholder="startTimeErrorTip?startTimeErrorTip:$t('请选择起始时间')" :value="startTime" readonly :class="startTimeErrorTip?'start-tip':''">
        </div>
        <i class="date-middle">——</i>
        <div class="end-time">
          <input class="text-end-time" type="text" :placeholder="endTimeErrorTip?endTimeErrorTip:$t('请选择结束时间')" :value="endTime" readonly :class="endTimeErrorTip?'end-tip':''">
        </div>
        <div></div>
      </div>
    </div>
    <!--选择被委托人-->
    <user_selected_group
      v-if="item && item.startAuditList.show"
      v-for="(item,index) in FlowAuditUser"
      :key="index"
      :title="startAuditTitle(item.nodeName)"
      :mustChoose="true">
      <user_selected_item
        @showUserSelectedBox="FlowAuditUserShowBox(index)"
        :isEdit="item.startAuditList.isCanEdit"
        slot="user_selected_item"
        :List="item.startAuditList.userSelected"
        :title="startAuditTitle(item.nodeName)"
        @showPersonList="showPersonList"
        @removeSelected="(payload)=>removeFlowAuditUser({delUserIndex:payload.index,index})"
        :isRemove="FlowAuditUser
                   && FlowAuditUser[index]
                   && FlowAuditUser[index].startAuditList.isCanEdit
                   && FlowAuditUser[index].startAuditList.isCanDelete">
      </user_selected_item>
    </user_selected_group>

    <div class="tips">
      <p class="tips-icon">提示：</p>
      <p class="tips-font">1.流程委托在同一时间段只能委托给同一个人</p>
      <p class="tips-font">2.委托时间内需委托人处理的表单将由被委托人进行处理</p>
    </div>
    <!--保存按钮-->
    <button_group :fixed="true">
      <qwui_button type="primary" text="保存" @buttonClick="saveRule"></qwui_button>
    </button_group>
  </div>
</template>

<script>
  import user_selected_item from '@/components/base/userOrDeptSelect/user_selected'
  import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group'
  import {qwui_button, button_group} from '@/components/base/button'
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
  import { field_validation } from '../fields/validation.js'
  import { getEntrustInfo, updateEntrust } from '../../js/getData'
  export default {
    name:'entrustAdd',
    components: {
      user_selected_item,
      user_selected_group,
      qwui_button,
      button_group,
    },
    data() {
      return {
        agentName:'表单流程',
        date:'',
        startTime:'',
        endTime:'',
        saveURL:'',
        title:'',
        titleMaxLength:'30',
        titleErrorTip:'',
        startTimeErrorTip:'',
        endTimeErrorTip:'',
        ruleId: ''
      }
    },
    computed: {
      ...mapState({
        FlowAuditUser: state => state.userSelected.FlowAuditUser, // 被委托人信息
      }),
      ...mapGetters([
        "FlowAuditUserIds",   // 已选择的处理人id
      ]),
      titleNum() {
        return this.title.length;
      }
    },
    created() {
      this.initForm();
      // 重置数据
      this.$store.commit('resetFlowData');
      this.$store.commit('resetDetailData');
    },
    methods: {
      ...mapMutations([
        "removeFlowAuditUser",        // 删除处理人
      ]),
      async initForm() {
        var _this = this;
        var id = this.$route.query.id;
        this.queryType = this.$route.query.type;
        if(this.queryType == 'edit'){
          this.saveURL = _.baseURL + '/portal/flow/flowEntrust/ajaxUpdateEntrustRule.do';
          document.title = '编辑委托';
          await this.loadEntrustData(id);
        }else {
          this.saveURL = _.baseURL + '/portal/flow/flowEntrust/ajaxAddEntrustRule.do';
        }
        this.$nextTick(this.dateTimeConfig);
        this.date = new Date().Format('yyyyMMdd');
        this.title = this.agentName + '_' + this.date;
      },
      async loadEntrustData(id) {
        var userArr = [];
        await getEntrustInfo(id, (data) => {
          userArr.push(data.entrustRuleData.consigneeUserInfo);
          this.startTime = data.entrustRuleData.startTime;
          this.endTime = data.entrustRuleData.endTime;
          this.title = data.entrustRuleData.title;
          this.ruleId = data.entrustRuleData.id;
          this.$store.commit('updateUserSelected', userArr);
        })
      },
      dateTimeConfig() {
        let $el1 = $(this.$el).find('.text-start-time');
        let $el2 = $(this.$el).find('.text-end-time');
        let timePluginConf = {
          dateFormat:"yy-mm-dd",
          dateOrder:"yymmd D",
          dayText:"日",
          display:"bottom",
          endYear:2050,
          mode:"scroller",
          monthText:"月份",
          showNow: true,
          nowText: '今天',
          headText: '',
          stepMinute:1,
          theme:"android-holo light",
          yearText:"年份",
          cancelText: "确认",
          setText: "取消",
        };
        let _this = this;
        if(this.queryType == 'edit') {
          $el1.mobiscroll().datetime({
            ...timePluginConf,
            defaultValue: new Date(_this.startTime),
            onSelect: function(valueText) {
              _this.startTime = valueText;
            }
          });
          $el2.mobiscroll().datetime({
            ...timePluginConf,
            defaultValue: new Date(_this.endTime),
            onSelect: function(valueText) {
              _this.endTime = valueText;
            }
          });
        }else {
          let startDate = new Date(),
              endDate = new Date();
          startDate.setMinutes(startDate.getMinutes()+5);
          endDate.setHours(endDate.getHours()+4);
          $el1.mobiscroll().datetime({
            ...timePluginConf,
            defaultValue: startDate,
            onSelect: function(valueText) {
              _this.startTime = valueText;
            }
          });
          $el2.mobiscroll().datetime({
            ...timePluginConf,
            defaultValue: endDate,
            onSelect: function(valueText) {
              _this.endTime = valueText;
            }
          });
        }
        $el1.on('change',function(e){
          _this.setStartValue(e.target.value);
        });
        $el2.on('change',function(e){
          _this.setEndValue(e.target.value);
        });
      },
      startAuditTitle:function(nodeName) {
        return nodeName ? nodeName+'被委托人' : '被委托人'
      },
      // 选择委托人弹窗
      FlowAuditUserShowBox(index) {
        this.$store.commit('updateUserSelectedData',{type:'appointUserIndex',data:index})
          var _this = this;
          dataBase.selectConfig.show = true;
          dataBase.selectConfig.signIndex = 'users';
          dataBase.selectConfig.selectList["users"].userRestriction="1"; // 单选处理人
          dataBase.selectConfig.selectList.users.callBack.confirm = function(id,data){
            _this.$store.commit('updateUserSelected',data.user.data)
          }
          dataBase.selectConfig.selectList.users.userSelected = this.FlowAuditUser[index].startAuditList.userSelected;
      },
      showPersonList(title,list){
        this.userselectTitle = title;
        this.userSelectList = list;
        this.showPerson = true;
        this.limitPreview = true
      },
      setStartValue(value) {
        this.startTime = value;
      },
      setEndValue(value) {
        this.endTime = value;
      },
      // 验证必填
      isCheckMust() {
        this.titleErrorTip = '';
        this.startTimeErrorTip = '';
        this.endTimeErrorTip = '';
        this.hasError = false;
        var userSelected = this.FlowAuditUser[0].startAuditList.userSelected;
        if (this.title == ''){
          this.titleErrorTip = '委托标题不能为空';
          this.hasError = true;
        }
        if (this.startTime == ''){
          this.startTimeErrorTip = '起始时间不能为空';
          this.hasError = true;
        }
        if (this.endTime == ''){
          this.endTimeErrorTip = '结束时间不能为空';
          this.hasError = true;
        }
        if (userSelected == ''){
          _.tooltips_succeed('请选择被委托人',true,"",2500);
          this.hasError = true;
        }
        if(this.hasError){
          return true;
        }
      },
      async saveRule() {
        if(this.isCheckMust()) return false; // 验证失败跳出
        var userSelectedId = this.FlowAuditUser[0].startAuditList.userSelected[0].userId;
        var data = {
          'tbQyFlowEntrustRulePO.consigneeUserId': userSelectedId,
          'tbQyFlowEntrustRulePO.startTime': this.startTime+':00',
          'tbQyFlowEntrustRulePO.endTime': this.endTime+':00',
          'tbQyFlowEntrustRulePO.agentCode': dataBase.wxqyh_uploadfile.agent,
          'tbQyFlowEntrustRulePO.title': this.title
        }
        if(this.queryType == 'edit'){
          data['tbQyFlowEntrustRulePO.id'] = this.ruleId;
        }
        var self = this;
        let res = await updateEntrust(data,this.saveURL);
        _.tooltips_succeed("保存成功", true);
        setTimeout(function () {
          self.$router.push({name: 'entrust'});
        },1500);
      },
    },
  }
</script>

<style>
  .entrust-top{
    position: relative;
    margin-top: 16px;
    padding-left: 15px;
    background-color: #fff;
  }
  .add-title{
    position: relative;
    display: flex;
    align-items: center;
    height:60px;
  }
  .add-title::after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .title-font{
    flex: 1;
    font-size: 20px;
    color: #0A1735;
    line-height:60px;
    width:85%;
    background: #fff;
  }
  .entrust-date{
    position: relative;
    height:50px;
  }
  .entrust-date-font{
    font-size: 16px;
    color: #0A1735;
    line-height:50px;
  }
  .tips{
    padding: 12px 14px;
    font-size: 13px;
  }
  .tips-font{
    color: #B2B9C8;
  }
  .tips-icon{
    margin-bottom: 4px;
    color: #7A7D80;
  }
  .entrust-date-time{
    display: flex;
    justify-content: space-between;
    height: 60px;
    line-height: 55px;
    padding-right: 15px;
  }
  .entrust-date-time input{
    width: 128px;
    font-size: 15px;
    background: #fff;
  }
  .date-middle{
    color: #E4E5E9;
  }
  .end-time input{
    text-align: right;
  }
  .title-counter{
    padding-right: 10px;
    color: #B2B2B2;
  }
  .error-tip::-webkit-input-placeholder{
    color:#FF574D;
  }
  .start-tip::-webkit-input-placeholder{
    color:#FF574D;
  }
  .end-tip::-webkit-input-placeholder{
    color:#FF574D;
  }
</style>

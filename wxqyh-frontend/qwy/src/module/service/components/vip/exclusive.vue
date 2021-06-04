<template>
    <div class="exclusive-content">
        <div class="exclusive-content-item" style="padding-bottom: 30px;">
            <span class="title">企业名称</span>
          <div class="text-item">{{corpId.orgName}}</div>
          <span v-if="!corpId.orgName" class="orgName-tip">请填写企业ID</span>
        </div>

        <div class="exclusive-content-item">
            <span class="title"><i class="red">*</i>企业ID</span>
            <div class="text-item">
                <input type="text" v-model="corpId.value"
                       @focus="handleFocusCorpId"
                       @change="corpIdCheck">
                <span class="question-mark"
                      @mouseover="showQuestionText = true"
                      @mouseout="mouseOutQuestion('showQuestionText')"
                >
                  <i>?</i>
                  <div class="tip-info-box left" :class="{ active: showQuestionText }" style="width: 224px;top:-9px;left: 32px;">
                    <div class="tip-info-content">
                      <p class="question-mark-text">“企业ID”也叫“CorpID”，可以从企业微信/企微云管理后台中复制</p>
                      <!--<p class="question-mark-way">使用企微云管理账号获取</p>-->
                    </div>
                  </div>
                </span>
                <span v-if="!corpId.value" class="empty">企业ID不能为空</span>
              <span v-else-if="!corpId.focus && !corpId.check" class="empty">企业ID不正确</span>
            </div>
        </div>

        <div class="exclusive-content-item" style="padding-bottom: 20px;">
            <span class="title">选择版本</span>
            <div style="display: flex;align-items: center;font-size: 0">
              <package-group>
                <package
                v-for="(item,index) in checkPackageList"
                          className="viprespect"
                          :key="index"
                          :label="item"
                          :checked="item.check"
                          @change="packageChange"
                >
                <span :class="[item.priceCode]"
                      @mouseover="mouseOverFun"
                      @mouseout="mouseOutFun"
                >
                  {{item.priceCode}}
                <div v-if="item.configStr" class="tip-info-box" style="top: 68px;">
                  <div class="tip-info-content">
                    <p>{{item.configStr.basePerson}}人基础价格：{{item.promPrice/100}}元/年</p>
                    <p>额外扩容价格：{{item.configStr.amountStep/100}}元/{{item.configStr.personStep}}人/年</p>
                  </div>
                </div>
                </span>
                </package>
              </package-group>
            </div>
        </div>
        <!--应用列表名称-->
        <div class="exclusive-content-item" style="padding-bottom: 25px;margin-right: 86px;">
          <span class="title"></span>
          <div>
            <checkbox-group v-model="checkPackageApply">
              <checkbox v-for="(item,index) in applianceList"
                        :key="item"
                        :label="item"
                        @change="handleChange"
                        style="padding-bottom: 12px;"
              >
                <span style="margin: -10px 0px;padding: 10px 0px;display: block;"
                      @mouseover="mouseOverFun"
                      @mouseout="mouseOutFun"
                >
                  {{item|formatName}}
                  <div v-if="applianceConfig[item].configStr" class="tip-info-box" :class="{width: item=='teamwork'}">
                    <div class="tip-info-content">
                      <div class="tip-text-box" v-if="serviceTextList[item]">
                        <p class="tip-text"
                          v-for="(item,i) in serviceTextList[item]"
                          :key="i"
                        >
                        {{item}}
                        </p>
                      </div>
                      <p class="tip-text">{{applianceConfig[item].configStr.basePerson}}人基础价格：{{applianceConfig[item].promPrice/100}}元/年
                      </p>
                      <p class="tip-text">额外扩容价格：{{applianceConfig[item].configStr.amountStep/100}}元/{{applianceConfig[item].configStr.personStep}}人/年
                      </p>
                    </div>
                  </div>
                </span>

              </checkbox>
            </checkbox-group>
          </div>
        </div>
        <!--增值服务-->
        <div class="exclusive-content-item">
            <span class="title">增值服务</span>
          <div>
            <checkbox-group v-model="serviceModel">
            <checkbox v-show="index==0" v-for="(item,index) in checkService"
                      className="service"
                      :label="item"
                      @change="selectServiceClick"
                      :key="index">
              <div class="service">
                <i :class="item.className"></i>
                <p class="name">{{item.name}}</p>
                <p class="price">{{item.promPrice}} / {{item.unit}}</p>
              </div>
            </checkbox>
            </checkbox-group>
          </div>
        </div>
        <!--实施服务人数-->
        <div class="exclusive-content-item" v-if="showServiceNumber">
            <span class="title">实施服务人数</span>
            <div class="server-merber">
                <span class="button-input">
                    <input type="button" class="button-minus" value="-" @click="selectMerberClick(false)">
                    <input type="text" class="button-value"  :value="serviceMerbers">
                    <input type="button" class="button-add" value="+" @click="selectMerberClick(true)">

                </span>
              <span class="item">人</span>
                <span class="button-input">
                    <input type="button" class="button-minus" value="-" @click="selectTimeClick(false)">
                    <input type="text" class="button-value"  :value="serviceDay">
                    <input type="button" class="button-add" value="+" @click="selectTimeClick(true)">

                </span>
              <span class="item">天</span>
            </div>
        </div>

        <div class="exclusive-content-item">
            <span class="title">购买年数</span>
            <checkbox-group v-model="selectYear">
              <checkbox v-for="(item,index) in buyYearList" :key="index" width="110px"
                :label="item"
                @change="yearChange"
              >
               {{item.zh}}
              </checkbox>
            </checkbox-group>

        </div>

        <div class="exclusive-content-item" style="padding-bottom: 0px;">
            <span class="title">购买人数</span>
            <div style="display: flex">
                <span class="button-input">
                    <input type="button" class="button-minus" value="-" @click="buyNumberClick(false)">
                    <input type="text" class="button-value"
                    v-model="buyPerson.value"
                    @keyup="buyPersonUp"
                    @blur="buyPersonBlur($event,countPriceFun)"
                    >
                    <input type="button" class="button-add" value="+" @click="buyNumberClick(true)">
                </span>
              <div class="tips">
                <p >提示：应用可见范围的人数超出购买人数时，该应用的尊享功能将无法使用</p>
                <div class="align-items-center"
                  v-if="corpId.agentCount && corpId.check">当前企业可见范围最大的应用：
                  {{corpId.agentCount.agentName}}
                  <span class="span">
                    {{corpId.agentCount.personCount}}</span> 人
                    <span class="question-mark"
                          @mouseover="showAgentCount = true"
                          @mouseout="mouseOutQuestion('showAgentCount')"
                    >
                    <i>!</i>
                    <div class="tip-info-box top" :class="{ active: showAgentCount }" style="top: 30px;left: -13px;">
                      <div class="tip-info-content">
                        <div class="tip-text-box tip-text-box_scroll">
                              <p class="tip-text" v-for="(item,index) in corpId.agentCountList"
                              :key="index"
                              >{{item.agentName}}{{item.personCount}}人
                              </p>
                        </div>
                      </div>
                    </div>
                    </span>
                </div>
              </div>
            </div>
        </div>

        <div class="exclusive-content-item" style="margin: 28px 0 -14px;padding-bottom: 0"
        v-if="showBeneficiary">
          <span class="title">购买方式</span>
          <div class="text-item">
                <checkbox v-model="beneficiary"
                          :animate="false"
                  className="radio"
                >
                服务转赠
                </checkbox>
          </div>
        </div   >
      <div class="height-price-box"></div>
        <qw-price
          :className="priceBackGroup"
          @buyClick="buynowClick">
          <div class="title"  v-if="beyondBuyPerson">
            <i>¥</i>{{priceConfig}}
            <div class="have-price">
              <!--<span class="price">.{{priceRadixPoint}}</span>-->
              <span class="year">({{buyNumModel}})</span>
            </div>
          </div>
          <div class="title" v-else><i>价格面议</i></div>
          <div v-if="beyondBuyPerson">
            <div style="color:#383838;font-size:16px;">现已优惠: <span>￥{{nowOfferPrice}}</span>
            <span class="default-text">购买多年、老用户均可申请更多折扣</span>
            </div>
            <div style="font-size:18px;color:#333;margin-top:30px;">每人仅需：{{averagePrice}} 元/月</div>
          </div>
          <p class="default-text">超过500人价格面议</p>
        </qw-price>

        <div class="service-explain">
            <p class="title">购买说明</p>
              <p class="text-item">1. 购买成功后，将马上为您开通该项服务，过期后需续费才能继续享有原有功能。</p>
              <p class="text-item">2. 申请发票可前往<span class="tip" @click="orderManagerClick">订单管理</span>提交相关信息，企微云工作人员会在7个工作日内将发票寄出。</p>
              <p class="text-item">3. 购买人数超过2000人，可另外申请折扣优惠。</p>
        </div>
      <qw-alert
        :show.sync="showAlert"
        primaryBtn="确认购买"
        defaultBtn="修改人数"
        @primaryConfirm="sureBuyPackage"
        @defaultConfirm="defaultConfirm"
      >
        您计划购买的人数小于相关应用可见范围人数，购买后需要调整可见范围人数才能正常使用
      </qw-alert>
    </div>
</template>
<script>
  import {Checkbox,CheckboxGroup,Package, PackageGroup} from '../../components/checkbox'
  import QwAlert from '../../components/alert'
  import QwPrice from '../../components/vip/price'
  import  {QwFooter,QwButton} from '../../index'
  import Emitter from '../../mixins';
  //应用名称配置
  import {INITVIPRESPECT,BASEAGENTS,applianceConfigs,buyYearConfig,formatMoneyMethod} from './exclusive'
  //API接口
  import {
    getOrgInfo,
    getOrgAgentUserCount,
    findProductListByServiceId,
    doViprespectDetail,
    estimateMulitPrice
  } from "../../api/vip";
  import baseURL from '@/assets/js/baseURL_config';

  export default {
    name:'ExclusiveBuy',
    mixins: [Emitter],
    components:{
      Checkbox,
      CheckboxGroup,
      Package,
      PackageGroup,
      QwButton,
      QwPrice,
      QwAlert
    },
    data() {
      return {
        //增值服务
        serviceModel:[],
        checkService: [
          {
            name: '数据接口',
            className:'icon1',
            check: false,
            priceCode:"checkout",
            promPrice: '',
            unit: '年'
          },
          {
            name: '一对一服务',
            className:'icon2',
            check: false,
            promPrice: 2000,
            unit: '年'
          },
          {
            name: '实施服务',
            className:'icon3',
            check: false,
            promPrice: 5000,
            unit: '人天(3天起购)',
            //实施服务人数: 人\天
            num: 1,
            day: 3
          },
          {
            name: '智慧党建服务',
            className:'icon4',
            check: false,
            promPrice: 2000
          }
        ],
        serviceTextList:{
          teamwork:['包含会议助手、考勤打卡、请假出差、','企业用车、新闻公告、审批请示所有高级功能'],
          culture:['包含同事社区、企业活动、问卷投票所有高级功能'],
          crm: ['包含CRM、企微云小站、合同管理','、移动外勤所有高级功能'],
          hr: ['包含花名册、工资条、绩效考核、人事待办、员工关怀所有高级功能'],
          learn: ['包含培训学习、考试评测、直播教学所有高级功能']
        },

        //已选应用列表
        checkPackageApply:[],
        //套餐数据
        checkPackageList:{
          //企微云OA套餐
          viprespect_oapackage: INITVIPRESPECT(),
          //企微云HR套餐
          viprespect_hrpackage: INITVIPRESPECT(),
          //企微云CRM套餐
          viprespect_crmpackage: INITVIPRESPECT(),
        },
        //应用列表配置
        applianceConfig: applianceConfigs,
        //购买人数
        buyPerson:{
          //区间段 CRM套餐5 ，其他套餐10
          section: 10,
          //最小值 CRM套餐10 ，其他套餐50
          minNumber: 10,
          //当前通讯录人数
          currentNumber: 0,
          //上次选择的人数
          oldNumber: 0,
          //当前选择的人数
          value: 0
        },
        //购买年数
        oldSelectYearValue: buyYearConfig[0].year,
        selectYear: [buyYearConfig[0]],
        buyYear:buyYearConfig,
        //转赠服务
        beneficiary: false,
        showBeneficiary: true,
        //价格
        price: 0,
        //显示疑问说明
        showQuestionText: false,
        //正在请求数据
        gettingRequesting: false,
        //显示弹窗
        showAlert: false

      }
    },
    filters:{
      //过滤应用名称
      formatName(key){
        return applianceConfigs[key].zh;
      },
    },
    computed:{
      //应用的中文列表
      applianceList(){
        let applianceList = []
        Object.keys(applianceConfigs).forEach((item) => {
          applianceList.push(item)
        })
        return applianceList;
      },
      //显示实施服务人数
      showServiceNumber(){
        return this.checkService[2].check
      },
      //实施服务人数
      serviceMerbers(){
        return this.checkService[2].num
      },
      //实施服务天数
      serviceDay(){
        return this.checkService[2].day
      },
      //购买年数
      buyYearList(){
        return this.buyYear;
      },
      //显示价格购买年数
      buyNumModel(){
        return this.selectYear[0].zh
      },
      //现已优惠价格
      nowOfferPrice(){
        return formatMoneyMethod((this.price/0.8 - this.price),0,100)
      },
      //平均每人价格
      averagePrice(){
        let value = 0;
        value = formatMoneyMethod((this.price/12/this.buyPerson.value/this.selectYear[0].year),0,100)
        if(isNaN(parseInt(value))){
          value = 0
        }
        return value
      },
      //超出500人价格面议
      beyondBuyPerson(){
        return this.buyPerson.value < 500
      }
    },
    created(){
      //获取corpId
      this.getOrgInfoFun()
    },
    methods:{
      //获取corpId
      getOrgInfoFun(){
        getOrgInfo({},(result) => {
          let data = result.data
          if(result.code=='0' && data.corpId){
            this.corpId.value = data.corpId
            this.corpId.orgName = data.orgName

            //记录当前企业的人数
            this.buyPerson.currentNumber = data.userMemberNum;

            //查询当前企业的应用最大人数
            this.getOrgAgentUserCountFun()
          }else{
            this.showBeneficiary = false
          }

          //查找尊享版价格信息
          this.doViprespectDetailFun()

        })
      },
      //查找尊享版价格信息、实施服务列表
      doViprespectDetailFun(){
        doViprespectDetail({},(result) => {
          let viprespectList = result.data.viprespectList
          let type = this.$route.query.type

          if(!type){
            this.checkPackageList['viprespect_crmpackage'].check = false
          }
          viprespectList.forEach((item) => {
            if(this.checkPackageList[item.priceCode]){
              Object.assign(this.checkPackageList[item.priceCode],item)
              this.checkPackageList[item.priceCode].agents = BASEAGENTS[item.priceCode].agents
              if(type &&  type !== item.priceCode){
                this.checkPackageList[item.priceCode].check = false
              }

            }else {
              let priceCode = item.priceCode.replace('viprespect_','')
              if(this.applianceConfig[priceCode]){
                Object.assign(this.applianceConfig[priceCode],item)
                this.applianceConfig[priceCode].zh = item.productName
              }
            }
          })

          //初始化当前选择的应用
          this.checkApplianceList()
        })

        //查询实施服务列表
        findProductListByServiceId({serviceId:'checkout'},(result) => {

          let productProductList = result.data.productProductList
          this.checkService[0].promPrice = Number(productProductList[0].promPrice)/100
          dataBase.loading = false
        })

      },
      //选择套餐：三大套餐不能同时选中，选择CRM套餐不能选择其他套餐
      packageChange(val,event){

        let obj = event.target._value
        //当前套餐附带的单项应用
        let agentList = obj.agents.split(',')
        //勾选上
        if(val){
          //勾选CRM套餐
          if (obj.priceCode == 'viprespect_crmpackage'){
            //剔除其他套餐已选的单项应用，把CRM套餐对应的单项应用加入队列中
            this.checkPackageApply.length = 0
            agentList.forEach((item)=> {
              this.checkPackageApply.push(item)
            })
          }else{
            //勾选OA\HR套餐
            //遍历crm 套餐附带的单项应用 ，crm、sale 若存在应用队列中则剔除
            for(let i= this.checkPackageApply.length-1;i>=0;i--){
              if (this.checkPackageApply[i] == 'sale' || this.checkPackageApply[i] == 'crm' || this.checkPackageApply[i] == 'crmmini') {
                this.checkPackageApply.splice(i,1)
              }
            }
            //把OA\HR套餐对应的单项应用加入队列中
            agentList.forEach((item)=> {
              if (this.checkApplyStr().indexOf(item) == -1) {
                this.checkPackageApply.push(item)
              }
            })
          }
        }else{
          for(let i= this.checkPackageApply.length-1;i>=0;i--){
            if (obj.agents.indexOf(this.checkPackageApply[i]) != -1) {
              this.checkPackageApply.splice(i,1)
            }
          }
        }

        //重置套餐勾选状态
        this.resetPackageStatus()

        //估算价格
        this.countPriceFun()
      },
      //重置套餐勾选状态，重置购买人数
      resetPackageStatus(){
        let self = this
        Object.keys(self.checkPackageList).forEach((item) => {
          let agentList = self.checkPackageList[item].agents.split(',')
          let hasCheck = true;
          agentList.forEach((els)=>{
            if(!self.checkPackageApply.includes(els)){
              hasCheck = false
              return false;
            }
          })
          self.checkPackageList[item].check = hasCheck
        })
        this.checkApplyStr()
        //重置购买人数
        this.buyPerson.value = this.resetBuyPerson(this.buyPerson.value)
        //初始化当前购买的旧人数
        this.buyPerson.oldNumber = this.buyPerson.value
      },
      //初始化当前选择的应用,价格
      checkApplianceList(){
        Object.keys(this.checkPackageList).forEach((item) => {
          if(this.checkPackageList[item].check){
            let agentList = this.checkPackageList[item].agents.split(',')
            agentList.forEach((item)=>{
              if(this.checkApplyStr().indexOf(item)==-1){
                this.checkPackageApply.push(item)
              }
            })
          }
        })
        //估算价格
        this.countPriceFun()
      },
      //已选的应用字段String
      checkApplyStr(){
        //最低购买人数
        let min = 10;
        //有勾选crm、sale
        let hasCrm = true
        //购买人数的区间
        this.buyPerson.section = 5
        //当前单项应用队列的字符串
        let checkApplyStr = ''
        if(this.checkPackageApply.length){
          this.checkPackageApply.forEach((item) => {
            checkApplyStr += item + ','
          })
          checkApplyStr = checkApplyStr.substring(0, checkApplyStr.lastIndexOf(","));
        }

        //没有CRM套餐任一单项应用
        if(checkApplyStr.indexOf('sale')== -1 && checkApplyStr.indexOf('crm')== -1){
          this.buyPerson.section = 10
          hasCrm = false
          min = 50
        }

        //选中crm 或 sale单项应用
        if(hasCrm && this.buyPerson.value == 50){
          this.buyPerson.value = 10
        }

        //当前购买人数低于最低人数，重新赋值
        if(this.buyPerson.value < min){
          this.buyPerson.value = min
        }

        this.buyPerson.minNumber = min

        return checkApplyStr
      },
      //点击勾选单项应用按钮,单独选择应用匹配套餐功能
      handleChange(val,ev){
        let value = ev.target.value
        if(val){
          //是crm 或 sale 单项应用，重置全部应用队列
          if(value == 'sale' || value == 'crm' || value == 'crmmini'){
            for(let i= this.checkPackageApply.length-1;i>=0;i--){
              if (this.checkPackageApply[i] != 'sale' &&  this.checkPackageApply[i] != 'crm' &&  this.checkPackageApply[i] != 'crmmini') {
                this.checkPackageApply.splice(i,1)
              }
            }
            if(value == 'crm' && !this.checkPackageApply.includes('crmmini')){
              this.checkPackageApply.push('crmmini')
            }
          } else{
            //剔除crm sale 单项应用
            for(let i= this.checkPackageApply.length-1;i>=0;i--){
              if (this.checkPackageApply[i] == 'sale' || this.checkPackageApply[i] == 'crm' || this.checkPackageApply[i] == 'crmmini') {
                this.checkPackageApply.splice(i,1)
              }
            }
          }
        }

        //重置套餐勾选状态
        this.resetPackageStatus()

        //估算价格
        this.countPriceFun()
      },
      //实施选择
      selectServiceClick(val,ev){
        let obj = ev.target._value
        obj.check = val

        //估算价格
        this.countPriceFun()
      },
      //改变实施人数
      selectMerberClick(val){
        if(val){
          this.checkService[2].num++;
          return
        }
        this.checkService[2].num--
        if(this.checkService[2].num<=1){
          this.checkService[2].num = 1
        }
      },
      //改变实施天数
      selectTimeClick(val){
        if(val){
          this.checkService[2].day++;
          return
        }
        this.checkService[2].day--
        if(this.checkService[2].day<=3){
          this.checkService[2].day = 3
        }
      },
      //购买年数
      yearChange(val,ev){
        let value = ev.target._value
        this.selectYear.length = 0;
        this.selectYear.push(value)

        if(value && value.year != this.oldSelectYearValue){
          this.oldSelectYearValue = val.year
          //估算价格
          this.countPriceFun()
        }
      },
      //估算价格参数配置
      estimateMulitPriceFun(){

        let params = {corpId:this.corpId.value, services:[]}
        //已选套餐包含的应用
        let priceCodeStr = ''

        Object.keys(this.checkPackageList).forEach((item) => {
          if(this.checkPackageList[item].check){
            params.services.push({
              serviceId:"viprespect",
              priceCode:this.checkPackageList[item].priceCode,
              buyNum: this.selectYear[0].year,
              extParam: `buyPerson=${this.buyPerson.value}`
            })
            priceCodeStr += this.checkPackageList[item].agents + ','
          }
        })

        //单项勾选的应用（没有勾选套餐）
        priceCodeStr = priceCodeStr.substring(0, priceCodeStr.lastIndexOf(","));
        this.checkPackageApply.forEach((item) => {
          if(priceCodeStr.indexOf(item)==-1){
            params.services.push({
              serviceId: "viprespect",
              priceCode: `viprespect_${item}`,
              buyNum: this.selectYear[0].year,
              extParam: `buyPerson=${this.buyPerson.value}`
            })
          }
        })

        //增值服务
        this.checkService.forEach((item) => {
          if(item.check){
            params.services.push({"serviceId":item.priceCode,"priceCode":item.priceCode,"buyNum":this.selectYear[0].year})
          }
        })


        return params
      },
      //估算价格
      countPriceFun(){

        //还在计算价格中
        if(this.gettingRequesting){
          return
        }

        let params = this.estimateMulitPriceFun()
        if(this.checkPackageApply.length && params.services.length){
          estimateMulitPrice(params,(result) => {
            let order = result.data.order
            this.price = order.tradeAmount
            this.gettingRequesting = false
          })
        }else{
          this.price = 0
        }
      },
      //检测购买条件是否满足
      checkBuycondition(){
        if(!this.corpId.value){
          dataBase.top_alert('企业ID不能为空', false, 3000);
          return false
        }
        if(!this.corpId.check){
          dataBase.top_alert('企业ID不正确', false, 3000);
          return false
        }
        if(!this.checkPackageApply.length){
          dataBase.top_alert('请选择套餐或应用', false, 3000);
          return false
        }
        return true
      },
      //立即购买
      buynowClick(){

        if(!this.checkBuycondition()){
          return
        }
        if(this.buyPerson.value < this.buyPerson.currentNumber){
          this.showAlert = true
          return
        }

        this.sureBuyPackage()
      },
      //修改人数
      defaultConfirm(){
        this.showAlert = false
      },
      //确认购买
      sureBuyPackage(){
        let params = this.estimateMulitPriceFun()
        localStorage.setItem('companysrv_shopping_cart', JSON.stringify(params));

        document.location.href =
          `${baseURL}/qiweipublicity/companysrv/order/order_mulit_confirm.jsp?serviceId=viprespect&beneficiary=${this.beneficiary}&corpId=${this.corpId.value}`
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'exclusive.scss';
</style>

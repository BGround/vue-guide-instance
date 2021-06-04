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
               @change="corpIdCheck(getOrgViprespectDetail)">
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

    <div class="exclusive-content-item" style="padding-bottom: 30px;align-items: unset;">
      <span class="title">选择模块</span>
      <div style="display: flex;align-items: center;font-size: 0">
        <checkbox-group v-model="vipShowVOModuleModel">
          <checkbox style="padding-bottom: 15px;"
                    v-for="(item,index) in vipShowVOModuleList"
                    :key="index"
                    :label="item"
                    @change="selectPackage"
          >
            <span style="margin: -10px 0px;padding: 10px 0px;display: block;"
              @mouseover="mouseOverFun"
              @mouseout="mouseOutFun"
            >
              {{item.vipName}}
              <div v-if="item.configStr" class="tip-info-box">
                <div class="tip-info-content">
                  <p class="tip-text">额外扩容价格：{{item.configStr.amountStep/100}}元/{{item.configStr.personStep}}人/年
                  </p>
                </div>
              </div>
            </span>

          </checkbox>
        </checkbox-group>
      </div>
    </div>

    <div class="exclusive-content-item" style="padding-bottom: 10px;">
      <span class="title">扩容至</span>
      <div class="align-items-center">
             <span class="button-input">
               <input type="button" class="button-minus" value="-" @click="buyNumberClick(false)">
               <input type="text" class="button-value"
                      v-model="buyPerson.value"
                      @keyup="buyPersonUp"
                      @blur="buyPersonBlur($event,countPriceFun)"/>
               <input type="button" class="button-add" value="+" @click="buyNumberClick(true)"/>
             </span>
        <span class="bug-person">人</span>
        <div class="tips">
          <p >提示：应用可见范围的人数超出购买人数时，该应用的尊享功能将无法使用</p>
          <div class="align-items-center"
            v-if="corpId.agentCount && corpId.check">当前企业可见范围最大的应用：
            {{corpId.agentCount.agentName}}
            <span class="span">{{corpId.agentCount.personCount}}</span> 人
            <div class="question-mark"
                @mouseover="showAgentCount = true"
                @mouseout="mouseOutQuestion('showAgentCount')">
                    <i>!</i>
                    <div class="tip-info-box top" :class="{ active: showAgentCount }" style="top: 30px;left: -13px;">
                      <div class="tip-info-content">
                        <div class="tip-text-box tip-text-box_scroll">
                              <p class="tip-text" v-for="(item,index) in corpId.agentCountList"
                              >{{item.agentName}}{{item.personCount}}人
                              </p>
                        </div>
                      </div>
                    </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="exclusive-content-item" style="padding-bottom: 73px;">
      <span class="title"></span>
      <div class="tips">
        <p>扩容的人数，仅适用于会员有效期内，当前企业的会员有效期：</p>
        <p style="width: 750px;">
          <span v-for="(item,index) in vipShowVOModuleList" :key="index">
            {{item.vipName}}
            <span class="span">({{item.endDay}})</span>剩余<span class="span">
            {{item.endDay|filterTimes}}</span>天<i v-if="index != vipShowVOModuleList.length-1">，</i>
          </span>
        </p>
      </div>
    </div>

    <qw-price
      className="active"
      @buyClick="buynowClick">
      <div class="title">
        <i>¥</i>{{priceConfig}}
        <div class="have-price"><span class="price">.{{priceRadixPoint}}</span></div>
        </div>
      <p class="default-text">价格仅计算会员有效期内的剩余时间</p>
    </qw-price>

    <div class="service-explain">
      <p class="title">购买说明</p>
      <p class="text-item">1. 购买成功后，系统会自动为您升级扩展相应的人数。</p>
      <p class="text-item">2. 申请发票可前往<span class="tip" @click="orderManagerClick">订单管理</span>提交相关信息，企微云工作人员会在7个工作日内将发票寄出。</p>
    </div>
  </div>
</template>
<script>
  import {Checkbox,CheckboxGroup} from '../../components/checkbox'
  import QwPrice from '../../components/vip/price'
  import Emitter from '../../mixins';
  //API接口
  import {
    getOrgInfo,
    getOrgAgentUserCount,
    getOrgViprespectDetail,
    estimateMulitPrice
  } from "../../api/vip";

  import baseURL from '@/assets/js/baseURL_config';

  export default {
    name:'ExpansionBuy',
    mixins: [Emitter],
    components:{
      Checkbox,
      CheckboxGroup,
      QwPrice,
    },
    data() {
      return {
        //购买人数
        buyPerson:{
          //区间段
          section: 10,
          //最小扩容值
          minNumber: 10,
          //当前通讯录人数
          currentNumber: 0,
          //上次选择的人数
          oldNumber: 0,
          //当前选择的人数
          value: 0
        },
        vipShowVOModuleModel:[],
        vipShowVOModuleList: [],
        //显示疑问说明
        showQuestionText: false,
        price: 0 ,

      }
    },
    filters:{
      //剩余时间
      filterTimes(endDate){
        let startDate = new Date().Format("yyyy-MM-dd")
        let startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();
        let endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();
        let dates = Math.abs((startTime - endTime))/(1000*60*60*24);
        return dates + 1;
      },
    },
    //人数区间段
    //最低购买人数
    watch:{
      'vipShowVOModuleModel':function () {
        this.gettingMinNumber()
      }
    },
    mounted(){
      //获取corpId
      this.getOrgInfoFun()
    },
    methods: {
      //获取corpId
      getOrgInfoFun(){
        getOrgInfo({},(result) => {
          if(result.code=='0'){
            let data = result.data
            this.corpId.value = data.corpId
            this.corpId.orgName = data.orgName

            //记录当前企业的人数
            this.buyPerson.currentNumber = data.userMemberNum;
            //初始化购买人数
            this.gettingMinNumber()
             this.initBuyPersonFun()
            //查询当前企业的应用最大人数
            this.getOrgAgentUserCountFun()
          }

          //查询模块
          this.getOrgViprespectDetail()
        })
      },
      //查询模块
      getOrgViprespectDetail(){
        getOrgViprespectDetail({corpId:this.corpId.value},(result) => {
          let vipShowVOList = result.data.vipShowVOList
          if(!vipShowVOList || (vipShowVOList && !vipShowVOList.length)){
            dataBase.loading = false
            dataBase.top_alert('暂无可扩容人数的套餐', false, 3000);
            return
          }
          //清空套餐列表数据
          this.vipShowVOModuleList.length = 0
          this.vipShowVOModuleModel.length = 0
          vipShowVOList.forEach((item)=> {
            if(item.vipCode != 'checkout'){
              this.vipShowVOModuleList.push(item)
            }
          })
          //初始化购买人数
          this.initBuyPersonFun()
          dataBase.loading = false
        })
      },
      //选择套餐，单选
      selectPackage(val,event){
        if(val){
          let obj = event.target._value
          this.vipShowVOModuleModel.length  = 0
          this.vipShowVOModuleModel.push(obj)
        }
        //估算价格
        this.countPriceFun()
      },
      //估算价格参数配置
      estimateMulitPriceFun(){
        let params = {corpId:this.corpId.value, services:[
          {
            serviceId: "viprespectPerson",
            priceCode: "viprespectPerson",
            buyNum: 1,
            extParam: ''
          }
        ]}
        let extParam = 'ifCodes='
        this.vipShowVOModuleModel.forEach((item) => {
          extParam += item.vipCode + '|' + this.buyPerson.value + ','
        })
        extParam = extParam.substring(0, extParam.lastIndexOf(","));
        params.services[0].extParam = extParam

        return params
      },
      //计算最低扩容人数
      gettingMinNumber(){
        let min = 10 ,section = 10;
        if(this.vipShowVOModuleModel.length){
          this.vipShowVOModuleModel.forEach((item) => {
            let basePerson = item.configStr.basePerson;
            let personStep = item.configStr.personStep;
            if (basePerson > min) {
              min = basePerson
            }
            if(personStep > section){
              section = personStep
            }
          })
        }

        if(min < this.buyPerson.currentNumber){
          min = this.buyPerson.currentNumber
        }
        this.buyPerson.section = parseInt(section)
        this.buyPerson.minNumber = this.resetBuyPerson(parseInt(min))

        //当前购买人数低于最低人数，重新赋值
        this.buyPerson.value = this.resetBuyPerson(Math.max(this.buyPerson.value,parseInt(min)))

      },
      //估算价格
      countPriceFun(){

        //还在计算价格中

        if(this.gettingRequesting){
          return
        }

        if(!this.corpId.value || !this.corpId.check){
          this.price = 0
          return
        }

        let params = this.estimateMulitPriceFun()

        if(this.vipShowVOModuleModel.length && params.services.length){
          estimateMulitPrice(params,(result) => {
            let order = result.data.order
            this.price = order.tradeAmount
            this.gettingRequesting = false
          })
        }else{
          this.price = 0
        }
      },
      //立即购买
      buynowClick(){
        if(!this.corpId.value){
          dataBase.top_alert('企业ID不能为空', false, 3000);
          return
        }
        if(!this.corpId.check){
          dataBase.top_alert('企业ID不正确', false, 3000);
          return
        }
        if(!this.vipShowVOModuleModel.length){
          dataBase.top_alert('请选择模块', false, 3000);
          return
        }
        if(!this.price){
          dataBase.top_alert('订单金额为0元', false, 3000);
          return
        }

        let params = this.estimateMulitPriceFun()
        localStorage.setItem('companysrv_shopping_cart', JSON.stringify(params));

        document.location.href =
          `${baseURL}/qiweipublicity/companysrv/order/order_mulit_confirm.jsp?serviceId=viprespectPerson&corpId=${this.corpId.value}`

      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'exclusive.scss';
</style>

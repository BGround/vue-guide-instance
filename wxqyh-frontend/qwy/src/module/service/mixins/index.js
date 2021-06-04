
import baseURL from '@/assets/js/baseURL_config';
import {formatMoneyMethod} from '../components/vip/exclusive'
//API接口
import {
  getOrgAgentUserCount,
} from "../api/vip";

export default {
  data(){
    return{
      corpId:{
        //corpId
        value:'',
        //企业名称
        orgName: '',
        //最大应用
        agentCount: null,
        //应用人数
        agentCountList: [],
        check:true,
        //聚焦中
        focus: false
      },
      //显示全部应用人数列表
      showAgentCount: false
    }
  },
  computed:{
    //优惠价格
    priceConfig(){
      return formatMoneyMethod(this.price,2,100).split('.')[0]
    },
    priceRadixPoint(){
      return formatMoneyMethod(this.price,2,100).split('.')[1]
    },
    priceBackGroup(){
      return this.buyPerson.value >= 500? 'active' : ''
    }
  },
  methods: {
    mouseOutQuestion(key){
      let self = this
      setTimeout(()=>{
        self[key] = false
      },200)
    },
    mouseOverFun(ev){
      if(ev.target && ev.target.children[0]){
        ev.target.children[0].classList.add("active")
      }
    },
    mouseOutFun(ev){
      if(ev.target && ev.target.children[0]){
        ev.target.children[0].classList.remove("active")
      }
    },
    handleFocusCorpId(ev){
      this.corpId.focus = true
    },
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    //初始化最低购买人数
    initBuyPersonFun(){
      this.buyPerson.value = this.buyPerson.currentNumber < this.buyPerson.minNumber?
        this.buyPerson.minNumber : this.buyPerson.minNumber +
        Math.ceil((this.buyPerson.currentNumber - this.buyPerson.minNumber) /
          this.buyPerson.section) * this.buyPerson.section;

      //初始化当前购买的旧人数
      this.buyPerson.oldNumber = this.buyPerson.value
    },
    //校验输入框值类型，返回数字
    buyPersonUp(ev){
      let value = ev.target.value
      value = value.length==1?
        value.replace(/[^1-9]/g,''):value.replace(/\D/g,'');
      this.countbuyPerson(ev,parseInt(value))
      return parseInt(value)
    },
    //赋值购买人数
    countbuyPerson(ev,value){
      if(isNaN(value)){
        value = ''
      }
      ev.target.value = value
      this.buyPerson.value = value
    },
    //重置购买人数倍数
    resetBuyPerson(value){
      if(isNaN(value)){
        value = this.buyPerson.minNumber
      }
      if(value % this.buyPerson.section != 0){
        value = (parseInt(value/this.buyPerson.section)+1)*this.buyPerson.section;
      }
      if((value - this.buyPerson.section) < this.buyPerson.minNumber){
        value = this.buyPerson.minNumber
      }
      return parseInt(value)
    },
    //失焦校验购买人数
    buyPersonBlur(ev,callBack){
      let value = this.buyPersonUp(ev)
      this.countbuyPerson(ev,this.resetBuyPerson(value))
      //需要计算价格回调
      if(callBack){
        callBack()
      }
    },
    //添加或减少购买人数
    buyNumberClick(val){
      if(val){
        this.buyPerson.value += this.buyPerson.section;
      }else{
        if((this.buyPerson.value - this.buyPerson.section) >= this.buyPerson.minNumber){
          this.buyPerson.value -= this.buyPerson.section
        }
      }

      //记录当前购买的旧人数
      if(this.buyPerson.oldNumber != this.buyPerson.value){
        //估算价格
        this.countPriceFun()
        this.buyPerson.oldNumber = this.buyPerson.value
      }

    },
    //验证corpId
    corpIdCheck(callBack){
      if(this.corpId.value){
        getOrgAgentUserCount({corpId:this.corpId.value},(result) => {

          if(result.code=='0'){
            let data = result.data
            if(data.orgName){
              this.corpId.check = true
              this.corpId.focus = false
              this.corpId.orgName = data.orgName
            }
            //查询当前企业的应用最大人数
            this.getOrgAgentUserCountFun(data)
            callBack? callBack() : ''

          } else{
            this.corpId.check = false
            this.corpId.orgName = ''
            dataBase.top_alert(result.desc, false, 3000);
          }
          //估算价格
          this.countPriceFun()
        })
      }else{
        this.corpId.check = false
        this.corpId.orgName = ''
      }
    },
    //查询机构的应用人数
    getOrgAgentUserCountFun(data){
      if(data){
        this.settingOrgAgentUserCount(data)
      }else{
        getOrgAgentUserCount({corpId:this.corpId.value},(result) => {
          this.settingOrgAgentUserCount(result.data)
        })
      }

    },
    settingOrgAgentUserCount(data){
      let agentCountMap = data.agentCountMap
      if(!agentCountMap){
        return
      }
      let max = 0
      let key = ''
      this.corpId.agentCountList.length = 0;
      Object.keys(agentCountMap).forEach((item) => {
        this.corpId.agentCountList.push(agentCountMap[item]);
        if (agentCountMap[item].personCount > max) {
          max = agentCountMap[item];
          key = item
        }
      })
      this.corpId.agentCount = agentCountMap[key]
      this.buyPerson.currentNumber = agentCountMap[key].personCount
    },
    //订单管理
    orderManagerClick(){
      document.location.href = `${baseURL}/manager/companysrv/order_list.jsp`
    }
  }
};

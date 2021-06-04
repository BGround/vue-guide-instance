<template>
  <div class="wrapper">
    <!-- 加班类型 -->
    <div class="leave-overwork-change-template leave-overwork-list-li">
      <div class="overwork-left">加班类型</div>
      <div class="overwork-right flexItem">
        <select v-model="selectedId" @change="changeTemplate" :class="['overwork-title-select','black-color',typeError]" ref="select">
          <option value="" class="option_color">请选择加班类型</option>
          <option v-for="item of dataDetailMsg.templateType" :value="item.id" :key="item.id" class="option_color">{{item.name}}</option>
        </select>
        <div class="overwork-launch_icon arrow-icon"></div>
      </div>
    </div>
    <!-- 加班开始结束时间 -->
    <date-time-field :isOverWork='true' :isNeed="true" :type="dateType" :endTitle="'结束时间'" @change="getSelectTime" :dataDetailMsg="lastTime"></date-time-field>
    <!-- 加班时长 -->
    <div class="leave-overwork-worktime leave-overwork-list-li">
      <div class="overwork-left">加班时长</div>
      <div class="overwork-right gray-color">
        <span> <span class="black-color">{{addObj.askHour||0}}</span> 小时 &nbsp;合&nbsp;&nbsp;<span class="black-color">{{addObj.askDay||0}}</span> 天</span>
      </div>
    </div>
    <!-- 加班时长提示 -->
    <div class="overwork-worktime-tips" :class="{'mb8':!isMakeUp}">
      <article>
        <p>{{'1天='+workHour+'小时,该时长管理员可在'}}</p>
        <p>后台“设置-通用设置-工作时间”进行设置</p>
      </article>
    </div>
    <!-- 加班补偿方式 -->
    <div class="leave-overwork-list-li leave-overwork-rest" v-show="isMakeUp">
      <div class="overwork-left">补偿方式(调休)</div>
      <div class="overwork-right limit_input">
        {{relaxName}}
        <div class="overwork-launch_icon"></div>
      </div>
    </div>

    <div class="overwork-reason">
      <p>申请理由<span class="red-color">*</span></p>
      <div contenteditable="true" class="overwork-reason-content">
        <textarea maxlength="2048" @input="updateValue($event.target.value)" cols="30" rows="3" ref="input" placeholder="请输入加班申请理由" 
        :class="['item_content maxHeight',contentError]" v-model="addObj.content"></textarea>
        <p class="textarea_counter" v-show="contentNum>0">{{contentNum+'/'+2048}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import DateTimeField from "../components/DateTimeField";
import { getTemplateById,getDefaultWorkTime } from "../api/getData";
export default {
  name: "overWork",
  components: {
    DateTimeField
  },
  props: {
    dataDetailMsg: {
      type: Object,
      default: function() {
        return {};
      }
    },
    resourceDate: {
      type: Array,
      default: function() {
        return new Array(2)
      }
    },
    contentErrorTip: '',
    typeErrorTip: '',
    titleErrorTip: ''
  },
  data() {
    return {
      selectedId: "", // 选择的模板ID
      isMakeUp: false, // 是否补偿
      relaxName: "", //补偿的调休类型
      compensateType: "", // 补偿方式
      workHour: '', // 工作时长： 建议在addApply页面传入
      templateTypeMap: null, // 加班类型
      addObj: {
        selectedId: "", //选择的模板ID
        content: "",
        askHour: "",
        askDay: ""
      },
      dateType: '0', // 0 无限制 1 最小单位小时  2 最小单位天数
      returnDate: {
        startDate: "",
        endDate: ""
      },
      lastTime: new Array(2),
      typeError: '',
      contentError: '',
    };
  },
  computed: {
    contentNum() {
      // 内容字数
      this.$emit('overWorkContent',"add_nav",this.addObj.content,'content')
      return this.addObj.content.length;
    }
  },
  watch: {
    // 切换开始或结束时间 计算加班时长
    returnDate: {
      handler: function(val) {
        this.computeApplyHours();
      },
      deep: true
    },
    resourceDate:{
      handler: function(newVal) {
        this.lastTime = newVal? newVal:new Array(2)
      },
      deep: true
    },
    dataDetailMsg: {
      handler:  function(newVal,oldVal){
        this.selectedId = newVal.templateTypeId
        this.computeApplyHours()
        this.templateTypeMap = this.arrayToObj(newVal.templateType);
        if(this.$route.query.askId&&this.selectedId&&newVal.content.hasOwnProperty('text')){
          this.addObj.content = newVal.content.text
          this.confirmComType()
        }
      },
      deep: true
    },
    typeErrorTip: function(newVal){
      if(newVal){
        this.typeError='font_color_red'
      }else{
        this.typeError=''
      }
    },
    contentErrorTip: function(newVal) {
      if(newVal){
        this.contentError='contentError'
      }else{
        this.contentError=''
      }
    }
  },
  created() {
    getDefaultWorkTime((res)=>{
      this.workHour =  res.tbQyWorkhourPO.workHour
    })
  },
  mounted() {
     // 读取缓存
     if(!this.$route.query.id){
       this.getAutoCache()
     }
  },
  beforeDestroy() {
    let name = `ask_add_${_.userId}`
    let cacheData = {
      content: this.addObj.content,
      templateTypeId: this.selectedId?this.selectedId:'',
      templateName: this.templateTypeId?this.templateTypeMap[this.selectedId].name:'',
      title: this.templateTypeId?this.templateTypeMap[this.selectedId].title:'',
      templateType: this.dataDetailMsg.templateType,
      returnDate: this.returnDate,
      dateType: this.dateType,
      workHour: this.workHour
    }
    localStorage.setItem(name,JSON.stringify(cacheData))
  },
  methods: {
    // 切换模板
    changeTemplate() {
      this.returnDate.startDate=''
      this.returnDate.endDate=''
      this.lastTime = new Array(2)
      this.$refs.select.style.color = '#0A1735'
      this.isMakeUp = false;
      // 获取加班类型对象
      if (!this.templateTypeMap||Object.keys(this.templateTypeMap).length<=0) {
        this.templateTypeMap = this.arrayToObj(this.dataDetailMsg.templateType);
      }
      //将此时模板信息传给父组件
      this.$emit("change",this.templateTypeMap[this.selectedId])
      // 获取选中的加班信息
      if (this.selectedId) {
        let itemTem = this.templateTypeMap[this.selectedId];
        this.typeError = ''
        if(!this.addObj.content){
          this.addObj.content = itemTem.content
          this.confirmComType()
        }else{
          let btn =
          {
            primaryBtn: {name: '替换',callBack:
            ()=>{
              this.addObj.content = itemTem.content || ""
              this.confirmComType()
              }
            },
            defaultBtn: {name: '不替换',callBack: this.confirmComType}
          }
          _.alert("提示", '是否用[' + itemTem.name + ']的模板内容替换正文内容？', btn);
        }
      }
      // 如果上次为加班天数,切换到小时或无限制后将起始结束时间都添加小时和分钟
      this.computeApplyHours();
    },
    // 根据类型是否调休并渲染
    confirmComType() {
      if(this.dataDetailMsg.templateType){
        if (!this.templateTypeMap||Object.keys(this.templateTypeMap).length<=0) {
          this.templateTypeMap = this.arrayToObj(this.dataDetailMsg.templateType);
        }
        let item = this.templateTypeMap[this.selectedId];
        this.compensateType = item.compensateType;
        this.dateType = String(item.minUnit); // 根据“最小加班单位”显示相应的日期
        this.$emit("listenToChild", this.templateTypeMap[this.selectedId]);  
        if (item.compensateType == 1) {
          // 含有调休时长,则调取获取调休假期信息
          getTemplateById(this.selectedId, this.renderTemplate);
        }
      }
    },
    renderTemplate(data) {
      this.isMakeUp = data.targetTemplate ? true : false;
      if (this.isMakeUp) {
        this.relaxName = data.targetTemplate.name;
      }
    },
    // 获取缓存
    getAutoCache() {
      let name = `ask_add_${_.userId}`
      let cacheData = JSON.parse(localStorage.getItem(name))
      if(cacheData){
        this.templateTypeMap = this.arrayToObj(this.dataDetailMsg.templateType)
        this.addObj.content = cacheData.content
        this.selectedId = cacheData.templateTypeId?cacheData.templateTypeId:''
        this.lastTime = [cacheData.returnDate?cacheData.returnDate.startDate:'',
                          cacheData.returnDate?cacheData.returnDate.endDate:'']
        this.returnDate = Object.assign({},cacheData.returnDate)
        this.dateType = cacheData.dateType
        this.workHour = cacheData.workHour
        if(this.lastTime[0]&&this.lastTime[1]){
          this.computeApplyHours()
        }
      }
    },
    // 数组转换键值对
    arrayToObj(arr) {
      let obj = {};
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        obj[item.id] = item;
      }
      return obj;
    },
    // 监听textarea控件
    updateValue(value) {
      if (value.length <= 0) {
        this.$refs.input.value = value.substring(0, this.maxLength);
      }
      var len = 0;
      for (var i = 0; i < value.length; i++) {
        var a = value.charAt(i);
        if (a.match(/[^\x00-\xff]/gi) != null) {
          len += 2;
        } else {
          len += 1;
        }
      }
      if (len / 32 >= 3) {
        this.$refs.input.rows = len / 32 > 5 ? 5 : len / 32;
      } else {
        this.$refs.input.rows = 3;
      }
    },
    // 接收时间控件所选择的时间
    getSelectTime(startDate, endDate) {
      this.returnDate.startDate = startDate;
      this.returnDate.endDate = endDate;
    },
    // 根据起始时间计算加班时长
    computeApplyHours() {
      // 当开始和结束时间都有数据时才开始计算  小于0时默认时间为0
      if (this.returnDate.startDate && this.returnDate.endDate) {
          var reducedHour,
              reducedDay ,
              reducedTime =
                new Date(this.returnDate.endDate.replace(/-/g,'/')).getTime() -
                new Date(this.returnDate.startDate.replace(/-/g,'/')).getTime()
          if(reducedTime>=0){
            // 根据相差时间计算加班申请小时数
            reducedHour = String(reducedTime / 1000 / 3600);
            // 根据相差时间计算加班申请天数
            reducedDay = String(reducedTime / 1000 / 3600 / 24 +1);
          }else{
            reducedHour = 0
            reducedDay = 0
          }
        // 不同情况保留不同位数  0 无限制 1 小时数 2 天数
         var computedBit
        if (this.dateType == 0) {
          let saveBit =
            String(reducedHour).indexOf(".") == "-1" ? 5 : reducedHour.indexOf(".") + 2;
          let rideTime = Math.pow(10,saveBit-1)
          this.addObj.askHour = String(Math.round(reducedHour*rideTime)/rideTime).substring(0, saveBit);
          // 处理完数据保留位数
          if( (String(this.addObj.askHour/this.workHour)).indexOf('.') ==-1){
            computedBit = (String(this.addObj.askHour/this.workHour)).length
          }else{
            computedBit = (String(this.addObj.askHour/this.workHour)).indexOf('.')+3
          }
          this.addObj.askDay = (String(Math.round(this.addObj.askHour/this.workHour*100)/100)+'00').slice(0,computedBit)
        } else if (this.dateType == 1) {
          this.addObj.askHour = parseInt(reducedHour);
           if( (String(this.addObj.askHour/this.workHour)).indexOf('.') ==-1){
            computedBit = (String(this.addObj.askHour/this.workHour)).length
          }else{
            computedBit = (String(this.addObj.askHour/this.workHour)).indexOf('.')+3
          }
          this.addObj.askDay = (String(Math.round(this.addObj.askHour/this.workHour*100)/100)+'00').slice(0,computedBit)
        } else {
          this.addObj.askDay = parseInt(reducedDay);
          this.addObj.askHour = this.addObj.askDay * this.workHour
        }
      }else{
        this.addObj.askDay = 0
        this.addObj.askHour = 0
      }
      // 将起始时间与申请加班时长传入newApply组件中
      this.$emit("setDate", 'date', {
        startDate: this.returnDate.startDate,
        endDate: this.returnDate.endDate
      })
      //  askDay: "1", // 请假天数   '1'
      // ext1: "0", // 请假小时数 '0.55'*工作时长
      // sumAskDays: "0", // 请假总天数 '1.55'
      // sumAskHours: "0", // 请假总小时 '1.55*每日工作时长'
      this.$emit("setApplyTime", {
        'sumAskDays': this.addObj.askDay,
        'sumAskHours': this.addObj.askHour,
        'askDay': parseInt(this.addObj.askDay),
        'ext1': this.dateType==2?0:this.addObj.askHour
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.black-color {
  color: #0a1735;
}
.gray-color {
  color: #b2b9c8;
}
.leave-overwork-change-template {
  .overwork-title-select {
    border: none;
    margin-right: 1px;
    text-align: right;
    direction: rtl;
    text-overflow: ellipsis;
    overflow: hidden !important;
    white-space: nowrap;
    flex: 1;
    font-size: 15px;
    background-color: #fff;
    color: #B2B9C8;
  }
}
.leave-overwork-list-li {
  display: flex;
  height: 46px;
  justify-content: space-between;
  font-family: "PingFangSC-Regular", "Microsoft YaHei";
  font-weight: 400;
  font-size: 15px;
  line-height: 46px;
  background: #fff;
  margin-bottom: -15px;
  .overwork-left {
    display: inline-block;
    color: rgba(122, 124, 128, 1);
    margin-left: 15px;
    min-width: 100px;
  }
  .overwork-right {
    margin-right: 14px;
    text-align: right;
    width: 54%;
    .overwork-hours {
      width: 22px;
      text-align: right;
      color: #0a1735;
    }
    .overwork-days {
      width: 22px;
      text-align: right;
      color: #0a1735;
    }
    select{
      width: 100%;
    }
  }
}
.leave-overwork-rest.leave-overwork-list-li {
  margin-bottom: 8px;
}
.overwork-launch_icon {
  display: inline-block;
  width: 15px;
  height: 12px;
  vertical-align: middle;
  background: url("../../../assets/images/ic_arrow.png") no-repeat;
  background-size: 7px;
}
.overwork-worktime-tips {
  height: 64px;
  background: #fff;
  font-family: "PingFangSC-Regular", "Microsoft YaHei";
  font-weight: 400;
  font-size: 12px;
  color: rgba(178, 185, 200, 1);
  article {
    float: right;
    width: 227px;
    height: 34px;
    text-align: right;
    margin-right: 15px;
    margin-top: 12px;
  }
}
.limit_input {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 30px;
}
// 申请理由
.overwork-reason {
  // height: 95px;
  background: #fff;
  padding: 15px 15px 0px 15px;
  p {
    font-size: 17px;
    margin-bottom: 15px;
  }
  .overwork-reason-content {
    outline: none;
    overflow: hidden;
  }
  .item_content {
    width: 100%;
    font-size: 15px;
    color: #333;
    border: none;
    min-height: 50px;
    box-sizing: border-box;
  }
  .maxHeight {
    max-height: 100px;
  }
  .red-color {
    color: #ff1515;
    padding-left: 5px;
  }
  .textarea_counter {
    color: #b2b2b2;
    text-align: right;
    vertical-align: top;
    font-size: 14px;
    line-height: 22px;
  }
}
.flexItem {
  display: flex;
}
.arrow-icon {
  width: 19px;
  height: 21px;
  background-size: 7px;
  position: relative;
  top: 14px;
  direction: rtl;
  background-position: center;
}
.overwork-title-select.font_color_red.overwork-title-select{
  color:#ff574d;
}
.option_color{
  color: #B2B9C8 !important;
}
.contentError::-webkit-input-placeholder{
    color:#FF574D;
}
.contentError:-moz-placeholder{
  color:#FF574D;
}
.contentError::-moz-placeholder{
  color:#FF574D;
}
.contentError:-ms-input-placeholder{
  color:#FF574D;
}
.mb8{
  margin-bottom: 8px;
}
.wrapper /deep/ .item-input{
  color: #0A1735;
  font-size: 15px;
}
.wrapper /deep/ .item-input::input-placeholder{
  color: #B2B9C8;
}
.wrapper /deep/ .item-input::-webkit-input-placeholder{
  color: #B2B9C8;
}
.wrapper /deep/ .item-input::-moz-input-placeholder{
  color: #B2B9C8;
}
.wrapper /deep/ .item-input::-ms-input-placeholder{
  color: #B2B9C8;
}
.wrapper{
  margin-top: 15px;
}
</style>
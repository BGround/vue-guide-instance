<template>
     <div class="qwui-title_detaildata crm_operate_item" v-if="item.status">
      <div
          class="qwui-title_common_text qwui-border_bottom qwui-type"
          :class="{'qwui-title_address': item.showIcon}" v-if="item.divType!=9"><!-- 9:详情页-->
          <div class="qwui-item_mask" v-if="item.showMask ||item.type=='dateTime'|| false" @click="clickItem(item.clickEvent)"></div>
          <h4 class="qwui-title_text">
            {{item.optionName}}
            <span class="qwui-title_tip" v-if="item.isMust == 1">*</span>
          </h4>

          <!-- select -->
          <div class="qwui-title_inner_f_item qwui-flexItem" v-if="item.type === 'select'">
            <select class="qwui-select" :value="value"  @input="handleInput(item.changeCallBack || '',$event)">
              <option selected="selected" value="">请选择</option>
              <option v-for="optionItem in item.list" :key="optionItem.id" :value="optionItem.id">
                {{optionItem.name}}
              </option>
            </select>
            <span class="qwui-click_icon qwui-click_icon_type_right"></span>
          </div>
          <!-- input -->
            <div class="qwui-title_inner_f_item qwui-flexItem" v-if="item.type === 'input'">
              <div class="qwui-input" :style="item.ext1 === '3'? {display: 'flex'}: ''">
                <input
                    type="text"
                    :name="item.key"
                    v-storage="routerName"
                    :value="value"
                    :readonly="item.readonly"
                    @input="handleInput(item.changeCallBack || '',$event)"
                    :class="itemClass"
                    :maxlength="item.maxLength"
                    :placeholder="item.placeholder"
                    @blur="clickItem(item.clickEvent)">
                <span class="qwui-click_icon qwui-click_icon_type_right" v-if="item.showArrow || false"></span>
                <span class="qwui-address_icon" v-if="item.showIcon || false" @click="iconEvent(item.iconEvent)"></span>
                <p class="qwui-title_counter" v-show="titleNum > 0" v-if="item.showNumTip || false">
                  {{titleNum}}/{{item.maxLength}}
                </p><br>
                <span v-if="telRepeat" class="error">{{item.errorMsg}}</span>
                <span v-if="item.ext1 === '3'" class="percentage">%</span>
              </div>

            </div>
            <slot v-if="item.isSlot || false"></slot>


            <!-- phone -->
            <div class="qwui-title_inner_f_item qwui-flexItem" v-if="item.type === 'phone'">
              <div class="qwui-input">
                <input
                  type="number"
                  :name="item.key"
                  v-storage="routerName"
                  :value="value"
                  @input="handleInput(item.changeCallBack || '',$event)"
                  :class="item.isSlot || item.showIcon ? 'item_title' : 'item_titleReal'"
                  :maxlength="item.maxLength"
                  :placeholder="item.placeholder">
              </div>
            </div>


            <!-- add -->
            <div class="qwui-title_inner_f_item qwui-flexItem" v-if="item.type === 'add'">
              <div class="qwui-add">
                <div class="qwui-add_content" v-for="(item,idx) in this.addItems" :key="idx">
                  {{item.message}}
                  <span class="delete" @click="del(idx)"></span>
                </div>
                <div class="quui-add_button" @click="clickItem(item.clickEvent)">
                  +添加
                </div>
              </div>
            </div>


          <!-- textarea -->
          <div class="qwui-tape_box" v-if="item.type === 'textarea'">
            <!--  PC端富文本  -->
            <div v-if="item.isUseUeditor">
                <UE :defaultMsg='defaultMsg' :config='config' :agentCode='agentCodeQuery' ref="ue"></UE>
            </div>

            <div v-else>
              <textarea
                class="item_content"
                :name="item.key"
                v-computed-textarea
                v-storage="routerName"
                :value="value"
                :maxLength="item.maxLength"
                @input="updateValue($event.target.value)"
                @blur="clickItem(item.clickEvent)"
                ref="input" cols="5" rows="1"
                :placeholder="item.placeholder">
              </textarea>
              <p :class="textareaColor" v-show="item.value">
                {{item.value|getLength}}/{{item.maxLength}}
              </p>
            </div>
            <div class="more_function" :class="{'active': item.isUseUeditor}" v-show="item.moreFunctions && item.moreFunctions.length>0">
              <div class="icon-circular" @click="switchUse" v-if="isPC">
                <i class="icon-circular-ueditor" :class="{'active': item.isUseUeditor}"></i>
              </div>
              <div class="icon-circular" @click="moreFunction(item)" v-for="item in templateObj.moreFunctions" :key="item.id">
                <i class="icon-circular-ic" ></i>
              </div>
              <div class="qwui-tape" :class="{'qwui-tape_play': isTaping}" @click="clickTape()"></div>
            </div>
          </div>

          <!-- 日期 -->
          <div class="qwui-flexItem qwui-title_inner_f_item"  v-if="item.type === 'dateTime'">
              <div class="qwui-input">
                <input
                    type="text"
                    :value="minuteListValueS"
                    :readonly="true"
                    :placeholder="item.placeholder||'请输入日期'"
                    class="item_title"
                   >
                <span class="qwui-click_icon qwui-click_icon_type_right" ></span>
                <time-picker  :min-year=1918
                              :max-year=2050
                              :show.sync="showTimePicker"
                              :defaultDate="defaultDate"
                              @confirm="change"
                              :dateOnly="format!=='YYYY-MM-DD HH:mm'">
                              </time-picker>
              </div>

          </div>
          <!-- <group class="qwui-flexItem" v-if="item.type === 'dateTime'">
            <datetime
                v-model="minuteListValueS"
                :clear-text="$t('i18n.today')"
                :format="format"
                :min-year=1918
                :max-year=2050
                @on-change="change"
                year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分"
                :confirm-text="$t('i18n.sure')" :cancel-text="$t('i18n.cancel')">
            </datetime>
          </group> -->
       </div>
       <!--详情-->
       <div class="qwui-title_common_text qwui-border_bottom" v-if="item.divType === 9">
         <h4 class="qwui-title_text">
           {{item.optionName}}
         </h4>
         <div class="qwui-title_inner_f_item qwui-flexItem" v-if="item.isWrap==true || item.type==2"> <!--isWrap==true，多行文本换行-->
           <pre class="item_title item_title_remark">{{item.value}}</pre>
         </div>
         <div class="qwui-title_inner_f_item qwui-flexItem" v-if="item.optionName=='网址'">
           <div class="item_title" @click="openLink(item.value)">{{item.value}}</div>
         </div>
         <div class="qwui-title_inner_f_item qwui-flexItem" :class="{'qwui-address':item.optionName=='地址'}" v-if="item.isWrap!=true && item.type!=2 && item.optionName!='网址'  && !item.numberType">
           <div class="item_title" :class="{item_title_address:item.optionName=='地址'}">{{item.value}}</div>
           <span v-if="item.optionName=='地址'" class="qwui-address_icon" @click="openMap"></span>
           <a :href="'tel:'+item.value" v-if="item.value!='' && (item.optionName=='手机' || item.optionName=='联系电话')" class="qwui-phone"></a>
           <span v-if="showWaiBuContactBtn==true && item.optionName=='联系人姓名'" class="qwui-waibuContact" @click="createQyWxChat"></span>
         </div>
         <!-- 新增数值类型 根据numberType 判断 -->
         <div class="qwui-title_inner_f_item qwui-flexItem" :style="item.numberType === '3' ? { display: 'flex' } : ''" v-if="item.numberType && item.numberType !== ''">
           <div class="item_title">{{item.value}}</div>
            <span v-if="item.numberType === '3'" class="percentage">%</span>
         </div>
       </div>
     </div>
</template>
<script>
import Datetime from 'vux/src/components/datetime';
import Group from 'vux/src/components/group';
import * as timeUtil from '@/assets/js/time-util';
import { getValidClientName,getValidPhone  } from '../../api/client/getData'
import timePicker from '@/components/basicUI/qwuiPicker/time_picker.vue'
import UE from '@/components/base/editor.vue';

export default {
  name: "CrmOperateItem",
  components: {
    Datetime,
    Group,
    timePicker,
    UE
  },
   // 过滤器
  filters: {
    // 获取textarea的value长度
    getLength(value) {
      return value? value.length: '';
    }
  },
  props: {
    item:{
      type:Object
    },
    dataDetailMsg:{
      type:Object
    },
    value: {
      type: [String,Array,Number]
    },
    editTimeVal:{
      type: String,
      default: ''
    },
    birthEditTimeVal:{
      type: String,
      default: ''
    },
    telRepeatMsg:{
      type: Boolean,
      default: false
    },
    addItems:{
      type: Array,
    },
    showWaiBuContactBtn:{
      type:Boolean,
      default:false,
    }
  },
  data(){
    return {
      status: true,
      format:'YYYY-MM-DD HH:mm', // 时间格式
      minuteListValueS: '', // 时间默认值
      minuteListValueE: timeUtil.changeFormat(new Date(), 'yyyy-MM-dd') + ' 22:00',
      resetLimitDate: '',
      address: 'fhdsak',
      keyword:{
        clientName: ''
      },
      params:{
      'tbCrmClientInfoPO.phone':'',
      },
      isMust:1,
      errorShow: false,//判断用户是否存在
      telRepeat: false,//判断电话是否重复
      timeData: [],
      clientDetail: this.clientDetail,
      nav: dataBase.client.clientDetail.nav,
      isShow: true,
      height:300,
      isTaping: false,
      messageNum: 0,//输入框的字数
      templateObj:this.dataDetailMsg,
      routerName: '',
      showTimePicker:false,//时间选择弹窗
      isPC:_.isWeChat() && !_.isWeChatApp(),//true表示pc端才可以使用
      defaultMsg:'',
      config: {
          initialFrameHeight: 350,
          autoHeightEnabled:false,
          zIndex: 2,
          enableAutoSave: false,
          saveInterval: 1000,
          maximumWords:60000,
          wordCountMsg:"{#count}/60000",
          wordOverFlowMsg:"<span style='color:red;'>您输入的字符已超出6W限制，将无法提交合同！</span>",
          autoHeightEnabled:false, //禁止自动改变高度
          toolbars:[[ 'fullscreen', 'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline','forecolor', '|',  'insertorderedlist',
              'insertunorderedlist', 'fontsize', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', 'insertimage']]
      },
      agentCodeQuery:this.$route.query.agentCode
    }
  },
  created () {
    // 获取当前路由名字
    let arr = Object.keys(this.$router.history.current.query);
    // 如果是编辑页则不缓存
    this.routerName = arr.length > 0? '' : this.$router.history.current.name;
    // 判断生日是年月日，其他自定义字段的时间都是默认
    this.item.format ? this.format = this.item.format : this.format = 'YYYY-MM-DD HH:mm';
    // 判断有无默认值，默认当前时间的话就配minTime
    // this.item.minTime == '' ?
    // this.minuteListValueS = timeUtil.changeFormat(new Date(), 'yyyy-MM-dd hh:mm')
    // : '请输入日期'
    // this.$emit('listenToNowTime',this.minuteListValueS);
  },
  mounted() {
    if(this.minuteListValueS&&this.minuteListValueS != '请输入日期'){
      this.$emit('listenToDate',this.minuteListValueS)
    }
  },
  computed:{
    titleNum:function () {//标题字数
     return this.item.value.length
    },
    remarkTitleNum:function () {//备注字数
      return this.templateObj.textRemarkTitle.length
    },
    contentNum:function () {//内容字数
      return this.templateObj.content.length
    },
    itemClass: function (){ // 绑定class属性
      if(this.item.isSlot == true || this.item.showIcon){
        return 'item_title' // 右边有icon时候的类
      }else if(this.item.showArrow){
        return 'item_titleArrow' // 右边是箭头时候的类
      }else{
        return 'item_titleReal' // 其他input
      }
    },
    textareaColor: function(){
      if(this.item.value != '' && this.item.value != undefined && this.item.value.length == this.item.maxLength){
        return 'qwui-dialog_textarea_red'
      }else{
        return 'qwui-dialog_textarea_counter'
      }
    },
    defaultDate(){
      return this.minuteListValueS||new Date().Format('yyyy-MM-dd hh:mm')
    }
  },
  watch:{
    editTimeVal(newVal,oldVal){
      if(this.item.optionName != '生日' && this.item.type == 'dateTime'){
        this.minuteListValueS = newVal
      }
    },
    birthEditTimeVal(newVal,oldVal){
      if(this.item.optionName == '生日' || this.item.optionName == '拜访时间' || this.item.optionName == '结单日期' && this.item.type == 'dateTime'){
        this.minuteListValueS = newVal
      }
    },
    'templateObj.content':function (val) {
      this.$emit("content",val);
    },
    telRepeatMsg(newVal,oldVal){
      if(newVal){
        this.telRepeat = true
      }else{
        this.telRepeat = false;
      }
    },
    item: {
      handler: function (newVal) {
        if(newVal.type === 'dateTime'){
          this.minuteListValueS = newVal.value || '';
        }
        //设置富文本内容
        if(newVal.isUseUeditor){
          this.defaultMsg = newVal.value.replace(/\n/g, '<br>');
        }
      },
      deep: true
    }
  },
  methods:{
    del(idx){
      this.$emit('del',idx)
    },
    // 判断客户是否重命名
    checkClientName(val) {
      this.keyword.clientName = this.item.value;
      getValidClientName(this.keyword, (data)=> {
        data.isRepeat?this.errorShow = true:this.errorShow = false;
      })
    },

    checkPhoneValue(){
      // 判断联系电话红字出现
      if(this.item.optionName == '联系电话'){
        this.params['tbCrmClientInfoPO.phone']=this.item.value;
        return getValidPhone(this.params,(desc) => {
          desc.length>0 ? this.telRepeat = true : this.telRepeat = false;
        })
      }
    },
    // 时间改变触发
    change (value) {
      this.$emit('listenToTime',value,this.item)
      this.item.value = value;
    },

    //详情打开地图
    openMap:function(){
      this.$emit('openMap');
    },

    //详情外部联系人
    createQyWxChat:function(){
      this.$emit('createQyWxChat');
    },

    moreFunction:function(item){ //更多功能
      this.$emit("moreFunction",item);
    },

    setTitle:function () { //选择了option后自动赋值 内容 标题
      var data=null;
      if(this.templateObj.templateTypeId!=""){
        var templateList=this.templateObj.templateType;
        for (var i = 0; i < templateList.length; i++) {
          if (this.templateObj.templateTypeId== templateList[i].id) {
            this.templateObj.title=templateList[i].title?
              templateList[i].title.replace("xxx", _.personName).replace("yyyyMMdd", timeUtil.changeFormat(new Date(),"yyyyMMdd")):
              this.templateObj.title;
            data=templateList[i];
            if(this.templateObj.content && templateList[i].content){
              this.alertReplace(templateList[i]);
            }else{
              templateList[i].content? this.templateObj.content=templateList[i].content:"";
            }
            break;
          }
        }
      }
      this.$emit("listenToChild",data);
    },

    clickTape(){
      this.isTaping = !this.isTaping;
    },

    updateValue:function (value) { //监听textarea控件
      if(value.length<=0){
        this.$refs.input.value=value.substring(0,this.maxLength);
      }
      var len = 0;
      for (var i = 0; i < value.length; i++) {
        var a = value.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {
          len += 2;
        }
        else {
          len += 1;
        }
      }
      if(len/32>=3){
        this.$refs.input.rows=(len/32)>20? 20:len/32;
      }else{
        this.$refs.input.rows=3;
      }
      this.$emit('input',value);
    },

    // input事件
    handleInput (callback,e) {
        this.$emit('input',e.target.value);
        if(callback){
          callback(e.target.value, this.item);
        }
    },

    // 点击箭头项
    clickItem (clickEvent) {
        // 存在回调函数才执行
        if(clickEvent){
            clickEvent();
        }else if(this.item.type=='dateTime'){
          this.showTimePicker = true;
        }
    },

    // 点击icon
    iconEvent (iconEvent) {
        // 存在回调函数才执行
        if(iconEvent){
            iconEvent();
        }
    },

  //  打开网址链接
    openLink:function(website){
      if (website != "" && website != null) {
        website = website.substr(0, 7).toLowerCase() == "http://" ? website : "http://" + website;
        window.open(website);
      }
    },

  //切换富文本与纯文本
    switchUse:function () {
      var btn={
        primaryBtn:{name:'切换', callBack:this.switchStatus},
        defaultBtn:{name:"取消", callBack:null},
      };
      if(!this.item.isUseUeditor){
        _.alert('','富文本模式发布的合同不支持在手机端编辑，是否切换？', btn)
      }else{
        if(this.$refs.ue.getUEContent()!= ''){
          _.alert('','纯文本模式将清除当前内容的格式，是否切换？', btn)
        } else {
          this.switchStatus();
        }
      }
    },
    //富文本切换纯文本，无数据切换
    switchStatus:function () {
      if(this.item.isUseUeditor){ //富文本切换纯文本
        this.item.value = this.$refs.ue.getUEContentTxt()
      }else{ //纯文本切换富文本
        this.defaultMsg = this.item.value.replace(/\n/g, '<br>');
      }
      this.$emit('changeUeditor', !this.item.isUseUeditor);
    },
    //获取富文本编辑器内容
    getUEContent() {
      return this.item.isUseUeditor?this.$refs.ue.getUEContent():false;
    },
    // 获取是否超限
    getUEContentIsOver() {
      return this.$refs.ue.getUEContentIsOver()
    },
  },

}

</script>

<style lang="scss" scoped>
  .pr60{
    padding-right: 60px;
  }
  .error{
    line-height: 20px;
    min-height: 20px;
    font-size:13px;
    color:rgba(255,21,21,1);
  }
  .qwui-select{
    width:100%;
    background:none;
    border:none;
    position:relative;
    padding: 10px 20px 0 0;
    font-size:15px
  }
  .qwui-title_detaildata{background-color:#fff;}
  .qwui-title_detaildata .qwui-type{
    cursor:pointer;
  }
  .qwui-click_icon{
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 9px;
    height: 15px;
    -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg);
    background: 0 0 url(../../../../assets/images/CSSSprites.png) no-repeat;
    background-size: 100px 100px;
  }
  .qwui-click_icon.qwui-click_icon_type_right{
    top: -50%;
    position: absolute;
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  .qwui-title_detaildata .qwui-title_inner_f_item{
    display: flex;
    padding-left:0;
    line-height: 22px;
    align-items: flex-end;
    position: relative;
  }
  .qwui-title_detaildata .qwui-title_inner_f_item:first-child:after{border:none;}
  .qwui-title_item_title {
    margin-right: 10px;
    color: #333;
    font-size:16px;
  }
  .qwui-title_detaildata .qwui-title_common_text{
    padding: 10px 14px 10px 0px;
  }
  .qwui-title_common_text .qwui-title_text{
    font-size: 13px;
    color: #666;
    font-weight: 500;
  }
  .qwui-title_common_text .qwui-address_icon{
    background: url(../../../../assets/images/crm/mapMarker_blue.png) no-repeat;
    background-size: 20px 20px;
    background-position: center;
    width: 48px;
    height: 30px;
    line-height: 30px;
    top: 50%;
    margin-top: -15px;
    position: absolute;
    right: 0;
    border-left: 1px solid #dadada;
    cursor: pointer;
  }
  .qwui-title_address{
    padding-right: 0 !important;
  }
  .qwui-title_common_text .qwui-title_tip{
    color: #e94f4f;
  }
  .qwui-title_item_select {
    width: 100%;
    padding-right: 20px;
    direction: rtl;
    font-size: 16px;
    color: #666666;
    -webkit-appearance:none;
    outline:none;
    border: none;
    background: url("../../../../assets/images/icon_arrow_d.png") no-repeat scroll right
    center transparent;
    background-size: 12px 8px;
  }
  .qwui-title_item_select.active{
    padding-right: 0;
    background: #f5f5f5;
  }
  .qwui-title_inner_f_item {
    position: relative;
    min-height: 19px;
    padding-top: 8.5px;
    color: #333;
    font-size: 14px;
    background: #fff;
  }
   .qwui-tape_box:after{
    content: '';
    position: absolute;
    left:0;
    top: 0;
    width: 100%;
    border-bottom:none;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
  }
  .qwui-flexItem {
    flex: 1;
  }
  img{max-width:100%;vertical-align:middle;}
  .qwui-tape{
    position: relative;
    display: none;
    width: 35px;
    height: 35px;
    margin-top: 5px;
    line-height: 35px;
    text-align: center;
    float: right;
    border-radius: 50%;
    clear: both;
    cursor: pointer;
    background:-20px 5px  url("../../../../assets/images/tapeNoPlay.jpg") no-repeat;
    background-size: 60px;
  }
  .qwui-tape_play{
    background:-20px 5px  url("../../../../assets/images/tapePlay.gif") no-repeat;
    background-size: 60px;
  }
  .qwui-title_inner_f_item .item_title{
    float: left;
    flex: 1;
    color: #333;
    width: 80%;
    font: normal 16px -apple-system-font,"Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
    white-space: pre-wrap;
  }
  .qwui-title_inner_f_item .item_titleReal{
    float: left;
    flex: 1;
    color: #333;
    width: 100%;
    font: normal 16px -apple-system-font,"Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
  }
  .qwui-title_inner_f_item .item_titleArrow{
    float: left;
    flex: 1;
    color: #333;
    width: 95%;
    font: normal 16px -apple-system-font,"Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
  }
  .qwui-title_counter{
    float: right;
    line-height: 27px;
    color: #B2B2B2;
  }
  .qwui-tape_box .item_content{
    width: 100%;
    min-height: 140px;
    max-height: 300px;
    font-size: 16px;
    color: #333;
    border: none;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .qwui-tape_box{
    position: relative;
    min-height: 19px;
    padding: 12px 15px 40px 0;
    color: #333;
    font-size: 14px;
    line-height: 22px;
    background: #fff;
  }
  .qwui-tape_box .more_function{
    // display: inline;
    // float: right;
    text-align: right;
  }
  .qwui-tape_box .more_function.active{
    position: absolute;
    right: 25px;
    bottom: 70px;
    z-index: 2;
  }
  .icon-circular{
    display: inline-block;
    position: relative;
    width: 35px;
    height: 35px;
    margin:0 10px 5px 0;
    line-height: 35px;
    text-align: center;
    border-radius: 50%;
    cursor: pointer;
  }
  .icon-circular::before {
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    width: 200%;
    height: 200%;
    border: 1px solid #999;
    border-radius: 50%;
    transform: scale(0.5);
    -webkit-transform: scale(0.5);
    transform-origin: 0 0;
    -webkit-transform-origin: 0 0;
    box-sizing: border-box;
  }
  .icon-circular-ic {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url('../../../../assets/images/icon-circular.png') no-repeat 0 0;
    background-size: 20px;
    vertical-align: middle;
  }
  .icon-circular-ueditor{
    display: inline-block;
    width: 45px;
    height: 38px;
    background: url('~assets/images/ueditor.png') no-repeat 0 0;
    background-size: 36px!important;
    vertical-align: middle;
  }
  .icon-circular-ueditor.active{
    background: url('~assets/images/utext.png') no-repeat 0 0;
  }
  .select_bg_grey {
    display: flex;
    background-color: #f5f5f5;
  }
  .qwui-tape_box {
    padding: 12px 0 0 0;
  }
  .qwui-tape_box .item_content {
    min-height: 0;
  }
  .crm_operate_item /deep/ .weui-cell {
    // padding: 0px 15px 32px 0px !important;
    padding: 0px 15px 0 0px !important;
    position: relative;
    display: block !important;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  .crm_operate_item /deep/ .vux-no-group-title {
    margin-top: 0 !important;
  }
  .crm_operate_item /deep/ .weui-cells:before {
    border-top: 0 !important;
}
.crm_operate_item /deep/  .weui-cell_access .weui-cell__ft:after {
    display:none !important;
}
.crm_operate_item /deep/ .vux-no-group-title .weui-cell__ft {
  text-align: left !important;
  color: #999999;
}
.crm_operate_item /deep/ .vux-cell-value {
  color: #999;
}
.qwui-border_bottom:after{
  transform-origin: 0 0;
}
.qwui-item_mask{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
}
.qwui-dialog_textarea_counter {
    color: #B2B2B2;
    text-align: right;
    vertical-align: top;
}
.qwui-dialog_textarea_red {
    color: red;
    text-align: right;
    vertical-align: top;
}
.qwui-input{
  width:100%;
}
  .qwui-add{
    width:100%;
    .qwui-add_content{
      padding:10px 0;
      border-top:1px solid #E6E6E6;
      position:relative;
      .delete{
        position: absolute;
        right: 0;
        top: 13px;
        width: 16px;
        height: 16px;
        background:url('../../../../assets/images/ic_del.png') no-repeat 0 0;
        background-size: 16px 16px;
      }
    }
    .quui-add_button{
      border-top: 1px solid #E6E6E6;
      padding-top: 10px;
      color:#467DB9;
    }
  }
  .qwui-phone{
    display: block;
    position: absolute;
    top: -9px;
    right: 0;
    width: 30px;
    height: 30px;
    background: url("../../../../assets/images/crm/icon-a-common_phone.png") no-repeat;
    background-size: 100%;
  }
  .weui-cells .vux-no-group-title {
    margin-top: 0 !important;
  }
  .item_title_remark{
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  .qwui-waibuContact{
    display: block;
    position: absolute;
    top: -9px;
    right: 0;
    width: 30px;
    height: 30px;
    background: url("../../../../assets/images/crm/ic_zixun.png") no-repeat;
    background-size: 100%;
  }
</style>
<style>
.edui-default .edui-editor-iframeholder{
  overflow-y: scroll !important;
}
</style>


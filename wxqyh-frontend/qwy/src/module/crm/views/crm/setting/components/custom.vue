<template>
  <div class="setting-custom">
    <setting-header :pages="pageName" @go-back="goBack"></setting-header>
    <div class="bgfff">
      <!-- 固定字段 -->
      <div class="CRMexpand_wrap pb20">
        <div class="CRMexpand_title fs15">固定字段</div>
        <ul>
          <li v-for="(item,index) in basicList" :key="index">
            <div class="CRMexpand_col1 lineH30 c999">{{index+1}}</div>
            <div class="CRMexpand_col4 lineH30">
              <span>{{item.optionName}}</span>
              <div class="tipsBox" v-if="filterTipField(item)">
                <i
                  class="CRMexpand_icon"
                  @mouseover="showorhideTips(filterTipField(item))"
                  @mouseout="showorhideTips(filterTipField(item))"
                >?</i>
                <div class="tipsItem" v-show="filterTipField(item).isShow">
                  <div class="tipsContent">
                    <span class="c999">{{filterTipField(item).msg}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="CRMexpand_col1">
              <qwui-checkbox
                label="启用"
                v-model="item.status"
                :disabled="mustUsedField.includes(item.optionName)"
                @change="onListClick(item)"
              ></qwui-checkbox>
            </div>
            <div class="CRMexpand_col1">
              <qwui-checkbox
                label="必填"
                v-model="item.isMust"
                :disabled="!item.status || mustWriteField.includes(item.optionName)"
                @change="onListClick(item)"
              ></qwui-checkbox>
            </div>
            <div class="CRMexpand_col1 lineH30" v-if="xialaField.includes(item.optionName)">
              <a class="number_setting" @click="openModal(item,index,'basic')">选项设置</a>
            </div>
          </li>
        </ul>
      </div>
      <!-- 自定义字段 -->
      <div class="CRMexpand_wrap mt10">
        <div class="CRMexpand_title fs15">自定义字段</div>
        <ul class="custom_field">
          <li v-for="(item,index) in strList" :key="index">
            <div class="CRMexpand_col1 c999 lineH30">{{index+1}}</div>
            <div class="CRMexpand_col2 inputWrap">
              <input
                type="text"
                v-model="item.optionName"
                placeholder="最多6个汉字"
                @input="limitChar(item,6)"
              >
            </div>
            <div class="CRMexpand_col1">
              <qwui-checkbox label="启用" v-model="item.status" @change="onListClick(item)"></qwui-checkbox>
            </div>
            <div class="CRMexpand_col1">
              <qwui-checkbox
                label="必填"
                v-model="item.isMust"
                :disabled="!item.status"
                @change="onListClick(item)"
              ></qwui-checkbox>
            </div>
            <div class="CRMexpand_col3">
              <qwui-select
                :dataList="optionData"
                borderType="rightAngle"
                @selectItem="selectItem(item)"
                v-model="item.type"
              ></qwui-select>
            </div>
            <div class="CRMexpand_col4" style="display:flex">
              <div class="CRMexpand_col1 lineH30">
                <a
                  class="number_setting"
                  @click="openModal(item,index,'str')"
                >{{item.type == '0' ? '选项设置' : (item.type == '5' ? '显示方式' : '填写提示')}}</a>
              </div>
              <div class="CRMexpand_col1 lineH30" v-show="item.type == '5'">
                <a class="number_setting" @click="openModal(item,index,'str',$event)">填写提示</a>
              </div>
            </div>

            <div class="CRMexpand_col1" @click="delField(index)">
              <i class="del_fields">×</i>
            </div>
          </li>
        </ul>
        <div class="add_custom_fields" @click="addField">添加自定义字段</div>
      </div>
      <div class="tcform_action">
        <qwui-button size="large" class="mr10" @click="cancel">取消</qwui-button>
        <qwui-button type="primary" size="large" @click="save">保存</qwui-button>
      </div>
    </div>
    <!-- 弹框内容 -->
    <qw-modal
      :show.sync="showModal"
      :title="modalTitle"
      :showCancelButton="showCancelButton"
      @on-cancel="cancelModal"
      @on-confirm="confirmModal"
    >
      <div class="modalContent" v-if="modalType == '填写提示'">
        <div class="c999 modalTip">提示：该文字可用于提醒用户填写内容。</div>
        <div class="mt20 modalTip c666">提示内容</div>
        <input class="mt10 tipContentInput" v-model="strFieldSettingList[0].name">
      </div>
      <div class="modalContent" v-if="modalType == '显示方式'" style="padding:0 80px">
        <div class="mt20" style="display:flex;">
          <label for class="mr20">类型</label>
          <qwui-select
            :dataList="numTypeList"
            @selectItem="selectNumType"
            v-model = "oldObj.ext1 !== '3' ? '0' :'3'"
            borderType="rightAngle"
          ></qwui-select>
        </div>
        <div class="mt20" style="display:flex" v-show="oldObj.ext1 !== '3'">
          <label for class="mr20">格式</label>
          <div>
            <qwui-radio label="1" class="c666" v-model="oldObj.ext1">整数</qwui-radio>
            <qwui-radio label="2" class="c666" v-model="oldObj.ext1">小数（保留两位小数点）</qwui-radio>
          </div>
        </div>
      </div>
      <div class="modalContent optionSetting" v-if="modalType == '选项设置'">
        <div class="c999 modalTip">提示：序号数值越小，内容排序越靠前</div>
        <div class="mt20" style = "display:flex">
          <span class="pop_col3">显示</span>
          <span class="pop_col1">序号</span>
          <span class="pop_col2">内容</span>
          <slot name="settingTitle" :curIndex="curIndex" v-if = "strFieldSettingList[0].process"></slot>
        </div>
        <div class="xiala mt10" >
          <ul >
            <li v-for="(setting,index) in strFieldSettingList" :key="index" class="mt10" style = "display:flex;">
              <span class="pop_col3">
                <qwui-Checkbox v-model="setting.isShow" :disabled = "setting.statusCode && (setting.statusCode > -1 && setting.statusCode < 4)"></qwui-Checkbox>
              </span>
              <span class="pop_col1">
                <input type="number" v-model="setting.sort" @input = "filterMinus(setting)">
              </span>
              <span class="pop_col2">
                <input
                  type="text"
                  placeholder="最长32个汉字"
                  v-model="setting.name"
                  @input="limitChar(setting,32)"
                  :disabled = "setting.statusCode && (setting.statusCode > -1 && setting.statusCode < 4)"
                >
              </span>
              <slot name="settingContent" :setting="setting" :curIndex="curIndex" v-if = "setting.process"></slot>
              <div class="addIcon" @click="addSetting" v-if="index == 0">
                +
              </div>
              <div class="addIcon delIcon " v-else @click="delSetting(index)" v-show = "!(setting.statusCode && (setting.statusCode > -1 && setting.statusCode < 4))">
                -
              </div>
            </li>
          </ul>
        </div>
      </div>
    </qw-modal>
  </div>
</template>
<script>
import settingHeader from "./settingHeader";
import qwuiCheckbox from "@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox";
import qwuiInput from "@/components/qwuiBase/qwuiInput/QwInput";
import qwuiSelect from "@/components/qwuiBase/qwuiSelect/QwSelect";
import qwuiButton from "@/components/qwuiBase/qwuiButton/qwuiButton";
import qwModal from "../../../../components/qwModal";
import qwuiRadio from "@/components/qwuiBase/qwuiRadio/qwuiRadio";
export default {
  data() {
    return {
      hasTip: true, //是否有提示语
      isShowTip: false, //是否显示提示语
      modalType: "", //选项的类型
      modalTitle: "", //对话框标题
      showModal: false, //是否显示对话框
      showCancelButton: true, //是否显示对话框的取消按钮
      optionData: [
        {
          optionName: "单行文本框",
          val: 1
        },
        {
          optionName: "多行文本框",
          val: 2
        },
        {
          optionName: "下拉菜单",
          val: 0
        },
        {
          optionName: "联系方式",
          val: 3
        },
        {
          optionName: "日期类型",
          val: 4
        },
        {
          optionName: "数值类型",
          val: 5
        }
      ],
      numTypeList: [
        {
          optionName: "数字",
          val: 0
        },
        {
          optionName: "百分比",
          val: 3
        }
      ],
      numTypeVal: {},
      strFieldSettingList: [], //自定义字段的选项设置
      curIndex: "", //当前打开对话框字段的索引
      tipMsg: "", //帮助提示
      curModalFieldType: "", //当前对话框的字段类型
      oldObj: {}
    };
  },
  props: {
    pageName: {
      type: Array,
      default() {
        return [];
      }
    },
    basicList: {
      type: [Object, Array],
      default() {
        return {};
      }
    },
    strList: {
      type: [Object, Array],
      default() {
        return {};
      }
    },
    mustWriteField: {
      type: Array,
      default() {
        return [];
      }
    },
    mustUsedField: {
      type: Array,
      default() {
        return [];
      }
    },
    hasTipField: {
      type: Array,
      default() {
        return [];
      }
    },
    xialaField: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    settingHeader,
    qwuiInput,
    qwuiCheckbox,
    qwuiSelect,
    qwuiButton,
    qwModal,
    qwuiRadio
  },
  
  methods: {
    //返回上一级
    goBack() {
      this.$router.back(-1);
    },
    //点击启用或必填时的操作
    onListClick(item) {
      if (!item.status && !this.mustWriteField.includes(item.optionName)) {
        item.isMust = false;
      }
    },
    //显示或隐藏tip提示
    showorhideTips(obj) {
      obj.isShow = !obj.isShow;
    },
    //选择自段输入类型
    selectItem(obj) {
      obj.list = [
        {
          isShow: true,
          name: "",
          ext1: "",
          ext2: "",
          hasSelect: "",
          id: "",
          optionId: "",
          orgId: "",
          sort: ""
        }
      ];
      obj.ext1 = obj.type == '5' ? '1' : ''
    },
    //添加自定义字段
    addField() {
      // if(this.strList.length == 50){
      //    dataBase.alert("提示", '自定义字段数量不能超过50');
      //    return ;
      // }
      if(_.isVipGold('crm') && this.strList.length == 50){ 
        dataBase.alert("提示", '自定义字段数量不能超过50');
        return ;
      }else if(!_.isVipGold('crm') && this.strList.length == 30){
        _.alert('提示','最多添加30个自定义字段，尊享版可添加更多<a href="'+ _.baseURL +'/qiweipublicity/companysrv/vip/vip_gold_index.jsp" target="_blank" ' +
        'style="color:orange;">'+'马上升级尊享版</a>',function () {
        },'确定',true)
        return 
      }
      let obj = {
        optionName: "",
        status: false,
        isMust: false,
        list: [],
        type: "1"
      };
      this.strList.push(obj);
    },
    //删除自定义自段
    delField(index) {
      this.strList.splice(index, 1);
    },
    //保存自定义字段
    save() {
      this.$emit("save", this.basicList, this.strList);
    },
    //取消自定义字段
    cancel() {
      this.$router.back(-1);
    },
    //选择数值类型
    selectNumType(name, val) {
      if (val == "3") {
        this.oldObj.ext1 = "3";
      } else {
        this.oldObj.ext1 = "1";
      }
    },
    //添加下拉菜单选项设置
    addSetting() {
      if(this.strFieldSettingList.length == 50){
        dataBase.alert("提示" , '选项数量不能超过50')
        return ;
      }
      let obj
      if (this.basicList[this.curIndex] && this.basicList[this.curIndex].optionName == "目前阶段") {
        obj = {
          isShow: true,
          name: "",
          ext1: "",
          ext2: "",
          hasSelect: "",
          id: "",
          optionId: "",
          orgId: "",
          sort: "",
          process: "1",
          winRate: "",
        };
      } else {
        obj = {
          isShow: true,
          name: "",
          ext1: "",
          ext2: "",
          hasSelect: "",
          id: "",
          optionId: "",
          orgId: "",
          sort: ""
        };
      }
      this.strFieldSettingList.push(obj);
    },
    //删除下拉菜单选项设置
    delSetting(index) {
      this.strFieldSettingList.splice(index, 1);
    },
    //打开对话框
    openModal(obj, index, str, evt) {
      this.strFieldSettingList = {};
      if (obj.type == "0" || (obj.list && obj.list.length >= 0 && str == "basic")) {
        this.modalType = "选项设置";
        this.modalTitle = "选项设置";
      } else if (obj.type == "5") {
        this.modalType = "显示方式";
        this.modalTitle = "显示方式";
        if (evt && evt.target.innerHTML == "填写提示") {
          this.modalType = "填写提示";
          this.modalTitle = "输入框提示文字设置";
        }
        
      } else {
        this.modalType = "填写提示";
        this.modalTitle = "输入框提示文字设置";
      }
      
      if (obj.list.length > 0) {
        this.strFieldSettingList = obj.list.map( item => {
          return {...item}
        })
      } else {
        this.strFieldSettingList = [
          {
            isShow: true,
            name: "",
            ext1: "",
            ext2: "",
            hasSelect: "",
            id: "",
            optionId: "",
            orgId: "",
            sort: ""
          }
        ]
        if(obj.type == '5'){
          this.strFieldSettingList[0].ext1 = '1'
          //obj.ext1 = obj.ext1 || "1";
        }
      }
      
      this.curModalFieldType = str;
      this.showModal = true
      this.curIndex = index
      this.oldObj = { ...obj }
    },
    //取消对话框
    cancelModal() {
      this.showModal = false;
    },
    //确认对话框
    confirmModal() {
      let flag = true
      //对选项设置进行验证
      if (this.modalType == "选项设置") {
        let sortArr = []
        let winNum = 0
        let loserNum = 0
        this.strFieldSettingList.forEach(item => {
          if (item.name == "" || ( item.sort == '' && item.sort !== 0)) {
            flag = false
            dataBase.alert("提示信息", "序号或内容不能为空")
          } 
          if (item.winRate != undefined && (item.winRate == "" && item.process) || (item.process == '1' && Number(item.winRate) == 100) || (item.process == '1' && item.winRate == 0)) {
            flag = false
            dataBase.alert("提示信息","赢率格式不正确，请输入0.1-99.9之间的数字，精确到小数点后一位")
          }
          if(item.process == '2'){
            winNum++
          }
          if(item.process == '3'){
            loserNum++
          }
          sortArr.push(item.sort + "")
        })
        let newSortArr = this.unique(sortArr)
        if (newSortArr.length < sortArr.length) {
          flag = false;
          dataBase.alert("提示信息", "序号不能重复");
        }
        if(winNum > 1 || loserNum > 1){
          flag = false;
          dataBase.alert("提示信息", "商机进程只能有一个赢单和输单");
        }
      }
      //点击确定，修改设置成功
      if(flag){
        if (this.curModalFieldType == "basic") {
          this.basicList[this.curIndex].list = this.strFieldSettingList;
        } else if (this.curModalFieldType == "str") {
          this.strList[this.curIndex].ext1 = this.oldObj.ext1
          this.strList[this.curIndex].list = this.strFieldSettingList;
        }
        this.showModal = false
      }
    },
    filterTipField(obj) {
      return this.hasTipField.find(item => item.name == obj.optionName);
    },
    //去重
    unique(arr) {
      return Array.from(new Set(arr));
    },
    //输入框的字数限制
    limitChar(obj, num) {
      if (obj.optionName) {
        obj.optionName = obj.optionName.substr(0, num);
      } else if( obj.name ){
        obj.name = obj.name.substr(0, num);
      }
    },
    //过滤负数
    filterMinus(obj){
      if(!(/^(\d|[1-9]\d)$/).test(obj.sort)){
        obj.sort = ''
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.CRMexpand_col1 {
  text-align: left;
  width: 100px;
}
.CRMexpand_col2 {
  width: 150px;
  text-align: left;
  position: relative;
}
.CRMexpand_col3 {
  width: 130px;
  text-align: left;
  padding-right: 40px;
}
.CRMexpand_col4 {
  width: 200px;
  text-align: left;
}

.lineH30 {
  line-height: 30px;
}
.mt20 {
  margin-top: 20px;
}
.mr10 {
  margin-right: 10px;
}
.c999 {
  color: #999;
}
.setting-custom {
  .CRMexpand_wrap {
    margin-top: 20px;
    border: 1px solid #ddd;
    .CRMexpand_title {
      padding: 13px 0 13px 20px;
      font-size: 14px;
      font-weight: bold;
      color: #666;
    }
    .custom_field {
      li {
        display: -webkit-box;
      }
    }
    li {
      margin: 0;
      padding: 10px 0 10px 20px;
      display: flex;
      justify-content: flex-start;
      flex-wrap:nowrap;
    }
    li:nth-child(even) {
      background: #fbfbfb;
    }
    li:hover {
      background: #f5f5f5;
      .number_setting {
        color: #f87b00;
        cursor: pointer;
      }
      .del_fields {
        display: block;
      }
    }
    .add_custom_fields {
      padding-left: 20px;
      margin: 10px 0 20px;
      color: #f87b00;
      cursor: pointer;
    }
  }
  .tcform_action {
    border-top: 1px solid #eee;
    padding: 20px 0;
    text-align: center;
    margin-bottom: 30px;
  }
  .optionSetting{
    min-width:400px;
  }
  .modalContent {
    padding: 0 40px;
    margin: 20px 0 30px 0;
    text-align: left;
    min-height:70px;
    .modalTip {
      text-align: left;
    }
    .tipContentInput {
      width: 340px;
      border: 1px solid #c6c6c6;
      height: 32px;
      padding-left: 10px;
    }
    .pop_col1 {
      display: inline-block;
      width: 50px;
      input {
        width: 30px;
        height: 28px;
        border: 1px solid #c6c6c6;
        text-align: center;
      }
    }
    .pop_col2 {
      display: inline-block;
      width: 220px;
      margin-right:55px;
      input {
        width: 250px;
        height: 28px;
        border: 1px solid #c6c6c6;
        padding-left: 10px;
      }
    }
    .pop_col3 {
      display: inline-block;
      width: 40px;
    }
    .pop_col4 {
      display: inline-block;
      width: 120px;
      input {
        width: 100px;
        height: 28px;
        border: 1px solid #c6c6c6;
        padding-left: 10px;
      }
    }
    .pop_col5 {
      display: inline-block;
      input {
        width: 50px;
        height: 28px;
        border: 1px solid #c6c6c6;
        padding-left: 10px;
      }
    }
    .addIcon {
      background: #80c056;
      border-radius: 50%;
      cursor: pointer;
      height: 18px;
      position: relative;
      width: 18px;
      margin-top: 8px;
      display: inline-block;
      text-align: center;
      line-height: 14px;
      font-weight: bolder;
      font-size: 15px;
      color: #fff;
    }
    .delIcon {
      background: #cb4043;
    }
  }
  .del_fields {
    display: none;
    float: right;
    margin-right: 20px;
    font-style: normal;
    font-size: 20px;
    color: #bbb;
    cursor: pointer;
  }
}

.tipsBox {
  position: relative;
  display: inline-block;
  .CRMexpand_icon {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #f08d00;
    color: #fff;
    font-weight: bold;
    text-align: center;
    line-height: 15px;
    font-size: 12px;
    cursor: pointer;
  }
  .tipsItem {
    position: absolute;
    max-width: 360px;
    white-space: nowrap;
    height: 40px;
    top: 0;
    left: 25px;
    line-height: 40px;
    padding: 0 10px;
    box-sizing: border-box;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 5px;
    font-size: 12px;
    box-shadow: 0 0 5px 1px #eee;
  }
  .tipsItem::before {
    content: "";
    display: inline-block;
    position: absolute;
    left: -8px;
    top: 10px;
    border-width: 8px;
    border-color: #eee;
    border-left-width: 0;
    border-style: dashed;
    border-right-style: solid;
    border-top-color: transparent;
    border-bottom-color: transparent;
  }
  .tipsItem::after {
    content: "";
    position: absolute;
    left: -7px;
    top: 10px;
    border-width: 8px;
    border-color: #fff;
    border-left-width: 0;
    border-style: dashed;
    border-right-style: solid;
    border-top-color: transparent;
    border-bottom-color: transparent;
  }
}

.inputWrap {
  display: flex;
  input {
    width: 120px;
    font-size: 14px;
    height: 32px;
    padding: 0 10px 0 10px;
    box-sizing: border-box;
    border-radius: 5px;
    text-align: center;
    border: 1px solid #c6c6c6;
  }
}
</style>


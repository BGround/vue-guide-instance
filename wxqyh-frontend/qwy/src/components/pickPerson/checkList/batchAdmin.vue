<template>
  <div class="qwui-main_batch clearfix">

    <!--  导入帐号  -->
    <div class="qwui-batch_box clearfix">
      <!--  左边导入 -->
      <div class="qwui-batch_import">
        <div class="qwui-import_title clearfix">
          <span class="qwui-left_word">输入管理员登录账号（1行1个）</span>
          <span class="qwui-right_word count">{{batchNum}}/{{maxUser}}</span>
        </div>
        <textarea class="qwui-import_area"
                  v-model="batchIds"
                  @input="updateValue($event.target.value)"
                  placeholder="输入或批量粘贴管理员的登录账号"></textarea>
      </div>

      <!--  中间按钮 -->
      <div class="qwui-batch_middle">
        <input type="button" value="导入" class="qwui-batch_import_btn" @click="batch">
      </div>

      <!--  右边结果 -->
      <div class="qwui-batch_result">
        <div class="qwui-result_top clearfix">
          <div class="qwui-right_word"  @mouseover="showTips = true" @mouseout="showTips = false">
            <span class="qwui-question_btn">?
              <div class="qwui-question_dialog" v-show="showTips">
                <p>导入失败可能因为以下原因：</p>
                · 管理员账号不存在企业中<br>
                · 账号中存在空格等错误字符<br>
                · 账号之间没有换行<br>
                · 导入账号超出上限
                <b><em></em></b>
              </div>
            </span>
          </div>
        </div>
        <div class="qwui-result_list">
          <tab-group flex :selected='0' ref='tabs'>
            <tab :text="item.text"
                :num="item.num"
                v-for="(item, index) in tabs"
                :key="item.id"
                @click="clickTab"></tab>
          </tab-group>
          <ul class="qwui-success_list">
            <li class="qwui-success_list_li">
              <textarea class="qwui-success_list_textarea" readonly v-model="batchResult"></textarea>
            </li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import tab from '../../qwuiTab/tab.vue'
  import tabGroup from '../../qwuiTab/tabGroup.vue'
  import {batchAdminList} from '../api/getData'
  export default {
    props:{
      //人数最大限制
      maxUser:{
        type:Number,
        default:5000
      },
      defaultAdmin:{
        type:Array,
        default:function(){
          return []
        }
      },
      defaultUser:{
        type:Array,
        default:function(){
          return []
        }
      },
    },
    data (){
      return{
        dataBase,
        tabs:[
          {text:'完成',num:0},
          {text:'失败',num:0}
        ],
        showTips:false,
        batchIds:'',
        batchNum:0,
        successList:[], //导入成功列表
        failList:[], //导入失败列表
        currentIndex:'完成', //当前点击
      }
    },
    computed:{
      batchResult:function () {
        return this.currentIndex == '完成'
                ? this.successList.join('\n')
                : this.failList.join('\n')
      }
    },
    methods:{
      clickTab:function (val) {
        this.currentIndex = val
      },
      updateValue:function (value) { //监听textarea控件
        var tempArray = this.batchIds.split('\n');
        if(tempArray.length > this.maxUser){
          tempArray.length = this.maxUser;
          this.batchIds = tempArray.join("\r\n")
        }
        this.batchNum = this.batchIds.split('\n').length
      },
      //导入
      batch:function () {
        if(this.batchIds.split('\n').length > this.maxUser){
            this.dataBase.top_alert('导入人员超出上限',false,2000);
            return
        }
        batchAdminList(
            this.batchIds.split('\n').join('|')
        ).then(res => {
            if(res.code === "0"){
                if(this.judgeIsOver(res.data.successList)){ //超出上限
                  this.successList = [];
                  this.failList = this.batchIds.split('\n')
                  this.currentIndex == '失败'
                  this.tabs[0].num = 0;
                  this.tabs[1].num = this.batchIds.split('\n').length
                } else {
                  this.successList = res.data.successList;
                  this.failList = res.data.errorList;
                  this.tabs[0].num = this.successList.length;
                  this.tabs[1].num = this.failList.length
                }
                let result = '失败';
                if (this.successList.length > 0) {
                  result = '完成';
                  this.$emit('batchSuccess', this.successList)
                }
                this.currentIndex = result
                for (let item of Object.values(this.$refs.tabs.$children)) {
                  item.model = result
                }
                this.$refs.tabs.handleChange(result)
            }
        })
      },
      //判断导入管理员数是否超过最大限制（需要计算上成员）
      judgeIsOver:function (resultList) {
        var self = this,
          userLength = self.defaultAdmin.length;
        if(userLength == 0){
          return false
        }
        userLength += self.defaultUser.length;
        resultList.forEach(function (e) {
          self.defaultAdmin.find(item => {
            return item.userName == e
          }) ?  '' : userLength++
        })
        if(userLength > self.maxUser){
          self.dataBase.top_alert('导入人员超出上限',false,2000)
          return true
        }
        return false
      }
    },
    components:{
      tab,
      tabGroup
    }
  }
</script>
<style scoped>
  .qwui-main_batch{
    display: block;
  }
  .qwui-batch_box{
    padding: 0 20px;
  }
  .qwui-batch_import{
    float: left;
    width: 248px;
  }
  .qwui-import_title{
    position:relative;
    padding-bottom: 5px;
  }
  .qwui-left_word{
    float: left;
    color: #333333;
  }
  .qwui-right_word{
    float: right;
    color: #a6a6a6;
  }
  .qwui-right_word.count{
    position:absolute;
  }
  .qwui-import_area{
    height: 320px;
    width: 100%;
    padding: 10px 5px;
    border: 1px solid #cccccc;
    box-sizing: border-box;
    resize: none;
    font-family: inherit !important;
    font-size: 14px;
    overflow: auto;
    vertical-align: top;
  }
  .qwui-batch_middle{
    float: left;
    margin: 150px 7px 0 7px;
    text-align: center;
  }
  .qwui-batch_import_btn{
    width: 56px;
    padding: 0 10px;
    font-size: 14px;
    line-height: 30px;
    color: #333333;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #cccccc;
    cursor: pointer;
  }
  .qwui-batch_result{
    float: right;
    width: 240px;
  }
  .qwui-result_top{
    padding-bottom: 5px;
  }
  .qwui-question_btn{
    display: inline-block;
    position: relative;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #c2c2c2;
    text-align: center;
    line-height: 16px;
    color: #fff;
    z-index: 10;
  }
  .qwui-question_dialog{
    position: absolute;
    background: #fff;
    width: 158px;
    top: 27px;
    left: -175px;
    padding: 10px 20px;
    text-align: left;
    color: #666;
    font-size: 12px;
    line-height: 20px;
    border: 1px solid #d9dadc;
  }
  .qwui-question_dialog p{
    color:#333;
  }
  .qwui-question_dialog b{
    width: 0;
    height: 0;
    line-height: 0;
    font-size: 0;
    position: absolute;
    left: 173px;
    top: -16px;
    border-width: 8px;
    border-style: dashed dashed solid;
    border-color: transparent transparent #dddddd;
  }
  .qwui-question_dialog b em{
    width: 0;
    height: 0;
    line-height: 0;
    font-size: 0;
    position: absolute;
    left: -8px;
    top: -6px;
    border-width: 8px;
    border-style: dashed dashed solid;
    border-color: transparent transparent #fff;
  }
  .qwui-result_list{
    width: 240px;
    height: 318px;
    border: 1px solid #cccccc;
    background: #fff;
    overflow: auto;
  }
  .qwui-success_list{
    list-style: none outside none;
  }
  .qwui-success_list_li{
    position: relative;
    padding: 0;
    line-height: 20px;
  }
  .qwui-success_list_textarea{
    width: 100%;
    height: 308px;
    padding: 10px 16px;
    box-sizing: border-box;
    resize: none;
    border: none;
    font-family: inherit;
    font-size: 14px;
    overflow: auto;
    vertical-align: top;
  }
</style>

<template>
  <div class="qwui-main_batch clearfix">
    <div class="qwui-vip_limit" v-show="false">
      <span class="fl">批量导入功能仅限VIP会员使用,
        <a target="_blank" class="qwui-to_be_vip">如何成为银卡VIP</a>
      </span>
    </div>

    <!--  导入帐号  -->
    <div class="qwui-batch_box clearfix">
      <!--  左边导入 -->
      <div class="qwui-batch_import">
        <div class="qwui-import_title clearfix">
          <span class="qwui-left_word">请输入账号（每个一行）</span>
          <span class="qwui-right_word">{{batchNum}}/{{maxUser}}</span>
        </div>
        <textarea class="qwui-import_area"
                  v-model="batchIds"
                  @input="updateValue($event.target.value)"
                  placeholder="请在这里输入或批量粘贴"></textarea>
      </div>

      <!--  中间按钮 -->
      <div class="qwui-batch_middle">
        <input type="button" value="导入 >" class="qwui-batch_import_btn" @click="batch">
      </div>

      <!--  右边结果 -->
      <div class="qwui-batch_result">
        <div class="qwui-result_top clearfix">
          <div class="qwui-right_word"  @mouseover="showTips = true" @mouseout="showTips = false">
            <span class="qwui-question_btn">?
              <div class="qwui-question_dialog" v-show="showTips">
                <p>导入失败可能因为以下原因：</p>
                · 账号不存在通讯录中<br>
                · 账号中存在空格等错误字符<br>
                · 账号之间没有换行<br>
                · 选人超出上限
                <b><em></em></b>
              </div>
            </span>
          </div>
        </div>
        <div class="qwui-result_list">
          <tab-group flex>
            <tab :text="item.text" :num="item.num" v-for="(item, index) in tabs" :key="item.id" @click="clickTab"></tab>
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
  import {getBatchData} from '../api/getData'
  export default {
    props:{
      //人数最大限制
      maxUser:{
        type:Number,
        default:5000
      },
      //默认选中人员
      defaultUser:{
        type:Array,
        default:function(){
          return []
        }
      },
      //限制的所选部门id组成的string
      intersectionDeptIds:{
        type:String,
        default:''
      },
      //限制的所选标签id组成的string
      intersectionTagIds:{
        type:String,
        default:''
      },
      //限制的所选成员id组成的string
      intersectionUserIds:{
        type:String,
        default:''
      },
    },
    data (){
      return{
        dataBase,
        tabs:[
          {text:'成功',num:0},
          {text:'失败',num:0}
        ],
        showTips:false,
        batchIds:'',
        batchNum:0,
        successList:[], //导入成功列表
        failList:[], //导入失败列表
        currentIndex:'成功', //当前点击
      }
    },
    computed:{
      batchResult:function () {
        return this.currentIndex == '成功'
                ? this.successList.map(value=>{
                    return value.wxUserId
                  }).join('\n')
                : this.failList.map(value=>{
                    return value.wxUserId
                  }).join('\n')
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
        getBatchData(
          this.batchIds.split('\n').join('##'),
          this.intersectionDeptIds,
          this.intersectionTagIds,
          this.intersectionUserIds
        ).then(res => {
          if(this.judgeIsOver(res.data.legalList)){ //超出上限
            this.successList = [];
            this.failList = res.data.wrongList.concat(res.data.legalList);
            this.currentIndex == '失败'
            this.tabs[0].num = 0;
            this.tabs[1].num = this.batchIds.split('\n').length
          } else {
            this.successList = res.data.legalList;
            this.failList = res.data.wrongList;
            this.tabs[0].num = this.successList.length;
            this.tabs[1].num = this.failList.length
            if (this.successList.length > 0) {
              this.$emit('batchSuccess', this.successList)
            }
          }
        })
      },
      //判断导入人数是否超过最大限制
      judgeIsOver:function (resultList) {
        var self = this,
          userLength = self.defaultUser.length;
        resultList.forEach(function (e) {
          self.defaultUser.find(item => {
            return item.userId == e.userId
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
  .qwui-vip_limit{
    display: flex;
    position: relative;
    width: 100%;
    margin-top: 20px;
    padding: 8px 40px 8px 15px;
    line-height: 22px;
    background: #ffedbb;
    border: 1px #f2d083 solid;
    color: #604e2b;
    text-align: left;
    box-sizing: border-box;
  }
  .qwui-to_be_vip{
    color: #f87b00;
    text-decoration: inherit;
  }
  .qwui-batch_box{
    padding: 20px;
  }
  .qwui-batch_import{
    float: left;
    width: 240px;
  }
  .qwui-import_title{
    padding-bottom: 5px;
  }
  .qwui-left_word{
    float: left;
    color: #333333;
  }
  .qwui-right_word{
    float: right;
    cursor: pointer;
  }
  .qwui-import_area{
    height: 341px;
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
    width: 66px;
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
    height: 339px;
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
    padding: 10px 5px;
    box-sizing: border-box;
    resize: none;
    border: none;
    font-family: inherit;
    font-size: 14px;
    overflow: auto;
    vertical-align: top;
  }
</style>

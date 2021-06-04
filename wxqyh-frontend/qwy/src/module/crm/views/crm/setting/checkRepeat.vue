<template>
    <div class = "setting-repeat">
      <setting-header :pages="['设置','查重规则']"
                      @go-back="goBack">
      </setting-header>
      <div class="client-check">
          <span class="client-check_search">客户查重搜索</span>
          <qwui-radio v-model="selected" 
                      :label="search_fuzzy"
                      >模糊匹配
          </qwui-radio>
          <qwui-radio v-model="selected" 
                      :label="search_exact" 
                      > 精准匹配
          </qwui-radio>
      </div>
      <div class="tab-select">
          <qw-tabs defaultTabName="client-tab"  >  
              <qw-tab-item label="客户" 
                            name="client-tab"   
              >
                  <div class="text-search">查重字段</div>
                  <ul class="text-search_list">
                      <li v-for="(item,index) in clientArray"  
                        :key = "index"
                    >
                          <span class="client-number"> {{'0'+(index+1)}}</span>
                          <span class="client-concern">{{item.name}}</span>
                          <div  class="client-use">
                              <qwui-checkbox label = "启用"  
                                            v-model = 'item.isMust'                                  
                              >
                              </qwui-checkbox> 
                          </div>
                          <span class="exact-match">精准匹配</span>
                      </li>
                  </ul>
              </qw-tab-item>    
              <qw-tab-item label="联系人" 
                           name="client-message"
              >
                      <div class="text-search">查重字段</div>
                      <div class="text-menue">
                          <span class="client-number"> 01</span>
                          <span class="client-concern">联系电话</span>
                          <div class="client-use">
                              <qwui-checkbox label = "启用" 
                                            v-model = 'isMusted'      
                              >
                              </qwui-checkbox> 
                          </div>
                          <span class="exact-match">精准匹配</span>    
                     </div>  
              </qw-tab-item>
          </qw-tabs>
      </div>
      <div class="related-button">
          <qwui-button size = "large" class = "mr10" @click = "cancel">取消</qwui-button>
          <qwui-button type='primary' size = "large" @click = "save">保存</qwui-button>    
      </div>   
    </div>
</template>
<script>
    import settingHeader from "./components/settingHeader";
    import QwuiRadio from "components/qwuiBase/qwuiRadio/qwuiRadio";
    import qwuiCheckbox from "components/qwuiBase/qwuiCheckbox/qwuiCheckbox";
    import qwTabs from "crm/components/qw-tab/tab/tab";
    import qwTabItem from "crm/components/qw-tab/tabItem/tabItem";
    import qwuiButton from "components/qwuiBase/qwuiButton/qwuiButton";
    import {
      getReapeatRuleList,
      saveReapeatRule
    } from "crm/api/setting/index.js"
    const SEARCH_FUZZY = '0' // 模糊查询
    const SEARCH_EXACT = '1' // 精确查询
    const GET_SUCCESS = '0' // 获取查重列表
    const REQUEST_SUCCESS = '0' //保存查重列表
    export default {
      components: {
        settingHeader,
        QwuiRadio,
        qwuiButton,
        qwTabs,
        qwTabItem,
        qwuiCheckbox
      },
      data(){
        return {
          repeatList:[],//获取的查重规则表数组
          isMusted:'',  //联系人查重字段启用选择
          selected:'',  //客户查重搜索匹配选择
          clientArray: [
            {
              name:"客户名称",
              isMust:''
            },
            {
              name:"联系电话 ",
              isMust:''
            }
          ],//客户查重字段
          search_fuzzy: SEARCH_FUZZY,//模糊查询
          search_exact: SEARCH_EXACT //精确查询
        }
      },
      mounted(){
        //获取查重规则列表
        getReapeatRuleList().then( res => {
          if( res.code === GET_SUCCESS){
            this.repeatList = res.data.settingList
            this.repeatList.forEach(item => {
              if( item.agentCode == 'clientRepeatSetting'){
                this.clientArray[0].isMust = item.isMustList[0] != '0' 
                this.clientArray[1].isMust = item.isMustList[1] != '0'
              }else if( item.agentCode == 'crmContactsMobile'){
                this.isMusted= item.isMustList[0] != '0' 
              }else if( item.agentCode == 'clientRepeatAccurate'){
                this.selected = item.isMustList[0]
              }
            }
            )
          }else{
            dataBase.alert("提示信息", res.desc)
          }
        })
      },
      methods:{ 
        goBack(){
          this.$router.back(-1)
        },
    
        //保存查重规则列表
        save(){
          //客户查重启用项
          let clientUse = this.clientArray.map( item => {
            return item.isMust?'1' : '0'
          })
          clientUse = clientUse.join('|')
          //联系人查重启用项
          let contactsUse = this.isMusted? '1':'0'
          //匹配选择
          let matchSelect = this.selected
          //传给后台的数据
          let jsonData = [
            {
              agentCode : "clientRepeatAccurate",
              isPhotograph : matchSelect
            },
            {
              agentCode : "clientRepeatSetting",
              isPhotograph : clientUse
            },
            {
              agentCode : "crmContactsMobile",
              isPhotograph : contactsUse 
            }
          ]
          let list = {list:jsonData}
          let obj = {
            jsonData:JSON.stringify(list)
          }
          saveReapeatRule(obj).then( res => {
            if( res.code === REQUEST_SUCCESS){
              dataBase.top_alert("保存成功", true, 1000);
              setTimeout(() => {
                this.$router.go(-1);
              }, 500)
            }else{
              dataBase.alert("提示信息", res.desc)
            }
          })
        },
        //按下取消按钮
          cancel(){
            this.$router.back(-1)
          }
        }
      }
  </script>
  <style lang = "scss" scoped>
    .client-check {
      margin: 43px 0 0 44px; 
      width: 314px;
      height: 32px;
      line-height: 32px;
      color: #383838;
        .client-check_search { 
        margin-right: 20px;
      } 
    }
    .tab-select{
      margin-top: 27px;
      height: 417px;
    }
    .text-search{
      width:56px;
      height:20px;
      color: #383838;
    }
    .text-search_list {
      margin-top: 12px;
      li {
        position: relative;
        padding: 8px 0;
      }
    }    
    .client-number{
        margin-right:79px; 
        display: inline-block;
        width:30px;
        height:20px;
        color:rgba(128,128,128,1)
      }
    .client-concern {
          display: inline-block;
          margin-right: 76px;
          width:82px;
          height:20px;
          color:rgba(128,128,128,1);
      } 
    .client-use {
          position: absolute;
          left: 260px;
          top:8px; 
        }    
    .exact-match {
        display: inline-block;
        margin-left: 92px;
        width:82px;
        height:32px;
        line-height: 32px;
        text-align: center;
        color: #808080;
        background:rgba(255,255,255,1);
        border-radius:2px;
        border:1px solid rgba(213,213,213,1);
      }    
    .text-menue {
        position: relative;
        margin-top: 13px;
        padding: 8px 0; 
      }
    .related-button {
        border-top: 1px solid #eee;
        padding-top: 20px;
        text-align: center;
      }
  </style>

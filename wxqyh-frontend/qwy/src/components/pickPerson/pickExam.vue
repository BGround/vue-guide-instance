<template>
  <div>
    <div class="qwui-choose_person">
      <div class="qwui-choose_radio_group" v-if="isShowRadios" >
        <radio-group :radio="useRadio" inline @radio="clickRadio">
          <radio :disabled="disabled" :label="allObj.text" :id="allObj.id">{{allObj.text}}</radio>
          <radio :disabled="disabled" :label="speObj.text" :id="speObj.id">{{speObj.text}}</radio>
        </radio-group>
      </div>
      <div class="qwui-choose_result" v-show="isShowRadios ? !isAll : true">
        <ul class="qwui-click_choose"  @click="showPick">
          <span class="qwui-click_choose_word" v-show="!selectShow">点击选择</span>
          <!--  部门已选择  -->
          <li class="qwui-dept_selected" v-for="(item,index) in defaultDepts" :key="index">
            <div class="qwui-dept_selected_icon"></div>
            {{item.nodeName?item.nodeName:item.deptName}}
          </li>

          <!--  标签选择  -->
          <li class="qwui-inline">
            <div class="qwui-dept_selected" v-for="(item,index) in defaultTags" :key="index">
              <div class="qwui-tag_selected_icon"></div>
              {{item.tagName}}
            </div>
          </li>

          <!--  人员选择  -->
          <li class="qwui-inline">
            <div class="qwui-dept_selected" v-for="(item,index) in defaultUsers" :key="index">
              <img v-if="item.headPic && item.headPic!='0'" class="qwui-dept_selected_icon" :src="item.headPic">
              <div v-else class="qwui-user_default_img"></div>
              {{item.personName}}
            </div>
          </li>

          <!--  管理员选择  -->
          <li class="qwui-inline">
            <div class="qwui-dept_selected" v-for="(item,index) in defaultAdmin" :key="index">
              <div class="qwui-admin_selected_icon"></div>
              {{item.userName}}
            </div>
          </li>
        </ul>
      </div>

      <pick-person :show="show"
                 :defaultDepts="defaultDepts"
                 :defaultTags="defaultTags"
                 :defaultUsers="defaultUsers"
                 :defaultPosition="defaultPosition"
                 :defaultAdmin="defaultAdmin"
                 :functionTab="functionTab"
                 :maxDept="maxDept"
                 :maxUser="maxUser"
                 :maxTag="maxTag"
                 :maxPosition="maxPosition"
                 :onlyUser="onlyUser"
                 :intersectionDept="intersectionDept"
                 :intersectionTag="intersectionTag"
                 :intersectionUser="intersectionUser"
                 @chooseDone="chooseDone"
                 @closeThis="closeThis"></pick-person>
    </div>
  </div>
</template>
<script>
  import pickPerson from './pickPerson'
  import radio from '@/components/qwuiRadio/radio.vue'
  import radioGroup from '@/components/qwuiRadio/radio_group.vue'
  export default {
    props:{
      //所有人按钮配置
      allObj:{
        type:Object,
        default:function(){
          return {
            id: '所有人',
            text: '所有人',
          }
        },
      },
      //特定对象按钮配置
      speObj:{
        type:Object,
        default:function(){
          return{
            id:'特定对象',
            text:'特定对象',
          }
        },
      },
      //初始化的部门
      useDepts:{
        type:Array,
        default:function(){
          return []
        }
      },
      //初始化的标签
      useTags:{
        type:Array,
        default:function(){
          return []
        }
      },
      //初始化的人员
      useUsers:{
        type:Array,
        default:function(){
          return []
        }
      },
      //初始化的管理员
      useAdmin:{
        type:Array,
        default:function(){
          return []
        }
      },
      //使用的tab
      useTab:{
        type:Array,
        default:function(){
          return []
        }
      },
      //人数最大限制
      maxUser:{
        type:Number,
        default:5000
      },
      //部门最大限制
      maxDept:{
        type:Number,
        default:500
      },
      //标签最大限制
      maxTag:{
        type:Number,
        default:500
      },
      maxPosition:{
        type:Number,
        default:100
      },
      useRadio:{
        type:String,
        default:'所有人'
      },
      // 是否展示 radio组  默认 true
      isShowRadios:{
        type:Boolean,
        default:true
      },
      //是否禁用单选样式
      disabled:{
        type:Boolean
      },
      //标签页：是否只显示人员
      onlyUser:{
        type:Boolean,
        default:false
      },
      isReset:{
        type:Boolean,
        default:false
      },
      //限制的所选部门
      intersectionDept:{
        type:Array,
        default:function(){
          return []
        }
      },
      //限制的所选标签
      intersectionTag:{
        type:Array,
        default:function(){
          return []
        }
      },
      //限制的所选人员
      intersectionUser:{
        type:Array,
        default:function(){
          return []
        }
      },
    },
    data(){
      return{
        show:false,
        isAll:true,
        defaultDepts:this.useDepts,
        defaultTags:this.useTags,
        defaultUsers:this.useUsers,
        defaultPosition:[],
        defaultAdmin:this.useAdmin,
        functionTab:this.useTab
      }
    },
    computed:{
      selectShow:function () {
        return this.defaultDepts.length>0 || this.defaultTags.length>0 || this.defaultUsers.length>0 || this.defaultAdmin.length>0
      }
    },
    watch:{
      'useDepts':function (val) {
        this.defaultDepts = val;
      },
      'useTags':function (val) {
        this.defaultTags = val;
      },
      'useUsers':function (val) {
        this.defaultUsers = val;
      },
      'useAdmin':function (val) {
        this.defaultAdmin = val;
      },
      'useRadio':function (val) {
        this.radio = val;
      },
      isReset:function(val){ //crm后台公海池相关人点击修改按钮
        if(val){
          this.show=true;
        }
      },
      useTab(val){
        this.functionTab = val;
      }
    },
    methods:{
      changeTab(){
        this.functionTab=[
          {text:'职位'},
        ]
      },
      chooseDone:function (dept,tag,user,position,admin) {
        this.defaultDepts=dept.slice(0);
        this.defaultTags=tag.slice(0);
        this.defaultUsers=user.slice(0);
        this.defaultPosition=position.slice(0);
        this.defaultAdmin=admin.slice(0);
        this.show = false;
        this.$emit('chooseDone',dept,tag,user,position,admin)
      },
      clickRadio:function (val) {
        this.isAll= val == this.allObj.text? true:false
        this.$emit("update:useRadio",val)
        this.$emit("changeRadio", val);
      },
      showPick:function () {
        if(!this.disabled){
          this.show = !this.show
            if(this.useTab[0].text == '部门') {
                this.$message('注意：选择部门时将对部门全员推送信息，不可与标签组合使用！');
            }
        }
      },
      closeThis:function () {
        this.show = false;
        this.$emit("closePerson");
      },
      clearUsers:function(){
        this.defaultUsers = [];
      },
      clearDepts:function(){
        this.defaultDepts = [];
      },
      clearAll(){
        this.defaultUsers = [];
        this.defaultDepts = [];
        this.defaultAdmin = [];
        this.defaultTags = [];
      }

    },
    components:{
      pickPerson,
      radio,
      radioGroup
    }
  }
</script>
<style scoped>
  .qwui-choose_radio_group{
    width:200px;
    font-size: 14px;
  }
  .qwui-choose_result{
    font-size: 14px;
  }
  .qwui-click_choose{
    overflow: auto;
    width: 702px;
    height: 78px;
    margin: 0;
    padding: 4px 8px;
    border: 1px dashed #cccccc;
    background: #fff;
    border-radius: 2px;
  }
  .qwui-click_choose_word{
    display: inline-block;
    width: 100%;
    height: 100%;
    text-align: center;
    font-size: 14px;
    line-height: 78px;
    color: #999;
  }
  .qwui-dept_selected{
    display: inline-block;
    width: auto;
    height: 24px;
    margin: 5px 5px 0 0;
    padding-right:10px;
    line-height: 24px;
    list-style: none;
    background-color: #fff;
    border: 1px solid #ddd;
    border-left:none;
    border-radius: 3px;
    vertical-align: top;
  }
  .qwui-dept_selected_icon{
    display: inline-block;
    width: 26px;
    height: 24px;
    margin-right: 5px;
    list-style: none;
    vertical-align: top;
    background: url(../../assets/images/dept_icon.png) no-repeat center;
  }
  .qwui-inline{
    display: inline;
    vertical-align: middle;
  }
  .qwui-user_default_img{
    display: inline-block;
    width: 26px;
    height: 24px;
    margin-right: 5px;
    list-style: none;
    vertical-align: top;
    background: url(../../assets/images/user_icon.png) no-repeat center;
    background-size: 22px 22px;
  }
  .qwui-tag_selected_icon{
    display: inline-block;
    width: 26px;
    height: 24px;
    margin-right: 5px;
    list-style: none;
    vertical-align: top;
    background: url(../../assets/images/tag_icon.png) no-repeat center;
  }
  .qwui-admin_selected_icon{
    display: inline-block;
    width: 26px;
    height: 24px;
    margin-right: 5px;
    list-style: none;
    vertical-align: top;
    background: url(../../assets/images/admin_icon.png) no-repeat center;
    background-size: 22px 22px;
  }
</style>

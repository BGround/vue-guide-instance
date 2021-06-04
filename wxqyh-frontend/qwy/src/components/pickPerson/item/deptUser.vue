<template>
  <!--  部门 和 成员 都是本代码，成员新增右边的选人  -->
  <div class="qwui-main_dept_user clearfix">
    <!--  左边部门  -->
    <div class="qwui-main_dept" :class="{'active':isUser}">
      <div class="qwui-dept_user_title" @click="clickCompany">
        <span>{{companyName}}</span>
      </div>
      <div class="qwui-dept_left_list" :class="{'active':isUser}">
        <ul class="qwui-dept_list">
        <check-list :itemData="item"
                    :isUser="isUser"
                    :defaultDept="defaultDept"
                    :deleteSpecialDept="deleteSpecialDept"
                    :currentIndex="deptIndex"
                    :isOverDept="isOverDept"
                    @deptChecked="deptChecked"
                    @deptClick="deptClick"
                    @currentIndex="deptCurrentIndex"
                    v-for="(item,index) in departments"
                    :key="item.deptId"></check-list>
        </ul>
      </div>
    </div>

    <!--  右边选人  -->
    <div class="qwui-main_user" v-show="isUser">
      <div class="qwui-select_all clearfix">
        全选
        <label class="qwui-tag_checkbox active all" @click.self="selectAll">
          <input type="checkbox" v-model="checkAll">
          <span @click.self="selectAll"></span>
        </label>
      </div>
      <ul class="qwui-user_list" ref="personList">
        <li class="qwui-user_list_item clearfix" v-for="(item,index) in loadMore.pageConfig.pageData" v-if="isUser">
          <img class="qwui-list_item_headpic" v-if="item.headPic&&(item.headPic != '0')" :src="item.headPic">
          <div v-else class="qwui-user_default_img"></div>
          <span class="qwui-list_item_name">{{item.personName}}</span>
          <label :for="item.userId" class="qwui-tag_checkbox">
            <input type="checkbox"  v-model="userCheckList" :value="item" :id="item.userId" :disabled="isDisabled(item)">
            <span></span>
          </label>
        </li>
        <li>
          <load-more :loadmore="loadMore"
                     @loadFinished="requestFinished"
                     ref="loadMoreFun"></load-more>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import loadMore from './loadMore.vue'
  import checkList from '../checkList/checkList.vue'
  import {isVipGold} from '@/assets/js/vip-manager';
  import {getRootCompanyName,getDeptGroup} from '../api/getData'
  export default {
    props:{
      //是否是选择成员，true表示是，false表示选择部门
      isUser:{
        type:Boolean,
        default:false
      },
      loadMore:{
        type:Object
      },
      //默认选中人员
      defaultUser:{
        type:Array,
        default:function(){
          return []
        }
      },
      //默认选中部门
      defaultDept:{
        type:Array,
        default:function(){
          return []
        }
      },
      //需要取消复选框的某个特定部门
      deleteSpecialDept:{
        type:Object,
        default:function(){
          return {}
        }
      },
      //选择的部门是否超过限制
      isOverDept:{
        type:Boolean,
        default:false
      },
      //选择的人员是否超过限制
      isOverUser:{
        type:Boolean,
        default:false
      },
      //人数最大限制
      maxUser:{
        type:Number,
        default:1000
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
      //限制的所选标签id组成的string
      intersectionUserIds:{
        type:String,
        default:''
      },
    },
    components:{
      loadMore,
      checkList
    },
    data(){
      return{
        dataBase,
        companyName:'', //公司名称
        departments:[], //根级部门数组
        userCheckList:this.defaultUser, //选择的人员
        loadFinished:true, //控制接口请求，避免多次
        deptIndex:'',//记录部门当前选中
        checkAll:false,//全选
      }
    },
    mounted () { //容器里的下拉加载
      this.box = this.$refs.personList
      this.box.addEventListener('scroll', () => {
        if((this.box.scrollTop + this.box.offsetHeight >= this.box.scrollHeight - 5)&&this.loadFinished){
          this.$refs.loadMoreFun.scrollLoadMore();
        }
      }, false)
    },
    created:function () {
      this.getCompanyName();
      if(this.isUser){
        this.loadMore.url = '/contact/selectUserMgrAction!ajaxSearch.action';
        this.loadMore.data = {
          page:1,
          'searchValue.isSettingUser':0,
          'searchValue.deptId':'',
          intersectionDeptIds:this.intersectionDeptIds,
          intersectionTagIds:this.intersectionTagIds,
          intersectionUserIds:this.intersectionUserIds,
          agentCode:this.dataBase.agent
        }
      }
    },
    watch:{
      userCheckList:function (val) {
        if(val.length == 0){
          this.checkAll = false
        }
        this.$emit("userChecked", val);
      },
      defaultUser:function (val) {
        this.userCheckList = val
      },
      isUser:function (val) {
        if(val){
          this.deptIndex = ''
          this.loadMore.url = '/contact/selectUserMgrAction!ajaxSearch.action';
          this.loadMore.data = {
            page:1,
            'searchValue.isSettingUser':0,
            'searchValue.deptId':'',
            intersectionDeptIds:this.intersectionDeptIds,
            intersectionTagIds:this.intersectionTagIds,
            intersectionUserIds:this.intersectionUserIds,
            agentCode:this.dataBase.agent
          }
          this.searchDeptPerson()
        }
      },
      'loadMore.pageConfig.pageData':function (val) {
        if(val.length>0) {
          var self = this, flag = false;
          self.userCheckList.forEach(function (e,index) {
              let findResult = val.find(item => {
                return item.userId == e.userId
              })
              findResult ? self.userCheckList.splice(index, 1, findResult):''
          })
//          //这里会存在一个问题：切换到别的部门时，pageSize重置为10，这样就看不到之后的人员数据，无法判断当前是否全选
//          val.forEach(function (e) {
//            if(!self.userCheckList.find(item => {
//              return item.userId == e.userId
//            })){
//              flag = true;
//              return
//            }
//          })
//          //flag为true表示当前的人员列表里面有还未选中的人，全选置为false
//          self.checkAll = flag ? false : true
        }
      }
    },
    computed:{
      total:function () {
        return this.loadMore.pageConfig.totalRows || 0
      },
    },
    methods:{
      //全选当前部门下的人员
      selectAll(){
        if(this.total <= 0){
          return
        }
        if(!this.checkAll) {
          this.loadMore.data['pageSize'] = 6000;
          this.loadFinished = false;
          this.$refs.loadMoreFun.clearLoadFun();
        } else {
          this.checkAll = false
          let self = this;
          self.loadMore.pageConfig.pageData.forEach((e) => {
            let indexResult = self.userCheckList.findIndex(item => {
              return item.userId == e.userId
            })
            indexResult!=-1 ? self.userCheckList.splice(indexResult,1):''
          })
        }
      },
      //全选之前先判断会不会超出最大限制
      judgeIsOver(){
        let self = this,
          userLength = self.defaultUser.length;
        if(self.judgeLength(self.total)){ //先判断一次长度，如果全选人数已经超出，就不必执行如下操作
          return true
        }
        self.loadMore.pageConfig.pageData.forEach(function (e) {
            self.defaultUser.find(item => {
              return item.userId == e.userId
            }) ?  '' : userLength++
        })
        if(self.judgeLength(userLength)){
          return true
        }
        return false
      },
      judgeLength(userLength){
        let self = this;
        if(userLength > self.maxUser){
          self.dataBase.top_alert('人员超出选择上限，无法全选',false,2000)
          setTimeout(()=>{
            self.checkAll = false
          },1000);
          return true
        }
        return false
      },
      //控制人员是否可以选中
      isDisabled:function (val) {
        return this.isOverUser && this.userCheckList.findIndex(item => {
          return item.userId == val.userId
        }) == -1
      },
      //选中部门
      deptCurrentIndex:function (val) {
        this.deptIndex = val;
      },
      //点击公司名，获取全部人员
      clickCompany:function () {
        if(this.isUser) {
          this.loadMore.data['pageSize'] = 10;
          this.checkAll = false;
          this.loadMore.data['searchValue.deptId'] = '';
          this.$refs.loadMoreFun.clearLoadFun();
        }
      },
      //点击部门复选框之后，返回 选择的部门属性+是否选中
      deptChecked:function (val,isChecked,isOption) {
        this.$emit("deptChecked", val, isChecked,isOption);
      },
      //选择成员时，点击部门加载对应人员
      deptClick:function (val) {
        this.searchDeptPerson(val)
      },
      //初始化获取公司名
      getCompanyName:function () {
        var self = this;
        var promise = new Promise(resolve => {
          getRootCompanyName().then(res => {
            if (res.code == '0') {
              res.data.orgList.length>0 ? self.companyName = res.data.orgList[0].nodeName : '';
              resolve();
            }
          }).catch(err => {
            console.log('错误',err)
          })
        });
        promise.then(function(){ //公司名加载完，加载全部部门
          self.getDepts();
        });
      },
      //初始化获取全部根级部门
      getDepts:function () {
        var self = this;
        var promise = new Promise(resolve => {
          getDeptGroup('',self.intersectionDeptIds,self.intersectionTagIds).then(res => {
            if (res.code == '0') {
              self.departments = res.data.orgList;
              //适配默认数据（默认数据只有deptId）
              self.defaultDept.forEach(function (e) {
                if(e.deptId){
                  let findResult = self.departments.find(item => {
                    return item.nodeId == e.deptId
                  })
                  findResult? self.$emit("deptChecked", findResult, 1, true):''
                }
              })
              resolve();
            }
          }).catch(err => {
            console.log('错误', err)
          });
        })
        promise.then(function(){ //初始化人员
          if(self.isUser) {
            self.searchDeptPerson();
          }
        });
      },
      //点击部门，加载人员
      searchDeptPerson:function (deptId) {
        this.loadMore.data['pageSize'] = 10;
        this.checkAll = false;
        this.loadMore.data['searchValue.deptId'] = deptId?deptId:'';
        this.loadMore.pageConfig.pageData = [];
        this.loadFinished = false;
        this.$refs.loadMoreFun.clearLoadFun();
      },
      //接口请求完成
      requestFinished:function () {
        this.loadFinished = true;
        if(this.loadMore.data['pageSize'] == 6000){ //全选
          let self = this;
          if(self.judgeIsOver()){
            return
          }
          if(!isVipGold(self.dataBase.agent?self.dataBase.agent:self.dataBase.agentCode) && self.loadMore.pageConfig.pageData.length > 300){
            self.dataBase.top_alert('超出300人限制',false,2000)
            setTimeout(()=>{
              self.checkAll = false
            },1000);
          } else if(isVipGold(self.dataBase.agent?self.dataBase.agent:self.dataBase.agentCode) && self.loadMore.pageConfig.pageData.length > 5000){
            self.dataBase.top_alert('超出5000人限制',false,2000)
            setTimeout(()=>{
              self.checkAll = false
            },1000);
          } else {
            self.loadMore.pageConfig.pageData.forEach((e) => {
              let findResult = self.userCheckList.find(item => {
                return item.userId == e.userId
              })
              findResult ? '': self.userCheckList.splice(self.userCheckList.length,0,e)
            })
            self.checkAll = true
          }
        }
      }
    }
  }
</script>
<style scoped>
  .qwui-main_dept{
    border-right: 1px solid #e4e4e4;
  }
  .qwui-main_dept.active{
    float: left;
  }
  .qwui-dept_user_title{
    margin-left: 20px;
    padding: 15px 0 10px;
    cursor: pointer;
  }
  .qwui-dept_left_list{
    height: 361px;
    overflow-x: hidden;
  }
  .qwui-dept_left_list.active{
    float: left;
    width: 259px;
  }
  .qwui-dept_list{
    display: inline-block;
    position: relative;
    height: auto;
    width: 100%;
    min-width: 242px;
    overflow: auto;
    list-style: none outside none;
  }
  .qwui-main_user{
    float: left;
    width: 340px;
  }
  .qwui-select_all{
    margin: 6px 0 0 20px;
    padding-right: 9px;
    line-height: 40px;
    border-bottom: 1px solid #e4e4e4;
  }
  .qwui-user_list{
    position: relative;
    height: 360px;
    overflow-x: hidden;
    overflow-y: scroll;
    list-style: none outside none;
  }
  .qwui-user_list_item{
    margin-left: 20px;
    line-height: 40px;
    border-bottom: 1px solid #e4e4e4;
  }
  .qwui-list_item_headpic{
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 3px;
    vertical-align: middle;
    background: orange;
  }
  .qwui-user_default_img{
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 3px;
    vertical-align: middle;
    background: url('~assets/images/user_icon.png') no-repeat center;
    background-size: 24px 24px;
  }
  .qwui-list_item_name{
    margin-left: 10px;
  }
  .qwui-tag_checkbox{
    float: right;
  }
  .qwui-tag_checkbox.all span{
    margin-right: 14px;
  }
  .qwui-tag_checkbox input{
    visibility: hidden;
  }
  .qwui-tag_checkbox span{
    display: inline-block;
    float: right;
    width: 18px;
    height: 18px;
    margin: 11px 15px 0 0;
    background: url(../../../assets/images/checkbox_off.png) no-repeat center;
  }
  .qwui-tag_checkbox input:checked + span{
    background: url(../../../assets/images/checkbox_on.png) no-repeat center;
  }
  .qwui-tag_checkbox input:disabled + span{
    width: 16px;
    height: 16px;
    border: 1px solid #CBCBCB;
    background: #EDEDED;
  }
</style>

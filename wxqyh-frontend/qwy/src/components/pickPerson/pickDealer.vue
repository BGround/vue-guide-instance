<template>
  <div class="qwui-pick_person_mask" v-if="show">
    <div class="qwui-pick_person">
      <!--  标题start  -->
      <div class="qwui-title">
        <span>选择经销商</span>
        <i class="qwui-close" @click="closeThis">×</i>
      </div>
      <!--  标题end  -->

      <!--  内容start  -->
      <div class="qwui-main_content">
        <!--  搜索输入框+选人结果显示  -->
        <div class="qwui-main_result" ref="inputChange">
          <div class="qwui-selected_input" @click.self="inputFocus = !inputFocus">


            <!--  管理员选择  -->
            <!--<div class="qwui-inline" v-for="(item,index) in specialAdmin" :key="index">-->
              <!--<div class="qwui-dept_selected">-->
                <!--<div class="qwui-icon admin"></div>-->
                <!--{{item.personName}}-->
                <!--<span class="qwui-selected_close" @click="deleteAdmin(item,index)">×</span>-->
              <!--</div>-->
            <!--</div>-->

            <!--  输入框  -->
            <input type="text"
                   v-model="keyWord"
                   placeholder="输入搜索条件"
                   v-focus="inputFocus"
                   class="qwui-input"
                   @input="updateValue($event.target.value)"
                   @blur="blur"
                   @focus="focus"
                   :class="{'active':inputShow}">
          </div>
        </div>
        <!--  tab  -->
        <!--<div class="qwui-tab">-->
          <!--<tab-group selected="0" :full="tabs.length > 1 ? false : true">-->
            <!--<tab :text="item.text"-->
                 <!--v-for="(item,index) in tabs"-->
                 <!--:key="item.id"-->
                 <!--:special="item.text == '高级筛选'"-->
                 <!--@click="clickTab"></tab>-->
          <!--</tab-group>-->
        <!--</div>-->
        <div class="qwui-content_height">

          <!--  批量导入组件  -->
          <batch v-if="currentIndex == '批量导入'"
                 :defaultUser="specialUsers"
                 :maxUser="maxUser"
                 :intersectionDeptIds="intersectionDeptIds"
                 :intersectionTagIds="intersectionTagIds"
                 :intersectionUserIds="intersectionUserIds"
                 @batchSuccess="batchSuccess"></batch>

        <!--  选择经销商组件  -->
        <dealer v-if="currentIndex == '管理员'"
               @adminChecked="adminChecked"
               :defaultAdmin="defaultDealer"
               :defaultUser="specialUsers"
               :isOverAdmin="isOverUser"
               :maxUser="maxUser"
               :deleteSpecialAdmin="deleteSpecialAdmin"
               ref="admin"></dealer>



        </div>
      </div>
      <!--  内容end  -->

      <!--  底部按钮start  -->
      <div class="qwui-bottom" style="text-align: center;">
        <!--<span class="qwui-select_result">已选&nbsp;&nbsp;{{selectResult}}</span>-->
        <!--<input type="button"-->
               <!--value="重置已选"-->
               <!--class="qwui-button_operation clear"-->
               <!--@click="clearAll">-->
        <input type="button"
               value="确定"
               class="qwui-button_operation sure"
               @click="chooseDone">
      </div>
      <!--  底部按钮end  -->

      <!--  搜索框查询结果列表start  -->
      <ul class="qwui-result_list" ref="resultList" v-show="resultShow">
        <li class="qwui-result_list_item"
            v-for="(item,index) in searchMore.pageConfig.pageData"
            :key="item.id"
            @click="addToInput(item)">
          <img v-if="item.userId && item.headPic && item.headPic!='0'" class="qwui-icon dept" :src="item.headPic">
          <div v-if="item.userId && item.headPic == '0'" class="qwui-icon default"></div>
          <div v-if="item.nodeId" class="qwui-icon dept"></div>
          {{item.userId?item.personName:item.nodeName}}
        </li>
        <li>
          <load-more :loadmore="searchMore"
                     :isShowTips=isShowTips
                     @showMsgFromLoadMore="searchFinished"
                     ref="loadMoreFun"></load-more>
        </li>
      </ul>


      <ul class="qwui-result_list" v-show="positions.length > 0 && isPosition">
        <li class="qwui-result_list_item"
            v-for="(item,index) in positions"
            :key="item.name"
            @click="addPosition(item)">
          {{item.name}}
        </li>
      </ul>
      <!--  搜索框查询结果列表end  -->
    </div>

  </div>
</template>
<script>
  import tab from '../qwuiTab/tab.vue'
  import tabGroup from '../qwuiTab/tabGroup.vue'
  import seniorSelect from './item/seniorSelect.vue'
  import batch from './item/batch.vue'
  import position from './item/position.vue'
  import tag from './item/tag.vue'
  import deptUser from './item/deptUser.vue'
  import dealer from './item/dealer.vue'
  import loadMore from './item/loadMore.vue'

  import {getDeptByKeyword,getPositionByKey} from './api/getData'
  export default {
    props:{
      show:{
        type:Boolean,
        default:false,
      },
      //初始化的部门
      defaultDepts:{
        type:Array,
        default:function(){
          return []
        }
      },
      //初始化的标签
      defaultTags:{
        type:Array,
        default:function(){
          return []
        }
      },
      //初始化的人员
      defaultUsers:{
        type:Array,
        default:function(){
          return []
        }
      },
      //初始化的职位
      defaultPosition:{
        type:Array,
        default:function(){
          return []
        }
      },
      //初始化的管理员
      defaultAdmin:{
        type:Array,
        default:function(){
          return []
        }
      },
      /**
       * 初始化tab栏，最多包含六个[
       {text:'部门'},
       {text:'成员'},
       {text:'标签'},
       {text:'标签成员'},
       {text:'批量导入'},
       {text:'高级筛选'},
       ]
       */
      functionTab:{
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
      //职位最大限制
      maxPosition:{
        type:Number,
        default:100
      },
      //标签页：是否只显示人员
      onlyUser:{
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
    directives: { //自定义指令，点击聚焦输入框
      focus: {
        update: function (el, {value}) {
          if (value) {
            el.focus();
          }
        }
      }
    },
    data(){
      return{
        dataBase,
        tabs:[],
        defaultDealer:[],
        currentIndex:'部门', //记录当前点击
        inputFocus:false, //聚焦输入框
        timer:null, //延时计时器
        resultShow:false, //控制搜索结果列表显示
        isShowTips:false, //搜索结果列表不需要显示总数
        keyWord:'', //搜索内容
        //标签人员、成员 加载更多
        loadMore:{
          url:"",//请求路径
          pageIndexName:"page",//不同应用不同分页参数
          data:{ //ajax入参数据
          },
          pageConfig:{},
        },
        //查询列表 加载更多
        searchMore:{
          url:"",//请求路径
          pageIndexName:"page",//不同应用不同分页参数
          data:{ //ajax入参数据
          },
          pageConfig:{},
        },
        //记录成员
        specialUsers:this.defaultUsers.slice(0), //选择成员---->选中人员组成的数组，包括头像名字等信息
        deptSelected:this.defaultDepts.slice(0), //选择部门---->选中部门组成的数组，包括节点名等信息
        tagList:this.defaultTags.slice(0), //选中的标签数组
        specialPosition:this.defaultPosition.slice(0),//选中职位
        specialAdmin:this.defaultAdmin.slice(0),//选中管理员
        positions:[],//搜索的职位数组
        deleteSpecialDept:{}, //点击删除部门，删除的item
        deleteSpecialUser:{}, //点击删除人员，删除的item
        deleteSpecialAdmin:{}, //点击删除管理员，删除的item
        //记录是否超出，人员和管理员一起计算
        isOverUser:false,
        isOverTag:false,
        isOverDept:false,
        dealerItem:{},
      }
    },
    computed:{
      //已选结果统计
      selectResult(){
        let temp = "";
        if(this.deptSelected.length + this.tagList.length + this.specialAdmin.length +
          this.specialUsers.length + this.specialPosition.length == 0){
          temp = "0"
        } else {
          this.deptSelected.length > 0 ? temp += this.deptSelected.length + "部门    " : '';
          this.tagList.length > 0 ? temp += this.tagList.length + "标签   " : '';
          this.specialUsers.length > 0 ? temp += this.specialUsers.length + "成员   " : '';
          this.specialPosition.length > 0 ? temp += this.specialPosition.length + "职位  " : ''
          this.specialAdmin.length > 0 ? temp += this.specialAdmin.length + "管理员  " : ''
        }
        return temp
      },
      isUser:function () {
        return this.currentIndex == '部门' ? false : true
      },
      isTagOnly:function () {
        return this.currentIndex == '标签成员' ? true : false
      },
      //是否有选中，改变输入框样式
      inputShow:function () {
        return this.deptSelected.length>0
          || this.tagList.length>0
          || this.specialUsers.length>0
          || this.specialPosition.length>0
          || this.specialAdmin.length>0
      },
      //是否只有职位选择
      isPosition:function () {
        return this.functionTab.length == 1 && this.functionTab[0].text == '职位'
      },
      //限制的所选部门id组成的string
      intersectionDeptIds(){
        return this.intersectionDept.map(val=>{
          return val.deptId
        }).join('|')
      },
      //限制的所选标签id组成的string
      intersectionTagIds(){
        return this.intersectionTag.map(val=>{
          return val.tagId
        }).join('|')
      },
      //限制的所选成员id组成的string
      intersectionUserIds(){
        return this.intersectionUser.map(val=>{
          return val.userId
        }).join('|')
      },
    },
    watch:{
      show:function (val) {
        if(val){
          this.filterTab(this.functionTab);
          this.currentIndex = this.tabs[0].text;
          //console.log(this.currentIndex)
          this.specialUsers=this.defaultUsers.slice(0);
          this.deptSelected=this.defaultDepts.slice(0);
          this.specialPosition=this.defaultPosition.slice(0);
          this.specialAdmin=this.defaultAdmin.slice(0);
         // console.log(this.specialAdmin)
          this.tagList=this.defaultTags.slice(0);
        }
      },
      'specialUsers.length':{
        handler(val) {
          if (val + this.specialAdmin.length == this.maxUser) {
            this.dataBase.top_alert('人员已达选择上限，将不能再添加', true, 2000)
          }
          this.isOverUser = (val + this.specialAdmin.length) >= this.maxUser ? true : false
        },
        deep:true
      },
      'tagList.length':{
        handler(val) {
          if (val == this.maxTag) {
            this.dataBase.top_alert('标签已达选择上限，将不能再添加', true, 2000)
          }
          this.isOverTag = val >= this.maxTag ? true : false
        },
        deep:true
      },
      'deptSelected.length':{
        handler(val) {
          if (val == this.maxDept) {
            this.dataBase.top_alert('部门已达选择上限，将不能再添加', true, 2000)
          }
          this.isOverDept = val >= this.maxDept ? true : false
        },
        deep:true
      },
      'specialAdmin.length':{
        handler(val) {
          //console.log('dd'+val)
          if (val + this.specialUsers.length == this.maxUser) {
            this.dataBase.top_alert('人员已达选择上限，将不能再添加', true, 2000)
          }
          this.isOverUser = (val + this.specialUsers.length) >= this.maxUser ? true : false
          //this.isOverUser = true
        },
        deep:true
      },
    },
    updated () { //容器里的下拉加载
      if(this.show) {
        this.boxing = this.$refs.resultList;
        this.boxing.addEventListener('scroll', () => {
          if (this.boxing.scrollTop + this.boxing.offsetHeight >= this.boxing.scrollHeight) {
            this.$refs.loadMoreFun.scrollLoadMore();
          }
        }, false)
      }
    },
    methods:{
      //将 特定人员 变成 成员， 标签人员 变成 标签成员
      filterTab(val){
        this.tabs = [];
        for(let item of val){
          this.tabs.push({
            text: item.text == '特定人员'
              ? '成员'
              : item.text == '标签人员'
                ? '标签成员'
                : item.text
          })
        }
        let userIndex = this.tabs.findIndex(item => {
          return item.text == '成员'
        });
        if(userIndex != -1){
          this.tabs.splice(userIndex,1);
          this.tabs.splice(0, 0, {text:'成员'})
        }
        let deptIndex = this.tabs.findIndex(item => {
          return item.text == '部门'
        });
        if(deptIndex != -1){
          this.tabs.splice(deptIndex,1);
          this.tabs.splice(0, 0, {text:'部门'})
        }
      },
      //input失去焦点
      blur:function () {
        var self = this;
        setTimeout(function () {
          self.resultShow = false
        },200)
      },
      focus:function () {
/*        if(this.searchMore.pageConfig.pageData && this.searchMore.pageConfig.pageData.length > 0) {
          document.querySelectorAll('.qwui-result_list')[0].style.top = (this.$refs.inputChange.clientHeight + 25)+'px'
          this.resultShow = true
        }*/
      },
      //监听input
      updateValue:function (value) {
       // console.log(this.isPosition)

        if(!this.isPosition) {
          document.querySelectorAll('.qwui-result_list')[0].style.top = (this.$refs.inputChange.clientHeight + 25) + 'px'
          clearTimeout(this.timer);
          var self = this;
          self.timer = setTimeout(function () {
            self.resultShow = false;
            self.searchMore.pageConfig.pageData ? self.searchMore.pageConfig.pageData = [] : '';
            self.searchMore.url = '/dealer/dealerAction!getAllDealerFullNameListBySearch.action'
            self.searchMore.data = {
              'keyWord': value,
            };
            self.$refs.loadMoreFun.clearLoadFun();
          }, 1000);
        }
      },
      //点击加入到input框中
      addToInput:function (val) {
        if(val.userId && !this.isOverUser){
          let isFind = this.specialAdmin.findIndex(item => {
            return item.userId == val.userId
          })
          isFind!=-1 ? '':this.specialAdmin.splice(this.specialAdmin.length,0,val)
        }
        this.resultShow = false
        this.keyWord = ''
      },
      //搜索职位加入到input框
      addPosition:function (val) {
        let temp = {
          id:val.id,
          name:val.name
        };
        if(this.specialPosition.length < this.maxPosition){
          let isFind = this.specialPosition.findIndex(item => {
            return item.id == val.id
          })
          isFind!=-1 ? '':this.specialPosition.splice(this.specialPosition.length,0,temp)
        }
        this.positions = []
        this.keyWord = ''
      },
      //搜索结果列表 loadMore组件返回结果
      searchFinished:function (val) {
        console.log(val)
        this.defaultDealer = val.dealerVOs;

      },
      //选择完成，点击确定
      chooseDone:function () {
        this.$emit('chooseDone',this.dealerItem)
      },
      //清空已选
      clearAll(){
        this.deptSelected.splice(0,this.deptSelected.length);
        this.tagList.splice(0,this.tagList.length);
        this.specialUsers.splice(0,this.specialUsers.length);
        this.specialPosition.splice(0,this.specialPosition.length);
        this.specialAdmin.splice(0,this.specialAdmin.length);
        this.$refs.deptUser ? this.clearSonComponents(this.$refs.deptUser) : '';
        this.$refs.admin ? this.clearSonComponents(this.$refs.admin) : '';
        this.$refs.tag ? this.$refs.tag.checkList = [] : '';
        this.dealerItem = {};
      },
      //递归清空子组件
      clearSonComponents(val){
        if(val.checkList && val.checkList.length > 0){
          val.checkList = []
        }
        if(val.$children && val.$children.length > 0){
          for(let temp of val.$children){
            this.clearSonComponents(temp)
          }
        }
      },
      //选中标签列表
      tagCheckedList:function (val) {
        this.tagList = val
      },
      //删除unchecked的某个数据（人员或部门）
      deleteSpecial:function (val) {
        let isFind;
        if(val.menberType == "1"){
          isFind = this.specialUsers.findIndex(item => {
            return item.userId == val.menberId
          })
          isFind!=-1 ? this.specialUsers.splice(isFind,1):''
        } else if(val.menberType == "2"){
          isFind = this.deptSelected.findIndex(item => {
            return item.nodeId == val.menberId
          })
          isFind!=-1 ? this.deptSelected.splice(isFind,1):''
        }
      },
      //取消全选之后需要删除的数据
      deleteAllItems:function (val) {
        var self = this;
        let isFind = -1;
        val.forEach(function (e) {
          isFind = -1
          if(e.menberType == "1"){
            isFind = self.specialUsers.findIndex(item => {
              return item.userId == e.menberId
            })
            isFind!=-1 ? self.specialUsers.splice(isFind,1):''
          } else if(e.menberType == "2"){
            isFind = self.deptSelected.findIndex(item => {
              return item.nodeId == e.menberId
            })
            isFind!=-1 ? self.deptSelected.splice(isFind,1):''
          }
        })
      },
      //标签选择人员返回的，可能包括人员和部门
      tagChecked:function (val) {
        var self = this;
        let isFind = ''; //在人员数组和部门数组中查找是否存在
        val.forEach(function (e) {
          isFind = '';
          if(e.menberType == "1") {
            isFind = self.specialUsers.find(item => {
              return item.userId == e.menberId
            })

            isFind ? '' : self.specialUsers.splice(self.specialUsers.length, 0, {
              'userId': e.menberId,
              'personName': e.name,
              'headPic': e.headPic
            });
          } else if(e.menberType == "2") {
            isFind = self.deptSelected.find(item => {
              return item.nodeId == e.menberId
            })

            isFind ? '' : self.deptSelected.splice(self.deptSelected.length, 0, {
              'id': '',
              'nodeId': e.menberId,
              'nodeName': e.name,
            });
          }
        })
      },
      //点击选择部门复选框，返回属性和是否选中，ipOperation为true表示对传进的默认部门进行处理，变成对应的包含全部属性的数据
      deptChecked:function (val,isChecked,isOperation) {
        this.deleteSpecialDept = {};
        let tempIndex = -1;
        if(isOperation){
          tempIndex = this.deptSelected.findIndex(function(item){
            return item.deptId == val.nodeId
          });
          this.deptSelected = this.deptSelected.filter(function(item){
            return item.deptId != val.nodeId
          });
        }
        if(isChecked == 1){
          let isFind = this.deptSelected.find(function(item){
            return item.nodeId == val.nodeId
          });
          if(!isFind){
            tempIndex != -1
              ? this.deptSelected.splice(tempIndex,0,val)
              : this.deptSelected.splice(this.deptSelected.length,0,val);
          }
        } else {
          this.deptSelected = this.deptSelected.filter(function(item){
            return item.nodeId != val.nodeId
          });
        }
      },
      //删除部门
      deleteDept:function (item,index) {
        this.deptSelected.splice(index,1)
        this.deleteSpecialDept = item
      },
      //删除标签
      deleteTag:function (index) {
        this.tagList.splice(index,1)
      },
      //返回选择成员 组成的数组
      userChecked:function (val) {
        this.specialUsers = val
      },
      //删除人员
      deleteUser:function (item,index) {
        this.specialUsers.splice(index,1)
        this.deleteSpecialUser = item
      },
      //删除职位
      deletePosition(index){
        this.specialPosition.splice(index,1)
      },
      //删除管理员
      deleteAdmin(item,index){
        this.specialAdmin.splice(index,1)
        this.deleteSpecialAdmin = item;
      },
      //批量导入成功，返回数组
      batchSuccess:function (val) {
        var self = this , isFind;
        val.forEach(function (e) {
          isFind = '';
          isFind = self.specialUsers.find(function(item){
            return item.userId == e.userId
          });
          isFind?'':self.specialUsers.splice(self.specialUsers.length,0,e);
        })
        //this.specialUsers = this.specialUsers.concat(val)
      },
      //返回选择职位
      positionChecked:function (val) {
        this.specialPosition = val
      },
      //返回选择管理员数据，是否选中
      adminChecked:function (val, isChecked) {
       // console.log(val.userId)
       // console.log(val)
       //console.log(isChecked)
        //console.log()
        this.dealerItem = val;
        //console.log(this.specialAdmin)

      },
      removeObjArr:function(arr,id,paramId){
      let index = arr.findIndex(item=>item[id] === paramId);
      if(index >= 0) {
        arr.splice(index,1);
      }
     },
      // 删除重复对象数据
      delObjArr:function(arr,id){
      let hash = {};
      var newArr = arr.reduce((item, next) => {
        hash[next[id]] ? '' : hash[next[id]] = true && item.push(next);
        return item
      }, []);
      return newArr;
      },
      //高级搜索返回人员数组
      seniorUserChecked:function (val) {
        this.specialUsers = val
      },
      closeThis:function () {
        this.$emit('closeThis')
      },
      clickTab:function (val) {
          if(val==='部门') {
              // this.dataBase.top_alert('注意：选择部门时将对部门全员推送信息，不可与标签组合使用！', false, 8000)
              this.$message('注意：选择部门时将对部门全员推送信息，不可与标签组合使用！');
          }else if(val==='成员') {
              // this.dataBase.top_alert('注意：选择成员时针对具体成员进行消息推送！', false, 8000)
              this.$message('注意：选择成员时针对具体成员进行消息推送！');
          } else if(val==='标签') {
              // this.dataBase.top_alert('注意：选择标签时将对所有标签内人员推送信息，不可与部门组合使用！', false, 8000)
              this.$message('注意：选择标签时将对所有标签内人员推送信息，不可与部门组合使用！');
            // _.alert('提示', '标签中的岗位包含本岗位的全国人员')
          }else if(val==='标签成员') {
              // this.dataBase.top_alert('注意：选择标签成员时将对所有标签内成员推送信息！', 'warning', 8000)
              this.$message('注意：选择标签成员时将对所有标签内成员推送信息！');
          }
        this.currentIndex = val
      },
    },
    components:{
      tab,
      tabGroup,
      seniorSelect,
      batch,
      position,
      tag,
      deptUser,
      dealer,
      loadMore,
    }
  }
</script>
<style scoped>
  .qwui-pick_person_mask{
    position: fixed;
    z-index:1200;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    overflow-y: scroll;
    overflow-x: hidden;
    background: rgba(0,0,0,0.5);
  }
  .qwui-pick_person{
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    height: auto;
    width: 600px;
    overflow: auto;
    background: #f7f7f7;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
    border-radius: 2px;
    transform: translate(-50%,-50%);
    z-index: 1101;
  }
  .qwui-pick_person::-webkit-scrollbar{
    width:0!important;
    height:0!important;
  }
  .qwui-title{
    position: relative;
    height: 46px;
    padding-left: 20px;
    color: #333;
    font-size: 18px;
    line-height: 45px;
    text-align: left;
    background: #f6f6f6;
    border-bottom: 1px solid #dddddd;
  }
  .qwui-close{
    position: absolute;
    right: 0;
    width: 50px;
    text-align: center;
    color: #bbb;
    font-style: normal;
    font-size: 28px;
    cursor: pointer;
  }
  .qwui-main_content{
    width: 100%;
    background: #fff;
  }
  .qwui-main_result{
    padding: 20px;
  }
  .qwui-inline{
    display: inline;
    vertical-align: middle;
  }
  .qwui-selected_input{
    background: #fff;
    border: 1px solid #E5E5E5;
    padding: 5px;
    min-height: 36px;
    max-height: 108px;
    overflow: auto;
    box-sizing: border-box;
  }
  .qwui-dept_selected{
    display: inline-block;
    width: auto;
    max-width: 250px;
    height: 24px;
    margin: 2px 5px 2px 0;
    line-height: 24px;
    list-style: none;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 3px;
    vertical-align: top;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .qwui-icon{
    display: inline-block;
    width: 26px;
    height: 24px;
    margin-right: 5px;
    list-style: none;
    vertical-align: top;
  }
  .qwui-icon.dept{
    background: url(../../assets/images/dept_icon.png) no-repeat center;
  }
  .qwui-icon.tag{
    background: url(../../assets/images/tag_icon.png) no-repeat center;
  }
  .qwui-icon.position{
    background: url(../../assets/images/position_icon.png) no-repeat center;
  }
  .qwui-icon.admin{
    background: url(../../assets/images/admin_icon.png) no-repeat center;
    background-size: 22px 22px;
  }
  .qwui-icon.default{
    background: url(../../assets/images/user_icon.png) no-repeat center;
    background-size: 22px 22px;
  }
  .qwui-selected_close{
    display: inline-block;
    width: 18px;
    height: 18px;
    margin: 3px 5px 0 10px;
    line-height: 17px;
    text-align: center;
    color: #afafaf;
    font-size: 19px;
    font-weight: 600;
    cursor: pointer;
    vertical-align: text-bottom;
    border-radius: 100%;
    opacity: 1;
  }
  .qwui-input{
    width: 520px;
    padding: 0 5px;
    line-height: 20px;
    vertical-align: middle;
    border: none;
  }
  .qwui-input.active{
    width:150px;
    margin-top: 8px;
  }
  .qwui-tab{
    padding: 0 10px;
  }
  .qwui-content_height{
    position: relative;
    height: 407px;
    width: 100%;
    border-top: 1px solid #E5E5E5;
    border-bottom: 1px solid #E5E5E5
  }
  .qwui-bottom{
    position: relative;
    padding: 10px;
    text-align: right;
    background: #fff;
  }
  .qwui-select_result{
    position: absolute;
    left: 20px;
    top: 16px;
    color: #999;
  }
  .qwui-button_operation{
    margin-right: 12px;
    padding: 0 20px;
    font-size: 14px;
    line-height: 30px;
    border-radius: 3px;
    cursor: pointer;
  }
  .qwui-button_operation.sure{
    background: #C31725;
    border: 1px solid #C31725;
    color: #fff;
  }
  .qwui-button_operation.clear{
    color: #333;
    background-color: #fbfbfb;
    border: 1px solid #e5e5e5;
  }
  .qwui-button_operation:hover{
    opacity: 0.8;
  }
  .qwui-result_list{
    z-index: 1101;
    display: block;
    position: absolute;
    max-height: 260px;
    top: 98px;
    left: 20px;
    width: 558px;
    padding-bottom: 10px;
    border: 1px solid #ddd;
    background: #fff;
    overflow: auto;
  }
  .qwui-result_list_item{
    height: 26px;
    line-height: 26px;
    padding: 2px 0 2px 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    overflow: hidden;
  }
  .qwui-result_list_item:hover{
    background: #ececec;
  }
</style>

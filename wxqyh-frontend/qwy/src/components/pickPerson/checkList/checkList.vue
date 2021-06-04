<template>
    <li class="qwui-dept_list_item clearfix" >
      <div class="qwui-dept_list_item_height"
           :class="{'active':currentIndex == itemData.nodeId}">&nbsp;</div>
      <div class="qwui-dept_list_item_content" @click="loadChildren(itemData)">
        <!--  有子集  -->
        <i class="qwui-see_child" :class="{'active':isExpand}" v-if="itemData.hasChildrent == 1"></i>
        <div class="qwui-dept_list_item_icon"></div>
        <span class="qwui-dept_list_item_name">{{itemData.nodeName}}</span>
        <span class="qwui-user_checkbox active" ></span>
        <label :for="itemData.nodeId" class="qwui-tag_checkbox" v-if="!isUser" @click.stop>
          <input type="checkbox"  v-model="checkList" :value="itemData" :id="itemData.nodeId" :disabled="isDisabled(itemData)">
          <span ></span>
        </label>
      </div>
        <ul class="qwui-dept_list" v-if="itemData.hasChildrent && childrenList.length>0 && isExpand">
         <check-list  :itemData="item"
                      :isUser="isUser"
                      :defaultDept="defaultDept"
                      :deleteSpecialDept="deleteSpecialDept"
                      :currentIndex="currentIndex"
                      :isOverDept="isOverDept"
                      @deptChecked="childDeptChecked"
                      @deptClick="childDeptClick"
                      @currentIndex="childCurrentIndex"
                      v-for="(item,index) in childrenList"
                      :key="item.deptId"></check-list>
        </ul>
    </li>
</template>
<script>
  /**
   * *递归组件，部门使用
   */
  import {getDeptGroup} from '../api/getData'
  export default {
    name:'check-list',
    props:{
      itemData:{
        type:Object,
        default:function(){
          return {}
        }
      },
      //是否是选择成员，true表示是，false表示选择部门
      isUser:{
        type:Boolean,
        default:false,
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
      //当前选中部门，用来控制hover样式
      currentIndex:{
        type:String,
        default:''
      },
      //选择的部门是否超过限制
      isOverDept:{
        type:Boolean,
        default:false
      },
    },
    data(){
      return{
        checkList:[], //选中的部门
        childrenList:[], //接口返回的子部门列表
        isExpand:false, //是否展开
      }
    },
    created:function () {
      var self = this;
      if(
        self.defaultDept.filter(function(item){
          return item.nodeId == self.itemData.nodeId
        }).length > 0 ){
        self.checkList.splice(0,0,self.itemData)
      }
    },
    watch:{
      checkList:function (val) {
        this.$emit("deptChecked", this.itemData, val.length);
      },
      deleteSpecialDept:function (val) {
        if(val && val.nodeId == this.itemData.nodeId){
          this.checkList = []
        }
      },
      defaultDept:function (val) {
        var self = this;
        if(
          val.filter(function(item){
            return item.nodeId == self.itemData.nodeId
          }).length > 0 &&
          self.checkList.length == 0){
          self.checkList.splice(0,0,self.itemData)
        }
      }
    },
    methods:{
      //控制部门是否可以选中
      isDisabled:function (val) {
        return this.isOverDept && this.defaultDept.findIndex(item => {
          return (item.nodeId == val.nodeId) || (item.deptId == val.nodeId)
        }) == -1
      },
      childCurrentIndex:function (val) {
        this.$emit("currentIndex", val);
      },
      //点击展开，调用接口查询子部门
      loadChildren:function (item) {
        this.$emit("currentIndex", item.nodeId);
        if(this.isUser){
          this.$emit("deptClick",item.nodeId)
        }
        this.isExpand = !this.isExpand;
        if(item.hasChildrent == 1 && this.isExpand) {
          getDeptGroup(item.nodeId).then(res => {
            if (res.code == '0') {
              this.childrenList = res.data.orgList
              var self = this;
              //适配默认数据（默认数据只有deptId）
              self.defaultDept.forEach(function (e) {
                if(e.deptId){
                  let findResult = res.data.orgList.find(item => {
                    return item.nodeId == e.deptId
                  })
                  findResult? self.$emit("deptChecked", findResult, 1, true):''
                }
              })
            }
          }).catch(err => {
            console.log('错误', err)
          })
        }
      },
      //子级组件，点击复选框
      childDeptChecked:function (val,isChecked,isOption) {
        this.$emit("deptChecked", val, isChecked, isOption);
      },
      //子级组件，点击加载人员
      childDeptClick:function (val) {
        this.$emit("deptClick",val)
      }
    }
  }
</script>
<style scoped>
  .qwui-dept_list{
    height: auto;
    width: auto;
    min-width: 242px;
    padding-left:25px;
    overflow: auto;
    list-style: none outside none;
  }
  .qwui-dept_list::-webkit-scrollbar{
    width:0 !important;
    height:0 !important;
  }
  .qwui-dept_list::-webkit-scrollbar-thumb{
    background: rgba(0,0,0,0.1) !important;
  }
  .qwui-dept_list_item{
    line-height: 30px;
    white-space: nowrap;
  }
  .qwui-dept_list_item_height{
    position: absolute;
    width: 100%;
    height: 30px;
    left: 0;
    cursor: pointer;
  }
  .qwui-dept_list_item_content{
    position: relative;
    width: auto;
    cursor: pointer;
    padding-left: 35px;
  }
  .qwui-dept_list_item_height:hover{
    background:#ececec
  }
  .qwui-dept_list_item_height.active{
    background: #F7F7F7;
  }
  .qwui-see_child{
    display: inline-block;
    position: absolute;
    left: 20px;
    top: 12px;
    width: 0;
    height: 0;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-left: 8px solid #999;
  }
  .qwui-see_child.active{
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 8px solid #999;
  }
  .qwui-dept_list_item_icon{
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 0 none;
    background: url(../../../assets/images/dept_icon.png) no-repeat center;
    vertical-align: middle;
  }
  .qwui-dept_list_item_name{
    margin-left: 10px;
    padding-right: 20px;
  }
  .qwui-tag_checkbox{
    float: right;
  }
  .qwui-tag_checkbox input{
    visibility: hidden;
  }
  .qwui-tag_checkbox span{
    display: inline-block;
    float: right;
    width: 18px;
    height: 18px;
    margin: 8px 15px 0 0;
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

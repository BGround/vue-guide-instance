<template>
    <li class="qwui-list_item " :class="{'active': checked}">
      <div class="qwui-list_item_content" @click="loadChildren(itemData)">
        <span>{{itemData.dealerFullName}}</span>
        <label style="display: inline-block;float: right;margin: 8px 15px 0 0;width: 18px;height: 18px;"  class="qwui-tag_radio" @click.stop>
          <input type="radio" v-model="checkList" name="dealerFullName" :value="itemData" :id="itemData.userId"  />
          <span></span>
        </label>
      </div>

    </li>

</template>
<script>
  /**
   * *递归组件，管理员使用
   */
  export default {
    name:'admin-list',
    props:{
      // 当前管理员数据
      itemData:{
        type:Object,
        default:function(){
          return {}
        }
      },
      // 所有管理员数据
      totalData:{
        type:Array,
        default:function(){
          return []
        }
      },
      //默认选中管理员
      defaultAdmin:{
        type:Array,
        default:function(){
          return []
        }
      },
      //需要取消复选框的某个特定管理员
      deleteSpecialAdmin:{
        type:Object,
        default:function(){
          return {}
        }
      },
      //选择的管理员是否超过限制
      isOverAdmin:{
        type:Boolean,
        default:false
      },
    },
    data(){
      return{
        checked:true,
        currentIndex:2,
        isTagOnly:true,
        checkList:[], //选中的管理员
        childrenList:[], //子管理员列表
        isExpand:false, //是否展开
        rightPosition: 50, //用户名右间距
      }
    },
    created:function () {
      var self = this;
      self.loadChildren(self.itemData);
      // self.$nextTick(() => {
      //     if(self.$refs.user){
      //       self.rightPosition = 220 - Math.min(self.$refs.user.scrollWidth, 160)
      //     }
      // })
      if(
        self.defaultAdmin.filter(function(item){
          return item.userId == self.itemData.userId
        }).length > 0 ){
        self.checkList.splice(0,0,self.itemData)
      }
    },
    watch:{
      checkList:function (val) {
        this.checkList = val;
        this.$emit("adminChecked", this.itemData, val);
      },
      deleteSpecialAdmin:function (val) {
        if(val && val.userId == this.itemData.userId){
          this.checkList = []
        }
      },
      defaultAdmin:function (val) {
        var self = this;
        if(
          val.filter(function(item){
            return item.userId == self.itemData.userId
          }).length > 0 &&
          self.checkList.length == 0){
          self.checkList.splice(0,0,self.itemData)
        }
      }
    },
    methods:{
      //点击展开，调用接口查询子部门
      loadChildren:function (item) {
        //console.log(item)
        this.isExpand = false;
        if(this.isExpand) {//!item.childrenCount != 0 &&
          this.isExpand = false
        } else {
          this.isExpand = true
          if(this.childrenList.length > 0){
            return
          }
          var self = this;
          self.totalData.forEach(e => {
              if(e.parentId === item.userName){
                  self.childrenList.splice(self.childrenList.length,0,e)
              }
          });
        }
      },
      //子级组件，点击复选框
      childAdminChecked:function (val,isChecked) {
        this.$emit("adminChecked", val, isChecked);
      },
      //控制管理员是否可以选中
      isDisabled:function (val) {
        return this.isOverAdmin && this.defaultAdmin.findIndex(item => {
          return item.userId == val.userId
        }) == -1
      },
    }
  }
</script>
<style scoped>
  .qwui-list{
    height: auto;
    width: auto;
    min-width: 242px;
    padding-left:12px;
    overflow: auto;
    list-style: none outside none;
  }
  .qwui-list::-webkit-scrollbar{
    width:0 !important;
    height:0 !important;
  }
  .qwui-list::-webkit-scrollbar-thumb{
    background: rgba(0,0,0,0.1) !important;
  }
  .qwui-list_item{
    line-height: 30px;
    white-space: nowrap;
  }
  .qwui-list_item_content{
    position: relative;
    width: auto;
    padding-left: 35px;
  }
  .qwui-list_item_content:hover{
    background: #ececec
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
    cursor: pointer;
  }
  .qwui-see_child.active{
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 8px solid #999;
  }
  .qwui-admin_person_name{
    position: absolute;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
  }
  .qwui-admin_person_name.no_user{
    right: 214px;
  }
  .qwui-list_item_headpic{
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-right: 10px;
    border-radius: 3px;
    vertical-align: middle;
  }
  .default_img{
    background: url('~assets/images/user_icon.png') no-repeat center;
    background-size: 24px 24px;
  }
  .qwui-tag_checkbox{
    float: right;
    cursor: pointer;
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

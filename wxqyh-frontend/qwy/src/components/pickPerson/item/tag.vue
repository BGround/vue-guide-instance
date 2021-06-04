<template>
  <div class="qwui-main_tag clearfix">
    <!--  标题栏  -->
    <div class="qwui-tag_title" v-show="!isTagOnly">
      请选择标签
      <span class="qwui-tag_title_ills">（标签可在通讯录管理）</span>
    </div>

    <!--  左边标签列表  -->
    <ul class="qwui-tag_list" :class="{'active':isTagOnly}">
      <li class="qwui-list_item"
          :class="{'active':index == currentIndex}"
          v-for="(item, index) in tags"
          @click="searchTagPerson(item.id,index)">
        <div class="qwui-list_item_img"></div>
        <span class="qwui-list_item_text">{{item.tagName}}</span>
        <label :for="item.id" class="qwui-tag_checkbox" v-show="!isTagOnly">
          <input type="checkbox"  v-model="tagCheckedList" :value="item" :id="item.id" :disabled="isDisabledTag(item)">
          <span></span>
        </label>
      </li>
    </ul>

    <!--  右边人员列表  -->
    <div class="qwui-person_list" v-show="isTagOnly">
      <div class="qwui-select_all clearfix">
        全选
        <label class="qwui-tag_checkbox active all" @click.self="selectAll">
          <input type="checkbox" v-model="checkAll">
          <span @click.self="selectAll"></span>
        </label>
      </div>
      <ul class="qwui-select_list" ref="personList">
        <li class="qwui-select_list_item clearfix" v-for="(item,index) in loadMore.pageConfig.pageData">
          <div class="qwui-list_item_headpic dept_pic" v-if="item.menberType == '2'"></div>
          <img class="qwui-list_item_headpic" v-else-if="(item.menberType == '1')&&item.headPic&&(item.headPic != '0')" :src="item.headPic">
          <div v-else="" class="qwui-user_default_img"></div>
          <span class="qwui-list_item_name">{{item.name}}</span>
          <label :for="item.menberId" class="qwui-tag_checkbox active" @click.self="clickThis(item)">
            <input type="checkbox"  v-model="checkList" :value="item" :id="item.menberId" :disabled="isDisabled(item)">
            <span @click.self="clickThis(item)"></span>
          </label>
        </li>
        <li>
          <load-more :loadmore="loadMore"
                     ref="loadMoreFun"
                     @loadFinished="requestFinished"></load-more>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import loadMore from './loadMore.vue'
  import {getTagGroup,getTagPersons} from '../api/getData'
  export default {
    props:{
      loadMore:{
        type:Object
      },
      //是否选择标签，false，true选择标签人员
      isTagOnly:{
        type:Boolean,
        default:false
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
      //默认选中标签
      defaultTag:{
        type:Array,
        default:function(){
          return []
        }
      },
      //点击删除的某人
      deleteSpecialUser:{
        type:Object,
        default:function(){
          return {}
        }
      },
      //点击删除的部门
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
      //选择的标签是否超过限制
      isOverTag:{
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
      //部门最大限制
      maxDept:{
        type:Number,
        default:500
      },
      //标签页：是否只显示人员
      onlyUser:{
        type:Boolean,
        default:false
      },
      //限制的所选标签id组成的string
      intersectionTagIds:{
        type:String,
        default:''
      },
    },
    data(){
      return{
        dataBase,
        tags:[], //标签列表
        persons:[], //人员列表
        checkList:[], //人员选中列表
        tagCheckedList:this.defaultTag, //标签选中列表
        checkAll:false,
        loadFinished:true, //控制接口请求，避免多次
        currentIndex:0 //当前点击标签，用来赋值样式
      }
    },
    components:{
      loadMore
    },
    created:function () {
      this.getTags();
    },
    watch:{
      checkList:function (val) {
        if(val.length == 0){
          this.checkAll = false
        }
        this.$emit("tagChecked", val);
      },
      tagCheckedList:function (val) {
        this.$emit("tagCheckedList", val);
      },
      isTagOnly:function (val) {
        if(val){
          this.searchTagPerson(this.tags[0].id,0)
        }
      },
      'loadMore.pageConfig.pageData':function (val) {
        if(val.length>0) {
          var self = this, replaceUser, replaceDept;
          self.defaultUser.forEach(function (e) {
            let findResult = val.find(item => {
              return item.menberId == e.userId
            })
            replaceUser = -1;
            if(findResult) { //标签选人中，不同标签下相同的人或部门，id不一样，其他一样，所以要替换checkList
              replaceUser = self.checkList.findIndex(items => {
                return items.menberId == findResult.menberId
              })
              replaceUser != -1
                ? self.checkList.splice(replaceUser, 1, findResult)
                : self.checkList.splice(self.checkList.length, 0, findResult)
            }
          });
          self.defaultDept.forEach(function (e) {
            let findResult = val.find(item => {
              return item.menberId == (e.nodeId ? e.nodeId : e.deptId)
            })
            replaceDept = -1;
            if(findResult) { //标签选人中，不同标签下相同的人或部门，id不一样，其他一样，所以要替换checkList
              replaceDept = self.checkList.findIndex(items => {
                return items.menberId == findResult.menberId
              })
              replaceDept != -1
                ? self.checkList.splice(replaceDept, 1, findResult)
                : self.checkList.splice(self.checkList.length, 0, findResult)
            }
          })
        }
      },
      'deleteSpecialUser':function (val) {
        if(val) {
          let findResult = this.checkList.findIndex(item => {
            return item.menberId == val.userId
          })
          findResult != -1
            ? this.checkList.splice(findResult,1) : '';
          if(this.loadMore.pageConfig.pageData.findIndex(items => {
            return items.menberId == val.userId
            }) != -1){
            this.checkAll = false;
          }
        }
      },
      'deleteSpecialDept':function (val) {
        if(val) {
          let findResult = this.checkList.findIndex(item => {
            return item.menberId == val.nodeId
          })
          findResult != -1
            ? this.checkList.splice(findResult,1) : '';
          if(this.loadMore.pageConfig.pageData.findIndex(items => {
              return items.menberId == val.nodeId
            }) != -1){
            this.checkAll = false;
          }
        }
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
    methods:{
      //控制是否可以选中
      isDisabled:function (val) {
        if(val.menberType == "1") { //人员
          return this.isOverUser && this.defaultUser.findIndex(item => {
            return item.userId == val.menberId
          }) == -1
        } else { //部门
          return this.isOverDept && this.defaultDept.findIndex(item => {
            return item.nodeId == val.menberId
          }) == -1
        }
      },
      //控制标签是否可以选中
      isDisabledTag:function (val) {
        return this.isOverTag && this.defaultTag.findIndex(item => {
          return (item.id == val.id) || (item.tagId == val.id)
        }) == -1
      },
      //点击人员，传给父组件(去掉勾选数据用)
      clickThis:function (val) {
        this.$emit('deleteSpecial',val)
      },
      //初始化获取全部标签
      getTags:function () {
        var self = this;
        var promise = new Promise(resolve => {
          getTagGroup(self.intersectionTagIds).then(res => {
            if (res.code == '0') {
              self.tags = res.data.tagList;
              //适配默认数据（默认数据只有tagId）
              self.defaultTag.forEach(function (e,index) {
                if(e.tagId){
                  let findResult = self.tags.find(item => {
                    return item.id == e.tagId
                  })
                  findResult? self.tagCheckedList.splice(index, 1, findResult):''
                }
              })
              resolve(res.data.tagList);
            }
          }).catch(err => {
            console.log('错误',err)
          })
        });
        promise.then(function(value){ //初始化第一个标签的人员数组
          if(value.length>0&&self.isTagOnly){
            self.searchTagPerson(value[0].id,0)
          }
        });
      },
      //点击标签，获取对应的人员
      searchTagPerson:function (tagId,index) {
        this.currentIndex = index;
        if(this.isTagOnly) {
          this.loadMore.pageConfig.pageData = []
          this.loadMore.url = '/tag/tagAction!searchTagGroupRefPage.action'
          this.loadMore.data = {
            page: 1,
            tagId: tagId,
            agentCode:this.dataBase.agent,
            toUser:this.onlyUser?1:''
          };
          this.checkAll = false;
          this.loadFinished = false;
          this.$refs.loadMoreFun.clearLoadFun();
        }
      },
      //接口请求完成
      requestFinished:function () {
        this.loadFinished = true;
      },
      //全选当前标签
      selectAll:function () {
        var self = this;
        getTagPersons(self.loadMore.data.tagId, self.onlyUser?1:'').then(res => {
          if (res.code == '0' && res.data.persons.length>0) {
            if(self.judgeIsOver(res.data.persons)){ //先判断全选的话会不会超出限制
              return
            }
            if(self.checkAll) {
              res.data.persons.forEach(function (e) {
                let findResult = self.checkList.find(item => {
                  return item.menberId == e.menberId
                })
                findResult ? '': self.checkList.splice(self.checkList.length,0,e)
              })
            } else if(!self.checkAll){
              res.data.persons.forEach(function (e) {
                let indexResult = self.checkList.findIndex(item => {
                  return item.menberId == e.menberId
                })
                indexResult!=-1 ? self.checkList.splice(indexResult,1):''
              })
              self.$emit('deleteAllItems',res.data.persons)
            }
          }
        }).catch(err => {
          console.log('错误',err)
        })
      },
      //全选之前先判断会不会超出最大限制
      judgeIsOver:function (resultList) {
        var self = this,
            userLength = self.defaultUser.length,
            deptLength = self.defaultDept.length;
        resultList.forEach(function (e) {
          if(e.menberType == '1'){ //人员
            self.defaultUser.find(item => {
              return item.userId == e.menberId
            }) ?  '' : userLength++
          } else { //部门
            self.defaultDept.find(item => {
              return (item.nodeId == e.menberId) || (item.deptId == e.menberId)
            }) ?  '' : deptLength++
          }
        })
        if(userLength > self.maxUser || deptLength > self.maxDept){
          self.dataBase.top_alert('人员或部门超出选择上限，无法全选',false,2000)
          setTimeout(()=>{
            self.checkAll = false
          },1000);
          return true
        }
        return false
      }
    }
  }
</script>
<style scoped>
  .qwui-tag_title{
    margin-left: 20px;
    padding: 15px 0 10px;
    cursor: pointer;
  }
  .qwui-tag_title_ills{
    color:#999;
  }
  .qwui-tag_list{
  position: relative;
  height: 361px;
  overflow-x: auto;
  overflow-y: scroll;
  list-style: none outside none;
}
  .qwui-tag_list.active{
    float: left;
    width: 260px;
    height: 407px;
  }
  .qwui-list_item{
    padding-left: 20px;
    white-space: nowrap;
    cursor: pointer;
    line-height: 30px;
  }
  .qwui-list_item:hover{
    background: #ececec;
  }
  .qwui-list_item.active{
    background: #F7F7F7;
  }
  .qwui-list_item_img{
    display: inline-block;
    width:24px;
    height: 24px;
    border: 0 none;
    background: url(../../../assets/images/tag_icon.png) no-repeat center;
    vertical-align: middle;
  }
  .qwui-list_item_text{
    margin-left: 10px;
  }
  .qwui-person_list{
    width: 340px;
    float: left;
  }
  .qwui-select_all{
    margin-left: 20px;
    padding-right: 9px;
    line-height: 40px;
    border-bottom: 1px solid #e4e4e4;
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
  .qwui-tag_checkbox.active span {
    margin: 11px 15px 0 0;
  }
  .qwui-tag_checkbox.all span{
    margin-right: 14px;
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
  .qwui-select_list{
    position: relative;
    height: 361px;
    overflow-x: hidden;
    overflow-y: scroll;
    list-style: none outside none;
  }
  .qwui-select_list_item{
    margin-left: 20px;
    line-height: 40px;
    border-bottom: 1px solid #e4e4e4;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
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
  .qwui-list_item_headpic{
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 3px;
    vertical-align: middle;
  }
  .dept_pic{
    background: url(../../../assets/images/dept_icon.png) no-repeat center;
  }
  .qwui-list_item_name{
    margin-left: 10px;
  }
</style>

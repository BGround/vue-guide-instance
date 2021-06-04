<template>
   <div>
      <div class="tal c999">
         <span class="navItem" @click="allCourse">全部课程</span>
         <span v-for="item in navArray" v-if="!pagedata.isHideCategory">> <span class="navItem" @click="forback(item.key,item.rank)">{{item.name}}</span></span>
         <span  v-if="pagedata.isHideCategory">> 搜索结果</span>
      </div>
      <div class="type-search c666" v-if="!pagedata.isHideCategory">
          <div class="searchItemRow">
            <span class="dib" v-for="(grandItem,grandIndex) in categoryData.data" :class="{mr30:grandIndex>0,categoryActive:grandId==grandIndex,searchItem:grandId!=grandIndex}" @click="clickGrand(grandIndex)">
              {{grandItem.categoryVO.name}}
            </span>
          </div>
          <div class="searchItemRow">
            <span class="dib" v-for="(parentItem,parentIndex) in son" :class="{mr30:parentIndex>0,categoryActive:parentId==parentIndex,searchItem:parentId!=parentIndex}" @click="clickParent(parentIndex)">
              {{parentItem.categoryVO.name}}
            </span>
          </div>
          <div class="searchItemRow">
            <span class="dib" v-for="(sonItem,sonIndex) in grandSon" :class="{mr30:sonIndex>0,categoryActive:id==sonIndex,searchItem:id!=sonIndex}" @click="clickSon(sonIndex)">
              {{sonItem.categoryVO.name}}
            </span>
          </div>
      </div>
   </div>
</template>

<script>
import axios from 'axios'
export default {
  props:['categoryData','pagedata'],
  data(){
    return {
      son:{},
      grandSon:{},
      navArray:[],
      grandId:'',
      parentId:'',
      id:''
    }
  },
  created(){
    this.getData();
  },
  methods:{
    getData(){
      var self = this;
      _.ajax({
        url: _.baseURL+this.categoryData.url,
            type: 'post',
            success: function (result) {
              if ("0" == result.code) {
                self.categoryData.data = result.data;
              }else{
                _.alert("提示",result.desc)
              }
            }
          })
    },
    allCourse(){
      this.son = {};
      this.grandSon = {};
      this.navArray = [];
      this.grandId = '';
      this.parentId = '';
      this.pagedata.isHideCategory=false;
      this.pagedata.param.subjectName = '';
      this.pagedata.param.grandId = '';
      this.pagedata.param.parentId = '';
      this.pagedata.param.id = '';
      this.categoryOperation();
    },
    clickGrand(grandKey){
      //面包屑
      this.navArray = [];
      this.navArray.push({key:grandKey,rank:1,name:this.categoryData.data[grandKey].categoryVO.name});
      //显示子类
      let data = this.categoryData.data[grandKey].childList;
      this.son = {};
      this.grandSon = {};
      for(let key in data){
        this.son[key] = data[key];
      }
      //执行分类操作
      this.grandId = grandKey;
      this.parentId = '';
      this.id = '';
      this.pagedata.param.grandId = this.grandId;
      this.pagedata.param.parentId = '';
      this.pagedata.param.id = '';
      this.categoryOperation();
    },
    clickParent(parentKey){
      //面包屑
      while(this.navArray.length >= 2){
        this.navArray.pop();
      }
      this.navArray.push({key:parentKey,rank:2,name:this.son[parentKey].categoryVO.name});
      //显示子类
      let data = this.son[parentKey].childList;
      this.grandSon = {};
      for(let key in data){
        this.grandSon[key] = data[key];
      }
      //执行分类操作
      this.parentId = parentKey;
      this.id = '';
      this.pagedata.param.parentId = this.parentId;
      this.pagedata.param.id = '';
      this.categoryOperation();
    },
    clickSon(sonKey){
      //面包屑
      while(this.navArray.length >= 3){
        this.navArray.pop();
      }
      this.navArray.push({key:sonKey,rank:3,name:this.grandSon[sonKey].categoryVO.name});
      //执行分类操作
      this.id = sonKey;
      this.pagedata.param.id = this.id;
      this.categoryOperation();
    },
    forback(theKey,rank){
      if(rank == 1){
        this.clickGrand(theKey);
      }else if(rank == 2){
        this.clickParent(theKey);
      }else{
        this.clickGrandSon(theKey);
      }
    },
    //分类查询
    categoryOperation(){
      if(this.pagedata.pageDataInit){
          this.pagedata.pageDataInit(1);
        }
    }
  },
  components:{
  }
}
</script>

<style>
.plr10 {
  padding-left: 10px;
  padding-right: 10px;
}
.dib{
  display: inline-block;
}
.cddd {
  color: #ddd;
}
.colorff6666 {
  color: #ff6666;
}
.cursor {
  cursor:pointer;
}

.categoryActive{
  padding: 0 5px;
  color: #fff;
  background-color: #C31725;
  border-radius: 3px;
}
.type-search {
  margin-top: 10px;
  padding: 10px 20px;
  color: #666;
  text-align: left;
  background: #f7f7f7;
}
.navItem {
  cursor:pointer;
}
.navItem:hover {
  color: #ff9500;
}
.searchItemRow {
  margin-top: 10px;
}
.searchItem {
  display: inline-block;
  padding: 0 5px;
  color: #666;
  border-radius: 3px;
  cursor: pointer;
}
.searchItem:hover {
  color: #fff;
  background-color: #a1a1a1;
}

</style>

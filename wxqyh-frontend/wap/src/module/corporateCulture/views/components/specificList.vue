<template>
  <div class="qwui-specific">
    <div v-if="deptList.length>0">
      <div class="qwui-letter_bar">特定部门</div>
      <div class="qwui-target">
        <div class="qwui-target_list" v-for="(item,index) in deptList" :key="index">
          <div class="qwui-deptImg qwui-common_dept"></div>
          <p class="qwui-name">{{item.deptName}}</p>
        </div>
      </div>
    </div>
    <div v-if="userList.length>0">
      <div class="qwui-letter_bar">特定人员</div>
      <div class="qwui-target qwui-person_target">
        <div class="qwui-target_list" v-for="(item,index) in userList" :key="index">
          <div class="qwui-deptImg" v-if="index<showPersonLength">
            <img v-if="item.headPic!='0'" :src=item.headPic alt="">
            <img v-else src="~assets/images/touxiang02.png" alt="">
            <p class="qwui-name">{{item.personName}}</p>
          </div>
        </div>
      </div>
      <div class="qwui-all_person" v-if="userLength>5&&!showMore">
        <div class="qwui-show_all" @click="showAllPerson">点击查看全部({{userLength}}人)</div>
      </div>
    </div>
    <div v-if="tagList.length>0">
      <div class="qwui-letter_bar">特定标签</div>
      <div class="qwui-target">
        <div class="qwui-target_list" v-for="(item,index) in tagList" :key="index">
          <div class="qwui-deptImg qwui-common_dept"></div>
          <p class="qwui-name">{{item.tagName}}</p>
        </div>
      </div>
    </div>
    <div class="qwui-footer_height"></div>
    <div class="qwui-footer_btn">
      <div class="qwui-back_btn" @click="goBack">
        返回
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:'spacific-list',
  props:{
    deptList:{
      type:Array,
    },
    tagList:{
      type:Array,
    },
    userList:{
      type:Array,
    }
  },
  data(){
    return{
      showMore:false,
    }
  },
  created(){

  },
  computed:{
    userLength(){
      return this.userList.length;
    },
    showPersonLength(){
      return this.showMore?this.userList.length:5
    }
  },
  methods:{
    goBack(){
      this.$emit('hide');
    },
    showAllPerson(){
      this.showMore=true;
    }
  }
}
</script>
<style lang="scss" scoped>
  @media screen and (min-width:1024px){
    .qwui-specific,.qwui-footer_btn{
      width: 740px !important;
    }
  }
  .qwui-specific{
    position: relative;
    top: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    .qwui-letter_bar {
      background: #f5f5f5;
      color: #999;
      font-size: 14px;
      padding: 13px 15px 6px 15px;
      position: relative;
    }
    .qwui-target{
      background: #ffffff;
      padding: 0 15px;
    }
    .qwui-target_list{
      display: inline-block;
      margin: 10px 15px 5px 0;
    }
    .qwui-deptImg{
      width: 45px;
      height: 45px;
      line-height: 15px;
      img{
        max-width: 100%;
      }
    }
    .qwui-name{
      width: 45px;
      line-height: 12px;
      font-size: 11px;
      color: #666666;
      text-align: center;
      white-space: nowrap;
      word-wrap: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
    }
    .qwui-footer_height{
      height: 59px;
    }
    .qwui-footer_btn{
      position: fixed;
      bottom: 0;
      z-index: 11;
      width: 100%;
      min-height: 50px;
      background: #fff;
    }
    .qwui-back_btn{
      height: 41px;
      font-size: 16px;
      text-align: center;
      line-height: 41px;
      margin: 6px 5px 10px 5px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background: #fbfafc;
      cursor: pointer;
    }
    .qwui-all_person{
      padding-bottom: 20px;
      padding-top: 10px;
      text-align: center;
      background: #fff;
    }
    .qwui-show_all{
      display: inline-block;
      padding: 5px 10px;
      font-size: 16px;
      color: #ffffff;
      background: #bfbfbf;
      border-radius: 5px;
      cursor: pointer;
    }
    .qwui-person_target{
      padding-bottom: 5px;
    }
  }
</style>



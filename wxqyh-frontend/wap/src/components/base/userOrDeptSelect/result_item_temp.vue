<template>
  <ul class="qwui-add_user_list">
     <li v-for="(item,index) in deptselected.data" :key="item.id">
            <a class="qwui-remove_icon" style="display: inline;" @click="selectThisDept(item.id)"></a>
            <p class="img"><img class="images" src="../../../assets/images/dept_ico.jpg" alt=""></p>
            <p class="name">{{item.departmentName}}</p>
       </li>
    <li v-for="(item ,index) in selectdata.data" :key="item.id">
      <a class="qwui-remove_icon" style="display: inline;" @click="selectThisTag(item.id,index)"></a>
      <p class="img"><img class="images" src="../../../assets/images/dept_ico.jpg" alt=""></p>
      <p class="name">{{item.tagName}}</p>
    </li>
     <li v-for="(item,index) in userData" :key="item.userId">
            <a class="icon_remove" @click="selectThisUser(item.userId)"></a>
            <p class="img" :class="{'qwui-user_no_images':item.headPic==''||item.headPic=='0'}">
              <img class="images" v-if="item.headPic!='0' && item.headPic!=''" :src="item.headPic"  alt="">
              </p>
            <p class="name">{{item.personName}}</p>
       </li>
  </ul>
</template>

<script>
  import {getMember} from '../../../module/form/js/getData'

  export default {
    name: 'resultItemTemp',
    created: function () {
      this.getHeadPic();
    },
    data() {
      return{
       userData:[]
      }
    },
    props: ['userselected','deptselected','selectdata'],
    methods:{
      //删除选择人员
      selectThisUser(id){
        this.$emit('selUser',this,id);
      },
      //删除选择部门
      selectThisDept(id){
        this.$emit('selDept',this,id);
      },
      //删除标签
      selectThisTag(id,index){
        this.$emit('deleteThisTag',id,index);
      },
      // 在userselected.data中插入人员头像url并用userDta数组存人员数据
      getHeadPic() {
        var _this = this;
        let ids = _this.userselected.idStr.replace(/\|/g,',');
        getMember(ids,(res) => {
          _this.userselected.data.forEach(item => {
            res.forEach(item2 => {
              if(item.userId == item2.userId){
                item['headPic'] = item2.headPic;
              }
            })
          })
          this.userData = this.userselected.data;
        })
      },
    }
  }
</script>
<style>
  .qwui-add_user_list{
    margin: 10px 0;
    font-size: 0;
  }
  .qwui-add_user_list li{
    display: inline-block;
    position: relative;
    width: 45px;
    margin: 10px 15px 10px 0;
    text-align: center;
    list-style: none;
  }
  .qwui-add_user_list .icon_remove{
    position: absolute;
    left: 34px;
    top: -6px;
    width: 16px;
    height: 16px;
    background: url(../../../assets/images/remove02.png) center no-repeat;
    background-size: 100% 100%;
  }
  .qwui-add_user_list .img,.qwui-add_user_list .images{
    display: inline-block;
    width: 45px;
    height: 45px;
  }
  .qwui-add_user_list .name{
    display: inline-block;
    overflow: hidden;
    width: 45px;
    margin-top: -1px;
    font-size: 11px;
    color: #666;
    text-align: left;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
    line-height: 18px;
  }
</style>

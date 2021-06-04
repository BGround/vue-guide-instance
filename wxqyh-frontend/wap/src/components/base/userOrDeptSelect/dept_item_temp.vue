<template>
  <div class="qwui-dept_item_marginTop">
  <div class="qwui-dept_item" v-for="(item,index) in message.data" :key="item.id">
    <a class="a_link" @click="deptListInit(item.id,item.departmentName)"></a>
    <div class="qwui-dept_item_inner">
      <div class="qwui-user_select_icon" :class="{active:deptselected.idStr.indexOf(item.id)!=-1}" @click="selectThis(item.id)">
        <i></i>
      </div>
      <div class="avator"></div>
      <div class="title flexItem">
        <p class="">{{item.departmentName}}</p>
        <p class="">{{item.totalUser}}{{$t('i18n.members')}}</p>
      </div>
      <i class="qwui-icon_arrow_fr icon_gray"></i>
    </div>
  </div>
  </div>
</template>

<script>
  export default {
    name: 'deptItemTemp',
    created: function () {
    },
    props: ['message','deptselected'],
    methods:{
      //展开部门
      deptListInit:function(id,name){
        this.$emit('deptListInitFunc',this.message,id,name);
      },
      //选择部门
      selectThis:function(id){
        this.$emit('selDept',this,id);
      }
    },
  }
</script>


<template>
  <div v-show="personCountShow">
    <div class="qwui-person_count">
      <qwui-button @click="addPerson">添加</qwui-button>
      <span v-if="showType.dept || showType.person">已选
          <span v-if="showType.dept">
            <span class="qwui-count_num">{{ deptCount }}</span>
            部门
          </span>
          <span v-if="showType.person">
            <span class="qwui-count_num">{{ personCount }}</span>
            成员
          </span>
        </span>
      <span v-if="deptCount || personCount" class="clearSelect" @click="deleteAll">清空已选</span>
    </div>
    <!--选人展示框-->
    <div v-if="deptCount || personCount" class="qwui-main_result">
      <div class="qwui-selected_input">
        <!--  部门已选择  -->
        <div class="qwui-dept_selected" v-for="(item,index) in defaultDepts">
          <div class="qwui-dept_selected_icon"></div>
          {{item.nodeName ? item.nodeName : item.deptName}}
          <span class="qwui-selected_close" @click="deleteDept(index)">×</span>
        </div>

        <!--  人员选择  -->
        <div class="qwui-inline">
          <div class="qwui-dept_selected" v-for="(item,index) in defaultUsers">
            <img v-if="item.headPic && item.headPic!='0'" class="qwui-dept_selected_icon" :src="item.headPic">
            <div v-if="item.show"></div>
            <div v-else class="qwui-user_default_img"></div>
            {{item.personName}}
            <span class="qwui-selected_close" @click="deleteUser(index)">×</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';

  export default {
    props:{
      personCountShow:{
        type:Boolean,
        default:false
      },
      showType:{
        type:Object,
        default(){
          return {}
        }
      },
      defaultDepts:{
        type:Array,
        default(){
          return [];
        }
      },
      defaultUsers:{
        type:Array,
        default(){
          return [];
        }
      },
    },
    data(){
      return {

      }
    },
    methods:{
      addPerson(){
        this.$emit('listenAddPerson');
      },
      deleteAll(){
        this.defaultDepts.splice(0,this.defaultDepts.length);
        this.defaultUsers.splice(0,this.defaultUsers.length);
        this.$emit('deleteAll');
      },
      deleteDept(index){
        this.defaultDepts.splice(index,1);
      },
      deleteUser(index){
        this.defaultUsers.splice(index,1);
        if(this.defaultUsers.length <= 0) this.$emit('deleteAll');
        this.$emit('selectUserList',this.defaultUsers);
      },
    },
    computed:{
      deptCount(){
        return this.defaultDepts.length;
      },
      personCount(){
        return this.defaultUsers.length;
      }
    },
    components:{
      qwuiButton
    }
  }

</script>

<style lang="scss" scoped>
  .qwui-person_count {
    margin-top: 5px;

  .qwui-count_num {
    color: #f87b00;
  }

  .clearSelect {
    float: right;
    color: #999;
    line-height: 28px;
    cursor: pointer;

  &:hover{
     color: red;
   }
  }
  }
  .qwui-main_result{
    padding: 5px 0 10px;

  .qwui-selected_input{
    background: #fff;
    border: 1px solid #cccccc;
    padding: 5px;
    max-height: 110px;
    overflow: auto;
    box-sizing: border-box;

  .qwui-inline{
    display: inline;
    vertical-align: middle;
  }
  }
  }
  .qwui-dept_selected {
    display: inline-block;
    width: auto;
    height: 24px;
    margin: 5px 5px 0 0;
    line-height: 24px;
    list-style: none;
    background-color: #eee;
    border: 1px solid #ddd;
    border-left: none;
    border-radius: 3px;
    vertical-align: top;

  .qwui-dept_selected_icon {
    display: inline-block;
    width: 26px;
    height: 24px;
    margin-right: 5px;
    list-style: none;
    vertical-align: top;
    background: url(~assets/images/dept_icon.png) no-repeat center;
  }
  }
  .qwui-user_default_img{
    display: inline-block;
    width: 26px;
    height: 24px;
    margin-right: 5px;
    list-style: none;
    vertical-align: top;
    background: url(~assets/images/touxiang02.png) no-repeat center;
    background-size: 26px 24px;
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

  &:hover{
     background: #ffb164;
     color: #fff;
   }
  }
</style>

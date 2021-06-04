<template>
  <div>
    <div class="selectBox" v-show="boxShow">
      <div class="selectContent qwui-border_bottom">
        <label
          v-for="(value,key) in options"
          :for="value"
          class="qwui-border_bottom">
          <input type="radio"
                 :key="key"
                 :value="key"
                 :id="value"
                 v-model="checkedData"
                 class="icon_check">
          {{value}}
        </label>
      </div>
      <user_add class="qwui-user_add" :userselect="dataBase.selectConfig" @deleteTag="deleteTag" @selectPerson="selectPerson"></user_add>
      <!--选择人员-->
      <user_select 
        :selectconfig="dataBase.selectConfig" 
        v-if="dataBase.selectConfig.show" 
        tagSelect 
        :closeGroup=true
        :tabActive="'user'"
        @chooseDone="chooseDone"
        :userRequestData="userRequestData"
        :deptRequestData="deptRequestData"
        :keyWordRequestData="keyWordRequestData"
        :searchTagRequestData="searchTagRequestData"
        :childDeptRequestData="childDeptRequestData"
        ></user_select>
      <button_group :fixed="true">
        <qwui_button type="default" text="取消" @buttonClick="cancelSelected"></qwui_button>
        <qwui_button type="primary" text="确定" @buttonClick="confirmSelected"></qwui_button>
      </button_group>
    </div>
  </div>
</template>

<script>
  import user_add from '@/components/add/user_select_build';
  import user_select from '@/components/base/user_or_dept_select';
  import {qwui_button, button_group} from '@/components/base/button'
  export default {
    name: "select-person",
    props: {
      boxShow: false,
      options: null,
    },
    data() {
      return {
        dataBase,
      }
    },
    mounted() {
      if(this.checkedData==3) {
        this.toPersonList.title="特定对象";
      }
    },
    computed: {
      toPersonList() {
        return this.dataBase.selectConfig.selectList["ccPersonList"]
      },
      checkedData:{
        get() {
          return this.$store.state.rules.rang
        },
        set(val) {
          this.$store.commit('updateRang', val)
        }
      },
    },
    watch: {
      checkedData(val) {
        if(val==3){
          this.toPersonList.title="特定对象";
          //life
        }else {
          this.toPersonList.title="";
        }
      }
    },
    methods: {
      cancelSelected() {
        this.$emit('update:boxShow', false)
      },
      confirmSelected() {
        if(this.checkedData==3 && !this.toPersonList.userSelected.length && !this.toPersonList.deptSelected.length && !this.toPersonList.tagSelected.length){
          _.alert('提示','特定对象为空')
          return
        }
        this.$emit('confirmSelected', this.checkedData)
        this.$emit('update:boxShow', false)
      },
      chooseDone(val){
        this.$emit("tagSelect",val.tag);
      },
      deleteTag(id,index,signIndex){
        this.dataBase.selectConfig.selectList[signIndex].tagSelected.splice(index,1)
      },
      selectPerson(el,obj){
        if(obj.tag){
          this.dataBase.selectConfig.selectList[el].tagSelected.length=0;
          this.dataBase.selectConfig.selectList[el].tagSelected.push(...obj.tag.data);
        }
      },
      userRequestData(pageObj){
        this.dataBase.userData.page=pageObj.page;
        return this.dataBase.userData;
      },
      deptRequestData(pageObj){
        this.dataBase.deptData.page=pageObj.page;
        this.dataBase.deptData.searchDept=pageObj.searchDept;
        this.dataBase.deptData.searchDept=pageObj.searchDept;
        return this.dataBase.deptData;
      },
      keyWordRequestData(pageObj){
        this.dataBase.keyWordData.page=pageObj.page;
        this.dataBase.keyWordData.keyWord=pageObj.keyWord;
        return this.dataBase.keyWordData;
      },
      searchTagRequestData(){
        return this.dataBase.tagData;
      },
      childDeptRequestData(pageObj){
        return this.dataBase.childData;
      }
    },
    components: {
      qwui_button,
      button_group,
      user_select,
      user_add,
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 1024px) {
    .selectBox{
      width: 740px;
      margin: auto;
    }
  }
  .selectBox {
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #F5F5F5;
    overflow: scroll;
  }
  .selectContent {
    padding-left: 15px;
    background-color: #fff;
  }
  .selectBox label {
    display: block;
    height: 44px;
    line-height: 44px;
    font-size: 16px;
  }
  .selectBox .qwui-border_bottom:last-child:after{
    border: none;
  }
  .qwui-check_btn {
    margin-right: 10px;
  }
  .qwui-user_add{
    margin-bottom: 60px;
  }
</style>

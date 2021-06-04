<!--
<left-side-bar :renderConfig="renderConfig" @listenToChild="changeRuleId" @listenAddPop="addRule"></left-side-bar>

 renderConfig:{
    addOperateName:'新建规则',
    renderList:[],// 数据列表
    currentIndex:0 // 当前选中列表
  },
-->

<template>
  <div>
    <div class="qwui-diary_conatiner-l">
      <div class="qwui-rule-l-t" v-if="renderConfig.addOperateName">
        <button class="qwui-rule_btn" @click="addPopShow">{{ renderConfig.addOperateName }}</button>
      </div>
      <div class="qwui-rule_warp">
        <ul class="qwui-rule_list">
          <li :class="{ 'active':key == renderConfig.currentIndex,'ban':item.status == 0 }" v-for="(item,key) in renderConfig.renderList" :key="key" @mouseleave="hideMore" @click="chooseItem(item.id,key,item)">
            <p>{{ item.itemName }}
              <i v-if="item.itemIcon" class="qwui-icon" :style="{ 'background':'url('+item.itemIcon+') no-repeat' }"></i>
            </p>
            <i class="qwui-a_more" @mouseenter="showMore(key)" v-if="item.operateList"></i>
            <div v-show="oprateShowIndex === key" class="qwui-rule_action">
              <span v-for="(items,keys) in item.operateList" @click.stop="items.operateFunc" v-perm="items.perm">{{ items.operateName }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    props:{
      renderConfig:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    data(){
      return {
        oprateShowIndex:'',
        currIndex:0
      }
    },
    methods:{
      showMore(key){
        this.oprateShowIndex = key;
      },
      hideMore(){
        this.oprateShowIndex = '';
      },
      chooseItem(id,key,item){
        this.currIndex = key;
        this.$emit('listenToChild',id,key,item)
      },
      addPopShow(){
        this.$emit('listenAddPop')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .qwui-diary_conatiner-l{
    float: left;
    width: 200px;
    margin-bottom: 100px;
    border: 1px solid #e4e4e4;
  }
  .qwui-rule-l-t{
    padding: 20px 0px;
    text-align: center;
  }
  .qwui-rule_btn {
    display: inline-block;
    width: 90px;
    height: 28px;
    font-size: 14px;
    color: #666;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 2px;
  }
  .qwui-rule_warp {
    height: 600px;
    overflow-y:auto;
    padding-bottom: 50px;
    border-radius: 5px;
  }
  .qwui-rule_list li{
    position: relative;
    color: #666;
    cursor: pointer;

    &.ban {
      color: #999;
     }
    .qwui-icon,.qwui-a_more {
      position: absolute;
      right: 0;
      top: 12px;
      height: 16px;
      width: 16px;
      background: url("~assets/images/ic_a-more.svg") no-repeat;
    }
    .qwui-icon {
      left: 12px;
    }
    .qwui-a_more {
      display: none;
    }
  }
  .qwui-rule_list li p{
    padding: 10px 20px 10px 40px;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .qwui-rule_list li:hover{
    background: #f5f5f5;

    & .qwui-a_more {
        display: inline-block;
      }
  }
  .qwui-rule_list li.active{
    background: #f5f5f5;
  }
  .qwui-state_icon {
    margin-top: -3px;
  }
  .qwui-rule_action {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 3px 0;
    color: #666;
    background: #fff;
    border: 1px solid #EDEDED;
    border-radius: 2px;
    box-shadow: 0px 2px 10px 0px rgba(0,0,0,.1);
    z-index:1;
  }
  .qwui-rule_action span{
    display: block;
    width: 58px;
    padding: 5px 0;
    font-size: 14px;
    text-align: center;
    text-overflow: ellipsis;
    z-index: 1;
    cursor: pointer;
  }
  .qwui-rule_action span:hover{
    background: #f7f7f7;
  }
</style>

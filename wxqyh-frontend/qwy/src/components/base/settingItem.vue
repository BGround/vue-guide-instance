/**
*  settingItemConfig:[
*  {
*  title:'任务分派类型设置',
*  desc:'',
*  },
*  {
*  title:'任务重复提醒',
*  desc:'在新建任务时，可设置任务未完成时重复提醒负责人，直到任务完成',
*  switchOnOff:true,// 开关状态，无switchOnOff则为设置
*  perm:'taskList',// 设置项权限
*  }]
* @exmple
*     <parent>
  *         <setting-item :settingItemConfig="settingItemConfig" @listenToChange="methodsName"></setting-item>
  *     </parent>
*/
<template>
  <div>
    <div class="qwui-setting_item"
         v-for="(item,key) in settingItemConfig"
         :key="key" v-perm="item.perm"
         v-show="!item.hideItem">
      <p class="qwui-setting_title">{{ item.title }}</p>
      <p v-if="item.desc" class="qwui-setting_desc" v-html="item.desc"></p>
      <qwuiSwitch v-if="item.switchOnOff != undefined"
                  class="qwui-setting_switch"
                  :defaultStatus="item.switchOnOff"
                  @change="change(key,arguments[0])"></qwuiSwitch>
      <a v-else class="qwui-setting_href" @click="change(key)">设置</a>
    </div>
  </div>
</template>

<script>
import qwuiSwitch from '../qwuiBase/qwuiSwitch/qwuiSwitch';

export default{
  name:"settingItem",
  props:{
    settingItemConfig:{
      type:[Array,Object],
      default(){
        return []
      }
    }
  },
  data(){
    return {

    }
  },
  methods:{
    change(key,val){
      this.$emit('listenToChange',key,val)
    }
  },
  components:{
    qwuiSwitch,
  }
}
</script>

<style lang="scss" scoped>
  .qwui-setting_item{
    position: relative;
    border-bottom: 1px solid #dbdbdd;
    padding: 20px 55px 20px 20px;
    overflow: hidden;

    &:last-child {
        border-bottom: none;
     }

    .qwui-setting_desc{
      margin-top: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #999;
    }
    .qwui-setting_switch,.qwui-setting_href{
      position: absolute;
      top: 50%;
      right: 10px;
      margin-top: -10px;
      height: 20px;
    }
    .qwui-setting_href{
      color: #f87b00;
      cursor: pointer;
    }
  }
</style>

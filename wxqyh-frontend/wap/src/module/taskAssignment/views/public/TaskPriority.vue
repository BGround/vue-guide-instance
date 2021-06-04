<template>
  <div>
    <div class="qwui-priority_item" ref="priority" @click="showPriority">
      <i class="qwui-priority_icon"></i>
      <div class="qwui-flexItem">
        <span class="qwui-priority_data"
              :style="{ 'color':priorityData[priorityNum].color,'background':priorityData[priorityNum].bgColor }">{{ priorityData[priorityNum].text }}</span>
      </div>
      <i class="qwui-priority_right" v-if="hasPermission"></i>
    </div>
    <div class="selectBox" v-show="priorityShow">
      <ul>
        <li v-for="(value,key,index) in priorityData"
            :key="key"
            class="qwui-priority"
            :class="{ active: key == priorityNum }"
            :style="{ 'color':value.color,'background':value.bgColor }"
            @click="choosePriority(index)">
          {{ value.text }}
          <i class="qwui-choose_cycle" v-show="key == priorityNum"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { liveUpdateTask,editSubTask } from '../../api/getData';

  export default {
    props:{
      subPriorityShow:{
        type:Boolean,
        default:false
      },
      priority:{
        type:Number,
        default:0
      }
    },
    data(){
      return {
        priorityData:{
          0:{
            text:this.$t('i18n.ordinary'),
            color:'#7A7C80',
            bgColor:'rgba(178,185,200,0.12)',
            value:'0'
          },
          1:{
            text:this.$t('i18n.noUrgentButImp'),
            color:'#38DB6A',
            bgColor:'rgba(0,230,145,0.1)',
            value:'1'
          },
          2:{
            text:this.$t('i18n.urgentButNoImp'),
            color:'#FFC363',
            bgColor:'rgba(255,195,99,0.1)',
            value:'2'
          },
          3:{
            text:this.$t('i18n.urgentButImp'),
            color:'#FF548F',
            bgColor:'rgba(255,84,143,0.08)',
            value:'3'
          }
        }, // 优先级数据
        priorityShow:false,
        priorityNum:0, // 选择了第几个优先级选项
      }
    },
    methods:{
      showPriority(){
        if (this.hasPermission){
          this.priorityShow = true;
        }
      },
      choosePriority(key){
        let self = this;
        var addModuleType = window.sessionStorage.getItem('addModuleType');
        if(addModuleType&&addModuleType=='subAddModule'){
          this.$store.commit('subAddContentModuleHideUpdate');
          this.$store.commit('priorityDisplayUpdateHide');
          window.sessionStorage.removeItem('addModuleType');
        }
        this.priorityShow = false;
        if (this.priorityNum == key) { return; }
        this.priorityNum = key;
        this.$emit('listenToChild',key);
        if (this.$store.getters.isDetailPage){
          if (this.$store.getters.subTaskPage){
            if(this.$store.getters.addSubTaskPage){
              return;
            }
            let subtaskJsonStr = JSON.stringify({
              subtaskId:this.$store.getters.subtaskId,
              priority:key,
              title:this.$store.getters.subtaskTitle
            });
            // 更改子任务优先级
            editSubTask({
              subtaskId:this.$store.getters.subtaskId,
              subtaskJsonStr:subtaskJsonStr,
              oldTaskStatus:'1',
              editFlag:5,
            },(result)=>{
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
              console.log(result);
            })
          }else {
            // 主任务优先级
            liveUpdateTask({
              'tbQyTaskPO.taskId':this.$store.getters.taskId,
              'tbQyTaskPO.priority':key,
              'operationFlag':5
            },function (result) {
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
              console.log(result);
            })
          }
        }
      }
    },
    computed:{
      hasPermission(){
        this.priorityNum = this.priority;

        this.$store.commit('hasPermissionUpdate');
        return this.$store.getters.hasPermission;
      },
    },
    watch:{
      subPriorityShow(){
        if (this.subPriorityShow){
          this.$refs.priority.click();
        }
      },
      priority(){
        this.priorityNum = this.priority;
      }
    }
  }
</script>

<style>
  .selectBox {
    background: #fff !important;
  }
  .qwui-priority_item{
    display: flex;
    font-size: 14px;
    line-height: 46px;
    height: 46px;
    background: #fff;
  }
  .qwui-priority_icon {
    width: 26px;
    padding-left: 15px;
    background: url("../../../../../src/assets/images/icon_a-newtask-list_priority.svg") no-repeat scroll right;
  }
  .qwui-priority_data {
    display: inline-block;
    padding: 3px 13px 0 13px;
    margin-left: 8px;
    margin-top: 12px;
    height: 18px;
    line-height: 18px;
    border-left: 3px solid;
    border-radius: 3px;
    font-size: 13px;
  }
  .qwui-priority {
    position: relative;
    margin: 16px 14px 0 14px;
    padding-left: 20px;
    height: 50px;
    line-height: 50px;
    border-radius: 4px;
    border-left: 3px solid;
    font-size: 16px;
  }
  .qwui-choose_cycle {
    position: absolute;
    right: 14px;
    top: 18px;
    width: 18px;
    height: 18px;
    background: 0 0 url("../../../../../src/assets/svg/icon-a-public_tick.svg") no-repeat;
    background-size: 18px 18px;
  }
  .qwui-priority_right{
    width: 24px;
    padding-right: 15px;
    background: url("../../../../assets/svg/right.svg") no-repeat scroll left;
  }
  .qwui-flexItem{
    flex:1;
  }
</style>

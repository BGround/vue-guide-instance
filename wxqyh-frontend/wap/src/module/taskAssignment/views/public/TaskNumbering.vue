<template>
  <div>
    <div class="qwui-number_header">
      <span class="qwui-to_main_task" @click="toMainTask">{{$t('i18n.goToMainTask')}}</span>
      <span v-show="subTaskNumber != ''" class="qwui-task_number">{{$t('i18n.subtaskNum')}}
        <input type="text" class="qwui-number_content" :value="subTaskNumber">
      </span>
    </div>
  </div>
</template>

<script>
  import * as timeUtil from '../../../../assets/js/time-util';
  export default {
    props:{

    },
    data(){
      return {
        dataBase:dataBase
      }
    },
    methods:{
      toMainTask(){
        window.sessionStorage.removeItem('clickEnclosurePicType');
        this.$emit('listenToChild',false);
        var fromAddContent = window.sessionStorage.getItem('fromAddContent');
        if(fromAddContent&&fromAddContent=='fromAddContent'){
          window.sessionStorage.removeItem('fromAddContent');
          window.sessionStorage.setItem('addModuleType','mainAddModule');
        }
        this.$store.commit('mainAddContentModuleHideUpdate',true);

        // 初始化一些权限数据
        this.$store.commit('isInchargeUpdate',this.dataBase.isMainIncharge);
        this.$store.commit('taskOverUpdate',this.$store.getters.mainTaskOver);
        this.$store.commit('urgentPermissionUpdate',false);
        this.$store.commit('changeSubTaskTimeUpdate',false);
        this.$store.commit('addSubTaskPageUpdate',false);

        localStorage.removeItem('subTaskCache');// 清除子任务新建页面的缓存

        if (this.$store.getters.isDetailPage){
          this.$router.push({
            path:'/detail',
            name:'detail',
            query:{
              taskId:this.$route.query.taskId
            }
          });
        }else {
          // let query = {};
          // // 判断是新建任务、复制任务还是编辑草稿
          // if (this.$store.getters.isCopyPage){
          //   query.taskId = this.$store.getters.taskId;
          //   if(this.$store.getters.isDraftPage){
          //     query.isDraft = this.$store.getters.isDraftPage;
          //   }
          // }
          // this.$router.push({
          //   path:'/add',
          //   name:'add',
          //   query:query
          // });
        }
      }
    },
    computed:{
      subTaskNumber(){
        let subtaskNumber = this.$store.getters.subTaskNumber;
        if (subtaskNumber != "") {
          if (subtaskNumber.indexOf("[") != -1 && subtaskNumber.indexOf("]") != -1) {
            let subtaskNumber_split = subtaskNumber.substring(subtaskNumber.indexOf("[") + 1, subtaskNumber.indexOf("]"));
            let subTaskNumber_format = timeUtil.changeFormat(new Date(),subtaskNumber_split);
            subtaskNumber = subtaskNumber.replace('['+subtaskNumber_split+']', subTaskNumber_format);
          }
        }
        return subtaskNumber;
      }
    }
  }
</script>

<style>
  .qwui-number_header {
    position:relative;
    height: 42px;
    overflow: hidden;
  }
  .qwui-to_main_task {
    display: inline-block;
    padding: 1px 8px 0 17px;
    margin: 10px 0 0 9px;
    height: 22px;
    line-height: 22px;
    border-radius: 2px;
    font-size: 13px;
    background: #EEF0F3 5px 5px no-repeat url("../../../../assets/svg/icon_a-newtask-list_arrow-task.svg");
    background-size: 10px;
    color: #7A7C80;
    cursor: pointer;
  }
  .qwui-task_number {
    display: inline-block;
    float: right;
    margin: 11px 14px 0 0;
    width: 150px;
    height: 18px;
    font-size: 13px;
    color: #7A7C80;

  }
  .qwui-number_content {
    width: 75px;
    margin-bottom: 3px;
    text-overflow: ellipsis;
  }
</style>

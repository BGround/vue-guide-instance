<template>
  <div>
     <div class="qwui-subtask">
      <i class="qwui-subtask_left"></i>
      <div class="qwui-flexItem qwui-subtask_add">
        {{ hasPermission ? $t('i18n.addSubtask') : $t('i18n.subTask') }}
        <div v-if="isDetailPage" class="qwui-rate_detail subtaskNum">
          <span class="qwui-subtask_num">{{ finishTaskNum }}/{{ totalTaskNum }}</span>
          <div class="progBox">
            <div class="progressbar">
              <div class="progressbarInner" :style="{ 'width':subRateWidth }"></div>
            </div>
          </div>
        </div>
        <div class="qwui-subtask_listbox" v-for="(value,key,index) in subTaskData.subtask" :key="key">
          <router-link :style="{ 'borderColor':priorityColor[value.priority] }" class="qwui-subtask_list" :class="{ active:value.taskStatus == '2' }" :to="{ name:isDetailPage?'subtaskDetail':'subtask',params:{ key:key },query:{taskId:taskId,subtaskId:value.subtaskId} }">
            <div style="display: flex;justify-content: space-between;align-items: center;">
							<div class="qwui-subtask_box">
							  <p class="qwui-subtask_title">{{ value.title | titleHandle }}</p>
							  <p class="qwui-subtask_info">
							    <span v-if="value.taskStatus == '2'" class="qwui-subtask_over">强制关闭</span>
                  <!--<span v-else class="stopTime" :class="filterTime(value.stopTime)">{{ timeHandle(value.stopTime) }}截止</span>-->
							    <span v-else class="stopTime" :class="filterTime(value.stopTime)">{{ value.stopTime | timeHandle }}截止</span>
							    <span v-if="value.filepicCount > 0" class="qwui-media_num">{{ value.filepicCount }}</span>
							  </p>
							</div>
							<span class="subTask_tag" :class="{'time-out': value.taskStatusDesc == '已延时'}">{{value.taskStatusDesc}}</span>
						</div>

            <span v-if="value.incharges && value.incharges.length != 0" class="qwui-subtask_img">
              <img :src="value.incharges[0].headPic == '0'?defaultHeadPic:value.incharges[0].headPic" class="qwui-subtask_headpic">
            </span>
          </router-link>
        </div>
      </div>
      <!-- <i v-if="hasPermission" class="qwui-subtask_right" @click="addSubTask"></i> -->
      <!-- <i v-else class="qwui-subtask_placeholder"></i> -->
    </div>
  </div>
</template>

<script>
  import * as timeUtil from '../../../../assets/js/time-util';
  import eventBus from '@/utils/eventBus';
  import { isVipGold } from '@/assets/js/vip-portal';

  const PriorityColor = ['#7A7C80','#38DB6A','#FFC363','#FF548F'];

  export default {
    props:{
      'subTaskShow': {
        type:Boolean
      },
      createrName:{
        type:String,
        default:''
      }
    },
    data(){
      return{
        dataBase:dataBase,
        rateDetailConfig:dataBase.rateDetailConfig,
        popWindowConfig:dataBase.home.popWindowConfig,
        showSubtask:false,
        priorityColor:PriorityColor,// 优先级颜色
        defaultHeadPic: require('../../../../assets/images/touxiang02.png'),//没有头像时的默认头像
        finishTaskNum:0,// 子任务完成数量
        totalTaskNum:0,// 子任务总数量
      }
    },
    created(){
      window.sessionStorage.removeItem('clickEnclosurePicType');
      this.handleSubTaskData();
    },
    methods:{
      addSubTask(){
        if (!isVipGold(interfaceCode.INTERFACE_CODE_TASK) || !this.$store.getters.taskPermission.openSubtask){
          _.alert("", "亲爱的用户，后台没有开启子任务功能，请联系管理员开启");
          return;
        }
        if (this.$store.getters.isDetailPage){
          this.$router.push({
            name:'subtaskDetail',
            query:{
              taskId:this.$store.getters.taskId
            }
          });
        }else {
          this.$router.push({ name:'subtask' });
        }
      },
      modifySubTask(key,subtaskId){
        this.$router.push({
          name:'subtask',
          query:{
            key:key,
            subtaskId:subtaskId
          }
        });
      },
      filterTime(stopTime) {
        let isOverTime = ( new Date() > (new Date(stopTime.replace(/-/g,"\/"))) )
        return isOverTime ? 'overTime': 'inProgress'
      },
      handleSubTaskData(){ //00000
        let hasSubCache = false;
        if (localStorage.getItem('subListDataCache')){
          hasSubCache = true;
        }
        let overRate = 0;
        let subtask = [];
        for (let i = 0; i < this.subTaskDetailData.length; i++) {
          let subData = this.subTaskDetailData[i];
          let stopSubtaskTime;
          let subTaskId,taskStatus;
          if (this.$store.getters.isDetailPage){
            stopSubtaskTime = subData.stopSubtaskTime;
            subTaskId = subData.subTaskId;
            taskStatus = subData.taskStatus;
          }else {
            if (this.$store.getters.isCopyPage){
              stopSubtaskTime = subData.stopSubtaskTime.time;
            }else {
              stopSubtaskTime = new Date(subData.stopTime.replace(/-/g,'/')).getTime();
            }
            subTaskId = 'subtaskpercentageId_'+(i+1);
            taskStatus = 1;
          }
          let singleSubTaskData = {
            subtaskId:subTaskId,
            number:subData.number,// 子任务编号
            title:subData.title,
            content:subData.content,
            stopTime: stopSubtaskTime,
            // stopTime: timeUtil.changeFormat(new Date(stopSubtaskTime),'yyyy-MM-dd hh:mm:ss'),
            incharges:subData.incharge ? [subData.incharge] : subData.incharges,// 子任务负责人
            priority:subData.subtaskPriority || subData.priority,// 优先级
            mediaIds:'',// 附件
            imageUrls:'',
            taskStatus:taskStatus,
						taskStatusDesc: subData.taskStatusDesc,
            filepicCount:subData.filepicCount
          };
          // 复制页面
          if (this.$store.getters.isCopyPage || (hasSubCache && !this.$store.getters.isDetailPage)) {
            if (this.$store.getters.isCopyPage){
              singleSubTaskData.startTime = this.$store.getters.startTime + ':00';
              singleSubTaskData.stopTime = this.$store.getters.stopTime + ':00';

              singleSubTaskData.executors = subData.executorList;
              singleSubTaskData.executorCloseTask = subData.executorCloseTask;
              singleSubTaskData.rate = subData.rate;
            }else {
              singleSubTaskData.startTime = subData.startTime || this.$store.getters.startTime + ':00';
              singleSubTaskData.stopTime = subData.stopTime || this.$store.getters.stopTime + ':00';
              singleSubTaskData.executors = subData.executors || [];
            }
            // 编辑草稿
            if (this.$route.query.isDraft) {
              singleSubTaskData.startTime = timeUtil.changeFormat(new Date(subData.startSubtaskTime.time), 'yyyy-MM-dd hh:mm:ss');
              singleSubTaskData.stopTime = timeUtil.changeFormat(new Date(subData.stopSubtaskTime.time), 'yyyy-MM-dd hh:mm:ss');
            }
            if (subData.filepicList && subData.filepicList.length > 0){
              let subMediaId = [];
              let subFileList = [];
              subData.filepicList.forEach((item) => {
                subMediaId.push(item.id);
                let file = {
                  fileName: item.fileName,
                  id: item.id,
                  fileExt: item.fileExt || 'JPG'
                };
                let imgType = ['PNG', 'JPG', 'BMP', 'JPEG'];
                if (imgType.indexOf(file.fileExt) != -1) {
                  file.src = item.url ? _.compressURL + item.url : item.src;
                  file.fileSize = item.fileSizeStr || item.fileSize;
                } else {
                  file.fileSizeStr = item.fileSizeStr || item.fileSize;
                  file.url = item.url;
                }
                subFileList.push(file);
              });
              singleSubTaskData.mediaIds = subMediaId.join(',');
              this.subTaskFileList.push(subFileList);
            }
            if (subData.picList && subData.picList.length > 0){
              let imageUrls = [];
              subData.picList.forEach((item)=>{
                imageUrls.push(item.picPath);
              })
              singleSubTaskData.imageUrls = imageUrls.join(',');
            }else if (subData.imageUrls){
              singleSubTaskData.imageUrls = subData.imageUrls;
            }
          }

          subtask.push(singleSubTaskData);
          if (subData.taskStatus == '3' || subData.taskStatus == '2'){
            overRate += 1;
          }
        }
        this.$set(this.subTaskData,'subtask',subtask);
        this.$store.commit('subTaskDataUpdate',this.subTaskData);

        // 完成的任务数量
        this.finishTaskNum = overRate;
        this.totalTaskNum = this.subTaskDetailData.length;
        // 子任务数量
        this.$store.commit('subTaskNumUpdate',this.totalTaskNum);
      }
    },
    watch:{
      subTaskDetailData:function () {
        this.handleSubTaskData();
      },
    },
    computed:{
      subTaskData(){
        let maxSubStopTime = '';
        this.$store.getters.subTaskData.subtask.forEach((item)=>{
          if (maxSubStopTime == '' || new Date(item.stopTime.replace(/-/g,'/')) > new Date(maxSubStopTime.replace(/-/g,'/'))){
            maxSubStopTime = item.stopTime.substring(0,16);
          }
        });
        this.dataBase.latestSubStopTime = maxSubStopTime;
        return this.$store.getters.subTaskData;
      },
      subTaskDetailData(){
        return this.$store.getters.subTaskDetailData;
      },
      subTaskFileList(){
        return this.$store.getters.subTaskFileList;
      },
      subRateWidth(){
        return Math.round(this.finishTaskNum/this.totalTaskNum * 100) + '%';
      },
      addSubTaskPermission(){
        return this.$store.getters.taskLevel == 'a2' && this.$store.getters.taskPermission.openSubtask == 2 && !this.$store.getters.taskOver;
      },
      hasPermission(){
        if (this.addSubTaskPermission){
          return true;
        }
        this.$store.commit('hasPermissionUpdate');
        return this.$store.getters.hasPermission;
      },
      // 是否详情页
      isDetailPage(){
        return this.$store.getters.isDetailPage
      },
      taskId(){
        if (this.isDetailPage){
          return this.$store.getters.taskId;
        }
        return ''
      }
    },
    filters:{
      timeHandle(value){
        if (value) {
          let a = _.getFormatListTime(value)
          let b = a.split('-')
          let dateTime, y, m, d;
          if (b.length == 3) {
            m =  ~~b[1] > 9 ? ~~b[1] : '0' + ~~b[1]
            d =  ~~b[2] > 9 ? ~~b[2] : '0' + ~~b[2]
            dateTime = ~~b[0] + '年' + m + '月' + d + '日'
          } else {
            m =  ~~b[0] > 9 ? ~~b[0] : '0' + ~~b[0]
            d =  ~~b[1] > 9 ? ~~b[1] : '0' + ~~b[1]
            dateTime =  m + '月' + d + '日'
          }
          return dateTime
        } else {
          return ''
        }
      },
      titleHandle(val){
        if (val.length > 10){
          return val.substring(0,9) + '...'
        }
        return val;
      }
    },
  }
</script>

<style lang="scss">
  @media screen and (min-width:1024px) {
    .qwui-subtask_wrap{
      width: 740px !important;
      margin: 0 auto;
    }
  }
  .qwui-subtask_left{
    width: 26px;
    padding-left: 15px;
    background: url("../../../../assets/svg/icon_a-newtask-list_subtask.svg") no-repeat scroll right;
    background-position-y: 9px;
  }
  .qwui-subtask{
    display: flex;
    color:#0A1735;
    font-size: 15px;
    line-height: 46px;
    background: #fff;
  }
  .qwui-subtask_right{
    width: 24px;
    padding-right: 15px;
    background: url("../../../../assets/svg/icon-a-public_arrow-lower.svg") no-repeat scroll left;
    background-position-y: 9px;
  }
  .qwui-subtask_placeholder {
    width: 24px;
    padding-right: 15px;
  }
  .qwui-flexItem {
    flex: 1;
  }
  .qwui-subtask_add{
    padding-left: 8px;
		padding-right: 14px;
  }
  .qwui-subtask_wrap{
    position: fixed;
    height: 100%;
    top:0;
    left: 0;
    right: 0;
    width: 100%;
    margin: 0 auto;
    background: #fff;
    z-index: 10;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .qwui-subtask_wrap-relative{
    height: 100%;
    position:relative;
    overflow-y: auto;
    padding-bottom: 50px;
    box-sizing: border-box;
  }
  .qwui-subtask_wrap-relative::-webkit-scrollbar, .qwui-subtask_wrap::-webkit-scrollbar {
    display: none;
  }
  .qwui-subtask_listbox {
    /*padding-right: 50px;*/
  }
  .qwui-subtask_list {
    position: relative;
    display: block;
    height: 42px;
    width: 100%;
    margin-bottom: 10px;
    border-left: 3px solid;
    border-radius: 3px;
  }
  .qwui-subtask_list.active {
    opacity: 0.3;
  }
  .qwui-subtask_box {
    display: inline-block;
    padding-left: 12px;
  }
  .qwui-subtask_title {
    height: 20px;
    line-height: 20px;
    margin-bottom: 6px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
  }
  .qwui-subtask_info {
    height: 13px;
    line-height: 13px;
    font-size: 13px;
    color: #B2B9C8;

    .stopTime {
      padding: 1px 5px;
      border-radius: 2px;
      font-size: 11px;
      // height: 16px;
      // line-height: 16px;
      text-align: center;
      &.overTime {
        color: #fff;
        background: #FE5354;
      }
      &.inProgress {
        color: #6E9BFF;
        background: #E8EFFF;
      }
    }
  }
  .qwui-subtask_over {
    padding: 0 5px;
    border-radius: 2px;
    font-size: 11px;
    color: #fff;
    background: #B2B9C8;
  }
  .qwui-subtask_img {
    position: absolute;
    top: 0;
    right: -20px;
  }
  .qwui-subtask_headpic {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  .qwui-media_num {
    display: inline-block;
    padding-left: 13px;
    margin-left: 13px;
    background: url("../../../../assets/svg/icon_a-newtask-list_enclosure.svg") no-repeat scroll left;
    background-size: 13px 13px;
  }
  .subTaskBtn .qwui-btn_default {
    flex: 1;
    color: #A2A4A7;
  }
  .subTaskBtn .qwui-btn_default:nth-child(2){
    color: #FF548F;
  }
  .subTaskBtn .qwui-btn_primary {
    flex: 2;
  }
  .qwui-height{
    height: 10px;
  }
  .qwui-rate_detail.subtaskNum {
    margin-top: -10px;
  }
  .qwui-subtask_num {
    position: absolute;
    color: #6E9BFF;
  }
  .progBox {
    padding-left: 40px;
  }
  .progressbar {
    vertical-align: middle;
  }
  .qwui-subtask_detail .qwui-title_detaildata {
    display: none;
  }
	.subTask_tag{
		font-size: 12px;
		border: 1px solid #4693e0;
		padding: 0 10px;
		line-height: 18px;
		color: #4693e0;
	}
	.time-out{
		border: 1px solid #fe5354;
		color: #fe5354;
	}
</style>

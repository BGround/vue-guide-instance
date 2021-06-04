<template>
  <div>
    <!--任务评分-->
    <task-score v-if="scorePermission && taskOver" :mainTitle="mainTitle" :score="score"></task-score>
    <div class="qwui-rate_detail" :class="{ 'selectBox':dataBase.allRateShow }" ref="rateDetail" v-scroll="scrollList">
      <!--完成进度-->
      <div  class="progress" ref="progress">
        <span class="averageRate" :class="{ 'hourRate':rate == 2,'statusRate':rate == 0 }">{{ rateType }}进度</span>
        <!-- <div class="progBox">
          <div class="progressbar">
            <div class="progressbarInner" :style="{ 'width':progressbarInnerWidth }"></div>
          </div>
        </div> -->
        <!-- <span class="rateNum">{{ rateAverage }}</span> -->
				<span class="finishStatus" :class="{ 'time-out':taskStatus=='已延时', }">{{ taskStatus }}</span>
      </div>
      <!--各负责人的进度-->
      <!-- <div class="inchargeRate" ref="inchargeRate">
        <div class="rateTitle">
          {{ selectConfig.selectList.showContent }}进度
          <i v-if="hasPermission" class="addPrincipal" @click="selectPersonList(selectConfig.selectList.type)"></i>
        </div>
        <div class="inchages" v-for="(value,key) in listRecRate" :key="key" v-show="key < 5 || dataBase.allRateShow" @click="handleRate(key,value)">
          <div class="infomation">
            <span @click.stop="previewPerson(value)">
              <img class="headPic" :src="value.headPic == '0' ? defaultHeadPic : value.headPic">
              <span class="principalName">{{ value.personName | personNameHandle }}</span>
            </span>
          </div>
          <span v-if="rate == 0 || value.isOver" class="finishStatus" :class="{ 'finish':value.isOver,'other':false }">{{ taskStatus[value.isOver || 0 ] }}</span>
          <circular-progress v-else-if="rate == 1" class="circular" :targetId="value.id || value.userId || 'number'+key" :proGress="Number(value.rate)" :font="{text: Number(value.rate)+'%', fontStyle: '10px PingFangSC', color: '#468CEB'}" :size="30"></circular-progress>
          <span class="workHour" v-else-if="rate == 2">工时 <span class="hourNum">{{ Number(value.rate) }}/{{ Number(value.workHour) }}</span></span>
          <i class="editRate"></i>
        </div>
        <div class="allRateBtn" v-show="principalLength > 5 && !dataBase.allRateShow"  @click="showAllRate">
          <span>查看全部{{ principalLength }}个进度</span>
          <i class="allRate"></i>
        </div>
        <div class="responsibleSetBox" v-show="hasPermission && showBtn && !dataBase.allRateShow">
          <span class="responsibleSet">{{ selectConfig.selectList.showContent }}可结束/拒绝/重启任务</span>
          <div class="qwui-onOff_choose" :class="{'qwui-onOff_on': closeSwitch, 'qwui-onOff': !closeSwitch}" @click="changeCloseSwitch">
            <span class="qwui-onOff_off" :class="{'active': closeSwitch}"></span>
          </div>
        </div>
        <load-more v-show="dataBase.allRateShow" :loading="dataBase.rateLoading" :hasMore="hasMore" :type="'commentList'" :loadMoreDesc="loadMoreDesc" @loadMoreClick="showAllRate('loadMore')"></load-more>
        <p class="totalRate" v-show="!hasMore && dataBase.allRateShow">共{{ principalLength }}个进度</p>
      </div> -->

      <!--催办未完成-->
      <flow-button :buttondata="buttonConfig" v-show="dataBase.allRateShow"></flow-button>
      <!--催办未完成弹框-->
      <div v-show="urgentUndoneShow" class="qwui-pop">
        <div class="tipBox unDone">
          <textarea class="tipArea unDone" v-model="urgentReason"></textarea>
        </div>
        <flow-button :buttondata="urgentButtonConfig" class="sendUnDone"></flow-button>
      </div>
      <div class="qwui-mask" v-show="urgentUndoneShow"></div>
    </div>
  </div>
</template>

<script>
  import flowButton from '@/components/button/flow_button';
  import circularProgress from '../public/CircularProgress';
  import loadMore from '@/components/list/load_more';
  import taskScore from '../public/TaskScore';
  import EventBus from '@/utils/eventBus'
  import { getRateDetail,liveUpdateTask,urgentRemind,updateRate,getAllTaskRate,urgentUnOver,editSubTask,updateSubRate } from '../../api/getData';

  const rateTypeObj = {
    0:'完成',
    1:'平均',
    2:'工时'
  };
  const STATUSARR = ['进行中','已完成','已终止','已取消','已拒绝'];
  export default {
    props:{
      selectConfig:{
        type:Object,
        default(){
          return {};
        }
      },
      listRecRate:{
        type:Array,
        default(){
          return [];
        }
      },
      closeSwitch:{
        default:0
      },
      rate:{
        type:[Number,String],
        default:1
      },
      rateAverage:{
        type:[Number,String],
        default:''
      },
      currentSubTask:{
        type:[Number,String],
        default:0
      },
      taskLevel:{// 任务权限
        type:String,
        default:'a1'
      },
      mainTitle:{// 主任务标题
        type:String,
        default:''
      },
      subtaskIncharges:{
        type:Array,
        default(){
          return [];
        }
      },
			taskStatus: { // 任务进度状态
				type: String,
				default: ''
			}
    },
    data(){
      return {
        dataBase:dataBase,
        rateDetailConfig:dataBase.rateDetailConfig,
//        allRateShow:dataBase.allRateShow,// 显示所有进度
        rateHandleShow:false,// 进度处理弹窗
        taskCloseType:0,// 任务结束类型,0为进行中
        ownNum:0, // 本人的下标值
        ownFinishRate:0,// 自己完成的进度
        oldFinishRate:0,// 旧的完成进度，用于判断是否更改了进度
        ownTotalRate:0,// 自己的总进度
        isFinishTask:false,// 是否已完成
        // taskStatus:STATUSARR,
        buttonConfig:{ //操作按钮
          primaryList:[
            {
              type:"primary",
              name:'催办未完成',
              callBack:this.updateUrgentBoxShow
            },
          ],
          defaultList:[
            {type:"default",name:'返回', callBack:this.backTrack}
          ],
          class:"active"//按钮是否置底部 active :底部、"":相对定位
        },
        urgentButtonConfig:{ //操作按钮
          primaryList:[
            {
              type:"primary",
              name:'发送催办',
              callBack:this.urgentUndone
            },
          ],
          defaultList:[
            {
              type: "default",
              name: '取消',
              callBack:this.updateUrgentBoxShow
            }
          ],
          class:""//按钮是否置底部 active :底部、"":相对定位
        },
        urgentUndoneShow:false,// 催办未完成弹框展示
        urgentReason:'您的任务还未完成，请及时处理。',
        rateDetail:[],// 进度详情
        currentPersonName:'',// 当前负责人名称
        currentRecipient:'',// 当前负责人的下标，删除负责人时用到
        recipientId:'',// 当前负责人数据库id
        currentUserId:'',// 当前负责人userId
        currentIsOver:false,// 当前负责人是否已完成任务
        remark:'任务还未完成，请及时处理。',// 催办提示语
        updateReason:'阶段性完成',// 更新进度说明
        firstLoading:true,
        loading:false,
        lock_roll:false,
        hasMore:false,
        currentPage:1,
        firstCalculateRate:true,// 第一次计算进度
        isRateDetail:false,
        defaultHeadPic: require('../../../../assets/images/touxiang02.png'),// 默认头像
      }
    },
    created(){
    },
    computed:{
      // 任务是否已结束
      taskOver(){
        return this.$store.getters.taskOver;
      },
      // 任务评分显示
      scorePermission(){
        if (this.$store.getters.addSubTaskPage){
         return false;
        }
        if (this.$store.getters.subTaskPage && this.$store.getters.subScore){
          return true;
        }
        if (this.$store.getters.mainScore){
          return true;
        }
        return false;
      },
      score(){
        if (this.$store.getters.subTaskPage){
          return Number(this.$store.getters.subtaskScoreList[this.currentSubTask].score);
        }
        return this.$store.getters.scoreInfo.score;
      },
      // 完成进度的长度
      progressbarInnerWidth(){
        if (this.rate == 1){
          return this.rateAverage;
        }
        let rateArr = this.rateAverage.split('/');
        if (Number(rateArr[0]) > Number(rateArr[1])){
          return '100%';
        }
        return Math.round(Number(rateArr[0])/Number(rateArr[1]) * 100 ) + '%';

      },
      // 个人完成进度的长度
      personalProWidth(){
        return Math.round((this.ownFinishRate/this.ownTotalRate) * 100) + '%';
      },
      // 负责人长度
      principalLength(){
        let principal = this.selectConfig.selectList[this.selectConfig.selectList.type].userSelected;
        return principal.length;
      },
      // 重启/拒绝/取消按钮
      showBtn(){
        if (this.principalLength > 0){
          return true;
        }else {
          return false;
        }
      },
      // 进度类型
      rateType(){
        if (this.$store.getters.subTaskPage){
          return '子任务';
        }
        return rateTypeObj[this.rate];
      },
      hasPermission(){
        if (!this.$store.getters.isDetailPage || ((this.$store.getters.taskLevel == 'a1' || (this.$store.getters.subTaskPage && this.$store.getters.urgentPermission)) && !this.$store.getters.taskOver)){
          return true
        }
        return false;
      },
      loadMoreDesc(){
        if (this.$refs.inchargeRate && this.$refs.progress && this.$refs.rateDetail){
          if (this.$refs.rateDetail.offsetHeight > this.$refs.inchargeRate.offsetHeight + this.$refs.progress.offsetHeight){
            return '向上滑动加载更多'

          }
        }
        return '点击加载更多'
      }
    },
    methods:{
      // 添加负责人
      selectPersonList(type){
        this.$emit('listenToSelectShow',true)
      },

      // 负责人可拒绝/结束 按钮
      changeCloseSwitch(){
        let cSwitch = this.closeSwitch ? 0 : 1;
        let self = this;
        this.$emit('listenToChild',cSwitch);
        if (this.$store.getters.isDetailPage){
          if (this.$store.getters.subTaskPage){
            if(this.$store.getters.addSubTaskPage){
              return;
            }
            let subtaskJsonStr = JSON.stringify({
              executorCloseTask:cSwitch,
              subtaskId:this.$store.getters.subtaskId,
              title:this.$store.getters.subtaskTitle
            });
            // 子执行人可拒绝/结束 按钮
            let flag = cSwitch ? '40':'41';
            editSubTask({
              subtaskId:this.$store.getters.subtaskId,
              subtaskJsonStr:subtaskJsonStr,
              oldTaskStatus:'1',
              editFlag:flag
            },(result)=>{
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
            })
          }else {
            // 负责人可拒绝/结束 按钮
            let flag = cSwitch ? '70':'71';
            liveUpdateTask({
              'tbQyTaskPO.taskId':this.$store.getters.taskId,
              'tbQyTaskPO.closeSwitch':cSwitch,
              'operationFlag':flag
            },function (result) {
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
            })
          }

        }
      },

      // 处理进度
      handleRate(key,value){
        let self = this;
        this.rateDetailConfig.isRateDetail = true;
        this.rateDetailConfig.currentPersonName = value.personName;
        this.rateDetailConfig.currentRecipient = key;
        this.rateDetailConfig.recipientId = value.recipientId;
        let rateId;
        if (this.$store.getters.subTaskPage){
          this.rateDetailConfig.currentUserId = value.userId || value.recId;
          rateId = value.rateId;
        }else {
          this.rateDetailConfig.currentUserId = value.recId;
          rateId = value.id;
        }
        this.rateDetailConfig.currentIsOver = value.isOver == 1 ? true : false;

        getRateDetail({
          'rateId': rateId,
          'creater': this.rateDetailConfig.currentUserId
        },function (result) {
          self.rateDetailConfig.rateDetail.splice(0,self.rateDetailConfig.rateDetail.length);
          self.rateDetailConfig.rateDetail.push(...result.rateDetailedList);
          self.$store.commit('changeUpdateRateShow',false);
          self.rateDetailConfig.rateHandleShow = true;
        })
      },

      // 加载显示所有进度
      showAllRate(type){
        let self = this;
        // 没有催办权限且不是子任务页面或子任务页面
        if ((!this.hasPermission && !this.$store.getters.subTaskPage) || this.$store.getters.subTaskPage) {
          this.buttonConfig.primaryList.splice(0, 1);
        }else {
          this.buttonConfig.primaryList = [
            {
              type:"primary",
              name:'催办未完成',
              callBack:this.updateUrgentBoxShow
            },
          ]
        }
        if (this.$store.getters.subTaskPage){
          this.hasMore = this.dataBase.subHasMoreRate;
          this.currentPage = this.dataBase.subRateCurrentPage;
        }else {
          this.hasMore = this.dataBase.hasMoreRate;
          this.currentPage = this.dataBase.rateCurrentPage;
        }
        if (this.dataBase.firstLoading || type == 'loadMore'){
          this.dataBase.firstLoading = false;
          this.dataBase.rateLoading = true;
          let params = {};
          if (this.$store.getters.subTaskPage){
            params['subtaskId'] = this.$store.getters.subtaskId;
          }else {
            params['taskId'] = this.$store.getters.taskId;
          }
          params['page'] = this.currentPage;
          getAllTaskRate(params,(result)=>{
            self.rateDetailConfig.lock_roll = false;
            if (self.$store.getters.subTaskPage){
              self.dataBase.subRateCurrentPage = result.currPage + 1;
              self.dataBase.subHasMoreRate = result.currPage >= result.maxPage ? false:true;
            }else {
              self.dataBase.rateCurrentPage = result.currPage + 1;
              self.dataBase.hasMoreRate = result.currPage >= result.maxPage ? false:true;
            }
            self.$emit('listenToListRecRate',result.currPage,result.pageData);
            self.dataBase.allRateShow = true;
            self.dataBase.rateLoading = false;
            document.body.style['overflow-y'] = 'hidden'

          });
        }else {
          self.dataBase.allRateShow = true;
          document.body.style['overflow-y'] = 'hidden'
        }

      },
      // 滚动更多列表
      scrollList(){
        if (!this.$store.getters.isDetailPage || !this.dataBase.allRateShow){
          return;
        }
        let offsetHeight = this.$refs.inchargeRate.offsetHeight;
        if (this.$refs.progress){
          offsetHeight += this.$refs.progress.offsetHeight;
        }
        if(this.$refs.rateDetail.scrollTop + this.$refs.rateDetail.offsetHeight > offsetHeight) {
          if(!this.rateDetailConfig.lock_roll && this.hasMore){
            this.rateDetailConfig.lock_roll=true;
            this.rateDetailConfig.rateCurrentPage++;
            this.showAllRate('loadMore');
          }
        }
      },

      // 催办
      urgentIncharges(){
        let self = this;
        let taskId,isMain;
        if (this.$store.getters.subTaskPage){
          taskId = this.$store.getters.subtaskId;
          isMain = 1;
        }else {
          taskId = this.$store.getters.taskId;
          isMain = '';
        }
        urgentRemind({
          recipientId:this.recipientId,
          taskId:taskId,
          remark:this.remark,
          isMain:isMain
        },(result)=>{
          _.tooltips_succeed('催办成功');
          this.isRateDetail = false;
          self.$store.commit('changeUpdateRateShow',false);
          self.rateHandleShow = false;
        })
      },
      updateUrgentBoxShow(){
        this.urgentUndoneShow = !this.urgentUndoneShow;
      },
      // 返回
      backTrack(){
        this.dataBase.allRateShow =false;
        document.body.style['overflow-y'] = 'auto'
      },

      // 催办未完成
      urgentUndone(){
        urgentUnOver({
          taskId:this.$store.getters.taskId,
          remark:this.urgentReason
        },(result)=>{
          _.tooltips_succeed('催办成功');
        });
        this.urgentUndoneShow =false;
      },
      // 点击头像查看信息
      previewPerson(list){
        if (!list.userId){
          list.userId = list.recId;
        }
        EventBus.$emit("atThisPersonUtil",list);
      },
    },
    watch:{
      isFinishTask(){
        if (this.rate == 0) {
          this.updateReason = this.isFinishTask ? '任务已完成' : '任务未完成';
        }
      },
      subtaskIncharges(){
        this.$store.commit('subRateUpdate',this.subtaskIncharges[0].rate);
        this.oldFinishRate = this.subtaskIncharges[0].rate;
        if (this.rate == 0){
          this.ownFinishRate = this.subtaskIncharges[0].isOver;
        }
        if (this.rate == '2'){
          this.$store.commit('subTotalRateUpdate',this.subtaskIncharges[0].workHour);
        }
      },
      'dataBase.allRateShow':function () {
        if (this.$store.getters.subTaskPage){
          this.buttonConfig.primaryList.splice(0,1);
        }
      },
      'dataBase.hasMoreRate':function () {
        this.hasMore = this.dataBase.hasMoreRate;
      },
      'dataBase.subHasMoreRate':function () {
        this.hasMore = this.dataBase.subHasMoreRate;
      },
      'dataBase.rateCurrentPage':function (val) {
        this.currentPage = this.dataBase.rateCurrentPage;
      },
      'dataBase.subRateCurrentPage':function () {
        this.currentPage = this.dataBase.subRateCurrentPage;
      }
    },
    components:{
      flowButton,
      circularProgress,
      loadMore,
      taskScore
    },
    filters:{
      personNameHandle(val){
        if (val.length > 5){
          return val.substring(0,5) + '...';
        }
        return val;
      }
    }
  }
</script>

<style scoped>
	.progress{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-right: 14px;
	}

	.finishStatus{
		padding: 0 10px;
		border: 1px solid #4693e0;
		color: #4693e0;
		font-size: 12px;
	}

	.time-out{
		border: 1px solid #fe5354;
		color: #fe5354;
	}
</style>

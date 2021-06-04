<template>
  <div>
    <div class="qwui-pop" v-show="rateDetailConfig.rateHandleShow">

      <!--更新自己的进度-->
      <div v-show="updateRateShow">
        <div class="qwui-operating_title">更新{{ typeName }}进度</div>
        <div class="statusInfo" v-if="rate == 0">
          <p class="finishStatus">完成状态</p>
          <span :class="{ 'active':!isFinishTask }" @click="checkFinishFalse">未完成</span>
          <span :class="{ 'active':isFinishTask }" @click="checkFinishTrue">已完成</span>
        </div>
        <div class="percentInfo" v-else-if="rate == 1">
          <span>已完成</span>
          <span class="finishNum">{{ ownFinishRate }}%</span>
          <div class="progressBox">
            <div class="progressbar" ref="progressbar">
              <div class="progressbarInner" :style="{ 'width': personalProWidth }"></div>
              <span class="dragBtn" :style="{ 'left':personalProWidth ? personalProWidth : '0%' }" v-drag="getPosition"></span>
            </div>
          </div>
          <p class="percentTip" v-show="ownFinishRate == 100">任务已完成，将在待处理列表移除</p>
        </div>
        <div class="hourInfo" v-else-if="rate == 2">
          <span>预计工时</span>
          <span class="finishNum">{{ ownTotalRate }}</span>
          <div class="actualHour">
            <span>实际工时</span>
            <input type="number" class="hourInput" min="0" @keyup="checkNum" placeholder="请输入" v-model="ownFinishRate">
          </div>
          <p class="hourTip"><span class="qwui-user_select_icon" :class="{ 'active':isFinishTask }" @click="checkFinish"><i></i></span>完成任务，从待处理列表移除</p>
        </div>
        <div class="tipBox">
          <textarea class="tipArea" v-model="updateReason"></textarea>
        </div>
        <div class="qwui-operating_btn">
          <span class="qwui-cancle_btn" @click.stop="cycleCancel">{{$t('i18n.cancel')}}</span>
          <span class="qwui-confirm_btn" @click.stop="cycleConfirm">{{$t('i18n.confirm')}}</span>
        </div>
      </div>

      <!--他人的进度详情-->
      <div v-show="!updateRateShow">
        <div class="rateTitle">{{ rateDetailConfig.currentPersonName }}的进度详情<i @click="cycleCancel"></i></div>
        <div class="rateDetailBox" v-if="rateDetailConfig.rateDetail.length > 0">
          <div class="rateDetail" v-for="(value,key) in rateDetailConfig.rateDetail" :key="key">
            <p class="operationRecord">
              <span>{{ value.createTime }}</span>
              <span v-if="rate != 0">{{ value.rate || 0 }}{{ rate == 1 ? '%' : '工时' }}</span>
            </p>
            <p class="rateInfo">{{ value.remark || '' }}</p>
          </div>
        </div>
        <div v-else class="noRateTip">还没有添加进度</div>
        <div v-if="hasPermission && !rateDetailConfig.currentIsOver" class="urgent">
          <input type="text" class="urgentInput" v-model="remark">
          <span class="urgentBtn" @click="urgentIncharges">催办</span>
        </div>
        <div v-if="hasPermission" class="delPrincipal" @click.stop="delPrincipal">删除该{{ selectConfig.selectList.showContent }}</div>
      </div>
    </div>
    <div class="qwui-mask" v-show="rateDetailConfig.rateHandleShow"></div>
  </div>
</template>

<script>
  import { getRateDetail,liveUpdateTask,urgentRemind,updateRate,getAllTaskRate,urgentUnOver,deleteRecipient,editSubTask,updateSubRate } from '../../api/getData';
  import eventBus from '@/utils/eventBus';

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
    },
    data(){
      return {
        dataBase:dataBase,
        rateDetailConfig:dataBase.rateDetailConfig,
        allRateShow:false,// 显示所有进度
        taskCloseType:0,// 任务结束类型,0为进行中
        ownNum:0, // 本人的下标值
        ownFinishRate:0,// 自己完成的进度
        oldFinishRate:0,// 旧的完成进度，用于判断是否更改了进度
        ownTotalRate:0,// 自己的总进度
        isFinishTask:false,// 是否已完成
        oldIsFinishTask:false,// 旧工时是否已完成
        taskStatus:STATUSARR,
        remark:'任务还未完成，请及时处理。',// 催办提示语
        updateReason:'阶段性完成',// 更新进度说明
        firstLoading:true,
        loading:false,
        lock_roll:false,
      }
    },
    computed:{
      // 任务是否已结束
      taskOver(){
        return this.$store.getters.taskOver;
      },
      // 更新进度的类型名称
      typeName(){
        if (this.$store.getters.subTaskPage && this.$store.getters.urgentPermission){
          return '子任务';
        }
        return '个人';
      },
      // 个人完成进度的长度
      personalProWidth(){
        return Math.round((this.ownFinishRate/this.ownTotalRate) * 100) + '%';
      },
      userSelected(){
        return this.selectConfig.selectList[this.selectConfig.selectList.type].userSelected;
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
      // 更新进度弹框显示隐藏
      updateRateShow(){
        if (this.$store.getters.updateRateShow){
          if (this.$store.getters.subTaskPage){
            this.ownFinishRate = this.$store.getters.subRate;
            if (this.rate == '2'){
              this.ownTotalRate = this.$store.getters.subTotalRate;
            }else {
              this.ownTotalRate = 100;
            }
          }
          this.rateDetailConfig.rateHandleShow = true;
          return true;
        }else {
          this.rateDetailConfig.rateHandleShow = this.rateDetailConfig.isRateDetail ? true : false;
          return false;
        }
      },
    },
    methods:{
      // 获取拖动条定位
      getPosition(leftValue){
        // 获取灰色滚动条长度
        let progressbarWidth = this.$refs.progressbar.offsetWidth;
        leftValue = leftValue/progressbarWidth;
        leftValue <= 0 ? leftValue = 0 : '';
        leftValue >= 1 ? leftValue = 1 : '';
        this.ownFinishRate = Math.round(leftValue*this.ownTotalRate);
        this.$store.commit('subRateUpdate',this.ownFinishRate);
      },

      // 检查是否已完成
      checkFinish(){
        this.isFinishTask = !this.isFinishTask;
      },
      checkFinishTrue(){
        this.isFinishTask = true;
        this.ownFinishRate = 1;
      },
      checkFinishFalse(){
        this.isFinishTask = false;
        this.ownFinishRate = 0;
      },
      // 验证工时(正整数)
      checkNum(){
        this.ownFinishRate > 10000 ? this.ownFinishRate = 10000 : '';
        this.ownFinishRate < 0 ? this.ownFinishRate = 0 : '';
        this.ownFinishRate = String(this.ownFinishRate).replace(/^(0+)|[^\d]+/g,'');
      },

      // 删除负责人或子任务执行人
      delPrincipal(){
        let self = this;
        this.rateDetailConfig.isRateDetail = false;
        this.rateDetailConfig.rateHandleShow = false;
        let btn={
          primaryBtn: {
            name: '删除',
            callBack: function(){
              let params = {};
              if (self.$store.getters.subTaskPage){
                params['tbQyTaskPO.taskId'] = self.$store.getters.taskId;
                params['subtaskId'] = self.$store.getters.subtaskId;
                params['executorId'] = self.rateDetailConfig.recipientId;
                params['title'] = self.$store.getters.subtaskTitle
              }else {
                params['tbQyTaskPO.taskId'] = self.$store.getters.taskId;
                params['recipientId'] = self.rateDetailConfig.recipientId
              }
              deleteRecipient(params,(result)=>{
                // 子任务删除执行人，主任务删除负责人
                for (let i = 0; i < self.userSelected.length; i++) {
                  let obj = self.userSelected[i];
                  if (obj.userId == self.rateDetailConfig.currentUserId){
                    if (self.rate == 2){
                      self.$emit('listenToWorkHour',result.allExecutorWorkhour);
                    }
                    self.userSelected.splice(i,1)
                  }
                }
                // 删除自己去掉更新进度按钮
                if (self.rateDetailConfig.currentUserId == _.userId){
                  self.dataBase.isMainIncharge = false;
                  self.$store.commit('isInchargeUpdate',false);
                }

                if (!self.$store.getters.subTaskPage){
                  // 所有人进度页面删除后重新请求前10条
                  if (self.dataBase.allRateShow){
                    let params = {};
                    params['taskId'] = self.$store.getters.taskId;
                    self.dataBase.rateCurrentPage = 1;
                    params['page'] = 1;
                    getAllTaskRate(params,(res)=>{
                      self.rateDetailConfig.lock_roll = false;
                      self.dataBase.rateCurrentPage = res.currPage + 1;
                      self.dataBase.hasMoreRate = res.currPage >= res.maxPage ? false:true;
                      self.rateDetailConfig.loading = false;
                      self.$emit('listenToRate',res.pageData,result.rateAverage)
                    })
                  }else {
                    self.dataBase.firstLoading = true;
                    self.$emit('listenToRate',result.listRecRate,result.rateAverage)
                  }
                }else {
                  if (self.dataBase.allRateShow){
                    let params = {};
                    params['subtaskId'] = self.$store.getters.subtaskId;
                    self.dataBase.subRateCurrentPage = 1;
                    params['page'] = 1;
                    getAllTaskRate(params,(res)=>{
                      self.rateDetailConfig.lock_roll = false;
                      self.dataBase.subRateCurrentPage = res.currPage + 1;
                      self.dataBase.subHasMoreRate = res.currPage >= res.maxPage ? false:true;
                      self.rateDetailConfig.loading = false;
                      self.$emit('listenTosubRate',res.pageData);
                    })
                  }else {
                    self.dataBase.firstLoading = true;
                    self.$emit('listenTosubRate',result.fiveSubtaskExecutor)
                  }
                }
                _.tooltips_succeed("删除成功");
                self.rateDetailConfig.isRateDetail = false;
                self.$store.commit('changeUpdateRateShow',false);
                self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
              });

            }
          },
          defaultBtn:{
            name:"取消",
            callBack(){
              self.rateDetailConfig.rateHandleShow = true;
            }
          },
        };
        _.alert('','是否删除该'+this.selectConfig.selectList.showContent,btn)
      },

      // 计算进度
      calculateRate(principal){
        let self = this;
        // 默认不是任务的负责人或执行人，当子负责人id等于当前登录人id，是负责人或子任务执行人
//        this.$store.commit('isInchargeUpdate',false);

        for (let i = 0; i < principal.length; i++) {
          if (_.userId == (principal[i].recId || principal[i].userId)){
              self.ownNum = i;
              self.isFinishTask = principal[i].isOver ? true : false;
              self.ownFinishRate = Number(principal[i].rate) || 0;
              if (this.rate == 0){
                self.ownFinishRate = principal[i].isOver;
              }
              self.oldFinishRate = self.ownFinishRate;
              self.ownTotalRate = principal[i].workHours || principal[i].workHour || 100;
              if (this.rate == 1){
                self.ownTotalRate = 100;
              }else if (this.rate == 2){
                self.oldIsFinishTask = principal[i].isOver;
              }
              self.$store.commit('isInchargeUpdate',true);
//            }
          }
        }
      },
      // 催办
      urgentIncharges(){
        let self = this;
        let taskId,isMain;
        if (this.$store.getters.subTaskPage){// 子任务
          taskId = this.$store.getters.subtaskId;
          isMain = 1;
        }else {// 主任务
          taskId = this.$store.getters.taskId;
          isMain = '';
        }
        urgentRemind({
          recipientId:this.rateDetailConfig.recipientId,
          taskId:taskId,
          remark:this.remark,
          isMain:isMain
        },(result)=>{
          _.tooltips_succeed('催办成功');
          this.rateDetailConfig.isRateDetail = false;
          self.$store.commit('changeUpdateRateShow',false);
          self.rateDetailConfig.rateHandleShow = false;
        })
      },
      updateUrgentBoxShow(){
        this.urgentUndoneShow = !this.urgentUndoneShow;
      },
      // 返回
      backTrack(){
        this.dataBase.allRateShow =false;
        document.querySelector('html').style.overflow = 'auto';
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

      // 取消
      cycleCancel(){
        this.rateDetailConfig.isRateDetail = false;
        this.$store.commit('changeUpdateRateShow',false);
        this.rateDetailConfig.rateHandleShow = false;
      },

      // 更新进度
      cycleConfirm(){
        let self = this;
        // 详情页且进度有变化，
          let finishRate = self.ownFinishRate;
          if (this.rate == 0){
            finishRate = this.isFinishTask ? 100 : 0;
          }

          if (this.$store.getters.subTaskPage){
            if(this.$store.getters.addSubTaskPage){
              return;
            }
            let type = 4;// 子任务执行人
            if (this.$store.getters.urgentPermission){
              type = 3; // 子任务负责人
            }
            // 更新子任务进度
            updateSubRate({
              taskId:this.$store.getters.taskId,
              subtaskId:this.$store.getters.subtaskId,
              rate:Number(finishRate),
              type:type,
              updateUserId:_.userId,
              reason: this.updateReason,
              isCheck: this.isFinishTask ? 1:0,
              title:this.$store.getters.subtaskTitle
            },(result)=>{
              self.oldFinishRate = self.ownFinishRate;
              self.oldIsFinishTask = self.isFinishTask;
              self.$emit('listenTosubRate',result.fiveSubtaskExecutor);
              if (type == 3){
                self.$store.commit('subRateUpdate',finishRate);
                self.$emit('listenToSubIncharge',this.isFinishTask,this.ownFinishRate,this.currentSubTask);
              }
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
              _.tooltips_succeed('更新成功');
            });
          }else {
            // 更新主任务进度
            updateRate({
              taskId:this.$store.getters.taskId,
              rate:Number(finishRate),
              type:1,
              updateUserId:_.userId,
              reason: this.updateReason,
              isCheck: this.isFinishTask ? 1:0
            },(result)=>{
              self.oldFinishRate = self.ownFinishRate;
              self.oldIsFinishTask = self.isFinishTask;
              // 更新平均进度
              self.$emit('listenToRate',result.listRecRate,result.rateAverage);
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
              self.$store.commit('liveCommentListUpdate',result.comments);
              _.tooltips_succeed('更新成功');
              if (self.isFinishTask){
                self.$emit('listenToSubTaskStatus');
              }
            });
          }
//        }
        this.rateDetailConfig.isRateDetail = false;
        self.$store.commit('changeUpdateRateShow',false);
        this.rateDetailConfig.rateHandleShow = false;
      }
    },
    watch:{
      isFinishTask(){
        if (this.rate == 0) {
          this.updateReason = this.isFinishTask ? '任务已完成' : '任务未完成';
        }
      },
      updateRateShow(){
        if (this.updateRateShow){
          let principal = this.listRecRate;
          if (principal.length > 0){
            this.calculateRate(principal);
          }
        }
      }
    },
    components:{

    },
    directives:{
      drag:{
        inserted:function (el,binding) {
          let oDiv = el;   //当前元素
          oDiv.onmousedown = function (e) {
            e.preventDefault();
            //鼠标按下，计算当前元素距离可视区的距离,16是拖动图标margin的数值
            let disX = e.clientX - oDiv.offsetLeft - 16;
            document.onmousemove = function (e) {
              //通过事件委托，计算移动的距离
              let l = e.clientX - disX;
              //移动当前元素
              binding.value(l)
            };
            document.onmouseup = function (e) {
              document.onmousemove = null;
              document.onmouseup = null;
            };
          };
          let canMove = false;// 是否可以拖动
          oDiv.addEventListener('touchstart',function (e) {
            canMove = true;
            e.preventDefault();
            let disX =  e.touches[0].clientX - oDiv.offsetLeft - 16;
            document.addEventListener('touchmove',function (e) {
              if (canMove){
                //通过事件委托，计算移动的距离
                let l =  e.touches[0].clientX - disX;
                //移动当前元素
                binding.value(l)
              }

            });
            document.addEventListener('touchend',function (e) {
              canMove = false;
              document.onmousemove = null;
              document.onmouseup = null;
            })
          })
        }
      }
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

<style>

</style>

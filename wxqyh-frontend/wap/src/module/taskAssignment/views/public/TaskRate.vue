<!--进度反馈选择组件，默认不选择，点击选择才显示勾选图标-->
<template>
  <div>
    <div class="qwui-rate_item" ref="rate" @click="showRate">
      <i class="qwui-rate_icon"></i>
      <div class="qwui-flexItem">
        <span class="qwui-rate_data">{{ rateData[rateNum].text }}</span>
      </div>
      <i class="qwui-rate_right"></i>
    </div>
    <div v-show="!editHourShow && rateBoxShow" class="qwui-choose_rate">
      <p class="qwui-rate_title">{{$t('i18n.taskFellbackWay')}}</p>
      <ul class="qwui-rate_list" >
        <li v-for="(value,key,index) in rateData"
            :key="key"
            class="qwui-rate_type"
            :class="['qwui-rate_type' + key,{ 'actived':!firstChoose && key == rateNum}]"
            @click="chooseRate(key)">
          {{ value.text }}
          <i v-show="!firstChoose && key == rateNum" class="qwui-choose_icon"></i>
          <p v-if="firstChoose && key==0 && rateNum==0" class="qwui-default_type">({{$t('i18n.taskProgressDefault')}})</p>
          <p v-else-if="key==2 && rateNum==2" class="qwui-default_type">({{$t('i18n.taskClickEdit')}})</p>
        </li>
      </ul>
    </div>
    <div class="qwui-mask z-index_top" v-show="rateBoxShow" @click="hideRate"></div>
    <div v-show="hoursBoxShow" class="selectBox" ref="hoursBox" v-scroll="scrollList">
      <div class="qwui-total_hours" ref="totalHour">
        <p class="qwui-total_title">{{$t('i18n.unifiedSetting')}}</p>
        <input v-model="uniteHours"
               type="number"
               max="10000"
               min="1"
               class="qwui-total_input"
               :placeholder="$t('i18n.expectedTime')"
               @keyup="changeUnite">
      </div>
      <div class="qwui-single_hour" ref="singleHour">
        <div class="qwui-single_title qwui-border_bottom">
          {{$t('i18n.responsibleSetting')}} ·
          <span>{{ principalData.length }}</span>
        </div>
        <ul class="qwui-hour_ul">
          <li class="qwui-hour_principal" v-for="(value,key,index) in principalData" :key="key">
            <span class="qwui-principal_info">
              <img class="qwui-head_pic" :src="value.headPic == '0' ? defaultHeadPic : value.headPic">
              <span class="qwui-principal_name">{{ value.personName }}</span>
            </span>
            <span class="qwui-expected">{{$t('i18n.expectedWorkTime')}}
              <input class="qwui-expected_input" type="number" max="10000" min="1" v-model="value.workHour" @keyup="checkNum(key)">
            </span>
          </li>
        </ul>
      </div>
      <load-more v-if="isDetailPage && !addSubTaskPage" :type="'commentList'" :loadMoreDesc="loadMoreDesc" :hasMore="hasMore" :loading="loading" @loadMoreClick="loadMorePerson">
        <p>已没有更多</p>
      </load-more>
      <button_group :fixed="true">
        <qwui_button type="default" :text="$t('i18n.cancel')" @buttonClick="cancelSelected"></qwui_button>
        <qwui_button type="primary" :text="$t('i18n.confirm')" @buttonClick="confirmSelected"></qwui_button>
      </button_group>
    </div>
  </div>
</template>

<script>
  import loadMore from '@/components/list/load_more';
  import { qwui_button, button_group } from '@/components/base/button'
  import { getWorkHourPerson,updateWorkHour } from '../../api/getData';
  export default {
    props:{
      selectconfig:{
        type:Object,
        default(){
          return {}
        }
      },
      rateShow:{
        type:Boolean,
      },
      rate:{
        type:[Number,String],
        default:0
      },
    },
    data(){
      return {
        dataBase:dataBase,
        rateBoxShow:false,
        hoursBoxShow:false, // 按工时设置页面
        rateData:{
          0:{
            text:this.$t('i18n.taskCompletionState'),
          },
          1:{
            text:this.$t('i18n.taskPercentage'),
          },
          2:{
            text:this.$t('i18n.taskPressTime'),
          }
        }, // 进度反馈数据
        rateNum: this.rate, // 选择的反馈类型
        uniteHours:'', // 统一工时
        firstChoose:true,// 第一次选择显示默认
        defaultHeadPic: require('../../../../assets/images/touxiang02.png'),// 默认头像
        workHourPerson:[],// 工时人员
        oldPrincipalData:[],// 旧人员数据
        hasMore:false,
        loading:false,
        lock_roll:false,
        currentPage:1,
        loadMoreDesc:'点击加载更多'
      }
    },
    computed:{
      principalData(){
        let mainIncharges;
        if (this.$store.getters.isDetailPage && !this.$store.getters.addSubTaskPage){
          mainIncharges = this.workHourPerson;
        }else {
          mainIncharges = this.selectconfig.selectList[this.selectconfig.selectList.type].userSelected;
        }
        for (var i = 0; i < mainIncharges.length; i++) {
          if (!mainIncharges[i].workHour){
            this.$set(mainIncharges[i],'workHour',this.uniteHours == '' ? 10 : this.uniteHours)
          }
        }
        return mainIncharges;
      },
      editHourShow(){
        if (((this.$store.getters.isDetailPage && this.$store.getters.taskLevel == 'a1') || (this.$store.getters.subTaskPage && (this.$store.getters.urgentPermission || !this.$store.getters.isDetailPage)) || this.$store.getters.addSubTaskPage)  && this.rate == 2 && !this.$store.getters.taskOver){
          this.rateNum = this.rate;
          return true;
        }
        return false;
      },
      isDetailPage(){
        return this.$store.getters.isDetailPage;
      },
      addSubTaskPage(){
        return this.$store.getters.addSubTaskPage;
      }
    },
    methods:{
      showRate(){
        let self = this;
        if (this.editHourShow){
          if (this.isDetailPage && !this.addSubTaskPage){
            this.currentPage = 1;
            this.hasMore = false;
            this.loadMorePerson();
          }
          this.hoursBoxShow = true;

        }else {
          this.rateBoxShow = true;
        }
      },
      hideRate(){
        if(!this.$store.getters.rateDisplay){
          this.$emit('listenToChild',false);
        }
        this.rateBoxShow = false;
      },
      chooseRate(key){
        if (key == 2){
          this.hoursBoxShow = true;
          return;
        }else{
          this.firstChoose = false;
        }
        this.$store.commit('rateDisplayUpdate');
        this.$store.commit('mainAddContentModuleHideUpdate');
        this.rateNum = key;
        this.$emit('listenToChild',key)
        this.rateBoxShow = false;
      },
      changeUnite(){
        this.uniteHours = this.uniteHours.replace(/^(0+)|[^\d]+/g,'');
        this.uniteHours > 10000 ? this.uniteHours = 10000 : '';
        this.uniteHours < 0 ? this.uniteHours = 0 : '';
      },
      checkNum(key){
        this.principalData[key]['workHour'] = this.principalData[key]['workHour'].replace(/^(0+)|[^\d]+/g,'');
        this.principalData[key]['workHour'] > 10000 ? this.$set(this.principalData[key],'workHour',10000) : '';
        this.principalData[key]['workHour'] < 0 ? this.$set(this.principalData[key],'workHour',0) : '';
      },
      scrollList(){
        if (this.$refs.hoursBox.scrollTop + this.$refs.hoursBox.offsetHeight > this.$refs.singleHour.offsetHeight + this.$refs.totalHour.offsetHeight){
          if (!this.lock_roll && this.hasMore){
            this.lock_roll = true;
            this.loadMorePerson();
          }
        }
      },
      loadMorePerson(){
        let params = {};
        if (this.$store.getters.subTaskPage){
          params['id'] = this.$store.getters.subtaskId;
        }else {
          params['id'] = this.$store.getters.taskId;
        }
        params['page'] = this.currentPage;
        params['size'] = 10;
        getWorkHourPerson(params,(result)=>{
          this.currentPage = result.currPage + 1;
          this.hasMore = result.currPage >= result.maxPage ? false:true;
          if (result.pageData){
            this.workHourPerson.push(...result.pageData);
            result.pageData.forEach((item)=>{
              if (this.uniteHours != ''){
                item.workHour = this.uniteHours;
              }
              this.oldPrincipalData.push({
                userId:item.id,
                workHour:item.workHour
              })
            });
          }
          this.lock_roll = false;
        });
      },
      cancelSelected(){
        this.hoursBoxShow = false;
        this.workHourPerson = [];
        this.oldPrincipalData = [];
      },
      confirmSelected(){
        for (let i = 0; i < this.principalData.length; i++) {
          let item = this.principalData[i];
          if (item.workHour == 0 || item.workHour == ''){
            _.alert('','预计工时不能为0或空');
            return;
          }
        }
        this.$store.commit('rateDisplayUpdate');
        this.$store.commit('mainAddContentModuleHideUpdate');
        this.hoursBoxShow = false;
        this.rateNum = 2;
        this.firstChoose = false;
        this.$emit('listenToChild',2);
        this.$emit('listenChildData',this.principalData);
        this.rateBoxShow = false;
        // 实时更新工时
        if (this.$store.getters.isDetailPage && !this.$store.getters.addSubTaskPage && this.principalData.length > 0){
          let list = [];
          let commentDesc = [];
          this.principalData.forEach((item)=>{
            this.oldPrincipalData.forEach((items)=>{
              if (item.id == items.userId && item.workHour != items.workHour && item.workHour != this.uniteHours){
                list.push({
                  id:item.id,
                  workHour:item.workHour,
                })
                commentDesc.push(item.personName+'的预计工时由'+items.workHour+'h修改为'+item.workHour+'h');
              }
            })
          });
          let taskId,type;
          if (this.$store.getters.subTaskPage){
            taskId = this.$store.getters.subtaskId;
            type = 1;
          }else {
            taskId = this.$store.getters.taskId;
            type = 0;
          }
          let rateJson = JSON.stringify({
            'rateJson':list
          });
          if (list.length == 0){
            rateJson = '';
          }
          updateWorkHour({
            'id':taskId,
            'rateJson':rateJson,
            'allRateWorkHour':this.uniteHours,
            'type':type,
            'commentDesc':commentDesc.join(',')
          },(result)=>{
            this.workHourPerson = [];
            this.oldPrincipalData = [];
            this.$emit('listenToReload');
            this.uniteHours = '';
            if (result.tbQyTaskCommentList){
              this.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
            }
          })
        }
      },
    },
    watch:{
      rateShow(val){
        this.$refs.rate.click();
      },
      rate(){
        this.rateNum = this.rate;
      },
      uniteHours() {
        for (let i = 0; i < this.principalData.length; i++) {
          this.$set(this.principalData[i], 'workHour', this.uniteHours);
        }
      }
    },
    components:{
      loadMore,
      qwui_button,
      button_group
    }
  }
</script>

<style>
  @media screen and (min-width:1024px) {
    .qwui-choose_rate{
      width: 740px !important;
      margin: 0 auto;
    }
  }
  .selectBox {
    overflow-y: auto;
    padding-bottom: 60px;
  }
  .qwui-rate_item{
    display: flex;
    position: relative;
    min-height: 26px;
    color: #0A1735;
    font-size: 15px;
    line-height: 46px;
    background: #fff;
  }
  .qwui-flexItem {
    flex: 1;
  }
  .qwui-rate_icon {
    width: 26px;
    padding-left: 15px;
    background: url("../../../../../src/assets/images/icon_a-newtask-list_feedback.svg") no-repeat scroll right;
  }
  .qwui-rate_data {
    padding-left: 8px;
  }
  .qwui-choose_rate {
    position: fixed;
    bottom: 0;
    width: 100%;
    margin: 0 auto;
    z-index: 11;
    background: #fff;
  }
  .qwui-choose_icon {
    position: absolute;
    top: 55px;
    left: 50%;
    margin-left: 7px;
    width: 14px;
    height: 15px;
    background: url("../../../../../src/assets/images/icon_a-feedback_state_select.svg") no-repeat;
    background-size: 14px 15px;
  }
  .qwui-rate_title {
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 16px;
    color: #0A1735;
  }
  .qwui-rate_list {
    display: flex;
    height: 149px;
  }
  .qwui-rate_type0 {
    background: center url("../../../../../src/assets/images/icon_a-feedback_state.svg") no-repeat;
  }
  .qwui-rate_type1 {
    background: url("../../../../../src/assets/images/icon_a-feedback_percentage.svg") no-repeat;
  }
  .qwui-rate_type2 {
    background: url("../../../../../src/assets/images/icon_a-feedback_time.svg") no-repeat;
  }
  .qwui-rate_type {
    flex: 1;
    position: relative;
    padding-top: 75px;
    text-align: center;
    background-position: center 37px;
    color: #7A7C80;
    font-size:13px;
  }
  .qwui-rate_type.actived {
    color: #5585F0;
  }
  .qwui-default_type {
    color: #B2B9C8;
    font-size:11px;
  }
  .qwui-total_hours {
    margin: 8px 0;
    height: 46px;
    background: #fff;
  }
  .qwui-total_title {
    display: inline-block;
    margin: 13px;
    height: 21px;
    line-height: 21px;
    font-size: 15px;
    color: #0A1735;
  }
  .qwui-total_input {
    float: right;
    margin: 14px 13px;
    width: 180px;
    height: 20px;
    text-align: right;
    font-size: 14px;
  }
  .qwui-single_hour {
    padding: 0 14px;
    background: #fff;
  }
  .qwui-single_title {
    height: 44px;
    line-height: 44px;
    font-size: 13px;
    color: #7A7C80;
  }
  .qwui-hour_principal {
    height: 50px;
    line-height: 50px;
  }
  .qwui-principal_info {
    display: inline-block;
    width: 50%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .qwui-head_pic {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    vertical-align: middle;
  }
  .qwui-principal_name {
    color: #0A1735;
    font-size: 15px;
  }
  .qwui-expected {
    float: right;
    color: #7A7C80;
  }
  .qwui-expected_input {
    width: 50px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    background: #F7F8FA;
    color: #FF548F;
    font-size: 14px;
    border-radius:2px;
  }
  .qwui-rate_right{
    width: 24px;
    padding-right: 15px;
    background: url("../../../../assets/svg/right.svg") no-repeat scroll left;
  }
  .qwui-total_input::-webkit-outer-spin-button,
  .qwui-total_input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .qwui-total_input[type="number"]{
    -moz-appearance: textfield;
  }
</style>

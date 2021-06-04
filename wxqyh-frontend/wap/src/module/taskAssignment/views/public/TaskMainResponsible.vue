<template>
  <div>
    <div class="qwui-responsible_item">
      <i class="qwui-responsible_left" :class="{ 'relevant':type=='相关人','subIncharge':type=='负责人' && selectconfig.level == 'subIncharge' }"></i>
      <div class="qwui-flexItem qwui-add_responsible" ref="add_responsible">
        <span class="qwui-incharges_desc">{{type}}</span>
        <span class="qwui-avatar" v-show="toSelected && toTotalUser>0" ref="avatar">
          <img v-for="(list,i) in selectconfig.selectList[selectconfig.selectList.type].userSelected" :src="list.headPic=='0'?defaultHeadPic:list.headPic" v-show="headPicShow || i<avatarLength" @click.stop="previewPerson(list)">
          <span class="qwui-relevant_more" v-show="relevantShow" @click.stop="showRelevant"></span>
          <span class="qwui-show_up" v-show="packUp && !relevantShow" @click.stop="hideRelevant"></span>
        </span>
      </div>
			<!-- v-if="hasPermission" -->
      <i class="qwui-responsible_right" :class="addResponsibleClass" @click="selectPersonList(selectconfig.selectList.type)"></i>
      <!-- <i v-else class="qwui-subtask_placeholder"></i> -->
    </div>
    <div v-if="showLoadLastBtn" class="qwui-responsible_set_box">
      <span class="qwui-responsible_set">加载上次</span>
      <div class="qwui-onOff_choose"
           :class="{'qwui-onOff_on': toSelectId, 'qwui-onOff': !toSelectId}"
           @click="loadLastIncharges">
        <span class="qwui-onOff_off" :class="{'active': toSelectId}"></span>
      </div>
    </div>
    <div class="qwui-responsible_set_box" v-show="selectconfig.selectList.showBtn">
      <span class="qwui-responsible_set">{{type}}可结束/拒绝/重启{{showText}}任务</span>
      <div class="qwui-onOff_choose"
           :class="{'qwui-onOff_on': closeSwitch, 'qwui-onOff': !closeSwitch}"
           @click="changeCloseSwitch">
        <span class="qwui-onOff_off" :class="{'active': closeSwitch}"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import { loadLastIncharceData } from '../../api/getData'
  import EventBus from '@/utils/eventBus'
  export default {
    props:{
      'selectconfig':{
        type:Object,
        default(){
          return {}
        }
      },
      'relevantPersonShow':{},
      'taskPage':{
        type:String,
        default:''
      },
      'closeSwitch':{
        type:[Number,String],
        default:0
      },
      loadLastBtn:{
        type:Boolean,
        default:false
      }
    },
    data(){
      return{
        toTotalUser:0,
        userData:{
          user:{
            data:[]
          },
        },
        defaultHeadPic: require('../../../../assets/images/touxiang02.png'),//没有头像时的默认头像
        addResponsibleClass:'',
        toSelectId:false,
        showText:'',
        relevantShow:false,// 是否展示更多的图标
        packUp:false,// 是否展示收起图标
        headPicShow:false,// 展示负责人头像
        oldPerson:[],// 旧人员数据
        newPerson:[],// 新人员数据
        disableBtn:false,
      }
    },
    watch:{
      relevantPersonShow(){
        document.querySelector('.qwjs-relevant_person').click();
      },
      inchargeLength:function () {
        this.handleInchargeData();
      },
      loadLastBtn(){
        this.toSelectId = false;
      }
    },
    created(){
      if(this.relevantPersonShow!=undefined){
        this.addResponsibleClass = 'qwjs-relevant_person';
      }
      this.selectconfig.show = false;
      this.selectconfig.signIndex="";
      this.selectconfig.selectList[this.selectconfig.selectList.type].callBack.confirm = this.confirmSelect;
      console.log('this.selectconfig',this.selectconfig)
			this.handleInchargeData();
    },
    methods:{
      handleInchargeData(){
        if (this.selectconfig.selectList.showBtn==undefined){
          this.selectconfig.selectList.showBtn = false
        }else {
          if (this.inchargeLength > 0 && (this.type == '执行人' || (this.type == '负责人' && this.selectconfig.level != 'subIncharge'))){
            this.selectconfig.selectList.showBtn = true;
          }else {
            this.selectconfig.selectList.showBtn = false;
          }
        }
        if (this.inchargeLength<this.avatarLength){
          this.headPicShow = true;
          this.relevantShow = false;
        }else {
          this.headPicShow = false;
          this.relevantShow = true;
        }
      },
      showRelevant(){
        this.relevantShow = false;
        this.headPicShow = true;
        this.packUp = true;
      },
      hideRelevant(){
        this.relevantShow = true;
        this.headPicShow = false;
        this.packUp = false;
      },
      previewPerson(list){
        // 非详情页，点击不展示人员信息
        if (!this.$store.getters.isDetailPage || this.$store.getters.addSubTaskPage){
          return;
        }
        EventBus.$emit("atThisPersonUtil",list);
      },
      changeCloseSwitch(){
        let OnOff = this.closeSwitch == 1 ? 0 : 1;
        this.$emit('listenToChild',OnOff);
      },
      loadLastIncharges(){
        if (this.disableBtn){
          return;
        }
        this.disableBtn = true;
        let self = this;
        // 判断加载上次按钮开关
        this.toSelectId = this.toSelectId ? false : true;
        if (this.toSelectId){
          loadLastIncharceData(this.selectType,function (data) {
            // 记录加载上次前的人员数据
            self.oldPerson.splice(0,self.oldPerson.length);
            self.oldPerson.push(...self.selectPerson);
            // 有些接口无userId，重新赋值userId等于recId
            data.ccOrTolist.forEach((item)=>{
              if (!item.userId || item.userId == ''){
                item.userId = item.recId;
              }
            });
            // 赋值人员数据
            if (self.selectType == 3){// 子任务负责人做特殊处理
              if (data.ccOrTolist.length == 0){
                return;
              }else {
                self.selectPerson.splice(0,1,data.ccOrTolist[0]);
                self.newPerson = [data.ccOrTolist[0]]
              }
            }else {
              self.selectPerson.splice(0,self.selectPerson.length);
              self.selectPerson.push(...data.ccOrTolist);
              // 记录接口返回的人员数据
              self.newPerson = data.ccOrTolist;
            }
            self.disableBtn = false;
          })
        }else {// 关闭加载上次按钮
          // 清除加载上次获取的人员数据，剩下用户新添加的数据
          for (let i = 0; i < this.selectPerson.length; i++) {
            let item = this.selectPerson[i];
            this.newPerson.forEach((items)=>{
              if (item.userId == items.userId){
                this.selectPerson.splice(i,1);
                i--;
              }
            })
          }
          // 剩下用户新添加的人员数据与旧人员数据对比去重，剩下与旧人员数据不相同的人员数据
          for (let i = 0; i < this.selectPerson.length; i++) {
            let item = this.selectPerson[i];
            this.oldPerson.forEach((items)=>{
              if (item.userId == items.userId){
                this.selectPerson.splice(i,1);
                i--;
              }
            })
          }
          // 子任务负责人特殊处理
          if (self.selectType == 3){
            this.selectPerson.splice(0,1,this.oldPerson[0]);
          }else {
            // 最后添加旧人员数据
            this.selectPerson.unshift(...this.oldPerson);
          }
          this.oldPerson = [];
          this.newPerson = [];
          this.disableBtn = false;
        }
      },
      selectPersonList(type){
        // if (!this.hasPermission){return;}
        this.selectconfig.show=true;
        this.selectconfig.signIndex=type;
      },
      //统计部门、人员的总数
      countTotalUser(type,user,dept){
        var totalUser=0;
        if(user && user.length>0){
          totalUser+=user.length;
        }
        if(dept && dept.length>0){
          for(var i=0;i<dept.length;i++){
            if(dept[i].totalUser>0){
              totalUser+=Number(dept[i].totalUser);
            }
          }
        }
        type==this.selectconfig.selectList.type? this.toTotalUser=totalUser:false;
      },
      confirmSelect(el,obj){ //确定选择
        if (this.type == '负责人'){
          this.$store.commit('updateMainIncharges',this.selectconfig.selectList['toPersonList'].userSelected);
        }
        var addModuleType = window.sessionStorage.getItem('addModuleType');
        var fromAddContent = window.sessionStorage.getItem('fromAddContent');
        if(addModuleType&&addModuleType=='mainAddModule'&&fromAddContent!='fromAddContent'){
          this.$store.commit('mainAddContentModuleHideUpdate');
          this.$store.commit('relevantPersonDisplayUpdate',true);
          window.sessionStorage.removeItem('addModuleType');
        }
      }
    },
    computed:{
      // 显示的头像人数
      avatarLength(){
        let w = document.documentElement.clientWidth;
        w = w>1024 ? 740-88 : w-88;
        return Math.floor((w/32))*2-1;
      },
      type(){
        if(this.selectconfig.selectList.showContent=='执行人'){
          this.showText = '子';
        }
        return this.selectconfig.selectList.showContent;
      },
      selectType(){
        if (this.taskPage == 'mainTask'){// 主任务
          if (this.selectconfig.selectList.type == 'toPersonList'){// 负责人
            return 0;
          }
          return 1;// 相关人
        }
        if (this.selectconfig.selectList.type == 'toPersonList'){// 子任务
          return 3;// 负责人
        }
        return 4;// 执行人
      },
      selectPerson(){
        return this.selectconfig.selectList[this.selectconfig.selectList.type].userSelected;
      },
      toSelected(){
        this.countTotalUser(this.selectconfig.selectList.type,this.selectconfig.selectList[this.selectconfig.selectList.type].userSelected,this.selectconfig.selectList[this.selectconfig.selectList.type].deptSelected)
        return true;
      },
      inchargeLength(){
        if (this.selectconfig.selectList[this.selectconfig.selectList.type].userSelected){
          return this.selectconfig.selectList[this.selectconfig.selectList.type].userSelected.length;
        }
      },
      hasPermission(){
        this.$store.commit('hasPermissionUpdate');
        return this.$store.getters.hasPermission;
      },
      showLoadLastBtn(){
        return !this.$store.getters.isDetailPage && !this.$store.getters.subTaskPage;
      }
    }
  }

</script>

<style type="text/css" scoped="">
  .qwui-responsible_item{
    display: flex;
    color:#0A1735;
    font-size: 15px;
    line-height: 46px;
    background: #fff;
  }
  .qwui-flexItem {
    flex: 1;
  }
  .qwui-add_responsible{
    padding-left: 8px;
  }
  .qwui-responsible_right{
    width: 24px;
    padding-right: 15px;
    background: url("../../../../assets/svg/icon-a-public_arrow-lower.svg") no-repeat scroll left;
    /*background: url("../../../../assets/svg/right.svg") no-repeat scroll left;*/
    background-position-y: 9px;
  }
  .qwui-subtask_placeholder {
    width: 24px;
    padding-right: 15px;
  }
  .qwui-responsible_left{
    width: 26px;
    padding-left: 15px;
    background: url("../../../../assets/svg/icon_a-newtask-list_execute.svg") no-repeat scroll right;
    background-position-y: 9px;
  }
  .qwui-responsible_left.relevant {
    background: url("../../../../assets/svg/icon_a-newtask-list_relevant.svg") no-repeat scroll right;
    background-position-y: 9px
  }
  .qwui-responsible_left.subIncharge {
    background: url("../../../../assets/svg/icon_a-newtask-list_preside.svg") no-repeat scroll right;
    background-position-y: 9px
  }
  .qwui-avatar {
    display: inline-block;
    /*margin-top: 6px;*/
  }
  .qwui-avatar img,.qwui-relevant_more,.qwui-show_up{
    position: relative;
    top: 6px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .qwui-relevant_more, .qwui-show_up {
    display: inline-block;
    right: 3px;
    background: url("../../../../assets/svg/icon_a-relevant_more.svg") no-repeat;
    background-size: cover;
  }
  .qwui-show_up {
    background: url("../../../../assets/svg/icon_a-relevant_retract.svg") no-repeat;
  }
  .qwui-responsible_set_box{
    display: flex;
    position: relative;
    line-height: 40px;
  }
  .qwui-responsible_set{
    flex:1;
    color:#B2B9C8;
    font-size: 14px;
    padding-left: 48px;
  }
  .qwui-incharges_desc {
    margin-right: 10px;
  }
  .qwui-responsible_set_btn{
    margin-top: 10px;
    margin-right: 15px;
    /*flex:1;*/
    /*text-align: right;*/
  }
  .qwui-user_cell_input{
    position: relative;
    width: 40px;
    height: 22px;
    background: url("../../../../assets/svg/switch_off.svg")no-repeat;
    cursor: pointer;
  }
  .qwui-user_cell_input.actived{
    background: url("../../../../assets/svg/switch_on.svg")no-repeat;
  }
  .qwui-user_cell_input:after, .qwui-user_cell_input:before{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    border-radius: 15px;
  }
  .qwui-user_cell_input:before{
    width: 38px;
    background-color: #fdfdfd;
    transition: transform .35s cubic-bezier(.45,1,.4,1);
  }
  .qwui-user_cell_input:checked:after{
    transform: translateX(18px)
  }
  .qwui-user_cell_input:after{
    width: 20px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,.4);
    transition: -webkit-transform .35s cubic-bezier(.4,.4,.25,1.35);
  }
  .qwui-user_cell_input:checked:before{
    transform: scale(0)
  }

</style>


<template>
  <div class="dataWrap">
    <header>
      <setting-header :pages="['设置','数据权限设置']" @go-back="goBackClick">
        <!-- 头部插槽 -->
        <div slot="right" class="setting-help">
          <span class="help-text">使用帮助</span>
          <i class="question-circle" @click="helpClick">?</i>
        </div>
      </setting-header>
    </header>
    <div class="team-select">
      <div class="left-select">
        <!-- 团队列表 -->
        <left-side-bar
                      v-show="hasTeamData"
                      :renderConfig="renderConfig"
                      @listenToChild="changeTeamId"
                      @listenAddPop="addTeam"
        ></left-side-bar>
      </div>
      <div class="right-select">
        <p class="team-name">{{teamName}}</p>
        <div class="team-member" ref="element">
          <h3 class="team">销售团队成员</h3>
          <!--销售团队成员 选人组件-->
          <person-count class="qwui-principal_count"
                        :personCountShow="principalCountShow"
                        :defaultUsers="principalUsers"
                        :defaultDepts="principalDepts"
                        :showType="principalShowType"
                        @listenAddPerson="addPerson(true)">
          </person-count>
          <pick-person :show="principalPickShow"
                        :defaultUsers="principalUsers"
                        :defaultDepts="principalDepts"
                        :functionTab="principalFunctionTab"
                        @chooseDone="choosePrincipal"
                        @closeThis="closeThis(true)">
          </pick-person>
        </div>
        <div class="team-person">
          <h3 class="team">销售团队负责人<span class="grayFont">(可查阅团队成员的CRM数据)</span></h3>
          <!--销售团队负责人 选人组件-->
          <person-count class="qwui-person_count"
                        :personCountShow="personCountShow"
                        :defaultUsers="defaultUsers"
                        :showType="showType"
                        @listenAddPerson="addPerson">
          </person-count>
          <pick-person :show="pickPersonShow"
                        :defaultUsers="defaultUsers"
                        :functionTab="functionTab"
                        @chooseDone="chooseDone"
                        onlyUser
                        @closeThis="closeThis">
          </pick-person>
        </div>

        <div class="qwui-save_btn">
          <qwui-button type='primary' @click="saveTeamData">保存</qwui-button>
        </div>
      </div>
      <transition name="slide-fade" v-for="(item,idx) in tipDatas" :key="idx">
        <div class="tipsContainer" :style="{left:item.left,top: item.top}" v-if="item.show">
          <div class="tipsItem">
            <div class="tipsTitle">{{item.title}}
              <i class="qw-close_tip" @click="deleteTip(item)">×</i>
            </div>
            <div class="tipsContent">
              <div>{{item.content}}</div>
              <span class="btn btn-next-step" @click="handleClick('next',item)">{{item.nextName}}</span>
              <span class="btn btn-pre-step" @click="handleClick('pre',item)" v-show="item.preName">{{item.preName}}</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <func-box :secondBtn="secondBtn" @closeBox="closeMask"  @firstFunc="confirmMask" :boxTitle="boxTitle" v-if="funcBoxShow">
        <template>
          <div class="addTeam_box">
            <div class="teamNameItem">
              <span class="itemTitle"><span class="star">*</span>团队名称</span>
              <qwui-input
                          v-model="teamTitle"
                          class="qwui-input_style"
                          :maxLength=20
                          :inputType="'text'"
                          :isWarning="isWarning"
                          :warningTips="'销售团队名称不能为空'"
                          @input="changeInput"
                          @blur="changeInput">
              </qwui-input>
              <p class="input-bottom_text">如部门、区域、行业、职级等维度的团队名称</p>
              <div class="sortItem">
                <span class="itemTitle">排序</span>
                <qwui-input
                            v-model="sortValue"
                            inputType="sort"
                            @input='sortInput'
                            @blur="sortInput"
                            :isWarning="sortWarning"
                            :warningTips="'排序不能大于20'"
                            defaultVal="0"
                ></qwui-input>
              </div>
            </div>
          </div>
        </template>
    </func-box>
  </div>
</template>

<script>
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import leftSideBar from '@/components/list/LeftSideBar';
import funcBox from '@/components/list/funcBox';
import settingHeader from "./components/settingHeader";
import { getTeamList,delTeamItem,addTeamItem,searchTeamItem,getTeamDetail,saveDetail } from "crm/api/setting";
import personCount from '@/components/pickPerson/qwuiPersonCount';
import pickPerson from '@/components/pickPerson/pickPerson';
export default {
  data(){
    return{
      editId: '', // 获取当前编辑的团队id
      sortValue: '', // 排序序号
      teamTitle: '', // 团队名称
      sortWarning: false, // 团队序号提示，不能超过20
      isWarning: false, // 团队名称提示，不能为空
      funcBoxShow: false, // 遮罩弹窗显示隐藏
      boxTitle: '新建团队', // 遮罩title
      secondBtn: '', // 传给组件，默认没有取消按钮
      step: 1, // 记录帮助提示的状态
      tipDatas: [ // 帮助提示的数据
        {
          left: '157px',
          top: '17px',
          nextName: '下一步',
          // preName: '上一步',
          content: '可将销售人员以部门、区域、行业、职级等不同维度分组，方便管理',
          title: '创建销售团队',
          step: 1,
          show: false
        },
        {
          left: '308px',
          top: '76px',
          nextName: '下一步',
          preName: '上一步',
          content: '为销售团队添加具体成员，这些成员是CRM数据的负责人',
          title: '添加销售团队成员',
          step: 2,
          show: false
        },
        {
          left: '308px',
          top: '166px',
          nextName: '关闭',
          preName: '上一步',
          content: '销售团队负责人可以在应用端查看团队成员的CRM数据',
          title: '添加销售团队负责人',
          step: 3,
          show: false
        }
      ],
      personCountShow:true,// 选人结果显示隐藏
      showType:{
        person:true,
      },
      pickPersonShow:false,
      defaultUsers:[],
      functionTab:[
        {text:'标签人员'},
        {text:'特定人员'},
        {text:'批量导入'},
      ],
      principalFunctionTab:[
        {text:'部门'},
        {text:'标签人员'},
        {text:'特定人员'},
        {text:'批量导入'},
        {text:'高级筛选'},
      ],
      principalPickShow:false,// 选人组件显示隐藏
      principalCountShow:true,
      principalUsers:[],// 成员
      principalDepts:[],// 部门
      principalShowType:{
        person:true,
        dept:true
      },
      teamId: '', // 测试团队的id
      teamName: '', // 测试团队的名字
      teamListData: [], // 团队数据
      hasTeamData: true,
      renderConfig:{
        addOperateName:'新建团队',
        renderList:[],// 规则列表
        currentIndex:0
      },
    }
  },
  components: {
    settingHeader,
    leftSideBar,
    personCount,
    pickPerson,
    qwuiButton,
    funcBox,
    qwuiInput
  },
  created(){
    this.init();
  },
  watch: {
    // 监听输入团队，去除前后空格
    teamTitle(newVal, oldVal) {
      this.teamTitle = this.trim(newVal);
    },
  },
  methods: {
    init(){
      this.renderConfig.renderList = [];
      this.teamListData = [];
      dataBase.loading = true;
      getTeamList().then(res => {
        dataBase.loading = false;
        if(res.code == '0'){
          // 获取返回的团队数据
          this.teamListData = res.data.teamList;
          this.teamName = res.data.teamList[0].teamName;
          this.teamId = res.data.teamList[0].id;
          this.teamListData.forEach((item) => {
            this.renderConfig.renderList.push({
              itemName: item.teamName,
              itemIcon:require('../../../../../assets/images/crm/icon_b-authority_group.svg'),
              id: item.id,
              status:0,
              operateList:[
                {
                  operateName:'编辑',
                  operateFunc:()=> {
                    this.editTeam(item)
                  }
                },
                {
                  operateName:'删除',
                  operateFunc:()=> {
                    this.delTeam(item)
                  }
                }
              ]
            })
          })
          this.getItemDetail(res.data.teamList[0].id);
          this.renderConfig.currentIndex = 0;
        }else{
          _.alert('提示',res.desc)
        }
      })
    },

    // 获取团队当前详情
    getItemDetail(itemId){
      getTeamDetail({id: itemId}).then(res => {
        if(res.code == '0'){
          this.principalDepts = res.data.deptVOList;
          this.defaultUsers = res.data.queryPersonList;
          this.principalUsers = res.data.userVoList;
        }else{
          _.alert('提示', res.desc)
        }
        // 解决弹窗显示不同位置的问题
        // setTimeout(() => {
        //   this.tipDatas[2].top = parseInt(window.getComputedStyle(this.$refs.element).height)+110+'px'
        // },1000)
      })
    },

    // 返回上一级
    goBackClick(){
      this.$router.go(-1);
    },

    // 打开帮助提示
    helpClick(){
      this.step = 1;
      this.tipDatas[0].show = true;
      this.tipDatas[2].top = parseInt(window.getComputedStyle(this.$refs.element).height)+110+'px'
    },

    // 选择团队监听事件
    changeTeamId(id,key){
      if(this.teamListData[key]){
        this.teamName = this.teamListData[key].teamName
      }
      id ? this.teamId = id : '';
      this.renderConfig.currentIndex = key;
      this.getItemDetail(id);
    },
    // 新增团队
    addTeam(){
      if(this.teamListData.length == 50){
        dataBase.top_alert('最多只能增加50个团队',false,3000);
      }else{
        // 初始化提醒
        this.sortValue = '';
        this.teamTitle = '';
        this.editId = '';
        this.isWarning = false;
        this.sortWarning = false;
        this.closeMask();
      }
    },

    // 添加人员
    addPerson(status){
      if (status){
        this.principalPickShow = true;
      }else {
        this.pickPersonShow = true;
      }
    },

    // 选人确定按钮回调
    choosePrincipal(deptSelected,tagList,specialUsers){
      this.principalUsers = specialUsers;
      this.principalDepts = deptSelected;
      this.principalPickShow = false;
    },

    // 选人回调
    chooseDone(deptSelected,tagList,specialUsers){
      if(specialUsers.length > 10){
        dataBase.top_alert('人员选择超出上限(10)',false,3000);
        return
      }else{
        this.defaultUsers = specialUsers;
        this.pickPersonShow = false;
      }
    },

    // 选人关闭按钮回调
    closeThis(status){
      if (status){
        this.principalPickShow = false;
      }else {
        this.pickPersonShow = false;
      }
    },

    // 保存按钮回调函数
    saveTeamData(){
      let isPass = this.valiPerson();
      if(isPass){
        let userIdsArr = [], personsArr = [], deptsArr = []
        this.principalUsers.map(item => {
          userIdsArr.push(item.userId);
        })
        this.defaultUsers.map(item => {
          personsArr.push(item.userId);
        })
        this.principalDepts.map(item => {
          if(item.nodeId){
            deptsArr.push(item.nodeId);
          }else{
            deptsArr.push(item.deptId);
          }
        })
        let obj = {
          id: this.teamId,
          deptIds: deptsArr.length > 0 ? deptsArr.join('|') : '',
          userIds: userIdsArr.length > 0 ? userIdsArr.join('|') : '',
          persons: personsArr.length > 0 ? personsArr.join('|') : ''
        }
        dataBase.loading = true
        saveDetail(obj).then(res => {
          dataBase.loading = false
          if(res.code == '0'){
            dataBase.top_alert('保存成功',true,3000);
            this.getItemDetail(this.teamId)
          }else{
            _.alert('提示',res.desc)
          }
        })
      }
    },

    // 判断人员为空
    valiPerson(){
      if(this.principalUsers.length == 0 && this.principalDepts.length == 0){
        _.alert('提示', '销售团队成员不能为空')
        return false
      }else if(this.defaultUsers.length == 0){
        _.alert('提示', '销售团队负责人不能为空')
        return false
      }else{
        return true
      }
    },

    // 关掉tip
    deleteTip(item){
      item.show = false;
    },

    // 点击下一步 status: 'pre': 上一步   'next': 下一步
    handleClick(status,item){
      status == 'pre' ? this.step-- : this.step++
      this.tipDatas.forEach((item) => {
        item.show = false;
        if(item.step == this.step){
          item.show = true;
        }
      })
    },

    // 关闭遮罩
    closeMask(){
      this.funcBoxShow = !this.funcBoxShow;
      // 关闭遮罩把序号清空，避免请求存在旧数据
      this.sortValue = ''
    },

    // 遮罩层确定事件
    confirmMask(){
      this.valiTeamName();
      if(this.isWarning == false && this.sortWarning == false){
        let obj = {
          teamName: this.teamTitle,
          sort: this.sortValue,
          id: this.editId
        }
        // 新增团队请求
        dataBase.loading = true;
        addTeamItem(obj).then(res => {
          dataBase.loading = false;
          if(res.code == '0'){
            dataBase.top_alert('保存成功',true,2000);
            this.init();
            this.closeMask();
          }else{
            dataBase.top_alert(res.desc,false,2000);
          }
        })
      }
    },

    // 输入input
    changeInput(){
      this.isWarning = this.teamTitle == '';
    },

    // 输入需要input
    sortInput(val){
      if (!(/(^\+?[1-9][0-9]*$)/.test(val))) {
        this.sortValue = val.substring(0,val.length-1);
      }
      this.sortWarning = this.sortValue > 20;
    },

    // 遮罩层判空处理
    valiTeamName(){
      if(this.teamTitle == ''){
        this.isWarning = true;
      }
    },

    // 正则去掉左右空白格
    trim(str){
      return str.replace(/(^\s*)|(\s*$)/g, '');
    },

    // 编辑团队
    editTeam(item){
      this.funcBoxShow = true;
      // 团队名不需要请求便可拿到
      this.teamTitle = item.teamName;
      searchTeamItem({id:item.id}).then(res => {
        this.sortValue = res.data.team.sort == '0' ? '' : res.data.team.sort
        this.editId = res.data.team.id
      })
    },

    // 删除团队
    delTeam(item){
      let self = this
      _.alert('提示','确定要删除该团队吗？',function () {
        self.delRequest(item);
      },'确定',true)
    },

    // 删除请求
    delRequest(val){
      dataBase.loading=true;
      delTeamItem({id: val.id}).then(res => {
        dataBase.loading=false;
        if(res.code == '0'){
          dataBase.top_alert('删除成功',true,2000);
          this.init();
        }else{
          _.alert('提示',res.desc)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dataWrap{
  height: 100%;
  .setting-help{
    .help-text{
      color: #999;
      line-height: 32px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
    }
    .question-circle{
      display: inline-block;
      margin-left: 5px;
      width: 18px;
      height: 18px;
      line-height: 19px;
      text-align: center;
      border-radius: 50%;
      background: #C31725;
      vertical-align: text-bottom;
      cursor: pointer;
      color: #fff;
    }
  }
  .team-select{
    margin-top: 20px;
    height: 100%;
    width: 100%;
    position: relative;
    .tipsContainer{
      position: absolute;
      border: 1px solid #ccc;
      background: #fff;
      box-shadow: 0 0 7px rgba(0, 0, 0, 0.2);
      width: 310px;
      border-radius: 5px;
      left: 0;
      top: 0;
      .tipsItem{
        position:relative
        &::before{
          border-color: transparent #ccc transparent transparent;
          border-style: solid;
          border-width: 8px;
          content: "";
          font-size: 20px;
          left: -16px;
          position: absolute;
          top: 9px;
        }
        &::after{
          background: white;
          content: "";
          height: 8px;
          left: -5px;
          position: absolute;
          top: 13px;
          transform: rotate(-45deg);
          width: 10px;
        }
        .tipsTitle{
          width: 290px;
          height: 46px;
          line-height: 46px;
          font-size: 16px;
          color: #F08088;
          background-color: #fff;
          padding-left: 20px;
          position: relative;
          text-align: left;
          border-bottom: 1px solid #dddddd;
          .qw-close_tip{
            cursor: pointer;
            font-style: normal;
            position: absolute;
            right: 0;
            width: 50px;
            text-align: center;
            color: #bbb;
            font-size: 28px;
          }
        }
        .tipsContent{
          padding: 15px;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          max-height: 350px;
          overflow-y: auto;
          .btn-next-step{
            float: right;
            height: 22px;
            line-height: 22px;
            margin-top: 20px;
            margin-left: 5px;
            border-radius: 4px;
            color: #333333;
            background-color: #fff;
            border: 1px solid #cccccc;
            cursor: pointer;
            padding: 5px 20px;
          }
          .btn-pre-step{
            float: right;
            height: 22px;
            line-height: 22px;
            margin-top: 20px;
            margin-left: 5px;
            // background-color: #f7f7f7;
            // color: #333333;
            border: 1px solid #cccccc;
            cursor: pointer;
            border-radius: 4px;
            padding: 5px 20px;
          }
          .btn:hover {
            background-color: #f7f7f7;
            color: #333333;
          }
        }
      }
    }
    .right-select{
      margin-left: 40px;
      float: left;
      width: 700px;
      .team-member{
        height: 100%;
      }
      .team-name{
        line-height: 20px;
        font-size: 20px;
      }
      .team{
        margin-top: 32px;
      }
      .grayFont{
        font-size: 14px;
        color: #999;
      }
      .qwui-save_btn {
        padding-top: 20px;
        padding-bottom: 30px;
        text-align: center;
        margin-top: 40px;
        border-top: 1px solid #eee;
      }
    }
  }
  .addTeam_box{
    padding: 30px 0 40px;
    font-size: 14px;
    margin-bottom: 9px;
    .teamNameItem{
      text-align: center;
      .sortItem{
        text-align: left;
        margin: 20px 0 0 128px;
        // margin: 20px 0 0 -240px;
      }
      .input-bottom_text{
        color: #999;
        font-size: 12px;
        margin-left: -15px;
      }
      .itemTitle {
        margin-bottom: 5px;
        margin-right: 10px;
        line-height: 32px;
        display: inline-block;
        text-align: right;
        vertical-align: top;
        .star {
          margin-right: 5px;
          color: red;
        }
      }
    }
  }
  /deep/ .warningTips{
    text-align: left;
  }
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>


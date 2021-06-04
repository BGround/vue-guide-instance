
<template>
  <div class="dataWrap">
    <header>
      <setting-header :pages="['设置','客户类别设置']" @go-back="goBackClick">
      </setting-header>
    </header>
    <div class="team-select">
      <div class="left-select">
        <!-- 类别列表 -->
        <div class="addBtnBox">
          <button class="addBtn" @click="addClientType">新建类别</button>
        </div>
        <tree
            :icon="icon"
            :treeData="treeData"
            @select="handleSelect"
            :operateRender="operateRender"
        ></tree>
      </div>
      <div class="right-select">
        <div class="type-name mt10">
          <span class="itemTitle"><span class="star">*</span>类别名称：</span>
            <qwui-input
                        v-model="typeTitle"
                        class="qwui-input_style"
                        :inputType="'text'"
                        :maxLength=20
                        :isWarning="isWarning"
                        :warningTips="'类别名称不能为空'"
                        @input="changeInput"
                        @blur="changeInput">
            </qwui-input>
        </div>
        <div class="type-code mt10">
          <span class="itemTitle">类别编码：（用于客户编码字段前缀）</span>
            <qwui-input
                        v-model="codeTitle"
                        class="qwui-input_style"
                        :inputType="'text'"
                        :maxLength=20
                        :inputTips="inputTips"
                        @input="changeInput"
                        >
            </qwui-input>
        </div>
        <div class="sort-num mt10">
          <span class="itemTitle">排序号：</span>
            <qwui-input
                        v-model="sortValue"
                        inputType="sort"
                        class="qwui-input_style"
                        :inputTips="sortTips"
                        @input='sortInput'
                        @blur="sortInput"
                        :isWarning="sortWarning"
                        :warningTips="'排序不能超过8位数'"
                        defaultVal="0">
            </qwui-input>
        </div>
        <div class="team-member">
          <h3 class="team mt10">可编辑人员<span class="grayFont">（可查看、修改资料）：</span></h3>
          <!--可编辑人员 选人组件-->
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
        <div class="team-person">
          <!--可查阅人员 选人组件-->
          <h3 class="team mt10">可查阅人员<span class="grayFont">（可查看资料）：</span></h3>
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

        <div class="qwui-save_btn">
          <qwui-button type='primary' @click="saveTypeData">保存</qwui-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import Tree from '../../../components/tree/tree';
import settingHeader from "./components/settingHeader";
import { getTeamList,delTeamItem,addTeamItem,searchTeamItem,getTeamDetail,saveDetail,searchClientTypeList,getTypeDetail,editClientType,delClientType } from "crm/api/setting";
import personCount from '@/components/pickPerson/qwuiPersonCount';
import pickPerson from '@/components/pickPerson/pickPerson';
export default {
  data(){
    return{
      sortTips: '用于显示类别先后顺序，数字小的排在前面',
      inputTips: '用于客户默认编码字段的前缀', // 编码placeholder
      firstId: '', // 第一个id
      parentId: '',
      orgId: '',
      codeTitle: '', // 类别编码
      treeData: [], // 层级组件数据
      icon: require('../../../../../assets/images/crm/clientIcon.svg'), // 层级组件icon
      editId: '', // 获取当前编辑的团队id
      sortValue: '', // 排序序号
      typeTitle: '', // 团队名称
      sortWarning: false, // 团队序号提示，不能超过20
      isWarning: false, // 团队名称提示，不能为空
      step: 1, // 记录帮助提示的状态
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
      typeId: '', // 测试团队的id
      teamName: '', // 测试团队的名字
      typeListData: [], // 团队数据
    }
  },
  components: {
    settingHeader,
    personCount,
    pickPerson,
    qwuiButton,
    qwuiInput,
    Tree
  },
  created(){
    this.init();
  },
  watch: {
    // 监听输入团队，去除前后空格
    typeTitle(newVal, oldVal) {
      this.typeTitle = this.trim(newVal);
    }
  },
  methods: {
    init(){
      this.typeListData = [];
      dataBase.loading = true;
      searchClientTypeList().then(res => {
        dataBase.loading = false;
        if(res.code == '0'){
          // 获取返回的团队数据
          this.treeData = res.data.treeData;
          this.typeId = res.data.treeData[0].key
          this.firstId = res.data.treeData[0].key
          this.$set(this.treeData[0], 'selected', true);
          this.getItemDetail(res.data.treeData[0].key);
        }else{
          _.alert('提示',res.desc)
        }
      })
    },

    // 新建客户类别
    addClientType(data){
      this.clearData();
      // 有key则有父级
      if(data.key){
        this.parentId = data.key
      }
    },

    // 清空数据
    clearData(){
      this.typeTitle = '';
      this.codeTitle = '';
      this.sortValue = '';
      this.typeId = '';
      this.principalDepts = [];
      this.defaultUsers = [];
      this.principalUsers = [];
    },

    // 获取类别当前详情
    getItemDetail(itemId){
      this.clearData();
      this.typeId = itemId
      getTypeDetail({id: itemId}).then(res => {
        if(res.code == '0'){
          this.typeTitle = res.data.TbCrmClientTypePO.typeName;
          this.codeTitle = res.data.TbCrmClientTypePO.typeCode;
          this.sortValue = res.data.TbCrmClientTypePO.sortNum;
          this.orgId = res.data.TbCrmClientTypePO.orgId;
          this.parentId = res.data.TbCrmClientTypePO.parentId;
          if(res.data.deptVOList)
          this.principalDepts = res.data.deptVOList;

          if(res.data.toPersons)
          this.defaultUsers = res.data.toPersons;

          if(res.data.ccPersons)
          this.principalUsers = res.data.ccPersons;
        }else{
          _.alert('提示', res.desc)
        }
      })
    },

    // 返回上一级
    goBackClick(){
      this.$router.go(-1);
    },

    // 打开帮助提示
    helpClick(){
      this.step = 1;
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
      this.defaultUsers = specialUsers;
      this.pickPersonShow = false;
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
    saveTypeData(){
      this.changeInput();
      if(!this.isWarning && !this.sortWarning) {
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
          'tbCrmClientTypePO.typeName': this.typeTitle,
          'tbCrmClientTypePO.typeCode': this.codeTitle,
          'tbCrmClientTypePO.sortNum': this.sortValue,
          'tbCrmClientTypePO.orgId': this.orgId,
          'tbCrmClientTypePO.parentId': this.parentId,
          'tbCrmClientTypePO.id': this.typeId,
          deptIds: deptsArr.length > 0 ? deptsArr.join('|') : '',
          userIds: personsArr.length > 0 ? personsArr.join('|') : '',
          givenUserIds: userIdsArr.length > 0 ? userIdsArr.join('|') : ''
        }
        dataBase.loading = true
        editClientType(obj).then(res => {
          dataBase.loading = false
          if(res.code == '0'){
            this.typeId == '' ? this.getItemDetail(this.firstId) : this.getItemDetail(this.typeId)
            // this.getItemDetail(this.typeId)
          }else{
            dataBase.top_alert(res.desc,false,2000);
            // _.alert('提示',res.desc)
          }
          this.init();
        })
      }

    },

    // 输入input
    changeInput(){
      this.isWarning = this.typeTitle == '';
    },

    // 输入需要input
    sortInput(val){
      if (!(/(^\+?[1-9][0-9]*$)/.test(val))) {
        this.sortValue = val.substring(0,val.length-1);
      }
      this.sortWarning = this.sortValue > 99999999;
    },

    // 遮罩层判空处理
    valiTeamName(){
      if(this.typeTitle == ''){
        this.isWarning = true;
      }
    },

    // 正则去掉左右空白格
    trim(str){
      return str.replace(/(^\s*)|(\s*$)/g, '');
    },

    // 编辑团队
    editTeam(item){
      // 团队名不需要请求便可拿到
      this.typeTitle = item.teamName;
      searchTeamItem({id:item.id}).then(res => {
        this.sortValue = res.data.team.sort == '0' ? '' : res.data.team.sort
        this.editId = res.data.team.id
      })
    },

    // 删除客户类别
    delType(item){
      let self = this
      _.alert('提示','删除的数据无法恢复，是否删除？',function () {
        dataBase.loading=true;
        delClientType({id: item.key}).then(res => {
          dataBase.loading=false;
          if(res.code == '0'){
            dataBase.top_alert('删除成功',true,2000);
            self.init();
          }else{
            _.alert('提示',res.desc)
          }
        })
      },'确定',true)
    },

     // 父亲render函数
      operateRender(h, { data }) {
        let self = this;
        return h('div', {
          style: {
            'padding': '3px 0',
            'box-shadow': '0px 2px 10px 0px rgba(0, 0, 0, 0.1)',
            'border-radius': '2px',
            'line-height': '30px',
            'background': '#fff',
            'border': '1px solid #EDEDED',
            'text-align': 'center',
          },
        }, [
          h('span', {
            style: {
                'flex': 1,
                'display': 'block',
                'width': '58px',
                'color': '#666',
            },
            class: ['addClass'],
            on: {
                click: (e) => {
                    e.stopPropagation();
                    self.addClientType(data)
                }
            }
          }, '新增'),
          h('span', {
            style: {
                'flex': 1,
                'display': 'block',
                'width': '58px',
                'color': '#666',
            },
            class: ['addClass'],
            on: {
                click: (e) => {
                    e.stopPropagation();
                    self.delType(data)
                }
            },
          }, '删除'),
      ]);
    },

    // 选择节点
    handleSelect(nodeData) {
      this.isWarning = false
      this.getItemDetail(nodeData.key)
      this.typeId = nodeData.key
    },

    // 点击类别的新增

  }
}
</script>

<style lang="scss" scoped>
.dataWrap{
  height: 100%;
  .team-select{
    margin-top: 20px;
    height: 100%;
    width: 100%;
    position: relative;
    .left-select{
      width: 205px;
      border: 1px solid #e4e4e4;
      margin-bottom: 100px;
      height: 600px;
      overflow: auto;
      float: left;
      border-radius: 5px;
      padding-bottom: 40px;
      .addBtnBox{
        padding: 20px 0;
        text-align: center;
        .addBtn{
          display: inline-block;
          width: 90px;
          height: 28px;
          font-size: 14px;
          color: #666;
          background: #fff;
          border: 1px solid #ccc;
          border-radius: 2px;
        }
      }
    }
    .right-select{
      margin-left: 40px;
      float: left;
      width: 695px;
      .type-name{
      }
      .team-member{
        height: 100%;
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
  .itemTitle {
    margin-right: 10px;
    line-height: 32px;
    display: inline-block;
    text-align: right;
    .star {
      margin-right: 5px;
      color: red;
    }
  }
  .mt10{
    margin-top: 10px
  }
  /deep/ .input_wrap{
    width: 340px;
  }
  .qwui-input_style{
    display: block;
  }
  /deep/ .input_wrap .qw_sortInput{
    width: 340px;
  }
  /deep/ .warningTips{
    text-align: left;
  }
  /deep/ .addClass:hover{
    background: #f5f5f5 !important;
  }
  /deep/ .node-list-item .operate{
    z-index: 1;
    top: 20px !important;
    right: 20px !important;
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


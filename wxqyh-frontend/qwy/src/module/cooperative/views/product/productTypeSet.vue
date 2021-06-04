<template>
  <div>
    <div class="type_set_header">
      <qwui-button @click="goBack">返回</qwui-button>
      <qwui-button v-perm="'productTypeAdd'" type='primary' @click="addType()">新增</qwui-button>
      <div class="tree_content">
        <tree :treeData="treeData"
              :icon="icon"
              @select="handleSelect"
              :operateRender="operateRender"></tree>
      </div>
    </div>
    <div class="edit_page">
      <h3 class="type_set_title">知识百科类别设置</h3>
      <div v-show="showEditPage">
        <div class="qwui-input_item">
          <span class="itemTitle"><span class="star">*</span>类别名称：</span>
          <qwui-input class="qwui-input_style"
                      v-model="typeName"
                      :isWarning="isWarning"
                      warningTips="类别名称不能为空"
                      @input="changeInput"
                      :maxLength="30"></qwui-input>
        </div>
        <div class="qwui-input_item">
          <span class="itemTitle"><span class="star">*</span>排序号：</span>
          <qwui-input inputType="sort"
                      v-model="sortNum"
                      warningTips="排序号只能为0或正整数"
                      :isWarning="sortWarning"
                      @input="changeSort"></qwui-input>
        </div>
<!--
        <div class="qwui-input_item">
          <span class="itemTitle">目标对象：</span>
          <div class="iblock">
            <pick-exam
              class="type_person"
              :useDepts="targetDeptIds"
              :useUsers="targetUserIds"
              :useTab="targetUseTab"
              :useRadio="range"
              @changeRadio="changeRange"
              @chooseDone="chooseTarget"
            ></pick-exam>
          </div>
          <p class="warning_tip" v-if="showPickTip">特定对象不能为空</p>
        </div>
-->

        <!--     start: 新增内容   -->

        <div class="qwui-input_item">
          <span class="itemTitle">设置：</span>
          <div class="iblock">
            <qwui-checkbox class="qwui-input_style" @change="handleChange" v-model="isDynamicReview">
              开启发布审核，设置审核人
            </qwui-checkbox>
          </div>
        </div>

        <div class="qwui-input_item" v-if="isDynamicReview">
          <span class="itemTitle">审核人：</span>
          <div class="iblock">
            <pick-exam
                    class="type_person"
                    :useDepts="approvalDepartments"
                    :useUsers="approvalUsers"
                    :useTab="tabsOfApprovalPicker"
                    :isShowRadios="false"
                    :onlyUser="true"
                    @chooseDone="handleChooseApprovalPerson"
            ></pick-exam>
          </div>
          <p class="warning_tip" v-if="showPickTip">特定对象不能为空</p>
        </div>

        <!--     end: 新增内容  -->

        <div class="switch_content">
          <div class="switch_item">
            <p>是否启用</p>
            <qwui-switch :defaultStatus="status" @change="updateBtn"></qwui-switch>
          </div>
        </div>
        <div class="qwui-save_btn">
          <qwui-button type='primary' @click="saveType">保存</qwui-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
  import qwuiSwitch from '@/components/qwuiBase/qwuiSwitch/qwuiSwitch';
  import pickExam from '@/components/pickPerson/pickExam';
  import tree from './tree';

  import { getProductType,viewTypeDetail,saveProductType,deleteProductType } from '../../api/product/getData';
  import QwuiRadio from "components/qwuiBase/qwuiRadio/qwuiRadio";
  import QwuiCheckbox from "module/hrmanagement/components/QWCheckbox";

  export default {
    data(){
      return {
        pid:'',
        id:'',
        treeData:[],
        icon:require('assets/images/company_icon.png'),
        showEditPage:false,
        typeName:'',
        isWarning:false,
        sortNum:0,
        sortWarning:false,
        status:true,
        targetDeptIds:[],
        targetUserIds:[],
        targetUseTab:[
          {text:'部门'},
          {text:'标签人员'},
          {text:'特定人员'},
          {text:'批量导入'},
          {text:'高级筛选'},
        ],
        range:'所有人',
        showPickTip:false,
        isDynamicReview: false,


          tabsOfApprovalPicker:[
              // {text:'部门'},
              {text:'标签人员'},
              {text:'特定人员'},
              {text:'批量导入'},
              {text:'高级筛选'},
          ],
          approvalUsers: [],
          approvalDepartments: [],
      }
    },
    created(){
      this.getType();
    },
    methods:{
      getType(){
        this.showEditPage = false;
        getProductType({},(data)=>{
          data.ProductTypeList.forEach((item)=>{
            item.key = item.id;
            item.title = item.name;
            if (item.productTypeList && item.productTypeList.length > 0){
              item.children = this.addChildren(item);
            }
          });
          this.treeData = data.ProductTypeList;
        })
      },
      addChildren(data){
        data.productTypeList.forEach((item)=>{
          item.key = item.id;
          item.title = item.name;
          if (item.productTypeList && item.productTypeList.length > 0){
            item.children = this.addChildren(item);
          }
        });
        return data.productTypeList;
      },
      viewTypeData(id){
        viewTypeDetail({
          id:id
        },(data)=>{
          this.initData();
          let po = data.tbQyProductTypePO;
          this.id = id;
          this.pid = po.pid;
          this.typeName = po.name;
          this.sortNum = po.ext1;
          this.range = po.ranges == '1' ? '所有人' : '特定对象';
          if (data.selectDeptVOList){
            this.targetDeptIds = [...data.selectDeptVOList]
          }
          if (data.selectUserVOList){
            this.targetUserIds = [...data.selectUserVOList]
          }
          this.status = po.status == '1';
          this.showEditPage = true;
          this.isDynamicReview = String(po.isDynamicReview) ==='1';
          this.approvalUsers = [];
          if (data.reviewUserList && this.isDynamicReview){
              this.approvalUsers = [...data.reviewUserList]
          }
        })
      },
      handleSelect(nodeData){
        this.id = nodeData.id;
        this.viewTypeData(nodeData.id)
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
                self.addType(data)
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
                self.editType(data)
              }
            }
          }, '编辑'),
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
      goBack(){
        this.$router.go(-1);
      },
      // 新增数据初始化
      initData(){
        this.pid = '';
        this.id = '';
        this.typeName = '';
        this.sortNum = 0;
        this.isWarning = false;
        this.sortWarning = false;
        this.showPickTip = false;
        this.status = true;
        this.targetDeptIds.splice(0,this.targetDeptIds.length);
        this.targetUserIds.splice(0,this.targetUserIds.length);
        this.range = '所有人';
      },
      // 新增
      addType(data){
        this.initData();
        // 新增，pid等于当前点击项id
        if (data){
          this.pid = data.id;
        }
        this.showEditPage = true;
      },
      // 编辑
      editType(data){
        this.viewTypeData(data.id);
      },
      // 删除
      delType(data){
        this.id = data.id;
        let self = this;
        _.alert('提示','删除数据后将无法恢复，确认要删除吗？',function(){
          deleteProductType({
            ids:self.id
          },()=>{
            _.alert('提交结果','删除成功',function () {
              self.getType();
            })
          })
        },'确定',true)

      },
      changeInput(){
        this.isWarning = this.typeName == '';
      },
      changeSort(){
        let re = /^([1-9]\d*|[0]{1,1})$/;
        this.sortWarning = !re.test(this.sortNum);
      },
      updateBtn(val){
        this.status = val;
      },
      changeRange(val){
        if (val == '所有人'){
          this.showPickTip = false;
        }
        this.range = val;
      },
      chooseTarget(dept,tag,user){
        this.showPickTip = false;
        this.targetDeptIds = [...dept];
        this.targetUserIds = [...user];
      },
      checkParams(){
        let passCheck = true;
        if (this.typeName == ''){
          this.isWarning = true;
          passCheck = false;
        }
        this.changeSort();
        if (this.sortWarning){
          passCheck = false;
        }
        if (this.isDynamicReview && this.approvalUsers.length == 0){
          this.showPickTip = true;
          passCheck = false;
        }
        // if (this.range == '特定对象' && this.targetDeptIds.length == 0 && this.targetUserIds.length == 0){
        //   this.showPickTip = true;
        //   passCheck = false;
        // }
        return passCheck;
      },
      saveType(){
        if(!this.checkParams()){
          return;
        }
        // let deptIds = this.handleListData(this.targetDeptIds,'nodeId','deptId');
        // let userIds = this.handleListData(this.targetUserIds,'userId','id');
        let dynamicReviewers = this.handleListData(this.approvalUsers,'userId','id');
        let params = {
          'tbQyProductTypePO.pid':this.pid,
          'tbQyProductTypePO.id':this.id,
          'tbQyProductTypePO.orgid':_.orgConfigInfo.orgId,
          'tbQyProductTypePO.name':this.typeName,
          'tbQyProductTypePO.ext1':this.sortNum,
          'a1':'on',
          // 'deptIds':deptIds.join('|'),
          // 'userIds':userIds.join('|'),
          // 'range':this.range == '所有人' ? 1 : 3,
          'tbQyProductTypePO.status':this.status ? 1 : 0,
          'tbQyProductTypePO.isDynamicReview':this.isDynamicReview ? '1' : '0', // （不传默认0）：0-N;1-Y
          'dynamicReviewers': dynamicReviewers.join('|'),
        };
        let self = this;
        saveProductType(params,()=>{
          _.alert('提交结果','保存成功',function () {
            self.getType();
          })
        })
      },
      handleListData(list,key1,key2){
        let arr = [];
        list.forEach((item)=>{
          arr.push(item[key1] || item[key2])
        });
        return arr;
      },

        handleChooseApprovalPerson(dept,tag,users){
            this.approvalUsers = [...users];
            this.approvalDepartments = [...dept];
            this.showPickTip = !this.approvalUsers.length;
        },

        handleChange(isEnable){
            if(!isEnable){
                this.approvalUsers=[];
            }
        },
    },
    components:{
        QwuiCheckbox,
        QwuiRadio,
      qwuiButton,tree,qwuiInput,qwuiSwitch,
      pickExam
    }
  }
</script>

<style lang="scss" scoped>
  .type_set_header {
    margin-top: 30px;
    float: left;
    width: 250px;

  .tree_content {
      margin-top: 30px;
      margin-bottom: 50px;
      padding: 30px 18px 30px 0;
      border: 1px solid #ccc;
      min-height: 600px;
    }
  }

  .edit_page {
    margin-left: 250px;
    padding-top: 30px;

    .type_set_title {
      padding-left: 50px;
      margin-bottom: 50px;
      font-size: 20px;
    }
  }

  .qwui-input_item {
    margin-bottom: 20px;

  .itemTitle {
    margin-bottom: 5px;
    padding-top: 5px;
    width: 130px;
    display: inline-block;
    text-align: right;
    vertical-align: top;

  .star {
    margin-right: 5px;
    color: red;
  }
  }

  .qwui-input_style {
    vertical-align: top;
  }

  }
  .type_person /deep/ .qwui-click_choose {
    width: 400px;
  }
  .switch_content {
    margin: 0 0 30px 60px;

  .switch_item {
    margin-top: 15px;
    width: 400px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    line-height: 30px;
    background: #f6f6f6;
  }
  }
  .qwui-save_btn {
    margin-bottom: 30px;
    padding-top: 20px;
    text-align: center;
  }
  .warning_tip {
    padding-left: 135px;
    color: #F56262;
  }
  /deep/ .addClass:hover{
    background: #f5f5f5 !important;
  }
</style>

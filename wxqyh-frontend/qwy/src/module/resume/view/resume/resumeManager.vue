<template>
  <div class="qwui-resumeManager">
    <div class="header">
      <span class="header_font">简历管理</span>
    </div>
    <div class="qwui-bar">
      <div class="qwui-bar_left">
      <qwuiButton type='primary' @click="goToNewBuild">新增</qwuiButton>
      <span class="qwui-dotted_line"></span>
      <span ></span>
      <qwuiButton @click="deleteDetail(ids)">删除</qwuiButton>
      </div>
    </div>
    <div class="qwui-table_wrap">
      <dataTable :headData="headData" :dataList="dataList">
        <!--表格组件插槽，用包含:slot="'parentDepartName'+key"的标签代替原有表格的td -->
        <!--一级部门-->
        <div class="recruitRow"
             @mouseenter="hoverItem('parentDepartName',key)"
             @change="changeParentDepart('parentDepartId',key)"
             v-for="(item,key) in dataList"
             :key="key" :slot="'parentDepartName'+key">
             <!--showKey.parentDepartName确定当前列，key确定第几行，选中显示下拉框-->
          <select v-show="showKey.parentDepartName==key"
                  @mouseleave="blurItem('parentDepartName',key)"
                  class="qwui-select"
                  v-model="dataList[key].parentDepartId">
            <option v-for="(select,index) in parentDepartList"
                    :key="index"
                    :value="select.nodeId" >{{ select.nodeName }}</option>
          </select>
          <!--没有选中时显示正常span-->
          <span v-show="showKey.parentDepartName!=key">{{ dataList[key].parentDepartName }}</span>
        </div>
        <!--二级部门-->
        <div class="recruitRow"
             @mouseenter="hoverItem('departName',key)"
             @change="changeParentDepart('departId',key)"
             v-for="(item,key) in dataList"
             :key="key" :slot="'departName'+key">
          <select v-show="showKey.departName==key"
                  @mouseleave="blurItem('departName',key)"
                  class="qwui-select"
                  v-model="dataList[key].departId">
            <option v-for="(select,index)  in departList[key]"
                    :key="index"
                    :value="select.nodeId" >{{select.nodeName}}</option>
          </select>
          <span v-show="showKey.departName!=key">{{ dataList[key].departName }}</span>
        </div>
        <!--简历进度-->
        <div class="recruitRow"
             @mouseenter="hoverItem('recruitStatus',key)"
             v-for="(item,key) in dataList"
             :key="key" :slot="'recruitStatus'+key">
          <select v-show="showKey.recruitStatus==key"
                  @mouseleave="blurItem('recruitStatus',key)"
                  class="qwui-select"
                  v-model="dataList[key].recruitStatus">
            <option v-for="(select,index)  in scheduleList"
                    :key="index"
                    :value="select" >{{select}}</option>
          </select>
          <span v-show="showKey.recruitStatus!=key">{{ dataList[key].recruitStatus }}</span>
        </div>
        <!--简历名称-->
        <div class="recruitRow"
             @mouseenter="hoverItem('personName',key)"
             v-for="(item,key) in dataList"
             :key="key" :slot="'personName'+key">
          <input v-show="showKey.personName==key"
                 @mouseleave="blurItem('personName',key)"
                 class="qwui-text" type="text"
                 v-model="dataList[key].personName" >
          <span v-show="showKey.personName!=key">{{ dataList[key].personName }}</span>
        </div>
        <!--年龄-->
        <div class="recruitRow"
             @mouseenter="hoverItem('age',key)"
             v-for="(item,key) in dataList"
             :key="key" :slot="'age'+key">
          <input v-show="showKey.age==key"
                 @mouseleave="blurItem('age',key)"
                 class="qwui-text" type="text"
                 v-model="dataList[key].age" >
          <span v-show="showKey.age!=key">{{ dataList[key].age }}</span>
        </div>
        <!--工作年限-->
        <div class="recruitRow"
             @mouseenter="hoverItem('workYear',key)"
             v-for="(item,key) in dataList"
             :key="key" :slot="'workYear'+key">
          <input v-show="showKey.workYear==key"
                 @mouseleave="blurItem('workYear',key)"
                 class="qwui-text" type="text"
                 v-model="dataList[key].workYear" >
          <span v-show="showKey.workYear!=key">{{ dataList[key].workYear }}</span>
        </div>
        <!--现居地-->
        <div class="recruitRow"
             @mouseenter="hoverItem('addressNow',key)"
             v-for="(item,key) in dataList"
             :key="key" :slot="'addressNow'+key">
          <input v-show="showKey.addressNow==key"
                 @mouseleave="blurItem('addressNow',key)"
                 class="qwui-text" type="text"
                 v-model="dataList[key].addressNow" >
          <span v-show="showKey.addressNow!=key">{{ dataList[key].addressNow }}</span>
        </div>
        <!--学历-->
        <div class="recruitRow"
             @mouseenter="hoverItem('topEdu',key)"
             @change="changeParentDepart('topEdu',key)"
             v-for="(item,key) in dataList"
             :key="key" :slot="'topEdu'+key">
          <select v-show="showKey.topEdu==key"
                  @mouseleave.prevent="blurItem('topEdu',key)"
                  class="qwui-select"
                  v-model="dataList[key].topEdu">
            <option v-for="(select,index) in topEduBgList"
                    :title="select"
                    :key="index" :value="select" >{{ select}}</option>
          </select>
          <span v-show="showKey.topEdu!=key">{{ dataList[key].topEdu }}</span>
        </div>
        <!--手机号码-->
        <div class="recruitRow"
             @mouseenter="hoverItem('mobile',key)"
             v-for="(item,key) in dataList"
             :key="key" :slot="'mobile'+key">
          <input v-show="showKey.mobile==key"
                 @mouseleave="blurItem('mobile',key)"
                 class="qwui-text" type="text"
                 v-model="dataList[key].mobile" >
          <span v-show="showKey.mobile!=key">{{ dataList[key].mobile }}</span>
        </div>
      </dataTable>
      <page :pageData="pageData" @change="change"></page>
    </div>
  </div>
</template>

<script>
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import dataTable from '@/components/Table/dataTable.vue';
import page from '@/components/list/page.vue';
import { getDepartment,getResumeList,updateResume,deleteResume } from './../../api/getData.js';

export default {
  name: 'resumeManager',
  components:{
    qwuiButton,
    dataTable,
    page,
  },
  created:function(){
  },
  data(){
    return {
      ids:[],
      headData:{
        // 表格数据，下拉框选择事件
        left:{
          id:'employeeId',
          checkFunc:(isSelectedAll,list)=>{
            let arr = [];
            list.forEach(function(item){
              if(item.isChecked){
                arr.push(item.id);
              }
            });
            this.ids = arr.join(',');
          },
        },
        // 表格头部数据
        middle:dataBase.middle,
        // 表格右侧操作按钮，按钮详情在资源引入时对每行添加
        right: {
          isShowOperate: true,
          width:100,
        },
      },
      dataList:[], // 简历数据
      pageData:{}, // 页数控制数据
      departList:[], // 二级部门数据列表
      parentDepartList:[], //一级部门数据列表
      scheduleList:[], // 简历筛选进度列表 如1对应未推送
      topEduBgList:[], // 最高学历列表 如1对应初中及以下
      // 控制显示当前选中的td,属性选择列，值选择行
      showKey:{
        personName:-1,
        recruitStatus:-1,
        parentDepartName:-1,
        departName:-1,
        age:-1,
        workYear:-1,
        addressNow:-1,
        topEdu:-1,
        mobile:-1,
        },
      oldValue:'', // 记录td的值，如未修改，不发送请求
    }
  },
  mounted(){
    // 初始化简历数据
    this._getResumeList();
  },
  methods:{
    _getResumeList(params){
      let self=this;
      // 初始化字典列表数据
      this.scheduleList=dataBase.scheduleList;
      this.topEduBgList=dataBase.topEduBgList;
      getResumeList(params,data=>{
        self.dataList=data.pageData.pageData;
        self.pageData={
            page: data.pageData.currentPage,
            pageSize: data.pageData.pageSize,
            maxPage: data.pageData.totalPages,
            totalRows: data.pageData.totalRows
        }
        // 设置操作按钮详情，获取二级部门数据
        self.dataList.forEach((item,index)=>{
        if(item.parentDepartId!=''){
          getDepartment({nodeId:item.parentDepartId},data=>{
            self.departList[index]=data.orgList;
            // 二级部门无数据，将一级部门id赋给二级部门id，值为无
            if(data.orgList.length==0){
              self.departList[index]=[{nodeName:self.dataList[index].departName,nodeId:item.parentDepartId}];
            }
          })
        }
        // 根据字典显示中文
        item.recruitStatus=dataBase.scheduleList[item.recruitStatus-1];
        item.topEdu=dataBase.topEduBgList[item.topEdu];
        // 操作按钮详情
        item.operationList=[
          {
            text:"详情",
            operationFunc:()=>{
              self.goToDetail(item.resumeId);
            }
          },
          {
            text:"删除",
            operationFunc:()=>{
            self.deleteDetail(item.employeeId);
          }
          }
        ]
      });
      });
    },
    // 改变页数，重新请求数据
    change(page,pageSize){
        this._getResumeList({pageSize:pageSize,page:page})
    },
    // 鼠标移到td上事件
    hoverItem(key,index){
      let self=this;
      // 重置之前显示的td
      for(let i in this.showKey){
          this.showKey[i]=-1;
      }
      // 设置显示当前td
      this.showKey[key]=index;
      // 记录旧数据
      this.oldValue=this.dataList[index][key];
      if(key=='parentDepartName'){
        //接口获取下拉一级部门列表值
        getDepartment({},data=>{
          self.parentDepartList=data.orgList;
        });
      }
      if(key=='departName'){
        if(self.dataList[index].parentDepartId!=""){
          getDepartment({nodeId:self.dataList[index].parentDepartId},data=>{
            self.departList[index]=data.orgList;
            // 当无二级部门数据时
            if(data.orgList.length==0){
              self.departList[index]=[{nodeName:self.dataList[index].departName,nodeId:self.dataList[index].parentDepartId}];
            }
          })
        }else{
          // 未选择一级部门提示
          self.departList[index]=[{nodeName:self.dataList[index].departName,nodeId:self.dataList[index].parentDepartId}];
        }
      }
    },
    blurItem(key,index){
      let self=this;
      // 清空当前显示td状态
      this.showKey[key]=-1;
      // 没有修改，退出
      if(this.oldValue==this.dataList[index][key]) return;
      // 对二级部门的下拉列表赋值
      if(key=='parentDepartName'){
        if(self.dataList[index].parentDepartId!=""){
          getDepartment({nodeId:self.dataList[index].parentDepartId},data=>{
            self.departList[index]=data.orgList;
            if(data.orgList.length==0){
              self.departList[index]=[{nodeName:"无",nodeId:self.dataList[index].parentDepartId}];
              self.dataList[index].departName="无";
            }
          })
          self.dataList[index].departId=self.dataList[index].parentDepartId;
          self.dataList[index].departName="无";
          // 设置一级部门后立即清空二级部门数据
          self.departList[index]=[{nodeName:"无",nodeId:self.dataList[index].parentDepartId}];
        }
      }
      // 需要更新的行
      let dataRow ={...this.dataList[index]};
      // 将文字重新换回数字字典
      dataRow.topEdu=dataBase.topEduBgList.findIndex((item)=>{ return item==this.dataList[index].topEdu});
      dataRow.recruitStatus=dataBase.scheduleList.findIndex((item)=>{ return item==this.dataList[index].recruitStatus})+1;
      // 清除不必要的属性
      delete dataRow.operationList;
      delete dataRow.birthDay;
      // 多一层判断是否有部门
      if(dataRow.departId==""){
        dataRow.departId=dataRow.parentDepartId;
      }
      // 发送更新请求
      updateResume({resumeVO:dataRow},result=>{
        dataBase.top_alert('更新成功',true,1500);
      });
    },
    // 去新增简历页
    goToNewBuild(){
      this.$router.push({name:'resumeNewBuild'});
    },
    // 去简历详情页
    goToDetail(infoId){
      this.$router.push({path:'resume_detail',query:{id:infoId}});
    },
    // 删除简历
    deleteDetail(infoIds){
      let self=this;
      // 删除
      _.alert('提示','删除数据后将无法恢复，确认要删除吗？',function(){
        deleteResume({'employeeIds':infoIds},result=>{
          dataBase.top_alert('删除成功',true,1500);
          self._getResumeList(self.pageData);
        });
      },'确定',true)
    },
    // 下拉框更改事件
    changeParentDepart(key,myIndex){
      let self=this;
      if(key=="parentDepartId"){
      this.parentDepartList.some((item,index)=>{
        if(item.nodeId==self.dataList[myIndex][key]){
          self.dataList[myIndex].parentDepartName=item.nodeName;
        }
      });
      }
      if(key=="departId"){
      self.departList[myIndex].some((item,index)=>{
        if(item.nodeId==self.dataList[myIndex][key]){
          self.dataList[myIndex].departName=item.nodeName;
        }
      });
      }
    }
  }
}

</script>

<style lang="scss" scoped>
 .header{
    height: 56px;
    width: 100%;
    line-height: 56px;
    text-align: center;
    color:rgba(247,139,0,1);
    border-bottom:1px solid #e5e2e2;
  }

  .header_font{
    display: inline-block;
    height: 56px;
    width: 106px;
    border-bottom:3px solid #C31725;
    font-size:16px;
  }

    .qwui-dotted_line{
    border-right:1px dashed #cfcfcf;
    margin: 0 8px 0 5px;
  }

  .qwui-bar{
    display: flex;
    justify-content:space-between;
    margin: 25px 0 20px 0;
  }

  .qwui-table_wrap{

    span{
      padding: 0 4px;
      height: 100%;
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .recruitRow{
    width: 100%;
    height: 50px;
    line-height: 50px;
  }

  .qwui-select{
    background-color: #f4f4f4;
    width: 100%;
    height: 46px;
    border: none;
  }

  .qwui-text{
    background-color: #f4f4f4;
    border: none;
    width: 100%;
    height: 46px;
    padding: 0 4px;
  }

  input{
    font-size: 14px;
  }
</style>

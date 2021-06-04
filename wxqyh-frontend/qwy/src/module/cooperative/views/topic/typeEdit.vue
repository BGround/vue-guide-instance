<template>
  <div class="topic_type_wrap">
    <div class="nav_wrap">
      <qwuiButton @click="goBack">&nbsp;返回&nbsp;</qwuiButton>
      <span><span class="c999">同事社区 / 设置 </span>/ {{pageTitle}}</span>
    </div>

    <div class="main_wrap">
      <qwForm :model="ruleForm" :rules="rules" label-width="140" width="440" ref="ruleForm">
        <qwFormItem label="标题：" prop="typeName">
          <qwuiInput v-model="ruleForm.typeName" @input="titleInput" :maxLength="10"></qwuiInput>
        </qwFormItem>
        <qwFormItem label="排序号：">
          <qwuiInput inputType="sort" v-model="sortNum" ref="sortNumInput"></qwuiInput>
        </qwFormItem>
        <qwFormItem label="类型可见范围：">
          <pickExam
            :allObj="allObj"
            :speObj="speObj"
            :useTab="visibleTab"
            :useDepts="visibleDepts"
            :useUsers="visibleUsers"
            :useTags="visibleTags"
            :useRadio.sync="visibleRadio"
            @chooseDone="visibleChooseDone"
            @changeRadio="visibleChangeRadio"></pickExam>
        </qwFormItem>
        <qwFormItem label="类型发布权限：">
          <pickExam
          :useTab="publishTab"
          :useDepts="useDepts"
          :useUsers="useUsers"
          :useTags="useTags"
          :intersectionDept="intersectionDept"
          :intersectionTag="intersectionTag"
          :intersectionUser="intersectionUser"
          :useRadio.sync="useRadio"
          @chooseDone="chooseDone"
          @changeRadio="changeRadio"></pickExam>
        </qwFormItem>
        <div class="dotted_line" ></div>
        <qwFormItem label="话题编辑时限：">
          <qwuiSelect class="type_select" @selectItem="selectItemType" :dataList="typeData" :selectVal="selectValType"></qwuiSelect>
        </qwFormItem>
        <qwFormItem label="设置：">
          <div class="setting_bottom">
            <qwuiCheckbox v-model="isTime">开启发帖时间段限制</qwuiCheckbox>
            <div class="time_select" v-show="isTime">
               <QwTimeSelect
                type="time-select"
                v-model="publishStartTime"
                :editable=false
                placeholder="开始时间"
                :pickerOptions="pickerOptions"></QwTimeSelect> -
              <QwTimeSelect
                type="time-select"
                v-model="publishEndTime"
                :editable=false
                placeholder="结束时间"
                :pickerOptions="pickerOptions"></QwTimeSelect>
            </div>

          </div>
          <div class="setting_bottom">
            <qwuiCheckbox v-model="topicExam" @change="openExamine">开启话题审核，设置审核人<span class="ontVipTip">{{ontVipTip}}</span></qwuiCheckbox>
            <crmPickPerson
              class="examine_pick_person"
              v-if="topicExam"
              selectText="点击选择"
              :useTab="useTab"
              :useUsers="topicExamUsers"
              @chooseDone="topicExamChoose"
            ></crmPickPerson>
          </div>
          <div class="setting_bottom">
            <qwuiCheckbox v-model="commentExam" @change="openExamine">开启评论审核，设置审核人<span class="ontVipTip">{{ontVipTip}}</span></qwuiCheckbox>
            <crmPickPerson
              class="examine_pick_person"
              v-if="commentExam"
              selectText="点击选择"
              :useTab="useTab"
              :useUsers="comExamUsers"
              @chooseDone="comExamChoose"
            ></crmPickPerson>
          </div>
          <div class="setting_bottom">
            <qwuiCheckbox v-model="status">启用本类型</qwuiCheckbox>
          </div>
        </qwFormItem>
      </qwForm>
      <div class="c999 record_info" v-if="isEdit&&hasEdit">
        <span>上一次由{{lastEditor}}于{{lastEditTime}}编辑，该类型可见范围为{{lastEditRange}}</span>
      </div>
      <div class="line"></div>
      <div class="tcenter pb20">
        <qwuiButton v-perm="'typeEdit'" type="primary" @click="submitForm('ruleForm','save')" class="mr10">&nbsp;保存&nbsp;</qwuiButton>
      </div>
    </div>
  </div>
</template>
<script>
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import qwForm from '@/components/form/form';
import qwFormItem from '@/components/form/formItem';
import qwuiInput from '@/components/qwuiBase/qwuiInput/QwInput';
import pickExam from '@/components/pickPerson/pickExam';
import qwuiSelect from '@/components/qwuiBase/qwuiSelect/QwSelect';
import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox';
import crmPickPerson from '@/components/pickPerson/crmPickPerson';
import {isVipGold} from '@/assets/js/vip-manager';
import {typeAddAjax,getTopicType,ajaxUpdateType} from '../../api/topic/getData.js';
export default {
  data(){
    return {
      pageTitle:'新增类型',
      sortNum:0,
      ruleForm:{
        typeName:'',
      },
      rules:{
        typeName:[
          {required: true, message: '标题不能为空', trigger: 'blur'},
        ]
      },
      allObj:{
        id:'a1',
        text:'所有人',
      },
      speObj:{
        id:'a2',
        text:'特定对象',
      },
      visibleTab:[
        {text:'部门'},
        {text:'标签'},
        {text:'标签人员'},
        {text:'特定人员'},
        {text:'批量导入'},
        {text:'高级筛选'},
      ],
      publishTab:[
        {text:'部门'},
        {text:'标签'},
        {text:'标签人员'},
        {text:'特定人员'},
        {text:'批量导入'},
        {text:'高级筛选'},
      ],
      visibleDepts:[],
      visibleUsers:[],
      visibleTags:[],
      visibleRadio:'所有人',
      useDepts:[],
      useUsers:[],
      useTags:[],
      intersectionDept:[],//发布权限部门限制
      intersectionTag:[],//发布权限标签限制
      intersectionUser:[],//发布权限人员限制
      useRadio:'所有人',
      submitData:{
        'tbXyhTopicTypePO.typeName':'',
        'tbXyhTopicTypePO.sortNum':'',
        visibleRange:1,
        visibleDeptIds:'',
        visibleUserIds:'',
        visibleTagIds:'',
        publishRange:1,
        publishDeptIds:'',
        publishUserIds:'',
        publishTagIds:'',
        'tbXyhTopicTypePO.editTimes':-1,//允许编辑时限
        'tbXyhTopicTypePO.isTime':0,//发帖时间限制
        'tbXyhTopicTypePO.startTime':'23:00',//限制开始时间
        'tbXyhTopicTypePO.endTime':'06:00',//限制结束时间
        'tbXyhTopicTypePO.isUsing':0,//话题审核
        topicReviewers:'',//话题审核人
        'tbXyhTopicTypePO.isEnable':0,//评论审核
        commentReviewers:'',//评论审核人
        'tbXyhTopicTypePO.status':1,//启用类型
      },
      typeData:[
        {val:-1,optionName:'不限制'},
        {val:0,optionName:'不允许'},
        {val:5,optionName:5},
        {val:10,optionName:10},
        {val:20,optionName:20},
        {val:30,optionName:30},
        {val:60,optionName:60},
        {val:120,optionName:120},
      ],
      selectValType: {
        name: '不限制',
        idx: -1
      },
      isTime:false,//发帖时段限制
      topicExam:false,
      commentExam:false,
      status:true,
      useTab:[
        {text:'特定人员'},
        {text:'标签人员'},
        {text:'批量导入'},
        {text:'高级筛选'},
      ],
      topicExamUsers:[],
      comExamUsers:[],
      isGoldVip:false,
      ontVipTip:'',
      vipHref: 'https://qy.do1.com.cn/qwy/qiweipublicity/companysrv/vip/vip_gold_index.jsp?utm_source=pc&utm_medium=nav',
      selectName:{
        '-1':'不限制',
        '0':'不允许',
        '5':5,
        '10':10,
        '20':20,
        '30':30,
        '60':60,
        '120':120,
      },
      isEdit:false,
      hasEdit:false,
      typeId:'',
      lastEditor:'',
      lastEditTime:'',
      lastEditRange:'',
      lastRange:1,
      publishStartTime:'23:00',
      publishEndTime:'06:00',
      pickerOptions:{
        start:'00:00',
        end:'24:00',
        step:'00:05'
      }
    }
  },
  created(){
    this.typeId=this.$route.query.id;
    this.isGoldVip=isVipGold(interfaceCode.INTERFACE_CODE_TOPIC);
    this.ontVipTip=this.isGoldVip?'':'（该功能仅限尊享版使用）';
    this.$nextTick(function(){
      this.sortNum=this.$route.query.sortNum?this.$route.query.sortNum+'':0;
    })
    if(this.typeId){
      this.isEdit=true;
      this.pageTitle='编辑类型';
      this.getTypeInfo(this.typeId);
    }
  },
  methods:{
    goBack(){
      history.back();
    },
    titleInput(val){
    },
    //话题可见范围选择回调
    visibleChooseDone(dept=[],tag=[],user=[]){
      this.visibleDepts=dept;
      this.visibleUsers=user;
      this.visibleTags=tag;
      this.useDepts=[];
      this.useUsers=[];
      this.useTags=[];
      this.intersectionDept=this.addId(dept,'deptId','nodeId');
      this.intersectionTag=this.addId(tag,'tagId','id');
      this.intersectionUser=this.addId(user,'userId','userId');
      this.publishTab = this.changePublichTab(dept,tag,user);
    },
    visibleChangeRadio(val){
      this.submitData.visibleRange=val==='所有人'?'1':'3';
      if(this.submitData.visibleRange=='1'){
        this.visibleDepts=[];
        this.visibleUsers=[];
        this.visibleTags=[];
        this.useRadio='所有人';
        this.submitData.publishRange='1';
        this.useDepts=[];
        this.useUsers=[];
        this.useTags=[];
        this.intersectionDept=[];
        this.intersectionTag=[];
        this.intersectionUser=[];
      }
    },
    chooseDone(dept=[],tag=[],user=[]){
      this.useDepts=dept;
      this.useUsers=user;
      this.useTags=tag;
    },
    changeRadio(val){
      this.submitData.publishRange=val==='所有人'?'1':'3';
    },
    selectItemType(optionName, val){
      this.submitData['tbXyhTopicTypePO.editTimes']=val;
    },
    topicExamChoose(dept=[],tag=[],user=[]){
      this.topicExamUsers=user;
    },
    comExamChoose(dept=[],tag=[],user=[]){
      this.comExamUsers=user;
    },
    openExamine(){
      if(!this.isGoldVip){
        this.topicExam=false;
        this.commentExam=false;
        _.alert("提示", "该功能仅限尊享版使用，<a class='orange' href='"+ this.vipHref+"' target='_blank'>马上升级></a>");
      }
    },
    submitForm(formName,type){
      let self = this;
      this.$refs[formName].validate((valid) => {
        if(valid){
          self.save();
        }
      });
    },
    save(){
      Object.assign(this.submitData,{
        'tbXyhTopicTypePO.typeName':this.ruleForm.typeName,
        'tbXyhTopicTypePO.sortNum':this.sortNum,
        visibleRange:this.submitData.visibleRange,
        visibleDeptIds:this.getRangeStr(this.visibleDepts,'nodeId','deptId'),
        visibleUserIds:this.getRangeStr(this.visibleUsers,'userId'),
        visibleTagIds:this.getRangeStr(this.visibleTags,'id','tagId'),
        publishRange:this.submitData.publishRange,
        publishDeptIds:this.getRangeStr(this.useDepts,'nodeId','deptId'),
        publishUserIds:this.getRangeStr(this.useUsers,'userId'),
        publishTagIds:this.getRangeStr(this.useTags,'id','tagId'),
        'tbXyhTopicTypePO.editTimes':this.submitData['tbXyhTopicTypePO.editTimes'],
        'tbXyhTopicTypePO.isTime':this.isTime?'1':'0',
        'tbXyhTopicTypePO.startTime':this.publishStartTime,
        'tbXyhTopicTypePO.endTime':this.publishEndTime,
        'tbXyhTopicTypePO.isUsing':this.topicExam?1:0,
        topicReviewers:this.getRangeStr(this.topicExamUsers,'userId'),
        'tbXyhTopicTypePO.isEnable':this.commentExam?1:0,
        commentReviewers:this.getRangeStr(this.comExamUsers,'userId'),
        'tbXyhTopicTypePO.status':this.status?'1':'0',
      });
      if(!this.submitData['tbXyhTopicTypePO.typeName'].trim().length){
        dataBase.top_alert('话题类型为空',false,3000);
        return ;
      }
      if(this.submitData['tbXyhTopicTypePO.typeName'].length>10){
        dataBase.top_alert('超出限制字符10字，请重新编辑',false,3000);
        return ;
      }
      if(this.submitData.visibleRange=='3'&&!this.submitData.visibleDeptIds&&!this.submitData.visibleUserIds&&!this.submitData.visibleTagIds){
        dataBase.top_alert('类型可见范围为空',false,3000);
        return ;
      }
      if(this.submitData.publishRange=='3'&&!this.submitData.publishDeptIds&&!this.submitData.publishUserIds&&!this.submitData.publishTagIds){
        dataBase.top_alert('类型发布权限为空',false,3000);
        return ;
      }
      if(this.submitData['tbXyhTopicTypePO.isUsing']&&!this.submitData.topicReviewers){
        dataBase.top_alert('请设置话题审核人',false,3000);
        return ;
      }
      if(this.submitData['tbXyhTopicTypePO.isEnable']&&!this.submitData.commentReviewers){
        dataBase.top_alert('请设置评论审核人',false,3000);
        return ;
      }
      if(!this.submitData['tbXyhTopicTypePO.startTime']||!this.submitData['tbXyhTopicTypePO.endTime']){
        dataBase.top_alert('请选择正确发帖时间段',false,3000);
        return ;
      }
      if(this.isEdit){
        this.submitData['tbXyhTopicTypePO.id']=this.typeId;
        if(this.submitData.visibleRange=='1'){
          let range=this.lastRange=='1'?'通讯录所有人':'特定对象';
          let self=this;
          _.alert('提示','原类型可见范围为'+this.lastEditor+range+'，现变更为您管理部门的所有人，请确认是否继续保存？',function(){
            ajaxUpdateType({...self.submitData},()=>{
              dataBase.top_alert('保存成功',true,3000);
              this.$router.push('topicTypeList');
            })
          },'确定',true)
        }else{
          ajaxUpdateType({...this.submitData},()=>{
            dataBase.top_alert('保存成功',true,3000);
            this.$router.push('topicTypeList');
          })
        }
      }else{
        typeAddAjax({...this.submitData},()=>{
          dataBase.top_alert('保存成功',true,3000);
          this.$router.push('topicTypeList');
        })
      }
    },
    getRangeStr(arr,id,otherId){
     let idArr=[];
     arr.forEach(function(item){
       idArr.push(item[id]||item[otherId]);
     })
     return idArr.join('|');
    },
    addId(arr,id,otherId){
      let resultArr = [];
      if(arr.length){
        arr.forEach(function(item,index){
          arr[index][id] = arr[index][id] || arr[index][otherId];
        });
        resultArr = arr;
      }else{
        let arrObj = {};
        arrObj[id] = '-1';
        resultArr[0] = arrObj;
      }
      return resultArr;
    },
    changePublichTab(dept,tag,user){
      let arr = [];
      if(dept.length){
        arr.push({text:'部门'});
        arr.push({text:'特定人员'});
      }
      if(tag.length){
        arr.push({text:'标签人员'});
        arr.push({text:'标签'});
      }
      if(user.length&&!dept.length&&!tag.length){
        arr = [
          {text:'特定人员'}
        ]
      }
      arr.push({text:'批量导入'});
      arr.push({text:'高级筛选'});
      return arr;
    },
    getTypeInfo(typeId){
      getTopicType({id:typeId},(data)=>{
        let tbXyhTopicTypePO=data.tbXyhTopicTypePO;
        let topicTypeEditlogPO=data.tbXyhTopicTypePO.topicTypeEditlogPO;
        if(topicTypeEditlogPO){
          let lastEditDate=new Date(topicTypeEditlogPO.lastEditTime.time);
          this.hasEdit=true;
          this.lastEditTime=lastEditDate.getFullYear()+'-'+(lastEditDate.getMonth()+1)+'-'+lastEditDate.getDate();
          this.lastEditor=topicTypeEditlogPO.lastEditor;
          this.lastEditRange=tbXyhTopicTypePO.visibleRange==='3'?'特定对象':'所有人（'+topicTypeEditlogPO.lastEditor+'管理部门的所有人）';
        }
        this.ruleForm.typeName=tbXyhTopicTypePO.typeName;
        this.sortNum=tbXyhTopicTypePO.sortNum+'';
        this.visibleRadio=tbXyhTopicTypePO.visibleRange==='3'?'特定对象':'所有人';
        if(tbXyhTopicTypePO.visibleRange==='3'){
          this.visibleDepts=data.visibleDeptList.length?data.visibleDeptList:[];
          this.visibleUsers=data.visibleUserList.length?data.visibleUserList:[];
          this.visibleTags=data.visibleTagList.length?data.visibleTagList:[];
          this.publishTab = this.changePublichTab(data.visibleDeptList,data.visibleTagList,data.visibleUserList);
          this.intersectionDept=this.addId(data.visibleDeptList,'deptId','nodeId');
          this.intersectionTag=this.addId(data.visibleTagList,'tagId','id');
          this.intersectionUser=this.addId(data.visibleUserList,'userId','userId');
        }
        this.useRadio=tbXyhTopicTypePO.ranges==='3'?'特定对象':'所有人';
        if(tbXyhTopicTypePO.ranges==='3'){
          this.useDepts=data.publishDeptList.length?data.publishDeptList:[];
          this.useUsers=data.publishUserList.length?data.publishUserList:[];
          this.useTags=data.publishTagList.length?data.publishTagList:[];
        }
        this.submitData['tbXyhTopicTypePO.editTimes']=tbXyhTopicTypePO.editTimes;
        this.selectValType={
          name:this.selectName[tbXyhTopicTypePO.editTimes],
          idx:tbXyhTopicTypePO.editTimes
        }
        this.isTime=tbXyhTopicTypePO.isTime&&tbXyhTopicTypePO.isTime=='0'?false:true;
        if(this.isTime){
          this.publishStartTime=tbXyhTopicTypePO.startTime;
          this.publishEndTime=tbXyhTopicTypePO.endTime;
        }
        this.topicExam=tbXyhTopicTypePO.isUsing?true:false;
        this.topicExamUsers=this.topicExam?tbXyhTopicTypePO.topicReviewers:[];
        this.commentExam=tbXyhTopicTypePO.isEnable=='1'?true:false;
        this.comExamUsers=this.commentExam?tbXyhTopicTypePO.commentReviewers:[];
        this.status=tbXyhTopicTypePO.status=='1'?true:false;
        this.lastRange=tbXyhTopicTypePO.visibleRange;
      })
    }
  },
  components:{
    qwuiButton,
    qwForm,
    qwFormItem,
    qwuiInput,
    pickExam,
    qwuiSelect,
    qwuiCheckbox,
    crmPickPerson,
  }
}
</script>
<style lang="scss" scoped>
  .topic_type_wrap{
    padding-top: 20px;
    .nav_wrap{
      padding-bottom: 15px;
    }
    .main_wrap{
      position: relative;
      padding-top: 20px;
    }
    .dotted_line{
      position: relative;
      height: 1px;
      margin-bottom: 20px;
      &:before{
        content:' ';
        position: absolute;
        width: 960px;
        height: 1px;
        background-image: linear-gradient(to right, #ccc 0%, #ccc 75%, transparent 75%);
        background-size: 14px 1px;
        background-repeat: repeat-x;
      }
    }
    .type_select{
      position: relative;
      width: 100px;
    }
    .setting_bottom{
      margin-bottom: 15px;
      .time_select{
        position: relative;
        width: 700px;
        top: 10px;
      }
    }
    .examine_pick_person{
      margin-top:15px;
    }
    .line{
      position: relative;
      height: 1px;
      background: #eee;
      margin-bottom: 20px;
    }
    .ontVipTip{
      position: absolute;
      width: 180px;
    }
    .record_info{
      margin-bottom: 20px;
    }
  }
</style>



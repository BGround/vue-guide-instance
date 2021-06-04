<template>
  <div class="qwui-add_wrap">
    <div class="qwui-nav_wrap">
      <qwuiButton @click="goBack">&nbsp;返回&nbsp;</qwuiButton>
    </div>
    <qwTitle :titleContent="pageTitle"></qwTitle>
    <div class="qwui-main_wrap">
      <qwForm :model="ruleForm" :rules="rules" label-width="140" width="440" ref="ruleForm">
        <qwFormItem label="标题：" prop="title">
          <qwuiInput v-model="ruleForm.title" @input="titleInput"></qwuiInput>
          <span class="qwui-timing_tip">{{timingTip}}</span>
        </qwFormItem>
        <qwFormItem label="类型：" prop="type">
          <qwui-select class="type_select" @selectItem="selectItemType" :dataList="typeData" :selectVal="selectValType"></qwui-select>
        </qwFormItem>
        <qwFormItem label="封面图片：" class="upload_img_bottom">
          <qwUploadImg @imageObj="coverImg" :uploadConfig="uploadConfig">
            <span class="c999" slot="upload_tip_text">建议尺寸940px*400px；支持 jpg\bmp\png</span>
          </qwUploadImg>
        </qwFormItem>
        <div class="qwui-dotted_line" ></div>
        <qwFormItem label="发布对象：">
          <pickExam
          :useTab="useTab"
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
        <qwFormItem prop="text" label="话题内容：" class="qwui-full">
          <div>
            <editor :config="editorOption" :agentCode="agentCode" ref="editor" @blur="textBlur"></editor>
          </div>
        </qwFormItem>
        <qwFormItem label="附件：">
          <QwUploadWrap
            :fileList="fileList"
            :limit="100"
            :beforeUpload="beforeUploadFile"
            :onSuccess="handleSuccessFile"
            :onRemove="handleRemoveFile">
            <qwuiButton class="mb5">上传文件</qwuiButton>
            <span class="c999 upload_file_tip">仅支持 .txt .xml .pdf .doc .docx .ppt .pptx .xls .xlsx .wma .amr .mp3 .mp4 .rar .zip</span>
          </QwUploadWrap>
        </qwFormItem>
        <div class="qwui-dotted_line"></div>
        <qwFormItem label="话题设置：">
          <div v-for="(item,index) in topicSetting" :key="index">
            <qwuiCheckbox
             v-model=setting.isCheck
             v-for="(setting,key,settingIndex) in item"
             :key="settingIndex"
             v-if="setting.show"
             :style="{paddingLeft:setting.left?setting.left:0}"
             @change="settingChange(setting,item)">
             {{setting.name}}
             </qwuiCheckbox>
          </div>
        </qwFormItem>
      </qwForm>
      <qwCoverImgPreview class="cover_img_preview" :title="previewTitle" :img="previewImg" :text="previewText"></qwCoverImgPreview>
      <div class="qwui-line"></div>
      <div class="tcenter pb20">
        <qwuiButton v-perm="'updateTopic'" v-if="!isEdit" @click="doPreview" class="mr10">&nbsp;预览&nbsp;</qwuiButton>
        <qwuiButton v-perm="'updateTopic'" v-if="!isEdit" @click="submitForm('ruleForm','draft')" class="mr10">&nbsp;保存为草稿&nbsp;</qwuiButton>
        <qwuiButton v-perm="'updateTopic'" type="primary" @click="submitForm('ruleForm','publish')" class="mr10">&nbsp;发布&nbsp;</qwuiButton>
      </div>
    </div>
  </div>
</template>

<script>
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/QwInput';
  import qwuiSelect from '@/components/qwuiBase/qwuiSelect/QwSelect';
  import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox'
  import qwUploadImg from '@/components/Add/uploadImg/QwUploadImg';
  import qwTitle from '@/components/base/QwTitle';
  import qwForm from '@/components/form/form';
  import qwFormItem from '@/components/form/formItem';
  import qwFunctionBox from '@/components/base/QwFunctionBox';
  import pickExam from '@/components/pickPerson/pickExam';
  import Editor from '@/components/base/editor';
  import qwCoverImgPreview from '@/components/Add/QwCoverImgPreview';
  import funcBox from '@/components/list/funcBox';
  import VueDatepickerLocal from '@/components/base/VueDatepickerLocal';
  import QwUploadWrap from '@/components/Add/Upload/QwUploadWrap';
  import {
    getTypeList,
    getTopicVisiableRange,
    addAjax,
    getTopicHistoryInfo,
    ajaxUpdateTopic
  } from '../../api/topic/getData.js';
  const EDITOR_OPTION = {
    wordCount:false,
    initialFrameHeight: 350,
    zIndex: 10,
    enableAutoSave: false,
    saveInterval: 1000,
    autoHeightEnabled:false, //禁止自动改变高度
    toolbars: [[
      'fullscreen','source','|','undo', 'redo','bold','italic','underline','removeformat','formatmatch','forecolor','backcolor',
      'insertorderedlist','insertunorderedlist','fontfamily','fontsize','justifyleft','justifycenter','justifyright','justifyjustify','lineheight','|','link'
      ,'unlink','insertimage','insertvideo','|','inserttable','deletetable','|','wordimage'
    ]]
  }
  export default {
    data(){
      return {
        pageTitle:'新增',
        ruleForm: {
          title: '',
          type:'',
          text:'',
        },
        rules: {
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'},
          ],
          type:[
            {required: true, message: '类型不能为空', trigger: 'blur'},
          ],
          text:[
            {required:true,trigger: 'blur',validator:function(rule, value, callback){
              if (!value) {
                callback(new Error('正文为空'));
              }else{
                callback();
              }
            }},
          ],
        },
        timingTip:'',
        typeData:[],
        uploadConfig:{
          uploadFileId:dataBase.agentCode+'CoverImg',
          showType:'small',
          isMoreImg:false,
          imageObj:{
            imageURL:'',
            fileName:'',
          },
        },
        previewTitle:'标题',//封面图预览标题
        previewImg:require('assets/images/icon_default_cover_img.png'),//封面图
        previewText:'',//预览内容
        useTab:[
          {text:'部门'},
          {text:'标签'},
          {text:'标签人员'},
          {text:'特定人员'},
          {text:'批量导入'},
          {text:'高级筛选'},
        ],
        useDepts:[],
        useUsers:[],
        useTags:[],
        useRadio:'所有人',
        editorOption: EDITOR_OPTION,//编辑器项
        agentCode:dataBase.agentCode,
        fileList:[],//附件列表
        selectValType: {
          name: '',
          idx: 0
        },
        topicSetting:[//话题设置
          {isAnony:{name:'匿名发布',id:'anony',show:true,isCheck:false}},
          {isShare:{name:'开启外部分享',id:'share',show:true,isCheck:false},shareComment:{name:'外部分享显示评论',id:'shareComment',show:false,left:'32px',isCheck:false}},
          {isComment:{name:'开启评论',id:'comment',show:true,isCheck:true},anonyComment:{name:'允许匿名评论',id:"anonyComment",show:true,left:'60px',isCheck:false}},
          {isTop:{name:'置顶话题',id:'top',show:true,isCheck:false}},
          {isSendMsg:{name:'话题发布/更新时通知目标对象',id:'sendMsg',show:true,isCheck:false}},
        ],
        uploadImgObj:{},//上传图片对象
        submitData:{
          'tbXyhTopicPO.title':'',
          'tbXyhTopicPO.typeName':'',
          'tbXyhTopicPO.topicType:':'',
          'tbXyhTopicPO.content':'',
          'tbXyhTopicPO.summary':'',
          'tbXyhTopicPO.isAnony':0,
          'tbXyhTopicPO.isShare':0,
          'tbXyhTopicPO.shareComment':0,
          'tbXyhTopicPO.isComment':0,
          'tbXyhTopicPO.anonyComment':0,
          'tbXyhTopicPO.isTop':0,
          'tbXyhTopicPO.isSendMsg':0,
          'tbXyhTopicPO.status':0,
          mediaIds:'',
          file:'',
          imageUrls:'',
          imgFile:'',
          deptIds:'',
          tagIds:'',
          userIds:'',
          range:'1',
          editorValue:'',
        },
        mediaIdsArr:[],
        settingIndex:[
          'isAnony','isShare','isComment','isTop','isSendMsg'
        ],
        isEdit:false,
        deptArr:[],
        tagArr:[],
        userArr:[],
        intersectionDept:[],//可见范围部门限制
        intersectionTag:[],//可见范围标签限制
        intersectionUser:[],//可见范围人员限制
        topicId:'',
      }
    },
    created(){
      this.topicId=this.$route.query.id;
      window.localStorage.setItem('personName',wxqyhConfig.personName);
      if(this.topicId){
        this.isEdit=true;
        this.pageTitle='编辑'
        this.getTopicInfo(this.topicId);
        this.topicSetting[0].isAnony.show=false;
        this.topicSetting[3].isTop.show=false;
      }
      getTypeList((data)=>{
        let self=this;
        data.typeList.forEach(function(item){
          self.typeData.push({
            val:item.id,
            optionName:item.typeName
          })
        })
      })
    },
    beforeDestroy(){
      if(localStorage.getItem('previewData')){
        localStorage.removeItem('previewData');
      }
    },
    methods:{
      goBack(){
        history.back();
      },
      titleInput(val){
        this.previewTitle=val;
      },
      selectItemType(optionName, val){
        this.selectValType.name=optionName;
        this.selectValType.idx=val;
        this.ruleForm.type=val;
        getTopicVisiableRange({topicTypeId:val},(data)=>{
          this.submitData.range='1';
          this.useRadio='所有人';
          this.submitData.deptIds='';
          this.submitData.tagIds='';
          this.submitData.userIds='';
          this.useDepts=[];
          this.useUsers=[];
          this.useTags=[];
          if(data.topicTypeVisibleRange==='3'){
            this.intersectionDept = data.visibleDeptList.length?data.visibleDeptList:[{deptId:'-1'}];
            this.intersectionTag = data.visibleTagList.length?data.visibleTagList:[{tagId:'-1'}];
            this.intersectionUser = data.visibleUserList.length?data.visibleUserList:[{userId:'-1'}];
            this.useTab = this.changePublichTab(data.visibleDeptList,data.visibleTagList,data.visibleUserList);
          }else{
            this.intersectionDept = [];
            this.intersectionTag = [];
            this.intersectionUser = [];
            this.useTab = [
                            {text:'部门'},
                            {text:'标签'},
                            {text:'标签人员'},
                            {text:'特定人员'},
                            {text:'批量导入'},
                            {text:'高级筛选'},
                          ];
          }
        });
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
      coverImg(obj){
        this.uploadImgObj = obj;
        this.previewImg = this.uploadImgObj.imageURL
          ? _.compressURL + this.uploadImgObj.imageURL
          : require('assets/images/icon_default_cover_img.png');
      },
      //选人选择完毕回调
      chooseDone(dept=[],tag=[],user=[]){
        this.deptArr=[];
        this.tagArr=[];
        this.userArr=[];
        let self=this;
        dept.forEach(function(item){
          self.deptArr.push(item.nodeId||item.deptId);
        });
        tag.forEach(function(item){
          self.tagArr.push(item.id||item.tagId);
        });
        user.forEach(function(item){
          self.userArr.push(item.userId);
        });
      },
      //对象选择回调
      changeRadio(val){
        this.submitData.range=val==="所有人"?'1':'3';
      },
      //百度编辑器失去焦点回调事件
      textBlur(value){
        this.ruleForm.text = value;
        this.submitData['tbXyhTopicPO.content'] = value;
        this.submitData.editorValue=value;
      },
      //上传附件前处理
      beforeUploadFile(file){
        let size = file.size;
        let fileName = file.name;
        let isExt = fileName.lastIndexOf(".");
        let fileExt = fileName.substr(isExt).toLowerCase();//获得文件后缀名
        if(!(".txt.xml.pdf.doc.ppt.xls.docx.pptx.xlsx.mp3.wma.amr.mp4.rar.zip".includes(fileExt))){
          dataBase.top_alert('只能上传txt,xml,pdf,doc,ppt,xls,docx,pptx,xlsx,mp3,wma,amr,mp4,rar,zip；如需上传其它格式文件请先将其压缩后再上传',false,3000);
          return false;
        }
        if(_.is_vip&&size>50*1024000){
          dataBase.top_alert('文件大小不超过50M',false,3000);
          return false;
        }else if(size>10*1024000){
          dataBase.top_alert('文件大小不超过10M',false,3000);
          return false;
        }
        return true;
      },
      //处理上传附件成功
      handleSuccessFile(file){
        this.mediaIdsArr.push.apply(this.mediaIdsArr,file);
      },
      //处理上传附件删除
      handleRemoveFile(file,fileList){
        this.mediaIdsArr = fileList;
      },
      //将数组转化为字符串
      getFileIds(fileArr){
        let fileIds=[];
        fileArr.forEach(function(item){
          fileIds.push(item.id);
        })
        this.submitData.mediaIds=fileIds.join(',');
      },
      //预览
      doPreview(){
        let previewData={};
        Object.assign(previewData,{
          title:this.ruleForm.title,
          typeName:this.selectValType.name,
          publisher:wxqyhConfig.personName,
          coverImg:this.uploadImgObj.imageURL?this.uploadImgObj.imageURL:'',
          content:this.submitData.editorValue,
          medialist:this.mediaIdsArr
        })
        if(localStorage.getItem('previewData')){
          localStorage.removeItem('previewData');
        }
        window.localStorage.setItem('previewData',JSON.stringify(previewData));
        let top=(window.screen.height-560)/2;
        let left=(window.screen.width-350)/2;
        window.open(_.baseURL+'/manager/topic/preview.jsp', 'newwindow', 'left='+left+',top='+top+',height=580, width=350, toolbar=no, menubar=no, resizable=yes,location=no, status=no,scrollbars=no,directories=no,menubar=no');
      },
      //提交验证(包括保存草稿和发布)
      submitForm(formName,type){
        let self = this;
        this.$refs[formName].validate((valid) => {
          if(valid){
            self.submitHandler(type);
          }
        });
      },
      //话题设置项状态改变
      settingChange(setting,settingObj){
        switch(setting.id){
          case 'share':
            settingObj.shareComment.show=setting.isCheck;
          break;
          case 'comment':
            settingObj.anonyComment.show=setting.isCheck;
          break;
          default:
          break;
        }
      },
      //发布或保存草稿
      save(status){
        Object.assign(this.submitData,{
          'tbXyhTopicPO.title':this.ruleForm.title,
          'tbXyhTopicPO.typeName':this.selectValType.name,
          'tbXyhTopicPO.topicType':this.selectValType.idx,
          'tbXyhTopicPO.content':this.ruleForm.text,
          'tbXyhTopicPO.summary':'',
          'tbXyhTopicPO.isAnony':this.topicSetting[0].isAnony.isCheck?1:0,
          'tbXyhTopicPO.isShare':this.topicSetting[1].isShare.isCheck?1:0,
          'tbXyhTopicPO.shareComment':this.topicSetting[1].shareComment.isCheck?1:0,
          'tbXyhTopicPO.isComment':this.topicSetting[2].isComment.isCheck?0:1,
          'tbXyhTopicPO.anonyComment':this.topicSetting[2].anonyComment.isCheck?1:0,
          'tbXyhTopicPO.isTop':this.topicSetting[3].isTop.isCheck?1:0,
          'tbXyhTopicPO.isSendMsg':this.topicSetting[4].isSendMsg.isCheck?1:0,
          'tbXyhTopicPO.status':status,
          mediaIds:'',
          file:'',
          imageUrls:this.uploadImgObj.imageURL,//封面图
          imgFile:'',
          deptIds:this.deptArr.join('|'),
          tagIds:this.tagArr.join('|'),
          userIds:this.userArr.join('|'),
          range:this.submitData.range,
          editorValue:this.ruleForm.text,
        });
        this.getFileIds(this.mediaIdsArr);
        if(this.isEdit){
          this.submitData['tbXyhTopicPO.topicId']=this.topicId;
          this.submitData['tbXyhTopicPO.coverImage']=this.uploadImgObj.imageURL;
          this.submitData.imageUrls='';
          ajaxUpdateTopic({...this.submitData},()=>{
            dataBase.top_alert('保存成功', true, 3000);
            this.$router.go(-1);
          })
        }else{
          addAjax({...this.submitData},()=>{
            dataBase.top_alert('保存成功', true, 3000);
            this.$router.go(-1);
          })
        }
      },
      submitHandler(type){
        let status=type==='draft'?'1':'0';
        this.save(status);
      },
      //获取话题信息
      getTopicInfo(id){
        getTopicHistoryInfo({id},(data)=>{
          let tbXyhTopicPO=data.tbXyhTopicPO;
          this.ruleForm.title=tbXyhTopicPO.title;
          this.ruleForm.type=tbXyhTopicPO.topicType;
          Object.assign(this.selectValType,{
            name:tbXyhTopicPO.typeName,
            idx:tbXyhTopicPO.topicType
          })
          getTopicVisiableRange({topicTypeId:tbXyhTopicPO.topicType},(data)=>{
            if(data.topicTypeVisibleRange==='3'){
              this.intersectionDept=data.visibleDeptList.length?data.visibleDeptList:[{deptId:'-1'}];
              this.intersectionTag=data.visibleTagList.length?data.visibleTagList:[{tagId:'-1'}];
              this.intersectionUser=data.visibleUserList.length?data.visibleUserList:[{userId:'-1'}];
              this.changePublichTab(data.visibleDeptList,data.visibleTagList,data.visibleUserList);
            }
          })
          this.uploadConfig.imageObj.imageURL=tbXyhTopicPO.coverImage;
          this.previewImg=tbXyhTopicPO.coverImage?_.compressURL+tbXyhTopicPO.coverImage:require('assets/images/icon_default_cover_img.png');;
          this.uploadImgObj.imageURL=tbXyhTopicPO.coverImage;
          this.submitData.range=tbXyhTopicPO.targetRange;
          if(tbXyhTopicPO.targetRange==='3'){
            this.useRadio='特定对象';
            this.useDepts=data.deptList?data.deptList:[];
            this.useUsers=data.userList?data.userList:[];
            this.useTags=data.tagList?data.tagList:[];
            let self=this;
            this.useDepts.forEach(function(item){
              self.deptArr.push(item.deptId);
            });
            this.useTags.forEach(function(item){
              self.tagArr.push(item.tagId);
            });
            this.useUsers.forEach(function(item){
              self.userArr.push(item.userId);
            });
          }else{
            this.useRadio='所有人';
          }
          this.$refs.editor.setUEContent(tbXyhTopicPO.content);
          this.ruleForm.text=tbXyhTopicPO.content;
          this.fileList=data.mediaList;
          this.mediaIdsArr.push.apply(this.mediaIdsArr,data.mediaList);
          let self=this;
          this.topicSetting.forEach(function(item,index){
            let setting=item[self.settingIndex[index]];
            setting.isCheck=!!(+tbXyhTopicPO[self.settingIndex[index]]);
            if(self.settingIndex[index]=='isComment'){
              setting.isCheck=!setting.isCheck;
            }
            if(setting.id==='share'&&setting.isCheck){
              item.shareComment.show=true;
              item.shareComment.isCheck=!!(+tbXyhTopicPO.shareComment);
            }
            if(setting.id==='comment'&&setting.isCheck){
              item.anonyComment.show=true;
              item.anonyComment.isCheck=!!(+tbXyhTopicPO.anonyComment);
            }
          });
        })
      },
    },
    components:{
      qwuiButton,
      qwTitle,
      qwForm,
      qwFormItem,
      qwuiInput,
      qwuiSelect,
      qwUploadImg,
      qwuiCheckbox,
      pickExam,
      Editor,
      qwCoverImgPreview,
      funcBox,
      QwUploadWrap,
      VueDatepickerLocal,
    }
  }
</script>

<style scoped lang="scss">
.qwui-full /deep/ .qwui-form_item_content{
    width: 800px;
  }
  .qwui-add_wrap{
    padding-top: 20px;
    .qwui-nav_wrap{
      padding-bottom: 15px;
    }
    .qwui-main_wrap{
      position: relative;
      padding-top: 20px;
      .upload_img_bottom{
        margin-bottom: 120px;
      }
      .type_select{
        position: relative;
        z-index: 11;
      }
    }
    .qwui-dotted_line{
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
    .cover_img_preview{
      top:15px;
    }
    .upload_file_tip{
      position: absolute;
      width: 550px;
      top: 6px;
      left: 100px;
    }
    .qwui-line{
      position: relative;
      height: 1px;
      background: #eee;
      margin-bottom: 20px;
    }
  }
</style>

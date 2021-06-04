<template>
  <div class="wrap">
    <div class="mainContent">
      <!--话题类型、标题、编辑器-->
      <data_detail class="topicContent"
                  :contentMaxLength="32700"
                  :dataDetailMsg="titleConfig"
                  agent="topic"
                  ref="topicTitle"
                  :isUseUeditor="isPC"
                  :autoCaching=false
                  @listenToChild="selectCallback"></data_detail>
      <div class="uploadimg" v-if="isPic">
        <add-img-list
                    :imageList="imgUploadPicList"
                    @handleDeleteImage="handleDeleteImage"
                    :disabled="false">
          <add-img v-if="isPic" :agent="agentCode"
                :imageList="imgUploadPicList"
                :deleteImage="deleteImage"
                :limit="imgLimit"
                @updateImageList="setImgUploadValue"
                @limitUpdate="limitUpdate"
                listType="'picture-card'">
        </add-img>
      </add-img-list>
      </div>
      <!--上传附件-->
      <file_detail class="uploadFile" :dataDetailMsg="fileUpload" @listenToChild="showMsgFromFileDetail"></file_detail>
    </div>
    <!-- 可见范围 -->
    <div class="qwui-detaildata">
      <div class="qwui-inner_f_item qwui-flexbox">
        <span class="qwui-item_title">可见范围</span>
        <a href="javascript:;" class="qwui-inner_item" @click="personSelectShow = true">
          {{handleRange}}
        <span class="qwui-click_iconRight"></span>
        </a>
      </div>
    </div>
    <!-- 选人 -->
    <select_person
      :boxShow.sync="personSelectShow"
      :options="rangeConfig"
      :checked="rang"
      @confirmSelected="confirmSelectPerson(1)"
      @tagSelect="tagSelect">
    </select_person>
    <!-- 高级设置 -->
    <advanced_setting :dataDetailMsg="dataBase.advancedSetting"></advanced_setting>
    <!-- 按钮 -->
    <flow_button :buttondata="dataBase.buttonConfig"></flow_button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import data_detail from '@/components/add/add_title';
import addImg from '@/components/add/upload/add_img';
import AddImgList from '@/components/add/upload/imgList';
import file_detail from '@/components/add/add_file';
import select_person from '../components/select_person';
import advanced_setting from '@/components/add/advanced_setting';
import flow_button from '@/components/button/flow_button';
import {postPush,getTarget,checkDeptIsSpecific,getPermissionAndType,hasSameTitleTopic,addOrUpdateTopic,getTargetInfo,getOrgTopicConﬁg,getTopicTypeVisibleTarget} from '../../api/getData'
import {checkOpenShare} from '@/assets/js/vip-portal.js' 	//判断VIP
export default {
  data(){
    return {
      dataBase,
      titleConfig:{
        nav: '话题类型', //头部标题
        title:"",//标题内容
        titlePlaceholder: '请输入标题(必填)',
        content:"",//文本域内容
        contentPlaceholder: '请输入话题内容',
        templateTypeId:"",//选中的类型id
        templateType:[],//话题类型数组
        isDisabled:false,//是否显示类型下拉
        moreFunctions:[],//更多操作
        summaryContent:''//富文本内容
      },
      isPC:false,//是否是PC端
      imgUploadPicList:[],//图片数据
      deleteImage:{},      //删除图片附件
      fileUpload:{//文件数据
        mediaList: [],
        url: '/portal/imageupload/imageUploadAction!doUploadFile.action'
      },
      commintData:{//提交的数据
        editorFileMedias:[],//图片关联关系的数组
        hasSameTopic:'',//是否有相同的话题标题
        range:'',//发布对象的范围
        userIds:'',//特定对象字符串
        deptIds:'',//部门id
        tagIds:'',//标签id
        imageUrls:'',//图片地址数组
        mediaIds:'',//附件数组
        tbXyhTopicPO:{
          topicId:'',
          topicType:'',
          title:'',
          content:'',
          isAnony:0,
          anonyComment:0,
          isShare:1,
          shareComment:0,
          isComment:1,
          isSendMsg:0,
          status:0,
          isUeditor:0,
        }
      },
      personSelectShow:false,//选人
      rangeConfig:{
        '1': '所有人',
        '2': '本部门',
        '3': '特定对象'
      },
      //rang:1,//默认选择范围\
      isShareObj:{},//是否开启外部分享
      isVisitAllTarget:'',//是否可以查看全部人
      isPic:true,//是否上传图片
      imgLimit:1,
      isEdit:false,
      agentCode:'topic',
    }
  },
  computed:{
    ...mapGetters(['rang']),
    // 提交人员
    handleRange(){
      return this.rangeConfig[this.rang]
    },
  },
  watch:{
    //是否开启外部分享,开启则添加外部分享显示评论，否则去除
    'isShareObj.onOff':function(val){
      let index=this.findSetting('允许分享外部');
      let content=dataBase.advancedSetting.switchControl[index+1].content;
      if(val&&content!='外部分享显示评论'){
        dataBase.advancedSetting.switchControl.splice(index+1,0,{content: '外部分享显示评论', onOff: false});
      }else if(!val&&content=='外部分享显示评论'){
        dataBase.advancedSetting.switchControl.splice(index+1,1);
      }
    }
  },
  created(){
    let agentCode=this.$route.query.agentCode||_.getUrlParam('agentCode')||'topic'
    agentCode=agentCode=='activity'?'activity':'topic';
    this.agentCode=agentCode;
    //初始化高级设置
    this.dataBase.advancedSetting={
      switchControl: [ // 内容
        {content: '匿名发布', onOff: false},
        {content: '允许匿名评论', onOff: false},
        {content: '允许分享外部', onOff: false},
        {content: '外部分享显示评论', onOff: false},
        {content: '开启评论', onOff: true},
        {content: '发布时发送通知消息', onOff: true}
      ],
      levelData: {
        show:false,
        data:[]
      },
      option:[]
    }
    if(wxqyhConfig.orgConfigInfo.corpId=='wx41d4cc57153ba01c'){
      let sendInofIndex=this.dataBase.advancedSetting.switchControl.length-1;
      this.dataBase.advancedSetting.switchControl[sendInofIndex].onOff=false;
    }
    this.dataBase.buttonConfig={ //操作按钮
    primaryList:[
      {
        type:"primary",
        name:'立即提交',
        callBack:null
      },
    ],
    defaultList:[
      {type:"default",name:'保存草稿', callBack:null}
    ],
    class:""//按钮是否置底部 active :底部、"":相对定位
    }
    let push=_.getUrlParam('push');
    postPush(push);
    getTarget((data)=>{//初始化选人范围
      if(data.range=='2'){
        this.$store.commit('updateRang',2);
      }else{
        this.$store.commit('updateRang',1);
      }
    });
    getPermissionAndType((data)=>{
      if(data.hasPermission){
        for(let i=0;i<data.typeList.length;i++){
          this.titleConfig.templateType.push({id:data.typeList[i].id,name:data.typeList[i].typeName});
        }
        if(data.anonyPO&&data.anonyPO!=''){
          if(data.anonyPO.isTopic=="1"){
            dataBase.advancedSetting.switchControl.splice(this.findSetting('匿名发布'),1);
          }
          if(data.anonyPO.isComment=="1"){
            dataBase.advancedSetting.switchControl.splice(this.findSetting('允许匿名评论'),1);
          }
        }
        this.isShareObj=dataBase.advancedSetting.switchControl[this.findSetting('允许分享外部')];
      }else{
        let btnConfig = {
          primaryBtn: {name: "确定", callBack: this.goBack},
          defaultBtn: {name: "", callBack: null}
        }
        _.alert('提示','亲爱的用户，你没有权限发布话题，请联系管理员',btnConfig);
      }
    },
    ()=>{
      let btnConfig = {
          primaryBtn: {name: "确定", callBack: this.goBack},
          defaultBtn: {name: "", callBack: null}
        }
      _.alert('提示','亲爱的用户，你没有权限发布话题，请联系管理员',btnConfig);
    });
    this.dataBase.buttonConfig.primaryList[0].callBack=this.commintTopic;
    if(this.dataBase.buttonConfig.defaultList){
      this.dataBase.buttonConfig.defaultList[0].callBack=this.draft;
    }
    //根据路由参数请求数据
    let url='';
    let isDraft=this.$route.query.isDraft||false
    if(this.$route.query.id||_.getUrlParam('id')){
      let id=this.$route.query.id||_.getUrlParam('id');
      if(isDraft||this.$route.query.status==0||_.getUrlParam('status')==0){
       this.isEdit=true;
       url='/topic/topicAction!getTaskInfo.action?id='+id;
       this.commintData.tbXyhTopicPO.topicId=id;
       if(!isDraft){
         delete this.dataBase.buttonConfig.defaultList;
       }
      }else{//复制
        url='/topic/topicAction!getTaskInfo.action?id='+id+'&isCopy=1';
        checkDeptIsSpecific((data)=>{
          if(data.deptIsSpecific=='1'){
            this.rangeConfig={
              '1': '所有人',
              '3': '特定对象'
            }
          }
        });
      }
      getTargetInfo(url,(data)=>{
        let self=this;
        self.fileUpload.mediaList=data.mediaList;
        self.commintData.imageUrls=data.imagesList;
        self.commintData.mediaIds=data.mediaList;
        self.titleConfig.title=data.tbXyhTopicPO.title;
        self.titleConfig.templateTypeId=data.tbXyhTopicPO.topicType;
        this.selectCallback({id:data.tbXyhTopicPO.topicType},true);
        self.isPC=data.tbXyhTopicPO.isUeditor==1?true:false;
        self.imgLimit=self.isPC?1:null;
        self.titleConfig.content=data.tbXyhTopicPO.content;
        if(data.tbXyhTopicPO.coverImage!=''){
          self.imgUploadPicList.push({src:data.tbXyhTopicPO.coverImage});
        }
        if(!data.tbXyhTopicPO.isUeditor){
          data.imagesList.forEach(function (item, index){
            self.imgUploadPicList.push({src:item.path});
          })
        }
        self.$store.commit('updateRang',data.tbXyhTopicPO.targetRange);
        if(data.tbXyhTopicPO.targetRange=='3'){
          self.dataBase.selectConfig.selectList["ccPersonList"].userSelected=data.userList?data.userList:[];
          if(data.deptList&&data.deptList.length>0){
            data.deptList.forEach(function(e){
              e.id=e.deptId;
            })
          }
          self.dataBase.selectConfig.selectList["ccPersonList"].deptSelected=data.deptList?data.deptList:[];
          if(data.tagList&&data.tagList.length>0){
            data.tagList.forEach(function(e){
              e.id=e.tagId;
            })
          }
          self.dataBase.selectConfig.selectList["ccPersonList"].tagSelected=data.tagList?data.tagList:[];
          this.confirmSelectPerson();
        }
        let anonyIndex=self.findSetting('匿名发布');
        if(anonyIndex!=-1){
          self.dataBase.advancedSetting.switchControl[anonyIndex].onOff=data.tbXyhTopicPO.isAnony=='1'?true:false;
        }
        let anonycomIndex=self.findSetting('允许匿名评论');
        if(anonycomIndex!=-1){
          self.dataBase.advancedSetting.switchControl[anonycomIndex].onOff=data.tbXyhTopicPO.anonyComment=='1'?true:false;
        }
        let shareIndex=self.findSetting('允许分享外部');
        self.dataBase.advancedSetting.switchControl[shareIndex].onOff=data.tbXyhTopicPO.isShare=='1'?true:false;
        if(data.tbXyhTopicPO.isShare=='0'&&self.dataBase.advancedSetting.switchControl[shareIndex+1].content=='外部分享显示评论'){
          self.dataBase.advancedSetting.switchControl.splice(shareIndex+1,1);
        }else if(data.tbXyhTopicPO.isShare=='1'){
          if(self.dataBase.advancedSetting.switchControl[shareIndex+1].content!='外部分享显示评论'){
            self.dataBase.advancedSetting.switchControl.splice(shareIndex+1,0,{content: '外部分享显示评论', onOff: false});
          }
          let shareComIndex=self.findSetting('外部分享显示评论');
          self.dataBase.advancedSetting.switchControl[shareComIndex].onOff=data.tbXyhTopicPO.shareComment=='1'?true:false;
        }
        let commontIndex=self.findSetting('开启评论');
        self.dataBase.advancedSetting.switchControl[commontIndex].onOff=data.tbXyhTopicPO.isComment=='1'?false:true;
        let sendIndex=self.findSetting('发布时发送通知消息');
        self.dataBase.advancedSetting.switchControl[sendIndex].onOff=data.tbXyhTopicPO.isSendMsg==1?true:false;
      })
    }else{
      this.isPC=this.checkPC();
      this.imgLimit=this.isPC?1:null;
      checkDeptIsSpecific((data)=>{
        if(data.deptIsSpecific=='1'){
          this.rangeConfig={
            '1': '所有人',
            '3': '特定对象'
          }
        this.$store.commit('updateRang',3);
        }
      });
      this.sendMsgConfig();
    }
  },
  methods:{
    //上传图片回调
    showMsgFromImgDetail(imgurl){
      this.commintData.imageUrls='';
      this.commintData.imageUrls=imgurl.join(',');
    },
    //上传附件回调
    showMsgFromFileDetail(mediaId){
      this.commintData.mediaIds=mediaId.join(',');
    },
    //选择范围回调
    confirmSelectPerson(type){
      let deptId = ''
      let personId = ''
      let tagId = ''
      this.dataBase.selectConfig.selectList["ccPersonList"].deptSelected.forEach(function (item, index) {
        deptId+=item.id?item.id+'|':item.deptId+'|';
      })
      this.dataBase.selectConfig.selectList["ccPersonList"].userSelected.forEach(function (item, index) {
        personId += item.userId+'|'
      })
      this.dataBase.selectConfig.selectList["ccPersonList"].tagSelected.forEach(function (item, index) {
        tagId+=item.id?item.id+'|':item.tagId+'|'
      })
      this.commintData.userIds=personId;
      this.commintData.deptIds=deptId;
      this.commintData.tagIds=tagId;
    },
    //提交
    commintTopic(){
      this.checkTopic(0);
    },
    //草稿
    draft(){
      this.checkTopic(1);
    },
    //检查话题并赋值到commintData
    checkTopic(status){//status:1-草稿  0-提交
      this.commintData.tbXyhTopicPO.status=status;
      this.commintData.range=this.rang;
      this.commintData.tbXyhTopicPO.topicType=this.titleConfig.templateTypeId;
      this.commintData.tbXyhTopicPO.title=this.titleConfig.title;
      //获取富文本内容，赋值到titleConfig中的summaryContent
      if(this.isPC){
        this.commintData.tbXyhTopicPO.isUeditor=1;
        this.commintData.tbXyhTopicPO.content=this.$refs.topicTitle.getUEContent();
      }else{
        this.commintData.tbXyhTopicPO.isUeditor=0;
        this.commintData.tbXyhTopicPO.content=this.titleConfig.content;
      }
      let anonyIndex=this.findSetting('匿名发布');
      let anonycomIndex=this.findSetting('允许匿名评论');
      let shareIndex=this.findSetting('允许分享外部');
      let shareComIndex=this.findSetting('外部分享显示评论');
      let commontIndex=this.findSetting('开启评论');
      let sendIndex=this.findSetting('发布时发送通知消息');

      if(anonyIndex!=-1&&this.dataBase.advancedSetting.switchControl[anonyIndex].onOff){//如果匿名设置项存在并且选中
        this.commintData.tbXyhTopicPO.isAnony=1;
      }else{
        this.commintData.tbXyhTopicPO.isAnony=0;
      }
      if(shareComIndex!=-1&&this.dataBase.advancedSetting.switchControl[shareComIndex].onOff){//如果外部分享显示评论设置项存在并且选中
        this.commintData.tbXyhTopicPO.shareComment=1;
      }else{
        this.commintData.tbXyhTopicPO.shareComment=0;
      }
      if(anonycomIndex!=-1){
        if(this.dataBase.advancedSetting.switchControl[anonycomIndex].onOff){
          this.commintData.tbXyhTopicPO.anonyComment=1;
        }else{
          this.commintData.tbXyhTopicPO.anonyComment=0;
        }
      }
      if(this.dataBase.advancedSetting.switchControl[shareIndex].onOff){
        this.commintData.tbXyhTopicPO.isShare=1;
      }else{
        this.commintData.tbXyhTopicPO.isShare=0;
      }
      if(this.dataBase.advancedSetting.switchControl[commontIndex].onOff){
        this.commintData.tbXyhTopicPO.isComment=0;
      }else{
        this.commintData.tbXyhTopicPO.isComment=1;
      }
      if(this.dataBase.advancedSetting.switchControl[sendIndex].onOff){
        this.commintData.tbXyhTopicPO.isSendMsg=1;
      }else{
        this.commintData.tbXyhTopicPO.isSendMsg=0;
      }
      if(this.dataBase.advancedSetting.switchControl[shareIndex].onOff&&!checkOpenShare()){
        return ;
      }
      if(this.handleRange == '特定对象'&&!this.commintData.userIds && !this.commintData.deptIds && !this.commintData.tagIds) {
         _.alert('提示', '特定对象为空');
         return ;
      }else{
        this.titleConfig.title=_.trimLR(this.titleConfig.title);
        if(this.titleConfig.templateTypeId==''){
          _.alert('提示', '请选择话题类型');
          return ;
        }
        if(this.titleConfig.title==''){
          _.alert('提示', '标题不能为空');
          return ;
        }
        if(this.commintData.tbXyhTopicPO.content==''){
          _.alert('提示', '话题内容不能为空');
          return ;
        }
        let imgUrlStr='';
        for(let i=0;i<this.imgUploadPicList.length;i++){
          imgUrlStr+=this.imgUploadPicList[i].src+',';
        }
        imgUrlStr=imgUrlStr.substr(0,imgUrlStr.length-1);
        this.commintData.imageUrls=imgUrlStr;
        if(status=='0'){
          hasSameTitleTopic(this.titleConfig.title,()=>{//是否有相同标题的话题
            this.commintData.hasSameTopic='1';
            let btnConfig = {
              primaryBtn: {name: "确定", callBack: this.saveTopic},
              defaultBtn: {name: "取消", callBack: null},
            }
            if(!this.isEdit){
              _.alert('提示','你刚刚已发布了标题为'+this.titleConfig.title+'，是否继续发布',btnConfig);
            }else{
              this.saveTopic();
            }
          },()=>{
            this.commintData.hasSameTopic='0';
            this.saveTopic();
          })
        }else{
          this.commintData.hasSameTopic='0';
          this.saveTopic();
        }
      }
    },
    //发布话题或草稿
    saveTopic(){
      let url='';
      let isDraft=this.$route.query.isDraft||false;
      //url=!isDraft||!this.isEdit?'/topic/topicAction!ajaxAdd.action':'/topic/topicAction!ajaxUpdate.action';
      url=isDraft||this.isEdit?'/topic/topicAction!ajaxUpdate.action':'/topic/topicAction!ajaxAdd.action';
      addOrUpdateTopic(url,this.commintData,()=>{
        if(sessionStorage.getItem('storageData')){
          sessionStorage.removeItem('storageData');
        }
        this.$router.push('/topicList');
      });
    },
    //存储标签信息
    tagSelect(tag){
      this.tag=tag;
    },
    //搜索高级设置中的设置项索引
    findSetting(content){
      let index=-1;
      for(let i=0;i<this.dataBase.advancedSetting.switchControl.length;i++){
        if(this.dataBase.advancedSetting.switchControl[i].content==content){
          index=i;
          break;
        }
      }
      return index;
    },
    //是否是pc
    checkPC(){
      var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
          if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
          }
        }
      return flag;
    },
    //更新图片
    setImgUploadValue(val){
			this.imgUploadPicList = val;
    },
    handleDeleteImage(item){
      this.deleteImage = item;
    },
    limitUpdate(){
      _.alert('提示', '只能上传1张封面图');
    },
    //返回上一页
    goBack(){
      this.$router.go(-1);
    },
    //后台是否开启推送消息
    sendMsgConfig(){
      getOrgTopicConﬁg((data)=>{
        let sendInofIndex=this.dataBase.advancedSetting.switchControl.length-1;
        this.dataBase.advancedSetting.switchControl[sendInofIndex].onOff=
          data.orgTopicConfig&&data.orgTopicConfig.configValue==='0'?false:true;
      })
    },
    //选择类型回调
    selectCallback(data,isNotInit){
      getTopicTypeVisibleTarget(data.id,(data)=>{
        if(!isNotInit){
          this.$store.commit('updateRang','1');
          this.dataBase.selectConfig.selectList["ccPersonList"].deptSelected=[];
          this.dataBase.selectConfig.selectList["ccPersonList"].userSelected=[];
          this.dataBase.selectConfig.selectList["ccPersonList"].tagSelected=[];
        }
        if(data.topicTypeVisibleRange==='3'){
            this.dataBase.deptData.intersectionDeptIds = this.buildIdStr(data.visibleDeptList,'deptId');
            this.dataBase.userData.intersectionDeptIds = this.buildIdStr(data.visibleDeptList,'deptId');
            this.dataBase.keyWordData.intersectionDeptIds = this.buildIdStr(data.visibleDeptList,'deptId');
            this.dataBase.childData.intersectionDeptIds = this.buildIdStr(data.visibleDeptList,'deptId');

            this.dataBase.deptData.intersectionTagIds = this.buildIdStr(data.visibleTagList,'tagId');
            this.dataBase.userData.intersectionTagIds = this.buildIdStr(data.visibleTagList,'tagId');
            this.dataBase.tagData.intersectionTagIds = this.buildIdStr(data.visibleTagList,'tagId');
            this.dataBase.childData.intersectionTagIds = this.buildIdStr(data.visibleTagList,'tagId');
            this.dataBase.keyWordData.intersectionTagIds = this.buildIdStr(data.visibleTagList,'tagId');
            
            this.dataBase.userData.intersectionUserIds = this.buildIdStr(data.visibleUserList,'userId');
            this.dataBase.keyWordData.intersectionUserIds = this.buildIdStr(data.visibleUserList,'userId');
            this.dataBase.childData.intersectionUserIds = this.buildIdStr(data.visibleUserList,'userId');

        }else{
          this.dataBase.deptData={};
          this.dataBase.userData={};
          this.dataBase.keyWordData={};
        }
      })
    },
    buildIdStr(listArr,itemName){
      let idStr = '';
      if(listArr.length){
        listArr.forEach(function(item,index){
          idStr = idStr + item[itemName] + '|';
        });
        idStr = idStr.substr(0, idStr.length - 1);
      }else{
        idStr = '-1';
      }
      return idStr;
    },
  },
  components:{
    data_detail,
    //img_detail,
    file_detail,
    select_person,
    advanced_setting,
    flow_button,
    addImg,
    AddImgList
  }
}
</script>
<style lang="scss" scoped>
  .mainContent{
    margin-bottom: 10px;
    .topicContent{
      margin-top: -15px;
    }
  }
  .qwui-detaildata{
      padding-left:15px;
      background-color:#fff;
  }
  .qwui-detaildata
  .qwui-inner_f_item:first-child:after{
      border:none;
  }
  .qwui-item_title {
    margin-right: 10px;
    color: #333;
    font-size:16px;
  }
  .qwui-inner_f_item {
    position: relative;
    line-height: 22px;
    min-height: 19px;
    padding: 12px 15px 12px 0;
    color: #333;
    font-size: 14px;
    background: #fff;
  }
  .qwui-inner_f_item:after{
    content: '';
    position: absolute;
    left:0;
    top: 0;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
  }
  .qwui-inner_item {
    font-size: 16px;
    flex: 1;
    color: #666;
    text-align: right;
    padding-right: 15px;
  }
  .qwui-click_iconRight {
    display: block;
    position: absolute;
    top: 0;
    right: 15px;
    bottom: 0;
    margin: auto;
    width: 9px;
    height: 15px;
    background:0 0 url("~assets/images/CSSSprites.png") no-repeat;
    background-size: 100px 100px;
  }
  .uploadimg{
    padding:10px 5px 0px 15px;
    clear: both;
    background-color: #fff;
  }
  .uploadFile{
    padding:2px 15px;
    clear: both;
    background-color: #fff;
  }
  .fl{
    float:left;
    height:58px;
  }
</style>


<template>
  <div>
    <qwui-go-back :goBackConfig="goBackConfig"></qwui-go-back>
    <qw-title :titleContent="goBackConfig.currPath"></qw-title>
    <div class="form_content">
      <div class="qwui-input_item">
        <span class="itemTitle"><span class="star">*</span>知识百科类别：</span>
        <qwui-button @click="showTypePop">选择类别</qwui-button>
        <p class="warning_tip" v-if="showTypeTip">类别不能为空</p>
        <div class="title_content">
          <span class="select_type_title" v-for="(item,key) in selectedType" :key="key">{{ item.name }}
            <i class="delete_type" @click="deleteType(key)"></i></span>
        </div>
        <!--选择类别组件-->
        <product-type-pop :typePopShow="typePopShow"
                          :selectedType="selectedType"
                          @listenClose="showTypePop"
                          @listenBtnFunc="updateType"></product-type-pop>
      </div>
      <div class="qwui-input_item">
        <span class="itemTitle"><span class="star">*</span>知识百科名称：</span>
        <qwui-input class="qwui-input_style"
                    v-model="productName"
                    :isWarning="isWarning"
                    warningTips="知识百科名称不能为空"
                    @input="changeInput"></qwui-input>
      </div>
      <div class="qwui-input_item">
        <span class="itemTitle">封面图片(可选)：</span>
        <qw-upload-img class="upload_image" :uploadConfig="logoUploadConfig" @imageObj="coverLogoImg">
          <div class="c999 mt5" slot="upload_tip_text">建议尺寸940px*400px;支持jpg\jpeg\png;文件大小不能超过2M</div>
        </qw-upload-img>
        <div class="check_box">
          <qwui-checkbox v-model="isShowCoverIntext">显示在正文中</qwui-checkbox>
        </div>
      </div>
      <div class="qwui-input_item">
        <span class="itemTitle">摘要：</span>
        <qwui-input class="qwui-input_style"
                    inputType="textarea"
                    v-model="productSummary"
                    :maxLength="70"
                    :inputTips="'不填写则默认抓取正文内容'"></qwui-input>
      </div>
      <div class="qwui-input_item">
        <span class="itemTitle"><span class="star">*</span>正文内容：</span>
        <editor class="editor_style"
                :config="editorOption"
                :agentCode="agentCode"
                ref="editor"
                @blur="textBlur"></editor>
        <div class="c999 content_tip">请在正文编辑您的知识百科详情</div>
        <p class="warning_tip" v-if="showContentTip">正文内容不能为空</p>
      </div>
      <div class="qwui-input_item">
        <span class="itemTitle">附件：</span>
        <qw-upload-wrap class="upload_image"
                        :fileList="fileList"
                        :limit="100"
                        :beforeUpload="beforeUploadFile"
                        :onSuccess="handleSuccessFile"
                        :onRemove="handleRemoveFile">
          <qwui-button>上传</qwui-button>
          <!--<div class="c999 mt5 mb5" slot="tip">仅支持 .txt .xml .pdf .doc .docx .ppt .pptx .xls .xlsx .wma .amr .mp3 .mp4 .rar .zip</div>
       --> </qw-upload-wrap>
      </div>
      <qw-cover-img-preview class="img_preview"
                            :title="productName || '知识百科名称'"
                            :img="previewImg"
                            :text="productSummary || '摘要'"></qw-cover-img-preview>
    </div>
    <div class="form_content">
      <div class="qwui-input_item">
        <span class="itemTitle" style="color:red;font-weight: 600;"><span class="star">*</span>目标对象：</span>
        <div class="iblock">
          <pick-exam
            :useDepts="targetDeptIds"
            :useUsers="targetUserIds"
            :useTab="targetUseTab"
            :useTags="targetUseTags"
            :useRadio="range"
            @changeRadio="changeRange"
            @chooseDone="chooseTarget"
          ></pick-exam>
        </div>
        <p class="warning_tip" v-if="showTargetTip">目标对象不能为空</p>
        <p class="warning_tip" v-if="showPickTip">特定对象不能为空</p>
      </div>
      <div class="qwui-input_item">
        <span class="itemTitle">负责人：</span>
        <div class="iblock">
          <pick-exam :isShowRadios="false"
                     :useUsers="givenUserIds"
                     :useTab="givenUseTab"
                     @chooseDone="chooseGiven"></pick-exam>
        </div>
      </div>
      <div class="qwui-input_item">
        <span class="itemTitle">来源：</span>
        <qwui-input v-model="source" :maxLength="255"></qwui-input>
      </div>
      <div class="qwui-input_item">
        <span class="itemTitle">演示链接：</span>
        <qwui-input v-model="productUrl"
                    :isWarning="hrefWarning"
                    warningTips="演示链接必须以http或https开头"
                    @input="changeUrl"
                    :maxLength="255"></qwui-input>
      </div>
      <div class="qwui-input_item">
        <span class="itemTitle">排序号：</span>
        <qwui-input inputType="sort"
                    v-model="sortNum"
                    warningTips="排序号只能为0或正整数"
                    :isWarning="sortWarning"
                    @input="changeSort"></qwui-input>
      </div>
      <div class="switch_content">
        <div class="switch_item" v-for="(item,key) in switchObj" :key="key" v-if="!item.isHide">
          <p>{{ item.text }}</p>
          <qwui-switch :defaultStatus="item.onOff" @change="updateBtn(key,arguments[0])"></qwui-switch>
        </div>
      </div>
    </div>
    <!--新建、复制、草稿：预览、保存草稿、发布
        编辑：预览、保存（保存并通知）-->
    <div class="qwui-save_btn">
      <qwui-button v-perm="'productPreview'" @click="doPreview">预览</qwui-button>
      <qwui-button v-if="!isEditPage" v-perm="'productAdd'" @click="doSaveDraft">保存草稿</qwui-button>
      <qwui-button v-perm="'productPublish'" type='primary' @click="doPublish">{{ publishText }}</qwui-button>
    </div>
  </div>
</template>

<script>
  import qwuiGoBack from '@/components/base/qwuiGoBack';
  import qwTitle from '@/components/base/QwTitle';
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
  import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox';
  import qwuiSwitch from '@/components/qwuiBase/qwuiSwitch/qwuiSwitch';
  import qwUploadImg from '@/components/Add/uploadImg/QwUploadImg';
  import pickExam from '@/components/pickPerson/pickExam';
  import Editor from '@/components/base/editor';
  import qwCoverImgPreview from '@/components/Add/QwCoverImgPreview';
  import QwUploadWrap from '@/components/Add/Upload/QwUploadWrap';
  import productTypePop from './productTypePop';
  import { isVipGold,isVipSilver } from '@/assets/js/vip-manager';

  import {
    addProduct,
    saveProductDraft,
    viewProductDetail,
    updateProduct
  } from '../../api/product/getData';

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
  };

  export default {
    data(){
      return {
        goBackConfig:{
          hasLine:false,
          lastPath:'首页',
          currPath:'新增知识百科'
        },
        status:'',
        isEditPage:false,// 是否编辑页
        typePopShow:false,// 类别弹窗显示
        selectedType:[], // 已选类别列表
        showTypeTip:false,// 类别未选提示
        productName:'', // 知识百科名称
        isWarning:false, // 知识百科名称未选提示
        // 封面图片
        logoUploadConfig:{
          uploadFileId:dataBase.agentCode+'CoverImg',
          imageObj:{
            imageURL:'',
            fileName:'',
          },
          showType:'small',
          agent:dataBase.agentCode,
          isMoreImg:false,
        },
        logoImageObj:{},
        isShowCoverIntext:false, // 显示在正文中
        productSummary:'',// 摘要
        editorOption: EDITOR_OPTION,// 百度编辑器配置
        content:'',
        showContentTip:false,
        agentCode:dataBase.agentCode,
        fileList:[],
        previewImg:require('assets/images/icon_default_cover_img.png'),
        // 目标对象
        targetDeptIds:[],
        targetUserIds:[],
        targetUseTags:[],
        targetUseTab:[
          {text:'部门'},
          {text:'标签'},
          {text:'标签人员'},
          {text:'特定人员'},
          // {text:'批量导入'},
          {text:'高级筛选'},
        ],
        range:'', // 所有人
        showPickTip:false,
        showTargetTip:false,
        // 负责人
        givenUserIds:[],
        givenUseTab:[
          {text:'标签人员'},
          {text:'特定人员'},
          // {text:'批量导入'},
          {text:'高级筛选'},
        ],
        source:'',
        productUrl:'',
        hrefWarning:false,
        sortNum:0,
        sortWarning:false,
        switchObj:{
          isComment:{
            text:'开启问答',
            onOff:false
          },
          isSendMsg:{
            text:'发布时发送通知消息',
            onOff:true
          },
          isWatermark:{
            text:'显示水印',
            onOff:true
          },
          isOpen:{
            text:'开启外部分享',
            onOff:false
          },
          shareComment:{
            text:'外部分享显示评论',
            onOff:false,
            isHide:true
          }
        }
      }
    },
    created(){
      window.localStorage.removeItem('previewData');
      if (this.$route.query.id){
        if (this.$route.query.status == '1'){
          this.goBackConfig.currPath = '编辑知识百科';
        }
        viewProductDetail({
          id:this.$route.query.id
        },(data)=>this.renderProductData(data))
      }
    },
    computed:{
      publishText(){
        return this.isEditPage ? (this.switchObj.isSendMsg.onOff ? '保存并通知' : '保存') : '发布';
      }
    },
    watch:{
      'switchObj.isOpen.onOff':function () {
        this.switchObj.shareComment.isHide = !this.switchObj.isOpen.onOff;
      }
    },
    methods:{
      renderProductData(data){
        let po = data.tbXyhProductPO;
        this.status = po.status;
        this.isEditPage = po.status == '1' && this.$route.query.status == '1';
        this.selectedType = data.typeList;
        this.productName = po.title;
        po.content = po.content.replace(/http\:\/\/qy\.do1\.com\.cn\:6090\/fileweb/g,_.localport).replace(/@fileweb@/g,_.localport);
        this.content = po.content;
        this.$refs.editor.setUEContent(po.content);
        this.logoUploadConfig.imageObj.imageURL = po.coverImage;
        this.coverLogoImg(this.logoUploadConfig.imageObj);
        this.isShowCoverIntext = po.isShowCoverIntext == '1';
        this.productSummary = po.summary;
        if (data.mediaList && data.mediaList.length > 0){
          this.fileList = data.mediaList;
        }
        if (data.selectDeptVOList){
          this.targetDeptIds = [...data.selectDeptVOList]
        }
        if (data.selectUserVOList){
          this.targetUserIds = [...data.selectUserVOList]
        }
        if (data.selectLableVOList){
          this.targetUseTags = [...data.selectLableVOList]
          this.targetUseTags.map(item=>{
            item.id = item.tagId
          })
          console.log(this.targetUseTags)
        }
        this.range = po.ranges == '1' ? '所有人' : '特定对象';
        if (data.toUserList){
          this.givenUserIds = [...data.toUserList]
        }
        this.source = po.source;
        this.productUrl = po.productUrl;
        this.sortNum = po.sortNum;
        for (let key in this.switchObj){
          this.switchObj[key].onOff = po[key] == '1';
        }
      },
      changeInput(){
        this.isWarning = this.productName == '';
      },
      changeUrl(){
        this.hrefWarning = this.productUrl.substr(0,4) !== 'http' && this.productUrl !== '';
      },
      changeSort(){
        let re = /^([1-9]\d*|[0]{1,1})$/;
        this.sortWarning = !re.test(this.sortNum);
      },
      // 选择类别弹框显示
      showTypePop(){
        this.typePopShow = !this.typePopShow;
      },
      // 更新已选类别
      updateType(treeData){
        this.showTypeTip = false;
        this.selectedType = [];
        this.handleTreeData(treeData);
        this.showTypePop();
      },
      // 处理树形数据
      handleTreeData(data){
        data.forEach((item)=>{
          if (item.checked){
            this.selectedType.push(
              {
                id:item.key,
                name:item.name
              }
            )
          }
          if (item.children){
            this.handleTreeData(item.children);
          }
        });
      },
      // 删除已选类别
      deleteType(key){
        this.selectedType.splice(key,1)
      },
      coverLogoImg(obj){
        if (obj.imageURL){
          this.logoUploadConfig.imageObj = obj;
          this.previewImg = _.compressURL + obj.imageURL;
        }else {
          this.previewImg = require('assets/images/icon_default_cover_img.png');
        }
        this.logoImageObj = obj;
      },
      textBlur(val){
        this.content = val;
        this.showContentTip = this.content == '';
      },
      //上传附件前处理
      beforeUploadFile(file){
        let size = file.size;
        let fileName = file.name;
        let isExt = fileName.lastIndexOf(".");
        let fileExt = fileName.substr(isExt).toLowerCase();//获得文件后缀名
       /* if(!(".txt.xml.pdf.doc.ppt.xls.docx.pptx.xlsx.mp3.wma.amr.mp4.rar.zip".includes(fileExt))){
          dataBase.top_alert('只能上传txt,xml,pdf,doc,ppt,xls,docx,pptx,xlsx,mp3,wma,amr,mp4,rar,zip；如需上传其它格式文件请先将其压缩后再上传',false,3000);
          return false;
        }
        if (isVipGold(dataBase.agentCode)){
          if (size>50*1024000){
            dataBase.top_alert('文件大小不能超过50M',false,3000);
            return false;
          }
        }else if(isVipSilver(dataBase.agentCode)){
          if (size>20*1024000){
            dataBase.top_alert('文件大小不能超过20M',false,3000);
            return false;
          }
        } else {
          if(size>10*1024000){
            dataBase.top_alert('文件大小不能超过10M',false,3000);
            return false;
          }
        }*/

        if (size>1024*1024*500){
            dataBase.top_alert('超过最大限制，请使用第三方网络云盘。',false,3000);
            return false;
         }


        return true;
      },
      //处理上传附件删除
      handleRemoveFile(file,fileList){},
      //处理上传附件成功
      handleSuccessFile(file){},
      chooseTarget(dept,tag,user){
        this.showPickTip = false;
        this.targetUseTags = [...tag];
        this.targetDeptIds = [...dept];
        this.targetUserIds = [...user];
        console.log(this.targetUseTags)
      },
      changeRange(val){
        if (val == '所有人'){
          this.showPickTip = false;
          this.showTargetTip = false
        }
        if(val == '特定对象') {
            this.showTargetTip = false
        }
        this.range = val;
      },
      chooseGiven(dept,tag,user){
        this.givenUserIds = [...user];
      },
      updateBtn(key,val){
        this.switchObj[key].onOff = val;
      },
      // 预览
      doPreview(){
        let previewData = {
          title:this.productName,
          isShowCoverIntext:this.isShowCoverIntext ? 1 : 0,
          coverImage:this.logoImageObj.imageURL || '',
          content:this.content,
          productUrl:this.productUrl,
          typeName:this.handleListData(this.selectedType,'name').join(' '),
          fileList:this.fileList,
          isWatermarkinput:this.switchObj.isWatermark.onOff ? 1 : 0
        };
        window.localStorage.setItem('personName',wxqyhConfig.personName);
        window.localStorage.setItem('previewData',JSON.stringify(previewData));
        let top=(window.screen.height-560)/2;
        let left=(window.screen.width-350)/2;
        window.open(_.baseURL + '/manager/product/product_preview.jsp', 'newwindow', 'left='+left+',top='+top+',height=580, width=350, toolbar=no, menubar=no, resizable=yes,location=no, status=no,scrollbars=no,directories=no,menubar=no');
      },
      // 保存草稿
      doSaveDraft(){
        let self = this;
        if(!this.checkParams()){
          return;
        }
        saveProductDraft(this.updateParams(),()=>{
          _.alert('提交结果','保存成功',function () {
            self.$router.go(-1);
          })
        });
      },
      // 发布
      doPublish(){
        let self = this;
        if(!this.checkParams()){
          return;
        }
        if (this.$route.query.status == '1'){
          updateProduct(this.updateParams(),()=>{
            _.alert('提交结果','保存成功',function () {
              self.$router.go(-1);
            })
          })
        }else {
          addProduct(this.updateParams(),()=>{
            _.alert('提交结果','发布成功',function () {
              self.$router.go(-1);
            })
          })
        }

      },
      checkParams(){
        let passCheck = true;

        if (this.selectedType.length == 0){
          this.showTypeTip = true;
          passCheck = false;
        }

        if (this.productName === ''){
          this.isWarning = true;
          passCheck = false;
        }

        if (this.content === ''){
          this.showContentTip = true;
          passCheck = false;
        }

        if (this.productUrl.substr(0,4) !== 'http' && this.productUrl !== ''){
          this.hrefWarning = true;
          passCheck = false;
        }

        this.changeSort();
        if (this.sortWarning){
          passCheck = false;
        }

        if(!this.range){
            this.showTargetTip = true
            passCheck = false;
        }

        if (this.range == '特定对象' && this.targetDeptIds.length == 0 && this.targetUserIds.length == 0 && this.targetUseTags.length == 0){
          this.showPickTip = true;
          passCheck = false;
        }

        return passCheck;
      },
      handleListData(list,key1,key2){
        let arr = [];
        list.forEach((item)=>{
          arr.push(item[key1] || item[key2])
        });
        return arr;
      },
      updateParams(){
        window.localStorage.removeItem('previewData');

        let typeId = this.handleListData(this.selectedType,'id'),
          deptIds = this.handleListData(this.targetDeptIds,'nodeId','deptId'),
          userIds = this.handleListData(this.targetUserIds,'userId','id'),
          labelIds = this.handleListData(this.targetUseTags,'tagId','id'),
          givenUserIds = this.handleListData(this.givenUserIds, 'userId', 'id'),
          fileIds = this.handleListData(this.fileList, 'id');

        let params = {
          'tbXyhProductPO.title':this.productName,
          'tbXyhProductPO.coverImage':this.logoImageObj.imageURL || '',
          'tbXyhProductPO.isShowCoverIntext':this.isShowCoverIntext ? 1 : 0,
          'mediaIds':fileIds.join('|'),
          'tbXyhProductPO.typeId':typeId.join(','),
          'nodeIds':'',
          'tbXyhProductPO.newProduct':1,
          'tbXyhProductPO.source':this.source,
          'tbXyhProductPO.productUrl':this.productUrl,
          'webFileNames':'',
          'weixinFileInfos':'',
          'a1':'on',
          'deptIds':deptIds.join('|'),
          'userIds':userIds.join('|'),
          'labelIds':labelIds.join('|'),
          'range':this.range == '所有人' ? 1 : 3,
          'tbXyhProductPO.summary':this.productSummary,
          'givenUserIds':givenUserIds.join('|'),
          'tbXyhProductPO.content':this.content,
          'tbXyhProductPO.sortNum':this.sortNum,
          'publicMsgId':'',
          'editorValue':this.content,
          'tbXyhProductPO.status':this.status
        };
        for (let key in this.switchObj){
          params['tbXyhProductPO.' + key] = this.switchObj[key].onOff ? 1 : 0;
        }
        if (this.$route.query.id){
          params['tbXyhProductPO.productId'] = this.$route.query.id;

          // 复制
          if (this.$route.query.status == '2'){
            params['tbXyhProductPO.productId'] = '';
          }
        }
        return params;
      },
    },
    components:{
      qwuiGoBack,qwTitle,qwuiButton,qwuiInput,
      qwUploadImg,pickExam,Editor,qwCoverImgPreview,
      QwUploadWrap,qwuiCheckbox,qwuiSwitch,productTypePop
    }
  }
</script>

<style lang="scss" scoped>
  .form_content {
    position: relative;
    margin-top: 30px;

  }
  .qwui-input_item {
    margin-bottom: 30px;

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

    & /deep/ {
    .textarea_wrap .qw_textarea,.input_wrap .qw_sortInput{
      width: 340px;
    }
    }
  }

  .upload_image {
    display: inline-block;
  }

  }

  .check_box {
    margin-top: 10px;
    padding-left: 130px;
  }
  .editor_style {
    display: inline-block;
    width: 800px;
  }

  .content_tip {
    padding-left: 135px;
  }

  .switch_content {
    margin: 0 0 30px 70px;

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

  .warning_tip {
    padding-left: 135px;
    color: #F56262;
  }

  .qwui-save_btn {
    margin-bottom: 30px;
    padding-top: 20px;
    border-top: 1px solid #e4e4e4;
    text-align: center;
  }

  .title_content {
    margin: 15px 330px 0 134px;

    .select_type_title {
      position: relative;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      background-color: #fff8ee;
      border: 1px solid #f4d6aa;
      border-radius: 4px;
      padding-right: 35px;
      font-size: 14px;
      color: #d96b00;
      text-indent: 10px;
      margin-right: 5px;
      margin-bottom: 5px;
      overflow: hidden;

      .delete_type {
        background: url(~assets/images/ic_b-delet_hover.png) no-repeat 0 0;
        width: 16px;
        height: 16px;
        position: absolute;
        top: 7px;
        right: 8px;
      }
    }
  }
</style>

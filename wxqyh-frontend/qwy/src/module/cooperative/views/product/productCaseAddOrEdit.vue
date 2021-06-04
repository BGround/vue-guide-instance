<template>
  <div>
    <qwui-go-back :goBackConfig="goBackConfig"></qwui-go-back>
    <qw-title :titleContent="titleContent"></qw-title>
    <div class="form_content">
      <div class="qwui-input_item">
        <span class="itemTitle"><span class="star">*</span>案例名称：</span>
        <qwui-input class="qwui-input_style"
                    v-model="caseName"
                    :isWarning="isWarning"
                    warningTips="案例名称不能为空"
                    @input="changeInput"></qwui-input>
      </div>
      <div class="qwui-input_item">
        <span class="itemTitle">案例链接：</span>
        <qwui-input class="qwui-input_style"
                    v-model="caseHref"
                    :isWarning="hrefWarning"
                    warningTips="案例链接必须以http或https开头"
                    @input="changeHref"></qwui-input>
      </div>
      <div class="qwui-input_item">
        <span class="itemTitle"><span class="star">*</span>案例图片：</span>
        <qw-upload-img class="upload_image" :uploadConfig="logoUploadConfig" @imageObj="coverLogoImg">
          <div class="c999 mt5" slot="upload_tip_text">建议尺寸940px*400px;支持jpg\jpeg\png;文件大小不能超过2M</div>
        </qw-upload-img>
        <p class="image_tip" v-if="showImageTip">案例图片不能为空</p>
      </div>
      <div class="qwui-input_item">
        <span class="itemTitle">附件：</span>
        <qw-upload-wrap class="upload_image"
                        :fileList="fileList"
                        :limit="100"
                        :beforeUpload="beforeUploadFile"
                        :onSuccess="handleSuccessFile"
                        :onRemove="handleRemoveFile">
          <qwui-button class="mb5">上传</qwui-button>
        </qw-upload-wrap>
      </div>
      <qw-cover-img-preview class="img_preview"
                            :title="caseName || '案例名称'"
                            :img="previewImg"
                            :text="''"></qw-cover-img-preview>
    </div>
    <div class="qwui-save_btn">
      <qwui-button type='primary' @click="updateCase">保存</qwui-button>
    </div>
  </div>
</template>

<script>
  import qwuiGoBack from '@/components/base/qwuiGoBack';
  import qwTitle from '@/components/base/QwTitle';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
  import qwUploadImg from '@/components/Add/uploadImg/QwUploadImg';
  import qwUploadWrap from '@/components/Add/Upload/QwUploadWrap';
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwCoverImgPreview from '@/components/Add/QwCoverImgPreview';
  import { isVipGold,isVipSilver } from '@/assets/js/vip-manager';
  import { addProductCase,viewProductCase,updateProductCase } from '../../api/product/getData';


  export default {
    data(){
      return {
        goBackConfig:{
          hasLine:false,
          lastPath:'案例',
          currPath:'新增案例'
        },
        titleContent:'新增案例',
        caseName:'',
        caseHref:'',
        isWarning:false,
        hrefWarning:false,
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
        showImageTip:false,
        fileList:[],
        fileArr:[],
        fileIds:'',
        previewImg:require('assets/images/icon_default_cover_img.png'),
      }
    },
    created(){
      if (this.$route.query.caseId){
        this.goBackConfig.currPath = '编辑案例';
        this.titleContent = '编辑案例';
        this.getCaseData(this.$route.query.caseId)
      }
    },
    methods:{
      getCaseData(id){
        viewProductCase({
          id:id
        },(data)=>{
          let po = data.tbXyhProductCasePO;
          this.caseName = po.title;
          this.caseHref = po.caseUrl;
          if (po.caseImg){
            this.logoUploadConfig.imageObj.imageURL = po.caseImg;
            this.logoImageObj.imageURL = po.caseImg;
            this.previewImg = _.compressURL + po.caseImg;
          }
          if (data.mediaList && data.mediaList.length > 0){
            this.fileList = data.mediaList;
          }
        })
      },
      changeInput(){
        this.isWarning = this.caseName == '';
      },
      changeHref(){
        this.hrefWarning = this.caseHref.substr(0,4) !== 'http';
      },
      coverLogoImg(obj){
        if (obj.imageURL){
          this.showImageTip = false;
          this.logoUploadConfig.imageObj = obj;
          this.previewImg = _.compressURL + obj.imageURL;
        }else {
          this.previewImg = require('assets/images/icon_default_cover_img.png');
        }
        this.logoImageObj = obj;
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
        }
        return true;
      },
      //处理上传附件删除
      handleRemoveFile(file,fileList){},
      //处理上传附件成功
      handleSuccessFile(file){},
      updateCase(){
        if (!this.caseName){
          this.isWarning = true;
          return;
        }
        if (this.caseHref && this.caseHref.substr(0,4) != 'http'){
          this.hrefWarning = true;
          return;
        }
        if (!this.logoImageObj.imageURL){
          this.showImageTip = true;
          return;
        }
        let fileIds = [];
        this.fileList.forEach((item)=>{
          fileIds.push(item.id)
        });
        let self = this;
        let params = {
          'tbXyhProductCasePO.title': this.caseName,
          'tbXyhProductCasePO.caseUrl':this.caseHref,
          'tbXyhProductCasePO.caseImg':this.logoImageObj.imageURL,
          'imgFile':'',
          'mediaIds':fileIds.join('|'),
          'file':'',
          'id':this.$route.query.id,
          'publicMsgId':'',
          'tbXyhProductCasePO.caseId':this.$route.query.caseId
        };
        if (this.$route.query.caseId){
          updateProductCase(params,()=>{
            dataBase.top_alert('保存成功',true,3000);
            self.$router.go(-1);
          })
        }else {
          addProductCase(params,()=>{
            dataBase.top_alert('保存成功',true,3000);
            self.$router.go(-1);
          })
        }
      }
    },
    components:{
      qwuiGoBack,
      qwTitle,
      qwuiInput,
      qwUploadImg,
      qwUploadWrap,
      qwuiButton,
      qwCoverImgPreview
    }
  }
</script>

<style lang="scss" scoped>
  .form_content {
    position: relative;
    margin-top: 30px;

    .img_preview {
      top: 0;
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

    .upload_image {
      display: inline-block;
    }

  }

  .qwui-save_btn {
    margin-bottom: 30px;
    margin-top: 70px;
    padding-top: 20px;
    border-top: 1px solid #e4e4e4;
    text-align: center;
  }

  .image_tip {
    padding-left: 135px;
    color: #F56262;
  }

</style>

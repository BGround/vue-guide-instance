<template>
  <div>
    <!--返回按钮-->
    <qwui-go-back :goBackConfig="goBackConfig"></qwui-go-back>
    <div class="qwui-setting_title">数字标牌设备设置</div>
    <div class="qwui-upload_item">
      <div class="qwui-upload_box">
        <span class="qwui-upload_title">默认宣传图：</span>
        <image-upload class="uploadStyle" :uploadConfig="propUploadConfig" @imageObj="coverPropImg">
          <div class="c999 uploadDesc" slot="upload_tip_text">（宣传图在没有会议时显示，建议尺寸为1920px*1080px；支持 jpg\bmp\png）</div>
        </image-upload>
      </div>
      <div class="qwui-upload_box">
        <span class="qwui-upload_title">企业Logo：</span>
        <image-upload class="uploadStyle" :uploadConfig="logoUploadConfig" @imageObj="coverLogeImg" >
          <div class="c999 uploadDesc" slot="upload_tip_text">（显示在屏幕左上角，建议高度限制为70px，建议使用适合深色背景的Logo）</div>
        </image-upload>
      </div>
    </div>
    <div class="qwui-save_btn">
      <qwui-button type='primary' @click="updateMeetPic">保存</qwui-button>
    </div>
  </div>
</template>

<script>
  import qwuiGoBack from '@/components/base/qwuiGoBack';
  import imageUpload from './meetingImageUpload.vue';
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import { getMeetingSetting,updateMeetingSetting } from '../../api/meeting/getData';

  export default {
    data(){
      return {
        goBackConfig:{
          hasLine:false,
          lastPath:'设置',
          currPath:'数字标牌设备设置'
        },
        propUploadConfig:{
          uploadFileId:dataBase.agentCode+'CoverImg1',
          imageObj:{
            imageURL:'',
            fileName:'',
          },
          showType:'large',
          agent:dataBase.agentCode,
          isMoreImg:false,
        },
        propImageObj:{},
        logoUploadConfig:{
          uploadFileId:dataBase.agentCode+'CoverImg2',
          imageObj:{
            imageURL:'',
            fileName:'',
          },
          showType:'large',
          agent:dataBase.agentCode,
          isMoreImg:false,
        },
        logoImageObj:{}
      }
    },
    created(){
      dataBase.agentCode = 'meet';
      getMeetingSetting({type:1},(data)=>{
        this.propUploadConfig.imageObj.imageURL = data.nonePic || '';
        this.propImageObj.imageURL = data.nonePic || '';

        this.logoUploadConfig.imageObj.imageURL = data.logo || '';
        this.logoImageObj.imageURL = data.logo || '';
      })
    },
    methods:{
      coverPropImg(obj) {
        if (obj.imageURL){
          this.propUploadConfig.imageObj = obj;
        }
        this.propImageObj = obj;
      },
      coverLogeImg(obj) {
        if (obj.imageURL){
          this.logoUploadConfig.imageObj = obj;
        }
        this.logoImageObj = obj;
      },
      updateMeetPic(){
        let params = {
          nonePic:this.propImageObj.imageURL || '',
          logo:this.logoImageObj.imageURL || ''
        };
        updateMeetingSetting(params,()=>{
          _.alert('提示','保存成功',function () {
            this.$router.go(-1)
          });
        })
      }
    },
    components:{
      qwuiGoBack,
      imageUpload,
      qwuiButton
    }
  }

</script>

<style lang="scss" scoped>
  .qwui-setting_title {
    height: 47px;
    line-height: 47px;
    margin-top: 15px;
    padding-left: 20px;
    font-weight: 700;
    font-size: 16px;
    background-color: #F5F5F5;
    border-left: 4px solid #F87B00;
    color: #666666;
  }

  .qwui-upload_item {
    margin-top: 30px;

    .qwui-upload_box {
      margin-bottom: 10px;

      .qwui-upload_title {
        display: inline-block;
        width: 130px;
        vertical-align: sub;
        text-align: right;
      }
      .uploadStyle, .uploadDesc {
        display: inline-block;
      }
    }
  }
  .qwui-save_btn {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e4e4e4;
    text-align: center;
  }
</style>

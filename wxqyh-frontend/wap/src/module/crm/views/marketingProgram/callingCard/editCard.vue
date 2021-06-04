<template>
  <div class="wrap qwui-editcard_wrap">
    <div class="qwui-edit_content">
    <div class="card-content" :class="positionContent? 'qwui-tip_top': ''">
      <card :cardList='cardList' class="qwui-card_r"></card>
    </div>
    <div class="editor">
      <div class="qwui-avatar_item">
        <img class="qwui-avatar" :src="avatarURl" alt="">
        <img class="qwui-avatar_edit" src="~assets/images/crm/icon_avatar_edit.png" alt="">
        <input v-if="isMobile" @click.prevent="chooseImageFile($event)"  type="file" accept="image/jpeg,image/jpg,image/png,image/gif" class="cardInput"/>
        <input v-else @change="uploadImages" ref="avatarImg" type="file" accept="image/jpeg,image/jpg,image/png,image/gif" class="cardInput"/>
      </div>
      <div class="edit-item" :class="{'qwui-edit_disabled': editDisabled}">
        <div class="text">职位</div>
        <input type="text" class="editText" v-model="cardList.position" maxlength="20" ref="positionEdit" :placeholder="positionEditTip">
      </div>
      <div class="edit-item">
        <div class="text">手机号</div>
        <input type="tel" class="editText" v-model="cardList.cellPhone" maxlength="15" placeholder="请输入手机号">
      </div>
      <div class="edit-item">
        <div class="text">电话</div>
        <input type="tel" class="editText" v-model="cardList.phone" maxlength="15" placeholder="请输入电话">
      </div>
      <div class="edit-item">
        <div class="text">邮箱</div>
        <input type="email" class="editText" v-model="cardList.email" maxlength="50" placeholder="请输入邮箱">
      </div>
      <div class="edit-item">
        <div class="text">微信号</div>
        <input type="text" class="editText" v-model="cardList.wxNumber" placeholder="请输入微信号">
      </div>
      <div class="edit-item edit-item_address edit-item_company">
        <div class="text">公司地址</div>
        <input-textarea class="qwui-address_textarea"
                      v-model="cardList.companyLocation"
                      :autosize="{ minRows:1, maxRows:10 }"
                      :rows="1"
                      :maxLength="255"
                      placeholder="请输入公司地址">
        </input-textarea>
      </div>
      <div class="edit-item edit-item_address edit-item_personal">
        <div class="text">个人简介</div>
        <input-textarea class="qwui-address_textarea"
                      v-model="cardList.introduction"
                      :autosize="{ minRows:1, maxRows:10 }"
                      :rows="1"
                      :maxLength="140"
                      placeholder="请输入个人简介">
        </input-textarea>
        <span class="edit-item_tip">{{cardList.introduction.length}}/140</span>
      </div>
      <div class="edit-item edit-item_pic">
        <div class="text">名片相册 ({{cardList.albumsList.length}}/9)</div>
        <div class="qwui-img_content">
          <div class="qwui-img_list" 
               v-for="(item,index) in cardList.albumsList" 
               :key="index"
               :style="{'background-image':'url('+ item +')'}"
               @click="openPreivew(item,index)">
            <img class="qwui-img_del" src="~assets/images/crm/icon_personalimg_del.png" alt="" @click.stop="delImgList(index)">
          </div>
          <div class="qwui-img_add" v-show="cardList.albumsList.length < 9">
            <div class="qwui-cross">
              <div class="qwui-cross_line"></div>
            </div>
            <input v-if="isMobile" @click.prevent="choosePersonalImage($event)"  type="file" accept="image/jpeg,image/jpg,image/png,image/gif" class="cardInput"/>
            <input v-else @change="uploadPersonalImages" ref="personalImg" type="file" accept="image/jpeg,image/jpg,image/png,image/gif" class="cardInput" multiple/>
          </div>   
        </div>
      </div>
    </div>
    </div>
    <div class="new-btn">
      <div class="btn defult-btn" @click="back">取消</div>
      <div class="btn primary-btn" @click="submitCardData">保存</div>
    </div>
    <p class="qwui-position_tip" v-show="positionContent">未设置职位信息，联系管理员在通讯录设置</p>
    <cutImage 
            class="qwui-cut_size"
            ref="cropper"
            :show="option.showCutImageTool"
            :img="option.src"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixed="option.fixed"
            :fixedBox="option.fixedBox"
            :canMoveBox="option.canMoveBox"
            :canScale="option.canScale"
            :canMove="option.canMove"
            @cutImageFinish="cutImageFinish"
            @cutImageCancel="cutImageCancel">
    </cutImage>
    <div class="qwui-mask" v-show="cutMaskFlag"></div>
    <!--预览图片组件-->
    <preview-images></preview-images>
  </div>
</template>


<script type="text/ecmascript-6">
import {qw_uploadImages,wx_chooseImage,images_upload,previewImages} from '@/utils/uploadImages.js';
import card from './components/card.vue';
import {getCard,submitCard} from '../../../api/smallProgram/getBata.js';
import { setTimeout } from 'timers';
import cutImage from '@/components/cutImage/cutImage.vue';
import InputTextarea from './components/editTextarea';
import previewImage from '@/components/base/previewImages';
import EventBus from '@/utils/eventBus';

let cardData = {}//保存编辑card的数据
  export default {
    data() {
      return {
        cardList:{
          introduction: '',
          albumsList: []
        },
        agent:'crmmini',
        isMobile:false,//默认不是手机端
        avatarURl:'',
        option:{
          showCutImageTool: false,//是否显示
          src: '',//图片地址
          autoCropWidth: 200,//截图框默认宽度
          autoCropHeight: 200,//截图框默认高度
          fixed:true,//截图框固定比例
          autoCrop:true,//自动生成截图框
          fixedBox:false,//截图框大小固定
          canMoveBox: true,//截图框是否能移动
          canScale: false,//图片是否缩放
          canMove: false//图片是否能移动
        },
        editDisabled: false,//是否允许编辑职位
        positionContent:false,//是否有职位信息
        cutMaskFlag: false,//裁剪组件的遮罩,阻止提交时的操作
        personalImgList: [],//名片相册数组
        positionEditTip: '请输入职位'
      }
    },
    components: {
      card,
      cutImage,
      InputTextarea,
      'previewImages': previewImage
    },
    created () {
      this.getCardData()
      // 判断是否手机终端
      if(_.isHefeixin()|| _.isWeChatApp()||_.isQiyeweixinApp() || _.isMobileApp()){
        this.isMobile=true;
      }
    },
    methods: {
      //获取我的名片数据
      getCardData(){
        getCard((res) => {
          this.cardList = Object.assign({},this.cardList,res.card)
          this.avatarURl = _.filterCompressURL(this.cardList.avatarPicPath)

          //名片是否有职位信息,无则提示联系管理员设置
          if(!res.card.position && res.isEnableEditPosition){
            this.positionContent = true;
          }

          //如果后台设置没有权限编辑职位,则禁止编辑
          if(res.isEnableEditPosition){
            this.$refs.positionEdit.setAttribute("disabled",true);
            this.editDisabled = true;
            this.positionEditTip = '请联系管理员添加职位';
          }
        })
      },
      //PC上传图片
      uploadImages(event){
        let files = this.$refs.avatarImg.files;
        if(!files.length){
          return;
        }
        //打开裁剪框
        this.option.showCutImageTool = true;
        let reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
          this.option.src = reader.result;
        };
      },
      //微信端上传图片
      chooseImageFile(){
        wx_chooseImage(this.agent,(res) => {
          this.option.showCutImageTool = true;
          this.option.src = _.baseURL + "/portal/errcode/errcodeAction!loadImage.action?imgUrl=" + encodeURIComponent(_.filterCompressURL(res[0]));
        },1);
        // wx_chooseImage(this.agent,(res) => {
        //   this.avatarURl = _.filterCompressURL(res[0])
        //   this.$set(this.cardList,'avatarPicPath',res[0])
        // },1);
      },
      //上传名片相册
      uploadPersonalImages(event){
        let files = this.$refs.personalImg.files;
        if(this.cardList.albumsList.length + files.length > 9){
          _.alert("提示","相册数量不能超过9张");
          this.$refs.personalImg.value = '';
          return;
        }
        _.showLoading('加载中')
        for(let i = 0;i < files.length; i++){
          let reader = new FileReader();
          reader.readAsDataURL(files[i]);
          reader.onload = () => {
            images_upload(reader.result,this.agent,(res) => {
              this.cardList.albumsList.push(_.filterCompressURL(res.imgurl));
            });
          };
        }
        //解决选择同一张时不触发选中
        this.$refs.personalImg.value = '';
      },
      //删除名片相册
      delImgList(index){
        this.cardList.albumsList.splice(index,1);
      },
      //打开图片预览
      openPreivew(res,index){
        if(this.isMobile){
          let url = this.cardList.albumsList[index];
          previewImages(url,[url]);
          return;
        }
        EventBus.$emit('previewImages', res, [{ src: res }]);
      },
      // 微信端上传名片相册
      choosePersonalImage(){
        let picNumber = 9 - this.cardList.albumsList.length;
         wx_chooseImage(this.agent,(res) => {
          for(let i =0; i<res.length;i++){
            let url = _.compressURL + res[i];
            this.cardList.albumsList.push(url);
          }
        },picNumber);
      },
      //返回上一页
      back(){
        // this.$router.go(-1)
        this.$router.replace({path:'/callingCard'});
      },
      //验证邮箱格式、手机格式、电话
      checkType:function (string,type){
        if(type==1 && !/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(string)){
          return false;
        }
        if(type==2 && !/^[0-9][0-9-]*[^-]$/.test(string)){
          return false;
        }            
        if(type==3 && !/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z]{2,5}$/.test(string)){
          return false;
        }
        return true;
      },
      //提交编辑卡片数据
      submitCardData(){
        if(this.cardList.cellPhone && !this.checkType(this.cardList.cellPhone,1)){
          _.alert("提示","请输入正确的手机号码");
          return
        }
        if(this.cardList.phone && !this.checkType(this.cardList.phone,2)){
          _.alert("提示","请输入正确的电话号码");
          return
        }
        if(this.cardList.email && !this.checkType(this.cardList.email,3)){
          _.alert("提示","请输入正确的邮箱");
          return
        }
        if(this.isEmojiCharacter(this.cardList.introduction)){
          _.alert("提示","个人简介暂不支持表情");
          return
        }

        cardData = {
          'card.id':this.cardList.id,
          'card.position':this.cardList.position,
          'card.cellPhone':this.cardList.cellPhone,
          'card.phone':this.cardList.phone,
          'card.avatarPicPath':this.cardList.avatarPicPath,
          'card.companyLocation':this.cardList.companyLocation,
          'card.email':this.cardList.email,
          'card.wxNumber':this.cardList.wxNumber,
          'card.introduction':this.cardList.introduction,
          'albumsUrlList':this.cardList.albumsList + ''
        }
        submitCard(cardData,(res) => {
          setTimeout(() => {
            this.$router.replace({path:'/callingCard'})
          },1500)
        })
      },
      cutImageFinish(data){
        //按保存出现遮罩,保证不再有操作
        this.cutMaskFlag = true;
        if(!this.isMobile){
          this.$refs.avatarImg.value = '';
        }
        _.showLoading('加载中...')
        //base64图片地址转换
        images_upload(data,this.agent,(res) => {
          _.hideLoading();
          this.cutMaskFlag = false;
          this.option.showCutImageTool = false;
          this.avatarURl = _.filterCompressURL(res.imgurl)
          this.$set(this.cardList,'avatarPicPath',res.imgurl)
        });
      },
      cutImageCancel(){
        this.option.showCutImageTool = false;
        if(!this.isMobile){
          this.$refs.avatarImg.value = '';
        }
      },
      // 判断文本中是否有emoji表情
      isEmojiCharacter(substring) {
        let hs, ls, uc
        for (var i = 0; i < substring.length; i++) {
          hs = substring.charCodeAt(i)
          if (hs >= 0xd800 && hs <= 0xdbff) {
            if (substring.length > 1) {
              ls = substring.charCodeAt(i + 1)
              uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000
              if (uc >= 0x1d000 && uc <= 0x1f77f) {
                return true
              }
            }
          } else if (substring.length > 1) {
            ls = substring.charCodeAt(i + 1)
            if (ls === 0x20e3) {
              return true
            }
          } else {
            if (hs >= 0x2100 && hs <= 0x27ff) {
              return true
            } else if (hs >= 0x2B05 && hs <= 0x2b07) {
              return true
            } else if (hs >= 0x2934 && hs <= 0x2935) {
              return true
            } else if (hs >= 0x3297 && hs <= 0x3299) {
              return true
            } else if (hs === 0xa9 || hs === 0xae || hs === 0x303d || hs === 0x3030 ||
              hs === 0x2b55 || hs === 0x2b1c || hs === 0x2b1b ||
              hs === 0x2b50) {
              return true
            }
          }
        }
      }
    }
  }
</script>


<style lang="scss">
@import '../../../crmBase.scss';
.qwui-editcard_wrap {
  display: flex;
  height: 100%;
  flex-direction: column;
  background-color: #fff;
  .qwui-edit_content {
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden;
    box-sizing: border-box;
  }
}
.card-content{
  margin: 16px 15px 0;
  .qwui-card_r {
    border-radius: 4px;
    box-shadow: 0px 4px 16px 0px rgba(203,205,208,0.5);
  }
}
.qwui-editcard_wrap .editor{
  margin-top: 52px;
  .qwui-avatar_item {
    position: relative;
    width: 70px;
    margin: 0 auto;
    text-align: center;
    margin-bottom: 20px;
    .qwui-avatar {
      width: 60px;
      height: 60px;
      border-radius: 30px;
    }
    .qwui-avatar_edit {
      width: 23px;
      height: 23px;
      border: 4px solid #fff;
      border-radius: 50%;
      position: absolute;
      margin-top: 34px;
      margin-left: -17px;
    }
  }
  .edit-item{
    position: relative;
    display: flex;
    align-items: center;
    height: 50px;
    line-height: 50px;
    margin: 0 15px;
    color: #7A7C80;
    font-size: 15px;
    font-weight:400;
    &::before{
      content: " ";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      border-bottom: 1px solid #F7F8FA;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      z-index: 2;
    }
    .editDiv{
      position: relative;
      flex: 1;
      padding-top: 8px;
      text-align: right;
      .openFile{
        position: absolute;
        top: 50%;
        right: 0;
        width: 16px;
        height: 16px;
        margin-top: -8px;
        background: url('../../../../../assets/images/crm/icon_go.png') center no-repeat;
        background-size: 100%;
      }
      .avatar{
        width: 32px;
        height: 32px;
        margin-right: 16px;
        border-radius: 50%;
      }
      .edit-avatar{
        position: absolute;
        top: 0;
        right: 0;
        width: 50px;
        z-index: 1;
      }
    }
    .text{
      width: 65px;
    }
    .editText{
      flex: 1;
      height: 20px;
      margin-left: 11px;
      line-height: 20px;
      font-size: 15px;
      font-family: 'PingFangSC-Regular';
      text-align: left;
      color: #3F4A64;
    }
    .qwui-company_adress {
      resize: none;
      border: none;
      text-align: right;
    }
    .qwui-img_add {
      position: relative;
      margin-bottom: 15px;
      width: 45px;
      height: 45px;
      border-radius: 4px;
      border: 1px solid #D2D5DB;
      text-align: center;
      img {
        width: 18px;
        height: 18px;
      }
      .qwui-cross {
        width: 18px;
        height: 18px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        .qwui-cross_line {
          width: 1px;
          height: 100%;
          background-color: #D2D5DB;
          margin: 0 auto;
          &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 1px;
            background-color: #D2D5DB;
          }
        }
      }
    }
    .qwui-img_list {
      position: relative;
      width: 47px;
      height: 47px;
      margin-right: 15px;
      margin-bottom: 15px;
      line-height: normal;
      font-size: 0;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      border-radius: 4px;
      .qwui-img_show {
        width: 47px;
        height: 47px;
        border-radius: 4px;
      }
      .qwui-img_del {
        position: absolute;
        top: -9px;
        right: -9px;
        width: 20px;
        height: 20px;
      }
    }
  }
  .edit-item_address {
    height: auto;
    .text {
      align-self: flex-start;
    }
    .qwui-address_textarea {
      align-self: flex-start;
      width: 100%;
    }
    .qwui-address_textarea textarea{
      width: 100%;
      resize: none;
      border: none;
      font-size: 15px;
      color: #3F4A64;
      line-height: 22px;
      word-break: break-all;
      word-wrap: break-word;
    }
    .edit-item_tip {
      position: absolute;
      bottom: 8px;
      right: 0;
      font-size: 12px;
      color: #B2B9C8;
      line-height: 12px;
    }
  }
  .edit-item_pic {
    flex-direction: column;
    align-items: flex-start;
    padding-bottom: 12px;
    height: auto;
    .qwui-address_textarea textarea{
      width: 100%;
      resize: none;
      border: none;
    }
    .edit-item_tip {
      position: absolute;
      bottom: 13px;
      right: 0;
      font-size: 12px;
      color: #B2B9C8;
      line-height: 12px;
    }
    .qwui-img_content {
      display: flex;
      flex-wrap: wrap;
    }
    .text{
      width: auto;
    }
    &::before {
      border-bottom: none;
    }
  }
  .edit-item_personal {
    padding: 5px 0 28px;
    flex-direction: column;
    .text {
      line-height: 37px;
    }
  }
  .edit-item_company {
    .qwui-address_textarea {
      margin: 14px 0 12px 11px;
    }
  }
  .qwui-edit_disabled {
    color: #ccc;
    .editText {
      color: #ccc;
      background-color: #fff;
    }
  }
  .cardInput{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  input::placeholder {
    color: #DADDE4;
  }
  textarea::placeholder {
    color: #DADDE4;
  }
}
.qwui-editcard_wrap .new-btn{
  display: flex;
  .btn{
    flex: 1;
    height: 50px;
    line-height: 50px;
    text-align: center;
    &.defult-btn{
      height: 49px;
      border-top: 1px solid #f6f6fa;
      background: #fff;
      color: #7A7D80;
      font-size: 16px;
      font-weight:400;
    }
    &.primary-btn{
      background: #5585F0;
      color: #fff;
      font-size: 16px;
      font-weight:400;
    }
  }
}
.qwui-editcard_wrap .qwui-cut_size {
  z-index: 10;
}
.qwui-editcard_wrap .qwui-position_tip {
  color: red;
  text-align: center;
  background-color: rgba(204, 204, 204,0.4);
  position: absolute;
  top: 0;
  width: 100%;
  padding: 5px 0;
}

.qwui-editcard_wrap .qwui-tip_top {
  margin-top: 32px;
}
.qwui-editcard_wrap .qwui-mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 11;
}
</style>

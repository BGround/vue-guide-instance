<template>
  <div class="qwui-add_wrap">
    <div class="qwui-nav_wrap">
      <qwuiButton @click="goBack">&nbsp;返回&nbsp;</qwuiButton>
    </div>
    <qwTitle :titleContent="pageTitle"></qwTitle>
    <div class="qwui-main_wrap">
      <qwForm :model="ruleForm" :rules="rules" label-width="140" width="440" ref="ruleForm">
        <qwFormItem prop="title" label="标题">
          <qwuiInput v-model="ruleForm.title" @input="titleInput"></qwuiInput>
          <span class="qwui-timing_tip">{{timingTip}}</span>
        </qwFormItem>
        <qwFormItem label="类型" class="is-required">
          <qwui-select @selectItem="selectItemType" :dataList="typeData" :selectVal="selectValType"></qwui-select>
          <div v-show="isShowType" class="qwui-form_item_error">类型不能为空</div>
        </qwFormItem>
        <qwFormItem label="消息类型">
          <qwui-select @selectItem="selectItemMsgType" :dataList="msgTypeData" :selectVal="selectValMsgType"></qwui-select>
        </qwFormItem>

        <qwFormItem prop="stopTime" label="截止时间" class="is-required">
            <VueDatepickerLocal
                      :validateEvent="true"
                       class="date-picker-width"
                       v-model="ruleForm.stopTime"
                       show-buttons
                       placeholder="选择时间"
                       format="YYYY-MM-DD HH:mm:ss"
                       :clearable="true"
                       @confirm="handleConfirmDate">
           </VueDatepickerLocal>
        </qwFormItem>




        <qwFormItem prop="address" label="第三方页面地址" v-show="msgTypeIndex==1">
          <qwuiInput v-model="ruleForm.address" @input="addressInput" :maxLength="500"></qwuiInput>
        </qwFormItem>
        <qwFormItem prop="hint" label="提示语" v-show="msgTypeIndex==1">
          <qwuiInput v-model="ruleForm.hint" :inputTips="'道一云|企微正在为您导航'" @input="hintInput" :maxLength="100"></qwuiInput>
        </qwFormItem>
        <qwFormItem v-show="msgTypeIndex==0">
          <qwFunctionBox text="保密消息">
            <qwuiSwitch slot="switch" :defaultStatus="secrecyMsgStatus" :inline="inline" @change="secrecyMsgStatusChange"></qwuiSwitch>
          </qwFunctionBox>
        </qwFormItem>
        <qwFormItem v-show="msgTypeIndex==0&&!secrecyMsgStatus">
          <qwFunctionBox text="开启外部分享">
            <qwuiSwitch slot="switch" :defaultStatus="openShareStatus" :inline="inline" @change="openShareStatusChange"></qwuiSwitch>
          </qwFunctionBox>
        </qwFormItem>
        <qwFormItem v-show="msgTypeIndex==0&&!secrecyMsgStatus&&openShareStatus">
          <qwFunctionBox text="外部分享显示评论">
            <qwuiSwitch slot="switch" :defaultStatus="showCommentStatus" :inline="inline" @change="showCommentStatusChange"></qwuiSwitch>
          </qwFunctionBox>
        </qwFormItem>

       <qwFormItem>
          <qwFunctionBox text="截至时间">
            <VueDatepickerLocal v-model="ruleForm.stopTime" @confirm="confirm" show-buttons placeholder="选择截至时间" format="YYYY-MM-DD HH:mm:ss"></VueDatepickerLocal>
            <div class="qwui-time_tip" v-show="timingError">请选择截至时间</div>
          </qwFunctionBox>
        </qwFormItem>

        <qwFormItem label="封面图片(可选)" v-show="!secrecyMsgStatus||msgTypeIndex==1">
          <qwUploadImg @imageObj="coverImg" :uploadConfig="uploadConfig">
            <div class="c999" slot="upload_tip_text">建议尺寸940px*400px;支持jpg\jpeg\png;文件大小不能超过2M</div>
          </qwUploadImg>
        </qwFormItem>
        <qwFormItem v-show="!secrecyMsgStatus||msgTypeIndex==1">
          <qwuiCheckbox v-model="showTextChecked" @change="showTextChange">将封面图片显示在正文中</qwuiCheckbox>
        </qwFormItem>
        <qwFormItem label="手机端上传的图片" v-show="phoneImgList.length!=0">
          <div class="qwui-img_wrap">
            <div
              class="qwui-img_item"
              v-for="(item,index) in phoneImgList"
              :key="index">
              <img :src="item.src" alt="" width="50" height="50">
              <span class="qwui-img_close" @click="delPhoneImg(index)"></span>
            </div>
          </div>
        </qwFormItem>
        <qwFormItem label="语音音频" v-show="msgTypeIndex==0">
          <QwUploadWrap
            :fileList="fileListMusic"
            :multiple="multipleMusic"
            :beforeUpload="beforeUploadMusic"
            :onExceed="handleExceedMusic"
            :onSuccess="handleSuccessMusic"
            :onRemove="handleRemoveMusic">
            <qwuiButton>上传</qwuiButton>
            <div class="c999" slot="tip">支持mp3，文件大小不超过10M</div>
          </QwUploadWrap>
        </qwFormItem>
        <qwFormItem label="摘要">
          <qwuiInput inputType="textarea" :maxLength="70" v-model="ruleForm.summary" @input="summaryInput"></qwuiInput>
        </qwFormItem>
        <qwFormItem prop="author" label="新闻作者">
          <qwuiInput v-model="ruleForm.author" :maxLength="10" inputTips="默认为新闻发布人"></qwuiInput>
        </qwFormItem>
        <div class="qwui-dotted_line" v-show="msgTypeIndex==0"></div>
        <qwFormItem v-show="msgTypeIndex==0">
          <qwFunctionBox text="发放红包" :showTips="showTipsGrantRed">
            <div class="qwui-red_tip fz12" slot="tipContent">
              <p>
                1：只有设置了支付账户才能发放红包
              </p>
              <p>
                2：发布后不可编辑红包信息
              </p>
            </div>
            <qwuiSwitch slot="switch" :defaultStatus="grantRedStatus" :inline="inline" @change="grantRedStatusChange"></qwuiSwitch>
          </qwFunctionBox>
        </qwFormItem>
        <qwFormItem label="红包类型" v-show="grantRedStatus&&msgTypeIndex==0">
          <qwuiRadio :disabled="disabledRed" v-model="redEnvelopes" label="fightRed" border @change="redEnvelopesRadio">拼手气红包</qwuiRadio>
          <qwuiRadio :disabled="disabledRed" v-model="redEnvelopes" label="ordinaryRed" border @change="redEnvelopesRadio">普通红包</qwuiRadio>
        </qwFormItem>
        <qwFormItem prop="redNum" label="红包个数" v-show="grantRedStatus&&msgTypeIndex==0">
          <qwuiInput :inputType="inputTypeRed" v-model="ruleForm.redNum" inputTips="请输入红包个数"></qwuiInput>
        </qwFormItem>
        <qwFormItem prop="redTotalMoney" label="红包总金额(元)" v-show="grantRedStatus&&msgTypeIndex==0">
          <qwuiInput :inputType="inputTypeRed" v-model="ruleForm.redTotalMoney" inputTips="请输入金额"></qwuiInput>
          <span class="qwui-tips">（每人可领1个，金额随机且不超过10000元）</span>
        </qwFormItem>
        <qwFormItem label="单个红包限额" v-show="grantRedStatus&&isShowRedLimit&&msgTypeIndex==0">
          <div class="qwui-col qwui-col-11">
            <qwFormItem prop="redLimit" ref="redLimit">
              <qwuiInput :inputType="inputTypeRed" v-model="ruleForm.redLimit" inputTips="最小金额"></qwuiInput>
            </qwFormItem>
          </div>
          <div class="qwui-col qwui-col-2 tcenter">一</div>
          <div class="qwui-col qwui-col-11">
            <qwFormItem prop="redLimitMax" ref="redLimitMax">
              <qwuiInput :inputType="inputTypeRed" v-model="ruleForm.redLimitMax" inputTips="最大金额"></qwuiInput>
            </qwFormItem>
          </div>
          <span class="qwui-tips">（每个红包的随机金额保证在设置区间内，如果不设置按系统的默认规则）</span>
        </qwFormItem>
        <qwFormItem label="留言" v-show="grantRedStatus&&msgTypeIndex==0">
          <qwuiInput :inputType="leaveMsgInputType" v-model="ruleForm.leaveMsg" inputTips="恭喜发财，大吉大利"></qwuiInput>
          <span class="qwui-tips">（建议不多于50字）</span>
        </qwFormItem>
        <qwFormItem label="发放方式" class="qwui-full" v-show="grantRedStatus&&msgTypeIndex==0">
          <div class="lh32" v-show="!isShowRedLimit">
            每份红包包含
            <span class="orange">{{ruleForm.redNum}}</span>
            个等额红包，每个红包固定
            <span class="orange">{{ruleForm.redTotalMoney}}</span>
            元，总金额为【
            <span class="orange">{{ruleForm.redTotalMoney}} x {{ruleForm.redNum}}</span>
            】元
          </div>
          <div class="lh32" v-show="isShowRedLimit">
            每份红包包含
            <span class="orange">{{ruleForm.redNum}}</span>
            个随机红包，总金额为
            <span class="orange">{{ruleForm.redTotalMoney}}</span>元
          </div>
        </qwFormItem>
        <qwFormItem label="共发放" class="qwui-full" v-show="grantRedStatus&&msgTypeIndex==0">
          <div class="qwui-total_amount" v-show="!isShowRedLimit">￥ {{ruleForm.redTotalMoney*ruleForm.redNum}}</div>
          <div class="qwui-total_amount" v-show="isShowRedLimit">￥ {{ruleForm.redTotalMoney}}</div>
        </qwFormItem>
        <qwFormItem label="定向红包" class="qwui-full" v-show="grantRedStatus&&msgTypeIndex==0">
          <pickExam
            :allObj="allObj"
            :speObj="speObj"
            :useTab="useRedTab"
            :useDepts="useRedDepts"
            :useUsers="useRedUsers"
            :useTags="useRedTags"
            :useRadio="useRedRadio"
            :disabled="disabledRed"
            @chooseDone="chooseRedDone"
            @changeRadio="changeRedRadio"></pickExam>
          <div class="c999">
            <div>目标对象是指能查阅本公告（文章）的成员，可在下方设置；</div>
            <div>如定向红包设置了特定对象，则会选取与发布对象有重合（能查阅本公告）的成员进行发放。</div>
            <div>已发布的公告不能再修改红包的目标对象。</div>
          </div>
        </qwFormItem>
        <div class="qwui-dotted_line" v-show="msgTypeIndex==0"></div>

        <qwFormItem label="发布对象" :required="isRequired" v-show="!(isManagerEdit=='5')" class="publishObjectWrap">
          <pickExam
          :useTab="useTab"
          :useDepts="useDepts"
          :useUsers="useUsers"
          :useTags="useTags"
          :useRadio="useRadio"
          @chooseDone="chooseDone"
          @changeRadio="changeRadio"></pickExam>
          <div v-show="isShowUser" class="qwui-form_item_error">{{userTip}}</div>
        </qwFormItem>

        <qwFormItem v-show="msgTypeIndex==0" prop="text" label="正文" class="qwui-full">
          <div>
            <editor :config="editorOption" :agentCode="agentCode" ref="editor" @blur="textBlur"></editor>
            <p class="c999">请在正文编辑您的推送文章详情</p>
          </div>
        </qwFormItem>
        <qwFormItem label="附件" v-show="msgTypeIndex==0">
          <QwUploadWrap
            :fileList="fileList"
            :limit="100"
            :beforeUpload="beforeUploadFile"
            :onSuccess="handleSuccessFile"
            :onRemove="handleRemoveFile">
            <qwuiButton class="mb5">上传</qwuiButton>
          </QwUploadWrap>
        </qwFormItem>
        <qwFormItem>
          <qwFunctionBox text="点对点发送">
            <qwuiSwitch slot="switch" :defaultStatus="pointToPointStatus" :inline="inline" @change="pointToPointStatusChange"></qwuiSwitch>
          </qwFunctionBox>
        </qwFormItem>
        <qwFormItem v-show="msgTypeIndex==0">
          <qwFunctionBox text="开启评论">
            <qwuiSwitch slot="switch" :defaultStatus="openCommentStatus" :inline="inline" @change="openCommentStatusChange"></qwuiSwitch>
          </qwFunctionBox>
        </qwFormItem>
        <qwFormItem>
          <qwFunctionBox text="置顶">
            <qwuiSwitch slot="switch" :defaultStatus="setTopStatus" :inline="inline" @change="setTopStatusChange"></qwuiSwitch>
          </qwFunctionBox>
        </qwFormItem>
        <qwFormItem>
          <qwFunctionBox text="发布时发送通知消息">
            <qwuiSwitch slot="switch" :defaultStatus="sendMsgNotifyStatus" :inline="inline" @change="sendMsgNotifyStatusChange"></qwuiSwitch>
          </qwFunctionBox>
        </qwFormItem>
        <qwFormItem>
          <qwFunctionBox text="推送待办通知" :showTips="showTipsPushWaitNotice">
            <div class="fz12" slot="tipContent">
              <p>
                此操作只有第一次发布的时候才生效
              </p>
            </div>
            <qwuiSwitch slot="switch" :defaultStatus="pushWaitNoticeStatus" :inline="inline" @change="pushWaitNoticeStatusChange"></qwuiSwitch>
          </qwFunctionBox>
        </qwFormItem>
        <qwFormItem v-show="!secrecyMsgStatus&&msgTypeIndex==0">
          <qwFunctionBox text="消息背景水印" :showTips="showTipsMsgBgWatermark">
            <div class="fz12" slot="tipContent">
              <p>
                外部分享的水印内容为企业名称
              </p>
            </div>
            <qwuiSwitch slot="switch" :defaultStatus="msgBgWatchmarkStatus" :inline="inline" @change="msgBgWatchmarkStatusChange"></qwuiSwitch>
          </qwFunctionBox>
        </qwFormItem>
      </qwForm>
      <div class="qwui-line"></div>
      <div class="tcenter pb20">
        <qwuiButton @click="doPreview" class="mr10">&nbsp;预览&nbsp;</qwuiButton>
        <qwuiButton @click="submitForm('ruleForm','save')" v-show="showSaveDraftBtn" class="mr10">&nbsp;保存草稿&nbsp;</qwuiButton>
        <qwuiButton @click="submitForm('ruleForm','saveTime')" v-show="showTimeSaveBtn" class="mr10">&nbsp;保存&nbsp;</qwuiButton>
        <qwuiButton type="primary" v-show="showCancelTime" @click="cancelTime()" class="mr10">&nbsp;取消定时&nbsp;</qwuiButton>
        <qwuiButton type="primary" v-show="publishBtn" @click="submitForm('ruleForm','public')" class="mr10">&nbsp;{{publicBtnText}}&nbsp;</qwuiButton>
        <qwuiButton type="primary" v-show="timeBtn" @click="timingPublish">&nbsp;定时发布&nbsp;</qwuiButton>
      </div>
      <qwCoverImgPreview :title="previewTitle" :img="previewImg" :text="previewText"></qwCoverImgPreview>
    </div>
    <div v-show="showTimingAlert">
      <funcBox boxTitle="定时发送" firstBtn="确定" secondBtn="取消" boxWidth="500" @secondFunc="close" @closeBox="close" @firstFunc="ok">
        <div class="qwui-timing_content tcenter pt30 pb30">
          <span class="pr5">选择发送时间</span>
          <VueDatepickerLocal v-model="timing" @confirm="confirm" show-buttons placeholder="选择发送时间" format="YYYY-MM-DD HH:mm:ss"></VueDatepickerLocal>
           <div class="qwui-time_tip" v-show="timingError">请选择发布时间</div>
        </div>
      </funcBox>
    </div>
  </div>
</template>

<script>
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/QwInput';
  import qwuiSelect from '@/components/qwuiBase/qwuiSelect/QwSelect';
  import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox'
  import qwUploadImg from '@/components/Add/uploadImg/QwUploadImg';
  import qwuiSwitch from '@/components/qwuiBase/qwuiSwitch/qwuiSwitch'
  import qwTitle from '@/components/base/QwTitle';
  import qwForm from '@/components/form/form';
  import qwFormItem from '@/components/form/formItem';
  import qwFunctionBox from '@/components/base/QwFunctionBox';
  import pickExam from '@/components/pickPerson/pickExam';
  import Editor from '@/components/base/editor';
  import qwCoverImgPreview from '@/components/Add/QwCoverImgPreview';
  import qwuiRadio from '@/components/qwuiBase/qwuiRadio/qwuiRadio';
  import funcBox from '@/components/list/funcBox';
  import VueDatepickerLocal from '@/components/base/VueDatepickerLocal';
  import QwUploadWrap from '@/components/Add/Upload/QwUploadWrap';
  import { isVipGold,isVipSilver } from '@/assets/js/vip-manager';
  import {
    getDynamicTypePost,
    addtbXyhDynamicinfoPO,
    ajaxAddTimingNews,
    saveAndPublish,
    ajaxView,
    updateTiming,
    updateTimingNews,
    updateTbXyhDynamicinfoPO,
    updateAndPublish,
    checkIsOpenWaterMark,
  } from '../../api/newsBulletin/getData.js';

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
    mounted(){
      let self = this;
      this.previewTitle = this.ruleForm.title || '标题';
      this.previewImg = require('assets/images/icon_default_cover_img.png');
      this.previewText = this.ruleForm.summary || '摘要';
      self.dynamicId = self.$route.query.id;
      self.pageType = self.$route.query.pageType;

      getDynamicTypePost({
        'isForSelect':1,
        'belongAgent':dataBase.agentCode,
      },(data)=>{
        let list = data.list;
        if(list.length>0){
          if(self.pageType!=='copy'){
            // self.selectValType.name = list[0].typeName || '';
              // self.selectValType.idx = list[0].id || 0;
              self.selectValType.name = '';
              self.selectValType.idx = 0;
          }
          list.forEach(function(item,index){
            self.typeData.push({
              val: item.id,
              optionName: item.typeName
            });
          });
        }
         // 检测是否开启全局水印
        checkIsOpenWaterMark((data)=>{
          self.isOpenWaterMark = data.isOpenWaterMark;
          self.pageType ? self.pageData() : self.msgBgWatchmarkStatus = self.isOpenWaterMark === 1;
        });
      });
    },
    data(){
      let validatorMoney = function(rule, value, callback){
        if(value>10000){
          callback(new Error('红包金额不可超过10000元'));
        }
        if(value<1){
          callback(new Error('最小金额需要≥1'));
        }
        if(!/^\d+(\.{1}\d{1,2})?$/.test(value)){
          callback(new Error('金额不符合规范，请重新输入'));
        }
      };
      let self = this;

      return{
        isShowUser:false, // 发布对象提示
        userTip:'',
        isShowType:false, // 类型错误提示
        isRequired: true, // 必填
        timingError: false, //定时发布时间为空错误提示
        isOpenWaterMark:1,
        maxRedpackMoneyYuan:10000,
        minRedpackMoneyYuan:1,
        publicBtnText:'发布',
        timeBtn:true,
        publishBtn:true,
        isTimings:false,
        showCancelTime:false,
        showTimeSaveBtn:false,
        showSaveDraftBtn:true,
        timingTip:'',
        inputTypeRed:'sort',
        leaveMsgInputType:'text',
        isManagerEdit:'',
        dynamicId:'',
        pageTitle:'新增',
        pageType:'add',
        phoneImgList:[],
        imageUrlStr:'',
        multipleMusic:false,
        fileListMusic:[],
        fileList:[],
        timing:'',
        timingStr:'',
        allObj:{
          id:'a1',
          text:'与目标对象一致',
        },
        speObj:{
          id:'a2',
          text:'特定对象',
        },
        agentCode:dataBase.agentCode,
        editorOption: EDITOR_OPTION,
        useRedTab:[
          {text:'部门'},
          {text:'标签'},
          {text:'标签人员'},
          {text:'特定人员'},
          {text:'批量导入'},
          {text:'高级筛选'},
        ],
        useTab:[
          {text:'部门'},
          {text:'标签'},
          {text:'标签人员'},
          {text:'特定人员'},
          // {text:'批量导入'},
          {text:'高级筛选'},
        ],
        useDepts:[],
        useUsers:[],
        useTags:[],
        useRadio:'', // 所有人
        useRedDepts:[],
        useRedUsers:[],
        useRedTags:[],
        useRedRadio:'与目标对象一致',
        disabledRed:false,
        showTextChecked:false,
        uploadConfig:{
          uploadFileId:dataBase.agentCode+'CoverImg',
          showType:'small',
          isMoreImg:false,
          imageObj:{
            imageURL:'',
            fileName:'',
          },
        },
        inline:false,
        secrecyMsgStatus:false,
        openShareStatus:false,
        showCommentStatus:false,
        grantRedStatus:false,
        openCommentStatus:false,
        pointToPointStatus:false,
        sendMsgNotifyStatus:true,
        setTopStatus:false,
        pushWaitNoticeStatus:false,
        msgBgWatchmarkStatus:true,
        showTipsGrantRed:true,
        showTipsPushWaitNotice:true,
        showTipsMsgBgWatermark:true,
        selectValType: {
          name: '',
          idx: 0
        },
        selectValMsgType: {
          name: '图文消息',
          idx: 0
        },
        typeData:[],
        msgTypeData:[
          {
            val:0,
            optionName:'图文消息',
          },
          {
            val:1,
            optionName:'第三方页面',
          }
        ],
        ruleForm: {
          title: '',
          type: '',
          summary:'',
          address:'',
          redNum:0,
          redTotalMoney:0,
          leaveMsg:'恭喜发财，大吉大利',
          redLimit:'',
          redLimitMax:'',
          text:'',
          hint:'道一云|企微正在为您导航',
          author:'',
          stopTime: '',
        },
        rules: {
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'},
          ],
          address: [
            {required: true, trigger: 'blur',validator:function(rule, value, callback){
                if(self.msgTypeIndex==1) {
                  if (!value) {
                    callback(new Error('第三方页面地址不能为空'));
                  }else{
                    callback();
                  }
                }else{
                  callback();
                }
            }},
          ],
          text:[
            {required:true,trigger: 'blur',validator:function(rule, value, callback){
                if(self.msgTypeIndex==0) {
                  if (!value) {
                    callback(new Error('正文为空'));
                  }else{
                    callback();
                  }
                }else{
                  callback();
                }
            }},
          ],
          redNum:[
            {required: true, trigger: 'blur',validator:function(rule, value, callback){
                if(self.grantRedStatus) {
                  if (!value) {
                    callback(new Error('请输入红包个数！'));
                  }
                  if (!/^\d+$/.test(value)) {
                    callback(new Error('红包个数格式不正确'));
                  }
                  if (self.ruleForm.redLimit || self.ruleForm.redLimitMax) {
                    self.$refs.redLimit.validate('', (message, field) => {
                    });
                  }
                }
                callback();
              }},
          ],
          redTotalMoney:[
            {required: true,trigger: 'blur',validator:function(rule, value, callback){
                if(self.grantRedStatus) {
                  if (!value) {
                    callback(new Error('请输入红包金额！'));
                  }
                  validatorMoney(rule, value, callback);
                  if (self.ruleForm.redLimit || self.ruleForm.redLimitMax) {
                    self.$refs.redLimit.validate('', (message, field) => {
                    });
                  }
                }
                callback();
            }},
          ],
          redLimit:[
            {trigger: 'blur',validator:function(rule, value, callback){
              if(self.grantRedStatus&&self.isShowRedLimit&&self.msgTypeIndex==0){
                let redLimit = parseFloat(self.ruleForm.redLimit) || 0;
                let redLimitMax = parseFloat(self.ruleForm.redLimitMax) || 0;
                if(redLimit||redLimitMax){
                  validatorMoney(rule, value, callback);
                  self.$refs.redLimitMax.validateState = 'success';
                  if(redLimit > redLimitMax){
                    self.$refs.redLimitMax.validateState = 'error';
                    callback(new Error('最小金额不可大于等于最大金额'));
                  }
                  if(redLimit > ((self.ruleForm.redTotalMoney/self.ruleForm.redNum)||0)){
                    self.$refs.redLimitMax.validateState = 'error';
                    callback(new Error('最小金额必须小于每个红包的平均金额'));
                  }
                  if(redLimitMax < ((self.ruleForm.redTotalMoney/self.ruleForm.redNum)||0)){
                    self.$refs.redLimitMax.validateState = 'error';
                    callback(new Error('最大金额必须大于每个红包的平均金额'));
                  }
                  if(redLimitMax>self.ruleForm.redTotalMoney){
                    self.$refs.redLimitMax.validateState = 'error';
                    callback(new Error('最大金额必须小于红包总金额！'));
                  }
                  callback();
                }else{
                  self.$refs.redLimitMax.validateState = 'success';
                  callback();
                }
              }else{
                callback();
              }
            }},
          ],
          redLimitMax:[
            {trigger: 'blur',validator:function(rule, value, callback){
                if(self.grantRedStatus&&self.isShowRedLimit&&self.msgTypeIndex==0) {
                  self.$refs.redLimit.validate('', (message, field) => {});
                }
                callback();
              }}
          ],
          stopTime: [
            {required: true, message: '截止时间不能为空', trigger: 'blur'},
            {trigger: 'input' ,validator:function(rule, value, callback){
              if(new Date(value).getTime() < new Date().getTime()){
                callback(new Error('截止时间不能小于当前时间'));
              }else{
                callback();
              }
            }},
          ],
        },
        previewTitle:'',
        previewImg:'',
        previewText:'',
        msgTypeIndex:0,
        uploadImgObj:{},
        redEnvelopes:'fightRed',
        isShowRedLimit:true,
        submitData:{},
        depts:'',
        users:'',
        tags:'',
        deptsPublic:'',
        usersPublic:'',
        tagsPublic:'',
        showTimingAlert:false,
        interfaceCode: dataBase.agentCode === 'dynamic'
          ? interfaceCode.INTERFACE_CODE_DYNAMIC
          : interfaceCode.INTERFACE_CODE_PARTYCONSTRUCTION,
        musicId:'',
        musicName:'',
        musicURL:'',
        fileIds:'',
        fileArr:[],
        authorId:'',
      }
    },
    watch:{
      timing(newVal){
        this.timingError = newVal === '';
      }
    },
    methods:{

      handleConfirmDate(val){
        let date = new Date(val).Format('yyyy-MM-dd hh:mm:ss');
        this.ruleForm.stopTime = date;
      },

      //定时任务时间选择确定按钮
      confirm(date){
        this.timing = date;
      },
      //编辑和复制页面回显数据
      pageData(){
        let self = this;
        self.pageTitle = self.pageType==='edit' ? '编辑' : '新增';
        ajaxView({
          id:self.dynamicId,
        },function(data){
          //新闻作者
          if(data.dynamicinfoExtPO){
            let authorName = data.dynamicinfoExtPO.authorName;
            let authorId = data.dynamicinfoExtPO.id;
            if(self.pageType==='edit'){
              self.authorId = authorId;
            }
            self.ruleForm.author = authorName;
            self.ruleForm.stopTime = data.tbXyhDynamicinfoPO.stopTime || '';
          }
          //处理编辑器内容
          let tbXyhDynamicinfoPO = data.tbXyhDynamicinfoPO;
          if(tbXyhDynamicinfoPO.contentType=="来自手机"){
            tbXyhDynamicinfoPO.content = _.checkURL(tbXyhDynamicinfoPO.content,true);
          }
          tbXyhDynamicinfoPO.content = tbXyhDynamicinfoPO.content.replace(/http\:\/\/qy\.do1\.com\.cn\:6090\/fileweb/g,_.localport).replace(/@fileweb@/g,_.localport);
          //处理发消息内容
          if(""==tbXyhDynamicinfoPO.isSendMsg || tbXyhDynamicinfoPO.isSendMsg==null){
            tbXyhDynamicinfoPO.isSendMsg="0";
          }
          //处理发送代办
          if(""==tbXyhDynamicinfoPO.isSendTodo || tbXyhDynamicinfoPO.isSendTodo==null){
            tbXyhDynamicinfoPO.isSendTodo="0";
          }
          //类型
          if(self.pageType === 'edit'){
            self.selectValType.name = data.dynamicTypeName;
            self.selectValType.idx = tbXyhDynamicinfoPO.dynamicTypeId;
          }else if(self.typeData.length > 0){
            self.typeData.some((item)=>{
              if(item.val == tbXyhDynamicinfoPO.dynamicTypeId){
                self.selectValType.name = data.dynamicTypeName;
                self.selectValType.idx = tbXyhDynamicinfoPO.dynamicTypeId;
                return true;
              }
            });
          }

          //标题
          self.ruleForm.title = tbXyhDynamicinfoPO.title;
          self.previewTitle = self.ruleForm.title;
          //消息类型
          if(tbXyhDynamicinfoPO.msgType=='1'){
            self.selectValMsgType.name = '第三方页面';
            self.selectValMsgType.val = 1;
            self.msgTypeIndex = 1;
          }
          //摘要
          self.ruleForm.summary = tbXyhDynamicinfoPO.summary;
          self.previewText = self.ruleForm.summary;
          //处理封面图片
          let coverImage = tbXyhDynamicinfoPO.coverImage;
          if(""!=coverImage&&'/themes/default/images/qw/secret.jpg'!==coverImage){
            self.uploadConfig.imageObj.imageURL = tbXyhDynamicinfoPO.coverImage;
            self.uploadImgObj.imageURL = tbXyhDynamicinfoPO.coverImage;
            self.previewImg = _.compressURL+tbXyhDynamicinfoPO.coverImage;
          }
          //置顶
          if(tbXyhDynamicinfoPO.isTop>0){
            self.setTopStatus = true;
          }
          //发送通知消息
          if(tbXyhDynamicinfoPO.isSendMsg=="0"){
            self.sendMsgNotifyStatus = false;
          }
          //发送代办
          if(tbXyhDynamicinfoPO.isSendTodo=="0"){
            self.pushWaitNoticeStatus = false;
          }
          //设置目标对象
          let deptsArr = [];
          let usersArr = [];
          let tagsArr = [];
          if(tbXyhDynamicinfoPO.ranges=="3"){
            //特定对象
            self.useRadio = '特定对象';
            var selectDeptVOList=data.selectDeptVOList;
            var selectUserVOList=data.selectUserVOList;
            var selectTagVOList=data.selectTagVOList;
            selectDeptVOList.forEach(function(item){
              deptsArr.push(item.deptId);
            });
            selectUserVOList.forEach(function(item){
              usersArr.push(item.userId);
            });
            selectTagVOList.forEach(function(item){
              tagsArr.push(item.tagId);
            });
            self.useDepts = selectDeptVOList;
            self.useUsers = selectUserVOList;
            self.useTags = selectTagVOList;

            self.deptsPublic = deptsArr.join('|');
            self.usersPublic = usersArr.join('|');
            self.tagsPublic = tagsArr.join('|');
          }else if(tbXyhDynamicinfoPO.ranges=="2"){
            //后台修改手机端的信息，本部门只能转化为特定部门
            self.useRadio = '特定对象';
            var selectDeptVOList=data.selectDeptVOList;
            selectDeptVOList.forEach(function(item){
              deptsArr.push(item.deptId);
            });
            self.deptsPublic = deptsArr.join('|');
            if(selectDeptVOList && selectDeptVOList!=null && selectDeptVOList!=""){
              self.useDepts = selectDeptVOList;
            }
          }
          if(tbXyhDynamicinfoPO.ranges=="1"){
              self.useRadio='所有人'
          }
          if("5"==tbXyhDynamicinfoPO.isEdit) {
            //如果是超级管理员修改过
            self.isManagerEdit = tbXyhDynamicinfoPO.isEdit;
          }
          //将封面显示在正文中
          if (tbXyhDynamicinfoPO.isDisplayCoverImage == "0") {//0-开启;1-关闭
            self.showTextChecked = true;
          }
          //处理手机上传的图片表的图片
          data.images.forEach((item)=>{
            item.src = _.compressURL+item.path;
          });
          self.phoneImgList = data.images;

          //图文消息
          if(tbXyhDynamicinfoPO.msgType == 0) {
            //处理文本编辑器的内容
            self.$refs.editor.setUEContent(tbXyhDynamicinfoPO.content);
            self.ruleForm.text = tbXyhDynamicinfoPO.content;
            //处理保密按钮
            if (tbXyhDynamicinfoPO.isSecret == "1") {
              //保密消息
              self.secrecyMsgStatus = true;
              self.previewImg = require('assets/images/icon_secret.jpg');
            }
            //处理水印按钮(若在设置->全局开启水印，也显示为开启)
            if (tbXyhDynamicinfoPO.isWatermark == "1" || self.isOpenWaterMark === 1){
              self.msgBgWatchmarkStatus = true;
            }
            //外部分享
            if (tbXyhDynamicinfoPO.isOpen == "1") {
              self.openShareStatus = true;
            }
            //外部分享显示评论
            if (tbXyhDynamicinfoPO.shareComment == "1") {
              self.showCommentStatus = true;
            }
            //开启评论
            if (tbXyhDynamicinfoPO.isComment == "1") {//0-开启；1-关闭
              self.openCommentStatus = false;
            }
            //点对点
            if (tbXyhDynamicinfoPO.pointToPoint == "1") {//0-开启；1-关闭
              self.pointToPointStatus = false;
            }else {
              self.pointToPointStatus = true;
            }
            //处理附件
            self.fileList = data.mediaList || [];
            self.getFileIds();
            //处理音频
            if(data.videoPO){
              self.fileListMusic.splice(0,1,data.videoPO);
              self.musicName = data.videoPO.fileName;
              self.musicURL = data.videoPO.url;
              self.musicId = data.videoPO.id;
            }
            //处理红包
            let redpackParamsVO = data.RedpackParamsVO;
            if(null!=redpackParamsVO && ""!=redpackParamsVO){
              //红包开关设置
              if("1"==redpackParamsVO.isRedpack){
                //有红包
                self.grantRedStatus = true;
                //红包类型设置
                if("0"==redpackParamsVO.repackType){
                  //随机红包
                  self.redEnvelopes = 'ordinaryRed';
                  self.isShowRedLimit = false;
                }
                //红包个数
                let totalCount = redpackParamsVO.totalCount;
                let totalAmount = redpackParamsVO.totalAmount;
                self.ruleForm.redNum = totalCount;
                self.ruleForm.totalAmount = totalAmount;
                //单个总金额:需要将元转成分
                if("0"==redpackParamsVO.repackType) {//0-等额；1-拼手气
                  self.ruleForm.redTotalMoney = redpackParamsVO.totalAmount/redpackParamsVO.totalCount/100;
                }else{
                  self.ruleForm.redTotalMoney = redpackParamsVO.totalAmount/100
                }
                if(redpackParamsVO.minMoney && redpackParamsVO.minMoney != ""){
                  self.ruleForm.redLimit = redpackParamsVO.minMoney/100;
                }
                if(redpackParamsVO.maxMoney && redpackParamsVO.maxMoney != ""){
                  self.ruleForm.redLimitMax = redpackParamsVO.maxMoney/100;
                }
                //留言祝福语
                self.ruleForm.leaveMsg = redpackParamsVO.wishing;
                //设置红包的选择对象
                let redpackRange = redpackParamsVO.redpackRange;
                if("3"==redpackRange) {
                  //特定对象
                  self.useRedRadio = '特定对象';
                  self.useRedDepts = redpackParamsVO.selectDeptVOList;
                  self.useRedUsers = redpackParamsVO.selectUserVOList;
                  self.useRedTags = redpackParamsVO.selectTagVOList;
                  self.depts = redpackParamsVO.redpackDeptIds;
                  self.users = redpackParamsVO.redpackUserIds;
                  self.tags = redpackParamsVO.redpackTagIds;
                }
                //发布的红包禁用
                if("1"==redpackParamsVO.redpackStatus&&self.pageType==='edit'){
                  self.inputTypeRed = 'forbidden';
                  self.leaveMsgInputType = 'forbidden';
                  self.disabledRed = true;
                }
              }
            }
          }else{
            self.ruleForm.address = tbXyhDynamicinfoPO.thirdPartUrl;
            self.ruleForm.hint = tbXyhDynamicinfoPO.thirdPartTips;
          }

          //处理按钮的显示问题
          if (tbXyhDynamicinfoPO.isTiming == "1"&&"edit"===self.pageType){
            //定时任务
            var strTemp;
            if("1"==tbXyhDynamicinfoPO.sendRes){
              strTemp = "此公告是定时公告，已在" + tbXyhDynamicinfoPO.timingTime + " 开始发布";
            }else{
              strTemp = "此公告是定时公告，将在" + tbXyhDynamicinfoPO.timingTime + " 开始发布";
            }
            self.timingTip = strTemp;
            var timingTimes = tbXyhDynamicinfoPO.timingTime;
            self.timing = timingTimes;
            self.showTimeSaveBtn = true;
            self.showSaveDraftBtn = false;
            self.publishBtn = false;
            self.timeBtn = false;
            if (new Date(timingTimes.replace(/-/g, "/")) > new Date()) {
              self.showCancelTime = true;
              self.isTimings = true;
            }
            return;
          }

          if(tbXyhDynamicinfoPO.status==="发布"&&self.pageType==='edit'){
            self.publicBtnText = '保存';
            self.timeBtn = false;
            self.showSaveDraftBtn = false;
          }
        });
      },
      //取消定时任务
      cancelTime(){
        let self = this;
        if(this.isTimings){
          updateTiming({
            id:self.dynamicId,
          },(data)=>{
            dataBase.top_alert('取消定时成功！',true,3000);
          });
        }
      },
      //删除手机端上传图片
      delPhoneImg(index){
        this.phoneImgList.splice(index,1);
      },
      getFileIds(){
        let ids = [];
        this.fileList.forEach((file)=>{
          ids.push(file.id);
        });
        this.fileIds = ids.join('|');
      },
      //处理上传附件删除
      handleRemoveFile(file,fileList){
        this.getFileIds();
      },
      //处理上传附件成功
      handleSuccessFile(file){
        this.getFileIds();
      },
      //上传附件前处理
      beforeUploadFile(file){
        let size = file.size;
        let fileName = file.name;
        let isExt = fileName.lastIndexOf(".");
        let fileExt = fileName.substr(isExt).toLowerCase();//获得文件后缀名
        if(!(".txt.xml.pdf.doc.ppt.xls.docx.pptx.xlsx.mp3.wma.amr.mp4.rar.zip.csv".includes(fileExt))){
          dataBase.top_alert('只能上传txt,xml,pdf,doc,ppt,xls,docx,pptx,xlsx,mp3,wma,amr,mp4,rar,zip,csv；如需上传其它格式文件请先将其压缩后再上传',false,3000);
          return false;
        }
        if (isVipGold(dataBase.agentCode)){
          // 由50m修改成1g
          if (size>1024*1024000){
            dataBase.top_alert('文件大小不能超过1G',false,3000);
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
      //处理上传音频删除
      handleRemoveMusic(){
        this.musicId = '';
      },
      //处理上传音频成功
      handleSuccessMusic(fileList){
        this.musicId = fileList[0].id;
        this.musicName = fileList[0].fileName;
        this.musicURL = fileList[0].url;
      },
      //处理上传音频超出限制
      handleExceedMusic(){
        dataBase.top_alert('只允许上传一个语音音频文件',false,3000);
      },
      //上传语音音频前处理
      beforeUploadMusic(file){
        let fileName = file.name;
        let isExt = fileName.lastIndexOf(".");
        let fileExt = fileName.substr(isExt).toLowerCase();//获得文件后缀名
        if(fileExt!='.mp3'){
          dataBase.top_alert('只能上传mp3格式的文件',false,3000);
          return false;
        }else if(file.size > 1024000*10){
          dataBase.top_alert('文件大小不超过10M',false,3000);
          return false;
        }
        return true;
      },
      //定时发布确定按钮
      ok(){
        if(!this.timing){
          this.timingError = true;
          return;
        }
        this.timingStr = this.timing.Format('yyyy-MM-dd hh:mm:ss');
        this.showTimingAlert = false;
        this.submitForm('ruleForm','timing');
      },
      //定时发布取消和关闭按钮
      close(){
        this.showTimingAlert = false;
      },
      //处理发布或保存结果
      handleResult(data){
        let isNeedAudit = data.isNeedAudit;
        let self = this;
        if(isNeedAudit == 1){
          let tips = "<p class='c999 mt5'>该动态所属类型需审批后才能发布，若到期未审批<br>该动态将不会发布。</p>";
          _.alert("提交结果", tips, function () {
            self.$router.push({
              name:'newsBulletinList',
            });
          });
        }else{
          self.$router.push({
            name:'newsBulletinList',
          });
        }
      },
      //定时发布
      timingPublish(){
        if(!_.isVipSilver(this.interfaceCode) && !_.isOldUserVip()){
          _._alertVip('新闻公告定时发布');
          return;
        }
        this.showTimingAlert = true;
        this.timingError = false;
      },
      //预览
      doPreview(){
        //兼容老的jsp页面（缓存）
        let dataObj = {};
        let self = this;
        dataObj['title'] = self.ruleForm.title;
        dataObj['thirdPartUrl'] = self.ruleForm.address || '';
        dataObj['msgTypeIndex'] = self.msgTypeIndex;
        dataObj['typeName'] = self.selectValType.name;
        dataObj['phoneImgList'] = self.phoneImgList;
        dataObj['author'] = self.ruleForm.author;
        if(self.msgTypeIndex==0){
          if(self.grantRedStatus){
            dataObj['totalAmount'] = self.ruleForm.redTotalMoney;
          }
          dataObj['fileArr'] = self.fileList;
          dataObj['isComment'] = self.openCommentStatus?0:1;
          dataObj['pointToPoint'] = self.pointToPointStatus?0:1;
          dataObj['musicName'] = self.musicName || '';
          dataObj['musicURL'] = self.musicURL || '';
          dataObj['editorContent'] = self.ruleForm.text;
          dataObj['isSecret'] = self.secrecyMsgStatus ? 1 : 0;
          dataObj['isRedpack'] = self.grantRedStatus ? 1 : 0;
          if(!self.secrecyMsgStatus){
            dataObj['isDisplayCoverImage'] = self.showTextChecked ? 0 : 1;
            dataObj['coverImage'] = self.uploadImgObj.imageURL || '';
            dataObj['isWatchPrint'] = self.msgBgWatchmarkStatus?1:0;
          }
        }else if(self.msgTypeIndex==1){
          dataObj['isDisplayCoverImage'] = self.showTextChecked ? 0 : 1;
          dataObj['coverImage'] = self.uploadImgObj.imageURL || '';
          dataObj['thirdPartTips'] = self.ruleForm.hint || '道一云|企微正在为您导航';
        }
        window.localStorage.setItem('personName',wxqyhConfig.personName);
        window.localStorage.setItem('addData',JSON.stringify(dataObj));
        let top=(window.screen.height-560)/2;
        let left=(window.screen.width-350)/2;
        window.open(_.baseURL+'/manager/dynamic/preview.jsp', 'newwindow', 'left='+left+',top='+top+',height=580, width=350, toolbar=no, menubar=no, resizable=yes,location=no, status=no,scrollbars=no,directories=no,menubar=no');
      },
      //保存草稿或发布或定时发布
      submitHandler(type){
        let self = this;
        self.submitData = {};
        let saveObj = {
          'save':function(){
            if(self.pageType==='edit'){
              updateTbXyhDynamicinfoPO(self.submitData,(data)=>{
                dataBase.top_alert('修改成功',true,3000);
                self.$router.push({
                  name:'newsBulletinList',
                });
              });
            }else{
              addtbXyhDynamicinfoPO(self.submitData,(data)=>{
                dataBase.top_alert('保存草稿成功',true,3000);
                self.$router.push({
                  name:'newsBulletinList',
                });
              });
            }
          },
          'public':function(){
            if(self.pageType==='edit') {
              updateAndPublish(self.submitData, () => {
                dataBase.top_alert('发布成功', true, 3000);
                self.$router.push({
                  name:'newsBulletinList',
                });
              });
            }else{
              saveAndPublish(self.submitData, () => {
                dataBase.top_alert('发布成功', true, 3000);
                self.$router.push({
                  name:'newsBulletinList',
                });
              });
            }
          },
          'timing':function(){
            self.submitData['tbXyhDynamicinfoPO.timingTime'] = self.timingStr;
            if(self.pageType==='edit'){
              saveObj['saveTime']();
            }else{
              ajaxAddTimingNews(self.submitData,(data)=>{
                dataBase.top_alert('提交成功',true,3000);
                self.handleResult(data);
              });
            }
          },
          'saveTime':function(){
            self.submitData['tbXyhDynamicinfoPO.timingTime'] = self.timing;
            updateTimingNews(self.submitData,(data)=>{
              dataBase.top_alert('更新成功',true,3000);
              self.handleResult(data);
            });
          },
        };
        //注册必须大于1个月才能保存外部
        if(self.showCommentStatus && !_.checkOpenShare()){
          return;
        }
        if (self.useRadio==='特定对象' && (self.deptsPublic == "" && self.usersPublic == "" && self.tagsPublic == "")) {
          dataBase.top_alert("特定对象为空",false,3000);
          return;
        }
        let redTotalMoney = parseFloat(self.ruleForm.redTotalMoney);
        let redNum = parseInt(self.ruleForm.redNum);
        if(self.isShowRedLimit&&redTotalMoney<redNum||redTotalMoney>redNum*self.maxRedpackMoneyYuan){
          _.alert("提示信息","每个人领取的红包金额数必须在"+self.minRedpackMoneyYuan+"-"+self.maxRedpackMoneyYuan+"元，请确认支付金额是否可以达到此标准！");
          return;
        }
        //处理手机端上传图片
        if(self.phoneImgList.length>0){
          let pathArr = [];
          self.phoneImgList.forEach((item)=>{
            pathArr.push(item.path);
          });
          self.imageUrlStr = pathArr.join('|');
        }
        if(self.selectValType.idx){
          self.submitData['tbXyhDynamicinfoPO.dynamicTypeId'] = self.selectValType.idx;
        }else{
          dataBase.top_alert('动态类型不能为空',false,3000);
          return;
        }
        if(self.pageType==='edit'){
          self.submitData['tbXyhDynamicinfoPO.dynamicInfoId'] = self.dynamicId;
        }

        self.submitData['tbXyhDynamicinfoPO.title'] = self.ruleForm.title;
        self.submitData['tbXyhDynamicinfoPO.msgType'] = self.msgTypeIndex;
        self.submitData['imageUrlStr'] = self.imageUrlStr;
        self.submitData['tbXyhDynamicinfoPO.summary'] = self.ruleForm.summary;
        self.submitData['deptIds'] = self.deptsPublic;
        self.submitData['userIds'] = self.usersPublic;
        self.submitData['tagIds'] = self.tagsPublic;
        self.submitData['range'] = self.useRadio==='所有人'?1:3;
        self.submitData['tbXyhDynamicinfoPO.isTop'] = self.setTopStatus?1:0;
        self.submitData['tbXyhDynamicinfoPO.isSendMsg'] = self.sendMsgNotifyStatus?1:0;
        self.submitData['tbXyhDynamicinfoPO.isSendTodo'] = self.pushWaitNoticeStatus?1:0;
        self.submitData['belongAgent'] = dataBase.agentCode;
        self.submitData['tbXyhDynamicinfoPO.thirdPartUrl'] = self.msgTypeIndex==1 ? self.ruleForm.address : '';
        self.submitData['dynamicinfoExtPO.id'] = self.authorId;
        self.submitData['dynamicinfoExtPO.authorName'] = self.ruleForm.author;
        self.submitData['tbXyhDynamicinfoPO.stopTime'] = self.ruleForm.stopTime ? new Date(self.ruleForm.stopTime).Format('yyyy-MM-dd hh:mm:ss'):'';
        if(self.msgTypeIndex==0){
          self.submitData['tbXyhDynamicinfoPO.voiceId'] = self.musicId;
          self.submitData['mediaIdStr'] = self.fileIds;
          self.submitData['tbXyhDynamicinfoPO.isSecret'] = self.secrecyMsgStatus ? 1 : 0;
          self.submitData['redpackParamsVO.isRedpack'] = self.grantRedStatus ? 1 : 0;
          self.submitData['editorContent'] = self.ruleForm.text;
          self.submitData['tbXyhDynamicinfoPO.isComment'] = self.openCommentStatus?0:1;
          self.submitData['tbXyhDynamicinfoPO.pointToPoint'] = self.pointToPointStatus?0:1;
          if(self.grantRedStatus){
            self.submitData['redpackParamsVO.repackType'] = self.redEnvelopes==='fightRed' ? 1 : 0;
            self.submitData['redpackParamsVO.totalCount'] = redNum;
            self.submitData['redpackParamsVO.totalAmount'] = redTotalMoney;
            self.submitData['redpackParamsVO.wishing'] = self.ruleForm.leaveMsg;
            self.submitData['redpackParamsVO.redpackRange'] = self.useRedRadio==='与目标对象一致'?1:3;
            self.submitData['redpackParamsVO.redpackDeptIds'] = self.depts;
            self.submitData['redpackParamsVO.redpackUserIds'] = self.users;
            self.submitData['redpackParamsVO.redpackTagIds'] = self.tags;
            if(self.isShowRedLimit){
              self.submitData['redpackParamsVO.minMoney'] = self.ruleForm.redLimit;
              self.submitData['redpackParamsVO.maxMoney'] = self.ruleForm.redLimitMax;
            }
          }
          if(!self.secrecyMsgStatus){
            self.submitData['tbXyhDynamicinfoPO.isDisplayCoverImage'] = self.showTextChecked ? 0 : 1;
            self.submitData['tbXyhDynamicinfoPO.isOpen'] = self.openShareStatus ? 1 : 0;
            self.submitData['tbXyhDynamicinfoPO.isWatermark'] = self.msgBgWatchmarkStatus?1:0;
            self.submitData['tbXyhDynamicinfoPO.coverImage'] = self.uploadImgObj.imageURL;
            if(self.openShareStatus){
              self.submitData['tbXyhDynamicinfoPO.shareComment'] = self.showCommentStatus ? 1 : 0;
            }
          }else{
            self.submitData['tbXyhDynamicinfoPO.coverImage'] = '/themes/default/images/qw/secret.jpg';
          }
        }else if(self.msgTypeIndex==1){
          self.submitData['tbXyhDynamicinfoPO.isDisplayCoverImage'] = self.showTextChecked ? 0 : 1;
          self.submitData['tbXyhDynamicinfoPO.coverImage'] = self.uploadImgObj.imageURL;
          self.submitData['tbXyhDynamicinfoPO.thirdPartTips'] = self.ruleForm.hint || '道一云|企微正在为您导航';
        }
        console.log(self.submitData);
        saveObj[type]();
      },
      //百度编辑器失去焦点回调事件
      textBlur(value){
        this.ruleForm.text = value;
      },
      //提交验证(包括保存草稿和发布)
      submitForm(formName,type){
        let self = this;
        this.$refs[formName].validate((valid) => {
            // 判断特定对象是否为空
            let isChecked = valid
            if(!self.useRadio){
                // dataBase.top_alert('请选择发布对象',false,3000);
                self.isShowUser = true
                self.userTip = '请选择发布对象'
                isChecked = false
            }
            // 特定对象不能为空
            if (self.useRadio==='特定对象' && (self.deptsPublic == "" && self.usersPublic == "" && self.tagsPublic == "")) {
                self.isShowUser = true
                self.userTip = '特定对象不能为空'
                isChecked = false
            }

            // 类型不能为空
            if(!self.selectValType.name) {
                self.isShowType = true
                isChecked = false
            } else {
                self.isShowType = false
            }

          if(isChecked){
            self.submitHandler(type);
          }else{

          }
        });
      },
      redEnvelopesRadio(val){
        this.isShowRedLimit = val === 'fightRed';
      },
      summaryInput(val){
        this.previewText = val;
      },
      titleInput(val){
        this.previewTitle = val;
      },
      addressInput(val){
      },
      hintInput(val){

      },
      changeRedRadio(val){
        if(val==='特定对象'&&!_.isVipSilver(this.interfaceCode)) {
          setTimeout(()=>{
            document.querySelector('#a1').click();
          },0);
          _._alertVip();
          return;
        }
        this.useRedRadio = val;
      },
      //返回的部门、标签、人员数组（定向红包）
      chooseRedDone:function (dept=[],tag=[],user=[]) {
        let deptsArr = [];
        let usersArr = [];
        let tagsArr = [];
        dept.forEach(function(item){
         // deptsArr.push(item.nodeId);
          deptsArr.push(item.nodeId || item.deptId);
        });
        user.forEach(function(item){
          usersArr.push(item.userId);
        });
        tag.forEach(function(item){
          let tagId = item.id || item.tagId;
          tagsArr.push(tagId);
        });
        this.depts = deptsArr.join('|');
        this.users = usersArr.join('|');
        this.tags = tagsArr.join('|');
      },
      changeRadio(val){
        if(val==='所有人'){
            _.alert('提示', '所有人指本企业号里所有人，包含主机厂和经销商人员')
        }
        this.isShowUser = false
        this.useRadio = val;
      },
      //返回的部门、标签、人员数组（发布对象）
      chooseDone:function (dept=[],tag=[],user=[]) {
        let deptsArr = [];
        let usersArr = [];
        let tagsArr = [];
        dept.forEach(function(item){
          //deptsArr.push(item.nodeId);
          deptsArr.push(item.nodeId || item.deptId);
        });
        user.forEach(function(item){
          usersArr.push(item.userId);
        });
        tag.forEach(function(item){
          let tagId = item.id || item.tagId;
          tagsArr.push(tagId);
        });
        this.deptsPublic = deptsArr.join('|');
        this.usersPublic = usersArr.join('|');
        this.tagsPublic = tagsArr.join('|');

        if (this.deptsPublic == "" && this.usersPublic == "" && this.tagsPublic == "") {
            this.isShowUser = true
            this.userTip = '特定对象不能为空'
        } else {
            this.isShowUser = false
        }
      },
      showTextChange(status){
      },
      coverImg(obj){
        this.uploadImgObj = obj;
        this.previewImg = this.uploadImgObj.imageURL
          ? _.compressURL + this.uploadImgObj.imageURL
          : require('assets/images/icon_default_cover_img.png');
      },
      msgBgWatchmarkStatusChange(status){
        if(this.isOpenWaterMark === 1){
          _.alert('提示', '管理后台开启全局水印，不能关闭消息背景水印');
          return;
        }
        this.msgBgWatchmarkStatus = status;
      },
      pushWaitNoticeStatusChange(status){
        this.pushWaitNoticeStatus = status;
      },
      sendMsgNotifyStatusChange(status){
        this.sendMsgNotifyStatus = status;
      },
      setTopStatusChange(status){
        this.setTopStatus = status;
      },
      openCommentStatusChange(status){
        this.openCommentStatus = status;
      },
      pointToPointStatusChange(status){
        this.pointToPointStatus = status;
      },
      secrecyMsgStatusChange(status){
        if(status){
          this.previewImg = require('assets/images/icon_secret.jpg');
        }else{
          this.previewImg = this.uploadImgObj.imageURL
            ? _.compressURL + this.uploadImgObj.imageURL
            : require('assets/images/icon_default_cover_img.png');
        }
        this.secrecyMsgStatus = status;
      },
      openShareStatusChange(status){
        this.openShareStatus = status;
      },
      showCommentStatusChange(status){
        this.showCommentStatus = status;
      },
      grantRedStatusChange(status){
        this.grantRedStatus = status;
      },
      goBack(){
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/');
      },
      selectItemType(optionName, val){
        this.selectValType.name = optionName;
        this.selectValType.idx = val;
        this.isShowType = false
      },
      selectItemMsgType(optionName, val){
        if(val == 1&&!_.isVipSilver(this.interfaceCode)) {
          _._alertVip('第三方页面跳转');
          this.selectValMsgType = {
            name: '图文消息',
            idx: 0
          }
          return;
        }
        this.msgTypeIndex = val;
      }
    },
    components:{
      qwuiButton,
      qwTitle,
      qwForm,
      qwFormItem,
      qwuiInput,
      qwuiSelect,
      qwFunctionBox,
      qwuiSwitch,
      qwUploadImg,
      qwuiCheckbox,
      pickExam,
      Editor,
      qwCoverImgPreview,
      qwuiRadio,
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

  .qwui-timing_content /deep/ .datepicker-popup{
    position:fixed;
  }
  .qwui-time_tip{
    padding-top: 10px;
    color: #f56c6c;
    text-align: center;
  }

  .qwui-col{
    display: table-cell;
    box-sizing: border-box;
  }
  .qwui-col-11{
    width: 45%;
  }
  .qwui-col-2{
    width: 10%;
  }

  .qwui-tips{
    position: absolute;
    top: 5px;
    left: 300px;
    width: 700px;
    color: #999;
  }

  .qwui-add_wrap{
    padding-top: 20px;
    .qwui-nav_wrap{
      padding-bottom: 15px;
    }
    .qwui-main_wrap{
      position: relative;
      padding-top: 20px;
      .qwui-timing_tip{
        position: absolute;
        left: 307px;
        top: 7px;
        width: 700px;
        font-size: 10px;
        color: red;
      }
      .qwui-total_amount{
        font-family: 'Arial Normal', 'Arial';
        font-weight: 400;
        font-size: 32px;
        color: #333333;
        text-align: left;
        line-height: normal;
      }
      .qwui-img_wrap{
        display: flex;
        .qwui-img_item{
          position: relative;
          width: 50px;
          height: 50px;
          margin-right: 10px;
          .qwui-img_close{
            position: absolute;
            right: -8px;
            top: -8px;
            width: 16px;
            height: 16px;
            text-align: center;
            border-radius: 50%;
            cursor: pointer;
            background: url(~assets/images/ic_b-delet.png) no-repeat;
            background-size:16px 16px;
            &:hover{
              background: url(~assets/images/ic_b-delet_hover.png) no-repeat;
            }
          }
        }
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
    .qwui-line{
      position: relative;
      height: 1px;
      background: #eee;
      margin-bottom: 20px;
    }
  }
</style>

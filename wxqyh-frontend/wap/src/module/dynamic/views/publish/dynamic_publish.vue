<template>
    <div class="wrap">
        <!--标题和类型-->
        <data_detail agent="dynamic" :dataDetailMsg="add_nav" :isUseUeditor="isUseUeditor" :selectTypeTitle="selectTypeTitle"
            :contentMaxLength="contentMaxLength" @listenToChild="showMsgFromDataDetail"></data_detail>
        <!--上传图片-->
        <img_detail agent="dynamic" :dataDetailMsg="add.imgUpload" @listenToChild="showMsgFromImgDetail" v-if="!isUseUeditor"></img_detail>
        <!--上传语音音频-->
        <voice_detail :dataDetailMsg="add.voiceUpload" @listenToChild="showMsgFromVoiceDetail" v-if="!isUseUeditor"></voice_detail>
        <!--上传附件-->
        <file_detail :dataDetailMsg="add.fileUpload" @listenToChild="showMsgFromFileDetail" v-if="!isUseUeditor"></file_detail>
        <!--发布对象-->
        <div class="qwui-detaildata">
            <div class="qwui-inner_f_item qwui-flexbox">
            <span class="qwui-item_title">发布对象</span>
            <a href="javascript:;" class="qwui-inner_item mt15" @click="personSelectShow = true">
                {{handleRange}}
                <span class="qwui-click_icon qwui-click_icon_right"></span>
            </a>
            </div>
        </div>
        <!--高级设置-->
        <advanced_setting :dataDetailMsg="add.advancedSetting"
            @clickIndex="advancedSettingclickIndex"
            @listenToChild="showMsgFromAdvancedSetting"></advanced_setting>
        <!--操作按钮-->
        <button_group>
            <button_item type="default" text="保存为草稿" @buttonClick="checkCommit('0')" v-show="isShowSaveBtn"></button_item>
            <button_item type="primary" text="立即发布" @buttonClick="checkCommit('1')"></button_item>
        </button_group>
        <!--选择发布对象-->
        <user_select_radio
            :boxShow.sync="personSelectShow"
            :options="rangeConfig"
            :checked="rang"
            @confirmSelected="confirmSelectPerson"
            ></user_select_radio>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import data_detail from '@/components/add/add_title';
import img_detail from '@/components/add/add_img';
import voice_detail from '@/module/dynamic/components/dynamicPublish/add_voice';
import file_detail from '@/components/add/add_file';
import user_select_radio from '@/module/dynamic/components/dynamicPublish/user_select_radio';
import advanced_setting from '@/components/add/advanced_setting';
import button_group from '@/components/base/button/button_group';
import button_item from '@/components/base/button/button';
import addUpdate from '../../js/add';
import {getPermission,
    getEditDynamicType,
    getDeptAndUser,
    getDynamicDetail,
    saveAndpublishDynamic,
    checkIsOpenWaterMark} from '../../api/getData';
import {isVipSilver, isVipGold,checkOpenShare} from '@/assets/js/vip-portal';
import { setTimeout } from 'timers';
import dynamicAudit from '../../js/dynamicAudit';

// 提交发布对象范围
const RANGECONFIG = {
    '1': {
        'text': '所有人',
        'value': '所有人'
    },
    '2': {
        'text':'本部门(含可见的上级部门和子部门)',
        'value': '本部门'
    },
    '3': {
        'text': '特定对象',
        'value': '特定对象',
    }
}
export default {
    data(){
        return{
            dataBase,
            add_nav:{   //数据详情头部信息
                nav: '类型',
                title: '',
                titlePlaceholder: '请输入标题（100字以内）',
                content: '',
                contentPlaceholder: '请输入正文',
                templateTypeId: '',
                templateType:[],
                isDisabled: false,
                moreFunctions: [],
                summaryContent: ''
            },
            contentMaxLength: 60000,
            selectTypeTitle: '请选择类型',
            secretImg: '/themes/default/images/qw/secret.jpg',   //保密默认图片
            draftDetail: addUpdate.draftDetail, // 详情
            add: addUpdate.add,       // 传入组件的详情数据
            commitDraft: addUpdate.draftDetail.commitDraft,  // 提交参数
            personSelectShow: false,  // 选择发布对象
            rangeConfig: RANGECONFIG,
            isUseUeditor: false,      //是否启用富文本
            addOrUpdateUrl: '',       //提交接口
            dynamicId: '',            // 详情id
            isCopy: false,            // 是否为复制
            status: '',               // 详情状态（发布/草稿）
            isShowSaveBtn: true,      // 是否显示保存草稿按钮
            isDynamicReview: null,    // 该新闻类型是否需要审核
            isOpenWaterMark: 0,   // 是否开启了全局水印
        }
    },
    computed: {
        ...mapGetters(['rang']),
        // 发布对象
        handleRange(){
            if(!RANGECONFIG[this.rang]) {
                return '所有人';
            } else {
                return RANGECONFIG[this.rang].value;
            }
        },
        belongAgent() {
            return _.getUrlParam('agentCode');
        }
    },
    watch:{
        'isOpenWaterMark'(newVal){
            if(newVal == '1') {
                this.updateWaterParam();
            }
        }
    },
    mounted(){
        var self = this;
        // 根据用户vip权限限制正文字数
        if(isVipGold(interfaceCode.INTERFACE_CODE_DYNAMIC)){ //是金卡
            self.contentMaxLength = 1000000;
        } else if(isVipSilver(interfaceCode.INTERFACE_CODE_DYNAMIC)){
            self.contentMaxLength = 500000;
        } else {
            self.contentMaxLength = 60000;
        }
        if(self.$route.query.id){ // 如果有id，说明是复制或者编辑功能
            self.dynamicId = self.$route.query.id;
            self.isCopy = self.$route.query.isCopy;
        } else { //没有id，则为新增 清除数据
            self.$store.commit('updateRang','1'); // 默认所有人
            self.commitDraft.draftFormData = {
                'userId': '',
                'tbXyhDynamicinfoPO.dynamicTypeId': '',
                'tbXyhDynamicinfoPO.title': '',
                'tbXyhDynamicinfoPO.summary': '',
                'tbXyhDynamicinfoPO.content': '',
                'tbXyhDynamicinfoPO.coverImage': '',
                'deptIds': '',
                'userIds': '',
                'tagIds': '',
                'mediaStr': '',
                'imageUrlStr': '',
                'tbXyhDynamicinfoPO.voiceId': '',
                'range': '1',
                'tbXyhDynamicinfoPO.isSecret': 0,
                'tbXyhDynamicinfoPO.isDisplayCoverImage':0,   // 开启0 关闭1
                'tbXyhDynamicinfoPO.isComment': 0,            // 开启0 关闭1
                'tbXyhDynamicinfoPO.isSendMsg': 1,
                'tbXyhDynamicinfoPO.isOpen': 0,
                'tbXyhDynamicinfoPO.shareComment': 0,
                'tbXyhDynamicinfoPO.isSendTodo': 1,
                'tbXyhDynamicinfoPO.isWatermark':0
            };
            // 高级设置初始化
            self.add.advancedSetting.switchControl = [ // 内容
                {content: '保密信息', onOff: false, show:true},
                {content: '将封面图片（第一张显示在正文中）', onOff: true, show:true},
                {content: '开启评论功能', onOff: true, show:true},
                {content: '发布时发送通知信息', onOff: true, show:true},
                {content: '开启外部分享', onOff: false, show:true},
                {content: '外部分享显示评论', onOff: false, show:false},
                {content: '推送待办通知', onOff: true, show:true},
                {content: '消息背景水印', onOff: false, show:true}
            ];
        }
        self.checkIsOpenWaterMark();
        // 发布权限
        self.getPermissionAction();
        // 获取新闻类型
        self.getDynamicType();
    },
    methods:{
        checkIsOpenWaterMark(){
            let self = this;
            // 获取是否开启全局水印
            checkIsOpenWaterMark(self.belongAgent,(data)=>{
                self.isOpenWaterMark = data.isOpenWaterMark;
            });
        },
        //获取发布权限
        getPermissionAction(){
            var self = this;
            getPermission(self.dynamicId, (result)=>{
                if(result.code!='0' || !result.data.hasPermission){
                    var btn={
                        primaryBtn:{name:'确定', callBack:()=>{
                            self.goBack();
                        }},
                        defaultBtn:{name:"", callBack:null},
                    };
                    _.alert('提示','亲爱的用户，你没有权限发布动态，请联系管理员',btn);
                }
            })
        },
        //复制或编辑 初始化
        initDraftData(){
            var self = this;
            let dataPost = {
                'belongAgent': self.belongAgent,
                'id': self.dynamicId,
                'size': 10
            }
            getDynamicDetail(dataPost, (result)=>{
                var detail = result.data;
                var info = result.data.tbXyhDynamicinfoPO;
                // 设置基本信息
                self.status = info.status;
                self.add_nav.title = info.title;
                self.add_nav.content = info.content;
                self.add_nav.templateTypeId = info.dynamicTypeId;
                self.commitDraft.draftFormData['tbXyhDynamicinfoPO.dynamicTypeId'] = info.dynamicTypeId;

                // 标记该新闻类型是否还存在
                var flag = false;
                // 是否为审核新闻
                self.add_nav.templateType.forEach((item,index)=>{
                    if(item.id==info.dynamicTypeId){
                        self.isDynamicReview = item.isDynamicReview;
                        flag = true;
                    }
                });
                // 新闻类型不存在，置空
                if(!flag){
                    self.isDynamicReview = null;
                    self.add_nav.templateTypeId = '';
                    self.commitDraft.draftFormData['tbXyhDynamicinfoPO.dynamicTypeId'] = '';
                }

                // 已发布的编辑隐藏 保存为草稿按钮
                if(self.status=="发布"&&!self.isCopy){
                    self.isShowSaveBtn = false;
                }
                // 图片列表
                if(detail.images.length > 0) {
                    detail.images.forEach((item)=>{
                        item.picPath = item.path;
                    });
                }
                if(info.isSecret!= '1'){
                    //非保密图片的时候，才要设置封面图片，保密图片的封面图片是固定的，不wxqyh_uploadfile显示到图片列表里
                    if(info.coverImage!=""&&info.coverImage!=null){
                        var obj = {
                            picPath: info.coverImage
                        }
                        detail.images.unshift(obj);
                    }
                }
                // 图片
                self.add.imgUpload.picList = detail.images;
                // 附件列表
                self.add.fileUpload.mediaList = detail.mediaList;
                self.add.fileUpload.agent = self.dataBase.wxqyh_uploadfile.agent;
                // 语音
                if(detail.videoPO){
                    let obj = [detail.videoPO];
                    self.add.voiceUpload.mediaList = obj;
                    self.add.voiceUpload.agent = self.dataBase.wxqyh_uploadfile.agent;
                }
                self.$store.commit('updateRang',info.ranges);
                self.commitDraft.draftFormData["range"] = info.ranges;
                if(info.ranges == '3') { // 发布对象为特殊对象兼容旧数据格式要转化
                    self.commitDraft.draftFormData['deptIds'] = info.departids;
                    self.commitDraft.draftFormData['userIds'] = info.sendTarget;
                    self.commitDraft.draftFormData['tagIds'] = info.tagIds;
                    if(detail.selectTagVOList.length > 0) {
                        detail.selectTagVOList.forEach((item)=>{
                            item.id = item.tagId;
                        })
                    }
                    self.dataBase.selectConfig.selectList['toPersonList'].userSelected = detail.selectUserVOList;
                    self.dataBase.selectConfig.selectList['toPersonList'].deptSelected = detail.selectDeptVOList;
                    self.dataBase.selectConfig.selectList['toPersonList'].tagSelected = detail.selectTagVOList;
                }
                self.initSetting(info);
            });
        },
        // 初始化高级设置
        initSetting(data){
            var self = this;
            // 设置参数
            self.commitDraft.draftFormData['tbXyhDynamicinfoPO.isSecret'] = data.isSecret;
            self.commitDraft.draftFormData['tbXyhDynamicinfoPO.isDisplayCoverImage'] = data.isDisplayCoverImage;
            self.commitDraft.draftFormData['tbXyhDynamicinfoPO.isComment'] = data.isComment;
            self.commitDraft.draftFormData['tbXyhDynamicinfoPO.isSendMsg'] = data.isSendMsg;
            self.commitDraft.draftFormData['tbXyhDynamicinfoPO.isOpen'] = data.isOpen;
            self.commitDraft.draftFormData['tbXyhDynamicinfoPO.shareComment'] = data.shareComment;
            self.commitDraft.draftFormData['tbXyhDynamicinfoPO.isSendTodo'] = data.isSendTodo;
            self.commitDraft.draftFormData['tbXyhDynamicinfoPO.isWatermark'] = data.isWatermark;
            // 设置开关显示状态
            self.add.advancedSetting.switchControl.forEach((item,index)=>{
                let name = self.add.switchText[index];
                if(name === 'isDisplayCoverImage' || name === 'isComment'){
                    item.onOff = data[name] == '0';
                } else {
                    item.onOff = data[name] == '1';
                }
                //保密消息开启时隐藏“将封面图片（第一张显示在正文中）”，“开启外部分享”设置
                if(name === 'isDisplayCoverImage' || name === 'isOpen') {
                    item.show = data.isSecret == '0';
                }
                //外部分享开启时显示“外部分享显示评论”
                if(name === 'shareComment') {
                    item.show = data.isOpen == '1';
                }
            });
            if(self.isOpenWaterMark===1){
                self.updateWaterParam();
            }
        },
        // 新闻类型
        getDynamicType(){
            var self=this;
            getEditDynamicType((result)=>{
                if(result.data.list <= 0){
                    self.selectTypeTitle = '请选择类型(后台可设置类型)';
                }
                for(let i=0;i< result.data.list.length;i++){
                    var temp =  result.data.list[i];
                    temp.name = temp.typeName;
                }
                self.add_nav.templateType = result.data.list;
                if(self.$route.query.id){ // 如果有id，说明是复制或者编辑功能
                    self.initDraftData();
                }
            });
        },
        // 根据全局水印更改高级设置的
        updateWaterParam(){
            let self = this;
            self.commitDraft.draftFormData['tbXyhDynamicinfoPO.isWatermark'] = self.isOpenWaterMark;
            self.add.advancedSetting.switchControl[7].onOff = self.isOpenWaterMark == 1;
        },
        // 点击保存或发布按钮
        checkCommit(status) {
             var self = this;
            //注册必须大于1个月才能保存外部
            if(self.commitDraft.draftFormData['tbXyhDynamicinfoPO.isOpen']=="1"&& !checkOpenShare()){
                return;
            }
            self.commitDraft.draftFormData["tbXyhDynamicinfoPO.title"] =  self.add_nav.title;
            self.commitDraft.draftFormData["tbXyhDynamicinfoPO.content"] =  self.add_nav.content;
            self.commitDraft.draftFormData["tbXyhDynamicinfoPO.summary"] =  '';
            self.commitDraft.draftFormData["range"] = self.rang;
            // 摘要-截取内容
            if(self.commitDraft.draftFormData["tbXyhDynamicinfoPO.summary"]==''){
                if(self.add_nav.content.length>54){
                    self.commitDraft.draftFormData["tbXyhDynamicinfoPO.summary"] = self.add_nav.content.substring(0, 54);
                } else {
                    self.commitDraft.draftFormData["tbXyhDynamicinfoPO.summary"] = self.add_nav.content;
                }
            }
            // 立即发布需要校验
            if(status == '1') {
                if(self.commitDraft.draftFormData['tbXyhDynamicinfoPO.dynamicTypeId'] == ''){
                _.alert("提示","请选择类型");
                    return;
                } else if(self.commitDraft.draftFormData["tbXyhDynamicinfoPO.title"] == ''){
                    _.alert("提示","请输入标题（100字以内）");
                    return
                } else if(self.commitDraft.draftFormData["tbQyDiaryPO.content"] == ''){
                    _.alert("提示","请输入正文");
                    return
                }
                // 发布对象
                if(self.rang == ''){
                    _.alert('提示', '您未选择发布对象');
                    return;
                }
                if(self.rang == '3'&& self.commitDraft.draftFormData['deptIds']==''&&self.commitDraft.draftFormData['userIds']==''
                    &&self.commitDraft.draftFormData['tagIds']==''){
                    _.alert('提示', '您未选择任何部门或人');
                    return;
                }
                // 设置请求接口地址 -新建、复制
                if(!self.dynamicId || self.isCopy){
                    self.addOrUpdateUrl = self.add.publish.url + self.belongAgent + '&fileType=0';
                } else { // 编辑
                    let editUrl = self.add.publish.url + self.belongAgent + '&id=' + self.dynamicId + '&status='+ self.status;
                    self.addOrUpdateUrl = self.status == '草稿' ? editUrl + '&fileType=0': editUrl + '&fileType=1';
                }
                // 点击发布需要二次确认
                var buttonConfig = {
                    primaryBtn:{name:self.isShowSaveBtn ?"发布":'确定', callBack:()=>{
                        self.update(status);
                    }},
                    defaultBtn:{name:"取消", callBack:null},
                };
                var title = self.isShowSaveBtn ? '提示':'确认提交修改？';
                var tip = self.isShowSaveBtn ? '是否确定发布动态？': '修改成功后，用户将看到更新后的内容';
                _.alert(title,tip,buttonConfig)
            } else{
                // 保存草稿
                if(self.commitDraft.draftFormData['tbXyhDynamicinfoPO.dynamicTypeId'] == ''){
                    _.alert("提示","请选择类型");
                    return;
                }
                // 设置请求接口地址
                let updateUrl = self.add.save.url + self.belongAgent + '&filetype=0';
                self.addOrUpdateUrl = !self.dynamicId || self.isCopy ? updateUrl : updateUrl + '&id=' + self.dynamicId;
                self.update(status);
            }

        },
        // 保存&发布
        update(status){
            var self = this;
            saveAndpublishDynamic(self.addOrUpdateUrl, self.commitDraft.draftFormData, (result)=>{
                if(status == '1') {
                    // 无需审核，给出提示，跳到新闻公告主界面
                    if(self.isDynamicReview == 0) {
                        _.tooltips_succeed('发布成功');
                        setTimeout(()=>{
                            self.$router.push({
                                path: '/index'
                            });
                        },1000);
                    // 需要审核，跳到我发布的“待审核”界面
                    } else {
                        dynamicAudit.nav.index = 0; //设置在“待审核”tab
                        self.$router.push({
                            path: '/actionList',
                            query: {
                                data: '3'
                            }
                        })
                    }
                } else {
                    // 跳到我编辑的
                    self.$router.push({
                        path: '/actionList',
                        query: {
                            data: '4'
                        }
                    })
                }
            });
        },
        // 切换新闻类型
        showMsgFromDataDetail(val){
            var self=this;
            if(val){
                // 该新闻类型是否需要审核
                self.isDynamicReview = val.isDynamicReview;
                self.commitDraft.draftFormData['tbXyhDynamicinfoPO.dynamicTypeId'] = val.id;
            } else {
                self.isDynamicReview = null;
                self.commitDraft.draftFormData['tbXyhDynamicinfoPO.dynamicTypeId'] = '';
            }
        },
        // 图片列表
        showMsgFromImgDetail(imgUrl){
            this.commitDraft.draftFormData['imageUrlStr'] = '';
            this.commitDraft.draftFormData['imageUrlStr'] = imgUrl.join(',');
        },
        // 语音上传
        showMsgFromVoiceDetail(voiceId){
            this.commitDraft.draftFormData['tbXyhDynamicinfoPO.voiceId'] = voiceId[0];
        },
        // 附件上传
        showMsgFromFileDetail(mediaId){
            this.commitDraft.draftFormData['mediaStr'] = mediaId.join(',');
        },
        // 选择发布对象后
        confirmSelectPerson(radioVal) {
            var self = this;
            self.commitDraft.draftFormData["range"] = radioVal;
            self.commitDraft.draftFormData['deptIds'] = self.dataBase.selectConfig.selectList["toPersonList"].deptSelected.map(value=>{
                return value.id || value.deptId
            }).join('|');
            self.commitDraft.draftFormData['userIds'] = self.dataBase.selectConfig.selectList["toPersonList"].userSelected.map(value=>{
                return value.userId
            }).join('|');
            self.commitDraft.draftFormData['tagIds'] = self.dataBase.selectConfig.selectList["toPersonList"].tagSelected.map(value=>{
                return value.id
            }).join('|');
        },
        // 回调高级设置所操作的下标签
        advancedSettingclickIndex(index){
            let self = this;
            // 操作消息背景水印的 并且全局水印开启了
            if(index == 7 && self.isOpenWaterMark === 1) {
                 _.alert('提示','管理后台开启全局水印，不能关闭消息背景水印');
            }
        },
        // 高级设置 0-关闭 1-开启 （封面图片，评论功能：0-开启，1-关闭）
        showMsgFromAdvancedSetting(prioty, switchControl){
            var self = this;
            self.add.advancedSetting.switchControl.forEach((item,index)=>{
                let name = self.add.switchText[index];
                 //保密消息开启时隐藏“将封面图片（第一张显示在正文中）”，“开启外部分享”，“水印”设置
                 if(name === 'isDisplayCoverImage' || name === 'isOpen' || name === 'isWatermark') {
                     item.show = switchControl[0] == 0;
                     item.onOff = switchControl[0] == 1 ? false : item.onOff;
                     switchControl[index] = switchControl[0] == 1 ? 0 : switchControl[index];
                 }
                 if(name === 'shareComment') {
                     item.show = switchControl[4] == 1;
                     item.onOff =  switchControl[4] == 0? false:item.onOff;
                     switchControl[index] = switchControl[4] == 0 ? 0 :  switchControl[index];
                 }
            });
            // 保密图片设置
            self.commitDraft.draftFormData['tbXyhDynamicinfoPO.coverImage'] = switchControl[0] == 1 ? this.secretImg:'';
            // 提交参数赋值（封面图片，评论功能需特殊处理）
            self.commitDraft.draftFormData['tbXyhDynamicinfoPO.isSecret'] = switchControl[0];
            self.commitDraft.draftFormData['tbXyhDynamicinfoPO.isDisplayCoverImage'] = switchControl[1] == 1 ? 0 : 1;
            self.commitDraft.draftFormData['tbXyhDynamicinfoPO.isComment'] = switchControl[2] == 1 ? 0 : 1;
            self.commitDraft.draftFormData['tbXyhDynamicinfoPO.isSendMsg'] = switchControl[3];
            self.commitDraft.draftFormData['tbXyhDynamicinfoPO.isOpen'] = switchControl[4];
            self.commitDraft.draftFormData['tbXyhDynamicinfoPO.shareComment'] = switchControl[5];
            self.commitDraft.draftFormData['tbXyhDynamicinfoPO.isSendTodo'] = switchControl[6];
            self.commitDraft.draftFormData['tbXyhDynamicinfoPO.isWatermark'] = switchControl[7];
            if(self.isOpenWaterMark === 1) {
                self.updateWaterParam();
            }
        },
        // 返回上一级
        goBack(){
            this.$router.go(-1);
        }
    },
    components: {
        data_detail,
        img_detail,
        voice_detail,
        file_detail,
        user_select_radio,
        advanced_setting,
        button_group,
        button_item
    }
}
</script>

<style scoped>
.qwui-detaildata{
    margin-top: 10px;
    padding-left:15px;
    background-color:#fff;
}
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
  .qwui-inner_f_item::before,.qwui-inner_f_item::after{
    content: '';
    position: absolute;
    left:0;
    top: 0;
    width: 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
  }
  .qwui-inner_f_item::before{
    border-top: 1px solid #e5e5e5;
  }
  .qwui-inner_f_item:after{
    border-bottom: 1px solid #e5e5e5;
  }
  .qwui-inner_item {
    margin-right: 15px;
    font-size: 16px;
    flex: 1;
    color: #666;
    text-align: right;
  }
  .qwui-click_icon {
    display: block;
    position: absolute;
    top: 3px;
    right: 15px;
    bottom: 0;
    margin: auto;
    width: 9px;
    height: 15px;
    background:0 0 url(~assets/images/CSSSprites.png) no-repeat;
    background-size: 100px 100px;
  }
  .qwui-click_icon.qwui-click_icon_right{
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
 }
</style>

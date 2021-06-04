<template>
    <div class="operation-btn"
        ref="operationBtn"
        @mouseover="operationOption = true"
        @mouseout="operationOption = false" >
        <div class="operation-icon iconfont"
            :class="['bd-ic_b-grouping_more_' + iconDirection, {'active': operationOption }]" ></div>
        <div class="operation-option" ref="operationOption" :style="operationDisplay" v-show="operationOption" >
            <!-- 外部单有权限，内部单无权限 -->
            <div v-if="isTask != 3 && formView"
                class="option"
                @click="preview">预览</div>
            <div v-else-if="formView" v-perm="'formOpenPreview'"
                class="option"
                @click="preview">预览</div>
            <!-- 做内外部单区分 -->
            <div v-if="isTask != 3 && showEdit" v-perm="'formAdd'&&'formEdit'"
                class="option"
                @click="edit">编辑</div>
            <div v-else-if="showEdit" v-perm="'formAdd'&&'formOpenEdit'"
                class="option"
                @click="edit">编辑</div>
            <!-- 做内外部单区分 -->
            <div v-if="isTask != 3 && showCopy" class="option" v-perm="'formCopy'"
                @click="copy">复制</div>
            <div v-else-if="showCopy" class="option" v-perm="'formOpenCopy'"
                @click="copy">复制</div>
            <!-- 做内外部单区分 -->
            <div v-if="isTask != 3 && showOpen" class="option" v-perm="'formOpen'"
                @click="open">启用</div>
            <div v-else-if="showOpen" class="option" v-perm="'formOpenOpen'"
                @click="open">启用</div>
            <!-- 做内外部单区分 -->
            <div v-if="isTask != 3 && showForbid" class="option" v-perm="'formShut'"
                @click="forbid">禁用</div>
            <div v-else-if="showForbid" class="option" v-perm="'formOpenShut'"
                @click="forbid">禁用</div>
            <!-- 做内外部单区分 -->
            <div v-if="isTask != 3 && showDel" class="option" v-perm="'formDel'"
                @click="del">删除</div>
            <div v-else-if="showDel" class="option" v-perm="'formOpenDel'"
                @click="del">删除</div>
            <div class="dataOption"
                @mouseover="dataOption = true" @mouseout="dataOption = false"
                v-show="showDataOption">数据报表
                <i class="drop-down-arrow" :class="dataOptionClass"></i>
                <div class="option-box" :style="dataDisplay" v-show="dataOption">
                    <div class="option" v-perm="'formPrintTemplate'"
                        @click="print"
                        v-if="showPrint" ref="printTemplate">自定义打印设置</div>
                    <div class="option" v-perm="'formOrder'"
                        @click="detail"
                        v-if="showDetail" ref="detail">表单明细数据</div>
                    <div class="option" v-perm="'formStatistics'"
                        @click="statReport"
                        v-if="showStatReport" ref="statistics">统计报表</div>
                    <div class="option"
                        @click="writing"
                        v-if="showWriting" ref="writing">填写情况</div>
                </div>
            </div>
            <div class="settingOption"
                @mouseover="settingOption = true" @mouseout="settingOption = false"
                v-show="showSettingOption">扩展
                <i class="drop-down-arrow" :class="settingOptionClass"></i>
                <div class="option-box" :style="settingDisplay" v-show="settingOption">
                    <div class="option"
                        @click="share"
                        v-if="showShare">分享</div>
                    <!-- 做内外部单区分 -->
                    <div v-if="isTask != 3 && showAuthorize" class="option" v-perm="'formlicensing'"
                        @click="authorize">表单授权</div>
                    <div v-else-if="showAuthorize" class="option" v-perm="'formOpenlicensing'"
                        @click="authorize">表单授权</div>
                    <div class="option"
                        @click="dataInterface"
                        v-if="showDataInterface">数据接口</div>
                    <div class="option" v-perm="'weixinapp'"
                        @click="wxApp"
                        v-if="showWxApp">生成小程序</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { forbidForm, openForm, delForm, gotoEditForm, getURL, checkFormAuthority} from '@/module/approval/api/form/index'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'operation',
    props: {
        formData: Object,
        iconDirection: {
            type: String,
            default: 'horizontal'
        },
        isOver: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            operationOption: false, // true：显示操作下拉框，false：隐藏
            dataOption: false, // true：显示数据报表下拉框，false：隐藏
            settingOption: false, // true：显示设置下拉框，false：隐藏
            operationDisplay: {},
            settingDisplay: {},
            dataDisplay: {},
            optionDisplay: false // true: 下拉框位置为右边, false: 下拉框位置为左边
        }
    },
    computed: {
        ...mapGetters([
            'roles',
        ]),
        ...mapGetters('form/index', [
          'isWhiteCorpId'
        ]),
        id() { return this.formData.definitionVersionsId },
        formName() { return this.formData.formName },
        isTask() { return this.formData.isTask },
        isCreate() { return this.formData.isCreate },
        startTime() { return this.formData.startTime },
        stopTime() { return this.formData.stopTime },
        lockValidTime() { return this.formData.lockValidTime },
        isLicensing() { return this.formData.isLicensing },
        count() { return this.formData.count },
        controlId() { return this.formData.controlId },
        shortUrl() { return this.formData.shortUrl },
        status() { return this.formData.status },
        formView() { return this.formData.formView == '1' },
        formEdit() { return this.formData.formEdit == '1' },
        formDelete() { return this.formData.formDelete == '1' },
        showPreview() { // 是否显示预览
            return this.formView;
        },
        showEdit() { // 是否显示编辑
            return this.formEdit;
        },
        showCopy() { // 是否显示复制
            return this.formView;
        },
        showOpen() { // 是否显示启用
            return this.formEdit && this.status == -1;
        },
        showForbid() { // 是否显示禁用
            return this.formEdit && this.status == 1;
        },
        showDel() { // 是否显示删除
            return this.formDelete;
        },
        showDataOption() { // 是否显示数据报表
            return this.showPrint || this.showDetail || this.showStatReport || this.showWriting;
        },
        showPrint() { // 是否显示自定义打印设置
            return this.formEdit && this.status != 2;
        },
        showDetail() { // 是否显示明细数据
            return this.formView && this.status != 2;
        },
        showStatReport() { // 是否显示统计报表
            return this.formView && this.count > 0 && this.status != 2;
        },
        showWriting() { // 是否显示填写情况
            return this.formView && this.isTask != 3 && this.status != 2;
        },
        showSettingOption() { // 是否显示扩展
            return this.showShare || this.showAuthorize || this.showDataInterface || this.showWxApp;
        },
        showShare() { // 是否显示分享
            return this.formEdit;
        },
        showAuthorize() { // 是否显示表单授权
            return this.hasFormAuthority();
        },
        showDataInterface() { // 是否显示数据接口
            return this.formView && this.status != 2;
        },
        showWxApp() { // 是否显示生成小程序
            return this.hasFormAuthority() && this.isTask == 3;
        },
        dataOptionClass() {
            return {
                active: this.dataOption,
                right: this.optionDisplay,
                left: !this.optionDisplay
            }
        },
        settingOptionClass() {
            return {
                active: this.settingOption,
                right: this.optionDisplay,
                left: !this.optionDisplay
            }
        }
    },
    mounted() {
        let _this = this
        if(_this.getOffset(_this.$refs.operationBtn, 'index', 'offsetLeft') < 200) { // 判断下拉框是放左边还是放右边
            this.optionDisplay = true;
        }
        this.operationDisplay = (function() { // 防止操作列表越位
            let count = _this.showDataOption ? '-90px' : '-64px',
                overHeight = false
            if(document.body.scrollHeight < window.innerHeight) {
                overHeight = window.innerHeight - _this.getOffset(_this.$refs.operationBtn, 'index', 'offsetTop') < 240
            } else {
                overHeight = document.body.scrollHeight - _this.getOffset(_this.$refs.operationBtn, 'index', 'offsetTop') < 240
            }
            if(overHeight) {
                return { left: count, bottom: 0 }
            } else {
                return { left: count }
            }
        })();
        this.settingDisplay = (function () { // 防止设置下拉框列表越位
            let count,
                wxApp = _this.showWxApp && _this.roles.weixinapp,
                share = _this.showShare,
                authorize = _this.showAuthorize && (_this.roles.formlicensing || _this.roles.formOpenlicensing),
                dataInterface = _this.showDataInterface;
            if(wxApp) {
                count = '-112px'
            } else if(authorize || dataInterface) {
                count = '-99px'
            } else if(share) {
                count = "-73px"
            }

            if(_this.optionDisplay) {
                return { right: count }
            } else {
                return { left: count }
            }
        })()
        this.dataDisplay = (function () {  // 防止数据下拉框列表越位
            let count,
                printTemplate = _this.showPrint &&  _this.roles.formPrintTemplate,
                detail = _this.showDetail && _this.roles.formOrder,
                statReport = _this.showStatReport && _this.roles.formStatistics,
                writing = _this.showWriting;
            if(printTemplate) {
                count = '-138px'
            } else if(detail) {
                count = "-125px"
            } else if(writing) {
                count = '-99px'
            }
            if(_this.optionDisplay) {
                return { right: count }
            } else {
                return { left: count }
            }
        })()
    },
    methods: {
        ...mapActions('form/index', [
            'GetFormData',
            'SetVipTips'
        ]),
        hasFormAuthority() { // 是否有该表单的管理权限（超管或者创建者）
            return this.isLicensing == 0
        },
        getOffset(currNode, parentId, offsetType) { // currNode: 当前节点 parentId: 父节点 offsetType: offsetLeft表示获取offsetLeft，offsetTop表示获取offsetTop
            let offset = 0
            while(currNode.id != parentId) {
                if(!currNode.offsetParent){
                    break
                }
                offset += currNode[offsetType]
                currNode = currNode.offsetParent
            }
            return offset
        },
        showPopFrame(url) {// 全局弹窗
            url = _.baseURL + url;
            if(_top.$('#popframe').length == 0) {
                _top.$('body').append('<iframe id="popframe" src=' + url + ' style="width:100%;height:100%;position: fixed;top: 0;left: 0;z-index:1000" frameborder="0" scrolling="no" allowtransparency="true"></iframe>')
            } else {
                _top.$('#popframe').show();
                _top.$('#popframe')[0].contentWindow.loadframe();
            }
        },
        locateTo(url) {
            window.location.href = _.baseURL + url;
        },
        locateToEditForm(id) {
            gotoEditForm(id).then(res => {
                if (res.code != '0') {
                    return _top.alert("错误提示", res.desc);
                }
                this.locateTo("/manager/form/form_info_main.jsp?agentCode=form&id=" + id + "&dqdp_csrf_token=" + _top.dqdp_csrf_token + "&operationType=update")
            })
        },

        /**
         * 判断用户是否启用了表单锁定
         * @param msg   提示信息
         * @return boolean  true: 启用了表单锁定， false: 未启用表单锁定
         */
        checkValid(msg = '') {
            var startTime = this.startTime,
                stopTime = this.stopTime,
                lockValidTime = this.lockValidTime,
                status = this.status;

            // 或者不是外部单或者表单是草稿 返回true
            if(this.isTask != 3 || status == "2") {
                return false
            }
            if(lockValidTime == "1") {
                var now = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
                if(startTime <= now && stopTime >= now) {
                    _top.top_alert("该表单已锁定 (" + startTime + " 至 " + stopTime + ")，" + msg, false)
                    return true
                }
            }
            return false
        },
        preview() { // 预览
            var ua = navigator.userAgent,
                id = this.id,
                isTask = this.isTask;

            ua = ua.toLocaleLowerCase();
            if(ua.indexOf('trident') > -1) {
              _top.alert("提示", "当前浏览器无法完美预览表单在手机上的展现，请使用谷歌Chrome、最新360、最新百度等对Html5兼容较好的浏览器，来获得最佳的预览效果！")
            } else {
              var bindWxUser = sessionStorage.getItem('bindWxUser' + wxqyhConfig.userName);
              if (bindWxUser == "true") {
                openPreview();
                return;
              }
              checkFormAuthority({id}).then(res => {
                if (!res.data.bindWxUser) {
                  _top._alert('提示', '预览表单功能已经升级，需绑定通讯录成员才能使用', function() {
                    _top.changeUser(0);
                  }, '立即绑定');
                  return;
                }
                sessionStorage.setItem( 'bindWxUser' + wxqyhConfig.userName, res.data.bindWxUser)
                openPreview();
              })
            }
            function openPreview() {
              var top = (window.screen.height-610)/2,
                left = (window.screen.width-520)/2;
              window.open(_.baseURL + '/vm/module/vpModule.html#/form/preview?id=' + id,'预览外部表单','left=' + left + ',top=' + top + ',height=580,width=380,toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no');
            }
        },
        edit() {  // 编辑
            var id = this.id,
                isTask = this.isTask,
                _this = this;

            if(this.checkValid('暂无法编辑')) {
                return
            }

            if(isTask == '3') {
                return this.locateTo("/manager/form/open_add_form.jsp?agentCode=form&id=" + id)
            } else {
                this.locateToEditForm(id)
            }
        },
        copy() { // 复制
            var id = this.id,
                isTask = this.isTask,
                isCheck1 = "",
                isCheck2 = "";

            if(isTask == 3) {//外部单
                isCheck2 = "checked='checked'"
            }else {
                isCheck1 = "checked='checked'"
            }
            var tmp='<div class="pop_wrap2" style="display: block;max-height:inherit"><div class="SS_tit">复制表单<i>×</i></div><div class="SS_main mt30" style="max-height:443px;overflow:auto">'
                    +'<div class="SS_item"><span class="mr30">复制类型：</span><div  class="orange"><label><input type="radio" class="mr5" name="copyType" ' + isCheck1 + ' value="1">内部表单</label>'
              +'<label class="ml20"><input type="radio" name="copyType" class="mr5" ' + isCheck2 + ' value="2">外部表单</label></div></div></div>'
                    +'<div class="SS_btn tac"><input type="button" value="确定" id="SS_pass" class="btn orangeBtn twoBtn mr10" /><input type="button"  value="关闭" id="SS_gb" class="btn twoBtn" ></div></div></div>'

            _top.$('.overlay').show()
            _top.$('body').append(tmp)
            _top.$('.SS_tit,#SS_gb',_top.document).on('click',function(){//取消
                _top.$('.overlay').hide()
                _top.$('.pop_wrap2').remove()

            });
            _top.$('#SS_pass',_top.document).on('click',function(){//保存并关闭        通过并保存
                var copyTypes = _top.document.getElementsByName("copyType")
                var copyType = ""
                for(var i = 0; i < copyTypes.length; i++) {
                    if(copyTypes[i].checked) {
                        copyType = copyTypes[i].value
                        break
                    }
                }
                if (copyType == "") {
                    return
                }
                _top.$('.overlay').hide()
                _top.$('.pop_wrap2').remove()
                if(copyType == '2') {
                    _top.frames['personFrame'].location = _.baseURL + "/manager/form/open_add_form.jsp?agentCode=form&id=" + id + "&method=copy"
                    return
                }
                _top.frames['personFrame'].location = _.baseURL + "/manager/form/form_info_main.jsp?agentCode=form&id=" + id + "&dqdp_csrf_token=" + _top.dqdp_csrf_token+"&operationType=copy"

            });
        },
        open() {  // 启用
            let _this = this,
                id = this.id;

            if(this.checkValid('暂无法启用')) {
               return
            }
            openForm(id).then(res => {
                if(res.code != "0") {
                    return _top.alert("信息提示层", res.desc)
                }
                this.$emit('open')
            })
        },
        forbid() { // 禁用
            let _this = this,
                id = this.id;

            if(this.checkValid('暂无法禁用')) {
                return
            }
            forbidForm(id).then(res => {
                if(res.code != "0") {
                    return _top.alert("信息提示层", res.desc)
                }
                this.$emit('forbid')
            })
        },
        del() { // 删除
            let _this = this,
                id = this.id;

            if(this.checkValid('暂无法删除')) {
                return
            }
            this.showPopFrame('/manager/form/form_delete.jsp?formName=' + this.formName + '&detailCount=' + this.count );
            _top.$('#popframe')[0].contentWindow.delForm = function () {
                delForm(id).then(res => {
                    if(res.code != "0") {
                        return _top.alert("信息提示层", res.desc)
                    }
                    _this.$emit('del')
                    _top.$('#popframe').remove();
                })
            }
        },
        wxApp() { // 生成小程序
            var id = this.id,
                formName = this.formName;

            this.showPopFrame("/manager/form/wxapp_preview.jsp?id=" + id + "&formName=" + formName);
        },
        print() { // 自定义打印设置
          var id = this.id, printUrl = '';
          if (this.isWhiteCorpId) {
            printUrl = _.baseURL + '/vm/module/customForm.html#/?definitionVersionsId=' + id + "&printType=0";
          } else {
            printUrl = _.baseURL + '/manager/form/customPrint.jsp?definitionVersionsId=' + id + "&printType=0";
          }
          window.open(printUrl);
        },
        detail() { // 表单明细
            var id = this.id,
                isTask = this.isTask,
                controlId = this.controlId,
                count = this.count;

            if(this.checkValid('暂无法查看表单明细')) {
                return
            }
            this.locateTo("/manager/form/detail_mx_listMain.jsp?id=" + id + "&isTask=" + isTask + "&controlId=" + controlId + "&countNum=" + count + "&objvalue=1");
        },
        statReport() { // 统计报表
            var id = this.id,
                controlId = this.controlId,
                isTask = this.isTask,
                count = this.count;

            if(this.checkValid('暂无法查看统计报表')) {
               return
            }
            if(_top.isVipGold(_top.interfaceCode.INTERFACE_CODE_FORM)){
                if(count == 0){
                    return _top.alert("提示","该表单没有明细数据，不能查看统计图表");
                }
                else {
                     this.locateTo("/manager/form/detail_mx_listMain.jsp?id=" + id + "&isTask=" + isTask + "&controlId=" + controlId + "&countNum=" + count + "&objvalue=2");// 1代表统计
                }
            }else{
                this.SetVipTips(true)
            }
        },
        writing() { // 填写情况
            var id = this.id,
                count = this.count;

            if(count == "0"){
         		    this.locateTo("/manager/form/form_not_writer.jsp?id=" + id);
         	  } else {
                this.locateTo("/manager/form/form_writer.jsp?id=" + id);
         	  }
        },
        share() { // 分享
            var shortUrl = this.shortUrl,
                id = this.id,
                isTask = this.isTask,
                title = this.formName;

            getURL(id, isTask).then(res => {
                if(res.code != "0") {
                    return _top.alert("信息提示层", res.desc)
                }
                let url = res.data.QrCode
                _top.share(url, title, 'form', isTask);
            })
        },
        authorize() { // 表单授权
            var id = this.id,
                formName = _top.filterString(this.formName);

            _top.showPopFrame( _.baseURL + '/manager/form/form_licensing.jsp?isBatch=0&groupIds=' + id + "&title="+ encodeURIComponent(encodeURIComponent(formName)))
        },
        dataInterface() { // 数据接口
            var id = this.id,
                formName = this.formName;

            let url = _.baseURL + "/manager/form/dataInter.jsp?id=" + id + "&formName=" + formName;
            if(_top.$('#popWindow').length == 0) {
                _top.$('body').append('<iframe id="popWindow" src=' + url + ' sandbox="allow-top-navigation allow-same-origin  allow-scripts  allow-forms allow-popups" style="width:100%;height:100%;position: fixed;top: 0;left: 0;z-index:1000" frameborder="0" scrolling="" allowtransparency="true"></iframe>')
            } else {
                _top.$('#popWindow').show();
                _top.$('#popWindow')[0].contentWindow.loadframe();
            }
        }
    },
    watch: {
        isOver(newVal) {
            let settingCount = this.settingDisplay.left || this.settingDisplay.right,
                dataCount = this.dataDisplay.left || this.dataDisplay.right;
            if(newVal) {
                this.optionDisplay = true;
                this.settingDisplay = {
                    right: settingCount
                }
                this.dataDisplay = {
                    right: dataCount
                }
            } else {
                this.optionDisplay = false;
                this.settingDisplay = {
                    left: settingCount
                }
                this.dataDisplay = {
                    left: dataCount
                }
            }
        }
    }
}
</script>

<style scoped>
    .operation-btn {
        position: relative;
        width: 30px;
        height: 30px;
        font-size: 13px;
        color: #444;
    }
    .operation-icon {
        position: absolute;
        color: #DEDEDE;
        line-height: 30px;
        font-size: 30px;
    }
    .operation-icon.active {
        color: #f87b00;
    }
    .operation-option {
        position: absolute;
        z-index: 1000;
        line-height: 30px;
        border: 1px solid #ccc;
        background-color: #fff;
        box-shadow: rgb(204, 204, 204) 0px 0px 10px;
    }
    .operation-option > div {
        box-sizing: content-box;
        padding: 0 20px 0 20px;
    }
    .dataOption {
        position: relative;
        cursor: pointer;
    }
    .dataOption:hover {
        background-color: #f5f5f5;
    }
    .settingOption {
        position: relative;
        cursor: pointer;
    }
    .settingOption:hover {
        background-color: #f5f5f5;
    }
    .operation-option .gray-arrow {
        position: absolute;
        left: 6px;
        top: 12px;
        width: 0;
        height: 0;
        border-width: 5px;
        border-style: solid;
        border-color: #999999 transparent transparent transparent;
    }
    .option-box {
        position: absolute;
        bottom: 0;
        z-index: 1000;
        line-height: 30px;
        border: 1px solid #ccc;
        background-color: #fff;
        box-shadow: rgb(204, 204, 204) 0px 0px 10px;
    }
    .option-box .option {
        padding: 0 30px 0 15px;
    }
    .option {
        cursor: pointer;
    }
    .option:hover {
        background-color: #f5f5f5;
    }
    .drop-down-arrow {
        position: absolute;
        width: 6px;
        height: 11px;
        top: 10px;
        transform: rotate(90deg);
        background: url(../../../../../../assets/images/ic_arrow.png) no-repeat;
        transition: all .3s;
    }
    .drop-down-arrow.right {
        right: 7px;
    }
    .drop-down-arrow.left {
        left: 7px;
    }
    .drop-down-arrow.right.active {
        transform:  rotate(0deg);
    }
    .drop-down-arrow.left.active {
        transform:  rotate(180deg);
    }
</style>

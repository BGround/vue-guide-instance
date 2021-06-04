<template>
    <div class="form-block" 
        :class="classForbidden">
        <img :src="thumbnail()"
            @error="noFind"
            @click="goToEdit"
            class="form-thumbnail"
            :class="{'forbidden': formData.status == -1}"
            title="进入编辑页面">
        <div class="form-authorization-state" 
            :class="classAuthorizationState" 
            :title="licensingTitle"></div>
        <div class="form-bottom">
            <div class="form-name ellipsis" 
                :title="formData.formName">{{formData.formName}}</div>
            <div class="form-info">
                <i class="form-icon iconfont" 
                    :class="'bd-biaodanliucheng_' + formTypeStyle[formData.isTask].className"
                    :style="{ 'color': formData.status == -1 ? '#999999' : formTypeStyle[formData.isTask].color}"></i>
                <span class="form-status">
                    <span class="form-detail" 
                        v-if="formData.status != 2"
                        @click="goToDetail"
                        @mouseover="hoverActive = true"
                        @mouseout="hoverActive = false">
                        <span class="form-detail-num" :class="{active: hoverActive}">{{formData.count}}</span>
                        <span class="form-detail-text" :class="{active: hoverActive}">明细</span>
                    </span>
                    <span class="form-detail-draft" v-show="formData.status == 2">草稿</span>
                    <span v-show="formData.status == -1">已禁用</span>
                </span>
            </div>
            <operation class="form-operation" @del="formDel" @forbid="formForbid" @open="formOpen" :isOver="isOver"
                :form-data="formData" icon-direction="vertical"></operation>
        </div>
    </div>
</template>

<script>
import operation from "./operation"
import { gotoEditForm } from '@/module/approval/api/form/index'
export default {
    name: 'formBlock',
    components: {
        operation
    },
    props: { formData: Object, isOver: Boolean },
    data() {
        return {
            formTypeStyle: [ // 表单类型图标的类名以及颜色
                { className: 'putongdan', color: '#5F9FF3' },
                { className: 'renwudan', color: '#FFAD42' },
                { className: 'shenpidan', color: '#F48265' },
                { className: 'waibudan', color: '#9FD457' },
            ],
            compressURL: dataBase.config.compressURL,
            defaultThumbnail: require('@/assets/images/pic_thumbnail_forbidden.svg'),
            hoverActive: false
        }
    },
    computed: {
        classForbidden() {
            return { 'forbidden': this.formData.status == -1 }
        },
        classAuthorizationState()  { // 授权状态样式对象
            let data = this.formData

            return {
                'authorizedByOthers': data.isLicensing == 1,
                'authorizedToOthers': data.isLicensing == 0 && data.hasLicensingToOther == 1
            }
        },
        licensingTitle() {
            let isLicensing = this.formData.isLicensing,
                hasLicensingToOther = this.formData.hasLicensingToOther;
            
            if(isLicensing == 1) {
                return '由其他管理员授权'
            } 
            else if(hasLicensingToOther == 1) {
                return '已授权给其他管理员'
            }
        }
    },
    methods: {
        // 表单缩略图
        thumbnail() {
            let thumbnail = this.defaultThumbnail;
            if(this.formData.thumbnail) {
                thumbnail = this.compressURL + this.formData.thumbnail
            }
            return thumbnail;
        },
        // 未能加载表单缩略图时，显示默认的缩略图
        noFind(e) {
            e.onerror = null;
            e.srcElement.src = require('@/assets/images/pic_thumbnail_forbidden.svg');
        },
        goToDetail () {
            let id = this.formData.definitionVersionsId,
                isTask = this.formData.isTask,
                status = this.formData.status,
                controlId = this.formData.controlId,
                count = this.formData.count;

            if(count == 0 && status == -2) {
                return ;
            }
            window.location.href = _.baseURL + "/manager/form/detail_mx_listMain.jsp?id=" + id + "&isTask=" + isTask + "&controlId=" + controlId + "&countNum=" + count + "&objvalue=1";
        },
        goToEdit() {
             var id = this.formData.definitionVersionsId,
                isTask = this.formData.isTask,
                isShowMsg = this.formData.isShowMsg,
                _this = this;

            if(this.checkValid('暂无法编辑')) {
                return
            }

            if(isTask == '3') {
                return window.location.href = _.baseURL + "/manager/form/open_add_form.jsp?agentCode=form&id=" + id;
            }
            else if(isShowMsg == "0") {
                _top.confirm("提示","超级管理员修改普通管理员提交的表单后，普通管理员不能再编辑该表单，确定要修改吗？", null,
                    {
                        ok: function () {
                            _this.locateToEditForm(id)
                        },
                        fail: function() {

                        }
                    });
            }
            else {
                this.locateToEditForm(id);
            }
        },
        /**
         * 判断用户是否启用了表单锁定
         * @param msg   提示信息
         * @return boolean  true: 启用了表单锁定， false: 未启用表单锁定
         */
        checkValid(msg = '') {
            var startTime = this.formData.startTime,
                stopTime = this.formData.stopTime,
                lockValidTime = this.formData.lockValidTime,
                status = this.formData.status;

            // 或者不是外部单或者表单是草稿 返回true
            if(this.formData.isTask != 3 || status == "2") {
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
        locateToEditForm(id) {
            gotoEditForm(id).then(res => {
                if (res.code != '0') {
                    return _top.alert("错误提示", res.desc);
                }
                window.location.href = _.baseURL + "/manager/form/form_info_main.jsp?agentCode=form&id=" + id + "&operationType=update";
            })
        },
        formDel() {
            this.$emit('del')
        },
        formOpen() {
            this.$emit('open')
        },
        formForbid() {
            this.$emit('forbid')
        }
    }
}
</script>

<style scoped>
.form-block {
    position: relative;
    width: 176px;
    border: 1px solid #EBEBEB;
    color: #333;
    margin: 0 12px 20px 0;
    background-color: #f5f5f5;
    transition: all .2s linear;
}
.form-block:hover {
    box-shadow: 0px 5px 20px 0px #DDDDDD;
}
.form-block:nth-child(5n) {
    margin-right: 0;
}
.form-block.forbidden {
    color: #999999;
}
.form-thumbnail {
    width: 160px;
    height: 135px;
    margin: 8px 9px 0 9px;
    background-size: cover;
    vertical-align: middle;
    cursor: pointer;
}
.form-authorization-state {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 18px;
    height: 18px;
}
.form-bottom {
    position: relative;
    padding: 5px 30px 5px 15px;
    border-top: 1px solid #EBEBEB;
    background-color: #fff;
}
.form-name {
    line-height: 24px;
    font-size: 15px;
}
.form-info {
    position: relative;
    line-height: 24px;
}
.form-icon {
    font-size: 16px;
    vertical-align: middle;
}
.form-status {
    font-size: 12px;
    line-height: 24px;
}
.form-detail {
    color: #999999;
    cursor: pointer;
}
.form-detail-num {
    display: inline-block;
    text-align: center;
    color: #333;
}
.form-detail .active {
    color: #F87B00;
}

.form-bottom .form-operation {
    position: absolute;
    top: 50%;
    right: 0;
    z-index: 1;
    transform: translateY(-50%);
}
.authorizedToOthers {
    background: url(../../../../../../assets/images/ic_authorizedToOthers.png) no-repeat;
}
.authorizedByOthers {
    background: url(../../../../../../assets/images/ic_authorizedByOthers.png) no-repeat;
}
</style>


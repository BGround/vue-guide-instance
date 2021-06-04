<template>
    <div id="oemLogin">
        <div class="qwui-wrap" :class="{'qwui-wrap_full': obj.isFull}"
            :style="{'background-image': obj.bgImg ? 'url(' + obj.bgImg + ')': ''}" >
            <div class="qwui-container">
                <!--顶部（图标、标题）-->
                <div class="qwui-header">
                    <img v-if="obj.picture" :src="obj.picture.url" class="qwui-header_logo"
                     :style="{'height': obj.picture.height, 'width': obj.picture.width}">
                    <span v-show="obj.name" class="qwui-header_text" :class="obj.nameClass">{{ obj.name }}</span>
                </div>
                <!--登录框-->
                <qw-login-box :tabsParam="obj.tabsParam"
                    :class="obj.loginBoxClass" :style="{'margin-top': obj.loginBoxMarginTop}"></qw-login-box>
            </div>
            <p v-show="obj.copyRight" class="qwui-footer">{{obj.copyRight}}</p>
        </div>
    </div>
</template>

<script>
import qwLoginBox from '@/module/login/components/loginBox';
import viewList from '@/module/login/js/menuData';
export default {
    name: 'oemLogin',
    components:{
        "qw-login-box": qwLoginBox
    },
    created() {
        // 初始化页面
        this.initData();
    },
    data() {
        return {
            obj: {},
        }
    },
    methods: {
        initData() {
            var url = decodeURIComponent(window.location.href);
            var routeName = _.getUrlParam(url, 'oem') || localStorage.getItem('oemName');
            this.obj = viewList[routeName];
        }
    },
}
</script>
<style scoped>
.qwui-wrap {
    position: absolute;
    top: 50%;
    width: 100%;
    min-width: 1000px;
    height: 648px;
    min-height: 648px;
    margin-top: -324px;
    background: url(~assets/images/oem_bg_login.jpg) no-repeat center;
}
.qwui-wrap_full {
    top: 0;
    height: 100%;
    margin-top: 0;
    background-size: cover;
    background-attachment: fixed;
}
.qwui-container {
    width: 960px;
    margin: 0 auto;
    padding: 30px 0 20px;
}
.qwui-header {
    color: #fff;
}
.qwui-header_logo,
.qwui-header_text {
    display: inline-block;
    vertical-align: middle;
}
.qwui-header_text {
    margin-left: 10px;
    font-size: 24px;
}
.qwui-footer {
    position: absolute;
    bottom: 20px;
    width: 100%;
    font-size: 12px;
    color: #fff;
    text-align: center;
}
/*
 * 动态添加样式
 */
.qwui-title_drcbank {
    position: absolute;
    top: 128px;
    margin-left: 25px;
    font-size: 28px;
    color: #ffa300;
}
.qwui-title_tchnt {
    margin: 24px 0 0 10px;
}
.qwui-title_yczxfj {
    margin-top: 20px;
}
/* ycwgh 登录框 */
.qwui-loginbox_ycwgh  >>> .qwui-loginbox {
    background: rgba(237,235,238,.8);
}
.qwui-loginbox_ycwgh  >>> .qwui-login_tabs li.active{
    border-bottom-color: #bf1c2d;
}
.qwui-loginbox_ycwgh  >>> .qwui-login_tab_content  .qwui-form_btn {
    background-color: #bf1c2d;
}
/* zjyd 登录框 */
.qwui-loginbox_zjyd >>> .qwui-loginbox {
    padding-top: 5px;
    background-color: #eff2f4;
    border: 1px solid #ccc;
    border-radius: 2px;
}
.qwui-loginbox_zjyd  >>> .qwui-login_tabs {
    border-bottom: 1px solid #ccc;
}
.qwui-loginbox_zjyd  >>> .qwui-login_tabs li.active{
    border-bottom-color: #0085d0;
}
.qwui-loginbox_zjyd  >>> .qwui-login_tab_content .qwui-form_ipt{
    margin-bottom: 20px;
    border: 1px solid #dbdbdb;
    border-radius: 2px;
}
.qwui-loginbox_zjyd  >>> .qwui-login_tab_content .qwui-form_btn {
    background-color: #0085d0;
}
/* eral登录框*/
.qwui-loginBox_eral >>> .qwui-loginbox_sec .qwui-login_tabs {
    margin: 0 10px;
}
.qwui-loginBox_eral >>> .qwui-login_tabs li {
    padding: 20px 0 0;
    border-bottom: none;
    cursor: default;
}
</style>


<!--登录过期弹窗显示模块-->
<template>
    <div id="overdueBox" class="qwui-overdue_wrap">
        <div class="qwui-overdue_overlayer">
            <div class="qwui-overdue_box ">
                <div class="qwui-overdue_container clearfix">
                    <img src="../../assets/images/dialog_icon_overdue_defalut.png" class="fl">
                    <div class="qwui-overdue_right fl">
                        <p class="qwui-overdue_title">登录状态过期  请重新登录</p>
                        1、<a class="qwui-overdue_link" target="_blank" :href="loginUrl">打开新的登录页</a>
                        <p class="qwui-overdue_tip">2、登录成功后返回当前页面点击“确认已登录”</p>
                        <button class="qwui-overdue_btn" @click="checkLogin">确认已登录</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import baseURL from '@/assets/js/baseURL_config';
import axios from 'axios';
export default {
    name: 'overdueBox',
    data() {
        return {
            // 登录页路径
            loginUrl: `${baseURL}/manager/login.jsp`,
        }
    },
    methods: {
        /*
         * 确认按钮： 执行心跳接口判断是否已重新登录
         * 返回 code == '0' 则表示 连接成功,code == "800000003" 则表示登录过期
         */
        checkLogin() {
            axios.post(`${baseURL}/cooperation/cooperationAction!continueSession.action`)
            .then((response) => {
                if(response.code == "0") {
                    dataBase.isOverDue = false;
                } else if(response.code == "800000003"){
                    dataBase.top_alert('登录态过期, 请重新登录', false, 3000);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }
}
</script>

<style scoped>
/*
 * 修改弹窗最外层的样式 添加阴影、边角
 */
 .qwui-overdue_wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
 }
 .qwui-overdue_overlayer {
     position: fixed;
     width: 100%;
     height: 100%;
     background: rgba(0,0,0,.5);
     z-index: 20;
 }
.qwui-overdue_box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 720px;
    height: 356px;
    margin: auto;
    background-color: #fff;
    border-radius: 2px;
    box-shadow:5px 0px 10px rgba(0,0,0,.1);
    -webkit-box-shadow: 5px 0 10px rgba(0,0,0,.1);
}
.qwui-overdue_container {
    padding: 69px 50px 58px 53px;
}
.qwui-overdue_right {
    margin: 41px 0 0 25px;
}
.qwui-overdue_title {
    margin-bottom: 22px;
    font-size: 24px;
    color: #333;
}
.qwui-overdue_link {
    font-size: 16px;
    color: #f87b00;
    text-decoration: underline;
}
.qwui-overdue_tip {
    margin-top: 5px;
    font-size: 16px;
    color: #666;
}
.qwui-overdue_btn {
    width: 120px;
    height: 36px;
    margin-top: 30px;
    font-size: 14px;
    color: #fefefe;
    background: #C31725;
    border: none;
    border-radius: 5px;
}
</style>

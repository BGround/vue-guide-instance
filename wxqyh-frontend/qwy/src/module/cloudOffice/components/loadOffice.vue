<template>
    <div class="wrap">
        <div class="content_wrap">
            <div class="img_wrap">
                <img src="../../../assets/images/img_qwybg4@3x.png" alt="">
            </div>
            <div class="tips_wrap">
                <h3>企微云办公</h3>
                <span>包含7大功能模块：</span>
                <ul>
                    <li>考勤打卡：指纹人脸，多地考勤</li>
                    <li>请假出差：假期管理 对接考勤</li>
                    <li>会议助手：高效会议管理专家</li>
                    <li>企业用车：有效较低单位用车成本</li>
                    <li>费控报销：成本预算，精细化管控报销费用</li>
                    <li>审批请示：快速审批 简单易用</li>
                    <li>新闻公告：公告审批发布、红包关怀</li>
                </ul>
                <a :href="toLoad()">点击安装</a>
            </div>
        </div>
    </div>
</template>

<script>
import baseURL from '@/assets/js/baseURL_config'
export default {
    name: 'loadOffice',
    methods: {
        toLoad() {
            return baseURL + "/application/application!authSuite.action?suiteId=tj3adffe72e54c0f4c"
        },
    }
}
</script>

<style lang="scss" scoped>
.content_wrap {
    background: #fbfbfb;
    display: flex;
    align-items: center;
    padding: 30px 0 0 110px;
    .img_wrap {
        margin-right: 70px;
        img {
            width: 217px;
            height: 400px;
        }
    }
    .tips_wrap {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        h3 {
            color: #0A1735;
            font-size: 24px;
            margin-bottom: 20px;
        }
        span, ul li {
            color: #A6A6A6;
            font-size: 14px;
            margin-bottom: 8px;
        }
        ul {
            margin-bottom: 17px;
        }
        a {
            background: #F87B00;
            color: #fff;
            width: 160px;
            height: 38px;
            line-height: 38px;
            border-radius: 10px;
            text-align: center;
            border: none;
            outline: none;
        }
    }
}
</style>

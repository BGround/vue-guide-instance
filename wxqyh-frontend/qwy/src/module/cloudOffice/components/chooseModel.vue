<template>
    <div class="wrap">
        <h3 class="main_title">企微云办公应用模式设置</h3>
        <div class="model_wrap">
            <div class="model_item" v-for="(item, index) in choosenData" :key="index" :class="{'active': item.active}" @click="chooseModel(item)">
                <div class="item_left">
                    <div class="model_img" :class="filterImg(index)"></div>
                    <div class="item_middle">
                        <h5 class="item_title">{{item.title}}</h5>
                        <p class="tips">{{item.tip}}</p>
                        <p class="tipMore" v-show="item.tipMore">{{item.tipMore}}</p>
                    </div>
                </div>
                <div class="icon_wrap">
                    <p class="alert_icon"></p>
                </div>
            </div>
        </div>
        <div class="save_wrap">
            <button class="save_btn" @click="addEl()">保存</button>
        </div>
    </div>
</template>

<script>
import {saveModel, getModelConfig} from '../api/getData';
export default {
    name: 'chooseModel',
    data() {
        return {
            choosenData: [
                {val: '', active: false, title: '完整应用模式', tip: '应用端使用完整版功能，包含以下7个应用模块及入口', tipMore: '考勤打卡、请假出差、会议助手、企业用车、费控报销、审批请示、新闻公告'},
                {val: 'meetingassistant', active: false, title: '单应用模式：会议助手', tip: '应用端仅使用会议助手功能，员工打开应用后直接跳转到会议助手首页'},
                {val: 'checkwork', active: false, title: '单应用模式：考勤打卡', tip: '应用端仅使用考勤打卡功能，员工打开应用后直接跳转到考勤打卡首页'},
            ],
            dataBase,
        }
    },
    created() {
        this.getModel()
    },
    methods: {
        filterImg(index) {
            switch(index) {
                case 0:
                    return 'total_model'
                    break;
                case 1:
                    return 'meet_model'
                    break;
                case 2:
                    return 'card_model'
                    break;
            }
        },
        chooseModel(item) {
            this.initActive();
            item.active = true;
        },
        initActive() {
            this.choosenData.forEach(element => {
                element.active = false
            });
        },
        addEl() {
            var self = this
            var a_wrap = document.createElement('div')
            var a_content = document.createElement('div')
            var a_header = document.createElement('div')
            var a_body = document.createElement('div')
            var a_opt = document.createElement('div')
            var a_span = document.createElement("span")
            var a_close = document.createElement("span")
            var a_h3 = document.createElement("h3")
            a_body.innerHTML = '保存成功后会刷新应用端的页面，对该应用可见范围内的所有 <br> 成员生效，确认保存？'
            a_span.innerText = '确定'
            a_h3.innerText = '提示'
            a_close.innerText = 'x'
            a_wrap.style = 'position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0,0,0,0.5);z-index: 100;'
            a_content.style = 'position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);width: 500px;height: auto;border-radius: 5px;box-shadow: 0 0 8px rgba(0, 0, 0, 0.31);border: 1px solid #cccccc;z-index: 100;background-color: #FFF;'
            a_header.style = 'margin: 0 15px;padding: 0 15px;height: 60px;text-align: right;border-bottom: 1px solid #cccccc;'
            a_body.style = 'margin-top: 15px;padding: 0 15px;text-align: center;'
            a_opt.style = 'padding: 20px 0 30px;text-align: center;'
            a_span.style = 'min-width: 46px;padding: 0 11px;font-size: 14px;line-height: 30px;text-align: center;display: inline-block;border-radius: 4px;box-sizing: inherit;cursor: pointer;color: #fff;background-color: #C31725;border: 1px #f87b00 solid;'
            a_h3.style = 'float: left;margin-top: 15px;display: inline;line-height: 36px;font-size: 18px;font-weight: bold;'
            a_close.style = 'display: inline-block;margin-top: 15px;padding: 0 5px 4px;line-height: 30px;font-size: 20px;color: #999;cursor: pointer;'
            a_wrap.appendChild(a_content)
            a_content.appendChild(a_header)
            a_content.appendChild(a_body)
            a_content.appendChild(a_opt)
            a_header.appendChild(a_h3)
            a_header.appendChild(a_close)
            a_opt.appendChild(a_span)

            var outParent = parent.document.body

            outParent.appendChild(a_wrap)
            a_close.onclick = function closeWin() {
                a_wrap.style.display = 'none'
            }
            a_span.onclick = function save() {
                a_wrap.style.display = 'none'
                self.sureSave()
            }
        },
        sureSave() {
            var agentCode = '';
            this.choosenData.forEach(item => {
                if (item.active) {
                    agentCode = item.val
                }
            })
            var data = {
                parentAgentCode: 'meetingassistant',
                agentCode: agentCode,
            }
            saveModel(data).then(res => {
                if (res.code == 0) {
                    dataBase.top_alert(res.desc, true, 3000);
                } else {
                    dataBase.top_alert(res.desc, false, 3000);
                }
            })
        },
        getModel() {
            getModelConfig().then(res => {
                if (res.code === '0') {
                    this.choosenData.forEach(item => {
                        if (item.val === res.data.singleModeAgentCode) {
                            item.active = true;
                        }
                    })
                }
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.wrap {
    background: #fbfbfb;
    padding: 30px 24px 0;
    display: flex;
    flex-direction: column;
    .main_title {
        color: #333;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 5px;
    }
    .model_wrap {
        display: flex;
        flex-direction: column;
        .model_item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 40px;
            height: 160px;
            margin-top: 20px;
            border-radius: 4px;
            border: 1px solid #DDDDDD;
            &.active {
                .icon_wrap {
                    .alert_icon {
                        border: none;
                        background: url(../../../assets/images/icon_b-common_radio2@3x.png) no-repeat center center;
                        background-size: cover;
                    }
                }
            }
            &.active, &:hover {
                border: 1px solid #F87B00;
            }
            &:hover {
                cursor: pointer;
            }
            .item_left {
                height: 100%;
                display: flex;
                align-items: center;
                .model_img {
                    width: 173px;
                    height: 100%;
                    &.total_model {
                        background: url(../../../assets/images/img_qwybg1@3x.png) no-repeat center 20%;
                        background-size: cover;
                    }
                    &.meet_model {
                        background: url(../../../assets/images/img_qwybg2@3x.png) no-repeat center 30%;
                        background-size: cover;
                    }
                    &.card_model {
                        background: url(../../../assets/images/img_qwybg3@3x.png) no-repeat center 35%;
                        background-size: cover;
                    }
                }
                .item_middle {
                    display: flex;
                    flex-direction: column;
                    margin-left: 25px;
                    .item_title {
                        color: #333;
                        font-weight: bold;
                        font-size: 16px;
                    }
                    .tips {
                        margin-top: 17px;
                    }
                    .tipMore {
                        margin-top: 10px;
                    }
                    .tips, .tipMore {
                        color: #999;
                        font-size: 14px;
                    }
                }
            }
            .icon_wrap {
                .alert_icon {
                    width: 24px;
                    height: 24px;
                    border: 1px solid #CBCBCB;
                    border-radius: 50%;
                }
            }
        }
    }
    .save_wrap {
        display: flex;
        justify-content: center;
        .save_btn {
            margin-top: 30px;
            border: none;
            outline: none;
            width: 60px;
            height: 28px;
            line-height: 28px;
            color: #fff;
            background: #FF9700;
            font-size: 14px;
            border-radius: 2px;
            &:hover {
                background: darken($color: #FF9700, $amount: 5);
            }
        }
    }
}

</style>

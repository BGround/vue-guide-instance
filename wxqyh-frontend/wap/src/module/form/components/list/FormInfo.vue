<template>
    <div class="formInfo">
        <div class="maskLayer" @click="closeInfo" ref="maskLayer" @touchmove.prevent=""></div>
        <transition name="slide-fade">
            <div class="information"
                v-show="showInfo"
                @touchstart="touchStart($event)"
                @touchmove.prevent="touchMove($event)"
                @touchend="touchEnd($event)"
                :style="infoStyle"
                ref='formInfo'>
                <div class="pop-drag-icon"></div>
                <div class="basicInformation">
                    <div class="title">{{formTitle}}</div>
                    <div class="group">{{formGroup}}</div>
                    <div class="collection" @click="collect">
                        <i class="icon"
                            :class="isCollected ? 'collected' : 'noCollected'"></i>
                            常用
                    </div>
                </div>
                <div class="numberCount">
                    <router-link class="detailCount"
                        :to="{ name: 'detailData', query: { id: this.item.id, isTask: isTask, viewId: '0' } }">
                        <div class="count">{{detailCount}}</div>
                        可见明细
                    </router-link>
                    <router-link class="toDoCount"
                        :to="{ name: 'detailData', query: { id: this.item.id, isTask: isTask, viewId: '2' } }">
                        <div class="count">{{toDoCount}}</div>
                        我负责的
                    </router-link>
                    <router-link class="submitCount"
                        :to="{ name: 'detailData', query: { id: this.item.id, isTask: isTask, viewId: '1' } }">
                        <div class="count">{{submitCount}}</div>
                        我提交的
                    </router-link>
                </div>
                <div class="footer">
                    <router-link
                        class="detailData arrow"
                        :to="{ name: 'detailData', query: { id: this.item.id, isTask: isTask, viewId: '0' } }"
                        tag="div">
                        <i class="icon"></i>明细数据
                    </router-link>
                    <router-link
                        class="statistical arrow"
                        :to="{ name: 'dataReport', query: { id: this.item.id, isTask: isTask } }"
                        tag="div">
                        <i class="icon"></i>统计报表
                    </router-link>
                    <router-link
                        class="addForm"
                        :to="{name: 'add', query: { id: this.item.id } }"
                        tag="div">发起
                        </router-link>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { getFormInfo, collectForm } from '../../api/list'
import {updateCache} from '../../assets/js/keepAlive.js'
import { setTimeout } from 'timers';

export default {
    name: 'formInfo',
    props: {
        item: Object
    },
    data() {
        return {
            formTitle: this.item.formName,
            formGroup: this.item.formType,
            isCollected: false,
            detailCount: '',
            toDoCount: '',
            submitCount: '',
            isTask: '',
            showInfo: false,
            isInit: false,
            infoStyle: {},
            infoHeight: '',
            startY: ''
        }
    },
    methods: {
        async init() {
            let res = await getFormInfo(this.item.id);
            this.isInit = true;
            this.initFormInfo(res);
        },
        async collect() {
            let res= await collectForm(this.item.id);
            if(res.code == "1") {
                this.isCollected = false;
                _.tooltips_succeed("取消常用表单成功")
            } else if(res.code == "0") {
                this.isCollected = true;
                _.tooltips_succeed("收藏为常用表单成功")
            } else {
                return _.alert('提示', res.desc);
            }
            updateCache('mainPage');
        },
        initFormInfo(formInfo) {
            this.detailCount = formInfo.detailCount;
            this.toDoCount = formInfo.todoCount;
            this.submitCount = formInfo.createCount;
            this.isCollected = formInfo.isCollect;
            this.isTask = formInfo.isTask;
        },
        closeInfo() {
            this.showInfo = false;
            this.$refs.maskLayer.style.transition = 'all .1s ease';
            this.$refs.maskLayer.style.opacity = '0';
            if(this.isInit && this.$route.path == '/collection' && !this.isCollected) {
                Events.$emit('delCollection', this.item.index)
            }
            if(this.isInit && this.$route.path == '/main' && !this.isCollected) {
              Events.$emit('delHeaderCollection', this.item.index)
            }
            setTimeout(() => {
                this.$emit('closeInfo');
            }, 100)
        },
        touchStart(event) {
            this.infoHeight = getComputedStyle(this.$refs.formInfo).height.replace('px',"");
            this.startY = event.touches[0].clientY;
        },
        touchMove(event) {
            let clientY = event.touches[0].clientY,
                moveY = clientY - this.startY,
                height = this.infoHeight - moveY;
            if(clientY < this.startY) {
                return
            }
            this.infoStyle = {
                height: height + 'px'
            }
        },
        touchEnd(event) {
            console.log(this.infoHeight);
            var clientY = event.changedTouches[0].clientY,
                moveY = clientY - this.startY;
            if(moveY > 50) {
                this.closeInfo();
            } else {
                this.infoStyle = {
                    height: this.infoHeight + 'px'
                }
            }
        }
    },
    created() {
        let _this = this;
        this.init();
        setTimeout(() => {
            _this.showInfo = true;
            _this.$refs.maskLayer.style.opacity = '.4';
        }, 10)
    }
}
</script>

<style lang="scss" scoped>
$baseURL: '~assets/images/';
@mixin background($url) {
    background: url($baseURL + $url) no-repeat;
    background-size: contain;
}
.formInfo {
    position: fixed;
    top: 0;
    z-index: 10;
    height: 100%;
    width: 100%;
    @media screen and (min-width: 1024px) {
        width: 740px;
        margin: 0 auto;
    }
    .maskLayer {
        height: 100%;
        background-color: black;
        opacity: 0;
        transition: all .25s ease;
    }
    .information {
        position: absolute;
        bottom: 0;
        width: 100%;
        background-color: #fff;
        .pop-drag-icon {
            position: absolute;
            top: 8px;
            left: 50%;
            width: 32px;
            height: 6px;
            transform: translateX(-50%);
            @include background('icon_pop-drag.png');
        }
        .basicInformation {
            padding: 30px 65px 15px 15px;
            .title {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                max-height: 72px;
                font-family: 'Microsoft YaHei','宋体', Tahoma, Arial, sans-serif;
                line-height: 1.4;
                word-break: break-all;
                font-size: 18px;
                font-weight: 500;;
                color: #0A1735;
            }
            .group {
                color: #B2B9C8;
                font-size: 13px;
                line-height: 26px;
            }
            .collection {
                position: absolute;
                top: 30px;
                right: 15px;
                width: 48px;
                font-size: 12px;
                color: #B2B9C8;
                text-align: center;
                padding-top: 30px;
                cursor: pointer;
                .icon {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    width: 24px;
                    height: 24px;
                    transform: translateX(-50%);
                }
                .icon.collected {
                    @include background('collected.png');
                }
                .icon.noCollected {
                    @include background('noCollected.png');
                }
            }
        }
        .numberCount {
            display: flex;
            height: 64px;
            padding-bottom: 16px;
            justify-content: center;
            align-items: center;
            .detailCount, .toDoCount, .submitCount {
                flex: 33.33333%;
                color: #B2B9C8;
                font-size: 11px;
                line-height: 26px;
                text-align: center;
                cursor: pointer;
                .count {
                    height: 26px;
                    color: #0A1735;
                    font-size: 22px;
                    font-weight: 500;
                }
            }
            .toDoCount {
                margin: 0 27px;
            }
        }
        .footer {
            border-top: 8px solid #F7F8FA;
            color: #0A1735;
            .detailData, .statistical {
                position: relative;
                height: 52px;
                font-size: 15px;
                line-height: 50px;
                padding-left: 40px;
                cursor: pointer;
                &:active {
                    background-color: #F7F8FA;
                }
                .icon {
                    position: absolute;
                    top: 50%;
                    left: 18px;
                    width: 12px;
                    height: 12px;
                    transform: translateY(-50%);
                }
            }
            .detailData {
                .icon {
                     @include background('detailData.png');
                }
            }
            .statistical {
                .icon {
                    @include background('dataReport.png');
                }
            }
            .addForm {
                height: 44px;
                margin: 12px 14px 20px;
                color: #fff;
                font-size: 16px;
                line-height: 44px;
                background-color: #5585F0;
                text-align: center;
                border-radius:8px;
                cursor: pointer;
            }
            .arrow::after {
                content: "";
                position: absolute;
                color: #999999;
                right: 15px;
                top: 50%;
                width: 6px;
                height: 12px;
                -webkit-transform: translateY(-50%);
                transform: translateY(-50%);
                background: url(~assets/images/icon-arrow.png) no-repeat;
                background-size: contain;
            }
        }
    }
}
.slide-fade-enter-active {
    transition: all .25s ease;
}
.slide-fade-leave-active {
    transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter {
    transform: translateY(100%);
    opacity: 1;
}
.slide-fade-leave-to {
    transform: translateY(100%);
    opacity: 0;
}
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .formInfo .information {
    border-bottom: 34px solid #fff;
  }

}
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
  .formInfo .information {
    border-bottom: 34px solid #fff;
  }

}
</style>

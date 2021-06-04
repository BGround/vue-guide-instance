<template>
    <transition name="slide-fade" >
        <div class="update_page">
            <crm-scroll>
            <div class="update_wrap">
                <div class="this-time_update">
                    <div class="title-img">
                        <img src="~assets/images/crm/crm_notice.png">
                        <span class="title_text">本次更新</span>
                    </div>
                    <div class="update_content">
                        <div class="update_content-list">
                            <p class="this-update_text">应用端新增销售简报</p>
                            <p class="this-update_text">应用端新增销售简报</p>
                            <p class="this-update_text">应用端新增销售简报</p>
                        </div>
                    </div>
                </div>
                <div class="recent-update">
                    <div class="title-img">
                        <img src="~assets/images/crm/crm_notice.png">
                        <span class="title_text">最近更新</span>
                    </div>
                    <div class="update_content">
                        <div class="update_content-list">
                            <p class="this-update_text">公海池列表体验优化，可快速筛选已分配、未分配客户，批量操作客户，提高公海负责人工作效率，高效处理未分配的公海客户</p>
                            <p class="this-update_text">新增公海池说明，介绍公海池类型、基本属性以及简要规则</p>
                            <p class="this-update_text">默认公海全面开放，公海名称可编辑，支持领取、分配和主动回收，没有自动回收规则</p>
                        </div>
                    </div>
                </div>
                <!-- 垫高块 -->
                <div class="height50"></div>
            </div>
            </crm-scroll>
        </div>
    </transition>
</template>

<script>
import CrmScroll from '../../../components/CrmScroll/CrmScroll';
export default {
    name: 'updateNotice',
    data() {
        return {

        }
    },
    components:{
        CrmScroll
    },
}
</script>

<style lang='scss' scoped>
@import '../../../crmBase.scss';
.update_page{
    height: 100%;
    background: #fff;
    .update_wrap{
        // position: absolute;
        height: 100%;
        // margin-top: 32px;
        width: 100%;
        // top: 50%;
        // transform: translateY(-50%);
        background: #fff;
        .height50{
            height: 50px;
        }
        .recent-update{
            margin-top: 55px;
            width: 100%;
            .title-img{
                width: 203px;
                height: 37px;
                margin: 0 auto;
                position: relative;
                text-align: center;
                img{
                    width: 100%;
                    height: 100%;
                }
                .title_text{
                    display: inline-block;
                    width: 100px;
                    font-size: 18px;
                    color: #fff;
                    position: absolute;
                    left: 50%;
                    top: 0;
                    margin-left: -50px;
                    line-height: 37px;
                }
            }
        }
        .this-time_update{
            width: 100%;
            padding-top: 32px;
            .title-img{
                width: 203px;
                height: 37px;
                margin: 0 auto;
                position: relative;
                text-align: center;
                img{
                    width: 100%;
                    height: 100%;
                }
                .title_text{
                    display: inline-block;
                    width: 100px;
                    font-size: 18px;
                    color: #fff;
                    position: absolute;
                    left: 50%;
                    top: 0;
                    margin-left: -50px;
                    line-height: 37px;
                }
            }
        }
    }
    .update_content{
        margin-top: 24px;
        .update_content-list{
            padding: 0 20px;
            .this-update_text{
                font-size: 14px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(49,49,49,1);
                line-height: 20px;
                position: relative;
                margin-left: 16px;
                margin-bottom: 20px;
                text-align: justify;
                &::before{
                    content: '';
                    position: absolute;
                    left: -16px;
                    top: 6px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #C9DBFD;
                }
            }
        }
    }
}
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(70px);
  opacity: 0;
}
</style>

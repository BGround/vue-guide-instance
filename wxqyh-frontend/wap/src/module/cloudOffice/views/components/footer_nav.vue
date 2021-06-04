<!--底部tab切换-->
<template>
    <div>
        <div class="qwui-tabbar_heaght"></div>
        <div class="qwui-tabbar">
            <a v-for="(item, index) in footernavdata.nav" :key="index" class="qwui-tabbar-item" :class="{'active': footernavdata.nav_on == index}" href="javascript:;" @click="changeFooter(index, item)">
                <div :class="[item.type === 'normal' ? 'qwui-tabber-wrapper' : 'addNewTask']">
                    <div class="qwui-tabber-img" :class="item.class">
                        <div class="waitNum" v-if="index == 0 && waitingTaskNum">{{waitingTaskNum}}</div>
                    </div>
                    <p class="qwui-tabbar-label" v-if="item.text">{{item.text}}</p>
                </div>
            </a>
        </div>
        <div class="qwui-tabber_bottom"></div>
    </div>
</template>

<script>
export default {
  name: 'footer_nav',
  props:["footernavdata", "waitingTaskNum"],
  data(){
    return {
    }
  },
  methods:{
    changeFooter(index, item) {
        this.$emit('listenFooter', item.class)
        if (index !== 1) {
            this.footernavdata.nav_on = index
        }
    }
  }
}

</script>

<style lang="scss" scoped>
.qwui-tabbar_heaght{
    height: 50px;
}
.qwui-tabbar {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #FFF;
    z-index: 9;
    border-top: 1px solid #F6F7FB;
    .qwui-tabbar-item {
        flex: 1;
        height: 50px;
        line-height: 50px;
        font-size: 0;
        color: #999;
        text-align: center;
        cursor: pointer;
        > div {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
        }
        .qwui-tabber-wrapper {
            position: relative;
            .qwui-tabber-img {
                width: 22px;
                height: 22px;
                background-position: center center;
                background-repeat: no-repeat;
                position: relative;
                &.myWait {
                    background-image: url(../../../../assets/svg/tabBar_home_nor.svg);
                    background-size: 22px 22px;
                }
                &.myPub {
                    background-image: url(../../../../assets/svg/tabBar_Basic_nor.svg);
                    background-size: 22px 22px;
                }
                .waitNum {
                    position: absolute;
                    padding: 0 5px 0 5px;
                    top: -5px;
                    left: 12px;
                    font-size: 12px;
                    background: #FE5354;
                    color: #fff;
                    border-radius: 50px;
                    // width: 18px;
                    height: 16px;
                    line-height: 16px;
                    text-align: center;
                }
            }
            .qwui-tabbar-label {
                text-align: center;
                color: #A3A3AC;
                font-size: 10px;
                line-height: 1.5;
            }

        }
        &.active {
            .qwui-tabber-wrapper {
                .qwui-tabbar-label {
                    color: #648EEC;
                }
                .myWait {
                    background-image: url(../../../../assets/svg/tabBar_home_press.svg);
                    background-size: 22px 22px;
                }
                .myPub {
                    background-image: url(../../../../assets/svg/tabBar_Basic_press.svg);
                    background-size: 22px 22px;
                }
            }
        }
        .addNewTask {
            .qwui-tabber-img {
                width: 52px;
                height: 36px;
                background: url(../../../../assets/svg/tabBar_add_press.svg) no-repeat center center;
                background-size: 52px 36px;
            }
        }
    }
}
.qwui-tabber_bottom {
    height: 34px;
    width: 100%;
    position: fixed;
    bottom: 0;
    display: none;
    background: #fff;
    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
      /*display: block;*/
    }
}
@media screen and (min-width: 1024px) {
    .qwui-tabbar {
        width: 740px !important;
    }
}
</style>

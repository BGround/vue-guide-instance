<template>
    <div class="swiper_wrap">
        <swiper :options="swiperOption">
            <swiper-slide>
                <div class="board_card">
                    <div>商机赢单金额({{businessMoney}})</div>
                    <div class="total_money" @click="goUrl('trend')">￥<span class="money_number">{{cardData.finishValue | dealmoney}}</span></div>
                    <div class="board_item_wrap">
                        <div class="board_item" @click="goUrl('business')">赢单商机<span class="item_number">{{cardData.successBusinessNum}}</span></div>
                        <div class="board_item" @click="goClient('business')">赢单客户<span class="item_number">{{cardData.successBusinessCount}}</span></div>
                    </div>
                </div>
            </swiper-slide>
            <swiper-slide>
                <div class="board_card">
                    <div>合同签约金额({{contractMoney}})</div>
                    <div class="total_money">￥<span class="money_number" @click="goUrl('trendContract')">{{cardData.signContractAmount | dealmoney}}</span></div>
                    <div class="board_item_wrap">
                        <div class="board_item" @click="goUrl('contractReceived')">签约合同<span class="item_number">{{cardData.count}}</span></div>
                        <div class="board_item" @click="goClient('contract')">签约客户<span class="item_number">{{cardData.successContractCount}}</span></div>
                    </div>
                </div>
            </swiper-slide>
            <div class="swiper-pagination swiper-pagination-bullets" slot="pagination"></div>
        </swiper>
    </div>
</template>
<script>
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
    name: 'cardSwiper',
    components: {
        swiper,
        swiperSlide,
    },
    props: {
        // 滑动卡数据
        cardData: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            swiperOption: {  // 滑动组件配置
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    renderBullet(index, className) {
                        return `<span class="${className} swiper-pagination-bullet-custom"></span>`
                    }
                }
            }
        }
    },
    computed: {
        // 商机赢单金额单位
        businessMoney () {
            return this.cardData.finishValue > 999999.99? '万元' : '元';
        },
        
        // 合同签约金额单位
        contractMoney () {
            return this.cardData.signContractAmount > 999999.99? '万元' : '元';
        }
    },
    methods: {
        goClient(type){
            this.$emit('goClient', type);
        },
        goUrl(type){
            this.$emit('goUrl', type);
        }
    }
}
</script>
<style lang='scss' scoped>
@import '../../../crmBase.scss';

.swiper_wrap{
    position: relative;
    z-index: 0;
    padding: rem(20) rem(15) rem(25);
    background: #fff;
    .board_card{
        padding: rem(26) 0 rem(29) rem(16);
        box-sizing: border-box;
        border-radius: 5px;
        background: linear-gradient(to right, #5DA1FF , #528BDB);
        box-shadow: 0 0 rem(3) rgba(33,108,165,0.54);
        color: rgba(255,255,255,1);
        font-size: rem(13);
        .item_number{
            margin-left: rem(15);
            font-size: rem(14);
        }
        .total_money{
            font-size: rem(24);
        }
        .money_number{
            font-size: rem(36);
        }
        .board_item_wrap{
            display: flex;
            .board_item{
                flex: 1;
                padding-top: rem(20);
            }
        }
    }
    /deep/ .swiper-pagination-bullet-custom {
        width: rem(16);
        height: rem(2);
        margin: 0;
        margin-right: rem(5);
        border-radius: 0;
        background: rgb(255,255,255);
        &.swiper-pagination-bullet-active {
            background: #fff;
        }
    }
}
</style>
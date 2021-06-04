<template>
    <div class="list_wrap">
        <div class="itemList" v-for="(item,idx) in listData" :key="idx" @click="handleClick(item)">
            <span class="left_icon">
                <!-- <svg class="icon" aria-hidden="true">
                    <use :xlink:href="item.leftIconClass"></use>
                </svg>	 -->
                <img :src="item.leftIconClass">
            </span>
            <span class="item_title">{{item.name}}</span>
            <span class="right_icon">
                <i :class="item.rightIconClass"></i>
            </span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'myItemList',
    data() {
        return {

        }
    },
    props: {
        listData: {
            type: Array,
            default: []
        }
    },
    created(){

    },
    methods: {
        handleClick(item){
            this.$emit('handleClick', item)
        }
    }
}
</script>
<style lang='scss' scoped>
@import '../../../crmBase.scss';
.list_wrap{
    .itemList{
        position: relative;
        margin-left: 16px;
        padding: 16px 0 15px 0;
        // width: 100%;
        height: 24px;
        background: #fff;
        display: flex;
        &:after{
            @include underLine
        }
        .left_icon{
            display: inline-block;
            width: 24px;
            height: 24px;
            color: #779af8;
            .icon {
                width: 100%; 
                height: 100%;
                vertical-align: -0.15em;
                fill: currentColor;
                overflow: hidden;
            }
            i{
                font-size: 24px;
                line-height: 24px;
                color: #4487F8;
            }
        }
        .item_title{
            margin-left: 10px;
            font-size: 15px;
            color: #0A1735;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            line-height: 24px;
        }
        .right_icon{
            width: 100px;
            position: absolute;
            top: 50%;
            padding-right: 10px;
            height: 16px;
            margin-top: -8px;
            line-height: 16px;
            right: 0;
            i{
                position: relative;
                float: right;
                height:16px;
            }
            .arrow::after {
                content: "";
                position: absolute;
                color: #999999;
                right: 0;
                top: 50%;
                width: 14px;
                height: 14px;
                transform: translateY(-50%);
                background: url(~assets/images/icon_down.png) no-repeat;
                background-size: contain;
            }
            .goldCard::after{
                content: "";
                position: absolute;
                color: #999999;
                right: 0;
                top: 50%;
                width: 53px;
                height: 22px;
                transform: translateY(-50%);
                background: url(~assets/images/crm/icon_a-me_golden.png) no-repeat;
                background-size: contain;
            }
            .sliverCard::after{
                content: "";
                position: absolute;
                color: #999999;
                right: 0;
                top: 50%;
                width: 53px;
                height: 22px;
                transform: translateY(-50%);
                background: url(~assets/images/crm/icon_a-me_silver.png) no-repeat;
                background-size: contain;
            }
            .teamCard::after{
                content: "";
                position: absolute;
                color: #999999;
                right: 0;
                top: 50%;
                width: 53px;
                height: 22px;
                transform: translateY(-50%);
                background: url(~assets/images/crm/icon_a-me_team.png) no-repeat;
                background-size: contain;
            }
        }
    }
}
</style>


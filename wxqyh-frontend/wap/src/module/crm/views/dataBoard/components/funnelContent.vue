<template>
  <div class="businessWrap">
        <!-- 销售金额，商机个数，销售漏斗 -->
        <div class="funnelMoney">
            <div class="funnelMoney-left">
                <div class="moneyText">漏斗总值(万元)</div>
                    <p class="totalValue">
                        <span class="moneyTip">￥</span>{{totalMoney}}
                    </p>
            </div>
            <div class="funnelMoney-right" @click="businessMaskShow($event)">
                <div class="moneyText">预计成交(万元)</div>
                    <div class="buggetValue">
                        <span class="moneyTip">￥</span>{{expectedMoney}}
                    </div>
            </div>
        </div>
        <div class="moneyTab">
            <div class="tabLeftText" @click.stop="tabChange('left')" :style="tabBlue">
                销售金额
                <div class="tabLeftBar" v-show = "tabActive"></div>
            </div>
            <div class="tabRightText" @click.stop="tabChange('right')" :style="tabGray">
                商机个数
                <div class="tabRightBar" v-show = '!this.tabActive'></div>
            </div>
        </div>
        <div class="funnelBox">
            <funnel v-bind="funnelData" v-show="!noDataShow" @clickFunnel="clickFunnel"></funnel>
        </div>
        <div class="noData" v-show="noDataShow">
            <div class="noDataImg"></div>
        </div>
  </div>
</template>

<script>
import funnel from './funnel';
export default {
    name: 'funnelContent',
    components:{
        funnel,
    },
    props:{
       funnelData:{
           type:Object,
           defalut: {}
       },
       totalMoney:{
           type: Number,
           defalut: ''
       },
       expectedMoney:{
           type: Number,
           defalut: ''
       },
    },
    data(){
        return {
            tabActive: true,
            tabBlue: {
                color: '#629DF5',
            },
            tabGray: {
                color: 'rgba(153,153,153,1)',
            },
        }
    },
    computed:{
        tabLeftClass(){
            return 'tableftColor'
        },
        // 没有数据的漏斗
        noDataShow(){
            let chartStr = 0;
            this.funnelData.chartData.forEach((item) => {
                chartStr += Number(item[1]);
            })
            return chartStr === 0 ? true : false;
        }
    },
    created(){
    },
    mounted() {
    },
    methods:{
        businessMaskShow(event){
            this.$emit('businessMaskShow',event)
        },
        tabChange(status){
            if(status == 'left'){
                this.tabActive = true
                this.tabBlue.color = '#629DF5';
                this.tabGray.color = 'rgba(153,153,153,1)'
            }else{
                this.tabActive = false
                this.tabBlue.color = 'rgba(153,153,153,1)'
                this.tabGray.color = '#629DF5'
            }
            this.$emit('tabChage',status)
        },
        clickFunnel(val){
            this.$emit('clickFunnel',val)
        }
    }
}

</script>

<style lang="scss">
@import '../../../crmBase.scss';
.businessWrap{
    .funnelMoney{
        text-align: center;
        color: #666;
        font-size: rem(24);
        padding: rem(35) 0;
        background: #fff;
        display: flex;
        .moneyTip{
            font-size: rem(18);
            font-weight: 400;
        }
        .moneyText{
            color: rgba(10,23,53,1);
            font-size: rem(13);
            margin-top: rem(10);
            text-align: left;
        }
        .funnelMoney-left{
            float: left;
            flex: 1;
            background:rgba(255,255,255,1);
            box-shadow:0px 0px 6px 0px rgba(70,70,70,0.1);
            border-radius:6px;
            padding-left: rem(14);
            .totalValue{
                float: left;
                color: #629DF5;
                font-size: rem(24);
                padding: 6px 0;
            }
        }
        .funnelMoney-right{
            float: left;
            flex: 1;
            background:rgba(255,255,255,1);
            box-shadow:0px 0px 6px 0px rgba(70,70,70,0.1);
            border-radius:6px;
            margin-left: rem(15);
            padding-left: rem(14);
            .buggetValue{
                float: left;
                color: #629DF5;
                font-size: rem(24);
                padding: 6px 0;
            }
        }
    }
    .moneyTab{
        display: flex;
        text-align: center;
        position: relative;
        height: rem(30);
        padding-bottom: rem(28);
        .tabLeftText{
            font-size: rem(16);
            color: #779AF8;
            font-weight:400;
            line-height:22px;
            flex: 1;
            position: relative;
            cursor: pointer;
            .tabLeftBar{
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                width: rem(36);
                height: 3px;
                background:rgba(119,154,248,1);
                border-radius:2px;
                margin: 0 auto;
            }
        }
        .tabLeftText:first-child {
            border-right:1px solid rgba(238,238,238,1)
        }
        .tabRightText{
            position: relative;
            font-size: rem(16);
            color: #779AF8;
            font-weight:400;
            line-height:22px;
            cursor: pointer;
            flex: 1;
            .tabRightBar{
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                width: rem(36);
                height: 3px;
                background:rgba(119,154,248,1);
                border-radius:2px;
                margin: 0 auto;
            }
        }
        .tabBar{
            position: absolute;
            bottom: 0;
            left: 10px;
            width: rem(36);
            height: 3px;
            background:rgba(119,154,248,1);
            border-radius:2px;
        }
    }
    .funnelBox{
        width: 98%;
        padding-left: 2%;
        overflow-x: auto;
        padding-bottom: 1.2rem;
        background: #fff;
        padding-top: 1rem;
    }
    .noData{
        height: rem(215);
        width: 100%;
        display: flex;
        text-align: center;
        .noDataImg{
            flex: 1;
            width: rem(137);
            height: rem(215);
            background: url('~assets/images/crm/not-data.png') center no-repeat;
        }
    }
}

</style>

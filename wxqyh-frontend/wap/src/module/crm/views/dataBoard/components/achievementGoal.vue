<template>
    <div class="border_msg achievement_goal" @click="goGoal">
        <h1 class="title">业绩目标</h1>
        <div class="goal_main">
            <ring-diagram v-bind="ringCharts"></ring-diagram>
            <div class="goal_msg">
                <p class="goal_title">目标完成度</p>
                <div 
                    class="goal_precent" 
                    :class="{goal_active: finishRate > 0}"
                >{{goalData.completionRate}}</div>
                <p class="ringInfo_goalType">{{goalData.name}}</p>
            </div>
        </div>
        <div class="goalAndFinish_container">
            <div class="container_item">
                <p class="goalAndFinish_title goal_dot">目标</p>
                <div class="goalAndFinish_data">{{goalData.goalAmount | formatMoney}}</div>
            </div>
            <div class="container_item">
                <p class="goalAndFinish_title finish_dot">完成(元)</p>
                <div class="goalAndFinish_data">{{goalData.finishedAmount | formatMoney}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import RingDiagram from '../../../components/RingDiagram/RingDiagram';

export default {
    name: 'achievementGoal',
    components: {
        RingDiagram
    },
    props: {
        // 目标数据
        goalData: {
            type: Object,
            required: true
        }
    },
    computed: {
        // 环形图配置
        ringCharts () {
            return {
                id: 'ringChart',
                innerSize: '92%',
                chartMaxWidth: 1000,
                chartSize: '138%',
                chartHeight: 170,
                chartData: [
                    {
                        name:'unfinish',   
                        y: 100 - this.finishRate,
                        color: '#EFEFEF'
                    },
                    {
                        name: 'finish',
                        y: this.finishRate || '',
                        color: '#528BDB'
                    }
                ]
            }
        },

        // 完成率
        finishRate () {
            let rate = Number(this.goalData.completionRate.split('%')[0]);
            return rate >= 100? 100 : rate;
        }  
    },
    data () {
        return {}
    },
    methods: {
        // 跳转进目标
        goGoal () {
            this.$emit('click');
        }
    }
}
</script>
<style lang='scss'>
@import '../../../crmBase.scss';

.data_board_index{
    .achievement_goal{
        padding-right: rem(15);
        margin-top: rem(8);
        .goal_main{
            position: relative;
            .goal_msg{
                position: absolute;
                margin: auto;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: rem(110);
                height: rem(75);
                text-align: center;
                .goal_title{
                    font-size: rem(12);
                    color: #999;
                }
                .goal_precent{
                    margin-top: rem(3);
                    font-size: rem(30);
                    color: #666;
                    line-height: 1;
                }
                .ringInfo_goalType{
                    margin-top: rem(5);
                    font-size: rem(13);
                    color: #666;
                }
                .goal_active{
                    color: #468CEB;
                }
            }
        }
        .goalAndFinish_container{
            display: flex;
            margin-top: rem(5);
            .container_item{
                flex: 1;
                text-align: center;
            }
            .goalAndFinish_title{
                margin-bottom: rem(6);
                font-size: 12px;
                color: #999;
                &:before{
                    content: '';
                    margin: -2px 5px 0 0;
                    display: inline-block;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    vertical-align: middle;
                }
                &.goal_dot:before{
                    background: #1ABEAC;
                }
                &.finish_dot:before{
                    background: #468CEB;
                }
            }
            .goalAndFinish_data{
                color: #333;
                word-break: break-all;
                font-size: rem(20);
            }
        }
    }
}
</style>
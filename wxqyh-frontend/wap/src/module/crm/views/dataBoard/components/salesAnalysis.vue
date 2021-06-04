<template>
    <div class="border_msg sale_analysis">
        <h1 class="title">销售行为分析</h1>
        <div class="sale_analysis_data">
            <div class="column">
                <div class="analysis_item" @click="goAnalysis('client')">
                    <div>
                        <i class="iconfont cr-icon_a_xsxw icon_client"></i>
                    </div>
                    <div>
                        <p class="item_data">{{saleBehaviorData.lastAddClientCount}}</p>
                        <p class="item_name">新增客户</p>
                    </div>
                </div>
                <div class="analysis_item" @click="goAnalysis('contact')">
                    <div>
                        <i class="iconfont cr-icon_a_xsxw1 icon_contract"></i>
                    </div>
                    <div>
                        <div class="item_data">{{saleBehaviorData.lastAddContactsCount}}</div>
                        <div class="item_name">新增联系人</div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="analysis_item" @click="goAnalysis('business')">
                    <div>
                        <i class="iconfont cr-icon_a_xsxw4 icon_business"></i>
                    </div>
                    <div>
                        <div class="item_data">{{saleBehaviorData.lastAddBusinessCount}}</div>
                        <div class="item_name">新增商机</div>
                    </div>
                </div>
                <div class="analysis_item" @click="goAnalysis('contract')">
                    <div>
                        <i class="iconfont cr-icon_a_xsxw2 icon_contact"></i>
                    </div>
                    <div>
                        <div class="item_data">{{saleBehaviorData.lastAddContractCount}}</div>
                        <div class="item_name">新增合同</div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="analysis_item" @click="goAnalysis('visit')">
                    <div>
                        <i class="iconfont cr-icon_a_xsxw3 icon_visit"></i>
                    </div>
                    <div>
                        <div class="item_data">{{saleBehaviorData.lastAddVisitCount}}</div>
                        <div class="item_name">新增拜访</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'salesAnalysis',
    props: {
        // 销售行为数据
        saleBehaviorData: {
            type: Object,
            required: true
        }
    },
    data () {
        return {}
    },
    methods: {
        // 进入销售行为分析
        goAnalysis (crmType) {
            this.$emit('click', crmType);
        }
    }
}
</script>
<style lang='scss'>
@import '../../../crmBase.scss';

.sale_analysis{
    margin-top: rem(8);
    padding-bottom: 0;
    .sale_analysis_data{
        .column{
            .analysis_item{
                display: inline-flex;
                width: 49%;
                padding: 0 rem(15);
                margin-bottom: rem(20);
                font-size: 0;
                vertical-align: top;
                box-sizing: border-box;
                cursor: pointer;
                .item_data{
                    max-width: rem(110);
                    margin-bottom: rem(5);
                    font-size: rem(16);
                    color: #333;
                    @include ellipsis;
                }
                .item_name{
                    font-size: rem(12);
                    color: #999; 
                }
                .icon_client{
                    color: #53cad8;
                }
                .icon_contract{
                    color: #fcd42f;
                }
                .icon_business{
                    color: #ffab30;
                }
                .icon_contact{
                    color: #7987f2;
                }
                .icon_visit{
                    color: #55e185;
                }
            }
        }
    }
}
</style>
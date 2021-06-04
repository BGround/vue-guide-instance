<template>
    <div class="border_msg" @click="goContract">
        <h1 class="title">合同回款</h1>
        <div class="received_data">
            <div class="received_item">
                <div>
                    <i class="iconfont cr--s-icon1 icon_blue"></i>
                </div>
                <div>
                    <p class="item_data">{{contractData.planRepayAmount}}</p>
                    <p class="item_name">计划(万元)</p>
                </div>
            </div>
            <div class="received_item">
                <div>
                    <i class="iconfont cr-reality1 icon_blue"></i>
                </div>
                <div>
                    <div class="item_data">{{contractData.actualRepayAmount}}</div>
                    <div class="item_name">实际(万元)</div>
                </div>
            </div>
            <div class="received_item">
                <div>
                    <i class="iconfont cr-money1 icon_blue"></i>
                </div>
                <div>
                    <div class="item_data">{{contractData.billRepayAmount}}</div>
                    <div class="item_name">开票(万元)</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'contractReceived',
    props: {
        // 合同回款数据
        contractData: {
            type: Object,
            required: true
        }
    },
    data () {
        return {}
    },
    methods: {
        // 进入合同回款
        goContract () {
            this.$emit('click');
        }
    }
}
</script>
<style lang='scss'>

</style>
<template>
    <div class="contract_index">
        <router-link class="contract_header" tag="div" :to="{path: '/contractList/isread', query: {contractOwner: '3', agentCode: 'contract'}}">
            <div class="contract_msg">
                <p class="number">{{deelNum}}</p>
                <p class="title">待处理合同</p>
                <p class="tips">点击查看</p>
            </div>
        </router-link>
        <div class="contract_opreate_list">
            <div class="opreate_title">填写</div>
            <div class="opreate_box">
                <router-link class="box_item" tag="div" :to="{name: 'contractOperate', query: {agentCode: 'contract'}}">
                    <div>
                        <i class="item_icon add_icon"></i>
                        <p>新建合同</p>
                    </div>
                </router-link>
                <router-link class="box_item" tag="div" :to="{path: '/contractList/isread', query: {submitStatus: '0', agentCode: 'contract'}}">
                    <div>
                        <i class="item_icon draft_icon"></i>
                        <p>草稿<span class="draft_num">({{draftNum}})</span></p>
                    </div>
                </router-link>
                <div class="box_item"></div>
            </div>
        </div>
        <div class="contract_opreate_list">
            <div class="opreate_title">我的</div>
            <div class="opreate_box">
                <router-link class="box_item" tag="div" :to="{path: '/contractList/isread', query: {contractOwner: '1', agentCode: 'contract'}}">
                    <div>
                        <i class="item_icon my_create_icon"></i>
                        <p>我创建的</p>
                    </div>
                </router-link>
                <router-link class="box_item" tag="div" :to="{path: '/contractList/isread', query: {contractOwner: '0', agentCode: 'contract'}}">
                    <div>
                        <i class="item_icon my_charge_icon"></i>
                        <p>我负责的</p>
                    </div>
                </router-link>
                <router-link class="box_item" tag="div" :to="{path: '/contractList/isread', query: {agentCode: 'contract'}}">
                    <div>
                        <i class="item_icon all_contract_icon"></i>
                        <p>全部合同</p>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
import { getIndexInfo } from '../../../api/contract/getData';
import { mapActions } from 'vuex';

export default {
    name: 'ContractIndex',
    data () {
        return {
            deelNum: 0,  // 待处理合同数量
            draftNum: 0  // 草稿数量
        }
    },
    created () {
        this.init();
    },
    methods: {
        ...mapActions('list' ,[
            'setCacheArray'
        ]),

        // 初始化
        init () {
            this.setCacheArray({isClear: true});  // 清除列表缓存
            this.getIndexInfo();
        },

        // 获取合同首页信息
        getIndexInfo () {
            getIndexInfo().then(res => {
                if(res.code == '0'){
                    let { draftNum, waitingTaskNum } = res.data;
                    this.deelNum = waitingTaskNum;
                    this.draftNum = draftNum;
                }
                else{
                    _.alert('提示', res.desc);
                }
            });
        }
    }
}
</script>
<style lang="scss">
@import './ContractIndex.scss';
</style>



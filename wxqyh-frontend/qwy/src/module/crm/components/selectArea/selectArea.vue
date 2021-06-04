<template>
    <div class="select-area" @click="handlClick" :style="{height: labelList.length > 0? '88px' : '48px'}">
        <div>
            <div class="tip" v-show="labelList.length === 0">
                <i class="add_icon"></i>
                <span>{{palceholder}}</span>
            </div>
            <div v-show="labelList.length > 0">
                <qw-label 
                    v-for="(item,idx) in labelList" 
                    :key="idx" 
                    :keyValue="item.key"
                    @click.native="stop"
                    @close="del"
                >
                    <template slot="icon" v-if="item.icon">
                        <i class="label-icon" :style="{background: `url(${item.icon}) no-repeat center`}"></i>
                    </template>
                    <template>
                        {{item.val}}
                    </template>
                </qw-label>
            </div>
        </div>
    </div>
</template>
<script>
import QwLabel from '@/components/exportComponents/qw-label';

export default {
    name: 'selectArea',
    components: {
        QwLabel
    },
    props: {
        type: {
            type: String,
            default: ''
        },
        palceholder: {
            type: String,
            default: '点击选择'
        },

        // 标签列表
        labelList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {}
    },
    methods: {
        // 点击事件
        handlClick() {
            this.$emit('click');
        },

        // 关闭标签
        del(key) {
            this.$emit('del', key, this.type);
        },

        // 阻止冒泡
        stop(e){
            e.stopPropagation();
        }
    }
}
</script>
<style lang='scss' scoped>
.select-area{
    position: relative;
    padding: 0 0 8px 8px;
    width: 340px;
    height: 48px;
    border: 1px dashed #CBCBCB;
    box-sizing: border-box;
    background: #fff;
    overflow: auto;
    cursor: pointer;
    .tip{
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 80px;
        height: 19px;
        color: #A6A6A6;
        .add_icon{
            display: inline-block;
            margin-top: -2px;
            width: 12px;
            height: 12px;
            background: url('~assets/images/ic_b-add.png') no-repeat center;
            background-size: 100%;
            vertical-align: middle;
        }
    }
    .label-icon{
            display: inline-block;
            margin-top: -3px;
            width: 20px;
            height: 20px;
            vertical-align: middle;
    }
}
</style>
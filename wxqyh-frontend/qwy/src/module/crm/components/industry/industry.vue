/**
    @params selectedArr: 存放已选中的key
    @params confirm(返回选择的值): 确认选择行业
    @expamle
        <industry
            :selectedArr="['0101', '1200']"
            @confirm="confirm"
        ></industry>
*/
<template>
    <div class="industry-box">
        <div class="list-wrap">
            <tree
                :treeData="treeData"
                showCheckBox
                ref="tree"
                @change="change"
            ></tree>
        </div>
        <div class="box-bar">
            <span class="select-num">已选 {{selectNum}}</span>
            <div class="sure-btn">
                <qw-button type='primary' @click="confirm">确定</qw-button>
            </div>
        </div>
    </div>
</template>
<script>
import Tree from 'crm/components/tree/tree';
import QwButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import { getIndustry } from 'crm/api/territorialSea';

export default {
    name: 'Industry',
    components: {
        Tree,
        QwButton
    },
    props: {
        // 存放已选中的key
        selectedArr: {
            type: Array
        }
    },
    data () {
        return {
            treeData: [],  // 树数据
            selectNum: 0,  // 已选行业数量
            checkedArr: []  // 已选行业
        }
    },
    watch: {
        selectedArr(newVal) {
            this.setTree(newVal);
            this.selectNum = newVal.length;
        }
    },
    created() {
        this.init();
    },
    methods: {
        // 初始化
        init() {
            this.getIndustry();
        },

        // 获取行业数据
        getIndustry() {
            getIndustry().then(res => {
                if(res.code == '0'){
                    let list = res.data.pageData;
                    let arr = [];

                    list.map(item => {
                        if(item.fatherid === ''){
                            let obj = {
                                key: item.code,
                                title:item.industry,
                                expand: item.code === '01'? true : false,
                                children: this.getChildData(item.code, list)
                            }
                            arr.push(obj);
                        }
                    })
                    this.treeData = arr;

                    // 设置默认选中
                    this.setTree(this.selectedArr);
                    this.selectNum = this.selectedArr.length;
                }
                else{
                    _.alert('提示', res.desc);
                }
            })
        },
  
        // 获取子节点数据
        getChildData(id, arr) {
            let newArry = [];

            arr.map(item => {
                if(item.fatherid === id){
                    let obj = {
                        key: item.code,
                        title:item.industry
                    }
                    newArry.push(obj);
                }
            })
            return newArry;
        },

        // 勾选行业
        change(checkedArr) {
            this.checkedArr = checkedArr;
            this.selectNum = checkedArr.length;
        },

        // 设置默认选中
        setTree(list) {
            list.map(item => {
                this.loopTree(this.treeData, item);
            })
        },

        // 递归树，设置默认值
        loopTree(arr, key) {
            let fatherid = key.slice(0, 2);
            arr.map(item => {
                if(item.children && item.children.length > 0){
                    this.loopTree(item.children, key);
                }
                if(key === item.key){
                    this.$set(item, 'checked', true);
                }
                // 有选中则展开
                if(fatherid === item.key){
                    item.expand = true;
                }
            })
        },

        // 确认选择
        confirm() {
            let tree = this.$refs.tree
            this.$emit('confirm', tree.checkedArr);
        }
    }
}
</script>
<style lang='scss' scoped>
.industry-box{
    height: 384px;
    background: #fff;
    border: 1px solid #F7F7F7;
    box-shadow: 2px 4px 10px #cdcdcd;
    .list-wrap{
        padding-top: 8px;
        height: 336px;
        overflow: auto;
        box-sizing: border-box;
    }
    .box-bar{
        position: relative;
        padding: 0 15px;
        height: 48px;
        border-top: 1px solid #F7F7F7;
        line-height: 48px;
        .select-num{
            font-size: 14px;
            color: #A6A6A6;
        }
        .sure-btn{
            position: absolute;
            top: 8px;
            bottom: 0;
            right: 15px;
            margin: auto;
        }
    }
}
</style>

<template>
    <div class="client-type-box">
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
import { getClientType } from 'crm/api/client';

export default {
    name: 'clinetType',
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
    data() {
        return {
            treeData: [],  // 树数据
            selectNum: 0,  // 已选客户类别数量
            checkedArr: [],  // 已选客户列表
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
            this.getClientType();
        },

        // 获取客户类别数据
        getClientType() {
            getClientType().then(res => {
                if(res.code == '0'){
                    let list = res.data.treeData;
                    this.treeData = list;

                    // 设置默认选中
                    this.setTree(this.selectedArr);
                    this.selectNum = this.selectedArr.length;
                }
                else{
                    _.alert('提示', res.desc);
                }
            })
        },

        // 勾选客户列表
        change(checkedArr) {
            this.checkedArr = checkedArr;
            this.selectNum = checkedArr.length;
        },

        // 设置默认选中
        setTree(list) {
            let arr = [];
            list.map(item => {
                this.loopTree(this.treeData, item);
                arr.push(this.findParent(this.treeData, item));
            });

            arr.map(item => {
                if(item.length > 1){
                    item.map(childItem => {
                        this.expandNode(this.treeData, childItem);
                    })
                }
            })
        },

        // 递归树，设置默认值
        loopTree(arr, key) {
            arr.map(item => {
                if(item.children && item.children.length > 0){
                    this.loopTree(item.children, key);
                }
                if(key === item.key){
                    this.$set(item, 'checked', true);
                }
            })
        },

        // 子节点找父亲
        findParent(array, key) {
            let stack = [];
            let going = true;

            let walker = (array, key) => {
                array.map(item => {
                    if (!going) return;

                    stack.push(item['key']);
                    if(item['key'] === key){
                        going = false;
                    }
                    else if(item['children']){
                        walker(item['children'], key);
                    }
                    else{
                        stack.pop();
                    }
                });
                if (going) stack.pop();
            }

            walker(array, key);

            return stack;
        },

        // 展开节点
        expandNode(arr, key) {
            arr.map(item => {
                if(item.children && item.children.length > 0){
                    this.expandNode(item.children, key);
                }
                if(key === item.key){
                    this.$set(item, 'expand', true);
                }
            })
        },


        // 确认选择
        confirm() {
            let tree = this.$refs.tree;
            this.$emit('confirm', tree.checkedArr);
        }
    }
}
</script>
<style lang='scss' scoped>
.client-type-box{
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

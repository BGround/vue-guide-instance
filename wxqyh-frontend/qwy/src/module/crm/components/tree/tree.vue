/** 
    参数: 
    @params treeData: 节点数据
        treeData: [
                {
                    key: 'parent1',
                    title: 'parent 1',
                    expand: true,  // 是否展开
                    checked: true,  // 是否勾选
                    render: (h, { data }) => {  // render函数
                        return h('span', {
                            style: {
                                display: 'inline-block',
                                color: 'red'
                            }
                        }, [
                            h('span', [
                                h('span', data.title)
                            ]),
                        ]);
                    },
                    children: [
                        {
                            key: 'parent1-1',
                            title: 'parent 1-1',
                            expand: true,
                            children: [
                                {
                                    key: 'leaf1-1-1',
                                    title: 'leaf 1-1-1'
                                },
                                {
                                    key: 'leaf1-1-2',
                                    title: 'leaf 1-1-2',
                                    checked: true
                                }
                            ]
                        },
                        {
                            key: 'parent1-2',
                            title: 'parent 1-2',
                            expand: true,
                            children: [
                                {
                                    key: 'parent1-2-1',
                                    title: 'leaf 1-2-1',
                                    checked: true
                                },
                                {
                                    key: 'parent1-2-2',
                                    title: 'leaf 1-2-2',
                                    disabled: true  // 不给选中
                                }
                            ]
                        }
                    ]
                }
            ]
    @params showCheckBox(默认不显示): 是否显示选择框
    @params radio(默认不开启): 是否单选
    @params parentRender: 最顶层的render函数
        parentRender(h, { data }) {
            return h('span', {
                        style: {
                            display: 'inline-block',
                            color: 'green'
                        }
                    }, [
                        h('span', [
                            h('span', data.title)
                        ])
                    ]);
        }
    @params operateRender: 操作栏render函数
        operateRender(h, { data }) {
            return h('div', {
                        style: {
                            'display': 'flex',
                            'width': '90px',
                            'height': '30px',
                            'color': '#fff',
                            'line-height': '30px',
                            'background': 'rgba(0, 0, 0, 0.6)',
                            'border-radius': '4px',
                            'text-align': 'center'
                        }
                    }, [
                        h('span', {
                            style: {
                                'flex': 1,
                            },
                            on: {
                                click: (e) => {
                                    e.stopPropagation();
                                    console.log('编辑', data);
                                }
                            }
                        }, '编辑'),
                        h('span', {
                            style: {
                                'flex': 1
                            },
                            on: {
                                click: (e) => {
                                    e.stopPropagation();
                                    console.log('删除', data);
                                }
                            }
                        }, '删除'),
                    ]);
        }
    @params icon: 图标

    方法:
    @params change: 选中复选框时回调函数
    @params select: 选择节点时回调函数

    @example
        <tree 
            :treeData="treeData" 
            showCheckBox 
            :operateRender="operateRender"
            @change="handleCheck"
            @select="handleSelect"
        ></tree>
 */
<template>
    <div>
        <tree-node 
            v-for="(item,idx) in treeData"
            :key="idx"
            :treeItem="item"
            :radio="radio"
            :showCheckBox="showCheckBox"
            :parentRender="parentRender"
            :operateRender="operateRender"
            :icon="icon"
        ></tree-node>
    </div>
</template>
<script>
import TreeNode from './treeNode';

export default {
    name: 'Tree',
    components: {
        TreeNode
    },
    props: {
        // 节点数据
        treeData: {
            type: Array,
            required: true
        },

        // 是否单选
        radio: {
            type: Boolean,
            default: false
        },

        // 是否显示选择框
        showCheckBox: {
            type: Boolean,
            default: false
        },

        // 父级render函数
        parentRender: {
            type: Function,
            default: null
        },

        // 操作栏render函数
        operateRender: {
            type: Function,
            default: null
        },

        // 图标
        icon: {
            type: String
        }
    },
    data () {
        return {
            checkedArr: [],  // 选中数组
            checkKey: '',  // 选择框key
        }
    },
    watch: {
        treeData: {
            handler(newVal) {
                this.checkedArr.length = 0;  // 重置checkedArr
                this.loopArr(newVal);
            },
            deep: true
        }
    },
    mounted() {
        // 监听handelCheck方法
        this.$on('handleCheck', (key) => {
            this.key = key;
            setTimeout(() => {
                this.$emit('change', this.checkedArr);
            }, 0)
        });

        // 监听handleSelect方法
        this.$on('handleSelect', this.dealSelect);
        this.loopArr(this.treeData);
    },
    methods: {
        // 递归复选框
        loopArr(arr) {
            arr.map(item => {
                if(item.children && item.children.length > 0){
                    this.loopArr(item.children);
                }
                if(this.radio && this.key){
                    if(item.key !== this.key){
                        this.$set(item, 'checked', false);
                    }
                }
                if(item.checked){
                    this.checkedArr.push(item);
                }
            })
        },

        // 递归选择的节点
        selectNode(arr, key) {
            arr.map((item,idx) => {
                if(item.children && item.children.length > 0){
                    this.selectNode(item.children, key);
                }

                if(item.key !== key){
                    this.$set(item, 'selected', false);
                }
            })
        },

        // 处理选择树节点
        dealSelect(key, nodeData) {
            this.selectNode(this.treeData, key);
            this.$emit('select', nodeData);
        }
    }
}
</script>
<style lang='scss' scoped>

</style>
<template>
    <div class="crm_filter_item">
        <div
            class="filter_item_wrap"
            v-show="itemData.show"
            v-clickOut="downArrow"
            @click="handleClick"
        >
            <div class="name" :class="{top: isTop}">{{selectVal.name || ''}}</div>
        </div>
        <div
            v-if="itemData.type === 'radioSelect'"
            class="filter_bar_wrap"
        >
            <div class="radio_select_wrap" v-show="isTop">
                <crm-radio-select
                    :selectData="itemData.data"
                    :defaultVal="currentVal"
                    @choose="chooseItem"
                ></crm-radio-select>
            </div>
            <div v-show="isTop" class="crm_filter_overlay" @click="downArrow"></div>
        </div>
    </div>
</template>
<script>
import CrmRadioSelect from '../CrmRadioSelect/CrmRadioSelect';

export default {
    name: 'CrmFilterItem',
    props: {
        // 当前选中值
        currentVal: {
            type: String,
            default: ''
        },

        // 选择列数据
        itemData: {
            type: Object,
            default: () => {}
        }
    },
    components: {
      CrmRadioSelect
    },
    directives: {
        //  点击空白地方隐藏选项列表
        clickOut: {
            bind(el, binding){
                el.handler = function(e){
                    // 如果是点击当前节点，则不触发选择列表消失
                    if (el.contains(e.target)) return false;
                    if (binding.expression) {
                        binding.value();
                    }
                }
                document.addEventListener('click', el.handler);
            },
            unbind: function(el) {
                document.removeEventListener('click', el.handler)
            }
        }
    },
    data () {
        return {
            isTop: false,  // 箭头是否向上
            selectVal: {}
        }
    },
    watch: {
        currentVal (newVal) {
            this.watchDefaultVal(newVal);
        }
    },
    mounted () {
        this.watchDefaultVal(this.currentVal);
    },
    methods: {
        // 点击筛选项
        handleClick () {
            this.isTop = !this.isTop;
            this.$emit('clickFilter', this.itemData.key);
        },

        // 将箭头方向向下
        downArrow () {
            this.isTop = false;
        },

        // 选择每一项回调函数
        chooseItem (item) {
            this.selectVal = item;
            this.$emit('choose', item, this.itemData.key);
        },

        // 监听默认值变化
        watchDefaultVal (val) {
            if(this.itemData.data){
                this.selectVal = this.itemData.data.filter(item => item.key === val)[0] || {};
            }
        }
    }
}
</script>
<style lang='scss' scoped>
@import './CrmFilterItem.scss';
</style>

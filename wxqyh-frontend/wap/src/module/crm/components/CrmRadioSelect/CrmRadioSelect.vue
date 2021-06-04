<template>
    <ul class="crm_radio_select">
        <li 
            v-for="(item,idx) in selectData" 
            :key="idx"
            :class="{active: item.key === selectVal}"
            @click="selectItem(item)"
        >
            <div class="name">{{item.name}}</div>   
        </li>
    </ul>
</template>
<script>
export default {
    name: 'CrmRadioSelect',
    props: {
        // 选择列表数据
        selectData: {
            type: Array,
            default: () => [],
            required: true
        },

        // 默认值
        defaultVal: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            selectVal: this.defaultVal,  //当前选中的值
        }
    },
    watch: {
        defaultVal (newVal) {
            this.selectVal = newVal;
        }
    },
    methods: {
        // 选择每一项
        selectItem (item) {
            this.selectVal = item.key;
            this.$emit('choose', item);
        }
    }
}
</script>
<style lang='scss' scoped>
@import './CrmRadioSelect.scss';
</style>
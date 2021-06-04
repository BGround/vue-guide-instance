/**
    @params filterConfig(必传)：筛选bar配置表
    filterConfig: {
        itemData: [
                {
                    key: 'time',  // 筛选项key
                    show: true,   // 是否显示
                    type: 'radioSelect',   // 选择类型：radioSelect(单选) other(引入其他组件)
                    defaultVal: {  // 默认值
                        name: '上月',
                        key: 'lastMonth'
                    },
                    data: [  // 单选项数据
                        {
                            name: '本月',
                            key: 'month'
                        },
                        {
                            name: '上月',
                            key: 'lastMonth'
                        },
                        {
                            name: '本季',
                            key: 'season'
                        },
                        {
                            name: '今年',
                            key: 'year'
                        }
                    ]
                },
                {
                    key: 'teamOrPerson',
                    show: true,
                    type: 'radioSelect',
                    data: [
                        {
                            name: '个人',
                            key: 'person'
                        },
                        {
                            name: '销售团队',
                            key: 'team'
                        }
                    ]
                },
                {
                    key: 'team',
                    show: false,
                    type: 'radioSelect',
                    data: []
                }
            ]
    }
    @params choose：点击单选列表回调函数，返回item(点击的列表项信息)和key(返回当前点击筛选项的key)
    @params clickFilter：点击筛选项回调函数，返回key(返回当前点击筛选项的key)
    @expamle(注意:可配置slot)
        <parent>
            <crm-filter-bar
                :filterConfig="filterConfig"
                @choose="chooseItem"
            >
                <div class="crm_filter_help">
                    <i class="help_icon">?</i>
                </div>
            </crm-filter-bar>
        </parent>
*/
<template>
    <div class="crm_bar_wrap">
        <div class="crm_filter_bar">
            <crm-filter-item
                v-for="item in filterConfig.itemData"
                :key="item.key"
                :currentVal="item.defaultVal || (item.data.length > 0 && item.data[0].key) || ''"
                :itemData="item"
                @choose="chooseItem"
                @clickFilter="clickFilter"
            ></crm-filter-item>
        </div>
        <div :style="slotClass">
            <slot></slot>
        </div>
    </div>
</template>
<script>
import CrmFilterItem from '../CrmFilterItem/CrmFilterItem';
import CrmRadioSelect from '../CrmRadioSelect/CrmRadioSelect';

export default {
    name: 'CrmFilterBar',
    components: {
        CrmFilterItem,
        CrmRadioSelect
    },
    props: {
        filterConfig: {
            type: Object,
            required: true
        },
        slotClass:{
            type:Object,
            required:false,
            default(){
                return {}
            }
        }
    },
    data () {
        return {}
    },
    methods: {
        // 选择每一项回调函数
        chooseItem (item, key) {
            this.$emit('choose', item, key);
        },

        // 点击筛选项
        clickFilter (key) {
            this.$emit('clickFilter', key);
        }
    }
}
</script>
<style lang="scss" scoped>
@import './CrmFilterBar.scss';
</style>



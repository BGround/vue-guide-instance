<template>
    <div class="search-conditions">
        搜索结果：
        <span class="condition" v-for="(val, key) in conditionList" :key="key" @mouseover="currKey = key" @mouseout="currKey = ''">
            <span class="condition-title">{{val}}：</span>
            <span class="condition-text ellipsis">{{conditionText(key)}}</span>
            <span class="del-btn" :class="currKey == key ? 'active' : ''" @click="clear(key)">&nbsp;×</span>
        </span>
        <span class="c999">共 <span class="c333">{{setting.totalRows}}</span> 条结果</span>
        <div class="fr btn-box">
            <span class="fr clear-btn" @click="clear('ALL')">清除条件</span>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'searchCondition',
    data() {
        return {
            conditionList: {},
            isTask: {
                "0": '普通单',
                "1": '任务单',
                "2": '审批单',
                "3": '外部单'
            },
            formStatus: {
                "1": '已发布',
                "2": '草稿',
                "-1": '禁用'
            },
            belong: {
                "1": '我创建的',
                "2": '我授权的',
                "3": '授权给我的'
            },
            conditionTitle: {
                title: '表单名称',
                personName: '表单创建人',
                formStatus: '表单状态',
                typeId: '分组',
                isTask: '类型',
                searchTime: '创建时间',
                belong: '表单归属',
                commitTime: '提单时间'
            },
            currKey: ''
        }
    },
    computed: {
        ...mapGetters('form/index', [
            'viewMode',
            'checkedList',
            'currGroup', // 当前分组列表，包括当前分组的父分组
            'listData',
            'searchValue',
            'showVipTips',
            'setting'
        ]),
        currentGroup() {
            return this.currGroup[this.currGroup.length - 1]
        },
    },
    created() {
        this.conditionShow();
    },
    methods: {
        ...mapActions('form/index',[
            'GetFormData',
            'SetCurrGroup',
            'SetSetting',
            'SetSearchValue',
            'SetIsSearch',
            'SetShowResult'
        ]),
        conditionShow() {
            let list = Object.assign({},this.conditionTitle);
            for(let key in this.conditionTitle) {
                let searchKey;
                if(key == 'searchTime') {
                    searchKey = 'searchValue.startTime'
                } else if(key == 'commitTime') {
                    searchKey = 'searchValue.closeStartTime'
                } else {
                    searchKey = 'searchValue.' + key
                }
                if(!this.searchValue[searchKey]) {
                    Reflect.deleteProperty(list, key)
                }
            }
            this.conditionList = list;
        },
        isEmptySearchValue() {
            let isEmpty = false,
                searchValue = this.searchValue;
            if(JSON.stringify(searchValue) == '{}') {
                isEmpty = true
            } else {
                for(let key in searchValue) { // 判断搜索条件是否全部为空
                    isEmpty = this.isEmpty(searchValue[key]);
                    if(!isEmpty) {
                        break;
                    }
                }
            }
            return isEmpty;
        },
        isEmpty(value) { // 判断是否是空数组、空对象、空字符串、undefined之一
            let isEmptyArray = (Array.isArray(value) && value.length === 0)
                || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0),
                isEmptyObject = JSON.stringify(value) == '{}';
            return value == undefined || value == "" || isEmptyArray || isEmptyObject;
        },
        clear(key) { // 清空搜索条件
            let searchValue = {},
                setViewMode = true;
            switch(key) {
                case 'ALL': this.SetIsSearch(false);
                            this.SetCurrGroup([{ name: '全部分组', id: '' }]);
                            this.SetShowResult(false);
                            setViewMode = false;
                            break;
                case 'searchTime': searchValue['searchValue.startTime'] = '';
                                   searchValue['searchValue.endTime'] = '';
                                   break;
                case 'commitTime': searchValue['searchValue.closeStartTime'] = '';
                                   searchValue['searchValue.closeEndTime'] = '';
                                   break;
                case 'typeId': this.SetCurrGroup([{ name: '全部分组', id: '' }]);
                                 key = 'searchValue.' + key;
                                 searchValue[key] = '';
                                 break;
                default: key = 'searchValue.' + key;
                         searchValue[key] = '';
            }
            this.SetSetting({page: 1})
            this.SetSearchValue(searchValue);
            if(setViewMode && !this.isEmptySearchValue()) {
                this.GetFormData({viewMode: 1});
            } else {
                this.GetFormData();
            }
        },
        conditionText(key) { // 搜索条件展示内容
            let value = this.searchValue,
                searchKey = 'searchValue.' + key;
            switch(key) {
                case 'isTask':
                case 'belong':
                case 'formStatus': return this[key][value[searchKey]];
                case 'searchTime': return value['searchValue.startTime'] + ' 至 ' + value['searchValue.endTime'];
                case 'commitTime': return value['searchValue.closeStartTime'] + ' 至 ' + value['searchValue.closeEndTime'];
                case 'typeId': return this.currentGroup.name;
                default: return value[searchKey];
            }
        },
    },
    watch: {
        searchValue: {
            handler() {
                this.conditionShow();
            },
            deep: true
        }
    }
}
</script>

<style scoped>
.search-conditions {
    position: relative;
    padding: 5px 100px 5px 10px;
    margin-top: 10px;
    font-size: 13px;
    color: #333;
    border: 1px solid #ccc;
}
.condition {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    padding: 3px 10px;
    margin-right: 10px;
    border: 1px solid #ccc;
}
.condition:hover {
    border-color: #ccc;
}
.condition-title {
    color: #999;
}
.condition-text {
    display: inline-block;
    max-width: 240px;
    color: #333;
    vertical-align: top;
}
.condition .del-btn {
    vertical-align: top;
    font-size: 16px;
    color: #999;
    cursor: pointer;
}
.condition .del-btn.active {
    color: #F56262;
    font-weight: bolder;
}
.condition .del-btn:hover {
    color: red;
}
.clear-btn, .save-btn {
    color: #999;
    padding: 0 5px;
    cursor: pointer;
}
.clear-btn:hover {
    color: #C31725;
}
.btn-box {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
}
.c999 {
    color: #999999;
}
.c333 {
    color: #333;
}
</style>

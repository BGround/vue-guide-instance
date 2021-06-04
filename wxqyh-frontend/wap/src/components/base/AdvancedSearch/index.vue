<template>
    <transition name="slide">
        <div class="advancedSearch">
            <slot name="header" refs="slotHeader"></slot>
            <div
                class="SS_main">
                <div
                    class="SS_form-group"
                    v-for="(field, index) in setting"
                    :key="index"
                    v-show="show(field.show)">
                <component
                    :is="field.type + 'Field'"
                    :field="field"
                    :search-value.sync='searchValue'
                    :setting='setting' @checkedRadio="checkedRadio">
                    <span slot="right_content">{{field.selectValue}}</span>    
                </component>
                </div>
                <slot name="footer" refs="slotFooter"></slot>
            </div>
            <div class="SS_footer">
                <span class="close"
                    :style="closeConfig.style"
                    @click="close">{{closeConfig.text}}</span>
                <span class="reset"
                    :style="resetConfig.style"
                    @click="reset">{{resetConfig.text}}</span>
                <span class="search"
                    :style="searchConfig.style"                    
                    @click="search">{{searchConfig.text}}</span>
            </div>
        </div>
    </transition>
</template>

<script>
import checkboxField from './SearchCheckbox'
import dateField from './SearchDate'
import radioField from './SearchRadio'
import textField from './SearchText'
import selectUserOrDepartField from './SearchSelectUserOrDepart'
import selectField from './SearchSelect'
import intervalField from './SearchInterval'
import addressField from './SearchAddress'
import handleField from './SearchHandle'
export default {
    name: 'QwAdvancedSearch',
    components: {
        checkboxField,
        dateField,
        textField,
        radioField,
        selectUserOrDepartField,
        selectField,
        intervalField,
        addressField,
        handleField
    },
    props: {
        setting: { // 配置
            type: Array,
            required: true
        },
        cacheSearchValue: Object, // 缓存高级搜索时，需要传入的searchValue
        closeConfig: {
            type: Object,
            default() {
                return { style: {}, text: this.$t('i18n.cancel'), preventDefault: false }
            }
        },
        resetConfig: {
            type: Object,
            default() {
                return { style: {}, text: this.$t('i18n.reset'), preventDefault: false }
            }
        },
        searchConfig: {
            type: Object,
            default() {
                return { style: {}, text: this.$t('i18n.sureBtn'), preventDefault: false }
            }
        }
    },
    data() {
        return {
            searchValue: {}
        }
    },
    methods: {
        checkedRadio(index,key,value){
            this.$emit('checkedRadio', index, key, value)
        },
        search() { // 搜索
            if(!this.searchConfig.preventDefault) {
                this.close();                
            }
            this.$emit('search', this.filterEmpty(this.searchValue))
        },
        reset() { // 重置
            if(!this.resetConfig.preventDefault) {
                this.searchValue = {}
            }
            this.$emit('reset')
        },
        close() { // 关闭
            this.$emit('close')
        },
        show(show) { // 判断是否查询条件显示
            return show == undefined ? true : show;
        },
        filterEmpty(obj) {
            let copyObj = JSON.parse(JSON.stringify(obj));
            for(let [key, value] of Object.entries(copyObj)) {
                if(value == '' || JSON.stringify(value) == '{}') {
                    delete copyObj[key]
                }
            }
            return copyObj
        }
    },
    watch: {
        'cacheSearchValue': {
            handler() {
                this.searchValue = this.cacheSearchValue;
            },
            deep: true,
            immediate: true
        }
    }
}
</script>

<style scoped>
.advancedSearch {
    position: fixed;
    display: flex;
    flex-direction: column;
    top: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    background-color: #fff;
}
@media screen and (min-width: 1024px) {
    .advancedSearch {
        width: 740px;
        margin: auto;
    }
    .SS_footer {
        width: 740px;
    }
}
.SS_main {
    padding: 0 15px 15px 15px;
    overflow: auto;
    font-size: 13px;
    flex: auto;
}
.SS_footer {
    display: flex;
    z-index: 10;
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
    min-height: 50px;
    line-height: 50px;
    font-size: 14px;
}
.SS_footer .close {
    flex: 1;
    background-color: #F6F7FB;
    color: #333;
    text-align: center;
    border-right: 1px solid rgba(204,204,204,0.5);
    cursor: pointer;
}
.SS_footer .reset {
    flex: 1;
    background-color: #F6F7FB;
    color: #2F7DCD;
    text-align: center;
    cursor: pointer;
}
.SS_footer .search {
    flex: 2;
    background-color: #2F7DCD;
    color: #fff;
    text-align: center;
    cursor: pointer;
}
.SS_form-group {
    padding-top: 10px;
    font-size: 13px;
}
.slide-enter-active, .slide-leave-active {
    transition: all .3s ease;
}
.slide-enter, .slide-leave-to {
    transform: translateX(740px);
}
::-webkit-scrollbar {
    width: 0;
}
/*.mbsc-android-holo .dwv{*/
    /*color:#f5f5f5;*/
/*}*/
/*.mbsc-android-holo .dwbc div:nth-child(2){*/
    /*left: calc(50% - 25px) !important;*/
/*}*/
</style>

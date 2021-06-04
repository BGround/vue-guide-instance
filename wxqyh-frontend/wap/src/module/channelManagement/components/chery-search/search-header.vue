<template>
<div class="header">
    <div class="department" @click="handleClickDepartment">
        <img class="department__icon" :src="iconLocation" alt="">
        <span class="department__name">{{getDepartmentName}}</span>
    </div>
    <div class="search-bar">
        <qw-search-bar ref="searchBar" v-model="value" @change="handleChangeKeyword" @focus="handleFocusInput" :placeholder="getPlaceholder">
        </qw-search-bar>
    </div>
</div>
</template>

<script>
import iconLocation from '@/module/channelManagement/static/images/icon_location.png';
export default {
    name: "search-header",
    components: {},
    data() {
        return {
            iconLocation: iconLocation,
            value: this.keyword,
        }
    },
    model: {
        event: 'change',
        prop: 'keyword',
    },
    props: {
        keyword: {
            type: String,
            required: true,
        },
        clearable: {
            type: Boolean,
            default () {
                return true;
            }
        },
        placeholder: {
            type: String,
            default () {
                return '搜索经销商名称、ERP号'
            }
        },
        departmentName: {
            type: String,
            default () {
                return ''
            }
        },
    },
    computed: {
        getDepartmentName() {
            return this.departmentName;
        },
        getPlaceholder() {
            return this.placeholder;
        }
    },
    watch: {
        value(value) {
            console.log(value)
            this.$emit('change', value)
        }
    },
    methods: {
        /**
         * 点击区域
         */
        handleClickDepartment() {
            this.$emit('click');
        },

        handleChangeKeyword(value) {

        },

        handleSearchKeyword() {
            this.$emit('search', value)
        },

        handleFocusInput() {
            this.$emit('focus');
        },

        handleBlurInput() {
            this.$emit('blur');
        },
        focus() {
            this.$refs['searchBar'].focus();
        }
    },
    created() {

    }
}
</script>

<style lang="scss" scoped>
.header {
    display: flex;
    align-items: center;
    height: 35px;
    box-sizing: border-box;
    background: #ffffff;
    padding: 6px 10px 3px;

    .local {
        margin-right: 10px;
        flex-basis: 74px;
        width: 74px;
        flex-grow: 0;
    }

    .search-bar {
        flex-shrink: 0;
        flex-grow: 1;
        margin-left: auto;
        height: 26px;

        & /deep/ {

            .qw-search-bar,
            .qw-search-bar__prefix,
            .qw-search-bar__input {
                height: 26px;
                line-height: 26px;
            }

            .qw-search-bar__clear.qw-icon-del,
            .qw-search-bar__icon,
            .qw-search-bar__placeholder {
                height: 26px;
                line-height: 26px;

            }

            .qw-search-bar__clear.qw-icon-del {
                padding: 0 8px;
            }
        }
    }

    .department {
        display: flex;
        align-items: center;
        margin-right: 10px;

        .department__icon {
            flex-basis: 15px;
            flex-shrink: 0;
            width: 15px;
            height: 15px;
            object-fit: contain;
        }

        .department__name {
            line-height: 26px;
            height: 26px;
            font-size: 15px;
            font-weight: 500;
            color: rgba(0, 0, 0, 1);
            margin-left: 4px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}
</style>

<template>
<div class="search-panel">
    <div class="header">
        <searchHeader ref="searchHeader" :departmentName="departmentName" v-model="currentKeyword" @change="handleChangeKeyword" @click="handleClickDepartment" @focus="handleFocusInput">
        </searchHeader>
    </div>
    <div class="gutter"></div>

    <div class="scroll-list-wrap">
        <dealerItem v-for="(item, index) in dealerList" :key="index" @click="handleClickDealer(item)" :data="convertDealerData(item)">
        </dealerItem>
        <infinite-loading @infinite="infiniteHandler">
            <div slot="spinner" class="more">
                <p>{{isLoading?'加载中...':'查看更多'}} </p>
            </div>
            <div slot="no-more" class="more">
                <p>没有更多了</p>
            </div>
            <div slot="no-results">
                <p>暂无数据</p>
            </div>
        </infinite-loading>
        <noData :style="{paddingTop: '20vh'}" v-if="!isLoading && !dealerList.length"></noData>
    </div>

</div>
</template>

<script>
import searchHeader from './search-header'
import dealerItem from '@/module/channelManagement/components/ProfileItem'
import noData from '@/module/channelManagement/components/noData'
import {
    searchDealerPagerByKey
} from "@/module/channelManagement/api/development";
import debounce from "@/module/channelManagement/utils/debounce";

const searchDepartments = debounce(function () {
    this.fetchDealerList();
}, 700)

export default {
    name: "search-panel",
    components: {
        searchHeader,
        dealerItem,
        noData
    },
    data() {
        return {
            page: 1,
            pageSize: 10,
            currentKeyword: this.keyword,
            departmentName: this.department.name,
            departmentId: this.department.id,
            dealerList: [],
            isLoading: false,
        }
    },
    props: {
        department: {
            type: Object,
            default () {
                return {
                    id: '',
                    name: ''
                };
            }
        },
        keyword: {
            type: String,
            default () {
                return '';
            }
        }
    },
    watch: {
        department: {
            deep: true,
            handler(val) {
                if (typeof val === 'object') {
                    this.departmentId = val.id || '';
                    this.departmentName = val.name || '';
                }
            }
        },
        // keyword(val){
        //     this.currentKeyword = val || '';
        // }
    },
    methods: {
        convertDealerData(item) {
            console.log('item', item);
            return {
                id: item.id,
                avatar: item.storeImg ? _.compressURL + item.storeImg : '',
                name: item.dealerFullName,
                address: item.companyAddress,
                status: item.operatingState,
                nature: item.nature,
            }
        },

        handleClickDealer(item) {
            this.$emit('clickDealer', item)
        },

        handleClickDepartment() {
            this.$emit('clickDepartment')
        },

        handleFocusInput() {

        },

        focus() {
            this.$nextTick(() => {
                this.$refs['searchHeader'].focus();
            })
        },

        clearDealerList() {
            this.dealerList = []
        },

        handleChangeKeyword(keyword) {
            this.currentKeyword = keyword
            this.clearDealerList()
            this.page = 1
            searchDepartments.call(this);
            this.$emit('changeKeyword', keyword)
        },

        fetchDealerList() {
            const params = {
                page: this.page,
                pageSize: this.pageSize,
                'searchValue.departmentId': this.departmentId,
                'searchValue.keyWord': this.currentKeyword,
                'searchValue.status': this.status
            }
            this.isLoading = true;
            return searchDealerPagerByKey(params).then(data => {
                this.isLoading = false;
                if (data) {
                    const list = data.pageData || []
                    this.dealerList = this.dealerList.concat(list)
                    if (data.maxPage <= data.currPage) {
                        return {
                            isDone: true
                        }
                    } else {
                        return {
                            isDone: false
                        }
                    }
                } else {
                    return {
                        isDone: true
                    }
                }
            })
        },

        infiniteHandler($state) {
            this.fetchDealerList().then(({
                isDone
            }) => {
                if (isDone) {
                    $state.complete()
                } else {
                    $state.loaded()
                    this.page = this.page + 1
                }
            })
        },

        reset() {
            this.dealerList = []
        },

        load({
            keyword = '',
            status = '',
            departmentId = '',
            page = '1',
            pageSize,
            departmentName = ''
        }) {
            this.departmentName = this.departmentName || departmentName
            this.currentKeyword = keyword || this.currentKeyword;
            this.status = status || this.status;
            this.departmentId = departmentId || this.departmentId;
            this.page = page || this.page;
            this.pageSize = pageSize || this.pageSize;
            return this.fetchDealerList();
        },
    },
    created() {

    }
}
</script>

<style lang="scss" scoped>
.search-panel {
    background: #ffffff;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    .header {
        background: #ffffff;
        height: 40px;
    }

    .gutter {
        height: 8px;
        background: rgba(245, 245, 245, 1);
    }

    .scroll-list-wrap {
        position: absolute;
        height: calc(100vh - 48px);
        left: 0;
        right: 0;
        overflow-y: auto;
    }
}
</style>

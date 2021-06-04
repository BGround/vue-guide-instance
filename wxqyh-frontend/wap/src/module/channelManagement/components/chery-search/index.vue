<template>
<div class="chery-search">

    <searchHeader :departmentName="cityName" :keyword="value" :placeholder="getPlaceholder" @click="handleClickDepartment" @focus="handleFocusInput">
    </searchHeader>

    <qw-popup v-model="isVisibleSearchDealerPanel" :disable-scroll="false" :transition="hasAnimation? 'fade-left': 'none'" class="cascade-panel" position="right" need-refresh>
        <div class="search-panel">
            <searchDealerPanel :department="{id: currentDepartmentId, name: currentDepartmentName}" :keyword="value" @clickDealer="handleClickDealer" @changeKeyword="handleChangeKeyword" @clickDepartment="handleClickDepartmentFromSearchDealerPanel" ref="searchDealerPanel">
            </searchDealerPanel>
        </div>
    </qw-popup>

    <qw-popup v-model="isVisibleSearchCityPanel" :disable-scroll="false" :transition="hasAnimation? 'fade-left': 'none'" class="cascade-panel" position="right" need-refresh>
        <div class="search-panel">
            <searchCityPanel :keyword="value" @click="handleClickCity" @change="handleChangeCityName" ref="searchCityPanel">
            </searchCityPanel>
        </div>
    </qw-popup>

    <qw-popup v-model="isVisibleDepartmentPanel" :transition="hasAnimation? 'fade-left': 'none'" class="cascade-panel" position="right" need-refresh>
        <div class="cascade-panel__container">
            <departmentPanel v-model="selectedDepartmentValue" @confirm="handleConfirmDepartment" @reset="handleRestDepartment" @close="handleCloseDepartmentPanel">
            </departmentPanel>
        </div>
    </qw-popup>

</div>
</template>

<script>
import iconLocation from '@/module/channelManagement/static/images/icon_location.png';
import searchHeader from './search-header'
import searchDealerPanel from './search-dealer-panel'
import departmentPanel from './department-panel'
import searchCityPanel from './search-city-panel'
import Vue from 'vue';
import {
    getdepartmentId
} from "@/module/channelManagement/api/getData";

const bus = new Vue();

export default {
    name: "cherySearch",
    components: {
        searchHeader,
        searchDealerPanel,
        departmentPanel,
        searchCityPanel,
    },
    data() {
        return {
            iconLocation: iconLocation,
            searchValue: '',
            isVisibleDepartmentPanel: false,
            hasAnimation: false,
            currentDepartmentId: '',
            currentDepartmentName: this.departmentName, // 部门名
            cityName: this.departmentName, // 部门名
            isVisibleSearchDealerPanel: false, // 显示搜索面板
            selectedDepartmentValue: [],
            isVisibleSearchCityPanel: false,
        }
    },
    model: {
        event: 'change',
        prop: 'value'
    },
    props: {
        value: { // keywork
            type: String,
            required: true,
        },
        departmentName: {
            type: String,
            default () {
                return '全国';
            }
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
        type: {
            type: String,
            default () {
                return 'dealer'
            }
        }
    },
    computed: {
        getType() {
            return this.type;
        },
        getPlaceholder() {
            return this.placeholder;
        }
    },
    watch: {
        departmentName(value, old) {
            if (old !== value) {
                this.currentDepartmentName = value;
                this.cityName = value;
                this.setSelectedDepartmentValue(value);
            }
        }
    },
    methods: {

        // ...mapMutations('home', {
        //     setDepartmentName: 'setDepartmentName',
        //     setDepartmentIds: 'setDepartmentIds'
        // }),
        //
        // ...mapMutations('dealer', {
        //     setDealerDetail: 'setDealerDetail'
        // }),

        handleChangeKeyword(value) {
            // this.value = value;
            console.log(value);
            this.$emit('change', value)
        },

        handleChangeCityName(value) {
            console.log(value);
            this.$emit('change', value)
        },

        handleSearchKeyword() {
            this.$emit('search', value)
        },

        handleFocusInput() {
            if (this.getType === 'city') {
                this.openSearchCityPanel();
            } else {
                this.openSearchDealerPanel();
            }
            this.$emit('focus');
        },

        openSearchDealerPanel() {
            history.replaceState({
                'searchDealerPanelStatus': 'close'
            }, document.title, location.href);
            history.pushState({
                'searchDealerPanelStatus': 'open'
            }, document.title, location.href);
            this.isVisibleSearchDealerPanel = true;
            this.$nextTick(() => {
                this.$refs['searchDealerPanel'].focus()
            })
        },

        openSearchCityPanel() {
            history.replaceState({
                'searchCityPanelStatus': 'close'
            }, document.title, location.href);
            history.pushState({
                'searchCityPanelStatus': 'open'
            }, document.title, location.href);
            this.isVisibleSearchCityPanel = true;
            this.$nextTick(() => {
                this.$refs['searchCityPanel'].focus()
            })
        },

        closeSearchDealerPanel() {
            history.back();
            this.isVisibleSearchDealerPanel = false;
        },

        closeSearchCityPanel() {
            history.back();
            this.isVisibleSearchCityPanel = false;
        },

        handleBlurInput() {
            this.$emit('blur');
        },

        /**
         * 点击区域
         */
        handleClickDepartment() {
            // this.openDepartmentPanel()
        },

        clearDealerList() {
            this.dealerList = []
        },

        openDepartmentPanel() {
            history.replaceState({
                'departmentPanelStatus': 'close'
            }, document.title, location.href);
            history.pushState({
                'departmentPanelStatus': 'open'
            }, document.title, location.href);
            this.isVisibleDepartmentPanel = true
        },

        closeDepartmentPanel() {
            history.back()
            this.isVisibleDepartmentPanel = false
        },

        /**
         * 处理点击search panel组件点击部门事件
         */
        handleClickDepartmentFromSearchDealerPanel() {
            this.openDepartmentPanel();
        },

        handleConfirmDepartment({
            departmentName,
            departmentId,
            selectedDepartmentValue
        }) {
            this.handleCloseDepartmentPanel()
            this.currentDepartmentName = departmentName;
            this.currentDepartmentId = departmentId;
            const searchDealerPanelCom = this.$refs['searchDealerPanel'];
            if (searchDealerPanelCom) {
                searchDealerPanelCom.reset()
                searchDealerPanelCom.load({
                    departmentName,
                    departmentId,
                    page: 1
                });
            }
            bus.$once('closeDepartmentPanel', () => {
                this.$emit('confirm', {
                    departmentName,
                    departmentId
                })
            });

        },

        handleRestDepartment() {
            this.closeDepartmentPanel()
            const searchDealerPanelCom = this.$refs['searchDealerPanel'];
            this.currentDepartmentName = '全国'
            this.currentDepartmentId = '';
            this.$nextTick(() => {
                if (searchDealerPanelCom) {
                    searchDealerPanelCom.reset()
                    searchDealerPanelCom.load({
                        page: 1
                    });
                }
            })

        },

        handleCloseDepartmentPanel() {
            this.closeDepartmentPanel()
        },

        handleClickDealer(dealer) {
            this.closeSearchDealerPanel();
            bus.$once('closeSearchDealerPanel', () => {
                this.$emit('select', dealer)
            });
        },

        handleClickCity(city) {
            this.closeSearchCityPanel();
            bus.$once('closeSearchCityPanel', () => {
                this.$emit('pick', city)
            });
        },

        setSelectedDepartmentValue(departmentName) {
            if (departmentName) {
                getdepartmentId({
                    cityName: departmentName
                }).then((data) => {
                    this.selectedDepartmentValue = data && data.map && data.map.idList ? data.map.idList : [];
                    this.currentDepartmentId = data && data.map && data.map.id ? data.map.id : '';
                    console.log(this.selectedDepartmentValue, this.currentDepartmentId)
                })

            }

        }

    },
    created() {
        this.setSelectedDepartmentValue(this.departmentName)
    },
    mounted() {

        window.addEventListener('popstate', () => {
            if (typeof history.state === 'object' && history.state) { // null
                if (history.state.departmentPanelStatus === 'close') {
                    this.isVisibleDepartmentPanel = false
                    // this.hasAnimation = false;
                    bus.$emit('closeDepartmentPanel');
                }
                if (history.state.departmentPanelStatus === 'open') {
                    // this.hasAnimation = true;
                    this.isVisibleDepartmentPanel = true
                }

                if (history.state.searchDealerPanelStatus === 'close') {
                    this.isVisibleSearchDealerPanel = false
                    bus.$emit('closeSearchDealerPanel');
                    // this.hasAnimation = false;
                }
                if (history.state.searchDealerPanelStatus === 'open') {
                    // this.hasAnimation = true;
                    this.isVisibleSearchDealerPanel = true
                }

                if (history.state.searchCityPanelStatus === 'close') {
                    this.isVisibleSearchCityPanel = false
                    bus.$emit('closeSearchCityPanel')
                    // this.hasAnimation = false;
                }
                if (history.state.searchCityPanelStatus === 'open') {
                    // this.hasAnimation = true;
                    this.isVisibleSearchCityPanel = true
                }
            }

        })
    }
}
</script>

<style lang="scss" scoped>
.chery-search {
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

        .location {
            display: flex;
            align-items: center;

            .location__icon {
                flex-basis: 15px;
                flex-shrink: 0;
                width: 15px;
                height: 15px;
                object-fit: contain;
            }

            .location__name {
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

    .cascade-panel {
        width: 100vw;
        height: 100%;

        @media screen and (min-width: 1024px) {
            width: 740px;
            margin: auto;
        }
    }

    .cascade-panel__container {
        width: 100%;
        height: 100%;
        background: #ffffff;
        position: relative;
    }

    /deep/ {
        .qw-popup__content {
            width: 100%;
        }
    }

    .search-panel__header {
        position: absolute;
        background: #fafafa;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
}
</style>

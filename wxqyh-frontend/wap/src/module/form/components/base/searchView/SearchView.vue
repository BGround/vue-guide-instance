<template>
    <div class="search-view">
        <!-- 视图展示区域 -->
        <div class="view-display"
            @click="showViewDetail()"
            :class="isActive && 'active'"
            @touchmove.prevent="">
                {{currName}}
            <i class="arrow-icon" :class="{'active': isActive }"></i>
            <span class="length">{{length + '条'}}</span>
        </div>
        <!-- 视图列表 -->
        <div class="view-list" v-show="showList">
            <div class="container" ref="container" :class="isActive ? '' : 'slide-out'">
                <!-- 未保存的筛选结果 -->
                <div class="no-view" v-if="customConfig.isSearching">
                    <i class="radio-icon" :class="customConfig.isSearching && 'active'" ></i>
                    <span>筛选结果（未保存）</span>
                    <i class="save" @click="showSaveDialog = true">保存</i>
                </div>
                <!-- 默认视图 -->
                <ul class="default-view view" v-show="showDefaultView">
                    <li class="title">默认视图</li>
                    <li class="type"
                        v-for="(view, index) in defaultView"
                        :key="view.id"
                        @click="setView(view)">
                        <i class="radio-icon" :class="currView.id == view.id && 'active'"></i>
                        {{view.name}}
                    </li>
                </ul>
                <!-- 自定义视图 -->
                <ul class="custom-view view" v-show="showCustomView">
                    <li class="title">我的视图</li>
                    <li class="type"
                        v-for="(view, index) in customView"
                        :key="view.id"
                        @click="setView(view)">
                        <i class="radio-icon" :class="currView.id == view.id && 'active'"></i>
                        {{view.name}}
                        <div class="revise-btn" @click.stop="previewView(view, index)">
                            <i class="revise-icon"></i>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="mask" @click="closeViewDetail"  ref="mask" @touchmove.prevent=""></div>
            <!-- 高级搜索 -->
            <advanced-search
                v-show="showView"
                :setting="searchSetting"
                :cache-search-value="cacheSearchValue"
                @close="showView = false"
                @reset="showDeleteDialog = true"
                @search="updateView"
                :closeConfig="{ style: { color: '#7A7D80' }, text: '取消' }"
                :resetConfig="{ style: { color: '#FF586D' }, text: '删除' , preventDefault: true}"
                :searchConfig="{ style: {}, text: '保存' }">
            </advanced-search>
            <!-- 保存视图弹窗 -->
            <dialog-group title="保存为视图"
                :show="showSaveDialog"
                @cancel="showSaveDialog = false"
                @confirm="addView"
                :cancelText="'取消'"
                :confirmText="'保存'">
                <input class="name-input"
                    type="text"
                    placeholder="请输入视图名称（12字以内）"
                    maxlength="12"
                    v-model="addName">
            </dialog-group>
            <!-- 删除视图弹窗 -->
            <dialog-group
                :show="showDeleteDialog"
                @cancel="showDeleteDialog = false"
                @confirm="deleteView"
                :cancelText="'取消'"
                :confirmText="'删除'">
                <p class="confirm-msg">确认删除该视图？</p>
            </dialog-group>
        </div>
    </div>
</template>

<script>
import advancedSearch from '@/components/base/AdvancedSearch/index'
import dialogGroup from '@/components/base/dialog/dialog-group'

export default {
    name: 'searchValueView',
    components: {
        advancedSearch,
        dialogGroup
    },
    props: {
        length: Number, // 列表长度
        searchSetting: Array, // 高级搜索配置
        defaultView: { type: Array, default: [] }, // 默认视图
        customView: { type: Array, default: [] }, // 自定义视图
        showDefaultView: { type: Boolean, default: true }, // 显示默认视图
        showCustomView: { type: Boolean, default: true }, // 显示我的视图
        customConfig: { // isSearching： true：自定义搜索 false：视图搜索， param：自定义搜索对应的搜索条件
            type: Object,
            default() { return { isSearching: false , param: {} } }
        },
        currDefaultView: Object // 初始化默认视图
    },
    data() {
        return {
            currView: this.currDefaultView, // 当前视图
            currPreviewView: {}, // 当前预览视图
            showView: false, // 显示预览视图面板
            showList: false, // 显示视图列表
            showSaveDialog: false, // 显示保存弹窗
            showDeleteDialog: false, // 显示删除弹窗
            isActive: false, // 图标以及名称是否高亮
            closeTimer: '', // 是否已经存在计时器
            addName: '', // 新增视图的名称
        }
    },
    computed: {
        cacheSearchValue() {
            return this.currPreviewView.param || {}
        },
        currName() {
            if(this.customConfig.isSearching) {
                return '筛选结果'
            } else {
                return this.currView.name
            }
        },
    },
    methods: {
        // 设置视图
        setView(view) {
            view = JSON.parse(JSON.stringify(view))
            this.currView = view
            this.customConfig.isSearching = false
            this.closeViewDetail()
            this.$emit('setView', view)
        },
        // 预览视图
        previewView(view, index) {
            view.index = index
            this.currPreviewView = JSON.parse(JSON.stringify(view))
            this.showView = true
        },
        // 新增视图
        addView() {
            if(this.addName == '') {
                return _.alert('提示', '请输入视图名称')
            }
            this.showSaveDialog = false
            this.$emit('addView', {
                name: this.addName,
                param: this.customConfig.param,
                _this: this
            })
            this.addName = ''
        },
        // 删除视图
        deleteView() {
            let currPreviewView = JSON.parse(JSON.stringify(this.currPreviewView)),
                isCurrView = this.currView.id == this.currPreviewView.id
            this.showDeleteDialog = false
            this.showView = false
            this.$emit('deleteView', Object.assign(
                currPreviewView,
                { isCurrView: isCurrView, _this: this }
            ))
        },
        // 修改视图
        updateView(searchValue) {
            let currPreviewView = JSON.parse(JSON.stringify(this.currPreviewView)),
                isCurrView = this.currView.id == this.currPreviewView.id
            isCurrView && this.closeViewDetail()
            this.$emit('updateView', Object.assign(
                currPreviewView,
                { param: searchValue, isCurrView: isCurrView }
            ))
        },
        // 关闭视图列表
        closeViewDetail() {
            if(this.closeTimer) {
                return
            }
            let _this = this
            this.isActive = false;
            this.$refs.mask.style.opacity = '0'
            this.closeTimer = setTimeout(() => {
                _this.showList = false
            }, 300)
        },
        // 显示视图列表
        showViewDetail() {
            if(this.showList) {
                this.closeViewDetail()
            } else {
                this.closeTimer = ''
                this.showList = true
                this.isActive = true
                this.$refs.mask.style.opacity = '.4'
            }
        }
    },
    watch: {
        'customConfig.isSearching': {
            handler(isSearching) {
                isSearching && (this.currView = {})
            },
            immediate: true
        },
        'currDefaultView': {
            handler(view) {
                this.currView = view
                this.customConfig.isSearching = false
            },
            deep: true
        },
        showList(newVal) {
            if (newVal) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        }
    }
}
</script>
<style lang="scss" scoped>
$baseUrl: '~assets/images/';

@mixin background($url) {
    background: url($baseUrl + $url) no-repeat;
    background-size: cover;
}
.search-view {
    width: 100%;
    .view-display {
        box-sizing: border-box;
        position: relative;
        width: 100%;
        padding-left: 14px;
        font-size: 15px;
        color: #0A1735;
        line-height: 52px;
        &.active {
            color: #5585F0;
        }
        .arrow-icon {
            position: absolute;
            display: inline-block;
            top: 50%;
            width: 16px;
            height: 16px;
            transform: translateY(-50%);
            transition: all .3s ease;
            @include background('icon_arrowDown.png');
            &.active {
                transform: translateY(-50%) rotate(-180deg);
                @include background('icon_arrowDown-active.png');
            }
        }
        .length {
            font-size: 12px;
            color: #B2B9C8;
            background-color: #F7F8FA;
            padding: 0 5px;
            margin-left: 25px;
            border-radius: 4px;
        }
    }
    .view-list {
        display: flex;
        flex-direction: column;
        position: fixed;
        z-index: 10;
        width: 100%;
        height: 100%;
        font-size: 15px;
        color: #0A1735;
        @media screen and (min-width: 1024px) {
            width: 740px;
            margin: auto;
        }
        .container {
            position: absolute;
            display: inline-block;
            top: 0;
            left: 0;
            z-index: 10;
            width: 100%;
            max-height: 60%;
            overflow: auto;
            background-color: #FFF;
            transform-origin: top center;
            animation: slide-in .3s ease-in-out forwards;
            &.slide-out {
                animation: slide-out .3s ease-in-out forwards;
            }
            @keyframes slide-in {
                0% {
                    opacity: 0;
                    transform: rotateX(-90deg);
                }
                100% {
                    opacity: 1;
                    transform: rotateX(0);
                }
            }
            @keyframes slide-out {
                0% {
                    opacity: 1;
                    transform: rotateX(0);
                }
                100% {
                    opacity: 0;
                    transform: rotateX(-90deg);
                }
            }
            .no-view {
                position: relative;
                line-height: 44px;
                padding-left: 38px;
                .save {
                    float: right;
                    padding-right: 14px;
                    font-size: 14px;
                    color: #5585F0;
                    cursor: pointer;
                }
            }
            .no-view, .default-view {
                border-bottom: 8px solid #F7F8FA;
            }
            .custom-view {
                margin-bottom: 8px;
            }
            .view {
                .title {
                    padding-left: 14px;
                    font-size: 13px;
                    line-height: 36px;
                    color: #B2B9C8;
                }
                .type {
                    position: relative;
                    padding-left: 38px;
                    line-height: 44px;
                    cursor: pointer;
                    &:active {
                        background: #F7F8FA;
                    }
                }
                .revise-btn {
                    display: flex;
                    position: absolute;
                    right: 0;
                    top: 50%;
                    width: 44px;
                    height: 44px;
                    justify-content: center;
                    align-items: center;
                    transform: translateY(-50%);
                }
                .revise-icon {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    @include background('icon_edit.png');
                }
            }
            .radio-icon {
                display: inline-block;
                position: absolute;
                left: 14px;
                top: 50%;
                width: 16px;
                height: 16px;
                transform: translateY(-50%);
                @include background('icon_form_single-unselected.png');
            }
            .radio-icon.active {
                @include background('icon_form_single-checked.png');
            }
        }
        .mask {
            flex: auto;
            height: 100%;
            background-color: black;
            opacity: 0;
            transition: all .3s ease;
        }
        .name-input {
            box-sizing: border-box;
            width: 85%;
            height: 40px;
            margin: 10px 0 30px 0;
            color: #0A1735;
            font-size: 15px;
            line-height: 1;
            text-align: center;
            outline: none;
            border-radius: 4px;
            border:1px solid #E3E4E8;
            -webkit-appearance: none;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        input::-webkit-input-placeholder {
            color: #D2D5DB;
        }
        .confirm-msg {
            height: 80px;
            line-height: 60px;
            text-align: center;
            font-size: 16px;
            font-family: "Microsoft YaHei", "宋体", Tahoma, Arial, sans-serif;
            color: rgba(27, 35, 58, 1);
        }
    }
}
</style>

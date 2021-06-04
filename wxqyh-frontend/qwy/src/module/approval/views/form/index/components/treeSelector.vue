<template>
    <div class="group-box">
        <div class=" group ellipsis" @click.stop="showGroupOption">{{selectedGroup.name}}
            <div class="black-arrow"></div>
        </div>
        <ul class="group-option" id="groupOption" v-show="groupOption" ref="groupOption" @click.stop="">
            <!-- 分组查询 -->
            <li class="search-form">
                <input type="text" placeholder="搜索" v-model="searchText">
            </li>
            <li class="option search-result" v-for="group in formSearchResult" v-show="searchText">
                <div class="drop-down-btn"></div>
                <div class="typeName pl30 pr20"  @click="setGroup(group)" :title="group.typeName">{{group.typeName}}</div>
            </li>
            <li class="search-tips" v-show="searchText && formSearchResult.length == 0">
                <div class="">未查询到任何搜索结果</div>
            </li>
            <!-- 首页 -->
            <li class="option" v-show="!searchText">
                <div class="drop-down-btn"></div>
                <div id="all" @click="setCurrGroup(1)">
                    <div class="typeName pl30 pr20" :class="{ 'active': currGroup.length == 1 }">全部分组</div>
                </div>
            </li>
            <li class="option" v-for="(parent, index) in groupList" :key="parent.id" v-show="!searchText">
                <div class="drop-down-btn"
                    v-if="viewMode == 1"
                    :class="{'pointer': parent.formTypeCount}"
                    @click.stop="showChild(index, parent.id, parent.formTypeCount)">
                    <i :class="{'drop-down-icon': parent.formTypeCount}" :style="parent.showChild ? styleObject : '' "></i>
                </div>
                <div @click="setCurrGroup(2, parent)" :title="parent.typeName">
                    <div class="typeName pl30 pr20" :class="{ 'active': selectedGroup.id == parent.id }">{{parent.typeName}}</div>
                </div>
                <ul v-show="parent.showChild" v-if="viewMode == 1">
                    <li class="option" v-for="child in parent.childs" :key="child.id">
                        <div class="drop-down-btn"></div>
                        <div @click="setCurrGroup(3, parent, child)" :title="child.typeName">
                            <div class="typeName pl30 pr20" :class="{ 'active': selectedGroup.id == child.id }">{{child.typeName}}</div>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getGroup, searchGroup } from '@/module/approval/api/form/index'

export default {
    name: 'treeSelector',
    props: ['currSelected'],
    data() {
        return {
            groupOption: false,
            styleObject: { // 分组下拉按钮的样式
                transform: 'rotate(0)',
                top: '11px'
            },
            searchText: '',
            formSearchResult: [],
            timer: null
        }
    },
    computed: {
        ...mapGetters('form/index', [
            'currGroup',
            'groupList',
            'viewMode'
        ]),
        selectedGroup() {
            return this.currSelected[this.currSelected.length - 1]
        }
    },
    created() {
        document.addEventListener('click', this.optionClose)
    },
    methods: {
        ...mapActions('form/index', [
            'SetCurrGroup',
            'SetGroupList'
        ]),
        optionClose() {
            this.groupOption = false;
        },
        showGroupOption() {
            this.groupOption = !this.groupOption;
        },
        setCurrGroup(level, parent, child) {// 改变当前分组
            this.groupOption = false;
            this.$emit('setCurrGroup', level, parent, child);
        },
        setGroup(group) {
            this.groupOption = false;
            if(group.parentId) {
                this.$emit('setCurrGroup', 3, {id: group.parentId, name: group.typeName}, group)
            } else {
                this.$emit('setCurrGroup', 2, group)
            }
        },
        showChild(index, id, count) {// 显示子分组
            if(!count) { // 不存在子分组，返回
                return
            }

            let _this = this,
                groupList = Object.assign({}, this.groupList);  // 刷新对象指针，实现数据驱动
            groupList[index].showChild = !groupList[index].showChild;
            if(!groupList[index].childs) {
                getGroup(id).then(res => {
                    if(res.code != "0") {
                        return _top.alert("信息提示层", res.desc);
                    }
                    groupList[index].childs = res.data.formTypeList;
                    _this.SetGroupList(groupList);
                })
            } else {
                this.SetGroupList(groupList);
            }
        },
        searchFormType() {
            if(this.searchText == '') {
                return
            }
            var _this = this,
                data = {
                    typeName: this.searchText 
                }
            if(this.viewMode == 2) {
                data.isSurfaceSearch = 1;
            }
            searchGroup(data).then((res) => {
                if(res.code != "0") {
                    return _top.alert("信息提示层", res.desc);
                }
                _this.formSearchResult = res.data.formtypeList;
            })
        },
        debounce(method,delay){
            var _this = this;
			return function() {
				var context = this,
                    args = arguments;
				clearTimeout(_this.timer);
				_this.timer = setTimeout(() => {
					method.apply(context, args);
				},delay);
			}
		}
    },
    watch: {
        searchText(val) {
                this.debounce(this.searchFormType, 500)()
            }
    }
}
</script>

<style scoped>
    .group-box {
        position: relative;
        width: 96px;
    }
    .group {
        position: relative;
        display: block;
        padding-right: 25px;
        text-align: left;
    }
    .black-arrow {
        position: absolute;
        top: 12px;
        right: 8px;
        width: 0;
        height: 0;
        border-width: 3px;
        border-top: 6px;
        border-style: solid;
        border-color: black transparent transparent transparent;
    }
    .group-option {
        box-sizing: border-box;
        position: absolute;
        left:0;
        top: 34px;
        z-index: 10000;
        width: 200px;
        height: 400px;
        overflow: auto;
        padding: 10px 0;
        text-align: left;
        border: 1px solid #ccc;
        background-color: #fff;
    }
    .group-option .option {
        position: relative;
        line-height: 28px;
    }
    .group-option .option .typeName {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
    }
    .group-option .option .typeName:hover {
        background-color: #F5F5F5;
    }
    .group-option .option .typeName.active {
        background-color:#F7F7F7;
    }
    .group-option .option .option {
        padding-left: 10px;
    }
    .drop-down-btn {
        position: absolute;
        width: 28px;
        height: 28px;
    }
    .drop-down-icon {
        position: absolute;
        top: 8px;
        left: 10px;
        width: 0;
        height: 0;
        border-width: 5px;
        border-style: solid;
        border-color: #999999 transparent transparent transparent;
        transform: rotate(-90deg);
    }
    .pointer {
        cursor: pointer;
    }
    .search-form {
        padding: 5px 9px;
        margin-bottom: 10px;
    }
    .search-form input {
        width: 180px;
        box-sizing: border-box;
        padding: 4px 8px;
        border: 1px solid #ccc;
    }
    .search-tips {
        text-align: center;
        color: #ccc;
    }
    ::-webkit-scrollbar {
        width: 6px;
        height: 160px;
    }
    ::-webkit-scrollbar-track {
        border: none;
        border-radius: none;
        background: transparent;
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background-color: #D7D7D7;
    }
    ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
        color: #ccc;
    }
</style>

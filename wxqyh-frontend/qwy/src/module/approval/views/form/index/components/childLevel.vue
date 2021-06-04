<template>
    <div class="childLevel"
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="busy"
    infinite-scroll-distance="10"
    infinite-scroll-immediate-check="false">
        <div class="second-level" v-if="!showNoData">
            <!-- 平铺视图 -->
            <div class="group"
                v-for="(group, index) in groupData"
                :key="group.id">
                <div class="group-header clearfix" v-if="currGroup.length == 2">
                    <i class="drag-icon"></i>
                    <!-- 分组信息 -->
                    <span class="group-info"
                        v-show="editIndex != index"
                        @mouseover="isUnGroup(group) ? '' : operationIndex = index"
                        @mouseout="isUnGroup(group) ? '' : operationIndex = -1">
                        <span class="group-name">{{group.typeName}}</span>
                        <span class="group-formCount">({{group.formCount}})</span>
                        <!-- 分组操作 -->
                        <span class="group-operation"
                            v-show="operationIndex == index">
                            <div class="edit-icon"
                                title="编辑名称"
                                @click="showEdit(index, group)"></div>
                            <div class="close-icon"
                                title="删除分组"
                                @click="del(group, index)"></div>
                        </span>
                    </span>
                    <!-- 修改分组名称 -->
                    <span class="group-revise"
                        v-show="editIndex == index">
                            <input class="group-name-input"
                            type="text"
                            v-model="group.typeName"
                            @blur="changeTypeName(group)"
                            maxlength="30"
                            autofocus="autofocus">
                        <div class="input-number-count">{{group.typeName.length}}/30</div>
                    </span>
                    <!-- 展开更多 -->
                    <span class="show-more fr"
                        v-if="group.child && group.formCount > 5"
                        @click.stop="showMore(group, index)">
                        {{showMoreModel[index] && showMoreModel[index].show ? '收起' : '展开标签'}}
                        <i class="arrow-icon" :class="{'transform270': showMoreModel[index] && showMoreModel[index].show}"></i>
                    </span>
                </div>
                <!-- 分组表单 -->
                <div class="group-content">
                    <form-block
                        v-for="(form, indx) in group.child"
                        :formData="form"
                        :isOver="indx % 5 == 0"
                        :key="form.id"
                        :ref="'form' + index"
                        v-show="indx < 5 || showMoreModel[index].show"
                        @del="formDel(group, indx, index)"
                        @open="formOpen(group, indx, index)"
                        @forbid="formForbid(group, indx, index)"
                        ></form-block>
                </div>
            </div>
        </div>
        <!-- 滚动加载组件 -->
        <load-more v-if="!showNoData"
            :busy="busy"
            :loading="loading"
            :no-more-tips="noMoreTips"
            @loadMore="loadMore"></load-more>
        <div class="no-data"
            v-if="showNoData">
            <div class="content">
                <img class="img" src="../../../../../../assets/images/noData.png">
                <div class="no-data-text">暂无相关数据</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { delFormType, updateFormType, getForm } from '@/module/approval/api/form/index'
import { hasGroupAuthority } from './common'
import loadMore from '@/components/list/LoadMore'
import formBlock from './formBlock'
import groupSetting from '../groupSetting'
export default {
    name: 'childLevel',
    components: {
        formBlock,
        loadMore,
        groupSetting
    },
    data() {
        return {
            operationIndex: -1, // 用于显示隐藏分组操作按钮
            editIndex: -1, // 用于显示隐藏分组的名称编辑按钮
            showMoreModel: [], // 用于存放各个分组的'展开更多'按钮的显示状态
            loading: false, // 判断是否正在加载中
            currIndex: -2, // 用于控制当前  -1代表未分组表单，-1代表
            busy: true,
            managerType: dataBase.config.managerType,
            userName: dataBase.config.userName,
            showNoData: false
        }
    },
    computed: {
        ...mapGetters("form/index", [
            'groupData',
            'currGroup',
            'setting'
        ]),
        noMoreTips() {
            if(this.groupData.length == 1) {
                return ''
            } else {
                return '已加载全部标签'
            }
        },
        currentGroup() {
            return this.currGroup[this.currGroup.length - 1]
        }
    },
    created() {
        let _this = this;
        this.GetFormData({needLoading: true}).then(res => {
            let group = this.currGroup,
                parentFormType = res.data.parentFormType;
            group.pop()
            group.push({name: parentFormType.typeName, id: parentFormType.id, data: parentFormType})
            this.SetCurrGroup(group)
            this.busy = res.data.maxPage == 0 || this.setting.currPage == this.setting.maxPage;
            // 判断是否显示无数据页面
            let formType = res.data.formTypeData[0];
            this.showNoData = formType.id == 'other' && formType.formCount == 0;
            // 分组内仅有默认标签时，展开全部
            let defaultGroup = this.groupData[this.groupData.length - 1];
            if(this.groupData.length == 1 && defaultGroup.formCount > 5) {
                this.showMore(defaultGroup, 0);
            }
        })
    },
    methods: {
        ...mapActions('form/index',[
            'GetFormData',
            'SetCurrGroup',
            'SetSetting',
            'SetSearchValue',
            'SetGroupData',
        ]),
        // 下拉加载
        loadMore() {
            this.loadMoreGroupData();
        },
        // 加载分组
        loadMoreGroupData() {
            this.loading = true;
            this.busy = true;
            this.SetSetting({ page: this.setting.page + 1 })
            this.GetFormData({isLoadMore: true}).then(res => {
                this.loading = false;
            });
        },
        // 加载表单
        loadMoreFormData() {
            let group = this.groupData[this.currIndex],
                id = group.id,
                page = group.child.length / 20 + 1,
                data = {
                    'page': page,
                    'pageSize': 20,
                    'viewMode': 1,
                    'searchValue.typeId': group.id
                },
                _this = this;
            if(group.id == 'other') {
                data['searchValue.isSurfaceSearch'] = 1;
                data['searchValue.typeId'] = this.currentGroup.id;
            }
            getForm(data).then(res => {
                if(res.code != "0") {
                    return _top.alert("信息提示层", res.desc)
                }
                _this.loading = false;
                group.child = group.child.concat(res.data.pageData);
                _this.showMoreModel[_this.currIndex].busy = res.data.maxPage == 0 || res.data.currPage == res.data.maxPage;
            })
        },
        // 展开更多
        showMore(group, index) {
            let model = this.showMoreModel[index] || {};
            this.currIndex = index;
            model.show = !model.show;
            this.$set(this.showMoreModel, index, model);
            if(group.child.length == 5) {
                this.getGroupChild(group, index);
            }
        },
        // 展开更多的请求函数
        getGroupChild(group, index) {
            let data = {
                    'page': 1,
                    'pageSize': 40,
                    'viewMode': 1,
                    'searchValue.typeId': group.id
                },
                _this = this;
            if(group.id == 'other') {
                data['searchValue.isSurfaceSearch'] = 1;
                data['searchValue.typeId'] = this.currentGroup.id;
            }
            getForm(data).then(res => {
                if(res.code != "0") {
                    return _top.alert("信息提示层", res.desc)
                }
                this.$set(this.groupData[index], 'child', res.data.pageData);
                this.showMoreModel[this.currIndex].busy = res.data.currPage == res.data.maxPage;
                if(!this.showMoreModel[this.currIndex].busy) {
                    document.getElementById('tileView').onscroll = this.throttle(() => {
                        if(this.currIndex == -1 || this.currIndex == -2) {
                            return
                        }
                        let busy  = this.showMoreModel[this.currIndex].busy;
                        if(!this.loading && !busy) {
                            let refs = _this.$refs['form' + this.currIndex],
                                lastForm = refs[refs.length - 1],
                                distance = lastForm.$el.offsetTop,
                                element = document.getElementById('tileView'),
                                top = element.scrollTop;
                            if(distance - top < 2300) {
                                this.loading = true;
                                this.loadMoreFormData()
                            }
                        }
                    }, 1000)
                }
            });
        },
        showEdit(index, group) {
            let creator = group.creator;
            if(!hasGroupAuthority(creator)) { // 判断是否是超管或者创建者
                return _top.top_alert("超管与创建者才可以编辑分组信息", false);
            }
            this.editIndex = index;
        },
        // 修改标签名称
        changeTypeName(group) {
            let id = group.id,
                typeName = group.typeName,
                data = { 'tbFormTypePO.id': id, 'tbFormTypePO.typeName': typeName };

            this.editIndex = -1;
            updateFormType(data).then(res => {
                if(res.code != "0") {
                    return _top.alert("信息提示层", res.desc)
                }
                _top.top_alert("修改标签名称成功");
            })
        },
        // 删除标签
        del(group, index) {
            let creator = group.creator,
                id = group.id,
                _this = this;
            if(!id) {
                return
            } else if(!hasGroupAuthority(creator)) {
                return _top.top_alert("超管与创建者才可以删除标签", false);
            }
            _top.confirm("提示", "确定要删除吗?", null, {
                ok() {
                    delFormType(id).then(res => {
                        if(res.code != "0") {
                            return _top.alert("信息提示层", res.desc)
                        }
                        _top.top_alert("删除成功")
                        window.location.reload();
                    })
                }
            });
        },
        // 函数节流 在某个周期内执行一次。
        throttle(method, duration){
			var begin = new Date();
			return function() {
				var context = this,
					args = arguments,
					current = new Date();
				if(current - begin > duration) {
					method.apply(context, args);
					begin = current;
				}
			}
        },
        isUnGroup(group) {
            return group.id == 'other' ? true : false;
        },
        formDel(group, index, groupIndex) {
            _top.top_alert("删除成功");
            let data = {
                    'searchValue.typeId': '',
                    page: group.child.length,
                    pageSize: 1,
                    viewMode: 1
                };
            if(group.id == 'other') {
                data['searchValue.typeId'] = this.currentGroup.id;
                data['searchValue.isSurfaceSearch'] = 1;
            } else {
                data['searchValue.typeId'] = group.id;
            }
            group.child.splice(index, 1);
            group.formCount--;
            this.currentGroup.data.formCount--;
            getForm(data).then(res => {
                if(res.code != "0") {
                    return _top.alert("信息提示层", res.desc)
                }
                if(group.formCount == 0) {
                    return
                }
                if(group.child[group.child.length - 1].id != res.data.pageData[0].id) {
                    group.child.push(res.data.pageData[0]);
                } else {
                    this.showMoreModel[groupIndex] = {};
                    this.showMoreModel[groupIndex].busy = true;
                }
            })
        },
        formOpen(group, index) {
            _top.top_alert("启用成功，已移动至列表前方");
            let indx;
            for(let i = index - 1; i >= 0; i--) {
                if(group.child[i].status == 2) {
                    indx = i + 1;
                    break;
                } else if(i == 0){
                    indx = 0;
                }
            }
            let form = group.child.splice(index, 1)[0];
            form.status = '1';
            group.child.splice(indx, 0, form);
        },
        formForbid(group, index) {
            _top.top_alert("禁用成功，已移动到列表末尾");
            for(let i = index; i < group.child.length; i++) { // 找的到已禁用的表单
                if(group.child[i].status == '-1') {
                    let item = group.child.splice(index, 1)[0];
                    item.status = '-1';
                    group.child.splice(i - 1, 0, item);
                    return
                }
            }
            let data = {
                    'searchValue.typeId': '',
                    'page': group.child.length,
                    'pageSize': 1,
                    'viewMode': 1
                };
            if(group.id == 'other') {
                data['searchValue.typeId'] = this.currentGroup.id;
                data['searchValue.isSurfaceSearch'] = 1;
            } else {
                data['searchValue.typeId'] = group.id;
            }
            getForm(data).then(res => {
                if(res.code != "0") {
                    return _top.alert("信息提示层", res.desc)
                }
                group.child.splice(index, 1);
                group.child.splice(data.page - 1, 0, res.data.pageData[0]);
            })
        }
    },
    watch: {
        'setting': {
            handler(newVal) {
                this.busy = newVal.maxPage == 0 || newVal.currPage == newVal.maxPage;
            },
            deep: true
        },
        'groupData':{
            handler(newVal) {
                if(newVal[0]) {
                    this.showNoData = newVal[0].id == 'other' && newVal[0].formCount == 0;
                }
            }
        }
    }
}
</script>

<style scoped>
.group, .un-grouped {
    line-height: 40px;
}
.group-header {
    position: relative;
    padding-left: 10px;
}
.group-header .drag-icon {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 0;
    width: 6px;
    height: 14px;
    background: url(../../../../../../assets/images/ic_drag.svg) no-repeat;
    transform: translateY(-50%);
}
.group-header .group-info {
    padding-left: 10px;
    line-height: 40px;
    display: inline-block;
}
.group-header .group-formCount {
    padding-left: 5px;
    color: #999999;
}
.group-name {
    cursor: pointer;
}
.group-revise {
    position: relative;
}
.group-revise .group-name-input {
    box-sizing: border-box;
    width: 340px;
    height: 32px;
    padding: 0 45px 0 10px;
    font-size: 14px;
    border: 1px solid #D5D5D5;
}
.group-revise .group-name-input:focus {
    border-color: #5F9FF3;
}
.group-revise .input-number-count {
    position: absolute;
    top: 50%;
    right: 10px;
    font-size: 12px;
    color: #999999;
    transform: translateY(-50%);
}
.group-operation {
    display: inline-block;
    margin-left: 10px;
}
.group-operation > div {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin: 0 5px;
    vertical-align: middle;
    cursor: pointer;
}
.group-operation .edit-icon {
    background: url(../../../../../../assets/images/ic_edit.svg) no-repeat;
}
.group-operation .close-icon {
    background: url(../../../../../../assets/images/ic_close.svg) no-repeat;
}
.show-more {
    padding-right: 25px;
    color: #999999;
    cursor: pointer;
}
.arrow-icon {
    display: inline-block;
    position: absolute;
    top: 50%;
    right: 5px;
    width: 12px;
    height: 12px;
    background: url(../../../../../../assets/images/ic_arrow.png) no-repeat center;
    transform: translateY(-50%) rotate(90deg);
    transition: all .4s ease;
}
.group-content {
    display: flex;
    flex-wrap: wrap;
}
.transform270 {
    transform: translateY(-50%) rotate(270deg);
}
.no-data {
    position: relative;
    width: 100%;
    height: 500px;
}
.no-data .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.no-data .no-data-text {
    text-align: center;
    color: #999999;
}
</style>

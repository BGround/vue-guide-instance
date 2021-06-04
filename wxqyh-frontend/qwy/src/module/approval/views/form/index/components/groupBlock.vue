<template>
    <div class="group"
        :class="{'forbidden': group.status == '0'}"
        @click="setCurrGroup(group)">
        <div class="content">
            <div class="forbid-tips" v-show="group.status && group.status == 0">已禁用</div>
            <div class="group-icon">
                <i class="iconfont" :class="picPath(group)" :style="picColor(group)"></i>
            </div>
            <div class="group-name" :title="group.typeName">{{group.typeName}}</div>
            <div class="group-option clearfix">
                <span class="form-num fl">{{group.formCount}}</span>
                <div class="form-text fl">表单</div>
                <div class="operation fr" v-if="!isUnGroup">
                    <div class="operation-btn iconfont bd-ic_b-grouping_more_horizontal"
                        :style="{'color': operationShow ? '#C31725' : '#ccc'}"
                        @mouseover="operationShow = true"
                        @mouseout="operationShow = false">
                        <div class="operation-option" v-show="operationShow">
                            <div class="option" @click.stop="edit(group)">编辑分组</div>
                            <div class="option" @click.stop="del(group)">删除</div>
                            <div class="option" @click.stop="enableOrDisable(group)">{{group.status == 1 ? '禁用' : '启用'}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { hasGroupAuthority } from './common'
import { updateFormType, delFormType, getForm } from '@/module/approval/api/form/index'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'groupBlock',
    props: {
        group: Object,
        index: Number
    },
    data() {
        return {
            operationShow: false,
            baseClass: 'bd-b-', // 字体图标基础类名前缀
            userName: dataBase.config.userName,
            managerType: dataBase.config.managerType,
            operationColor: '#ccc'
        }
    },
    computed: {
        ...mapGetters('form/index', [
            'currGroup',
            'groupData',
            'setting'
        ]),
        isUnGroup() { // 是否是未分组表单
            return this.group.id == 'other' ? true : false;
        }
    },
    methods: {
        ...mapActions('form/index',[
            'GetFormData',
            'SetCurrGroup',
            'SetSetting',
            'SetSearchValue',
            'SetGroupData',
            'SetShowResult'
        ]),
        // 设置分组
        setCurrGroup(group) {
            let groupArr = this.currGroup;
            groupArr.push({ name: group.typeName, id: group.id, data: group})
            if(this.isUnGroup) { // 进入'其他'这个特定分组
                this.SetSetting({ page: 1, pageSize: 40 })
                this.SetShowResult(true)
                this.SetSearchValue({ 'searchValue.typeId': 'other' })
                this.GetFormData({needLoading: true, viewMode: 1})
            } else {
                this.SetCurrGroup(groupArr)
                this.SetSetting({ page: 1, pageSize: 5 })
                this.SetGroupData([]);
                this.SetSearchValue({ 'searchValue.typeId': group.id })
            }
        },
        // 字体图标颜色
        picColor(group) {
            let color = '#5F9FF3',
                picPath = group.picPath;

            if(picPath) {
                color = picPath.color
            }
            if(group.status == "0") {
                color = "#ccc";
            }
            return { color: color }
        },
        picPath(group) {
            let icon = 'bd-b-chucha',
                picPath = group.picPath;

            if(group.picPath) {
                icon = this.baseClass + picPath.icon;
            }
            return  icon
        },
        // 编辑分组
        edit(group) {
            let id = group.id,
                creator = group.creator;

            if(!hasGroupAuthority(creator)) { // 判断是否拥有分组权限
                return _top.top_alert("超管与创建者才可以编辑分组信息", false);
            }
            let url = _.baseURL + '/manager/form/formtype_addAndEdit.jsp?pageType=edit&id=' + id;
            _top.$(_top.document).find("html").css({"overflow-y": "hidden"});
            _top.$(_top.document).find(".ovarlay2").show();
            //可解决弹框抖动
            _top.$(_top.document).find("body").append('<iframe id="formGroupPop" class="" width="600px" height="430px" src="' + url + '" frameborder="0" scrolling="no" ' +
                'style="position:fixed;left:50%;top:-500px;margin-left: -300px;z-index: 1000;display: none">');
            _top.$(_top.document).find("#formGroupPop").css({
                display: 'block',
                top: "50%",
                marginTop: "-250px",
                height: "430px"
            }, 500);
        },
        // 删除分组
        del(group) {
            // delGroup(group, this)
            let creator = group.creator,
                id = group.id,
                _this = this;
            if(!id) {
                return
            } else if(!hasGroupAuthority(creator)) {
                return _top.top_alert("超管与创建者才可以删除分组", false);
            }
            _top.confirm("提示", "确定要删除吗?", null, {
                ok() {
                    delFormType(id).then(res => {
                        if(res.code != "0") {
                            return _top.alert("信息提示层", res.desc)
                        }
                        _top.top_alert("删除成功")
                        _this.groupData.splice(_this.index, 1);
                        // 如果不是最后一页，需要将当前已经加载的最后一页的最后一条数据添加进来
                        let isLast = _this.setting.maxPage == _this.setting.currPage;
                        if(!isLast) {
                            getForm({
                                viewMode: 2,
                                page: _this.groupData.length + 1,
                                pageSize: 1
                            }).then(res => {
                                if(res.code != "0") {
                                    return _top.alert("信息提示层", res.desc)
                                }
                                _this.groupData.push(res.data.formTypeData[0])
                            })
                        }
                    })
                }
            });
        },
        // 禁用以及启用分组
        enableOrDisable(group) {
            let id = group.id,
                status = group.status,
                creator = group.creator;

            if(!hasGroupAuthority(creator)) {
                return _top.top_alert("超管与创建者才可以" + (status == "0" ? '启用' : '禁用') + "分组", false);
            }
            let _this = this,
                data = { 'tbFormTypePO.id': id, 'tbFormTypePO.status': status == 1 ? 0 : 1 };

            updateFormType(data).then(res => {
                if(res.code != "0") {
                    return _top.alert("提示", res.desc);
                }
                _top.top_alert((status == "0" ? '启用' : '禁用') + "成功");
                group.status = status == '0' ? '1' : '0';
            })
        },
    }
}
</script>

<style scoped>
.group {
    float: left;
    position: relative;
    margin: 0 12px 20px 0;
    list-style: none;
    width: 168px;
    height: 198px;
    color: #333;
    padding-right: 8px;
    background-color: #F5F5F5;
    border: 1px solid #EBEBEB;
    border-radius: 4px 4px 4px 4px;
    transition: all .2s linear;
}
.group:hover {
    box-shadow: 0px 5px 20px 0px rgba(153,153,153,0.2);
}
.group:nth-child(5n) {
    margin-right: 0;
}
.group.forbidden {
    color: #999999;
}
.group .content {
    position: relative;
    width: 170px;
    height: 198px;
    padding: 16px;
    background-color: #fff;
    border-right: 1px solid #EBEBEB;
    border-radius: 4px 0 0 4px;
    box-sizing: border-box;
    cursor: pointer;
}
.group-icon {
    padding-top: 30px;
    height: 42px;
    text-align: center;
}
.forbid-tips {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 12px;
}
.group-icon .iconfont {
    width: 42px;
    height: 42px;
    font-size: 58px;
    line-height: 42px;
}

.group-name {
    display: -webkit-box;
    padding-top: 15px;
    height: 40px;
    line-height: 20px;
    font-size: 15px;
    text-align: center;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
.group-option {
    margin-top: 15px;
    line-height: 30px;
}

.group-option .form-text {
    color: #999;
    font-size: 12px;
    cursor: pointer;
    padding-left: 5px;
}
.group-option .form-num {
    color: #333;
    font-size: 16px;
    cursor: pointer;
}
.operation-btn {
    position: relative;
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 30px;
}
.operation-option {
    position: absolute;
    top: 4px;
    left: -96px;
    z-index: 1000;
    line-height: 30px;
    font-size: 14px;
    color: #444;
    border: 1px solid #ccc;
    background-color: #fff;
    box-shadow: rgb(204, 204, 204) 0px 0px 10px;
}
.operation-option > div {
    box-sizing: content-box;
    padding: 0 20px 0 20px;
    cursor: pointer;
}
.operation-option .option:hover {
    background-color: #F5F5F5;
}
</style>

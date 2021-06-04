<template>
    <div id="header" class="clearfix mt20" v-if="!isGroupSetting">
        <div class="clearfix header-top" v-show="!showVipTips">
            <!-- 二级分组以及三级分组才会显示 -->
            <div class="group-navigation fl" v-show="showGroupHeader">
                <div class="fl backTo"  @click="navigateTo({name: '全部分组', id: ''})"></div>
                <breadcrumbNav class="nav fl" :navArray="currGroup" @navigateTo="navigateTo"></breadcrumbNav>
            </div>
            <!-- 新增按钮 -->
            <add-button class="fl"  v-show="checkedList == 0 && !showGroupHeader"></add-button>
            <!-- 设置按钮 -->
             <div class="setting fl" v-show="checkedList == 0 && !showGroupHeader" v-perm="'formSet'" >
                <i class="setting-icon"></i>
                <div class="setting-btn" v-show="checkedList.length == 0" @click="jumpTo('/manager/include/setting.jsp?agentCode=form')">设置</div>
            </div>
            <!-- 列表操作按钮 -->
            <div class="btn mr10 fl del-btn" v-perm="'formDel'" v-show="checkedList.length != 0" @click="batchDel">删除</div>
            <div class="btn fl authorize-btn" v-perm="'formOpenlicensing'" v-show="checkedList.length != 0"  @click="getBatchLicensing">授权</div>
            <!-- 高级搜索 -->
            <div class="fr advanced-search" :class="{ active: isShowSeniorSearch}" @click="isShowSeniorSearch = !isShowSeniorSearch">高级
                <i class="gray-arrow"></i>
            </div>
            <!-- 搜索表单 -->
            <div class="fr" v-show="!isShowSeniorSearch && !isSearch">
                <input type="text" class="search-input fl" placeholder="搜索表单" v-model="searchTitle" @keyup.enter="searchForm">
                <div class="search-btn fl" @click="searchForm"></div>
            </div>
            <!-- 分组树形选择器 -->
            <treeSelector class="btn fr" ref="groupOption" v-show="(!isShowSeniorSearch && !isSearch)" @setCurrGroup="setCurrGroup" :currSelected="currGroup"></treeSelector>
        </div>
        <div class="btn" v-show="showVipTips" @click="hideVipTips">返回</div>
        <searchSenior v-show="isShowSeniorSearch"></searchSenior>
        <!-- 高级搜索查询条件展示 -->
        <search-condition v-show="isSearch"></search-condition>
        <!-- 数据归属以及视图切换 -->
        <div class="clearfix mt20 mb10 navigation-box" v-show="!showGroupHeader">
            <!-- 数据归属 -->
            <ul class="property" @click="belongChange" v-show="!isShowSeniorSearch && !isSearch && !showResult">
                <li :class="{'active': searchValue['searchValue.belong'] == undefined || searchValue['searchValue.belong'] == ''}"
                    :data-value="''">全部</li>
                <li v-for="item in currBelong"
                    :key="item.value"
                    :class="{'active': searchValue['searchValue.belong'] == item.value}"
                    :data-value="item.value">{{item.text}}</li>
            </ul>
            <!-- 视图切换 -->
            <div class="view-box fr">
                <div class="view-icon" :class="viewMode == '1' ? 'listView-on-icon' : 'listView-icon' " @click="setViewMode('1')"></div>
                <div class="view-icon" :class="viewMode == '2' ? 'tileView-on-icon' : 'tileView-icon' " @click="setViewMode('2')"></div>
                <!-- <div class="view-icon" :class="viewMode == '3' ? 'groupView-on-icon' : 'groupView-icon' " @click="setViewMode('3')"></div> -->
            </div>
        </div>
        <!-- 分组详情介绍 -->
        <div class="group-operation clearfix" v-if="showGroupHeader">
            <div class="group-info fl">
                <i class="group-icon iconfont fl" :class="picPath(currentGroup)" :style="picColor(currentGroup)"></i>
                <div class="fr">
                    <div class="group-name">
                        {{currentGroup && currentGroup.name}}
                        <div class="group-forbidden" v-show="currentGroup.data && currentGroup.data.status == '0'" >已禁用</div>
                        <div class="setting-icon"  @click="gotoSetting" v-if="!isUnGroup"></div>
                    </div>
                    <div class="group-detail">
                        <span v-if="!isUnGroup">创建人：{{currentGroup.data && currentGroup.data.personName}}&nbsp;&nbsp;&nbsp;</span>
                        共 {{currentGroup.data && currentGroup.data.formCount || 0}} 表单
                    </div>
                </div>
            </div>
            <!-- 新增按钮 -->
            <add-button class="fr" :forbidden="currentGroup.data && currentGroup.data.status == '0'"></add-button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getGroup, delForm } from '@/module/approval/api/form/index'
import searchSenior from "./components/searchSenior";
import breadcrumbNav from '@/components/list/breadcrumbNav'
import treeSelector from './components/treeSelector'
import addButton from './components/addButton'
import searchCondition from './components/searchCondition'

export default {
    name: 'formHeader',
    components: {
        searchSenior,
        breadcrumbNav,
        treeSelector,
        addButton,
        searchCondition
    },
    data() {
        return {
            addOption: false, // true: 显示新建表单下拉框 false：隐藏
            isShowSeniorSearch: false, // true: 显示高级搜索 false: 隐藏
            searchTitle: '',
            baseClass: 'bd-b-', // 字体图标基础类名前缀
            managerType: dataBase.config.managerType,
            userName: dataBase.config.userName
        }
    },
    computed: {
        ...mapGetters('form/index', [
            'viewMode',
            'checkedList',
            'currGroup',
            'listData',
            'searchValue',
            'showVipTips',
            'isSearch',
            'setting',
            'showResult'
        ]),
        currentGroup() { // 当前分组
            return this.currGroup[this.currGroup.length - 1]
        },
        showGroupHeader() { // 是否展示与分组相关的头部按钮（首页不展示）
            return this.viewMode == '2' && this.currGroup.length == 2;
        },
        isGroupSetting() { // 是否是表单设置页面
            return this.$route.path == '/form/setting'
        },
        currBelong() { // 当前数据归属
            if(this.viewMode == 1) {
                return dataBase.FORMBELONG;
            } else if(this.viewMode == 2) {
                return dataBase.GROUPBELONG
            }
        },
        isUnGroup() { // 是否是'其他分组' 这个特殊分组
            return this.currentGroup.id == 'other'
        }
    },
    created() {
        this.getGroupList();
    },
    updated() { // 防止外部iframe高度不正确，导致内容显示不完整
        if(window.frameElement) {
            window.frameElement.height = window.document.body.scrollHeight
        }
    },
    methods: {
        ...mapActions('form/index', [
            'GetFormData',
            'SetViewMode',
            'SetCurrGroup',
            'SetSearchValue',
            'SetSetting',
            'SetVipTips',
            'SetIsSearch',
            'SetGroupList',
            'SetGroupData',
            'SetUnGroupData',
            'SetShowResult'
        ]),
        getGroupList() { // 获取分组数据
            let _this = this;
            getGroup().then(res => { // 获取分组数据
                if(res.code != "0") {
                    return _top.alert("信息提示层", res.desc)
                }
                _this.SetGroupList(res.data.formTypeList);
            })
        },
        // 跳转至某个页面
        jumpTo(url) {
            window.location.href = _.baseURL + url;
        },
        //  批量授权
        getBatchLicensing() {
            let formName = "", // 表单名称
                _this = this,
                isBeyondLicense = false, // 是否越权
                beyondLicenseFormName = '', // 越权的表单名称
                groupIds = this.checkedList.join(',');
            // 是否越权的判断
            this.checkedList.forEach((item, index) => {
                for(var i = 0; i < _this.listData.length; i++){
                    if(_this.listData[i].definitionVersionsId == item) {
                        if(_this.listData[i].isLicensing == "1") {
                            isBeyondLicense = true;
                            beyondLicenseFormName += _this.listData[i].formName + ' , ';
                            beyondLicenseFormName = beyondLicenseFormName.substring(0,beyondLicenseFormName.length-1);
                        }
                    }
                }
            })
            if(isBeyondLicense){
                return _top.alert("提示","您不能为表单："+ beyondLicenseFormName + "  进行授权操作");
            }
            // 单张表单授权时，显示表单名称
            if(this.checkedList.length == 1) {
                this.listData.forEach((item, index) => {
                    if(item.definitionVersionsId == this.checkedList[0]) {
                        formName = _top.filterString(item.formName);
                    }
                })
            }
            _top.showPopFrame(_.baseURL + '/manager/form/form_licensing.jsp?isBatch=1&groupIds=' + groupIds + "&title="+ encodeURIComponent(encodeURIComponent(formName)))
        },
        // 批量删除
        batchDel() {
            let checkedList = this.checkedList,
                _this = this,
                formName = '',
                count = 0;

            this.listData.forEach(item => {
                this.checkedList.forEach(itm => {
                    if(itm == item.definitionVersionsId) {
                        count += parseInt(item.count);
                    }
                })
                if(item.definitionVersionsId == this.checkedList[0]) {
                    formName = item.formName;
                }
            });
            this.showPopFrame('/manager/form/form_delete.jsp?formName=' + formName + '&detailCount=' + count + '&formCount=' + this.checkedList.length );
            _top.$('#popframe')[0].contentWindow.delForm = function () {
                delForm(checkedList + '').then(res => {
                    if(res.code != '0') {
                        return _top.alert('信息提示层', res.desc);
                    }
                    _this.GetFormData();
                    _top.$('#popframe').remove();
                    _top.top_alert("删除成功");
                })
            }
        },
        // 搜索表单
        searchForm() {
            if(this.searchTitle == this.searchValue['searchValue.title']) { // 搜索的表单名称与之前一致，不重复搜索
                return
            }
            switch(this.viewMode) {
                case '1': this.SetSetting({ page: 1 })
                          break;
                case '2': if(this.searchTitle == '' && this.currGroup.length == 2) { // 空字符串搜索时回到二级页面
                              this.SetShowResult(false);
                              this.SetSetting({ page: 1, pageSize: 5 });
                              break;
                          } else {
                              this.SetSetting({ page: 1, pageSize: 40 }); // 空字符串搜索时回到一级分组
                              this.SetShowResult(true);
                              break;
                          }
            }
            this.SetSearchValue({ 'searchValue.title': this.searchTitle });
            this.GetFormData({needLoading: true});
        },
        // 改变当前分组
        setCurrGroup(level, parent, child) {
            let group = [{ name: "全部分组", id: "" }], // 默认的一级分组
                id = '',
                pageSize = this.setting.pageSize; // 获取当前每页显示页数量
            switch(level) {
                case 2: id = parent.id; // 二级分组
                        group.push({ name: parent.typeName, id: parent.id, data: parent });
                        break;
                case 3: id = child.id; // 三级标签
                        group.push({ name: parent.typeName, id: parent.id, data: parent });
                        group.push({ name: child.typeName, id: child.id, data: child});
                        break;
            }
            if(this.viewMode == 2) { // 平铺视图下特殊判断当前页数
                if(level == 1) {
                    pageSize = 40;
                } else {
                    if(id == 'other') { // '其它'分组请求数量为40
                        pageSize = 40;
                    } else {
                        pageSize = 5;
                    }
                }
            }
            // 置空操作
            this.SetUnGroupData({});
            this.SetGroupData([]);
            this.SetIsSearch(false);
            this.SetSearchValue({}); // 清空搜索内容
            this.SetSearchValue({ 'searchValue.typeId': id});
            this.SetSetting({ page: 1, pageSize: pageSize });
            // 判断是否是'其它'这个特殊分组
            if(id == 'other' && this.viewMode == 2) {
                this.SetShowResult(true);
                this.GetFormData({needLoading: true, viewMode: 1}).then(res => {
                    let data = {
                        formCount: res.data.totalRows,
                        status: '1'
                    };
                    group[group.length - 1].data = data;
                    this.SetCurrGroup(group);
                })
            } else {
                this.SetShowResult(false);
                if(level == 1) {
                    this.SetCurrGroup(group);
                    this.GetFormData({needLoading: true})
                } else {
                    this.GetFormData({needLoading: true}).then(res => {
                        group[group.length - 1].data = res.data.parentFormType;
                        this.SetCurrGroup(group);
                    })
                }
            }
        },
        // 设置视图
        setViewMode(viewMode) {
            if(this.viewMode == viewMode) { // 重置当前视图无效
                return
            }
            let _this = this;
            this.SetViewMode(viewMode).then((viewMode) => {
                this.SetUnGroupData({})
                this.SetCurrGroup([{name: '全部分组', id: ''}]);
                this.SetSearchValue({});
                this.SetShowResult(false);
                this.isShowSeniorSearch = false;
                switch(viewMode) {
                    case '1': _this.$router.push('/form/listView'); break;
                    case '2': _this.$router.push('/form/tileView'); break;
                }
                this.SetSetting({
                    page: 1,
                    pageSize: 20
                })
                this.GetFormData({needLoading: true})
            })
        },
        // 隐藏vip提示
        hideVipTips() {
            this.SetVipTips(false);
        },
        // 数据归属
        belongChange(e) {
            this.SetShowResult(false);
            this.SetSetting({page: 1})
            this.SetUnGroupData({});
            this.SetGroupData([]);
            this.SetSearchValue({})
            this.SetSearchValue({
                'searchValue.typeId': this.currentGroup.id,
                'searchValue.belong': e.target.dataset.value
            });
            this.GetFormData({needLoading: true});
        },
        // 面包屑导航
        navigateTo({name, id}) {
            this.SetCurrGroup([{name: name, id: id}])
            this.SetShowResult(false);
            this.SetUnGroupData({});
            this.SetGroupData([]);
            this.SetSearchValue({});
            this.SetSearchValue({ 'searchValue.typeId':  id});
            this.SetSetting({ page: 1, pageSize: 40});
            this.GetFormData({needLoading: true});
        },
        // 分组图标类型
        picPath(group) {
            let path = 'bd-b-chucha',
                picPath = group.data ? group.data.picPath : '';

            if(picPath){
                path = this.baseClass + picPath.icon
            }
            return path
        },
        // 分组图标颜色
        picColor(group) {
            let color = '#5F9FF3',
                picPath = group.data ? group.data.picPath : '';

            if(picPath) {
                color = picPath.color
            }
            return { color: color }
        },
        // 前往分组设置页面
        gotoSetting() {
            var group = this.currGroup,
                id = this.currentGroup.id,
                creator = this.currentGroup.data.creator;
            if(this.managerType != 0 && this.userName != creator) {
                return _top.top_alert("超管与创建者才可以编辑分组", false);
            }
            group.push({ name: '分组设置', id: 'groupSetting'});
            this.SetCurrGroup(group);
            this.$router.push({ path: 'setting', query: { id: id }})
        },
        showPopFrame(url) {// 全局弹窗
            url = _.baseURL + url;
            if(_top.$('#popframe').length == 0) {
                _top.$('body').append('<iframe id="popframe" src=' + url + ' style="width:100%;height:100%;position: fixed;top: 0;left: 0;z-index:1000" frameborder="0" scrolling="no" allowtransparency="true"></iframe>')
            } else {
                _top.$('#popframe').show();
                _top.$('#popframe')[0].contentWindow.loadframe();
            }
        }
    },
    watch: {
        searchValue: {
            handler(val) {
                this.searchTitle = val['searchValue.title']
            },
            immediate: true,
            deep: true
        }
    }
}
</script>

<style scoped>
    #header {
        line-height: 32px;
        box-shadow: #F5F5F5 0 10px 10px;
        padding-bottom: 10px;
    }
    .nav {
        padding: 5px 0;
        line-height: 23px;
    }
    .backTo {
        position: absolute;
        top: 50%;
        left: 0;
        width: 25px;
        height: 25px;
        transform: translateY(-50%);
        background: url(../../../../../assets/images/ic_back.png) no-repeat;
        background-size: contain;
        cursor: pointer;
    }
    .header-top{
        position: relative;
        z-index: 9;
    }
    .btn {
        font-size: 14px;
        cursor: pointer;
        border: 1px solid #ccc;
        border-radius: 2px;
        margin-right: 10px;
    }
    .orange-btn {
        color: #fff;
        background: #C31725;
        border: 1px solid rgb(248, 123, 0);
    }
    .gray-arrow {
        position: absolute;
        top: 12px;
        right: 8px;
        width: 0;
        height: 0;
        border-width: 5px;
        border-style: solid;
        border-color: #999999 transparent transparent transparent;
    }
    .setting {
        position: relative;
        padding-left: 20px;
    }
    .setting .setting-icon {
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 0;
        width: 16px;
        height: 16px;
        background: url(../../../../../assets/images/btn-settings.svg) no-repeat;
        background-size: contain;
        transform: translateY(-50%);
    }
    .setting .setting-btn {
        cursor: pointer;
    }
    .del-btn {
        color: #fff;
        background-color: #F56262;
        border: none;
        line-height: 32px;
    }
    .del-btn:hover {
        background-color: #f45252;
    }
    .search-input {
        width: 170px;
        height: 32px;
        line-height: 32px;
        border: 1px solid #ccc;
        padding: 0 8px;
        box-sizing: border-box;
        border-radius: 2px 0 0 2px;
    }
    .search-btn {
        width: 30px;
        height: 32px;
        margin: 0 5px 0 -1px;
        border: 1px solid #ccc;
        border-radius: 0 2px 2px 0;
        border-left: 0;
        background: url(../../../../../assets/images/search_icon.png) no-repeat center;
        cursor: pointer;
    }
    .advanced-search {
        position: relative;
        padding: 0 20px 0 10px;
        cursor: pointer;
    }
    .advanced-search.active {
        color: #F87B00;
    }
    .advanced-search .gray-arrow {
        top: 14px;
        right: 4px;
    }
    .advanced-search.active .gray-arrow {
        border-color: #F87B00 transparent transparent transparent;
    }
    .property li {
        float: left;
        padding-right: 15px;
        cursor: pointer;
    }
    .property li:hover, .property li.active {
        color: #F87B00;
    }
    .navigation-box {
        line-height: 22px;
    }
    .view-box {
        position: relative;
        line-height: 32px;
        padding: 3px 0;
        border: 1px solid #ccc;
    }
    .view-icon {
        float: left;
        width: 14px;
        height: 14px;
        margin: 0 10px;
        cursor: pointer;
    }
    .search-result {
        color: #999;
    }
    .back {
        cursor: pointer;
        color: #333;
    }
    .back:hover{
        color: #f87b00;
    }
    /* 分组所展示的按钮的样式 */
    .group-navigation {
        position: relative;
        padding-left: 40px;
        line-height: 32px;
    }
    .group-operation {
        position: relative;
        padding: 40px 0 25px 10px;
        margin-top: 8px;
    }
    .group-icon  {
        margin-right: 10px;
        color: rgb(253, 173, 34);
        font-size: 58px;
        line-height: 58px;
    }
    .group-name {
        position: relative;
        font-size: 16px;
        padding-right: 30px;
        line-height: 29px;
    }
    .group-detail {
        font-size: 12px;
        color: #999999;
        line-height: 29px;
    }
    .group-name .setting-icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin:  0  0 2px 10px;
        vertical-align: middle;
        background: url(../../../../../assets/images/btn-settings.svg) no-repeat;
        background-size: contain;
        cursor: pointer;
    }
    .group-forbidden {
        display: inline-block;
        font-size: 14px;
        color: #999999;
        padding-left: 7px;
    }
    .listView-icon {
        background: url(../../../../../assets/images/ic-list.png) no-repeat center;
    }
    .listView-on-icon {
        background: url(../../../../../assets/images/ic-list-on.png) no-repeat center;
    }
    .tileView-icon {
        background: url(../../../../../assets/images/ic-grid.png) no-repeat center;
    }
    .tileView-on-icon {
        background: url(../../../../../assets/images/ic-grid-on.png) no-repeat center;
    }
    .groupView-icon {
        background: url(../../../../../assets/images/ic-group.png) no-repeat center;
    }
    .groupView-on-icon {
        background: url(../../../../../assets/images/ic-group-on.png) no-repeat center;
    }
    ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
        color: #ccc;
    }
</style>


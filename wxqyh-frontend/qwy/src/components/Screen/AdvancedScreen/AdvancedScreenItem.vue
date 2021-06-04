<template>
<ul class="search-items clearfix">
    <li v-for="(item,index) in screenItemList" :key="index">
        <div class="search-title">{{item.name}}</div>
        <input v-if="item.type=='text'" :type="item.type" class="search-input" v-model="value[item.modelName]" @input="queryData(item.searchObj,$event,index)" @focus="queryData(item.searchObj,$event,index)">
        <select v-else-if="item.type=='select'" class="search-select" v-model="value[item.modelName]">
            <option v-for="(iItem,iIndex) in item.dataList" :key="iIndex" :selected="item.defaultValue==iItem.value" :value="iItem.value">{{iItem.text}}</option>
        </select>
        <vue-datepicker-local @input="change(value[item.modelName],item.timeHandler)" v-else-if="item.type=='time'" v-model="value[item.modelName]" range-separator="至" clearable></vue-datepicker-local>
        <div class="qwui-search_xiala">
            <div class="qwui-search_item" v-if="item.searchObj&&item.searchObj.type=='user'" v-for="(iItem,iIndex) in fuzzySearchData.userList" @click="selectItem(iItem,index,item)" :key="iIndex">
                <img :src="iItem.headPic" alt="">
                <span>{{iItem.personName}}</span>
            </div>
            <div class="qwui-search_item" v-if="item.searchObj&&item.searchObj.type=='dept'" v-for="(iItem,iIndex) in fuzzySearchData.departList" @click="selectItem(iItem,index,item)" :key="iIndex">
                <span>{{iItem.deptFullName}}</span>
            </div>
        </div>
        <div class="qwui-search_show" v-if="item.searchObj&&item.searchObj.type=='user'&&item.selectShowData&&item.selectShowData.isShow">
            <div class="qwui-search_show_item">
                <img :src="item.selectShowData.headPic" alt="">
                <span>{{item.selectShowData.personName}}</span>
                <span class="close" @click="hideSelectData(index,item.modelName)"></span>
            </div>
        </div>
        <div class="qwui-search_show" v-else-if="item.searchObj&&item.searchObj.type=='dept'&&item.selectShowData&&item.selectShowData.isShow">
            <div class="qwui-search_show_item">
                <span>{{item.selectShowData.departmentName}}</span>
                <span class="close" @click="hideSelectData(index,item.modelName)"></span>
            </div>
        </div>
    </li>
</ul>
</template>

<script>
import VueDatepickerLocal from "vue-datepicker-local";
import {
    baseAxios
} from './getData';
import {
    mapActions,
    mapGetters
} from "vuex";

export default {
    name: 'advancedScreenItem',
    data() {
        return {
            value: {},
            fuzzySearchData: '',
            defaultAvatar: require('../../../assets/images/touxiang02.png'),
        }
    },
    props: {
        screenItemList: {
            type: Array,
            default: []
        },
        init: {
            type: Boolean,
            default: false
        },
        search: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        'init': function () {
            this.initData();
        },
        'search': function () {
            this.searchData();
        }
    },
    created() {
        window.sessionStorage.removeItem('hideIndex');
        this.initData();
    },
    methods: {
        ...mapActions('advancedScreen', ['setUpdateAdvancedScreenData']),
        change(data, callback) {
            let startTime = this.formatDate(data[0], ' 00:00:00');
            let endTime = this.formatDate(data[1], ' 23:59:59');
            callback ? callback(startTime, endTime) : '';
        },
        initData() {
            let typeJson = {
                'text': '',
                'select': '',
                'time': []
            };
            let self = this;
            this.screenItemList.forEach(function (item, index) {
                item.selectShowData = {
                    isShow: false
                };
                self.$set(self.value, item.modelName, typeJson[item.type]);
                if (item.defaultValue && JSON.stringify(item.defaultValue) != '[]') {
                    self.$set(self.value, item.modelName, item.defaultValue);
                }
            });
            this.setUpdateAdvancedScreenData(this.value);
        },
        searchData() {
            let self = this;
            this.screenItemList.forEach(function (item, index) {
                if (item.type == 'time') {
                    self.value[item.modelName][0] = self.formatDate(self.value[item.modelName][0], ' 00:00:00');
                    self.value[item.modelName][1] = self.formatDate(self.value[item.modelName][1], ' 23:59:59');
                }
            });
            this.$emit('searchResult', this.value);
        },
        formatDate(date, str) {
            // 格式化高级查询日期
            if (date) {
                return new Date(date).Format("yyyy-MM-dd") + str;
            } else {
                return "";
            }
        },
        queryData(searchObj, e, index) {
            let self = this;
            if (searchObj) {
                let hideIndexStorage = window.sessionStorage.getItem('hideIndex');
                let hideIndex = hideIndexStorage || hideIndexStorage == '0' ? hideIndexStorage : index;
                document.querySelector('body').onclick = function () {
                    self.hideDropDown(hideIndex);
                };
                window.sessionStorage.setItem('hideIndex', index);
                searchObj.params = Object.assign(searchObj.params, {
                    keyWord: e.target.value
                });
                baseAxios(searchObj.searchUrl, searchObj.params, (data) => {
                    document.querySelectorAll('.qwui-search_xiala')[index].style.display = 'block';
                    if (data.userList) {
                        data.userList.forEach(function (item, index) {
                            item.headPic = item.headPic != '0' ? item.headPic : self.defaultAvatar;
                        });
                    }
                    self.fuzzySearchData = data;
                });
            }
        },
        hideDropDown(index) {
            this.fuzzySearchData = '';
            document.querySelectorAll('.qwui-search_xiala')[index].style.display = 'none';
        },
        selectItem(iItem, index, item) {
            if (item.searchObj.type == 'user') {
                this.value[item.modelName] = {
                    'personName': iItem.personName,
                    'userId': iItem.userId,
                };
            } else if (item.searchObj.type == 'dept') {
                this.value[item.modelName] = {
                    'departmentName': iItem.departmentName,
                    'deptFullName': iItem.deptFullName,
                };
            }
            iItem.isShow = true;
            this.$set(this.screenItemList[index], 'selectShowData', iItem);
        },
        hideSelectData(index, modelName) {
            this.value[modelName] = '';
            let temp = this.screenItemList[index];
            temp.selectShowData.isShow = false;
            this.screenItemList.splice(index, 1, temp);
        }
    },
    components: {
        VueDatepickerLocal
    }
}
</script>

<style lang="scss" scoped>
.search-items {
    &>li {
        position: relative;
        float: left;
        width: 210px;
        margin: 10px 0 0 20px;

        .qwui-search_xiala {
            position: absolute;
            width: 210px;
            border: 1px solid #ccc;
            border-top: none;
            z-index: 1;
            background: #fff;
            display: none;
            box-sizing: border-box;

            .qwui-search_item {
                margin: 2px 0;
                cursor: pointer;

                img {
                    margin: 0 5px;
                    width: 26px;
                    height: 26px;
                }

                span {
                    margin: 0 2px;
                    line-height: 26px;
                    height: 26px;
                    vertical-align: top;
                }
            }
        }

        .qwui-search_show {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 26px;
            line-height: 26px;
            background: #fff;
            border: 1px solid #ccc;
            box-sizing: border-box;

            .qwui-search_show_item {
                margin: 0 5px;
                padding-left: 5px;
                list-style: none;
                max-width: 200px;
                display: inline-block;
                background-color: #eee;
                border: 1px solid #ddd;
                height: 22px;
                line-height: 22px;

                img {
                    width: 20px;
                    height: 20px;
                    list-style: none;
                    margin-right: 5px;
                    vertical-align: top;
                }

                span {
                    display: inline-block;
                    max-width: 136px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .close {
                    color: #afafaf;
                    font-size: 16px;
                    vertical-align: top;
                    line-height: 20px;
                    display: inline-block;
                    width: 16px;
                    height: 22px;
                    padding-right: 5px;
                    cursor: pointer;
                    text-align: center;
                    background: url(~assets/images/btn_close.png) no-repeat center center;
                    background-size: 10px;

                    &:hover {
                        background: url(~assets/images/selected-close.png) no-repeat center center;
                    }
                }
            }
        }

        .search-title {
            color: #666;
            font-size: 14px;
            line-height: 26px;
        }

        .search-input {
            padding: 0 7px;
            width: 100%;
            height: 26px;
            line-height: 26px;
            color: #333;
            border: 1px #ccc solid;
            box-sizing: border-box;
        }

        .datepicker /deep/ input {
            padding: 0 30px 0 10px;
            border: 1px #ccc solid;
            height: 26px;
        }

        .search-select {
            padding: 0 7px;
            width: 100%;
            height: 26px;
            line-height: 26px;
            color: #333;
            border: 1px #ccc solid;
            box-sizing: border-box;
            outline: none;
        }

        .datepicker-range {
            min-width: 210px;
        }
    }
}
</style>

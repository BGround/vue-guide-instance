<template>
    <div class="advancedSearch">
        <div @click="advancedShow = !advancedShow" class="text">点击展开高级搜索</div>
        <input type="text" v-model="cacheSearchValue['searchValue.text']" class="text-input">
        <advancedSearch
            @search="search"
            @close="searchClose"
            :setting="setting"
            :cache-search-value="cacheSearchValue"
            v-show="advancedShow"
        ></advancedSearch>
        <user-choose
          :closeAllTab="selectConfig.signIndex == 'depts'"
          :closeGroup="selectConfig.signIndex == 'depts'"
          :closeUser="selectConfig.signIndex == 'depts'"
          :tabActive="selectConfig.signIndex == 'depts' ? 'dept' : 'group'"
          :selectconfig="selectConfig"
          v-show="selectConfig.show"></user-choose>
    </div>
</template>

<script>
import advancedSearch from '@/components/base/AdvancedSearch/index'
import userChoose from '../../../components/base/user_or_dept_select'

let DIYdate = [] // DIYdate: 二维数组, DIYdate.length: 有多少列

{
    let YEAR = [],
        SEASON = [{ text: '一季度', value: '1'}, { text: '二季度', value: '2'}, { text: '三季度', value: '3'}, { text: '四季度', value: '4'}]
    for(let i = 1949; i <= 2050; i++) {
        /*
        *   数组存放对象, 对象格式一定是：
        *   {
        *       text: xxx年  展示的文字,
        *       value: xxx   对应的值
        *   }
        *
        */
        YEAR.push( { text: i + '年', value: i } )
    }
    DIYdate = [YEAR, SEASON];
}
let fakeSelectConfig = {
    show: false,
    signIndex: 'users',
    selectList: {
        "users": { // 单独选人
            "title":"",
            "selectType": "group",
            "userSelected": [],
            "callBack": {
                "confirm": null
            }
        },
         "depts": { // 选部门
            "title":"",
            "selectType": "dept",
            "deptSelected": [],
            "callBack": {
                "confirm": null
            }
        },
        "usersOrDepts": { // 选部门和选人
            "title":"",
            "selectType": "group",
            "userSelected": [],
            "deptSelected": [],
            "callBack": {
                "confirm": null
            }
        }
    }
}
export default {
    name: 'demo',
    components: {
        advancedSearch,
        userChoose
    },
    data() {
        return {
            dataBase: dataBase,
             selectConfig: fakeSelectConfig,
            setting: [
                {
                    label: '双向单行文本（interval）',  // 标题
                    key: ['searchValue.intervalLeft', 'searchValue.intervalRight'],  // key值
                    type: 'interval', // 类型
                    inputType: 'number', // input框的类型
                    callBack: { from: this.intervalFrom, to: this.intervalTo }, // callBack
                    placeholder: { from: '最大值', to: '最小值' }
                },
                {
                    key: 'searchValue.radio',
                    type: 'radio',
                    value: [
                        { text: '单选按钮1', value: '', callBack: this.radioCheck },
                        { text: '单选按钮2', value: 'useless' },
                        { text: '单选按钮3', value: 'relative' }],
                    noDefault: true // 是否不需要默认选中  true: 不需要默认选中第一个 false：默认选中第一个 默认：false
                },
                {
                    label: '单选按钮（radio）',
                    key: 'searchValue.radio3',
                    type: 'radio',
                    value: [
                        { text: '默认选中', value: 'default', callBack: this.radioCheck},
                        { text: '没啥用的按钮', value: 'useless'},
                        { text: '带有relativeLabel属性的关联复选框的按钮', value: 'relative'},
                    ]
                },
                {
                    label: '被关联的复选框（checkbox）',
                    key: 'searchValue.checkbox',
                    type: 'checkbox',
                    value: [
                        { text: '大于等于两行的文本，会自动缩小字体并且间距变紧凑', value: '1'},
                        { text: '没啥用的选项1', value: '2'},
                        { text: '点击我上面的按钮，展开更多选项', value: '3'},
                        { text: '禁止相同text，否则和我相同text的按钮也会被选中', value: '4'},
                        { text: '禁止相同text，否则和我相同text的按钮也会被选中', value: '5'},
                        { text: '没啥用的选项2', value: '6'},
                        { text: '超过6个选项，会隐藏后面的选项', value: '7'},
                        { text: '我是被隐藏的选项', value: '8'}]
                },
                {
                    label: '默认年月日的日期（date）',
                    key: ['searchValue.startTime', 'searchValue.endTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD', //用来控制日期展示的格式以及返回的数据格式
                    callBack: {
                        start: this.startTimeChange,
                        end: this.endTimeChange
                    },
                    placeholder: { from: '开始时间', to: '结束时间'}
                },
                {
                    label: 'DIY的日期（date）',
                    key: ['searchValue.startTime1', 'searchValue.endTime1'],
                    type: 'date',
                    dateType: 'DIY',
                    dateValue: DIYdate
                },
                {
                    label: '单行文本（text）',
                    key: 'searchValue.text',
                    type: 'text',
                    placeholder: '请输入',
                    callBack: this.textChange
                },
                {
                    label: '单行文本（text）',
                    key: 'searchValue.number',
                    type: 'text',
                    placeholder: '请输入金额',
                    callBack: this.textChange,
                    inputType: 'number'
                },
                {
                    label: '下拉框（select）',
                    key: 'searchValue.select',
                    type: 'select',
                    value: [{ text: '请选择', value: ''}, { text: '下拉框1', value: '1'}, { text: '下拉框2', value: '2'}, { text: '下拉框3', value: '3'}]
                },
                {
                    label: '选人（selectPerson）',
                    key: 'searchValue.selectPerson',
                    type: 'selectUserOrDepart',
                    selectConfig: fakeSelectConfig,
                    selectType: 'users',
                  userRestriction: 1
                },
                {
                    label: '选部门（selectDepartment）',
                    key: 'searchValue.selectDepartment',
                    type: 'selectUserOrDepart',
                    selectConfig: fakeSelectConfig,
                    selectType: 'depts',
                    deptRestriction: 1
                },
                {
                    label: '同时选部门和人（selectUserOrDepart）',
                    key: 'searchValue.selectUserOrDepart',
                    type: 'selectUserOrDepart',
                    selectConfig: fakeSelectConfig,
                    selectType: 'usersOrDepts',
                    deptRestriction: 1
                },
                {
                    label: '选择区域(address)',
                    key: 'searchValue.address',
                    type: 'address'
                }
            ],
            cacheSearchValue: JSON.parse(sessionStorage.getItem('searchValue')) || {},
            advancedShow: false
        }
    },
    methods: {
        searchClose() {
            this.advancedShow = false;
        },
        search(searchValue) {
            this.advancedShow = true;
            sessionStorage.setItem('searchValue', JSON.stringify(searchValue));
            console.log('高级搜索的结果: ');
            console.log(searchValue);
        },
        close() {
            this.advancedShow = false;
        },
        radioCheck() {
            console.log('radioCheck')
        },
        textChange() {
            console.log('textChange')
        },
        intervalFrom() {
            console.log('intervalFrom')
        },
        intervalTo() {
            console.log('intervalTo')
        },
        changeRadio() {
            this.cacheSearchValue['searchValue.radio1'] = 'useless'
            this.$set(this.cacheSearchValue, 'searchValue.startTime', '2018-07-15')
        },
        startTimeChange() {
            this.$set(this.cacheSearchValue, 'searchValue.radio1', 'useless')
        },
        endTimeChange() {
            console.log('endTime')
        }
    }

}
</script>

<style scoped>
.qwui-btn_tab {
    display: flex;
    padding: 8px 15px;
}
.qwui-btn {
    position: relative;
    display: block;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 16px;
    text-align: center;
    text-decoration: none;
    color: #fff;
    line-height: 44px;
    border-radius: 5px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    overflow: hidden;
    cursor: pointer;
}
.qwui-btn.qwui-btn_primary {
    color: rgba(255,255,255,1);
    background: rgba(47,125,205,1);
}
.text {
    width: 100%;
    line-height: 32px;
    font-size: 16px;
    text-align: center;
}
.text-input {
    width: 100%;
    height: 32px;

}
</style>



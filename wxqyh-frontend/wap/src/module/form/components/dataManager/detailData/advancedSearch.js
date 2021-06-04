
export const mixinAdvancedSearch = {
    data() {
        return {
            searchSetting: [], // 当前高级搜索配置
            searchSettingArr: [[0, 1, 2, 5, 6, 7], [0, 1, 2, 4, 5, 6, 7], [0, 1, 2, 3, 5, 6, 7, 8], [0, 1, 7]], // 高级搜索配置数据，不同表单类型，不同配置
            searchSettingData: [ // 高级搜索配置数据
                {
                    label: '表单标题',
                    key: 'formTitle',
                    type: 'text',
                    placeholder: '请输入',
                    show: true
                },
                {
                    label: '阅读状态',
                    key: 'commentStatus',
                    type: 'radio',
                    value: [{ text: '全部', value: ''}, { text: '已阅', value: 'HAS_READ'}, { text: '未阅', value: 'HAS_NOT_READ'}],
                    show: true
                },
                {
                    label: '数据范围',
                    key: 'meRange',
                    type: 'radio',
                    value: [{ text: '全部', value: '' }, { text: '我负责的', value: '1' },
                            { text: '我提交的', value: '3' }, { text: '我相关的', value: '2' }],
                    show: true
                },
                {
                    label: '审批状态',
                    key: 'auditStatus',
                    type: 'radio',
                    value: [{ text: '全部', value: ''}, { text: '审批中', value: '1'}, { text: '已审批', value: '2'}, { text: '退审', value: '3'}, { text: '已关闭', value: '5'}],
                    show: true
                },
                {
                    label: '任务状态',
                    key: 'auditStatus',
                    type: 'radio',
                    value: [{ text: '全部', value: ''}, { text: '未关闭', value: '0'}, { text: '已关闭', value: '-1'}],
                    show: true
                },
                {
                    label: '部门',
                    key: 'departId',
                    type: 'selectUserOrDepart',
                    selectType: 'depts',
                    selectConfig: dataBase.selectConfig,
                    deptRestriction: '1',
                    show: true
                },
                {
                    label: '创建人/提单人',
                    key: 'creatorId',
                    type: 'selectUserOrDepart',
                    selectType: 'users',
                    selectConfig: dataBase.selectConfig,
                    userRestriction: '1',
                    show: true
                },
                {
                    label: '创建时间',
                    key: ['createaStartTime', 'createaEndTime'],
                    type: 'date',
                    show: true
                },
                {
                    label: '审批时间',
                    key: ['auditStartTime', 'auditEndTime'],
                    type: 'date',
                    show: true
                }
            ]
        }
    },
    methods: {
        setSearchSetting(settingMap) {
            let _this = this,
                searchSetting = []
            settingMap.forEach(item => searchSetting.push(_this.searchSettingData[item]))
            this.searchSetting = searchSetting
        }
    },
    created() {
        this.setSearchSetting(this.searchSettingArr[this.isTask]) // 配置高级搜索配置
    }
}

export const mixinSearchSetting = [
    {
        label: "表单标题",
        key: "formTitle",
        type: "text",
        placeholder: "请输入"
    },
    {
        label: '应用/表单模板',
        key: 'formTemplate',
        type: 'handle',
        callBack: null
    },
    {
        label: "表单类型",
        key: "isTask",
        type: "radio",
        value: [
            { text: "全部", value: "" },
            { text: "普通单", value: "0" },
            { text: "任务单", value: "1", relativeLabel: [] },
            { text: "审批单", value: "2", relativeLabel: [] }
        ]
    },
    {
        label: "阅读状态",
        key: "commentStatus",
        type: "radio",
        value: [
            { text: "全部", value: "" },
            { text: "已阅", value: "HAS_READ" },
            { text: "未阅", value: "HAS_NOT_READ" }
        ]
    },
    {
        label: "任务状态",
        key: "auditStatus",
        type: "radio",
        value: [
            { text: "全部", value: "" },
            { text: "未关闭", value: "0" },
            { text: "已关闭", value: "-1" }
        ],
        show: false
    },
    {
        label: "审批状态",
        key: "auditStatus",
        type: "radio",
        value: [
            { text: "全部", value: "" },
            { text: "审批中", value: "1" },
            { text: "已审批", value: "2" },
            { text: "退审", value: "3" },
            { text: "已关闭", value: "5" }
        ],
        show: false
    },
    {
        label: "部门",
        key: "departId",
        type: "selectUserOrDepart",
        selectConfig: dataBase.selectConfig,
        selectType: "depts",
        deptRestriction: "1"
    },
    {
        label: "创建人/提单人",
        key: "creatorId",
        type: "selectUserOrDepart",
        selectConfig: dataBase.selectConfig,
        selectType: "users",
        userRestriction: "1"
    },
    {
        label: "创建时间",
        key: ["createaStartTime", "createaEndTime"],
        type: "date"
    },
    {
        label: "审批时间",
        key: ["auditStartTime","auditEndTime"],
        type: "date",
        show: false
    }
]
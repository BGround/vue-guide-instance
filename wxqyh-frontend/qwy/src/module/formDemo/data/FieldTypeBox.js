import FieldMap from './FieldMap'
const FieldTypes = [
  {
    title: '普通字段',
    data: [
      {
        title: '单行文字',
        tip: '适用于填写简短的文字，如“姓名”',
        icon: '',
        type: FieldMap.TextField
      },
      {
        title: '单项选择',
        tip: '适用于在几个选项里选一个，如投票、“男/女”',
        icon: '',
        type: FieldMap.RadioButton
      }
    ]
  },
  {
    title: '关联字段',
    data: [
      {
        title: 'CRM客户',
        tip: '获取CRM的客户信息',
        icon: '',
        type: FieldMap.CRMCustomerField
      },
      {
        title: '通讯录成员',
        tip: '获取通讯录成员',
        icon: '',
        type: FieldMap.MEMBERCustomerField
      }
    ]
  }
]

export default FieldTypes

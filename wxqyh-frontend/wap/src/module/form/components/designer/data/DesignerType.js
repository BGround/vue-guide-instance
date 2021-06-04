/*
* 字段类型选择
* title
* icon
* type 类型
* */

import FieldMap from './DesignerMap'
const FieldTypes = [
  {
    title: '普通字段',
    data: [
      {
        title: '单行文字',
        icon: 'ic_a-form_single',
        type: FieldMap.TextField
      },
      {
        title: '多行文字',
        icon: 'ic_a-form_double',
        type: FieldMap.TextArea
      },
      {
        title: '单项选择',
        tip: '适用于在几个选项里选一个，如投票、“男/女”',
        icon: 'ic_a-form_radio',
        type: FieldMap.RadioButton
      },
      {
        title: '多项选择',
        icon: 'ic_a-form_checkbox',
        type: FieldMap.CheckBox
      },
      {
        title: '下拉框',
        icon: 'ic_a-form_dropdown',
        type: FieldMap.DropDown
      },
      {
        title: '数字',
        icon: 'ic_a-form_digital',
        type: FieldMap.NumberField
      },
      {
        title: '邮箱',
        icon: 'ic_a-form_email',
        type: FieldMap.EmailField
      },
      {
        title: '手机',
        icon: 'ic_a-form_phone',
        type: FieldMap.MobileField
      },
      {
        title: '电话',
        icon: 'ic_a-form_telephone',
        type: FieldMap.TelephoneField
      },
      {
        title: '地理位置',
        icon: 'ic_a-form_location',
        type: FieldMap.GeoField
      },
      {
        title: '日期',
        icon: 'ic_a-form_date',
        type: FieldMap.DateField
      },
      {
        title: '时间',
        icon: 'ic_a-form_time',
        type: FieldMap.TimeField
      },
      {
        title: '日期时间',
        icon: 'ic_a-form_datetime',
        type: FieldMap.DateTimeField
      },
      {
        title: '评分',
        icon: 'ic_a-form_score',
        type: FieldMap.RatingField
      },
      {
        title: '说明项',
        icon: 'ic_form_instructions',
        type: FieldMap.ImageCheckBox
      },
      {
        title: '分节',
        icon: 'ic_a-form_segmentation',
        type: FieldMap.SectionBreak
      },
      {
        title: '图片',
        icon: 'ic_a-form_pic',
        type: FieldMap.ImageField
      },
      {
        title: '附件',
        icon: 'ic_a-fprm_attachment',
        type: FieldMap.AccessoryField
      },
    ]
  },
]

// 设置标题
export const FieldTypeText = {
  [FieldMap.TextField]: '单行文字',
  [FieldMap.EmailField]: '邮箱',
  [FieldMap.NumberField]: '数字',
  [FieldMap.TelephoneField]: '电话',
  [FieldMap.MobileField]: '手机',
  [FieldMap.TextArea]: '多行文字',
  [FieldMap.DateField]: '日期',
  [FieldMap.TimeField]: '时间',
  [FieldMap.DateTimeField]: '日期时间',
  [FieldMap.RadioButton]: '单项选择',
  [FieldMap.CheckBox]: '多项选择',
  [FieldMap.DropDown]: '下拉框',
  [FieldMap.RatingField]: '评分',
  [FieldMap.GeoField]: '地理位置',
  [FieldMap.ImageCheckBox]: '说明项',
  [FieldMap.SectionBreak]: '分节',
  [FieldMap.ImageField]: '图片',
  [FieldMap.AccessoryField]: '附件',
}
export default FieldTypes

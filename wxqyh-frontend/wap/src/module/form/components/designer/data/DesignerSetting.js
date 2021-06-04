/*
** 以下公用设置组件 TextFieldSetting
* TextField
* NumberField
* EmailField
* MobileField
* TelephoneField
* GeoField
* ImageRadioButton
* ImageCheckBox
* AccessoryField
* SectionBreak
********************************
**** 配置选项的显示
* label 标题
* predefined 默认值
* notes 提示
* validations 校验
****
* */

import Map from './DesignerMap'
export const DesignerSetting = {
  [Map.TextField]: {
    'predefined': true,
    'notes': true,
    'validations': true,
    'label': true,
  },
  [Map.NumberField]: {
    'predefined': true,
    'notes': true,
    'validations': true,
    'label': true,
  },
  [Map.EmailField]: {
    'predefined': true,
    'notes': true,
    'validations': true,
    'label': true,
  },
  [Map.MobileField]: {
    'predefined': true,
    'notes': true,
    'validations': true,
    'label': true,
  },
  [Map.TelephoneField]: {
    'predefined': true,
    'notes': true,
    'validations': true,
    'label': true,
  },
  [Map.GeoField]: {             // 地理位置
    'validations': true,
    'label': true,
  },
  [Map.ImageCheckBox]: {
    'notes': true,
    'label': true,
  },
  [Map.ImageField]: {
    'validations': true,
    'label': true,
  },
  [Map.AccessoryField]: {
    'validations': true,
    'label': true,
  },
  [Map.SectionBreak]: {
    'label': false,
    'notes': true,
  }
}

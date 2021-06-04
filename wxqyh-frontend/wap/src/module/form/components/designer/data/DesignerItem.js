/* 字段设置数据 */

import FieldMap from './DesignerMap'
import { uuid } from '@/utils/commonUtils'
const getId = () => {
  return 'fo'+uuid().replace(/-/g, '')
}
export const choices = ()=>{
  return {
    "_type": "Choice",
    "selected": false,
    "value": "选项",
    "quota": null,
    "sub_choices": [],
    "quota_temp": "",
    "_id": getId(),
    "group": "c62"
  }
}
export const RadioButton = ()=>{
  return {
    "_type": "RadioButton",
    "position": 1,
    "label": "单项选择",
    "predefined_value": "",
    "notes": "",
    "validations": [],
    "private": false,
    "has_data": false,
    "grids_to_occupy": null,
    "minimum_grids_to_occupy": null,
    "start_new_row": null,
    "cache_data": null,
    "choices_layout": "column",
    "random_choices": false,
    "_id": getId(),
    "choices": [choices(),choices(),choices()],
    "line_row": 1,
    "selectedChoice": "选项"
  }
}
export const CheckBox = ()=>{
  return {
    "_type": "CheckBox",
    "position": 1,
    "label": "多项选择",
    "predefined_value": "",
    "notes": "",
    "validations": [],
    "private": false,
    "has_data": false,
    "grids_to_occupy": null,
    "minimum_grids_to_occupy": null,
    "start_new_row": null,
    "cache_data": null,
    "choices_layout": "column",
    "random_choices": false,
    "_id": getId(),
    "choices": [choices(),choices(),choices()],
    "line_row": 1,
    "selectedChoice": "选项"
  }
}
export const DropDown = ()=>{
  return {
    "_type": "DropDown",
    "position": 1,
    "label": "下拉框",
    "predefined_value": "",
    "notes": "",
    "validations": [],
    "private": false,
    "has_data": false,
    "grids_to_occupy": null,
    "minimum_grids_to_occupy": null,
    "start_new_row": null,
    "cache_data": null,
    "choices_layout": "column",
    "random_choices": false,
    "_id": getId(),
    "choices": [choices(),choices(),choices()],
    "selectedChoice": "选项"
  }
}
export const RatingField = ()=>{
  return {
    "_type": "RatingField",
    "position": 1,
    "label": "评分",
    "predefined_value": "",
    "notes": "",
    "validations": [],
    "private": false,
    "has_data": false,
    "grids_to_occupy": null,
    "minimum_grids_to_occupy": null,
    "start_new_row": null,
    "cache_data": null,
    "rating_type": "star",
    "_id": getId(),
    "choices": [choices(),choices(),choices()]
  }
}
export const TextField = ()=>{
  return {
    "_type": "TextField",
    "position": 1,
    "label": "单行文字",
    "predefined_value": "",
    "notes": "请输入",
    "validations": [],
    "private": false,
    "has_data": false,
    "grids_to_occupy": null,
    "minimum_grids_to_occupy": null,
    "start_new_row": null,
    "cache_data": null,
    "_id": getId(),
    "line_row": 1,
    "children": []
  }
}
export const NumberField = ()=>{
  return {
    "_id": getId(),
    "_type": "NumberField",
    "accurate_num": 0,
    "cache_data": "",
    "children": [],
    "grids_to_occupy": "",
    "has_data": false,
    "label": "数字",
    "line_row": 1,
    "minimum_grids_to_occupy": "",
    "notes": "请输入",
    "position": 1,
    "predefined_value": "",
    "start_new_row": "",
    "validations": [],
    "private": false
  }
}
export const EmailField = () => {
  return {
    "_type": "EmailField",
    "position": 1,
    "label": "邮箱",
    "predefined_value": "",
    "notes": "请输入",
    "validations": [],
    "private": false,
    "has_data": false,
    "grids_to_occupy": null,
    "minimum_grids_to_occupy": null,
    "start_new_row": null,
    "cache_data": null,
    "_id": getId(),
    "line_row": 1,
    "children": []
  }
}
export const TelephoneField = ()=>{
  return {
    "_type": "TelephoneField",
    "position": 1,
    "label": "电话",
    "predefined_value": "",
    "notes": "分隔请用-或空格，国际电话请加+",
    "validations": [],
    "private": false,
    "has_data": false,
    "grids_to_occupy": null,
    "minimum_grids_to_occupy": null,
    "start_new_row": null,
    "cache_data": null,
    "_id": getId(),
    "line_row": 1,
    "children": []
  }
}
export const MobileField = ()=>{
  return {
    "_type": "MobileField",
    "position": 1,
    "label": "手机",
    "predefined_value": "",
    "notes": "请输入",
    "validations": [],
    "private": false,
    "has_data": false,
    "grids_to_occupy": null,
    "minimum_grids_to_occupy": null,
    "start_new_row": null,
    "cache_data": null,
    "_id": getId(),
    "line_row": 1,
    "children": []
  }
}
export const TextArea = ()=>{
  return {
    "_type": "TextArea",
    "position": 1,
    "label": "多行文字",
    "predefined_value": "",
    "notes": "请输入",
    "validations": [],
    "private": false,
    "has_data": false,
    "grids_to_occupy": null,
    "minimum_grids_to_occupy": null,
    "start_new_row": null,
    "cache_data": null,
    "_id": getId(),
    "line_row": 1,
    "children": []
  }
}
export const DateField = ()=>{
  return {
    "_type": "DateField",
    "position": 1,
    "label": "日期",
    "predefined_value": "",
    "notes": "请选择",
    "validations": [],
    "private": false,
    "has_data": false,
    "grids_to_occupy": null,
    "minimum_grids_to_occupy": null,
    "start_new_row": null,
    "cache_data": null,
    "_id": getId(),
    "line_row": 1,
    "children": []
  }
}
export const TimeField = ()=>{
  return {
    "_type": "TimeField",
    "position": 1,
    "label": "时间",
    "predefined_value": "",
    "notes": "请选择",
    "validations": [],
    "private": false,
    "has_data": false,
    "grids_to_occupy": null,
    "minimum_grids_to_occupy": null,
    "start_new_row": null,
    "cache_data": null,
    "_id": getId(),
    "line_row": 1,
    "children": []
  }
}
export const DateTimeField = ()=>{
  return {
    "_type": "DateTimeField",
    "position": 1,
    "label": "日期时间",
    "predefined_value": "",
    "notes": "请选择",
    "validations": [],
    "private": false,
    "has_data": false,
    "grids_to_occupy": null,
    "minimum_grids_to_occupy": null,
    "start_new_row": null,
    "cache_data": null,
    "_id": getId(),
    "line_row": 1,
    "children": []
  }
}
export const GeoField = ()=>{
  return {
    "_type": "GeoField",
    "position": 1,
    "label": "地理位置",
    "predefinedType": 0,
    "predefined_value": "",
    "notes": "正在获取地理位置…",
    "validations": [],
    "private": false,
    "has_data": false,
    "grids_to_occupy": null,
    "minimum_grids_to_occupy": null,
    "start_new_row": null,
    "cache_data": null,
    "_id": getId(),
    "line_row": 1,
    "children": []
  }
}
export const CityField = ()=> {
  return {
    "_type": "CityField",
    "position": 1,
    "label": "省市区",
    "predefinedType": 0,
    "predefined_value": "",
    "notes": "",
    "validations": [],
    "private": false,
    "has_data": false,
    "grids_to_occupy": null,
    "minimum_grids_to_occupy": null,
    "start_new_row": null,
    "cache_data": null,
    "_id": getId(),
    "line_row": 1,
    "children": []
  }
}
export const ImageRadioButton = () => {
  return {
    "_type": "ImageRadioButton",
    "position": 1,
    "label": "微信扫码",
    "predefinedType": 0,
    "predefined_value": "",
    "notes": "",
    "validations": [],
    "private": false,
    "has_data": false,
    "grids_to_occupy": null,
    "minimum_grids_to_occupy": null,
    "start_new_row": null,
    "cache_data": null,
    "choices_layout": "side_by_side",
    "random_choices": false,
    "_id": getId(),
    "line_row": 1,
    "children": []
  }
}
export const ImageCheckBox = () => {
  return {
    "_type": "ImageCheckBox",
    "position": 1,
    "label": "说明项",
    "predefinedType": 0,
    "predefined_value": "",
    "notes": "",
    "validations": [],
    "private": false,
    "has_data": false,
    "grids_to_occupy": null,
    "minimum_grids_to_occupy": null,
    "start_new_row": null,
    "cache_data": null,
    "choices_layout": "side_by_side",
    "random_choices": false,
    "_id": getId(),
    "line_row": 1,
    "children": []
  }
}
export const SectionBreak = ()=>{
  return {
    "_type": "SectionBreak",
    "position": 1,
    "label": "分节",
    "predefinedType": 0,
    "predefined_value": "",
    "notes": "",
    "validations": [],
    "private": false,
    "has_data": false,
    "grids_to_occupy": null,
    "minimum_grids_to_occupy": null,
    "start_new_row": null,
    "cache_data": null,
    "_id": getId(),
    "line_row": 1,
    "children": []
  }
}
export const ImageField = () => {
  return {
    "_type": "ImageField",
    "position": 1,
    "label": "图片",
    "predefinedType": 0,
    "predefined_value": "",
    "notes": "",
    "validations": [],
    "private": false,
    "has_data": false,
    "grids_to_occupy": null,
    "minimum_grids_to_occupy": null,
    "start_new_row": null,
    "cache_data": null,
    "_id": getId(),
    "line_row": 1,
    "children": []
  }
}
export const AccessoryField = ()=>{
  return {
    "_type": "AccessoryField",
    "position": 1,
    "label": "附件",
    "predefinedType": 0,
    "predefined_value": "",
    "notes": "",
    "validations": [],
    "private": false,
    "has_data": false,
    "grids_to_occupy": null,
    "minimum_grids_to_occupy": null,
    "start_new_row": null,
    "cache_data": null,
    "_id": getId(),
    "line_row": 1,
    "children": []
  }
}
// 批量编辑里面的配置项
export const DesignOptionsData = ()=>{
  return [
  {
    title: "是/否",
    content: [
      {
        value: "是"
      },
      {
        value: "否"
      },
    ]
  },
  {
    title: "满意度" ,
    content: [
      {
        value: '非常满意'
      },
      {
        value: '满意'
      },
      {
        value: '一般'
      },
      {
        value: '不满意'
      },
      {
        value: '非常不满意'
      }
    ]
  },
  {
    title: "同意度" ,
    content: [
      {
        value: '非常同意'
      },
      {
        value: '同意'
      },
      {
        value: '一般'
      },
      {
        value: '不同意'
      },
      {
        value: '完全不同意'
      }
    ]
  },
  {
    title: "重要度" ,
    content: [
      {
        value: '非常重要'
      },
      {
        value: '重要'
      },
      {
        value: '一般'
      },
      {
        value: '不怎么重要'
      },
      {
        value: '完全不重要'
      }
    ]
  },
  {
    title: "性别",
    content: [
      {
        value: '男'
      },
      {
        value: '女'
      },
      {
        value: '不想透露'
      }
    ]
  },
  {
    title: "年龄",
    content: [
      {
        value: '18岁以下'
      },
      {
        value: '18~25'
      },
      {
        value: '26~30'
      },
      {
        value: '31~40'
      },
      {
        value: '41~50'
      },
      {
        value: '51~60'
      },
      {
        value: '60以上'
      }
    ]
  },
  {
    title: "学历",
    content: [
      {
        value: '初中'
      },
      {
        value: '高中'
      },
      {
        value: '大学本科'
      },
      {
        value: '硕士研究生'
      },
      {
        value: '博士研究生'
      }
    ]
  },
  {
    title: "职业情况",
    content: [
      {
        value: '全职'
      },
      {
        value: '兼职'
      },
      {
        value: '自由职业'
      },
      {
        value: '找工作中'
      },
      {
        value: '无业'
      },
      {
        value: '在校学生'
      },
      {
        value: '不想说'
      }
    ]
  },
  {
    title: "月份",
    content: [
      {
        value: '一月'
      },
      {
        value: '二月'
      },
      {
        value: '三月'
      },
      {
        value: '四月'
      },
      {
        value: '五月'
      },
      {
        value: '六月'
      },
      {
        value: '七月'
      },
      {
        value: '八月'
      },
      {
        value: '九月'
      },
      {
        value: '十月'
      },
      {
        value: '十一月'
      },
      {
        value: '十二月'
      }
    ]
  },
  {
    title: "星期",
    content: [
      {
        value: '星期一'
      },
      {
        value: '星期二'
      },
      {
        value: '星期三'
      },
      {
        value: '星期四'
      },
      {
        value: '星期五'
      },
      {
        value: '星期六'
      },
      {
        value: '星期日'
      }
    ]
  },
  {
    title: "省/市/区/直辖市",
    content: [
      {
        value: '北京市'
      },
      {
        value: '天津市'
      },
      {
        value: '河北省'
      },
      {
        value: '山西省'
      },
      {
        value: '内蒙古自治区'
      },
      {
        value: '辽宁省'
      },
      {
        value: '吉林省'
      },
      {
        value: '黑龙江省'
      },
      {
        value: '江苏省'
      },
      {
        value: '浙江省'
      },
      {
        value: '安徽省'
      },
      {
        value: '福建省'
      },
      {
        value: '江西省'
      },
      {
        value: '山东省'
      },
      {
        value: '河南省'
      },
      {
        value: '湖北省'
      },
      {
        value: '湖南省'
      },
      {
        value: '广东省'
      },
      {
        value: '广西壮族自治区'
      },
      {
        value: '海南省'
      },
      {
        value: '重庆市'
      },
      {
        value: '四川省'
      },
      {
        value: '贵州省'
      },
      {
        value: '云南省'
      },
      {
        value: '西藏自治区'
      },
      {
        value: '陕西省'
      },
      {
        value: '甘肃省'
      },
      {
        value: '青海省'
      },
      {
        value: '宁夏回族自治区'
      },
      {
        value: '新疆维吾尔自治区'
      },
      {
        value: '香港特别行政区'
      },
      {
        value: '澳门特别行政区'
      },
      {
        value: '台湾'
      }
    ]
  },
]
}
export const DesignOptions = () => {
  let choiceType = DesignOptionsData()
  for(var i= 0;i<choiceType.length;i++ ){
    for (var j=0;j<choiceType[i].content.length;j++){
      choiceType[i].content[j]= Object.assign(choices(),choiceType[i].content[j])
    }
  }
  return choiceType
}
export const FieldDataMap = {
  [FieldMap.TextField]: TextField,
  [FieldMap.EmailField]: EmailField,
  [FieldMap.NumberField]: NumberField,
  [FieldMap.TelephoneField]: TelephoneField,
  [FieldMap.MobileField]: MobileField,
  [FieldMap.RadioButton]: RadioButton,
  [FieldMap.RatingField]: RatingField,
  [FieldMap.CheckBox]: CheckBox,
  [FieldMap.DropDown]: DropDown,
  [FieldMap.TextArea]: TextArea,
  [FieldMap.DateField]: DateField,
  [FieldMap.TimeField]: TimeField,
  [FieldMap.DateTimeField]: DateTimeField,
  [FieldMap.GeoField]: GeoField,
  [FieldMap.ImageRadioButton]: ImageRadioButton,
  [FieldMap.CityField]: CityField,
  [FieldMap.ImageCheckBox]: ImageCheckBox,
  [FieldMap.SectionBreak]: SectionBreak,
  [FieldMap.ImageField]: ImageField,
  [FieldMap.AccessoryField]: AccessoryField,
}

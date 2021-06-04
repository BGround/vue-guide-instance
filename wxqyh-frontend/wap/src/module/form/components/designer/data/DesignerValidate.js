/*
* 校验组件配置
* */
import Map from './DesignerMap'
const DesignerValidate = {
  [Map.TextField]: {
    "unique": true,
    "presence": true,            // 必须填
    "uniqueness": true,          // 只读项
    "isCard": true,              // 填写身份证
    "minimum_length": "chars",
    "maximum_length": "chars"
  },
  [Map.NumberField]: {
    "unique": true,
    "presence": true,            // 必须填
    "uniqueness": true,          // 只读项
    "accurate_num": true,
    "range_max": true,
    "range_min": true,
    "iscapital": true,          // 金额大写
  },
  [Map.EmailField]: {
    "unique": true,
    "presence": true,            // 必须填
    "uniqueness": true,          // 只读项
  },
  [Map.MobileField]: {
    "unique": true,
    "presence": true,            // 必须填
    "uniqueness": true,          // 只读项
  },
  [Map.TelephoneField]: {
    "unique": true,
    "presence": true,            // 必须填
    "uniqueness": true,          // 只读项
  },
  [Map.GeoField]: {             // 地理位置
    "presence": true,
  },
  [Map.RadioButton]: {
    presence: true,
    uniqueness: true,
    unique: true,
  },
  [Map.TextArea]: {
    "presence": true,
    "uniqueness": true,
    "minimum_length": "chars",
    "maximum_length": "chars"
  },
  [Map.DateField]: {
    "presence": true,
    "uniqueness": true,
    "start_date": true,
    "end_date": true
  },
  [Map.CheckBox]: {
    "unique": true,
    "presence": true,            // 必须填
    "minimum_length": "choices",
    "maximum_length": "choices"
  },
  [Map.DropDown]: {
    "unique": true,
    "presence": true,            // 必须填
  },
  [Map.RatingField]: {
    "presence": true,            // 必须填
  },
  [Map.TimeField]: {
    "presence": true,
    "uniqueness": true
  },
  [Map.DateTimeField]: {
    "presence": true,
    "uniqueness": true
  },
  [Map.CityField]: {
    'presence': true,
  },
  [Map.ImageRadioButton]: {
    'presence': true,
  },
  [Map.ImageField]: {
    'presence': true,
  },
  [Map.AccessoryField]: {
    'presence': true,
  }
}
export default DesignerValidate

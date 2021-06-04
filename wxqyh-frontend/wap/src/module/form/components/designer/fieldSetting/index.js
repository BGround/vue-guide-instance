import FieldMap from "../data/DesignerMap";
import RadioButtonSetting from './radioButtonSetting'
import RatingFieldSetting from './RatingFieldSetting'
import TextFieldSetting from './textFieldSetting'
import TextAreaSetting from './TextAreaSetting'
import DateFieldSetting from './dateFieldSetting'
import TimeFieldSetting from './timeFieldSetting'
import DateTimeFieldSetting from './dateTimeFieldSetting'
import SectionBreakSetting from './sectionBreakSetting'
export default {
  [FieldMap.RadioButton+'Setting']:RadioButtonSetting,
  [FieldMap.CheckBox+'Setting']:RadioButtonSetting,
  [FieldMap.DropDown+'Setting']:RadioButtonSetting,
  [FieldMap.RatingField+'Setting']:RatingFieldSetting,
  [FieldMap.TextField+'Setting']:TextFieldSetting,
  [FieldMap.EmailField+'Setting']:TextFieldSetting,
  [FieldMap.NumberField+'Setting']:TextFieldSetting,
  [FieldMap.TelephoneField+'Setting']:TextFieldSetting,
  [FieldMap.MobileField+'Setting']:TextFieldSetting,
  [FieldMap.GeoField+'Setting']:TextFieldSetting,
  [FieldMap.CityField+'Setting']:TextFieldSetting,
  [FieldMap.ImageRadioButton+'Setting']:TextFieldSetting,
  [FieldMap.ImageCheckBox+'Setting']:TextFieldSetting,
  [FieldMap.ImageField+'Setting']:TextFieldSetting,
  [FieldMap.AccessoryField+'Setting']:TextFieldSetting,
  [FieldMap.SectionBreak+'Setting']:SectionBreakSetting,
  [FieldMap.TextArea+'Setting']:TextAreaSetting,
  [FieldMap.DateField+'Setting']:DateFieldSetting,
  [FieldMap.TimeField+'Setting']:TimeFieldSetting,
  [FieldMap.DateTimeField+'Setting']:DateTimeFieldSetting
}

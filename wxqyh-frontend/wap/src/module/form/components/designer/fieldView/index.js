import FieldDesignMap from '../data/DesignerMap'
import fieldViewGroup from './fieldViewGroup'
import RadioButton from './radioButton'
import RatingField from './RatingField'
import DropDown from './dropdown'
import TextField from './textField'
import TextArea from './textArea'
import DateField from './dateField'
import SectionBreak from './sectionBreak'
import ImageCheckBox from './ImageCheckBox'
import ImageField from './imageField'
export default {
  fieldViewGroup,
  [FieldDesignMap.RadioButton]: RadioButton,
  [FieldDesignMap.CheckBox]: RadioButton,
  [FieldDesignMap.DropDown]: DropDown,
  [FieldDesignMap.TextField]: TextField,
  [FieldDesignMap.EmailField]: TextField,
  [FieldDesignMap.NumberField]: TextField,
  [FieldDesignMap.TelephoneField]: TextField,
  [FieldDesignMap.MobileField]: TextField,
  [FieldDesignMap.CityField]: TextField,
  [FieldDesignMap.ImageRadioButton]: TextField,
  [FieldDesignMap.ImageCheckBox]: ImageCheckBox,
  [FieldDesignMap.AccessoryField]: ImageField,
  [FieldDesignMap.ImageField]: ImageField,
  [FieldDesignMap.SectionBreak]: SectionBreak,
  [FieldDesignMap.TextArea]: TextArea,
  [FieldDesignMap.RatingField]: RatingField,
  [FieldDesignMap.GeoField]: DateField,
  [FieldDesignMap.DateField]: DateField,
  [FieldDesignMap.TimeField]: DateField,
  [FieldDesignMap.DateTimeField]: DateField
}

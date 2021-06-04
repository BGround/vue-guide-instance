import FieldMap from './FieldMap'
const TextField = {
  "_type": "TextField",
  "position": 1,
  "label": "单行文字",
  "predefined_value": "测试默认值",
  "notes": "请输入",
  "validations": [],
  "private": false,
  "has_data": false,
  "grids_to_occupy": null,
  "minimum_grids_to_occupy": null,
  "start_new_row": null,
  "cache_data": null,
  "_id": "fof91829c231ce4e6d8cb439bd72eadcbd",
  "line_row": 1,
  "children": []
}
const RadioButton = {
  "_type": "RadioButton",
  "position": 3,
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
  "_id": "focb7aed30b7424b8589a17059582a5991",
  "choices": [{
    "_type": "Choice",
    "selected": false,
    "value": "选项",
    "quota": null,
    "sub_choices": [],
    "quota_temp": "",
    "_id": "fobb121204f9d742818803fc4362a140a7",
    "group": "c62"
  },
    {
      "_type": "Choice",
      "selected": false,
      "value": "选项",
      "quota": null,
      "sub_choices": [],
      "quota_temp": "",
      "_id": "fod7f075f41889416397e131402d966a1c",
      "group": "c62"
    },
    {
      "_type": "Choice",
      "selected": false,
      "value": "选项",
      "quota": null,
      "sub_choices": [],
      "quota_temp": "",
      "_id": "fo0a17c01295cb442d851a1388303770ee",
      "group": "c62"
    }],
  "selectedChoice": "选项"
}
export default {
  [FieldMap.TextField]: TextField,
  [FieldMap.RadioButton]: RadioButton,
};

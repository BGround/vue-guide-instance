<template>
  <div>
    <p class="fieldView-title">
      {{FieldItem.label}}
      <span v-show="FieldItem.validations.indexOf('presence')>-1" class="mustTip">*</span>
    </p>
    <div class="De-form-group">
      <input
        readonly
        type="text"
        class="De-form-input-lg"
        :placeholder="FieldItem.notes || '请选择'"
        :value="FieldItem.predefined_value"
      >
      <span :class="ICON[FieldItem._type]"></span>
    </div>

  </div>
</template>

<script>
  import Map from '../data/DesignerMap'
  // form_icon_location, ic_a-form_date_small, ic_a-form_time_small, ic_a-form_datetime_small
  const ICON = {
    [Map.DateField]: 'ic_a-form_date_small',
    [Map.TimeField]: 'ic_a-form_time_small',
    [Map.DateTimeField]: 'ic_a-form_datetime_small',
    [Map.GeoField]: 'form_icon_location'
  }
  export default {
    name: "DateField",
    props: {
      FieldItem: {
        type: Object
      },
      index: {
        type: Number
      }
    },
    data() {
      return {
        ICON,
      }
    }
  }
</script>

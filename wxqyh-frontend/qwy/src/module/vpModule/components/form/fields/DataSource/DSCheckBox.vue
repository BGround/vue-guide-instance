<template>
  <div class="field-content">
    <div class="field-bcolor clearfix">
      <div class="choice-field-item checkbox-field-item"
           v-for="choice in data" @click="ontouch(choice)"
           :class="{row1:1==field.line_row,row2:2==field.line_row,row3:3==field.line_row}">
        <i :class="{active:fieldKey.indexOf(choice[IdShowKey])!= -1}"></i>{{choice[MainFieldKey]}} <span v-if="idShow">({{choice[IdShowKey]}})</span>
      </div>
    </div>
  </div>
</template>
<script>
  import {field_validation} from '../validation.js'
  export default {
    props: {
      'field': {
        type: Object,
        required: true,
      },
      'data': {  //数据源数据
        type: Array,
        required: true,
      },
    },
    data(){
      return{
        MainFieldKey: '',  // 主字段key
        IdShowKey: '',     // 主键key
        idShow: false    // 主键是否显示
      }
    },
    created() {
      this.getKeys()
    },
    computed: {
      // value中的主键key值对应的数据
      fieldKey() {
        var ids = [];
        this.field.value && this.field.value.forEach((item) => {
          ids.push(JSON.parse(item)[this.IdShowKey])
        })
        return ids;
      },
    },
    methods: {
      setValue(value) {
        var val = JSON.stringify(value)
        var arry = this.field.value || [];
        if (arry.indexOf(val) == -1) {
          arry.push(val)
        } else {
          arry.remove(val);
        }
        this.$emit('sourceData', arry)
        field_validation(this.field);
      },
      // 获取主键 主字段的key值
      getKeys() {
        var _this =this;
        this.field.ref_cfg.datasource_fields.forEach((item) => {
          if (item.field_type == 'MainField'){
            _this.MainFieldKey = item.field_key;
          } else if (item.field_type == 'IdShow' || item.field_type == 'Id'){
            _this.IdShowKey = item.field_key;
            if (item.field_type == 'IdShow') {
              _this.idShow = true;
            }
          }
        })
      },
      ontouch(val) {
        this.field.help = '';
        if (this.field.disabled || this.field.readonly) {
          return;
        }
        this.setValue(val);
      }
    }
  }
</script>
<style>
</style>

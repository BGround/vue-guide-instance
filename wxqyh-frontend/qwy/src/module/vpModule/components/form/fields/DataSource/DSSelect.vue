<template>
  <div class="field-content drop-field">
    <select class="drop-down drop-down1"
            :class="{'text-field-help':field.help,'readOnly':field.readonly || field.disabled}"
            :disabled="field.disabled || field.readonly"
            v-model="selectValue"
            @change="setValue">
      <option
        v-for="choice in data"
        :key="choice[id]"
        :value="choice">{{(choice[mainField]==='请选择'&&field.disabled)?'':choice[mainField]}}</option>
    </select>
  </div>
</template>
<script>
  export default {
    props:{
      'field':{
        type:Object,
        required:true,
      },
      'data':{  //数据源数据
        type:Array,
        required:true,
      },
    },
    data(){
      return {
        idShow:false,
        id:'',          //主键
        mainField:'',   //主子段
        selectValue: {}, //选中
        defaultValue:{},
      }
    },
    created(){
      this.initData();
    },
    methods:{
      initData(){
        var _this = this;
        //主键和主子段
        this.field.ref_cfg.datasource_fields.forEach(item =>{
          if(item.field_type == 'MainField'){
              _this.mainField = item.field_key;
          }else if(item.field_type ==="Id"){
            _this.id = item.field_key;
            _this.idShow = false;
          }else if(item.field_type ==="IdShow"){
            _this.id = item.field_key;
            _this.idShow = true;
          }
        })
        //插入请选择
        this.defaultValue = {}
        this.field.ref_cfg.datasource_dict.forEach(item =>{
          this.defaultValue[item] = '';
        })
        this.defaultValue[this.mainField] = '请选择';
        this.data.unshift(this.defaultValue);
        this.selectValue = this.field.value?JSON.parse(this.field.value):this.defaultValue;
        //插入请选择
      },
      setValue(){
        var value = JSON.stringify(this.selectValue)
        this.$emit('sourceData',[value])
      },
    }

  }
</script>
<style  scoped>
  select {
    background: #fff;
  }
</style>

<template>
  <div class="form-content">
    <div class="form-group childForm-item-font" v-for="field in childItem" :key="field.key" v-show="isFieldVisible(field)">
      <div class="form-label" v-if="field._type!='SectionBreak'">
          <label class="control-label">{{ field.label }}</label>
          <span v-show="field.validations&&field.validations.indexOf('presence')!=-1 && !field.disabled" class="colorRed"> *</span>
          <div class="field-notes" v-if="field.notes">{{ field.notes }}</div>
        </div>
      <component v-bind:is="getFieldComponent(field)" ref="mychild" :field="field" :index="index" :isChildField="true" @change="setChildValue"></component>
      <div class="help-block colorRed" :id="'msg'+field._id" v-if="field.help">{{ field.help }}</div>
    </div>
  </div>
</template>

<script>

  import Big from 'big.js';

  import TextField from './fields/textField'
  import TextAreaField from './fields/textAreaField'
  import RadioButtonField from './fields/radioButtonField'
  import CheckBoxField from './fields/checkBoxField'
  import DropDownField from './fields/dropDownField'
  import NumberField from './fields/numberField'
  import EmailField from './fields/emailField'
  import TelephoneField from './fields/telephoneField'
  import CityField from './fields/cityField'
  import MobileField from './fields/mobileField'
  import EquationField from './fields/equationField'
  import CascadeDropDown from './fields/cascadeDropDown'
  import RatingField from './fields/ratingField'
  import DateTimeField from './fields/DateField'
  import DateField from './fields/DateField'
  import TimeField from './fields/TimeField'
  import ImageField from './fields/imageField'
  import ImageRadioButton from './fields/imageRadioButton'
  import GeoField from './fields/geoField'

  import fieldMap from './data/fieldMap'
  import {equation,setStoreValue,getLinkage,getAdvmthd,} from '../js/getData'
  export default {
    props:['childItem','index'],
    components:{
      TextField,
      TextAreaField,
      RadioButtonField,
      CheckBoxField,
      DropDownField,
      NumberField,
      EmailField,
      TelephoneField,
      CityField,
      MobileField,
      EquationField,
      CascadeDropDown,
      RatingField,
      DateTimeField,
      DateField,
      TimeField,
      ImageField,
      ImageRadioButton,
      GeoField
    },
    data () {
      return {
        equationMatch:[],
        equationList:[],
      }
    },
    computed:{
      relationField() {
        return this.$store.state.formBase.statisticMap[this.$parent.field._id]
      }
    },
    mounted(){
      //计算计算式的数据
      this.equationList = equation(this.childItem);
      var equationMatch = this.equationMatch;
      this.equationList.forEach(function (item) {
        for (var i = 0,l = item.matchs.length; i < l; i++) {
          equationMatch.push(item.matchs[i]);
        }
      });
      this.statistic();
      //计算计算式
      if(['edit','copy'].indexOf(this.$route.query.type) != -1)return;
      var eqMatch = this.equationMatch;
      this.$refs.mychild&&this.$refs.mychild.forEach(function(itemVue){
        //计算式的属性计算
        if(itemVue.hasOwnProperty('setCalculator')&&eqMatch.indexOf(itemVue.field._id)!=-1){
          itemVue.setCalculator();
        }
      })
    },
    methods:{
      isFieldVisible(){
        return true;
      },
      getFieldComponent(field){

        var component = fieldMap[field._type]||'textField'
        return  component;
      },
      //子表单的编辑数据1.修改this.field.value,2.修改state的data
      setChildValue(val){
        //修改childItem的值
        this.childItem.forEach(function(item){
          if(item._id == val.key){
            item.value = val.value;
          }
        });

        //修改父表单的data数据
        var index = this.index;
        var parentId = this.$parent.field._id;
        var formData = this.$store.state.formBase.data;
        //父表单的数据
        var old = formData[parentId]||[];
        var childData = old[index]||{};
        childData[val.key] = val.value;
        old[index] = childData;
        //修改this.field.value的值
        this.$emit('change',{key:parentId,value:old});
        this.$store.commit('setValue',{key:parentId,value:old});
        this.statistic();
      },
      //统计代码的执行
      statistic(){
        //统计的代码的执行relationField
        if(this.relationField){
          this.relationField.forEach(relationField =>{
            var relationshipKey = relationField.calculator.split('|')[1];
            var valueKey = relationField._id;
            if(relationshipKey&&valueKey){
              var line_row = relationField.line_row;//line_row 1和，2最大值，3最小值，4平均
              var accurate_num = relationField.accurate_num;
              var newArray = [];
              var parentId = this.$parent.field._id;
              var formData = this.$store.state.formBase.data;
              var fieldValue = formData[parentId]||[];
              fieldValue.forEach(function(item){
                newArray.push(Number(item[relationshipKey]||''));
              });
              var result = '';
              switch(line_row){
                case 1: result = arrSum (newArray);break;
                case 2: result = newArray.max();break;
                case 3: result = newArray.min();break;
                case 4: result = arrSum (newArray, true);break;
              }
              //遍历子表的数据
              if(accurate_num){
                if(accurate_num<0){
                  accurate_num = 0;
                }
                result = Number(result||'').toFixed(accurate_num)
              }
              this.$store.commit('setValue',{key:valueKey,value:result});
                //  数据联动
              let ids = this.$store.state.formBase.linkageIds;
              if(ids.indexOf(valueKey) != -1){
                setStoreValue({key:valueKey,value:result}, this.$store, this.$store.state.formBase.schema, true);
                getLinkage({key:valueKey,value:result}, this, this.$store, this.$store.state.formBase.schema, true);
              }
              // 高级函数
              let advmthd = this.$store.state.formBase.advmthd;
              advmthd.forEach(list=> {
                if (list.matchs.indexOf(valueKey) != -1) {
                  setStoreValue({key:valueKey,value:result}, this.$store, this.$store.state.formBase.schema, true);
                  getAdvmthd({key:valueKey,value:result}, this, this.$store, this.$store.state.formBase.schema, true);
                }
              })
            }else{
              console.error('统计的值错误')
            }
          })
          //求 和/平均值
          function arrSum(arr, isAvg) {
            if( !arr.length ) return ;
            var sum = Big(arr[0]);
            for (let i = 1; i < arr.length ; i++) {
              sum = sum.add(arr[i]);
            }
            return isAvg ? sum.div(arr.length).toString() : sum.toString();
          }
        }
      }
    },
  }
</script>
<style>
  .popupBg{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 100;
    padding-bottom:50px;
    overflow-y:scroll;
    overflow-x:hidden;
  }
  .foot-tools{
    position:fixed;
    bottom:0;
  }

</style>

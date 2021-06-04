<template>
  <div class="field-content">
      <component v-bind:is="getFieldComponent(field)" :field="field" :data="data" @sourceData="setValue" v-if="showDSField&&!noData"></component>
      <input v-else class='text-field readOnly' value='无数据'/>
    </div>
</template>
<script>
  import fieldMap from './DataSource/dataSocuseMap'
  import {dataSource} from 'vpModule/api/form/list'
  import DSRadio from './DataSource/DSRadio'
  import DSSelect from './DataSource/DSSelect'
  import DSCheckBox from './DataSource/DSCheckBox'
  import DSCascadeDropDown from './DataSource/DSCascadeDropDown'
  import DSDatasource from './DataSource/DSDatasource'

  export default {
    props: ['field'],
    components:{
      DSRadio,
      DSSelect,
      DSCheckBox,
      DSCascadeDropDown,
      DSDatasource
    },
    data(){
      return {
        data:[],
        showDSField:false,
      }
    },
    computed:{
      noData(){
        return _.isNull(this.data)&&this.field.ref_type != 'DSDatasource';
      }
    },
    created(){
      this.getData()
    },
    methods:{
      getFieldComponent(field){
        var component = fieldMap[field.ref_type];
        return  component;
      },
      getData(){
        if(this.field.ref_type == 'DSDatasource') return this.showDSField = true;
        var _this = this;
        var url = this.field.ref_url+`&wxUserId=${dataBase.config.wxUserId}&corpId=${wxqyhConfig.orgConfigInfo.corpId}&id=${this.field._id}&page=1&pageSize=50`;
        dataSource({url}).then(res =>{
         _this.data = res;
         _this.showDSField = true;
        })
      },
      setValue(value){
        var key = this.field._id;
        this.$emit('change',{key,value})
      }
    }
  }
</script>

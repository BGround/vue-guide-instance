<template>
  <div class="field-content">
    <div v-if="field.disabled?true:sources.length!=0" class="relative-field">
      <div class="relative-list" v-for="item in sources" @click="showSourceInfo(item)">
        <span v-html="item[MainFieldKey]"></span>
      </div>
    </div>
    <div v-if="!field.disabled"  class="childForm-item-add" @click="sourceList">点击添加</div>
    <selectSource v-if="show" :field="field" @addSource="addSource"></selectSource>
    <sourceInfo v-if="infoShow" :field="field.ref_cfg.datasource_fields" @closeSource="closeSource" :showSource="showSource"></sourceInfo>
  </div>
</template>
<script>
  import {dataSource} from 'vpModule/api/form/list'
  import selectSource from '../../base/select_source'
  import sourceInfo from '../../base/source_info.vue'

  export default {
    props: {
      'field':{
        type:Object,
        required:true,
      },
      'data':{  //数据源数据
        type:Array,
        required:true,
      },
    },
    components: {
      selectSource,
      sourceInfo    // 数据源单个数据组件
    },
    data (){
      return{
        show:false,
        infoShow:false,    // 单个数据显示
        MainFieldKey: '',  // 主字段key
        sources:[],
        showSource:{},     // 数据源单个数据
      }
    },
    created(){
      this.field.ref_cfg.datasource_fields.forEach(item => {
        if (item.field_type == 'MainField') {
          this.MainFieldKey = item.field_key;
        }
      })
      if(this.field.value){
        var val = []
        this.field.value.forEach(item =>{
          val.push(JSON.parse(item))
        })
        this.addSource(val)
      }
    },
    methods: {
      setValue(value) {
        var arry = [];
        value.forEach(item => {
          arry.push(JSON.stringify(item))
        })
        this.$emit('sourceData', arry)
      },
      sourceList () {
        this.show = true;
      },
      addSource (res) {
        this.show = false
        if(res){
          this.sources = res
          this.setValue(res);
        }
      },
      showSourceInfo(item) {
        this.infoShow = true;
        this.showSource = item;
      },
      closeSource() {
        this.infoShow = false;
      }
    }
  }
</script>
<style>
</style>

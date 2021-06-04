<template>
  <div class="qwui-dataReport">
    <div class="qwui-dataReport-title">
      {{index + 1}}. 
      <span v-html="childTitle + field.itemName"></span>
    </div>
    <div v-for="item in renderData" :key="item.itemKey">
      <select-field v-if="item.options.length" :field="item" :index="-1"></select-field>
    </div>
  </div>
</template>
<script>
  import selectField from './selectField.vue'
  export default {
    name:'selectTwoField',
    components:{
      selectField
    },
    props:{
      'field':{
        type: Object,
      },
      'index':{
        type: Number
      }
    },
    data(){
      return {
        childTitle:'',
        renderData:[[],[],[]]  //多级数组
      };
    },
    created(){
      this.childTitle = this.field.parentName ? this.field.parentName + ' > ': '';
      this.filterData();
    },
    methods:{
      filterData(){
        var option = this.field.options;
        var renderOptions = [[],[],[]];
        option.forEach( item => {
          if(item.levels == 1){
            renderOptions[0].push(item)
          }else if( item.levels == 2 ){
            renderOptions[1].push(item)
          }else {
            renderOptions[2].push(item)
          }
        })
        var titles = this.field.itemType == 'CityField'? ['省','省/市','省/市/区'] :['一级','一级/二级','']
        var field = JSON.stringify(this.field);
        this.renderData = [JSON.parse(field),JSON.parse(field),JSON.parse(field)];
        this.renderData.forEach((item,index) => {
          item.itemKey = item.itemKey+'_'+index;
          item.options = renderOptions[index];
          item.itemName = titles[index]
        })
      },
    }
  }

</script>
<style scoped lang="scss">
  @import './style.scss';
  .qwui-dataReport .qwui-dataReport-title {
    padding-bottom: 0;
    margin-top: -12px;
  }
</style>


<!--多级下拉框-->
<template>
	<div class="field-content clearfix">
    <div class="drop-field fl " :class="row" v-for="index in field.cascadeLevel" :key="index">
      <select class="drop-down drop-down1"
              :class="{'text-field-help':field.help,'readOnly':field.readonly || field.disabled}"
              :disabled="field.disabled || field.readonly"
              v-model="fieldVal[index-1]"
              @change="setValue(index)">
        <option
            v-for="choice in choiceData[index-1]"
          :key="choice[id]"
          :value="choice">{{(choice[mainField]==='请选择'&&field.disabled)?'':choice[mainField]}} <span v-if="idShow&&choice[id]">({{choice[id]}})</span></option>
      </select>
    </div>
	</div>
</template>
<script>
  import {dataSource} from 'vpModule/api/form/list'
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
        row:'row'+this.field.line_row,  //控制一行显示几列
        fieldVal:[],
        defaultData:{},
        choiceData:[],
        idShow:false,
        id:'',          //主键
        mainField:'',   //主子段
        parentId:'',
        fieldVal:[],
      }
    },
    created(){
      this.initData();
    },
    methods:{
      initData(){
        var _this = this;
        //初始化key
        this.field.ref_cfg.datasource_fields.forEach(item =>{
          if(item.field_type == 'MainField'){
            this.mainField = item.field_key;
          }else if(item.field_type == 'ParentId'){
            this.parentId = item.field_key;
          }else if(item.field_type ==="Id"){
            this.id = item.field_key;
            this.idShow = false;
          }else if(item.field_type ==="IdShow"){
            this.id = item.field_key;
            this.idShow = true;
          }
        })
        //初始化请选择数据
        this.defaultData = {}
        this.field.ref_cfg.datasource_dict.forEach(item =>{
          this.defaultData[item] = '';
        })
        this.defaultData[this.mainField] = '请选择'
          for(let i=0;i<this.field.cascadeLevel;i++){
            this.choiceData[i] = [];
            this.choiceData[i].push(this.defaultData);
            this.fieldVal[i] = this.field.value&&this.field.value[i]?JSON.parse(this.field.value[i]):this.defaultData;
            if(i>0&&this.fieldVal[i][this.parentId]){
              this.getData(this.fieldVal[i][this.parentId],(res)=>{
                _this.$set( _this.choiceData,i, _this.choiceData[i].concat(res))
              })
            }
          }
        //第一级下拉框的数据是props的data
        this.choiceData[0].push(...this.data);

      },
//      resetData(data,index){
//        for(let i=index;i<this.field.cascadeLevel;i++){
//          this.choiceData[i]= [this.defaultData]
//        }
//        this.choiceData[index] = data;
//        this.choiceData[index].unshift(this.defaultData)
//      },
      getData(keyword,callback){
        var _this = this;
        var url = this.field.ref_url+`&wxUserId=${dataBase.config.wxUserId}&corpId=${wxqyhConfig.orgConfigInfo.corpId}&id=${this.field._id}&page=1&pageSize=50&keywordType=parentid&keyword=${keyword}`;
        dataSource({url}).then(res =>{
          callback(res);
        })
      },
      setValue(index){
        var value = this.fieldVal
        var _this =this;
        if(this.fieldVal[index-1][this.mainField]=='请选择'&&!this.fieldVal[index-1][this.id]){  //取消当前下拉框的选择时
          refChoiceData(index,[])
          if(index==1){
            this.$emit('sourceData',undefined)
          }else{
            this.$emit('sourceData',this.field.value.slice(0,index-1))
          }
        }else{
          if(index == this.field.cascadeLevel){  //最后一个下拉框
            var d = [];
            this.fieldVal.forEach(item =>{
              d.push(JSON.stringify(item))
            })
            this.$emit('sourceData',d)
          }else{
            this.getData(value[index-1][this.id],res=>{
              refChoiceData(index,res)
              var c = _this.fieldVal.slice(0,index),d = [];
              c.forEach(item =>{
                d.push(JSON.stringify(item))
              })
              _this.$emit('sourceData',d)
            })
          };
        };

        //重新渲染choiceData
        function refChoiceData (index,res) {
          var a = _this.fieldVal.slice(0,index);
          var b = _this.choiceData.slice(0,index);
          for(let i=index;i<_this.field.cascadeLevel;i++){
            a.push(_this.defaultData);
            b.push([_this.defaultData]);
          }
          _this.fieldVal = a;
          b[index].push(...res)
          _this.choiceData = b;
        }
      }
    }
	}
</script>
<style scoped>
  /*单选多选样式*/
  .drop-field.row1 {
    width: 100%;
  }
  .drop-field.row2 {
    width: 50%;
  }
  .drop-field.row3 {
    width: 33%;
  }
  select {
    background: #fff;
  }
</style>

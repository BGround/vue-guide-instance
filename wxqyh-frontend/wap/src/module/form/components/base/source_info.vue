<template>
  <div class="qwui-crm-mask" @click="close">
    <div class="crm-info-wrapper" @click.stop>
      <div class="title">{{showSource[MainFieldKey]}}</div>
      <div class="content">
        <p v-if="idShow">{{IdShowName}}：{{showSource[IdShowKey]}}</p>
        <p v-for="field in ShowField">{{field.field_name}}：{{showSource[field.field_key]}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      'field':{
        type:Array,
        required:true,
      },
      'showSource':{
        type:Object,
        required:true,
      }
    },
    data() {
      return {
        MainFieldKey: '',  // 主字段key
        IdShowKey: '',     // 主键key
        IdShowName: '',    // 主键名称
        ShowField:[],      // 显示字段
        idShow: false,     // 主键是否显示
      }
    },
    created(){
      this.getKeys();
    },
    methods: {
      // 获取主键、主字段、显示字段的key值
      getKeys() {
        var _this =this;
        this.field.forEach((item) => {
          if (item.field_type == 'MainField'){//主字段
            _this.MainFieldKey = item.field_key;
          } else if(item.field_type == 'ShowField'){//显示字段
            _this.ShowField.push(item);
          }else if (item.field_type == 'IdShow' || item.field_type == 'Id'){//主键
            _this.IdShowKey = item.field_key;
            _this.IdShowName = item.field_name;
            if (item.field_type == 'IdShow') {
              _this.idShow = true;
            }
          }
        })
      },
      close() {
        this.$emit('closeSource');
      },
    },
  }
</script>

<style scoped>
  .qwui-crm-mask {
    position: fixed;
    z-index:12;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  .crm-info-wrapper {
    position: absolute;
    z-index:15;
    top: 50%;
    left: 20px;
    right: 20px;
    padding: 10px;
    background:#fff;
    border-radius: 5px;
    opacity: 1;
    -webkit-transform: translateY( -50%);
    transform: translateY(-50%);
    word-break: break-all;
  }
  .crm-info-wrapper .title {
    min-height: 27px;
    line-height:27px;
    font-size: 15px;
    border-bottom: 1px solid #e5e5e5;
  }
  .crm-info-wrapper .content {
    margin-top: 10px;
    font-size: 14px;
  }
  .crm-info-wrapper .content {
    margin-bottom: 10px;
    line-height: 1.5;
  }
</style>

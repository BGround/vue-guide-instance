<template>
  <div class="qwui-field_wrap">
    <div class="qwui-custom_title">
      列表显示字段
    </div>
    <div class="qwui-custom_list">
      <label class="qwui-custom_label" v-for="(item,index) in customFieldList" :key="index" @click.prevent="select(item)">
        <input type="checkbox" class="qwui-custom_checkbox" :disabled="item.isDisabled" :checked="item.isChecked">
        <span class="qwui-custom_span">{{item.text}}</span>
      </label>
    </div>
    <div class="qwui-click_btn">
      <label class="qwui-click_sel_all" @click.prevent="selectAll">
        <input type="checkbox" class="qwui-custom_checkbox" :checked="isSelectAll">
        <span class="qwui-custom_span">全选</span>
      </label>
      <span class="qwui-btn qwui-cancel_btn" @click="cancel">取消</span>
      <span class="qwui-btn qwui-sure_btn" @click="sure()">确定</span>
    </div>
  </div>
</template>

<script>
  export default {
    props:{
      customFieldList:{
        type:Array,
      }
    },
    data(){
      return{
        isSelectAll:false,
        keyList:[],
      }
    },
    watch:{
      customFieldList(){
        this.selectAllJudge();
      }
    },
    methods:{
      cancel(){
        this.$emit('cancel');
      },
      sure(){
        let self = this;
        self.keyList = [];
        this.customFieldList.forEach((item,index)=>{
          item.isChecked ? self.keyList.push(item.key) : '';
        });
        this.$emit('sure',this.keyList);
      },
      selectAll(){
        this.isSelectAll = !this.isSelectAll;
        if(this.isSelectAll){
          this.customFieldList.forEach((item,index)=>{
            item.isDisabled ? '' : item.isChecked = true;
          });
        }else{
          this.customFieldList.forEach((item,index)=>{
            item.isDisabled ? '' : item.isChecked = false;
          });
        }
      },
      select(item){
        if(item.isDisabled){
          return;
        }
        item.isChecked = !item.isChecked;
        this.selectAllJudge();
      },
      selectAllJudge(){
        let len = this.customFieldList.length;
        for(let i = 0; i < len; i++){
          if(this.customFieldList[i].isChecked){
            this.isSelectAll = true;
          }else{
            this.isSelectAll = false;
            break;
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @mixin span-align{
    display: inline-block;
    height: 16px;
    line-height: 16px;
    vertical-align: middle;
  }
  @mixin checkbox-align{
    @include span-align;
    margin: 0 4px 0 10px;
    width: 16px;
  }
  @mixin label-style{
    display: block;
    line-height: 30px;
    cursor: pointer;
  }

  .qwui-field_wrap{
    position:absolute;
    top: 0;
    left: 0;
    background: #fff;
    padding-top: 15px;
    width: 216px;
    box-shadow: -1px 4px 4px 1px #ddd;
    border: 1px solid #b7b7b7;
    border-radius: 5px;
    z-index: 10;
    user-select: none;
    .qwui-custom_title{
      padding: 0 0 10px 8px;
      font-size: 15px;
      color: #333;
    }
    .qwui-custom_list{
      height: 245px;
      overflow-y: auto;
      overflow-x: hidden;
      .qwui-custom_label{
        @include label-style;
        .qwui-custom_checkbox{
          @include checkbox-align;
        }
        .qwui-custom_span{
          @include span-align;
        }
      }
    }
    .qwui-click_btn{
      height: 35px;
      line-height: 32px;
      background: #eee;
      border-top: 1px solid #ccc;
      border-radius: 0 0 6px 6px;
      .qwui-click_sel_all{
        @include label-style;
        display: inline-block;
        margin-right: 15px;
        .qwui-custom_checkbox{
          @include checkbox-align;
        }
        .qwui-custom_span{
          @include span-align;
        }
      }
      .qwui-btn{
        display: inline-block;
        line-height: 26px;
        height: 26px;
        vertical-align: middle;
        width: 50px;
        text-align: center;
        background: #C31725;
        color: #fff;
        margin-right: 10px;
        border: 1px solid #e2750a;
        border-radius: 4px;
        cursor: pointer;
        &.qwui-cancel_btn{
          background: #fff;
          color: #666;
          border: 1px solid #ccc;
        }
      }
    }
  }
</style>

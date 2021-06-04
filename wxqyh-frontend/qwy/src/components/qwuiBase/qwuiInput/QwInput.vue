<!--
    @param inputType(默认text)：输入框类型 text(文本)|sort(排序号)|textarea(文本)|forbidden(禁止)|search(搜索)|tree(树形选择控件搜索)
    @param maxLength(默认100)：输入框最大输入长度
    @param isMust(默认false)：是否必填
    @param inputTips(默认'')：输入框placeholder
    @param input：输入框input事件回调方法
    @param focus：输入框focus事件回调方法
    @param blur：输入框blur事件回调方法
    @param search：搜索按钮回调函数
    @param defaultVal(默认''): 输入框默认值
    @param isWarning(只作用与input框,默认false): 是否警告
    @param warningTips(默认''): 警告内容
    @param isFocus(默认false): 是否聚焦到输入框

    用法：
    0、基本输入框：仅包含了样式，没有其他业务逻辑
    <parent>
        <qwui-input inputType="base" @input='changeInput' :isFocus="isFocus"></qwui-input>
    </parent>
    1、文本框
    <parent>
        <qwui-input inputType="textarea" @input='changeInput' :isFocus="isFocus"></qwui-input>
    </parent>
    2、普通输入框
    <parent>
        <qwui-input inputType="text" @input='changeInput' :isWarning="isWarning" warningTips="标题不能为空"></qwui-input>
    </parent>
    3、排序输入框框
    <parent>
        <qwui-input inputType="sort" @input='changeInput' defaultVal="0"></qwui-input>
    </parent>
    4、禁止输入框
    <parent>
        <qwui-input inputType="forbidden" @input='changeInput'></qwui-input>
    </parent>
    5、搜索输入框
    <parent>
        <qwui-input inputType="search" @search='changeInput'></qwui-input>
    </parent>
    6、树选择器输入框
    <parent>
        <qwui-input inputType="tree" @input='changeInput'></qwui-input>
    </parent>
-->
<template>
    <div class="relative">
        <div class="input_wrap" v-if="inputType != 'textarea'">
            <input
                :type="inputType == 'sort'? 'number' : 'text'"
                :maxlength="maxLength"
                :placeholder="inputTips"
                v-model="currentValue"
                min="0"
                :disabled="inputType == 'forbidden'"
                :class="[{qw_input: true}, inputStyle, {redBorder: isWarning}]"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @keyup.enter="handleSearch"
                ref="inputNode"
            >
            <div class="search_btn" v-if="inputType == 'search'" @click="handleSearch"></div>
            <span class="input_tips" v-show="showTips">{{inputNum}}/{{maxLength}}</span>
        </div>
        <div class="textarea_wrap" v-else>
            <textarea class="qw_textarea" :maxlength="maxLength" :placeholder="inputTips" v-model="currentValue"
            @input="handleInput" @focus="handleFocus" @blur="handleBlur" ref="textareaNode"></textarea>
            <span class="textarea_tips">{{inputNum}}/{{maxLength}}</span>
        </div>
        <p class="warningTips" v-show="isWarning">{{warningTips}}</p>
    </div>
</template>
<script>
  import emitter from '@/assets/js/mixins/emitter.js';

export default {
    name: 'qwui-input',
    mixins: [emitter],
    data(){
        return {
            inputNum: 0,  // 字数
            inputText: '',  // 输入框内容
            showTips: false,  // 是否显示字数提示
            inputStyle: '',  // 输入框样式
            currentValue:'',
        }
    },
    props: {
        validateEvent: {
          type: Boolean,
          default: true
        },
        inputType: {
            type: String,
            default: 'text'
        },
        maxLength: {
            type: Number,
            default: 100
        },
        isMust: {
            type: Boolean,
            default: false
        },
        inputTips: {
            type: String,
            default: ''
        },
        defaultVal: {
            type: [String, Number],
            default: ''
        },
        isWarning: {
            type: Boolean,
            default: false
        },
        warningTips: {
            type: String,
            default: ''
        },
        isFocus: {
            type: Boolean,
            default: false
        },
        value: {
            type: [String, Boolean, Number],
            default:'',
        }
    },
    watch: {
        // // 输入内容改变字数随之改变
         value(newVal, oldVal){
             this.currentValue = newVal;
             let num = newVal.length;
             this.inputNum = num;
         },

        // 是否聚焦
        isFocus(newVal, oldVal){
            if(newVal){
                if(this.inputType != 'textarea'){
                    this.$refs.inputNode.focus();
                }
                else{
                    this.$refs.textareaNode.focus();
                }
            }
        }
    },
    methods: {
        // 输入框input事件
        handleInput(e){
            let num = this.currentValue.length;
            this.inputNum = num;
            this.$emit('input', this.currentValue);
        },

        // 输入框focus事件
        handleFocus(e){
            this.$emit('focus', e.target.value);
        },

        // 输入框blur事件
        handleBlur(e){
            this.$emit('blur', e.target.value);
            if (this.validateEvent) {
              this.dispatch('QwFormItem', 'qw.form.blur', [this.currentValue]);
            }
        },

        // 搜索回调函数
        handleSearch(){
            this.$emit('search',this.currentValue);
        },

        // 当有输入框带有默认值时 需要更新输入框字数限制的 已输入
        initInputLength(){
            this.inputNum = this.currentValue.length;
        }
    },
    created(){
        // 输入框样式根据类型变化
        switch (this.inputType){
            case 'base':
                this.inputStyle = 'qw_baseInput';
                break;
            case 'text':
                this.inputStyle = 'qw_textInput';
                this.showTips = true;
                break;
            case 'sort':
                this.inputStyle = 'qw_sortInput';
                break;
            case 'forbidden':
                this.inputStyle = 'qw_banInput';
                this.showTips = true;
                break;
            case 'search':
                this.inputStyle = 'qw_searchInput';
                break;
            case 'tree':
                this.inputStyle = 'qw_treeInput';
                break;
        }
        this.inputText = this.defaultVal;
    },
    mounted(){
      this.initInputLength();
    }
}
</script>
<style lang="scss" scoped>
  @import '@/assets/scss/base.scss';

  @mixin highlight{
    transition: border linear 0.2s, box-shadow linear 0.2s;
    &:focus{
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 8px rgba(82, 168, 236, 0.6);
      border-color: rgba(82, 168, 236, 0.8);
    }
  }

  .qwui-form_item.is-error .qw_input,.qwui-form_item.is-error .qw_textarea{
    border-color: #f56c6c;
    &:focus{
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 8px rgba(245, 108, 108, 0.6);
      border-color: #f56c6c;
    }
  }

  .qw_input, .qw_textarea{
    color: #333;
    border-radius: 2px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    appearance: none;
    @include highlight;
  }

  .input_wrap{
    position: relative;
    display: flex;
    font-size: 0;
    .qw_input{
      font-size: 14px;
      height: 32px;
    }
    .qw_baseInput{
      padding: 0 10px 0 10px;
      width: 340px;
    }
    .qw_textInput{
      padding: 0 72px 0 10px;
      width: 100%;
    }
    .qw_sortInput{
      padding: 6px 4px;
      width: 100%;
    }
    .qw_banInput{
      padding: 0 60px 0 10px;
      width: 300px;
      color: #999;
      background: #eee;
      cursor: not-allowed;
    }
    .qw_searchInput{
      padding: 10px 7px;
      width: 170px;
      border-radius: 0;
    }
    .search_btn{
      width: 32px;
      height: 32px;
      border: 1px solid #ccc;
      border-left: none;
      background: url(../../../assets/images/search_icon.png) no-repeat center;
      box-sizing: border-box;
      cursor: pointer;
    }
    .qw_treeInput{
      padding: 8px 10px;
      width: 180px;
      height: 28px;
    }
    .input_tips{
      position: absolute;
      top: 0;
      right: 8px;
      line-height: 32px;
      font-size: 12px;
      color: #999;
      text-align: right;
    }
  }

  .textarea_wrap{
    position: relative;
    display: flex;
    font-size: 0;
    .qw_textarea{
      padding: 6px 4px;
      width: 100%;
      height: 120px;
      font-family: 'Microsoft Yahei','simsun','arial','tahoma';
      font-size: 14px;
    }
    .textarea_tips{
      position: absolute;
      bottom: 5px;
      right: 10px;
      font-size: 12px;
      color: #999;
      text-align: right;
    }
  }

  .redBorder{
    border: 1px solid #F56262;
  }

  .warningTips{
    width: 340px;
    color: #F56262;
  }
</style>



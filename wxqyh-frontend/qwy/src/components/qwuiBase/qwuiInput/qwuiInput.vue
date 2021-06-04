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
    7、只读输入框
    <parent>
        <qwui-input inputType="readonly" @input='changeInput'></qwui-input>
    </parent>
-->
<template>
    <div class="inlineBlock">
        <div class="input_wrap" v-if="inputType != 'textarea'">
            <input
                :type="inputType == 'sort'? 'number' : 'text'"
                :maxlength="maxLength"
                :placeholder="inputTips"
                :value="value"
                min="0"
                :disabled="inputType == 'forbidden' || disabled"
                :readonly="inputType == 'readonly'"
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
            <textarea class="qw_textarea" :maxlength="maxLength" :placeholder="inputTips" :value="value"
            @input="handleInput" @focus="handleFocus" @blur="handleBlur" ref="textareaNode"></textarea>
            <span class="textarea_tips">{{inputNum}}/{{maxLength}}</span>
        </div>
        <p class="warningTips" v-show="isWarning">{{warningTips}}</p>
    </div>
</template>
<script>
export default {
    name: 'qwui-input',
    data(){
        return {
            inputNum: 0,  // 字数
            inputText: '',  // 输入框内容
            showTips: false,  // 是否显示字数提示
            inputStyle: ''  // 输入框样式
        }
    },
    props: {
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
        },
        disabled: {
            type: Boolean,
            default:false
        },
        readonly: {
          type: Boolean,
          default: false
        },
    },
    watch: {
        // 输入内容改变字数随之改变
        value(newVal, oldVal){
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
            let num = e.target.value.length;
            this.inputNum = num;
            this.$emit('input', e.target.value);
        },

        // 输入框focus事件
        handleFocus(e){
            this.$emit('focus', e.target.value);
        },

        // 输入框blur事件
        handleBlur(e){
            this.$emit('blur', e.target.value);
        },

        // 搜索回调函数
        handleSearch(){
            this.$emit('search',this.value);
        },

        // 当有输入框带有默认值时 需要更新输入框字数限制的 已输入
        initInputLength(){
            this.inputNum = this.value.length;
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
            case 'readonly':
              this.inputStyle = 'qw_readOnlyInput';
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
  @import './qwuiInput.scss';
</style>



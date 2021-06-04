<!--
    @param type(默认default)：
        按钮类型 ：primary(白色按钮)| danger (红色警告按钮) |text(纯文本型按钮)|text-primary(纯文本型按钮橙色)|
        large-solid-round(大的实心的圆角按钮)|large-plain-round(大的空心的圆角按钮)|
        medium-plain-round(中等的空心圆角按钮) 
    @param size(默认normal)：按钮大小，large|(大),normal|(正常),small|(小)
    @param buttonType(默认button)：普通按钮
    @param disabled(默认false)：按钮是否禁用
    @param plain(默认false)：按钮是否空心
    @param click：点击按钮click事件回调方法

    示例：<qwui-button type='primary' size='large' disabled plain  @click='setUp'>开设必学课</qwui-button>
    
    1.基本按钮:
    <qwui-button>取消</qwui-button>
    <qwui-button disabled>不可点击</qwui-button>
    2.橙色按钮：
    <qwui-button type='primary'>四个文字</qwui-button>
    3.镂空按钮：
    <qwui-button plain>四个文字</qwui-button>
    4.大小按钮：
    <qwui-button type='primary' size='large'>开设必学课</qwui-button>
    5.文字按钮：
    <qwui-button type='text-primary'>普通文字状态</qwui-button>
    6.特殊按钮：
    <qwui-button type='large-solid-round' @click='setUp'>免费安装</qwui-button>
    <qwui-button type='large-plain-round' plain>+ 创建分组和固定流程</qwui-button>
-->
<template>
  <button class='qwui-button' :type='buttonType' @click='handleClick' :class="[
    'qwui-button-'+type,
    'qwui-button-'+size,
    {
      'is-disabled':disabled,
      'is-plain':plain
    }]" :disabled='disabled'>
    <span>
      <slot></slot>
    </span>
  </button>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'qwuiButton',
    props: {
      type: {
        type: String,
        default: 'default'
      },
      size: {
        type: String,
        default: 'normal'
      },
      buttonType: {
        type: String,
        default: 'button'
      },
      disabled: Boolean, //按钮是否禁用
      plain: Boolean, //按钮是否空心
    },
    methods: {
      // 点击按钮click事件
      handleClick(e) {
        this.$emit('click', e);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './qwuiButton.scss';
</style>

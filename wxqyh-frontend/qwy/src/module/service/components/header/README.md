## Cell 单元格

### 使用指南
``` javascript
  import {
  ButtonBtn,
  ButtonGroup
  } from '@/components/base/button'
```

### 代码演示

#### 基础用法

将`button-group`组件看成一个容器即可

```html
  <button-group >
    <button-btn type="default" text="保存为草稿" @buttonClick="cancelSelected"></button-btn>
    <button-btn type="primary" text="立即提交" @buttonClick="confirmSelected"></button-btn>
  </button-group>
```


### ButtonGroup API

| 参数 | 说明 | 类型 | 默认值 |
|-----------|-----------|-----------|-------------|
|  fixed  | 按钮相对定位还是fixed定位，默认 false,相对定位 |  `Boolean`|  `false`  |

### ButtonBtn API

| 参数 | 说明 | 类型 | 默认值 |
|-----------|-----------|-----------|-------------|
| type | 按钮类型，default、primary两种 | `String` | - |
|  text |  按钮文本   | `String` | - |
| icon | 左侧图标，可选值见 Icon 组件 | `String` |
| title | 左侧标题 | `String | Number` |
| value | 右侧内容 | `String | Number` |
| label | 标题下方的描述信息 | `String` | - |
| border | 是否显示内边框 | `Boolean` | `true` |
| center | 是否使内容垂直居中 | `Boolean` | `false` |
| url | 跳转链接 | `String` | - |
| to | 路由跳转对象，同 `vue-router` 的 to | `String | Object` |
| replace | 跳转时是否替换当前 history | `String` | `false` |
| clickable | 是否开启点击反馈 | `Boolean` | `false` |
| is-link | 是否展示右侧箭头并开启点击反馈 | `Boolean` | `false` |
| required | 是否显示表单必填星号 | `Boolean` | `false` |
| arrow-direction | 箭头方向，可选值为 `left` `up` `down` | `String` |

###  Event

| 事件名 | 说明 | 参数 |
|-----------|-----------|-----------|
| click | 点击 cell 时触发 | - |

###  Slot

| 名称 | 说明 |
|-----------|-----------|
| - | 自定义显示内容 |
| icon | 自定义`icon` |
| title | 自定义`title` |
| right-icon | 自定义右侧按钮，默认是`arrow` |

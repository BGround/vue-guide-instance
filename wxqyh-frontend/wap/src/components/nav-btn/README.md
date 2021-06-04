## NavBtn 底部导航栏中间按钮

### 使用指南
``` javascript
  import NavBtn from '@/components/nav-btn';
```

### 代码演示

#### 基础用法

``` javascript
      <nav-btn @click="navIconClick"></nav-btn>
```

#### 自定义图标

```
      <nav-btn icon="iconfont icon-peixunxuexi_shijian" 
      @click="navIconClick"
      >
      </nav-btn>

```


### API

| 参数 | 说明 | 类型 | 默认值 |
|-----------|-----------|-----------|-------------|
| icon	 | 图标类名 | 	`String` | 	`true`  |
| url	| 跳转链接	| String  | -	|
| to	| 路由跳转对象，同 vue-router 的 to	| String | Object	| -	| =
| replace	| 跳转时是否替换当前 history	| String| | 	false |


###  Event

| 事件名 | 说明 | 参数 |
|-----------|-----------|-----------|
|  click | 点击按钮触发	 | event: 当前的点击元素  |

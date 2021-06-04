## Nav 底部导航栏

### 使用指南
``` javascript
  import NavGroup from '@/components/nav-group';
  import NavItem from '@/components/nav-item';
```

### 代码演示

#### 基础用法

``` javascript
    <nav-group
      v-model="active"
      @change="navChange"
    >
      <nav-item icon="iconfont icon-renwufenpai-daichuli">待处理</nav-item>
      <nav-item icon="iconfont icon-shenpiqingshi_wode" @click="navClick">我的</nav-item>
    </nav-group>
```

#### 自定义图标

```
    <nav-group
      v-model="active2"
      @change="navChange"
    >
      <nav-item>
        <i class="qwui-icon iconfont icon-peixunxuexi_shijian" slot="icon"></i>
        会议
      </nav-item>
      <nav-item icon="iconfont icon-shenpiqingshi_wode">我的</nav-item>
    </nav-group>
```

#### 红点、信息提示
```
    <nav-group
      v-model="active"
      @change="navChange"
    >
      <nav-item
        icon="iconfont icon-renwufenpai-daichuli"
        dot
      >待处理</nav-item>
      <nav-item
        info="20"
        icon="iconfont icon-shenpiqingshi_wode"
      >
        我的</nav-item>
    </nav-group>
```


### NavGroup API

| 参数 | 说明 | 类型 | 默认值 |
|-----------|-----------|-----------|-------------|
| fixed	 | 是否固定在页面底部 | 	`Boolean` | 	`true`  |
| value	 | 当前选中导航的索引 | 	`Number`	 | `-` |


###  Event

| 事件名 | 说明 | 参数 |
|-----------|-----------|-----------|
|  change | 点击导航时后索引发生变化触发	 | value: 当前选中导航的索引  |

###  Slot

| 名称 | 说明 |
|-----------|-----------|
|  `-` | 中间自定义插槽 |


### NavItem API

| 参数 | 说明 | 类型 | 默认值 |
|-----------|-----------|-----------|-------------|
| icon	 | 图标类名 | 	`String` | 	`true`  |
| info	 | 图标右上角提示信息值 | 	`String、Number`	 | `-` |
| maxLimit	| 限制最大值显示方法	| `Function` |  `info > 99? '99+' : info` |
| dot	 | 	是否显示小红点 | 	`Number`	 | `-` |
| url	| 跳转链接	| `String`  | -	|
| to	| 路由跳转对象，同 vue-router 的 to	| `String、Object`	| -	|
| replace	| 跳转时是否替换当前 history,默认是push	| `Boolean`|	false |


###  Event

| 事件名 | 说明 | 参数 |
|-----------|-----------|-----------|
|  click | 点击导航时触发	 | event: 当前的点击元素  |

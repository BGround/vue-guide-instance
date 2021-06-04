## 轮播图组件

#### 一、父组件Carousel

1. ###### 描述

  轮播图父组件，轮播图逻辑主要部分，管理整个轮播图

2. ###### 路径

  `@/components/carousel/index.vue`

3. ###### 参数

  - interval
    - 描述：轮播时间（毫秒）
    - 类型：Number
    - 默认值：5000

4. ###### 事件

  - update-index
    - 描述：当前轮播图index发生改变
    - 参数
      - index: Number, 改变后的轮播图index

5. ###### 插槽

  - default：图片Item

6. ###### 注意事项

  - 组件必须设定有宽高（包含padding）
  - 插槽内至少有一个图片Item
  - 插槽的图片Item可自定义，也可使用下面提供的图片Item


#### 二、图片Item

1. ###### 描述

  默认的图片Item

2. ###### 路径

  `@/components/carousel/item.vue`

3. ###### 参数

  - cover
    - 描述：图片路径
    - 类型：String
    - 必要

  - title
    - 描述：图片描述
    - 类型：String
    - 默认值：空字符串
    - 特殊情况：当title为空字符串时，不显示title

4. ###### 事件

  - item-click
    - 描述：图片Item被点击
    - 参数：无

5. ###### 注意事项

  - 请勿绑定原生click事件，该组件的事件处理使用了vue-touch
  - 自定义图片Item时，请尽量实现参数和事件
  - 自定义图片Item时，请务必将根元素的宽高都设为100%


#### 三、调用例子

1. ###### 调用代码

  ```
  <qw-carousel class='qwui-carousel'
    @update-index="updateIndex"
  >
    <qw-carousel-item
      v-for="(item, index) in carousel"
      :key="item.id"
      :cover="item.cover"
      :title="item.title"
      @item-click="toDetail(index)"
    ></qw-carousel-item>
  </qw-carousel>
  ```

2. ###### 示例文件

  `@/module/partyconstruction/login.vue`

#### 四、问题发现

1. 联系人：黎国本

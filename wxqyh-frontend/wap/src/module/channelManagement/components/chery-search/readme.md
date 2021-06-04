
##经销商(部门)搜索组件

```javascript
import cherySearch from '@/module/channelManagement/components/chery-search';
```

```html
 <cherySearch
              :departmentName="departmentName"
              v-model="keyword"
              placeholder="搜索经销商名称、ERP号"
              type="dealer"
              @select="handleSelect"
              @change="handleChange">
      </cherySearch>    
```

##Events

|   事件名  | 说明  | 参数 |
|  ------  | ------  | ------  |
| select  | 选择经销商 | 经销商数据  |
| change  | keyword改变 | keyword值  |


##Props

|   参数    | 说明    | 默认     |
|  ------  | ------  | ------  |
| departmentName  | 地理位置(部门名称) | 全国  |
| v-model / value  | keyword值 | 空  |
| placeholder  | placeholder提示 | 搜索经销商名称、ERP号  |
| type  | type值是city时,默认打开搜索城市面板 | dealer  |

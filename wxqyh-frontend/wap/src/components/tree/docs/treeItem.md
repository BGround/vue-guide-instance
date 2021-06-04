# [示例1](http://localhost:8089/vp/module/demo.html#/treeItem)
# [示例2](http://localhost:8089/vp/module/demo.html#/treeList2)
# [示例3](http://localhost:8089/vp/module/demo.html#/treeList)

```vue
<div>
  <qw-return-back
    v-show="prevParentId.length"
    @returnBack="returnBack"
  >
  </qw-return-back>
  <qw-tree-item
    v-show="treeListShow"
    v-model="selectValue"
    :options="options"
    :config="config"
    :items.sync="currentSelected"
    @clickTreeItem="clickTreeItem"
    @showNextItem="showNextItem"
  >
  </qw-tree-item>
  <qw-tree-button
    @cancelSelected="cancelSelected"
    @confirmSelected="confirmSelected"
    @showSelectedItem="showSelectedItem"
    :subTitle="selectName"
  >
  </qw-tree-button>
</div>

<script>
  import {getData} from 'api'       // 自定义请求数据的接口
  
  import QwTreeItem from '@/components/tree/treeItem'
  import QwTreeButton from '@/components/tree/treeButton'
  import QwReturnBack from '@/components/tree/treeReturnBack'
  
  export default {
      name: "QwTreeList",
      components: {
        QwTreeItem,
        QwTreeButton,
        QwReturnBack
      },
      data() {
        return {
          treeListShow: true,        // 显示列表
        }
      },
      computed:{
        ...mapState({
          config: state => state.tree.config,                        // 配置
          options: state => state.tree.options,                      // 列表数据
          renderData: state => state.tree.renderData,                // { '父级ID': [子级数据] }
          currentParentId: state => state.tree.currentParentId,      // 当前列表的父Id
          prevParentId: state => state.tree.prevParentId,            // 上一级的父Id。每点击下一级，则push “当前列表的父Id”。每返回上一级，则pop最后一个元素
        }),
        ...mapGetters([
          'selectName',     // 当前获取的数据个数
        ]),
        // 当前已选的数据的Id
        selectValue: {
          get() {
            return this.$store.state.tree.selectValue
          },
          set(value) {
            this.updateSelectValue(value)
          }
        },
        // 当前选择的数据
        currentSelected: {
          get() {
            return this.$store.state.tree.currentSelected;
          },
          set(value) {
            this.updateCurrentSelected(value)
          }
        },
      },
      methods: {
        ...mapMutations([
          'changeConfig',
          'updateSelectValue',
          'handleGetData',
          'handleRenderData',
          'handlePrevParentId',
          'handleGetNextItem',
          'handleCancelSelected',
          'updateCurrentSelected',
          'handleReturnBack',
          'resetTreeConfigData',
        ]),
        // 显示下一级数据
        showNextItem(option) {
          // 点击下一级前修改
          this.handlePrevParentId()
          // 请求下一级数据后
          getData().then(result => {
            // 【必要的】
            this.handleGetNextItem({result, option})
          })
        },
        // 返回上一级
        returnBack() {
          this.handleReturnBack({'isResetData':false})
        },
        //取消
        cancelSelected() {
          this.handleCancelSelected()
          this.treeListShow=false
        },
        // 点击“确定”，求出已选择的数据
        confirmSelected() {
          this.treeListShow=false
        },
        // 查看已选择的数据
        showSelectedItem() {
            console.log('查看已选择的数据')
        },
        // 点击列表
        clickTreeItem(payload) {
            console.log('当前点击的数据',payload)
        },
      },
      created() {
         // 获取当前列表数据
        getData().then(result=>{
          // 有数据时，显示列表
          if(result.length>0) {
            this.treeListShow = true
          }
          // 【必要的】
          this.handleGetData(result)
        })  
      },
  }
</script>
```

# API
| 参数 | 说明 | 类型 | 默认值 |
|------|-----|------|-------|
| options | 选项 | Array | 必填 |
| config | 数据配置 | Object | 必填 |
| items | 当前选择的数据 | Array | 必填 |

## config 
* `config` 对应 `options` 的每一项数据的`key`

| 参数 | 说明 | 类型 | 默认值 |
|------|-----|------|-------|
| id | id 的 key | String | 必填 |
| parentId | 父id | String | 非必填 |
| title | 标题 | String | 非必填 |
| subTitle | 副标题 | String | 非必填 |
| headPic | options的头像的key | String | 非必填 |
| defaultHeadPic | 要显示头像，但是接口没有返回，配置默认头像。参考示例1。<br> 子组件默认有 'user'：人员默认头像，'dept':部门默认头像，其它:配置头像地址 | String | 非必填 |
| checkType | 选框类型 <br> 'checkbox':复选框 <br>'radio':单选框  | String | 非必填 |
| hasChildren | options 里是否有下一级的 key | String | 非必填 |
| arrow | 箭头显示 <br> true:都显示 <br> false:都不显示 | Boolean | 非必填 |
| onlyChildCheck | true： 有子级时，不显示选框，父级不可选。 <br> 不做这样的限制时，不必配置 | Boolean | 非必填 |
| onlyParentCheck | true： 有子级时，才显示选框，父级可选。 <br> 不做这样的限制时，不必配置 | Boolean | 非必填 |

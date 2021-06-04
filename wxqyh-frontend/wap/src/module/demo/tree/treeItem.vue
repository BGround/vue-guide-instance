<template>
  <div>
    <p>demo1</p>
    <p>需要显示头像，头像从接口获取，配置头像 headPic</p>
    <p>没有，则配置默认头像 defaultHeadPic</p>
    <p>有子级才显示箭头配置 hasChildren</p>

    <qw-tree-item
      v-model="selectValue"
      :options="options"
      :config="config"
      :items.sync="currentSelected"
    >
    </qw-tree-item>

    <p>demo2</p>
    <p>显示一致的头像 headPic，统一显示箭头</p>

    <qw-tree-item
      v-model="selectValue2"
      :options="options2"
      :config="config2"
      :items.sync="currentSelected2"
    >
    </qw-tree-item>

    <p>demo3</p>
    <p>不显示头像，不用配置headPic。不显示选框，不用配置checkType</p>

    <qw-tree-item
      :options="options3"
      :config="config3"
    >
    </qw-tree-item>

    <p>demo4</p>
    <p>有子级时，不显示选框，父级不可选，onlyChildCheck: true</p>

    <qw-tree-item
      v-model="selectValue4"
      :options="options4"
      :config="config4"
      :items.sync="currentSelected4"
    >
    </qw-tree-item>
  </div>
</template>

<script>
  const options = [
    {
      "ext2": "客户的吧",
      "childrenNum": 0,
      "id": "61cd92eb-8df1-4eb2-9e88-74c539a36854",
      "parentId": "0",
      "typeName": "李小璐",
      "img": "http://shp.qpic.cn/bizmp/QbftGT6bnUJEFYGicNTrmnkrnibAnZC6x72BuqgrzVFhFiaiasicw3clg6w/100"
    },
    {
      "ext2": "6666",
      "childrenNum": 1,
      "id": "61cd92eb-8df1-4eb2-9e88-74c539a36855",
      "parentId": "0",
      "typeName": "小明",
      "img": "http://p.qlogo.cn/bizmail/iavQ6eESia4JmwOThjGSNazibcfJqxrNCkBvOm4H7wUyW418mCibuaaKhw/100"
    },
    {
      "ext2": "",
      "childrenNum": 3,
      "id": "61cd92eb-8df1-4eb2-9e88-74c539a36856",
      "parentId": "0",
      "typeName": "撒旦",
      "img": ""
    }
  ]
  const options2 = [
    {
      "ext2": "客户的吧",
      "id": "61cd92eb-8df1-4eb2-9e88-74c539a36851",
      "parentId": "0",
      "typeName": "李小璐李小璐李小璐李小璐李小璐李小璐李小璐李小璐李小璐李小璐",
    },
    {
      "ext2": "6666",
      "id": "61cd92eb-8df1-4eb2-9e88-74c539a36852",
      "parentId": "0",
      "typeName": "小明",
    },
    {
      "ext2": "",
      "id": "61cd92eb-8df1-4eb2-9e88-74c539a36853",
      "parentId": "0",
      "typeName": "撒旦",
    }
  ]
  const options3 = [
    {
      "ext2": "客户的吧",
      "id": "61cd92eb-8df1-4eb2-9e88-74c539a36857",
      "parentId": "0",
      "typeName": "李小璐李小璐李小璐李小璐李小璐李小璐李小璐李小璐李小璐李小璐",
    },
    {
      "ext2": "6666",
      "id": "61cd92eb-8df1-4eb2-9e88-74c539a36858",
      "parentId": "0",
      "typeName": "小明",
    },
    {
      "ext2": "",
      "id": "61cd92eb-8df1-4eb2-9e88-74c539a36859",
      "parentId": "0",
      "typeName": "撒旦",
    }
  ]
  const options4 = [
    {
      "ext2": "客户的吧",
      "id": "61cd92eb-8df1-4eb2-9e88-74c539a36817",
      "parentId": "0",
      "childrenNum": 0,
      "typeName": "李小璐李小璐李小璐李小璐李小璐李小璐李小璐李小璐李小璐李小璐",
    },
    {
      "ext2": "6666",
      "id": "61cd92eb-8df1-4eb2-9e88-74c539a36828",
      "parentId": "0",
      "childrenNum": 5,
      "typeName": "小明",
    },
    {
      "ext2": "",
      "id": "61cd92eb-8df1-4eb2-9e88-74c539a36839",
      "parentId": "0",
      "childrenNum": 10,
      "typeName": "撒旦",
    }
  ]
  let config = {
    id:'id',
    parentId:'parentId',
    title:'typeName',
    subTitle:'ext2',
    headPic:'img',
    defaultHeadPic:'user',
    checkType:'checkbox',
    hasChildren:'childrenNum',
  }
  const config2 = {
    id:'id',
    parentId:'parentId',
    title:'typeName',
    subTitle:'ext2',
    headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/industry_type.png',
    checkType:'radio',
    arrow: true,
  }
  const config3 = {
    id:'id',
    parentId:'parentId',
    title:'typeName',
    subTitle:'ext2',
  }
  let config4 = {
    id:'id',
    parentId:'parentId',
    title:'typeName',
    subTitle:'ext2',
    checkType:'checkbox',
    hasChildren:'childrenNum',
    onlyChildCheck: true
  }
  import QwTreeItem from '@/components/tree/treeItem'
    export default {
      name: "tree-item",
      components: {
        QwTreeItem,
      },
      data() {
        return {
          options,
          config,
          currentSelected: [],
          selectValue: [],
          options2,
          config2,
          currentSelected2: [],
          selectValue2: [],
          config3,
          options3,
          config4,
          options4,
          currentSelected4: [],
          selectValue4: [],
        }
      }
    }
</script>

<style scoped>
p{
  margin: 10px;
}
</style>

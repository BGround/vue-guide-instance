<!--左边部分字段类型选择-->
<template>
  <transition name="fade">
  <div class="fieldTypeBox" id="fieldTypeBox">
    <div
      class="fieldTypeList"
      v-for="FieldType in FieldTypes"
    >
      <div
        class="fieldTypeItem"
        v-for="Field in FieldType.data"
        @click="selectType(Field.type)"
      >
          <span class="icon" :class="Field.icon" :style="{backgroundImage: 'url('+getImage(Field.icon)+')'}"></span>
          <span class="title">{{ Field.title }}</span>
      </div>
    </div>
    <button_group :fixed="true">
      <qwui_button type="default" text="取消" @buttonClick="cancel"></qwui_button>
    </button_group>
  </div>
  </transition>
</template>

<script>
  import FieldTypes from './data/DesignerType'
  import { qwui_button, button_group } from '@/components/base/button'
  import {FieldDataMap} from '../../components/designer/data/DesignerItem';
  import mixinUtils from './mixin/index'
  export default {
    name: "fieldTypeBox",
    components: {
      button_group,
      qwui_button
    },
    mixins: [mixinUtils],
    data() {
      return {
        FieldTypes,
      }
    },
    methods: {
      getImage(img) {
        return require('assets/svg/'+img+'.svg')
      },
      // 当前选中的字段类型
      selectType(type) {
        let data = FieldDataMap[type]()
        this.selectCurrentType({
          data,
          isEdit: false
        })
        this.$router.replace('/formdesign/setting')
      },
      cancel() {
        this.$router.go(-1)
      }
    },
    mounted() {
      this.$nextTick(()=>{
        document.getElementById('fieldTypeBox').scrollIntoView()
      })
    },
  }
</script>

<style lang="scss" scoped>
  @media screen and (min-width: 1024px) {
    .fieldTypeBox {
      width: 740px;
    }
  }
  .fieldTypeBox {
    min-height: 100vh;
    padding-bottom: 60px;
    box-sizing: border-box;
    background-color: #fff;
  }
  .fieldTypeList {
    display: flex;
    display: -webkit-flex;
    flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
  }
  .fieldTypeItem {
    flex: 1;
    min-width: 25%;
    max-width: 25%;
    margin-top: 16px;
    text-align: center;
    cursor: pointer;
    &:active {
      background-color: #F7F8FA;
    }
    .icon {
      display: inline-block;
      width: 28px;
      height: 28px;
      margin-top: 18px;
      background: no-repeat center center;
      background-size: contain;
    }
    .title {
      display: block;
      font-size: 14px;
      color: #0A1736;
      margin-top: 10px;
      padding-bottom: 18px;
    }
  }
</style>

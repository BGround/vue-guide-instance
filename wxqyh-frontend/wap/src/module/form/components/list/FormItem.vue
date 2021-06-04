<template>
  <div class="form-item" @click="showInfo">
    <i class="icon-font" :class="iconType[listItem.isTask]" v-if="showIcon"></i>
    <h3 class="item-title">
      {{listItem.formName || listItem.title}}
    </h3>
    <i class="icon-go" v-if="showRightIcon"></i>
    <slot name="rightBtn"></slot>
  </div>
</template>

<script>
export default {
  props: {
    listItem: {
      type: Object,
      default: {}
    },
    showRightIcon: {
      type: Boolean,
      default: true
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    showInfoFrame: {
      type: Boolean,
      default: true
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      iconType: {
        '0': 'bd-putongdan',
        '1': 'bd-renwudan',
        '2': 'bd-shenpidan',
        '3': 'bd-waibudan'
      }
    };
  },
  methods: {
    showInfo() {
      if(this.showInfoFrame) {
        Events.$emit('showInfo', {
          id: this.listItem.definitionVersionsId, 
          formName: this.listItem.formName, 
          formType: this.listItem.typeName || '其他',
          index: this.index
        });
      }
    }
  }
}

</script>
<style lang='scss' scoped>
$baseURL: '../../assets/images/';
.form-item {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  padding: 14px 56px 14px 14px;;
  box-sizing: border-box;
  background: #fff;
  &:active {
    background: #F7F8FA;
    .icon-font {
      background-color: #F7F8FA;
    }
  }
  .icon-font {
    display: block;
    width: 24px;
    height: 24px;
    background-repeat: no-repeat;
    background-size: 24px;
    background-position: center;
    margin-right: 12px;
    &.bd-putongdan {
      background-image: url($baseURL + 'ic_a-grouping_common@2x.png');
    }
    &.bd-renwudan {
      background-image: url($baseURL + 'ic_a-grouping_task@2x.png');
    }
    &.bd-shenpidan {
      background-image: url($baseURL + 'ic_a-grouping_approv@2x.png');
    }
    &.bd-waibudan {
      background-image: url($baseURL + 'ic_a-grouping_cities@2x.png');
    }
  }
  .item-title {
    flex: 1;
    height:22px;
    font-size:16px;
    font-family: 'Microsoft YaHei','宋体', Tahoma, Arial, sans-serif;
    font-weight:400;
    color:rgba(10,23,53,1);
    line-height:22px;
    // max-width: 210px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .icon-go {
    width: 16px;
    height: 16px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 14px;
    margin: auto;
    background-image: url($baseURL + 'icon_a-common_arrowright@2x.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
}
</style>

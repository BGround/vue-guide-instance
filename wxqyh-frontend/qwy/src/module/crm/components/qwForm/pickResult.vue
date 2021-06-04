<template>
  <div class="qw-form-pick-result">
    <div class="pick-result-box">
      <div class="pick-result-list"
           v-if="currentValue&&currentValue.length>0">
        <div class="pick-result-item"
             v-for="(item,index) in currentValue"
             :key="index">
          <div class="item-icon"
               v-if="item.icon">
            <img :src="item.icon"
                 alt=" ">
          </div>
          <div class="item-label">{{item.label}}</div>
          <div class="item-close"
               v-if="showClose"
               @click.stop="onDelete(item,index)">×</div>
        </div>
      </div>
      <div v-else
           class="placeholder"
           @click="onClick">
        <i></i>
        <span>{{placeholder}}</span>
      </div>
    </div>
    <div class="pick-result-count"
         v-if="currentValue&&currentValue.length>0">
      <p>已选 {{currentValue.length}} {{type}}</p>
      <span @click="onClick">修改</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "qwFormPickResult",
  props: {
    placeholder: {
      type: String,
      default: "点击选择"
    },
    value: {
      type: Array,
      default: () => []
    },
    type: String,
    showClose: {
      default: false
    }
  },
  data() {
    return {
      currentValue: []
    };
  },
  watch: {
    value: {
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.currentValue)) {
          this.currentValue = val;
        }
      },
      immediate: true
    }
  },

  methods: {
    onClick() {
      this.$emit("on-click");
    },
    onDelete(item, index) {
      this.$delete(this.currentValue, index);
      this.$emit("input", this.currentValue);
    },
    cloneDeep(val) {
      return JSON.parse(JSON.stringify(val));
    }
  }
};
</script>
<style lang="scss" scoped>
.qw-form-pick-result {
  .pick-result-box {
    width: 322px;
    padding: 4px 8px;
    border: 1px dashed #cbcbcb;
    background-color: #fff;
    overflow-y: auto;
    min-height: 40px;
    max-height: 88px;
    position: relative;
    .pick-result-list {
      display: flex;
      flex-wrap: wrap;
      .pick-result-item {
        background-color: #fff;
        border: 1px solid #e9e9e9;
        height: 32px;
        border-radius: 3px;
        display: flex;
        align-items: center;
        margin: 3px 8px 3px 0;
        padding: 0 8px;
        .item-icon {
          height: 20px;
          width: 20px;
          margin-right: 5px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .item-label {
          max-width: 8em;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .item-close {
          color: #afafaf;
          font-size: 19px;
          font-weight: 600;
          cursor: pointer;
          margin: 0 5px;
        }
      }
      input {
        flex: 1;
        border: 0;
        height: 24px;
        line-height: 24px;
        margin: 0 5px 5px;
      }
    }
    .placeholder {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      color: #a6a6a6;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      i {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: url("~assets/images/ic_b-add.png") no-repeat center;
        background-size: 100%;
        margin-top: 2px;
        margin-right: 3px;
      }
    }
  }
  .pick-result-count {
    display: flex;
    margin-top: 8px;
    font-size: 12px;
    p {
      color: #a6a6a6;
    }
    span {
      color: #409eff;
      margin-left: 15px;
      cursor: pointer;
    }
  }
}
</style>


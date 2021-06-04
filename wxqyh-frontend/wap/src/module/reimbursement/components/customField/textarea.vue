<template>
  <div class="qwui-remark_textarea">
    <div v-if="readonly" class="qwui-remark_text">{{value}}</div>
    <textarea
      cols="5"
      rows="3"
      :placeholder="placeholder"
      :value="value"
      :maxlength="maxLength"
      ref="input"
      v-else
      :readonly="readonly"
      @input="updateValue($event.target.value)"
    ></textarea>
    <p
      class="qwui-tip"
      :class="{ 'qwui-warn_tip': isOverSize }"
      v-if="value && maxLength"
    >
      {{`${value.length}/${maxLength}`}}
    </p>
  </div>
</template>

<script>
export default {
  name: 'QwTextarea',
  props: {
    initRows: {
      type: Number,
      default: 3,
    },
    maxLength: {
      type: [Number,String],
      default: '',
    },
    value: String,
    placeholder:String,
    readonly:{
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rows: this.initRows,
    };
  },
  computed: {
    isOverSize() {
      return this.value.length >= this.maxLength;
    },
  },
  watch: {
    value(value) {
      this.resize(value);
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.value) {
        this.resize(this.value);
      }
    });
  },
  methods: {
    //  监听textarea控件
    updateValue(value) {
      this.resize(value);
      this.$emit('input', value);
    },
    resize(value) {
      var len = 0;
      for (var i = 0; i < value.length; i++) {
        var a = value.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {
          len += 2;
        }
        else {
          len += 1;
        }
      }

      if (len / 32 >= 3) {
        this.$refs.input.rows = (len / 32) > 20 ? 20 : len / 32;
      } else {
        this.$refs.input.rows = 3;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~../../styles/variable.scss';
@import '~../../styles/common.scss';

  .qwui-remark_textarea {
    textarea {
      width: 100%;
      font-size: 16px;
      color: #333;
      border: none;
      word-break: keep-all;
      word-wrap: break-word;
      resize: none;
    }
    .qwui-remark_text{
      font-size: 16px;
      color: #333;
      text-align: left;
    }
  }
</style>

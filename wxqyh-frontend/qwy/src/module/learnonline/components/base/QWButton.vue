<template>
    <button
        type="button"
        :class="classes"
        @click="handleClick"
    >
        <span v-if="showSlot" ref="slot"><slot></slot></span>
    </button>
</template>

<script>
const prefixCls = 'qwui-button'
export default {
    name: 'qwButton',
    props: {
        color: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            showSlot: true
        }
    },
    computed: {
        classes() {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}_${this.color}`]: !!this.color
                }
            ]
        }
    },
    mounted () {
        this.showSlot = this.$slots.default !== undefined;
    },
    methods: {
        handleClick (event) {
            this.$emit('click', event);
        },
        validate() {
            console.log(1)
        }
    }
}
</script>

<style lang="scss" scoped>
  .qwui-button, .qwui-button:active, .qwui-button:focus {
    outline: 0;
  }
  .qwui-button {
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    background-image: none;
    border: 1px solid transparent;
    white-space: nowrap;
    line-height: 1.4;
    user-select: none;
    padding: 6px 22px 7px;
    border-radius:2px;
    background-color: #f7f7f7;
    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear;
  }
  .qwui-button_orange {
    color: #fff;
    background-color: #C31725;
    &:hover {
      background-color: #F87B00;
    }
  }
  .qwui-button_white {
    color: #666;
    background-color: #fff;
    border: 1px solid #cccccc;
    &:hover {
      color: #333;
      background-color: #f7f7f7;
    }
  }
</style>

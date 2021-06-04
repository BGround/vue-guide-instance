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
@import '../style/qwButton'
</style>
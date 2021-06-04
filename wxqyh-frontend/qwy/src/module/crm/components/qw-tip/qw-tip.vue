<template>
    <div class="tipContainer" :class="direction">
      <span class="tipAngle" ref="angle"></span>
      <div class="tipContent">
        <slot></slot>
      </div>
    </div>
</template>

<script>
export default {
  name: 'qw-tip',
  props: {
    direction: {
      type: String,
      default: 'top'
    },
    offsetLeft: {
      type: [String, Number],
      default: 0
    },
    offsetRight: {
      type: [String, Number],
      default: 0
    },
    offsetTop: {
      type: [String, Number],
      default: 0
    },
    offsetBottom: {
      type: [String, Number],
      default: 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      let angleEleStyle = this.$refs.angle.style
      // console.log(angleEleStyle)
      const boxMap = {
        left: 'right',
        right: 'left',
        top: 'bottom',
        bottom: 'top'
      }
      const offsets = [
        {
          name: 'offsetLeft',
          target: 'left',
          percentFix: {
            marginLeft: '-6px'
          }
        },
        {
          name: 'offsetRight',
          target: 'right',
          percentFix: {
            marginRight: '-6px'
          }
        },
        {
          name: 'offsetTop',
          target: 'top',
          percentFix: {
            marginTop: '-6px'
          }
        },
        {
          name: 'offsetBottom',
          target: 'bottom',
          percentFix: {
            marginBottom: '-6px'
          }
        }
      ]
      offsets.forEach((offset) => {
        const value = this[offset.name]
        if (value !== 0) {
          const isNum = typeof value === 'number'
          angleEleStyle[offset.target] = value + (isNum ? 'px' : '')
          if (offset.percentFix && !isNum) {
            Object.keys(offset.percentFix).forEach((key) => {
              angleEleStyle[key] = offset.percentFix[key]
            })
          }
          angleEleStyle[boxMap[offset.target]] = 'auto'
        }
      })
    })
  }
}
</script>

<style lang="scss">
@import './qw-tip.scss'
</style>


<template>
  <div :class="cls('circle')" :style="{height: width + 'px', width: width + 'px'}">
    <svg viewBox="0 0 100 100">
      <path class="qwui-progress-circle__track" :d="trackPath" stroke="#7B7C7C" :stroke-width="relativeStrokeWidth" fill="none"></path>
      <path class="qwui-progress-circle__path" :d="trackPath" stroke-linecap="round" :stroke="stroke" :stroke-width="relativeStrokeWidth" fill="none" :style="circlePathStyle"></path>
    </svg>
    <slot v-if="status === 'text'">
      <span :class="cls('text')" :title="percentage + '%'">{{percentage}}%</span>
    </slot>
  </div>
</template>
<script>
  import Mods from '../mixins/mods';
  export default {
    name: 'progress',
    mixins:[Mods],
    props:{
      status:{
        type: String,
        default: ''
      },
      percentage: {
        type: Number,
        default: 0,
        required: true,
        validator: val => val >= 0 && val <= 100
      },
      strokeWidth: {
        type: Number,
        default: 6
      },
      width: {
        type: Number,
        default: 63
      },
    },
    computed:{
      relativeStrokeWidth() {
        return (this.strokeWidth / this.width * 100).toFixed(1);
      },
      trackPath() {
        let radius = parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10);

        return `M 50 50 m 0 -${radius} a ${radius} ${radius} 0 1 1 0 ${radius * 2} a ${radius} ${radius} 0 1 1 0 -${radius * 2}`;
      },
      perimeter() {
        const radius = 50 - parseFloat(this.relativeStrokeWidth) / 2;
        return 2 * Math.PI * radius;
      },
      relativeStrokeWidth() {
        return (this.strokeWidth / this.width * 100).toFixed(1);
      },
      circlePathStyle() {
        const perimeter = this.perimeter;
        return {
          strokeDasharray: `${perimeter}px,${perimeter}px`,
          strokeDashoffset: (1 - this.percentage / 100) * perimeter + 'px',
          transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
        };
      },
      stroke() {
        let ret;
        if (this.color) {
          ret = this.color;
        } else {
          switch (this.status) {
            case 'exception':
              ret = '#ff4949';
              break;
            default:
              ret = '#fff';
          }
        }
        return ret;
      },
    },
  }
</script>
<style lang="scss" scoped>
  .progress_circle .progress_text{
    display: block;
    position: absolute;
    width: 100%;
    text-align: center;
    line-height: 1;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    margin: 0;
    color: rgba(0,0,0,.65);
    white-space: normal;
    padding: 0 6px;
  }
  .progress_text{
    word-break: normal;
    width: 2em;
    text-align: left;
    font-size: 1em;
    margin-left: 8px;
    vertical-align: middle;
    display: inline-block;
    white-space: nowrap;
    color: rgba(0,0,0,.45);
    line-height: 1;
  }
</style>

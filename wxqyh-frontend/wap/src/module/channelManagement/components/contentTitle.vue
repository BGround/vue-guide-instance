<template>
  <div :style="{'padding': padding}" class="content-title">
    <div class="title">
      <div class="title__name" :style="{'max-width': content && content.length && showContent ? '37%' : '100%'}">
        <span>{{name}}</span>
      </div>
      <div class="title__description" v-if="content && content.length && showContent">
        <span :key="'contentTitle'+index" v-for="(item, index) in content">{{item}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'contentTitle',
    props: {
      name: {
        type: String,
        default() {
          return ''
        }
      },
      content: {
        type: Array,
        default: () => []
      },
      showContent: {
        default: true
      },
      padding: {
        type: String,
        default() {
          return '18px 7px 0 18px'
        }
      }
    },
    data() {
      return {}
    },
    created() {
    },
    watch: {},
    methods: {},
  }
</script>

<style lang="scss" scoped>

  .content-title {
    background: #fff;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title__name {
        line-height: 23px;
        font-size: 17px;
        font-weight: bold;
        color: rgba(20, 30, 40, 1);
        flex: none;
        position: relative;
        padding-left: 10px;

        &::before {
          position: absolute;
          content: "";
          top: 50%;
          left: 0;
          width: 3px;
          height: calc(100% / 2);
          transform: translateY(-50%);
          border-radius: 3px;
          background-color: rgba(198, 0, 31, 1);
        }
      }

      .title__description {
        flex: 1;
        line-height: 23px;
        max-width: 63%;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        align-items: center;

        & > span {
          display: block;
          margin-left: -10px;
          font-size: 12px;
          -webkit-transform: scale(0.84, 0.84);
          transform-origin: bottom;
          *font-size: 10px;
        }
      }
    }
  }

</style>

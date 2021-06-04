<template>
  <div class="status-container" v-if="statusObj">
    <span v-if="statusObj.type" class="status-type">{{$t(statusObj.type)}}</span>
    <div class="status-text" v-else>
      <i  class="status-icon" :class="statusObj.class"></i>
      <span>{{$t(statusObj.statusText)}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Qwstatus',
  props: {
    statusObj: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '~../../styles/variable.scss';

  .status-container {
    font-size: $font-size-small;
    line-height: 1;
    color: #B2B9C8;
    .status-text{
      white-space: nowrap;
    }
    .status-icon {
      display: inline-block;
      margin-right: 5px;
      width: 10px;
      height: 10px;
      border: $approve-border-width solid transparent;
      border-radius: 50%;
      box-sizing: border-box;
      background: #fff;
    }
    .status-type{
      padding: 2px 5px;
      border-radius: 4px;
      border: 1px solid rgba(218,221,228,0.6);
      color: #DADDE4;
    }

    .status-blue-hollow {
      border-color: $approve-status-blue;
    }

    .status-blue-solid {
      background: $approve-status-blue;
    }

    .status-green-hollow {
      border-color: $approve-status-green;
    }

    .status-green-solid {
      background: $approve-status-green;
    }

    .status-gray-hollow{
      border-color: $approve-status-gray;
    }

    .status-gray-solid{
      background: $approve-status-gray;
    }

    .status-red-hollow{
      border-color: $approve-status-red;
    }

    .status-red-solid{
      background: $approve-status-red;
    }

    .status-yellow-hollow{
      border-color: $approve-status-yellow;
    }

    .status-yellow-solid{
      background: $approve-status-yellow;
    }

    .status-violet-hollow{
      border-color: $approve-status-violet;
    }

    .status-violet-solid{
      background: $approve-status-violet;
    }
  }
</style>


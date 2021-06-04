<template>
  <div class="qwui-status_container" v-if="statusObj">
    <i class="qwui-status_icon" :class="statusObj.class"></i>
    <span>{{$t(statusObj.statusText)}}</span>
  </div>
</template>

<script>
export default {
  name: 'QwReimStatus',
  props: {
    statusObj: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '~../../styles/variable.scss';

  .qwui-status_container {
    display: flex;
    align-items: center;
    font-size: $font-size-medium-s;
    line-height: 1;
    color: #AAB0B6;

    .qwui-status_icon {
      margin: 0 11px 0 1px;
      width: 10px;
      height: 10px;
      border: $approve-border-width solid transparent;
      border-radius: 50%;
      box-sizing: border-box;
      background: #fff;
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


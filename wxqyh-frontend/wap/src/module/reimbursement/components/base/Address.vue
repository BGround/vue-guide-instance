<template>
  <div class="qwui-address_box border-bottom-1px">
    <x-address
      class="qwui-address"
      :confirmText="$t('i18n.confirm')"
      :cancelText="$t('i18n.cancel')"
      :placeholder="$t('i18n.pleaseSelect')"
      v-model="value"
      :title="title"
      :show.sync="showAddress"
      :popup-title="$t('i18n.reim.editor.selectCity')"
      :list="addressList"
      :hide-district="true"
      @on-shadow-change="onShadowChange"
      @input="addressChange"
      @on-hide="logHide"
      @on-show="logShow"
    ></x-address>
    <div class="qwui-arrow-icon"></div>
  </div>
</template>

<i18n>
select address:
  zh-CN: 选择地址
</i18n>

<script>
import { XAddress } from 'vux';
import { mapGetters } from 'vuex';

export default {
  name: 'QwAddress',
  components: {
    XAddress,
  },
  props:{
    selectCityId: [String, Number],
  },
  data () {
    return {
      title: this.$t('i18n.reim.editor.selectCity'),
      value: [],
      cityName: '',
      cityId: '',
      showAddress: false,
    }
  },
  computed: {
    ...mapGetters([
      'addressList',
    ])
  },
  created() {
    // 编辑时默认选择的城市
    const cityId = this.selectCityId;
    if (this.value.length < 1 && cityId !== '') {
      this.addressList.some(item => {
        if (item.value == cityId) {
          this.value = [item.parent, cityId];
          return true;
        }
      });
    }
  },
  methods: {
    onShadowChange (ids, names) {
      this.cityId = ids[1];
      this.cityName = names[1];
    },
    addressChange(val) {
      this.$emit('addressChange', this.cityId, this.cityName);
    },
    logHide() {

    },
    logShow() {

    }
  }
}
</script>
<style lang="scss">
@import '~../../styles/common.scss';

.qwui-address_box{
  display: flex;
  padding: $box-padding;
  padding-left: 0;

  .qwui-address {
    flex: 1;
  }

  .weui-cell_access {
    display: flex;

    .weui-label {
      font-size: 16px;
      line-height: 20px;

      &::after {
        content: ' *';
        color: $color-text-warn;
      }
    }
  }

  .vux-popup-picker-placeholder{
    font-size: 16px;
    line-height: 20px;
  }

  .vux-popup-picker-value {
    font-size: 16px;
    line-height: 20px;
    color: #333;
  }

  .qwui-arrow-icon {
    @extend .arrow_right;
    margin-left: $box-padding;
    align-self: center;
  }
}
</style>

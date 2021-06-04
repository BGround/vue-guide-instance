<template>
  <div class="field-content">
    <div class="geo-field"
         :class="{'readOnly':field.readonly || field.disabled || showMsg}"
         @click="showMapfunc">
      <!--<span>此处插入定位图标</span>-->
      <span class="address">{{showMsg?message:address}}</span>
      <i v-if="showIcon" class="icon-geo" @click.stop="getPosition">
      </i>
    </div>
    <tencent-map v-if="showMap"
                 :pos="fieldVal"
                 :type="type"
                 @positionData="setValue"
                 @closeMap="close"
    >
    </tencent-map>
  </div>
</template>
<script>
  import {field_validation} from './validation.js'
  import tencentMap from '@/components/add/tencentMap.vue'

  export default {
    props: ['field'],
    components: {
      tencentMap,
    },
    data() {
      return {
        address: '',
        showMap: false,
        type: '',
        message: '网页版无法获取定位信息'
      }
    },
    created() {
      this.address = this.field.value ? this.fieldVal.value : this.field.disabled ? '' : "点击右边按钮获取地理位置";
    },
    computed: {
      showIcon() {
        return this.field.readonly || this.field.disabled ? false : true
      },
      isMobile() {
        return _.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp();
      },
      showMsg() {
        return !this.isMobile && !this.field.disabled && !this.field.value;
      },
      fieldVal() {
        if (typeof this.field.value == "string") {
          try {
            return JSON.parse(this.field.value);
          } catch (e) {
            return this.field.value;
          }
        } else {
          return this.field.value
        }
      }
    },

    methods: {
      showMapfunc() {
        if (!this.field.value) return;
        if (this.field.readonly || this.field.disabled) {
          this.type = 'showPosition'
          this.showMap = true;
        }
      },
      setValue(data) {
        if (!data) return;
        if (!data.latitude || !data.longitude) return this.address = data.value;
        var key = this.field._id;
        var value = data;
        this.$emit('change', {key, value});
        this.address = this.field.value.value;
        field_validation(this.field);
      },
      getPosition() {
        if (this.showMsg) return;
        if (!this.isMobile)
          return _.tooltips_succeed('PC端暂时无法定位', true, "", 3000);
        this.address = '正在获取定位...'
        this.type = 'getAddress';
        this.showMap = true;
      },
      close() {
        this.showMap = false;
      }
    },
  }
</script>
<style scoped>
  .address {
    padding-right: 40px;
    display: inline-block;
    line-height: 23px;
    vertical-align: middle;
  }

  .icon-geo {
    display: inline-block;
    position: absolute;
    top: 50%;
    right: 0;
    margin-right: 12px;
    width: 22px;
    height: 22px;
    background: url(../../../../assets/images/form_icon_location.png) no-repeat;
    background-size: 100%;
    vertical-align: text-bottom;
    transform: translateY(-50%);
  }

  .icon-geo:before {
    content: " ";
    position: absolute;
    top: 50%;
    height: 16px;
    right: 34px;
    border-left: 1px solid #e5e5e5;
    -webkit-transform: scaleX(0.5);
    transform: scaleX(0.5);
    transform: translateY(-50%);
    z-index: 2;
  }
</style>

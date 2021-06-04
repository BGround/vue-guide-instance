<template>
  <li class="list-item">
    <form-item 
      :listItem="item" 
      :showRightIcon="false"
      :index="index"
      :showInfoFrame="canDrag == 0 ? true : false"
    >
      <i class="dragbtn" slot="rightBtn" v-handle v-show="canDrag"></i>
    </form-item>
  </li>
</template>

<script>
import FormItem from '../../../components/list/FormItem'
import { ElementMixin , HandleDirective} from 'vue-slicksort'
export default {
  mixins: [ElementMixin],
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    canDrag: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 0
    }
  },
  directives: { handle: HandleDirective },
  components: {FormItem}
}

</script>
<style lang="scss" scoped>
.list-item {
  list-style: none;
  user-select: none;
}
.dragbtn {
  width: 16px;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  padding-right: 14px;
  background-image: url(../../../assets/images/icon_a-common_drag@2x.png);
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 16px;

}
</style>
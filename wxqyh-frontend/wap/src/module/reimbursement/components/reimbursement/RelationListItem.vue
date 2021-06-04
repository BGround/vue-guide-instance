 <template>
  <div class="qwui-relaction_list_item" v-if="relationData.id">
    <label class="qwui-radio_label">
      <input 
        class="qwui-radio" 
        type="radio"
        :name="name"
        :value="relationData.id"
        :checked="checked == relationData.id"
        @change="$emit('change', $event.target.value)">
      <i class="qwui-radio-icon"></i>
    </label>
    <div class="qwui-relaction_content border-bottom-1px" @click="$emit('click')">
      <div class="qwui-relaction_title">{{relationData.title}}</div>
      <div class="qwui-relaction_info">
        <span>{{relationData.content1}}</span>
        <span class="qwui-relaction_info_right">{{relationData.content2}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QwRelactionListItem',
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    checked: String,
    relationData: Object,
    name: String,
  },
}
</script>

<style lang="scss" scoped>
@import '~../../styles/mixin.scss';

  .qwui-relaction_list_item {
    display: flex;
    align-items: center;
    background-color: #fff;

    &:last-child .qwui-relaction_content::before {
      display: none;
    }

    .qwui-radio_label {
      padding: 0 15px;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      .qwui-radio {
        position: absolute;
        left: -99999px;

        &:checked + .qwui-radio-icon{
            border: 1px solid #09BB07;

            &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #09BB07;
          }
        }
      }
      .qwui-radio-icon {
        position: relative;
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 1px solid $icon-border-color;
        box-sizing: border-box;
        border-radius: 50%;
      }
    }

    .qwui-relaction_content {
      flex: 1;
      padding: 15px 15px 15px 0;
      overflow: hidden;

      .qwui-relaction_title {
        margin-bottom: 5px;
        font-size: 16px;
        color: #333;
      }

      .qwui-relaction_info {
        display: flex;
        font-size: 13px;
        color: #999;

        .qwui-relaction_info_right {
          flex: 1;
          padding-left: 10px;

          @include no-wrap();
        }
      }
    }
  }
</style>


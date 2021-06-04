 <template>
    <label
    role="checkbox"
    :class="[
      className ? 'qw-checkbox-' + className : '',
      { 'is-disabled': disabled },
      { 'is-checked': checked }
    ]">
         <input type="checkbox"
              :class="[className ? 'qw-checkbox-' + className + '__input': '']"
              :name="name"
              :value="label"
              :checked='checked'
              @change="handleChange"
         >
          <slot></slot>
    </label>
</template>
<script>
  export default {
    name:'QwCheckbox',
    props:{
        className: {
            type: String,
            default: 'button'
        },
        disabled: {
            type: Boolean,
            defult: false
        },
        checked: {
        type: Boolean,
        defult: false
      },
        name: {
            type: String,
            defult: ''
        },
        label: {},
    },
    methods:{
        handleChange(ev){
        let value = ev.target.checked? true:false;
        this.$emit('change', value, ev);
        }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'checkbox.scss';
</style>

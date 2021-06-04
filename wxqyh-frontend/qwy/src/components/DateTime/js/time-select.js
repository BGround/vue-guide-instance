import picker from '../picker/QwPicker.vue';
import panel from '../picker/QwTimeSelect.vue';

export default {
  mixins: [picker],

  name: 'QwTimeSelect',

  componentName: 'QwTimeSelect',

  props: {
    type: {
      type: String,
      default: 'time-select'
    }
  },

  beforeCreate() {
    this.panel = panel;
  }
};

import timeSelect from './js/time-select.js';

/* istanbul ignore next */
timeSelect.install = function(Vue) {
  Vue.component(timeSelect.name, timeSelect);
};

export default timeSelect;

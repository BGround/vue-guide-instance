


let ELEMENT = '_';

const join = (name, el, symbol) =>{
  name = name.split(/(?=[A-Z])/)
  let className = []
  name.forEach( item => {
    className.push(item.toLowerCase().replace('qw','qwui'))
  })

  name = className.join('_')
  name = name.replace('_','-')
  return el ? name + symbol + el : name;
}

const prefixCls = (name, mods) => {
  if (typeof mods === 'string') {
    return join(name, mods, ELEMENT);
  }

  if (Array.isArray(mods)) {
    return mods.map(item => prefixCls(name, item));
  }

  const ret = {};
  Object.keys(mods).forEach(key => {
    ret[name + ELEMENT + key] = mods[key];
  });
  return ret;
};

export default {
  methods: {
    cls(el, mods) {
      const { name } = this.$options;

      if (el && typeof el !== 'string') {
        mods = el;
        el = '';
      }

      el = join(name, el, ELEMENT);

      return mods ? [el, prefixCls(el, mods)] : el;
    }
  }
};

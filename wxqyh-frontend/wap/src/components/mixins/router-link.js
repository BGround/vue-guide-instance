
/**
 * url: 跳转路径，默认不覆盖history对象中的当前地址栏
 * replace： 覆盖history对象中的当前地址栏记录
 * to 路由跳转方式，推荐使用对象
 */

export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    replace: {
      type: Boolean,
      default: false
    },
    to: {
      type: [String, Object],
      default: ''
    }
  },

  methods: {
    routerLink() {
      const { to, url, $router, replace } = this;
      if (to && $router) {
        $router[replace ? 'replace' : 'push'](to);
        return;
      }
      if (url) {
        replace ? location.replace(url) : location.href = url;
      }
    }
  }
};


function wrapper(promise, name) {
    return promise.then(component => {
      component = component.default;
      component.name = name;
      return component;
    });
  }

  export default {
  //首页
    'openhome': () => wrapper(import('../views/vip/exclusive'), 'service-index'),
    'expansion': () => wrapper(import('../views/vip/expansion'), 'service-expansion'),
    // 'loading-more': () => wrapper(import('./components/loading-more'), 'loading-more'),
  }

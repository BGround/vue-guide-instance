
import Vue from 'vue';
import Router from 'vue-router';
import config from './config';
import entry from './entry';

const lang = Vue.prototype.$lang || 'zh-CN'

Vue.use(Router);

const newRouter = () => {
  const route = [];
  Object.keys(config).forEach(() => {
    const entrys =  config[lang].nav || [];
    entrys.forEach(entry => {
        addRoute(entry);
    });

    function addRoute(page) {
      let { path } = page;
      if (path) {
        path = path.split('/');
        let component;
        component = entry[path.join('')]

        if (!component) {
          return;
        }

        let panths = ''
        path.forEach(item => {
          if(item){
            panths +=  '/' +  item
          }
        });

        route.push({
          name: `${panths}`,
          component,
          path: `${panths}`,
          meta: {
            lang,
            path,
            title: page.title,
            name: page.title
          }
        });
      }
    }
  });

  return route
};

  export default new Router({
    routes: newRouter()
})

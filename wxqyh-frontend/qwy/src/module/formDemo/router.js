import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const edit = r => require.ensure([], () => {
  return r(require('./views/formEdit'))
}, 'formEdit');

const router = new Router({
  routes: [
    {
      path: '/formEdit',
      name: 'formEdit',
      component: edit,
    }
  ]
});

export default router;

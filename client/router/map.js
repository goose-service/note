export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/list/index.vue'),
    props: {},
    meta: { layout: 'default', active: 'home' },
  },
  {
    path: '/nest/:nest/',
    name: 'Nest',
    component: () => import('../pages/list/index.vue'),
    meta: { layout: 'default', active: 'nest' },
  },
  {
    path: '/nest/:nest/:category/',
    name: 'NestCategory',
    component: () => import('../pages/list/index.vue'),
    meta: { layout: 'default', active: 'nest' },
  },
  {
    path: '/article/:srl/',
    name: 'Article',
    component: () => import('../pages/article/index.vue'),
    meta: { layout: 'default', active: 'article' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/error/404.vue'),
    meta: { layout: 'default', active: 'service' },
  },
]

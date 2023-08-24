import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'



export const constantRoutes = [
  {
    path: '/goCanvasinit',
    component: () => import('@/views/goView/goCanvas.vue'),
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // {
  //   path: '/echarts',
  //   name: 'Echarts',
  //   component: () => import('@/views/shipeiEcharts/index'),
  //   meta: { title: 'Echarts适配' }
  // },
  {
    path: '/',
    redirect: '/goCanvasinit',
  }
  // {
  //   path: '/',
  //   component: Layout,
  //   // redirect: '/dashboard',
  //   redirect: '/goCanvasinit',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       name: 'Dashboard',
  //       component: () => import('@/views/dashboard/index'),
  //       meta: { title: 'Dashboard', icon: 'dashboard' }
  //     },
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table' }

  //     },
  //     {
  //       path: 'iframe',
  //       name: 'Iframe',
  //       component: () => import('@/views/iframe/index'),
  //       meta: { title: 'iframe' }

  //     },

  //   ]
  // },
  // {
  //   path: '/go',
  //   component: Layout,
  //   redirect: '/go12',
  //   meta: { title: 'go' },
  //   children: [
  //     {
  //       path: 'go1',
  //       name: 'go1',
  //       component: () => import('@/views/go1/index'),
  //       meta: { title: 'go1' }
  //     },
  //     {
  //       path: 'go2',
  //       name: 'go2',
  //       component: () => import('@/views/go2/index'),
  //       meta: { title: 'go2' }
  //     },
  //     {
  //       path: 'go3',
  //       name: 'go3',
  //       component: () => import('@/views/go3/index'),
  //       meta: { title: 'go3' }
  //     },
  //     {
  //       path: 'go4',
  //       name: 'go4',
  //       component: () => import('@/views/go4/index'),
  //       meta: { title: 'go4' }
  //     },
  //     {
  //       path: 'go5',
  //       name: 'go5',
  //       component: () => import('@/views/go5/index'),
  //       meta: { title: 'go5' }
  //     },
  //     {
  //       path: 'go6',
  //       name: 'go6',
  //       component: () => import('@/views/go6/index'),
  //       meta: { title: 'go6' }
  //     },
  //     {
  //       path: 'go7',
  //       name: 'go7',
  //       component: () => import('@/views/go7/index'),
  //       meta: { title: 'go7' }
  //     },
  //     {
  //       path: 'go8',
  //       name: 'go8',
  //       component: () => import('@/views/go8/index'),
  //       meta: { title: 'go8' }
  //     },
  //     {
  //       path: 'go9',
  //       name: 'go9',
  //       component: () => import('@/views/go9/index'),
  //       meta: { title: 'go9Anition' }
  //     },
  //     {
  //       path: 'go10',
  //       name: 'go10',
  //       component: () => import('@/views/go10/index'),
  //       meta: { title: 'go10Anition' }
  //     },
  //     {
  //       path: 'go12',
  //       name: 'go12',
  //       component: () => import('@/views/go12/index'),
  //       meta: { title: 'go12Anition' }
  //     },
  //     {
  //       path: 'go13',
  //       name: 'go13',
  //       component: () => import('@/views/go13/index'),
  //       meta: { title: 'go13' }
  //     },
  //     {
  //       path: 'go14',
  //       name: 'go14',
  //       component: () => import('@/views/go14/index'),
  //       meta: { title: 'go14' }
  //     },
  //     {
  //       path: 'go15',
  //       name: 'go15',
  //       component: () => import('@/views/go15/index'),
  //       meta: { title: 'go15' }
  //     },
  //     {
  //       path: 'goNetwork',
  //       name: 'goNetwork',
  //       component: () => import('@/views/goNetwork/index'),
  //       meta: { title: 'goNetwork' }
  //     },
  //     {
  //       path: 'yemsc',
  //       name: 'Yemsc',
  //       component: () => import('@/views/yemsc/index'),
  //       meta: { title: 'yemsc' }
  //     },
  //     {
  //       path: 'list',
  //       name: 'List',
  //       component: () => import('@/views/list/index'),
  //       meta: { title: 'list' }
  //     },
  //     // {
  //     //   path: 'caidan',
  //     //   name: 'caidan',
  //     //   component: () => import('@/views/caidan/index'),
  //     //   meta: { title: '菜单' }
  //     // },
  //     // {
  //     //   path: 'table',
  //     //   name: 'table',
  //     //   component: () => import('@/views/ScrollTable/index'),
  //     //   meta: { title: '表格' }
  //     // },



  //     // {
  //     //   path: '/go2',
  //     //   name: 'go2',
  //     //   component: () => import('@/views/go1/index2'),
  //     //   meta: { title: 'go2' }
  //     // },{
  //     //   path: 'go3',
  //     //   name: '/go3',
  //     //   component: () => import('@/views/go1/index3'),
  //     //   meta: { title: 'go3' }
  //     // },

  //   ]

  // },



  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}




export default router

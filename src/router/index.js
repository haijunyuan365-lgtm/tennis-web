
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const routes = [
  {
    path: '/login',
    component: () => import("../views/login.vue")
  },
  {
    path: '/',
    redirect: '/huanying',
  },
  {
    path: '/huanying',
    component: () => import("../views/huanying.vue")
  },
  {
    path: '/mode',
    component: () => import("../views/mode.vue")
  },
  {
    path: '/matching',
    component: () => import("../views/matching.vue"),
    children: [
      {
        path: '/matching/3D',
        name: 'TiaoZhuan',
        component: () => import("../views/tiaozhan.vue"),
        meta: { KeepAlive:true }
      }
    ]
  },
  {
    path: '/result',
    component: () => import("../views/result.vue")
  },
  {
    path: '/select',
    component: () => import("../views/select.vue")
  },
  {
    path: '/score',
    component: () => import("../views/score.vue")
  },
  {
    path: '/placement',
    component: () => import("../views/placement.vue")
  }
]

const router = new VueRouter({
  mode:'history',
  routes
})

// 解决重复导航错误
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') throw err
  })
}

export default router
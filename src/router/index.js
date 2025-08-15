
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
    redirect: '/login ',
  },
  {
    path: '/tennis3D',
    component: () => import("../views/Tennis3DShotChart.vue")
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
    path: '/gameMode',
    component: () => import("../views/gameMode.vue"),
    children: [
      {
        path: '/gameMode/3D',
        name: 'TiaoZhuan',
        component: () => import("../views/tiaozhan.vue"),
        meta: { KeepAlive:true }
      }
    ]
  },
  {
    path: '/SmoothPlayMode',
    component: () => import("../views/SmoothPlayMode.vue"),
    children: [
      {
        path: '/SmoothPlayMode/3D',
        name: 'changda',
        component: () => import("../views/SmoothPlayMode.vue"),
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
import Vue from 'vue'
import VueRouter from 'vue-router'
import ViewUI from 'view-design'
import store from '@/store'

Vue.use(VueRouter)
Vue.use(ViewUI)

export const constantRoutes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home/Home.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/courses',
    name: 'courses',
    component: () => import('../views/AllCourse/AllCourse.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/course/:id',
    name: 'detail',
    component: () => import('../views/Course/Course.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      auth: true
    },
    component: () => import('../views/User/index.vue')
  },
  {
    path: '/user/profile',
    name: 'profile',
    meta: {
      auth: true
    },
    component: () => import('../views/User/profile.vue')
  },
  {
    path: '/verifyForgetPwd',
    name: 'forgetPwd',
    component: () => import('../views/Redirect/forgetPwd.vue')
  },
  {
    path: '/verifyRegister',
    name: 'verifyRegister',
    component: () => import('../views/Redirect/verifyRegister.vue')
  },
  {
    path: '/verifyEmail',
    name: 'verifyEmail',
    component: () => import('../views/Redirect/verifyEmail.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/404',
    component: () => import('../views/404.vue'),
    name: 404,
    meta: {
      keepAlive: true
    }
  },
  { path: '*', redirect: '/404' }
]

// @ts-ignore
const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

router.beforeEach(async(to: any, from: any, next: () => void) => {
  // @ts-ignore
  ViewUI.LoadingBar.start()
  if (store.getters.token && !store.getters.userInfo) {
    try {
      await store.dispatch('user/getInfo')
      await store.dispatch('course/getFavoriteList')
    } catch (e) {
      await store.dispatch('user/removeUser')
    }
  }
  next()
})

router.afterEach(() => {
  // @ts-ignore
  ViewUI.LoadingBar.finish()
})

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

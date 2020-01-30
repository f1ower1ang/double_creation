import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home/Home.vue')
  },
  {
    path: '/courses',
    name: 'courses',
    component: () => import('../views/AllCourse/AllCourse.vue')
  },
  {
    path: '/course/:id',
    name: 'detail',
    component: () => import('../views/Course/Course.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login/index.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register/index.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router

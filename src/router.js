import Vue from 'vue'
import firebase from 'firebase'
import Router from 'vue-router'
import LoginPage from './views/LoginPage.vue'
import IndexPage from './views/IndexPage.vue'
import NewPage from './views/NewPage.vue'
import EditPage from './views/EditPage.vue'
import ShowPage from './views/ShowPage.vue'
import UserIndexPage from './views/UserIndexPage.vue'
import GraphPage from './views/GraphPage.vue'
import AddedTaskChart from '@/components/AddedTaskChart.vue'
import TaskCountChart from '@/components/TaskCountChart.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage,
      meta: { requiresAuth: false },
    },
    {
      path: '/task/new',
      name: 'NewPage',
      component: NewPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/task/edit/:task',
      name: 'EditPage',
      component: EditPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/task/:task',
      name: 'ShowPage',
      component: ShowPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/users',
      name: 'UserIndexPage',
      component: UserIndexPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/graph',
      name: 'GraphPage',
      component: GraphPage,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'addedTask',
          name: 'AddedTaskChart',
          component: AddedTaskChart,
          meta: { requiresAuth: true },
        },
        {
          path: 'countTask',
          name: 'TaskCountChart',
          component: TaskCountChart,
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (firebase.auth().currentUser) {
      next()
      return
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        next()
      } else {
        next({ name: 'LoginPage' })
      }
    })
  } else {
    if (firebase.auth().currentUser) {
      next({ name: 'IndexPage' })
      return
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        next({ name: 'IndexPage' })
      } else {
        next()
      }
    })
  }
})

export default router

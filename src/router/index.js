import { createRouter, createWebHashHistory } from 'vue-router'

const Layout = () =>
  import('@/views/Layout.vue')
const Home = () =>
  import('@/views/home')
const TopCategory = () =>
  import('@/views/category/index.vue')
const SubCategory = () =>
  import('@/views/category/sub.vue')
const Goods = () =>
  import('@/views/goods/index')
const Login = () =>
  import('@/views/login/index')
const LoginCallback = () =>
  import('@/views/login/callback.vue')

const routes = [{
  path: '/',
  component: Layout,
  children: [
    { path: '/', component: Home },
    { path: '/category/:id', component: TopCategory },
    { path: '/category/sub/:id', component: SubCategory },
    { path: '/product/:id', component: Goods }

  ]
},
{
  path: '/login',
  component: Login
},
{ path: '/login/callback', component: LoginCallback }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})

export default router

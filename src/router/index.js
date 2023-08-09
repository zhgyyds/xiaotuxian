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
const Cart = () =>
  import('@/views/cart')
const Checkout = () =>
  import('@/views/member/pay/checkout')

const PayIndex = () =>
  import('@/views/member/pay/index')
const XtxPayResultPage = () =>
  import('@/views/member/pay/result')

const routes = [{
  path: '/',
  component: Layout,
  children: [
    { path: '/', component: Home },
    { path: '/category/:id', component: TopCategory },
    { path: '/category/sub/:id', component: SubCategory },
    { path: '/product/:id', component: Goods },
    { path: '/cart', component: Cart },
    { path: '/member/checkout', component: Checkout },
    { path: '/member/pay', component: PayIndex },
    {
      path: '/pay/callback',
      component: XtxPayResultPage
    }

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

// 前置导航守卫
// router.beforeEach((to, from, next) => {
//     const { profile } = store.state.user
//     if (!profile.token && to.path.startsWith('/member')) {
//         return next({ path: '/login', query: { redirectUrl: to.fullPath } })
//     }
//     next()
// })

export default router

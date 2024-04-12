import Vue from 'vue'
import VueRouter from 'vue-router'
import Enroll from '@/views/enroll'
import account from '@/views/login/account.vue'
import email from '@/views/login/email.vue'
import home from '@/views/login/home.vue'
import HomeView from '@/views/HomeView.vue'
import adminPage from '@/views/admin/index.vue'
import userPage from '@/views/admin/user.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 帐号登陆路由配置
    {
      path: '/',
      component: home
    },
    // 注册路由配置
    {
      path: '/enroll',
      component: Enroll
    },
    // 帐号登陆路由
    {
      path: '/account',
      component: account
    },
    // 邮箱登陆路由配置
    {
      path: '/email',
      component: email
    },
    {
      path: '/home',
      component: home
    },
    {
      path: '/homeview',
      component: HomeView
    },
    {
      path: '/admin',
      component: adminPage,
      redirect: '/admin/userpage',
      children: [
        {
          path: '/admin/userPage',
          component: userPage
        }
      ]

    }

  ]
})

export default router

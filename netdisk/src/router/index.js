import Vue from 'vue'
import VueRouter from 'vue-router'
import Enroll from '@/views/enroll'
import account from '@/views/login/account.vue'
import email from '@/views/login/email.vue'
import home from '@/views/login/home.vue'
import HomeView from '@/views/HomeView.vue'
import adminPage from '@/views/admin/index.vue'
import userPage from '@/views/admin/user.vue'
import managePage from '@/views/admin/admin.vue'
import vippage from '@/views/vipPage.vue'
import forgetPSW from '@/views/login/forgetPSW.vue' // LYX

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
    {
      path: '/vip',
      component: vippage
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
          // 用户管理界面
          path: '/admin/userPage',
          component: userPage
        },
        {
          // 管理员管理界面
          path: '/admin/adminPage',
          component: managePage
        }
      ]

    },
    // LYX
    {
      // 忘记密码界面
      path: '/forget',
      component: forgetPSW
    }
  ]
})

export default router

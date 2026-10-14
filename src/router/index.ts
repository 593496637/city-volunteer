import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import MainLayout from '~/layouts/MainLayout.vue'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    /** 头部标题右侧的副标题 */
    subtitle?: string
    /** 头部展示的用户身份 */
    role?: 'admin' | 'volunteer'
    /** 详情类页面需要高亮的菜单 */
    activeMenu?: string
  }
}

const ADMIN = '管理后台'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', component: () => import('~/views/dashboard/index.vue'), meta: { title: '首页' } },

      { path: 'project/list', component: () => import('~/views/project/list.vue'), meta: { title: '项目列表' } },
      { path: 'project/detail/:id', component: () => import('~/views/project/detail.vue'), meta: { title: '项目详情', subtitle: '志愿项目详情', role: 'volunteer', activeMenu: '/project/list' } },
      { path: 'project/publish', component: () => import('~/views/project/publish.vue'), meta: { title: '项目发布', subtitle: ADMIN } },
      { path: 'project/audit', component: () => import('~/views/project/audit.vue'), meta: { title: '项目审核', subtitle: ADMIN } },

      { path: 'activity/list', component: () => import('~/views/activity/list.vue'), meta: { title: '活动管理', subtitle: ADMIN } },
      { path: 'activity/publish', component: () => import('~/views/activity/publish.vue'), meta: { title: '活动发布', subtitle: ADMIN } },
      { path: 'activity/audit', component: () => import('~/views/activity/audit.vue'), meta: { title: '活动审核', subtitle: ADMIN } },
      { path: 'activity/evaluate', component: () => import('~/views/activity/evaluate.vue'), meta: { title: '活动评价', subtitle: ADMIN } },

      { path: 'volunteer', component: () => import('~/views/volunteer/index.vue'), meta: { title: '志愿者管理', subtitle: ADMIN } },
      { path: 'organization', component: () => import('~/views/organization/index.vue'), meta: { title: '志愿组织' } },
      { path: 'garbage', component: () => import('~/views/garbage/index.vue'), meta: { title: '垃圾分类专区' } },
      { path: 'points', component: () => import('~/views/points/index.vue'), meta: { title: '时长积分管理', subtitle: ADMIN } },
      { path: 'statistics', component: () => import('~/views/statistics/index.vue'), meta: { title: '数据统计分析' } },
      { path: 'notice', component: () => import('~/views/notice/index.vue'), meta: { title: '通知公告' } },
      { path: 'personal/:tab', component: () => import('~/views/personal/index.vue'), meta: { title: '个人中心', role: 'volunteer' } },
      { path: 'personal', redirect: '/personal/home' },
      { path: 'system', component: () => import('~/views/system/index.vue'), meta: { title: '系统管理', subtitle: ADMIN } },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: (to, from) =>
    to.matched.at(-1)?.path === from.matched.at(-1)?.path && to.params.id === from.params.id ? false : { top: 0 },
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - 城市管理志愿服务平台` : '城市管理志愿服务平台'
})

export default router

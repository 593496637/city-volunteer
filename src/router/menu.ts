export interface MenuItem {
  title: string
  path: string
  icon?: string
  children?: MenuItem[]
}

/**
 * 统一菜单：综合了原型中驾驶舱、志愿者端、管理后台三类截图的菜单，
 * 按“首页 → 业务 → 专题 → 统计 → 个人 → 系统”的顺序组织。
 */
export const menus: MenuItem[] = [
  { title: '首页', path: '/dashboard', icon: 'i-ri-home-4-fill' },
  {
    title: '志愿项目',
    path: '/project',
    icon: 'i-ri-file-list-3-fill',
    children: [
      { title: '项目列表', path: '/project/list' },
      { title: '项目发布', path: '/project/publish' },
      { title: '项目审核', path: '/project/audit' },
    ],
  },
  {
    title: '志愿活动',
    path: '/activity',
    icon: 'i-ri-calendar-check-fill',
    children: [
      { title: '活动列表', path: '/activity/list' },
      { title: '活动发布', path: '/activity/publish' },
      { title: '活动审核', path: '/activity/audit' },
      { title: '活动评价', path: '/activity/evaluate' },
    ],
  },
  { title: '志愿者管理', path: '/volunteer', icon: 'i-ri-team-fill' },
  { title: '志愿组织', path: '/organization', icon: 'i-ri-building-2-fill' },
  { title: '垃圾分类专区', path: '/garbage', icon: 'i-ri-recycle-fill' },
  { title: '时长积分管理', path: '/points', icon: 'i-ri-time-fill' },
  { title: '数据统计分析', path: '/statistics', icon: 'i-ri-bar-chart-box-fill' },
  { title: '通知公告', path: '/notice', icon: 'i-ri-notification-3-fill' },
  {
    title: '个人中心',
    path: '/personal',
    icon: 'i-ri-user-3-fill',
    children: [
      { title: '我的主页', path: '/personal/home' },
      { title: '我的报名', path: '/personal/signup' },
      { title: '我的时长', path: '/personal/hours' },
      { title: '我的证书', path: '/personal/certs' },
      { title: '我的评价', path: '/personal/evaluations' },
    ],
  },
  { title: '系统管理', path: '/system', icon: 'i-ri-settings-3-fill' },
]

// 静态演示数据（无后端），页面直接引用
import act1 from '~/assets/img/act1.jpg'
import act2 from '~/assets/img/act2.jpg'
import act3 from '~/assets/img/act3.jpg'
import act4 from '~/assets/img/act4.jpg'
import act5 from '~/assets/img/act5.jpg'
import act6 from '~/assets/img/act6.jpg'
import act7 from '~/assets/img/act7.jpg'
import act8 from '~/assets/img/act8.jpg'
import act9 from '~/assets/img/act9.jpg'
import cert1 from '~/assets/img/cert1.jpg'
import cert2 from '~/assets/img/cert2.jpg'
import cert3 from '~/assets/img/cert3.jpg'

export const photos = [act1, act2, act3, act4, act5, act6, act7, act8, act9]
export const certImages = [cert1, cert2, cert3]

// 固定种子的伪随机，保证每次刷新数据一致
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}
const rand = seeded(20240601)
const pick = <T>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)]
const between = (min: number, max: number) => Math.floor(min + rand() * (max - min + 1))
const pad = (n: number) => String(n).padStart(2, '0')

export const districts = ['朝阳区', '海淀区', '西城区', '东城区', '丰台区', '石景山区', '昌平区', '通州区', '大兴区', '顺义区'] as const

export const serviceTypes = ['垃圾分类', '环境整治', '文明劝导', '社区服务', '宣传教育', '助老助残', '文化宣传', '公益服务'] as const

/** 服务类型 → 标签色 */
export const typeColor: Record<string, string> = {
  垃圾分类: 'green',
  环境整治: 'blue',
  文明劝导: 'purple',
  社区服务: 'red',
  宣传教育: 'orange',
  助老助残: 'orange',
  文化宣传: 'orange',
  公益服务: 'blue',
  城市管理: 'blue',
  文化教育: 'cyan',
}

/** 状态 → 标签色 */
export const statusColor: Record<string, string> = {
  报名中: 'green',
  进行中: 'orange',
  即将开始: 'blue',
  未开始: 'gray',
  已结束: 'gray',
  已取消: 'red',
  待审核: 'orange',
  已驳回: 'red',
  已通过: 'blue',
  已完成: 'gray',
  草稿: 'gray',
  报名截止: 'purple',
  候补: 'purple',
  已确认: 'green',
  待确认: 'orange',
  异常: 'red',
  正常: 'green',
  停用: 'gray',
  启用: 'green',
}

/* ------------------------------------------------------------------ */
/* 志愿项目                                                            */
/* ------------------------------------------------------------------ */
export interface Project {
  id: number
  title: string
  slogan: string
  tags: string[]
  type: string
  region: string
  street: string
  start: string
  end: string
  deadline: string
  recruit: number
  signed: number
  org: string
  views: number
  likes: number
  status: '报名中' | '进行中' | '已结束'
  img: string
  audit: '已通过' | '待审核' | '已驳回'
}

const baseProjects: Omit<Project, 'id' | 'img' | 'audit' | 'slogan' | 'end' | 'deadline'>[] = [
  { title: '社区环境清洁行动', tags: ['垃圾分类', '社区服务'], type: '垃圾分类', region: '朝阳区', street: '望京街道', start: '2024-06-02 14:00', recruit: 50, signed: 42, org: '望京街道志愿服务队', views: 1234, likes: 98, status: '报名中' },
  { title: '关爱空巢老人志愿服务', tags: ['助老助残', '社区服务'], type: '助老助残', region: '朝阳区', street: '双井街道', start: '2024-06-01 09:00', recruit: 30, signed: 28, org: '朝阳区志愿者协会', views: 856, likes: 76, status: '进行中' },
  { title: '垃圾分类知识宣传', tags: ['垃圾分类', '宣传教育'], type: '垃圾分类', region: '西城区', street: '新街口街道', start: '2024-06-05 10:00', recruit: 100, signed: 86, org: '西城区城管委', views: 1120, likes: 64, status: '报名中' },
  { title: '文明交通劝导志愿活动', tags: ['文明劝导', '社区服务'], type: '文明劝导', region: '东城区', street: '王府井街道', start: '2024-05-28 07:30', recruit: 40, signed: 40, org: '东城区文明办', views: 980, likes: 52, status: '已结束' },
  { title: '城市绿化维护志愿活动', tags: ['环境整治', '公益服务'], type: '环境整治', region: '丰台区', street: '方庄街道', start: '2024-06-10 09:00', recruit: 60, signed: 42, org: '丰台区园林局', views: 743, likes: 38, status: '进行中' },
  { title: '垃圾分类宣传讲座', tags: ['垃圾分类', '宣传教育'], type: '垃圾分类', region: '石景山区', street: '八角街道', start: '2024-05-25 14:00', recruit: 80, signed: 80, org: '石景山区城管委', views: 620, likes: 41, status: '已结束' },
  { title: '河道垃圾清理志愿活动', tags: ['环境整治', '公益服务'], type: '环境整治', region: '通州区', street: '北苑街道', start: '2024-06-08 08:30', recruit: 70, signed: 36, org: '通州区水务局', views: 698, likes: 27, status: '报名中' },
  { title: '爱心物资捐赠活动', tags: ['助老助残', '社区服务'], type: '助老助残', region: '昌平区', street: '回龙观街道', start: '2024-05-20 09:00', recruit: 50, signed: 50, org: '昌平区慈善协会', views: 512, likes: 33, status: '已结束' },
  { title: '文化进社区志愿服务', tags: ['文化宣传', '社区服务'], type: '文化宣传', region: '大兴区', street: '兴丰街道', start: '2024-06-12 15:00', recruit: 40, signed: 18, org: '大兴区文化馆', views: 421, likes: 19, status: '报名中' },
]

const extraTitles: [string, string[]][] = [
  ['桶前值守引导行动', ['垃圾分类', '社区服务']],
  ['老旧小区楼道清理', ['环境整治', '社区服务']],
  ['文明养犬宣传劝导', ['文明劝导', '社区服务']],
  ['公园环境维护行动', ['环境整治', '公益服务']],
  ['绿色出行文明倡议', ['文明劝导', '宣传教育']],
  ['社区便民服务日', ['社区服务', '公益服务']],
  ['垃圾分类入户宣传', ['垃圾分类', '宣传教育']],
  ['助残陪伴志愿服务', ['助老助残', '社区服务']],
  ['非遗文化进社区', ['文化宣传', '社区服务']],
  ['共享单车整理行动', ['环境整治', '城市管理']],
  ['背街小巷环境整治', ['环境整治', '社区服务']],
  ['厨余垃圾减量宣传', ['垃圾分类', '宣传教育']],
  ['路口文明劝导值守', ['文明劝导', '城市管理']],
  ['敬老院陪伴服务', ['助老助残', '公益服务']],
  ['社区读书分享会', ['文化宣传', '文化教育']],
  ['街道设施巡查志愿行', ['城市管理', '公益服务']],
  ['校园垃圾分类小课堂', ['垃圾分类', '文化教育']],
  ['小广告清理行动', ['环境整治', '城市管理']],
  ['夏季防汛宣传', ['宣传教育', '城市管理']],
  ['社区义诊志愿服务', ['社区服务', '助老助残']],
  ['垃圾分类积分兑换日', ['垃圾分类', '社区服务']],
  ['城市文明随手拍', ['文明劝导', '宣传教育']],
  ['公共设施巡查志愿行动', ['城市管理', '公益服务']],
  ['社区文艺汇演', ['文化宣传', '社区服务']],
  ['低碳生活主题宣传', ['宣传教育', '公益服务']],
  ['桶站清洗维护行动', ['垃圾分类', '环境整治']],
  ['邻里守望互助服务', ['社区服务', '助老助残']],
]

const orgs = ['望京街道志愿服务队', '朝阳区环保志愿者协会', '海淀区文明实践队', '西城区社区志愿服务中心', '丰台区绿色生活志愿队', '东城区文明办', '通州区水务局', '大兴区文化馆', '昌平区慈善协会', '石景山区城管委']
const streets = ['望京街道', '中关村街道', '新街口街道', '王府井街道', '方庄街道', '八角街道', '回龙观街道', '北苑街道', '兴丰街道', '胜利街道']
const projectStatuses = ['报名中', '进行中', '已结束'] as const

function buildProjects(): Project[] {
  const list: Project[] = []
  const all = [
    ...baseProjects,
    ...extraTitles.map(([title, tags], i) => {
      const month = i % 3 === 0 ? 5 : 6
      const day = between(1, 28)
      const recruit = pick([20, 30, 40, 50, 60, 80, 100])
      const status = pick(projectStatuses)
      return {
        title,
        tags,
        type: tags[0],
        region: districts[i % districts.length],
        street: streets[i % streets.length],
        start: `2024-${pad(month)}-${pad(day)} ${pick(['08:30', '09:00', '10:00', '14:00', '15:00'])}`,
        recruit,
        signed: status === '已结束' ? recruit : between(Math.floor(recruit * 0.3), recruit),
        org: orgs[i % orgs.length],
        views: between(200, 1300),
        likes: between(10, 90),
        status,
      }
    }),
  ]
  all.forEach((p, i) => {
    const [d, t] = p.start.split(' ')
    const endHour = Math.min(Number(t.slice(0, 2)) + 3, 21)
    const date = new Date(d)
    date.setDate(date.getDate() - 1)
    list.push({
      ...p,
      id: i + 1,
      img: photos[i % photos.length],
      slogan: pick(['清洁家园 · 从我做起', '志愿同行 · 共建美好城市', '文明实践 · 你我同行', '用行动传递温暖']),
      end: `${d} ${pad(endHour)}:${t.slice(3)}`,
      deadline: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} 18:00`,
      audit: i < 30 ? '已通过' : (i % 2 ? '待审核' : '已驳回'),
    })
  })
  // 首个项目的时间与详情页原型一致
  list[0].end = '2024-06-02 17:00'
  list[0].deadline = '2024-06-01 18:00'
  list[0].slogan = '清洁家园 · 从我做起'
  return list
}

export const projects = buildProjects()

export function getProject(id: number) {
  return projects.find(p => p.id === id) ?? projects[0]
}

/** 不同服务类型的服务内容模板 */
export const serviceContentByType: Record<string, string[]> = {
  垃圾分类: ['清理社区公园、街道及周边区域的垃圾和卫生死角', '向居民宣传垃圾分类知识，发放宣传资料', '引导居民养成良好的垃圾分类习惯', '协助社区开展环境卫生整治相关工作'],
  环境整治: ['清理绿地、河道及背街小巷的垃圾杂物', '整理乱停放的共享单车，清理小广告', '协助巡查公共设施破损情况并上报', '参与社区环境卫生评比与回访'],
  文明劝导: ['在重点路口开展文明交通劝导', '劝导不文明养犬、乱扔垃圾等行为', '发放文明出行倡议书', '记录并反馈不文明现象点位'],
  default: ['按照岗位安排开展志愿服务', '向居民宣传城市管理相关知识', '协助组织方维护现场秩序', '活动结束后协助清理现场'],
}

/* ------------------------------------------------------------------ */
/* 志愿活动（后台管理）                                                */
/* ------------------------------------------------------------------ */
export type ActivityStatus = '进行中' | '即将开始' | '报名中' | '未开始' | '已结束' | '已取消' | '待审核'
export interface Activity {
  id: number
  name: string
  type: string
  region: string
  start: string
  end: string
  recruit: number
  signed: number
  status: ActivityStatus
  org: string
  img: string
  rated?: boolean
}

const baseActivities: Omit<Activity, 'id' | 'org'>[] = [
  { name: '垃圾分类宣传进社区', type: '垃圾分类', region: '朝阳区', start: '2024-06-01 09:00', end: '2024-06-01 11:30', recruit: 30, signed: 28, status: '进行中', img: act3 },
  { name: '社区环境清洁行动', type: '环境整治', region: '海淀区', start: '2024-06-02 14:00', end: '2024-06-02 17:00', recruit: 50, signed: 42, status: '即将开始', img: act1 },
  { name: '垃圾分类知识讲座', type: '宣传教育', region: '西城区', start: '2024-06-05 10:00', end: '2024-06-05 12:00', recruit: 100, signed: 86, status: '报名中', img: act6 },
  { name: '城市文明劝导志愿活动', type: '文明劝导', region: '东城区', start: '2024-06-08 09:00', end: '2024-06-08 11:00', recruit: 20, signed: 15, status: '进行中', img: act4 },
  { name: '公园环境维护', type: '环境整治', region: '丰台区', start: '2024-06-10 08:00', end: '2024-06-10 12:00', recruit: 40, signed: 32, status: '报名中', img: act5 },
  { name: '垃圾分类入户宣传', type: '垃圾分类', region: '石景山区', start: '2024-06-12 14:00', end: '2024-06-12 17:00', recruit: 60, signed: 48, status: '报名中', img: act2 },
  { name: '社区便民服务', type: '社区服务', region: '通州区', start: '2024-06-15 09:00', end: '2024-06-15 12:00', recruit: 30, signed: 26, status: '未开始', img: act9 },
  { name: '河道垃圾清理', type: '环境整治', region: '昌平区', start: '2024-06-18 08:00', end: '2024-06-18 12:00', recruit: 50, signed: 38, status: '报名中', img: act7 },
  { name: '垃圾分类志愿者培训', type: '宣传教育', region: '大兴区', start: '2024-06-20 09:00', end: '2024-06-20 11:00', recruit: 80, signed: 75, status: '已结束', img: act6 },
  { name: '绿色出行文明倡议', type: '文明劝导', region: '顺义区', start: '2024-06-22 14:00', end: '2024-06-22 16:00', recruit: 30, signed: 28, status: '已取消', img: act8 },
]

function buildActivities(): Activity[] {
  const names: [string, string][] = [
    ['桶前值守引导', '垃圾分类'],
    ['背街小巷清洁', '环境整治'],
    ['文明养犬劝导', '文明劝导'],
    ['社区义诊服务', '社区服务'],
    ['厨余垃圾减量宣传', '宣传教育'],
    ['共享单车整理', '环境整治'],
    ['路口文明劝导', '文明劝导'],
    ['垃圾分类积分兑换', '垃圾分类'],
    ['低碳生活主题宣传', '宣传教育'],
    ['楼道杂物清理', '环境整治'],
    ['敬老院陪伴', '社区服务'],
    ['桶站清洗维护', '垃圾分类'],
  ]
  // 状态分布：待审核 8，进行中 10，已结束 23，已取消 5，其余为报名中/即将开始
  const statusPlan: ActivityStatus[] = [
    ...Array.from<ActivityStatus>({ length: 8 }).fill('待审核'),
    ...Array.from<ActivityStatus>({ length: 10 }).fill('进行中'),
    ...Array.from<ActivityStatus>({ length: 23 }).fill('已结束'),
    ...Array.from<ActivityStatus>({ length: 5 }).fill('已取消'),
    '报名中',
    '即将开始',
  ]
  const list: Activity[] = baseActivities.map((a, i) => ({ ...a, id: i + 1, org: orgs[i % orgs.length] }))
  statusPlan.forEach((status, i) => {
    const [name, type] = names[i % names.length]
    const month = status === '已结束' ? 5 : 6
    const day = between(1, 28)
    const h = pick([8, 9, 10, 14, 15])
    const recruit = pick([20, 30, 40, 50, 60, 80])
    list.push({
      id: list.length + 1,
      name,
      type,
      region: districts[i % districts.length],
      start: `2024-${pad(month)}-${pad(day)} ${pad(h)}:00`,
      end: `2024-${pad(month)}-${pad(day)} ${pad(h + 3)}:00`,
      recruit,
      signed: status === '已结束' ? between(recruit - 6, recruit) : between(Math.floor(recruit / 3), recruit),
      status,
      org: orgs[(i + 3) % orgs.length],
      img: photos[i % photos.length],
      rated: status === '已结束' ? rand() > 0.5 : undefined,
    })
  })
  return list
}

export const activities = buildActivities()

/* ------------------------------------------------------------------ */
/* 首页 / 驾驶舱                                                       */
/* ------------------------------------------------------------------ */
export const notices = [
  { id: 1, type: '通知', title: '关于开展2024年城市管理志愿服务月活动的通知', date: '2024-05-28', publisher: '市城市管理委员会', views: 1862 },
  { id: 2, type: '活动', title: '垃圾分类宣传活动报名通知', date: '2024-05-25', publisher: '西城区城管委', views: 1356 },
  { id: 3, type: '公示', title: '志愿者积分规则更新', date: '2024-05-20', publisher: '平台运营中心', views: 986 },
  { id: 4, type: '通知', title: '系统升级维护通知', date: '2024-05-18', publisher: '平台运营中心', views: 742 },
  { id: 5, type: '活动', title: '环境整治专项行动开始报名', date: '2024-05-15', publisher: '朝阳区城管委', views: 1120 },
  { id: 6, type: '公示', title: '2024年第一季度优秀志愿者名单公示', date: '2024-05-10', publisher: '市城市管理委员会', views: 2304 },
  { id: 7, type: '通知', title: '关于规范志愿服务时长记录的通知', date: '2024-05-06', publisher: '平台运营中心', views: 856 },
  { id: 8, type: '活动', title: '“桶前值守”志愿岗位招募', date: '2024-04-28', publisher: '海淀区城管委', views: 1468 },
  { id: 9, type: '通知', title: '垃圾分类志愿者线上培训课程上线', date: '2024-04-20', publisher: '平台运营中心', views: 1690 },
  { id: 10, type: '公示', title: '星级志愿者评定结果公示', date: '2024-04-12', publisher: '市城市管理委员会', views: 1203 },
]

export const noticeColor: Record<string, string> = { 通知: 'blue', 活动: 'orange', 公示: 'cyan' }

export const schedules = [
  { day: '01', month: '06月', title: '垃圾分类宣传进社区', time: '09:00 - 11:30', place: '朝阳区 望京街道', projectId: 3 },
  { day: '02', month: '06月', title: '社区环境清洁行动', time: '14:00 - 17:00', place: '海淀区 中关村街道', projectId: 1 },
  { day: '05', month: '06月', title: '垃圾分类知识讲座', time: '10:00 - 12:00', place: '西城区 新街口社区', projectId: 6 },
  { day: '08', month: '06月', title: '城市文明劝导志愿活动', time: '09:00 - 11:00', place: '东城区 王府井街道', projectId: 4 },
]

export const latestActivities = [
  { title: '垃圾分类宣传进社区', tags: ['垃圾分类', '社区服务'], time: '2024-06-01 09:00', place: '朝阳区 望京街道 光华里社区', status: '报名中', img: act3, projectId: 3 },
  { title: '社区环境清洁行动', tags: ['环境整治', '社区服务'], time: '2024-06-02 14:00', place: '海淀区 中关村街道', status: '即将开始', img: act1, projectId: 1 },
  { title: '垃圾分类知识讲座', tags: ['宣传教育', '垃圾分类'], time: '2024-06-05 10:00', place: '西城区 新街口社区', status: '报名中', img: act6, projectId: 6 },
  { title: '城市文明劝导志愿活动', tags: ['文明劝导', '城市管理'], time: '2024-06-08 09:00', place: '东城区 王府井街道', status: '报名中', img: act4, projectId: 4 },
]

export const districtTop10 = [
  ['朝阳区', 186],
  ['海淀区', 158],
  ['西城区', 120],
  ['东城区', 98],
  ['丰台区', 86],
  ['石景山区', 75],
  ['昌平区', 62],
  ['通州区', 58],
  ['大兴区', 46],
  ['顺义区', 42],
] as [string, number][]

/* ------------------------------------------------------------------ */
/* 志愿者 / 组织                                                       */
/* ------------------------------------------------------------------ */
const surnames = '张王李刘陈杨赵黄周吴徐孙马朱胡郭何高林罗'
const givenNames = ['志强', '丽娜', '伟', '洋', '静', '敏', '磊', '婷', '军', '芳', '杰', '娟', '涛', '霞', '明', '颖', '浩', '雪', '鹏', '琳']
export const levels = ['一星志愿者', '二星志愿者', '三星志愿者', '四星志愿者', '五星志愿者']

export const volunteers = Array.from({ length: 46 }, (_, i) => {
  const hours = between(4, 290)
  return {
    id: i + 1,
    code: `V2024${String(1001 + i * 37).padStart(6, '0')}`,
    name: surnames[i % surnames.length] + givenNames[(i * 7) % givenNames.length],
    gender: rand() > 0.48 ? '女' : '男',
    age: between(18, 66),
    phone: `1${pick(['38', '39', '58', '86', '77'])}****${between(1000, 9999)}`,
    region: districts[i % districts.length],
    org: orgs[(i * 3) % orgs.length],
    hours,
    times: Math.max(1, Math.floor(hours / 4)),
    points: hours * 10 + between(0, 200),
    level: levels[Math.min(4, Math.floor(hours / 60))],
    trained: rand() > 0.25,
    status: rand() > 0.08 ? '正常' : '停用',
    registered: `2024-0${between(1, 5)}-${pad(between(1, 28))}`,
  }
})

export const organizations = orgs.map((name, i) => ({
  id: i + 1,
  name,
  region: districts[i % districts.length],
  contact: `${surnames[(i * 3) % surnames.length]}老师`,
  phone: `010-${between(6000, 8999)}${between(1000, 9999)}`,
  members: between(80, 420),
  projects: between(5, 26),
  activities: between(30, 90),
  participants: between(400, 1300),
  rating: (4.5 + rand() * 0.5).toFixed(1),
  verified: i !== 7,
  scope: pick(['垃圾分类、环境整治', '文明劝导、社区服务', '助老助残、社区服务', '宣传教育、文化宣传', '环境整治、设施巡查']),
}))

/* ------------------------------------------------------------------ */
/* 个人中心                                                            */
/* ------------------------------------------------------------------ */
export const mySignups = [
  { name: '垃圾分类宣传进社区', time: ['2024-06-01', '09:00-11:30'], region: '朝阳区', status: '进行中', img: act3, projectId: 3 },
  { name: '社区环境清洁行动', time: ['2024-06-05', '14:00-17:00'], region: '海淀区', status: '已通过', img: act1, projectId: 1 },
  { name: '文明劝导志愿活动', time: ['2024-06-08', '09:00-11:00'], region: '西城区', status: '已完成', img: act4, projectId: 4 },
  { name: '公园环境维护', time: ['2024-06-10', '08:00-12:00'], region: '丰台区', status: '已完成', img: act5, projectId: 5 },
  { name: '垃圾分类知识讲座', time: ['2024-06-15', '10:00-12:00'], region: '东城区', status: '已取消', img: act6, projectId: 6 },
]

export const myHours = [
  { date: '2024-06-01', name: '垃圾分类宣传进社区', signIn: '08:52', signOut: '11:35', hours: 2.5, status: '待确认' },
  { date: '2024-05-26', name: '公园环境维护', signIn: '07:55', signOut: '12:02', hours: 4, status: '已确认' },
  { date: '2024-05-18', name: '桶前值守引导', signIn: '18:28', signOut: '20:31', hours: 2, status: '已确认' },
  { date: '2024-05-11', name: '文明劝导志愿活动', signIn: '08:58', signOut: '11:05', hours: 2, status: '已确认' },
  { date: '2024-05-04', name: '社区环境清洁行动', signIn: '14:10', signOut: '17:00', hours: 2.5, status: '异常' },
  { date: '2024-04-27', name: '垃圾分类入户宣传', signIn: '13:57', signOut: '17:03', hours: 3, status: '已确认' },
]

export const myCerts = [
  { name: '优秀志愿者证书', date: '2024-03-12', img: cert1, issuer: '市城市管理委员会' },
  { name: '环保公益证书', date: '2024-05-10', img: cert2, issuer: '朝阳区环保志愿者协会' },
  { name: '文明劝导证书', date: '2024-06-08', img: cert3, issuer: '东城区文明办' },
]

export const myEvaluations = [
  { who: '李老师（活动负责人）', date: '2024-06-10', stars: 5, text: '积极主动，认真负责，服务态度非常好！', activity: '公园环境维护' },
  { who: '王老师（活动负责人）', date: '2024-06-08', stars: 5, text: '劝导耐心细致，居民反馈很好。', activity: '文明劝导志愿活动' },
  { who: '赵老师（活动负责人）', date: '2024-05-18', stars: 4, text: '准时到岗，桶前引导规范。', activity: '桶前值守引导' },
  { who: '陈老师（活动负责人）', date: '2024-05-11', stars: 5, text: '主动帮助新志愿者熟悉岗位，值得表扬。', activity: '社区环境清洁行动' },
  { who: '刘老师（活动负责人）', date: '2024-04-27', stars: 4, text: '宣传讲解清晰，资料发放到位。', activity: '垃圾分类入户宣传' },
]

/* ------------------------------------------------------------------ */
/* 统计                                                                */
/* ------------------------------------------------------------------ */
export const orgTop5 = [
  ['望京街道志愿服务队', 86, 1230],
  ['朝阳区环保志愿者协会', 72, 980],
  ['海淀区文明实践队', 65, 860],
  ['西城区社区志愿服务中心', 58, 720],
  ['丰台区绿色生活志愿队', 50, 680],
] as [string, number, number][]

export const hoursTop5 = [
  ['李志强', '朝阳区环保志愿者协会', 286],
  ['王丽娜', '望京街道志愿服务队', 240],
  ['张伟', '海淀区文明实践队', 220],
  ['刘洋', '西城区社区志愿服务中心', 195],
  ['陈静', '丰台区绿色生活志愿队', 180],
] as [string, string, number][]

export const recentDynamics = [
  ['2024-06-20', '垃圾分类宣传进社区', '朝阳区', 42, '进行中'],
  ['2024-06-18', '公园环境维护行动', '海淀区', 38, '已结束'],
  ['2024-06-15', '关爱老人志愿服务', '东城区', 26, '已结束'],
  ['2024-06-12', '社区文明劝导', '西城区', 30, '已结束'],
  ['2024-06-10', '河道巡河护河行动', '丰台区', 35, '已结束'],
] as [string, string, string, number, string][]

/* ------------------------------------------------------------------ */
/* 垃圾分类专区 / 时长积分 / 系统                                      */
/* ------------------------------------------------------------------ */
export const garbageTemplates = [
  { name: '垃圾分类知识宣传', icon: 'i-ri-megaphone-line', color: '#1a6fe0', desc: '社区广场、小区出入口设宣传点，发放资料、讲解分类知识', duration: '2-3 小时', people: '6-10 人' },
  { name: '居民投放引导', icon: 'i-ri-hand-heart-line', color: '#1fb36c', desc: '投放高峰时段在桶站引导居民正确分类投放', duration: '2 小时', people: '每桶站 2 人' },
  { name: '桶前值守', icon: 'i-ri-delete-bin-6-line', color: '#f7932c', desc: '早晚高峰桶前值守，记录混投情况并现场纠正', duration: '早 7-9 / 晚 18-20', people: '每桶站 1-2 人' },
  { name: '社区主题宣传活动', icon: 'i-ri-community-line', color: '#8a6cf7', desc: '结合宣传周、环境日组织主题活动、游戏互动', duration: '半天', people: '10-20 人' },
  { name: '重点点位协助', icon: 'i-ri-map-pin-line', color: '#f05454', desc: '对混投率高的重点点位开展协助整治与回访', duration: '2-3 小时', people: '4-6 人' },
]

export const garbagePoints = [
  { name: '光华里社区 1 号桶站', street: '朝阳区 望京街道', plan: 4, actual: 4, leader: '王丽娜', time: '07:00-09:00' },
  { name: '光华里社区 2 号桶站', street: '朝阳区 望京街道', plan: 4, actual: 3, leader: '李志强', time: '07:00-09:00' },
  { name: '新街口社区东门桶站', street: '西城区 新街口街道', plan: 3, actual: 3, leader: '刘洋', time: '18:00-20:00' },
  { name: '中关村南区桶站', street: '海淀区 中关村街道', plan: 4, actual: 2, leader: '张伟', time: '18:00-20:00' },
  { name: '方庄芳古园桶站', street: '丰台区 方庄街道', plan: 2, actual: 2, leader: '陈静', time: '07:00-09:00' },
  { name: '八角北路宣传点', street: '石景山区 八角街道', plan: 6, actual: 5, leader: '赵敏', time: '09:00-11:00' },
]

export const serviceRecords = Array.from({ length: 24 }, (_, i) => {
  const a = activities[i % 12]
  const v = volunteers[i]
  const late = rand() > 0.85
  const inMin = late ? between(16, 30) : between(0, 10)
  const early = !late && rand() > 0.9
  const statusPool = ['待确认', '待确认', '已确认', '已确认', '已确认'] as const
  return {
    id: i + 1,
    volunteer: v.name,
    code: v.code,
    activity: a.name,
    date: a.start.slice(0, 10),
    signIn: `${a.start.slice(11, 13)}:${pad(inMin)}`,
    signOut: early ? `${pad(Number(a.end.slice(11, 13)) - 1)}:20` : a.end.slice(11, 16),
    hours: early ? 1.5 : 2.5,
    abnormal: late ? '迟到' : early ? '早退' : '',
    points: early ? 15 : 25,
    status: late || early ? '异常' : pick(statusPool),
  }
})

export const sysUsers = [
  { account: 'admin', name: '张管理员', role: '系统管理员', org: '市城市管理委员会', phone: '138****1024', status: '启用', last: '2024-06-20 09:12' },
  { account: 'cgw_cy', name: '李主任', role: '城市管理部门', org: '朝阳区城管委', phone: '139****3321', status: '启用', last: '2024-06-19 17:40' },
  { account: 'wj_team', name: '王队长', role: '组织管理员', org: '望京街道志愿服务队', phone: '158****7782', status: '启用', last: '2024-06-20 08:03' },
  { account: 'hd_wm', name: '赵老师', role: '组织管理员', org: '海淀区文明实践队', phone: '186****5210', status: '启用', last: '2024-06-18 15:22' },
  { account: 'xc_sq', name: '刘老师', role: '社区工作人员', org: '西城区社区志愿服务中心', phone: '177****9036', status: '停用', last: '2024-05-30 10:46' },
  { account: 'zyz_2024', name: '张志愿者', role: '志愿者', org: '望京街道志愿服务队', phone: '138****6688', status: '启用', last: '2024-06-20 07:58' },
]

export const sysRoles = [
  { name: '系统管理员', code: 'ADMIN', users: 2, desc: '维护用户、组织、角色权限、基础字典和系统参数' },
  { name: '城市管理部门', code: 'CITY_MGR', users: 12, desc: '查看辖区项目、人员规模、服务时长及专题分析' },
  { name: '组织管理员', code: 'ORG_ADMIN', users: 36, desc: '创建项目和活动、审核报名、人员分组、时长确认' },
  { name: '社区工作人员', code: 'COMMUNITY', users: 58, desc: '协助活动组织、签到管理、现场调度' },
  { name: '志愿者', code: 'VOLUNTEER', users: 12586, desc: '查询活动、报名、签到签退、查询服务记录' },
]

export const sysDicts = [
  { name: '服务类型', code: 'service_type', items: serviceTypes.join('、') },
  { name: '活动状态', code: 'activity_status', items: '草稿、招募中、报名截止、进行中、已结束、已取消' },
  { name: '所属区域', code: 'district', items: districts.join('、') },
  { name: '志愿者等级', code: 'volunteer_level', items: levels.join('、') },
  { name: '异常类型', code: 'abnormal_type', items: '迟到、早退、未签到、未签退、人工补录' },
]

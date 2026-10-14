# 城市管理志愿服务平台（静态原型）

根据《城市管理志愿服务系统设计方案》第八章“系统界面设计”中的原型截图实现的可点击静态页面。所有数据为前端 mock，无需后端。

项目骨架基于官方 [element-plus/element-plus-vite-starter](https://github.com/element-plus/element-plus-vite-starter)（Vue 3 + Vite + TypeScript + Element Plus + UnoCSS），在此基础上补充了 vue-router 路由、ECharts 图表和统一的布局与主题。

## 运行

```bash
pnpm install
pnpm dev        # 本地开发
pnpm build      # 构建到 dist/，使用相对路径 + hash 路由，可直接部署到任意静态目录
pnpm preview    # 预览构建结果
```

## 页面与原型对应

| 原型（Word 截图） | 路由 | 文件 |
| --- | --- | --- |
| 图3 系统首页（综合驾驶舱） | `#/dashboard` | `src/views/dashboard/index.vue` |
| 图4 志愿服务项目列表 | `#/project/list` | `src/views/project/list.vue` |
| 图5 志愿项目详情及报名页 | `#/project/detail/1` | `src/views/project/detail.vue` |
| 图6 志愿者个人中心 | `#/personal/home` | `src/views/personal/index.vue` |
| 图7 后台活动管理页 | `#/activity/list` | `src/views/activity/list.vue` |
| 图8 数据统计分析页 | `#/statistics` | `src/views/statistics/index.vue` |

原型中几张截图的菜单不一致，这里合并为一套统一菜单（`src/router/menu.ts`），菜单下的其他页面也都可以点击访问：

- 首页
- 志愿项目：项目列表 / 项目发布 / 项目审核（项目详情从列表进入）
- 志愿活动：活动列表 / 活动发布 / 活动审核（报名审核、活动发布审核）/ 活动评价
- 志愿者管理、志愿组织、垃圾分类专区、时长积分管理、数据统计分析、通知公告
- 个人中心：我的主页 / 我的报名 / 我的时长 / 我的证书 / 我的评价
- 系统管理：用户、角色权限、数据字典、系统参数、操作日志

头部右侧身份随页面切换：志愿者端页面（项目详情、个人中心）显示“张志愿者”，管理端页面显示“张管理员”；副标题按页面显示“志愿同行 · 共建美好城市 / 志愿项目详情 / 管理后台”。

## 主要交互

- 项目列表：按名称、类型、区域、状态、时间、组织筛选，分类 tab、分页，卡片进入详情；头部搜索框会跳转到项目列表并带上关键词
- 项目详情：立即报名（确认弹窗）、收藏、分享、查看地图、详情 tab 切换、相关项目推荐
- 活动管理：筛选、状态 tab、分页；查看（抽屉）、编辑（进入发布表单）、签到管理（补录签到）、取消、复制、删除、更多菜单
- 个人中心：tab 与左侧子菜单联动，编辑资料弹窗，证书预览
- 数据统计：分析维度 tab、时长趋势时间范围切换、导出报表
- 审核 / 评价 / 时长确认：通过、驳回、候补、批量操作、评分、人工补录修正

## 目录

```
src/
  assets/img/     原型截图中裁切的图片素材（活动照片、横幅、地图、证书、头像等）
  components/     EChart、SoftTag、StatTile、PageHead、PublishForm 等通用组件
  layouts/        头部、侧边菜单、整体布局
  mock/           静态演示数据
  router/         路由与统一菜单
  styles/         主题色与全局样式
  views/          各业务页面
```

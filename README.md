markdown
# 🏥 DIDI 陪诊服务平台

> 连接患者与陪诊师的 O2O 医疗服务系统 | 包含 C 端 H5 应用 + B 端管理后台

[![Vue3](https://img.shields.io/badge/Vue-3.4-42b883)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff)](https://vitejs.dev/)
[![Vant](https://img.shields.io/badge/Vant-4.0-00aaff)](https://vant-ui.github.io/)
[![ElementPlus](https://img.shields.io/badge/Element%20Plus-2.4-409eff)](https://element-plus.org/)

---

## 📖 项目简介

DIDI 陪诊平台是一款面向患者与陪诊师的 **O2O 医疗陪诊服务系统**，实现患者在线预约陪诊师、选择医院、下单支付，以及管理员对陪护师、订单的统一调度管理。项目采用前后端分离架构，C 端提供流畅的 H5 移动体验，B 端提供高效的 PC 管理后台。

---

## ✨ 核心功能

### 👤 C 端用户系统（H5 应用）

| 模块         | 功能说明                                                                 |
| ------------ | ------------------------------------------------------------------------ |
| 用户登录     | 用户名 + 密码登录、Token 身份验证、用户信息本地缓存                       |
| 首页         | 医院列表搜索、轮播图广告、快捷入口导航、医院详情查看                     |
| 订单创建     | 选择医院/时间/陪诊师、填写接送地址与联系电话、服务需求、微信二维码支付   |
| 订单管理     | 订单列表（全部/待支付/待服务/已完成/已取消）、订单详情、状态跟踪、支付倒计时 |
| 个人中心     | 用户信息展示、订单快捷入口、服务对象管理、分享转发、退出登录             |

### 🖥️ B 端管理后台

| 模块         | 功能说明                                                                 |
| ------------ | ------------------------------------------------------------------------ |
| 控制台       | 系统数据概览、统计报表展示                                               |
| 权限管理     | 账号管理（管理员信息维护、权限分配）、菜单权限配置（RBAC）               |
| 陪护师管理   | 信息 CRUD、头像上传、状态（生效/失效）、分页列表                         |
| 订单管理     | 订单列表查询（支持订单号搜索）、订单详情查看、服务状态更新（完成服务）   |

---

## 🛠️ 技术栈

| 技术                | 说明                         |
| ------------------- | ---------------------------- |
| **前端框架**        | Vue3 + Composition API       |
| **构建工具**        | Vite                         |
| **路由管理**        | Vue Router                   |
| **状态管理**        | Vuex + 持久化插件            |
| **HTTP 请求**       | Axios（封装拦截器）          |
| **UI 组件库**       | Vant UI（H5） + Element Plus（后台） |
| **样式预处理**      | Less                         |
| **代码规范**        | ESLint + Prettier（推荐）    |
| **自动导入**        | unplugin-auto-import / unplugin-vue-components |

---

## 🚀 快速开始

### 环境要求
- Node.js >= 16
- npm / yarn / pnpm

### 克隆项目
```bash
git clone https://github.com/xy-b612/-Accompanying-medical-system.git
cd -Accompanying-medical-system
安装依赖并运行
1️⃣ C 端 H5 应用（pz-H5）
bash
cd pz-H5
npm install
npm run dev          # 开发环境访问 http://localhost:5173
npm run build        # 生产构建
2️⃣ B 端管理后台（pzadmin）
bash
cd pzadmin
npm install
npm run dev          # 开发环境访问 http://localhost:5174
npm run build        # 生产构建
环境变量配置
在各自项目根目录创建 .env.development 文件：

env
# API 基础地址（请按实际后端地址修改）
VITE_API_BASE_URL = http://localhost:3000/api
若需解决跨域问题，可在 vite.config.js 中配置 proxy。

📁 项目结构（示例）
text
didi-peizhen/
├── pz-H5/                   # C 端 H5 应用
│   ├── src/
│   │   ├── api/             # 接口请求
│   │   ├── assets/          # 静态资源
│   │   ├── components/      # 公共组件
│   │   ├── router/          # 路由配置（含守卫）
│   │   ├── store/           # Vuex 模块
│   │   ├── views/           # 页面组件
│   │   ├── utils/           # Axios 封装、工具函数
│   │   └── App.vue
│   ├── .env.development
│   ├── vite.config.js
│   └── package.json
├── pzadmin/                 # B 端管理后台
│   ├── src/
│   │   ├── api/             # 后台接口
│   │   ├── components/      # 通用组件（表格、表单等）
│   │   ├── layout/          # 布局（侧边栏 + 头部）
│   │   ├── router/          # 动态路由 + 权限控制
│   │   ├── store/           # 管理员/权限状态
│   │   ├── views/           # 页面（陪护师管理、订单管理、权限等）
│   │   └── ...
│   └── ...
└── README.md
🔥 技术亮点
✅ 组件化与 Composition API：高复用性、逻辑清晰

✅ 自动导入：unplugin-auto-import 与 unplugin-vue-components 减少样板代码

✅ RBAC 权限模型：动态菜单、角色权限分配（后台）

✅ 微信支付集成：生成二维码完成支付流程，前端处理支付倒计时

✅ 路由守卫：登录鉴权、未登录跳转、动态路由加载

✅ Axios 封装：请求/响应拦截器、Token 自动注入、错误统一处理

✅ Vuex 持久化：刷新保持用户登录状态

✅ 响应式适配：H5 移动端适配（rem/vw）+ 后台 PC 端自适应

📌 业务流程图（简述）
用户端：首页浏览医院 → 选择陪诊师/时间 → 填写信息 → 微信支付 → 等待服务

管理端：维护陪护师信息 → 查看订单 → 更新服务状态 → 完成订单

📸 部分界面预览
![C端首页](/image/C端首页.png)		
![订单创建](/image/订单创建.png)	
![陪护师管理](/image/陪护师管理.png)

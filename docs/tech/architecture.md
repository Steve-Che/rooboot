# 平台技术架构说明（V1）

## 1. 工程分层
- `apps/web`：Next.js Web 应用，包含 C 端与 B 端页面和 API。
- `packages/domain`：领域模型、类型定义、业务常量。
- `packages/ui`：复用 UI 组件。
- `prisma/schema.prisma`：数据模型与关系定义。

## 2. 模块边界
- 设备域：设备档案、机型、所有权流转
- 履约域：检测工单、检测报告、维修工单、配件
- 交易域：挂单、报价、成交、纠纷
- 治理域：风险事件、审计日志、角色权限

## 3. 环境策略
- 开发：本地 PostgreSQL + 本地 Next.js。
- 预发：Vercel Preview + 独立 staging 数据库。
- 生产：Vercel Production + prod 数据库隔离。

## 4. 安全策略
- 接口按角色做最小权限控制。
- 关键业务动作保留审计日志。
- 风险事件与交易争议数据长期可追溯。

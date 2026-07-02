# 机器人检测维保与二手交易平台（中国市场）

基于 Next.js + Vercel + GitHub 的机器人全生命周期服务平台，覆盖：
- 设备档案管理
- 检测与维保工单
- 二手机器人信息撮合
- 门店运营后台

## 项目结构
- `apps/web`: Next.js Web 应用
- `packages/domain`: 领域模型与示例数据
- `packages/ui`: 可复用 UI 组件
- `prisma/schema.prisma`: 数据模型定义
- `docs/product`: 产品方案与标准文档
- `docs/operations`: 运营与试点执行文档

## 本地启动
1. 复制环境变量
   - `cp .env.example .env.local`
2. 安装依赖
   - `npm install`
3. 启动本地 PostgreSQL（Prisma dev）
   - `npm run db:start`
4. 生成首次迁移 SQL（已提供初始文件，可按需重新生成）
   - `npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script --output prisma/migrations/20260702114000_init_real_postgres_auth_workflow/migration.sql`
5. 同步 schema 到数据库
   - `npx prisma db push`
6. 填充种子数据
   - `npm run prisma:seed`
7. 生成 Prisma Client
   - `npm run prisma:generate`
8. 启动项目
   - `npm run dev`

## 登录测试账号
- C端：`13800000001 / Passw0rd!`
- 店长：`13800000002 / Passw0rd!`
- 技师：`13800000003 / Passw0rd!`
- 运营：`13800000004 / Passw0rd!`

## 部署与 CI/CD

- **GitHub 仓库**：https://github.com/Steve-Che/rooboot
- **生产环境**：https://rooboot.vercel.app
- **自动部署**：已连接 Vercel ↔ GitHub
  - 推送到 `main` → 自动部署 Production
  - 推送到其他分支 / 打开 PR → 自动创建 Preview 部署
- **GitHub Actions**：`.github/workflows/ci.yml` 在 push/PR 时执行 lint、typecheck、build、prisma validate

### Vercel 环境变量（Production / Preview）

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | Neon PostgreSQL 连接串（pooler） |
| `NEXTAUTH_SECRET` | NextAuth 会话密钥 |
| `NEXTAUTH_URL` | 生产域名，如 `https://rooboot.vercel.app` |

Neon 集成会自动写入 `DATABASE_URL` 等变量。首次接入生产库后执行：

```bash
DATABASE_URL="..." npx prisma migrate deploy
DATABASE_URL="..." npm run prisma:seed
```

## 关键文档
- `docs/product/launch-scope.md`
- `docs/product/mvp-prd.md`
- `docs/product/inspection-standard-v1.md`
- `docs/product/pricing-rule-v1.md`
- `docs/tech/architecture.md`

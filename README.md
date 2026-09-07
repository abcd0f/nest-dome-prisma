# NestJS + Prisma

基于 NestJS + Prisma + Fastify 的企业级后端项目骨架。

## 技术栈

| 类别      | 技术            |
| --------- | --------------- |
| 框架      | NestJS 11       |
| HTTP 平台 | Fastify         |
| ORM       | Prisma 7        |
| 数据库    | MySQL           |
| 日志      | Pino            |
| API 文档  | Swagger/OpenAPI |

## 快速开始

### 环境要求

- Node.js 18+
- pnpm (推荐)
- MySQL 5.7+

### 安装

```bash
pnpm install
```

### 环境配置

创建 `.env` 文件：

```env
# 应用配置
APP_NAME=nest-prisma
APP_PORT=3000
API_PREFIX=/api
APP_RES_MODE=normal

# 数据库
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dbname
DB_USERNAME=user
DB_PASSWORD=password

# 日志
LOGGER_LEVEL=info
LOGGER_DIR=./logs
LOGGER_CONSOLE=true
```

### 启动

```bash
# 开发模式
pnpm start:dev

# 生产模式
pnpm build && pnpm start:prod
```

### 访问

- 本地: http://localhost:3000
- API 文档: http://localhost:3000/api/docs

## 项目结构

```
├── apps/gateway/                   # 唯一单体应用入口与业务模块
│   └── src/
│       ├── main.ts                 # HTTP 启动入口
│       ├── app.module.ts           # 根模块与依赖装配
│       └── modules/                # health/list/files/monitor 业务模块
├── libs/                           # 可复用基础设施库
│   ├── common/                     # DTO、类型、日志、适配器
│   ├── config/                     # 集中式配置模块与配置定义
│   ├── core/                       # 管道、拦截器、过滤器、守卫
│   ├── database/                   # Prisma 服务与模块
│   └── utils/                      # 无状态工具函数
├── prisma/                         # Prisma 配置与迁移
│   ├── schema.prisma               # 数据模型定义
│   └── generated/                  # 生成的 Client 代码
├── scripts/rustfs/                 # RustFS Docker Compose 与启动脚本
├── public/file-manager.html        # RustFS 文件管理前端示例
├── logs/                           # 日志目录
├── .env                            # 环境变量
├── package.json                    # 项目依赖
└── tsconfig.json                   # TypeScript 配置
```

## 常用命令

```bash
# 开发
pnpm start:dev          # 开发模式 (热重载)
pnpm start:debug        # 调试模式

# 构建
pnpm build              # 构建生产版本

# 数据库
pnpm db:generate        # 生成 Prisma Client
pnpm db:migrate         # 执行数据库迁移

# 代码质量
pnpm lint               # 代码检查与修复
pnpm format             # 代码格式化
```

## API 模块

| 模块    | 路径         | 描述           |
| ------- | ------------ | -------------- |
| List    | /api/list    | 基础 CRUD 示例 |
| Files   | /api/files   | RustFS 文件上传、下载、删除 |
| Monitor | /api/monitor | 服务器监控     |

## Prisma 命令

```bash
# 初始化
npx prisma init

# 生成 Client
npx prisma generate

# 迁移数据库
npx prisma migrate dev --name <名称>

# 可视化数据库管理
npx prisma studio
```

### Prisma 指令说明

| 指令     | 说明                          |
| -------- | ----------------------------- |
| init     | 创建 schema 文件              |
| generate | 根据 schema 生成 client 代码  |
| db       | 同步数据库和 schema           |
| migrate  | 生成数据表结构更新的 sql 文件 |
| studio   | 用于 CRUD 的图形化界面        |
| validate | 检查 schema 语法错误          |
| format   | 格式化 schema 文件            |
| version  | 版本信息                      |

## NestJS CLI

### 命令格式

```bash
nest <command> [options]
```

### 常用命令

| 命令              | 说明           |
| ----------------- | -------------- |
| nest new [name]   | 创建新项目     |
| nest build        | 构建项目       |
| nest start        | 启动应用       |
| nest g res [name] | 生成 CRUD 资源 |

### 生成模板

```bash
nest g co <name>        # 控制器
nest g s <name>         # 服务
nest g mo <name>        # 模块
nest g res <name>       # 完整 CRUD
nest g gu <name>        # 守卫
nest g f <name>         # 过滤器
nest g itc <name>       # 拦截器
nest g pi <name>        # 管道
```

## 附录

### 推荐工具

- **Prisma Studio**: 可视化数据库管理 (`npx prisma studio`)
- **Postman / Apifox**: API 调试工具
- **VS Code 插件**: Prisma, ESLint, Prettier

### 相关文档

### RustFS

```bash
# 在根目录 .env.development 中配置开发环境 RustFS 密钥
pnpm rustfs:dev
# 生产环境
pnpm rustfs:prod
# 查看状态、日志、停止服务
pnpm rustfs:status
pnpm rustfs:logs
pnpm rustfs:down
# 通用入口：参数会透传给 Docker Compose
pnpm rustfs -- --environment production up -d
```

RustFS 命令由 `package.json` 统一暴露，跨平台入口是 `scripts/rustfs/start-rustfs.mjs`，不依赖 Bash 或 PowerShell。脚本根据 `NODE_ENV` 或 `--environment` 读取根目录 `.env.<环境>`，不存在时回退到根目录 `.env`；不传 Docker Compose 参数时默认执行 `up -d`。NestJS 应用使用相同的环境选择规则。开发和生产环境可以使用不同的 RustFS 凭据、Bucket 和 Endpoint，`scripts/rustfs` 下不保存环境文件。RustFS S3 API 默认监听 `127.0.0.1:9000`，控制台监听 `127.0.0.1:9001`。前端示例位于 `public/file-manager.html`，页面会自动探测 `/api` 或 `/dev` 前缀，应用启动后可通过 `http://localhost:8848/file-manager.html` 访问。

- [NestJS 官方文档](https://docs.nestjs.com/)
- [Prisma 官方文档](https://www.prisma.io/docs/)
- [Fastify 官方文档](https://www.fastify.io/docs/latest/)
- [class-validator 文档](https://github.com/typestack/class-validator)

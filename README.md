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
DATABASE_URL=mysql://user:password@localhost:3306/dbname

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
├── prisma/                         # Prisma 配置与迁移
│   ├── schema.prisma               # 数据模型定义
│   └── generated/                  # 生成的 Client 代码
├── src/                            # 应用源代码
│   ├── config/                     # 配置文件
│   │   ├── app.config.ts           # 应用配置
│   │   ├── file.config.ts          # 文件配置
│   │   └── swagger.config.ts       # Swagger 配置
│   ├── common/                     # 公共模块
│   │   ├── adapters/               # 适配器 (Fastify)
│   │   ├── dto/                    # DTO 基类
│   │   ├── logger/                 # 日志 (Pino)
│   │   ├── types/                  # 类型定义
│   │   └── utils/                  # 工具函数
│   ├── core/                       # 核心模块
│   │   ├── decorators/             # 自定义装饰器
│   │   ├── filters/                # 异常过滤器
│   │   ├── guards/                 # 守卫
│   │   ├── interceptors/           # 拦截器
│   │   └── pipes/                  # 管道
│   ├── database/                   # Prisma 服务
│   ├── modules/                    # 业务模块
│   │   ├── list/                   # 列表 CRUD
│   │   ├── monitor/                # 监控模块
│   │   └── tools/                  # 工具模块 (上传)
│   ├── utils/                      # 工具函数
│   ├── app.module.ts               # 根模块
│   └── main.ts                     # 入口文件
├── uploads/                        # 上传文件目录
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
| Tools   | /api/tools   | 文件上传等工具 |
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

- [NestJS 官方文档](https://docs.nestjs.com/)
- [Prisma 官方文档](https://www.prisma.io/docs/)
- [Fastify 官方文档](https://www.fastify.io/docs/latest/)
- [class-validator 文档](https://github.com/typestack/class-validator)

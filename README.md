# NestJS + Prisma

## 1. 数据库迁移命令

```ts
npx prisma migrate dev --name <迁移名称>

npx prisma migrate dev --name init
```

查看 prisma 的所有指令，使用 `npx prisma -h`

- init：创建 schema 文件
- generate： 根据 schema 文件生成 client 代码
- db：同步数据库和 schema
- migrate：生成数据表结构更新的 sql 文件
- studio：用于 CRUD 的图形化界面，查询 api 的使用方法
- validate：检查 schema 文件的语法错误（vscode 安装 prisma 插件即可）
- format：格式化 schema 文件（vscode 安装 prisma 插件即可）
- version：版本信息

项目结构

```
app/
├── prisma/                         # Prisma 数据库相关
├── src/                            # 应用源代码
│   ├── modules/                    # crud模块
│   ├── common/                     # 公共模块
│   │   ├── decorators/             # 自定义装饰器
│   │   ├── filters/                # 异常过滤器
│   │   ├── guards/                 # 全局守卫
│   │   ├── interceptors/           # 拦截器
│   │   ├── pipes/                  # 管道
│   │   └── middleware/             # 中间件
│   ├── config/                     # 配置文件
│   ├── utils/                      # 工具函数
│   ├── database/                   # 数据库相关
│   ├── app.controller.ts           # 应用根控制器
│   ├── app.module.ts               # 应用根模块
│   ├── app.service.ts              # 应用根服务
│   └── main.ts                     # 应用入口文件
├── test/                           # 测试文件
├── uploads/                        # 文件上传目录
├── .env                            # 环境变量
├── .gitignore                      # Git 忽略文件
├── nest-cli.json                   # NestJS CLI 配置
├── package.json                    # 项目依赖
├── README.md                       # 项目说明
├── tsconfig.json                   # TypeScript 配置
└── tsconfig.build.json             # 构建 TypeScript 配置
```

## @nestjs/cli操作

#### 1. 命令格式

```ts
nest < command > [options];
```

- nest 是 NestJS CLI 的主命令。
- <command> 是具体的子命令，用于执行不同操作（如创建项目、生成文件等）。
- [options] 是可选参数，用于调整命令的行为。

#### 2. 选项（Options）

- -v, --version：显示当前 Nest CLI 的版本号。
- -h, --help：显示 CLI 的使用帮助信息。

#### 3. 可用命令（Commands）

以下是 nest CLI 提供的核心命令及其功能：

- new|n [options] [name]：创建一个新的 NestJS 应用。
- 示例：nest new my-app 会生成一个名为 my-app 的新项目。
- build [options] [apps...]：构建（编译）NestJS 应用，通常用于生产环境部署。
- 示例：nest build 编译当前项目。
- start [options] [app]：运行 NestJS 应用。
- 示例：nest start 启动开发服务器。
- info|i：显示当前 NestJS 项目的详细信息（如依赖、配置等）。
- add [options] <library>：为项目添加对外部库的支持。
- 示例：nest add @nestjs/passport 添加 Passport 库支持。
- generate|g [options] <schematic> [name] [path]：生成 NestJS 项目的特定元素（如控制器、服务等）。
- <schematic> 是要生成的元素类型，[name] 是元素名称，[path] 是生成路径（可选）。

#### 4. 生成命令（generate）的可用模板（Schematics）

generate 命令支持通过 @nestjs/schematics 集合生成多种文件类型。以下是支持的模板及其说明：

| 模板名称      | 别名        | 描述                                 |
| ------------- | ----------- | ------------------------------------ |
| application   | application | 生成一个新的应用工作区               |
| class         | cl          | 生成一个类                           |
| configuration | config      | 生成 CLI 配置文件                    |
| controller    | co          | 生成控制器声明                       |
| decorator     | d           | 生成自定义装饰器                     |
| filter        | f           | 生成过滤器声明                       |
| gateway       | ga          | 生成网关（WebSocket）声明            |
| guard         | gu          | 生成守卫声明                         |
| interceptor   | itc         | 生成拦截器声明                       |
| interface     | itf         | 生成接口                             |
| library       | lib         | 在 monorepo 中生成新库               |
| middleware    | mi          | 生成中间件声明                       |
| module        | mo          | 生成模块声明                         |
| pipe          | pi          | 生成管道声明                         |
| provider      | pr          | 生成提供者（Provider）声明           |
| resolver      | r           | 生成 GraphQL 解析器声明              |
| resource      | res         | 生成 CRUD 资源（包含控制器、服务等） |
| service       | s           | 生成服务声明                         |
| sub-app       | app         | 在 monorepo 中生成子应用             |

`modules`文件夹下生成`crud`

```ts
nest g res user modules
```

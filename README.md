迁移数据库

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
├── prisma/                          # Prisma 数据库相关
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
├── .env                           # 环境变量
├── .gitignore                     # Git 忽略文件
├── nest-cli.json                  # NestJS CLI 配置
├── package.json                   # 项目依赖
├── README.md                      # 项目说明
├── tsconfig.json                  # TypeScript 配置
└── tsconfig.build.json            # 构建 TypeScript 配置
```

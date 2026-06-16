# AGENTS.md - 项目开发指南

## 项目概述

**NestJS + Prisma** 企业级后端项目，采用 **Fastify** 作为 HTTP 适配器，提供高性能、可扩展的 RESTful API 服务。

## 快速开始

### 初始化项目

```bash
pnpm install              # 安装依赖
pnpm db:generate          # 生成 Prisma Client
pnpm start:dev            # 启动开发服务器
```

## 常用命令

### 开发命令

| 命令 | 说明 |
|------|------|
| `pnpm install` | 安装依赖 |
| `pnpm start:dev` | 开发模式启动（热重载） |
| `pnpm start:debug` | 调试模式启动 |

### 构建与部署

| 命令 | 说明 |
|------|------|
| `pnpm build` | 生产构建 |
| `pnpm start:prod` | 生产环境启动 |

### 代码质量

| 命令 | 说明 |
|------|------|
| `pnpm lint` | ESLint 检查并自动修复 |
| `pnpm format` | Prettier 格式化代码 |

### 测试命令

| 命令 | 说明 |
|------|------|
| `pnpm test` | 运行所有单元测试 |
| `pnpm test:watch` | 监听模式运行测试 |
| `pnpm test:cov` | 生成测试覆盖率报告 |
| `pnpm test:e2e` | 端到端测试 |
| `pnpm test --testPathPattern=list.service.spec.ts` | 运行单个测试文件 |

### 数据库命令

| 命令 | 说明 |
|------|------|
| `pnpm db:generate` | 生成 Prisma Client |
| `pnpm db:migrate` | 执行数据库迁移 |

## 代码风格指南

### 1. 格式化配置

| 配置项 | 规则 |
|--------|------|
| 缩进 | 2 空格 |
| 引号 | 单引号 `''` |
| 分号 | 必须使用 |
| 行宽 | 120 字符 |
| 尾随逗号 | 所有可能的位置 |

### 2. TypeScript 规范

- ✅ 启用 `strictNullChecks`
- ✅ 启用 `noUnusedLocals` 和 `noUnusedParameters`
- ✅ 必须显式导出类型，避免使用 `any`
- ✅ 使用 `readonly` 修饰不可变属性

### 3. 导入规范

项目使用路径别名，按以下顺序组织导入：

```typescript
// 1. 外部库
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@nestjs/prisma';

// 2. 项目内部模块
import { UserService } from '@/modules/user/user.service';
import { BaseDto } from '@/common/dto';

// 3. Prisma 实体
import { User } from '@orm/generated/prisma/client';
```

### 4. 命名约定

| 类型 | 规则 | 示例 |
|------|------|------|
| 文件 | kebab-case | `user.service.ts` |
| 类/接口 | PascalCase | `UserService`, `CreateUserDto` |
| 函数/变量 | camelCase | `getUserById`, `userList` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Controller | `{Name}Controller` | `UserController` |
| Service | `{Name}Service` | `UserService` |
| DTO | `{Action}{Name}Dto` | `CreateUserDto`, `UpdateUserDto` |
| 接口 | `I{Name}` 或 `{Name}Interface` | `IUserService` |

### 5. 项目结构

```
src/
├── modules/              # 业务模块（按功能划分）
│   └── user/
│       ├── user.controller.ts
│       ├── user.service.ts
│       ├── user.module.ts
│       └── dto/
│           ├── create-user.dto.ts
│           └── update-user.dto.ts
├── common/              # 公共组件
│   ├── dto/             # 通用 DTO
│   ├── utils/           # 工具函数
│   └── types/           # 类型定义
├── core/                # 核心功能
│   ├── decorators/      # 自定义装饰器
│   ├── filters/         # 异常过滤器
│   ├── guards/          # 认证/授权守卫
│   ├── interceptors/    # 请求/响应拦截器
│   └── pipes/           # 数据转换管道
├── config/              # 配置管理
├── database/            # 数据库相关
└── utils/               # 工具函数
```

### 6. DTO 规范

```typescript
import { IsString, IsEmail, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @IsEnum(UserStatus, { message: '状态值无效' })
  @IsOptional()
  status?: UserStatus;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  id: number;
}
```

### 7. 错误处理

```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

// 业务异常处理
if (!user) {
  throw new HttpException(
    { code: 404, message: '用户不存在' },
    HttpStatus.NOT_FOUND,
  );
}
```

**最佳实践：**
- 使用 `class-validator` 进行请求参数验证
- 使用自定义 `HttpExceptionFilter` 统一处理异常
- 定义业务异常类而非直接抛出 `HttpException`

### 8. 日志规范

```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  async findById(id: number) {
    this.logger.debug(`Fetching user with id: ${id}`);
    // 避免记录敏感信息（密码、token 等）
  }
}
```

**最佳实践：**
- 使用 NestJS 内置 `Logger` 或 `pino`
- 生产环境使用 `pino-http` 记录请求日志
- 不记录敏感信息（密码、token、个人隐私数据）

### 9. API 文档

```typescript
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('用户管理')
@ApiBearerAuth('Authorization')
@Controller('users')
export class UserController {
  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiResponse({ status: 201, description: '用户创建成功', type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    // ...
  }
}
```

### 10. Git 提交规范

```
feat:     新功能
fix:      修复 bug
refactor: 代码重构
docs:     文档更新
style:    格式调整（不影响代码逻辑）
test:     测试相关
chore:    构建/工具链变更
perf:     性能优化
ci:       CI/CD 配置变更
```

**提交示例：**
```
feat(user): 添加用户创建接口
fix(auth): 修复 JWT token 过期验证
refactor(database): 优化数据库连接池配置
```

## 开发工作流

### 代码提交前检查清单

- [ ] 运行 `pnpm lint` 检查代码质量
- [ ] 运行 `pnpm format` 格式化代码
- [ ] 运行 `pnpm test` 确保测试通过
- [ ] 新增模块已在 `app.module.ts` 中注册
- [ ] 数据库变更已使用 Prisma Migration
- [ ] API 接口已添加 Swagger 文档注释
- [ ] 敏感信息已使用环境变量

### 模块开发流程

1. **创建模块结构**
   ```bash
   src/modules/{module-name}/
   ├── {module-name}.controller.ts
   ├── {module-name}.service.ts
   ├── {module-name}.module.ts
   └── dto/
   ```

2. **注册模块**
   ```typescript
   // app.module.ts
   import { UserModule } from '@/modules/user/user.module';
   
   @Module({
     imports: [UserModule],
   })
   export class AppModule {}
   ```

3. **数据库迁移**
   ```bash
   # 修改 schema.prisma 后
   pnpm db:migrate dev --name add_user_table
   pnpm db:generate
   ```

## 常见问题

### Q: 如何添加新的环境变量？
A: 在 `.env` 文件中添加，然后在 `config` 模块中读取，避免在代码中硬编码。

### Q: 如何处理数据库迁移冲突？
A: 
```bash
pnpm db:migrate resolve --rolled-back <migration_name>
pnpm db:migrate dev
```

### Q: 如何调试 NestJS 应用？
A: 使用 `pnpm start:debug` 启动调试模式，然后在 VSCode 中配置调试器连接。

### Q: 如何生成 API 文档？
A: 访问 `http://localhost:3000/api` 查看 Swagger UI（开发环境自动生成）。

## 资源链接

- [NestJS 官方文档](https://docs.nestjs.com)
- [Prisma 官方文档](https://www.prisma.io/docs)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs)
- [Fastify 官方文档](https://www.fastify.io)

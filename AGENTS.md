# AGENTS.md - 项目开发指南

## 项目概述

NestJS + Prisma 企业级后端项目，使用 Fastify 作为 HTTP 适配器。

## 常用命令

```bash
# 开发
pnpm install              # 安装依赖
pnpm start:dev           # 开发模式启动 (热重载)
pnpm start:debug         # 调试模式启动

# 构建
pnpm build               # 生产构建
pnpm start:prod          # 生产环境启动

# 代码质量
pnpm lint                # ESLint 检查并自动修复
pnpm format              # Prettier 格式化代码

# 测试
pnpm test                # 运行所有单元测试
pnpm test:watch          # 监听模式运行测试
pnpm test:cov            # 生成测试覆盖率报告
pnpm test:e2e            # 端到端测试

# 运行单个测试文件
pnpm test --testPathPattern=list.service.spec.ts

# 数据库
pnpm db:generate         # 生成 Prisma Client
pnpm db:migrate          # 执行数据库迁移
```

## 代码风格指南

### 1. 格式化配置

- **缩进**: 2 空格
- **引号**: 单引号 `''`
- **分号**: 必须使用
- **行宽**: 120 字符
- **尾随逗号**: 所有可能的位置

### 2. TypeScript 规范

- 启用 `strictNullChecks`
- 启用 `noUnusedLocals` 和 `noUnusedParameters`
- 必须显式导出类型，避免使用 `any`

### 3. 导入规范

项目使用路径别名：

```typescript
// 正确
import { UserService } from '@/modules/user/user.service';
import { BaseDto } from '@/common/dto';

// Prisma 实体
import { User } from '@orm/generated/prisma/client';
```

### 4. 命名约定

| 类型       | 规则             | 示例                           |
| ---------- | ---------------- | ------------------------------ |
| 文件       | kebab-case       | `user.service.ts`              |
| 类/接口    | PascalCase       | `UserService`, `CreateUserDto` |
| 函数/变量  | camelCase        | `getUserById`, `userList`      |
| 常量       | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`              |
| Controller | {名称}Controller | `UserController`               |
| Service    | {名称}Service    | `UserService`                  |
| DTO        | {名称}Dto        | `CreateUserDto`                |

### 5. 模块组织

```
src/
├── modules/           # 业务模块
│   └── {module}/
│       ├── {module}.controller.ts
│       ├── {module}.service.ts
│       ├── {module}.module.ts
│       └── dto/           # 数据传输对象
├── common/           # 公共组件
│   ├── dto/          # 通用 DTO
│   ├── utils/        # 工具函数
│   └── types/        # 类型定义
├── core/             # 核心功能
│   ├── decorators/   # 装饰器
│   ├── filters/      # 异常过滤器
│   ├── guards/       # 守卫
│   ├── interceptors/ # 拦截器
│   └── pipes/        # 管道
├── config/           # 配置文件
├── database/         # 数据库相关
└── utils/            # 工具函数
```

### 6. DTO 规范

```typescript
// 创建 DTO 示例
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

// 更新 DTO 使用 PartialType
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNumber()
  id: number;
}
```

### 7. 错误处理

- 使用 `class-validator` 进行请求参数验证
- 使用自定义 `HttpExceptionFilter` 统一处理异常
- 业务异常使用 `HttpException` 或自定义异常类

```typescript
// 抛出业务异常
throw new HttpException({ code: 400, message: '用户不存在' }, HttpStatus.BAD_REQUEST);
```

### 8. 日志规范

- 使用 `pino` 日志框架
- 生产环境记录请求日志 (`pino-http`)
- 敏感信息不要记录到日志

### 9. API 文档

- 使用 `@nestjs/swagger` 生成 OpenAPI 文档
- 在 Controller 上使用 `@ApiTags()` 标注分组
- 在 DTO 上使用 JSDoc 和 `@example` 提供示例

```typescript
@ApiTags('用户管理')
@ApiBearerAuth('Authorization')
@Controller('user')
export class UserController {
  /**
   * 创建用户
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // ...
  }
}
```

### 10. Git 提交规范

```
feat: 新功能
fix: 修复 bug
refactor: 代码重构
docs: 文档更新
style: 格式调整
test: 测试相关
chore: 构建/工具链变更
```

## 注意事项

1. 提交代码前必须运行 `pnpm lint` 和 `pnpm format`
2. 新增模块需要在 `app.module.ts` 中注册
3. 数据库变更使用 Prisma Migration
4. 接口必须添加 Swagger 文档注释
5. 避免硬编码，使用配置文件或环境变量

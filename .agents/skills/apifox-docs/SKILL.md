---
name: apifox-docs
description: 生成 Apifox 格式的 API 文档，支持 OpenAPI 3.0 和 Apifox 专属格式。当用户需要导出 API 文档、生成接口文档或需要 Apifox 可导入的格式时使用此 skill。
---

# Generate Apifox API Documentation

此 skill 用于从 NestJS 项目中读取 Controller 和 DTO 信息，生成 Apifox 兼容的 API 文档。

## 使用场景

- 用户需要导出 API 文档
- 用户需要生成 Apifox 可导入的接口文档
- 用户需要 OpenAPI 3.0 / Swagger JSON
- 用户需要将接口文档分享给前端或其他人

## 执行步骤

### Step 1: 查找所有 Controller 文件

使用 glob 工具搜索项目中的 Controller 文件：

```
pattern: src/modules/**/*controller.ts
```

### Step 2: 读取 Controller 内容

对于每个 Controller 文件，使用 Read 工具读取完整内容，分析：

- `@Controller()` 装饰器 → 获取路由前缀
- `@ApiTags()` 装饰器 → 获取接口分组
- `@ApiBearerAuth()` 装饰器 → 判断是否需要认证
- 各方法装饰器 (`@Get`, `@Post`, `@Patch`, `@Delete`) → 获取请求方法和路由
- JSDoc 注释 → 获取接口描述
- `@Param()`, `@Query()`, `@Body()` 装饰器 → 获取参数信息

### Step 3: 查找关联的 DTO 文件

在同目录下查找 `dto/*.ts` 文件，读取并解析：

- 属性类型和验证装饰器
- JSDoc 注释中的 `@example` → 获取示例值
- 继承关系 (如 `PartialType`, `PageQueryDto`)

### Step 4: 生成 Apifox 格式文档

生成 OpenAPI 3.0 格式的 JSON 文件，结构如下：

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "API 文档",
    "version": "1.0.0"
  },
  "paths": {
    "/list": {
      "post": {
        "tags": ["基础列表"],
        "summary": "新增",
        "security": [{ "Bearer": [] }],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/CreateListDto" }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "CreateListDto": {
        "type": "object",
        "properties": {
          "email": { "type": "string", "example": "test@example.com" }
        }
      }
    },
    "securitySchemes": {
      "Bearer": {
        "type": "http",
        "scheme": "bearer"
      }
    }
  }
}
```

### Step 5: 输出文件

将生成的 JSON 写入项目根目录，文件名建议：

- `apifox.json` - Apifox 格式
- `openapi.json` - OpenAPI 标准格式
- `api-docs.json` - 通用格式

## 注意事项

1. 需要解析 class-validator 装饰器 (`@IsString`, `@IsNumber`, `@IsEnum`, `@IsOptional` 等)
2. 需要处理嵌套类型 (如 `PageQueryDto` 的分页参数)
3. 需要读取枚举类型定义
4. 文件上传接口使用 `multipart/form-data`
5. 生成的文档应包含请求参数、响应示例、认证方式等信息

## 示例响应

完成后告知用户：

- 生成的文件路径
- 如何在 Apifox 中导入 (OpenAPI URL 或直接导入 JSON 文件)
- 下一步建议 (如运行 `pnpm lint` 检查代码格式)

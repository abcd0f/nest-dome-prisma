import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';

/**
 * 构造函数，用于初始化验证管道配置
 *
 * 该构造函数配置了数据验证和转换的全局选项，包括：
 * - 启用数据转换
 * - 启用白名单模式
 * - 禁止非白名单属性
 * - 启用错误消息显示
 * - 自定义异常工厂函数
 * - 启用隐式类型转换
 */
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
      exceptionFactory: (errors: ValidationError[]) => {
        // 方案1: 简单字符串格式
        // const errorMessage = errors
        //   .map((err) => Object.values(err.constraints || {}))
        //   .flat()
        //   .join(', ');

        // return new BadRequestException({
        //   success: false,
        //   code: 40001,
        //   msg: errorMessage,
        //   timestamp: new Date().toISOString(),
        // });

        // 方案2: 结构化格式（注释掉上面的代码，使用这个）
        const formattedErrors = errors.map((error: ValidationError) => ({
          field: error.property,
          messages: Object.values(error.constraints || {}),
        }));

        return new BadRequestException({
          code: 400,
          msg: '请求参数验证失败',
          errors: formattedErrors,
        });
      },
      transformOptions: {
        enableImplicitConversion: true,
      },
    });
  }
}

import { BadRequestException, ValidationError, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

/**
 * 验证错误详情
 */
interface ValidationErrorDetail {
  readonly field: string;
  readonly messages: readonly string[];
}

/**
 * 验证错误响应格式
 */
interface ValidationErrorResponse {
  code: number;
  msg: string;
  errors: ValidationErrorDetail[];
}

/**
 * 自定义验证管道
 *
 * 功能特性：
 * - 自动数据类型转换
 * - 白名单过滤，移除未定义的属性
 * - 禁止非白名单属性通过
 * - 结构化错误信息返回（支持嵌套对象）
 * - 支持隐式类型转换
 */
export class CustomValidationPipe extends ValidationPipe {
  constructor(options?: Partial<ValidationPipeOptions>) {
    super({
      // 启用自动类型转换
      transform: true,

      // 启用白名单模式，自动过滤未装饰的属性
      whitelist: true,

      // 当存在非白名单属性时抛出错误
      forbidNonWhitelisted: true,

      // 显示详细的错误信息
      disableErrorMessages: false,

      // 自定义异常工厂
      exceptionFactory: CustomValidationPipe.formatValidationErrors,

      // 启用隐式类型转换（如 '123' -> 123）
      transformOptions: {
        enableImplicitConversion: true,
      },

      // 允许外部传入的选项覆盖默认配置
      ...options,
    });
  }

  /**
   * 格式化验证错误信息
   * @param errors - 验证错误数组
   * @returns BadRequestException 异常实例
   */
  private static formatValidationErrors(errors: ValidationError[]): BadRequestException {
    const formattedErrors = errors.flatMap((error) => CustomValidationPipe.extractErrorDetails(error));

    const response: ValidationErrorResponse = {
      code: 400,
      msg: '请求参数验证失败',
      errors: formattedErrors,
    };

    return new BadRequestException(response);
  }

  /**
   * 简化版错误格式化
   * 返回单一错误消息字符串而非结构化数据
   */
  // private static formatSimpleErrors(errors: ValidationError[]): BadRequestException {
  //   const errorMessage = errors.flatMap((err) => Object.values(err.constraints || {})).join('; ');

  //   return new BadRequestException({
  //     code: 400,
  //     msg: errorMessage || '请求参数验证失败',
  //   });
  // }

  /**
   * 递归提取错误的详细信息（支持嵌套对象）
   * @param error - 单个验证错误
   * @param parentField - 父级字段路径
   * @returns 格式化后的错误详情数组
   */
  private static extractErrorDetails(error: ValidationError, parentField = ''): ValidationErrorDetail[] {
    const field = parentField ? `${parentField}.${error.property}` : error.property;

    const results: ValidationErrorDetail[] = [];

    if (error.constraints) {
      results.push({
        field,
        messages: Object.values(error.constraints),
      });
    }

    if (error.children?.length) {
      for (const child of error.children) {
        results.push(...CustomValidationPipe.extractErrorDetails(child, field));
      }
    }

    return results;
  }
}

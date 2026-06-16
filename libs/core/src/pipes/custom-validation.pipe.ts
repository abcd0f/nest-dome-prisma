import { BadRequestException, ValidationError, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

interface ValidationErrorDetail {
  readonly field: string;
  readonly messages: readonly string[];
}

interface ValidationErrorResponse {
  code: number;
  msg: string;
  errors: ValidationErrorDetail[];
}

export class CustomValidationPipe extends ValidationPipe {
  constructor(options?: Partial<ValidationPipeOptions>) {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
      exceptionFactory: CustomValidationPipe.formatValidationErrors,
      transformOptions: {
        enableImplicitConversion: true,
      },
      ...options,
    });
  }

  private static formatValidationErrors(errors: ValidationError[]): BadRequestException {
    const formattedErrors = errors.flatMap((error) => CustomValidationPipe.extractErrorDetails(error));

    const response: ValidationErrorResponse = {
      code: 400,
      msg: '请求参数验证失败',
      errors: formattedErrors,
    };

    return new BadRequestException(response);
  }

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

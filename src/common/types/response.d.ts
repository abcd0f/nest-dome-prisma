export interface BaseResponse {
  code: number;
  msg: string;
}

export interface ComplexResponse<T = any> extends BaseResponse {
  success: boolean;
  timestamp: string;
  path: string;
  data?: T;
  meta?: PageResult<any>['meta'];
}

export interface SimpleResponse<T = any> extends BaseResponse {
  data?: T;
  meta?: PageResult<any>['meta'];
}

export type ResponseMode = 'simple' | 'complex';

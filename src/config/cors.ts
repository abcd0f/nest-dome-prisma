/**
 * 获取CORS配置选项
 * @see https://docs.nestjs.com/security/cors
 * @returns 返回CORS中间件配置对象，包含跨域访问的相关设置
 */
export function getCorsOption() {
  return {
    origin: '*', // 允许的源
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 允许的方法
    allowedHeaders: ['Authorization', 'content-type'], // 允许的请求头
    exposedHeaders: 'Custom-Header', // 允许的响应头
    credentials: true, // 允许发送凭据
    maxAge: 86400, // 预检请求有效期为 1 天
    optionsSuccessStatus: 200, // 对旧版浏览器返回 200
  };
}

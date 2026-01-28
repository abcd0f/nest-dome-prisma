/**
 * PM2 进程管理配置文件
 * 文档：https://pm2.keymetrics.io/docs/usage/application-declaration/
 */

module.exports = {
  apps: [
    {
      // ========== 基础配置 ==========
      name: 'nest_admin_server', // 应用名称（用于 pm2 命令识别）
      namespace: 'nest_admin_server', // 命名空间（用于分组管理）
      script: 'src/main.js', // 启动文件（编译后的入口文件在 dist/src 下）
      args: '', // 传递给脚本的参数

      // ========== 运行模式 ==========
      exec_mode: 'fork', // 执行模式：fork（单实例）或 cluster（集群模式，充分利用多核 CPU）
      instances: 1, // 实例数量：2 个进程（4 核服务器推荐 2-3 个，留资源给数据库等服务）

      // ========== 监控配置 ==========
      watch: false, // 是否监听文件变化自动重启（生产环境建议关闭）
      ignore_watch: [
        // 监听时忽略的文件
        'node_modules',
        'logs',
        '.git',
      ],

      // ========== 内存管理 ==========
      max_memory_restart: '1024M', // 内存超过 1GB 自动重启（防止内存泄漏）

      // ========== 自动重启配置 ==========
      autorestart: true, // 应用崩溃时自动重启
      max_restarts: 10, // 最大重启次数（防止无限重启）
      min_uptime: '10s', // 应用运行至少 10 秒才算启动成功
      restart_delay: 4000, // 重启延迟时间（毫秒）

      // ========== 日志配置 ==========
      out_file: './logs/out.log', // 标准输出日志文件
      error_file: './logs/error.log', // 错误日志文件
      log_date_format: 'YYYY-MM-DD HH:mm:ss', // 日志时间格式
      merge_logs: true, // 合并多个实例的日志
    },
  ],
};

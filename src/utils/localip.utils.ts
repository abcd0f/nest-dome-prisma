import os from 'node:os';

/**
 * 获取本地IP地址
 *
 * 该函数遍历系统网络接口，查找第一个可用的IPv4地址并返回。
 * 如果找不到合适的网络接口，则返回默认的回环地址'127.0.0.1'。
 *
 * @returns {string} 本地IPv4地址或默认回环地址
 */
export function getLocalIP(): string {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

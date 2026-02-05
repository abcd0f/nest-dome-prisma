import os from 'node:os';

/**
 * 获取所有本地IPv4地址（排除虚拟网卡）
 *
 * @returns IPv4地址数组
 */
export function getLocalIPs(): string[] {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];

  // 常见虚拟网卡和虚拟机网卡前缀/关键词
  const virtualPatterns = [
    /^veth/i, // Docker veth
    /^docker/i, // Docker
    /^br-/i, // Docker bridge
    /^virbr/i, // KVM/libvirt bridge
    /^vmnet/i, // VMware
    /^vbox/i, // VirtualBox
    /^vnic/i, // 虚拟网卡
    /^utun/i, // macOS VPN
    /^tun/i, // VPN tunnel
    /^tap/i, // VPN tap
    /^wsl/i, // WSL
    /^hyperv/i, // Hyper-V
    /^vEthernet/i, // Hyper-V虚拟交换机
    /^lo/i, // loopback (虽然已用internal过滤，但保险起见)
    /^tailscale/i, // Tailscale VPN
    /^wireguard/i, // WireGuard VPN
    /^zt/i, // ZeroTier
  ];

  for (const [name, addrs] of Object.entries(interfaces)) {
    // 检查是否匹配虚拟网卡模式
    const isVirtual = virtualPatterns.some((pattern) => pattern.test(name));
    if (isVirtual) {
      continue;
    }

    for (const iface of addrs ?? []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }

  return ips;
}

/**
 * 获取本地IP地址（兼容旧接口）
 */
export function getLocalIP(): string {
  const ips = getLocalIPs();
  return ips[0] || '127.0.0.1';
}

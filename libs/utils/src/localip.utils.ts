import os from 'node:os';

const VIRTUAL_INTERFACE_PATTERNS = [
  /^veth/i,
  /^docker/i,
  /^br-/i,
  /^virbr/i,
  /^vmnet/i,
  /^vbox/i,
  /^vnic/i,
  /^utun/i,
  /^tun/i,
  /^tap/i,
  /^wsl/i,
  /^hyperv/i,
  /^vEthernet/i,
  /^lo/i,
  /^tailscale/i,
  /^wireguard/i,
  /^zt/i,
];

export function getLocalIPs(): string[] {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];

  for (const [name, addrs] of Object.entries(interfaces)) {
    const isVirtual = VIRTUAL_INTERFACE_PATTERNS.some((pattern) => pattern.test(name));
    if (isVirtual) continue;

    for (const iface of addrs ?? []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }

  return ips;
}

export function getLocalIP(): string {
  const ips = getLocalIPs();
  return ips[0] || '127.0.0.1';
}

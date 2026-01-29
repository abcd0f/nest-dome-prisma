import { exec } from 'node:child_process';
import os, { networkInterfaces } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { Injectable } from '@nestjs/common';

const execPromise = promisify(exec);

/**
 * CPU 统计信息类型
 */
interface CpuStats {
  user: number;
  sys: number;
  idle: number;
  total: number;
  cpuNum: number;
}

/**
 * 磁盘信息类型
 */
export interface DiskInfo {
  dirName: string;
  typeName: string;
  total: string;
  used: string;
  free: string;
  usage: string;
}

@Injectable()
export class ServerService {
  async getInfo() {
    // 获取CPU信息
    const cpu = this.getCpuInfo();
    const mem = this.getMemInfo();
    const sys = {
      computerName: os.hostname(),
      computerIp: this.getServerIP(),
      userDir: path.resolve(__dirname, '..', '..', '..', '..'),
      osName: os.platform(),
      osArch: os.arch(),
    };
    const sysFiles = await this.getDiskStatus();
    const data = {
      cpu,
      mem,
      sys,
      sysFiles,
    };
    return data;
  }

  async getDiskStatus(): Promise<DiskInfo[]> {
    const platform = os.platform();

    try {
      if (platform === 'win32') {
        return await this.getWindowsDiskInfo();
      } else if (platform === 'linux' || platform === 'darwin') {
        return await this.getUnixDiskInfo();
      } else {
        console.warn('Unsupported platform for disk info');
        return [];
      }
    } catch (error) {
      console.error('Error getting disk info:', error);
      return [];
    }
  }

  /**
   * 获取 Windows 磁盘信息
   */
  private async getWindowsDiskInfo(): Promise<DiskInfo[]> {
    const { stdout } = await execPromise('wmic logicaldisk get size,freespace,caption,filesystem');

    const lines = stdout.trim().split('\n').slice(1); // 跳过标题行
    const disks: DiskInfo[] = [];

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 3) {
        const [caption, filesystem, freespace, size] = parts;

        if (size && freespace) {
          const totalBytes = Number.parseInt(size, 10);
          const freeBytes = Number.parseInt(freespace, 10);
          const usedBytes = totalBytes - freeBytes;

          disks.push({
            dirName: caption,
            typeName: filesystem || 'Unknown',
            total: `${this.bytesToGB(totalBytes)}GB`,
            used: `${this.bytesToGB(usedBytes)}GB`,
            free: `${this.bytesToGB(freeBytes)}GB`,
            usage: ((usedBytes / totalBytes) * 100).toFixed(2),
          });
        }
      }
    }

    return disks;
  }

  /**
   * 获取 Unix/Linux/macOS 磁盘信息
   */
  private async getUnixDiskInfo(): Promise<DiskInfo[]> {
    const { stdout } = await execPromise('df -k');

    const lines = stdout.trim().split('\n').slice(1); // 跳过标题行
    const disks: DiskInfo[] = [];

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);

      if (parts.length >= 6) {
        const [filesystem, totalBlocks, usedBlocks, freeBlocks, , mounted] = parts;

        // 跳过特殊文件系统
        if (
          filesystem.startsWith('devtmpfs') ||
          filesystem.startsWith('tmpfs') ||
          filesystem.startsWith('none') ||
          mounted === '/dev' ||
          mounted === '/sys' ||
          mounted === '/proc'
        ) {
          continue;
        }

        const totalBytes = Number.parseInt(totalBlocks, 10) * 1024;
        const usedBytes = Number.parseInt(usedBlocks, 10) * 1024;
        const freeBytes = Number.parseInt(freeBlocks, 10) * 1024;

        disks.push({
          dirName: mounted,
          typeName: filesystem,
          total: `${this.bytesToGB(totalBytes)}GB`,
          used: `${this.bytesToGB(usedBytes)}GB`,
          free: `${this.bytesToGB(freeBytes)}GB`,
          usage: ((usedBytes / totalBytes) * 100).toFixed(2),
        });
      }
    }

    return disks;
  }

  // 获取服务器IP地址
  getServerIP(): string | undefined {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name] ?? []) {
        // 选择外部可访问的IPv4地址
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
  }

  getCpuInfo() {
    const cpus = os.cpus();
    const cpuInfo = cpus.reduce<CpuStats>(
      (info, cpu) => {
        info.cpuNum += 1;
        info.user += cpu.times.user;
        info.sys += cpu.times.sys;
        info.idle += cpu.times.idle;
        info.total += cpu.times.user + cpu.times.sys + cpu.times.idle;
        return info;
      },
      { user: 0, sys: 0, idle: 0, total: 0, cpuNum: 0 },
    );
    const cpu = {
      cpuNum: cpuInfo.cpuNum,
      total: cpuInfo.total,
      sys: ((cpuInfo.sys / cpuInfo.total) * 100).toFixed(2),
      used: ((cpuInfo.user / cpuInfo.total) * 100).toFixed(2),
      wait: 0.0,
      free: ((cpuInfo.idle / cpuInfo.total) * 100).toFixed(2),
    };
    return cpu;
  }

  getMemInfo() {
    // 获取总内存
    const totalMemory = os.totalmem();
    // 获取空闲内存
    const freeMemory = os.freemem();
    // 已用内存 = 总内存 - 空闲内存
    const usedMemory = totalMemory - freeMemory;
    // 使用率 = 1 - 空闲内存 / 总内存
    const memoryUsagePercentage = (((totalMemory - freeMemory) / totalMemory) * 100).toFixed(2);
    const mem = {
      total: this.bytesToGB(totalMemory),
      used: this.bytesToGB(usedMemory),
      free: this.bytesToGB(freeMemory),
      usage: memoryUsagePercentage,
    };
    return mem;
  }

  /**
   * 将字节转换为GB。
   * @param bytes {number} 要转换的字节数。
   * @returns {string} 返回转换后的GB数，保留两位小数。
   */
  bytesToGB(bytes: number): string {
    // 计算字节到GB的转换率
    const gb = bytes / (1024 * 1024 * 1024);
    // 将结果四舍五入到小数点后两位
    return gb.toFixed(2);
  }
}

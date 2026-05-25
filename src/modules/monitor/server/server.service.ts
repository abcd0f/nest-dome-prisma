import { execFile } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { Injectable } from '@nestjs/common';

import { getLocalIP } from '@/utils/localip.utils';

const execFileAsync = promisify(execFile);

const WHITESPACE_REGEX = /\s+/;

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

/**
 * PowerShell Get-CimInstance Win32_LogicalDisk 返回的单条记录
 */
interface PsLogicalDisk {
  DeviceID: string;
  FileSystem: string | null;
  FreeSpace: number | null;
  Size: number | null;
}

@Injectable()
export class ServerService {
  async getInfo() {
    const cpu = this.getCpuInfo();
    const mem = this.getMemInfo();
    const sys = {
      computerName: os.hostname(),
      computerIp: getLocalIP(),
      userDir: path.resolve(__dirname, '..', '..', '..', '..'),
      osName: os.platform(),
      osArch: os.arch(),
    };
    const sysFiles = await this.getDiskStatus();
    return { cpu, mem, sys, sysFiles };
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
   * 获取 Windows 磁盘信息(使用 PowerShell CIM,替代已弃用的 wmic)
   */
  private async getWindowsDiskInfo(): Promise<DiskInfo[]> {
    const { stdout } = await execFileAsync('powershell.exe', [
      '-NoProfile',
      '-NonInteractive',
      '-Command',
      'Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID,FileSystem,FreeSpace,Size | ConvertTo-Json -Compress',
    ]);

    const trimmed = stdout.trim();
    if (!trimmed) return [];

    const parsed = JSON.parse(trimmed) as PsLogicalDisk | PsLogicalDisk[];
    const list = Array.isArray(parsed) ? parsed : [parsed];

    const disks: DiskInfo[] = [];
    for (const item of list) {
      const totalBytes = Number(item.Size ?? 0);
      const freeBytes = Number(item.FreeSpace ?? 0);

      // 跳过无效或未就绪的盘符(如空光驱)
      if (!totalBytes) continue;

      const usedBytes = totalBytes - freeBytes;

      disks.push({
        dirName: item.DeviceID,
        typeName: item.FileSystem || 'Unknown',
        total: `${this.bytesToGB(totalBytes)}GB`,
        used: `${this.bytesToGB(usedBytes)}GB`,
        free: `${this.bytesToGB(freeBytes)}GB`,
        usage: ((usedBytes / totalBytes) * 100).toFixed(2),
      });
    }

    return disks;
  }

  /**
   * 获取 Unix/Linux/macOS 磁盘信息
   */
  private async getUnixDiskInfo(): Promise<DiskInfo[]> {
    const { stdout } = await execFileAsync('df', ['-k']);

    const lines = stdout.trim().split('\n').slice(1); // 跳过标题行
    const disks: DiskInfo[] = [];

    for (const line of lines) {
      const parts = line.trim().split(WHITESPACE_REGEX);

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
    return {
      cpuNum: cpuInfo.cpuNum,
      total: cpuInfo.total,
      sys: ((cpuInfo.sys / cpuInfo.total) * 100).toFixed(2),
      used: ((cpuInfo.user / cpuInfo.total) * 100).toFixed(2),
      wait: 0.0,
      free: ((cpuInfo.idle / cpuInfo.total) * 100).toFixed(2),
    };
  }

  getMemInfo() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercentage = ((usedMemory / totalMemory) * 100).toFixed(2);
    return {
      total: this.bytesToGB(totalMemory),
      used: this.bytesToGB(usedMemory),
      free: this.bytesToGB(freeMemory),
      usage: memoryUsagePercentage,
    };
  }

  /**
   * 将字节转换为GB。
   * @param bytes {number} 要转换的字节数。
   * @returns {string} 返回转换后的GB数，保留两位小数。
   */
  bytesToGB(bytes: number): string {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(2);
  }
}

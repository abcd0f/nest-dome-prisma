import { Expose, Type } from 'class-transformer';

/**
 * CPU 信息 DTO
 */
export class CpuInfoDto {
  /** CPU核心数 */
  @Expose()
  cpuNum: number;

  /** 总计 */
  @Expose()
  total: number;

  /** 系统使用率 */
  @Expose()
  sys: string;

  /** 用户使用率 */
  @Expose()
  used: string;

  /** 等待率 */
  @Expose()
  wait: number;

  /** 空闲率 */
  @Expose()
  free: string;
}

/**
 * 内存信息 DTO
 */
export class MemInfoDto {
  /** 总内存(GB) */
  @Expose()
  total: string;

  /** 已用内存(GB) */
  @Expose()
  used: string;

  /** 空闲内存(GB) */
  @Expose()
  free: string;

  /** 使用率(%) */
  @Expose()
  usage: string;
}

/**
 * 系统信息 DTO
 */
export class SysInfoDto {
  /** 计算机名称 */
  @Expose()
  computerName: string;

  /** 计算机IP */
  @Expose()
  computerIp: string;

  /** 用户目录 */
  @Expose()
  userDir: string;

  /** 操作系统名称 */
  @Expose()
  osName: string;

  /** 操作系统架构 */
  @Expose()
  osArch: string;
}

/**
 * 磁盘信息 DTO
 */
export class DiskInfoDto {
  /** 挂载点 */
  @Expose()
  dirName: string;

  /** 文件系统类型 */
  @Expose()
  typeName: string;

  /** 总大小 */
  @Expose()
  total: string;

  /** 已用大小 */
  @Expose()
  used: string;

  /** 空闲大小 */
  @Expose()
  free: string;

  /** 使用率(%) */
  @Expose()
  usage: string;
}

/**
 * 服务器信息响应 DTO
 */
export class ServerInfoResponseDto {
  /**
   * CPU信息
   * @type {CpuInfoDto}
   */
  @Expose()
  @Type(() => CpuInfoDto)
  cpu: CpuInfoDto;

  /**
   * 内存信息
   * @type {MemInfoDto}
   */
  @Expose()
  @Type(() => MemInfoDto)
  mem: MemInfoDto;

  /**
   * 系统信息
   * @type {SysInfoDto}
   */
  @Expose()
  @Type(() => SysInfoDto)
  sys: SysInfoDto;

  /**
   * 磁盘信息
   * @type {DiskInfoDto[]}
   */
  @Expose()
  @Type(() => DiskInfoDto)
  sysFiles: DiskInfoDto[];
}

import { Expose, Type } from 'class-transformer';

export class CpuInfoDto {
  @Expose()
  cpuNum?: number;

  @Expose()
  total?: number;

  @Expose()
  sys?: string;

  @Expose()
  used?: string;

  @Expose()
  wait?: number;

  @Expose()
  free?: string;
}

export class MemInfoDto {
  @Expose()
  total?: string;

  @Expose()
  used?: string;

  @Expose()
  free?: string;

  @Expose()
  usage?: string;
}

export class SysInfoDto {
  @Expose()
  computerName?: string;

  @Expose()
  computerIp?: string;

  @Expose()
  userDir?: string;

  @Expose()
  osName?: string;

  @Expose()
  osArch?: string;
}

export class DiskInfoDto {
  @Expose()
  dirName?: string;

  @Expose()
  typeName?: string;

  @Expose()
  total?: string;

  @Expose()
  used?: string;

  @Expose()
  free?: string;

  @Expose()
  usage?: string;
}

export class ServerInfoResponseDto {
  @Expose()
  @Type(() => CpuInfoDto)
  cpu?: CpuInfoDto;

  @Expose()
  @Type(() => MemInfoDto)
  mem?: MemInfoDto;

  @Expose()
  @Type(() => SysInfoDto)
  sys?: SysInfoDto;

  @Expose()
  @Type(() => DiskInfoDto)
  sysFiles?: DiskInfoDto[];
}

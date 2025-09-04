export interface UploadFile {
  /** 原始文件名 */
  fileName: string;

  /** 重命名后的文件名 */
  name: string;

  /** 文件存储路径 */
  path: string;

  /** 文件类型，例如 image、video、document */
  type: string;

  /** 上传日期，格式 YYYY-MM-DD */
  currentDate: string;
}

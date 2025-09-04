import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // 初始化向量长度
const FIXED_KEY = crypto
  .createHash('sha256')
  .update('你的固定密钥字符串')
  .digest(); // 32 字节

/**
 * AES 加密
 * @param text 明文
 * @returns base64 加密字符串
 */
export function aesEncrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH); // 每次生成随机 IV
  const cipher = crypto.createCipheriv(ALGORITHM, FIXED_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);

  // 将 IV 拼接到密文前面，方便解密
  return Buffer.concat([iv, encrypted]).toString('base64');
}

/**
 * AES 解密
 * @param encryptedText base64 加密字符串
 * @returns 解密后的明文
 */
export function aesDecrypt(encryptedText: string): string {
  const encryptedBuffer = Buffer.from(encryptedText, 'base64');
  const iv = encryptedBuffer.slice(0, IV_LENGTH);
  const encrypted = encryptedBuffer.slice(IV_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, FIXED_KEY, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

/**
 * 生成 MD5 哈希
 * @param text 明文
 * @returns 32 位小写 MD5 字符串
 */
export function md5(text: string): string {
  return crypto.createHash('md5').update(text, 'utf8').digest('hex');
}

import * as crypto from 'node:crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;
const FIXED_KEY = crypto.createHash('sha256').update('你的固定密钥字符串').digest();

export function aesEncrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, FIXED_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, encrypted]).toString('base64');
}

export function aesDecrypt(encryptedText: string): string {
  const encryptedBuffer = Buffer.from(encryptedText, 'base64');
  const iv = encryptedBuffer.slice(0, IV_LENGTH);
  const encrypted = encryptedBuffer.slice(IV_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, FIXED_KEY, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

export function md5(text: string): string {
  return crypto.createHash('md5').update(text, 'utf8').digest('hex');
}

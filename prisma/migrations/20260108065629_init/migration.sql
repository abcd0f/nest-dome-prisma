/*
  Warnings:

  - You are about to alter the column `createTime` on the `list` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `list` MODIFY `createTime` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updateTime` TIMESTAMP(0) NOT NULL DEFAULT NOW() ON UPDATE NOW();

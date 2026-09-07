/*
  Warnings:

  - You are about to drop the column `createdAt` on the `file_asset` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `file_asset` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `file_asset_bucket_createdAt_idx` ON `file_asset`;

-- DropIndex
DROP INDEX `file_asset_deletedAt_idx` ON `file_asset`;

-- AlterTable
ALTER TABLE `file_asset` DROP COLUMN `createdAt`,
    DROP COLUMN `deletedAt`,
    ADD COLUMN `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `deleteTime` DATETIME(0) NULL;

-- CreateIndex
CREATE INDEX `file_asset_bucket_createTime_idx` ON `file_asset`(`bucket`, `createTime`);

-- CreateIndex
CREATE INDEX `file_asset_deleteTime_idx` ON `file_asset`(`deleteTime`);

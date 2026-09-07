-- CreateTable
CREATE TABLE `file_asset` (
    `id` VARCHAR(191) NOT NULL,
    `bucket` VARCHAR(63) NOT NULL,
    `objectKey` VARCHAR(512) NOT NULL,
    `originalName` VARCHAR(255) NOT NULL,
    `mimeType` VARCHAR(255) NOT NULL,
    `category` VARCHAR(32) NOT NULL,
    `size` BIGINT NOT NULL,
    `etag` VARCHAR(255) NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` DATETIME(0) NULL,

    UNIQUE INDEX `file_asset_objectKey_key`(`objectKey`),
    INDEX `file_asset_bucket_createdAt_idx`(`bucket`, `createdAt`),
    INDEX `file_asset_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

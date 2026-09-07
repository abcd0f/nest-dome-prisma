-- CreateTable
CREATE TABLE `list` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'BANNED') NOT NULL DEFAULT 'ACTIVE',
    `tags` JSON NULL,
    `metadata` JSON NULL,
    `score` INTEGER NOT NULL DEFAULT 0,
    `balance` VARCHAR(191) NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NULL,
    `phone` VARCHAR(20) NULL,
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updateTime` DATETIME(0) NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `list_email_key`(`email`),
    UNIQUE INDEX `list_phone_key`(`phone`),
    INDEX `list_email_phone_idx`(`email`, `phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleteTime` DATETIME(0) NULL,

    UNIQUE INDEX `file_asset_objectKey_key`(`objectKey`),
    INDEX `file_asset_bucket_createTime_idx`(`bucket`, `createTime`),
    INDEX `file_asset_deleteTime_idx`(`deleteTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `operation_log` (
    `id` VARCHAR(191) NOT NULL,
    `operateTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `duration` INTEGER NOT NULL,
    `ip` VARCHAR(64) NULL,
    `requestMethod` VARCHAR(16) NOT NULL,
    `requestUrl` VARCHAR(512) NOT NULL,
    `requestParams` JSON NULL,
    `responseStatus` INTEGER NULL,
    `responseParams` JSON NULL,
    `userId` VARCHAR(64) NULL,
    `username` VARCHAR(128) NULL,
    `departmentId` VARCHAR(64) NULL,
    `departmentName` VARCHAR(128) NULL,
    `module` VARCHAR(128) NULL,
    `operation` VARCHAR(128) NULL,
    `errorMessage` TEXT NULL,

    INDEX `operation_log_operateTime_idx`(`operateTime`),
    INDEX `operation_log_module_operateTime_idx`(`module`, `operateTime`),
    INDEX `operation_log_userId_operateTime_idx`(`userId`, `operateTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

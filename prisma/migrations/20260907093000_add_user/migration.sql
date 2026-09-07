-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(64) NOT NULL,
    `nickname` VARCHAR(128) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(20) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'BANNED') NOT NULL DEFAULT 'ACTIVE',
    `remark` VARCHAR(255) NULL,
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updateTime` DATETIME(0) NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `user_username_key`(`username`),
    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_phone_key`(`phone`),
    INDEX `user_status_deleted_idx`(`status`, `deleted`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

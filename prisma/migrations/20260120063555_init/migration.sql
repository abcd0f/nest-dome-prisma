-- CreateTable
CREATE TABLE `list` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'BANNED') NOT NULL DEFAULT 'ACTIVE',
    `tags` JSON NULL,
    `metadata` JSON NULL,
    `score` INTEGER NOT NULL DEFAULT 0,
    `balance` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NULL,
    `phone` VARCHAR(20) NULL,
    `createTime` DATETIME NOT NULL DEFAULT NOW(),
    `updateTime` TIMESTAMP(0) NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `list_email_key`(`email`),
    UNIQUE INDEX `list_phone_key`(`phone`),
    INDEX `list_email_phone_idx`(`email`, `phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

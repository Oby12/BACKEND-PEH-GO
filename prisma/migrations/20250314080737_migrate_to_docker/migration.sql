-- CreateTable
CREATE TABLE `users` (
    `role` ENUM('WISATAWAN', 'ADMIN') NOT NULL DEFAULT 'WISATAWAN',
    `username` VARCHAR(150) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(150) NOT NULL,
    `token` VARCHAR(150) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,

    UNIQUE INDEX `categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `destinations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cover` MEDIUMBLOB NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `address` VARCHAR(150) NOT NULL,
    `description` TEXT NOT NULL,
    `urlLocation` VARCHAR(200) NOT NULL,
    `categoryId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Picture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pciture` MEDIUMBLOB NOT NULL,
    `destinationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `destinations` ADD CONSTRAINT `destinations_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Picture` ADD CONSTRAINT `Picture_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `destinations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

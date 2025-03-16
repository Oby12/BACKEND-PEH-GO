/*
  Warnings:

  - You are about to drop the `Picture` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Picture` DROP FOREIGN KEY `Picture_destinationId_fkey`;

-- DropTable
DROP TABLE `Picture`;

-- CreateTable
CREATE TABLE `pictures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pciture` MEDIUMBLOB NOT NULL,
    `destinationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pictures` ADD CONSTRAINT `pictures_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `destinations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

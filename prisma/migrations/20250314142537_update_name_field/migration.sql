/*
  Warnings:

  - You are about to drop the column `pciture` on the `pictures` table. All the data in the column will be lost.
  - Added the required column `picture` to the `pictures` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pictures` DROP COLUMN `pciture`,
    ADD COLUMN `picture` MEDIUMBLOB NOT NULL;

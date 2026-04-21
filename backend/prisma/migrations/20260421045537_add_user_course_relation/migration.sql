/*
  Warnings:

  - Added the required column `userId` to the `Courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Courses` ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'draft';

-- AddForeignKey
ALTER TABLE `Courses` ADD CONSTRAINT `Courses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

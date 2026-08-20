/*
  Warnings:

  - You are about to drop the column `checkedInAt` on the `CheckIn` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CheckIn" DROP COLUMN "checkedInAt",
ADD COLUMN     "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

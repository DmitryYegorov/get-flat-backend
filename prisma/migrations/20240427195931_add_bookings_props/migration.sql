/*
  Warnings:

  - You are about to drop the column `ownerApprooved` on the `Bookings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bookings" DROP COLUMN "ownerApprooved",
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "documentId" VARCHAR(255) NOT NULL DEFAULT '',
ADD COLUMN     "documentType" VARCHAR(255) NOT NULL DEFAULT '',
ADD COLUMN     "guestName" VARCHAR(255) NOT NULL DEFAULT '',
ADD COLUMN     "status" VARCHAR(255) NOT NULL DEFAULT 'CREATED',
ADD COLUMN     "total" DECIMAL(65,30) NOT NULL DEFAULT 0;

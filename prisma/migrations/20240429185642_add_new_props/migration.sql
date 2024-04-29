/*
  Warnings:

  - You are about to drop the column `documentId` on the `Bookings` table. All the data in the column will be lost.
  - You are about to drop the column `documentType` on the `Bookings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bookings" DROP COLUMN "documentId",
DROP COLUMN "documentType",
ADD COLUMN     "guestEmail" VARCHAR DEFAULT '',
ADD COLUMN     "guestPhone" VARCHAR DEFAULT '';

-- AlterTable
ALTER TABLE "Realty" ADD COLUMN     "withAnimals" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Reviews" ADD COLUMN     "additions" TEXT;

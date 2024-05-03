/*
  Warnings:

  - You are about to drop the column `realtyId` on the `Reviews` table. All the data in the column will be lost.
  - Added the required column `bookingId` to the `Reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_realtyId_fkey";

-- AlterTable
ALTER TABLE "Reviews" DROP COLUMN "realtyId",
ADD COLUMN     "bookingId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Realty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

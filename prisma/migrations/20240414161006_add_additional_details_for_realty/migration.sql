/*
  Warnings:

  - Added the required column `bathroomCount` to the `Realty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestCount` to the `Realty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Realty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Realty" ADD COLUMN     "bathroomCount" INTEGER NOT NULL,
ADD COLUMN     "guestCount" INTEGER NOT NULL,
ADD COLUMN     "location" JSONB NOT NULL;

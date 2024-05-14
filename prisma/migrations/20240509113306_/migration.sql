/*
  Warnings:

  - You are about to drop the column `isApprooved` on the `Reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reviews" DROP COLUMN "isApprooved",
ADD COLUMN     "status" VARCHAR NOT NULL DEFAULT 'CREATED';

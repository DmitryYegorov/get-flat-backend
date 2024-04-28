/*
  Warnings:

  - You are about to drop the column `to` on the `Messages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_to_fkey";

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "to";

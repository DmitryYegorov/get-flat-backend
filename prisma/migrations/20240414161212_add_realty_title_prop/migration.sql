/*
  Warnings:

  - Added the required column `title` to the `Realty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Realty" ADD COLUMN     "title" VARCHAR NOT NULL;

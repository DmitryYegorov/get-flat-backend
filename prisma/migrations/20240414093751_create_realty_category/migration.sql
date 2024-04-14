/*
  Warnings:

  - Added the required column `categoryId` to the `Realty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Realty" ADD COLUMN     "categoryId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "RealtyCategory" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "icon" VARCHAR(255),
    "description" TEXT NOT NULL,

    CONSTRAINT "RealtyCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Realty" ADD CONSTRAINT "Realty_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "RealtyCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

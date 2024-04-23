/*
  Warnings:

  - You are about to drop the column `type` on the `Realty` table. All the data in the column will be lost.
  - Added the required column `address` to the `Realty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Realty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasKitchen` to the `Realty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasParking` to the `Realty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wcCount` to the `Realty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Realty" DROP COLUMN "type",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "city" JSONB NOT NULL,
ADD COLUMN     "hasKitchen" BOOLEAN NOT NULL,
ADD COLUMN     "hasParking" BOOLEAN NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "kitchenInfo" VARCHAR,
ADD COLUMN     "parkingInfo" VARCHAR,
ADD COLUMN     "wcCount" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Favorites" (
    "id" UUID NOT NULL,
    "realtyId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_realtyId_fkey" FOREIGN KEY ("realtyId") REFERENCES "Realty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

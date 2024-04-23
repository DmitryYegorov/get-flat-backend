-- DropForeignKey
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_realtyId_fkey";

-- DropForeignKey
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_userId_fkey";

-- DropForeignKey
ALTER TABLE "Realty" DROP CONSTRAINT "Realty_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Realty" DROP CONSTRAINT "Realty_ownerId_fkey";

-- AlterTable
ALTER TABLE "Realty" ADD COLUMN     "roomCount" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Realty" ADD CONSTRAINT "Realty_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Realty" ADD CONSTRAINT "Realty_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "RealtyCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_realtyId_fkey" FOREIGN KEY ("realtyId") REFERENCES "Realty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

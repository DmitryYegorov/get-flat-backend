-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_bookingId_fkey";

-- AlterTable
ALTER TABLE "Reviews" ADD COLUMN     "realtyId" UUID;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_realtyId_fkey" FOREIGN KEY ("realtyId") REFERENCES "Realty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

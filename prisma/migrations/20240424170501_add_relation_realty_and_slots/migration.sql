-- AddForeignKey
ALTER TABLE "BookingSlots" ADD CONSTRAINT "BookingSlots_realtyId_fkey" FOREIGN KEY ("realtyId") REFERENCES "Realty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

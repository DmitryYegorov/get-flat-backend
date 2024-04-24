-- AlterTable
ALTER TABLE "Bookings" ADD COLUMN     "ownerApprooved" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "BookingSlots" (
    "id" UUID NOT NULL,
    "realtyId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingSlots_pkey" PRIMARY KEY ("id")
);

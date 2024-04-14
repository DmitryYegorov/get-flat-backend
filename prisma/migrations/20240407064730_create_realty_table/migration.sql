-- CreateTable
CREATE TABLE "Realty" (
    "id" UUID NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "ownerId" UUID NOT NULL,
    "mainPhoto" VARCHAR(255) NOT NULL,
    "price" MONEY NOT NULL,

    CONSTRAINT "Realty_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Realty" ADD CONSTRAINT "Realty_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

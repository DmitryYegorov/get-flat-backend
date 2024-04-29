-- CreateTable
CREATE TABLE "Reviews" (
    "id" UUID NOT NULL,
    "realtyId" UUID NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "authorId" UUID NOT NULL,
    "text" TEXT,
    "advantages" TEXT,
    "disadvantages" TEXT,
    "isAnonymous" BOOLEAN DEFAULT false,
    "isApprooved" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_realtyId_fkey" FOREIGN KEY ("realtyId") REFERENCES "Realty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

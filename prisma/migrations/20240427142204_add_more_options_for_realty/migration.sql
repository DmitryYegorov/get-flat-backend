-- AlterTable
ALTER TABLE "Realty" ADD COLUMN     "bathType" VARCHAR(255) DEFAULT 'bath',
ADD COLUMN     "bathroomIsCombined" BOOLEAN DEFAULT false,
ADD COLUMN     "childrenCount" INTEGER DEFAULT 0,
ADD COLUMN     "hasBreakfast" BOOLEAN DEFAULT false,
ADD COLUMN     "hasDinner" BOOLEAN DEFAULT false,
ADD COLUMN     "hasLunch" BOOLEAN DEFAULT false,
ADD COLUMN     "hasPlayground" BOOLEAN DEFAULT false,
ADD COLUMN     "isAccessible" BOOLEAN DEFAULT false,
ADD COLUMN     "showerCount" INTEGER DEFAULT 0;

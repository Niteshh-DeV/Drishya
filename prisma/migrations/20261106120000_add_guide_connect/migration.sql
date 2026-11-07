-- CreateEnum
CREATE TYPE "GuideStatus" AS ENUM ('draft', 'pending', 'published', 'rejected');

-- CreateTable
CREATE TABLE "GuideProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "about" TEXT NOT NULL DEFAULT '',
    "guidingSince" INTEGER,
    "photoPublicId" TEXT,
    "photoUrl" TEXT,
    "rates" TEXT,
    "phone" TEXT,
    "whatsapp" BOOLEAN NOT NULL DEFAULT false,
    "contactEmail" TEXT,
    "licenceNo" TEXT,
    "status" "GuideStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "reviewNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuideProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuideDistrict" (
    "guideId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "GuideDistrict_pkey" PRIMARY KEY ("guideId","districtId")
);

-- CreateTable
CREATE TABLE "GuideDestination" (
    "guideId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "GuideDestination_pkey" PRIMARY KEY ("guideId","destinationId")
);

-- CreateTable
CREATE TABLE "GuideInterest" (
    "guideId" TEXT NOT NULL,
    "tagName" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "GuideInterest_pkey" PRIMARY KEY ("guideId","tagName")
);

-- CreateTable
CREATE TABLE "GuideLanguage" (
    "guideId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "GuideLanguage_pkey" PRIMARY KEY ("guideId","language")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuideProfile_userId_key" ON "GuideProfile"("userId");

-- CreateIndex
CREATE INDEX "GuideProfile_status_publishedAt_idx" ON "GuideProfile"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "GuideDistrict_districtId_idx" ON "GuideDistrict"("districtId");

-- CreateIndex
CREATE INDEX "GuideDestination_destinationId_idx" ON "GuideDestination"("destinationId");

-- CreateIndex
CREATE INDEX "GuideInterest_tagName_idx" ON "GuideInterest"("tagName");

-- AddForeignKey
ALTER TABLE "GuideProfile" ADD CONSTRAINT "GuideProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideDistrict" ADD CONSTRAINT "GuideDistrict_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "GuideProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideDistrict" ADD CONSTRAINT "GuideDistrict_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideDestination" ADD CONSTRAINT "GuideDestination_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "GuideProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideDestination" ADD CONSTRAINT "GuideDestination_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideInterest" ADD CONSTRAINT "GuideInterest_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "GuideProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideInterest" ADD CONSTRAINT "GuideInterest_tagName_fkey" FOREIGN KEY ("tagName") REFERENCES "InterestTag"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideLanguage" ADD CONSTRAINT "GuideLanguage_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "GuideProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;


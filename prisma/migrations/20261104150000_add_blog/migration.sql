-- CreateEnum
CREATE TYPE "BlogPostStatus" AS ENUM ('draft', 'pending', 'published', 'rejected');

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "coverPublicId" TEXT,
    "coverUrl" TEXT,
    "coverCredit" TEXT,
    "authorName" TEXT NOT NULL,
    "status" "BlogPostStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPostSection" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "heading" TEXT,
    "body" TEXT NOT NULL,
    "imagePublicId" TEXT,
    "imageUrl" TEXT,
    "imageCaption" TEXT,

    CONSTRAINT "BlogPostSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPostDistrict" (
    "postId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,

    CONSTRAINT "BlogPostDistrict_pkey" PRIMARY KEY ("postId","districtId")
);

-- CreateTable
CREATE TABLE "BlogPostDestination" (
    "postId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "BlogPostDestination_pkey" PRIMARY KEY ("postId","destinationId")
);

-- CreateTable
CREATE TABLE "BlogPostTag" (
    "postId" TEXT NOT NULL,
    "tagName" TEXT NOT NULL,

    CONSTRAINT "BlogPostTag_pkey" PRIMARY KEY ("postId","tagName")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_status_publishedAt_idx" ON "BlogPost"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "BlogPostSection_postId_position_idx" ON "BlogPostSection"("postId", "position");

-- CreateIndex
CREATE INDEX "BlogPostDistrict_districtId_idx" ON "BlogPostDistrict"("districtId");

-- CreateIndex
CREATE INDEX "BlogPostDestination_destinationId_idx" ON "BlogPostDestination"("destinationId");

-- CreateIndex
CREATE INDEX "BlogPostTag_tagName_idx" ON "BlogPostTag"("tagName");

-- AddForeignKey
ALTER TABLE "BlogPostSection" ADD CONSTRAINT "BlogPostSection_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPostDistrict" ADD CONSTRAINT "BlogPostDistrict_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPostDistrict" ADD CONSTRAINT "BlogPostDistrict_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPostDestination" ADD CONSTRAINT "BlogPostDestination_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPostDestination" ADD CONSTRAINT "BlogPostDestination_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPostTag" ADD CONSTRAINT "BlogPostTag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPostTag" ADD CONSTRAINT "BlogPostTag_tagName_fkey" FOREIGN KEY ("tagName") REFERENCES "InterestTag"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

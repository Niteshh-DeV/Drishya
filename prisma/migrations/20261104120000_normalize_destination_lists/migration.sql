-- Normalize Destination's list columns into lookup + child tables (1NF/3NF).
--
-- Data is copied from the existing rows, not reseeded, so edits made in the
-- database are kept. Category values are remapped from 79 free-text values
-- to a curated vocabulary of 16; the migration aborts if it meets a value
-- that has no mapping. Old columns are dropped only after everything is copied.

-- ── 1. New tables ────────────────────────────────────────────────────────

-- CreateTable
CREATE TABLE "Category" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "InterestTag" (
    "name" TEXT NOT NULL,

    CONSTRAINT "InterestTag_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Season" (
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "BudgetLevel" (
    "name" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "BudgetLevel_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "DestinationCategory" (
    "destinationId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "DestinationCategory_pkey" PRIMARY KEY ("destinationId","categoryName")
);

-- CreateTable
CREATE TABLE "DestinationInterest" (
    "destinationId" TEXT NOT NULL,
    "tagName" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "DestinationInterest_pkey" PRIMARY KEY ("destinationId","tagName")
);

-- CreateTable
CREATE TABLE "DestinationSeason" (
    "destinationId" TEXT NOT NULL,
    "seasonName" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "DestinationSeason_pkey" PRIMARY KEY ("destinationId","seasonName")
);

-- CreateTable
CREATE TABLE "DestinationAlternateName" (
    "destinationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "DestinationAlternateName_pkey" PRIMARY KEY ("destinationId","name")
);

-- CreateTable
CREATE TABLE "DestinationSource" (
    "id" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "url" TEXT,
    "label" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "DestinationSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DestinationVerification" (
    "destinationId" TEXT NOT NULL,
    "field" TEXT NOT NULL,

    CONSTRAINT "DestinationVerification_pkey" PRIMARY KEY ("destinationId","field")
);

-- CreateIndex
CREATE UNIQUE INDEX "Season_sortOrder_key" ON "Season"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetLevel_rank_key" ON "BudgetLevel"("rank");

-- CreateIndex
CREATE INDEX "DestinationCategory_categoryName_idx" ON "DestinationCategory"("categoryName");

-- CreateIndex
CREATE INDEX "DestinationInterest_tagName_idx" ON "DestinationInterest"("tagName");

-- CreateIndex
CREATE INDEX "DestinationSeason_seasonName_idx" ON "DestinationSeason"("seasonName");

-- CreateIndex
CREATE INDEX "DestinationSource_destinationId_position_idx" ON "DestinationSource"("destinationId", "position");

-- ── 2. Lookup rows (identical to the unions in src/lib/types.ts) ────────

INSERT INTO "Category" ("name") VALUES
  ('Archaeological Site'),
  ('Cave'),
  ('Cultural Heritage'),
  ('Forest & Wildlife'),
  ('Historical Site'),
  ('Lake & Wetland'),
  ('Landmark'),
  ('Meadow'),
  ('Mountain & Trek'),
  ('Park & Recreation'),
  ('Religious Site'),
  ('River'),
  ('Temple'),
  ('Town & Village'),
  ('Viewpoint'),
  ('Waterfall');

INSERT INTO "InterestTag" ("name") VALUES
  ('Culture'), ('History'), ('Religious'), ('Nature'), ('Wildlife'),
  ('Adventure'), ('Trekking'), ('Relaxation'), ('Archaeology');

INSERT INTO "Season" ("name", "sortOrder") VALUES
  ('Spring', 1), ('Summer', 2), ('Monsoon', 3), ('Autumn', 4), ('Winter', 5);

INSERT INTO "BudgetLevel" ("name", "rank") VALUES
  ('Low', 1), ('Low-Medium', 2), ('Medium', 3), ('High', 4);

-- ── 3. Copy list columns into child tables ──────────────────────────────

-- Abort on any category value without a mapping (dropped values map to none).
CREATE TEMP TABLE category_known (old_value TEXT PRIMARY KEY);
INSERT INTO category_known VALUES
  ('Adventure Tourism'),
  ('Ecotourism'),
  ('Natural Attraction'),
  ('Natural Heritage'),
  ('Natural Landscape'),
  ('Nature'),
  ('Roadside Attraction'),
  ('Tourism Development Area'),
  ('Tourist Attraction'),
  ('Temple'),
  ('Hindu Temple'),
  ('Shiva Temple'),
  ('Mountain Shrine'),
  ('Temple & Cultural Site'),
  ('Religious Site'),
  ('Hindu Religious Site'),
  ('Pilgrimage Site'),
  ('Religious Tourism'),
  ('Religious & Cultural Site'),
  ('Cultural & Religious Site'),
  ('Historical Site'),
  ('Heritage Site'),
  ('Ancient Monument'),
  ('Historical Monument'),
  ('Historical Landmark'),
  ('Historical Fort'),
  ('Historical Palace'),
  ('Historical Palace Ruins'),
  ('Historical & Cultural Site'),
  ('Cultural Site & History'),
  ('Historical Settlement'),
  ('Archaeological Site'),
  ('Archaeology Area'),
  ('Cultural Heritage'),
  ('Cultural Site'),
  ('Cultural Attraction'),
  ('Traditional Dance'),
  ('Community Tourism'),
  ('Community Homestay'),
  ('Lake'),
  ('Wetland'),
  ('Lake & Religious Site'),
  ('Sacred Alpine Lake'),
  ('River'),
  ('River Viewpoint'),
  ('Waterfall'),
  ('Cave'),
  ('Underground Wildlife & Forest Area'),
  ('Viewpoint'),
  ('Mountain Viewpoint'),
  ('Alpine Viewpoint'),
  ('Sunrise/Sunset Point'),
  ('Viewpoint / High-Altitude Alpine Grassland Plateau (Patan)'),
  ('Peak'),
  ('Hill'),
  ('Trekking Hill'),
  ('Mountain Pass'),
  ('Mountain Pass / Trekking Route'),
  ('Mountain/Trekking Spot & Wildlife Area'),
  ('Alpine Meadow / Grassland'),
  ('High-altitude alpine pasture'),
  ('National Park'),
  ('Wildlife Area'),
  ('Forest'),
  ('Forest/Wildlife Area'),
  ('Bird Sanctuary'),
  ('Transboundary Biological Corridor'),
  ('Forest/Wildlife Area & Cultural Site'),
  ('Recreational Park'),
  ('Garden'),
  ('Picnic Spot'),
  ('Amusement Park'),
  ('Water Park'),
  ('Market'),
  ('Hill Station'),
  ('Mountain Village'),
  ('Market & Cultural Site'),
  ('Bridge'),
  ('Border Point');

DO $$
DECLARE missing TEXT;
BEGIN
  SELECT string_agg(DISTINCT c, ', ') INTO missing
  FROM "Destination" d, unnest(d."category") AS c
  WHERE c NOT IN (SELECT old_value FROM category_known);
  IF missing IS NOT NULL THEN
    RAISE EXCEPTION 'Unmapped category values: %', missing;
  END IF;
END $$;

CREATE TEMP TABLE category_map (old_value TEXT, new_value TEXT, sub_order INT);
INSERT INTO category_map VALUES
  ('Temple', 'Temple', 0),
  ('Hindu Temple', 'Temple', 0),
  ('Shiva Temple', 'Temple', 0),
  ('Mountain Shrine', 'Temple', 0),
  ('Temple & Cultural Site', 'Temple', 0),
  ('Temple & Cultural Site', 'Cultural Heritage', 1),
  ('Religious Site', 'Religious Site', 0),
  ('Hindu Religious Site', 'Religious Site', 0),
  ('Pilgrimage Site', 'Religious Site', 0),
  ('Religious Tourism', 'Religious Site', 0),
  ('Religious & Cultural Site', 'Religious Site', 0),
  ('Religious & Cultural Site', 'Cultural Heritage', 1),
  ('Cultural & Religious Site', 'Religious Site', 0),
  ('Cultural & Religious Site', 'Cultural Heritage', 1),
  ('Historical Site', 'Historical Site', 0),
  ('Heritage Site', 'Historical Site', 0),
  ('Ancient Monument', 'Historical Site', 0),
  ('Historical Monument', 'Historical Site', 0),
  ('Historical Landmark', 'Historical Site', 0),
  ('Historical Fort', 'Historical Site', 0),
  ('Historical Palace', 'Historical Site', 0),
  ('Historical Palace Ruins', 'Historical Site', 0),
  ('Historical & Cultural Site', 'Historical Site', 0),
  ('Historical & Cultural Site', 'Cultural Heritage', 1),
  ('Cultural Site & History', 'Historical Site', 0),
  ('Cultural Site & History', 'Cultural Heritage', 1),
  ('Historical Settlement', 'Historical Site', 0),
  ('Historical Settlement', 'Town & Village', 1),
  ('Archaeological Site', 'Archaeological Site', 0),
  ('Archaeology Area', 'Archaeological Site', 0),
  ('Cultural Heritage', 'Cultural Heritage', 0),
  ('Cultural Site', 'Cultural Heritage', 0),
  ('Cultural Attraction', 'Cultural Heritage', 0),
  ('Traditional Dance', 'Cultural Heritage', 0),
  ('Community Tourism', 'Cultural Heritage', 0),
  ('Community Homestay', 'Cultural Heritage', 0),
  ('Lake', 'Lake & Wetland', 0),
  ('Wetland', 'Lake & Wetland', 0),
  ('Lake & Religious Site', 'Lake & Wetland', 0),
  ('Lake & Religious Site', 'Religious Site', 1),
  ('Sacred Alpine Lake', 'Lake & Wetland', 0),
  ('Sacred Alpine Lake', 'Religious Site', 1),
  ('River', 'River', 0),
  ('River Viewpoint', 'River', 0),
  ('River Viewpoint', 'Viewpoint', 1),
  ('Waterfall', 'Waterfall', 0),
  ('Cave', 'Cave', 0),
  ('Underground Wildlife & Forest Area', 'Cave', 0),
  ('Viewpoint', 'Viewpoint', 0),
  ('Mountain Viewpoint', 'Viewpoint', 0),
  ('Alpine Viewpoint', 'Viewpoint', 0),
  ('Sunrise/Sunset Point', 'Viewpoint', 0),
  ('Viewpoint / High-Altitude Alpine Grassland Plateau (Patan)', 'Viewpoint', 0),
  ('Viewpoint / High-Altitude Alpine Grassland Plateau (Patan)', 'Meadow', 1),
  ('Peak', 'Mountain & Trek', 0),
  ('Hill', 'Mountain & Trek', 0),
  ('Trekking Hill', 'Mountain & Trek', 0),
  ('Mountain Pass', 'Mountain & Trek', 0),
  ('Mountain Pass / Trekking Route', 'Mountain & Trek', 0),
  ('Mountain/Trekking Spot & Wildlife Area', 'Mountain & Trek', 0),
  ('Mountain/Trekking Spot & Wildlife Area', 'Forest & Wildlife', 1),
  ('Alpine Meadow / Grassland', 'Meadow', 0),
  ('High-altitude alpine pasture', 'Meadow', 0),
  ('National Park', 'Forest & Wildlife', 0),
  ('Wildlife Area', 'Forest & Wildlife', 0),
  ('Forest', 'Forest & Wildlife', 0),
  ('Forest/Wildlife Area', 'Forest & Wildlife', 0),
  ('Bird Sanctuary', 'Forest & Wildlife', 0),
  ('Transboundary Biological Corridor', 'Forest & Wildlife', 0),
  ('Forest/Wildlife Area & Cultural Site', 'Forest & Wildlife', 0),
  ('Forest/Wildlife Area & Cultural Site', 'Cultural Heritage', 1),
  ('Recreational Park', 'Park & Recreation', 0),
  ('Garden', 'Park & Recreation', 0),
  ('Picnic Spot', 'Park & Recreation', 0),
  ('Amusement Park', 'Park & Recreation', 0),
  ('Water Park', 'Park & Recreation', 0),
  ('Market', 'Town & Village', 0),
  ('Hill Station', 'Town & Village', 0),
  ('Mountain Village', 'Town & Village', 0),
  ('Market & Cultural Site', 'Town & Village', 0),
  ('Market & Cultural Site', 'Cultural Heritage', 1),
  ('Bridge', 'Landmark', 0),
  ('Border Point', 'Landmark', 0);

INSERT INTO "DestinationCategory" ("destinationId", "categoryName", "position")
SELECT "destinationId", new_value,
       (row_number() OVER (PARTITION BY "destinationId" ORDER BY first_seen))::int - 1
FROM (
  SELECT d."id" AS "destinationId", m.new_value, min(c.ord * 10 + m.sub_order) AS first_seen
  FROM "Destination" d
  CROSS JOIN LATERAL unnest(d."category") WITH ORDINALITY AS c(value, ord)
  JOIN category_map m ON m.old_value = c.value
  GROUP BY d."id", m.new_value
) mapped;

INSERT INTO "DestinationInterest" ("destinationId", "tagName", "position")
SELECT d."id", t.value, (min(t.ord) - 1)::int
FROM "Destination" d
CROSS JOIN LATERAL unnest(d."interestTags") WITH ORDINALITY AS t(value, ord)
GROUP BY d."id", t.value;

INSERT INTO "DestinationSeason" ("destinationId", "seasonName", "position")
SELECT d."id", s.value, (min(s.ord) - 1)::int
FROM "Destination" d
CROSS JOIN LATERAL unnest(d."bestSeasons") WITH ORDINALITY AS s(value, ord)
GROUP BY d."id", s.value;

INSERT INTO "DestinationAlternateName" ("destinationId", "name", "position")
SELECT d."id", n.value, (min(n.ord) - 1)::int
FROM "Destination" d
CROSS JOIN LATERAL unnest(d."alternateNames") WITH ORDINALITY AS n(value, ord)
WHERE btrim(n.value) <> ''
GROUP BY d."id", n.value;

INSERT INTO "DestinationVerification" ("destinationId", "field")
SELECT DISTINCT d."id", v.value
FROM "Destination" d
CROSS JOIN LATERAL unnest(d."verify") AS v(value);

-- Reference links first, then the old photo source (label + link) after them.
INSERT INTO "DestinationSource" ("id", "destinationId", "url", "label", "position")
SELECT gen_random_uuid()::text, d."id", s.value, NULL, (s.ord - 1)::int
FROM "Destination" d
CROSS JOIN LATERAL unnest(d."sources") WITH ORDINALITY AS s(value, ord);

INSERT INTO "DestinationSource" ("id", "destinationId", "url", "label", "position")
SELECT gen_random_uuid()::text, d."id", d."mediaPhotoUrl", d."mediaPhoto",
       coalesce(array_length(d."sources", 1), 0)
FROM "Destination" d
WHERE d."mediaPhotoUrl" IS NOT NULL OR d."mediaPhoto" IS NOT NULL;

ALTER TABLE "Destination" ADD COLUMN "photoCredit" TEXT;
UPDATE "Destination" SET "photoCredit" = "mediaCredit";

-- ── 4. Constraints, then drop the old columns ───────────────────────────

-- AddForeignKey
ALTER TABLE "Destination" ADD CONSTRAINT "Destination_budget_fkey" FOREIGN KEY ("budget") REFERENCES "BudgetLevel"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationCategory" ADD CONSTRAINT "DestinationCategory_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationCategory" ADD CONSTRAINT "DestinationCategory_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationInterest" ADD CONSTRAINT "DestinationInterest_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationInterest" ADD CONSTRAINT "DestinationInterest_tagName_fkey" FOREIGN KEY ("tagName") REFERENCES "InterestTag"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationSeason" ADD CONSTRAINT "DestinationSeason_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationSeason" ADD CONSTRAINT "DestinationSeason_seasonName_fkey" FOREIGN KEY ("seasonName") REFERENCES "Season"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationAlternateName" ADD CONSTRAINT "DestinationAlternateName_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationSource" ADD CONSTRAINT "DestinationSource_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationVerification" ADD CONSTRAINT "DestinationVerification_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Destination" DROP COLUMN "alternateNames",
DROP COLUMN "bestSeasons",
DROP COLUMN "category",
DROP COLUMN "interestTags",
DROP COLUMN "mediaCredit",
DROP COLUMN "mediaPhoto",
DROP COLUMN "mediaPhotoUrl",
DROP COLUMN "sources",
DROP COLUMN "verify";

-- AlterTable
ALTER TABLE "DestinationImage" DROP COLUMN "isCover";

DROP TABLE category_known;
DROP TABLE category_map;

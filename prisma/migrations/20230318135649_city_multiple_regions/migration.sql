/*
  Warnings:

  - You are about to drop the column `regionId` on the `City` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_CityToRegion" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CityToRegion_A_fkey" FOREIGN KEY ("A") REFERENCES "City" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CityToRegion_B_fkey" FOREIGN KEY ("B") REFERENCES "Region" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_City" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "latitude" DECIMAL NOT NULL,
    "longitude" DECIMAL NOT NULL
);
INSERT INTO "new_City" ("id", "latitude", "longitude", "name") SELECT "id", "latitude", "longitude", "name" FROM "City";
DROP TABLE "City";
ALTER TABLE "new_City" RENAME TO "City";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_CityToRegion_AB_unique" ON "_CityToRegion"("A", "B");

-- CreateIndex
CREATE INDEX "_CityToRegion_B_index" ON "_CityToRegion"("B");

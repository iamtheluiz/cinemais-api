/*
  Warnings:

  - Added the required column `latitude` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Region` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Region` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_City" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "latitude" DECIMAL NOT NULL,
    "longitude" DECIMAL NOT NULL,
    "regionId" INTEGER,
    CONSTRAINT "City_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_City" ("id", "name", "regionId") SELECT "id", "name", "regionId" FROM "City";
DROP TABLE "City";
ALTER TABLE "new_City" RENAME TO "City";
CREATE TABLE "new_Region" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "latitude" DECIMAL NOT NULL,
    "longitude" DECIMAL NOT NULL
);
INSERT INTO "new_Region" ("id", "name") SELECT "id", "name" FROM "Region";
DROP TABLE "Region";
ALTER TABLE "new_Region" RENAME TO "Region";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

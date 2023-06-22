-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "latitude" DECIMAL NOT NULL DEFAULT -23.9781355,
    "longitude" DECIMAL NOT NULL DEFAULT -46.308471,
    "cityId" INTEGER NOT NULL,
    CONSTRAINT "Cine_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cine" ("cityId", "id", "logo", "name") SELECT "cityId", "id", "logo", "name" FROM "Cine";
DROP TABLE "Cine";
ALTER TABLE "new_Cine" RENAME TO "Cine";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "room" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "movieId" INTEGER NOT NULL,
    "cineId" INTEGER NOT NULL,
    CONSTRAINT "Session_cineId_fkey" FOREIGN KEY ("cineId") REFERENCES "Cine" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Session_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("cineId", "endDate", "id", "movieId", "room", "startDate") SELECT "cineId", "endDate", "id", "movieId", "room", "startDate" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

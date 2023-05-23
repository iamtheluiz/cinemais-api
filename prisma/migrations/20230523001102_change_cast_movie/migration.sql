/*
  Warnings:

  - You are about to drop the `MovieCast` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MovieCast";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_CastToMovie" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CastToMovie_A_fkey" FOREIGN KEY ("A") REFERENCES "Cast" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CastToMovie_B_fkey" FOREIGN KEY ("B") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_CastToMovie_AB_unique" ON "_CastToMovie"("A", "B");

-- CreateIndex
CREATE INDEX "_CastToMovie_B_index" ON "_CastToMovie"("B");

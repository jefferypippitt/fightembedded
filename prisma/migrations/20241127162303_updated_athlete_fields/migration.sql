/*
  Warnings:

  - You are about to drop the column `koRate` on the `Athlete` table. All the data in the column will be lost.
  - You are about to drop the column `submissionRate` on the `Athlete` table. All the data in the column will be lost.
  - Added the required column `winsByKo` to the `Athlete` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winsBySubmission` to the `Athlete` table without a default value. This is not possible if the table is not empty.
  - Made the column `poundForPoundRank` on table `Athlete` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rank` on table `Athlete` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Athlete" DROP COLUMN "koRate",
DROP COLUMN "submissionRate",
ADD COLUMN     "winsByKo" INTEGER NOT NULL,
ADD COLUMN     "winsBySubmission" INTEGER NOT NULL,
ALTER COLUMN "poundForPoundRank" SET NOT NULL,
ALTER COLUMN "rank" SET NOT NULL;

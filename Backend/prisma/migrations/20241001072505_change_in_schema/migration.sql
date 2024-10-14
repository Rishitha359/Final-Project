/*
  Warnings:

  - You are about to drop the column `Avg_rating` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `Score` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "Avg_rating";

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "feedback";

/*
  Warnings:

  - You are about to drop the `Feedback` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `discipline` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `punctuality` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remarks` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `standards` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_E_id_fkey";

-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "discipline" INTEGER NOT NULL,
ADD COLUMN     "punctuality" INTEGER NOT NULL,
ADD COLUMN     "remarks" TEXT NOT NULL,
ADD COLUMN     "standards" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Feedback";

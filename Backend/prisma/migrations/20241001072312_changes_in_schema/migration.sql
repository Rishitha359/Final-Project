/*
  Warnings:

  - Added the required column `T_id` to the `Training` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Training" ADD COLUMN     "T_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Training" ADD CONSTRAINT "Training_T_id_fkey" FOREIGN KEY ("T_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

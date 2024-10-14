/*
  Warnings:

  - A unique constraint covering the columns `[T_id,E_id]` on the table `Score` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Gender` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "Gender" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Score_T_id_E_id_key" ON "Score"("T_id", "E_id");

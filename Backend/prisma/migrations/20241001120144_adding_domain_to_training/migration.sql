/*
  Warnings:

  - Added the required column `domain` to the `Training` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Training" ADD COLUMN     "domain" TEXT NOT NULL;

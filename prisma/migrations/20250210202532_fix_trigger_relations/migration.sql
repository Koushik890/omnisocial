/*
  Warnings:

  - Made the column `status` on table `Trigger` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Trigger" ALTER COLUMN "status" SET NOT NULL;

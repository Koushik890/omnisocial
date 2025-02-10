/*
  Warnings:

  - Added the required column `updatedAt` to the `Automation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AutomationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Automation" ADD COLUMN     "config" JSONB;

-- Add status column with default
ALTER TABLE "Automation" ADD COLUMN     "status" "AutomationStatus" NOT NULL DEFAULT 'DRAFT';

-- Add updatedAt column with default value for existing records
ALTER TABLE "Automation" ADD COLUMN     "updatedAt" TIMESTAMP(3);
UPDATE "Automation" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL;
ALTER TABLE "Automation" ALTER COLUMN "updatedAt" SET NOT NULL;

/*
  Warnings:

  - The `status` column on the `Trigger` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TriggerStatus" AS ENUM ('UNCONFIGURED', 'PARTIAL', 'COMPLETE');

-- AlterTable
ALTER TABLE "Trigger" DROP COLUMN "status",
ADD COLUMN     "status" "TriggerStatus" NOT NULL DEFAULT 'UNCONFIGURED';

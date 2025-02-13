/*
  Warnings:

  - The `status` column on the `Trigger` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Trigger" DROP COLUMN "status",
ADD COLUMN     "status" TEXT DEFAULT 'unconfigured';

-- DropEnum
DROP TYPE "TriggerStatus";

/*
  Warnings:

  - You are about to drop the column `is_admin` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `VerificationToken` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `InductionStage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "current_stage_id" INTEGER;

-- AlterTable
ALTER TABLE "InductionStage" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "is_admin";

-- AlterTable
ALTER TABLE "VerificationToken" DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Application_current_stage_id_idx" ON "Application"("current_stage_id");

-- CreateIndex
CREATE INDEX "ApplicationStageProgress_status_idx" ON "ApplicationStageProgress"("status");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_current_stage_id_fkey" FOREIGN KEY ("current_stage_id") REFERENCES "InductionStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

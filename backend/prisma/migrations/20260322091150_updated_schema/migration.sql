/*
  Warnings:

  - The `status` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `president` on the `Club` table. All the data in the column will be lost.
  - The `role` column on the `Membership` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updated_at` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Club` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `answer` on the `FormAnswer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updated_at` to the `Induction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('PRESIDENT', 'VICE_PRESIDENT', 'COORDINATOR', 'MEMBER');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "StageStatus" AS ENUM ('PENDING', 'PASSED', 'FAILED');

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_induction_id_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_president_fkey";

-- DropForeignKey
ALTER TABLE "Form" DROP CONSTRAINT "Form_induction_id_fkey";

-- DropForeignKey
ALTER TABLE "FormAnswer" DROP CONSTRAINT "FormAnswer_question_id_fkey";

-- DropForeignKey
ALTER TABLE "FormAnswer" DROP CONSTRAINT "FormAnswer_response_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestion" DROP CONSTRAINT "FormQuestion_form_id_fkey";

-- DropForeignKey
ALTER TABLE "FormResponse" DROP CONSTRAINT "FormResponse_application_id_fkey";

-- DropForeignKey
ALTER TABLE "FormResponse" DROP CONSTRAINT "FormResponse_form_id_fkey";

-- DropForeignKey
ALTER TABLE "Induction" DROP CONSTRAINT "Induction_club_id_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_club_id_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_user_id_fkey";

-- DropIndex
DROP INDEX "VerificationToken_userId_key";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Club" DROP COLUMN "president",
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "FormAnswer" DROP COLUMN "answer",
ADD COLUMN     "answer" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "FormQuestion" ALTER COLUMN "is_required" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Induction" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "role",
ADD COLUMN     "role" "MemberRole" NOT NULL DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "VerificationToken" ADD COLUMN     "type" "TokenType" NOT NULL DEFAULT 'EMAIL_VERIFICATION';

-- CreateTable
CREATE TABLE "InductionStage" (
    "id" SERIAL NOT NULL,
    "induction_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InductionStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationStageProgress" (
    "id" SERIAL NOT NULL,
    "application_id" INTEGER NOT NULL,
    "stage_id" INTEGER NOT NULL,
    "status" "StageStatus" NOT NULL DEFAULT 'PENDING',
    "score" INTEGER,
    "notes" TEXT,
    "reviewed_by" INTEGER,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationStageProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InductionStage_induction_id_idx" ON "InductionStage"("induction_id");

-- CreateIndex
CREATE UNIQUE INDEX "InductionStage_induction_id_order_index_key" ON "InductionStage"("induction_id", "order_index");

-- CreateIndex
CREATE INDEX "ApplicationStageProgress_application_id_idx" ON "ApplicationStageProgress"("application_id");

-- CreateIndex
CREATE INDEX "ApplicationStageProgress_stage_id_idx" ON "ApplicationStageProgress"("stage_id");

-- CreateIndex
CREATE INDEX "ApplicationStageProgress_reviewed_by_idx" ON "ApplicationStageProgress"("reviewed_by");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationStageProgress_application_id_stage_id_key" ON "ApplicationStageProgress"("application_id", "stage_id");

-- CreateIndex
CREATE INDEX "Application_user_id_idx" ON "Application"("user_id");

-- CreateIndex
CREATE INDEX "Application_induction_id_idx" ON "Application"("induction_id");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE INDEX "Form_induction_id_idx" ON "Form"("induction_id");

-- CreateIndex
CREATE INDEX "FormAnswer_response_id_idx" ON "FormAnswer"("response_id");

-- CreateIndex
CREATE INDEX "FormAnswer_question_id_idx" ON "FormAnswer"("question_id");

-- CreateIndex
CREATE INDEX "FormQuestion_form_id_idx" ON "FormQuestion"("form_id");

-- CreateIndex
CREATE INDEX "FormQuestion_order_index_idx" ON "FormQuestion"("order_index");

-- CreateIndex
CREATE INDEX "FormResponse_form_id_idx" ON "FormResponse"("form_id");

-- CreateIndex
CREATE INDEX "FormResponse_application_id_idx" ON "FormResponse"("application_id");

-- CreateIndex
CREATE INDEX "Induction_club_id_idx" ON "Induction"("club_id");

-- CreateIndex
CREATE INDEX "Membership_user_id_idx" ON "Membership"("user_id");

-- CreateIndex
CREATE INDEX "Membership_club_id_idx" ON "Membership"("club_id");

-- CreateIndex
CREATE INDEX "VerificationToken_userId_idx" ON "VerificationToken"("userId");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Induction" ADD CONSTRAINT "Induction_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InductionStage" ADD CONSTRAINT "InductionStage_induction_id_fkey" FOREIGN KEY ("induction_id") REFERENCES "Induction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_induction_id_fkey" FOREIGN KEY ("induction_id") REFERENCES "Induction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationStageProgress" ADD CONSTRAINT "ApplicationStageProgress_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationStageProgress" ADD CONSTRAINT "ApplicationStageProgress_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "InductionStage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationStageProgress" ADD CONSTRAINT "ApplicationStageProgress_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_induction_id_fkey" FOREIGN KEY ("induction_id") REFERENCES "Induction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponse" ADD CONSTRAINT "FormResponse_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponse" ADD CONSTRAINT "FormResponse_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAnswer" ADD CONSTRAINT "FormAnswer_response_id_fkey" FOREIGN KEY ("response_id") REFERENCES "FormResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAnswer" ADD CONSTRAINT "FormAnswer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "FormQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

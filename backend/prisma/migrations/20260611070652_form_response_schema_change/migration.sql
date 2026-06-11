/*
  Warnings:

  - A unique constraint covering the columns `[application_id]` on the table `FormResponse` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[form_id,user_id]` on the table `FormResponse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `FormResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FormResponse` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "FormResponse_application_id_idx";

-- DropIndex
DROP INDEX "FormResponse_form_id_application_id_key";

-- AlterTable
ALTER TABLE "FormResponse" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "application_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FormResponse_application_id_key" ON "FormResponse"("application_id");

-- CreateIndex
CREATE INDEX "FormResponse_user_id_idx" ON "FormResponse"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "FormResponse_form_id_user_id_key" ON "FormResponse"("form_id", "user_id");

-- AddForeignKey
ALTER TABLE "FormResponse" ADD CONSTRAINT "FormResponse_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

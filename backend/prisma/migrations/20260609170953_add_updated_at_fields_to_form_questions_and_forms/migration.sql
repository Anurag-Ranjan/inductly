/*
  Warnings:

  - Added the required column `updated_at` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `FormQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "isPublished" SET DEFAULT false;

-- AlterTable
ALTER TABLE "FormQuestion" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

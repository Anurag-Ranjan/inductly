/*
  Warnings:

  - Changed the type of `question_type` on the `FormQuestion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TEXT', 'TEXTAREA', 'SELECT', 'MULTI_SELECT', 'CHECKBOX', 'FILE');

-- AlterTable
ALTER TABLE "FormQuestion" DROP COLUMN "question_type",
ADD COLUMN     "question_type" "QuestionType" NOT NULL;
